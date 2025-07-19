export interface YamlExample {
  id: string;
  title: string;
  description: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Production' | 'Specialized';
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  yaml: string;
  learningObjectives: string[];
  realWorldUseCase: string;
  estimatedTime: string;
}

export const yamlExamples: YamlExample[] = [
  {
    id: 'hello-world-app',
    title: 'Hello World App',
    description: 'Simple application with Pod, ConfigMap, and Service - perfect for beginners',
    category: 'Beginner',
    difficulty: 1,
    tags: ['pod', 'configmap', 'service', 'basic'],
    estimatedTime: '5 min',
    learningObjectives: [
      'Understand basic Pod configuration',
      'Learn how ConfigMaps inject environment variables',
      'Explore Service networking basics'
    ],
    realWorldUseCase: 'Simple web applications, microservices, development environments',
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: hello-config
data:
  MESSAGE: "Hello from Kubernetes!"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
        - name: hello-app
          image: busybox
          command: ["sh", "-c", "echo $MESSAGE && sleep 3600"]
          env:
            - name: MESSAGE
              valueFrom:
                configMapKeyRef:
                  name: hello-config
                  key: MESSAGE

---
apiVersion: v1
kind: Service
metadata:
  name: hello-service
spec:
  selector:
    app: hello
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080`
  },
  {
    id: 'fullstack-app',
    title: 'Fullstack App - Frontend + Backend + Database',
    description: 'Complete three-tier application with PostgreSQL, backend API, and frontend',
    category: 'Intermediate',
    difficulty: 3,
    tags: ['fullstack', 'database', 'statefulset', 'secrets', 'multi-tier'],
    estimatedTime: '15 min',
    learningObjectives: [
      'Learn StatefulSet for stateful applications',
      'Understand Secret management for sensitive data',
      'Explore multi-tier application architecture',
      'Practice service-to-service communication'
    ],
    realWorldUseCase: 'Web applications, e-commerce platforms, content management systems',
    yaml: `apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  POSTGRES_PASSWORD: cG9zdGdyZXM=  # "postgres"

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  selector:
    matchLabels:
      app: postgres
  serviceName: "postgres"
  replicas: 1
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:14
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-storage
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: myuser/backend-app
          ports:
            - containerPort: 5000
          env:
            - name: DB_HOST
              value: postgres
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: myuser/frontend-app
          ports:
            - containerPort: 3000
          env:
            - name: API_URL
              value: "http://backend-service:5000"

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 3000

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - port: 5000

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
    - port: 5432`
  },
  {
    id: 'ingress-autoscaling',
    title: 'Ingress + Autoscaling (HPA)',
    description: 'Production-ready setup with external access and automatic scaling',
    category: 'Advanced',
    difficulty: 4,
    tags: ['ingress', 'hpa', 'autoscaling', 'production', 'networking'],
    estimatedTime: '10 min',
    learningObjectives: [
      'Configure Ingress for external traffic routing',
      'Set up Horizontal Pod Autoscaler (HPA)',
      'Understand production networking patterns',
      'Learn resource-based scaling strategies'
    ],
    realWorldUseCase: 'Production web applications, API gateways, high-traffic services',
    yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50`
  },
  {
    id: 'cronjob-rbac',
    title: 'CronJob + RBAC + ServiceAccount',
    description: 'Scheduled tasks with proper security and role-based access control',
    category: 'Advanced',
    difficulty: 4,
    tags: ['cronjob', 'rbac', 'serviceaccount', 'security', 'scheduling'],
    estimatedTime: '12 min',
    learningObjectives: [
      'Configure CronJob for scheduled tasks',
      'Implement RBAC for security',
      'Create ServiceAccount with specific permissions',
      'Understand Kubernetes security model'
    ],
    realWorldUseCase: 'Backup jobs, data processing, maintenance tasks, cleanup operations',
    yaml: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: job-runner

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: job-role
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "delete"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: job-binding
subjects:
  - kind: ServiceAccount
    name: job-runner
roleRef:
  kind: Role
  name: job-role
  apiGroup: rbac.authorization.k8s.io

---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-cleanup
spec:
  schedule: "0 0 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: job-runner
          containers:
            - name: cleanup
              image: busybox
              command: ["sh", "-c", "echo Cleaning logs"]
          restartPolicy: OnFailure`
  },
  {
    id: 'daemonset-logging',
    title: 'DaemonSet for Log Collection',
    description: 'Deploy log collection agent on every node using DaemonSet',
    category: 'Specialized',
    difficulty: 3,
    tags: ['daemonset', 'logging', 'monitoring', 'node-level'],
    estimatedTime: '8 min',
    learningObjectives: [
      'Understand DaemonSet deployment pattern',
      'Learn node-level service deployment',
      'Configure resource limits for system services',
      'Explore volume mounting for host access'
    ],
    realWorldUseCase: 'Log collection, monitoring agents, security scanners, node maintenance',
    yaml: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-agent
spec:
  selector:
    matchLabels:
      name: log-agent
  template:
    metadata:
      labels:
        name: log-agent
    spec:
      containers:
        - name: fluentd
          image: fluent/fluentd:v1.16
          resources:
            limits:
              memory: "200Mi"
              cpu: "200m"
          volumeMounts:
            - name: varlog
              mountPath: /var/log
      volumes:
        - name: varlog
          hostPath:
            path: /var/log`
  },
  {
    id: 'network-policy',
    title: 'Network Policy - Security Isolation',
    description: 'Restrict network traffic between pods for enhanced security',
    category: 'Specialized',
    difficulty: 4,
    tags: ['networkpolicy', 'security', 'isolation', 'networking'],
    estimatedTime: '10 min',
    learningObjectives: [
      'Implement network-level security',
      'Control pod-to-pod communication',
      'Understand ingress/egress traffic rules',
      'Apply zero-trust networking principles'
    ],
    realWorldUseCase: 'Multi-tenant environments, compliance requirements, security hardening',
    yaml: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-except-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
  policyTypes:
    - Ingress`
  },
  {
    id: 'production-nodejs-stack',
    title: 'Production Node.js Stack',
    description: 'Complete production-ready architecture with frontend, backend, database, caching, and monitoring',
    category: 'Production',
    difficulty: 5,
    tags: ['production', 'nodejs', 'mongodb', 'redis', 'ingress', 'hpa', 'monitoring'],
    estimatedTime: '25 min',
    learningObjectives: [
      'Deploy production-grade multi-tier applications',
      'Configure persistent storage with StatefulSets',
      'Implement caching layer with Redis',
      'Set up comprehensive monitoring and health checks',
      'Apply security best practices with RBAC'
    ],
    realWorldUseCase: 'Enterprise web applications, e-commerce platforms, SaaS products',
    yaml: `# ConfigMap (App Config)
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: production
  PORT: "3000"

---
# Secret (DB Password)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: c2VjdXJlcGFzcw== # securepass

---
# MongoDB Deployment (Stateful)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: "mongo"
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:5
          ports:
            - containerPort: 27017
          volumeMounts:
            - mountPath: /data/db
              name: mongo-data
  volumeClaimTemplates:
    - metadata:
        name: mongo-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi

---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      tier: backend
  template:
    metadata:
      labels:
        tier: backend
    spec:
      containers:
        - name: backend
          image: myuser/backend:v1
          ports:
            - containerPort: 5000
          env:
            - name: DB_HOST
              value: mongodb
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DB_PASSWORD
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: NODE_ENV
          livenessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 5

---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
        - name: frontend
          image: myuser/frontend:v1
          ports:
            - containerPort: 80
          env:
            - name: API_URL
              value: http://backend-service:5000

---
# Redis (Caching)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:6
          ports:
            - containerPort: 6379

---
# Services
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    tier: backend
  ports:
    - port: 5000

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    tier: frontend
  ports:
    - port: 80

---
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  selector:
    app: mongo
  ports:
    - port: 27017

---
# Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: "myapp.com"
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

---
# HPA (Backend Scaling)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`
  },
  {
    id: 'crash-loop-backoff',
    title: 'CrashLoopBackoff & Recovery',
    description: 'Simulate container crashes and observe Kubernetes restart strategy',
    category: 'Specialized',
    difficulty: 3,
    tags: ['debugging', 'crashloop', 'restart-policy', 'troubleshooting'],
    estimatedTime: '8 min',
    learningObjectives: [
      'Understand CrashLoopBackoff behavior',
      'Learn about restart policies',
      'Practice debugging failed containers',
      'Observe exponential backoff strategy'
    ],
    realWorldUseCase: 'Debugging application failures, understanding container lifecycle',
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: crash-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: crash-app
  template:
    metadata:
      labels:
        app: crash-app
    spec:
      containers:
        - name: crash-container
          image: busybox
          # Intentionally incorrect command → crash
          command: ["sh", "-c", "exit 1"]
          livenessProbe:
            exec:
              command: ["sh", "-c", "echo ok"]
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 1`
  },
  {
    id: 'node-taint-toleration',
    title: 'Node Taint & Pod Toleration',
    description: 'Demonstrate scheduling behavior under node taints and tolerations',
    category: 'Advanced',
    difficulty: 4,
    tags: ['scheduling', 'taints', 'tolerations', 'node-affinity'],
    estimatedTime: '12 min',
    learningObjectives: [
      'Understand node taints and pod tolerations',
      'Learn advanced scheduling concepts',
      'Practice node-specific workload placement',
      'Explore cluster resource management'
    ],
    realWorldUseCase: 'Dedicated nodes for specific workloads, GPU nodes, compliance requirements',
    yaml: `apiVersion: v1
kind: Pod
metadata:
  name: tolerant-pod
spec:
  tolerations:
    - key: "critical"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  containers:
    - name: nginx
      image: nginx

---
apiVersion: v1
kind: Pod
metadata:
  name: regular-pod
spec:
  containers:
    - name: nginx
      image: nginx`
  },
  {
    id: 'rolling-update-rollback',
    title: 'Rolling Update & Rollback',
    description: 'Demonstrate deployment updates, failures, and automatic rollback',
    category: 'Intermediate',
    difficulty: 3,
    tags: ['deployment', 'rolling-update', 'rollback', 'versioning'],
    estimatedTime: '10 min',
    learningObjectives: [
      'Understand rolling update strategy',
      'Learn rollback mechanisms',
      'Practice deployment versioning',
      'Handle update failures gracefully'
    ],
    realWorldUseCase: 'Production deployments, zero-downtime updates, release management',
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: rollout-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: rollout-demo
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: rollout-demo
    spec:
      containers:
        - name: demo
          image: busybox:1
          command: ["sh", "-c", "echo Version1; sleep 3600"]`
  },
  {
    id: 'headless-service-statefulset',
    title: 'Headless Service + StatefulSet',
    description: 'Demonstrate headless services and StatefulSet pod discovery',
    category: 'Advanced',
    difficulty: 4,
    tags: ['statefulset', 'headless-service', 'dns', 'discovery'],
    estimatedTime: '15 min',
    learningObjectives: [
      'Understand headless services',
      'Learn StatefulSet networking',
      'Practice DNS-based service discovery',
      'Explore ordered pod deployment'
    ],
    realWorldUseCase: 'Databases, distributed systems, clustered applications',
    yaml: `apiVersion: v1
kind: Service
metadata:
  name: headless
spec:
  clusterIP: None
  selector:
    app: state-demo
  ports:
    - port: 80
      targetPort: 80

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: state-demo
spec:
  serviceName: "headless"
  replicas: 3
  selector:
    matchLabels:
      app: state-demo
  template:
    metadata:
      labels:
        app: state-demo
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10`
  },
  {
    id: 'init-containers',
    title: 'Init Containers',
    description: 'Use init containers for pre-start tasks like DB migration or setup',
    category: 'Intermediate',
    difficulty: 2,
    tags: ['init-containers', 'setup', 'migration', 'dependencies'],
    estimatedTime: '8 min',
    learningObjectives: [
      'Understand init container patterns',
      'Learn dependency management',
      'Practice setup and migration tasks',
      'Explore container lifecycle'
    ],
    realWorldUseCase: 'Database migrations, file setup, dependency waiting',
    yaml: `apiVersion: v1
kind: Pod
metadata:
  name: init-demo
spec:
  initContainers:
    - name: init-db
      image: busybox
      command: ['sh', '-c', 'echo Initializing DB... && sleep 5']
  containers:
    - name: app
      image: nginx
      ports:
        - containerPort: 80`
  },
  {
    id: 'pod-disruption-budget',
    title: 'Pod Disruption Budget',
    description: 'Prevent too many pod disruptions during maintenance',
    category: 'Production',
    difficulty: 4,
    tags: ['pdb', 'availability', 'maintenance', 'disruption'],
    estimatedTime: '10 min',
    learningObjectives: [
      'Understand Pod Disruption Budgets',
      'Learn availability guarantees',
      'Practice maintenance planning',
      'Explore cluster upgrade strategies'
    ],
    realWorldUseCase: 'Production maintenance, cluster upgrades, high availability',
    yaml: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pdb-backend
spec:
  minAvailable: 2
  selector:
    matchLabels:
      tier: backend

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: backend
  template:
    metadata:
      labels:
        tier: backend
    spec:
      containers:
        - name: backend
          image: nginx
          ports:
            - containerPort: 80`
  },
  {
    id: 'volume-types-demo',
    title: 'Volume Types (EmptyDir, ConfigMap, Secret)',
    description: 'Demonstrate different volume types and mounting strategies',
    category: 'Intermediate',
    difficulty: 3,
    tags: ['volumes', 'emptydir', 'configmap', 'secret', 'storage'],
    estimatedTime: '12 min',
    learningObjectives: [
      'Understand different volume types',
      'Learn volume mounting strategies',
      'Practice configuration injection',
      'Explore temporary storage patterns'
    ],
    realWorldUseCase: 'Configuration management, temporary storage, secret injection',
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  config.json: |
    {
      "database": "postgresql://localhost:5432/myapp",
      "debug": true
    }

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  password: cGFzc3dvcmQ=  # password

---
apiVersion: v1
kind: Pod
metadata:
  name: volume-demo
spec:
  volumes:
    - name: tmp-volume
      emptyDir: {}
    - name: config-volume
      configMap:
        name: app-config
    - name: secret-volume
      secret:
        secretName: app-secret
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - mountPath: /tmp/cache
          name: tmp-volume
        - mountPath: /etc/config
          name: config-volume
        - mountPath: /etc/secrets
          name: secret-volume
          readOnly: true`
  },
  {
    id: 'ingress-tls-cert-manager',
    title: 'Ingress with TLS + Cert-Manager',
    description: 'Set up HTTPS with automatic certificate management',
    category: 'Production',
    difficulty: 5,
    tags: ['ingress', 'tls', 'cert-manager', 'https', 'security'],
    estimatedTime: '20 min',
    learningObjectives: [
      'Configure TLS termination',
      'Understand certificate management',
      'Learn HTTPS best practices',
      'Practice production security'
    ],
    realWorldUseCase: 'Production web applications, secure APIs, compliance requirements',
    yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  tls:
    - hosts:
        - app.example.com
      secretName: tls-secret
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: nginx
          ports:
            - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80`
  },
  {
    id: 'resource-quota-limits',
    title: 'ResourceQuota + LimitRange',
    description: 'Control resource usage with quotas and limits',
    category: 'Production',
    difficulty: 4,
    tags: ['resourcequota', 'limitrange', 'resources', 'governance'],
    estimatedTime: '15 min',
    learningObjectives: [
      'Understand resource governance',
      'Learn quota management',
      'Practice resource limits',
      'Explore multi-tenancy patterns'
    ],
    realWorldUseCase: 'Multi-tenant clusters, cost control, resource management',
    yaml: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
spec:
  hard:
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
    persistentvolumeclaims: "4"

---
apiVersion: v1
kind: LimitRange
metadata:
  name: container-limits
spec:
  limits:
    - default:
        cpu: "500m"
        memory: "256Mi"
      defaultRequest:
        cpu: "250m"
        memory: "128Mi"
      type: Container`
  },
  {
    id: 'multi-environment-namespaces',
    title: 'Multi-Environment with Namespaces (Dev/Prod)',
    description: 'Complete CI/CD setup with separate dev and production environments using namespaces',
    category: 'Production',
    difficulty: 4,
    tags: ['namespaces', 'multi-environment', 'cicd', 'secrets', 'production'],
    estimatedTime: '18 min',
    learningObjectives: [
      'Understand namespace-based environment separation',
      'Learn CI/CD secret management',
      'Practice multi-environment deployment strategies',
      'Explore production vs development configurations',
      'Understand image pull secrets and registry integration'
    ],
    realWorldUseCase: 'Enterprise applications, CI/CD pipelines, environment isolation, production deployments',
    yaml: `# Define Namespaces
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Namespace
metadata:
  name: prod

# ========== DEV NAMESPACE ==========

---
# CI/CD Secret for dev (DockerHub or ECR)
apiVersion: v1
kind: Secret
metadata:
  name: dev-regcred
  namespace: dev
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <BASE64_ENCODED_DOCKER_CONFIG>

---
# Deployment for dev
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-app
  namespace: dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: dev-app
  template:
    metadata:
      labels:
        app: dev-app
    spec:
      containers:
      - name: dev-container
        image: devregistry.example.com/dev-app:latest
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: dev-regcred

---
# Service for dev
apiVersion: v1
kind: Service
metadata:
  name: dev-service
  namespace: dev
spec:
  selector:
    app: dev-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP

# ========== PROD NAMESPACE ==========

---
# CI/CD Secret for prod
apiVersion: v1
kind: Secret
metadata:
  name: prod-regcred
  namespace: prod
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <BASE64_ENCODED_DOCKER_CONFIG>

---
# Deployment for prod
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prod-app
  namespace: prod
spec:
  replicas: 4
  selector:
    matchLabels:
      app: prod-app
  template:
    metadata:
      labels:
        app: prod-app
    spec:
      containers:
      - name: prod-container
        image: prodregistry.example.com/prod-app:stable
        ports:
        - containerPort: 8080
      imagePullSecrets:
      - name: prod-regcred

---
# Service for prod
apiVersion: v1
kind: Service
metadata:
  name: prod-service
  namespace: prod
spec:
  selector:
    app: prod-app
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: LoadBalancer`
  },
  {
    id: 'nodejs-mongodb-complete',
    title: 'Node.js App with MongoDB (Complete Stack)',
    description: 'Full-stack Node.js application with MongoDB, ConfigMap, Secret, and PVC',
    category: 'Production',
    difficulty: 4,
    tags: ['nodejs', 'mongodb', 'configmap', 'secret', 'pvc', 'fullstack'],
    estimatedTime: '20 min',
    learningObjectives: [
      'Build complete application stack',
      'Understand persistent storage with PVC',
      'Learn configuration and secret management',
      'Practice namespace organization',
      'Explore volume mounting strategies'
    ],
    realWorldUseCase: 'Production web applications, content management systems, API backends',
    yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: node-mongo-app
---
# ConfigMap for app environment
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: node-mongo-app
data:
  NODE_ENV: production
  PORT: "3000"
---
# Secret for DB credentials
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: node-mongo-app
type: Opaque
stringData:
  DB_USER: myuser
  DB_PASS: mypass
---
# Persistent Volume Claim for MongoDB
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc
  namespace: node-mongo-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
# MongoDB Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: node-mongo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongo
          image: mongo:5
          ports:
            - containerPort: 27017
          volumeMounts:
            - mountPath: /data/db
              name: mongo-storage
      volumes:
        - name: mongo-storage
          persistentVolumeClaim:
            claimName: mongo-pvc
---
# Node.js App Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
  namespace: node-mongo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
        - name: node
          image: yourregistry/node-app:latest
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: db-secret
---
# Service for Node.js App
apiVersion: v1
kind: Service
metadata:
  name: node-service
  namespace: node-mongo-app
spec:
  selector:
    app: node-app
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP`
  },
  {
    id: 'microservices-ecommerce',
    title: 'Microservices E-commerce with Redis & PostgreSQL',
    description: 'Complete microservices architecture with Redis cache, PostgreSQL database, and Ingress',
    category: 'Production',
    difficulty: 5,
    tags: ['microservices', 'redis', 'postgresql', 'ingress', 'tls', 'ecommerce'],
    estimatedTime: '25 min',
    learningObjectives: [
      'Design microservices architecture',
      'Implement caching layer with Redis',
      'Configure PostgreSQL database',
      'Set up TLS termination with Ingress',
      'Understand service mesh patterns'
    ],
    realWorldUseCase: 'E-commerce platforms, large-scale web applications, distributed systems',
    yaml: `# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce

---
# Database Secret
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: ecommerce
type: Opaque
stringData:
  user: postgres
  password: secretpassword

---
# Redis Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7
          ports:
            - containerPort: 6379
---
# Redis Service
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: ecommerce
spec:
  selector:
    app: redis
  ports:
    - port: 6379

---
# PostgreSQL Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:14
          env:
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: user
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
          ports:
            - containerPort: 5432
---
# PostgreSQL Service
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: ecommerce
spec:
  selector:
    app: postgres
  ports:
    - port: 5432

---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-api
  template:
    metadata:
      labels:
        app: backend-api
    spec:
      containers:
        - name: api
          image: myregistry/backend-api:latest
          ports:
            - containerPort: 4000
---
# Backend API Service
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: ecommerce
spec:
  selector:
    app: backend-api
  ports:
    - port: 4000

---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-app
  namespace: ecommerce
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: myregistry/frontend:latest
          ports:
            - containerPort: 80

---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: ecommerce
spec:
  selector:
    app: frontend
  ports:
    - port: 80

---
# Ingress with TLS
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
    - hosts:
        - shop.example.com
      secretName: tls-secret
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80`
  },
  {
    id: 'ml-inference-gpu',
    title: 'ML Inference with GPU + Auto-Scaling',
    description: 'Machine learning model serving with GPU resources and horizontal pod autoscaling',
    category: 'Specialized',
    difficulty: 5,
    tags: ['ml', 'gpu', 'inference', 'autoscaling', 'ai', 'nvidia'],
    estimatedTime: '15 min',
    learningObjectives: [
      'Configure GPU resources in Kubernetes',
      'Set up ML model serving infrastructure',
      'Implement autoscaling for AI workloads',
      'Understand resource limits for GPU',
      'Learn specialized workload patterns'
    ],
    realWorldUseCase: 'AI model serving, image recognition, LLM inference, computer vision',
    yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: ml

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-inference
  namespace: ml
spec:
  replicas: 1
  selector:
    matchLabels:
      app: inference
  template:
    metadata:
      labels:
        app: inference
    spec:
      containers:
        - name: model-server
          image: myregistry/inference:latest
          ports:
            - containerPort: 5000
          resources:
            limits:
              nvidia.com/gpu: 1
              memory: "4Gi"
              cpu: "2"
            requests:
              memory: "2Gi"
              cpu: "1"
---
# Inference Service
apiVersion: v1
kind: Service
metadata:
  name: inference-service
  namespace: ml
spec:
  selector:
    app: inference
  ports:
    - port: 80
      targetPort: 5000
---
# Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: inference-hpa
  namespace: ml
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-inference
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75`
  },
  {
    id: 'event-driven-kafka',
    title: 'Event-Driven Architecture with Kafka + Workers',
    description: 'Streaming pipeline with Kafka message broker and worker consumers',
    category: 'Advanced',
    difficulty: 4,
    tags: ['kafka', 'events', 'streaming', 'workers', 'mongodb', 'microservices'],
    estimatedTime: '20 min',
    learningObjectives: [
      'Understand event-driven architecture',
      'Configure Kafka message broker',
      'Implement worker consumer patterns',
      'Learn streaming data processing',
      'Practice asynchronous communication'
    ],
    realWorldUseCase: 'Analytics pipelines, real-time processing, event sourcing, IoT data streams',
    yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: events

---
# Kafka Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kafka
  namespace: events
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
        - name: kafka
          image: bitnami/kafka:latest
          ports:
            - containerPort: 9092
          env:
            - name: KAFKA_ENABLE_KRAFT
              value: "yes"
            - name: KAFKA_CFG_PROCESS_ROLES
              value: "broker,controller"
            - name: KAFKA_CFG_CONTROLLER_LISTENER_NAMES
              value: "CONTROLLER"

---
# Kafka Service
apiVersion: v1
kind: Service
metadata:
  name: kafka
  namespace: events
spec:
  selector:
    app: kafka
  ports:
    - port: 9092

---
# MongoDB Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
  namespace: events
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:5
          ports:
            - containerPort: 27017

---
# MongoDB Service
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: events
spec:
  selector:
    app: mongo
  ports:
    - port: 27017

---
# Worker that consumes from Kafka and writes to MongoDB
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: events
spec:
  replicas: 2
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
    spec:
      containers:
        - name: worker
          image: myregistry/event-worker:latest
          env:
            - name: KAFKA_BROKER
              value: kafka:9092
            - name: MONGO_URI
              value: mongodb://mongo:27017/data`
  },
  {
    id: 'cronjob-s3-backup',
    title: 'Daily Database Backup to AWS S3',
    description: 'Automated daily backup job using CronJob with AWS S3 integration',
    category: 'Production',
    difficulty: 3,
    tags: ['cronjob', 'backup', 'aws', 's3', 'automation', 'scheduling'],
    estimatedTime: '12 min',
    learningObjectives: [
      'Configure CronJob for scheduled tasks',
      'Integrate with AWS S3 for backups',
      'Manage AWS credentials securely',
      'Understand backup automation patterns',
      'Learn cron scheduling syntax'
    ],
    realWorldUseCase: 'Database backups, log archival, data synchronization, maintenance tasks',
    yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: prod

---
# AWS Credentials Secret
apiVersion: v1
kind: Secret
metadata:
  name: aws-creds
  namespace: prod
type: Opaque
stringData:
  access_key: YOUR_AWS_ACCESS_KEY
  secret_key: YOUR_AWS_SECRET_KEY

---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-db-backup
  namespace: prod
spec:
  schedule: "0 2 * * *"  # every day at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: s3-backup
            image: amazon/aws-cli
            command: ["/bin/sh", "-c"]
            args:
              - aws s3 cp /backup/db.sql s3://mybucket/backups/$(date +\\%F).sql
            env:
              - name: AWS_ACCESS_KEY_ID
                valueFrom:
                  secretKeyRef:
                    name: aws-creds
                    key: access_key
              - name: AWS_SECRET_ACCESS_KEY
                valueFrom:
                  secretKeyRef:
                    name: aws-creds
                    key: secret_key
          restartPolicy: OnFailure`
  },
  {
    id: 'simple-hpa-example',
    title: 'Horizontal Pod Autoscaler (HPA)',
    description: 'CPU-based autoscaling for API deployment with configurable thresholds',
    category: 'Intermediate',
    difficulty: 3,
    tags: ['hpa', 'autoscaling', 'cpu', 'performance', 'scaling'],
    estimatedTime: '10 min',
    learningObjectives: [
      'Configure Horizontal Pod Autoscaler',
      'Set CPU utilization thresholds',
      'Understand scaling policies',
      'Learn resource-based scaling',
      'Practice performance optimization'
    ],
    realWorldUseCase: 'API services, web applications, variable load handling, cost optimization',
    yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: staging

---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: myregistry/api:latest
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi

---
# API Service
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: staging
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: staging
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60`
  }
];
