import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import * as yaml from 'js-yaml';

interface KubernetesState {
  nodes: Node[];
  edges: Edge[];
  simulationStatus: 'running' | 'stopped' | 'error';
  isLoadingFromYaml: boolean;
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
  isLoadingFromYaml: false,

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
      // Set loading state to suppress notifications
      set({ isLoadingFromYaml: true });

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

            // Calculate position based on component type for better traffic flow
            const nodeWidth = 250;
            const nodeHeight = 180;
            let x = 300; // Default x position
            let y = 100 + (index * 50); // Stagger y positions

            // Position components in logical traffic flow order
            const nodeComponentType = getComponentType(parsed.kind);
            switch (nodeComponentType) {
              case 'namespace':
                x = 100; // Far left for namespaces
                y = 100 + (index * 100);
                break;
              case 'ingress':
                x = 300; // After user
                y = 200;
                break;
              case 'service':
                x = 550; // After ingress
                y = 200 + (index * 30);
                break;
              case 'deployment':
              case 'statefulset':
              case 'daemonset':
                x = 800; // After services
                y = 150 + (index * 40);
                break;
              case 'pod':
                x = 1050; // After deployments
                y = 200 + (index * 30);
                break;
              case 'configmap':
              case 'secret':
                x = 300; // Left side with configs
                y = 50 + (index * 60);
                break;
              case 'pvc':
              case 'persistentvolume':
                x = 1050; // Right side with storage
                y = 400 + (index * 40);
                break;
              case 'hpa':
                x = 800; // Near deployments
                y = 50;
                break;
              default:
                x = 300 + (index % 3) * nodeWidth;
                y = 100 + Math.floor(index / 3) * nodeHeight;
            }

            // Extract specific configuration based on component type
            let specificConfig: any = {
              name: parsed.metadata?.name || `${parsed.kind.toLowerCase()}-${index + 1}`,
              ...parsed
            };

            // For deployments, extract replicas and other important fields to top level
            if (componentType === 'deployment' && parsed.spec) {
              specificConfig = {
                ...specificConfig,
                replicas: parsed.spec.replicas || 3,
                image: parsed.spec.template?.spec?.containers?.[0]?.image || 'nginx:latest',
                port: parsed.spec.template?.spec?.containers?.[0]?.ports?.[0]?.containerPort || 80,
                labels: parsed.spec.template?.metadata?.labels || { app: 'my-app' }
              };
            }

