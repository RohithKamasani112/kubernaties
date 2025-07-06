export interface PerfectDesign {
  id: string;
  title: string;
  description: string;
  category: 'Basic' | 'Intermediate' | 'Advanced' | 'Production';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  architecture: {
    components: string[];
    flow: string[];
    diagram: string; // SVG or component description
  };
  animation: {
    description: string;
    steps: string[];
    trafficFlow: string;
  };
  concepts: string[];
  problems: string[];
  yaml: string;
  learningObjectives: string[];
  realWorldUseCase: string;
  troubleshooting: {
    commonIssues: string[];
    debuggingSteps: string[];
  };
}

export const perfectDesigns: PerfectDesign[] = [
  {
    id: 'single-pod-static-website',
    title: 'Single Pod Running a Static Website',
    description: 'Simple NGINX pod serving static HTML content',
    category: 'Basic',
    difficulty: 1,
    estimatedTime: '5 min',
    architecture: {
      components: ['1 Pod', 'NGINX Container', 'Port 80'],
      flow: ['User Request', 'Pod', 'NGINX', 'Static HTML Response'],
      diagram: 'single-pod'
    },
    animation: {
      description: 'User sends HTTP request → Hits Pod → Returns static HTML',
      steps: [
        'HTTP request arrives at pod',
        'NGINX processes request',
        'Static HTML content returned',
        'Response sent back to user'
      ],
      trafficFlow: 'External → Pod:80 → NGINX → HTML'
    },
    concepts: ['Pod', 'Container', 'Port', 'NGINX'],
    problems: ['Pod crash → website down', 'No high availability', 'Single point of failure'],
    yaml: `apiVersion: v1
kind: Pod
metadata:
  name: static-website
  labels:
    app: website
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    volumeMounts:
    - name: html-content
      mountPath: /usr/share/nginx/html
  volumes:
  - name: html-content
    configMap:
      name: website-content
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: website-content
data:
  index.html: |
    <!DOCTYPE html>
    <html>
    <head>
        <title>My Static Website</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to My Static Website</h1>
            <p>This is a simple static website running on Kubernetes!</p>
            <p>Served by NGINX in a Pod.</p>
        </div>
    </body>
    </html>`,
    learningObjectives: [
      'Understand basic Pod structure',
      'Learn container port configuration',
      'Practice ConfigMap for static content',
      'Observe pod lifecycle'
    ],
    realWorldUseCase: 'Documentation sites, landing pages, static marketing websites',
    troubleshooting: {
      commonIssues: [
        'Pod stuck in Pending state',
        'Container fails to start',
        'Cannot access website'
      ],
      debuggingSteps: [
        'kubectl get pods',
        'kubectl describe pod static-website',
        'kubectl logs static-website',
        'kubectl port-forward pod/static-website 8080:80'
      ]
    }
  },
  {
    id: 'pod-nodeport-service',
    title: 'Pod Exposed via NodePort Service',
    description: 'NGINX Pod accessible from outside cluster via NodePort',
    category: 'Basic',
    difficulty: 2,
    estimatedTime: '8 min',
    architecture: {
      components: ['NGINX Pod', 'NodePort Service', 'Node Network'],
      flow: ['Browser Request', 'Node IP:NodePort', 'Service', 'Pod'],
      diagram: 'nodeport-service'
    },
    animation: {
      description: 'Request from browser → NodePort → Pod',
      steps: [
        'External request hits node IP on NodePort',
        'Service receives request',
        'Service forwards to pod',
        'Pod processes and responds'
      ],
      trafficFlow: 'External:NodePort → Service → Pod:80'
    },
    concepts: ['Services', 'NodePort', 'Node Networking', 'External Access'],
    problems: ['Wrong port in service = no access', 'NodePort range limitations', 'Security exposure'],
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 1
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
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080  # Accessible on any node at port 30080`,
    learningObjectives: [
      'Understand Service types',
      'Learn NodePort networking',
      'Practice external access patterns',
      'Debug service connectivity'
    ],
    realWorldUseCase: 'Development environments, quick external access, testing',
    troubleshooting: {
      commonIssues: [
        'Service not routing to pod',
        'NodePort not accessible',
        'Wrong target port configuration'
      ],
      debuggingSteps: [
        'kubectl get svc',
        'kubectl describe svc nginx-nodeport',
        'kubectl get endpoints',
        'curl <node-ip>:30080'
      ]
    }
  },
  {
    id: 'multiple-pods-load-balanced',
    title: 'Multiple Pods Load Balanced by ClusterIP',
    description: '3 replicas behind ClusterIP Service for internal load balancing',
    category: 'Basic',
    difficulty: 2,
    estimatedTime: '10 min',
    architecture: {
      components: ['3 NGINX Pods', 'ClusterIP Service', 'Load Balancer'],
      flow: ['Internal Request', 'ClusterIP Service', 'Round Robin', 'Available Pods'],
      diagram: 'clusterip-loadbalancer'
    },
    animation: {
      description: 'Requests distributed to all pods',
      steps: [
        'Request arrives at ClusterIP',
        'Service selects healthy pod',
        'Traffic distributed round-robin',
        'Response returned via service'
      ],
      trafficFlow: 'Internal → ClusterIP → Pod1|Pod2|Pod3'
    },
    concepts: ['Deployments', 'Replicas', 'Internal Services', 'Load Balancing'],
    problems: ['One Pod down — still works', 'Service discovery', 'Health checking'],
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80`,
    learningObjectives: [
      'Understand deployment scaling',
      'Learn ClusterIP service behavior',
      'Practice readiness probes',
      'Observe load balancing'
    ],
    realWorldUseCase: 'Internal microservices, API backends, database connections',
    troubleshooting: {
      commonIssues: [
        'Pods not receiving traffic',
        'Uneven load distribution',
        'Service endpoints missing'
      ],
      debuggingSteps: [
        'kubectl get pods -l app=web',
        'kubectl get endpoints web-service',
        'kubectl exec -it <pod> -- curl web-service',
        'kubectl describe svc web-service'
      ]
    }
  },
  {
    id: 'frontend-backend-services',
    title: 'Frontend + Backend (2 Services)',
    description: 'React frontend communicating with Flask backend via internal DNS',
    category: 'Intermediate',
    difficulty: 3,
    estimatedTime: '15 min',
    architecture: {
      components: ['React Frontend Pod', 'Flask Backend Pod', '2 ClusterIP Services', 'Internal DNS'],
      flow: ['User', 'Frontend Service', 'Frontend Pod', 'Backend Service', 'Backend Pod'],
      diagram: 'frontend-backend'
    },
    animation: {
      description: 'User → Frontend → Backend API',
      steps: [
        'User accesses frontend',
        'Frontend makes API call to backend service',
        'DNS resolves backend service name',
        'Backend processes request and responds'
      ],
      trafficFlow: 'External → Frontend Service → Backend Service → Database'
    },
    concepts: ['Multi-tier app', 'DNS inside cluster', 'Service Discovery', 'API Communication'],
    problems: ['Wrong Service name → 500 errors', 'CORS issues', 'Network policies blocking traffic'],
    yaml: `# Frontend Deployment
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
      - name: react-app
        image: nginx:latest
        ports:
        - containerPort: 80
        env:
        - name: BACKEND_URL
          value: "http://backend-service:5000"
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: flask-app
        image: python:3.9-slim
        ports:
        - containerPort: 5000
        command: ["python", "-c"]
        args:
        - |
          from flask import Flask, jsonify
          from flask_cors import CORS
          app = Flask(__name__)
          CORS(app)
          @app.route('/api/health')
          def health():
              return jsonify({'status': 'healthy', 'service': 'backend'})
          @app.route('/api/data')
          def data():
              return jsonify({'message': 'Hello from backend!', 'data': [1,2,3,4,5]})
          app.run(host='0.0.0.0', port=5000)
---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
---
# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - port: 5000
    targetPort: 5000`,
    learningObjectives: [
      'Understand multi-tier architecture',
      'Learn internal service communication',
      'Practice environment variable configuration',
      'Debug cross-service connectivity'
    ],
    realWorldUseCase: 'Web applications, microservices architecture, API-driven apps',
    troubleshooting: {
      commonIssues: [
        'Frontend cannot reach backend',
        'CORS errors in browser',
        'Service name resolution fails'
      ],
      debuggingSteps: [
        'kubectl exec -it frontend-pod -- curl backend-service:5000/api/health',
        'kubectl get svc',
        'kubectl logs backend-pod',
        'nslookup backend-service'
      ]
    }
  },
  {
    id: 'pod-persistent-volume',
    title: 'Pod with PersistentVolume',
    description: 'Application pod with persistent storage for data retention',
    category: 'Intermediate',
    difficulty: 3,
    estimatedTime: '12 min',
    architecture: {
      components: ['App Pod', 'PVC', 'PV', 'Storage Backend'],
      flow: ['Pod', 'Volume Mount', 'PVC', 'PV', 'Physical Storage'],
      diagram: 'persistent-volume'
    },
    animation: {
      description: 'Writes logs or DB files to volume',
      steps: [
        'Pod writes data to mounted path',
        'Data persists in PVC',
        'PVC bound to PV',
        'Data survives pod restarts'
      ],
      trafficFlow: 'Pod → /data → PVC → PV → Storage'
    },
    concepts: ['PVC', 'PV', 'StorageClasses', 'Data Persistence'],
    problems: ['PV mismatch = Pod stuck pending', 'Storage class issues', 'Access mode conflicts'],
    yaml: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: data-app
  template:
    metadata:
      labels:
        app: data-app
    spec:
      containers:
      - name: app
        image: busybox:latest
        command: ['sh', '-c']
        args:
        - |
          while true; do
            echo "$(date): Writing to persistent storage" >> /data/app.log
            echo "Data written to /data/app.log"
            sleep 30
          done
        volumeMounts:
        - name: data-volume
          mountPath: /data
      volumes:
      - name: data-volume
        persistentVolumeClaim:
          claimName: app-data-pvc`,
    learningObjectives: [
      'Understand persistent storage concepts',
      'Learn PVC and PV relationship',
      'Practice volume mounting',
      'Debug storage issues'
    ],
    realWorldUseCase: 'Databases, file storage, log retention, stateful applications',
    troubleshooting: {
      commonIssues: [
        'Pod stuck in Pending due to PVC',
        'Volume mount permission errors',
        'Storage class not found'
      ],
      debuggingSteps: [
        'kubectl get pvc',
        'kubectl describe pvc app-data-pvc',
        'kubectl get pv',
        'kubectl exec -it pod -- ls -la /data'
      ]
    }
  },
  {
    id: 'configmap-injection',
    title: 'Pod with ConfigMap Injection',
    description: 'Pod loads configuration via environment variables from ConfigMap',
    category: 'Basic',
    difficulty: 2,
    estimatedTime: '8 min',
    architecture: {
      components: ['ConfigMap', 'Pod', 'Environment Variables'],
      flow: ['ConfigMap Data', 'Environment Variables', 'Pod Container'],
      diagram: 'configmap-env'
    },
    animation: {
      description: 'User modifies configMap → Pod uses new config',
      steps: [
        'ConfigMap contains configuration data',
        'Pod references ConfigMap keys as env vars',
        'Container starts with injected config',
        'App reads config from environment'
      ],
      trafficFlow: 'ConfigMap → ENV → Container → Application'
    },
    concepts: ['ConfigMaps', 'Environment Variables', 'Configuration Management'],
    problems: ['Wrong key in config = app fails', 'ConfigMap not found', 'Env var name conflicts'],
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "postgres.example.com"
  database_port: "5432"
  database_name: "myapp"
  log_level: "INFO"
  feature_flags: "feature1=true,feature2=false"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: config-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: config-app
  template:
    metadata:
      labels:
        app: config-app
    spec:
      containers:
      - name: app
        image: busybox:latest
        command: ['sh', '-c']
        args:
        - |
          echo "=== Application Configuration ==="
          echo "Database Host: $DATABASE_HOST"
          echo "Database Port: $DATABASE_PORT"
          echo "Database Name: $DATABASE_NAME"
          echo "Log Level: $LOG_LEVEL"
          echo "Feature Flags: $FEATURE_FLAGS"
          echo "=== Starting Application ==="
          while true; do
            echo "App running with config..."
            sleep 60
          done
        env:
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_host
        - name: DATABASE_PORT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_port
        - name: DATABASE_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_name
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: log_level
        - name: FEATURE_FLAGS
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: feature_flags`,
    learningObjectives: [
      'Understand ConfigMap usage patterns',
      'Learn environment variable injection',
      'Practice configuration management',
      'Debug configuration issues'
    ],
    realWorldUseCase: 'Application configuration, feature flags, environment-specific settings',
    troubleshooting: {
      commonIssues: [
        'ConfigMap key not found',
        'Environment variable not set',
        'ConfigMap in wrong namespace'
      ],
      debuggingSteps: [
        'kubectl get configmap app-config -o yaml',
        'kubectl describe pod config-app-pod',
        'kubectl exec -it pod -- env | grep DATABASE',
        'kubectl logs config-app-pod'
      ]
    }
  },

  // Production-Grade Architectures
  {
    id: 'microservices-istio-observability',
    title: 'Microservices App with Istio + Observability',
    description: 'Complete microservices architecture with service mesh, monitoring, and distributed tracing',
    category: 'Production',
    difficulty: 5,
    estimatedTime: '45 min',
    architecture: {
      components: ['10 Microservices (Pods)', 'Istio Service Mesh', 'Prometheus + Grafana', 'Kiali for mesh visualization', 'Jaeger for tracing'],
      flow: ['Client Request', 'Istio Gateway', 'Service Mesh (mTLS)', 'Microservices', 'Observability Stack'],
      diagram: 'microservices-istio'
    },
    animation: {
      description: 'Service-to-service traffic with mTLS, retries, rate limiting, and circuit breaking visualization',
      steps: [
        'Request enters through Istio Gateway',
        'mTLS encryption between services',
        'Circuit breaker activates on failures',
        'Metrics collected by Prometheus',
        'Traces sent to Jaeger',
        'Service topology shown in Kiali'
      ],
      trafficFlow: 'Client → Istio Gateway → Service A (mTLS) → Service B → Database'
    },
    concepts: ['Service Mesh', 'mTLS', 'Circuit Breaker', 'Distributed Tracing', 'Observability'],
    problems: ['Secure communication', 'Advanced debugging', 'Performance monitoring', 'Service discovery'],
    yaml: `# Istio Gateway
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: microservices-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
# Virtual Service
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: microservices-vs
spec:
  hosts:
  - "*"
  gateways:
  - microservices-gateway
  http:
  - match:
    - uri:
        prefix: /api/users
    route:
    - destination:
        host: user-service
        port:
          number: 8080
---
# Destination Rule with Circuit Breaker
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service-dr
spec:
  host: user-service
  trafficPolicy:
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
---
# User Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: user-service
        image: microservices/user-service:v1.0
        ports:
        - containerPort: 8080
        env:
        - name: JAEGER_ENDPOINT
          value: "http://jaeger-collector:14268/api/traces"`,
    learningObjectives: [
      'Understand service mesh architecture',
      'Implement mTLS for secure communication',
      'Configure circuit breakers and retries',
      'Set up distributed tracing',
      'Monitor microservices with Prometheus and Grafana'
    ],
    realWorldUseCase: 'Large-scale e-commerce platform with multiple teams developing independent services that need secure communication, observability, and resilience patterns.',
    troubleshooting: {
      commonIssues: [
        'Misconfigured destination rule causing connection failures',
        'High latency traced in Jaeger showing bottlenecks',
        'Circuit breaker not triggering due to wrong thresholds',
        'mTLS certificate issues between services'
      ],
      debuggingSteps: [
        'Check Istio proxy logs: kubectl logs -l app=user-service -c istio-proxy',
        'Verify destination rules: kubectl get destinationrules',
        'Trace requests in Jaeger UI',
        'Monitor service mesh in Kiali dashboard',
        'Check Prometheus metrics for error rates'
      ]
    }
  },

  {
    id: 'enterprise-gitops-argocd',
    title: 'Enterprise GitOps CI/CD Pipeline (ArgoCD)',
    description: 'Complete GitOps workflow with ArgoCD for automated deployment and drift detection',
    category: 'Production',
    difficulty: 4,
    estimatedTime: '35 min',
    architecture: {
      components: ['GitHub/GitLab Repository', 'ArgoCD Controller', 'Helm Chart Repository', 'Application Pods', 'Monitoring Stack'],
      flow: ['Git Push', 'ArgoCD Sync', 'Helm Chart Deploy', 'Application Update', 'Drift Detection'],
      diagram: 'gitops-argocd'
    },
    animation: {
      description: 'Git push triggers ArgoCD to pull changes and automatically deploy with drift detection',
      steps: [
        'Developer pushes code to Git repository',
        'ArgoCD detects changes in Git',
        'ArgoCD pulls Helm charts',
        'Deployment applied to cluster',
        'Drift detection monitors for manual changes',
        'Auto-sync or manual approval for updates'
      ],
      trafficFlow: 'Git Repository → ArgoCD → Helm Charts → Kubernetes Cluster'
    },
    concepts: ['GitOps', 'Declarative Infrastructure', 'Continuous Deployment', 'Drift Detection', 'Helm Charts'],
    problems: ['Automated delivery', 'Configuration drift', 'Rollback capabilities', 'Multi-environment deployment'],
    yaml: `# ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/web-app-helm
    targetRevision: HEAD
    path: charts/web-app
    helm:
      valueFiles:
      - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
---
# Application Deployment (managed by ArgoCD)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: company/web-app:v2.1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"`,
    learningObjectives: [
      'Implement GitOps workflow with ArgoCD',
      'Configure automated sync policies',
      'Set up multi-environment deployments',
      'Handle configuration drift detection',
      'Manage Helm chart deployments'
    ],
    realWorldUseCase: 'Enterprise software company with multiple development teams needing automated, auditable deployments across staging and production environments.',
    troubleshooting: {
      commonIssues: [
        'Broken sync due to deleted resource in cluster',
        'Wrong values file causing deployment failure',
        'Git repository access issues',
        'Helm chart dependency conflicts'
      ],
      debuggingSteps: [
        'Check ArgoCD application status: kubectl get applications -n argocd',
        'View sync logs in ArgoCD UI',
        'Verify Git repository connectivity',
        'Check Helm chart syntax: helm template charts/web-app',
        'Review resource events: kubectl describe deployment web-app'
      ]
    }
  },

  {
    id: 'ha-web-app-hpa-nginx-redis',
    title: 'Highly Available Web App with HPA + NGINX + Redis',
    description: 'Scalable web application with horizontal pod autoscaling, load balancing, and Redis caching',
    category: 'Production',
    difficulty: 4,
    estimatedTime: '30 min',
    architecture: {
      components: ['Frontend Pods', 'Backend Pods', 'Redis Cluster', 'HPA (Horizontal Pod Autoscaler)', 'LoadBalancer Service', 'NGINX Ingress'],
      flow: ['User Request', 'LoadBalancer', 'NGINX Ingress', 'Frontend', 'Backend', 'Redis Cache'],
      diagram: 'ha-web-app'
    },
    animation: {
      description: 'Increasing traffic triggers HPA to scale pods automatically with load distribution',
      steps: [
        'Traffic increases beyond threshold',
        'HPA detects high CPU/memory usage',
        'New pods are automatically created',
        'Load balancer distributes traffic',
        'Redis provides session persistence',
        'Metrics monitored for scaling decisions'
      ],
      trafficFlow: 'Users → LoadBalancer → NGINX → Frontend Pods → Backend Pods → Redis'
    },
    concepts: ['Horizontal Pod Autoscaling', 'Load Balancing', 'Session Persistence', 'High Availability', 'Caching'],
    problems: ['Auto-scaling based on demand', 'Session management', 'Cache performance', 'Load distribution'],
    yaml: `# HPA for Backend
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
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
        image: company/backend:v1.2.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: REDIS_URL
          value: "redis://redis-service:6379"
---
# Redis StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis-service
  replicas: 3
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
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi`,
    learningObjectives: [
      'Configure Horizontal Pod Autoscaler',
      'Implement Redis for session management',
      'Set up load balancing with NGINX',
      'Monitor scaling metrics',
      'Design for high availability'
    ],
    realWorldUseCase: 'E-commerce website that experiences variable traffic patterns and needs to automatically scale during peak shopping periods while maintaining user sessions.',
    troubleshooting: {
      commonIssues: [
        'Redis pod not bound due to PVC error',
        'HPA not scaling due to missing metrics server',
        'Session data lost during pod restarts',
        'Load balancer not distributing traffic evenly'
      ],
      debuggingSteps: [
        'Check HPA status: kubectl get hpa',
        'Verify metrics server: kubectl top pods',
        'Check PVC binding: kubectl get pvc',
        'Test Redis connectivity: kubectl exec -it redis-0 -- redis-cli ping',
        'Monitor pod scaling: kubectl get pods -w'
      ]
    }
  },

  {
    id: 'multi-cluster-global-lb',
    title: 'Multi-Cluster with Global Load Balancing',
    description: 'Geo-distributed Kubernetes clusters with global DNS and disaster recovery',
    category: 'Production',
    difficulty: 5,
    estimatedTime: '50 min',
    architecture: {
      components: ['EU Cluster', 'US Cluster', 'Global DNS', 'Geo-based Routing', 'Cross-cluster Federation', 'Health Checks'],
      flow: ['User Request', 'Global DNS', 'Geo Routing', 'Nearest Cluster', 'Application', 'Cross-cluster Sync'],
      diagram: 'multi-cluster'
    },
    animation: {
      description: 'Requests routed to nearest region with automatic failover when one cluster goes down',
      steps: [
        'User makes request from specific region',
        'Global DNS determines nearest cluster',
        'Traffic routed to optimal cluster',
        'Health checks monitor cluster status',
        'Automatic failover on cluster failure',
        'Cross-cluster state synchronization'
      ],
      trafficFlow: 'Global Users → DNS → EU/US Cluster → Regional Services'
    },
    concepts: ['Multi-cluster', 'Geo-routing', 'Disaster Recovery', 'Global Load Balancing', 'Federation'],
    problems: ['Low latency access', 'Disaster recovery', 'Cross-region synchronization', 'Global availability'],
    yaml: `# Cluster Role for Cross-cluster Access
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cross-cluster-reader
rules:
- apiGroups: [""]
  resources: ["services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch"]
---
# Global Service (EU Cluster)
apiVersion: v1
kind: Service
metadata:
  name: web-app-eu
  annotations:
    external-dns.alpha.kubernetes.io/hostname: eu.myapp.com
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
spec:
  type: LoadBalancer
  selector:
    app: web-app
    region: eu
  ports:
  - port: 80
    targetPort: 8080
---
# Global Service (US Cluster)
apiVersion: v1
kind: Service
metadata:
  name: web-app-us
  annotations:
    external-dns.alpha.kubernetes.io/hostname: us.myapp.com
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
spec:
  type: LoadBalancer
  selector:
    app: web-app
    region: us
  ports:
  - port: 80
    targetPort: 8080`,
    learningObjectives: [
      'Design multi-cluster architecture',
      'Implement geo-based routing',
      'Configure cross-cluster federation',
      'Set up disaster recovery',
      'Manage global DNS and load balancing'
    ],
    realWorldUseCase: 'Global SaaS platform serving customers worldwide with requirements for low latency, high availability, and compliance with data residency laws.',
    troubleshooting: {
      commonIssues: [
        'Secrets not replicated across clusters',
        'Cross-region Ingress conflicts',
        'DNS propagation delays',
        'Certificate management across regions'
      ],
      debuggingSteps: [
        'Check cluster connectivity: kubectl cluster-info',
        'Verify DNS records: nslookup eu.myapp.com',
        'Test cross-cluster communication',
        'Monitor health check endpoints',
        'Validate load balancer configuration'
      ]
    }
  },

  {
    id: 'stateful-database-backup-restore',
    title: 'Stateful Database with Backup/Restore + Read Replicas',
    description: 'PostgreSQL cluster with automated backups, point-in-time recovery, and read replicas',
    category: 'Production',
    difficulty: 4,
    estimatedTime: '40 min',
    architecture: {
      components: ['PostgreSQL Primary', 'Read Replicas', 'PVCs with Snapshots', 'Backup CronJobs', 'Restore Jobs'],
      flow: ['Write Requests', 'Primary DB', 'Replication', 'Read Replicas', 'Backup Jobs', 'Volume Snapshots'],
      diagram: 'stateful-database'
    },
    animation: {
      description: 'Writes go to primary, reads from replicas, with automated backup jobs every 30 minutes',
      steps: [
        'Write operations directed to primary',
        'Data replicated to read replicas',
        'CronJob triggers backup process',
        'Volume snapshot created',
        'Backup stored in object storage',
        'Point-in-time recovery available'
      ],
      trafficFlow: 'App Writes → Primary DB → Replicas ← App Reads | Backup Jobs → Storage'
    },
    concepts: ['StatefulSets', 'Database Replication', 'Volume Snapshots', 'Backup Strategies', 'Point-in-time Recovery'],
    problems: ['Data durability', 'High availability', 'Disaster recovery', 'Read scaling'],
    yaml: `# PostgreSQL Primary StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-primary
spec:
  serviceName: postgres-primary
  replicas: 1
  selector:
    matchLabels:
      app: postgres
      role: primary
  template:
    metadata:
      labels:
        app: postgres
        role: primary
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: "myapp"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: POSTGRES_REPLICATION_USER
          value: "replicator"
        - name: POSTGRES_REPLICATION_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: replication-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        - name: postgres-config
          mountPath: /etc/postgresql/postgresql.conf
          subPath: postgresql.conf
      volumes:
      - name: postgres-config
        configMap:
          name: postgres-config
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd
---
# Backup CronJob
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "*/30 * * * *"  # Every 30 minutes
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h postgres-primary -U postgres -d myapp > /backup/backup-$(date +%Y%m%d-%H%M%S).sql
              aws s3 cp /backup/ s3://my-backups/postgres/ --recursive
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure`,
    learningObjectives: [
      'Deploy StatefulSet for databases',
      'Configure database replication',
      'Implement automated backup strategies',
      'Set up volume snapshots',
      'Design disaster recovery procedures'
    ],
    realWorldUseCase: 'Financial application requiring ACID compliance, zero data loss, and the ability to recover to any point in time for audit purposes.',
    troubleshooting: {
      commonIssues: [
        'Volume not bound causing replica failure',
        'Restore failed due to permission errors',
        'Replication lag causing data inconsistency',
        'Backup job failing due to storage limits'
      ],
      debuggingSteps: [
        'Check PVC status: kubectl get pvc',
        'Verify replication: kubectl exec postgres-primary-0 -- psql -c "SELECT * FROM pg_stat_replication;"',
        'Check backup job logs: kubectl logs -l job-name=postgres-backup',
        'Test restore procedure in staging',
        'Monitor storage usage and retention policies'
      ]
    }
  },

  {
    id: 'ecommerce-kafka-mongodb-elastic',
    title: 'E-commerce Platform with Kafka + MongoDB + Elastic',
    description: 'Event-driven e-commerce platform with message streaming, document storage, and search',
    category: 'Production',
    difficulty: 5,
    estimatedTime: '45 min',
    architecture: {
      components: ['Web App', 'Kafka Cluster', 'MongoDB', 'Elasticsearch', 'Kafka Consumers', 'Logstash', 'Kibana'],
      flow: ['Order Events', 'Kafka Topics', 'Consumer Processing', 'Database Write', 'Log Shipping', 'Search Index'],
      diagram: 'ecommerce-platform'
    },
    animation: {
      description: 'Orders flow through Kafka to database writes, with logs shipped to Elasticsearch for search',
      steps: [
        'User places order in web app',
        'Order event published to Kafka',
        'Consumer processes order event',
        'Order data written to MongoDB',
        'Application logs shipped via Logstash',
        'Data indexed in Elasticsearch',
        'Search available in Kibana dashboard'
      ],
      trafficFlow: 'Web App → Kafka → Consumers → MongoDB | Logs → Logstash → Elasticsearch → Kibana'
    },
    concepts: ['Event-driven Architecture', 'Message Streaming', 'Document Database', 'Search Engine', 'Log Aggregation'],
    problems: ['Event processing', 'Data consistency', 'Search performance', 'Log analysis'],
    yaml: `# Kafka StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka
spec:
  serviceName: kafka
  replicas: 3
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
        image: confluentinc/cp-kafka:7.4.0
        ports:
        - containerPort: 9092
        env:
        - name: KAFKA_BROKER_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: KAFKA_ZOOKEEPER_CONNECT
          value: "zookeeper:2181"
        - name: KAFKA_ADVERTISED_LISTENERS
          value: "PLAINTEXT://$(POD_NAME).kafka:9092"
        - name: KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR
          value: "3"
        volumeMounts:
        - name: kafka-data
          mountPath: /var/lib/kafka/data
  volumeClaimTemplates:
  - metadata:
      name: kafka-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 50Gi
---
# Order Consumer Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-consumer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-consumer
  template:
    metadata:
      labels:
        app: order-consumer
    spec:
      containers:
      - name: consumer
        image: ecommerce/order-consumer:v1.0
        env:
        - name: KAFKA_BROKERS
          value: "kafka:9092"
        - name: MONGODB_URL
          value: "mongodb://mongodb:27017/ecommerce"
        - name: CONSUMER_GROUP
          value: "order-processing"`,
    learningObjectives: [
      'Design event-driven architecture',
      'Configure Kafka for message streaming',
      'Implement consumer patterns',
      'Set up document database with MongoDB',
      'Build search capabilities with Elasticsearch'
    ],
    realWorldUseCase: 'Large e-commerce platform processing millions of orders daily with real-time inventory updates, search functionality, and comprehensive logging for business analytics.',
    troubleshooting: {
      commonIssues: [
        'Kafka consumer crash causing message backlog',
        'Logstash misrouting logs to wrong indices',
        'MongoDB connection pool exhaustion',
        'Elasticsearch cluster split-brain scenario'
      ],
      debuggingSteps: [
        'Check Kafka consumer lag: kafka-consumer-groups.sh --describe',
        'Monitor Logstash pipeline: kubectl logs logstash',
        'Verify MongoDB replica set status',
        'Check Elasticsearch cluster health',
        'Review consumer group rebalancing'
      ]
    }
  },

  {
    id: 'ml-training-pipeline-gpu',
    title: 'ML Training Pipeline on K8s with GPUs',
    description: 'Machine learning training pipeline with GPU resources, data preparation, and model serving',
    category: 'Production',
    difficulty: 4,
    estimatedTime: '40 min',
    architecture: {
      components: ['Data Prep Jobs', 'GPU Training Pods', 'Model Storage', 'TensorBoard', 'Model Serving', 'Artifact Registry'],
      flow: ['Data Ingestion', 'Preprocessing', 'GPU Training', 'Model Export', 'Artifact Storage', 'Model Serving'],
      diagram: 'ml-pipeline'
    },
    animation: {
      description: 'Pods spin up GPU workloads for training with TensorBoard monitoring and model artifacts',
      steps: [
        'Data preparation job processes datasets',
        'Training job scheduled on GPU nodes',
        'Model training with progress monitoring',
        'TensorBoard serves training metrics',
        'Trained model pushed to registry',
        'Model deployed for inference'
      ],
      trafficFlow: 'Data → Prep Jobs → GPU Training → Model Registry → Serving'
    },
    concepts: ['GPU Scheduling', 'ML Pipelines', 'Resource Management', 'Model Versioning', 'Distributed Training'],
    problems: ['GPU resource allocation', 'Training job management', 'Model lifecycle', 'Performance monitoring'],
    yaml: `# GPU Training Job
apiVersion: batch/v1
kind: Job
metadata:
  name: model-training
spec:
  template:
    spec:
      containers:
      - name: trainer
        image: tensorflow/tensorflow:2.13.0-gpu
        command: ["python", "/app/train.py"]
        resources:
          requests:
            nvidia.com/gpu: 2
            memory: "16Gi"
            cpu: "4"
          limits:
            nvidia.com/gpu: 2
            memory: "32Gi"
            cpu: "8"
        env:
        - name: CUDA_VISIBLE_DEVICES
          value: "0,1"
        - name: MODEL_OUTPUT_PATH
          value: "/models/output"
        volumeMounts:
        - name: training-data
          mountPath: /data
        - name: model-output
          mountPath: /models
      volumes:
      - name: training-data
        persistentVolumeClaim:
          claimName: training-data-pvc
      - name: model-output
        persistentVolumeClaim:
          claimName: model-output-pvc
      restartPolicy: Never
      nodeSelector:
        accelerator: nvidia-tesla-v100
---
# TensorBoard Service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tensorboard
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tensorboard
  template:
    metadata:
      labels:
        app: tensorboard
    spec:
      containers:
      - name: tensorboard
        image: tensorflow/tensorflow:2.13.0
        command: ["tensorboard", "--logdir=/logs", "--host=0.0.0.0"]
        ports:
        - containerPort: 6006
        volumeMounts:
        - name: training-logs
          mountPath: /logs
      volumes:
      - name: training-logs
        persistentVolumeClaim:
          claimName: training-logs-pvc`,
    learningObjectives: [
      'Schedule GPU workloads on Kubernetes',
      'Design ML training pipelines',
      'Manage training data and models',
      'Monitor training with TensorBoard',
      'Handle resource constraints and optimization'
    ],
    realWorldUseCase: 'AI company training large language models or computer vision models that require significant GPU resources and need to scale training jobs based on demand.',
    troubleshooting: {
      commonIssues: [
        'GPU resource mismatch causing pod pending',
        'OutOfMemory crashes during training',
        'Data loading bottlenecks',
        'Model checkpoint corruption'
      ],
      debuggingSteps: [
        'Check GPU availability: kubectl describe nodes',
        'Monitor resource usage: kubectl top pods',
        'Check training logs: kubectl logs model-training',
        'Verify data mount: kubectl exec -it pod -- ls /data',
        'Test GPU access: nvidia-smi inside container'
      ]
    }
  },

  {
    id: 'zero-trust-opa-networkpolicy',
    title: 'Zero Trust Cluster with OPA Gatekeeper + NetworkPolicy',
    description: 'Security-hardened cluster with policy enforcement and network segmentation',
    category: 'Production',
    difficulty: 5,
    estimatedTime: '35 min',
    architecture: {
      components: ['OPA Gatekeeper', 'Admission Controller', 'NetworkPolicies', 'RBAC Rules', 'Security Policies'],
      flow: ['Resource Creation', 'Policy Validation', 'Admission Decision', 'Network Enforcement', 'Audit Logging'],
      diagram: 'zero-trust'
    },
    animation: {
      description: 'Attempted pod creation blocked by OPA with network connections denied by policies',
      steps: [
        'User attempts to create resource',
        'OPA Gatekeeper validates against policies',
        'Non-compliant resources rejected',
        'Network policies enforce segmentation',
        'All actions logged for audit',
        'Security violations blocked'
      ],
      trafficFlow: 'API Request → OPA Validation → Admission → Network Policy → Resource'
    },
    concepts: ['Zero Trust', 'Policy as Code', 'Network Segmentation', 'Admission Control', 'Security Hardening'],
    problems: ['Security compliance', 'Policy enforcement', 'Network isolation', 'Audit requirements'],
    yaml: `# OPA Gatekeeper Constraint Template
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        properties:
          labels:
            type: array
            items:
              type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg}] {
          required := input.parameters.labels
          provided := input.review.object.metadata.labels
          missing := required[_]
          not provided[missing]
          msg := sprintf("Missing required label: %v", [missing])
        }
---
# Security Policy Constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: must-have-security-labels
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment"]
  parameters:
    labels: ["security-level", "data-classification", "owner"]
---
# Default Deny NetworkPolicy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
# Allow Frontend to Backend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080`,
    learningObjectives: [
      'Implement zero trust security model',
      'Configure OPA Gatekeeper policies',
      'Design network segmentation',
      'Set up admission controllers',
      'Create security compliance frameworks'
    ],
    realWorldUseCase: 'Financial services company requiring strict security compliance, audit trails, and network isolation to meet regulatory requirements.',
    troubleshooting: {
      commonIssues: [
        'Missing allow rules blocking internal services',
        'OPA policies too restrictive preventing deployments',
        'Network policy conflicts',
        'RBAC permission denials'
      ],
      debuggingSteps: [
        'Check OPA violations: kubectl get constraints',
        'Test network connectivity: kubectl exec -it pod -- nc -zv service 80',
        'Review policy logs: kubectl logs -n gatekeeper-system',
        'Validate RBAC: kubectl auth can-i create pods',
        'Audit security events in cluster logs'
      ]
    }
  },

  {
    id: 'event-driven-keda-rabbitmq',
    title: 'Event-driven Autoscaling with KEDA + RabbitMQ',
    description: 'Scalable background job processing with KEDA autoscaling based on queue metrics',
    category: 'Production',
    difficulty: 4,
    estimatedTime: '30 min',
    architecture: {
      components: ['RabbitMQ Queue', 'KEDA ScaledObject', 'Worker Pods', 'Message Producers', 'Metrics Collector'],
      flow: ['Message Production', 'Queue Accumulation', 'KEDA Monitoring', 'Pod Scaling', 'Message Processing'],
      diagram: 'keda-rabbitmq'
    },
    animation: {
      description: 'Queue length increases triggering KEDA to scale up worker pods automatically',
      steps: [
        'Messages published to RabbitMQ queue',
        'Queue length monitored by KEDA',
        'Scaling threshold exceeded',
        'KEDA creates additional worker pods',
        'Workers process messages in parallel',
        'Pods scale down when queue empty'
      ],
      trafficFlow: 'Producers → RabbitMQ Queue → KEDA Scaler → Worker Pods'
    },
    concepts: ['Event-driven Scaling', 'Message Queues', 'KEDA', 'Background Jobs', 'Metrics-based Autoscaling'],
    problems: ['Queue-based scaling', 'Background job processing', 'Resource optimization', 'Message handling'],
    yaml: `# RabbitMQ StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: rabbitmq
spec:
  serviceName: rabbitmq
  replicas: 1
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      containers:
      - name: rabbitmq
        image: rabbitmq:3.12-management
        ports:
        - containerPort: 5672
        - containerPort: 15672
        env:
        - name: RABBITMQ_DEFAULT_USER
          value: "admin"
        - name: RABBITMQ_DEFAULT_PASS
          valueFrom:
            secretKeyRef:
              name: rabbitmq-secret
              key: password
        volumeMounts:
        - name: rabbitmq-data
          mountPath: /var/lib/rabbitmq
  volumeClaimTemplates:
  - metadata:
      name: rabbitmq-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
---
# KEDA ScaledObject
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: rabbitmq-scaler
spec:
  scaleTargetRef:
    name: worker-deployment
  minReplicaCount: 1
  maxReplicaCount: 20
  triggers:
  - type: rabbitmq
    metadata:
      protocol: amqp
      queueName: task-queue
      mode: QueueLength
      value: "5"
    authenticationRef:
      name: rabbitmq-auth
---
# Worker Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-deployment
spec:
  replicas: 1
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
        image: company/background-worker:v1.0
        env:
        - name: RABBITMQ_URL
          value: "amqp://admin:password@rabbitmq:5672/"
        - name: QUEUE_NAME
          value: "task-queue"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"`,
    learningObjectives: [
      'Configure KEDA for event-driven autoscaling',
      'Set up RabbitMQ message queues',
      'Design scalable background job processing',
      'Implement queue-based scaling triggers',
      'Monitor and optimize scaling behavior'
    ],
    realWorldUseCase: 'Image processing service that needs to scale worker pods based on the number of images waiting to be processed in the queue.',
    troubleshooting: {
      commonIssues: [
        'KEDA trigger not working due to authentication',
        'Permission denied on queue access',
        'Scaling too aggressive causing resource exhaustion',
        'Dead letter queue not configured'
      ],
      debuggingSteps: [
        'Check KEDA operator logs: kubectl logs -n keda',
        'Verify RabbitMQ queue: kubectl port-forward rabbitmq-0 15672:15672',
        'Test queue connectivity: kubectl exec worker -- amqp-tools',
        'Monitor scaling events: kubectl get events',
        'Check ScaledObject status: kubectl describe scaledobject'
      ]
    }
  },

  {
    id: 'full-observability-stack',
    title: 'Full Observability Stack with Logging, Tracing, Metrics',
    description: 'Complete observability platform with Prometheus, Jaeger, ELK stack, and alerting',
    category: 'Production',
    difficulty: 5,
    estimatedTime: '50 min',
    architecture: {
      components: ['Prometheus + Alertmanager', 'Fluentd → Elasticsearch → Kibana', 'OpenTelemetry Collector', 'Jaeger', 'Grafana Dashboards'],
      flow: ['Metrics Collection', 'Log Aggregation', 'Trace Collection', 'Alert Processing', 'Dashboard Visualization'],
      diagram: 'observability-stack'
    },
    animation: {
      description: 'Pod crash triggers alert, logs are collected, and traces are available for debugging',
      steps: [
        'Application generates metrics, logs, traces',
        'Prometheus scrapes metrics',
        'Fluentd collects and ships logs',
        'OpenTelemetry sends traces to Jaeger',
        'Alert triggered on pod crash',
        'SRE investigates using dashboards'
      ],
      trafficFlow: 'Apps → Metrics/Logs/Traces → Collection → Storage → Visualization/Alerting'
    },
    concepts: ['Observability', 'Metrics', 'Logging', 'Distributed Tracing', 'Alerting', 'SRE'],
    problems: ['Performance monitoring', 'Troubleshooting', 'SRE workflows', 'System visibility'],
    yaml: `# Prometheus Configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    rule_files:
      - "/etc/prometheus/rules/*.yml"
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
    alerting:
      alertmanagers:
      - static_configs:
        - targets: ["alertmanager:9093"]
---
# Alerting Rules
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
data:
  alerts.yml: |
    groups:
    - name: kubernetes
      rules:
      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage on {{ $labels.pod }}"
---
# Fluentd DaemonSet
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers`,
    learningObjectives: [
      'Build complete observability stack',
      'Configure metrics collection with Prometheus',
      'Set up centralized logging with ELK',
      'Implement distributed tracing',
      'Create effective alerting strategies'
    ],
    realWorldUseCase: 'Large-scale production system requiring comprehensive monitoring, logging, and tracing for SRE teams to maintain high availability and performance.',
    troubleshooting: {
      commonIssues: [
        'Missing logs due to Fluentd configuration',
        'Prometheus scrape targets not discovered',
        'Jaeger traces not appearing',
        'Alert fatigue from misconfigured rules'
      ],
      debuggingSteps: [
        'Check Prometheus targets: kubectl port-forward prometheus-0 9090:9090',
        'Verify log shipping: kubectl logs fluentd-xxx',
        'Test trace collection: kubectl logs opentelemetry-collector',
        'Review alert rules: kubectl get prometheusrules',
        'Monitor resource usage of observability stack'
      ]
    }
  },

  // Basic Networking & Routing Examples
  {
    id: 'basic-ingress-routing',
    title: 'Basic Ingress Routing',
    description: 'User traffic routed via Ingress to a backend service with path-based routing',
    category: 'Basic',
    difficulty: 2,
    estimatedTime: '15 min',
    architecture: {
      components: ['Ingress Controller', 'Ingress Resource', 'Service', 'Backend Pods'],
      flow: ['User Request', 'Ingress Controller', 'Service', 'Pod'],
      diagram: 'basic-ingress'
    },
    animation: {
      description: 'Arrow from globe icon (user) to Ingress, rule match flashes, then arrow to Service and Pod',
      steps: [
        'User makes HTTP request',
        'Ingress Controller receives traffic',
        'Ingress rule matches path',
        'Traffic forwarded to Service',
        'Service routes to healthy Pod',
        'Response flows back to user'
      ],
      trafficFlow: 'User → Ingress → Service → Pod'
    },
    concepts: ['Ingress', 'Path-based Routing', 'Load Balancing', 'HTTP Routing'],
    problems: ['External access', 'URL routing', 'SSL termination', 'Traffic distribution'],
    yaml: `# Ingress Resource
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
---
# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8080
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
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
        image: nginx:latest
        ports:
        - containerPort: 8080`,
    learningObjectives: [
      'Configure Ingress for external access',
      'Understand path-based routing',
      'Set up SSL termination',
      'Implement load balancing'
    ],
    realWorldUseCase: 'Web application with separate API and frontend services that need to be accessible from the internet through a single domain.',
    troubleshooting: {
      commonIssues: [
        'Ingress path doesn\'t match service endpoint',
        'SSL certificate issues',
        'Backend service not responding',
        'DNS resolution problems'
      ],
      debuggingSteps: [
        'Check Ingress status: kubectl get ingress',
        'Verify service endpoints: kubectl get endpoints',
        'Test backend connectivity: kubectl port-forward',
        'Check Ingress controller logs',
        'Validate DNS configuration'
      ]
    }
  },

  {
    id: 'misconfigured-ingress-path',
    title: 'Misconfigured Ingress Path',
    description: 'Ingress path doesn\'t match service endpoint, resulting in 404 errors',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '10 min',
    architecture: {
      components: ['Ingress Controller', 'Misconfigured Ingress', 'Service', 'Pod'],
      flow: ['User Request', 'Ingress Controller', 'Path Mismatch', '404 Error'],
      diagram: 'misconfigured-ingress'
    },
    animation: {
      description: 'Red flashing X on path match with bubble showing "404 Not Found"',
      steps: [
        'User requests /api/users',
        'Ingress receives request',
        'Path rule fails to match',
        'No backend service found',
        '404 error returned',
        'Traffic never reaches pods'
      ],
      trafficFlow: 'User → Ingress ❌ (404 Not Found)'
    },
    concepts: ['Path Matching', 'Ingress Rules', 'HTTP Status Codes', 'Debugging'],
    problems: ['Path configuration', 'URL rewriting', 'Route debugging', 'Error handling'],
    yaml: `# Misconfigured Ingress (Wrong Path)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: broken-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /wrong-path  # Should be /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
---
# Correct Ingress Configuration
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fixed-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80`,
    learningObjectives: [
      'Identify path matching issues',
      'Debug Ingress configuration',
      'Understand pathType options',
      'Fix routing problems'
    ],
    realWorldUseCase: 'Common misconfiguration when setting up new services or migrating existing applications to Kubernetes.',
    troubleshooting: {
      commonIssues: [
        'Wrong path prefix in Ingress rule',
        'Incorrect pathType setting',
        'Missing rewrite-target annotation',
        'Case sensitivity in paths'
      ],
      debuggingSteps: [
        'Check Ingress rules: kubectl describe ingress',
        'Test path matching manually',
        'Verify service name and port',
        'Check Ingress controller logs for 404s',
        'Use curl to test specific paths'
      ]
    }
  },

  {
    id: 'service-without-matching-pods',
    title: 'Service Without Matching Pods',
    description: 'Service selector doesn\'t match any pod labels, resulting in no endpoints',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '10 min',
    architecture: {
      components: ['Service', 'Pod with Wrong Labels', 'No Endpoints'],
      flow: ['User Request', 'Service', 'No Matching Pods', 'Connection Failed'],
      diagram: 'service-no-pods'
    },
    animation: {
      description: 'Arrow goes to Service, red exclamation shows "No Endpoints"',
      steps: [
        'User sends request to service',
        'Service receives traffic',
        'Selector query finds no pods',
        'No endpoints available',
        'Connection refused error',
        'Traffic fails to reach any pod'
      ],
      trafficFlow: 'User → Service ❌ (No Endpoints)'
    },
    concepts: ['Label Selectors', 'Service Discovery', 'Endpoints', 'Pod Labels'],
    problems: ['Label matching', 'Service configuration', 'Pod discovery', 'Connectivity'],
    yaml: `# Service with Wrong Selector
apiVersion: v1
kind: Service
metadata:
  name: broken-service
spec:
  selector:
    app: wrong-label  # No pods have this label
  ports:
  - port: 80
    targetPort: 8080
---
# Pod with Different Label
apiVersion: v1
kind: Pod
metadata:
  name: web-pod
  labels:
    app: web-app  # Doesn't match service selector
spec:
  containers:
  - name: web
    image: nginx:latest
    ports:
    - containerPort: 8080
---
# Fixed Service
apiVersion: v1
kind: Service
metadata:
  name: fixed-service
spec:
  selector:
    app: web-app  # Matches pod label
  ports:
  - port: 80
    targetPort: 8080`,
    learningObjectives: [
      'Understand label selectors',
      'Debug service endpoints',
      'Fix label mismatches',
      'Verify pod-service connectivity'
    ],
    realWorldUseCase: 'Common issue when deploying new services or updating pod labels without updating corresponding services.',
    troubleshooting: {
      commonIssues: [
        'Mismatched labels between service and pods',
        'Typos in label names or values',
        'Pods not running or ready',
        'Wrong namespace for service/pods'
      ],
      debuggingSteps: [
        'Check service endpoints: kubectl get endpoints',
        'Verify pod labels: kubectl get pods --show-labels',
        'Compare service selector: kubectl describe service',
        'Test label selector: kubectl get pods -l app=web-app',
        'Check pod readiness status'
      ]
    }
  },

  {
    id: 'clusterip-not-exposed',
    title: 'ClusterIP Not Exposed',
    description: 'App is only accessible inside cluster, not from external users',
    category: 'Basic',
    difficulty: 1,
    estimatedTime: '10 min',
    architecture: {
      components: ['ClusterIP Service', 'Internal Pods', 'External User Blocked'],
      flow: ['Internal Pod', 'ClusterIP Service', 'Target Pod'],
      diagram: 'clusterip-internal'
    },
    animation: {
      description: 'Red wall blocking user from external world, green arrows inside cluster',
      steps: [
        'External user attempts connection',
        'ClusterIP service is internal only',
        'Traffic blocked at cluster boundary',
        'Internal pods can communicate freely',
        'Service works within cluster',
        'External access requires different service type'
      ],
      trafficFlow: 'Internal Pod → Service → Pod (External User ❌)'
    },
    concepts: ['Service Types', 'ClusterIP', 'Internal Networking', 'External Access'],
    problems: ['Service exposure', 'Network accessibility', 'Service types', 'External connectivity'],
    yaml: `# ClusterIP Service (Internal Only)
apiVersion: v1
kind: Service
metadata:
  name: internal-service
spec:
  type: ClusterIP  # Default, only accessible within cluster
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080
---
# NodePort Service (External Access)
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  type: NodePort  # Accessible from outside cluster
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080  # External port on nodes
---
# LoadBalancer Service (Cloud Provider)
apiVersion: v1
kind: Service
metadata:
  name: loadbalancer-service
spec:
  type: LoadBalancer  # Cloud provider load balancer
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080`,
    learningObjectives: [
      'Understand service types',
      'Configure external access',
      'Choose appropriate service type',
      'Implement network exposure strategies'
    ],
    realWorldUseCase: 'Web application that needs to be accessible from the internet but is initially configured with ClusterIP service.',
    troubleshooting: {
      commonIssues: [
        'Service type set to ClusterIP',
        'No external load balancer configured',
        'Firewall blocking external access',
        'Missing Ingress controller'
      ],
      debuggingSteps: [
        'Check service type: kubectl get service',
        'Test internal connectivity: kubectl exec -it pod -- curl service',
        'Verify external access requirements',
        'Consider NodePort or LoadBalancer',
        'Check cloud provider integration'
      ]
    }
  },

  {
    id: 'nodeport-misused',
    title: 'NodePort Misused',
    description: 'NodePort exposed on wrong node IP or port, causing connection failures',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '15 min',
    architecture: {
      components: ['NodePort Service', 'Multiple Nodes', 'Wrong Node Access'],
      flow: ['User', 'Wrong Node IP', 'Connection Refused'],
      diagram: 'nodeport-misused'
    },
    animation: {
      description: 'Arrow hits wrong node icon, red message shows "Connection Refused"',
      steps: [
        'User tries to access wrong node IP',
        'Node doesn\'t have the service',
        'Connection refused error',
        'Correct node would work',
        'Service available on all nodes',
        'Need to use correct IP and port'
      ],
      trafficFlow: 'User → Wrong Node (Connection Refused)'
    },
    concepts: ['NodePort', 'Node Selection', 'Port Allocation', 'Network Troubleshooting'],
    problems: ['Node accessibility', 'Port configuration', 'Network routing', 'Service discovery'],
    yaml: `# NodePort Service
apiVersion: v1
kind: Service
metadata:
  name: nodeport-service
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080  # Available on ALL nodes
---
# Check which nodes are available
# kubectl get nodes -o wide
# Access via: http://<any-node-ip>:30080`,
    learningObjectives: [
      'Understand NodePort behavior',
      'Debug node connectivity',
      'Configure proper port access',
      'Troubleshoot network issues'
    ],
    realWorldUseCase: 'Development environment where developers try to access services using incorrect node IPs or ports.',
    troubleshooting: {
      commonIssues: [
        'Using wrong node IP address',
        'Firewall blocking NodePort range',
        'Node not ready or available',
        'Port already in use'
      ],
      debuggingSteps: [
        'Get node IPs: kubectl get nodes -o wide',
        'Check service: kubectl get service',
        'Test connectivity: telnet <node-ip> <nodeport>',
        'Verify firewall rules',
        'Check node status and readiness'
      ]
    }
  },

  {
    id: 'loadbalancer-service',
    title: 'LoadBalancer Type Service',
    description: 'LoadBalancer service routes external traffic to backend pods with cloud integration',
    category: 'Basic',
    difficulty: 2,
    estimatedTime: '20 min',
    architecture: {
      components: ['Cloud LoadBalancer', 'LoadBalancer Service', 'Backend Pods'],
      flow: ['User', 'Cloud LB', 'Service', 'Pods'],
      diagram: 'loadbalancer-service'
    },
    animation: {
      description: 'Round-robin arrows from LoadBalancer to Pods showing traffic distribution',
      steps: [
        'User makes request to external IP',
        'Cloud provider load balancer receives traffic',
        'LoadBalancer forwards to service',
        'Service distributes to healthy pods',
        'Round-robin load balancing',
        'Response flows back through LB'
      ],
      trafficFlow: 'User → LoadBalancer → Service → Pod'
    },
    concepts: ['LoadBalancer', 'Cloud Integration', 'External IP', 'Load Distribution'],
    problems: ['External access', 'Load balancing', 'Cloud provider integration', 'High availability'],
    yaml: `# LoadBalancer Service
apiVersion: v1
kind: Service
metadata:
  name: loadbalancer-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
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
        image: nginx:latest
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`,
    learningObjectives: [
      'Configure LoadBalancer services',
      'Understand cloud provider integration',
      'Implement external access patterns',
      'Set up load balancing strategies'
    ],
    realWorldUseCase: 'Production web application that needs external access with automatic load balancing and high availability.',
    troubleshooting: {
      commonIssues: [
        'LoadBalancer stuck in pending state',
        'Cloud provider quota limits',
        'Security group restrictions',
        'Health check failures'
      ],
      debuggingSteps: [
        'Check service status: kubectl get service',
        'Verify cloud provider integration',
        'Check security groups/firewall rules',
        'Monitor load balancer health checks',
        'Validate pod readiness probes'
      ]
    }
  },

  {
    id: 'readiness-probe-fails',
    title: 'Readiness Probe Fails',
    description: 'Pod marked not ready due to failing readiness probe, excluded from service traffic',
    category: 'Debugging',
    difficulty: 3,
    estimatedTime: '15 min',
    architecture: {
      components: ['Service', 'Ready Pods', 'Not Ready Pod', 'Health Checks'],
      flow: ['Service', 'Ready Pods Only', 'Failed Pod Excluded'],
      diagram: 'readiness-probe-fail'
    },
    animation: {
      description: 'Health check animation with red X if probe fails, service ignores not-ready pod',
      steps: [
        'Readiness probe checks pod health',
        'HTTP health endpoint returns error',
        'Pod marked as not ready',
        'Service removes pod from endpoints',
        'Traffic only goes to ready pods',
        'Pod excluded until health improves'
      ],
      trafficFlow: 'Service → Ready Pods Only (Failed Pod Excluded)'
    },
    concepts: ['Readiness Probes', 'Health Checks', 'Service Endpoints', 'Traffic Routing'],
    problems: ['Health monitoring', 'Traffic routing', 'Service availability', 'Pod readiness'],
    yaml: `# Deployment with Readiness Probe
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-with-probe
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
        image: nginx:latest
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 30
---
# Service
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080`,
    learningObjectives: [
      'Configure readiness probes',
      'Understand probe vs liveness differences',
      'Debug health check failures',
      'Implement proper health endpoints'
    ],
    realWorldUseCase: 'Application that needs time to warm up or may become temporarily unhealthy and should be excluded from traffic.',
    troubleshooting: {
      commonIssues: [
        'Health endpoint returning errors',
        'Probe timeout too short',
        'Application startup time too long',
        'Network connectivity to health endpoint'
      ],
      debuggingSteps: [
        'Check pod readiness: kubectl get pods',
        'Describe pod events: kubectl describe pod',
        'Test health endpoint: kubectl exec pod -- curl localhost:8080/health',
        'Check probe configuration',
        'Monitor application logs'
      ]
    }
  },

  {
    id: 'crashloopbackoff-pod',
    title: 'CrashLoopBackOff Pod',
    description: 'Pod starts and crashes repeatedly, service cannot route traffic to unstable pod',
    category: 'Debugging',
    difficulty: 3,
    estimatedTime: '20 min',
    architecture: {
      components: ['Deployment', 'Crashing Pod', 'Service', 'Restart Policy'],
      flow: ['Pod Start', 'Application Crash', 'Restart', 'Crash Again'],
      diagram: 'crashloop-pod'
    },
    animation: {
      description: 'Pod icon fades in and out repeatedly, log viewer popup shows crash details',
      steps: [
        'Pod starts successfully',
        'Application encounters error',
        'Pod crashes and exits',
        'Kubernetes restarts pod',
        'Crash happens again',
        'Exponential backoff delay increases'
      ],
      trafficFlow: 'Service → Healthy Pods Only (Crashing Pod Excluded)'
    },
    concepts: ['Pod Lifecycle', 'Restart Policies', 'Application Debugging', 'Container Health'],
    problems: ['Application stability', 'Resource management', 'Error handling', 'Debugging crashes'],
    yaml: `# Deployment with Crashing Container
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crashloop-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: crashloop-app
  template:
    metadata:
      labels:
        app: crashloop-app
    spec:
      containers:
      - name: app
        image: busybox:latest
        command: ["/bin/sh"]
        args: ["-c", "echo 'Starting app...'; sleep 10; echo 'Crashing!'; exit 1"]
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
      restartPolicy: Always  # Default behavior
---
# Fixed Version with Proper Health Checks
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stable-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: stable-app
  template:
    metadata:
      labels:
        app: stable-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5`,
    learningObjectives: [
      'Understand pod restart policies',
      'Debug application crashes',
      'Implement proper health checks',
      'Handle container lifecycle events'
    ],
    realWorldUseCase: 'Application with configuration errors, missing dependencies, or resource constraints causing repeated crashes.',
    troubleshooting: {
      commonIssues: [
        'Application configuration errors',
        'Missing environment variables',
        'Resource constraints (OOM)',
        'Dependency service unavailable'
      ],
      debuggingSteps: [
        'Check pod status: kubectl get pods',
        'View pod events: kubectl describe pod',
        'Check logs: kubectl logs pod --previous',
        'Examine resource usage: kubectl top pod',
        'Test container locally: docker run image'
      ]
    }
  },

  {
    id: 'configmap-missing',
    title: 'ConfigMap Missing',
    description: 'Application fails to start due to missing ConfigMap configuration',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '15 min',
    architecture: {
      components: ['Pod', 'Missing ConfigMap', 'Volume Mount', 'Application Error'],
      flow: ['Pod Start', 'ConfigMap Lookup', 'Not Found', 'Startup Failure'],
      diagram: 'configmap-missing'
    },
    animation: {
      description: 'File icon with question mark, pod turns red with startup failure',
      steps: [
        'Pod attempts to start',
        'Looks for ConfigMap volume',
        'ConfigMap not found',
        'Volume mount fails',
        'Application cannot read config',
        'Pod fails to start'
      ],
      trafficFlow: 'Pod Startup ❌ (ConfigMap Not Found)'
    },
    concepts: ['ConfigMaps', 'Volume Mounts', 'Configuration Management', 'Pod Dependencies'],
    problems: ['Configuration management', 'Resource dependencies', 'Application startup', 'Volume mounting'],
    yaml: `# Pod with Missing ConfigMap
apiVersion: v1
kind: Pod
metadata:
  name: app-with-missing-config
spec:
  containers:
  - name: app
    image: nginx:latest
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: missing-configmap  # This ConfigMap doesn't exist
---
# Create the Required ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    database.host=localhost
    database.port=5432
    database.name=myapp
    log.level=INFO
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
---
# Fixed Pod with Correct ConfigMap
apiVersion: v1
kind: Pod
metadata:
  name: app-with-config
spec:
  containers:
  - name: app
    image: nginx:latest
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
    env:
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database.host
  volumes:
  - name: config-volume
    configMap:
      name: app-config`,
    learningObjectives: [
      'Create and manage ConfigMaps',
      'Mount configuration as volumes',
      'Use ConfigMap data as environment variables',
      'Debug configuration issues'
    ],
    realWorldUseCase: 'Application deployment where configuration files are managed separately and may be missing or incorrectly named.',
    troubleshooting: {
      commonIssues: [
        'ConfigMap name mismatch',
        'ConfigMap in wrong namespace',
        'Missing required configuration keys',
        'Incorrect volume mount path'
      ],
      debuggingSteps: [
        'Check if ConfigMap exists: kubectl get configmap',
        'Verify ConfigMap data: kubectl describe configmap',
        'Check pod events: kubectl describe pod',
        'Verify volume mounts: kubectl exec pod -- ls /etc/config',
        'Test configuration access: kubectl exec pod -- cat /etc/config/app.properties'
      ]
    }
  },

  {
    id: 'secret-not-mounted',
    title: 'Secret Not Mounted',
    description: 'Secret not found in expected mount path, application fails to read credentials',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '15 min',
    architecture: {
      components: ['Pod', 'Missing Secret', 'Volume Mount', 'Authentication Failure'],
      flow: ['App Start', 'Read Credentials', 'File Not Found', 'Auth Failure'],
      diagram: 'secret-not-mounted'
    },
    animation: {
      description: 'Lock icon with slash through it, logs show "File not found" error',
      steps: [
        'Application starts up',
        'Tries to read database credentials',
        'Secret file not found at mount path',
        'Authentication fails',
        'Database connection refused',
        'Application becomes unhealthy'
      ],
      trafficFlow: 'App → Database ❌ (Credentials Not Found)'
    },
    concepts: ['Secrets', 'Volume Mounts', 'Security', 'Credential Management'],
    problems: ['Secret management', 'Security configuration', 'Authentication', 'Volume mounting'],
    yaml: `# Pod with Missing Secret
apiVersion: v1
kind: Pod
metadata:
  name: app-with-missing-secret
spec:
  containers:
  - name: app
    image: postgres:13
    env:
    - name: POSTGRES_PASSWORD_FILE
      value: /etc/secrets/password
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: missing-secret  # This secret doesn't exist
---
# Create the Required Secret
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: cG9zdGdyZXM=  # postgres (base64)
  password: c2VjcmV0UGFzcw==  # secretPass (base64)
  host: bG9jYWxob3N0  # localhost (base64)
---
# Fixed Pod with Correct Secret
apiVersion: v1
kind: Pod
metadata:
  name: app-with-secret
spec:
  containers:
  - name: app
    image: postgres:13
    env:
    - name: POSTGRES_USER
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-credentials`,
    learningObjectives: [
      'Create and manage Secrets',
      'Mount secrets as volumes',
      'Use secrets as environment variables',
      'Implement secure credential handling'
    ],
    realWorldUseCase: 'Database application that requires credentials to be securely provided through Kubernetes secrets.',
    troubleshooting: {
      commonIssues: [
        'Secret name mismatch',
        'Secret in wrong namespace',
        'Incorrect base64 encoding',
        'Wrong volume mount path'
      ],
      debuggingSteps: [
        'Check if secret exists: kubectl get secret',
        'Verify secret data: kubectl describe secret',
        'Check pod events: kubectl describe pod',
        'Verify mount path: kubectl exec pod -- ls /etc/secrets',
        'Test secret access: kubectl exec pod -- cat /etc/secrets/username'
      ]
    }
  },

  {
    id: 'imagepullbackoff',
    title: 'ImagePullBackOff',
    description: 'Wrong image name or registry causes pod to fail during image pull phase',
    category: 'Debugging',
    difficulty: 2,
    estimatedTime: '10 min',
    architecture: {
      components: ['Pod', 'Container Registry', 'Image Pull Error', 'Kubelet'],
      flow: ['Pod Creation', 'Image Pull', 'Registry Error', 'Pull Failure'],
      diagram: 'imagepull-error'
    },
    animation: {
      description: 'Image icon with red cross, tooltip shows "Image not found"',
      steps: [
        'Pod scheduled to node',
        'Kubelet tries to pull image',
        'Registry returns 404 error',
        'Image pull fails',
        'Pod stuck in ImagePullBackOff',
        'Exponential backoff retry'
      ],
      trafficFlow: 'Pod → Registry ❌ (Image Not Found)'
    },
    concepts: ['Container Images', 'Image Registries', 'Pod Lifecycle', 'Image Pull Policies'],
    problems: ['Image management', 'Registry access', 'Image naming', 'Authentication'],
    yaml: `# Pod with Wrong Image
apiVersion: v1
kind: Pod
metadata:
  name: broken-image-pod
spec:
  containers:
  - name: app
    image: nginx:nonexistent-tag  # This tag doesn't exist
    ports:
    - containerPort: 80
---
# Pod with Private Registry (Missing Credentials)
apiVersion: v1
kind: Pod
metadata:
  name: private-registry-pod
spec:
  containers:
  - name: app
    image: private-registry.com/myapp:latest  # Requires authentication
    ports:
    - containerPort: 8080
---
# Fixed Pod with Correct Image
apiVersion: v1
kind: Pod
metadata:
  name: working-pod
spec:
  containers:
  - name: app
    image: nginx:latest  # Correct, existing image
    ports:
    - containerPort: 80
    imagePullPolicy: IfNotPresent
---
# Pod with Private Registry (With Credentials)
apiVersion: v1
kind: Secret
metadata:
  name: registry-credentials
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6eyJwcml2YXRlLXJlZ2lzdHJ5LmNvbSI6eyJ1c2VybmFtZSI6InVzZXIiLCJwYXNzd29yZCI6InBhc3MiLCJhdXRoIjoiZFhObGNqcHdZWE56In19fQ==
---
apiVersion: v1
kind: Pod
metadata:
  name: private-registry-fixed
spec:
  containers:
  - name: app
    image: private-registry.com/myapp:latest
    ports:
    - containerPort: 8080
  imagePullSecrets:
  - name: registry-credentials`,
    learningObjectives: [
      'Understand image pull process',
      'Debug image pull failures',
      'Configure image pull secrets',
      'Manage container registries'
    ],
    realWorldUseCase: 'Deployment fails because of typo in image name, wrong tag, or missing registry credentials.',
    troubleshooting: {
      commonIssues: [
        'Typo in image name or tag',
        'Image doesn\'t exist in registry',
        'Missing registry credentials',
        'Network connectivity to registry'
      ],
      debuggingSteps: [
        'Check pod status: kubectl get pods',
        'View pod events: kubectl describe pod',
        'Verify image exists: docker pull image',
        'Check registry credentials: kubectl get secret',
        'Test registry access: docker login registry'
      ]
    }
  },

  {
    id: 'pod-pending-no-nodes',
    title: 'Pod Pending - No Node Match',
    description: 'Resource requests exceed node capacity, pod cannot be scheduled',
    category: 'Debugging',
    difficulty: 3,
    estimatedTime: '20 min',
    architecture: {
      components: ['Scheduler', 'Pod', 'Nodes', 'Resource Constraints'],
      flow: ['Pod Creation', 'Scheduler Check', 'No Suitable Node', 'Pending State'],
      diagram: 'pod-pending'
    },
    animation: {
      description: 'Pod icon bouncing with "Pending..." text, node icons grayed out',
      steps: [
        'Pod submitted to API server',
        'Scheduler evaluates nodes',
        'No node has sufficient resources',
        'Pod remains in Pending state',
        'Scheduler retries periodically',
        'Pod waits for resources'
      ],
      trafficFlow: 'Pod → Scheduler → No Available Nodes'
    },
    concepts: ['Resource Requests', 'Node Capacity', 'Scheduling', 'Resource Management'],
    problems: ['Resource planning', 'Node capacity', 'Scheduling constraints', 'Resource limits'],
    yaml: `# Pod with Excessive Resource Requests
apiVersion: v1
kind: Pod
metadata:
  name: resource-hungry-pod
spec:
  containers:
  - name: app
    image: nginx:latest
    resources:
      requests:
        memory: "64Gi"  # Too much memory
        cpu: "32"       # Too many CPUs
      limits:
        memory: "128Gi"
        cpu: "64"
---
# Deployment with Reasonable Resources
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reasonable-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: reasonable-app
  template:
    metadata:
      labels:
        app: reasonable-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        resources:
          requests:
            memory: "128Mi"  # Reasonable memory request
            cpu: "100m"      # Reasonable CPU request
          limits:
            memory: "256Mi"
            cpu: "500m"
---
# Pod with Node Selector (No Matching Nodes)
apiVersion: v1
kind: Pod
metadata:
  name: node-selector-pod
spec:
  nodeSelector:
    gpu: "nvidia-tesla"  # No nodes have this label
  containers:
  - name: app
    image: nginx:latest`,
    learningObjectives: [
      'Understand resource requests and limits',
      'Debug scheduling failures',
      'Plan cluster capacity',
      'Configure appropriate resource requirements'
    ],
    realWorldUseCase: 'Application with unrealistic resource requirements or cluster with insufficient capacity for workload demands.',
    troubleshooting: {
      commonIssues: [
        'Resource requests too high',
        'No nodes with sufficient capacity',
        'Node selector constraints',
        'Taints and tolerations mismatch'
      ],
      debuggingSteps: [
        'Check pod status: kubectl get pods',
        'View scheduling events: kubectl describe pod',
        'Check node capacity: kubectl describe nodes',
        'View resource usage: kubectl top nodes',
        'Check node labels: kubectl get nodes --show-labels'
      ]
    }
  },

  {
    id: 'hpa-triggers-scaling',
    title: 'Horizontal Pod Autoscaler Triggers',
    description: 'CPU threshold hit triggers HPA to scale up pods automatically',
    category: 'Advanced',
    difficulty: 4,
    estimatedTime: '25 min',
    architecture: {
      components: ['HPA Controller', 'Metrics Server', 'Deployment', 'Load Generator'],
      flow: ['Load Increase', 'CPU Metrics', 'HPA Decision', 'Scale Up'],
      diagram: 'hpa-scaling'
    },
    animation: {
      description: 'Live CPU graph triggers pod cloning animation, showing scale from 1 to 3 pods',
      steps: [
        'Application receives increased load',
        'CPU utilization rises above threshold',
        'Metrics server reports high CPU',
        'HPA controller detects threshold breach',
        'HPA scales up deployment',
        'New pods start to handle load'
      ],
      trafficFlow: 'Load → CPU Metrics → HPA → Scale Up (1→3 Pods)'
    },
    concepts: ['Horizontal Pod Autoscaler', 'Metrics Server', 'CPU Utilization', 'Auto Scaling'],
    problems: ['Load management', 'Resource optimization', 'Performance scaling', 'Cost efficiency'],
    yaml: `# Deployment with Resource Requests (Required for HPA)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
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
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m      # Required for HPA
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Scale when CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80  # Scale when Memory > 80%
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
---
# Service for Load Balancing
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer`,
    learningObjectives: [
      'Configure Horizontal Pod Autoscaler',
      'Understand scaling metrics',
      'Implement load-based scaling',
      'Optimize resource utilization'
    ],
    realWorldUseCase: 'Web application that experiences variable traffic patterns and needs to automatically scale to handle load spikes.',
    troubleshooting: {
      commonIssues: [
        'Missing resource requests in pods',
        'Metrics server not installed',
        'Incorrect CPU/memory targets',
        'Scaling thrashing due to poor configuration'
      ],
      debuggingSteps: [
        'Check HPA status: kubectl get hpa',
        'View HPA details: kubectl describe hpa',
        'Check metrics: kubectl top pods',
        'Verify metrics server: kubectl get pods -n kube-system',
        'Monitor scaling events: kubectl get events'
      ]
    }
  }
];
