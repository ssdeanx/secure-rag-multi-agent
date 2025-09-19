import React from 'react';
import { Node, Edge } from 'reactflow';
import { getCedarState, useStateBasedMentionProvider } from 'cedar-os';
import { ArrowRight, Box } from 'lucide-react';
import { FeatureNodeData } from '@/components/FeatureNode';

// [STEP 5]: To enable @ mentions, we use the useStateBasedMentionProvider hook.
// This allows the user to reference any state value from the chat using something like @nodeName
export function useRoadmapMentions() {
  // We use the useStateBasedMentionProvider hook to register a mention provider that references an existing state that we've registered.
  useStateBasedMentionProvider({
    stateKey: 'nodes',
    trigger: '@',
    labelField: (node: Node<FeatureNodeData>) => node.data.title,
    searchFields: ['data.description'], // The field of the state that the user can use to search after the @
    description: 'Product roadmap features and bugs',
    icon: React.createElement(Box, { size: 16 }),
    color: '#3B82F6', // Blue color for features
  });

  const nodes = getCedarState('nodes') as Node<FeatureNodeData>[];

  useStateBasedMentionProvider({
    stateKey: 'edges',
    trigger: '@',
    labelField: (edge: Edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      const sourceTitle = sourceNode?.data.title || edge.source;
      const targetTitle = targetNode?.data.title || edge.target;
      return `${sourceTitle} → ${targetTitle}`;
    },
    description: 'Feature relationships, dependencies, and connections',
    icon: React.createElement(ArrowRight, { size: 16 }),
    color: '#10B981', // Green color for relationships
  });
}
