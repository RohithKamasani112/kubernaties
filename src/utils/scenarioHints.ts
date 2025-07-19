// Enhanced hints system for K8s debugging scenarios
// Provides detailed, step-by-step guidance with exact commands

import {
  getIngress404Hints,
  getIstioSidecarHints,
  getJobCronJobHints,
  getPrometheusScrapingHints
} from './advancedScenarioHints';

import {
  getTimeSyncHints,
  getMultiComponentHints,
  getAdmissionWebhookHints,
  getEtcdCorruptionHints,
  getOOMKillerHints
} from './expertScenarioHints';

import { getScenarioResources, getPrimaryFailingResource } from './scenarioResourceMapping';

interface EnhancedHint {
  id: string;
  title: string;
  description: string;
  explanation: string;
  type: 'command' | 'concept' | 'warning' | 'tip' | 'analysis';
  priority: number;
  command?: string;
  exactCommand?: string;
  expectedOutput?: string;
  timeToReveal: number; // 10-second intervals
  category: 'discovery' | 'investigation' | 'diagnosis' | 'fix' | 'verification';
}

// Generic hints for when no specific scenario is matched
export const getGenericHints = (): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Start with Basic Pod Check',
    description: 'Get an overview of all pods in the namespace.',
    explanation: 'This is the standard first step for any Kubernetes debugging session. It gives you a quick overview of the current state of all pods.',
    type: 'command',
    priority: 1,
    command: 'kubectl get pods',
    exactCommand: 'kubectl get pods',
    expectedOutput: 'NAME                     READY   STATUS    RESTARTS   AGE\nexample-pod-abc123      1/1     Running   0          2m',
    timeToReveal: 10,
    category: 'discovery'
  }
];

export const getScenarioHints = (scenarioId: string): EnhancedHint[] => {
  const resources = getScenarioResources(scenarioId);
  const primaryResource = getPrimaryFailingResource(scenarioId);

  switch (scenarioId) {
    // Level 1: Pod-Level Debugging
    case 'crashloop-1':
      return getCrashLoopHints(resources);
    case 'imagepull-1':
      return getImagePullHints(resources);
    case 'pod-pending-1':
      return getPodPendingHints(resources);
    case 'oom-1':
      return getOOMHints(resources);
    case 'resource-quota-1':
      return getResourceQuotaHints(resources);

    // Level 2: Service and Networking Issues
    case 'service-unreachable-1':
      return getServiceUnreachableHints(resources);
    case 'dns-resolution-1':
      return getDNSResolutionHints(resources);
    case 'network-policy-1':
      return getNetworkPolicyHints(resources);
    case 'load-balancer-1':
      return getLoadBalancerHints(resources);

    // Level 3: Storage and Configuration
    case 'pvc-pending-1':
      return getPVCPendingHints(resources);
    case 'secret-missing-1':
      return getSecretMissingHints(resources);

    // Level 4: Ingress, Controllers, and Mesh
    case 'ingress-404-1':
      return getIngress404Hints(resources);
    case 'istio-sidecar-1':
      return getIstioSidecarHints(resources);

    // Level 5: CI/CD, Monitoring, and Time
    case 'job-cronjob-fail-1':
      return getJobCronJobHints(resources);
    case 'prometheus-scraping-1':
      return getPrometheusScrapingHints(resources);
    case 'time-sync-1':
      return getTimeSyncHints(resources);

    // Level 6: Advanced Multi-Component Scenarios
    case 'multi-component-1':
      return getMultiComponentHints(resources);
    case 'admission-webhook-1':
      return getAdmissionWebhookHints(resources);

    // Expert Level Scenarios
    case 'etcd-corruption-1':
      return getEtcdCorruptionHints(resources);
    case 'oom-killer-1':
      return getOOMKillerHints(resources);
    case 'admission-webhook-fail-1':
      return getAdmissionWebhookFailHints(resources);
    case 'cni-plugin-1':
      return getCNIPluginHints(resources);
    case 'scheduler-fail-1':
      return getSchedulerFailHints(resources);
    case 'kubelet-down-1':
      return getKubeletDownHints(resources);
    case 'certificate-expired-1':
      return getCertificateExpiredHints(resources);
    case 'node-not-ready-1':
      return getNodeNotReadyHints(resources);
    case 'pod-security-1':
      return getPodSecurityHints(resources);
    case 'rbac-permission-1':
      return getRBACPermissionHints(resources);
    case 'custom-resource-1':
      return getCustomResourceHints(resources);
    case 'operator-stuck-1':
      return getOperatorStuckHints(resources);
    case 'helm-release-1':
      return getHelmReleaseHints(resources);
    case 'liveness-probe-1':
      return getLivenessProbeHints(resources);
    case 'hpa-not-scaling-1':
      return getHPANotScalingHints(resources);
    case 'configmap-not-propagating-1':
      return getConfigMapNotPropagatingHints(resources);
    case 'disk-pressure-1':
      return getDiskPressureHints(resources);
    case 'daemonset-not-running-1':
      return getDaemonSetNotRunningHints(resources);
    case 'api-server-down-1':
      return getAPIServerDownHints(resources);
    case 'statefulset-stuck-1':
      return getStatefulSetStuckHints(resources);

    default:
      return getGenericHints();
  }
};

const getCrashLoopHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];

  return [
    {
      id: 'hint-1',
      title: 'Start with Pod Overview',
      description: 'Get a quick overview of all pods to identify which ones are failing.',
      explanation: 'The first step in debugging any Kubernetes issue is to get a high-level view of your cluster. This command shows all pods in the current namespace with their status, restart count, and age. Look for pods with status like CrashLoopBackOff, Error, or high restart counts.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                               READY   STATUS             RESTARTS   AGE\n${podName}           0/1     CrashLoopBackOff   5          2m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Get Detailed Pod Information',
      description: `Examine the failing pod "${podName}" in detail to understand what's happening.`,
      explanation: 'The describe command provides comprehensive information about a pod including its configuration, current state, events, and conditions. Events are particularly useful as they show the sequence of what happened to the pod. Look for error messages in the Events section.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  BackOff    2m   kubelet  Back-off restarting failed container',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Container Logs',
      description: `Look at the container logs of "${podName}" to see the actual error causing the crash.`,
      explanation: 'Container logs show the stdout and stderr output from your application. This is where you\'ll find the actual error messages that are causing your container to crash. For CrashLoopBackOff, check both current and previous container logs.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <pod-name>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'Error: DATABASE_URL environment variable is required but not set\nExiting with code 1',
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Check Previous Container Logs',
      description: `If the current container hasn't started, check the previous container's logs for "${podName}".`,
      explanation: 'When a container is in CrashLoopBackOff, it may have restarted multiple times. The --previous flag shows logs from the last terminated container instance, which often contains the actual error message that caused the crash.',
      type: 'command',
      priority: 4,
      command: 'kubectl logs <pod-name> --previous',
      exactCommand: `kubectl logs ${podName} --previous`,
      expectedOutput: 'Error: DATABASE_URL environment variable is required\nApplication failed to start',
      timeToReveal: 40,
      category: 'diagnosis'
    },
  {
    id: 'hint-5',
    title: 'Analyze the Error Pattern',
    description: 'Understanding CrashLoopBackOff: Missing environment variables are a common cause.',
    explanation: 'CrashLoopBackOff means Kubernetes is repeatedly trying to start your container, but it keeps failing and exiting. Common causes include: missing environment variables, incorrect configuration, missing dependencies, or application bugs. The error message "DATABASE_URL environment variable is required" clearly indicates what\'s missing.',
    type: 'concept',
    priority: 5,
    timeToReveal: 50,
    category: 'diagnosis'
  },
    {
      id: 'hint-6',
      title: 'Check Current Deployment Configuration',
      description: `Examine the deployment "${deploymentName}" to see what environment variables are currently configured.`,
      explanation: 'Before fixing the issue, it\'s important to understand the current configuration. This command shows the deployment specification including environment variables, resource limits, and other configuration details.',
      type: 'command',
      priority: 6,
      command: 'kubectl describe deployment <deployment-name>',
      exactCommand: `kubectl describe deployment ${deploymentName}`,
      expectedOutput: 'Environment: <none>\nMounts: <none>',
      timeToReveal: 60,
      category: 'investigation'
    },
    {
      id: 'hint-7',
      title: 'The Fix: Add Missing Environment Variable',
      description: `Add the required DATABASE_URL environment variable to deployment "${deploymentName}" to fix the CrashLoopBackOff.`,
      explanation: 'Based on the error message, we need to add the DATABASE_URL environment variable. This command uses kubectl patch to add the environment variable directly to the deployment without needing to edit YAML files.',
      type: 'command',
      priority: 7,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","env":[{"name":"DATABASE_URL","value":"<database-url>"}]}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"containers":[{"name":"nginx","env":[{"name":"DATABASE_URL","value":"postgresql://user:pass@db:5432/myapp"}]}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 70,
      category: 'fix'
    },
    {
      id: 'hint-8',
      title: 'Monitor the Rollout',
      description: `Watch the deployment "${deploymentName}" rollout to see if the fix is working.`,
      explanation: 'After applying the fix, Kubernetes will automatically create new pods with the updated configuration. This command shows the status of the rollout in real-time. You should see the old pods terminating and new pods starting successfully.',
      type: 'command',
      priority: 8,
      command: 'kubectl rollout status deployment/<deployment-name>',
      exactCommand: `kubectl rollout status deployment/${deploymentName}`,
      expectedOutput: `deployment "${deploymentName}" successfully rolled out`,
      timeToReveal: 80,
      category: 'verification'
    },
    {
      id: 'hint-9',
      title: 'Verify the Fix',
      description: 'Confirm that the pods are now running successfully.',
      explanation: 'This final verification step ensures that your fix worked. The pods should now show status "Running" with READY showing 1/1, and the restart count should stop increasing. This confirms that the missing environment variable was indeed the root cause.',
      type: 'command',
      priority: 9,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                               READY   STATUS    RESTARTS   AGE\n${podName.replace('abc123', 'xyz789')}           1/1     Running   0          1m`,
      timeToReveal: 90,
      category: 'verification'
    }
  ];
};

const getImagePullHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Pod Status',
      description: 'Look for pods with ImagePullBackOff status.',
      explanation: 'ImagePullBackOff indicates that Kubernetes cannot pull the container image. This could be due to incorrect image names, missing credentials, or network issues.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                     READY   STATUS             RESTARTS   AGE\n${podName}   0/1     ImagePullBackOff   0          2m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Examine Pod Events',
      description: `Check the events for "${podName}" to see the specific image pull error.`,
      explanation: 'The describe command will show events that detail why the image pull failed. Look for messages about authentication, image not found, or network timeouts.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  Failed     2m   kubelet  Failed to pull image "private-registry/app:latest": pull access denied',
      timeToReveal: 20,
      category: 'investigation'
    },
  {
    id: 'hint-3',
    title: 'Check Image Pull Secrets',
    description: 'Verify if the required image pull secrets exist.',
    explanation: 'Private registries require authentication. Image pull secrets store the credentials needed to access private container registries.',
    type: 'command',
    priority: 3,
    command: 'kubectl get secrets',
    exactCommand: 'kubectl get secrets',
    expectedOutput: 'NAME                  TYPE                                  DATA   AGE\ndefault-token-xyz     kubernetes.io/service-account-token   3      5d',
    timeToReveal: 30,
    category: 'investigation'
  },
    {
      id: 'hint-4',
      title: 'Create Image Pull Secret',
      description: 'Create the missing image pull secret for the private registry.',
      explanation: 'This command creates a secret containing the credentials needed to pull images from a private registry. Replace the values with your actual registry credentials.',
      type: 'command',
      priority: 4,
      command: 'kubectl create secret docker-registry <secret-name> --docker-server=<registry-url> --docker-username=<username> --docker-password=<password>',
      exactCommand: 'kubectl create secret docker-registry regcred --docker-server=private-registry.com --docker-username=myuser --docker-password=mypass',
      expectedOutput: 'secret/regcred created',
      timeToReveal: 40,
      category: 'fix'
    },
    {
      id: 'hint-5',
      title: 'Update Deployment with Image Pull Secret',
      description: `Add the image pull secret to deployment "${deploymentName}".`,
      explanation: 'The deployment needs to reference the image pull secret so that Kubernetes knows which credentials to use when pulling the image.',
      type: 'command',
      priority: 5,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"<secret-name>"}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"regcred"}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Verify the Fix',
      description: 'Check that the pods can now pull the image successfully.',
      explanation: 'After adding the image pull secret, new pods should be created that can successfully pull the image and start running.',
      type: 'command',
      priority: 6,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                     READY   STATUS    RESTARTS   AGE\n${podName.replace('ghi789', 'xyz789')}   1/1     Running   0          1m`,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};

const getPodPendingHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Pod Status',
      description: 'Identify pods stuck in Pending state.',
      explanation: 'Pending status means the pod has been accepted by Kubernetes but cannot be scheduled to run on any node. This is usually due to resource constraints or scheduling issues.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                     READY   STATUS    RESTARTS   AGE\n${podName}        0/1     Pending   0          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Describe the Pending Pod',
      description: `Get detailed information about why "${podName}" is stuck in Pending state.`,
      explanation: 'The describe command will show events and conditions that explain why the pod cannot be scheduled. Look for resource constraints, node selector issues, or taints.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  FailedScheduling  2m   default-scheduler  0/3 nodes are available: 3 Insufficient cpu.',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Node Resources',
      description: 'Check available resources on cluster nodes.',
      explanation: 'If the pod cannot be scheduled due to insufficient resources, check what resources are available on each node.',
      type: 'command',
      priority: 3,
      command: 'kubectl top nodes',
      exactCommand: 'kubectl top nodes',
      expectedOutput: 'NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\nworker-node-1  950m         95%    1800Mi          90%',
      timeToReveal: 30,
      category: 'investigation'
    },
    {
      id: 'hint-4',
      title: 'Check Pod Resource Requests',
      description: `Check the resource requests for "${podName}" that might be too high.`,
      explanation: 'If the pod requests more resources than available on any node, it will remain pending. Check if the resource requests are reasonable.',
      type: 'command',
      priority: 4,
      command: 'kubectl get pod <pod-name> -o yaml | grep -A 10 resources',
      exactCommand: `kubectl get pod ${podName} -o yaml | grep -A 10 resources`,
      expectedOutput: 'resources:\n  requests:\n    cpu: 2000m\n    memory: 4Gi',
      timeToReveal: 40,
      category: 'diagnosis'
    }
  ];
};

const getOOMHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Pod Status for OOMKilled',
      description: 'Look for pods that have been killed due to out of memory.',
      explanation: 'OOMKilled status indicates that the container was terminated because it exceeded its memory limit. This is a common issue when applications consume more memory than allocated.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                     READY   STATUS      RESTARTS   AGE\n${podName}       0/1     OOMKilled   3          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Memory Limits',
      description: `Examine the memory limits configured for "${podName}".`,
      explanation: 'Check what memory limits are set and compare them to actual usage. OOMKilled pods often have limits that are too low for the application\'s needs.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Limits:\n  memory: 128Mi\nLast State: Terminated\n  Reason: OOMKilled\n  Exit Code: 137',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Increase Memory Limits',
      description: `Increase the memory limits for deployment "${deploymentName}".`,
      explanation: 'Based on the OOMKilled status, the application needs more memory. Increase the memory limits to prevent future OOM kills.',
      type: 'command',
      priority: 3,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"256Mi"}}}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"256Mi"}}}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 30,
      category: 'fix'
    }
  ];
};

const getResourceQuotaHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Resource Quotas',
      description: 'Examine namespace resource quotas that might be blocking pod creation.',
      explanation: 'Resource quotas limit the total amount of compute resources that can be consumed in a namespace. If the quota is exceeded, new pods cannot be created.',
      type: 'command',
      priority: 1,
      command: 'kubectl get resourcequota',
      exactCommand: 'kubectl get resourcequota',
      expectedOutput: 'NAME          AGE   REQUEST                     LIMIT\ncompute-quota 5d    requests.cpu: 2/2, requests.memory: 4Gi/4Gi',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Quota Usage Details',
      description: 'Get detailed information about quota usage and limits.',
      explanation: 'The describe command shows exactly which resources are at their limits and preventing new pod creation.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe resourcequota',
      exactCommand: 'kubectl describe resourcequota',
      expectedOutput: 'Resource         Used   Hard\nrequests.cpu     2      2\nrequests.memory  4Gi    4Gi\npods             10     10',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Failed Pod Events',
      description: `Check events for "${podName}" to see quota-related errors.`,
      explanation: 'Pod creation failures due to quota limits will show specific error events.',
      type: 'command',
      priority: 3,
      command: 'kubectl get events --field-selector involvedObject.name=<pod-name>',
      exactCommand: `kubectl get events --field-selector involvedObject.name=${podName}`,
      expectedOutput: 'Warning  FailedCreate  2m   replicaset-controller  pods "quota-test-pod" is forbidden: exceeded quota',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

// Service and Networking Hints
const getServiceUnreachableHints = (resources: any): EnhancedHint[] => {
  const serviceName = resources.primaryService || resources.services[0];
  const podName = resources.primaryPod || resources.pods[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Service Status',
      description: 'Verify that the service exists and has endpoints.',
      explanation: 'Service connectivity issues often stem from missing services, incorrect selectors, or no backing pods. Start by checking if the service exists and has endpoints.',
      type: 'command',
      priority: 1,
      command: 'kubectl get services',
      exactCommand: 'kubectl get services',
      expectedOutput: `NAME           TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\n${serviceName}   ClusterIP   10.96.1.100   <none>        80/TCP    2h`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Service Endpoints',
      description: `Verify that service "${serviceName}" has backing pods.`,
      explanation: 'If a service has no endpoints, it means no pods match the service selector. This is a common cause of service connectivity issues.',
      type: 'command',
      priority: 2,
      command: 'kubectl get endpoints <service-name>',
      exactCommand: `kubectl get endpoints ${serviceName}`,
      expectedOutput: `NAME          ENDPOINTS   AGE\n${serviceName}   <none>      2h`,
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Describe the Service',
      description: `Get detailed configuration for service "${serviceName}" including selectors.`,
      explanation: 'The service selector must match the pod labels exactly. Check if the selector in the service matches the labels on your pods.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe service <service-name>',
      exactCommand: `kubectl describe service ${serviceName}`,
      expectedOutput: 'Selector: app=backend,version=v1\nEndpoints: <none>',
      timeToReveal: 30,
      category: 'investigation'
    },
  {
    id: 'hint-4',
    title: 'Check Pod Labels',
    description: 'Verify that pods have the correct labels to match the service selector.',
    explanation: 'Pods must have labels that exactly match the service selector. Even a small typo in labels will prevent the service from finding the pods.',
    type: 'command',
    priority: 4,
    command: 'kubectl get pods --show-labels',
    exactCommand: 'kubectl get pods --show-labels',
    expectedOutput: 'NAME                       LABELS\nbackend-deployment-abc123  app=backend,version=v2',
    timeToReveal: 40,
    category: 'diagnosis'
  },
    {
      id: 'hint-5',
      title: 'Fix Service Selector',
      description: `Update the service selector for "${serviceName}" to match the pod labels.`,
      explanation: 'The issue is that the service selector expects version=v1 but the pods have version=v2. Update the service selector to match.',
      type: 'command',
      priority: 5,
      command: 'kubectl patch service <service-name> -p \'{"spec":{"selector":{"app":"backend","version":"v2"}}}\'',
      exactCommand: `kubectl patch service ${serviceName} -p '{"spec":{"selector":{"app":"backend","version":"v2"}}}'`,
      expectedOutput: `service/${serviceName} patched`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Verify Service Connectivity',
      description: `Test that service "${serviceName}" now has endpoints and is reachable.`,
      explanation: 'After fixing the selector, the service should now have endpoints and be reachable from other pods.',
      type: 'command',
      priority: 6,
      command: 'kubectl get endpoints <service-name>',
      exactCommand: `kubectl get endpoints ${serviceName}`,
      expectedOutput: `NAME          ENDPOINTS         AGE\n${serviceName}   10.244.1.5:80    2h`,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};

const getDNSResolutionHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const serviceName = resources.primaryService || resources.services[0];

  return [
    {
      id: 'hint-1',
      title: 'Test DNS Resolution',
      description: `Check if DNS resolution is working inside pod "${podName}".`,
      explanation: 'DNS issues can prevent pods from reaching services by name. Test DNS resolution from within a pod to identify the problem.',
      type: 'command',
      priority: 1,
      command: 'kubectl exec -it <pod-name> -- nslookup kubernetes.default',
      exactCommand: `kubectl exec -it ${podName} -- nslookup kubernetes.default`,
      expectedOutput: 'Server: 10.96.0.10\nAddress: 10.96.0.10#53\n\nName: kubernetes.default.svc.cluster.local',
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'Check DNS Configuration',
    description: 'Verify the DNS configuration in the pod.',
    explanation: 'Check the /etc/resolv.conf file to see if the DNS server is correctly configured.',
    type: 'command',
    priority: 2,
    command: 'kubectl exec -it <pod-name> -- cat /etc/resolv.conf',
    exactCommand: 'kubectl exec -it frontend-deployment-abc123 -- cat /etc/resolv.conf',
    expectedOutput: 'nameserver 10.96.0.10\nsearch default.svc.cluster.local svc.cluster.local cluster.local',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Check CoreDNS Status',
    description: 'Verify that CoreDNS pods are running properly.',
    explanation: 'CoreDNS provides DNS services for the cluster. If CoreDNS pods are not running, DNS resolution will fail.',
    type: 'command',
    priority: 3,
    command: 'kubectl get pods -n kube-system -l k8s-app=kube-dns',
    exactCommand: 'kubectl get pods -n kube-system -l k8s-app=kube-dns',
    expectedOutput: 'NAME                       READY   STATUS    RESTARTS   AGE\ncoredns-558bd4d5db-abc123  1/1     Running   0          5d',
    timeToReveal: 30,
    category: 'investigation'
  },
  {
    id: 'hint-4',
    title: 'Check CoreDNS Logs',
    description: 'Look for DNS resolution errors in CoreDNS logs.',
    explanation: 'CoreDNS logs can reveal configuration issues or upstream DNS problems that are causing resolution failures.',
    type: 'command',
    priority: 4,
    command: 'kubectl logs -n kube-system -l k8s-app=kube-dns',
    exactCommand: 'kubectl logs -n kube-system -l k8s-app=kube-dns',
    expectedOutput: '[ERROR] plugin/errors: 2 backend-svc.default.svc.cluster.local. A: read udp timeout',
    timeToReveal: 40,
    category: 'diagnosis'
  },
  {
    id: 'hint-5',
    title: 'Restart CoreDNS',
    description: 'Restart CoreDNS pods to resolve DNS issues.',
    explanation: 'Sometimes CoreDNS pods need to be restarted to pick up configuration changes or resolve temporary issues.',
    type: 'command',
    priority: 5,
    command: 'kubectl rollout restart deployment/coredns -n kube-system',
    exactCommand: 'kubectl rollout restart deployment/coredns -n kube-system',
    expectedOutput: 'deployment.apps/coredns restarted',
    timeToReveal: 50,
    category: 'fix'
  },
  {
    id: 'hint-6',
    title: 'Verify DNS Resolution',
    description: 'Test DNS resolution again to confirm the fix.',
    explanation: 'After restarting CoreDNS, DNS resolution should work properly. Test again to confirm the issue is resolved.',
    type: 'command',
    priority: 6,
    command: 'kubectl exec -it <pod-name> -- nslookup <service-name>',
    exactCommand: 'kubectl exec -it frontend-deployment-abc123 -- nslookup backend-svc',
    expectedOutput: 'Server: 10.96.0.10\nAddress: 10.96.0.10#53\n\nName: backend-svc.default.svc.cluster.local\nAddress: 10.96.1.100',
    timeToReveal: 60,
    category: 'verification'
  }
];

// Network Policy Hints
const getNetworkPolicyHints = (): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Network Policies',
    description: 'List all network policies that might be blocking traffic.',
    explanation: 'Network policies can block traffic between pods. Check if there are any network policies that might be preventing communication.',
    type: 'command',
    priority: 1,
    command: 'kubectl get networkpolicy',
    exactCommand: 'kubectl get networkpolicy',
    expectedOutput: 'NAME              POD-SELECTOR   AGE\ndefault-deny-all  <none>         2h',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Describe Network Policy',
    description: 'Check the network policy rules in detail.',
    explanation: 'Network policies define ingress and egress rules. A default-deny-all policy blocks all traffic unless explicitly allowed.',
    type: 'command',
    priority: 2,
    command: 'kubectl describe networkpolicy <policy-name>',
    exactCommand: 'kubectl describe networkpolicy default-deny-all',
    expectedOutput: 'Spec:\n  PodSelector: <none> (Allowing the specific traffic to all pods in this namespace)\n  Allowing ingress traffic: <none>',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Create Allow Policy',
    description: 'Create a network policy to allow the required traffic.',
    explanation: 'Since there\'s a default-deny-all policy, you need to create an explicit allow policy for your application traffic.',
    type: 'command',
    priority: 3,
    command: 'kubectl apply -f allow-policy.yaml',
    exactCommand: 'kubectl apply -f - <<EOF\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-frontend-to-backend\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          app: frontend\nEOF',
    expectedOutput: 'networkpolicy.networking.k8s.io/allow-frontend-to-backend created',
    timeToReveal: 30,
    category: 'fix'
  }
];