            // For pods, extract image and port
            if (componentType === 'pod' && parsed.spec) {
              specificConfig = {
                ...specificConfig,
                image: parsed.spec.containers?.[0]?.image || 'nginx:latest',
                port: parsed.spec.containers?.[0]?.ports?.[0]?.containerPort || 80,
                labels: parsed.metadata?.labels || { app: 'my-app' }
              };
            }

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
                config: specificConfig
              }
            };
            newNodes.push(node);
          }
        } catch (error) {
          console.warn('Failed to parse YAML document:', error);
        }
      });

      // Check if we need to add a User node for external traffic
      const hasIngress = parsedObjects.some(obj => obj.kind === 'Ingress');
      const hasLoadBalancerService = parsedObjects.some(obj =>
        obj.kind === 'Service' && obj.spec?.type === 'LoadBalancer'
      );
      const hasNodePortService = parsedObjects.some(obj =>
        obj.kind === 'Service' && obj.spec?.type === 'NodePort'
      );

      if (hasIngress || hasLoadBalancerService || hasNodePortService) {
        // Add User node for external traffic at the leftmost position
        const userNode: Node = {
          id: 'user-external',
          type: 'kubernetes',
          position: { x: 50, y: 200 },
          draggable: true,
          selectable: true,
          data: {
            componentType: 'user',
            label: 'External User',
            status: 'running',
            config: {
              name: 'external-user',
              description: 'External traffic source'
            }
          }
        };
        newNodes.push(userNode);
      }

      // Second pass: Create edges based on Kubernetes relationships
      parsedObjects.forEach((obj, objIndex) => {
        const sourceNodeId = `${getComponentType(obj.kind)}-${obj.metadata?.name || (objIndex + 1)}`;

        // User to Ingress connections
        if (obj.kind === 'Ingress' && newNodes.some(n => n.id === 'user-external')) {
          newEdges.push({
            id: `edge-user-external-${sourceNodeId}`,
            source: 'user-external',
            target: sourceNodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#dc2626', strokeWidth: 3 },
            markerEnd: { type: 'arrowclosed' as any, color: '#dc2626' },
            label: 'HTTPS/HTTP'
          });
        }

        // User to LoadBalancer/NodePort Service connections
        if (obj.kind === 'Service' &&
            (obj.spec?.type === 'LoadBalancer' || obj.spec?.type === 'NodePort') &&
            newNodes.some(n => n.id === 'user-external')) {
          newEdges.push({
            id: `edge-user-external-${sourceNodeId}`,
            source: 'user-external',
            target: sourceNodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#dc2626', strokeWidth: 3 },
            markerEnd: { type: 'arrowclosed' as any, color: '#dc2626' },
            label: obj.spec?.type === 'LoadBalancer' ? 'Load Balancer' : 'NodePort'
          });
        }

        // Service to Pod/Deployment connections
        if (obj.kind === 'Service' && obj.spec?.selector) {
          const selector = obj.spec.selector;
          parsedObjects.forEach((targetObj, targetIndex) => {
            let labelsToCheck = null;

            // For Deployment, check template labels
            if (targetObj.kind === 'Deployment' && targetObj.spec?.template?.metadata?.labels) {
              labelsToCheck = targetObj.spec.template.metadata.labels;
            }
            // For Pod, check metadata labels
            else if (targetObj.kind === 'Pod' && targetObj.metadata?.labels) {
              labelsToCheck = targetObj.metadata.labels;
            }

            if (labelsToCheck) {
              // Check if labels match selector
              const labelsMatch = Object.entries(selector).every(([key, value]) =>
                labelsToCheck[key] === value
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
                  markerEnd: { type: 'arrowclosed' as any, color: '#3b82f6' },
                  label: 'routes traffic'
                });
                console.log(`Created edge: ${sourceNodeId} -> ${targetNodeId}`);
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
                      markerEnd: { type: 'arrowclosed' as any, color: '#8b5cf6' },
                      label: 'forwards to'
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

        // ConfigMap and Secret to Deployment/Pod connections
        if (obj.kind === 'Deployment' || obj.kind === 'Pod') {
          const containers = obj.kind === 'Deployment'
            ? obj.spec?.template?.spec?.containers || []
            : obj.spec?.containers || [];

          containers.forEach((container: any) => {
            // Handle envFrom (ConfigMap and Secret references)
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
                if (envFrom.secretRef?.name) {
                  const secretNodeId = `secret-${envFrom.secretRef.name}`;
                  if (newNodes.some(n => n.id === secretNodeId)) {
                    newEdges.push({
                      id: `edge-${secretNodeId}-${sourceNodeId}`,
                      source: secretNodeId,
                      target: sourceNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#ef4444', strokeWidth: 2 },
                      markerEnd: { type: 'arrowclosed' as any, color: '#ef4444' }
                    });
                  }
                }
              });
            }

            // Handle individual env vars (ConfigMap and Secret references)
            if (container.env) {
              container.env.forEach((envVar: any) => {
                if (envVar.valueFrom?.configMapKeyRef?.name) {
                  const configMapNodeId = `configmap-${envVar.valueFrom.configMapKeyRef.name}`;
                  if (newNodes.some(n => n.id === configMapNodeId)) {
                    newEdges.push({
                      id: `edge-${configMapNodeId}-${sourceNodeId}-${envVar.name}`,
                      source: configMapNodeId,
                      target: sourceNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#06b6d4', strokeWidth: 2 },
                      markerEnd: { type: 'arrowclosed' as any, color: '#06b6d4' }
                    });
                  }
                }
                if (envVar.valueFrom?.secretKeyRef?.name) {
                  const secretNodeId = `secret-${envVar.valueFrom.secretKeyRef.name}`;
                  if (newNodes.some(n => n.id === secretNodeId)) {
                    newEdges.push({
                      id: `edge-${secretNodeId}-${sourceNodeId}-${envVar.name}`,
                      source: secretNodeId,
                      target: sourceNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#ef4444', strokeWidth: 2 },
                      markerEnd: { type: 'arrowclosed' as any, color: '#ef4444' }
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
                  markerEnd: { type: 'arrowclosed' as any, color: '#8b5cf6' },
                  label: 'mounts volume'
                });
              }
            }
          });
        }

        // Namespace to resource connections
        if (obj.metadata?.namespace) {
          const namespaceNodeId = `namespace-${obj.metadata.namespace}`;
          if (newNodes.some(n => n.id === namespaceNodeId) && sourceNodeId !== namespaceNodeId) {
            newEdges.push({
              id: `edge-${namespaceNodeId}-${sourceNodeId}`,
              source: namespaceNodeId,
              target: sourceNodeId,
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#9333ea', strokeWidth: 1, strokeDasharray: '5,5' },
              markerEnd: { type: 'arrowclosed' as any, color: '#9333ea' },
              label: 'contains'
            });
          }
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

        // HPA to Deployment connections
        if (obj.kind === 'HorizontalPodAutoscaler' && obj.spec?.scaleTargetRef) {
          const targetRef = obj.spec.scaleTargetRef;
          if (targetRef.kind === 'Deployment') {
            const deploymentNodeId = `deployment-${targetRef.name}`;
            if (newNodes.some(n => n.id === deploymentNodeId)) {
              newEdges.push({
                id: `edge-${sourceNodeId}-${deploymentNodeId}`,
                source: sourceNodeId,
                target: deploymentNodeId,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#f97316', strokeWidth: 2 },
                markerEnd: { type: 'arrowclosed' as any, color: '#f97316' }
              });
            }
          }
        }

        // StatefulSet to Service connections (for headless services)
        if (obj.kind === 'StatefulSet' && obj.spec?.serviceName) {
          const serviceNodeId = `service-${obj.spec.serviceName}`;
          if (newNodes.some(n => n.id === serviceNodeId)) {
            newEdges.push({
              id: `edge-${sourceNodeId}-${serviceNodeId}`,
              source: sourceNodeId,
              target: serviceNodeId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed' as any, color: '#8b5cf6' }
            });
          }
        }
      });

      // Update the store with new nodes and edges
      set({
        nodes: newNodes,
        edges: newEdges,
        simulationStatus: newNodes.length > 0 ? 'running' : 'stopped',
        isLoadingFromYaml: false
      });

    } catch (error) {
      console.error('Failed to update from YAML:', error);
      set({ isLoadingFromYaml: false });
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