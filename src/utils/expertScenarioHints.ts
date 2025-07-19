// Expert-level scenario hints for K8s debugging
// Covers multi-component failures, ETCD, admission webhooks, and other advanced scenarios

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
  timeToReveal: number;
  category: 'discovery' | 'investigation' | 'diagnosis' | 'fix' | 'verification';
}

// Time Sync Hints
export const getTimeSyncHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const nodeName = resources.nodes[0] || 'worker-1';

  return [
    {
      id: 'hint-1',
      title: 'Check Node Time',
      description: `Verify the current time on pod "${podName}".`,
      explanation: 'Time synchronization issues can cause JWT token validation failures, certificate errors, and log timestamp problems.',
      type: 'command',
      priority: 1,
      command: 'kubectl exec -it <pod-name> -- date',
      exactCommand: `kubectl exec -it ${podName} -- date`,
      expectedOutput: 'Wed Oct 25 14:30:45 UTC 2023',
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check NTP Status on Nodes',
      description: `Verify NTP synchronization on node "${nodeName}".`,
      explanation: 'Nodes should be synchronized with NTP servers to maintain accurate time across the cluster.',
      type: 'command',
      priority: 2,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host timedatectl status',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host timedatectl status`,
      expectedOutput: 'NTP service: active\nNTP synchronized: no\nTime zone: UTC',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check JWT Token Errors',
      description: `Look for authentication errors in pod "${podName}" logs.`,
      explanation: 'Clock skew can cause JWT tokens to appear expired or not yet valid, leading to authentication failures.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <pod-name> | grep -i "token\\|jwt\\|auth"',
      exactCommand: `kubectl logs ${podName} | grep -i "token\\|jwt\\|auth"`,
      expectedOutput: 'ERROR: JWT token validation failed: token used before valid (nbf)',
      timeToReveal: 30,
      category: 'diagnosis'
    },
    {
      id: 'hint-4',
      title: 'Fix NTP Configuration',
      description: `Enable and restart NTP service on node "${nodeName}".`,
      explanation: 'Restart the NTP service to force time synchronization with upstream NTP servers.',
      type: 'command',
      priority: 4,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host systemctl restart ntp',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host systemctl restart ntp`,
      expectedOutput: 'NTP service restarted successfully',
      timeToReveal: 40,
      category: 'fix'
    },
    {
      id: 'hint-5',
      title: 'Verify Time Synchronization',
      description: `Check that node "${nodeName}" is now synchronized with NTP.`,
      explanation: 'After restarting NTP, verify that the nodes are properly synchronized and the time drift is minimal.',
      type: 'command',
      priority: 5,
      command: 'kubectl debug node/<node-name> -it --image=busybox -- chroot /host timedatectl status',
      exactCommand: `kubectl debug node/${nodeName} -it --image=busybox -- chroot /host timedatectl status`,
      expectedOutput: 'NTP service: active\nNTP synchronized: yes\nTime zone: UTC',
      timeToReveal: 50,
      category: 'verification'
    }
  ];
};

