// Advanced scenario hints for K8s debugging
// Covers Ingress, Monitoring, Multi-component, and Expert-level scenarios

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

// Ingress Hints
export const getIngress404Hints = (resources: any): EnhancedHint[] => {
  const serviceName = resources.primaryService || resources.services[0];
  const podName = resources.primaryPod || resources.pods[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Ingress Status',
      description: 'Verify the ingress resource and its external IP.',
      explanation: 'Ingress 404/502 errors often stem from misconfigured ingress rules, missing backend services, or ingress controller issues.',
      type: 'command',
      priority: 1,
      command: 'kubectl get ingress',
      exactCommand: 'kubectl get ingress',
      expectedOutput: 'NAME              CLASS   HOSTS              ADDRESS        PORTS   AGE\nfrontend-ingress  nginx   myapp.example.com  192.168.1.100  80      2h',
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'Describe Ingress Resource',
    description: 'Check ingress rules and backend service configuration.',
    explanation: 'The ingress rules define how traffic is routed to backend services. Check if the service names and ports are correct.',
    type: 'command',
    priority: 2,
    command: 'kubectl describe ingress <ingress-name>',
    exactCommand: 'kubectl describe ingress frontend-ingress',
    expectedOutput: 'Rules:\n  Host              Path  Backends\n  myapp.example.com /     frontend-service:80 (10.244.1.5:8080)',
    timeToReveal: 20,
    category: 'investigation'
  },
    {
      id: 'hint-3',
      title: 'Check Backend Service',
      description: `Verify that backend service "${serviceName}" exists and has endpoints.`,
      explanation: 'If the backend service doesn\'t exist or has no endpoints, the ingress will return 502 errors.',
      type: 'command',
      priority: 3,
      command: 'kubectl get service <service-name>',
      exactCommand: `kubectl get service ${serviceName}`,
      expectedOutput: `NAME               TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\n${serviceName}   ClusterIP   10.96.1.101   <none>        80/TCP    2h`,
      timeToReveal: 30,
      category: 'investigation'
    },
  {
    id: 'hint-4',
    title: 'Check Ingress Controller Logs',
    description: 'Look for errors in the ingress controller logs.',
    explanation: 'Ingress controller logs can reveal configuration errors, upstream connection failures, or SSL/TLS issues.',
    type: 'command',
    priority: 4,
    command: 'kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx',
    exactCommand: 'kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx',
    expectedOutput: '[error] 123#123: *456 connect() failed (111: Connection refused) while connecting to upstream',
    timeToReveal: 40,
    category: 'diagnosis'
  },
    {
      id: 'hint-5',
      title: 'Test Backend Service Directly',
      description: `Test if backend service "${serviceName}" is reachable from within the cluster.`,
      explanation: 'Before fixing ingress, ensure the backend service itself is working correctly.',
      type: 'command',
      priority: 5,
      command: 'kubectl run test-pod --image=curlimages/curl --rm -it -- curl <service-name>',
      exactCommand: `kubectl run test-pod --image=curlimages/curl --rm -it -- curl ${serviceName}`,
      expectedOutput: `curl: (7) Failed to connect to ${serviceName} port 80: Connection refused`,
      timeToReveal: 50,
      category: 'diagnosis'
    },
    {
      id: 'hint-6',
      title: 'Fix Service Port Configuration',
      description: `Update service "${serviceName}" to use the correct target port.`,
      explanation: 'The service is configured to forward to port 80, but the pods are listening on port 8080. Fix the service configuration.',
      type: 'command',
      priority: 6,
      command: 'kubectl patch service <service-name> -p \'{"spec":{"ports":[{"port":80,"targetPort":8080}]}}\'',
      exactCommand: `kubectl patch service ${serviceName} -p '{"spec":{"ports":[{"port":80,"targetPort":8080}]}}'`,
      expectedOutput: `service/${serviceName} patched`,
      timeToReveal: 60,
      category: 'fix'
    },
    {
      id: 'hint-7',
      title: 'Verify Ingress Connectivity',
      description: 'Test the ingress endpoint to confirm the fix.',
      explanation: 'After fixing the service configuration, the ingress should now route traffic correctly to the backend pods.',
      type: 'command',
      priority: 7,
      command: 'curl -H "Host: <hostname>" http://<ingress-ip>',
      exactCommand: 'curl -H "Host: myapp.example.com" http://192.168.1.100',
      expectedOutput: 'HTTP/1.1 200 OK\n<html><body>Welcome to MyApp!</body></html>',
      timeToReveal: 70,
      category: 'verification'
    }
  ];
};

