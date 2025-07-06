import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface KubernetesState {
  nodes: Node[];
  edges: Edge[];
  simulationStatus: 'running' | 'stopped' | 'error';
  addNode: (node: Node) => void;
  updateNodes: (nodes: Node[]) => void;
  addEdgeToStore: (edge: Edge) => void;
  updateEdges: (edges: Edge[]) => void;
  removeNode: (nodeId: string) => void;
  updateFromYaml: (yaml: string) => void;
  clearCanvas: () => void;
  setSimulationStatus: (status: 'running' | 'stopped' | 'error') => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
}

export const useKubernetesStore = create<KubernetesState>((set, get) => ({
  nodes: [],
  edges: [],
  simulationStatus: 'stopped',

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      simulationStatus: 'running'
    }));
  },

  updateNodes: (nodes) => {
    set({ nodes });
  },

  addEdgeToStore: (edge) => {
    set((state) => ({
      edges: [...(state.edges || []), edge]
    }));
  },

  updateEdges: (edges) => {
    set({ edges });
  },

  removeNode: (nodeId) => {
    set((state) => {
      const nodeToRemove = state.nodes.find(node => node.id === nodeId);

      // If removing a deployment, mark connected pods as orphaned
      if (nodeToRemove?.data.componentType === 'deployment') {
        const connectedPods = state.nodes.filter(node => {
          if (node.data.componentType !== 'pod') return false;
          return state.edges.some(edge =>
            (edge.source === nodeId && edge.target === node.id) ||
            (edge.target === nodeId && edge.source === node.id)
          );
        });

        // Update connected pods to show orphaned status
        const updatedNodes = state.nodes.map(node => {
          if (connectedPods.some(pod => pod.id === node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'error',
                orphaned: true
              }
            };
          }
          return node;
        }).filter(node => node.id !== nodeId);

        return {
          nodes: updatedNodes,
          edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
        };
      }

      // Normal removal for other components
      return {
        nodes: state.nodes.filter(node => node.id !== nodeId),
        edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
      };
    });
  },

  updateFromYaml: (yaml) => {
    try {
      // Parse YAML and convert to nodes/edges
      const yamlDocs = yaml.split('---').filter(doc => doc.trim());
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      yamlDocs.forEach((doc, index) => {
        try {
          const parsed = require('js-yaml').load(doc);
          if (parsed && parsed.kind) {
            const nodeId = `${parsed.kind.toLowerCase()}-${index + 1}`;
            const node: Node = {
              id: nodeId,
              type: 'kubernetes',
              position: { x: 100 + (index * 200), y: 100 + (index * 100) },
              data: {
                componentType: parsed.kind.toLowerCase(),
                label: parsed.metadata?.name || `${parsed.kind}-${index + 1}`,
                status: 'running',
                config: parsed
              }
            };
            newNodes.push(node);
          }
        } catch (error) {
          console.warn('Failed to parse YAML document:', error);
        }
      });

      // Update the store with new nodes
      set({
        nodes: newNodes,
        edges: newEdges,
        simulationStatus: newNodes.length > 0 ? 'running' : 'stopped'
      });

    } catch (error) {
      console.error('Failed to update from YAML:', error);
      throw new Error('Invalid YAML format');
    }
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      simulationStatus: 'stopped'
    });
  },

  setSimulationStatus: (status) => {
    set({ simulationStatus: status });
  },

  updateNodeConfig: (nodeId: string, config: any) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      )
    }));
  },
}));