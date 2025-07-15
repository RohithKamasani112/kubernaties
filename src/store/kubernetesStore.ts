import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import * as yaml from 'js-yaml';

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

  updateFromYaml: (yamlContent) => {
    try {
      // Parse YAML and convert to nodes/edges
      const yamlDocs = yamlContent.split('---').filter(doc => doc.trim());
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const parsedObjects: any[] = [];

      // Mapping from Kubernetes kinds to component types
      const kindToComponentType: Record<string, string> = {
        'Pod': 'pod',
        'Deployment': 'deployment',
        'Service': 'service',
        'Ingress': 'ingress',
        'ConfigMap': 'configmap',
        'Secret': 'secret',
        'PersistentVolumeClaim': 'pvc',
        'PersistentVolume': 'persistentvolume',
        'StorageClass': 'storageclass',
        'StatefulSet': 'statefulset',
        'DaemonSet': 'daemonset',
        'Job': 'job',
        'CronJob': 'cronjob',
        'ReplicaSet': 'replicaset',
        'ServiceAccount': 'serviceaccount',
        'Role': 'role',
        'RoleBinding': 'rolebinding',
        'ClusterRole': 'clusterrole',
        'ClusterRoleBinding': 'clusterrolebinding',
        'NetworkPolicy': 'networkpolicy',
        'HorizontalPodAutoscaler': 'hpa',
        'VerticalPodAutoscaler': 'vpa',
        'Namespace': 'namespace'
      };

      const getComponentType = (kind: string) => kindToComponentType[kind] || kind.toLowerCase();

      // First pass: Create all nodes
      yamlDocs.forEach((doc, index) => {
        try {
          const parsed = yaml.load(doc);
          if (parsed && parsed.kind) {
            parsedObjects.push(parsed);
            const componentType = getComponentType(parsed.kind);
            const nodeId = `${componentType}-${parsed.metadata?.name || (index + 1)}`;

            // Calculate position in a grid layout
            const gridCols = 3;
            const nodeWidth = 250;
            const nodeHeight = 180;
            const x = 100 + (index % gridCols) * nodeWidth;
            const y = 100 + Math.floor(index / gridCols) * nodeHeight;

            const node: Node = {
              id: nodeId,
              type: 'kubernetes',
              position: { x, y },
              draggable: true,
              selectable: true,
              data: {
                componentType: componentType,
                label: parsed.metadata?.name || `${parsed.kind}-${index + 1}`,
                status: 'running',
                config: {
                  name: parsed.metadata?.name || `${parsed.kind.toLowerCase()}-${index + 1}`,
                  ...parsed
                }
              }
            };
            newNodes.push(node);
          }
        } catch (error) {
          console.warn('Failed to parse YAML document:', error);
        }
      });

      // Second pass: Create edges based on Kubernetes relationships
      parsedObjects.forEach((obj, objIndex) => {
        const sourceNodeId = `${getComponentType(obj.kind)}-${obj.metadata?.name || (objIndex + 1)}`;

        // Service to Pod/Deployment connections
        if (obj.kind === 'Service' && obj.spec?.selector) {
          const selector = obj.spec.selector;
          parsedObjects.forEach((targetObj, targetIndex) => {
            if ((targetObj.kind === 'Pod' || targetObj.kind === 'Deployment') && targetObj.metadata?.labels) {
              // Check if labels match selector
              const labelsMatch = Object.entries(selector).every(([key, value]) =>
                targetObj.metadata.labels[key] === value
              );
              if (labelsMatch) {
                const targetNodeId = `${getComponentType(targetObj.kind)}-${targetObj.metadata?.name || (targetIndex + 1)}`;
                newEdges.push({
                  id: `edge-${sourceNodeId}-${targetNodeId}`,
                  source: sourceNodeId,
                  target: targetNodeId,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                  markerEnd: { type: 'arrowclosed' as any, color: '#3b82f6' }
                });
              }
            }
          });
        }

        // Ingress to Service connections
        if (obj.kind === 'Ingress' && obj.spec?.rules) {
          obj.spec.rules.forEach((rule: any) => {
            if (rule.http?.paths) {
              rule.http.paths.forEach((path: any) => {
                if (path.backend?.service?.name) {
                  const serviceName = path.backend.service.name;
                  const targetNodeId = `service-${serviceName}`;
                  if (newNodes.some(n => n.id === targetNodeId)) {
                    newEdges.push({
                      id: `edge-${sourceNodeId}-${targetNodeId}`,
                      source: sourceNodeId,
                      target: targetNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#8b5cf6', strokeWidth: 2 },
                      markerEnd: { type: 'arrowclosed' as any, color: '#8b5cf6' }
                    });
                  }
                }
              });
            }
          });
        }

        // Deployment to Pod connections (if both exist)
        if (obj.kind === 'Deployment' && obj.spec?.template?.metadata?.labels) {
          const deploymentLabels = obj.spec.template.metadata.labels;
          parsedObjects.forEach((targetObj, targetIndex) => {
            if (targetObj.kind === 'Pod' && targetObj.metadata?.labels) {
              const labelsMatch = Object.entries(deploymentLabels).every(([key, value]) =>
                targetObj.metadata.labels[key] === value
              );
              if (labelsMatch) {
                const targetNodeId = `${getComponentType(targetObj.kind)}-${targetObj.metadata?.name || (targetIndex + 1)}`;
                newEdges.push({
                  id: `edge-${sourceNodeId}-${targetNodeId}`,
                  source: sourceNodeId,
                  target: targetNodeId,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#10b981', strokeWidth: 2 },
                  markerEnd: { type: 'arrowclosed' as any, color: '#10b981' }
                });
              }
            }
          });
        }

        // ConfigMap to Deployment/Pod connections
        if (obj.kind === 'Deployment' || obj.kind === 'Pod') {
          const containers = obj.kind === 'Deployment'
            ? obj.spec?.template?.spec?.containers || []
            : obj.spec?.containers || [];

          containers.forEach((container: any) => {
            if (container.envFrom) {
              container.envFrom.forEach((envFrom: any) => {
                if (envFrom.configMapRef?.name) {
                  const configMapNodeId = `configmap-${envFrom.configMapRef.name}`;
                  if (newNodes.some(n => n.id === configMapNodeId)) {
                    newEdges.push({
                      id: `edge-${configMapNodeId}-${sourceNodeId}`,
                      source: configMapNodeId,
                      target: sourceNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#06b6d4', strokeWidth: 2 },
                      markerEnd: { type: 'arrowclosed' as any, color: '#06b6d4' }
                    });
                  }
                }
              });
            }
          });
        }

        // PVC to Deployment/Pod connections
        if (obj.kind === 'Deployment' || obj.kind === 'Pod') {
          const volumes = obj.kind === 'Deployment'
            ? obj.spec?.template?.spec?.volumes || []
            : obj.spec?.volumes || [];

          volumes.forEach((volume: any) => {
            if (volume.persistentVolumeClaim?.claimName) {
              const pvcNodeId = `pvc-${volume.persistentVolumeClaim.claimName}`;
              if (newNodes.some(n => n.id === pvcNodeId)) {
                newEdges.push({
                  id: `edge-${pvcNodeId}-${sourceNodeId}`,
                  source: pvcNodeId,
                  target: sourceNodeId,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#8b5cf6', strokeWidth: 2 },
                  markerEnd: { type: 'arrowclosed' as any, color: '#8b5cf6' }
                });
              }
            }
          });
        }

        // PV to PVC connections
        if (obj.kind === 'PersistentVolumeClaim' && obj.spec?.storageClassName) {
          parsedObjects.forEach((targetObj, targetIndex) => {
            if (targetObj.kind === 'PersistentVolume' &&
                targetObj.spec?.storageClassName === obj.spec.storageClassName) {
              const pvNodeId = `persistentvolume-${targetObj.metadata?.name || (targetIndex + 1)}`;
              newEdges.push({
                id: `edge-${pvNodeId}-${sourceNodeId}`,
                source: pvNodeId,
                target: sourceNodeId,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#f59e0b', strokeWidth: 2 },
                markerEnd: { type: 'arrowclosed' as any, color: '#f59e0b' }
              });
            }
          });
        }

        // StorageClass to PVC connections
        if (obj.kind === 'PersistentVolumeClaim' && obj.spec?.storageClassName) {
          const storageClassNodeId = `storageclass-${obj.spec.storageClassName}`;
          if (newNodes.some(n => n.id === storageClassNodeId)) {
            newEdges.push({
              id: `edge-${storageClassNodeId}-${sourceNodeId}`,
              source: storageClassNodeId,
              target: sourceNodeId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#ef4444', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed' as any, color: '#ef4444' }
            });
          }
        }
      });

      // Update the store with new nodes and edges
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