// Load Balancer Hints
const getLoadBalancerHints = (): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check LoadBalancer Service',
    description: 'Verify the LoadBalancer service status and external IP.',
    explanation: 'LoadBalancer services should get an external IP assigned by the cloud provider. If it shows <pending>, there might be an issue with the cloud provider integration.',
    type: 'command',
    priority: 1,
    command: 'kubectl get service <service-name>',
    exactCommand: 'kubectl get service frontend-lb',
    expectedOutput: 'NAME          TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE\nfrontend-lb   LoadBalancer   10.96.1.102   <pending>     80:30080/TCP   30m',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Check Cloud Controller Events',
    description: 'Look for events related to LoadBalancer provisioning.',
    explanation: 'Cloud controller manager events can show why a LoadBalancer is not getting an external IP assigned.',
    type: 'command',
    priority: 2,
    command: 'kubectl get events --field-selector involvedObject.name=<service-name>',
    exactCommand: 'kubectl get events --field-selector involvedObject.name=frontend-lb',
    expectedOutput: 'Warning  SyncLoadBalancerFailed  5m   service-controller  Error syncing load balancer: failed to ensure load balancer',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Check Cloud Provider Configuration',
    description: 'Verify that the cluster has proper cloud provider configuration.',
    explanation: 'LoadBalancer services require proper cloud provider integration. Check if the cloud controller manager is running and configured correctly.',
    type: 'command',
    priority: 3,
    command: 'kubectl get pods -n kube-system | grep cloud',
    exactCommand: 'kubectl get pods -n kube-system | grep cloud',
    expectedOutput: 'cloud-controller-manager-abc123   1/1     Running   0          5d',
    timeToReveal: 30,
    category: 'investigation'
  }
];

// Storage Hints
const getPVCPendingHints = (): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check PVC Status',
    description: 'Check which PVCs are in Pending state.',
    explanation: 'PVCs in Pending state cannot bind to a PV. This could be due to missing storage class, no available PVs, or insufficient resources.',
    type: 'command',
    priority: 1,
    command: 'kubectl get pvc',
    exactCommand: 'kubectl get pvc',
    expectedOutput: 'NAME           STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE\ndatabase-pvc   Pending                                      standard       5m',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Describe the PVC',
    description: 'Get detailed information about why the PVC is pending.',
    explanation: 'The describe command shows events that explain why the PVC cannot bind to a PV.',
    type: 'command',
    priority: 2,
    command: 'kubectl describe pvc <pvc-name>',
    exactCommand: 'kubectl describe pvc database-pvc',
    expectedOutput: 'Events:\n  Warning  ProvisioningFailed  2m   persistentvolume-controller  storageclass "standard" not found',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Check Storage Classes',
    description: 'List available storage classes.',
    explanation: 'The PVC references a storage class that doesn\'t exist. Check what storage classes are available in the cluster.',
    type: 'command',
    priority: 3,
    command: 'kubectl get storageclass',
    exactCommand: 'kubectl get storageclass',
    expectedOutput: 'NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   AGE\ngp2 (default)        kubernetes.io/aws-ebs   Delete          WaitForFirstConsumer   5d',
    timeToReveal: 30,
    category: 'investigation'
  },
  {
    id: 'hint-4',
    title: 'Fix Storage Class Reference',
    description: 'Update the PVC to use the correct storage class.',
    explanation: 'The PVC should reference "gp2" instead of "standard". Update the PVC to use the available storage class.',
    type: 'command',
    priority: 4,
    command: 'kubectl patch pvc <pvc-name> -p \'{"spec":{"storageClassName":"gp2"}}\'',
    exactCommand: 'kubectl patch pvc database-pvc -p \'{"spec":{"storageClassName":"gp2"}}\'',
    expectedOutput: 'persistentvolumeclaim/database-pvc patched',
    timeToReveal: 40,
    category: 'fix'
  }
];

const getSecretMissingHints = (): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Pod Events',
    description: 'Look for events indicating missing secrets or configmaps.',
    explanation: 'Pods that reference non-existent secrets or configmaps will show specific error events.',
    type: 'command',
    priority: 1,
    command: 'kubectl describe pod <pod-name>',
    exactCommand: 'kubectl describe pod app-deployment-abc123',
    expectedOutput: 'Events:\n  Warning  FailedMount  2m   kubelet  MountVolume.SetUp failed for volume "secret-volume" : secret "app-secret" not found',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Check if Secret Exists',
    description: 'Verify if the referenced secret actually exists.',
    explanation: 'The pod is trying to mount a secret that doesn\'t exist. Check if the secret is present in the namespace.',
    type: 'command',
    priority: 2,
    command: 'kubectl get secret <secret-name>',
    exactCommand: 'kubectl get secret app-secret',
    expectedOutput: 'Error from server (NotFound): secrets "app-secret" not found',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Create the Missing Secret',
    description: 'Create the secret that the pod is expecting.',
    explanation: 'Create the missing secret with the required data. This example creates a generic secret with database credentials.',
    type: 'command',
    priority: 3,
    command: 'kubectl create secret generic <secret-name> --from-literal=key=value',
    exactCommand: 'kubectl create secret generic app-secret --from-literal=database-url=postgresql://user:pass@db:5432/myapp',
    expectedOutput: 'secret/app-secret created',
    timeToReveal: 30,
    category: 'fix'
  }
];
};

// Updated functions for remaining scenarios with actual resource names
const getAdmissionWebhookFailHints = (resources: any): EnhancedHint[] => getAdmissionWebhookHints(resources);

