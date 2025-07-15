import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  PlayCircle, 
  Code,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  Network,
  Database,
  Shield,
  Settings,
  Activity,
  Users,
  GitBranch,
  Monitor,
  Cloud,
  Server,
  Key,
  Workflow,
  Container,
  Layers,
  Route,
  FileText,
  Lock,
  HardDrive,
  Zap,
  BarChart3,
  Timer,
  AlertTriangle,
  Webhook
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDocId = searchParams.get('doc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Topics', count: 85 },
    { id: 'basics', label: 'Basics', count: 18 },
    { id: 'architecture', label: 'Architecture', count: 12 },
    { id: 'workloads', label: 'Workloads', count: 15 },
    { id: 'networking', label: 'Networking', count: 12 },
    { id: 'storage', label: 'Storage', count: 10 },
    { id: 'configuration', label: 'Configuration', count: 8 },
    { id: 'security', label: 'Security', count: 10 },
  ];

  const docs = [
    // Basics - Core Concepts
    {
      id: 1,
      title: 'Kubernetes Components',
      category: 'basics',
      description: 'Overview of the essential components that make up a Kubernetes cluster',
      lastUpdated: '1 day ago',
      readTime: '8 min',
      hasPlayground: true,
      icon: Server,
      content: {
        introduction: 'A Kubernetes cluster consists of a control plane and one or more worker nodes. Understanding these components is essential for working with Kubernetes effectively.',
        sections: [
          {
            title: 'Control Plane Components',
            content: 'The control plane manages the overall state of the cluster and makes global decisions about the cluster.',
            codeExample: `# Check control plane components
kubectl get componentstatuses

# View API server status
kubectl cluster-info

# Check etcd health
kubectl get --raw /healthz/etcd`
          },
          {
            title: 'Node Components',
            content: 'Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.',
            codeExample: `# List all nodes
kubectl get nodes

# Describe a specific node
kubectl describe node <node-name>

# Check node resource usage
kubectl top nodes`
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Understanding Pods',
      category: 'basics',
      description: 'Learn about the smallest deployable units in Kubernetes',
      lastUpdated: '2 days ago',
      readTime: '5 min',
      hasPlayground: true,
      icon: Container,
      content: {
        introduction: 'Pods are the smallest deployable units of computing that you can create and manage in Kubernetes. A Pod represents a single instance of a running process in your cluster.',
        sections: [
          {
            title: 'What is a Pod?',
            content: 'A Pod encapsulates an application\'s container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.20
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"`
          },
          {
            title: 'Pod Lifecycle',
            content: 'Pods follow a defined lifecycle, starting in the Pending phase, moving through Running if at least one of its primary containers starts OK, and then through either the Succeeded or Failed phases.',
            codeExample: `# Check pod status
kubectl get pods

# Describe pod for detailed information
kubectl describe pod nginx-pod

# View pod logs
kubectl logs nginx-pod`
          }
        ]
      }
    },
    {
      id: 3,
      title: 'Labels and Selectors',
      category: 'basics',
      description: 'Organize and select subsets of objects using key/value pairs',
      lastUpdated: '1 day ago',
      readTime: '6 min',
      hasPlayground: true,
      icon: GitBranch,
      content: {
        introduction: 'Labels are key/value pairs attached to objects such as Pods. Labels are intended to specify identifying attributes of objects that are meaningful and relevant to users.',
        sections: [
          {
            title: 'Using Labels',
            content: 'Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
    tier: frontend
spec:
  containers:
  - name: nginx
    image: nginx:1.20
    ports:
    - containerPort: 80`
          },
          {
            title: 'Label Selectors',
            content: 'Via a label selector, you can identify a set of objects. Label selectors are the core grouping primitive in Kubernetes.',
            codeExample: `# Equality-based selectors
kubectl get pods -l environment=production,tier!=frontend

# Set-based selectors
kubectl get pods -l 'environment in (production,qa)'
kubectl get pods -l 'tier notin (frontend,backend)'

# Show labels in output
kubectl get pods --show-labels`
          }
        ]
      }
    },
    {
      id: 4,
      title: 'Namespaces',
      category: 'basics',
      description: 'Organize cluster resources into virtual clusters',
      lastUpdated: '3 days ago',
      readTime: '5 min',
      hasPlayground: true,
      icon: Layers,
      content: {
        introduction: 'Namespaces provide a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces.',
        sections: [
          {
            title: 'Creating Namespaces',
            content: 'Namespaces are intended for use in environments with many users spread across multiple teams, or projects.',
            codeExample: `apiVersion: v1
kind: Namespace
metadata:
  name: development
  labels:
    name: development
---
# Create namespace imperatively
kubectl create namespace production

# List all namespaces
kubectl get namespaces`
          },
          {
            title: 'Working with Namespaces',
            content: 'You can set the namespace for a request with the --namespace flag or configure your context to use a specific namespace.',
            codeExample: `# Set namespace for current context
kubectl config set-context --current --namespace=development

# Create resources in specific namespace
kubectl apply -f pod.yaml --namespace=production

# Get resources from all namespaces
kubectl get pods --all-namespaces`
          }
        ]
      }
    },
    // Workloads
    {
      id: 5,
      title: 'Deployments and ReplicaSets',
      category: 'workloads',
      description: 'Manage application deployments and scaling',
      lastUpdated: '1 week ago',
      readTime: '8 min',
      hasPlayground: true,
      icon: Layers,
      content: {
        introduction: 'A Deployment provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state.',
        sections: [
          {
            title: 'Creating a Deployment',
            content: 'Deployments ensure that a specified number of pod replicas are running at any given time.',
            codeExample: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80`
          },
          {
            title: 'Rolling Updates',
            content: 'Deployments support rolling updates, allowing you to update your application with zero downtime.',
            codeExample: `# Update deployment image
kubectl set image deployment/nginx-deployment nginx=nginx:1.21

# Check rollout status
kubectl rollout status deployment/nginx-deployment

# Rollback if needed
kubectl rollout undo deployment/nginx-deployment`
          }
        ]
      }
    },
    {
      id: 6,
      title: 'StatefulSets',
      category: 'workloads',
      description: 'Manage stateful applications with stable identities',
      lastUpdated: '1 week ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: Database,
      content: {
        introduction: 'StatefulSet is the workload API object used to manage stateful applications. It manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.',
        sections: [
          {
            title: 'Creating a StatefulSet',
            content: 'StatefulSets are valuable for applications that require stable, unique network identifiers, stable, persistent storage, and ordered, graceful deployment and scaling.',
            codeExample: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx
  serviceName: "nginx"
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "fast-ssd"
      resources:
        requests:
          storage: 1Gi`
          }
        ]
      }
    },
    {
      id: 7,
      title: 'DaemonSets',
      category: 'workloads',
      description: 'Run pods on every node in the cluster',
      lastUpdated: '5 days ago',
      readTime: '8 min',
      hasPlayground: true,
      icon: Activity,
      content: {
        introduction: 'A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them.',
        sections: [
          {
            title: 'Creating a DaemonSet',
            content: 'DaemonSets are typically used for cluster storage daemons, logs collection daemons, and node monitoring daemons.',
            codeExample: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
  labels:
    k8s-app: fluentd-logging
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      terminationGracePeriodSeconds: 30
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers`
          }
        ]
      }
    },
    {
      id: 8,
      title: 'Jobs and CronJobs',
      category: 'workloads',
      description: 'Run batch and scheduled workloads',
      lastUpdated: '2 days ago',
      readTime: '10 min',
      hasPlayground: true,
      icon: Timer,
      content: {
        introduction: 'A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.',
        sections: [
          {
            title: 'Creating Jobs',
            content: 'Jobs are useful for running batch processes, data processing, and one-time tasks.',
            codeExample: `apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure`
          }
        ]
      }
    },
    // Networking
    {
      id: 9,
      title: 'Services and Service Discovery',
      category: 'networking',
      description: 'Connect and expose your applications',
      lastUpdated: '3 days ago',
      readTime: '10 min',
      hasPlayground: true,
      icon: Network,
      content: {
        introduction: 'A Service in Kubernetes is an abstraction which defines a logical set of Pods and a policy by which to access them.',
        sections: [
          {
            title: 'Service Types',
            content: 'Kubernetes supports different types of services: ClusterIP, NodePort, LoadBalancer, and ExternalName.',
            codeExample: `# ClusterIP Service (default)
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP

---
# NodePort Service
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort`
          },
          {
            title: 'Service Discovery',
            content: 'Kubernetes provides DNS-based service discovery and environment variables for pods to discover services.',
            codeExample: `# DNS-based service discovery
# Services are accessible via:
# <service-name>.<namespace>.svc.cluster.local

# Example: Connect to a service from a pod
curl http://nginx-service.default.svc.cluster.local

# List services
kubectl get services

# Describe service endpoints
kubectl describe service nginx-service`
          }
        ]
      }
    },
    {
      id: 10,
      title: 'Ingress Controllers',
      category: 'networking',
      description: 'Expose HTTP and HTTPS routes from outside the cluster',
      lastUpdated: '4 days ago',
      readTime: '15 min',
      hasPlayground: true,
      icon: Route,
      content: {
        introduction: 'An Ingress may be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL/TLS, and offer name-based virtual hosting.',
        sections: [
          {
            title: 'Basic Ingress Configuration',
            content: 'Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.',
            codeExample: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080`
          },
          {
            title: 'TLS Configuration',
            content: 'Ingress can be configured to terminate TLS connections and provide HTTPS access to your services.',
            codeExample: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
      - https-example.foo.com
    secretName: testsecret-tls
  rules:
  - host: https-example.foo.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: service1
            port:
              number: 80`
          }
        ]
      }
    },
    {
      id: 11,
      title: 'Network Policies',
      category: 'networking',
      description: 'Control traffic flow between pods and services',
      lastUpdated: '4 days ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: Shield,
      content: {
        introduction: 'Network policies are an application-centric construct which allow you to specify how a pod is allowed to communicate with various network entities.',
        sections: [
          {
            title: 'Creating Network Policies',
            content: 'Network policies help implement network segmentation and micro-segmentation in your cluster.',
            codeExample: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          name: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978`
          }
        ]
      }
    },
    // Storage
    {
      id: 12,
      title: 'Persistent Volumes and Claims',
      category: 'storage',
      description: 'Manage persistent storage for your applications',
      lastUpdated: '1 week ago',
      readTime: '15 min',
      hasPlayground: true,
      icon: Database,
      content: {
        introduction: 'Persistent Volumes (PV) are a way for users to "claim" durable storage without knowing the details of the particular cloud environment.',
        sections: [
          {
            title: 'Creating Persistent Volume Claims',
            content: 'A PersistentVolumeClaim (PVC) is a request for storage by a user.',
            codeExample: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: fast-ssd
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc`
          }
        ]
      }
    },
    {
      id: 13,
      title: 'Storage Classes',
      category: 'storage',
      description: 'Define different classes of storage with varying performance characteristics',
      lastUpdated: '1 week ago',
      readTime: '8 min',
      hasPlayground: true,
      icon: HardDrive,
      content: {
        introduction: 'A StorageClass provides a way for administrators to describe the "classes" of storage they offer. Different classes might map to quality-of-service levels, or to backup policies.',
        sections: [
          {
            title: 'Creating Storage Classes',
            content: 'Storage classes allow dynamic provisioning of persistent volumes with different characteristics.',
            codeExample: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
---
# Using the storage class
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: fast-storage-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 10Gi`
          }
        ]
      }
    },
    // Configuration
    {
      id: 14,
      title: 'ConfigMaps and Secrets',
      category: 'configuration',
      description: 'Manage configuration and sensitive data',
      lastUpdated: '5 days ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: FileText,
      content: {
        introduction: 'ConfigMaps and Secrets allow you to decouple configuration artifacts from image content to keep containerized applications portable.',
        sections: [
          {
            title: 'Using ConfigMaps',
            content: 'ConfigMaps store configuration data as key-value pairs that can be consumed by pods.',
            codeExample: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://localhost:5432/mydb"
  debug_mode: "true"
  max_connections: "100"
---
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    envFrom:
    - configMapRef:
        name: app-config`
          },
          {
            title: 'Managing Secrets',
            content: 'Secrets are similar to ConfigMaps but are specifically intended to hold confidential data.',
            codeExample: `apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded 'admin'
  password: MWYyZDFlMmU2N2Rm  # base64 encoded password
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: SECRET_USERNAME
      valueFrom:
        secretKeyRef:
          name: mysecret
          key: username
    - name: SECRET_PASSWORD
      valueFrom:
        secretKeyRef:
          name: mysecret
          key: password`
          }
        ]
      }
    },
    {
      id: 15,
      title: 'Resource Management',
      category: 'configuration',
      description: 'Manage CPU and memory resources for pods and containers',
      lastUpdated: '3 days ago',
      readTime: '10 min',
      hasPlayground: true,
      icon: Settings,
      content: {
        introduction: 'Resource management for Pods and containers allows you to specify resource requests and limits to ensure proper resource allocation and prevent resource starvation.',
        sections: [
          {
            title: 'Resource Requests and Limits',
            content: 'Requests specify the minimum amount of resources a container needs, while limits specify the maximum amount it can use.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: nginx:1.20
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
    - containerPort: 80`
          },
          {
            title: 'Quality of Service Classes',
            content: 'Kubernetes assigns QoS classes to pods based on their resource configuration: Guaranteed, Burstable, and BestEffort.',
            codeExample: `# Guaranteed QoS - requests = limits
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed-pod
spec:
  containers:
  - name: app
    image: nginx:1.20
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "100Mi"
        cpu: "100m"`
          }
        ]
      }
    },
    // Security
    {
      id: 16,
      title: 'RBAC and Security',
      category: 'security',
      description: 'Implement role-based access control',
      lastUpdated: '6 days ago',
      readTime: '20 min',
      hasPlayground: true,
      icon: Shield,
      content: {
        introduction: 'Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users.',
        sections: [
          {
            title: 'Creating Roles and RoleBindings',
            content: 'RBAC uses the rbac.authorization.k8s.io API group to drive authorization decisions.',
            codeExample: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`
          },
          {
            title: 'ClusterRoles and ClusterRoleBindings',
            content: 'ClusterRoles define permissions at the cluster level, while ClusterRoleBindings grant those permissions cluster-wide.',
            codeExample: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: User
  name: manager
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io`
          }
        ]
      }
    },
    {
      id: 17,
      title: 'Pod Security Standards',
      category: 'security',
      description: 'Define security policies for pods',
      lastUpdated: '4 days ago',
      readTime: '15 min',
      hasPlayground: true,
      icon: Lock,
      content: {
        introduction: 'Pod Security Standards define three different policies to broadly cover the security spectrum: Privileged, Baseline, and Restricted.',
        sections: [
          {
            title: 'Security Contexts',
            content: 'A security context defines privilege and access control settings for a Pod or Container.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: busybox:1.28
    command: [ "sh", "-c", "sleep 1h" ]
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      capabilities:
        drop:
        - ALL`
          },
          {
            title: 'Pod Security Admission',
            content: 'Pod Security Admission is a built-in admission controller that enforces Pod Security Standards.',
            codeExample: `apiVersion: v1
kind: Namespace
metadata:
  name: restricted-namespace
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
# This pod will be rejected in the restricted namespace
apiVersion: v1
kind: Pod
metadata:
  name: privileged-pod
  namespace: restricted-namespace
spec:
  containers:
  - name: app
    image: nginx:1.20
    securityContext:
      privileged: true  # This violates restricted policy`
          }
        ]
      }
    },
    // Architecture
    {
      id: 18,
      title: 'Nodes and Node Management',
      category: 'architecture',
      description: 'Understand worker nodes and their management',
      lastUpdated: '5 days ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: Server,
      content: {
        introduction: 'Nodes are the worker machines in Kubernetes. Each node contains the services necessary to run pods and is managed by the control plane.',
        sections: [
          {
            title: 'Node Components',
            content: 'Each node runs kubelet, kube-proxy, and a container runtime to manage pods and provide networking.',
            codeExample: `# Get node information
kubectl get nodes -o wide

# Describe a specific node
kubectl describe node <node-name>

# Check node conditions
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[?(@.type=="Ready")].status}{"\n"}{end}'

# Cordon a node (mark as unschedulable)
kubectl cordon <node-name>

# Drain a node (evict all pods)
kubectl drain <node-name> --ignore-daemonsets`
          },
          {
            title: 'Node Affinity and Taints',
            content: 'Control pod placement using node affinity, taints, and tolerations.',
            codeExample: `# Add a taint to a node
kubectl taint nodes <node-name> key1=value1:NoSchedule

# Pod with toleration
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  tolerations:
  - key: "key1"
    operator: "Equal"
    value: "value1"
    effect: "NoSchedule"`
          }
        ]
      }
    },
    {
      id: 19,
      title: 'Controllers and Control Loops',
      category: 'architecture',
      description: 'Understand how Kubernetes controllers maintain desired state',
      lastUpdated: '3 days ago',
      readTime: '10 min',
      hasPlayground: true,
      icon: Settings,
      content: {
        introduction: 'Controllers are control loops that watch the state of your cluster, then make or request changes where needed. Each controller tries to move the current cluster state closer to the desired state.',
        sections: [
          {
            title: 'How Controllers Work',
            content: 'Controllers track at least one Kubernetes resource type. These objects have a spec field that represents the desired state.',
            codeExample: `# View controller managers
kubectl get pods -n kube-system | grep controller

# Check controller manager logs
kubectl logs -n kube-system kube-controller-manager-<node-name>

# View replicaset controller in action
kubectl get replicasets
kubectl describe replicaset <rs-name>

# Scale deployment and watch controller
kubectl scale deployment nginx-deployment --replicas=5
kubectl get pods -w`
          },
          {
            title: 'Custom Controllers',
            content: 'You can create custom controllers to manage custom resources or implement specific business logic.',
            codeExample: `# Example custom resource definition
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              cronSpec:
                type: string
              image:
                type: string
              replicas:
                type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab`
          }
        ]
      }
    },
    {
      id: 20,
      title: 'Horizontal Pod Autoscaler',
      category: 'workloads',
      description: 'Automatically scale your applications based on metrics',
      lastUpdated: '3 days ago',
      readTime: '14 min',
      hasPlayground: true,
      icon: BarChart3,
      content: {
        introduction: 'The Horizontal Pod Autoscaler automatically scales the number of Pods in a replication controller, deployment, replica set or stateful set based on observed metrics.',
        sections: [
          {
            title: 'Setting up HPA',
            content: 'HPA requires metrics server to be installed in your cluster to function properly.',
            codeExample: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`
          },
          {
            title: 'Custom Metrics Scaling',
            content: 'HPA can scale based on custom metrics from your application or external metrics.',
            codeExample: `# HPA with custom metrics
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: custom-metrics-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sample-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: "1k"
  - type: External
    external:
      metric:
        name: queue_messages_ready
        selector:
          matchLabels:
            queue: "worker_tasks"
      target:
        type: AverageValue
        averageValue: "30"`
          }
        ]
      }
    },
    {
      id: 21,
      title: 'Init Containers and Sidecar Containers',
      category: 'workloads',
      description: 'Use specialized containers for initialization and auxiliary tasks',
      lastUpdated: '2 days ago',
      readTime: '10 min',
      hasPlayground: true,
      icon: Container,
      content: {
        introduction: 'Init containers run before app containers in a Pod. Sidecar containers run alongside the main application container to provide supporting functionality.',
        sections: [
          {
            title: 'Init Containers',
            content: 'Init containers always run to completion before any app containers start. They are useful for setup tasks.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.default.svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.default.svc.cluster.local; do echo waiting for mydb; sleep 2; done"]`
          },
          {
            title: 'Sidecar Containers',
            content: 'Sidecar containers extend and enhance the functionality of the primary application container.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
spec:
  containers:
  - name: main-app
    image: nginx:1.20
    ports:
    - containerPort: 80
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/nginx
  - name: log-sidecar
    image: busybox:1.28
    command: ['sh', '-c', 'tail -f /var/log/nginx/access.log']
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/nginx
  volumes:
  - name: shared-logs
    emptyDir: {}`
          }
        ]
      }
    },
    {
      id: 22,
      title: 'Service Accounts and Authentication',
      category: 'security',
      description: 'Manage pod authentication and API access',
      lastUpdated: '4 days ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: Key,
      content: {
        introduction: 'Service accounts provide an identity for processes that run in a Pod. When you create a pod, if you do not specify a service account, it is automatically assigned the default service account.',
        sections: [
          {
            title: 'Creating Service Accounts',
            content: 'Service accounts are used to control API access for pods and can be bound to roles for specific permissions.',
            codeExample: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
---
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: my-service-account
  containers:
  - name: app
    image: nginx:1.20
    ports:
    - containerPort: 80`
          },
          {
            title: 'Token Management',
            content: 'Service account tokens are automatically mounted into pods and can be used to authenticate with the Kubernetes API.',
            codeExample: `# Create a token for service account
kubectl create token my-service-account

# View service account details
kubectl describe serviceaccount my-service-account

# Bind service account to a role
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: my-service-account-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-service-account
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`
          }
        ]
      }
    },
    {
      id: 23,
      title: 'Volumes and Volume Types',
      category: 'storage',
      description: 'Understand different volume types and their use cases',
      lastUpdated: '1 week ago',
      readTime: '15 min',
      hasPlayground: true,
      icon: HardDrive,
      content: {
        introduction: 'Volumes provide persistent storage for containers. Kubernetes supports many types of volumes, each with different characteristics and use cases.',
        sections: [
          {
            title: 'Common Volume Types',
            content: 'Different volume types serve different purposes: emptyDir for temporary storage, hostPath for node storage, and cloud provider volumes for persistent storage.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: volume-demo
spec:
  containers:
  - name: app
    image: nginx:1.20
    volumeMounts:
    - name: cache-volume
      mountPath: /cache
    - name: config-volume
      mountPath: /etc/config
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: cache-volume
    emptyDir: {}
  - name: config-volume
    configMap:
      name: app-config
  - name: secret-volume
    secret:
      secretName: app-secret`
          },
          {
            title: 'Projected Volumes',
            content: 'Projected volumes allow you to map several existing volume sources into the same directory.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: projected-volume-demo
spec:
  containers:
  - name: app
    image: nginx:1.20
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - configMap:
          name: myconfigmap
          items:
            - key: config
              path: my-group/my-config
      - serviceAccountToken:
          audience: api
          expirationSeconds: 3600
          path: token`
          }
        ]
      }
    },
    {
      id: 24,
      title: 'Probes and Health Checks',
      category: 'configuration',
      description: 'Configure liveness, readiness, and startup probes',
      lastUpdated: '3 days ago',
      readTime: '12 min',
      hasPlayground: true,
      icon: Activity,
      content: {
        introduction: 'Probes are used by the kubelet to know when to restart a container (liveness), when a container is ready to start accepting traffic (readiness), and when a container has started (startup).',
        sections: [
          {
            title: 'Configuring Probes',
            content: 'Different probe types serve different purposes in maintaining application health and availability.',
            codeExample: `apiVersion: v1
kind: Pod
metadata:
  name: probe-demo
spec:
  containers:
  - name: app
    image: nginx:1.20
    ports:
    - containerPort: 80
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      successThreshold: 1
      failureThreshold: 3
    startupProbe:
      httpGet:
        path: /startup
        port: 80
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 30`
          },
          {
            title: 'Probe Types',
            content: 'Kubernetes supports HTTP, TCP, and command-based probes for different scenarios.',
            codeExample: `# TCP Socket probe
livenessProbe:
  tcpSocket:
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20

# Command probe
livenessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5

# gRPC probe (Kubernetes 1.24+)
livenessProbe:
  grpc:
    port: 2379
  initialDelaySeconds: 10`
          }
        ]
      }
    },
    {
      id: 13,
      title: 'Resource Quotas and Limits',
      category: 'configuration',
      description: 'Manage resource consumption',
      lastUpdated: '6 days ago',
      readTime: '14 min',
      hasPlayground: true,
      icon: Settings,
      content: {
        introduction: 'Resource quotas provide constraints that limit aggregate resource consumption per namespace.',
        sections: [
          {
            title: 'Setting Resource Quotas',
            content: 'Resource quotas help prevent any single namespace from consuming all cluster resources.',
            codeExample: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: myproject
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    persistentvolumeclaims: "4"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-limit-range
  namespace: myproject
spec:
  limits:
  - default:
      memory: "512Mi"
      cpu: "500m"
    defaultRequest:
      memory: "256Mi"
      cpu: "250m"
    type: Container`
          }
        ]
      }
    },
    {
      id: 14,
      title: 'Custom Resource Definitions',
      category: 'basics',
      description: 'Extend Kubernetes with custom resources',
      lastUpdated: '1 week ago',
      readTime: '22 min',
      hasPlayground: true,
      icon: Workflow,
      content: {
        introduction: 'Custom Resource Definitions (CRDs) allow you to extend Kubernetes with your own resource types.',
        sections: [
          {
            title: 'Creating a CRD',
            content: 'CRDs enable you to create custom resources that behave like native Kubernetes resources.',
            codeExample: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              cronSpec:
                type: string
              image:
                type: string
              replicas:
                type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct`
          }
        ]
      }
    },
    {
      id: 15,
      title: 'Monitoring with Prometheus',
      category: 'basics',
      description: 'Monitor your Kubernetes cluster',
      lastUpdated: '3 days ago',
      readTime: '25 min',
      hasPlayground: true,
      icon: Monitor,
      content: {
        introduction: 'Prometheus is an open-source monitoring and alerting toolkit that is commonly used with Kubernetes.',
        sections: [
          {
            title: 'Setting up Prometheus',
            content: 'Prometheus can scrape metrics from your applications and Kubernetes components.',
            codeExample: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: example-app
  labels:
    team: frontend
spec:
  selector:
    matchLabels:
      app: example-app
  endpoints:
  - port: web
    interval: 30s
    path: /metrics
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: example-app-rules
spec:
  groups:
  - name: example-app
    rules:
    - alert: HighRequestLatency
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: High request latency`
          }
        ]
      }
    }
  ];

  const selectedDoc = docs.find(d => d.id === parseInt(selectedDocId || '0'));

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics': return 'text-blue-600 bg-blue-50';
      case 'architecture': return 'text-indigo-600 bg-indigo-50';
      case 'workloads': return 'text-orange-600 bg-orange-50';
      case 'networking': return 'text-emerald-600 bg-emerald-50';
      case 'storage': return 'text-purple-600 bg-purple-50';
      case 'configuration': return 'text-cyan-600 bg-cyan-50';
      case 'security': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const handleDocClick = (docId: number) => {
    setSearchParams({ doc: docId.toString() });
  };

  const handleBackToDocs = () => {
    setSearchParams({});
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const tryInPlayground = (code: string) => {
    const playgroundUrl = `/playground?yaml=${encodeURIComponent(code)}`;
    window.open(playgroundUrl, '_blank');
    toast.success('Opening in playground...');
  };

  if (selectedDoc) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDocs}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Documentation</span>
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <selectedDoc.icon className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{selectedDoc.title}</h1>
                  <p className="text-slate-600">{selectedDoc.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedDoc.category)}`}>
                {categories.find(c => c.id === selectedDoc.category)?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Introduction */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <p className="text-blue-900 text-lg leading-relaxed">
                  {selectedDoc.content.introduction}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {selectedDoc.content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">
                        {section.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {section.content}
                      </p>
                    </div>

                    {section.codeExample && (
                      <div className="border-t border-slate-200">
                        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between">
                          <h4 className="font-medium text-slate-900">Code Example</h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(section.codeExample!, `${index}-copy`)}
                              className="flex items-center space-x-1 px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                            >
                              {copiedCode === `${index}-copy` ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              <span className="text-sm">Copy</span>
                            </button>
                            <button
                              onClick={() => tryInPlayground(section.codeExample!)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>Try it</span>
                            </button>
                          </div>
                        </div>
                        <div className="h-64">
                          <Editor
                            height="100%"
                            defaultLanguage="yaml"
                            value={section.codeExample}
                            options={{
                              minimap: { enabled: false },
                              scrollBeyondLastLine: false,
                              fontSize: 13,
                              lineNumbers: 'on',
                              theme: 'vs-light',
                              wordWrap: 'on',
                              automaticLayout: true,
                              readOnly: true,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Documentation
          </h1>
          <p className="text-slate-600">
            Comprehensive guides and references for mastering Kubernetes
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{category.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocs.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleDocClick(doc.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(doc.category)}`}>
                        {categories.find(c => c.id === doc.category)?.label}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {doc.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>{doc.readTime} read</span>
                    <span>Updated {doc.lastUpdated}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.hasPlayground && (
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-xs">Interactive</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    <Code className="w-4 h-4" />
                    <span>Read Documentation</span>
                  </div>
                  {doc.hasPlayground && (
                    <div className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                      <PlayCircle className="w-4 h-4" />
                      <span>Try Interactive</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors ml-auto">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Reference */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Common Commands</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p>kubectl get pods</p>
                <p>kubectl describe service</p>
                <p>kubectl apply -f manifest.yaml</p>
                <p>kubectl logs pod-name</p>
                <p>kubectl exec -it pod-name -- /bin/bash</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resource Types</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Pod, Deployment, Service</p>
                <p>ConfigMap, Secret, PVC</p>
                <p>Ingress, NetworkPolicy</p>
                <p>StatefulSet, DaemonSet</p>
                <p>Job, CronJob, HPA</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Best Practices</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Use namespaces for organization</p>
                <p>Set resource limits and requests</p>
                <p>Implement health checks</p>
                <p>Use labels and selectors effectively</p>
                <p>Follow security best practices</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Documentation;