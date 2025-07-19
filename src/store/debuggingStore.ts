import { create } from 'zustand';

// Types for the debugging simulation
export interface K8sResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec?: any;
  status?: any;
}

export interface PodState {
  id: string;
  name: string;
  namespace: string;
  status: 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown' | 'CrashLoopBackOff' | 'ImagePullBackOff';
  restartCount: number;
  containers: ContainerState[];
  events: K8sEvent[];
  logs: LogEntry[];
  node?: string;
  createdAt: Date;
  lastRestart?: Date;
}

export interface ContainerState {
  name: string;
  image: string;
  status: 'Running' | 'Waiting' | 'Terminated';
  ready: boolean;
  restartCount: number;
  lastState?: any;
  resources?: {
    requests?: Record<string, string>;
    limits?: Record<string, string>;
  };
}

export interface NodeState {
  id: string;
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
  conditions: NodeCondition[];
  capacity: Record<string, string>;
  allocatable: Record<string, string>;
  taints?: NodeTaint[];
  pods: string[];
  metrics: NodeMetrics;
}

export interface NodeCondition {
  type: string;
  status: string;
  reason?: string;
  message?: string;
  lastTransitionTime: Date;
}

export interface NodeTaint {
  key: string;
  value?: string;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

export interface NodeMetrics {
  cpu: {
    usage: number;
    capacity: number;
  };
  memory: {
    usage: number;
    capacity: number;
  };
  disk: {
    usage: number;
    capacity: number;
  };
}

export interface K8sEvent {
  id: string;
  type: 'Normal' | 'Warning';
  reason: string;
  message: string;
  source: string;
  firstTime: Date;
  lastTime: Date;
  count: number;
  involvedObject: {
    kind: string;
    name: string;
    namespace?: string;
  };
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source: string;
  container?: string;
}

export interface DebugScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  objectives: string[];
  initialState: ClusterState;
  faultInjection: FaultInjection;
  successCriteria: SuccessCriteria;
  hints: Hint[];
  commands: string[];
}

export interface FaultInjection {
  type: string;
  target: string;
  parameters: Record<string, any>;
  triggerConditions?: string[];
}

export interface SuccessCriteria {
  conditions: Array<{
    type: string;
    target: string;
    expected: any;
  }>;
}

export interface Hint {
  id: string;
  trigger: string;
  message: string;
  command?: string;
  priority: number;
}

export interface ClusterState {
  namespaces: string[];
  nodes: NodeState[];
  pods: PodState[];
  services: K8sResource[];
  deployments: K8sResource[];
  configMaps: K8sResource[];
  secrets: K8sResource[];
  events: K8sEvent[];
  logs: LogEntry[];
}

export interface CommandResult {
  command: string;
  output: string;
  exitCode: number;
  timestamp: Date;
}

interface DebuggingState {
  // Current simulation state
  currentScenario: DebugScenario | null;
  clusterState: ClusterState;
  simulationStatus: 'stopped' | 'running' | 'paused' | 'error';
  isLoading: boolean;
  
  // User interaction state
  commandHistory: CommandResult[];
  currentDirectory: string;
  selectedResource: K8sResource | null;
  
  // Progress tracking
  hintsUsed: number;
  commandsExecuted: number;
  timeElapsed: number;
  scenarioProgress: number;
  