const getCNIPluginHints = (resources: any): EnhancedHint[] => {
  const nodeName = resources.nodes[0] || 'worker-node-1';
  return [
    {
      id: 'hint-1',
      title: 'Check CNI Plugin Pods',
      description: 'Verify that CNI plugin pods are running on all nodes.',
      explanation: 'CNI (Container Network Interface) plugins are responsible for pod networking. If CNI pods are not running, new pods cannot get IP addresses.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods -n kube-system | grep -E "(cni|network|flannel|calico|weave)"',
      exactCommand: 'kubectl get pods -n kube-system | grep -E "(cni|network|flannel|calico|weave)"',
      expectedOutput: 'calico-node-abc123      0/1     CrashLoopBackOff   5          10m',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check CNI Plugin Logs',
      description: 'Examine CNI plugin logs for configuration errors.',
      explanation: 'CNI plugin logs will show network configuration errors, IP allocation failures, or connectivity issues.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs -n kube-system <cni-pod-name>',
      exactCommand: 'kubectl logs -n kube-system calico-node-abc123',
      expectedOutput: 'ERROR: Failed to initialize CNI plugin: missing network configuration',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Node Network Status',
      description: `Verify network status on node "${nodeName}".`,
      explanation: 'Check if the node has proper network connectivity and CNI configuration.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe node <node-name>',
      exactCommand: `kubectl describe node ${nodeName}`,
      expectedOutput: 'Conditions:\n  Type                 Status  Reason\n  NetworkUnavailable   True    NoRouteCreated',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getSchedulerFailHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Scheduler Pod Status',
      description: 'Verify that the kube-scheduler is running.',
      explanation: 'If the scheduler is down, no new pods can be scheduled to nodes, causing them to remain in Pending state.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods -n kube-system | grep scheduler',
      exactCommand: 'kubectl get pods -n kube-system | grep scheduler',
      expectedOutput: 'kube-scheduler-master-1         0/1     CrashLoopBackOff   3          5m',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Scheduler Logs',
      description: 'Examine scheduler logs for errors.',
      explanation: 'Scheduler logs will show why it cannot schedule pods, such as resource constraints or configuration issues.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs -n kube-system <scheduler-pod>',
      exactCommand: 'kubectl logs -n kube-system kube-scheduler-master-1',
      expectedOutput: 'ERROR: failed to create scheduler: unable to authenticate to API server',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Pending Pods',
      description: `Verify that pod "${podName}" is stuck due to scheduler issues.`,
      explanation: 'Pods will remain in Pending state with scheduler-related error messages when the scheduler is not functioning.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  FailedScheduling  5m   default-scheduler  no nodes available to schedule pods',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getKubeletDownHints = (resources: any): EnhancedHint[] => {
  const nodeName = resources.nodes[0] || 'worker-node-1';
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Node Status',
      description: 'Verify which nodes are showing as NotReady.',
      explanation: 'When kubelet is down, the node will show as NotReady and pods on that node will be unreachable.',
      type: 'command',
      priority: 1,
      command: 'kubectl get nodes',
      exactCommand: 'kubectl get nodes',
      expectedOutput: `NAME           STATUS     ROLES    AGE   VERSION\n${nodeName}   NotReady   <none>   5d    v1.28.0`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Node Conditions',
      description: `Get detailed information about node "${nodeName}" conditions.`,
      explanation: 'Node conditions will show if kubelet is not responding or has stopped reporting status.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe node <node-name>',
      exactCommand: `kubectl describe node ${nodeName}`,
      expectedOutput: 'Conditions:\n  Type             Status    Reason\n  Ready            Unknown   NodeStatusUnknown',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Kubelet Service',
      description: `Check kubelet service status on node "${nodeName}".`,
      explanation: 'Access the node directly to check if the kubelet service is running and healthy.',
      type: 'command',
      priority: 3,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host systemctl status kubelet',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host systemctl status kubelet`,
      expectedOutput: 'kubelet.service - kubelet: The Kubernetes Node Agent\n   Loaded: loaded\n   Active: failed (Result: exit-code)',
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Check Pod Status on Failed Node',
      description: `Check status of pod "${podName}" on the failed node.`,
      explanation: 'Pods on nodes with failed kubelet will show as Unknown or NodeLost status.',
      type: 'command',
      priority: 4,
      command: 'kubectl get pods -o wide',
      exactCommand: 'kubectl get pods -o wide',
      expectedOutput: `NAME           READY   STATUS    RESTARTS   AGE   NODE\n${podName}     1/1     Unknown   0          10m   ${nodeName}`,
      timeToReveal: 40,
      category: 'diagnosis'
    }
  ];
};

const getCertificateExpiredHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Certificate Expiration',
      description: 'Look for certificate expiration errors in pod logs.',
      explanation: 'Expired certificates cause authentication failures and prevent pods from communicating with the API server or other services.',
      type: 'command',
      priority: 1,
      command: 'kubectl logs <pod-name>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'ERROR: certificate has expired or is not yet valid',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check API Server Certificates',
      description: 'Verify API server certificate validity.',
      explanation: 'API server certificates are critical for cluster communication. Check their expiration dates.',
      type: 'command',
      priority: 2,
      command: 'kubectl get pods -n kube-system | grep apiserver',
      exactCommand: 'kubectl get pods -n kube-system | grep apiserver',
      expectedOutput: 'kube-apiserver-master-1         0/1     CrashLoopBackOff   5          10m',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Certificate Files',
      description: 'Examine certificate files on the master node.',
      explanation: 'Check the actual certificate files to see their expiration dates and validity.',
      type: 'command',
      priority: 3,
      command: 'kubectl debug node/<master-node> -it --image=busybox -- chroot /host openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout',
      exactCommand: 'kubectl debug node/master-1 -it --image=busybox -- chroot /host openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout',
      expectedOutput: 'Not After : Oct 25 14:30:45 2023 GMT',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getNodeNotReadyHints = (resources: any): EnhancedHint[] => {
  const nodeName = resources.nodes[0] || 'worker-node-1';
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Node Status',
      description: 'Identify which nodes are NotReady.',
      explanation: 'NotReady nodes cannot run pods. This could be due to kubelet issues, resource pressure, or network problems.',
      type: 'command',
      priority: 1,
      command: 'kubectl get nodes',
      exactCommand: 'kubectl get nodes',
      expectedOutput: `NAME           STATUS     ROLES    AGE   VERSION\n${nodeName}   NotReady   <none>   5d    v1.28.0`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Describe Node Conditions',
      description: `Get detailed conditions for node "${nodeName}".`,
      explanation: 'Node conditions show the specific reason why the node is NotReady, such as disk pressure, memory pressure, or kubelet issues.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe node <node-name>',
      exactCommand: `kubectl describe node ${nodeName}`,
      expectedOutput: 'Conditions:\n  Type             Status  Reason\n  DiskPressure     True    KubeletHasDiskPressure\n  Ready            False   KubeletNotReady',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Node Resources',
      description: `Check resource usage on node "${nodeName}".`,
      explanation: 'High resource usage (CPU, memory, disk) can cause nodes to become NotReady.',
      type: 'command',
      priority: 3,
      command: 'kubectl top node <node-name>',
      exactCommand: `kubectl top node ${nodeName}`,
      expectedOutput: `NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\n${nodeName}   1950m        98%    7800Mi          98%`,
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Check Affected Pods',
      description: `Check pods running on the NotReady node "${nodeName}".`,
      explanation: 'Pods on NotReady nodes may be evicted or show as Unknown status.',
      type: 'command',
      priority: 4,
      command: 'kubectl get pods -o wide --field-selector spec.nodeName=<node-name>',
      exactCommand: `kubectl get pods -o wide --field-selector spec.nodeName=${nodeName}`,
      expectedOutput: `NAME           READY   STATUS    RESTARTS   AGE   NODE\n${podName}     0/1     Unknown   0          10m   ${nodeName}`,
      timeToReveal: 40,
      category: 'diagnosis'
    }
  ];
};

const getPodSecurityHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Pod Security Policy Violations',
      description: 'Look for pod security policy rejection errors.',
      explanation: 'Pod Security Policies can prevent pods from starting if they violate security constraints like running as root or using privileged containers.',
      type: 'command',
      priority: 1,
      command: 'kubectl get events --field-selector type=Warning',
      exactCommand: 'kubectl get events --field-selector type=Warning',
      expectedOutput: `Warning  FailedCreate  2m   replicaset-controller  Error creating: pods "${podName}" is forbidden: violates PodSecurityPolicy`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Pod Security Context',
      description: `Examine the security context of deployment "${deploymentName}".`,
      explanation: 'Check what security context is configured and compare it against the pod security policy requirements.',
      type: 'command',
      priority: 2,
      command: 'kubectl get deployment <deployment-name> -o yaml | grep -A 10 securityContext',
      exactCommand: `kubectl get deployment ${deploymentName} -o yaml | grep -A 10 securityContext`,
      expectedOutput: 'securityContext:\n  runAsUser: 0\n  privileged: true',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Fix Security Context',
      description: `Update deployment "${deploymentName}" with compliant security context.`,
      explanation: 'Modify the deployment to run as non-root user and remove privileged access to comply with pod security policies.',
      type: 'command',
      priority: 3,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000}}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000}}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 30,
      category: 'fix'
    }
  ];
};

