'use client';

import { Database, Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface IndexingPanelProps {
  jwt: string;
}

interface IndexingResult {
  success: boolean;
  indexed: number;
  failed: number;
  documents: Array<{
    docId: string;
    status: string;
    chunks?: number;
    error?: string;
  }>;
}

export default function IndexingPanel({ jwt }: IndexingPanelProps) {
  const [isIndexing, setIsIndexing] = useState(false);
  const [result, setResult] = useState<IndexingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIndex = useCallback(async () => {
    setIsIndexing(true);
    setResult(null);
    setError(null);

    try {
      const response: Response = await fetch('/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start indexing');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsIndexing(false);
    }
  }, [jwt]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Document Indexing</CardTitle>
              <CardDescription>Index corpus documents for RAG</CardDescription>
            </div>
          </div>

          <Button
            onClick={handleIndex}
            disabled={isIndexing}
            className="flex items-center space-x-2"
          >
            {isIndexing ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Indexing...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Start Indexing</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">Error: {error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Indexing completed</span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {result.indexed} indexed, {result.failed} failed
            </div>
          </div>

          {result.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Document Results:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      {doc.status === 'success' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                      <span className="text-foreground">{doc.docId}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {doc.status === 'success' && doc.chunks ? (
                        `${doc.chunks} chunks`
                      ) : (doc.error !== null) ? (
                        <span className="text-destructive" title={doc.error}>
                          Failed
                        </span>
                      ) : (
                        doc.status
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p>This will index all documents in the corpus folder with appropriate security classifications:</p>
            <ul className="mt-1 ml-4 list-disc">
              <li>HR/Confidential files: Admin access only</li>
              <li>Finance/Policy files: Manager+ access</li>
              <li>Other files: All employee access</li>
            </ul>
          </div>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
