import React from 'react';
import { Node, Edge } from 'reactflow';
import { FeatureNodeData } from '@/components/FeatureNode';

import { useRoadmapState } from './state';
import { useRoadmapMentions } from './mentions';
import { useRoadmapContext } from './context';

// [STEP 3]: For sake of example, we've encapsulated all the Cedar-OS functionality in a single hook.
// Let's explore a few basic Cedar features.
export function useCedarRoadmap(
  nodes: Node<FeatureNodeData>[],
  setNodes: React.Dispatch<React.SetStateAction<Node<FeatureNodeData>[]>>,
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
) {
  useRoadmapState(nodes, setNodes, edges, setEdges);

  useRoadmapMentions();

  useRoadmapContext();
}