// Generic hint templates for different categories
const getRBACPermissionHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check RBAC Permission Errors',
      description: 'Look for permission denied errors in pod logs.',
      explanation: 'RBAC (Role-Based Access Control) errors occur when pods or users try to access Kubernetes resources without proper permissions.',
      type: 'command',
      priority: 1,
      command: 'kubectl logs <pod-name>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'ERROR: pods is forbidden: User "system:serviceaccount:default:default" cannot list resource "pods"',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Service Account Permissions',
      description: 'Test what permissions the service account has.',
      explanation: 'Use kubectl auth can-i to check if the service account has the required permissions.',
      type: 'command',
      priority: 2,
      command: 'kubectl auth can-i list pods --as=system:serviceaccount:default:default',
      exactCommand: 'kubectl auth can-i list pods --as=system:serviceaccount:default:default',
      expectedOutput: 'no',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Create Required RBAC Resources',
      description: 'Create a ClusterRole and ClusterRoleBinding to grant necessary permissions.',
      explanation: 'Grant the service account the required permissions to access Kubernetes resources.',
      type: 'command',
      priority: 3,
      command: 'kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods',
      exactCommand: 'kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods',
      expectedOutput: 'clusterrole.rbac.authorization.k8s.io/pod-reader created',
      timeToReveal: 30,
      category: 'fix'
    },
    {
      id: 'hint-4',
      title: 'Bind Role to Service Account',
      description: 'Create a ClusterRoleBinding to associate the role with the service account.',
      explanation: 'The ClusterRoleBinding connects the ClusterRole with the service account, granting the permissions.',
      type: 'command',
      priority: 4,
      command: 'kubectl create clusterrolebinding pod-reader-binding --clusterrole=pod-reader --serviceaccount=default:default',
      exactCommand: 'kubectl create clusterrolebinding pod-reader-binding --clusterrole=pod-reader --serviceaccount=default:default',
      expectedOutput: 'clusterrolebinding.rbac.authorization.k8s.io/pod-reader-binding created',
      timeToReveal: 40,
      category: 'fix'
    }
  ];
};

const getLivenessProbeHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Liveness Probe Failures',
      description: `Look for liveness probe failures in pod "${podName}".`,
      explanation: 'Liveness probe failures cause Kubernetes to restart containers. Check the probe configuration and application health endpoint.',
      type: 'command',
      priority: 1,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  Unhealthy  2m   kubelet  Liveness probe failed: HTTP probe failed with statuscode: 500',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Application Health Endpoint',
      description: `Test the health endpoint directly from pod "${podName}".`,
      explanation: 'Verify if the application health endpoint is responding correctly by testing it directly.',
      type: 'command',
      priority: 2,
      command: 'kubectl exec -it <pod-name> -- curl localhost:8080/health',
      exactCommand: `kubectl exec -it ${podName} -- curl localhost:8080/health`,
      expectedOutput: 'curl: (7) Failed to connect to localhost port 8080: Connection refused',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Application Logs',
      description: `Check application logs in pod "${podName}" for health endpoint errors.`,
      explanation: 'Application logs may show why the health endpoint is failing or not responding.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <pod-name>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'ERROR: Health check endpoint failed to start - database connection unavailable',
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Fix Liveness Probe Configuration',
      description: `Update the liveness probe configuration for deployment "${deploymentName}".`,
      explanation: 'Adjust the liveness probe path, port, or timing to match the application\'s actual health endpoint.',
      type: 'command',
      priority: 4,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"app","livenessProbe":{"httpGet":{"path":"/healthz","port":8080}}}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","livenessProbe":{"httpGet":{"path":"/healthz","port":8080}}}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 40,
      category: 'fix'
    }
  ];
};

