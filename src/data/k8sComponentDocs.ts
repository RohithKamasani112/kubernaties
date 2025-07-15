export interface ComponentConnection {
  component: string;
  type: 'ConfigMap' | 'Secret' | 'Service' | 'Ingress' | 'PVC' | 'Pod' | 'Deployment' | 'API' | 'Storage' | 'Network' | 'Control';
  purpose: string;
  connectionMethod: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
}

export interface ComponentField {
  field: string;
  description: string;
  exampleValue: string;
  required: boolean;
}

export interface InteractiveExample {
  title: string;
  description: string;
  command: string;
  expectedOutput: string;
  explanation: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  category: 'control-plane' | 'worker-node' | 'workload' | 'storage' | 'config' | 'networking';
  purpose: string;
  detailedExplanation: string;
  yamlManifest: string;
  fields: ComponentField[];
  connections: ComponentConnection[];
  usageFlow: string;
  realWorldExample: string;
  interactiveExamples: InteractiveExample[];
  bestPractices: string[];
  securityBestPractices: string[];
  troubleshooting: string[];
  relatedDocs: string[];
  kubernetesRefs: string[];
  ports?: string[];
  protocols?: string[];
}

export const k8sComponentDocs: ComponentDoc[] = [
  {
    id: 'api-server',
    name: 'kube-apiserver',
    category: 'control-plane',
    purpose: 'The central management component that exposes the Kubernetes API and serves as the front-end for the control plane. All cluster operations go through the API server.',
    detailedExplanation: `The kube-apiserver is the heart of Kubernetes - it's a RESTful API server that validates and configures data for API objects including pods, services, replication controllers, and others. It serves as the front-end for the Kubernetes control plane.

**Key Responsibilities:**
• **Authentication & Authorization**: Validates user credentials and permissions using RBAC, ABAC, or webhook modes
• **Admission Control**: Runs admission controllers to validate, mutate, or reject requests before persisting to etcd
• **API Validation**: Ensures all API requests conform to the OpenAPI schema and business logic
• **State Management**: Coordinates with etcd to maintain cluster state and provides watch capabilities
• **Resource Management**: Handles CRUD operations for all Kubernetes resources

**How It Works:**
1. Receives HTTP/HTTPS requests on port 6443 (secure) or 8080 (insecure, deprecated)
2. Authenticates the request using certificates, tokens, or other configured methods
3. Authorizes the request using RBAC policies
4. Validates the request through admission controllers
5. Persists valid changes to etcd
6. Returns response to the client
7. Notifies watchers of resource changes

**Architecture Position:**
The API server sits between all clients (kubectl, kubelet, controllers) and the etcd datastore. It's the only component that directly communicates with etcd, ensuring data consistency and providing a single point of access control.`,
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - name: kube-apiserver
    image: k8s.gcr.io/kube-apiserver:v1.28.0
    command:
    - kube-apiserver
    - --advertise-address=192.168.1.100
    - --etcd-servers=https://127.0.0.1:2379
    - --secure-port=6443
    - --service-cluster-ip-range=10.96.0.0/12
    ports:
    - containerPort: 6443
      name: https
    - containerPort: 8080
      name: http`,
    fields: [
      { field: 'advertise-address', description: 'IP address on which to advertise the apiserver', exampleValue: '192.168.1.100', required: true },
      { field: 'etcd-servers', description: 'List of etcd servers to connect with', exampleValue: 'https://127.0.0.1:2379', required: true },
      { field: 'secure-port', description: 'Port for HTTPS API server', exampleValue: '6443', required: true },
      { field: 'service-cluster-ip-range', description: 'CIDR range for service cluster IPs', exampleValue: '10.96.0.0/12', required: true }
    ],
    connections: [
      { component: 'etcd', type: 'Storage', purpose: 'Stores all cluster state and configuration', connectionMethod: 'gRPC over HTTPS', direction: 'bidirectional' },
      { component: 'kube-scheduler', type: 'Control', purpose: 'Receives pod scheduling decisions', connectionMethod: 'REST API calls', direction: 'inbound' },
      { component: 'kube-controller-manager', type: 'Control', purpose: 'Receives controller reconciliation requests', connectionMethod: 'REST API calls', direction: 'inbound' },
      { component: 'kubelet', type: 'Control', purpose: 'Receives node and pod status updates', connectionMethod: 'HTTPS REST API', direction: 'bidirectional' },
      { component: 'kubectl', type: 'API', purpose: 'Administrative commands and queries', connectionMethod: 'HTTPS REST API', direction: 'bidirectional' }
    ],
    usageFlow: 'The API server receives all requests (kubectl, controllers, kubelet), validates them, stores state in etcd, and coordinates with other control plane components. It serves as the single source of truth for cluster state.',
    realWorldExample: `**Production E-commerce Platform Scenario:**

Imagine you're running an e-commerce platform on Kubernetes. Here's how the API server handles a typical deployment update:

1. **Developer Action**: DevOps engineer runs \`kubectl apply -f new-product-service.yaml\`
2. **API Server Processing**:
   - Authenticates the engineer using their certificate
   - Checks RBAC permissions (can they deploy to 'production' namespace?)
   - Validates the YAML against the Deployment schema
   - Runs admission controllers (resource quotas, security policies)
   - Stores the new Deployment spec in etcd
3. **Coordination**:
   - Deployment controller watches API server for changes
   - Scheduler receives new pod creation requests
   - Kubelet gets pod assignments and starts containers
4. **Monitoring**: API server provides real-time status updates to kubectl and monitoring systems

**Real Impact**: In a busy e-commerce platform, the API server might handle 10,000+ requests per minute during peak traffic, coordinating deployments, scaling events, and health checks across hundreds of microservices.`,
    interactiveExamples: [
      {
        title: "Check API Server Health",
        description: "Verify that the API server is running and responsive",
        command: "kubectl get --raw='/healthz'",
        expectedOutput: "ok",
        explanation: "This command directly queries the API server's health endpoint. A response of 'ok' means the API server is healthy and can process requests."
      },
      {
        title: "View API Server Version",
        description: "Get detailed version information about the API server",
        command: "kubectl version --output=yaml",
        expectedOutput: `serverVersion:
  major: "1"
  minor: "28"
  gitVersion: v1.28.0`,
        explanation: "This shows the API server version. The server version indicates which Kubernetes features and APIs are available in your cluster."
      },
      {
        title: "List Available API Resources",
        description: "See all the resource types the API server can handle",
        command: "kubectl api-resources --verbs=list --namespaced -o name",
        expectedOutput: `pods
services
deployments
configmaps
secrets`,
        explanation: "This lists all namespaced resources that support the 'list' verb. Each resource type is managed by the API server and stored in etcd."
      },
      {
        title: "Check API Server Logs",
        description: "View API server logs to understand request processing",
        command: "kubectl logs -n kube-system kube-apiserver-master-node",
        expectedOutput: `I0315 10:30:15.123456 1 httplog.go:132] "HTTP" verb="GET" URI="/api/v1/pods" latency="2.345ms" userAgent="kubectl/v1.28.0" audit-ID="abc123"`,
        explanation: "API server logs show every request processed, including authentication, authorization, and timing information. This is crucial for debugging and monitoring."
      },
      {
        title: "Test RBAC Permissions",
        description: "Check what actions you can perform through the API server",
        command: "kubectl auth can-i create pods --namespace=default",
        expectedOutput: "yes",
        explanation: "This command asks the API server to check your RBAC permissions. The API server evaluates your credentials against configured policies and returns the authorization decision."
      }
    ],
    bestPractices: [
      'Enable RBAC for fine-grained access control',
      'Use TLS certificates for secure communication',
      'Configure audit logging for security monitoring',
      'Set appropriate resource limits and requests',
      'Use admission controllers for policy enforcement',
      'Implement proper backup and disaster recovery for etcd',
      'Monitor API server performance and latency',
      'Use network policies to restrict access',
      'Configure proper log rotation and retention'
    ],
    securityBestPractices: [
      'Enable and configure RBAC (Role-Based Access Control) with least privilege principle',
      'Use strong TLS certificates and rotate them regularly',
      'Enable audit logging and monitor for suspicious activities',
      'Implement admission controllers (PodSecurityPolicy, OPA Gatekeeper)',
      'Restrict API server access to authorized networks only',
      'Use service accounts with minimal required permissions',
      'Enable encryption at rest for etcd data',
      'Implement proper authentication mechanisms (OIDC, certificates)',
      'Monitor and alert on failed authentication attempts',
      'Regularly update Kubernetes to patch security vulnerabilities',
      'Use network segmentation to isolate control plane',
      'Implement proper secret management and rotation',
      'Configure API server with secure flags (--anonymous-auth=false)',
      'Use admission webhooks for custom security policies'
    ],
    troubleshooting: [
      'API server not responding: Check if port 6443 is accessible and certificates are valid',
      'Authentication failures: Verify kubeconfig file and certificate expiration dates',
      'Authorization denied: Check RBAC policies and user/service account permissions',
      'High latency: Monitor etcd performance and API server resource usage',
      'Admission controller errors: Review admission controller logs and webhook configurations',
      'Certificate errors: Ensure CA certificates are properly configured and not expired',
      'Connection refused: Verify API server is running and network connectivity',
      'Resource quota exceeded: Check namespace resource quotas and limits'
    ],
    relatedDocs: ['etcd', 'kube-scheduler', 'kube-controller-manager', 'kubelet'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/',
      'https://kubernetes.io/docs/concepts/overview/kubernetes-api/'
    ],
    ports: ['6443', '8080'],
    protocols: ['HTTPS', 'HTTP', 'gRPC']
  },
  {
    id: 'etcd',
    name: 'etcd',
    category: 'control-plane',
    purpose: 'Distributed key-value store that serves as the backing store for all cluster data. Stores configuration data, state, and metadata for the entire cluster.',
    detailedExplanation: `etcd is a distributed, reliable key-value store that serves as the backbone of Kubernetes. It stores all cluster data and serves as the single source of truth for the entire cluster state.

**Key Responsibilities:**
• **Data Storage**: Stores all Kubernetes objects (pods, services, secrets, configmaps, etc.)
• **Consistency**: Uses Raft consensus algorithm to ensure data consistency across cluster
• **Watch API**: Provides efficient watching capabilities for real-time updates
• **Transactions**: Supports atomic operations for complex state changes
• **Backup & Recovery**: Enables cluster state backup and disaster recovery

**How It Works:**
1. Receives read/write requests from kube-apiserver only
2. Uses Raft consensus protocol for leader election and data replication
3. Stores data as key-value pairs with hierarchical structure
4. Provides strong consistency guarantees across all nodes
5. Supports efficient range queries and watch operations
6. Handles cluster membership changes automatically

**Architecture Position:**
etcd sits at the foundation of Kubernetes, with only the API server having direct access. This design ensures data integrity and provides a clear separation of concerns.`,
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: etcd
  namespace: kube-system
spec:
  containers:
  - name: etcd
    image: k8s.gcr.io/etcd:3.5.9-0
    command:
    - etcd
    - --data-dir=/var/lib/etcd
    - --listen-client-urls=https://127.0.0.1:2379
    - --advertise-client-urls=https://127.0.0.1:2379
    - --listen-peer-urls=https://127.0.0.1:2380
    - --initial-advertise-peer-urls=https://127.0.0.1:2380
    ports:
    - containerPort: 2379
      name: client
    - containerPort: 2380
      name: peer`,
    fields: [
      { field: 'data-dir', description: 'Directory for storing etcd data', exampleValue: '/var/lib/etcd', required: true },
      { field: 'listen-client-urls', description: 'URLs to listen on for client traffic', exampleValue: 'https://127.0.0.1:2379', required: true },
      { field: 'listen-peer-urls', description: 'URLs to listen on for peer traffic', exampleValue: 'https://127.0.0.1:2380', required: true },
      { field: 'initial-cluster', description: 'Initial cluster configuration', exampleValue: 'default=https://127.0.0.1:2380', required: false }
    ],
    connections: [
      { component: 'kube-apiserver', type: 'API', purpose: 'Primary client for all cluster state operations', connectionMethod: 'gRPC over HTTPS', direction: 'bidirectional' }
    ],
    usageFlow: 'etcd stores all Kubernetes objects (pods, services, secrets, etc.) as key-value pairs. The API server is the only component that directly communicates with etcd, ensuring data consistency and providing a single point of access.',
    realWorldExample: `**High-Availability E-commerce Platform:**

In a production e-commerce platform running on Kubernetes, etcd is critical for maintaining cluster state:

**Scenario**: During Black Friday traffic surge, your platform needs to scale from 10 to 100 application pods.

1. **State Storage**: etcd stores the current state (10 pods) and desired state (100 pods)
2. **Consistency**: All control plane components see the same state via etcd
3. **Watch Operations**: Controllers watch etcd for changes and react accordingly
4. **Atomic Updates**: Pod creations are atomic - either all succeed or all fail
5. **Backup**: Regular etcd backups ensure you can recover from disasters

**Real Impact**: etcd handles thousands of state changes per minute, ensuring your scaling operations are consistent and reliable across the entire cluster.`,
    interactiveExamples: [
      {
        title: "Check etcd Cluster Health",
        description: "Verify that etcd cluster is healthy and responsive",
        command: "kubectl get --raw='/healthz/etcd'",
        expectedOutput: "ok",
        explanation: "This checks if etcd is healthy. The API server proxies this request to etcd and returns the health status."
      },
      {
        title: "View etcd Cluster Members",
        description: "List all etcd cluster members and their status",
        command: "kubectl exec -n kube-system etcd-master -- etcdctl member list",
        expectedOutput: `8e9e05c52164694d, started, master, https://192.168.1.10:2380, https://192.168.1.10:2379, false`,
        explanation: "Shows all etcd cluster members. In a multi-master setup, you'll see multiple members for high availability."
      },
      {
        title: "Check etcd Database Size",
        description: "Monitor etcd database size and performance",
        command: "kubectl exec -n kube-system etcd-master -- etcdctl endpoint status --write-out=table",
        expectedOutput: `+------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
|    ENDPOINT      |        ID        | VERSION | DB SIZE | IS LEADER | IS LEARNER | RAFT TERM | RAFT INDEX | RAFT APPLIED INDEX | ERRORS |
+------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+
| 127.0.0.1:2379   | 8e9e05c52164694d |   3.5.9 |   25 MB |      true |      false |         2 |      12345 |              12345 |        |
+------------------+------------------+---------+---------+-----------+------------+-----------+------------+--------------------+--------+`,
        explanation: "Shows etcd cluster status including database size, leader status, and Raft consensus information. Monitor DB size to prevent performance issues."
      }
    ],
    bestPractices: [
      'Run etcd on dedicated nodes with fast SSDs',
      'Configure regular backups and disaster recovery',
      'Use TLS encryption for all communications',
      'Monitor etcd performance and disk usage',
      'Implement proper network security and firewall rules',
      'Use etcd clustering for high availability',
      'Configure proper resource limits and monitoring',
      'Implement log rotation and cleanup policies'
    ],
    securityBestPractices: [
      'Enable encryption at rest for all etcd data',
      'Use mutual TLS (mTLS) for all etcd communications',
      'Restrict etcd access to API server only via firewall rules',
      'Regularly backup etcd data and test restore procedures',
      'Use dedicated etcd nodes isolated from worker nodes',
      'Enable etcd audit logging and monitor access patterns',
      'Rotate TLS certificates regularly',
      'Use strong authentication for etcd cluster members',
      'Implement network segmentation for etcd cluster',
      'Monitor etcd for unauthorized access attempts',
      'Use encrypted storage volumes for etcd data',
      'Implement proper key management for encryption keys',
      'Regularly update etcd to latest secure versions',
      'Configure etcd with secure flags and disable unnecessary features'
    ],
    troubleshooting: [
      'etcd not starting: Check disk space and file permissions on data directory',
      'Cluster split-brain: Ensure odd number of etcd nodes and proper network connectivity',
      'High latency: Monitor disk I/O performance and consider SSD storage',
      'Database size growing: Implement regular compaction and defragmentation',
      'Connection timeouts: Check network connectivity and certificate validity',
      'Leader election issues: Verify time synchronization across etcd nodes',
      'Backup failures: Ensure sufficient disk space and proper backup permissions',
      'Performance degradation: Monitor etcd metrics and tune heartbeat intervals'
    ],
    relatedDocs: ['kube-apiserver'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/',
      'https://etcd.io/docs/v3.5/op-guide/'
    ],
    ports: ['2379', '2380'],
    protocols: ['gRPC', 'Raft']
  },
  {
    id: 'kube-scheduler',
    name: 'kube-scheduler',
    category: 'control-plane',
    purpose: 'Watches for newly created pods with no assigned node and selects the best node for them to run on based on resource requirements, constraints, and policies.',
    detailedExplanation: `The kube-scheduler is responsible for placing pods on appropriate nodes in the cluster. It makes intelligent decisions based on resource requirements, constraints, and policies to ensure optimal workload distribution.`,
    realWorldExample: `In a production environment, the scheduler ensures your critical database pods run on high-memory nodes while batch jobs use standard nodes.`,
    interactiveExamples: [
      {
        title: "View Scheduler Status",
        description: "Check if the scheduler is running and healthy",
        command: "kubectl get pods -n kube-system | grep scheduler",
        expectedOutput: "kube-scheduler-master   1/1     Running   0          1d",
        explanation: "Shows the scheduler pod status. It should be in Running state for proper cluster operation."
      }
    ],
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: kube-scheduler
  namespace: kube-system
spec:
  containers:
  - name: kube-scheduler
    image: k8s.gcr.io/kube-scheduler:v1.28.0
    command:
    - kube-scheduler
    - --config=/etc/kubernetes/scheduler-config.yaml
    - --v=2
    ports:
    - containerPort: 10259
      name: https`,
    fields: [
      { field: 'config', description: 'Path to scheduler configuration file', exampleValue: '/etc/kubernetes/scheduler-config.yaml', required: false },
      { field: 'bind-address', description: 'IP address to bind to', exampleValue: '127.0.0.1', required: false },
      { field: 'secure-port', description: 'Port for HTTPS metrics and health checks', exampleValue: '10259', required: false }
    ],
    connections: [
      { component: 'kube-apiserver', type: 'API', purpose: 'Watches for unscheduled pods and updates pod bindings', connectionMethod: 'HTTPS REST API', direction: 'bidirectional' },
      { component: 'kubelet', type: 'Control', purpose: 'Indirectly coordinates through API server for node capacity', connectionMethod: 'Via API server', direction: 'outbound' }
    ],
    usageFlow: 'Scheduler continuously watches the API server for pods in Pending state, evaluates all available nodes based on resource requirements and constraints, selects the best node, and binds the pod to that node via the API server.',
    bestPractices: [
      'Configure custom scheduling policies for specific workloads',
      'Use node affinity and anti-affinity rules appropriately',
      'Monitor scheduler performance and queue depths',
      'Implement resource quotas to prevent resource exhaustion',
      'Use taints and tolerations for specialized nodes',
      'Configure proper resource limits and monitoring',
      'Implement scheduler extenders for custom logic'
    ],
    securityBestPractices: [
      'Secure scheduler configuration files with proper permissions',
      'Use TLS for all scheduler communications',
      'Implement RBAC for scheduler service account',
      'Monitor scheduler logs for anomalous behavior',
      'Use secure scheduling policies to prevent privilege escalation',
      'Implement resource quotas to prevent DoS attacks',
      'Regularly update scheduler to patch vulnerabilities',
      'Use admission controllers to validate scheduling decisions',
      'Implement proper audit logging for scheduling events',
      'Secure scheduler metrics endpoints'
    ],
    troubleshooting: [
      'Pods stuck in Pending: Check node resources and scheduling constraints',
      'Scheduler not running: Verify scheduler pod status and configuration',
      'High scheduling latency: Monitor scheduler queue depth and performance',
      'Pods not scheduled: Check node taints, tolerations, and affinity rules'
    ],
    relatedDocs: ['kube-apiserver', 'kubelet', 'pod'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/',
      'https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/'
    ],
    ports: ['10259'],
    protocols: ['HTTPS']
  },
  {
    id: 'kube-controller-manager',
    name: 'kube-controller-manager',
    category: 'control-plane',
    purpose: 'Runs controller processes that regulate the state of the cluster, ensuring the actual state matches the desired state defined in the API server.',
    detailedExplanation: `The kube-controller-manager runs multiple controllers that continuously monitor cluster state and take corrective actions to maintain desired state.`,
    realWorldExample: `When you scale a deployment from 3 to 5 replicas, the controller-manager ensures exactly 5 pods are running.`,
    interactiveExamples: [
      {
        title: "View Controller Manager Status",
        description: "Check controller manager health",
        command: "kubectl get pods -n kube-system | grep controller-manager",
        expectedOutput: "kube-controller-manager-master   1/1     Running   0          1d",
        explanation: "Shows the controller manager status. It should be running for proper cluster operations."
      }
    ],
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: kube-controller-manager
  namespace: kube-system
spec:
  containers:
  - name: kube-controller-manager
    image: k8s.gcr.io/kube-controller-manager:v1.28.0
    command:
    - kube-controller-manager
    - --cluster-cidr=10.244.0.0/16
    - --service-cluster-ip-range=10.96.0.0/12
    - --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt
    ports:
    - containerPort: 10257
      name: https`,
    fields: [
      { field: 'cluster-cidr', description: 'CIDR range for pod IPs', exampleValue: '10.244.0.0/16', required: true },
      { field: 'service-cluster-ip-range', description: 'CIDR range for service IPs', exampleValue: '10.96.0.0/12', required: true },
      { field: 'controllers', description: 'List of controllers to enable', exampleValue: '*', required: false }
    ],
    connections: [
      { component: 'kube-apiserver', type: 'API', purpose: 'Watches resources and updates cluster state', connectionMethod: 'HTTPS REST API', direction: 'bidirectional' },
      { component: 'deployment', type: 'Control', purpose: 'Manages ReplicaSet lifecycle for Deployments', connectionMethod: 'Via API server', direction: 'outbound' },
      { component: 'service', type: 'Control', purpose: 'Manages endpoint updates for Services', connectionMethod: 'Via API server', direction: 'outbound' }
    ],
    usageFlow: 'Controller manager runs multiple controllers (Deployment, ReplicaSet, Service, etc.) that continuously watch the API server for changes and take corrective actions to maintain desired state.',
    bestPractices: [
      'Monitor controller performance and reconciliation loops',
      'Configure appropriate resource limits',
      'Use leader election for high availability',
      'Implement proper logging and alerting',
      'Tune controller sync periods for performance',
      'Configure proper RBAC for controller service accounts',
      'Implement health checks and monitoring'
    ],
    securityBestPractices: [
      'Use minimal RBAC permissions for each controller',
      'Secure controller-manager configuration files',
      'Enable TLS for all controller communications',
      'Monitor controller logs for security events',
      'Implement proper service account token rotation',
      'Use admission controllers to validate controller actions',
      'Regularly update controller-manager for security patches',
      'Implement network policies for controller communications',
      'Monitor and audit controller API access patterns',
      'Use secure flags and disable unnecessary features',
      'Implement proper secret management for controller credentials',
      'Monitor resource usage to detect potential attacks'
    ],
    troubleshooting: [
      'Controllers not reconciling: Check controller manager logs and API server connectivity',
      'Resource conflicts: Monitor for competing controllers and race conditions',
      'High CPU usage: Review controller sync intervals and cluster size',
      'Leader election issues: Verify controller manager configuration and network connectivity'
    ],
    relatedDocs: ['kube-apiserver', 'deployment', 'service', 'replicaset'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/',
      'https://kubernetes.io/docs/concepts/architecture/controller/'
    ],
    ports: ['10257'],
    protocols: ['HTTPS']
  },
  {
    id: 'kubelet',
    name: 'kubelet',
    category: 'worker-node',
    purpose: 'Primary node agent that runs on each worker node. Manages pods and containers, communicates with the API server, and ensures containers are running in a pod.',
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: kubelet
  namespace: kube-system
spec:
  containers:
  - name: kubelet
    image: k8s.gcr.io/kubelet:v1.28.0
    command:
    - kubelet
    - --config=/var/lib/kubelet/config.yaml
    - --container-runtime-endpoint=unix:///var/run/containerd/containerd.sock
    - --kubeconfig=/etc/kubernetes/kubelet.conf
    ports:
    - containerPort: 10250
      name: https
    - containerPort: 10255
      name: http`,
    fields: [
      { field: 'config', description: 'Path to kubelet configuration file', exampleValue: '/var/lib/kubelet/config.yaml', required: true },
      { field: 'container-runtime-endpoint', description: 'Endpoint of container runtime', exampleValue: 'unix:///var/run/containerd/containerd.sock', required: true },
      { field: 'kubeconfig', description: 'Path to kubeconfig file for API server auth', exampleValue: '/etc/kubernetes/kubelet.conf', required: true },
      { field: 'node-ip', description: 'IP address of the node', exampleValue: '192.168.1.101', required: false }
    ],
    connections: [
      { component: 'kube-apiserver', type: 'API', purpose: 'Reports node and pod status, receives pod assignments', connectionMethod: 'HTTPS REST API', direction: 'bidirectional' },
      { component: 'container-runtime', type: 'Control', purpose: 'Manages container lifecycle operations', connectionMethod: 'gRPC/CRI', direction: 'outbound' },
      { component: 'kube-proxy', type: 'Network', purpose: 'Coordinates with network proxy for service routing', connectionMethod: 'Local communication', direction: 'bidirectional' },
      { component: 'pod', type: 'Control', purpose: 'Creates, monitors, and manages pod lifecycle', connectionMethod: 'Direct container management', direction: 'outbound' }
    ],
    usageFlow: 'Kubelet receives pod specifications from the API server, instructs the container runtime to pull images and start containers, monitors pod health, and reports status back to the API server.',
    bestPractices: [
      'Configure resource limits and requests for pods',
      'Set up proper health checks (liveness and readiness probes)',
      'Monitor kubelet logs and metrics',
      'Ensure proper node labeling and taints',
      'Configure log rotation and cleanup policies',
      'Implement proper node maintenance procedures',
      'Configure container runtime security settings'
    ],
    securityBestPractices: [
      'Enable kubelet authentication and authorization',
      'Use TLS certificates for kubelet API communications',
      'Implement proper RBAC for kubelet service account',
      'Secure container runtime socket access',
      'Enable kubelet audit logging',
      'Use read-only root filesystem for containers when possible',
      'Implement proper node security hardening',
      'Monitor kubelet for unauthorized access attempts',
      'Use secure container images and scan for vulnerabilities',
      'Implement proper secret and configmap security',
      'Enable admission controllers for pod security policies',
      'Use network policies to restrict pod communications',
      'Implement proper log monitoring and alerting',
      'Regularly update kubelet and container runtime',
      'Use minimal container privileges and capabilities',
      'Implement proper volume security and access controls'
    ],
    relatedDocs: ['kube-apiserver', 'container-runtime', 'kube-proxy', 'pod'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/',
      'https://kubernetes.io/docs/concepts/overview/components/#kubelet'
    ],
    ports: ['10250', '10255'],
    protocols: ['HTTPS', 'HTTP']
  },
  {
    id: 'kube-proxy',
    name: 'kube-proxy',
    category: 'worker-node',
    purpose: 'Network proxy that runs on each node, maintaining network rules and enabling communication to pods from network sessions inside or outside the cluster.',
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: kube-proxy
  namespace: kube-system
spec:
  containers:
  - name: kube-proxy
    image: k8s.gcr.io/kube-proxy:v1.28.0
    command:
    - kube-proxy
    - --config=/var/lib/kube-proxy/config.conf
    - --hostname-override=$(NODE_NAME)
    env:
    - name: NODE_NAME
      valueFrom:
        fieldRef:
          fieldPath: spec.nodeName
    ports:
    - containerPort: 10256
      name: http`,
    fields: [
      { field: 'config', description: 'Path to kube-proxy configuration', exampleValue: '/var/lib/kube-proxy/config.conf', required: true },
      { field: 'proxy-mode', description: 'Proxy mode (iptables, ipvs, userspace)', exampleValue: 'iptables', required: false },
      { field: 'cluster-cidr', description: 'CIDR range for pods', exampleValue: '10.244.0.0/16', required: false }
    ],
    connections: [
      { component: 'kube-apiserver', type: 'API', purpose: 'Watches services and endpoints for routing rules', connectionMethod: 'HTTPS REST API', direction: 'inbound' },
      { component: 'service', type: 'Network', purpose: 'Implements service load balancing and routing', connectionMethod: 'iptables/IPVS rules', direction: 'bidirectional' },
      { component: 'pod', type: 'Network', purpose: 'Routes traffic to backend pods', connectionMethod: 'Network forwarding', direction: 'outbound' }
    ],
    usageFlow: 'kube-proxy watches the API server for services and endpoints, then configures local network rules (iptables/IPVS) to route traffic from service IPs to the appropriate backend pods.',
    bestPractices: [
      'Use IPVS mode for better performance with many services',
      'Monitor proxy performance and connection tracking',
      'Configure appropriate timeouts for connections',
      'Ensure proper network policies are in place',
      'Monitor iptables rules and cleanup',
      'Configure proper logging and monitoring',
      'Implement health checks for proxy functionality'
    ],
    securityBestPractices: [
      'Secure kube-proxy configuration and kubeconfig files',
      'Use TLS for kube-proxy API server communications',
      'Implement proper RBAC for kube-proxy service account',
      'Monitor network traffic patterns for anomalies',
      'Use network policies to restrict unauthorized traffic',
      'Implement proper iptables/IPVS rule monitoring',
      'Regularly update kube-proxy for security patches',
      'Monitor proxy logs for security events',
      'Implement proper node network security',
      'Use secure proxy modes and configurations',
      'Monitor and audit service access patterns',
      'Implement proper firewall rules for node networking'
    ],
    relatedDocs: ['kube-apiserver', 'service', 'pod', 'endpoints'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/',
      'https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies'
    ],
    ports: ['10256'],
    protocols: ['HTTP']
  },
  {
    id: 'pod',
    name: 'Pod',
    category: 'workload',
    purpose: 'The smallest deployable unit in Kubernetes. A pod represents a group of one or more containers that share storage, network, and a specification for how to run the containers.',
    yamlManifest: `apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-app
    version: v1.0.0
spec:
  containers:
  - name: app
    image: nginx:1.21
    ports:
    - containerPort: 80
      name: http
    env:
    - name: ENV_VAR
      value: "production"
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    livenessProbe:
      httpGet:
        path: /health
        port: 80
      initialDelaySeconds: 30
      periodSeconds: 10`,
    fields: [
      { field: 'metadata.name', description: 'Name of the pod', exampleValue: 'my-app-pod', required: true },
      { field: 'metadata.labels', description: 'Key-value pairs for identification', exampleValue: 'app: my-app', required: false },
      { field: 'spec.containers', description: 'List of containers in the pod', exampleValue: 'nginx:1.21', required: true },
      { field: 'spec.restartPolicy', description: 'Restart policy for containers', exampleValue: 'Always', required: false }
    ],
    connections: [
      { component: 'kubelet', type: 'Control', purpose: 'Manages pod lifecycle and health monitoring', connectionMethod: 'Container runtime interface', direction: 'inbound' },
      { component: 'service', type: 'Network', purpose: 'Exposes pod to other components via stable endpoint', connectionMethod: 'Label selectors', direction: 'inbound' },
      { component: 'configmap', type: 'ConfigMap', purpose: 'Injects configuration data into pod', connectionMethod: 'Volume mounts or environment variables', direction: 'inbound' },
      { component: 'secret', type: 'Secret', purpose: 'Injects sensitive data into pod', connectionMethod: 'Volume mounts or environment variables', direction: 'inbound' },
      { component: 'persistent-volume-claim', type: 'PVC', purpose: 'Provides persistent storage to pod', connectionMethod: 'Volume mounts', direction: 'outbound' }
    ],
    usageFlow: 'Pods are created by higher-level controllers (Deployments, StatefulSets), scheduled by the scheduler, and managed by kubelet. They receive configuration from ConfigMaps/Secrets and can be exposed via Services.',
    bestPractices: [
      'Always set resource requests and limits',
      'Use health checks (liveness and readiness probes)',
      'Avoid running multiple unrelated processes in one pod',
      'Use init containers for setup tasks',
      'Implement graceful shutdown handling',
      'Use meaningful labels and annotations',
      'Implement proper logging and monitoring'
    ],
    securityBestPractices: [
      'Run containers as non-root user whenever possible',
      'Use read-only root filesystem for containers',
      'Implement proper pod security policies or pod security standards',
      'Use minimal container images and scan for vulnerabilities',
      'Implement proper secret management (avoid hardcoded secrets)',
      'Use service accounts with minimal required permissions',
      'Enable security contexts and drop unnecessary capabilities',
      'Implement proper network policies to restrict pod communications',
      'Use admission controllers for security policy enforcement',
      'Monitor pod behavior for anomalous activities',
      'Implement proper volume security and access controls',
      'Use encrypted storage for sensitive data',
      'Regularly update container images for security patches',
      'Implement proper resource quotas to prevent resource exhaustion',
      'Use container runtime security features (AppArmor, SELinux)',
      'Monitor and audit pod access to cluster resources'
    ],
    relatedDocs: ['deployment', 'service', 'configmap', 'secret', 'kubelet'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/concepts/workloads/pods/',
      'https://kubernetes.io/docs/tasks/configure-pod-container/'
    ],
    ports: ['8080', '9090'],
    protocols: ['HTTP', 'gRPC']
  },
  {
    id: 'service',
    name: 'Service',
    category: 'networking',
    purpose: 'An abstract way to expose an application running on a set of pods as a network service. Provides stable networking and load balancing.',
    yamlManifest: `apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP`,
    fields: [
      { field: 'metadata.name', description: 'Name of the service', exampleValue: 'my-app-service', required: true },
      { field: 'spec.type', description: 'Service type (ClusterIP, NodePort, LoadBalancer)', exampleValue: 'ClusterIP', required: false },
      { field: 'spec.selector', description: 'Label selector for target pods', exampleValue: 'app: my-app', required: true },
      { field: 'spec.ports', description: 'Port mappings for the service', exampleValue: 'port: 80, targetPort: 8080', required: true }
    ],
    connections: [
      { component: 'pod', type: 'Network', purpose: 'Routes traffic to backend pods', connectionMethod: 'Label selectors and endpoints', direction: 'outbound' },
      { component: 'kube-proxy', type: 'Network', purpose: 'Implements service networking rules', connectionMethod: 'iptables/IPVS rules', direction: 'bidirectional' },
      { component: 'ingress', type: 'Ingress', purpose: 'Exposes service externally with HTTP routing', connectionMethod: 'Service name reference', direction: 'inbound' },
      { component: 'endpoints', type: 'API', purpose: 'Tracks healthy pod IPs for load balancing', connectionMethod: 'Automatic endpoint management', direction: 'bidirectional' }
    ],
    usageFlow: 'Services watch for pods matching their selector, automatically create endpoints, and provide stable DNS names and IP addresses. kube-proxy implements the actual networking rules.',
    bestPractices: [
      'Use meaningful service names for DNS resolution',
      'Set appropriate session affinity if needed',
      'Monitor service endpoints and health',
      'Use headless services for StatefulSets',
      'Implement proper port naming conventions',
      'Configure appropriate service types for use cases',
      'Implement proper load balancing strategies'
    ],
    securityBestPractices: [
      'Use ClusterIP services for internal communications when possible',
      'Implement proper network policies to restrict service access',
      'Use TLS/SSL for service communications',
      'Monitor service access patterns for anomalies',
      'Implement proper authentication and authorization for services',
      'Use service mesh for advanced security features',
      'Avoid exposing unnecessary ports or services',
      'Implement proper ingress security for external services',
      'Use secure service account configurations',
      'Monitor and audit service endpoint changes',
      'Implement proper rate limiting and DDoS protection',
      'Use encrypted communications between services',
      'Implement proper service discovery security',
      'Monitor service logs for security events'
    ],
    relatedDocs: ['pod', 'kube-proxy', 'ingress', 'endpoints'],
    kubernetesRefs: [
      'https://kubernetes.io/docs/concepts/services-networking/service/',
      'https://kubernetes.io/docs/tutorials/services/'
    ],
    ports: ['80', '443', '8080'],
    protocols: ['HTTP', 'HTTPS', 'TCP']
  }
];