// Multi-Component Failure Hints
export const getMultiComponentHints = (resources: any): EnhancedHint[] => {
  const databasePod = resources.pods[0] || 'database-abc123';
  const cachePod = resources.pods[1] || 'cache-xyz789';
  const appPod = resources.pods[2] || 'app-def456';
  const oldDatabasePod = resources.pods[3] || 'old-database-ghi789';

  return [
    {
      id: 'hint-1',
      title: 'Get Overall Cluster Status',
      description: 'Check the status of all components across the cluster.',
      explanation: 'Multi-component failures often have a root cause that cascades through the system. Start with a broad view.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods --all-namespaces | grep -v Running',
      exactCommand: 'kubectl get pods --all-namespaces | grep -v Running',
      expectedOutput: `default    ${databasePod}     0/1     CrashLoopBackOff   5          10m\ndefault    ${cachePod}        0/1     Pending            0          8m\ndefault    ${appPod}          0/1     Error              3          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Identify the Root Cause Component',
      description: 'Look for the component that failed first (oldest failure).',
      explanation: 'In cascade failures, fixing the root cause component often resolves dependent failures. Look at creation timestamps.',
      type: 'command',
      priority: 2,
      command: 'kubectl get pods --sort-by=.metadata.creationTimestamp',
      exactCommand: 'kubectl get pods --sort-by=.metadata.creationTimestamp',
      expectedOutput: `${databasePod}     0/1     CrashLoopBackOff   5          10m\n${cachePod}        0/1     Pending            0          8m\n${appPod}          0/1     Error              3          5m`,
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check Database Pod Logs',
      description: `Examine the logs of database pod "${databasePod}" (likely root cause).`,
      explanation: 'The database pod is the oldest failure and likely the root cause. Other components depend on the database.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <database-pod> --previous',
      exactCommand: `kubectl logs ${databasePod} --previous`,
      expectedOutput: 'ERROR: could not bind IPv4 address "0.0.0.0:5432": Address already in use',
      timeToReveal: 30,
      category: 'diagnosis'
    },
  {
    id: 'hint-4',
    title: 'Check for Port Conflicts',
    description: 'Look for other processes using the database port.',
    explanation: 'The database cannot start because another process is using port 5432. Check what\'s running on that port.',
    type: 'command',
    priority: 4,
    command: 'kubectl get pods -o wide | grep 5432',
    exactCommand: 'kubectl get pods -o wide | grep 5432',
    expectedOutput: 'old-database-ghi789  1/1     Running   0          2d    10.244.1.10   worker-1',
    timeToReveal: 40,
    category: 'diagnosis'
  },
    {
      id: 'hint-5',
      title: 'Remove Conflicting Database',
      description: `Delete the old database pod "${oldDatabasePod}" that's causing the port conflict.`,
      explanation: 'An old database pod is still running and using port 5432. Remove it to allow the new database to start.',
      type: 'command',
      priority: 5,
      command: 'kubectl delete pod <old-database-pod>',
      exactCommand: `kubectl delete pod ${oldDatabasePod}`,
      expectedOutput: `pod "${oldDatabasePod}" deleted`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Monitor Cascade Recovery',
      description: 'Watch as dependent components recover automatically.',
      explanation: 'After fixing the root cause, dependent components should start working. Monitor the recovery process.',
      type: 'command',
      priority: 6,
      command: 'kubectl get pods -w',
      exactCommand: 'kubectl get pods -w',
      expectedOutput: `${databasePod}     1/1     Running     0          12m\n${cachePod}        1/1     Running     0          10m\n${appPod}          1/1     Running     0          7m`,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};

// Admission Webhook Hints
export const getAdmissionWebhookHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];
  const webhookName = 'security-webhook'; // From scenario mapping

  return [
    {
      id: 'hint-1',
      title: 'Check Pod Creation Errors',
      description: 'Look for admission webhook rejection errors.',
      explanation: 'Admission webhooks can block pod creation if they reject the pod specification based on security policies.',
      type: 'command',
      priority: 1,
      command: 'kubectl get events --field-selector type=Warning',
      exactCommand: 'kubectl get events --field-selector type=Warning',
      expectedOutput: `Warning  FailedCreate  2m   replicaset-controller  Error creating: admission webhook "${webhookName}" denied the request`,
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'List Admission Webhooks',
    description: 'Check what validating admission webhooks are configured.',
    explanation: 'Validating admission webhooks can reject resource creation. Check which webhooks are active in the cluster.',
    type: 'command',
    priority: 2,
    command: 'kubectl get validatingadmissionwebhook',
    exactCommand: 'kubectl get validatingadmissionwebhook',
    expectedOutput: 'NAME               WEBHOOKS   AGE\nsecurity-webhook   1          5d',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Describe Admission Webhook',
    description: 'Check the webhook configuration and rules.',
    explanation: 'The webhook configuration defines what resources it validates and what rules it enforces.',
    type: 'command',
    priority: 3,
    command: 'kubectl describe validatingadmissionwebhook <webhook-name>',
    exactCommand: 'kubectl describe validatingadmissionwebhook security-webhook',
    expectedOutput: 'Rules:\n  Operations: CREATE\n  API Groups: \n  API Versions: v1\n  Resources: pods\nClient Config:\n  Service:\n    Name: security-webhook-service\n    Namespace: webhook-system',
    timeToReveal: 30,
    category: 'investigation'
  },
  {
    id: 'hint-4',
    title: 'Check Webhook Service Status',
    description: 'Verify that the webhook service is running and accessible.',
    explanation: 'If the webhook service is down or unreachable, it may be rejecting all requests or timing out.',
    type: 'command',
    priority: 4,
    command: 'kubectl get pods -n webhook-system',
    exactCommand: 'kubectl get pods -n webhook-system',
    expectedOutput: 'NAME                        READY   STATUS    RESTARTS   AGE\nsecurity-webhook-abc123     1/1     Running   0          5d',
    timeToReveal: 40,
    category: 'investigation'
  },
  {
    id: 'hint-5',
    title: 'Check Webhook Logs',
    description: 'Look at webhook logs to see why it\'s rejecting pods.',
    explanation: 'Webhook logs will show the specific reason why pods are being rejected.',
    type: 'command',
    priority: 5,
    command: 'kubectl logs -n webhook-system <webhook-pod>',
    exactCommand: 'kubectl logs -n webhook-system security-webhook-abc123',
    expectedOutput: 'WARN: Rejecting pod: missing required security context - runAsNonRoot must be true',
    timeToReveal: 50,
    category: 'diagnosis'
  },
    {
      id: 'hint-6',
      title: 'Fix Pod Security Context',
      description: `Add the required security context to deployment "${deploymentName}".`,
      explanation: 'The webhook requires pods to run as non-root. Add the security context to satisfy the webhook policy.',
      type: 'command',
      priority: 6,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000}}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000}}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 60,
      category: 'fix'
    }
  ];
};

