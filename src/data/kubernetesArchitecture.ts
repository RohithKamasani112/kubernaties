import { DiagramCategory, DiagramComponent } from './lessons';

export const kubernetesArchitectureData: DiagramCategory[] = [
  {
    id: 'architecture-components',
    name: 'Architecture Components',
    description: 'Core Kubernetes control plane and node components that make the cluster work',
    color: 'from-blue-500 to-blue-700',
    position: { x: 100, y: 100 },
    estimatedTime: '2-3 hours',
    difficulty: 'Intermediate',
    components: [
      {
        id: 'control-plane',
        name: 'Control Plane',
        description: 'The brain of Kubernetes - manages the cluster state and makes decisions',
        detailedDescription: 'The Control Plane consists of API Server, etcd, Scheduler, and Controller Manager. The API Server is the central Kubernetes control-plane component exposing the Kubernetes API. It stores all cluster state in etcd, a highly-available key-value store used for persistent storage of Kubernetes objects.',
        category: 'architecture-components',
        subcategory: 'control-plane',
        resources: [
          {
            title: 'Kubernetes Components Documentation',
            url: 'https://kubernetes.io/docs/concepts/overview/components/',
            type: 'docs',
            description: 'Official Kubernetes documentation on cluster components'
          },
          {
            title: 'Kubernetes Control Plane Architecture',
            url: 'https://www.youtube.com/watch?v=example1',
            type: 'video',
            description: 'Deep dive into control plane architecture'
          }
        ],
        relatedComponents: ['etcd', 'api-server', 'scheduler', 'controller-manager'],
        difficulty: 'Intermediate',
        tags: ['control-plane', 'architecture', 'core'],
        position: { x: 150, y: 150 },
        color: 'bg-blue-500',
        icon: '🧠'
      },
      {
        id: 'api-server',
        name: 'API Server',
        description: 'Central control-plane component exposing the Kubernetes API',
        detailedDescription: 'The API Server is the front-end for the Kubernetes control plane. It exposes the Kubernetes API and serves as the primary interface for all cluster operations. All other components communicate through the API server.',
        category: 'architecture-components',
        subcategory: 'control-plane',
        resources: [
          {
            title: 'kube-apiserver Documentation',
            url: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/',
            type: 'docs'
          }
        ],
        relatedComponents: ['etcd', 'control-plane'],
        difficulty: 'Intermediate',
        tags: ['api', 'control-plane', 'core'],
        position: { x: 200, y: 120 },
        color: 'bg-blue-600',
        icon: '🔌'
      },
      {
        id: 'etcd',
        name: 'etcd',
        description: 'Highly-available key-value store for all cluster data',
        detailedDescription: 'etcd is a distributed, reliable key-value store that Kubernetes uses to persist all cluster data (Deployments, Pods, Services, etc.). It ensures consistent storage of API objects and is critical for cluster state management.',
        category: 'architecture-components',
        subcategory: 'storage',
        resources: [
          {
            title: 'etcd in Kubernetes',
            url: 'https://stackoverflow.com/questions/47807892/what-is-etcd-in-kubernetes',
            type: 'article',
            description: 'StackOverflow explanation of etcd role in K8s'
          },
          {
            title: 'Kubernetes etcd Deep Dive',
            url: 'https://www.youtube.com/watch?v=example2',
            type: 'video'
          }
        ],
        relatedComponents: ['api-server', 'control-plane'],
        difficulty: 'Advanced',
        tags: ['storage', 'database', 'persistence'],
        position: { x: 250, y: 150 },
        color: 'bg-green-600',
        icon: '💾'
      },
      {
        id: 'scheduler',
        name: 'Scheduler',
        description: 'Assigns new Pods to suitable worker nodes',
        detailedDescription: 'The Scheduler watches for newly created Pods with no assigned node and selects a node for them to run on. It considers factors like resource requirements, hardware/software constraints, and data locality.',
        category: 'architecture-components',
        subcategory: 'control-plane',
        resources: [
          {
            title: 'kube-scheduler Documentation',
            url: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/',
            type: 'docs'
          }
        ],
        relatedComponents: ['control-plane', 'pods'],
        difficulty: 'Intermediate',
        tags: ['scheduling', 'control-plane', 'placement'],
        position: { x: 100, y: 200 },
        color: 'bg-purple-600',
        icon: '📅'
      },
      {
        id: 'controller-manager',
        name: 'Controller Manager',
        description: 'Runs controllers to reconcile desired vs actual state',
        detailedDescription: 'The Controller Manager runs controllers (e.g. deployment, node, endpoint controllers) to continuously reconcile desired vs. actual state. It watches the shared state through the API server and makes changes to move the current state towards the desired state.',
        category: 'architecture-components',
        subcategory: 'control-plane',
        resources: [
          {
            title: 'kube-controller-manager Documentation',
            url: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/',
            type: 'docs'
          }
        ],
        relatedComponents: ['control-plane', 'deployments'],
        difficulty: 'Intermediate',
        tags: ['controllers', 'reconciliation', 'control-plane'],
        position: { x: 150, y: 250 },
        color: 'bg-indigo-600',
        icon: '⚙️'
      },
      {
        id: 'node-components',
        name: 'Node Components',
        description: 'Components that run on every worker node',
        detailedDescription: 'Each worker node runs the kubelet, kube-proxy, and Container Runtime. The kubelet ensures containers in Pods are running and healthy. The kube-proxy maintains network rules on each node to implement Services.',
        category: 'architecture-components',
        subcategory: 'worker-nodes',
        resources: [
          {
            title: 'Node Components Documentation',
            url: 'https://kubernetes.io/docs/concepts/overview/components/#node-components',
            type: 'docs'
          },
          {
            title: 'Kubelet, Kube-proxy, and Containerd Explained',
            url: 'https://www.youtube.com/watch?v=example3',
            type: 'video'
          }
        ],
        relatedComponents: ['kubelet', 'kube-proxy', 'container-runtime'],
        difficulty: 'Intermediate',
        tags: ['worker-nodes', 'runtime', 'networking'],
        position: { x: 400, y: 150 },
        color: 'bg-orange-600',
        icon: '🔧'
      },
      {
        id: 'kubelet',
        name: 'kubelet',
        description: 'Ensures containers in Pods are running and healthy',
        detailedDescription: 'The kubelet is the primary node agent that runs on each node. It registers the node with the API server and ensures that containers described in PodSpecs are running and healthy.',
        category: 'architecture-components',
        subcategory: 'worker-nodes',
        resources: [
          {
            title: 'kubelet Documentation',
            url: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/',
            type: 'docs'
          }
        ],
        relatedComponents: ['node-components', 'pods'],
        difficulty: 'Intermediate',
        tags: ['node-agent', 'pod-management', 'health'],
        position: { x: 450, y: 100 },
        color: 'bg-orange-500',
        icon: '👷'
      },
      {
        id: 'kube-proxy',
        name: 'kube-proxy',
        description: 'Maintains network rules to implement Services',
        detailedDescription: 'kube-proxy maintains network rules (e.g. iptables or IPVS) on each node to implement Services. It enables network communication to Pods from network sessions inside or outside the cluster.',
        category: 'architecture-components',
        subcategory: 'networking',
        resources: [
          {
            title: 'kube-proxy Documentation',
            url: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/',
            type: 'docs'
          }
        ],
        relatedComponents: ['node-components', 'services'],
        difficulty: 'Advanced',
        tags: ['networking', 'proxy', 'services'],
        position: { x: 500, y: 150 },
        color: 'bg-teal-600',
        icon: '🌐'
      },
      {
        id: 'container-runtime',
        name: 'Container Runtime',
        description: 'Responsible for pulling images and running containers',
        detailedDescription: 'The Container Runtime (e.g. containerd or CRI-O) is responsible for pulling container images and running containers. It implements the Container Runtime Interface (CRI) to work with kubelet.',
        category: 'architecture-components',
        subcategory: 'runtime',
        resources: [
          {
            title: 'Container Runtime Documentation',
            url: 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/',
            type: 'docs'
          }
        ],
        relatedComponents: ['node-components', 'pods'],
        difficulty: 'Intermediate',
        tags: ['containers', 'runtime', 'images'],
        position: { x: 450, y: 200 },
        color: 'bg-gray-600',
        icon: '📦'
      }
    ]
  },
  {
    id: 'core-objects',
    name: 'Core Objects',
    description: 'Fundamental Kubernetes objects that form the building blocks',
    color: 'from-green-500 to-green-700',
    position: { x: 100, y: 400 },
    estimatedTime: '3-4 hours',
    difficulty: 'Beginner',
    components: [
      {
        id: 'pod',
        name: 'Pod',
        description: 'Smallest deployable unit - one or more containers sharing network and storage',
        detailedDescription: 'Pods are the smallest deployable units in Kubernetes. A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how containers should run. Containers in a Pod share the same network namespace and storage.',
        category: 'core-objects',
        resources: [
          {
            title: 'Kubernetes Pods Concept',
            url: 'https://kubernetes.io/docs/concepts/workloads/pods/',
            type: 'docs',
            description: 'Official documentation on Pods'
          },
          {
            title: 'What is a Kubernetes Pod? (Beginners Guide)',
            url: 'https://www.youtube.com/watch?v=example4',
            type: 'video'
          }
        ],
        relatedComponents: ['deployments', 'services', 'replicasets'],
        difficulty: 'Beginner',
        tags: ['workloads', 'containers', 'fundamental'],
        position: { x: 150, y: 450 },
        color: 'bg-green-500',
        icon: '🚀'
      },
      {
        id: 'service',
        name: 'Service',
        description: 'Stable network endpoint to access a set of Pods',
        detailedDescription: 'A Service defines a stable network endpoint (IP and port) to access a dynamically changing set of Pods. Services select Pods via labels and provide load-balanced access, decoupling clients from Pod IPs which can change.',
        category: 'core-objects',
        resources: [
          {
            title: 'Service Concept Documentation',
            url: 'https://kubernetes.io/docs/concepts/services-networking/service/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Services Explained',
            url: 'https://www.youtube.com/watch?v=example5',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'ingress', 'endpoints'],
        difficulty: 'Beginner',
        tags: ['networking', 'load-balancing', 'discovery'],
        position: { x: 250, y: 450 },
        color: 'bg-blue-500',
        icon: '🔗'
      },
      {
        id: 'configmap',
        name: 'ConfigMap',
        description: 'Key-value store for non-sensitive configuration data',
        detailedDescription: 'ConfigMaps allow you to decouple configuration artifacts from container images, making applications portable. You can mount ConfigMaps as files or expose them as environment variables to Pods.',
        category: 'core-objects',
        resources: [
          {
            title: 'ConfigMap Documentation',
            url: 'https://kubernetes.io/docs/concepts/configuration/configmap/',
            type: 'docs'
          },
          {
            title: 'Kubernetes ConfigMap Tutorial',
            url: 'https://www.youtube.com/watch?v=example6',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'secrets', 'volumes'],
        difficulty: 'Beginner',
        tags: ['configuration', 'data', 'environment'],
        position: { x: 350, y: 450 },
        color: 'bg-yellow-500',
        icon: '📋'
      },
      {
        id: 'secret',
        name: 'Secret',
        description: 'Secure storage for sensitive data like passwords and keys',
        detailedDescription: 'Secrets store confidential information in the cluster and can be mounted into Pods or accessed by the API. Unlike ConfigMaps, Secret data is base64-encoded and can be encrypted at rest.',
        category: 'core-objects',
        resources: [
          {
            title: 'Secret Documentation',
            url: 'https://kubernetes.io/docs/concepts/configuration/secret/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Secrets Explained',
            url: 'https://www.youtube.com/watch?v=example7',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'configmap', 'volumes'],
        difficulty: 'Beginner',
        tags: ['security', 'credentials', 'encryption'],
        position: { x: 450, y: 450 },
        color: 'bg-red-500',
        icon: '🔐'
      },
      {
        id: 'namespace',
        name: 'Namespace',
        description: 'Virtual cluster for resource organization and multi-tenancy',
        detailedDescription: 'Namespaces partition resources and enable multi-tenancy/organization. Names of objects must be unique within a namespace, but the same name can be reused in different namespaces. They also allow scoped resource quotas and RBAC rules.',
        category: 'core-objects',
        resources: [
          {
            title: 'Namespace Documentation',
            url: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Namespaces Explained',
            url: 'https://www.youtube.com/watch?v=example8',
            type: 'video'
          }
        ],
        relatedComponents: ['rbac', 'resource-quotas'],
        difficulty: 'Beginner',
        tags: ['organization', 'multi-tenancy', 'isolation'],
        position: { x: 150, y: 550 },
        color: 'bg-purple-500',
        icon: '🏢'
      }
    ]
  },
  {
    id: 'controllers',
    name: 'Controllers (Workloads)',
    description: 'Higher-level objects that manage Pods and provide advanced deployment patterns',
    color: 'from-purple-500 to-purple-700',
    position: { x: 600, y: 100 },
    estimatedTime: '4-5 hours',
    difficulty: 'Intermediate',
    components: [
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Declarative updates for Pods and ReplicaSets - ideal for stateless apps',
        detailedDescription: 'Deployments provide declarative updates for Pods and ReplicaSets, ideal for stateless applications. A Deployment defines a desired state and the Deployment Controller continuously works to match the actual state to the desired state, handling rolling updates, rollbacks, and scaling.',
        category: 'controllers',
        resources: [
          {
            title: 'Deployment Documentation',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Deployments Crash Course',
            url: 'https://www.youtube.com/watch?v=example9',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'replicasets', 'services'],
        difficulty: 'Intermediate',
        tags: ['stateless', 'scaling', 'rolling-updates'],
        position: { x: 650, y: 150 },
        color: 'bg-purple-500',
        icon: '🚢'
      },
      {
        id: 'statefulset',
        name: 'StatefulSet',
        description: 'For stateful applications requiring persistent identity',
        detailedDescription: 'StatefulSets are like Deployments, but for stateful applications requiring persistent identity (e.g. databases). A StatefulSet ensures that each Pod gets a stable network identity and persistent storage, and that Pods are created/terminated in a defined order.',
        category: 'controllers',
        resources: [
          {
            title: 'StatefulSet Documentation',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
            type: 'docs'
          },
          {
            title: 'Why Use StatefulSets in Kubernetes?',
            url: 'https://www.youtube.com/watch?v=example10',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'persistent-volumes', 'headless-services'],
        difficulty: 'Advanced',
        tags: ['stateful', 'databases', 'persistent-storage'],
        position: { x: 750, y: 150 },
        color: 'bg-indigo-500',
        icon: '🗄️'
      },
      {
        id: 'daemonset',
        name: 'DaemonSet',
        description: 'Ensures a copy of a Pod runs on all or subset of nodes',
        detailedDescription: 'DaemonSets ensure that a copy of a Pod runs on all (or a subset of) nodes. Useful for cluster-wide services like logging agents, monitoring daemons, or network plugins. When new nodes join, DaemonSets automatically deploy the Pod there.',
        category: 'controllers',
        resources: [
          {
            title: 'DaemonSet Documentation',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/',
            type: 'docs'
          },
          {
            title: 'Kubernetes DaemonSet Tutorial',
            url: 'https://www.youtube.com/watch?v=example11',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'node-selectors'],
        difficulty: 'Intermediate',
        tags: ['node-wide', 'monitoring', 'logging'],
        position: { x: 650, y: 250 },
        color: 'bg-green-600',
        icon: '👥'
      },
      {
        id: 'job',
        name: 'Job',
        description: 'Run Pods to completion for batch tasks',
        detailedDescription: 'Jobs run Pods to completion for batch tasks. A Job creates one or more Pods and retries them until a specified number succeed. This is used for finite tasks like data processing, database migrations, or one-time computations.',
        category: 'controllers',
        resources: [
          {
            title: 'Job Documentation',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/job/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Job Example',
            url: 'https://www.youtube.com/watch?v=example12',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'cronjobs'],
        difficulty: 'Intermediate',
        tags: ['batch', 'one-time', 'completion'],
        position: { x: 750, y: 250 },
        color: 'bg-yellow-600',
        icon: '⚡'
      },
      {
        id: 'cronjob',
        name: 'CronJob',
        description: 'Schedule Jobs on a repeating schedule',
        detailedDescription: 'CronJobs are like Jobs but run on a schedule. A CronJob creates Jobs on a repeating schedule (similar to a Unix crontab). It is ideal for periodic tasks like backups, report generation, and maintenance tasks.',
        category: 'controllers',
        resources: [
          {
            title: 'CronJob Documentation',
            url: 'https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/',
            type: 'docs'
          },
          {
            title: 'Kubernetes CronJob Tutorial',
            url: 'https://www.youtube.com/watch?v=example13',
            type: 'video'
          }
        ],
        relatedComponents: ['jobs', 'pods'],
        difficulty: 'Intermediate',
        tags: ['scheduled', 'periodic', 'automation'],
        position: { x: 650, y: 350 },
        color: 'bg-pink-600',
        icon: '⏰'
      }
    ]
  },
  {
    id: 'observability',
    name: 'Observability (Monitoring & Logging)',
    description: 'Tools and practices for monitoring, logging, and tracing Kubernetes applications',
    color: 'from-yellow-500 to-orange-700',
    position: { x: 100, y: 700 },
    estimatedTime: '3-4 hours',
    difficulty: 'Advanced',
    components: [
      {
        id: 'prometheus',
        name: 'Prometheus & Grafana',
        description: 'Metrics collection and monitoring with alerting capabilities',
        detailedDescription: 'Prometheus is the de facto monitoring system for Kubernetes. It periodically scrapes metrics from instrumented apps and kubelets, storing them in its time-series database. Prometheus enables alerting and flexible queries, providing visibility into containerized workloads. Grafana is often used on top of Prometheus for dashboards.',
        category: 'observability',
        resources: [
          {
            title: 'Prometheus Documentation',
            url: 'https://prometheus.io/docs/',
            type: 'docs'
          },
          {
            title: 'Monitoring Kubernetes with Prometheus & Grafana',
            url: 'https://www.youtube.com/watch?v=example14',
            type: 'video'
          },
          {
            title: 'Prometheus Guide by Sysdig',
            url: 'https://sysdig.com/blog/kubernetes-monitoring-prometheus/',
            type: 'article'
          }
        ],
        relatedComponents: ['metrics-server', 'alertmanager'],
        difficulty: 'Advanced',
        tags: ['monitoring', 'metrics', 'alerting', 'dashboards'],
        position: { x: 150, y: 750 },
        color: 'bg-orange-500',
        icon: '📊'
      },
      {
        id: 'logging',
        name: 'Centralized Logging',
        description: 'EFK/Fluentd/Loki stack for log aggregation and analysis',
        detailedDescription: 'In Kubernetes, each container writes logs to stdout/stderr, which the kubelet captures. For production, logs are shipped to a separate store for analysis. Common solutions include the Elasticsearch-Fluentd-Kibana (EFK) or Fluentd-Loki stacks. A logging agent runs as a DaemonSet to collect logs and send them to centralized storage.',
        category: 'observability',
        resources: [
          {
            title: 'Cluster-level Logging Documentation',
            url: 'https://kubernetes.io/docs/concepts/cluster-administration/logging/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Logging with EFK Stack',
            url: 'https://www.youtube.com/watch?v=example15',
            type: 'video'
          }
        ],
        relatedComponents: ['fluentd', 'elasticsearch', 'kibana'],
        difficulty: 'Advanced',
        tags: ['logging', 'aggregation', 'analysis', 'troubleshooting'],
        position: { x: 300, y: 750 },
        color: 'bg-blue-600',
        icon: '📝'
      },
      {
        id: 'tracing',
        name: 'Distributed Tracing',
        description: 'Jaeger/OpenTelemetry for end-to-end request tracing',
        detailedDescription: 'Distributed tracing tools like Jaeger or Zipkin, often via OpenTelemetry instrumentation, collect end-to-end traces for microservices calls. Tracing reveals latency bottlenecks and request flows. OpenTelemetry can auto-instrument pods, and a Jaeger collector aggregates and visualizes traces.',
        category: 'observability',
        resources: [
          {
            title: 'Jaeger Quickstart',
            url: 'https://www.jaegertracing.io/docs/getting-started/',
            type: 'docs'
          },
          {
            title: 'Distributed Tracing with Jaeger in Kubernetes',
            url: 'https://www.youtube.com/watch?v=example16',
            type: 'video'
          }
        ],
        relatedComponents: ['opentelemetry', 'jaeger'],
        difficulty: 'Advanced',
        tags: ['tracing', 'microservices', 'performance', 'debugging'],
        position: { x: 450, y: 750 },
        color: 'bg-purple-600',
        icon: '🔍'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Policy',
    description: 'Security controls, access management, and policy enforcement in Kubernetes',
    color: 'from-red-500 to-red-700',
    position: { x: 600, y: 400 },
    estimatedTime: '4-5 hours',
    difficulty: 'Advanced',
    components: [
      {
        id: 'rbac',
        name: 'RBAC',
        description: 'Role-Based Access Control for authorization',
        detailedDescription: 'RBAC is Kubernetes built-in authorization system. RBAC uses Roles and ClusterRoles (sets of permissions) bound to users or service accounts. This controls who (or what service) can access which API resources. For example, you might create a Role that allows reading Pods in a namespace and bind it to a user.',
        category: 'security',
        resources: [
          {
            title: 'RBAC Documentation',
            url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/',
            type: 'docs'
          },
          {
            title: 'Kubernetes RBAC Tutorial',
            url: 'https://www.youtube.com/watch?v=example17',
            type: 'video'
          }
        ],
        relatedComponents: ['service-accounts', 'cluster-roles'],
        difficulty: 'Advanced',
        tags: ['authorization', 'access-control', 'permissions'],
        position: { x: 650, y: 450 },
        color: 'bg-red-500',
        icon: '🔐'
      },
      {
        id: 'network-policies',
        name: 'Network Policies',
        description: 'Control network traffic between Pods and services',
        detailedDescription: 'NetworkPolicies define how groups of Pods are allowed to communicate with each other and with network endpoints. A NetworkPolicy uses label selectors to whitelist allowed ingress/egress traffic between Pods, namespaces, or IP blocks. Without any policy, all Pod traffic is allowed by default.',
        category: 'security',
        resources: [
          {
            title: 'NetworkPolicy Documentation',
            url: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',
            type: 'docs'
          },
          {
            title: 'Kubernetes NetworkPolicy Deep Dive',
            url: 'https://www.youtube.com/watch?v=example18',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'services', 'ingress'],
        difficulty: 'Advanced',
        tags: ['networking', 'security', 'isolation', 'firewall'],
        position: { x: 750, y: 450 },
        color: 'bg-indigo-600',
        icon: '🛡️'
      },
      {
        id: 'pod-security',
        name: 'Pod Security Standards',
        description: 'Built-in policies to constrain Pod security contexts',
        detailedDescription: 'Pod Security Standards are built-in policies (Privileged, Baseline, Restricted) that constrain Pod security contexts to minimize privilege escalation. For example, the Restricted policy forbids host network, privileged containers, and limits Linux capabilities. These can be enforced via the Pod Security Admission controller.',
        category: 'security',
        resources: [
          {
            title: 'Pod Security Standards Documentation',
            url: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/',
            type: 'docs'
          },
          {
            title: 'Kubernetes Pod Security Policies and Standards',
            url: 'https://www.youtube.com/watch?v=example19',
            type: 'video'
          }
        ],
        relatedComponents: ['pods', 'admission-controllers'],
        difficulty: 'Advanced',
        tags: ['security', 'policies', 'privilege-escalation', 'compliance'],
        position: { x: 650, y: 550 },
        color: 'bg-yellow-600',
        icon: '🔒'
      }
    ]
  }
];
