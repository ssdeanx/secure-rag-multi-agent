// filepath: cedar/components/smart-relationship-visualizer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import { useCedarState } from 'cedar-os';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Link, AlertTriangle, CheckCircle, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import type { FeatureNodeData } from './FeatureNode';

/**
 * Zod schema for roadmap item structure
 */
const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  nodeType: z.string().optional(),
  upvotes: z.number().optional(),
});

/**
 * Zod schema for relationship structure
 */
const RelationshipSchema = z.object({
  sourceId: z.string(),
  targetId: z.string(),
  type: z.enum(['depends_on', 'blocks', 'enables', 'related']),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

/**
 * Zod schema for analysis result
 */
const AnalysisResultSchema = z.object({
  relationships: z.array(RelationshipSchema),
  insights: z.array(z.string()),
});

/**
 * Type definitions derived from Zod schemas for type safety
 */
type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
type Relationship = z.infer<typeof RelationshipSchema>;
type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

/**
 * Props for SmartRelationshipVisualizer component
 */
interface SmartRelationshipVisualizerProps {
  onClose?: () => void;
  isVisible?: boolean;
}

/**
 * Smart Relationship Visualizer Component
 *
 * Displays AI-analyzed relationships between selected roadmap items with confidence scores.
 * Integrates with Cedar OS state management and activates when nodes are selected.
 * Uses API route for Mastra workflow orchestration following repository security patterns.
 *
 * @param onClose - Optional callback to close the visualizer
 * @param isVisible - Whether the visualizer should be visible (defaults to true when nodes selected)
 */
export function SmartRelationshipVisualizer({
  onClose,
  isVisible = true
}: SmartRelationshipVisualizerProps) {
  const [selectedNodes] = useCedarState<Array<Node<FeatureNodeData>>>({
    key: 'selectedNodes',
    initialValue: [],
    description: 'Selected features in the roadmap',
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyzes relationships for selected nodes via API route
   */
  const analyzeRelationships = async (): Promise<void> => {
    if (!selectedNodes || selectedNodes.length === 0) {
      setAnalysis(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log analysis start for observability
      console.log('Starting roadmap relationships analysis', {
        selectedNodeCount: selectedNodes.length,
        nodeIds: selectedNodes.map((n: Node<FeatureNodeData>) => n.id)
      });

      // Transform selected nodes to roadmap items format
      const roadmapItems: RoadmapItem[] = selectedNodes.map((node: Node<FeatureNodeData>) => ({
        id: node.id,
        title: node.data.title,
        description: node.data.description,
        status: node.data.status,
        nodeType: node.data.nodeType,
        upvotes: node.data.upvotes,
      }));

      // Get JWT token from environment or auth context
      // Following repository pattern: JWT in request body, not headers
      const jwt = process.env.JWT_TOKEN ?? ''; // In production, get from auth context

      // Call API route for Mastra workflow orchestration
      const response = await fetch('/api/roadmap/relationships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadmapItems,
          jwt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Parse and validate API response
      const result: AnalysisResult = await response.json();
      const parsedResult: AnalysisResult = AnalysisResultSchema.parse(result);
      setAnalysis(parsedResult);

      // Log successful completion
      console.log('Roadmap relationships analysis completed', {
        relationshipCount: parsedResult.relationships.length,
        insightCount: parsedResult.insights.length
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Roadmap relationships analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Analyze relationships when selected nodes change
  useEffect(() => {
    analyzeRelationships();
  }, [selectedNodes]);

  /**
   * Returns the appropriate icon for relationship type
   */
  const getRelationshipIcon = (type: Relationship['type']): React.ReactNode => {
    switch (type) {
      case 'depends_on':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'blocks':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'enables':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'related':
        return <Link className="h-4 w-4 text-purple-500" />;
      default:
        return <Link className="h-4 w-4 text-gray-500" />;
    }
  };

  /**
   * Returns color classes for relationship type badges
   */
  const getRelationshipColor = (type: Relationship['type']): string => {
    switch (type) {
      case 'depends_on':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocks':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'enables':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'related':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Don't render if no nodes selected or explicitly hidden
  if (!isVisible || !selectedNodes || selectedNodes.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <Card className="w-96 absolute top-4 right-4 z-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Analyzing Relationships...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-96 absolute top-4 right-4 z-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
          <Button
            onClick={analyzeRelationships}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-96 absolute top-4 right-4 z-50 max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Relationships ({selectedNodes.length} selected)
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis?.insights && analysis.insights.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Key Insights</h4>
            <ul className="space-y-1">
              {analysis.insights.slice(0, 3).map((insight: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm mb-2">Relationships</h4>
          <div className="space-y-2">
            {analysis?.relationships && analysis.relationships.length > 0 ? (
              analysis.relationships.map((rel: Relationship, index: number) => {
                const sourceNode = selectedNodes.find((node: Node<FeatureNodeData>) => node.id === rel.sourceId);
                const targetNode = selectedNodes.find((node: Node<FeatureNodeData>) => node.id === rel.targetId);

                return (
                  <div key={index} className="flex items-center gap-2 p-2 rounded border bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium truncate">{sourceNode?.data.title}</span>
                        {getRelationshipIcon(rel.type)}
                        <span className="font-medium truncate">{targetNode?.data.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{rel.reason}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getRelationshipColor(rel.type))}
                    >
                      {(rel.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No relationships found</p>
            )}
          </div>
        </div>

        <Button
          onClick={analyzeRelationships}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Refresh Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