// ETCD Corruption Hints
export const getEtcdCorruptionHints = (resources: any): EnhancedHint[] => {
  const etcdPod = resources.primaryPod || 'etcd-master-1';
  const masterNode = resources.nodes[0] || 'master-1';

  return [
    {
      id: 'hint-1',
      title: 'Check ETCD Pod Status',
      description: 'Verify the status of ETCD pods in the control plane.',
      explanation: 'ETCD corruption can cause the entire cluster to become unstable. Check if ETCD pods are running.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods -n kube-system | grep etcd',
      exactCommand: 'kubectl get pods -n kube-system | grep etcd',
      expectedOutput: `${etcdPod}                      0/1     CrashLoopBackOff   5          10m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check ETCD Logs',
      description: `Look for corruption errors in ETCD pod "${etcdPod}" logs.`,
      explanation: 'ETCD logs will show specific corruption errors and database consistency issues.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs -n kube-system <etcd-pod>',
      exactCommand: `kubectl logs -n kube-system ${etcdPod}`,
      expectedOutput: 'ERROR: database space exceeded\nFATAL: failed to recover v3 backend from snapshot',
      timeToReveal: 20,
      category: 'investigation'
    },
    {
      id: 'hint-3',
      title: 'Check ETCD Data Directory',
      description: `Examine the ETCD data directory on master node "${masterNode}".`,
      explanation: 'ETCD stores its data in a specific directory. Check if the directory is corrupted or full.',
      type: 'command',
      priority: 3,
      command: 'kubectl debug node/<master-node> -it --image=busybox -- chroot /host ls -la /var/lib/etcd',
      exactCommand: `kubectl debug node/${masterNode} -it --image=busybox -- chroot /host ls -la /var/lib/etcd`,
      expectedOutput: 'total 2048000\ndrwx------ 3 root root      4096 Oct 25 14:30 member\n-rw------- 1 root root 2097152000 Oct 25 14:30 member.db',
      timeToReveal: 30,
      category: 'investigation'
    },
    {
      id: 'hint-4',
      title: 'Create ETCD Backup',
      description: 'Create a backup of the current ETCD state before attempting recovery.',
      explanation: 'Always backup ETCD before attempting any recovery operations to prevent further data loss.',
      type: 'command',
      priority: 4,
      command: 'ETCDCTL_API=3 etcdctl snapshot save backup.db',
      exactCommand: `kubectl exec -n kube-system ${etcdPod} -- etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key snapshot save /tmp/backup.db`,
      expectedOutput: 'Snapshot saved at /tmp/backup.db',
      timeToReveal: 40,
      category: 'fix'
    },
    {
      id: 'hint-5',
      title: 'Restore ETCD from Backup',
      description: 'Restore ETCD from a previous healthy backup.',
      explanation: 'Use a known good backup to restore ETCD to a consistent state. This will require cluster downtime.',
      type: 'command',
      priority: 5,
      command: 'ETCDCTL_API=3 etcdctl snapshot restore backup.db --data-dir=/var/lib/etcd-restore',
      exactCommand: `kubectl exec -n kube-system ${etcdPod} -- etcdctl snapshot restore /tmp/backup.db --data-dir=/var/lib/etcd-restore`,
      expectedOutput: 'Snapshot restored successfully',
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Restart ETCD with Restored Data',
      description: 'Update ETCD configuration to use the restored data directory.',
      explanation: 'After restoring from backup, update the ETCD pod to use the restored data directory and restart the cluster.',
      type: 'concept',
      priority: 6,
      timeToReveal: 60,
      category: 'fix'
    }
  ];
};

// OOM Killer Hints
export const getOOMKillerHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const deploymentName = resources.primaryDeployment || resources.deployments[0];

  return [
    {
      id: 'hint-1',
      title: 'Check for OOMKilled Pods',
      description: 'Look for pods that have been killed due to out of memory.',
      explanation: 'OOMKilled status indicates that the container exceeded its memory limit and was terminated by the kernel.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods | grep OOMKilled',
      exactCommand: 'kubectl get pods | grep OOMKilled',
      expectedOutput: `${podName}       0/1     OOMKilled   3          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'Check Pod Resource Limits',
    description: 'Examine the memory limits set on the pod.',
    explanation: 'Check what memory limits are configured and compare them to actual usage patterns.',
    type: 'command',
    priority: 2,
    command: 'kubectl describe pod <pod-name>',
    exactCommand: 'kubectl describe pod memory-app-abc123',
    expectedOutput: 'Limits:\n  memory: 128Mi\nRequests:\n  memory: 64Mi\nLast State: Terminated\n  Reason: OOMKilled\n  Exit Code: 137',
    timeToReveal: 20,
    category: 'investigation'
  },
  {
    id: 'hint-3',
    title: 'Check Memory Usage Patterns',
    description: 'Look at current memory usage of running pods.',
    explanation: 'Use kubectl top to see actual memory consumption and compare it to the configured limits.',
    type: 'command',
    priority: 3,
    command: 'kubectl top pods',
    exactCommand: 'kubectl top pods',
    expectedOutput: 'NAME                CPU(cores)   MEMORY(bytes)\nmemory-app-xyz789   100m         150Mi',
    timeToReveal: 30,
    category: 'investigation'
  },
  {
    id: 'hint-4',
    title: 'Check Application Logs for Memory Issues',
    description: 'Look for memory-related errors in application logs.',
    explanation: 'Application logs might show memory allocation errors, garbage collection issues, or memory leaks.',
    type: 'command',
    priority: 4,
    command: 'kubectl logs <pod-name> --previous | grep -i "memory\\|oom\\|heap"',
    exactCommand: 'kubectl logs memory-app-abc123 --previous | grep -i "memory\\|oom\\|heap"',
    expectedOutput: 'OutOfMemoryError: Java heap space\nGC overhead limit exceeded',
    timeToReveal: 40,
    category: 'diagnosis'
  },
    {
      id: 'hint-5',
      title: 'Increase Memory Limits',
      description: `Update deployment "${deploymentName}" with higher memory limits.`,
      explanation: 'Based on the actual usage (150Mi) and the current limit (128Mi), increase the memory limit to prevent OOM kills.',
      type: 'command',
      priority: 5,
      command: 'kubectl patch deployment <deployment-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"256Mi"},"requests":{"memory":"128Mi"}}}]}}}}\'',
      exactCommand: `kubectl patch deployment ${deploymentName} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"256Mi"},"requests":{"memory":"128Mi"}}}]}}}}'`,
      expectedOutput: `deployment.apps/${deploymentName} patched`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Monitor Memory Usage',
      description: 'Watch the new pod to ensure it stays within memory limits.',
      explanation: 'After increasing limits, monitor the pod to ensure it runs stably without being OOMKilled.',
      type: 'command',
      priority: 6,
      command: 'kubectl top pods -w',
      exactCommand: 'kubectl top pods -w',
      expectedOutput: `NAME                CPU(cores)   MEMORY(bytes)\n${podName.replace('abc123', 'def456')}   100m         180Mi`,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};