// Istio Sidecar Hints
export const getIstioSidecarHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const serviceName = resources.primaryService || resources.services[0];

  return [
    {
      id: 'hint-1',
      title: 'Check Pod Sidecar Status',
      description: `Verify if the istio-proxy sidecar is injected and running in pod "${podName}".`,
      explanation: 'Istio requires a sidecar proxy container in each pod. Check if the sidecar is present and healthy.',
      type: 'command',
      priority: 1,
      command: 'kubectl get pods -o wide',
      exactCommand: 'kubectl get pods -o wide',
      expectedOutput: `NAME                    READY   STATUS    RESTARTS   AGE\n${podName}   1/2     Running   0          5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'Check Sidecar Injection Labels',
    description: 'Verify that the namespace or pod has sidecar injection enabled.',
    explanation: 'Istio sidecar injection requires specific labels on the namespace or pod. Check if injection is enabled.',
    type: 'command',
    priority: 2,
    command: 'kubectl get namespace <namespace> --show-labels',
    exactCommand: 'kubectl get namespace default --show-labels',
    expectedOutput: 'NAME      STATUS   AGE   LABELS\ndefault   Active   5d    istio-injection=enabled',
    timeToReveal: 20,
    category: 'investigation'
  },
    {
      id: 'hint-3',
      title: 'Check Istio Proxy Logs',
      description: `Look for errors in the istio-proxy sidecar container of pod "${podName}".`,
      explanation: 'The istio-proxy container logs can reveal configuration issues, certificate problems, or connectivity errors.',
      type: 'command',
      priority: 3,
      command: 'kubectl logs <pod-name> -c istio-proxy',
      exactCommand: `kubectl logs ${podName} -c istio-proxy`,
      expectedOutput: '[error][config] gRPC config stream closed: 14, connection error: desc = "transport: Error while dialing dial tcp: lookup istiod.istio-system.svc.cluster.local"',
      timeToReveal: 30,
      category: 'diagnosis'
    },
  {
    id: 'hint-4',
    title: 'Check Istiod Status',
    description: 'Verify that the Istio control plane (istiod) is running.',
    explanation: 'The istio-proxy sidecars need to connect to istiod for configuration. Check if istiod is healthy.',
    type: 'command',
    priority: 4,
    command: 'kubectl get pods -n istio-system',
    exactCommand: 'kubectl get pods -n istio-system',
    expectedOutput: 'NAME                     READY   STATUS    RESTARTS   AGE\nistiod-abc123-xyz789     1/1     Running   0          2h',
    timeToReveal: 40,
    category: 'investigation'
  },
    {
      id: 'hint-5',
      title: 'Restart Pod for Sidecar Injection',
      description: `Delete pod "${podName}" to trigger sidecar injection on recreation.`,
      explanation: 'If sidecar injection was enabled after the pod was created, you need to restart the pod for injection to take effect.',
      type: 'command',
      priority: 5,
      command: 'kubectl delete pod <pod-name>',
      exactCommand: `kubectl delete pod ${podName}`,
      expectedOutput: `pod "${podName}" deleted`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Verify Sidecar Injection',
      description: 'Check that the new pod has both containers running.',
      explanation: 'After restarting, the pod should have 2/2 containers ready (app + istio-proxy).',
      type: 'command',
      priority: 6,
      command: 'kubectl get pods',
      exactCommand: 'kubectl get pods',
      expectedOutput: `NAME                    READY   STATUS    RESTARTS   AGE\n${podName.replace('abc123', 'xyz789')}   2/2     Running   0          1m`,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};

// Job/CronJob Hints
export const getJobCronJobHints = (resources: any): EnhancedHint[] => {
  const podName = resources.primaryPod || resources.pods[0];
  const jobName = 'backup-job'; // From scenario mapping

  return [
    {
      id: 'hint-1',
      title: 'Check Job Status',
      description: 'Look for failed or incomplete jobs.',
      explanation: 'Jobs should complete successfully. Check for jobs that have failed or are stuck.',
      type: 'command',
      priority: 1,
      command: 'kubectl get jobs',
      exactCommand: 'kubectl get jobs',
      expectedOutput: `NAME           COMPLETIONS   DURATION   AGE\n${jobName}     0/1           5m         5m`,
      timeToReveal: 10,
      category: 'discovery'
    },
    {
      id: 'hint-2',
      title: 'Check Job Pod Logs',
      description: `Look at the logs of job pod "${podName}" to see why it failed.`,
      explanation: 'Job pods contain the actual error messages that caused the job to fail.',
      type: 'command',
      priority: 2,
      command: 'kubectl logs job/<job-name>',
      exactCommand: `kubectl logs job/${jobName}`,
      expectedOutput: 'Error: Failed to connect to database: connection refused',
      timeToReveal: 20,
      category: 'investigation'
    },
  {
    id: 'hint-3',
    title: 'Describe the Job',
    description: 'Get detailed information about the job configuration and events.',
    explanation: 'Job events can show pod creation failures, resource constraints, or other scheduling issues.',
    type: 'command',
    priority: 3,
    command: 'kubectl describe job <job-name>',
    exactCommand: 'kubectl describe job backup-job',
    expectedOutput: 'Events:\n  Warning  FailedCreate  2m   job-controller  Error creating: pods "backup-job-abc123" is forbidden',
    timeToReveal: 30,
    category: 'investigation'
  },
  {
    id: 'hint-4',
    title: 'Check Job Configuration',
    description: 'Verify the job command and image configuration.',
    explanation: 'The job might be using an incorrect command, image, or environment variables.',
    type: 'command',
    priority: 4,
    command: 'kubectl get job <job-name> -o yaml',
    exactCommand: 'kubectl get job backup-job -o yaml',
    expectedOutput: 'spec:\n  template:\n    spec:\n      containers:\n      - command: ["/bin/sh", "-c", "pg_dump $DATABASE_URL"]\n        image: postgres:13',
    timeToReveal: 40,
    category: 'investigation'
  },
  {
    id: 'hint-5',
    title: 'Fix Job Environment Variables',
    description: 'Add the missing environment variable to the job.',
    explanation: 'The job is missing the DATABASE_URL environment variable needed for the backup command.',
    type: 'command',
    priority: 5,
    command: 'kubectl patch job <job-name> -p \'{"spec":{"template":{"spec":{"containers":[{"name":"backup","env":[{"name":"DATABASE_URL","value":"postgresql://user:pass@db:5432/myapp"}]}]}}}}\'',
    exactCommand: 'kubectl patch job backup-job -p \'{"spec":{"template":{"spec":{"containers":[{"name":"backup","env":[{"name":"DATABASE_URL","value":"postgresql://user:pass@db:5432/myapp"}]}]}}}}\'',
    expectedOutput: 'job.batch/backup-job patched',
    timeToReveal: 50,
    category: 'fix'
  },
    {
      id: 'hint-6',
      title: 'Create New Job Instance',
      description: `Delete and recreate job "${jobName}" to apply the changes.`,
      explanation: 'Job specs are immutable, so you need to delete and recreate the job with the fixed configuration.',
      type: 'command',
      priority: 6,
      command: 'kubectl delete job <job-name> && kubectl apply -f job.yaml',
      exactCommand: `kubectl delete job ${jobName} && kubectl apply -f backup-job.yaml`,
      expectedOutput: `job.batch "${jobName}" deleted\njob.batch/${jobName} created`,
      timeToReveal: 60,
      category: 'fix'
    }
  ];
};

// Prometheus Scraping Hints
export const getPrometheusScrapingHints = (resources: any): EnhancedHint[] => {
  const serviceName = resources.primaryService || resources.services[0];
  const serviceMonitorName = 'app-metrics'; // From scenario mapping

  return [
    {
      id: 'hint-1',
      title: 'Check Prometheus Targets',
      description: 'Access Prometheus UI to check target status.',
      explanation: 'Prometheus targets page shows which endpoints are being scraped and any scraping errors.',
      type: 'command',
      priority: 1,
      command: 'kubectl port-forward svc/prometheus 9090:9090',
      exactCommand: 'kubectl port-forward svc/prometheus 9090:9090',
      expectedOutput: 'Forwarding from 127.0.0.1:9090 -> 9090\nForwarding from [::1]:9090 -> 9090',
      timeToReveal: 10,
      category: 'discovery'
    },
  {
    id: 'hint-2',
    title: 'Check ServiceMonitor Configuration',
    description: 'Verify that ServiceMonitor resources are correctly configured.',
    explanation: 'ServiceMonitors tell Prometheus which services to scrape. Check if they exist and have correct selectors.',
    type: 'command',
    priority: 2,
    command: 'kubectl get servicemonitor',
    exactCommand: 'kubectl get servicemonitor',
    expectedOutput: 'NAME          AGE\napp-metrics   2h',
    timeToReveal: 20,
    category: 'investigation'
  },
    {
      id: 'hint-3',
      title: 'Describe ServiceMonitor',
      description: `Check ServiceMonitor "${serviceMonitorName}" selector and endpoint configuration.`,
      explanation: 'The ServiceMonitor selector must match the service labels, and the endpoint port must be correct.',
      type: 'command',
      priority: 3,
      command: 'kubectl describe servicemonitor <servicemonitor-name>',
      exactCommand: `kubectl describe servicemonitor ${serviceMonitorName}`,
      expectedOutput: 'Spec:\n  Selector:\n    Match Labels:\n      app: myapp\n      version: v1\n  Endpoints:\n    Port: metrics',
      timeToReveal: 30,
      category: 'investigation'
    },
    {
      id: 'hint-4',
      title: 'Check Service Labels',
      description: `Verify that service "${serviceName}" has the correct labels.`,
      explanation: 'The service labels must match the ServiceMonitor selector for Prometheus to discover it.',
      type: 'command',
      priority: 4,
      command: 'kubectl get service <service-name> --show-labels',
      exactCommand: `kubectl get service ${serviceName} --show-labels`,
      expectedOutput: `NAME            TYPE        CLUSTER-IP     LABELS\n${serviceName}   ClusterIP   10.96.1.103   app=myapp,version=v2`,
      timeToReveal: 40,
      category: 'diagnosis'
    },
    {
      id: 'hint-5',
      title: 'Fix ServiceMonitor Selector',
      description: `Update ServiceMonitor "${serviceMonitorName}" to match the actual service labels.`,
      explanation: 'The ServiceMonitor expects version=v1 but the service has version=v2. Update the selector.',
      type: 'command',
      priority: 5,
      command: 'kubectl patch servicemonitor <servicemonitor-name> -p \'{"spec":{"selector":{"matchLabels":{"app":"myapp","version":"v2"}}}}\'',
      exactCommand: `kubectl patch servicemonitor ${serviceMonitorName} -p '{"spec":{"selector":{"matchLabels":{"app":"myapp","version":"v2"}}}}'`,
      expectedOutput: `servicemonitor.monitoring.coreos.com/${serviceMonitorName} patched`,
      timeToReveal: 50,
      category: 'fix'
    },
    {
      id: 'hint-6',
      title: 'Verify Metrics Collection',
      description: 'Check Prometheus targets page to confirm scraping is working.',
      explanation: 'After fixing the ServiceMonitor, Prometheus should discover the target and start scraping metrics.',
      type: 'concept',
      priority: 6,
      timeToReveal: 60,
      category: 'verification'
    }
  ];
};
