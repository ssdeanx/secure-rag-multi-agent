import type { Node, Edge } from 'reactflow';
import type { FeatureNodeData } from './FeatureNode';
import { useMemo } from 'react';

export const useRoadmapData = () => {
  const nodes = useMemo(() => {
    return initialNodes;
  }, []);

  const edges = useMemo(() => {
    return initialEdges;
  }, []);

  return { nodes, edges };
};

const initialNodes: Array<Node<FeatureNodeData>> = [
  {
    id: '1',
    type: 'featureNode',
    position: { x: 100, y: 100 },
    data: {
      title: 'User Authentication',
      description: 'Implement secure login and registration system',
      nodeType: 'feature',
      status: 'done',
      upvotes: 15,
      comments: [
        {
          id: '1',
          author: 'Product Manager',
          text: 'Critical for launch',
          timestamp: Date.now() - 86400000,
        },
      ],
    },
  },
  {
    id: '2',
    type: 'featureNode',
    position: { x: 400, y: 100 },
    data: {
      title: 'Dashboard UI',
      description: 'Create main user dashboard with analytics',
      nodeType: 'feature',
      status: 'in progress',
      upvotes: 8,
      comments: [],
    },
  },
  {
    id: '3',
    type: 'featureNode',
    position: { x: 700, y: 100 },
    data: {
      title: 'Dark Mode',
      description: 'Add dark theme toggle for better UX',
      nodeType: 'feature',
      status: 'planned',
      upvotes: 23,
      comments: [
        {
          id: '2',
          author: 'Designer',
          text: 'Users are requesting this',
          timestamp: Date.now() - 43200000,
        },
      ],
    },
  },
  {
    id: '4',
    type: 'featureNode',
    position: { x: 250, y: 300 },
    data: {
      title: 'Mobile Responsiveness',
      description: 'Optimize app for mobile devices',
      nodeType: 'feature',
      status: 'backlog',
      upvotes: 12,
      comments: [],
    },
  },
  {
    id: '5',
    type: 'featureNode',
    position: { x: 550, y: 300 },
    data: {
      title: 'Login Bug Fix',
      description: 'Fix issue with password reset emails',
      nodeType: 'bug',
      status: 'planned',
      upvotes: 5,
      comments: [
        {
          id: '3',
          author: 'QA Tester',
          text: 'Reproduced on staging',
          timestamp: Date.now() - 3600000,
        },
      ],
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'simplebezier',
    animated: true,
    label: 'depends on',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'simplebezier',
    animated: true,
    label: 'enhances',
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    type: 'simplebezier',
    animated: true,
    label: 'enables',
  },
];
