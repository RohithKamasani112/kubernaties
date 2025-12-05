import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Globe, Cloud, Shield, Router, Network, Server, Database, Target, RefreshCw, 
  Monitor, Activity, Wifi, Container, Box, Layers, GitBranch, Gauge, HardDrive, 
  FileText, X, Info
} from 'lucide-react';

interface K8sComponent {
  id: string;
  name: string;
  description: string;
  technicalDetails: string;
  icon: React.ComponentType<any>;
  category: string;
  status: 'healthy' | 'warning' | 'error';
}

const K8sExplained: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<K8sComponent | null>(null);

  // Clean, organized component data
  const componentSections = [
    {
      title: "External Access",
      color: "blue",
      components: [
        {
          id: 'user',
          name: 'User',
          description: 'End user accessing application',
          technicalDetails: 'Human user, web browser, mobile app, or API client making requests to the cluster',
          icon: Users,
          category: 'access',
          status: 'healthy' as const
        },
        {
          id: 'dns',
          name: 'DNS',
          description: 'Domain Name System',
          technicalDetails: 'Resolves domain names (app.example.com) to IP addresses. Managed by cloud provider or external DNS service.',
          icon: Globe,
          category: 'access',
          status: 'healthy' as const
        },
        {
          id: 'external-lb',
          name: 'External Load Balancer',
          description: 'Cloud provider load balancer',
          technicalDetails: 'AWS ALB/NLB, GCP Load Balancer, or Azure Load Balancer. Distributes traffic across multiple ingress controllers.',
          icon: Cloud,
          category: 'access',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Ingress Layer",
      color: "purple",
      components: [
        {
          id: 'ingress-controller',
          name: 'Ingress Controller',
          description: 'NGINX/Traefik routing',
          technicalDetails: 'Manages external access to services in cluster. Handles SSL termination, HTTP routing, load balancing. Runs as pods.',
          icon: Router,
          category: 'ingress',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Services & Networking",
      color: "green",
      components: [
        {
          id: 'loadbalancer-service',
          name: 'LoadBalancer Service',
          description: 'External service exposure',
          technicalDetails: 'Kubernetes Service type=LoadBalancer. Exposes service externally using cloud provider load balancer.',
          icon: Network,
          category: 'services',
          status: 'healthy' as const
        },
        {
          id: 'clusterip-service',
          name: 'ClusterIP Service',
          description: 'Internal cluster service',
          technicalDetails: 'Internal service with cluster IP. Load balances traffic to pod endpoints. Default service type.',
          icon: Network,
          category: 'services',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Control Plane",
      color: "indigo",
      components: [
        {
          id: 'api-server',
          name: 'API Server',
          description: 'Kubernetes API server',
          technicalDetails: 'REST API server (port 6443). Validates requests, handles authentication, authorization, admission control. Central hub for all cluster communication.',
          icon: Server,
          category: 'control-plane',
          status: 'healthy' as const
        },
        {
          id: 'etcd',
          name: 'etcd',
          description: 'Cluster database',
          technicalDetails: 'Distributed key-value store using Raft consensus protocol. Stores all cluster state, configuration, secrets, and metadata.',
          icon: Database,
          category: 'control-plane',
          status: 'healthy' as const
        },
        {
          id: 'scheduler',
          name: 'Scheduler',
          description: 'Pod placement engine',
          technicalDetails: 'Assigns pods to nodes based on resource requirements, node affinity, taints/tolerations, and scheduling policies.',
          icon: Target,
          category: 'control-plane',
          status: 'healthy' as const
        },
        {
          id: 'controller-manager',
          name: 'Controller Manager',
          description: 'Controller processes',
          technicalDetails: 'Runs controllers: ReplicaSet, Deployment, Service, Node, Endpoint controllers. Ensures desired state matches actual state.',
          icon: RefreshCw,
          category: 'control-plane',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Worker Nodes",
      color: "slate",
      components: [
        {
          id: 'kubelet',
          name: 'kubelet',
          description: 'Node agent',
          technicalDetails: 'Manages pod lifecycle on the node. Communicates with API server (port 10250), pulls images, starts/stops containers.',
          icon: Activity,
          category: 'worker-node',
          status: 'healthy' as const
        },
        {
          id: 'kube-proxy',
          name: 'kube-proxy',
          description: 'Network proxy',
          technicalDetails: 'Maintains network rules on nodes. Implements Service abstraction by routing traffic to correct pods.',
          icon: Wifi,
          category: 'worker-node',
          status: 'healthy' as const
        },
        {
          id: 'container-runtime',
          name: 'Container Runtime',
          description: 'containerd/CRI-O',
          technicalDetails: 'Pulls container images, creates containers, manages container lifecycle. Implements CRI (Container Runtime Interface).',
          icon: Container,
          category: 'worker-node',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Workloads",
      color: "emerald",
      components: [
        {
          id: 'deployment',
          name: 'Deployment',
          description: 'Manages ReplicaSets and pods',
          technicalDetails: 'Provides declarative updates for pods and ReplicaSets. Handles rolling updates, rollbacks, scaling.',
          icon: Layers,
          category: 'workload',
          status: 'healthy' as const
        },
        {
          id: 'replicaset',
          name: 'ReplicaSet',
          description: 'Maintains pod replicas',
          technicalDetails: 'Ensures specified number of pod replicas are running. Created and managed by Deployment.',
          icon: GitBranch,
          category: 'workload',
          status: 'healthy' as const
        },
        {
          id: 'pod',
          name: 'Pod',
          description: 'Application pod',
          technicalDetails: 'Group of containers sharing network and storage. Smallest deployable unit in Kubernetes.',
          icon: Box,
          category: 'workload',
          status: 'healthy' as const
        },
        {
          id: 'hpa',
          name: 'HPA',
          description: 'Horizontal Pod Autoscaler',
          technicalDetails: 'Automatically scales the number of pods based on CPU utilization, memory usage, or custom metrics.',
          icon: Gauge,
          category: 'workload',
          status: 'healthy' as const
        }
      ]
    },
    {
      title: "Storage & Config",
      color: "orange",
      components: [
        {
          id: 'persistent-volume',
          name: 'PersistentVolume',
          description: 'Cluster storage resource',
          technicalDetails: 'Cluster-wide storage resource with lifecycle independent of pods. Backed by cloud storage or local disks.',
          icon: HardDrive,
          category: 'storage',
          status: 'healthy' as const
        },
        {
          id: 'persistent-volume-claim',
          name: 'PVC',
          description: 'Storage request',
          technicalDetails: 'Request for storage by user. Binds to available PV with matching requirements.',
          icon: HardDrive,
          category: 'storage',
          status: 'healthy' as const
        },
        {
          id: 'configmap',
          name: 'ConfigMap',
          description: 'Configuration data',
          technicalDetails: 'Stores non-confidential configuration data in key-value pairs. Can be consumed as environment variables, command-line arguments, or config files.',
          icon: FileText,
          category: 'config',
          status: 'healthy' as const
        },
        {
          id: 'secret',
          name: 'Secret',
          description: 'Sensitive data',
          technicalDetails: 'Stores sensitive information like passwords, OAuth tokens, SSH keys. Base64 encoded and encrypted at rest.',
          icon: Shield,
          category: 'config',
          status: 'healthy' as const
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', hover: 'hover:bg-purple-100' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', hover: 'hover:bg-green-100' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', hover: 'hover:bg-indigo-100' },
      slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', hover: 'hover:bg-slate-100' },
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', hover: 'hover:bg-emerald-100' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', hover: 'hover:bg-orange-100' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kubernetes Architecture Explained</h1>
          <p className="text-gray-600">Interactive guide to Kubernetes components and their relationships</p>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {componentSections.map((section) => {
            const colors = getColorClasses(section.color);
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${colors.bg} ${colors.border} border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm`}
              >
                <h2 className={`text-lg sm:text-xl font-bold ${colors.text} mb-3 sm:mb-4 flex items-center gap-2`}>
                  <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-current`}></div>
                  {section.title}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {section.components.map((component) => {
                    const IconComponent = component.icon;
                    return (
                      <motion.div
                        key={component.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedComponent(component)}
                        className={`${colors.hover} bg-white border ${colors.border} rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className={`${colors.bg} ${colors.border} border rounded-lg p-1.5 sm:p-2 flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{component.name}</h3>
                            <p className="text-gray-600 text-xs leading-relaxed">{component.description}</p>
                          </div>
                          <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Component Details Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedComponent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                      <selectedComponent.icon className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedComponent.name}</h2>
                      <p className="text-gray-600">{selectedComponent.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComponent(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Details</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedComponent.technicalDetails}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default K8sExplained;
