import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Globe, Cloud, Shield, Router, Network, Server, Database, Target, RefreshCw,
  Monitor, Activity, Wifi, Container, Box, Layers, GitBranch, Gauge, HardDrive,
  FileText, X, Info, Play, Pause, RotateCcw, ZoomIn, ZoomOut, ArrowRight,
  Settings, Eye, EyeOff, Maximize2, Minimize2, Book
} from 'lucide-react';
import ComponentDocumentation from '../components/ComponentDocumentation';

interface K8sComponent {
  id: string;
  name: string;
  description: string;
  technicalDetails: string;
  icon: React.ComponentType<any>;
  category: string;
  layer: string;
  status: 'healthy' | 'warning' | 'error';
  position: { x: number; y: number };
  size: { width: number; height: number };
  connections: string[];
  ports?: string[];
  protocols?: string[];
}

interface FlowAnimation {
  id: string;
  name: string;
  description: string;
  color: string;
  steps: Array<{
    from: string;
    to: string;
    delay: number;
    duration: number;
    label?: string;
  }>;
}

interface LayerGroup {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  components: string[];
}

const K8sExplained: React.FC = () => {

  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 50, y: 20 });
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [flowProgress, setFlowProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepDescription, setStepDescription] = useState<string>('');
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [selectedDocComponent, setSelectedDocComponent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Flow step explanations
  const flowStepExplanations = {
    'request-flow': [
      { progress: 0, step: 'User Request', description: 'User sends HTTP request to the application' },
      { progress: 15, step: 'DNS Resolution', description: 'DNS resolves domain to load balancer IP' },
      { progress: 30, step: 'Load Balancer', description: 'External load balancer receives the request' },
      { progress: 45, step: 'Ingress Controller', description: 'Ingress controller routes based on URL path/host' },
      { progress: 60, step: 'Service Discovery', description: 'Service routes to healthy pod endpoints' },
      { progress: 80, step: 'Pod Processing', description: 'Application pod processes the request' },
      { progress: 100, step: 'Response Complete', description: 'Response travels back to user' }
    ],
    'control-flow': [
      { progress: 0, step: 'API Request', description: 'kubectl command sent to API server' },
      { progress: 25, step: 'State Storage', description: 'API server validates and stores in etcd' },
      { progress: 50, step: 'Scheduling', description: 'Scheduler selects best node for pod placement' },
      { progress: 75, step: 'Node Assignment', description: 'Kubelet receives pod assignment' },
      { progress: 100, step: 'Reconciliation', description: 'Controller manager ensures desired state' }
    ],
    'pod-lifecycle': [
      { progress: 0, step: 'Container Creation', description: 'Kubelet instructs container runtime' },
      { progress: 33, step: 'Pod Startup', description: 'Container runtime starts the pod' },
      { progress: 66, step: 'Health Checks', description: 'Pod passes readiness and liveness probes' },
      { progress: 100, step: 'Ready to Serve', description: 'Pod is ready to receive traffic' }
    ]
  };

  // Flow animation function with step explanations
  const startFlow = (flowType: string) => {
    setActiveFlow(flowType);
    setFlowProgress(0);
    setIsPlaying(true);
    setCurrentStep('');
    setStepDescription('');

    const steps = flowStepExplanations[flowType as keyof typeof flowStepExplanations] || [];

    const interval = setInterval(() => {
      setFlowProgress(prev => {
        const newProgress = prev + 1.5;

        // Update step explanation based on progress
        const currentStepData = steps.find(step =>
          newProgress >= step.progress &&
          (steps.indexOf(step) === steps.length - 1 || newProgress < steps[steps.indexOf(step) + 1]?.progress)
        );

        if (currentStepData) {
          setCurrentStep(currentStepData.step);
          setStepDescription(currentStepData.description);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveFlow(null);
            setFlowProgress(0);
            setIsPlaying(false);
            setCurrentStep('');
            setStepDescription('');
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 50);
  };

  // Reset view function
  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 50, y: 20 });
    setActiveFlow(null);
    setIsPlaying(false);
  };

  // Layer Groups for proper visual organization
  const layerGroups: LayerGroup[] = [
    {
      id: 'external-layer',
      name: 'External Access Layer',
      description: 'External traffic entry points',
      position: { x: 50, y: 50 },
      size: { width: 800, height: 120 },
      color: 'blue',
      components: ['user', 'dns', 'external-lb']
    },
    {
      id: 'ingress-layer',
      name: 'Ingress Layer',
      description: 'Traffic routing and SSL termination',
      position: { x: 50, y: 200 },
      size: { width: 800, height: 100 },
      color: 'purple',
      components: ['ingress-controller']
    },
    {
      id: 'service-layer',
      name: 'Service Layer',
      description: 'Load balancing and service discovery',
      position: { x: 50, y: 330 },
      size: { width: 800, height: 100 },
      color: 'green',
      components: ['loadbalancer-service', 'clusterip-service']
    },
    {
      id: 'control-plane',
      name: 'Control Plane',
      description: 'Cluster management and orchestration',
      position: { x: 50, y: 460 },
      size: { width: 400, height: 200 },
      color: 'indigo',
      components: ['api-server', 'etcd', 'scheduler', 'controller-manager']
    },
    {
      id: 'worker-node-1',
      name: 'Worker Node 1',
      description: 'Application runtime environment',
      position: { x: 480, y: 460 },
      size: { width: 370, height: 200 },
      color: 'slate',
      components: ['kubelet-1', 'kube-proxy-1', 'container-runtime-1', 'pod-1', 'pod-2']
    },
    {
      id: 'storage-config',
      name: 'Storage & Configuration',
      description: 'Persistent storage and configuration management',
      position: { x: 50, y: 690 },
      size: { width: 800, height: 120 },
      color: 'orange',
      components: ['persistent-volume', 'persistent-volume-claim', 'configmap', 'secret']
    }
  ];

  // Kubernetes Architecture Components with proper positioning
  const components: K8sComponent[] = [
    // External Access Layer
    {
      id: 'user',
      name: 'User',
      description: 'End user accessing application',
      technicalDetails: 'Human user, web browser, mobile app, or API client making requests to the cluster. Entry point for all external traffic.',
      icon: Users,
      category: 'access',
      layer: 'external-layer',
      status: 'healthy',
      position: { x: 80, y: 80 },
      size: { width: 140, height: 80 },
      connections: ['dns'],
      ports: ['80', '443'],
      protocols: ['HTTP', 'HTTPS']
    },
    {
      id: 'dns',
      name: 'DNS',
      description: 'Domain Name System',
      technicalDetails: 'Resolves domain names (app.example.com) to IP addresses. Managed by cloud provider or external DNS service like Route53, CloudDNS.',
      icon: Globe,
      category: 'access',
      layer: 'external-layer',
      status: 'healthy',
      position: { x: 280, y: 80 },
      size: { width: 140, height: 80 },
      connections: ['external-lb'],
      ports: ['53'],
      protocols: ['DNS', 'UDP']
    },
    {
      id: 'external-lb',
      name: 'External Load Balancer',
      description: 'Cloud provider load balancer',
      technicalDetails: 'AWS ALB/NLB, GCP Load Balancer, or Azure Load Balancer. Distributes traffic across multiple ingress controllers with health checks.',
      icon: Cloud,
      category: 'access',
      layer: 'external-layer',
      status: 'healthy',
      position: { x: 480, y: 80 },
      size: { width: 140, height: 80 },
      connections: ['ingress-controller'],
      ports: ['80', '443'],
      protocols: ['HTTP', 'HTTPS', 'TCP']
    },

    // Ingress Layer
    {
      id: 'ingress-controller',
      name: 'Ingress Controller',
      description: 'NGINX/Traefik/Istio routing',
      technicalDetails: 'Manages external access to services in cluster. Handles SSL termination, HTTP routing, load balancing, path-based routing. Runs as pods in kube-system namespace.',
      icon: Router,
      category: 'ingress',
      layer: 'ingress-layer',
      status: 'healthy',
      position: { x: 350, y: 230 },
      size: { width: 200, height: 80 },
      connections: ['loadbalancer-service'],
      ports: ['80', '443', '8080'],
      protocols: ['HTTP', 'HTTPS', 'gRPC']
    },

    // Services Layer
    {
      id: 'loadbalancer-service',
      name: 'LoadBalancer Service',
      description: 'External service exposure',
      technicalDetails: 'Kubernetes Service type=LoadBalancer. Exposes service externally using cloud provider load balancer. Creates external IP endpoint.',
      icon: Network,
      category: 'services',
      layer: 'service-layer',
      status: 'healthy',
      position: { x: 200, y: 360 },
      size: { width: 180, height: 80 },
      connections: ['clusterip-service'],
      ports: ['80', '443', '8080'],
      protocols: ['HTTP', 'HTTPS', 'TCP']
    },
    {
      id: 'clusterip-service',
      name: 'ClusterIP Service',
      description: 'Internal cluster service',
      technicalDetails: 'Internal service with cluster IP (10.96.0.0/12 range). Load balances traffic to pod endpoints using iptables/IPVS. Default service type.',
      icon: Network,
      category: 'services',
      layer: 'service-layer',
      status: 'healthy',
      position: { x: 450, y: 360 },
      size: { width: 180, height: 80 },
      connections: ['pod-1', 'pod-2'],
      ports: ['8080', '9090'],
      protocols: ['HTTP', 'gRPC', 'TCP']
    },

    // Control Plane
    {
      id: 'api-server',
      name: 'kube-apiserver',
      description: 'Kubernetes API server',
      technicalDetails: 'REST API server (port 6443). Validates requests, handles authentication, authorization, admission control. Central hub for all cluster communication. Stateless and horizontally scalable.',
      icon: Server,
      category: 'control-plane',
      layer: 'control-plane',
      status: 'healthy',
      position: { x: 80, y: 490 },
      size: { width: 150, height: 70 },
      connections: ['etcd', 'scheduler', 'controller-manager', 'kubelet-1'],
      ports: ['6443', '8080'],
      protocols: ['HTTPS', 'HTTP', 'gRPC']
    },
    {
      id: 'etcd',
      name: 'etcd',
      description: 'Cluster database',
      technicalDetails: 'Distributed key-value store using Raft consensus protocol (port 2379/2380). Stores all cluster state, configuration, secrets, and metadata. Only component that stores data.',
      icon: Database,
      category: 'control-plane',
      layer: 'control-plane',
      status: 'healthy',
      position: { x: 260, y: 490 },
      size: { width: 150, height: 70 },
      connections: [],
      ports: ['2379', '2380'],
      protocols: ['gRPC', 'Raft']
    },
    {
      id: 'scheduler',
      name: 'kube-scheduler',
      description: 'Pod placement engine',
      technicalDetails: 'Assigns pods to nodes based on resource requirements, node affinity, taints/tolerations, scheduling policies, and custom schedulers.',
      icon: Target,
      category: 'control-plane',
      layer: 'control-plane',
      status: 'healthy',
      position: { x: 80, y: 580 },
      size: { width: 150, height: 70 },
      connections: ['kubelet-1'],
      ports: ['10259'],
      protocols: ['HTTPS']
    },
    {
      id: 'controller-manager',
      name: 'kube-controller-manager',
      description: 'Controller processes',
      technicalDetails: 'Runs controllers: ReplicaSet, Deployment, Service, Node, Endpoint, Namespace controllers. Ensures desired state matches actual state through control loops.',
      icon: RefreshCw,
      category: 'control-plane',
      layer: 'control-plane',
      status: 'healthy',
      position: { x: 260, y: 580 },
      size: { width: 150, height: 70 },
      connections: ['api-server'],
      ports: ['10257'],
      protocols: ['HTTPS']
    },

    // Worker Node Components
    {
      id: 'kubelet-1',
      name: 'kubelet',
      description: 'Node agent',
      technicalDetails: 'Manages pod lifecycle on the node. Communicates with API server (port 10250), pulls images, starts/stops containers, reports node status.',
      icon: Activity,
      category: 'worker-node',
      layer: 'worker-node-1',
      status: 'healthy',
      position: { x: 510, y: 490 },
      size: { width: 120, height: 60 },
      connections: ['api-server', 'container-runtime-1'],
      ports: ['10250', '10255'],
      protocols: ['HTTPS', 'HTTP']
    },
    {
      id: 'kube-proxy-1',
      name: 'kube-proxy',
      description: 'Network proxy',
      technicalDetails: 'Maintains network rules on nodes using iptables/IPVS. Implements Service abstraction by routing traffic to correct pods. Handles load balancing.',
      icon: Wifi,
      category: 'worker-node',
      layer: 'worker-node-1',
      status: 'healthy',
      position: { x: 650, y: 490 },
      size: { width: 120, height: 60 },
      connections: ['clusterip-service'],
      ports: ['10256'],
      protocols: ['HTTP']
    },
    {
      id: 'container-runtime-1',
      name: 'Container Runtime',
      description: 'containerd/CRI-O/Docker',
      technicalDetails: 'Pulls container images from registries, creates containers, manages container lifecycle. Implements CRI (Container Runtime Interface). Uses runc/kata.',
      icon: Container,
      category: 'worker-node',
      layer: 'worker-node-1',
      status: 'healthy',
      position: { x: 510, y: 570 },
      size: { width: 120, height: 60 },
      connections: ['pod-1', 'pod-2'],
      ports: ['2376'],
      protocols: ['gRPC', 'HTTP']
    },

    // Workloads (Pods)
    {
      id: 'pod-1',
      name: 'Pod 1',
      description: 'Application pod',
      technicalDetails: 'Group of containers sharing network (pause container) and storage. Smallest deployable unit in Kubernetes. Has unique IP address within cluster.',
      icon: Box,
      category: 'workload',
      layer: 'worker-node-1',
      status: 'healthy',
      position: { x: 650, y: 570 },
      size: { width: 90, height: 60 },
      connections: ['persistent-volume-claim', 'configmap', 'secret'],
      ports: ['8080', '9090'],
      protocols: ['HTTP', 'gRPC']
    },
    {
      id: 'pod-2',
      name: 'Pod 2',
      description: 'Application pod',
      technicalDetails: 'Another pod instance for high availability and load distribution. Managed by ReplicaSet for desired state.',
      icon: Box,
      category: 'workload',
      layer: 'worker-node-1',
      status: 'healthy',
      position: { x: 760, y: 570 },
      size: { width: 90, height: 60 },
      connections: ['persistent-volume-claim', 'configmap', 'secret'],
      ports: ['8080', '9090'],
      protocols: ['HTTP', 'gRPC']
    },

    // Storage & Config
    {
      id: 'persistent-volume',
      name: 'PersistentVolume',
      description: 'Cluster storage resource',
      technicalDetails: 'Cluster-wide storage resource with lifecycle independent of pods. Backed by cloud storage (EBS, GCE PD) or local disks. Provisioned by admin or dynamically.',
      icon: HardDrive,
      category: 'storage',
      layer: 'storage-config',
      status: 'healthy',
      position: { x: 80, y: 720 },
      size: { width: 150, height: 70 },
      connections: ['persistent-volume-claim'],
      ports: ['NFS', 'iSCSI'],
      protocols: ['NFS', 'iSCSI', 'FC']
    },
    {
      id: 'persistent-volume-claim',
      name: 'PersistentVolumeClaim',
      description: 'Storage request',
      technicalDetails: 'Request for storage by user/pod. Binds to available PV with matching requirements (size, access mode, storage class). Namespace-scoped.',
      icon: HardDrive,
      category: 'storage',
      layer: 'storage-config',
      status: 'healthy',
      position: { x: 280, y: 720 },
      size: { width: 150, height: 70 },
      connections: [],
      ports: [],
      protocols: []
    },
    {
      id: 'configmap',
      name: 'ConfigMap',
      description: 'Configuration data',
      technicalDetails: 'Stores non-confidential configuration data in key-value pairs. Can be consumed as environment variables, command-line arguments, or mounted as config files.',
      icon: FileText,
      category: 'config',
      layer: 'storage-config',
      status: 'healthy',
      position: { x: 480, y: 720 },
      size: { width: 150, height: 70 },
      connections: [],
      ports: [],
      protocols: []
    },
    {
      id: 'secret',
      name: 'Secret',
      description: 'Sensitive data',
      technicalDetails: 'Stores sensitive information like passwords, OAuth tokens, SSH keys, TLS certificates. Base64 encoded and encrypted at rest in etcd.',
      icon: Shield,
      category: 'config',
      layer: 'storage-config',
      status: 'healthy',
      position: { x: 680, y: 720 },
      size: { width: 150, height: 70 },
      connections: [],
      ports: [],
      protocols: []
    }
  ];

  // Enhanced Flow animations with better descriptions
  const flowAnimations: FlowAnimation[] = [
    {
      id: 'request-flow',
      name: 'Request Flow',
      description: 'Complete user request journey through the cluster',
      color: '#3b82f6',
      steps: [
        { from: 'user', to: 'dns', delay: 0, duration: 0.8, label: 'DNS Lookup' },
        { from: 'dns', to: 'external-lb', delay: 0.8, duration: 0.8, label: 'Route to LB' },
        { from: 'external-lb', to: 'ingress-controller', delay: 1.6, duration: 0.8, label: 'Forward to Ingress' },
        { from: 'ingress-controller', to: 'loadbalancer-service', delay: 2.4, duration: 0.8, label: 'Route to Service' },
        { from: 'loadbalancer-service', to: 'clusterip-service', delay: 3.2, duration: 0.8, label: 'Internal Routing' },
        { from: 'clusterip-service', to: 'pod-1', delay: 4.0, duration: 0.8, label: 'Deliver to Pod' }
      ]
    },
    {
      id: 'control-flow',
      name: 'Control Plane Flow',
      description: 'How control plane manages cluster state',
      color: '#8b5cf6',
      steps: [
        { from: 'api-server', to: 'etcd', delay: 0, duration: 0.6, label: 'Store State' },
        { from: 'api-server', to: 'scheduler', delay: 0.6, duration: 0.6, label: 'Schedule Pods' },
        { from: 'scheduler', to: 'kubelet-1', delay: 1.2, duration: 0.6, label: 'Assign Node' },
        { from: 'controller-manager', to: 'api-server', delay: 1.8, duration: 0.6, label: 'Reconcile State' }
      ]
    },
    {
      id: 'pod-lifecycle',
      name: 'Pod Lifecycle',
      description: 'How pods are created and managed',
      color: '#10b981',
      steps: [
        { from: 'kubelet-1', to: 'container-runtime-1', delay: 0, duration: 0.7, label: 'Create Container' },
        { from: 'container-runtime-1', to: 'pod-1', delay: 0.7, duration: 0.7, label: 'Start Pod' },
        { from: 'container-runtime-1', to: 'pod-2', delay: 1.4, duration: 0.7, label: 'Start Pod' },
        { from: 'kube-proxy-1', to: 'clusterip-service', delay: 2.1, duration: 0.7, label: 'Update Rules' }
      ]
    },
    {
      id: 'storage-flow',
      name: 'Storage Flow',
      description: 'How storage is provisioned and mounted',
      color: '#f59e0b',
      steps: [
        { from: 'persistent-volume', to: 'persistent-volume-claim', delay: 0, duration: 0.8, label: 'Bind PV' },
        { from: 'persistent-volume-claim', to: 'pod-1', delay: 0.8, duration: 0.8, label: 'Mount Volume' },
        { from: 'persistent-volume-claim', to: 'pod-2', delay: 1.6, duration: 0.8, label: 'Mount Volume' }
      ]
    },
    {
      id: 'config-flow',
      name: 'Configuration Flow',
      description: 'How configuration and secrets are injected',
      color: '#ef4444',
      steps: [
        { from: 'configmap', to: 'pod-1', delay: 0, duration: 0.6, label: 'Inject Config' },
        { from: 'secret', to: 'pod-1', delay: 0.6, duration: 0.6, label: 'Inject Secret' },
        { from: 'configmap', to: 'pod-2', delay: 1.2, duration: 0.6, label: 'Inject Config' },
        { from: 'secret', to: 'pod-2', delay: 1.8, duration: 0.6, label: 'Inject Secret' }
      ]
    }
  ];

  const getColorClasses = (category: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; accent: string; shadow: string }> = {
      access: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', accent: 'bg-blue-500', shadow: 'shadow-blue-100' },
      ingress: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', accent: 'bg-purple-500', shadow: 'shadow-purple-100' },
      services: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', accent: 'bg-green-500', shadow: 'shadow-green-100' },
      'control-plane': { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', accent: 'bg-indigo-500', shadow: 'shadow-indigo-100' },
      'worker-node': { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', accent: 'bg-slate-500', shadow: 'shadow-slate-100' },
      workload: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', accent: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
      storage: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', accent: 'bg-orange-500', shadow: 'shadow-orange-100' },
      config: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', accent: 'bg-red-500', shadow: 'shadow-red-100' }
    };
    return colorMap[category] || colorMap.access;
  };

  const getLayerColors = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-50/30', border: 'border-blue-200', text: 'text-blue-700' },
      purple: { bg: 'bg-purple-50/30', border: 'border-purple-200', text: 'text-purple-700' },
      green: { bg: 'bg-green-50/30', border: 'border-green-200', text: 'text-green-700' },
      indigo: { bg: 'bg-indigo-50/30', border: 'border-indigo-200', text: 'text-indigo-700' },
      slate: { bg: 'bg-slate-50/30', border: 'border-slate-200', text: 'text-slate-700' },
      orange: { bg: 'bg-orange-50/30', border: 'border-orange-200', text: 'text-orange-700' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const playFlow = (flowId: string) => {
    if (isPlaying) return;

    setActiveFlow(flowId);
    setIsPlaying(true);

    const flow = flowAnimations.find(f => f.id === flowId);
    if (flow) {
      const totalDuration = Math.max(...flow.steps.map(step => step.delay + step.duration));
      setTimeout(() => {
        setIsPlaying(false);
        setActiveFlow(null);
      }, (totalDuration + 0.5) * 1000);
    }
  };



  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(0.6);
    } else {
      setZoom(0.8);
    }
  };
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  Kubernetes Architecture Explained
                </h1>
                <p className="text-gray-600 text-sm">Interactive architecture diagram with real-time flow animations</p>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-6">
              {/* Flow Animation Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Flow Simulations:</span>
                {flowAnimations.map((flow) => (
                  <button
                    key={flow.id}
                    onClick={() => startFlow(flow.id)}
                    disabled={isPlaying}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeFlow === flow.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    style={{ borderColor: activeFlow === flow.id ? flow.color : undefined }}
                  >
                    <Play className="w-4 h-4" />
                    {flow.name}
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                <button
                  onClick={() => setShowDocumentation(true)}
                  className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="View Documentation"
                >
                  <Book className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowConnections(!showConnections)}
                  className={`p-2 rounded-lg transition-colors ${showConnections ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Toggle Connections"
                >
                  {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`p-2 rounded-lg transition-colors ${showLabels ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Toggle Labels"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={() => setZoom(Math.min(zoom + 0.1, 1.5))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(Math.max(zoom - 0.1, 0.4))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Explanation Panel */}
      {isPlaying && currentStep && (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 text-sm">{currentStep}</h4>
                  <p className="text-blue-700 text-xs mt-1">{stepDescription}</p>
                </div>
                <div className="text-blue-600 text-xs font-mono">
                  {Math.round(flowProgress)}%
                </div>
              </div>
              <div className="mt-3 bg-white/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${flowProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Architecture Diagram */}
      <div
        ref={containerRef}
        className={`relative w-full ${isFullscreen ? 'h-screen' : 'min-h-[600px]'} overflow-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30`}
      >
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
            width: '1200px',
            height: '900px',
            minWidth: '1200px',
            minHeight: '900px'
          }}
        >
          {/* Enhanced Background Grid */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid-major" width="150" height="150" patternUnits="userSpaceOnUse">
                  <path d="M 150 0 L 0 0 0 150" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#grid-major)" />
            </svg>
          </div>

          {/* Layer Groups */}
          {layerGroups.map((layer) => {
            const colors = getLayerColors(layer.color);
            return (
              <motion.div
                key={layer.id}
                className={`absolute ${colors.bg} ${colors.border} border-2 rounded-2xl backdrop-blur-sm`}
                style={{
                  left: layer.position.x,
                  top: layer.position.y,
                  width: layer.size.width,
                  height: layer.size.height,
                  zIndex: 1
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="absolute -top-3 left-4 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                  <span className={`text-sm font-semibold ${colors.text}`}>{layer.name}</span>
                </div>
                <div className="absolute top-6 left-4 right-4">
                  <p className="text-xs text-gray-600">{layer.description}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Enhanced Connection Lines */}
          {showConnections && (
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7"
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              </defs>
              {components.map(component =>
                component.connections.map(targetId => {
                  const target = components.find(c => c.id === targetId);
                  if (!target) return null;

                  const startX = component.position.x + component.size.width / 2;
                  const startY = component.position.y + component.size.height / 2;
                  const endX = target.position.x + target.size.width / 2;
                  const endY = target.position.y + target.size.height / 2;

                  // Calculate control points for curved lines
                  const midX = (startX + endX) / 2;
                  const midY = (startY + endY) / 2;
                  const offset = 20;

                  return (
                    <motion.path
                      key={`${component.id}-${targetId}`}
                      d={`M ${startX} ${startY} Q ${midX + offset} ${midY} ${endX} ${endY}`}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      fill="none"
                      opacity={hoveredComponent === component.id || hoveredComponent === targetId ? "0.8" : "0.4"}
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  );
                })
              )}
            </svg>
          )}

          {/* Enhanced Flow Animation Lines */}
          {activeFlow && (
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
              <defs>
                <marker id="flow-arrowhead" markerWidth="12" markerHeight="8"
                        refX="11" refY="4" orient="auto">
                  <polygon points="0 0, 12 4, 0 8" fill={flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6'} />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {flowAnimations
                .find(f => f.id === activeFlow)
                ?.steps.map((step, index) => {
                  const fromComponent = components.find(c => c.id === step.from);
                  const toComponent = components.find(c => c.id === step.to);
                  if (!fromComponent || !toComponent) return null;

                  const startX = fromComponent.position.x + fromComponent.size.width / 2;
                  const startY = fromComponent.position.y + fromComponent.size.height / 2;
                  const endX = toComponent.position.x + toComponent.size.width / 2;
                  const endY = toComponent.position.y + toComponent.size.height / 2;

                  const midX = (startX + endX) / 2;
                  const midY = (startY + endY) / 2;
                  const offset = 30;

                  return (
                    <g key={`flow-${index}`}>
                      <motion.path
                        d={`M ${startX} ${startY} Q ${midX + offset} ${midY} ${endX} ${endY}`}
                        stroke={flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6'}
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                        markerEnd="url(#flow-arrowhead)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          duration: step.duration,
                          delay: step.delay,
                          ease: "easeInOut"
                        }}
                      />
                      {step.label && (
                        <motion.text
                          x={midX}
                          y={midY - 10}
                          textAnchor="middle"
                          className="text-xs font-medium fill-current"
                          style={{ fill: flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: step.delay + step.duration * 0.5 }}
                        >
                          {step.label}
                        </motion.text>
                      )}
                    </g>
                  );
                })}
            </svg>
          )}

          {/* Enhanced Components */}
          {components.map((component) => {
            const colors = getColorClasses(component.category);
            const isHovered = hoveredComponent === component.id;
            const isActive = activeFlow && flowAnimations
              .find(f => f.id === activeFlow)
              ?.steps.some(step => step.from === component.id || step.to === component.id);

            return (
              <motion.div
                key={component.id}
                className={`absolute cursor-pointer ${colors.bg} ${colors.border} border-2 rounded-xl ${colors.shadow} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                  isActive ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                }`}
                style={{
                  left: component.position.x,
                  top: component.position.y,
                  width: component.size.width,
                  height: component.size.height,
                  zIndex: isHovered ? 10 : 5
                }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDocComponent(component.id);
                  setShowDocumentation(true);
                }}
                onHoverStart={() => setHoveredComponent(component.id)}
                onHoverEnd={() => setHoveredComponent(null)}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + Math.random() * 0.3 }}
              >
                <div className="p-3 h-full flex flex-col justify-between text-center relative">
                  {/* Status Indicator */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                    component.status === 'healthy' ? 'bg-green-400' :
                    component.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  } shadow-sm`}></div>

                  {/* Component Info - Top Section */}
                  <div className="flex-1 flex flex-col justify-center space-y-1">
                    <h3 className={`font-bold ${colors.text} text-sm leading-tight`}>
                      {component.name}
                    </h3>
                    {showLabels && (
                      <p className="text-gray-600 text-xs leading-tight opacity-90">
                        {component.description}
                      </p>
                    )}
                  </div>

                  {/* Ports/Protocols - Bottom Section */}
                  {component.ports && component.ports.length > 0 && showLabels && (
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {component.ports.slice(0, 2).map((port, idx) => (
                        <span key={idx} className="text-xs bg-white/90 text-gray-700 px-1.5 py-0.5 rounded border border-gray-300 font-mono shadow-sm">
                          :{port}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Animated Flow Dots */}
          {activeFlow && (
            <div className="absolute inset-0 pointer-events-none">
              {flowAnimations
                .find(f => f.id === activeFlow)
                ?.steps.map((step, stepIndex) => {
                  const fromComponent = components.find(c => c.id === step.from);
                  const toComponent = components.find(c => c.id === step.to);

                  if (!fromComponent || !toComponent) return null;

                  const startX = fromComponent.position.x + fromComponent.size.width / 2;
                  const startY = fromComponent.position.y + fromComponent.size.height / 2;
                  const endX = toComponent.position.x + toComponent.size.width / 2;
                  const endY = toComponent.position.y + toComponent.size.height / 2;

                  const stepProgress = Math.max(0, Math.min(100,
                    (flowProgress - (step.delay / 0.05)) / (step.duration / 0.05) * 100
                  ));

                  if (stepProgress <= 0) return null;

                  const currentX = startX + (endX - startX) * (stepProgress / 100);
                  const currentY = startY + (endY - startY) * (stepProgress / 100);

                  return (
                    <div
                      key={`${step.from}-${step.to}-${stepIndex}`}
                      className="absolute w-4 h-4 rounded-full shadow-lg animate-pulse"
                      style={{
                        left: currentX - 8,
                        top: currentY - 8,
                        backgroundColor: flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6',
                        boxShadow: `0 0 20px ${flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6'}`,
                        opacity: stepProgress > 95 ? (100 - stepProgress) / 5 : 1,
                        transform: `scale(${0.8 + (stepProgress / 100) * 0.4})`,
                        transition: 'all 0.1s ease-out'
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                          backgroundColor: flowAnimations.find(f => f.id === activeFlow)?.color || '#3b82f6',
                          opacity: 0.4
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>


      {/* Documentation Modal */}
      <ComponentDocumentation
        isOpen={showDocumentation && selectedDocComponent !== ''}
        onClose={() => {
          setShowDocumentation(false);
          setSelectedDocComponent('');
        }}
        selectedComponent={selectedDocComponent}
      />
    </div>
  );
};

export default K8sExplained;
