import type React from 'react'
import type { Node, Edge } from 'reactflow'
import type { FeatureNodeData } from '../../cedar/FeatureNode'

import { useRoadmapState } from './state'
import { useRoadmapMentions } from './mentions'
import { useRoadmapContext } from './context'

// [STEP 3]: For sake of example, we've encapsulated all the Cedar-OS functionality in a single hook.
// Let's explore a few basic Cedar features.
export function useCedarRoadmap(
    nodes: Array<Node<FeatureNodeData>>,
    setNodes: React.Dispatch<
        React.SetStateAction<Array<Node<FeatureNodeData>>>
    >,
    edges: Edge[],
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
    useRoadmapState(nodes, setNodes, edges, setEdges)

    useRoadmapMentions()

    useRoadmapContext()
}
