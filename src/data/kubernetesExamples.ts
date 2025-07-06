export interface KubernetesExample {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced' | 'production';
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
      componentType: string;
      label: string;
      status: string;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
  }>;
  yaml: string;
  learningObjectives: string[];
  realWorldUseCase: string;
}

export const kubernetesExamples: KubernetesExample[] = [
  {
    id: 'simple-web-app',
    title: 'Simple Web Application',
    description: 'A basic web application with a Pod, Service, and Ingress for external access.',
    category: 'basic',
    difficulty: 1,
    tags: ['web', 'basic', 'pod', 'service', 'ingress'],
    nodes: [
      {
        id: 'pod-1',
        type: 'kubernetes',
        position: { x: 200, y: 200 },
        data: {
          componentType: 'pod',
          label: 'web-app',
          status: 'running'
        }
      },
      {
        id: 'service-1',
        type: 'kubernetes',
        position: { x: 400, y: 200 },
        data: {
          componentType: 'service',
          label: 'web-service',
          status: 'running'
        }
      },
      {
        id: 'ingress-1',
        type: 'kubernetes',
        position: { x: 600, y: 200 },
        data: {
          componentType: 'ingress',
          label: 'web-ingress',
          status: 'running'
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'service-1',
        target: 'pod-1',
        type: 'default'
      },
      {
        id: 'e2-3',
        source: 'ingress-1',
        target: 'service-1',
        type: 'default'
      }
    ],
    yaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
    learningObjectives: [
      'Understand the basic Pod-Service-Ingress pattern',
      'Learn how to expose applications externally',
      'Practice connecting Kubernetes resources'
    ],
    realWorldUseCase: 'Perfect for hosting a simple website or landing page that needs to be accessible from the internet.'
  },
  {
    id: 'scalable-deployment',
    title: 'Scalable Web Application',
    description: 'A production-ready deployment with multiple replicas, ConfigMap, and proper resource management.',
    category: 'intermediate',
    difficulty: 3,
    tags: ['deployment', 'configmap', 'scaling', 'production'],
    nodes: [
      {
        id: 'deployment-1',
        type: 'kubernetes',
        position: { x: 200, y: 200 },
        data: {
          componentType: 'deployment',
          label: 'web-deployment',
          status: 'running'
        }
      },
      {
        id: 'service-1',
        type: 'kubernetes',
        position: { x: 400, y: 200 },
        data: {
          componentType: 'service',
          label: 'web-service',
          status: 'running'
        }
      },
      {
        id: 'configmap-1',
        type: 'kubernetes',
        position: { x: 200, y: 100 },
        data: {
          componentType: 'configmap',
          label: 'app-config',
          status: 'running'
        }
      },
      {
        id: 'ingress-1',
        type: 'kubernetes',
        position: { x: 600, y: 200 },
        data: {
          componentType: 'ingress',
          label: 'web-ingress',
          status: 'running'
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'service-1',
        target: 'deployment-1',
        type: 'default'
      },
      {
        id: 'e3-1',
        source: 'deployment-1',
        target: 'configmap-1',
        type: 'default'
      },
      {
        id: 'e2-4',
        source: 'ingress-1',
        target: 'service-1',
        type: 'default'
      }
    ],
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://db:5432/myapp"
  log_level: "info"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:1.21
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: app-config
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
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
    learningObjectives: [
      'Learn about Deployments vs Pods for production workloads',
      'Understand how to use ConfigMaps for configuration',
      'Practice setting resource limits and health checks',
      'Learn about scaling applications'
    ],
    realWorldUseCase: 'Ideal for production web applications that need high availability, proper configuration management, and resource control.'
  },
  {
    id: 'database-app',
    title: 'Stateful Database Application',
    description: 'A complete database setup with StatefulSet, persistent storage, and secrets management.',
    category: 'advanced',
    difficulty: 4,
    tags: ['statefulset', 'database', 'pvc', 'secrets', 'storage'],
    nodes: [
      {
        id: 'statefulset-1',
        type: 'kubernetes',
        position: { x: 300, y: 200 },
        data: {
          componentType: 'statefulset',
          label: 'postgres-db',
          status: 'running'
        }
      },
      {
        id: 'service-1',
        type: 'kubernetes',
        position: { x: 500, y: 200 },
        data: {
          componentType: 'service',
          label: 'postgres-service',
          status: 'running'
        }
      },
      {
        id: 'pvc-1',
        type: 'kubernetes',
        position: { x: 300, y: 350 },
        data: {
          componentType: 'pvc',
          label: 'postgres-storage',
          status: 'running'
        }
      },
      {
        id: 'secret-1',
        type: 'kubernetes',
        position: { x: 100, y: 200 },
        data: {
          componentType: 'secret',
          label: 'postgres-secret',
          status: 'running'
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'service-1',
        target: 'statefulset-1',
        type: 'default'
      },
      {
        id: 'e1-3',
        source: 'statefulset-1',
        target: 'pvc-1',
        type: 'default'
      },
      {
        id: 'e4-1',
        source: 'statefulset-1',
        target: 'secret-1',
        type: 'default'
      }
    ],
    yaml: `apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  username: cG9zdGdyZXM=  # postgres
  password: cGFzc3dvcmQxMjM=  # password123
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-db
spec:
  serviceName: postgres-service
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
        image: postgres:13
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: POSTGRES_DB
          value: myapp
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP`,
    learningObjectives: [
      'Understand StatefulSets for stateful applications',
      'Learn about persistent storage with PVCs',
      'Practice secrets management for sensitive data',
      'Understand database deployment patterns'
    ],
    realWorldUseCase: 'Essential pattern for deploying databases like PostgreSQL, MySQL, or MongoDB in Kubernetes with data persistence and security.'
  },
  {
    id: 'microservices-app',
    title: 'Microservices Architecture',
    description: 'A complete microservices setup with frontend, backend, database, and service mesh communication.',
    category: 'production',
    difficulty: 5,
    tags: ['microservices', 'production', 'service-mesh', 'multi-tier'],
    nodes: [
      {
        id: 'frontend-deployment',
        type: 'kubernetes',
        position: { x: 100, y: 100 },
        data: {
          componentType: 'deployment',
          label: 'frontend',
          status: 'running'
        }
      },
      {
        id: 'frontend-service',
        type: 'kubernetes',
        position: { x: 300, y: 100 },
        data: {
          componentType: 'service',
          label: 'frontend-svc',
          status: 'running'
        }
      },
      {
        id: 'api-deployment',
        type: 'kubernetes',
        position: { x: 100, y: 250 },
        data: {
          componentType: 'deployment',
          label: 'api-server',
          status: 'running'
        }
      },
      {
        id: 'api-service',
        type: 'kubernetes',
        position: { x: 300, y: 250 },
        data: {
          componentType: 'service',
          label: 'api-svc',
          status: 'running'
        }
      },
      {
        id: 'database-statefulset',
        type: 'kubernetes',
        position: { x: 100, y: 400 },
        data: {
          componentType: 'statefulset',
          label: 'database',
          status: 'running'
        }
      },
      {
        id: 'database-service',
        type: 'kubernetes',
        position: { x: 300, y: 400 },
        data: {
          componentType: 'service',
          label: 'db-svc',
          status: 'running'
        }
      },
      {
        id: 'ingress',
        type: 'kubernetes',
        position: { x: 500, y: 175 },
        data: {
          componentType: 'ingress',
          label: 'app-ingress',
          status: 'running'
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'frontend-service',
        target: 'frontend-deployment',
        type: 'default'
      },
      {
        id: 'e2',
        source: 'api-service',
        target: 'api-deployment',
        type: 'default'
      },
      {
        id: 'e3',
        source: 'database-service',
        target: 'database-statefulset',
        type: 'default'
      },
      {
        id: 'e4',
        source: 'ingress',
        target: 'frontend-service',
        type: 'default'
      },
      {
        id: 'e5',
        source: 'ingress',
        target: 'api-service',
        type: 'default'
      },
      {
        id: 'e6',
        source: 'api-deployment',
        target: 'database-service',
        type: 'default'
      }
    ],
    yaml: `# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
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
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
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
        image: node:16-alpine
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: "postgresql://db-svc:5432/myapp"
        resources:
          requests:
            memory: "128Mi"
            cpu: "200m"
          limits:
            memory: "256Mi"
            cpu: "500m"
---
# API Service
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  selector:
    app: api
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
---
# Database StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: db-svc
  replicas: 1
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: postgres
        image: postgres:13
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: myapp
        - name: POSTGRES_USER
          value: admin
        - name: POSTGRES_PASSWORD
          value: password123
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
---
# Database Service
apiVersion: v1
kind: Service
metadata:
  name: db-svc
spec:
  selector:
    app: database
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
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
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 3000`,
    learningObjectives: [
      'Understand microservices architecture patterns',
      'Learn about service-to-service communication',
      'Practice multi-tier application deployment',
      'Understand ingress routing for different services',
      'Learn about resource management in complex applications'
    ],
    realWorldUseCase: 'Perfect for modern web applications with separate frontend, backend API, and database tiers. Common in e-commerce, SaaS platforms, and enterprise applications.'
  }
];

export const getExamplesByCategory = (category: string) => {
  return kubernetesExamples.filter(example => example.category === category);
};

export const getExamplesByDifficulty = (difficulty: number) => {
  return kubernetesExamples.filter(example => example.difficulty === difficulty);
};

export const searchExamples = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return kubernetesExamples.filter(example => 
    example.title.toLowerCase().includes(lowercaseQuery) ||
    example.description.toLowerCase().includes(lowercaseQuery) ||
    example.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
