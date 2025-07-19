import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Play,
  RotateCcw,
  Star,
  Award,
  TrendingUp,
  Users,
  Layers,
  Network,
  Server,
  Database,
  Shield,
  Search
} from 'lucide-react';

interface ScenarioPanelProps {
  onClose: () => void;
  onScenarioChange: (scenarioId: string) => void;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  objectives: string[];
  completed: boolean;
  rating: number;
  tags: string[];
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ onClose, onScenarioChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const scenarios: Scenario[] = [
    // Level 1: Pod-Level Debugging (Beginner)
    {
      id: 'crashloop-1',
      name: 'CrashLoopBackOff Mystery',
      description: 'Pod starts, crashes repeatedly due to missing environment variable',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '10-15 min',
      objectives: ['Check container logs', 'Use kubectl describe pod', 'Fix entrypoint or missing env var', 'Verify pod reaches Running state'],
      completed: false,
      rating: 4.8,
      tags: ['crashloop', 'environment', 'logs']
    },
    {
      id: 'imagepull-1',
      name: 'ImagePullBackOff Challenge',
      description: 'Kubernetes cannot pull container image from private registry',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '8-12 min',
      objectives: ['Identify ImagePullBackOff error', 'Check image name and registry', 'Validate image pull secrets', 'Verify pod can pull image'],
      completed: false,
      rating: 4.6,
      tags: ['images', 'secrets', 'registry']
    },
    {
      id: 'pod-pending-1',
      name: 'Pod Stuck Pending',
      description: 'Pod scheduled but not running due to resource constraints',
      category: 'pod-issues',
      difficulty: 'Beginner',
      estimatedTime: '12-18 min',
      objectives: ['Check why pod is Pending', 'Examine node availability', 'Verify resource requests', 'Fix scheduling constraints'],
      completed: false,
      rating: 4.5,
      tags: ['pending', 'resources', 'scheduling']
    },

    // Level 2: Service and Networking Issues (Intermediate)
    {
      id: 'service-unreachable-1',
      name: 'Service Not Reachable',
      description: 'Application cannot reach other service due to wrong selector',
      category: 'networking',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Test service connectivity', 'Validate service selectors', 'Check service ports', 'Fix service configuration'],
      completed: false,
      rating: 4.7,
      tags: ['networking', 'services', 'connectivity']
    },
    {
      id: 'readiness-probe-1',
      name: 'Readiness Probe Failing',
      description: 'Service marked as not ready due to incorrect probe configuration',
      category: 'networking',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 min',
      objectives: ['Check readiness probe config', 'Verify probe path and port', 'Adjust probe timing', 'Ensure service receives traffic'],
      completed: false,
      rating: 4.4,
      tags: ['probes', 'readiness', 'health']
    },
    {
      id: 'dns-failure-1',
      name: 'DNS Resolution Fails',
      description: 'Pod cannot resolve internal service names due to CoreDNS issues',
      category: 'networking',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Test DNS resolution', 'Check CoreDNS pods', 'Verify DNS configuration', 'Fix DNS resolution'],
      completed: false,
      rating: 4.9,
      tags: ['dns', 'coredns', 'networking']
    },

    // Level 3: Node & Scheduling Issues (Intermediate)
    {
      id: 'node-resources-1',
      name: 'Node Out of Resources',
      description: 'Pods evicted due to memory pressure on nodes',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 min',
      objectives: ['Identify resource pressure', 'Check node conditions', 'Analyze resource requests', 'Implement resource management'],
      completed: false,
      rating: 4.5,
      tags: ['resources', 'nodes', 'eviction']
    },
    {
      id: 'taints-tolerations-1',
      name: 'Taints and Tolerations Mismatch',
      description: 'Pod not scheduled due to node taints without matching tolerations',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Check scheduling failure', 'Examine node taints', 'Add appropriate tolerations', 'Verify pod gets scheduled'],
      completed: false,
      rating: 4.3,
      tags: ['taints', 'tolerations', 'scheduling']
    },
    {
      id: 'hostport-conflict-1',
      name: 'Host Port Conflict',
      description: 'Pod fails to start due to host port already in use',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 min',
      objectives: ['Identify host port error', 'Check port usage', 'Modify pod configuration', 'Ensure pod starts successfully'],
      completed: false,
      rating: 4.2,
      tags: ['hostport', 'conflict', 'networking']
    },

    // Level 4: Persistent Storage and Security (Intermediate)
    {
      id: 'pvc-pending-1',
      name: 'PVC Stuck in Pending',
      description: 'Persistent Volume Claim cannot be bound due to storage issues',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Check PVC status', 'Verify storage class', 'Check PV availability', 'Fix volume provisioning'],
      completed: false,
      rating: 4.4,
      tags: ['storage', 'pvc', 'volumes']
    },
    {
      id: 'volume-permissions-1',
      name: 'Volume Mount Permission Denied',
      description: 'Pod starts but fails to read/write to mounted volume',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 min',
      objectives: ['Identify permission errors', 'Check volume permissions', 'Configure fsGroup', 'Verify volume access'],
      completed: false,
      rating: 4.1,
      tags: ['permissions', 'volumes', 'security']
    },
    {
      id: 'secret-missing-1',
      name: 'Secret or ConfigMap Not Found',
      description: 'Pod fails due to missing secret or configmap reference',
      category: 'storage',
      difficulty: 'Beginner',
      estimatedTime: '8-12 min',
      objectives: ['Identify missing resource error', 'Check referenced resources', 'Create missing secret/configmap', 'Verify pod starts'],
      completed: false,
      rating: 4.6,
      tags: ['secrets', 'configmaps', 'references']
    },

    // Level 5: Ingress, Controllers, and Mesh (Advanced)
    {
      id: 'ingress-404-1',
      name: 'Ingress Returns 404 or 502',
      description: 'Frontend unreachable due to ingress configuration issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Check ingress controller logs', 'Validate backend service', 'Verify TLS secrets', 'Fix ingress routing'],
      completed: false,
      rating: 4.7,
      tags: ['ingress', 'routing', 'tls']
    },
    {
      id: 'sidecar-injection-1',
      name: 'Sidecar Injection Breaks Pod',
      description: 'App fails due to missing or misconfigured service mesh sidecar',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Check sidecar injection', 'Examine init container logs', 'Verify mesh labels', 'Fix sidecar configuration'],
      completed: false,
      rating: 4.8,
      tags: ['istio', 'sidecar', 'mesh']
    },
    {
      id: 'operator-reconcile-1',
      name: 'Operator Does Not Reconcile',
      description: 'Custom resource ignored due to operator issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Check custom resource status', 'Examine operator logs', 'Verify CRD compatibility', 'Fix operator permissions'],
      completed: false,
      rating: 4.5,
      tags: ['operators', 'crd', 'reconciliation']
    },

    // Level 6: CI/CD, Monitoring, and Time (Advanced)
    {
      id: 'job-cronjob-fail-1',
      name: 'Job or CronJob Fails',
      description: 'One-time job crashes with no clear error message',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Check job status', 'Verify job command', 'Check completion conditions', 'Fix job configuration'],
      completed: false,
      rating: 4.3,
      tags: ['jobs', 'cronjobs', 'batch']
    },
    {
      id: 'prometheus-scraping-1',
      name: 'Prometheus Not Scraping',
      description: 'Metrics missing due to scrape configuration issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '18-25 min',
      objectives: ['Check Prometheus targets', 'Verify service monitor', 'Check metrics endpoint', 'Fix scrape configuration'],
      completed: false,
      rating: 4.6,
      tags: ['prometheus', 'metrics', 'monitoring']
    },
    {
      id: 'time-sync-1',
      name: 'Time Sync Issues',
      description: 'Logs out of order and JWT token errors due to clock skew',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Check node time sync', 'Verify NTP configuration', 'Check JWT validation', 'Fix time drift'],
      completed: false,
      rating: 4.4,
      tags: ['time', 'ntp', 'jwt']
    },

    // Level 7: Advanced Multi-Component Scenarios (Expert)
    {
      id: 'multi-component-1',
      name: 'Multi-Component Failure',
      description: 'Database, cache, and app all failing in cascade',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '30-40 min',
      objectives: ['Identify root cause', 'Check dependencies', 'Fix in correct order', 'Verify stack health'],
      completed: false,
      rating: 4.9,
      tags: ['cascade', 'dependencies', 'troubleshooting']
    },
    {
      id: 'network-policy-1',
      name: 'Network Policy Blocking Traffic',
      description: 'Microservices cannot communicate due to restrictive policies',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Test connectivity', 'Check network policies', 'Identify blocked traffic', 'Update policies'],
      completed: false,
      rating: 4.7,
      tags: ['networkpolicy', 'security', 'connectivity']
    },
    {
      id: 'rbac-permissions-1',
      name: 'RBAC Permission Denied',
      description: 'Service account lacks permissions for required operations',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Identify permission errors', 'Check service accounts', 'Verify role bindings', 'Fix RBAC configuration'],
      completed: false,
      rating: 4.5,
      tags: ['rbac', 'permissions', 'security']
    },
    {
      id: 'resource-quota-1',
      name: 'Resource Quota Exceeded',
      description: 'New pods cannot be created due to namespace quotas',
      category: 'advanced',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Check resource quota', 'Identify exhausted resources', 'Adjust quotas', 'Verify pod creation'],
      completed: false,
      rating: 4.2,
      tags: ['quota', 'resources', 'limits']
    },
    {
      id: 'admission-webhook-1',
      name: 'Admission Webhook Blocking',
      description: 'Pods rejected by validating admission webhook',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Identify webhook rejection', 'Check webhook config', 'Validate endpoint health', 'Fix webhook rules'],
      completed: false,
      rating: 4.6,
      tags: ['webhooks', 'admission', 'validation']
    },

    // Bonus Expert Scenarios
    {
      id: 'etcd-corruption-1',
      name: 'ETCD Data Corruption',
      description: 'Cluster state inconsistent due to etcd issues',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '40-50 min',
      objectives: ['Identify etcd health issues', 'Check state consistency', 'Perform backup/restore', 'Verify cluster functionality'],
      completed: false,
      rating: 5.0,
      tags: ['etcd', 'corruption', 'backup']
    },
    {
      id: 'oom-killer-1',
      name: 'OOM Killer Strikes',
      description: 'Pods killed by OOM killer due to memory limits',
      category: 'advanced',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Identify OOM killed containers', 'Check memory patterns', 'Adjust memory limits', 'Prevent future OOM kills'],
      completed: false,
      rating: 4.3,
      tags: ['oom', 'memory', 'limits']
    },

    // Additional Advanced Scenarios (26-43)
    {
      id: 'admission-webhook-fail-1',
      name: 'Admission Webhook Failing',
      description: 'Resource validation blocked by webhook timeout or TLS errors',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Identify webhook rejection', 'Check webhook URL and service', 'Validate TLS certificates', 'Fix webhook configuration'],
      completed: false,
      rating: 4.4,
      tags: ['webhooks', 'tls', 'validation']
    },
    {
      id: 'init-container-timeout-1',
      name: 'Init Container Timeout',
      description: 'Init container never finishes, blocking main container startup',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Examine init container logs', 'Check network access', 'Identify hanging processes', 'Fix init configuration'],
      completed: false,
      rating: 4.2,
      tags: ['init-containers', 'timeout', 'dependencies']
    },
    {
      id: 'fluentd-errors-1',
      name: 'Fluentd/Log Forwarder Errors',
      description: 'Logs missing from central system due to forwarder issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Check fluentd configuration', 'Validate output sink', 'Verify file permissions', 'Fix log forwarding'],
      completed: false,
      rating: 4.3,
      tags: ['fluentd', 'logging', 'forwarding']
    },
    {
      id: 'kubelet-resource-leak-1',
      name: 'Kubelet Resource Leak',
      description: 'Node slowly becomes unstable due to kubelet memory issues',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '30-40 min',
      objectives: ['Identify kubelet leaks', 'Check garbage collection', 'Tune cadvisor config', 'Implement cleanup'],
      completed: false,
      rating: 4.8,
      tags: ['kubelet', 'memory-leak', 'node-stability']
    },
    {
      id: 'cloud-provider-issues-1',
      name: 'Cloud Provider Integration Issues',
      description: 'LoadBalancer stuck or volumes not attaching due to cloud API errors',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Check cloud controller logs', 'Verify IAM permissions', 'Validate region settings', 'Fix cloud integration'],
      completed: false,
      rating: 4.5,
      tags: ['cloud-provider', 'iam', 'loadbalancer']
    },
    {
      id: 'liveness-probe-failure-1',
      name: 'Liveness Probe Failure',
      description: 'Pod restarted repeatedly despite app working intermittently',
      category: 'pod-issues',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 min',
      objectives: ['Check liveness probe config', 'Analyze probe timing', 'Confirm endpoint behavior', 'Adjust probe settings'],
      completed: false,
      rating: 4.1,
      tags: ['liveness-probe', 'health-checks', 'timing']
    },
    {
      id: 'hpa-not-scaling-1',
      name: 'HPA Not Scaling',
      description: 'App under load but no pods added due to metrics issues',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '18-25 min',
      objectives: ['Check metrics-server status', 'Verify HPA configuration', 'Confirm metrics exposure', 'Fix autoscaling'],
      completed: false,
      rating: 4.4,
      tags: ['hpa', 'autoscaling', 'metrics']
    },
    {
      id: 'configmap-not-propagating-1',
      name: 'ConfigMap Changes Not Propagating',
      description: 'App uses outdated config after ConfigMap changes',
      category: 'storage',
      difficulty: 'Intermediate',
      estimatedTime: '10-15 min',
      objectives: ['Check ConfigMap mount config', 'Verify subPath settings', 'Restart pods if needed', 'Ensure propagation'],
      completed: false,
      rating: 4.0,
      tags: ['configmap', 'subpath', 'propagation']
    },
    {
      id: 'node-disk-pressure-1',
      name: 'Node Disk Pressure',
      description: 'Pods evicted unexpectedly due to disk space issues',
      category: 'scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      objectives: ['Check node disk usage', 'Identify disk pressure', 'Clean up files', 'Prevent future issues'],
      completed: false,
      rating: 4.3,
      tags: ['disk-pressure', 'eviction', 'cleanup']
    },
    {
      id: 'daemonset-not-running-1',
      name: 'DaemonSet Not Running on All Nodes',
      description: 'DaemonSet skipped on some nodes due to tolerations or selectors',
      category: 'workloads',
      difficulty: 'Intermediate',
      estimatedTime: '12-18 min',
      objectives: ['Check DaemonSet distribution', 'Verify node selectors', 'Fix scheduling constraints', 'Ensure all nodes'],
      completed: false,
      rating: 4.2,
      tags: ['daemonset', 'tolerations', 'node-selector']
    },

    // Expert Level Scenarios (35-43)
    {
      id: 'api-server-down-1',
      name: 'API Server Down or Unreachable',
      description: 'kubectl not responding, cluster components stuck',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '35-45 min',
      objectives: ['Diagnose API connectivity', 'Check kube-apiserver logs', 'Verify etcd connectivity', 'Restore API server'],
      completed: false,
      rating: 5.0,
      tags: ['api-server', 'etcd', 'cluster-recovery']
    },
    {
      id: 'stuck-finalizers-1',
      name: 'Stuck Finalizers Prevent Deletion',
      description: 'Resource stuck in Terminating state due to finalizers',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '15-20 min',
      objectives: ['Identify stuck finalizers', 'Check dependencies', 'Remove blocking finalizers', 'Complete deletion'],
      completed: false,
      rating: 4.6,
      tags: ['finalizers', 'terminating', 'cleanup']
    },
    {
      id: 'multiple-ingress-conflict-1',
      name: 'Multiple Ingress Controllers Conflict',
      description: 'Only one ingress works or routing fails due to controller conflicts',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Identify conflicting controllers', 'Check ingress class', 'Define proper classes', 'Isolate controllers'],
      completed: false,
      rating: 4.4,
      tags: ['ingress-class', 'controllers', 'routing']
    },
    {
      id: 'volume-stuck-detaching-1',
      name: 'Volume Stuck Detaching or Attaching',
      description: 'Volume won\'t detach from node, blocking pod scheduling',
      category: 'storage',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Identify stuck operations', 'Check controller logs', 'Force detach if needed', 'Restore functionality'],
      completed: false,
      rating: 4.3,
      tags: ['volumes', 'detach', 'controller-manager']
    },
    {
      id: 'argocd-sync-fails-1',
      name: 'ArgoCD Sync Fails (GitOps)',
      description: 'ArgoCD fails to apply manifest due to validation or RBAC issues',
      category: 'ingress',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Check ArgoCD status', 'Validate manifest syntax', 'Verify RBAC permissions', 'Fix CRD compatibility'],
      completed: false,
      rating: 4.7,
      tags: ['argocd', 'gitops', 'rbac']
    },
    {
      id: 'certificate-expired-1',
      name: 'Certificate Expired (K8s API or Ingress TLS)',
      description: 'TLS certificates expired causing authentication failures',
      category: 'advanced',
      difficulty: 'Expert',
      estimatedTime: '30-40 min',
      objectives: ['Identify expired certificates', 'Check validity dates', 'Renew certificates', 'Verify TLS functionality'],
      completed: false,
      rating: 4.9,
      tags: ['tls', 'certificates', 'expiration']
    },
    {
      id: 'coredns-config-error-1',
      name: 'CoreDNS Configuration Error',
      description: 'DNS resolution fails due to incorrect Corefile configuration',
      category: 'networking',
      difficulty: 'Advanced',
      estimatedTime: '18-25 min',
      objectives: ['Check CoreDNS config', 'Validate Corefile syntax', 'Verify zone settings', 'Fix DNS configuration'],
      completed: false,
      rating: 4.5,
      tags: ['coredns', 'corefile', 'dns-config']
    },
    {
      id: 'metrics-server-fails-1',
      name: 'Metrics Server Fails to Start',
      description: 'Metrics server needed for HPA fails due to CA cert or API issues',
      category: 'monitoring',
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      objectives: ['Check metrics-server status', 'Verify CA certificates', 'Fix API connectivity', 'Ensure metrics collection'],
      completed: false,
      rating: 4.4,
      tags: ['metrics-server', 'ca-certs', 'hpa']
    },
    {
      id: 'pod-security-policy-1',
      name: 'Pod Security Policy (PSP) Denies Pod',
      description: 'Pod won\'t schedule due to missing capabilities or PSP restrictions',
      category: 'advanced',
      difficulty: 'Advanced',
      estimatedTime: '22-28 min',
      objectives: ['Identify PSP denial', 'Check required capabilities', 'Modify security context', 'Meet PSP requirements'],
      completed: false,
      rating: 4.3,
      tags: ['psp', 'security', 'capabilities']
    },
    {
      id: 'statefulset-misconfigured-1',
      name: 'Misconfigured StatefulSet',
      description: 'StatefulSet fails due to improper headless service or volume templates',
      category: 'workloads',
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      objectives: ['Check StatefulSet config', 'Verify headless service', 'Validate volume templates', 'Fix StatefulSet issues'],
      completed: false,
      rating: 4.6,
      tags: ['statefulset', 'headless-service', 'volume-templates']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Scenarios (43)', icon: Target, count: scenarios.length },
    { id: 'pod-issues', name: 'Pod Issues (Level 1)', icon: Layers, count: scenarios.filter(s => s.category === 'pod-issues').length },
    { id: 'networking', name: 'Networking (Level 2)', icon: Network, count: scenarios.filter(s => s.category === 'networking').length },
    { id: 'scheduling', name: 'Scheduling (Level 3)', icon: Server, count: scenarios.filter(s => s.category === 'scheduling').length },
    { id: 'storage', name: 'Storage & Config (Level 4)', icon: Database, count: scenarios.filter(s => s.category === 'storage').length },
    { id: 'ingress', name: 'Ingress & GitOps (Level 5)', icon: Shield, count: scenarios.filter(s => s.category === 'ingress').length },
    { id: 'workloads', name: 'Workloads & Jobs (Level 6)', icon: Users, count: scenarios.filter(s => s.category === 'workloads').length },
    { id: 'monitoring', name: 'Monitoring & Logging (Level 6)', icon: TrendingUp, count: scenarios.filter(s => s.category === 'monitoring').length },
    { id: 'advanced', name: 'Expert Multi-Component (Level 7)', icon: Award, count: scenarios.filter(s => s.category === 'advanced').length }
  ];

  const filteredScenarios = scenarios.filter(scenario => {
    if (selectedCategory !== 'all' && scenario.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && scenario.difficulty !== selectedDifficulty) return false;
    if (searchQuery && !scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advanced':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Expert':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '🟢';
      case 'Intermediate':
        return '🔵';
      case 'Advanced':
        return '🟠';
      case 'Expert':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
            }`}
          />
        ))}
        <span className="text-xs text-slate-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Debug Scenarios</h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-blue-100 mb-4">
            Choose from 43 comprehensive debugging scenarios to master Kubernetes troubleshooting skills
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenarios by name, description, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-slate-200 bg-slate-50 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Categories */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Difficulty</h3>
                <div className="space-y-1">
                  {['all', 'Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`w-full text-left p-2 rounded-lg transition-all ${
                        selectedDifficulty === difficulty
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Your Progress</span>
                </h3>

                <div className="space-y-4">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Overall Completion</span>
                      <span className="font-medium text-blue-600">
                        {scenarios.filter(s => s.completed).length}/{scenarios.length} scenarios
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(scenarios.filter(s => s.completed).length / scenarios.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>🟢</span>
                        <span className="font-medium">Beginner</span>
                      </div>
                      <span className="text-slate-600">
                        {scenarios.filter(s => s.difficulty === 'Beginner' && s.completed).length}/
                        {scenarios.filter(s => s.difficulty === 'Beginner').length}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>🔵</span>
                        <span className="font-medium">Intermediate</span>
                      </div>
                      <span className="text-slate-600">
                        {scenarios.filter(s => s.difficulty === 'Intermediate' && s.completed).length}/
                        {scenarios.filter(s => s.difficulty === 'Intermediate').length}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>🟠</span>
                        <span className="font-medium">Advanced</span>
                      </div>
                      <span className="text-slate-600">
                        {scenarios.filter(s => s.difficulty === 'Advanced' && s.completed).length}/
                        {scenarios.filter(s => s.difficulty === 'Advanced').length}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>🔴</span>
                        <span className="font-medium">Expert</span>
                      </div>
                      <span className="text-slate-600">
                        {scenarios.filter(s => s.difficulty === 'Expert' && s.completed).length}/
                        {scenarios.filter(s => s.difficulty === 'Expert').length}
                      </span>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="space-y-2 pt-2 border-t border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Average Rating</span>
                      <span className="font-medium">4.7/5.0 ⭐</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Time</span>
                      <span className="font-medium">2h 45m ⏱️</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Skill Level</span>
                      <span className="font-medium text-blue-600">Intermediate 🚀</span>
                    </div>
                  </div>

                  {/* Scenario Distribution */}
                  <div className="space-y-2 pt-2 border-t border-blue-200">
                    <h4 className="text-xs font-medium text-slate-700 mb-2">Scenario Distribution</h4>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="text-green-600 font-bold">{scenarios.filter(s => s.difficulty === 'Beginner').length}</div>
                        <div className="text-slate-600">Beginner</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-bold">{scenarios.filter(s => s.difficulty === 'Intermediate').length}</div>
                        <div className="text-slate-600">Intermediate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-600 font-bold">{scenarios.filter(s => s.difficulty === 'Advanced').length}</div>
                        <div className="text-slate-600">Advanced</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-bold">{scenarios.filter(s => s.difficulty === 'Expert').length}</div>
                      <div className="text-slate-600">Expert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => {
                    onScenarioChange(scenario.id);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{scenario.name}</h3>
                        {scenario.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3">{scenario.description}</p>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md border ${getDifficultyColor(scenario.difficulty)}`}>
                          <span>{getDifficultyIcon(scenario.difficulty)}</span>
                          <span>{scenario.difficulty}</span>
                        </span>

                        <div className="flex items-center space-x-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{scenario.estimatedTime}</span>
                        </div>

                        {renderStars(scenario.rating)}
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Objectives:</h4>
                      <ul className="space-y-1">
                        {scenario.objectives.slice(0, 3).map((objective, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <span>{objective}</span>
                          </li>
                        ))}
                        {scenario.objectives.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{scenario.objectives.length - 3} more objectives
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {scenario.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScenarioChange(scenario.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>{scenario.completed ? 'Retry Scenario' : 'Start Scenario'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredScenarios.length === 0 && (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No scenarios found matching your filters</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScenarioPanel;
