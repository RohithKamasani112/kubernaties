import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  MarkerType,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { useKubernetesStore } from '../../store/kubernetesStore';
import KubernetesNode from './nodes/KubernetesNode';
import TrafficAnimation from './TrafficAnimation';
import toast from 'react-hot-toast';

// Error Boundary Component
class PlaygroundErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Playground Error:', error, errorInfo);
    toast.error('Playground encountered an error. Refreshing...', {
      duration: 4000,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center bg-slate-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Playground Error
            </h2>
            <p className="text-slate-600 mb-4">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const nodeTypes = {
  kubernetes: KubernetesNode,
};

const KubernetesCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { nodes, edges, addNode, updateNodes, addEdgeToStore, updateEdges, removeNode } = useKubernetesStore();

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);
  const [previousNodes, setPreviousNodes] = useState<Node[]>(nodes);

  // Dynamic pod management based on deployment replicas
  const managePods = useCallback((deploymentNode: Node) => {
    try {
      if (!deploymentNode || !deploymentNode.id || !deploymentNode.data) {
        console.warn('Invalid deployment node provided to managePods');
        return;
      }

      const replicas = deploymentNode.data.config?.replicas || 3;
      const deploymentId = deploymentNode.id;

      // Ensure we have current state
      if (!flowNodes || !flowEdges) {
        console.warn('Flow state not ready for pod management');
        return;
      }

      // Find existing pods connected to this deployment
      const connectedPods = (flowNodes || []).filter(node => {
        if (!node || !node.data || node.data.componentType !== 'pod') return false;
        return (flowEdges || []).some(edge =>
          edge && edge.source && edge.target &&
          ((edge.source === deploymentId && edge.target === node.id) ||
          (edge.target === deploymentId && edge.source === node.id))
        );
      });

      // Also check for pods that might be managed by this deployment but not yet connected
      const managedPods = (flowNodes || []).filter(node => {
        if (!node || !node.data || node.data.componentType !== 'pod') return false;
        return node.data.managedBy === deploymentId;
      });

      // Combine connected and managed pods, removing duplicates
      const allManagedPods = [...connectedPods];
      managedPods.forEach(pod => {
        if (!allManagedPods.find(p => p.id === pod.id)) {
          allManagedPods.push(pod);
        }
      });

      const currentPodCount = allManagedPods.length;

      console.log(`Pod Management for ${deploymentId}:`, {
        replicas,
        currentPodCount,
        connectedPods: connectedPods.map(p => p.id),
        managedPods: managedPods.map(p => p.id),
        allManagedPods: allManagedPods.map(p => p.id),
        podsNeeded: replicas - currentPodCount
      });

      if (currentPodCount < replicas) {
        // Create additional pods to reach target replicas
        // Always ensure manually dragged pods are preserved and count towards total
        const newPods: Node[] = [];
        const newEdges: Edge[] = [];
        const podsNeeded = replicas - currentPodCount;

        for (let i = 0; i < podsNeeded; i++) {
          const podIndex = currentPodCount + i + 1;
          const podId = `${deploymentId}-pod-${podIndex}`;
          const newPod: Node = {
            id: podId,
            type: 'kubernetes',
            position: {
              x: deploymentNode.position.x + 200 + (podIndex * 150),
              y: deploymentNode.position.y + 100
            },
            draggable: true,
            selectable: true,
            data: {
              componentType: 'pod',
              label: `${deploymentNode.data.label}-pod-${podIndex}`,
              status: 'running',
              config: {
                name: `${deploymentNode.data.config?.name || 'pod'}-${podIndex}`,
                image: deploymentNode.data.config?.image || 'nginx:latest',
                port: deploymentNode.data.config?.port || 80,
                labels: deploymentNode.data.config?.labels || { app: 'my-app' }
              }
            }
          };

          const newEdge: Edge = {
            id: `${deploymentId}-${podId}`,
            source: deploymentId,
            target: podId,
            type: 'smoothstep',
            animated: true,
            updatable: false,
            focusable: false,
            style: { stroke: '#10b981' }
          };

          newPods.push(newPod);
          newEdges.push(newEdge);
        }

        // Add new pods to store first
        newPods.forEach(pod => {
          if (addNode && typeof addNode === 'function') {
            addNode(pod);
          }
        });

        // Add edges to store one by one to ensure proper state updates
        newEdges.forEach(edge => {
          if (addEdgeToStore && typeof addEdgeToStore === 'function') {
            addEdgeToStore(edge);
          }
          // Also update the React Flow state
          if (setFlowEdges && typeof setFlowEdges === 'function') {
            setFlowEdges(prev => [...(prev || []), edge]);
          }
        });

        // Show user-friendly notification
        toast.success(
          `Created ${podsNeeded} additional pod(s) to match deployment replicas (${replicas}). ` +
          `Total pods: ${currentPodCount} existing + ${podsNeeded} new = ${replicas}`,
          { duration: 4000 }
        );

        if (newPods.length > 0) {
          toast.success(`Created ${newPods.length} additional pod(s) to match deployment replicas (${replicas})`, {
            icon: '🚀',
            duration: 3000,
          });
        }

      } else if (currentPodCount > replicas) {
        // Remove excess pods
        const podsToRemove = allManagedPods.slice(replicas);
        const podIdsToRemove = podsToRemove.map(pod => pod.id);

        // Remove pods from store directly
        podIdsToRemove.forEach(podId => removeNode(podId));

        const updatedEdges = (flowEdges || []).filter(edge =>
          edge && edge.source && edge.target &&
          !podIdsToRemove.includes(edge.source) && !podIdsToRemove.includes(edge.target)
        );
        if (setFlowEdges && typeof setFlowEdges === 'function') {
          setFlowEdges(updatedEdges);
        }
        if (updateEdges && typeof updateEdges === 'function') {
          updateEdges(updatedEdges);
        }

        toast.success(`Removed ${podsToRemove.length} pod(s) to match deployment replicas (${replicas})`, {
          icon: '🗑️',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error in managePods:', error);
      toast.error('Failed to manage pods. Please try again.', {
        duration: 3000,
      });
    }
  }, [flowNodes, flowEdges, setFlowEdges, updateEdges, addNode, addEdgeToStore, removeNode]);

  // Function to clean up pod counts for all deployments
  const cleanupPodCounts = useCallback(() => {
    const deployments = flowNodes.filter(node => node.data.componentType === 'deployment');
    deployments.forEach(deployment => {
      setTimeout(() => managePods(deployment), 100);
    });
  }, [flowNodes, managePods]);

  // Sync store nodes with React Flow nodes and ensure they're draggable
  useEffect(() => {
    const nodesWithDragProps = nodes.map(node => ({
      ...node,
      draggable: true,
      selectable: true
    }));

    // Only update if the number of nodes changed or if node IDs/types changed
    // Don't compare position data to avoid infinite loops during dragging
    const currentNodeIds = flowNodes.map(n => `${n.id}-${n.data.componentType}`).sort();
    const newNodeIds = nodesWithDragProps.map(n => `${n.id}-${n.data.componentType}`).sort();

    if (nodes.length !== flowNodes.length ||
        JSON.stringify(currentNodeIds) !== JSON.stringify(newNodeIds)) {
      setFlowNodes(nodesWithDragProps);

      // Trigger pod cleanup after nodes are updated
      if (nodes.length > flowNodes.length) {
        setTimeout(() => cleanupPodCounts(), 500);
      }
    }
  }, [nodes, flowNodes, setFlowNodes]);

  // Watch for replica count changes and trigger pod management
  useEffect(() => {
    if (previousNodes.length > 0 && nodes.length > 0) {
      nodes.forEach(currentNode => {
        if (currentNode.data.componentType === 'deployment') {
          const previousNode = previousNodes.find(prev => prev.id === currentNode.id);
          if (previousNode &&
              previousNode.data.config?.replicas !== currentNode.data.config?.replicas) {
            // Replica count changed, trigger pod management
            console.log(`Replica count changed for ${currentNode.id}: ${previousNode.data.config?.replicas} → ${currentNode.data.config?.replicas}`);
            setTimeout(() => managePods(currentNode), 300);
          }
        }
      });
    }
    setPreviousNodes(nodes);
  }, [nodes, previousNodes, managePods]);

  useEffect(() => {
    setFlowEdges(edges);
  }, [edges]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = flowNodes.filter(node => node.selected);
        if (selectedNodes.length > 0) {
          const nodeNames = selectedNodes.map(node => node.data.label || node.data.componentType).join(', ');
          selectedNodes.forEach(node => removeNode(node.id));
          toast.success(`Deleted ${selectedNodes.length} component(s): ${nodeNames}`, {
            icon: '🗑️',
            duration: 3000,
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [flowNodes, removeNode]);

  const validateConnection = (source: string, target: string) => {
    const sourceNode = flowNodes.find(n => n.id === source);
    const targetNode = flowNodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) return false;

    const sourceType = sourceNode.data.componentType;
    const targetType = targetNode.data.componentType;

    // Comprehensive Kubernetes connection matrix - exact mapping from the provided table
    const connectionMatrix: Record<string, string[]> = {
      'pod': ['service', 'pvc', 'configmap', 'secret', 'namespace', 'node', 'rolebinding'],
      'deployment': ['pod', 'service', 'pvc', 'configmap', 'secret', 'hpa', 'vpa', 'namespace', 'application'],
      'service': ['pod', 'deployment', 'ingress', 'namespace'],
      'ingress': ['service', 'namespace', 'certificate'],
      'pvc': ['pv', 'namespace'],
      'pv': ['pvc', 'namespace'],
      'configmap': ['pod', 'deployment', 'namespace'],
      'secret': ['pod', 'deployment', 'namespace'],
      'hpa': ['deployment', 'namespace'],
      'vpa': ['pod', 'deployment', 'namespace'],
      'namespace': ['pod', 'deployment', 'service', 'ingress', 'pvc', 'pv', 'configmap', 'secret', 'hpa', 'vpa', 'node', 'certificate', 'application', 'rolebinding'],
      'node': ['pod', 'namespace'],
      'certificate': ['ingress', 'namespace'],
      'application': ['pod', 'deployment', 'service', 'ingress', 'pvc', 'pv', 'configmap', 'secret', 'hpa', 'vpa', 'namespace', 'certificate'],
      'rolebinding': ['namespace'],

      // Additional common Kubernetes components
      'statefulset': ['pod', 'service', 'pvc', 'configmap', 'secret', 'hpa', 'vpa', 'namespace'],
      'replicaset': ['pod', 'service', 'namespace'],
      'daemonset': ['pod', 'configmap', 'secret', 'namespace'],
      'job': ['pod', 'configmap', 'secret', 'namespace'],
      'cronjob': ['job', 'namespace'],
      'serviceaccount': ['pod', 'rolebinding', 'namespace'],
      'networkpolicy': ['pod', 'namespace'],
      'persistentvolume': ['pvc', 'namespace'],
      'storageclass': ['pvc', 'namespace'],
    };

    // Normalize component types (handle variations)
    const normalizeType = (type: string): string => {
      const typeMap: Record<string, string> = {
        'horizontalpodautoscaler': 'hpa',
        'verticalpodautoscaler': 'vpa',
        'persistentvolumeclaim': 'pvc',
        'persistentvolume': 'pv',
        'tls': 'certificate',
        'cert': 'certificate',
      };
      return typeMap[type] || type;
    };

    const normalizedSource = normalizeType(sourceType);
    const normalizedTarget = normalizeType(targetType);

    // Check if connection is valid in either direction
    const sourceToTarget = connectionMatrix[normalizedSource]?.includes(normalizedTarget);
    const targetToSource = connectionMatrix[normalizedTarget]?.includes(normalizedSource);

    return sourceToTarget || targetToSource;
  };

  // Comprehensive Best Practices Validation - All 100 Kubernetes Best Practices
  const checkBestPractices = (sourceType: string, targetType: string, sourceNode?: any, targetNode?: any) => {
    const practices = [];

    // 🧱 CONTAINER & POD-LEVEL BEST PRACTICES (1-15)

    // #1: Don't create Pods directly
    if (targetType === 'pod' && sourceType !== 'deployment' && sourceType !== 'statefulset' && sourceType !== 'daemonset') {
      practices.push({
        severity: 'High',
        rule: "#1: Don't create Pods directly",
        suggestion: "Use Deployments, StatefulSets, or DaemonSets to manage Pods for self-healing",
        icon: '🧱',
        category: 'Container & Pod'
      });
    }

    // #2: Don't connect Service directly to a Pod
    if (sourceType === 'service' && targetType === 'pod') {
      practices.push({
        severity: 'High',
        rule: "#2: Don't connect Service directly to a Pod",
        suggestion: "Connect Services to Deployments to ensure stability and load balancing",
        icon: '⚠️',
        category: 'Container & Pod'
      });
    }

    // #3: Use resource requests and limits
    if ((sourceType === 'pod' || targetType === 'pod') && !sourceNode?.data?.config?.resources) {
      practices.push({
        severity: 'High',
        rule: "#3: Use resource requests and limits",
        suggestion: "Define CPU/memory requests and limits to prevent resource starvation",
        icon: '📊',
        category: 'Container & Pod'
      });
    }

    // #4: Define liveness and readiness probes
    if ((sourceType === 'pod' || targetType === 'pod') && !sourceNode?.data?.config?.probes) {
      practices.push({
        severity: 'High',
        rule: "#4: Define liveness and readiness probes",
        suggestion: "Add health checks for automatic restart and traffic routing",
        icon: '🏥',
        category: 'Container & Pod'
      });
    }

    // #5: Use ConfigMaps for configuration
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType !== 'configmap') {
      practices.push({
        severity: 'Medium',
        rule: "#5: Use ConfigMaps for configuration",
        suggestion: "Connect ConfigMaps to keep configuration separate from code",
        icon: '⚙️',
        category: 'Container & Pod'
      });
    }

    // #6: Use Secrets for sensitive data
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType !== 'secret') {
      practices.push({
        severity: 'High',
        rule: "#6: Use Secrets for sensitive data",
        suggestion: "Connect Secrets to avoid hardcoding credentials in containers",
        icon: '🔐',
        category: 'Container & Pod'
      });
    }

    // #9: Pin image tags (avoid 'latest')
    if ((sourceType === 'pod' || sourceType === 'deployment') &&
        (sourceNode?.data?.config?.image?.includes(':latest') || !sourceNode?.data?.config?.image?.includes(':'))) {
      practices.push({
        severity: 'High',
        rule: "#9: Pin image tags (avoid 'latest')",
        suggestion: "Use specific version tags like 'nginx:1.21.0' for consistency",
        icon: '🏷️',
        category: 'Container & Pod'
      });
    }

    // #15: Avoid storing state in containers
    if (sourceType === 'pod' && targetType !== 'pvc' && targetType !== 'configmap' && targetType !== 'secret') {
      practices.push({
        severity: 'High',
        rule: "#15: Avoid storing state in containers",
        suggestion: "Use Persistent Volumes (PVC) for data that needs to survive pod restarts",
        icon: '💾',
        category: 'Container & Pod'
      });
    }

    // 🏗️ DEPLOYMENT & APPLICATION ARCHITECTURE (16-25)

    // #16: Use Deployments for stateless apps
    if (sourceType === 'pod' && targetType !== 'deployment') {
      practices.push({
        severity: 'Medium',
        rule: "#16: Use Deployments for stateless apps",
        suggestion: "Wrap stateless Pods in Deployments for better management",
        icon: '🏗️',
        category: 'Deployment & Architecture'
      });
    }

    // #17: Use StatefulSets for stateful apps
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType === 'pvc') {
      practices.push({
        severity: 'Medium',
        rule: "#17: Use StatefulSets for stateful apps",
        suggestion: "Consider StatefulSet instead of Deployment for apps with persistent storage",
        icon: '🗄️',
        category: 'Deployment & Architecture'
      });
    }

    // #20: Use PVCs for persistent data
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType !== 'pvc') {
      practices.push({
        severity: 'Medium',
        rule: "#20: Use PVCs for persistent data",
        suggestion: "Connect PVCs for data that needs to survive pod restarts",
        icon: '💿',
        category: 'Deployment & Architecture'
      });
    }

    // 🌐 NETWORKING BEST PRACTICES (26-35)

    // #26: Use ClusterIP for internal access
    if (sourceType === 'service' && !targetNode?.data?.config?.type) {
      practices.push({
        severity: 'Medium',
        rule: "#26: Use ClusterIP for internal access",
        suggestion: "Default to ClusterIP service type for internal communication",
        icon: '🔗',
        category: 'Networking'
      });
    }

    // #28: Use Ingress for HTTP routing
    if (sourceType === 'service' && targetType !== 'ingress') {
      practices.push({
        severity: 'Medium',
        rule: "#28: Use Ingress for HTTP routing",
        suggestion: "Add Ingress for external HTTP/HTTPS access instead of LoadBalancer",
        icon: '🌐',
        category: 'Networking'
      });
    }

    // #31: Avoid exposing Pods directly
    if (sourceType === 'ingress' && targetType === 'pod') {
      practices.push({
        severity: 'High',
        rule: "#31: Avoid exposing Pods directly",
        suggestion: "Route traffic: Ingress → Service → Deployment → Pod",
        icon: '🚫',
        category: 'Networking'
      });
    }

    // #32: Use DNS names, not IPs
    if (sourceType === 'service' && sourceNode?.data?.config?.targetPort) {
      practices.push({
        severity: 'Medium',
        rule: "#32: Use DNS names, not IPs",
        suggestion: "Services provide stable DNS names - avoid hardcoding IPs",
        icon: '🏷️',
        category: 'Networking'
      });
    }

    // 🔐 SECURITY BEST PRACTICES (36-45)

    // #36: Enable RBAC
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType !== 'rolebinding') {
      practices.push({
        severity: 'High',
        rule: "#36: Enable RBAC",
        suggestion: "Connect RoleBinding to control access permissions",
        icon: '🔐',
        category: 'Security'
      });
    }

    // #38: Use ServiceAccounts with least privilege
    if ((sourceType === 'pod' || sourceType === 'deployment') && !sourceNode?.data?.config?.serviceAccount) {
      practices.push({
        severity: 'Medium',
        rule: "#38: Use ServiceAccounts with least privilege",
        suggestion: "Assign specific ServiceAccount instead of using default",
        icon: '👤',
        category: 'Security'
      });
    }

    // #44: Rotate secrets regularly
    if (sourceType === 'secret' || targetType === 'secret') {
      practices.push({
        severity: 'Medium',
        rule: "#44: Rotate secrets regularly",
        suggestion: "Implement secret rotation policies for better security",
        icon: '🔄',
        category: 'Security'
      });
    }

    // ⚖️ SCALABILITY & RELIABILITY (46-55)

    // #46: Use HPA (Horizontal Pod Autoscaler)
    if (sourceType === 'deployment' && targetType !== 'hpa') {
      practices.push({
        severity: 'Medium',
        rule: "#46: Use HPA (Horizontal Pod Autoscaler)",
        suggestion: "Add HPA to automatically scale based on CPU/memory usage",
        icon: '📈',
        category: 'Scalability'
      });
    }

    // #47: Use VPA (Vertical Pod Autoscaler)
    if ((sourceType === 'pod' || sourceType === 'deployment') && targetType !== 'vpa') {
      practices.push({
        severity: 'Low',
        rule: "#47: Use VPA (Vertical Pod Autoscaler)",
        suggestion: "Consider VPA for automatic resource request optimization",
        icon: '📊',
        category: 'Scalability'
      });
    }

    // #49: Use PodDisruptionBudgets
    if (sourceType === 'deployment' && !sourceNode?.data?.config?.pdb) {
      practices.push({
        severity: 'Medium',
        rule: "#49: Use PodDisruptionBudgets",
        suggestion: "Define PDB to ensure minimum replicas during updates",
        icon: '🛡️',
        category: 'Scalability'
      });
    }

    // 📊 OBSERVABILITY & MONITORING (56-65)

    // #60: Monitor resource usage per namespace
    if (!sourceNode?.data?.config?.namespace || sourceNode?.data?.config?.namespace === 'default') {
      practices.push({
        severity: 'Medium',
        rule: "#60: Monitor resource usage per namespace",
        suggestion: "Use specific namespaces instead of 'default' for better organization",
        icon: '📊',
        category: 'Observability'
      });
    }

    // #63: Label critical workloads
    if ((sourceType === 'pod' || sourceType === 'deployment') && !sourceNode?.data?.config?.labels?.tier) {
      practices.push({
        severity: 'Medium',
        rule: "#63: Label critical workloads",
        suggestion: "Add labels like 'tier: frontend/backend' for better monitoring",
        icon: '🏷️',
        category: 'Observability'
      });
    }

    // 🗂️ ORGANIZATION & NAMESPACE MANAGEMENT (66-75)

    // #66: Separate environments using namespaces
    if (sourceNode?.data?.config?.namespace === 'default' || !sourceNode?.data?.config?.namespace) {
      practices.push({
        severity: 'Medium',
        rule: "#66: Separate environments using namespaces",
        suggestion: "Use dedicated namespaces like 'dev', 'staging', 'prod' instead of default",
        icon: '🗂️',
        category: 'Organization'
      });
    }

    // #68: Apply ResourceQuotas to namespaces
    if (sourceType === 'namespace' && !sourceNode?.data?.config?.resourceQuota) {
      practices.push({
        severity: 'Medium',
        rule: "#68: Apply ResourceQuotas to namespaces",
        suggestion: "Set resource limits per namespace to prevent resource exhaustion",
        icon: '⚖️',
        category: 'Organization'
      });
    }

    // #75: Avoid mixing prod and non-prod workloads
    if (sourceNode?.data?.config?.namespace?.includes('prod') && targetNode?.data?.config?.namespace?.includes('dev')) {
      practices.push({
        severity: 'High',
        rule: "#75: Avoid mixing prod and non-prod workloads",
        suggestion: "Keep production and development workloads in separate namespaces",
        icon: '🚫',
        category: 'Organization'
      });
    }

    // 🔁 CI/CD & GITOPS (76-85)

    // #76: Store all manifests in Git
    practices.push({
      severity: 'Medium',
      rule: "#76: Store all manifests in Git",
      suggestion: "Version control all Kubernetes manifests for GitOps workflow",
      icon: '📝',
      category: 'CI/CD & GitOps'
    });

    // #78: Use Helm or Kustomize for templating
    practices.push({
      severity: 'Medium',
      rule: "#78: Use Helm or Kustomize for templating",
      suggestion: "Use templating tools instead of static YAML files",
      icon: '📦',
      category: 'CI/CD & GitOps'
    });

    // 💾 BACKUP & DISASTER RECOVERY (86-95)

    // #87: Use Velero for cluster backup
    practices.push({
      severity: 'Low',
      rule: "#87: Use Velero for cluster backup",
      suggestion: "Implement cluster-wide backup strategy with Velero",
      icon: '💾',
      category: 'Backup & DR'
    });

    // #88: Snapshot PVCs periodically
    if (sourceType === 'pvc' || targetType === 'pvc') {
      practices.push({
        severity: 'Medium',
        rule: "#88: Snapshot PVCs periodically",
        suggestion: "Enable volume snapshots for persistent data backup",
        icon: '📸',
        category: 'Backup & DR'
      });
    }

    // 🌍 MULTI-CLUSTER & FEDERATION (96-100)

    // #99: Sync secrets and configs with automation
    if (sourceType === 'secret' || sourceType === 'configmap') {
      practices.push({
        severity: 'Low',
        rule: "#99: Sync secrets and configs with automation",
        suggestion: "Use tools like External Secrets Operator for secret management",
        icon: '🔄',
        category: 'Multi-cluster'
      });
    }

    return practices;
  };

  // Function to handle replica count changes
  const handleReplicaChange = useCallback((deploymentId: string, newReplicas: number) => {
    // Update the deployment node's replica count
    const updatedNodes = flowNodes.map(node => {
      if (node.id === deploymentId && node.data.componentType === 'deployment') {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              replicas: newReplicas
            }
          }
        };
      }
      return node;
    });

    setFlowNodes(updatedNodes);
    updateNodes(updatedNodes);

    // Find the updated deployment node and manage pods
    const deploymentNode = updatedNodes.find(node => node.id === deploymentId);
    if (deploymentNode) {
      setTimeout(() => managePods(deploymentNode), 100);
    }
  }, [flowNodes, updateNodes, managePods]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      try {
        if (!params.source || !params.target) return;

        // Validate connection
        if (!validateConnection(params.source, params.target)) {
          const sourceNode = flowNodes.find(n => n.id === params.source);
          const targetNode = flowNodes.find(n => n.id === params.target);

          // Provide specific guidance with helpful suggestions when connections are invalid
          const getConnectionGuidance = (source: string, target: string) => {
            const suggestions: Record<string, Record<string, string>> = {
              // Service connection suggestions
              'service': {
                'configmap': '❌ Services cannot connect to ConfigMaps directly. 💡 Connect the ConfigMap to your Pods instead, then connect the Service to those Pods.',
                'secret': '❌ Services cannot connect to Secrets directly. 💡 Connect the Secret to your Pods instead, then connect the Service to those Pods.',
                'pvc': '❌ Services cannot connect to PVCs directly. 💡 Connect the PVC to your Pods for storage, then connect the Service to those Pods.',
                'ingress': '✅ Valid: Services can be exposed through Ingress for external access.',
                'hpa': '❌ Services cannot connect to HPA directly. 💡 Connect HPA to your Deployment, then connect the Service to the Deployment.',
                'node': '❌ Services cannot connect to Nodes directly. 💡 Services automatically route to Pods running on any Node.',
              },

              // Pod connection suggestions
              'pod': {
                'deployment': '❌ Pods cannot connect to Deployments directly. 💡 Deployments create and manage Pods automatically - no manual connection needed.',
                'ingress': '❌ Pods cannot connect to Ingress directly. 💡 Create a Service first, connect it to your Pod, then connect Ingress to the Service.',
                'hpa': '❌ Pods cannot connect to HPA directly. 💡 Connect HPA to the Deployment that manages your Pods.',
                'pv': '❌ Pods cannot connect to PVs directly. 💡 Create a PVC first, bind it to the PV, then connect your Pod to the PVC.',
              },

              // Deployment connection suggestions
              'deployment': {
                'ingress': '❌ Deployments cannot connect to Ingress directly. 💡 Create a Service, connect it to your Deployment, then connect Ingress to the Service.',
                'pv': '❌ Deployments cannot connect to PVs directly. 💡 Create a PVC, bind it to the PV, then connect your Deployment to the PVC.',
                'node': '❌ Deployments cannot connect to Nodes directly. 💡 Kubernetes scheduler automatically places Pods on Nodes based on resources.',
              },

              // Ingress connection suggestions
              'ingress': {
                'pod': '❌ Ingress cannot connect to Pods directly. 💡 Create a Service first, connect it to your Pods, then connect Ingress to the Service.',
                'deployment': '❌ Ingress cannot connect to Deployments directly. 💡 Create a Service, connect it to your Deployment, then connect Ingress to the Service.',
                'configmap': '❌ Ingress cannot connect to ConfigMaps directly. 💡 ConfigMaps are used by Pods for configuration.',
                'pvc': '❌ Ingress cannot connect to PVCs directly. 💡 PVCs provide storage to Pods, not network routing.',
              },

              // PVC connection suggestions
              'pvc': {
                'service': '❌ PVCs cannot connect to Services directly. 💡 PVCs provide storage to Pods. Connect your PVC to Pods that need persistent storage.',
                'ingress': '❌ PVCs cannot connect to Ingress directly. 💡 PVCs are for storage, not network routing.',
                'configmap': '❌ PVCs cannot connect to ConfigMaps directly. 💡 Both are Pod resources - connect them separately to your Pods.',
                'deployment': '❌ PVCs cannot connect to Deployments directly. 💡 Connect PVCs to the Pods created by your Deployment.',
              },

              // ConfigMap connection suggestions
              'configmap': {
                'service': '❌ ConfigMaps cannot connect to Services directly. 💡 Connect ConfigMaps to Pods for configuration, then connect Services to those Pods.',
                'ingress': '❌ ConfigMaps cannot connect to Ingress directly. 💡 ConfigMaps provide configuration to Pods, not network routing.',
                'pvc': '❌ ConfigMaps cannot connect to PVCs directly. 💡 Both are Pod resources - connect them separately to your Pods.',
                'hpa': '❌ ConfigMaps cannot connect to HPA directly. 💡 ConfigMaps provide configuration to Pods, HPA scales Deployments.',
              },

              // Secret connection suggestions
              'secret': {
                'service': '❌ Secrets cannot connect to Services directly. 💡 Connect Secrets to Pods for sensitive data, then connect Services to those Pods.',
                'pvc': '❌ Secrets cannot connect to PVCs directly. 💡 Both are Pod resources - connect them separately to your Pods.',
                'hpa': '❌ Secrets cannot connect to HPA directly. 💡 Secrets provide sensitive data to Pods, HPA scales Deployments.',
              },

              // HPA connection suggestions
              'hpa': {
                'pod': '❌ HPA cannot connect to Pods directly. 💡 HPA scales Deployments or StatefulSets, which then manage Pods automatically.',
                'service': '❌ HPA cannot connect to Services directly. 💡 Connect HPA to the Deployment, then connect the Service to that Deployment.',
                'ingress': '❌ HPA cannot connect to Ingress directly. 💡 HPA scales workloads, not network routing components.',
                'configmap': '❌ HPA cannot connect to ConfigMaps directly. 💡 HPA scales workloads based on metrics, not configuration.',
              }
            };

            // Check for specific suggestion
            const suggestion = suggestions[source]?.[target] || suggestions[target]?.[source];
            if (suggestion) {
              return suggestion;
            }

            // Generic guidance based on component types
            if (source === target) {
              return `❌ Cannot connect ${source} to itself. Components don't connect to the same type.`;
            }

            // Default suggestion
            return `❌ ${source} cannot connect to ${target} directly. 💡 Check the Kubernetes architecture - you might need intermediate components like Services or different connection patterns.`;
          };

          const guidance = getConnectionGuidance(sourceNode?.data.componentType || '', targetNode?.data.componentType || '');

          toast.error(guidance, {
            duration: 6000,
            style: { maxWidth: '400px' }
          });
          return;
        }

        const newEdge = addEdge(params, flowEdges);
        setFlowEdges(newEdge);
        updateEdges(newEdge);

        // Check if we connected a deployment to a pod and manage pod count
        const sourceNode = flowNodes.find(n => n.id === params.source);
        const targetNode = flowNodes.find(n => n.id === params.target);

        if (sourceNode?.data.componentType === 'deployment' && targetNode?.data.componentType === 'pod') {
          setTimeout(() => managePods(sourceNode), 500);
        } else if (targetNode?.data.componentType === 'deployment' && sourceNode?.data.componentType === 'pod') {
          setTimeout(() => managePods(targetNode), 500);
        }

        // Check for best practices violations
        const sourceType = sourceNode?.data.componentType || '';
        const targetType = targetNode?.data.componentType || '';
        const bestPracticeIssues = checkBestPractices(sourceType, targetType, sourceNode, targetNode);

        if (bestPracticeIssues.length > 0) {
          // Show a single, organized best practices notification
          const topIssues = bestPracticeIssues
            .sort((a, b) => {
              const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
              return severityOrder[b.severity] - severityOrder[a.severity];
            })
            .slice(0, 3);

          toast((t) => (
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📋</span>
                  <span className="font-semibold text-orange-700">Best Practices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                    {bestPracticeIssues.length} suggestion{bestPracticeIssues.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-orange-600 hover:text-orange-800 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {topIssues.map((issue, index) => (
                  <div key={index} className="bg-white border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{issue.icon}</span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          issue.severity === 'High' ? 'bg-red-100 text-red-700' :
                          issue.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {issue.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {issue.rule}
                    </div>
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      💡 {issue.suggestion}
                    </div>
                  </div>
                ))}

                {bestPracticeIssues.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      +{bestPracticeIssues.length - 3} more suggestions available
                    </span>
                  </div>
                )}
              </div>
            </div>
          ), {
            duration: 12000,
            style: {
              maxWidth: '450px',
              backgroundColor: '#fef7ed',
              border: '2px solid #fb923c',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(251, 146, 60, 0.15)',
              padding: '16px',
            },
          });

          // Show simple success message
          setTimeout(() => {
            toast.success('Connected successfully! 🔗', {
              duration: 2000,
            });
          }, 500);
        } else {
          toast.success('Components connected successfully - Following best practices! 🎉', {
            icon: '🔗',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Connection error:', error);
        toast.error('Failed to connect components. Please try again.', {
          duration: 4000,
        });
      }
    },
    [flowEdges, setFlowEdges, updateEdges, flowNodes, managePods],
  );

  const getDefaultConfig = (type: string) => {
    const configs: Record<string, any> = {
      pod: {
        name: `my-pod-${Math.random().toString(36).substr(2, 5)}`,
        image: 'nginx:latest',
        port: 80,
        labels: { app: 'my-app' }
      },
      deployment: {
        name: `my-deployment-${Math.random().toString(36).substr(2, 5)}`,
        replicas: 3,
        image: 'nginx:latest',
        port: 80,
        labels: { app: 'my-app' }
      },
      service: {
        name: `my-service-${Math.random().toString(36).substr(2, 5)}`,
        type: 'ClusterIP',
        port: 80,
        targetPort: 80,
        selector: { app: 'my-app' }
      },
      ingress: {
        name: `my-ingress-${Math.random().toString(36).substr(2, 5)}`,
        host: 'example.com',
        path: '/',
        serviceName: 'my-service',
        servicePort: 80
      },
      configmap: {
        name: `my-configmap-${Math.random().toString(36).substr(2, 5)}`,
        data: { 'config.yaml': 'key: value' }
      },
      secret: {
        name: `my-secret-${Math.random().toString(36).substr(2, 5)}`,
        type: 'Opaque',
        data: { username: 'admin', password: 'secret' }
      },
      pvc: {
        name: `my-pvc-${Math.random().toString(36).substr(2, 5)}`,
        size: '10Gi',
        accessMode: 'ReadWriteOnce',
        storageClass: 'standard'
      },
      statefulset: {
        name: `my-statefulset-${Math.random().toString(36).substr(2, 5)}`,
        replicas: 3,
        image: 'postgres:13',
        serviceName: 'postgres-service'
      },
      daemonset: {
        name: `my-daemonset-${Math.random().toString(36).substr(2, 5)}`,
        image: 'fluentd:latest'
      },
      job: {
        name: `my-job-${Math.random().toString(36).substr(2, 5)}`,
        image: 'busybox:latest',
        command: ['echo', 'Hello World']
      },
      cronjob: {
        name: `my-cronjob-${Math.random().toString(36).substr(2, 5)}`,
        schedule: '0 2 * * *',
        image: 'busybox:latest',
        command: ['echo', 'Scheduled task']
      },
      hpa: {
        name: `my-hpa-${Math.random().toString(36).substr(2, 5)}`,
        targetRef: 'my-deployment',
        minReplicas: 2,
        maxReplicas: 10,
        targetCPU: 70
      },
      vpa: {
        name: `my-vpa-${Math.random().toString(36).substr(2, 5)}`,
        targetRef: 'my-deployment',
        updateMode: 'Auto'
      },
      namespace: {
        name: `my-namespace-${Math.random().toString(36).substr(2, 5)}`,
        labels: { environment: 'development' }
      },
      serviceaccount: {
        name: `my-serviceaccount-${Math.random().toString(36).substr(2, 5)}`,
        namespace: 'default'
      },
      role: {
        name: `my-role-${Math.random().toString(36).substr(2, 5)}`,
        namespace: 'default',
        rules: [{ apiGroups: [''], resources: ['pods'], verbs: ['get', 'list'] }]
      },
      clusterrole: {
        name: `my-clusterrole-${Math.random().toString(36).substr(2, 5)}`,
        rules: [{ apiGroups: [''], resources: ['nodes'], verbs: ['get', 'list'] }]
      },
      rolebinding: {
        name: `my-rolebinding-${Math.random().toString(36).substr(2, 5)}`,
        roleRef: 'my-role',
        subjects: [{ kind: 'ServiceAccount', name: 'my-serviceaccount' }]
      },
      clusterrolebinding: {
        name: `my-clusterrolebinding-${Math.random().toString(36).substr(2, 5)}`,
        roleRef: 'my-clusterrole',
        subjects: [{ kind: 'ServiceAccount', name: 'my-serviceaccount' }]
      },
      node: {
        name: `worker-node-${Math.random().toString(36).substr(2, 5)}`,
        capacity: { cpu: '4', memory: '8Gi' },
        status: 'Ready'
      },
      persistentvolume: {
        name: `my-pv-${Math.random().toString(36).substr(2, 5)}`,
        capacity: '100Gi',
        accessMode: 'ReadWriteOnce',
        storageClass: 'standard'
      }
    };
    return configs[type] || { name: `${type}-${Math.random().toString(36).substr(2, 5)}` };
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      try {
        event.preventDefault();

        if (!reactFlowWrapper.current || !reactFlowInstance) {
          console.warn('React Flow instance or wrapper not available');
          return;
        }

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        if (!type) {
          console.warn('No component type found in drag data');
          return;
        }

        // Use screenToFlowPosition instead of deprecated project method
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type: 'kubernetes',
          position,
          draggable: true,
          selectable: true,
          data: {
            label: type.charAt(0).toUpperCase() + type.slice(1),
            componentType: type,
            config: getDefaultConfig(type)
          },
        };

        // Add node to store
        addNode(newNode);

        // Show success toast
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added to canvas`, {
          icon: '🎯',
          duration: 2000,
        });
      } catch (error) {
        console.error('Error in onDrop:', error);
        toast.error('Failed to add component. Please try again.', {
          duration: 3000,
        });
      }
    },
    [reactFlowInstance, addNode],
  );



  // Calculate node health status based on connections and Kubernetes rules
  const calculateNodeStatus = useCallback((nodeId: string, nodeType: string) => {
    const connectedEdges = flowEdges.filter(edge =>
      edge.source === nodeId || edge.target === nodeId
    );

    // Service status - needs backend workloads
    if (nodeType === 'service') {
      const hasBackendConnection = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return ['deployment', 'pod', 'statefulset', 'replicaset'].includes(otherNode?.data.componentType || '');
      });
      return hasBackendConnection ? 'running' : 'error';
    }

    // Ingress status - needs services
    if (nodeType === 'ingress') {
      const hasServiceConnection = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return otherNode?.data.componentType === 'service';
      });
      return hasServiceConnection ? 'running' : 'warning';
    }

    // Deployment status - should create pods or replicasets
    if (nodeType === 'deployment') {
      const hasWorkloadConnection = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return ['pod', 'replicaset'].includes(otherNode?.data.componentType || '');
      });
      // Deployments can work without explicit connections if they're managing pods internally
      return hasWorkloadConnection || flowNodes.length === 1 ? 'running' : 'warning';
    }

    // PVC status - should bind to PV
    if (nodeType === 'pvc') {
      const hasPVConnection = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return otherNode?.data.componentType === 'pv';
      });
      const isUsedByPod = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return otherNode?.data.componentType === 'pod';
      });
      return (hasPVConnection && isUsedByPod) ? 'running' : 'warning';
    }

    // Pod status - should have some resources or be managed by workloads
    if (nodeType === 'pod') {
      const hasResourceConnection = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return ['configmap', 'secret', 'pvc', 'serviceaccount'].includes(otherNode?.data.componentType || '');
      });
      const isManagedByWorkload = connectedEdges.some(edge => {
        const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
        const otherNode = flowNodes.find(n => n.id === otherNodeId);
        return ['deployment', 'statefulset', 'replicaset', 'daemonset', 'job'].includes(otherNode?.data.componentType || '');
      });
      return (hasResourceConnection || isManagedByWorkload || flowNodes.length === 1) ? 'running' : 'warning';
    }

    // For other components, check if they have any connections when there are multiple nodes
    if (flowNodes.length > 1 && connectedEdges.length === 0) {
      return 'warning';
    }

    return 'running';
  }, [flowNodes, flowEdges]);

  // Status updates temporarily disabled to prevent infinite loops

  const handleNodesChange = useCallback((changes: any) => {
    // Only log actual drag end events to avoid spam
    const dragEndChanges = changes.filter((change: any) =>
      change.type === 'position' && change.dragging === false
    );
    if (dragEndChanges.length > 0) {
      console.log('Node drag completed:', dragEndChanges.map((c: any) => c.id));
    }
    onNodesChange(changes);
  }, [onNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  return (
    <div className="h-full relative">
      <motion.div
        ref={reactFlowWrapper}
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          preventScrolling={false}
          fitView
          className="bg-slate-50"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls className="bg-white shadow-lg border border-slate-200 rounded-lg" />
          <MiniMap
            nodeColor={(node) => {
              switch (node.data.componentType) {
                case 'pod': return '#3b82f6';
                case 'deployment': return '#10b981';
                case 'service': return '#f59e0b';
                case 'ingress': return '#8b5cf6';
                case 'configmap': return '#06b6d4';
                case 'secret': return '#ef4444';
                default: return '#6b7280';
              }
            }}
            className="!bg-white !border !border-gray-200 !rounded-lg"
            pannable
            zoomable
          />
        </ReactFlow>
        
        {/* Traffic Animation Overlay */}
        <TrafficAnimation nodes={flowNodes} edges={flowEdges} />


      </motion.div>

      {/* Empty State */}
      {flowNodes.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Start Building Your Application
            </h3>
            <p className="text-slate-600 max-w-md">
              Drag components from the left panel to create your Kubernetes architecture.
              Connect them to see how they work together!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Wrap with ReactFlowProvider and Error Boundary
const KubernetesCanvasProvider: React.FC = () => (
  <PlaygroundErrorBoundary>
    <ReactFlowProvider>
      <KubernetesCanvas />
    </ReactFlowProvider>
  </PlaygroundErrorBoundary>
);

export default KubernetesCanvasProvider;