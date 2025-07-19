// Scenario-specific resource mapping for exact pod/service/deployment names
// This ensures hints use the actual resource names from each scenario

export interface ScenarioResources {
  pods: string[];
  services: string[];
  deployments: string[];
  configMaps: string[];
  secrets: string[];
  nodes: string[];
  namespaces: string[];
  primaryPod?: string; // The main pod to focus on for this scenario
  primaryService?: string;
  primaryDeployment?: string;
}

export const getScenarioResources = (scenarioId: string): ScenarioResources => {
  switch (scenarioId) {
    case 'crashloop-1':
      return {
        pods: ['nginx-deployment-abc123'],
        services: ['nginx-service'],
        deployments: ['nginx-deployment'],
        configMaps: ['nginx-config'],
        secrets: ['nginx-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'nginx-deployment-abc123',
        primaryDeployment: 'nginx-deployment'
      };

    case 'imagepull-1':
      return {
        pods: ['frontend-deployment-ghi789'],
        services: ['frontend-service'],
        deployments: ['frontend-deployment'],
        configMaps: ['frontend-config'],
        secrets: ['regcred', 'docker-registry-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'frontend-deployment-ghi789',
        primaryDeployment: 'frontend-deployment'
      };

    case 'pod-pending-1':
      return {
        pods: ['large-app-deployment-xyz456'],
        services: ['large-app-service'],
        deployments: ['large-app-deployment'],
        configMaps: ['large-app-config'],
        secrets: ['large-app-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'large-app-deployment-xyz456',
        primaryDeployment: 'large-app-deployment'
      };

    case 'oom-1':
      return {
        pods: ['memory-hungry-app-def789'],
        services: ['memory-app-service'],
        deployments: ['memory-hungry-deployment'],
        configMaps: ['memory-app-config'],
        secrets: ['memory-app-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'memory-hungry-app-def789',
        primaryDeployment: 'memory-hungry-deployment'
      };

    case 'resource-quota-1':
      return {
        pods: ['quota-test-pod-abc123'],
        services: ['quota-test-service'],
        deployments: ['quota-test-deployment'],
        configMaps: ['quota-config'],
        secrets: ['quota-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default', 'resource-limited'],
        primaryPod: 'quota-test-pod-abc123',
        primaryDeployment: 'quota-test-deployment'
      };

    case 'service-unreachable-1':
      return {
        pods: ['backend-deployment-abc123', 'frontend-deployment-xyz789'],
        services: ['backend-service', 'frontend-service'],
        deployments: ['backend-deployment', 'frontend-deployment'],
        configMaps: ['backend-config', 'frontend-config'],
        secrets: ['backend-secret', 'frontend-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'backend-deployment-abc123',
        primaryService: 'backend-service',
        primaryDeployment: 'backend-deployment'
      };

    case 'dns-resolution-1':
      return {
        pods: ['frontend-deployment-abc123', 'coredns-558bd4d5db-xyz789'],
        services: ['backend-service', 'kube-dns'],
        deployments: ['frontend-deployment', 'coredns'],
        configMaps: ['coredns-config'],
        secrets: ['dns-secret'],
        nodes: ['worker-node-1', 'worker-node-2', 'master-1'],
        namespaces: ['default', 'kube-system'],
        primaryPod: 'frontend-deployment-abc123',
        primaryService: 'backend-service'
      };

    case 'network-policy-1':
      return {
        pods: ['frontend-pod-abc123', 'backend-pod-xyz789'],
        services: ['frontend-service', 'backend-service'],
        deployments: ['frontend-deployment', 'backend-deployment'],
        configMaps: ['network-config'],
        secrets: ['network-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'frontend-pod-abc123',
        primaryService: 'backend-service'
      };

    case 'load-balancer-1':
      return {
        pods: ['frontend-deployment-abc123'],
        services: ['frontend-lb', 'cloud-controller-manager'],
        deployments: ['frontend-deployment', 'cloud-controller-manager'],
        configMaps: ['cloud-config'],
        secrets: ['cloud-credentials'],
        nodes: ['worker-node-1', 'worker-node-2', 'master-1'],
        namespaces: ['default', 'kube-system'],
        primaryPod: 'frontend-deployment-abc123',
        primaryService: 'frontend-lb'
      };

    case 'pvc-pending-1':
      return {
        pods: ['database-pod-abc123'],
        services: ['database-service'],
        deployments: ['database-deployment'],
        configMaps: ['database-config'],
        secrets: ['database-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'database-pod-abc123',
        primaryDeployment: 'database-deployment'
      };

    case 'secret-missing-1':
      return {
        pods: ['app-deployment-abc123'],
        services: ['app-service'],
        deployments: ['app-deployment'],
        configMaps: ['app-config'],
        secrets: ['app-secret', 'database-credentials'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'app-deployment-abc123',
        primaryDeployment: 'app-deployment'
      };

    case 'ingress-404-1':
      return {
        pods: ['frontend-deployment-abc123', 'nginx-ingress-controller-xyz789'],
        services: ['frontend-service', 'ingress-nginx-controller'],
        deployments: ['frontend-deployment', 'ingress-nginx-controller'],
        configMaps: ['ingress-config', 'nginx-config'],
        secrets: ['tls-secret', 'ingress-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default', 'ingress-nginx'],
        primaryPod: 'frontend-deployment-abc123',
        primaryService: 'frontend-service'
      };

    case 'istio-sidecar-1':
      return {
        pods: ['app-deployment-abc123', 'istiod-xyz789-def456'],
        services: ['app-service', 'istiod'],
        deployments: ['app-deployment', 'istiod'],
        configMaps: ['istio-config'],
        secrets: ['istio-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default', 'istio-system'],
        primaryPod: 'app-deployment-abc123',
        primaryService: 'app-service'
      };

    case 'job-cronjob-fail-1':
      return {
        pods: ['backup-job-abc123', 'database-pod-xyz789'],
        services: ['database-service'],
        deployments: ['database-deployment'],
        configMaps: ['backup-config'],
        secrets: ['database-credentials'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'backup-job-abc123'
      };

    case 'prometheus-scraping-1':
      return {
        pods: ['myapp-deployment-abc123', 'prometheus-server-xyz789'],
        services: ['myapp-service', 'prometheus-server'],
        deployments: ['myapp-deployment', 'prometheus-server'],
        configMaps: ['prometheus-config'],
        secrets: ['prometheus-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default', 'monitoring'],
        primaryPod: 'myapp-deployment-abc123',
        primaryService: 'myapp-service'
      };

    case 'time-sync-1':
      return {
        pods: ['app-deployment-abc123'],
        services: ['app-service', 'ntp-service'],
        deployments: ['app-deployment'],
        configMaps: ['time-config'],
        secrets: ['jwt-secret'],
        nodes: ['worker-1', 'worker-2', 'master-1'],
        namespaces: ['default'],
        primaryPod: 'app-deployment-abc123',
        primaryDeployment: 'app-deployment'
      };

    case 'multi-component-1':
      return {
        pods: ['database-abc123', 'cache-xyz789', 'app-def456', 'old-database-ghi789'],
        services: ['database-service', 'cache-service', 'app-service'],
        deployments: ['database-deployment', 'cache-deployment', 'app-deployment'],
        configMaps: ['database-config', 'cache-config', 'app-config'],
        secrets: ['database-secret', 'cache-secret', 'app-secret'],
        nodes: ['worker-1', 'worker-2'],
        namespaces: ['default'],
        primaryPod: 'database-abc123'
      };

    case 'admission-webhook-1':
      return {
        pods: ['app-deployment-abc123', 'security-webhook-xyz789'],
        services: ['app-service', 'security-webhook-service'],
        deployments: ['app-deployment', 'security-webhook'],
        configMaps: ['webhook-config'],
        secrets: ['webhook-tls'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default', 'webhook-system'],
        primaryPod: 'app-deployment-abc123'
      };

    case 'etcd-corruption-1':
      return {
        pods: ['etcd-master-1', 'kube-apiserver-master-1'],
        services: ['etcd', 'kubernetes'],
        deployments: [],
        configMaps: ['etcd-config'],
        secrets: ['etcd-certs'],
        nodes: ['master-1', 'worker-1', 'worker-2'],
        namespaces: ['kube-system'],
        primaryPod: 'etcd-master-1'
      };

    case 'oom-killer-1':
      return {
        pods: ['memory-app-abc123', 'memory-app-xyz789'],
        services: ['memory-app-service'],
        deployments: ['memory-app-deployment'],
        configMaps: ['memory-config'],
        secrets: ['memory-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'memory-app-abc123',
        primaryDeployment: 'memory-app-deployment'
      };

    // Default fallback for any scenario not explicitly mapped
    default:
      return {
        pods: ['example-pod-abc123'],
        services: ['example-service'],
        deployments: ['example-deployment'],
        configMaps: ['example-config'],
        secrets: ['example-secret'],
        nodes: ['worker-node-1', 'worker-node-2'],
        namespaces: ['default'],
        primaryPod: 'example-pod-abc123',
        primaryDeployment: 'example-deployment'
      };
  }
};

// Helper function to get the primary failing resource for a scenario
export const getPrimaryFailingResource = (scenarioId: string): { type: string; name: string } => {
  const resources = getScenarioResources(scenarioId);
  
  switch (scenarioId) {
    case 'crashloop-1':
    case 'imagepull-1':
    case 'pod-pending-1':
    case 'oom-1':
    case 'oom-killer-1':
      return { type: 'pod', name: resources.primaryPod || resources.pods[0] };
    
    case 'service-unreachable-1':
    case 'dns-resolution-1':
    case 'load-balancer-1':
      return { type: 'service', name: resources.primaryService || resources.services[0] };
    
    case 'secret-missing-1':
      return { type: 'secret', name: 'app-secret' };
    
    case 'pvc-pending-1':
      return { type: 'pvc', name: 'database-pvc' };
    
    case 'ingress-404-1':
      return { type: 'ingress', name: 'frontend-ingress' };
    
    case 'job-cronjob-fail-1':
      return { type: 'job', name: 'backup-job' };
    
    case 'prometheus-scraping-1':
      return { type: 'servicemonitor', name: 'app-metrics' };
    
    case 'admission-webhook-1':
      return { type: 'validatingadmissionwebhook', name: 'security-webhook' };
    
    case 'etcd-corruption-1':
      return { type: 'pod', name: 'etcd-master-1' };
    
    default:
      return { type: 'pod', name: resources.primaryPod || resources.pods[0] };
  }
};