  // Actions
  startScenario: (scenarioId: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetScenario: () => void;
  executeCommand: (command: string) => Promise<CommandResult>;
  updateClusterState: (updates: Partial<ClusterState>) => void;
  selectResource: (resource: K8sResource | null) => void;
  addLogEntry: (entry: LogEntry) => void;
  addEvent: (event: K8sEvent) => void;
  updatePodStatus: (podId: string, status: PodState['status']) => void;
  updateNodeStatus: (nodeId: string, status: NodeState['status']) => void;
}

// Initial cluster state with mock data representing a full-scale production cluster
const initialClusterState: ClusterState = {
  namespaces: ['default', 'kube-system', 'kube-public', 'ingress-nginx', 'monitoring', 'logging', 'cert-manager', 'istio-system'],
  nodes: [
    // Control plane node
    {
      id: 'control-plane-1',
      name: 'control-plane-1',
      status: 'Ready',
      conditions: [
        {
          type: 'Ready',
          status: 'True',
          reason: 'KubeletReady',
          message: 'kubelet is posting ready status',
          lastTransitionTime: new Date()
        }
      ],
      capacity: { cpu: '8', memory: '16Gi', 'ephemeral-storage': '200Gi' },
      allocatable: { cpu: '7800m', memory: '15.5Gi', 'ephemeral-storage': '190Gi' },
      taints: [{ key: 'node-role.kubernetes.io/control-plane', effect: 'NoSchedule' }],
      pods: [],
      metrics: {
        cpu: { usage: 35, capacity: 100 },
        memory: { usage: 45, capacity: 100 },
        disk: { usage: 18, capacity: 100 }
      }
    },
    // Worker nodes
    {
      id: 'worker-node-1',
      name: 'worker-node-1',
      status: 'Ready',
      conditions: [
        {
          type: 'Ready',
          status: 'True',
          reason: 'KubeletReady',
          message: 'kubelet is posting ready status',
          lastTransitionTime: new Date()
        }
      ],
      capacity: { cpu: '16', memory: '32Gi', 'ephemeral-storage': '500Gi' },
      allocatable: { cpu: '15800m', memory: '31Gi', 'ephemeral-storage': '480Gi' },
      pods: [],
      metrics: {
        cpu: { usage: 65, capacity: 100 },
        memory: { usage: 72, capacity: 100 },
        disk: { usage: 34, capacity: 100 }
      }
    },
    {
      id: 'worker-node-2',
      name: 'worker-node-2',
      status: 'Ready',
      conditions: [
        {
          type: 'Ready',
          status: 'True',
          reason: 'KubeletReady',
          message: 'kubelet is posting ready status',
          lastTransitionTime: new Date()
        }
      ],
      capacity: { cpu: '16', memory: '32Gi', 'ephemeral-storage': '500Gi' },
      allocatable: { cpu: '15800m', memory: '31Gi', 'ephemeral-storage': '480Gi' },
      pods: [],
      metrics: {
        cpu: { usage: 58, capacity: 100 },
        memory: { usage: 68, capacity: 100 },
        disk: { usage: 29, capacity: 100 }
      }
    },
    {
      id: 'worker-node-3',
      name: 'worker-node-3',
      status: 'Ready',
      conditions: [
        {
          type: 'Ready',
          status: 'True',
          reason: 'KubeletReady',
          message: 'kubelet is posting ready status',
          lastTransitionTime: new Date()
        }
      ],
      capacity: { cpu: '16', memory: '32Gi', 'ephemeral-storage': '500Gi' },
      allocatable: { cpu: '15800m', memory: '31Gi', 'ephemeral-storage': '480Gi' },
      pods: [],
      metrics: {
        cpu: { usage: 42, capacity: 100 },
        memory: { usage: 55, capacity: 100 },
        disk: { usage: 25, capacity: 100 }
      }
    }
  ],
  pods: [
    // ===== DEFAULT NAMESPACE - Application Pods =====
    {
      id: 'nginx-deployment-abc123',
      name: 'nginx-deployment-abc123',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'nginx',
          image: 'nginx:1.21',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '128Mi' },
            limits: { cpu: '500m', memory: '256Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      lastRestart: new Date()
    },
    {
      id: 'backend-service-def456',
      name: 'backend-service-def456',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'backend',
          image: 'myapp/backend:v1.2.3',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '200m', memory: '256Mi' },
            limits: { cpu: '1000m', memory: '512Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      lastRestart: new Date()
    },
    {
      id: 'frontend-deployment-ghi789',
      name: 'frontend-deployment-ghi789',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'frontend',
          image: 'myapp/frontend:v2.1.0',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '150m', memory: '200Mi' },
            limits: { cpu: '800m', memory: '400Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      lastRestart: new Date()
    },
    {
      id: 'database-postgres-xyz123',
      name: 'database-postgres-xyz123',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'postgres',
          image: 'postgres:14',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '500m', memory: '1Gi' },
            limits: { cpu: '2000m', memory: '2Gi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      lastRestart: new Date()
    },
    {
      id: 'redis-cache-abc789',
      name: 'redis-cache-abc789',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'redis',
          image: 'redis:7-alpine',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '256Mi' },
            limits: { cpu: '500m', memory: '512Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      lastRestart: new Date()
    },
    {
      id: 'web-app-xyz123',
      name: 'web-app-xyz123',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'web',
          image: 'myapp/webapp:v1.2.3',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '200m', memory: '300Mi' },
            limits: { cpu: '1000m', memory: '600Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      lastRestart: new Date()
    },
    {
      id: 'app-pod-abc123',
      name: 'app-pod-abc123',
      namespace: 'default',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'app',
          image: 'myapp/microservice:latest',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '150m', memory: '200Mi' },
            limits: { cpu: '750m', memory: '400Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 5400000), // 1.5 hours ago
      lastRestart: new Date()
    },

    // ===== KUBE-SYSTEM NAMESPACE - Core Kubernetes Components =====
    // CoreDNS pods
    {
      id: 'coredns-558bd4d5db-abc12',
      name: 'coredns-558bd4d5db-abc12',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'coredns',
          image: 'registry.k8s.io/coredns/coredns:v1.10.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '70Mi' },
            limits: { cpu: '100m', memory: '170Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'coredns-558bd4d5db-def34',
      name: 'coredns-558bd4d5db-def34',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'coredns',
          image: 'registry.k8s.io/coredns/coredns:v1.10.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '70Mi' },
            limits: { cpu: '100m', memory: '170Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    // kube-proxy DaemonSet pods
    {
      id: 'kube-proxy-worker-1',
      name: 'kube-proxy-worker-1',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-proxy',
          image: 'registry.k8s.io/kube-proxy:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '50Mi' },
            limits: { cpu: '100m', memory: '100Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'kube-proxy-worker-2',
      name: 'kube-proxy-worker-2',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-proxy',
          image: 'registry.k8s.io/kube-proxy:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '50Mi' },
            limits: { cpu: '100m', memory: '100Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'kube-proxy-worker-3',
      name: 'kube-proxy-worker-3',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-proxy',
          image: 'registry.k8s.io/kube-proxy:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '50Mi' },
            limits: { cpu: '100m', memory: '100Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    // Control plane components
    {
      id: 'etcd-control-plane-1',
      name: 'etcd-control-plane-1',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'etcd',
          image: 'registry.k8s.io/etcd:3.5.9-0',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '100Mi' },
            limits: { cpu: '100m', memory: '100Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'control-plane-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'kube-apiserver-control-plane-1',
      name: 'kube-apiserver-control-plane-1',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-apiserver',
          image: 'registry.k8s.io/kube-apiserver:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '250m', memory: '256Mi' },
            limits: { cpu: '250m', memory: '256Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'control-plane-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'kube-controller-manager-control-plane-1',
      name: 'kube-controller-manager-control-plane-1',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-controller-manager',
          image: 'registry.k8s.io/kube-controller-manager:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '200m', memory: '256Mi' },
            limits: { cpu: '200m', memory: '256Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'control-plane-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },
    {
      id: 'kube-scheduler-control-plane-1',
      name: 'kube-scheduler-control-plane-1',
      namespace: 'kube-system',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'kube-scheduler',
          image: 'registry.k8s.io/kube-scheduler:v1.28.2',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '128Mi' },
            limits: { cpu: '100m', memory: '128Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'control-plane-1',
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      lastRestart: new Date()
    },

    // ===== INGRESS-NGINX NAMESPACE =====
    {
      id: 'ingress-nginx-controller-abc123',
      name: 'ingress-nginx-controller-abc123',
      namespace: 'ingress-nginx',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'controller',
          image: 'registry.k8s.io/ingress-nginx/controller:v1.8.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '90Mi' },
            limits: { cpu: '1000m', memory: '500Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },

    // ===== MONITORING NAMESPACE =====
    {
      id: 'prometheus-server-xyz789',
      name: 'prometheus-server-xyz789',
      namespace: 'monitoring',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'prometheus',
          image: 'prom/prometheus:v2.45.0',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '500m', memory: '1Gi' },
            limits: { cpu: '2000m', memory: '4Gi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },
    {
      id: 'grafana-dashboard-def456',
      name: 'grafana-dashboard-def456',
      namespace: 'monitoring',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'grafana',
          image: 'grafana/grafana:10.0.3',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '256Mi' },
            limits: { cpu: '500m', memory: '512Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },
    {
      id: 'node-exporter-worker-1',
      name: 'node-exporter-worker-1',
      namespace: 'monitoring',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'node-exporter',
          image: 'prom/node-exporter:v1.6.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '50m', memory: '64Mi' },
            limits: { cpu: '200m', memory: '128Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },
    {
      id: 'node-exporter-worker-2',
      name: 'node-exporter-worker-2',
      namespace: 'monitoring',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'node-exporter',
          image: 'prom/node-exporter:v1.6.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '50m', memory: '64Mi' },
            limits: { cpu: '200m', memory: '128Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },
    {
      id: 'node-exporter-worker-3',
      name: 'node-exporter-worker-3',
      namespace: 'monitoring',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'node-exporter',
          image: 'prom/node-exporter:v1.6.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '50m', memory: '64Mi' },
            limits: { cpu: '200m', memory: '128Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },

    // ===== LOGGING NAMESPACE =====
    {
      id: 'fluentd-worker-1',
      name: 'fluentd-worker-1',
      namespace: 'logging',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'fluentd',
          image: 'fluent/fluentd-kubernetes-daemonset:v1.16-debian-elasticsearch7-1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '100m', memory: '200Mi' },
            limits: { cpu: '500m', memory: '500Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-1',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },
    {
      id: 'elasticsearch-cluster-abc123',
      name: 'elasticsearch-cluster-abc123',
      namespace: 'logging',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'elasticsearch',
          image: 'docker.elastic.co/elasticsearch/elasticsearch:7.17.12',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '1000m', memory: '2Gi' },
            limits: { cpu: '2000m', memory: '4Gi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-2',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      lastRestart: new Date()
    },

    // ===== CERT-MANAGER NAMESPACE =====
    {
      id: 'cert-manager-controller-xyz789',
      name: 'cert-manager-controller-xyz789',
      namespace: 'cert-manager',
      status: 'Running',
      restartCount: 0,
      containers: [
        {
          name: 'cert-manager',
          image: 'quay.io/jetstack/cert-manager-controller:v1.13.1',
          status: 'Running',
          ready: true,
          restartCount: 0,
          resources: {
            requests: { cpu: '10m', memory: '32Mi' },
            limits: { cpu: '100m', memory: '128Mi' }
          }
        }
      ],
      events: [],
      logs: [],
      node: 'worker-node-3',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      lastRestart: new Date()
    }
  ],
  services: [],
  deployments: [
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'nginx-deployment',
        namespace: 'default',
        labels: { app: 'nginx' }
      },
      spec: {
        replicas: 3,
        selector: { matchLabels: { app: 'nginx' } },
        template: {
          metadata: { labels: { app: 'nginx' } },
          spec: {
            containers: [
              {
                name: 'nginx',
                image: 'nginx:latest',
                ports: [{ containerPort: 80 }]
              }
            ]
          }
        }
      },
      status: { replicas: 3, readyReplicas: 0, unavailableReplicas: 3 }
    }
  ],
  configMaps: [],
  secrets: [],
  events: [
    {
      id: 'event-1',
      type: 'Warning',
      reason: 'BackOff',
      message: 'Back-off restarting failed container',
      source: 'kubelet',
      firstTime: new Date(),
      lastTime: new Date(),
      count: 5,
      involvedObject: {
        kind: 'Pod',
        name: 'nginx-deployment-abc123',
        namespace: 'default'
      }
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: new Date(),
      level: 'ERROR',
      message: 'panic: missing environment variable DATABASE_URL',
      source: 'nginx-deployment-abc123',
      container: 'nginx'
    }
  ]
};

export const useDebuggingStore = create<DebuggingState>((set, get) => ({
  // Initial state
  currentScenario: null,
  clusterState: initialClusterState,
  simulationStatus: 'stopped',
  isLoading: false,
  commandHistory: [],
  currentDirectory: '/home/user',
  selectedResource: null,
  hintsUsed: 0,
  commandsExecuted: 0,
  timeElapsed: 0,
  scenarioProgress: 0,

  // Actions
  startScenario: async (scenarioId: string) => {
    console.log('🚀 Starting scenario:', scenarioId);
    set({ isLoading: true });

    try {
      // Simulate loading delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load scenario data
      const scenario = await loadScenario(scenarioId);
      console.log('📋 Loaded scenario:', scenario.name, 'with state:', scenario.initialState);

      set({
        currentScenario: scenario,
        clusterState: scenario.initialState,
        simulationStatus: 'running',
        hintsUsed: 0,
        commandsExecuted: 0,
        timeElapsed: 0,
        scenarioProgress: 0,
        commandHistory: [],
        isLoading: false
      });

      // Start fault injection
      injectFault(scenario.faultInjection);

      // Add scenario-specific welcome message
      const getScenarioWelcomeMessage = (scenario: DebugScenario) => {
        const baseMessage = `🎯 Scenario "${scenario.name}" loaded successfully!\n\n📋 Objectives:\n${scenario.objectives.map((obj, i) => `  ${i + 1}. ${obj}`).join('\n')}\n\n`;

        switch (scenario.id) {
          case 'crashloop-1':
            return baseMessage + `🔍 Current Issue: A pod is stuck in CrashLoopBackOff state\n💡 Start by running: kubectl get pods\n🚨 Look for pods with high restart counts!`;
          case 'imagepull-1':
            return baseMessage + `🔍 Current Issue: Pod cannot pull container image\n💡 Start by running: kubectl get pods\n🚨 Look for ImagePullBackOff status!`;
          case 'pod-pending-1':
            return baseMessage + `🔍 Current Issue: Pod is stuck in Pending state\n💡 Start by running: kubectl get pods\n🚨 Check why the pod isn't being scheduled!`;
          case 'service-unreachable-1':
            return baseMessage + `🔍 Current Issue: Service connectivity problems\n💡 Start by running: kubectl get services\n🚨 Check service endpoints and selectors!`;
          default:
            return baseMessage + `💡 Start by running: kubectl get pods`;
        }
      };

      const welcomeResult: CommandResult = {
        command: 'system',
        output: getScenarioWelcomeMessage(scenario),
        exitCode: 0,
        timestamp: new Date()
      };

      set(state => ({
        commandHistory: [welcomeResult]
      }));

    } catch (error) {
      console.error('Failed to start scenario:', error);
      set({ simulationStatus: 'error', isLoading: false });
    }
  },

  pauseSimulation: () => {
    set({ simulationStatus: 'paused' });
  },

  resumeSimulation: () => {
    set({ simulationStatus: 'running' });
  },

  resetScenario: () => {
    set({
      currentScenario: null,
      clusterState: initialClusterState,
      simulationStatus: 'stopped',
      commandHistory: [],
      selectedResource: null,
      hintsUsed: 0,
      commandsExecuted: 0,
      timeElapsed: 0,
      scenarioProgress: 0
    });
  },

  executeCommand: async (command: string) => {
    const state = get();
    const result = await simulateKubectlCommand(command, state.clusterState);

    set(prevState => ({
      commandHistory: [...prevState.commandHistory, result],
      commandsExecuted: prevState.commandsExecuted + 1
    }));

    // Check if this command might solve the scenario
    if (command.includes('apply') && state.currentScenario) {
      // Simulate scenario completion
      setTimeout(() => {
        const successResult: CommandResult = {
          command: 'system',
          output: `🎉✨ SCENARIO COMPLETED! ✨🎉

╔══════════════════════════════════════╗
║          🏆 CONGRATULATIONS! 🏆       ║
╚══════════════════════════════════════╝

✅ All objectives completed successfully!
✅ Pod is now running properly
✅ Issue resolved using best practices

📊 PERFORMANCE SUMMARY:
🏆 Scenario: ${state.currentScenario?.name}
⏱️  Time: ${Math.floor(state.timeElapsed / 60)}:${(state.timeElapsed % 60).toString().padStart(2, '0')}
🔧 Commands: ${state.commandsExecuted + 1}
💡 Hints: ${state.hintsUsed}
⭐ Efficiency: ${state.hintsUsed === 0 ? 'Perfect!' : state.hintsUsed <= 2 ? 'Excellent!' : 'Good!'}

🎯 SKILL LEVEL: ${state.currentScenario?.difficulty} Debugger
🚀 Ready for the next challenge? Click 'Scenarios' to continue!

Keep up the excellent debugging work! 🔧✨`,
          exitCode: 0,
          timestamp: new Date()
        };

        set(prevState => ({
          commandHistory: [...prevState.commandHistory, successResult],
          scenarioProgress: 100,
          simulationStatus: 'stopped' as const
        }));
      }, 2000);
    }

    return result;
  },

  updateClusterState: (updates: Partial<ClusterState>) => {
    set(state => ({
      clusterState: { ...state.clusterState, ...updates }
    }));
  },

  selectResource: (resource: K8sResource | null) => {
    set({ selectedResource: resource });
  },

  addLogEntry: (entry: LogEntry) => {
    set(state => ({
      clusterState: {
        ...state.clusterState,
        logs: [...state.clusterState.logs, entry]
      }
    }));
  },

  addEvent: (event: K8sEvent) => {
    set(state => ({
      clusterState: {
        ...state.clusterState,
        events: [...state.clusterState.events, event]
      }
    }));
  },

  updatePodStatus: (podId: string, status: PodState['status']) => {
    set(state => ({
      clusterState: {
        ...state.clusterState,
        pods: state.clusterState.pods.map(pod =>
          pod.id === podId ? { ...pod, status } : pod
        )
      }
    }));
  },

  updateNodeStatus: (nodeId: string, status: NodeState['status']) => {
    set(state => ({
      clusterState: {
        ...state.clusterState,
        nodes: state.clusterState.nodes.map(node =>
          node.id === nodeId ? { ...node, status } : node
        )
      }
    }));
  }
}));

// Helper functions
function createScenarioClusterState(scenarioId: string): ClusterState {
  // Create different cluster states based on scenario
  const baseState = { ...initialClusterState };

  // Helper function to generate scenario-specific events
  const generateScenarioEvents = (scenarioId: string): K8sEvent[] => {
    const baseTime = new Date();

    switch (scenarioId) {
      case 'crashloop-1':
        return [
          { id: 'event-1', type: 'Warning', reason: 'Failed', message: 'Error: missing environment variable DATABASE_URL', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 10000), count: 3, involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' } },
          { id: 'event-2', type: 'Warning', reason: 'BackOff', message: 'Back-off restarting failed container nginx in pod nginx-deployment-abc123', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 5000), count: 5, involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' } },
          { id: 'event-3', type: 'Warning', reason: 'FailedMount', message: 'Unable to attach or mount volumes: unmounted volumes=[config], unattached volumes=[config default-token]', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 20000), count: 1, involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' } },
          { id: 'event-4', type: 'Normal', reason: 'Pulling', message: 'Pulling image "nginx:latest"', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 15000), count: 1, involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' } },
          { id: 'event-5', type: 'Warning', reason: 'Unhealthy', message: 'Liveness probe failed: container not responding', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 2000), count: 2, involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' } }
        ];

      case 'imagepull-1':
        return [
          { id: 'event-1', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned default/frontend-deployment-ghi789 to worker-node-1', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 30000), count: 1, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-2', type: 'Normal', reason: 'Pulling', message: 'Pulling image "private-registry.com/myapp:latest"', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 25000), count: 1, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-3', type: 'Warning', reason: 'Failed', message: 'Failed to pull image "private-registry.com/myapp:latest": rpc error: code = Unknown desc = Error response from daemon: pull access denied', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 5000), count: 4, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-4', type: 'Warning', reason: 'FailedPullImage', message: 'Error: ImagePullBackOff', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 3000), count: 3, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-5', type: 'Warning', reason: 'BackOff', message: 'Back-off pulling image "private-registry.com/myapp:latest"', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 1000), count: 2, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } }
        ];

      case 'pod-pending-1':
        return [
          { id: 'event-1', type: 'Warning', reason: 'FailedScheduling', message: '0/3 nodes are available: 3 Insufficient cpu', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 10000), count: 8, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-2', type: 'Warning', reason: 'FailedScheduling', message: '0/3 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn\'t tolerate, 2 Insufficient cpu', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 15000), count: 5, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-3', type: 'Normal', reason: 'TriggeredScaleUp', message: 'pod triggered scale-up: [{worker-node-pool 2->3 (max: 5)}]', source: 'cluster-autoscaler', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 20000), count: 1, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-4', type: 'Warning', reason: 'FailedScheduling', message: 'pod has unbound immediate PersistentVolumeClaims', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 12000), count: 2, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } },
          { id: 'event-5', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned default/frontend-deployment-ghi789 to worker-node-3', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 10000), count: 1, involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' } }
        ];

      case 'service-unreachable-1':
        return [
          { id: 'event-1', type: 'Normal', reason: 'Created', message: 'Created service backend-service', source: 'service-controller', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 30000), count: 1, involvedObject: { kind: 'Service', name: 'backend-service-def456', namespace: 'default' } },
          { id: 'event-2', type: 'Warning', reason: 'SyncLoadBalancerFailed', message: 'Error syncing load balancer: failed to ensure load balancer: googleapi: Error 400: Invalid value for field \'resource.target\': \'projects/my-project/zones/us-central1-a/instances/gke-cluster-default-pool-12345678-abcd\'. Instance not found', source: 'service-controller', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 5000), count: 3, involvedObject: { kind: 'Service', name: 'backend-service-def456', namespace: 'default' } },
          { id: 'event-3', type: 'Warning', reason: 'NoEndpoints', message: 'No endpoints available for service backend-service', source: 'endpoints-controller', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 3000), count: 6, involvedObject: { kind: 'Service', name: 'backend-service-def456', namespace: 'default' } },
          { id: 'event-4', type: 'Warning', reason: 'FailedToUpdateEndpoint', message: 'Failed to update endpoint default/backend-service: Operation cannot be fulfilled on endpoints "backend-service": the object has been modified', source: 'endpoints-controller', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 8000), count: 2, involvedObject: { kind: 'Endpoints', name: 'backend-service-def456', namespace: 'default' } },
          { id: 'event-5', type: 'Normal', reason: 'UpdatedLoadBalancer', message: 'Updated load balancer with new hosts', source: 'service-controller', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 10000), count: 1, involvedObject: { kind: 'Service', name: 'backend-service-def456', namespace: 'default' } }
        ];

      case 'readiness-probe-1':
        return [
          { id: 'event-1', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned default/web-app-xyz123 to worker-node-2', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 30000), count: 1, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } },
          { id: 'event-2', type: 'Normal', reason: 'Pulled', message: 'Container image "webapp:v1.2.3" already present on machine', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 25000), count: 1, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } },
          { id: 'event-3', type: 'Normal', reason: 'Created', message: 'Created container web', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 20000), count: 1, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } },
          { id: 'event-4', type: 'Normal', reason: 'Started', message: 'Started container web', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 18000), lastTime: new Date(baseTime.getTime() - 18000), count: 1, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } },
          { id: 'event-5', type: 'Warning', reason: 'Unhealthy', message: 'Readiness probe failed: HTTP probe failed with statuscode: 404', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 2000), count: 7, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } },
          { id: 'event-6', type: 'Warning', reason: 'Unhealthy', message: 'Readiness probe failed: Get "http://10.244.1.15:8080/wrong-health": dial tcp 10.244.1.15:8080: connect: connection refused', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 1000), count: 4, involvedObject: { kind: 'Pod', name: 'web-app-xyz123', namespace: 'default' } }
        ];

      case 'dns-resolution-1':
        return [
          { id: 'event-1', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned default/app-pod-abc123 to worker-node-1', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 30000), lastTime: new Date(baseTime.getTime() - 30000), count: 1, involvedObject: { kind: 'Pod', name: 'app-pod-abc123', namespace: 'default' } },
          { id: 'event-2', type: 'Normal', reason: 'Pulled', message: 'Container image "myapp:latest" already present on machine', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 25000), lastTime: new Date(baseTime.getTime() - 25000), count: 1, involvedObject: { kind: 'Pod', name: 'app-pod-abc123', namespace: 'default' } },
          { id: 'event-3', type: 'Warning', reason: 'DNSConfigForming', message: 'Search Line limits were exceeded, some search paths have been omitted, the applied search line is: default.svc.cluster.local svc.cluster.local cluster.local', source: 'coredns', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 20000), count: 1, involvedObject: { kind: 'Pod', name: 'coredns-xyz789', namespace: 'kube-system' } },
          { id: 'event-4', type: 'Warning', reason: 'FailedDNSResolution', message: 'DNS resolution failed for database-service.default.svc.cluster.local: no such host', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 3000), count: 5, involvedObject: { kind: 'Pod', name: 'app-pod-abc123', namespace: 'default' } },
          { id: 'event-5', type: 'Warning', reason: 'NetworkNotReady', message: 'network is not ready: runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:docker: network plugin is not ready: cni config uninitialized', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 5000), count: 3, involvedObject: { kind: 'Node', name: 'worker-node-1', namespace: undefined } }
        ];

      default:
        return [
          { id: 'event-1', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned default/default-pod to worker-node-1', source: 'default-scheduler', firstTime: new Date(baseTime.getTime() - 20000), lastTime: new Date(baseTime.getTime() - 20000), count: 1, involvedObject: { kind: 'Pod', name: 'default-pod', namespace: 'default' } },
          { id: 'event-2', type: 'Normal', reason: 'Pulled', message: 'Container image "nginx:latest" already present on machine', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 15000), lastTime: new Date(baseTime.getTime() - 15000), count: 1, involvedObject: { kind: 'Pod', name: 'default-pod', namespace: 'default' } },
          { id: 'event-3', type: 'Normal', reason: 'Created', message: 'Created container app', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 10000), lastTime: new Date(baseTime.getTime() - 10000), count: 1, involvedObject: { kind: 'Pod', name: 'default-pod', namespace: 'default' } },
          { id: 'event-4', type: 'Normal', reason: 'Started', message: 'Started container app', source: 'kubelet', firstTime: new Date(baseTime.getTime() - 5000), lastTime: new Date(baseTime.getTime() - 5000), count: 1, involvedObject: { kind: 'Pod', name: 'default-pod', namespace: 'default' } }
        ];
    }
  };

  // Helper function to generate scenario-specific logs
  const generateScenarioLogs = (scenarioId: string): LogEntry[] => {
    const baseTime = new Date();
    const logs: LogEntry[] = [];

    switch (scenarioId) {
      case 'crashloop-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Starting nginx server...', source: 'nginx-deployment-abc123', container: 'nginx' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'ERROR', message: 'panic: missing environment variable DATABASE_URL', source: 'nginx-deployment-abc123', container: 'nginx' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'ERROR', message: 'Failed to initialize application', source: 'nginx-deployment-abc123', container: 'nginx' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'ERROR', message: 'Container exiting with code 1', source: 'nginx-deployment-abc123', container: 'nginx' },
          { id: 'log-5', timestamp: new Date(baseTime.getTime() - 10000), level: 'WARN', message: 'Restarting container due to failure', source: 'nginx-deployment-abc123', container: 'nginx' }
        ];

      case 'imagepull-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Attempting to pull image: private-registry.com/myapp:latest', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'ERROR', message: 'Failed to pull image "private-registry.com/myapp:latest": rpc error: code = Unknown desc = Error response from daemon: pull access denied', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'ERROR', message: 'Error: ImagePullBackOff', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'WARN', message: 'Back-off pulling image "private-registry.com/myapp:latest"', source: 'frontend-deployment-ghi789', container: 'frontend' }
        ];

      case 'pod-pending-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Pod scheduled to node worker-node-1', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'WARN', message: 'Insufficient CPU resources on node', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'ERROR', message: 'Failed to schedule pod: Insufficient cpu', source: 'frontend-deployment-ghi789', container: 'frontend' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'INFO', message: 'Waiting for node resources to become available', source: 'frontend-deployment-ghi789', container: 'frontend' }
        ];

      case 'service-unreachable-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Service backend-service started successfully', source: 'backend-service-def456', container: 'backend' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'ERROR', message: 'Connection refused: No endpoints available for service', source: 'backend-service-def456', container: 'backend' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'WARN', message: 'Service selector does not match any pods', source: 'backend-service-def456', container: 'backend' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'ERROR', message: 'Health check failed: service unreachable', source: 'backend-service-def456', container: 'backend' }
        ];

      case 'readiness-probe-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Application started successfully', source: 'web-app-xyz123', container: 'web' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'WARN', message: 'Readiness probe failed: HTTP probe failed with statuscode: 404', source: 'web-app-xyz123', container: 'web' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'ERROR', message: 'GET /wrong-health returned 404 Not Found', source: 'web-app-xyz123', container: 'web' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'INFO', message: 'Correct health endpoint is /health, not /wrong-health', source: 'web-app-xyz123', container: 'web' }
        ];

      case 'dns-resolution-1':
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Attempting to connect to database service', source: 'app-pod-abc123', container: 'app' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 25000), level: 'ERROR', message: 'DNS resolution failed: no such host "database-service.default.svc.cluster.local"', source: 'app-pod-abc123', container: 'app' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 20000), level: 'ERROR', message: 'CoreDNS configuration error detected', source: 'coredns-xyz789', container: 'coredns' },
          { id: 'log-4', timestamp: new Date(baseTime.getTime() - 15000), level: 'WARN', message: 'Falling back to external DNS resolver', source: 'app-pod-abc123', container: 'app' }
        ];

      default:
        // Return default logs for unknown scenarios
        return [
          { id: 'log-1', timestamp: new Date(baseTime.getTime() - 30000), level: 'INFO', message: 'Application starting...', source: 'default-pod', container: 'app' },
          { id: 'log-2', timestamp: new Date(baseTime.getTime() - 20000), level: 'INFO', message: 'System initialized successfully', source: 'default-pod', container: 'app' },
          { id: 'log-3', timestamp: new Date(baseTime.getTime() - 10000), level: 'INFO', message: 'Ready to serve traffic', source: 'default-pod', container: 'app' }
        ];
    }
  };

  switch (scenarioId) {
    case 'crashloop-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'nginx-deployment-abc123'
            ? { ...pod, status: 'CrashLoopBackOff', restartCount: 5, events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    case 'imagepull-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'frontend-deployment-ghi789'
            ? { ...pod, status: 'ImagePullBackOff', restartCount: 0, events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    case 'pod-pending-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'frontend-deployment-ghi789'
            ? { ...pod, status: 'Pending', restartCount: 0, events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    case 'service-unreachable-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'backend-service-def456'
            ? { ...pod, status: 'Running', events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    case 'readiness-probe-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'web-app-xyz123'
            ? { ...pod, status: 'Running', events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    case 'dns-resolution-1':
      return {
        ...baseState,
        pods: baseState.pods.map(pod =>
          pod.name === 'app-pod-abc123'
            ? { ...pod, status: 'Running', events: generateScenarioEvents(scenarioId).filter(e => e.source === pod.name) }
            : pod
        ),
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };

    default:
      return {
        ...baseState,
        events: generateScenarioEvents(scenarioId),
        logs: generateScenarioLogs(scenarioId)
      };
  }
}

async function loadScenario(scenarioId: string): Promise<DebugScenario> {
  // All 43 scenarios based on the log_debug.txt file
  const scenarios: Record<string, DebugScenario> = {
    // Level 1: Pod-Level Debugging
    'crashloop-1': {
      id: scenarioId,
      name: 'CrashLoopBackOff Mystery',
      description: 'Pod starts, crashes repeatedly due to missing environment variable',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '10-15 minutes',
      objectives: [
        'Check container logs for stack trace or segfault',
        'Use kubectl describe pod to examine events',
        'Fix entrypoint or missing environment variable',
        'Verify pod reaches Running state'
      ],
      initialState: createScenarioClusterState(scenarioId),
      faultInjection: { type: 'missing-env-var', target: 'nginx-deployment', parameters: { envVar: 'DATABASE_URL' } },
      successCriteria: { conditions: [{ type: 'pod-status', target: 'nginx-*', expected: 'Running' }] },
      hints: [
        { id: '1', trigger: 'pod-crashloop', message: 'Check the pod logs to see what error is causing the crash', command: 'kubectl logs nginx-deployment-abc123', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl describe pod', 'kubectl logs']
    },

    'imagepull-1': {
      id: scenarioId,
      name: 'ImagePullBackOff Challenge',
      description: 'Kubernetes cannot pull container image from private registry',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '8-12 minutes',
      objectives: [
        'Identify ImagePullBackOff error in pod status',
        'Check image name and registry access',
        'Validate or create image pull secrets',
        'Verify pod can pull image successfully'
      ],
      initialState: createScenarioClusterState(scenarioId),
      faultInjection: { type: 'image-pull-error', target: 'private-registry', parameters: { missingSecret: true } },
      successCriteria: { conditions: [{ type: 'pod-status', target: 'app-*', expected: 'Running' }] },
      hints: [
        { id: '1', trigger: 'image-pull-fail', message: 'Check if the image exists and credentials are correct', command: 'kubectl describe pod <pod-name>', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl describe pod', 'kubectl get secrets']
    },

    'pod-pending-1': {
      id: scenarioId,
      name: 'Pod Stuck Pending',
      description: 'Pod scheduled but not running due to resource constraints',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '12-18 minutes',
      objectives: [
        'Check why pod is in Pending state',
        'Examine node availability and taints',
        'Verify resource requests vs available resources',
        'Fix scheduling constraints'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'insufficient-resources', target: 'worker-nodes', parameters: { cpuShortage: true } },
      successCriteria: { conditions: [{ type: 'pod-status', target: 'pending-*', expected: 'Running' }] },
      hints: [
        { id: '1', trigger: 'pod-pending', message: 'Check node conditions and available resources', command: 'kubectl describe nodes', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl describe pod', 'kubectl get nodes', 'kubectl describe nodes']
    },

    // Level 2: Service and Networking Issues
    'service-unreachable-1': {
      id: scenarioId,
      name: 'Service Not Reachable',
      description: 'Application cannot reach other service due to wrong selector',
      category: 'networking',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Test service connectivity between pods',
        'Validate service name and selectors',
        'Check service ports and endpoints',
        'Fix service configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'service-selector-mismatch', target: 'backend-service', parameters: { wrongSelector: true } },
      successCriteria: { conditions: [{ type: 'service-connectivity', target: 'backend-service', expected: 'reachable' }] },
      hints: [
        { id: '1', trigger: 'connection-refused', message: 'Check if service has endpoints', command: 'kubectl get endpoints', priority: 1 }
      ],
      commands: ['kubectl get services', 'kubectl get endpoints', 'kubectl describe service']
    },

    'readiness-probe-1': {
      id: scenarioId,
      name: 'Readiness Probe Failing',
      description: 'Service marked as not ready due to incorrect probe configuration',
      category: 'networking',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 minutes',
      objectives: [
        'Check readiness probe configuration',
        'Verify probe path and port are correct',
        'Adjust probe timing if needed',
        'Ensure service receives traffic'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'readiness-probe-fail', target: 'web-app', parameters: { wrongPath: '/wrong-health' } },
      successCriteria: { conditions: [{ type: 'pod-ready', target: 'web-*', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'probe-fail', message: 'Check the readiness probe path and port', command: 'kubectl describe pod <pod-name>', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl describe pod', 'kubectl logs']
    },

    'dns-failure-1': {
      id: scenarioId,
      name: 'DNS Resolution Fails',
      description: 'Pod cannot resolve internal service names due to CoreDNS issues',
      category: 'networking',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Test DNS resolution from within pods',
        'Check CoreDNS pod status and logs',
        'Verify DNS configuration',
        'Fix DNS resolution issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'dns-failure', target: 'coredns', parameters: { configError: true } },
      successCriteria: { conditions: [{ type: 'dns-resolution', target: 'internal-services', expected: 'working' }] },
      hints: [
        { id: '1', trigger: 'dns-fail', message: 'Check CoreDNS pods in kube-system namespace', command: 'kubectl get pods -n kube-system', priority: 1 }
      ],
      commands: ['kubectl get pods -n kube-system', 'kubectl logs -n kube-system', 'kubectl exec -- nslookup']
    },

    // Level 3: Node & Scheduling Issues
    'node-resources-1': {
      id: scenarioId,
      name: 'Node Out of Resources',
      description: 'Pods evicted due to memory pressure on nodes',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 minutes',
      objectives: [
        'Identify resource pressure on nodes',
        'Check node conditions and capacity',
        'Analyze resource requests vs limits',
        'Implement proper resource management'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'memory-pressure', target: 'worker-nodes', parameters: { memoryExhausted: true } },
      successCriteria: { conditions: [{ type: 'node-pressure', target: 'all-nodes', expected: 'normal' }] },
      hints: [
        { id: '1', trigger: 'evicted-pods', message: 'Check node conditions for memory pressure', command: 'kubectl describe nodes', priority: 1 }
      ],
      commands: ['kubectl get nodes', 'kubectl describe nodes', 'kubectl top nodes', 'kubectl get pods --field-selector=status.phase=Failed']
    },

    'taints-tolerations-1': {
      id: scenarioId,
      name: 'Taints and Tolerations Mismatch',
      description: 'Pod not scheduled due to node taints without matching tolerations',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Check why pod is not being scheduled',
        'Examine node taints and pod tolerations',
        'Add appropriate tolerations to pod spec',
        'Verify pod gets scheduled successfully'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'taint-mismatch', target: 'worker-nodes', parameters: { taint: 'special=true:NoSchedule' } },
      successCriteria: { conditions: [{ type: 'pod-scheduled', target: 'special-*', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'not-scheduled', message: 'Check node taints and pod tolerations', command: 'kubectl describe nodes', priority: 1 }
      ],
      commands: ['kubectl get nodes', 'kubectl describe nodes', 'kubectl describe pod']
    },

    'hostport-conflict-1': {
      id: scenarioId,
      name: 'Host Port Conflict',
      description: 'Pod fails to start due to host port already in use',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 minutes',
      objectives: [
        'Identify host port binding error',
        'Check which process is using the port',
        'Modify pod to use different port or DaemonSet',
        'Ensure pod starts successfully'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'hostport-conflict', target: 'monitoring-pod', parameters: { conflictingPort: 9090 } },
      successCriteria: { conditions: [{ type: 'pod-status', target: 'monitoring-*', expected: 'Running' }] },
      hints: [
        { id: '1', trigger: 'port-conflict', message: 'Check if hostPort is already in use on the node', command: 'kubectl describe pod <pod-name>', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl describe pod', 'kubectl get daemonsets']
    },

    // Level 4: Persistent Storage and Security
    'pvc-pending-1': {
      id: scenarioId,
      name: 'PVC Stuck in Pending',
      description: 'Persistent Volume Claim cannot be bound due to storage issues',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Check PVC status and events',
        'Verify storage class configuration',
        'Check persistent volume availability',
        'Fix volume provisioning issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'pvc-binding-fail', target: 'database-pvc', parameters: { noStorageClass: true } },
      successCriteria: { conditions: [{ type: 'pvc-status', target: 'database-pvc', expected: 'Bound' }] },
      hints: [
        { id: '1', trigger: 'pvc-pending', message: 'Check storage class and available persistent volumes', command: 'kubectl get pv,pvc', priority: 1 }
      ],
      commands: ['kubectl get pvc', 'kubectl describe pvc', 'kubectl get pv', 'kubectl get storageclass']
    },

    'volume-permissions-1': {
      id: scenarioId,
      name: 'Volume Mount Permission Denied',
      description: 'Pod starts but fails to read/write to mounted volume',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 minutes',
      objectives: [
        'Identify permission denied errors in logs',
        'Check volume mount permissions',
        'Configure fsGroup or runAsUser',
        'Verify application can access volume'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'volume-permissions', target: 'data-volume', parameters: { wrongPermissions: true } },
      successCriteria: { conditions: [{ type: 'volume-access', target: 'app-*', expected: 'writable' }] },
      hints: [
        { id: '1', trigger: 'permission-denied', message: 'Check fsGroup and volume permissions', command: 'kubectl logs <pod-name>', priority: 1 }
      ],
      commands: ['kubectl logs', 'kubectl describe pod', 'kubectl exec -- ls -la']
    },

    'secret-missing-1': {
      id: scenarioId,
      name: 'Secret or ConfigMap Not Found',
      description: 'Pod fails due to missing secret or configmap reference',
      category: 'storage',
      difficulty: 'Beginner',
      estimatedTime: '8-12 minutes',
      objectives: [
        'Identify missing secret/configmap error',
        'Check if referenced resources exist',
        'Create missing secret or configmap',
        'Verify pod starts successfully'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'missing-secret', target: 'app-secrets', parameters: { secretName: 'database-credentials' } },
      successCriteria: { conditions: [{ type: 'pod-status', target: 'app-*', expected: 'Running' }] },
      hints: [
        { id: '1', trigger: 'secret-not-found', message: 'Check if the referenced secret exists', command: 'kubectl get secrets', priority: 1 }
      ],
      commands: ['kubectl get secrets', 'kubectl get configmaps', 'kubectl describe pod']
    },

    // Level 5: Ingress, Controllers, and Mesh
    'ingress-404-1': {
      id: scenarioId,
      name: 'Ingress Returns 404 or 502',
      description: 'Frontend unreachable due to ingress configuration issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Check ingress controller logs',
        'Validate backend service configuration',
        'Verify TLS secrets and annotations',
        'Fix ingress routing rules'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'ingress-misconfiguration', target: 'web-ingress', parameters: { wrongBackend: true } },
      successCriteria: { conditions: [{ type: 'ingress-response', target: 'web-ingress', expected: '200' }] },
      hints: [
        { id: '1', trigger: 'ingress-404', message: 'Check ingress controller logs for routing errors', command: 'kubectl logs -n ingress-nginx', priority: 1 }
      ],
      commands: ['kubectl get ingress', 'kubectl describe ingress', 'kubectl logs -n ingress-nginx']
    },

    'sidecar-injection-1': {
      id: scenarioId,
      name: 'Sidecar Injection Breaks Pod',
      description: 'App fails due to missing or misconfigured service mesh sidecar',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Check sidecar injection status',
        'Examine init container logs',
        'Verify mesh labels and annotations',
        'Fix sidecar configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'sidecar-injection-fail', target: 'istio-proxy', parameters: { injectionFailed: true } },
      successCriteria: { conditions: [{ type: 'sidecar-ready', target: 'app-*', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'sidecar-fail', message: 'Check istio-proxy container logs and injection labels', command: 'kubectl logs <pod-name> -c istio-proxy', priority: 1 }
      ],
      commands: ['kubectl get pods', 'kubectl logs -c istio-proxy', 'kubectl describe pod']
    },

    'operator-reconcile-1': {
      id: scenarioId,
      name: 'Operator Does Not Reconcile',
      description: 'Custom resource ignored due to operator issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Check custom resource status',
        'Examine operator logs for errors',
        'Verify CRD version compatibility',
        'Fix operator permissions or configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'operator-fail', target: 'custom-operator', parameters: { crdVersionMismatch: true } },
      successCriteria: { conditions: [{ type: 'cr-reconciled', target: 'custom-resource', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'operator-ignore', message: 'Check operator logs and CRD versions', command: 'kubectl logs -n operator-system', priority: 1 }
      ],
      commands: ['kubectl get crd', 'kubectl logs -n operator-system', 'kubectl describe <custom-resource>']
    },

    // Level 6: CI/CD, Monitoring, and Time
    'job-cronjob-fail-1': {
      id: scenarioId,
      name: 'Job or CronJob Fails',
      description: 'One-time job crashes with no clear error message',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Check job status and pod logs',
        'Verify job command and image',
        'Check job completion conditions',
        'Fix job configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'job-failure', target: 'backup-job', parameters: { wrongCommand: true } },
      successCriteria: { conditions: [{ type: 'job-status', target: 'backup-job', expected: 'Complete' }] },
      hints: [
        { id: '1', trigger: 'job-fail', message: 'Check job pod logs for the actual error', command: 'kubectl logs job/backup-job', priority: 1 }
      ],
      commands: ['kubectl get jobs', 'kubectl describe job', 'kubectl logs job/<job-name>']
    },

    'prometheus-scraping-1': {
      id: scenarioId,
      name: 'Prometheus Not Scraping',
      description: 'Metrics missing due to scrape configuration issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '18-25 minutes',
      objectives: [
        'Check Prometheus targets status',
        'Verify service monitor configuration',
        'Check metrics endpoint accessibility',
        'Fix scrape configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'prometheus-scrape-fail', target: 'app-metrics', parameters: { wrongLabels: true } },
      successCriteria: { conditions: [{ type: 'metrics-scraped', target: 'app-metrics', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'metrics-missing', message: 'Check Prometheus targets page for scrape errors', command: 'kubectl port-forward svc/prometheus 9090:9090', priority: 1 }
      ],
      commands: ['kubectl get servicemonitor', 'kubectl describe servicemonitor', 'kubectl port-forward']
    },

    'time-sync-1': {
      id: scenarioId,
      name: 'Time Sync Issues',
      description: 'Logs out of order and JWT token errors due to clock skew',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Check node time synchronization',
        'Verify NTP configuration',
        'Check JWT token validation errors',
        'Fix time drift issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'time-skew', target: 'worker-nodes', parameters: { clockDrift: '5m' } },
      successCriteria: { conditions: [{ type: 'time-sync', target: 'all-nodes', expected: 'synchronized' }] },
      hints: [
        { id: '1', trigger: 'jwt-invalid', message: 'Check node time and NTP synchronization', command: 'kubectl exec <pod> -- date', priority: 1 }
      ],
      commands: ['kubectl exec -- date', 'kubectl describe nodes', 'kubectl logs']
    },

    // Level 7: Advanced Multi-Component Scenarios
    'multi-component-1': {
      id: scenarioId,
      name: 'Multi-Component Failure',
      description: 'Database, cache, and app all failing in cascade',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '30-40 minutes',
      objectives: [
        'Identify the root cause of cascade failure',
        'Check dependencies between components',
        'Fix issues in correct order',
        'Verify entire stack is healthy'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'cascade-failure', target: 'full-stack', parameters: { rootCause: 'database-connection' } },
      successCriteria: { conditions: [{ type: 'stack-health', target: 'all-components', expected: 'healthy' }] },
      hints: [
        { id: '1', trigger: 'cascade-fail', message: 'Start with the database layer and work up the stack', command: 'kubectl get pods -l tier=database', priority: 1 }
      ],
      commands: ['kubectl get pods --all-namespaces', 'kubectl logs', 'kubectl describe']
    },

    'network-policy-1': {
      id: scenarioId,
      name: 'Network Policy Blocking Traffic',
      description: 'Microservices cannot communicate due to restrictive policies',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Test connectivity between services',
        'Check network policy rules',
        'Identify blocked traffic patterns',
        'Update policies to allow required traffic'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'network-policy-block', target: 'microservices', parameters: { denyAll: true } },
      successCriteria: { conditions: [{ type: 'service-connectivity', target: 'microservices', expected: 'allowed' }] },
      hints: [
        { id: '1', trigger: 'connection-timeout', message: 'Check network policies affecting pod communication', command: 'kubectl get networkpolicy', priority: 1 }
      ],
      commands: ['kubectl get networkpolicy', 'kubectl describe networkpolicy', 'kubectl exec -- curl']
    },

    'rbac-permissions-1': {
      id: scenarioId,
      name: 'RBAC Permission Denied',
      description: 'Service account lacks permissions for required operations',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Identify permission denied errors',
        'Check service account and role bindings',
        'Verify required permissions',
        'Fix RBAC configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'rbac-denied', target: 'service-account', parameters: { missingPermissions: ['get', 'list'] } },
      successCriteria: { conditions: [{ type: 'rbac-access', target: 'service-account', expected: 'allowed' }] },
      hints: [
        { id: '1', trigger: 'forbidden-403', message: 'Check service account permissions and role bindings', command: 'kubectl auth can-i --list --as=system:serviceaccount:default:my-sa', priority: 1 }
      ],
      commands: ['kubectl get serviceaccounts', 'kubectl get rolebindings', 'kubectl auth can-i']
    },

    'resource-quota-1': {
      id: scenarioId,
      name: 'Resource Quota Exceeded',
      description: 'New pods cannot be created due to namespace quotas',
      category: 'advanced',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Check resource quota status',
        'Identify which resources are exhausted',
        'Adjust quotas or reduce resource usage',
        'Verify new pods can be created'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'quota-exceeded', target: 'namespace-quota', parameters: { cpuLimit: 'exceeded' } },
      successCriteria: { conditions: [{ type: 'pod-creation', target: 'new-pods', expected: 'successful' }] },
      hints: [
        { id: '1', trigger: 'quota-exceeded', message: 'Check resource quota usage in the namespace', command: 'kubectl describe quota', priority: 1 }
      ],
      commands: ['kubectl get quota', 'kubectl describe quota', 'kubectl top pods']
    },

    'admission-webhook-1': {
      id: scenarioId,
      name: 'Admission Webhook Blocking',
      description: 'Pods rejected by validating admission webhook',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Identify webhook rejection errors',
        'Check webhook configuration',
        'Validate webhook endpoint health',
        'Fix webhook rules or pod spec'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'admission-webhook-reject', target: 'security-webhook', parameters: { strictPolicy: true } },
      successCriteria: { conditions: [{ type: 'pod-admission', target: 'new-pods', expected: 'accepted' }] },
      hints: [
        { id: '1', trigger: 'admission-denied', message: 'Check validating admission webhook logs', command: 'kubectl get validatingadmissionwebhook', priority: 1 }
      ],
      commands: ['kubectl get validatingadmissionwebhook', 'kubectl describe pod', 'kubectl logs']
    },

    // Bonus Scenarios
    'etcd-corruption-1': {
      id: scenarioId,
      name: 'ETCD Data Corruption',
      description: 'Cluster state inconsistent due to etcd issues',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '40-50 minutes',
      objectives: [
        'Identify etcd health issues',
        'Check cluster state consistency',
        'Perform etcd backup and restore',
        'Verify cluster functionality'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'etcd-corruption', target: 'etcd-cluster', parameters: { dataCorruption: true } },
      successCriteria: { conditions: [{ type: 'cluster-health', target: 'etcd', expected: 'healthy' }] },
      hints: [
        { id: '1', trigger: 'etcd-error', message: 'Check etcd pod logs and cluster health', command: 'kubectl get pods -n kube-system -l component=etcd', priority: 1 }
      ],
      commands: ['kubectl get pods -n kube-system', 'kubectl logs -n kube-system', 'etcdctl endpoint health']
    },

    'oom-killer-1': {
      id: scenarioId,
      name: 'OOM Killer Strikes',
      description: 'Pods killed by OOM killer due to memory limits',
      category: 'advanced',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Identify OOM killed containers',
        'Check memory usage patterns',
        'Adjust memory limits appropriately',
        'Prevent future OOM kills'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'oom-kill', target: 'memory-hungry-app', parameters: { memoryLeak: true } },
      successCriteria: { conditions: [{ type: 'memory-stable', target: 'app-pods', expected: 'true' }] },
      hints: [
        { id: '1', trigger: 'oom-killed', message: 'Check container exit codes and memory usage', command: 'kubectl describe pod <pod-name>', priority: 1 }
      ],
      commands: ['kubectl describe pod', 'kubectl top pods', 'kubectl logs --previous']
    },

    // Additional Advanced Scenarios (26-43)
    'admission-webhook-fail-1': {
      id: scenarioId,
      name: 'Admission Webhook Failing',
      description: 'Resource validation blocked by webhook timeout or TLS errors',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Identify webhook rejection errors',
        'Check webhook URL and service',
        'Validate TLS certificates',
        'Fix webhook configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'webhook-timeout', target: 'admission-webhook', parameters: { tlsError: true } },
      successCriteria: { conditions: [{ type: 'webhook-response', target: 'admission-webhook', expected: 'success' }] },
      hints: [
        { id: '1', trigger: 'webhook-timeout', message: 'Check webhook service and TLS certificates', command: 'kubectl get validatingadmissionwebhook', priority: 1 }
      ],
      commands: ['kubectl get validatingadmissionwebhook', 'kubectl describe service', 'kubectl logs']
    },

    'init-container-timeout-1': {
      id: scenarioId,
      name: 'Init Container Timeout',
      description: 'Init container never finishes, blocking main container startup',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Examine init container logs',
        'Check network access and dependencies',
        'Identify hanging processes',
        'Fix init container configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'init-timeout', target: 'init-container', parameters: { networkBlocked: true } },
      successCriteria: { conditions: [{ type: 'init-complete', target: 'init-container', expected: 'success' }] },
      hints: [
        { id: '1', trigger: 'init-hang', message: 'Check init container logs for network or dependency issues', command: 'kubectl logs <pod-name> -c <init-container>', priority: 1 }
      ],
      commands: ['kubectl logs -c <init-container>', 'kubectl describe pod', 'kubectl exec -- netstat']
    },

    'fluentd-errors-1': {
      id: scenarioId,
      name: 'Fluentd/Log Forwarder Errors',
      description: 'Logs missing from central system due to forwarder issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Check fluentd configuration',
        'Validate output sink connectivity',
        'Verify file access permissions',
        'Fix log forwarding pipeline'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'log-forwarder-fail', target: 'fluentd', parameters: { sinkUnreachable: true } },
      successCriteria: { conditions: [{ type: 'logs-forwarded', target: 'central-logging', expected: 'success' }] },
      hints: [
        { id: '1', trigger: 'logs-missing', message: 'Check fluentd logs for connection or parsing errors', command: 'kubectl logs -n kube-system -l app=fluentd', priority: 1 }
      ],
      commands: ['kubectl logs -n kube-system', 'kubectl describe configmap', 'kubectl exec -- curl']
    },

    'kubelet-resource-leak-1': {
      id: scenarioId,
      name: 'Kubelet Resource Leak',
      description: 'Node slowly becomes unstable due to kubelet memory issues',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '30-40 minutes',
      objectives: [
        'Identify kubelet memory leaks',
        'Check garbage collection settings',
        'Tune cadvisor configuration',
        'Implement cleanup strategies'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'kubelet-leak', target: 'kubelet', parameters: { memoryLeak: true } },
      successCriteria: { conditions: [{ type: 'kubelet-stable', target: 'worker-nodes', expected: 'stable' }] },
      hints: [
        { id: '1', trigger: 'node-unstable', message: 'Check kubelet logs and memory usage patterns', command: 'kubectl logs -n kube-system kubelet', priority: 1 }
      ],
      commands: ['kubectl logs -n kube-system', 'kubectl top nodes', 'kubectl describe nodes']
    },

    'cloud-provider-issues-1': {
      id: scenarioId,
      name: 'Cloud Provider Integration Issues',
      description: 'LoadBalancer stuck or volumes not attaching due to cloud API errors',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Check cloud controller logs',
        'Verify IAM permissions',
        'Validate cloud region settings',
        'Fix cloud provider integration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'cloud-api-error', target: 'cloud-controller', parameters: { iamError: true } },
      successCriteria: { conditions: [{ type: 'cloud-integration', target: 'loadbalancer', expected: 'active' }] },
      hints: [
        { id: '1', trigger: 'lb-stuck', message: 'Check cloud controller manager logs for API errors', command: 'kubectl logs -n kube-system cloud-controller-manager', priority: 1 }
      ],
      commands: ['kubectl logs -n kube-system', 'kubectl get services', 'kubectl describe service']
    },

    'liveness-probe-failure-1': {
      id: scenarioId,
      name: 'Liveness Probe Failure',
      description: 'Pod restarted repeatedly despite app working intermittently',
      category: 'pod-issues',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 minutes',
      objectives: [
        'Check liveness probe configuration',
        'Analyze probe timing and thresholds',
        'Confirm endpoint behavior',
        'Adjust probe settings'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'liveness-probe-fail', target: 'web-app', parameters: { probeTimeout: true } },
      successCriteria: { conditions: [{ type: 'probe-success', target: 'liveness-probe', expected: 'passing' }] },
      hints: [
        { id: '1', trigger: 'restart-loop', message: 'Check liveness probe timing and endpoint response', command: 'kubectl describe pod <pod-name>', priority: 1 }
      ],
      commands: ['kubectl describe pod', 'kubectl logs', 'kubectl exec -- curl']
    },

    'hpa-not-scaling-1': {
      id: scenarioId,
      name: 'HPA Not Scaling',
      description: 'App under load but no pods added due to metrics issues',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '18-25 minutes',
      objectives: [
        'Check metrics-server status',
        'Verify HPA configuration',
        'Confirm metrics are exposed',
        'Fix autoscaling issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'hpa-metrics-fail', target: 'metrics-server', parameters: { metricsUnavailable: true } },
      successCriteria: { conditions: [{ type: 'hpa-scaling', target: 'web-app', expected: 'scaling' }] },
      hints: [
        { id: '1', trigger: 'no-scaling', message: 'Check if metrics-server is running and HPA can fetch metrics', command: 'kubectl get hpa', priority: 1 }
      ],
      commands: ['kubectl get hpa', 'kubectl describe hpa', 'kubectl top pods', 'kubectl get pods -n kube-system']
    },

    'configmap-not-propagating-1': {
      id: scenarioId,
      name: 'ConfigMap Changes Not Propagating',
      description: 'App uses outdated config after ConfigMap changes',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 minutes',
      objectives: [
        'Check ConfigMap mount configuration',
        'Verify subPath settings',
        'Restart pods if needed',
        'Ensure config propagation'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'configmap-stale', target: 'app-config', parameters: { subPathIssue: true } },
      successCriteria: { conditions: [{ type: 'config-updated', target: 'app-pods', expected: 'latest' }] },
      hints: [
        { id: '1', trigger: 'stale-config', message: 'ConfigMaps with subPath do not auto-update, restart pod', command: 'kubectl rollout restart deployment', priority: 1 }
      ],
      commands: ['kubectl get configmap', 'kubectl describe pod', 'kubectl rollout restart']
    },

    'node-disk-pressure-1': {
      id: scenarioId,
      name: 'Node Disk Pressure',
      description: 'Pods evicted unexpectedly due to disk space issues',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Check node disk usage',
        'Identify disk pressure conditions',
        'Clean up unnecessary files',
        'Prevent future disk issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'disk-pressure', target: 'worker-nodes', parameters: { diskFull: true } },
      successCriteria: { conditions: [{ type: 'disk-space', target: 'worker-nodes', expected: 'available' }] },
      hints: [
        { id: '1', trigger: 'pod-evicted', message: 'Check node conditions and disk usage', command: 'kubectl describe nodes', priority: 1 }
      ],
      commands: ['kubectl describe nodes', 'kubectl get events', 'kubectl exec -- df -h']
    },

    'daemonset-not-running-1': {
      id: scenarioId,
      name: 'DaemonSet Not Running on All Nodes',
      description: 'DaemonSet skipped on some nodes due to tolerations or selectors',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 minutes',
      objectives: [
        'Check DaemonSet pod distribution',
        'Verify node selectors and tolerations',
        'Fix scheduling constraints',
        'Ensure DaemonSet runs on all nodes'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'daemonset-skip', target: 'monitoring-daemonset', parameters: { tolerationMissing: true } },
      successCriteria: { conditions: [{ type: 'daemonset-complete', target: 'monitoring-daemonset', expected: 'all-nodes' }] },
      hints: [
        { id: '1', trigger: 'missing-pods', message: 'Check DaemonSet tolerations and node taints', command: 'kubectl describe daemonset', priority: 1 }
      ],
      commands: ['kubectl get daemonset', 'kubectl describe daemonset', 'kubectl describe nodes']
    },

    'api-server-down-1': {
      id: scenarioId,
      name: 'API Server Down or Unreachable',
      description: 'kubectl not responding, cluster components stuck',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '35-45 minutes',
      objectives: [
        'Diagnose API server connectivity',
        'Check kube-apiserver logs',
        'Verify etcd connectivity',
        'Restore API server functionality'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'apiserver-down', target: 'kube-apiserver', parameters: { etcdUnreachable: true } },
      successCriteria: { conditions: [{ type: 'api-responsive', target: 'kube-apiserver', expected: 'healthy' }] },
      hints: [
        { id: '1', trigger: 'kubectl-timeout', message: 'SSH to master node and check kube-apiserver logs', command: 'journalctl -u kubelet', priority: 1 }
      ],
      commands: ['kubectl cluster-info', 'journalctl -u kubelet', 'docker logs kube-apiserver']
    },

    'stuck-finalizers-1': {
      id: scenarioId,
      name: 'Stuck Finalizers Prevent Deletion',
      description: 'Resource stuck in Terminating state due to finalizers',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '15-20 minutes',
      objectives: [
        'Identify stuck finalizers',
        'Check finalizer dependencies',
        'Remove blocking finalizers',
        'Complete resource deletion'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'stuck-finalizer', target: 'custom-resource', parameters: { finalizerBlocked: true } },
      successCriteria: { conditions: [{ type: 'resource-deleted', target: 'custom-resource', expected: 'gone' }] },
      hints: [
        { id: '1', trigger: 'terminating-stuck', message: 'Remove finalizer using kubectl patch', command: 'kubectl patch <resource> -p \'{"metadata":{"finalizers":null}}\'', priority: 1 }
      ],
      commands: ['kubectl get <resource> -o yaml', 'kubectl patch', 'kubectl delete']
    },

    'multiple-ingress-conflict-1': {
      id: scenarioId,
      name: 'Multiple Ingress Controllers Conflict',
      description: 'Only one ingress works or routing fails due to controller conflicts',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Identify conflicting ingress controllers',
        'Check ingress class annotations',
        'Define proper ingress classes',
        'Isolate ingress controllers'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'ingress-conflict', target: 'ingress-controllers', parameters: { multipleControllers: true } },
      successCriteria: { conditions: [{ type: 'ingress-isolated', target: 'ingress-controllers', expected: 'separated' }] },
      hints: [
        { id: '1', trigger: 'routing-conflict', message: 'Define ingressClass to isolate controllers', command: 'kubectl get ingressclass', priority: 1 }
      ],
      commands: ['kubectl get ingress', 'kubectl get ingressclass', 'kubectl describe ingress']
    },

    'volume-stuck-detaching-1': {
      id: scenarioId,
      name: 'Volume Stuck Detaching or Attaching',
      description: 'Volume won\'t detach from node, blocking pod scheduling',
      category: 'storage',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Identify stuck volume operations',
        'Check controller-manager logs',
        'Force detach if necessary',
        'Restore volume functionality'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'volume-stuck', target: 'persistent-volume', parameters: { detachFailed: true } },
      successCriteria: { conditions: [{ type: 'volume-detached', target: 'persistent-volume', expected: 'available' }] },
      hints: [
        { id: '1', trigger: 'volume-stuck', message: 'Check controller-manager logs and force detach', command: 'kubectl logs -n kube-system controller-manager', priority: 1 }
      ],
      commands: ['kubectl get pv', 'kubectl describe pv', 'kubectl logs -n kube-system']
    },

    'argocd-sync-fails-1': {
      id: scenarioId,
      name: 'ArgoCD Sync Fails (GitOps)',
      description: 'ArgoCD fails to apply manifest due to validation or RBAC issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Check ArgoCD application status',
        'Validate manifest syntax',
        'Verify RBAC permissions',
        'Fix CRD version compatibility'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'argocd-sync-fail', target: 'argocd-app', parameters: { rbacDenied: true } },
      successCriteria: { conditions: [{ type: 'argocd-synced', target: 'argocd-app', expected: 'healthy' }] },
      hints: [
        { id: '1', trigger: 'sync-failed', message: 'Check ArgoCD logs and application events', command: 'kubectl logs -n argocd argocd-application-controller', priority: 1 }
      ],
      commands: ['kubectl get applications -n argocd', 'kubectl describe application', 'kubectl logs -n argocd']
    },

    'certificate-expired-1': {
      id: scenarioId,
      name: 'Certificate Expired (K8s API or Ingress TLS)',
      description: 'TLS certificates expired causing authentication failures',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '30-40 minutes',
      objectives: [
        'Identify expired certificates',
        'Check certificate validity dates',
        'Renew or replace certificates',
        'Verify TLS functionality'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'cert-expired', target: 'tls-certificates', parameters: { apiCertExpired: true } },
      successCriteria: { conditions: [{ type: 'tls-valid', target: 'certificates', expected: 'valid' }] },
      hints: [
        { id: '1', trigger: 'tls-error', message: 'Check certificate expiration dates', command: 'openssl x509 -in cert.pem -text -noout', priority: 1 }
      ],
      commands: ['kubectl get secrets', 'openssl x509 -text', 'kubectl describe secret']
    },

    'coredns-config-error-1': {
      id: scenarioId,
      name: 'CoreDNS Configuration Error',
      description: 'DNS resolution fails due to incorrect Corefile configuration',
      category: 'networking',
      difficulty: 'Advanced',
      estimatedTime: '18-25 minutes',
      objectives: [
        'Check CoreDNS configuration',
        'Validate Corefile syntax',
        'Verify zone and upstream settings',
        'Fix DNS configuration'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'coredns-config-error', target: 'coredns', parameters: { corefileError: true } },
      successCriteria: { conditions: [{ type: 'dns-working', target: 'coredns', expected: 'resolving' }] },
      hints: [
        { id: '1', trigger: 'dns-fail', message: 'Check CoreDNS ConfigMap and pod logs', command: 'kubectl get configmap coredns -n kube-system -o yaml', priority: 1 }
      ],
      commands: ['kubectl get configmap -n kube-system', 'kubectl logs -n kube-system -l k8s-app=kube-dns', 'kubectl exec -- nslookup']
    },

    'metrics-server-fails-1': {
      id: scenarioId,
      name: 'Metrics Server Fails to Start',
      description: 'Metrics server needed for HPA fails due to CA cert or API issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 minutes',
      objectives: [
        'Check metrics-server pod status',
        'Verify CA certificate configuration',
        'Fix API connectivity issues',
        'Ensure metrics collection works'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'metrics-server-fail', target: 'metrics-server', parameters: { caCertIssue: true } },
      successCriteria: { conditions: [{ type: 'metrics-available', target: 'metrics-server', expected: 'working' }] },
      hints: [
        { id: '1', trigger: 'metrics-unavailable', message: 'Check metrics-server logs for CA cert or API issues', command: 'kubectl logs -n kube-system metrics-server', priority: 1 }
      ],
      commands: ['kubectl get pods -n kube-system', 'kubectl logs -n kube-system', 'kubectl top nodes']
    },

    'pod-security-policy-1': {
      id: scenarioId,
      name: 'Pod Security Policy (PSP) Denies Pod',
      description: 'Pod won\'t schedule due to missing capabilities or PSP restrictions',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '22-28 minutes',
      objectives: [
        'Identify PSP denial reasons',
        'Check required capabilities',
        'Modify pod security context',
        'Ensure pod meets PSP requirements'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'psp-denied', target: 'pod-security-policy', parameters: { capabilityMissing: true } },
      successCriteria: { conditions: [{ type: 'pod-admitted', target: 'restricted-pod', expected: 'running' }] },
      hints: [
        { id: '1', trigger: 'psp-forbidden', message: 'Check Pod Security Policy and required capabilities', command: 'kubectl get psp', priority: 1 }
      ],
      commands: ['kubectl get psp', 'kubectl describe psp', 'kubectl auth can-i use psp']
    },

    'statefulset-misconfigured-1': {
      id: scenarioId,
      name: 'Misconfigured StatefulSet',
      description: 'StatefulSet fails due to improper headless service or volume templates',
      category: 'workloads',
      difficulty: 'Advanced',
      estimatedTime: '25-30 minutes',
      objectives: [
        'Check StatefulSet configuration',
        'Verify headless service setup',
        'Validate volumeClaimTemplate',
        'Fix StatefulSet issues'
      ],
      initialState: initialClusterState,
      faultInjection: { type: 'statefulset-error', target: 'database-statefulset', parameters: { headlessServiceMissing: true } },
      successCriteria: { conditions: [{ type: 'statefulset-ready', target: 'database-statefulset', expected: 'all-pods-ready' }] },
      hints: [
        { id: '1', trigger: 'statefulset-stuck', message: 'Check headless service and volumeClaimTemplate configuration', command: 'kubectl describe statefulset', priority: 1 }
      ],
      commands: ['kubectl get statefulset', 'kubectl describe statefulset', 'kubectl get service', 'kubectl get pvc']
    }
  };

  // Replace all initialClusterState with dynamic cluster state
  const scenario = scenarios[scenarioId] || scenarios['crashloop-1'];
  if (scenario) {
    scenario.initialState = createScenarioClusterState(scenarioId);
  }
  return scenario;
}

function injectFault(faultInjection: FaultInjection): void {
  // Implement fault injection logic
  console.log('Injecting fault:', faultInjection);
}

async function simulateKubectlCommand(command: string, clusterState: ClusterState): Promise<CommandResult> {
  const timestamp = new Date();

  // Simulate kubectl command execution with realistic output
  if (command.startsWith('kubectl get pods')) {
    const namespace = command.includes('-n ') ? command.split('-n ')[1].split(' ')[0] : 'default';
    const allNamespaces = command.includes('--all-namespaces') || command.includes('-A');

    let pods = clusterState.pods;
    if (!allNamespaces) {
      pods = clusterState.pods.filter(pod => pod.namespace === namespace);
    }

    if (pods.length === 0) {
      return {
        command,
        output: `No resources found in ${namespace} namespace.`,
        exitCode: 0,
        timestamp
      };
    }

    const header = allNamespaces
      ? 'NAMESPACE     NAME                           READY   STATUS             RESTARTS   AGE'
      : 'NAME                           READY   STATUS             RESTARTS   AGE';

    const output = pods.map(pod => {
      const readyContainers = pod.containers.filter(c => c.ready).length;
      const totalContainers = pod.containers.length;
      const age = Math.floor((Date.now() - pod.createdAt.getTime()) / (1000 * 60));
      const ageStr = age < 60 ? `${age}m` : age < 1440 ? `${Math.floor(age/60)}h${age%60}m` : `${Math.floor(age/1440)}d`;

      const baseInfo = `${pod.name.padEnd(30)} ${`${readyContainers}/${totalContainers}`.padEnd(7)} ${pod.status.padEnd(18)} ${pod.restartCount.toString().padEnd(10)} ${ageStr}`;

      return allNamespaces
        ? `${pod.namespace.padEnd(13)} ${baseInfo}`
        : baseInfo;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl describe pod')) {
    const podName = command.split(' ')[3];
    const pod = clusterState.pods.find(p => p.name === podName);

    if (!pod) {
      return {
        command,
        output: `Error from server (NotFound): pods "${podName}" not found`,
        exitCode: 1,
        timestamp
      };
    }

    const output = `Name:         ${pod.name}
Namespace:    ${pod.namespace}
Priority:     0
Node:         ${pod.node || 'worker-node-1'}
Start Time:   ${pod.createdAt.toISOString()}
Labels:       app=nginx
Status:       ${pod.status}
IP:           10.244.0.5
Containers:
  ${pod.containers[0].name}:
    Container ID:   docker://abc123def456
    Image:          ${pod.containers[0].image}
    Image ID:       docker-pullable://nginx@sha256:abc123
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
      Started:      ${new Date(Date.now() - 60000).toISOString()}
      Finished:     ${new Date(Date.now() - 30000).toISOString()}
    Ready:          False
    Restart Count:  ${pod.restartCount}
    Limits:
      cpu:     500m
      memory:  256Mi
    Requests:
      cpu:        100m
      memory:     128Mi
    Environment:  <none>
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Warning  BackOff    2m (x5 over 3m)   kubelet            Back-off restarting failed container`;

    return {
      command,
      output,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl logs')) {
    const podName = command.split(' ')[2];
    const pod = clusterState.pods.find(p => p.name === podName);

    if (!pod) {
      return {
        command,
        output: `Error from server (NotFound): pods "${podName}" not found`,
        exitCode: 1,
        timestamp
      };
    }

    const logs = [
      '2024-01-15T10:30:15.123Z [INFO] Starting nginx server...',
      '2024-01-15T10:30:15.456Z [ERROR] panic: missing environment variable DATABASE_URL',
      '2024-01-15T10:30:15.789Z [ERROR] Failed to initialize application',
      '2024-01-15T10:30:15.999Z [ERROR] Container exiting with code 1'
    ].join('\n');

    return {
      command,
      output: logs,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get nodes')) {
    const header = 'NAME            STATUS   ROLES    AGE   VERSION';
    const output = clusterState.nodes.map(node => {
      const age = '5d';
      const version = 'v1.28.0';
      return `${node.name.padEnd(15)} ${node.status.padEnd(8)} worker   ${age.padEnd(5)} ${version}`;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get events')) {
    const header = 'LAST SEEN   TYPE      REASON      OBJECT                     MESSAGE';
    const output = clusterState.events.map(event => {
      const lastSeen = '2m';
      return `${lastSeen.padEnd(11)} ${event.type.padEnd(9)} ${event.reason.padEnd(11)} ${`${event.involvedObject.kind.toLowerCase()}/${event.involvedObject.name}`.padEnd(26)} ${event.message}`;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get services') || command.startsWith('kubectl get svc')) {
    const namespace = command.includes('-n ') ? command.split('-n ')[1].split(' ')[0] : 'default';
    const allNamespaces = command.includes('--all-namespaces') || command.includes('-A');

    // Default services that should always exist
    const defaultServices = [
      { name: 'kubernetes', namespace: 'default', type: 'ClusterIP', clusterIP: '10.96.0.1', externalIP: '<none>', ports: '443/TCP', age: '5d' }
    ];

    // Add scenario-specific services based on current state
    const scenarioServices = [
      { name: 'nginx-service', namespace: 'default', type: 'ClusterIP', clusterIP: '10.96.1.100', externalIP: '<none>', ports: '80/TCP', age: '2h' },
      { name: 'backend-service', namespace: 'default', type: 'ClusterIP', clusterIP: '10.96.1.101', externalIP: '<none>', ports: '8080/TCP', age: '1h' },
      { name: 'frontend-lb', namespace: 'default', type: 'LoadBalancer', clusterIP: '10.96.1.102', externalIP: '<pending>', ports: '80:30080/TCP', age: '30m' }
    ];

    let services = [...defaultServices, ...scenarioServices];
    if (!allNamespaces) {
      services = services.filter(svc => svc.namespace === namespace);
    }

    if (services.length === 0) {
      return {
        command,
        output: `No resources found in ${namespace} namespace.`,
        exitCode: 0,
        timestamp
      };
    }

    const header = allNamespaces
      ? 'NAMESPACE     NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE'
      : 'NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE';

    const output = services.map(svc => {
      const baseInfo = `${svc.name.padEnd(18)} ${svc.type.padEnd(14)} ${svc.clusterIP.padEnd(15)} ${svc.externalIP.padEnd(13)} ${svc.ports.padEnd(14)} ${svc.age}`;
      return allNamespaces
        ? `${svc.namespace.padEnd(13)} ${baseInfo}`
        : baseInfo;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get deployments') || command.startsWith('kubectl get deploy')) {
    const namespace = command.includes('-n ') ? command.split('-n ')[1].split(' ')[0] : 'default';
    const allNamespaces = command.includes('--all-namespaces') || command.includes('-A');

    // Scenario-specific deployments
    const deployments = [
      { name: 'nginx-deployment', namespace: 'default', ready: '2/3', upToDate: '3', available: '2', age: '2h' },
      { name: 'backend-deployment', namespace: 'default', ready: '1/1', upToDate: '1', available: '1', age: '1h' },
      { name: 'frontend-deployment', namespace: 'default', ready: '0/2', upToDate: '2', available: '0', age: '30m' }
    ];

    let filteredDeployments = deployments;
    if (!allNamespaces) {
      filteredDeployments = deployments.filter(dep => dep.namespace === namespace);
    }

    if (filteredDeployments.length === 0) {
      return {
        command,
        output: `No resources found in ${namespace} namespace.`,
        exitCode: 0,
        timestamp
      };
    }

    const header = allNamespaces
      ? 'NAMESPACE     NAME                  READY   UP-TO-DATE   AVAILABLE   AGE'
      : 'NAME                  READY   UP-TO-DATE   AVAILABLE   AGE';

    const output = filteredDeployments.map(dep => {
      const baseInfo = `${dep.name.padEnd(21)} ${dep.ready.padEnd(7)} ${dep.upToDate.padEnd(12)} ${dep.available.padEnd(11)} ${dep.age}`;
      return allNamespaces
        ? `${dep.namespace.padEnd(13)} ${baseInfo}`
        : baseInfo;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get namespaces') || command.startsWith('kubectl get ns')) {
    const header = 'NAME              STATUS   AGE';
    const namespaces = [
      { name: 'default', status: 'Active', age: '5d' },
      { name: 'kube-node-lease', status: 'Active', age: '5d' },
      { name: 'kube-public', status: 'Active', age: '5d' },
      { name: 'kube-system', status: 'Active', age: '5d' }
    ];

    const output = namespaces.map(ns =>
      `${ns.name.padEnd(17)} ${ns.status.padEnd(8)} ${ns.age}`
    ).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl get endpoints') || command.startsWith('kubectl get ep')) {
    const namespace = command.includes('-n ') ? command.split('-n ')[1].split(' ')[0] : 'default';
    const allNamespaces = command.includes('--all-namespaces') || command.includes('-A');

    const endpoints = [
      { name: 'kubernetes', namespace: 'default', endpoints: '192.168.1.100:6443', age: '5d' },
      { name: 'nginx-service', namespace: 'default', endpoints: '10.244.0.5:80,10.244.0.6:80', age: '2h' },
      { name: 'backend-service', namespace: 'default', endpoints: '<none>', age: '1h' }
    ];

    let filteredEndpoints = endpoints;
    if (!allNamespaces) {
      filteredEndpoints = endpoints.filter(ep => ep.namespace === namespace);
    }

    if (filteredEndpoints.length === 0) {
      return {
        command,
        output: `No resources found in ${namespace} namespace.`,
        exitCode: 0,
        timestamp
      };
    }

    const header = allNamespaces
      ? 'NAMESPACE     NAME               ENDPOINTS                     AGE'
      : 'NAME               ENDPOINTS                     AGE';

    const output = filteredEndpoints.map(ep => {
      const baseInfo = `${ep.name.padEnd(18)} ${ep.endpoints.padEnd(29)} ${ep.age}`;
      return allNamespaces
        ? `${ep.namespace.padEnd(13)} ${baseInfo}`
        : baseInfo;
    }).join('\n');

    return {
      command,
      output: `${header}\n${output}`,
      exitCode: 0,
      timestamp
    };
  }

  if (command.startsWith('kubectl top')) {
    if (command.includes('nodes')) {
      const header = 'NAME            CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%';
      const output = clusterState.nodes.map(node => {
        const cpuCores = (node.metrics.cpu.usage * 4 / 100).toFixed(0) + 'm';
        const memoryBytes = Math.floor(node.metrics.memory.usage * 8 * 1024 / 100) + 'Mi';
        return `${node.name.padEnd(15)} ${cpuCores.padEnd(12)} ${node.metrics.cpu.usage.toString().padEnd(6)}% ${memoryBytes.padEnd(15)} ${node.metrics.memory.usage}%`;
      }).join('\n');

      return {
        command,
        output: `${header}\n${output}`,
        exitCode: 0,
        timestamp
      };
    }

    if (command.includes('pods')) {
      const namespace = command.includes('-n ') ? command.split('-n ')[1].split(' ')[0] : 'default';
      const pods = clusterState.pods.filter(pod => pod.namespace === namespace);

      if (pods.length === 0) {
        return {
          command,
          output: `No resources found in ${namespace} namespace.`,
          exitCode: 0,
          timestamp
        };
      }

      const header = 'NAME                           CPU(cores)   MEMORY(bytes)';
      const output = pods.map(pod => {
        const cpuUsage = Math.floor(Math.random() * 100) + 'm';
        const memoryUsage = Math.floor(Math.random() * 200 + 50) + 'Mi';
        return `${pod.name.padEnd(30)} ${cpuUsage.padEnd(12)} ${memoryUsage}`;
      }).join('\n');

      return {
        command,
        output: `${header}\n${output}`,
        exitCode: 0,
        timestamp
      };
    }
  }

  // Handle unknown commands more realistically
  if (command.startsWith('kubectl')) {
    const parts = command.split(' ');
    if (parts.length < 2) {
      return {
        command,
        output: 'error: You must specify the type of resource to get. Use "kubectl api-resources" for a complete list of supported resources.',
        exitCode: 1,
        timestamp
      };
    }

    const subcommand = parts[1];
    const resource = parts[2] || '';

    if (subcommand === 'get' && !resource) {
      return {
        command,
        output: 'error: You must specify the type of resource to get. Use "kubectl api-resources" for a complete list of supported resources.',
        exitCode: 1,
        timestamp
      };
    }

    return {
      command,
      output: `error: the server doesn't have a resource type "${resource}"`,
      exitCode: 1,
      timestamp
    };
  }

  // Default response for non-kubectl commands
  return {
    command,
    output: `bash: ${command.split(' ')[0]}: command not found`,
    exitCode: 127,
    timestamp
  };
}