const getHPANotScalingHints = (resources: any): EnhancedHint[] => {
  const deploymentName = resources.primaryDeployment || resources.deployments[0];
  return [
    {
      id: 'hint-1',
      title: 'Check HPA Status',
      description: 'Check the status of Horizontal Pod Autoscaler.',
      explanation: 'HPA may not be scaling due to missing metrics, incorrect targets, or metrics server issues.',
      type: 'command',
      priority: 1,
      command: 'kubectl get hpa',
      exactCommand: 'kubectl get hpa',
      expectedOutput: `NAME      REFERENCE                TARGETS         MINPODS   MAXPODS   REPLICAS   AGE\napp-hpa   Deployment/${deploymentName}   <unknown>/50%   2         10        2          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Metrics Server',
      description: 'Verify that metrics-server is running and healthy.',
      explanation: 'HPA requires metrics-server to get CPU and memory metrics. If metrics-server is down, HPA cannot function.',
      type: 'command',
      priority: 2,
      command: 'kubectl get pods -n kube-system | grep metrics-server',
      exactCommand: 'kubectl get pods -n kube-system | grep metrics-server',
      expectedOutput: 'metrics-server-abc123           0/1     CrashLoopBackOff   5          10m',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Pod Resource Requests',
      description: `Verify that deployment "${deploymentName}" has resource requests configured.`,
      explanation: 'HPA requires pods to have CPU resource requests defined to calculate scaling metrics.',
      type: 'command',
      priority: 3,
      command: 'kubectl get deployment <deployment-name> -o yaml | grep -A 5 resources',
      exactCommand: `kubectl get deployment ${deploymentName} -o yaml | grep -A 5 resources`,
      expectedOutput: 'resources: {}  # No resource requests defined',
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Add Resource Requests',
      description: `Add CPU resource requests to deployment "${deploymentName}".`,
      explanation: 'HPA needs CPU resource requests to calculate scaling decisions. Add appropriate resource requests.',
      type: 'command',
      priority: 4,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"requests":{"cpu":"100m"}}}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"requests":{"cpu":"100m"}}}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 40,
      category: 'fix'
    }
  ];
};

const getGenericNetworkingHints = (scenario: string): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Network Components',
    description: `Investigate ${scenario} by checking network-related components.`,
    explanation: 'Network issues often involve CNI plugins, network policies, or connectivity problems between nodes.',
    type: 'command',
    priority: 1,
    command: 'kubectl get pods -n kube-system | grep -E "(cni|network|flannel|calico|weave)"',
    exactCommand: 'kubectl get pods -n kube-system | grep -E "(cni|network|flannel|calico|weave)"',
    expectedOutput: 'calico-node-abc123      1/1     Running   0          5d',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Check Node Network Status',
    description: 'Verify network connectivity between nodes.',
    explanation: 'Test basic network connectivity to identify if the issue is at the node level.',
    type: 'command',
    priority: 2,
    command: 'kubectl get nodes -o wide',
    exactCommand: 'kubectl get nodes -o wide',
    expectedOutput: 'NAME       STATUS   ROLES    AGE   VERSION   INTERNAL-IP   EXTERNAL-IP',
    timeToReveal: 20,
    category: 'investigation'
  }
];

const getCustomResourceHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Custom Resource Status',
      description: 'Check the status of custom resources in the cluster.',
      explanation: 'Custom Resource issues often involve CRD problems, operator failures, or validation errors.',
      type: 'command',
      priority: 1,
      command: 'kubectl get crd',
      exactCommand: 'kubectl get crd',
      expectedOutput: 'NAME                    CREATED AT\nmyapps.example.com     2023-10-25T14:30:45Z',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Custom Resource Instances',
      description: 'List instances of the custom resource.',
      explanation: 'Check if custom resource instances exist and their current status.',
      type: 'command',
      priority: 2,
      command: 'kubectl get myapps',
      exactCommand: 'kubectl get myapps',
      expectedOutput: 'NAME      STATUS   AGE\nmy-app    Failed   5m',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Operator Logs',
      description: `Check logs of the operator managing the custom resource.`,
      explanation: 'Operator logs will show why custom resources are not being processed correctly.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <operator-pod>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'ERROR: failed to reconcile MyApp: validation failed - required field missing',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getOperatorStuckHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Operator Pod Status',
      description: 'Verify that the operator pod is running.',
      explanation: 'If the operator is not running, it cannot manage custom resources or perform reconciliation.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods | grep operator',
      exactCommand: 'kubectl get pods | grep operator',
      expectedOutput: `${podName}      0/1     CrashLoopBackOff   5          10m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Operator Logs',
      description: `Examine logs of operator pod "${podName}".`,
      explanation: 'Operator logs will show reconciliation errors, API access issues, or configuration problems.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs <operator-pod>',
      exactCommand: `kubectl logs ${podName}`,
      expectedOutput: 'ERROR: failed to watch custom resources: forbidden - insufficient RBAC permissions',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Operator RBAC',
      description: 'Verify that the operator has required RBAC permissions.',
      explanation: 'Operators need specific permissions to watch and modify custom resources and other Kubernetes objects.',
      type: 'command',
      priority: 3,
      command: 'kubectl auth can-i "*" "*" --as=system:serviceaccount:default:operator',
      exactCommand: 'kubectl auth can-i "*" "*" --as=system:serviceaccount:default:operator',
      expectedOutput: 'no',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getHelmReleaseHints = (resources: any): EnhancedHint[] => {
  return [
    {
      id: 'hint-1',
      title: 'Check Helm Release Status',
      description: 'Check the status of Helm releases.',
      explanation: 'Helm releases can fail due to resource conflicts, validation errors, or dependency issues.',
      type: 'command',
      priority: 1,
      command: 'helm list',
      exactCommand: 'helm list',
      expectedOutput: 'NAME    NAMESPACE   REVISION    UPDATED                     STATUS      CHART           APP VERSION\nmy-app  default     1           2023-10-25 14:30:45 UTC    failed      my-app-1.0.0    1.0.0',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Helm Release History',
      description: 'Get detailed information about the failed release.',
      explanation: 'Helm history shows what went wrong during the release installation or upgrade.',
      type: 'command',
      priority: 2,
      command: 'helm status <release-name>',
      exactCommand: 'helm status my-app',
      expectedOutput: 'STATUS: failed\nLAST DEPLOYED: Wed Oct 25 14:30:45 2023\nNOTES:\nError: failed to create resource: pods "my-app" already exists',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Conflicting Resources',
      description: 'Look for existing resources that conflict with the Helm release.',
      explanation: 'Helm installations can fail if resources with the same name already exist in the cluster.',
      type: 'command',
      priority: 3,
      command: 'kubectl get all -l app.kubernetes.io/managed-by=Helm',
      exactCommand: 'kubectl get all -l app.kubernetes.io/managed-by=Helm',
      expectedOutput: 'NAME        READY   STATUS    RESTARTS   AGE\npod/my-app  1/1     Running   0          2h',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getConfigMapNotPropagatingHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const configMapName = resources.configMaps[0] || 'app-config';
  return [
    {
      id: 'hint-1',
      title: 'Check ConfigMap Status',
      description: 'Verify that the ConfigMap exists and has correct data.',
      explanation: 'ConfigMap changes may not propagate to pods immediately, or the ConfigMap might not exist.',
      type: 'command',
      priority: 1,
      command: 'kubectl get configmap <configmap-name>',
      exactCommand: `kubectl get configmap ${configMapName}`,
      expectedOutput: `NAME         DATA   AGE\n${configMapName}   3      2h`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check ConfigMap Data',
      description: `Examine the data in ConfigMap "${configMapName}".`,
      explanation: 'Verify that the ConfigMap contains the expected configuration data.',
      type: 'command',
      priority: 2,
      command: 'kubectl describe configmap <configmap-name>',
      exactCommand: `kubectl describe configmap ${configMapName}`,
      expectedOutput: 'Data\n====\napp.properties:\n----\ndatabase.url=postgresql://db:5432/myapp',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Pod ConfigMap Mount',
      description: `Verify that pod "${podName}" has the ConfigMap mounted correctly.`,
      explanation: 'Check if the ConfigMap is properly mounted as a volume or environment variables in the pod.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Mounts:\n  /etc/config from config-volume (ro)\nVolumes:\n  config-volume:\n    Type:      ConfigMap (a volume populated by a ConfigMap)',
      timeToReveal: 30,
      category: 'investigation'
    },
    {
      id: 'hint-4',
      title: 'Restart Pod to Pick Up Changes',
      description: `Restart pod "${podName}" to pick up ConfigMap changes.`,
      explanation: 'ConfigMap changes are not automatically reloaded by applications. Restart the pod to pick up new configuration.',
      type: 'command',
      priority: 4,
      command: 'kubectl delete pod <pod-name>',
      exactCommand: `kubectl delete pod ${podName}`,
      expectedOutput: `pod "${podName}" deleted`,
      timeToReveal: 40,
      category: 'fix'
    }
  ];
};

const getGenericControlPlaneHints = (scenario: string): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Control Plane Components',
    description: `Investigate ${scenario} by checking control plane pod status.`,
    explanation: 'Control plane issues affect the entire cluster. Check if all control plane components are running.',
    type: 'command',
    priority: 1,
    command: 'kubectl get pods -n kube-system | grep -E "(apiserver|controller|scheduler|etcd)"',
    exactCommand: 'kubectl get pods -n kube-system | grep -E "(apiserver|controller|scheduler|etcd)"',
    expectedOutput: 'kube-apiserver-master-1         1/1     Running   0          5d',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getDiskPressureHints = (resources: any): EnhancedHint[] => {
  const nodeName = resources.nodes[0] || 'worker-node-1';
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check Node Disk Usage',
      description: `Check disk usage on node "${nodeName}".`,
      explanation: 'Disk pressure occurs when a node is running low on disk space, which can prevent new pods from being scheduled.',
      type: 'command',
      priority: 1,
      command: 'kubectl describe node <node-name>',
      exactCommand: `kubectl describe node ${nodeName}`,
      expectedOutput: 'Conditions:\n  Type             Status  Reason\n  DiskPressure     True    KubeletHasDiskPressure',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Disk Space on Node',
      description: `Check actual disk space usage on node "${nodeName}".`,
      explanation: 'Use kubectl debug to access the node and check disk usage with standard Linux tools.',
      type: 'command',
      priority: 2,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host df -h',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host df -h`,
      expectedOutput: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        20G   19G  500M  98% /',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Pod Eviction',
      description: `Check if pods like "${podName}" are being evicted due to disk pressure.`,
      explanation: 'When nodes have disk pressure, Kubernetes may evict pods to free up space.',
      type: 'command',
      priority: 3,
      command: 'kubectl get events --field-selector reason=Evicted',
      exactCommand: 'kubectl get events --field-selector reason=Evicted',
      expectedOutput: `Warning  Evicted  2m   kubelet  Pod ${podName} evicted due to disk pressure`,
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Clean Up Disk Space',
      description: `Clean up disk space on node "${nodeName}".`,
      explanation: 'Remove unused container images and logs to free up disk space.',
      type: 'command',
      priority: 4,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host docker system prune -f',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host docker system prune -f`,
      expectedOutput: 'Deleted Images:\nTotal reclaimed space: 2.5GB',
      timeToReveal: 40,
      category: 'fix'
    }
  ];
};

const getDaemonSetNotRunningHints = (resources: any): EnhancedHint[] => {
  const nodeName = resources.nodes[0] || 'worker-node-1';
  return [
    {
      id: 'hint-1',
      title: 'Check DaemonSet Status',
      description: 'Check the status of DaemonSets in the cluster.',
      explanation: 'DaemonSets should have pods running on all eligible nodes. Check if any DaemonSet pods are missing or failing.',
      type: 'command',
      priority: 1,
      command: 'kubectl get daemonset --all-namespaces',
      exactCommand: 'kubectl get daemonset --all-namespaces',
      expectedOutput: 'NAMESPACE     NAME          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE\nkube-system   calico-node   3         2         2       2            2           <none>          5d',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check DaemonSet Pods',
      description: 'Check which nodes are missing DaemonSet pods.',
      explanation: 'DaemonSet pods should run on all nodes unless prevented by node selectors, taints, or resource constraints.',
      type: 'command',
      priority: 2,
      command: 'kubectl get pods -o wide | grep <daemonset-name>',
      exactCommand: 'kubectl get pods -o wide | grep calico-node',
      expectedOutput: `calico-node-abc123   1/1     Running   0          5d    10.0.1.10   worker-1\ncalico-node-xyz789   1/1     Running   0          5d    10.0.1.11   worker-2\n# Missing pod on ${nodeName}`,
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Node Taints',
      description: `Check if node "${nodeName}" has taints preventing DaemonSet scheduling.`,
      explanation: 'Node taints can prevent DaemonSet pods from being scheduled unless the DaemonSet has matching tolerations.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe node <node-name>',
      exactCommand: `kubectl describe node ${nodeName}`,
      expectedOutput: 'Taints:             node.kubernetes.io/disk-pressure:NoSchedule',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getAPIServerDownHints = (resources: any): EnhancedHint[] => {
  return [
    {
      id: 'hint-1',
      title: 'Check API Server Pod Status',
      description: 'Check if the kube-apiserver pod is running.',
      explanation: 'If the API server is down, kubectl commands will fail and the cluster will be inaccessible.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods -n kube-system | grep apiserver',
      exactCommand: 'kubectl get pods -n kube-system | grep apiserver',
      expectedOutput: 'kube-apiserver-master-1         0/1     CrashLoopBackOff   5          10m',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check API Server Logs',
      description: 'Examine API server logs for startup errors.',
      explanation: 'API server logs will show certificate issues, etcd connectivity problems, or configuration errors.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs -n kube-system <apiserver-pod>',
      exactCommand: 'kubectl logs -n kube-system kube-apiserver-master-1',
      expectedOutput: 'ERROR: failed to connect to etcd: context deadline exceeded',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check ETCD Connectivity',
      description: 'Verify that ETCD is accessible from the API server.',
      explanation: 'The API server requires ETCD to be running and accessible. Check ETCD status.',
      type: 'command',
      priority: 3,
      command: 'kubectl get pods -n kube-system | grep etcd',
      exactCommand: 'kubectl get pods -n kube-system | grep etcd',
      expectedOutput: 'etcd-master-1                   1/1     Running   0          5d',
      timeToReveal: 30,
      category: 'investigation'
    }
  ];
};

const getStatefulSetStuckHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  return [
    {
      id: 'hint-1',
      title: 'Check StatefulSet Status',
      description: 'Check the status of StatefulSets in the cluster.',
      explanation: 'StatefulSets create pods in order and may get stuck if a pod cannot start or if PVCs are not available.',
      type: 'command',
      priority: 1,
      command: 'kubectl get statefulset',
      exactCommand: 'kubectl get statefulset',
      expectedOutput: 'NAME       READY   AGE\ndatabase   1/3     10m',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check StatefulSet Pods',
      description: 'Check which StatefulSet pods are not ready.',
      explanation: 'StatefulSets create pods sequentially. If one pod fails, subsequent pods will not be created.',
      type: 'command',
      priority: 2,
      command: 'kubectl get pods -l app=<statefulset-name>',
      exactCommand: 'kubectl get pods -l app=database',
      expectedOutput: `database-0   1/1     Running   0          10m\ndatabase-1   0/1     Pending   0          8m\n# database-2 not created yet`,
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Pending Pod Issues',
      description: `Check why pod "${podName}" is stuck in Pending state.`,
      explanation: 'StatefulSet pods often get stuck due to PVC issues, resource constraints, or node scheduling problems.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe pod <pod-name>',
      exactCommand: `kubectl describe pod ${podName}`,
      expectedOutput: 'Events:\n  Warning  FailedScheduling  5m   default-scheduler  pod has unbound immediate PersistentVolumeClaims',
      timeToReveal: 30,
      category: 'diagnosis'
    }
  ];
};

const getGenericNodeHints = (scenario: string): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Node Status',
    description: `Investigate ${scenario} by checking node conditions and status.`,
    explanation: 'Node issues can affect all pods running on that node. Check node health and conditions.',
    type: 'command',
    priority: 1,
    command: 'kubectl get nodes',
    exactCommand: 'kubectl get nodes',
    expectedOutput: 'NAME       STATUS     ROLES    AGE   VERSION\nworker-1   NotReady   <none>   5d    v1.28.0',
    timeToReveal: 10,
    category: 'discovery'
  },
  {
    id: 'hint-2',
    title: 'Describe Node Details',
    description: 'Get detailed information about the problematic node.',
    explanation: 'Node conditions and events can reveal the specific issue affecting the node.',
    type: 'command',
    priority: 2,
    command: 'kubectl describe node <node-name>',
    exactCommand: 'kubectl describe node worker-1',
    expectedOutput: 'Conditions:\n  Type             Status  Reason\n  DiskPressure     True    KubeletHasDiskPressure',
    timeToReveal: 20,
    category: 'investigation'
  }
];

const getGenericSecurityHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Security Policies',
    description: `Investigate ${scenario} by checking security-related configurations.`,
    explanation: 'Security issues often involve RBAC, pod security policies, or certificate problems.',
    type: 'command',
    priority: 1,
    command: 'kubectl auth can-i create pods',
    exactCommand: 'kubectl auth can-i create pods',
    expectedOutput: 'no',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getGenericOperatorHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Operator Status',
    description: `Investigate ${scenario} by checking operator and custom resource status.`,
    explanation: 'Operator issues often involve custom resources, CRDs, or operator pod problems.',
    type: 'command',
    priority: 1,
    command: 'kubectl get pods | grep operator',
    exactCommand: 'kubectl get pods | grep operator',
    expectedOutput: 'my-operator-abc123      1/1     Running   0          2h',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getGenericProbeHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Probe Configuration',
    description: `Investigate ${scenario} by examining probe settings and failures.`,
    explanation: 'Probe failures can cause pods to be restarted or marked as unhealthy.',
    type: 'command',
    priority: 1,
    command: 'kubectl describe pod <pod-name>',
    exactCommand: 'kubectl describe pod app-deployment-abc123',
    expectedOutput: 'Liveness probe failed: HTTP probe failed with statuscode: 500',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getGenericAutoscalingHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check HPA Status',
    description: `Investigate ${scenario} by checking HPA configuration and metrics.`,
    explanation: 'HPA issues often involve missing metrics, incorrect targets, or metrics server problems.',
    type: 'command',
    priority: 1,
    command: 'kubectl get hpa',
    exactCommand: 'kubectl get hpa',
    expectedOutput: 'NAME      REFERENCE            TARGETS         MINPODS   MAXPODS   REPLICAS   AGE\napp-hpa   Deployment/app-dep   <unknown>/50%   2         10        2          5m',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getGenericConfigHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Configuration Resources',
    description: `Investigate ${scenario} by checking ConfigMaps and Secrets.`,
    explanation: 'Configuration issues often involve missing or incorrect ConfigMaps, Secrets, or volume mounts.',
    type: 'command',
    priority: 1,
    command: 'kubectl get configmap,secret',
    exactCommand: 'kubectl get configmap,secret',
    expectedOutput: 'NAME                         DATA   AGE\nconfigmap/app-config         3      2h',
    timeToReveal: 10,
    category: 'discovery'
  }
];

const getGenericWorkloadHints = (scenario: string, resources?: any): EnhancedHint[] => [
  {
    id: 'hint-1',
    title: 'Check Workload Status',
    description: `Investigate ${scenario} by checking workload controllers and pods.`,
    explanation: 'Workload issues often involve deployment, statefulset, or daemonset configuration problems.',
    type: 'command',
    priority: 1,
    command: 'kubectl get deployments,statefulsets,daemonsets',
    exactCommand: 'kubectl get deployments,statefulsets,daemonsets',
    expectedOutput: 'NAME                     READY   UP-TO-DATE   AVAILABLE   AGE\ndeployment.apps/app      2/3     3            2           5m',
    timeToReveal: 10,
    category: 'discovery'
  }
];

// Additional helper functions can be added here as needed


