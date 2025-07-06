import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Lock,
  Clock,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  Lightbulb,
  X,
  Check,
  Star,
  Trophy,
  Shield,
  Network,
  Database,
  Settings,
  Activity,
  BarChart3,
  TrendingUp,
  Search
} from 'lucide-react';
import ChallengePlayground from '../components/challenges/ChallengePlayground';

const Challenges: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedChallengeId = searchParams.get('challenge');
  const [showHints, setShowHints] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const challenges = [
    // Beginner Challenges
    {
      id: 1,
      title: 'Pod in CrashLoopBackOff',
      description: 'App crashes due to wrong command or missing dependency',
      difficulty: 'Beginner',
      category: 'Debugging',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'A web application pod keeps crashing and restarting in a loop',
      skills: ['Pod Lifecycle', 'Container Commands', 'Debugging'],
      problem: 'The container command is incorrect causing the application to crash immediately',
      realWorldContext: 'CrashLoopBackOff is one of the most common issues in production when containers fail to start properly',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web
spec:
  containers:
  - name: web
    image: nginx:latest
    command: ["/bin/sh"]
    args: ["-c", "wrong-command"]  # This command doesn't exist
    ports:
    - containerPort: 80`,
      hints: [
        'Check the container command and args - are they valid?',
        'Look at the pod logs to see what error is occurring',
        'The nginx image expects to run nginx, not a custom command',
        'Remove the command and args to let nginx start normally'
      ],
      solution: 'Remove the incorrect command and args to let nginx start with its default configuration'
    },
    {
      id: 2,
      title: 'Service Not Routing to Pod',
      description: 'Wrong label selector in Service spec prevents traffic routing',
      difficulty: 'Beginner',
      category: 'Networking',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Users cannot access the application through the service endpoint',
      skills: ['Services', 'Label Selectors', 'Pod Labels'],
      problem: 'Service selector labels do not match the pod labels',
      realWorldContext: 'Mismatched selectors are extremely common and break service discovery in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-application
  template:
    metadata:
      labels:
        app: web-application
    spec:
      containers:
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web-app  # This doesn't match the pod labels!
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP`,
      hints: [
        'Compare the service selector with the pod labels',
        'Service selector must exactly match pod labels',
        'Check both the deployment template labels and service selector',
        'The service selector should be "app: web-application"'
      ],
      solution: 'Change the service selector from "app: web-app" to "app: web-application" to match the pod labels'
    },
    {
      id: 3,
      title: 'App Not Accessible Externally',
      description: 'Service type is ClusterIP, not NodePort or LoadBalancer',
      difficulty: 'Beginner',
      category: 'Networking',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Application works internally but cannot be accessed from outside the cluster',
      skills: ['Service Types', 'External Access', 'NodePort'],
      problem: 'Service is using ClusterIP which only allows internal cluster access',
      realWorldContext: 'Understanding service types is crucial for exposing applications to external users',
      brokenYaml: `apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP  # This only allows internal access
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 80`,
      hints: [
        'Check the service type - what types allow external access?',
        'ClusterIP only allows internal cluster communication',
        'NodePort or LoadBalancer types allow external access',
        'Change the service type to NodePort and add a nodePort'
      ],
      solution: 'Change service type to NodePort and add a nodePort field for external access'
    },
    {
      id: 4,
      title: 'Missing ConfigMap',
      description: 'App refers to non-existent ConfigMap causing startup failure',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Application pod fails to start because it cannot find required configuration',
      skills: ['ConfigMaps', 'Environment Variables', 'Dependencies'],
      problem: 'Pod references a ConfigMap that does not exist in the cluster',
      realWorldContext: 'Missing configuration dependencies are common when deploying applications across environments',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: nginx:latest
        envFrom:
        - configMapRef:
            name: app-config  # This ConfigMap doesn't exist!
        ports:
        - containerPort: 80`,
      hints: [
        'Check if the ConfigMap referenced by the pod actually exists',
        'The pod is trying to load environment variables from "app-config"',
        'You need to create the missing ConfigMap',
        'Create a ConfigMap with some basic configuration data'
      ],
      solution: 'Create the missing ConfigMap with the name "app-config" and some configuration data'
    },
    {
      id: 5,
      title: 'Secret Not Mounted',
      description: 'Volume mount path or key name incorrect for secret access',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '18 min',
      completed: false,
      locked: false,
      scenario: 'Application cannot access database credentials stored in a secret',
      skills: ['Secrets', 'Volume Mounts', 'File Permissions'],
      problem: 'Secret volume mount configuration is incorrect',
      realWorldContext: 'Proper secret mounting is critical for secure credential management in production',
      brokenYaml: `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQ=
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: nginx:latest
        volumeMounts:
        - name: db-secret
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: db-secret
        secret:
          secretName: db-secret  # Wrong secret name!`,
      hints: [
        'Check if the secret name in the volume matches the actual secret name',
        'The volume references "db-secret" but the secret is named "db-credentials"',
        'Secret names must match exactly between the volume and the actual secret',
        'Fix the secretName in the volume definition'
      ],
      solution: 'Change the secretName in the volume from "db-secret" to "db-credentials"'
    },

    // Intermediate Challenges
    {
      id: 6,
      title: 'Readiness Probe Failing',
      description: 'Probe URL or port is incorrect causing pod to never become ready',
      difficulty: 'Intermediate',
      category: 'Debugging',
      estimatedTime: '20 min',
      completed: false,
      locked: false,
      scenario: 'Pods are running but never become ready, blocking traffic',
      skills: ['Health Checks', 'Readiness Probes', 'HTTP Endpoints'],
      problem: 'Readiness probe is checking wrong endpoint or port',
      realWorldContext: 'Incorrect health checks prevent pods from receiving traffic in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app
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
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /health  # This endpoint doesn't exist in nginx
            port: 8080     # Wrong port
          initialDelaySeconds: 5
          periodSeconds: 10`,
      hints: [
        'Check if the readiness probe path exists on the nginx server',
        'Verify the port number matches the container port',
        'Nginx serves content on port 80, not 8080',
        'Try using "/" path instead of "/health" for nginx'
      ],
      solution: 'Fix the readiness probe to use the correct path "/" and port 80'
    },
    {
      id: 7,
      title: 'ImagePullBackOff',
      description: 'Typo in image name or unauthenticated private repo access',
      difficulty: 'Intermediate',
      category: 'Debugging',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Pods cannot start because the container image cannot be pulled',
      skills: ['Container Images', 'Image Pull Policies', 'Registry Access'],
      problem: 'Image name contains a typo making it impossible to pull',
      realWorldContext: 'Image pull failures are common when deploying with incorrect image tags or private registries',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginxx:latest  # Typo in image name!
        ports:
        - containerPort: 80`,
      hints: [
        'Check the image name carefully for any typos',
        'The image name "nginxx" is not correct',
        'The correct nginx image name is "nginx"',
        'Fix the typo in the image name'
      ],
      solution: 'Correct the image name from "nginxx:latest" to "nginx:latest"'
    },
    {
      id: 8,
      title: 'Pod Stuck in Pending',
      description: 'No nodes match resource request (e.g., 4 CPUs)',
      difficulty: 'Intermediate',
      category: 'Resource Management',
      estimatedTime: '25 min',
      completed: false,
      locked: false,
      scenario: 'Pod remains in Pending state and never gets scheduled to a node',
      skills: ['Resource Requests', 'Node Capacity', 'Scheduling'],
      problem: 'Pod requests more resources than available on any node',
      realWorldContext: 'Resource constraints prevent pod scheduling in resource-limited clusters',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: resource-heavy-pod
  labels:
    app: heavy-app
spec:
  containers:
  - name: app
    image: nginx:latest
    resources:
      requests:
        cpu: "4"      # Requesting 4 CPUs
        memory: "8Gi" # Requesting 8GB RAM
      limits:
        cpu: "4"
        memory: "8Gi"
    ports:
    - containerPort: 80`,
      hints: [
        'Check the resource requests - are they too high?',
        'Most development clusters have limited CPU and memory',
        'Try reducing the CPU request to 100m and memory to 128Mi',
        'Resource requests should match what the application actually needs'
      ],
      solution: 'Reduce resource requests to reasonable values like 100m CPU and 128Mi memory'
    },
    {
      id: 9,
      title: 'Wrong Environment Variable',
      description: 'Missing or incorrect env key in Deployment causing app failure',
      difficulty: 'Intermediate',
      category: 'Configuration',
      estimatedTime: '18 min',
      completed: false,
      locked: false,
      scenario: 'Application starts but fails to function due to missing configuration',
      skills: ['Environment Variables', 'Application Configuration', 'Debugging'],
      problem: 'Required environment variable is missing or has wrong value',
      realWorldContext: 'Environment variable misconfigurations cause many production application failures',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app
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
        command: ["node", "server.js"]
        env:
        - name: NODE_ENV
          value: "development"
        - name: DATABASE_URL
          value: ""  # Empty database URL!
        - name: PORT
          value: "3000"
        ports:
        - containerPort: 3000`,
      hints: [
        'Check all environment variables for missing or empty values',
        'The DATABASE_URL is empty which will cause connection failures',
        'Applications typically need valid database connection strings',
        'Set a proper DATABASE_URL value'
      ],
      solution: 'Set a valid DATABASE_URL environment variable value'
    },
    {
      id: 10,
      title: 'Liveness Probe Causes Pod Restart',
      description: 'Probe too aggressive or wrong port causing unnecessary restarts',
      difficulty: 'Intermediate',
      category: 'Debugging',
      estimatedTime: '22 min',
      completed: false,
      locked: false,
      scenario: 'Pods keep restarting due to failing liveness probes',
      skills: ['Liveness Probes', 'Health Checks', 'Probe Tuning'],
      problem: 'Liveness probe configuration is too aggressive or incorrect',
      realWorldContext: 'Poorly configured liveness probes cause unnecessary pod restarts in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: slow-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: slow-app
  template:
    metadata:
      labels:
        app: slow-app
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
          initialDelaySeconds: 1  # Too short for app startup
          periodSeconds: 5        # Too frequent
          timeoutSeconds: 1       # Too short timeout
          failureThreshold: 1     # Too sensitive`,
      hints: [
        'Check if the liveness probe timing is too aggressive',
        'Applications need time to start up before health checks',
        'Increase initialDelaySeconds to give the app time to start',
        'Consider increasing timeoutSeconds and failureThreshold'
      ],
      solution: 'Adjust liveness probe timing to be less aggressive (higher delays and thresholds)'
    },

    // Advanced Challenges
    {
      id: 11,
      title: 'Broken Ingress Route',
      description: 'Incorrect path, host, or service name in ingress configuration',
      difficulty: 'Advanced',
      category: 'Networking',
      estimatedTime: '30 min',
      completed: false,
      locked: false,
      scenario: 'External users get 404 errors when accessing the application through ingress',
      skills: ['Ingress', 'HTTP Routing', 'Service Discovery'],
      problem: 'Ingress configuration has multiple issues preventing proper routing',
      realWorldContext: 'Ingress misconfigurations are complex and affect external user access',
      brokenYaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /api
        pathType: Exact  # Should be Prefix for /api/*
        backend:
          service:
            name: api-svc  # Service doesn't exist
            port:
              number: 80
---
apiVersion: v1
kind: Service
metadata:
  name: api-service  # Name mismatch with ingress
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 3000`,
      hints: [
        'Check if the service name in ingress matches the actual service name',
        'Look at the path type - should it be Exact or Prefix for API routes?',
        'Verify the service port configuration matches the target port',
        'The ingress references "api-svc" but the service is named "api-service"'
      ],
      solution: 'Fix service name mismatch and change pathType from Exact to Prefix'
    },
    {
      id: 12,
      title: 'HPA Not Scaling',
      description: 'Metrics server not available or no CPU limits set',
      difficulty: 'Advanced',
      category: 'Autoscaling',
      estimatedTime: '35 min',
      completed: false,
      locked: false,
      scenario: 'Application is under high load but HPA is not scaling up pods',
      skills: ['HPA', 'Metrics Server', 'Resource Requests', 'Autoscaling'],
      problem: 'HPA cannot function without proper resource requests and metrics',
      realWorldContext: 'Autoscaling failures prevent applications from handling traffic spikes',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 80
        # Missing resource requests!
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
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
        averageUtilization: 70`,
      hints: [
        'Check if the pods have resource requests defined',
        'HPA needs resource requests to calculate CPU utilization percentage',
        'Verify that metrics server is running and collecting metrics',
        'Add CPU and memory requests to the deployment'
      ],
      solution: 'Add resource requests to the deployment so HPA can calculate utilization'
    },
    {
      id: 13,
      title: 'RBAC Access Denied',
      description: 'ServiceAccount lacks required RoleBinding for API access',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '40 min',
      completed: false,
      locked: false,
      scenario: 'Application pods cannot access Kubernetes API due to insufficient permissions',
      skills: ['RBAC', 'ServiceAccounts', 'Roles', 'API Permissions'],
      problem: 'Service account role doesn\'t have required permissions for the application to function',
      realWorldContext: 'RBAC issues are common when applications need to interact with the Kubernetes API',
      brokenYaml: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: app-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get"]  # Missing list, watch, create permissions
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: app-service-account
  namespace: default
roleRef:
  kind: Role
  name: app-role
  apiGroup: rbac.authorization.k8s.io`,
      hints: [
        'Check what permissions the application actually needs',
        'Verify if the role has sufficient verbs for the required operations',
        'Look at the API groups and resources the application is trying to access',
        'The application likely needs "list" and "watch" permissions on pods'
      ],
      solution: 'Add missing permissions like "list", "watch" and potentially "create" to the role'
    },
    {
      id: 14,
      title: 'NetworkPolicy Blocks All Traffic',
      description: 'No allow policy, so default deny applies blocking communication',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '35 min',
      completed: false,
      locked: false,
      scenario: 'Microservices cannot communicate after implementing network policies',
      skills: ['Network Policies', 'Pod Selectors', 'Traffic Rules'],
      problem: 'Network policy is blocking legitimate traffic between services',
      realWorldContext: 'Network policies are essential for zero-trust security but can break communication if misconfigured',
      brokenYaml: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}  # Applies to all pods
  policyTypes:
  - Ingress
  - Egress
  # No ingress or egress rules = deny all traffic!
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
        image: nginx:latest
        ports:
        - containerPort: 80`,
      hints: [
        'Check if the network policy has any allow rules',
        'A network policy with no ingress/egress rules blocks all traffic',
        'You need to add specific allow rules for required communication',
        'Consider which pods need to communicate with each other'
      ],
      solution: 'Add appropriate ingress and egress rules to allow necessary traffic'
    },
    {
      id: 15,
      title: 'PersistentVolume Not Bound',
      description: 'PVC and PV mismatch on storageClassName or size',
      difficulty: 'Advanced',
      category: 'Storage',
      estimatedTime: '30 min',
      completed: false,
      locked: false,
      scenario: 'StatefulSet pods are stuck because persistent volumes cannot be bound',
      skills: ['PersistentVolumes', 'StorageClasses', 'StatefulSets'],
      problem: 'PVC cannot bind to PV due to mismatched storage class and access modes',
      realWorldContext: 'Storage issues are critical in production databases and stateful applications',
      brokenYaml: `apiVersion: v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: database-headless
  replicas: 3
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
        env:
        - name: POSTGRES_DB
          value: mydb
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteMany"]  # Wrong access mode for EBS
      storageClassName: standard  # Wrong storage class
      resources:
        requests:
          storage: 10Gi`,
      hints: [
        'Check if the storage class exists and matches what\'s requested',
        'Verify the access mode is compatible with the storage type',
        'EBS volumes typically only support ReadWriteOnce access mode',
        'The storage class should be "fast-ssd" not "standard"'
      ],
      solution: 'Fix storage class name and change access mode to ReadWriteOnce'
    },

    // NEW BEGINNER CHALLENGES (20)
    {
      id: 21,
      title: 'Wrong Container Port',
      description: 'App defined port is not exposed in container spec',
      difficulty: 'Beginner',
      category: 'Networking',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Application runs but cannot receive traffic due to port mismatch',
      skills: ['Container Ports', 'Service Configuration', 'Port Mapping'],
      problem: 'Container port in deployment does not match the port the application listens on',
      realWorldContext: 'Port mismatches are common when containerizing applications',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 8080  # nginx runs on port 80, not 8080
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080`,
      hints: [
        'Check what port nginx actually runs on',
        'Container port should match the application port',
        'nginx default port is 80, not 8080',
        'Update containerPort to match nginx default'
      ],
      solution: 'Change containerPort from 8080 to 80 to match nginx default port'
    },
    {
      id: 22,
      title: 'No Resource Limits',
      description: 'Pod consumes too much CPU and crashes other apps',
      difficulty: 'Beginner',
      category: 'Resource Management',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Pod consumes excessive resources causing node instability',
      skills: ['Resource Limits', 'Resource Requests', 'QoS Classes'],
      problem: 'Pod has no resource limits allowing it to consume unlimited CPU/memory',
      realWorldContext: 'Resource limits prevent noisy neighbor problems in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-intensive-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        # No resource limits or requests defined`,
      hints: [
        'Add resource requests and limits to the container',
        'CPU limits prevent excessive CPU usage',
        'Memory limits prevent OOM issues',
        'Use reasonable values like 100m CPU and 128Mi memory'
      ],
      solution: 'Add resource requests and limits to prevent excessive resource consumption'
    },
    {
      id: 23,
      title: 'Forgotten VolumeMount',
      description: 'Pod declares volume but forgets to mount it',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'Application cannot access configuration data despite volume being declared',
      skills: ['Volumes', 'Volume Mounts', 'ConfigMaps'],
      problem: 'Volume is declared in pod spec but not mounted in container',
      realWorldContext: 'Forgetting volume mounts is a common configuration error',
      brokenYaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  config.yaml: |
    database:
      host: db.example.com
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        # Missing volumeMounts section
      volumes:
      - name: config-volume
        configMap:
          name: app-config`,
      hints: [
        'Volume is declared but not mounted in container',
        'Add volumeMounts section to container spec',
        'Mount the config-volume to a path like /etc/config',
        'Container needs volumeMounts to access the volume'
      ],
      solution: 'Add volumeMounts section to container to mount the declared volume'
    },
    {
      id: 24,
      title: 'Bad Label Selector',
      description: 'Deployment selector doesn\'t match pod labels',
      difficulty: 'Beginner',
      category: 'Networking',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Deployment creates no pods due to selector mismatch',
      skills: ['Label Selectors', 'Pod Labels', 'Deployments'],
      problem: 'Deployment selector does not match the pod template labels',
      realWorldContext: 'Selector mismatches prevent deployments from managing pods',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend  # This doesn't match template labels
  template:
    metadata:
      labels:
        app: web-app  # Different from selector
    spec:
      containers:
      - name: web
        image: nginx:latest`,
      hints: [
        'Compare deployment selector with template labels',
        'Selector and template labels must match exactly',
        'Either change selector to "app: web-app" or template to "app: frontend"',
        'Deployment uses selector to find its pods'
      ],
      solution: 'Make deployment selector match template labels (both should use same app label)'
    },
    {
      id: 25,
      title: 'Missing Service',
      description: 'Pod runs but no Service exposes it',
      difficulty: 'Beginner',
      category: 'Networking',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'Application pods are running but cannot be accessed',
      skills: ['Services', 'Service Discovery', 'Pod Exposure'],
      problem: 'Pods are running but no service exists to expose them',
      realWorldContext: 'Services are required to make pods accessible within the cluster',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 80
# Missing Service definition`,
      hints: [
        'Pods are running but not accessible',
        'Create a Service to expose the pods',
        'Service selector should match pod labels (app: web)',
        'Service should target port 80'
      ],
      solution: 'Create a Service with selector matching pod labels to expose the application'
    },
    {
      id: 26,
      title: 'Duplicate Port Numbers',
      description: 'Pod declares multiple ports with same number',
      difficulty: 'Beginner',
      category: 'YAML/Debug',
      estimatedTime: '6 min',
      completed: false,
      locked: false,
      scenario: 'Pod fails to start due to port conflict in specification',
      skills: ['Port Configuration', 'YAML Validation', 'Container Ports'],
      problem: 'Container declares the same port number multiple times',
      realWorldContext: 'Port conflicts in YAML cause pod creation failures',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
spec:
  containers:
  - name: web
    image: nginx:latest
    ports:
    - containerPort: 80
      name: http
    - containerPort: 80  # Duplicate port number
      name: metrics`,
      hints: [
        'Check for duplicate port numbers in container spec',
        'Each port number can only be declared once per container',
        'Change one of the port numbers to something different',
        'Metrics port could be 8080 or 9090'
      ],
      solution: 'Change duplicate port number to a different value (e.g., 8080 for metrics)'
    },
    {
      id: 27,
      title: 'Wrong Volume Type',
      description: 'Deployment expects PVC but uses emptyDir',
      difficulty: 'Beginner',
      category: 'Storage',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Application data is lost when pod restarts',
      skills: ['Volume Types', 'Persistent Storage', 'EmptyDir vs PVC'],
      problem: 'Using emptyDir instead of PVC causes data loss on pod restart',
      realWorldContext: 'Wrong volume types lead to data loss in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: postgres:13
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: data
        emptyDir: {}  # Data will be lost on pod restart`,
      hints: [
        'emptyDir volumes are ephemeral and lose data on restart',
        'Database needs persistent storage',
        'Replace emptyDir with persistentVolumeClaim',
        'Create a PVC for persistent data storage'
      ],
      solution: 'Replace emptyDir with persistentVolumeClaim to ensure data persistence'
    },
    {
      id: 28,
      title: 'Crash from Bad ENV',
      description: 'Pod uses undefined environment variable',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Application crashes on startup due to missing environment variable',
      skills: ['Environment Variables', 'ConfigMaps', 'Application Configuration'],
      problem: 'Application expects environment variable that is not defined',
      realWorldContext: 'Missing environment variables are common causes of startup failures',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db_url  # This key doesn't exist in ConfigMap
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432/app"  # Key name mismatch`,
      hints: [
        'Check ConfigMap key names match environment variable references',
        'ConfigMap has "database_url" but env references "db_url"',
        'Either fix the key name in ConfigMap or env reference',
        'Key names are case-sensitive'
      ],
      solution: 'Fix key name mismatch between ConfigMap and environment variable reference'
    },
    {
      id: 29,
      title: 'Image Tag "latest" Problem',
      description: 'Updating latest image doesn\'t trigger Deployment',
      difficulty: 'Beginner',
      category: 'Best Practices',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'New image version deployed but pods still run old version',
      skills: ['Image Tags', 'Deployment Updates', 'Best Practices'],
      problem: 'Using "latest" tag prevents proper deployment updates',
      realWorldContext: 'Latest tag causes unpredictable deployments in production',
      brokenYaml: `apiVersion: apps/v1
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
      - name: web
        image: myapp:latest  # Using latest tag
        imagePullPolicy: IfNotPresent`,
      hints: [
        'Using "latest" tag with IfNotPresent policy prevents updates',
        'Kubernetes won\'t pull new "latest" images if one exists locally',
        'Use specific version tags instead of "latest"',
        'Or change imagePullPolicy to Always'
      ],
      solution: 'Use specific version tags (e.g., myapp:v1.2.3) instead of "latest" for predictable deployments'
    },
    {
      id: 30,
      title: 'Secret in Wrong Namespace',
      description: 'Pod references secret from a different namespace',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Pod fails to start due to missing secret reference',
      skills: ['Namespaces', 'Secrets', 'Resource References'],
      problem: 'Pod tries to reference secret from different namespace',
      realWorldContext: 'Cross-namespace resource references are not allowed by default',
      brokenYaml: `apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: production  # Secret is in production namespace
data:
  password: cGFzc3dvcmQ=
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: development  # Deployment is in development namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret  # Can't access secret from different namespace
              key: password`,
      hints: [
        'Pods can only access secrets in the same namespace',
        'Secret is in "production" but pod is in "development"',
        'Move secret to same namespace as pod',
        'Or move pod to same namespace as secret'
      ],
      solution: 'Move secret to same namespace as the pod or vice versa'
    },
    {
      id: 31,
      title: 'Missing Entrypoint',
      description: 'Container has no entrypoint; crashes',
      difficulty: 'Beginner',
      category: 'Debugging',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'Custom container image crashes immediately on startup',
      skills: ['Container Images', 'Entrypoints', 'Commands'],
      problem: 'Container image has no default entrypoint or command',
      realWorldContext: 'Custom images need proper entrypoints to run successfully',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: custom-app
spec:
  containers:
  - name: app
    image: alpine:latest  # Alpine has no default command
    # Missing command or args`,
      hints: [
        'Alpine image has no default command to run',
        'Container exits immediately without a command',
        'Add command to keep container running',
        'Use command like ["sleep", "3600"] for testing'
      ],
      solution: 'Add command or args to provide an entrypoint for the container'
    },
    {
      id: 32,
      title: 'Wrong Image Pull Policy',
      description: 'Image is cached and not pulled freshly',
      difficulty: 'Beginner',
      category: 'Debugging',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Updated image not being used despite new version available',
      skills: ['Image Pull Policy', 'Image Caching', 'Container Updates'],
      problem: 'Image pull policy prevents fetching updated images',
      realWorldContext: 'Wrong pull policies can cause stale images in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myapp:v1.0.0
        imagePullPolicy: Never  # Never pulls from registry`,
      hints: [
        'imagePullPolicy: Never prevents pulling from registry',
        'Change to Always or IfNotPresent',
        'Always ensures latest version is pulled',
        'IfNotPresent pulls only if image not present locally'
      ],
      solution: 'Change imagePullPolicy from Never to Always or IfNotPresent'
    },
    {
      id: 33,
      title: 'Namespace Missing',
      description: 'YAML applies to missing namespace',
      difficulty: 'Beginner',
      category: 'Debugging',
      estimatedTime: '6 min',
      completed: false,
      locked: false,
      scenario: 'Resource creation fails due to non-existent namespace',
      skills: ['Namespaces', 'Resource Creation', 'YAML Validation'],
      problem: 'Trying to create resources in namespace that doesn\'t exist',
      realWorldContext: 'Namespace must exist before creating resources in it',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: non-existent-namespace  # This namespace doesn't exist
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest`,
      hints: [
        'Namespace must exist before creating resources in it',
        'Create the namespace first',
        'Use "kubectl create namespace non-existent-namespace"',
        'Or remove namespace field to use default namespace'
      ],
      solution: 'Create the namespace first or use an existing namespace'
    },
    {
      id: 34,
      title: 'Init Container Fails',
      description: 'Init container exits with error',
      difficulty: 'Beginner',
      category: 'Debugging',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Pod stuck in Init state due to failing init container',
      skills: ['Init Containers', 'Container Lifecycle', 'Debugging'],
      problem: 'Init container has incorrect command causing it to fail',
      realWorldContext: 'Init containers must complete successfully before main containers start',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
spec:
  initContainers:
  - name: init-setup
    image: busybox:latest
    command: ['sh', '-c', 'invalid-command']  # This command will fail
  containers:
  - name: web
    image: nginx:latest`,
      hints: [
        'Init container command is invalid',
        'Check init container logs for error details',
        'Fix the command in init container',
        'Use valid busybox commands like "echo" or "sleep"'
      ],
      solution: 'Fix the invalid command in init container to a valid one'
    },
    {
      id: 35,
      title: 'Wrong ConfigMap Key',
      description: 'App fails due to missing key in ConfigMap',
      difficulty: 'Beginner',
      category: 'Configuration',
      estimatedTime: '8 min',
      completed: false,
      locked: false,
      scenario: 'Application crashes because expected configuration key is missing',
      skills: ['ConfigMaps', 'Environment Variables', 'Key References'],
      problem: 'Environment variable references non-existent ConfigMap key',
      realWorldContext: 'ConfigMap key mismatches cause application startup failures',
      brokenYaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "db.example.com"
  database_port: "5432"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db_host  # Key doesn't exist, should be database_host`,
      hints: [
        'ConfigMap key "db_host" doesn\'t exist',
        'Available keys are "database_host" and "database_port"',
        'Fix the key reference to match ConfigMap data',
        'Change "db_host" to "database_host"'
      ],
      solution: 'Change ConfigMap key reference from "db_host" to "database_host"'
    },
    {
      id: 36,
      title: 'Excessive Log Volume',
      description: 'App writes huge logs, hitting node disk limit',
      difficulty: 'Beginner',
      category: 'Observability',
      estimatedTime: '10 min',
      completed: false,
      locked: false,
      scenario: 'Node runs out of disk space due to excessive container logs',
      skills: ['Logging', 'Resource Management', 'Log Rotation'],
      problem: 'Application generates too many logs without proper limits',
      realWorldContext: 'Excessive logging can fill up node disk space in production',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: verbose-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: verbose
  template:
    metadata:
      labels:
        app: verbose
    spec:
      containers:
      - name: app
        image: busybox:latest
        command: ['sh', '-c', 'while true; do echo "Generating lots of logs..."; done']
        # No log limits or rotation configured`,
      hints: [
        'Application generates infinite logs',
        'Add resource limits to control log volume',
        'Consider log rotation policies',
        'Use proper logging levels in application'
      ],
      solution: 'Implement log rotation, reduce log verbosity, or add resource limits'
    },
    {
      id: 37,
      title: 'No Readiness Check',
      description: 'Traffic sent to pods still starting up',
      difficulty: 'Beginner',
      category: 'Observability',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Users get errors because traffic is routed to pods not ready to serve',
      skills: ['Readiness Probes', 'Health Checks', 'Traffic Routing'],
      problem: 'No readiness probe configured to check if pod is ready for traffic',
      realWorldContext: 'Readiness probes prevent traffic to unready pods',
      brokenYaml: `apiVersion: apps/v1
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
      - name: web
        image: nginx:latest
        ports:
        - containerPort: 80
        # Missing readiness probe`,
      hints: [
        'Add readiness probe to check if pod is ready',
        'Use HTTP GET probe on port 80',
        'Probe path could be "/" or "/health"',
        'Readiness probe prevents traffic to unready pods'
      ],
      solution: 'Add readiness probe to ensure pods are ready before receiving traffic'
    },

    // NEW INTERMEDIATE CHALLENGES (20)
    {
      id: 38,
      title: 'Wrong Deployment Strategy',
      description: 'Recreate used instead of RollingUpdate',
      difficulty: 'Intermediate',
      category: 'DevOps',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Application has downtime during updates due to wrong deployment strategy',
      skills: ['Deployment Strategies', 'Rolling Updates', 'Zero Downtime'],
      problem: 'Using Recreate strategy causes downtime during updates',
      realWorldContext: 'Wrong deployment strategy can cause service interruptions',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  strategy:
    type: Recreate  # Causes downtime
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest`,
      hints: [
        'Recreate strategy terminates all pods before creating new ones',
        'This causes downtime during updates',
        'Use RollingUpdate strategy for zero-downtime deployments',
        'Configure maxUnavailable and maxSurge for rolling updates'
      ],
      solution: 'Change strategy from Recreate to RollingUpdate to avoid downtime'
    },
    {
      id: 39,
      title: 'Readiness Probe Uses Wrong Path',
      description: 'App exposes /status, probe hits /healthz',
      difficulty: 'Intermediate',
      category: 'Debugging',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Pods never become ready due to incorrect health check endpoint',
      skills: ['Health Checks', 'Readiness Probes', 'HTTP Endpoints'],
      problem: 'Readiness probe checks wrong endpoint that doesn\'t exist',
      realWorldContext: 'Wrong health check endpoints prevent pods from becoming ready',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app
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
        image: myapi:latest
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /healthz  # App doesn't expose this endpoint
            port: 8080
          # App actually exposes /status endpoint`,
      hints: [
        'Check what health endpoint the application actually exposes',
        'Application exposes /status but probe checks /healthz',
        'Change probe path to match application endpoint',
        'Verify the endpoint returns 200 OK when ready'
      ],
      solution: 'Change readiness probe path from /healthz to /status to match application endpoint'
    },
    {
      id: 40,
      title: 'Resource Starvation',
      description: 'Pod evicted due to memory pressure',
      difficulty: 'Intermediate',
      category: 'Scheduling',
      estimatedTime: '18 min',
      completed: false,
      locked: false,
      scenario: 'Pods get evicted when node runs out of memory',
      skills: ['Resource Management', 'QoS Classes', 'Pod Eviction'],
      problem: 'Pod has no resource requests making it first candidate for eviction',
      realWorldContext: 'Pods without resource requests get evicted first under pressure',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: memory-app
spec:
  replicas: 5
  selector:
    matchLabels:
      app: memory-app
  template:
    metadata:
      labels:
        app: memory-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        # No resource requests or limits - BestEffort QoS`,
      hints: [
        'Pods without resource requests have BestEffort QoS',
        'BestEffort pods are evicted first under memory pressure',
        'Add resource requests to get Burstable QoS',
        'Add both requests and limits for Guaranteed QoS'
      ],
      solution: 'Add resource requests and limits to improve QoS class and reduce eviction risk'
    },
    {
      id: 41,
      title: 'Image Registry Timeout',
      description: 'Private registry takes too long to respond',
      difficulty: 'Intermediate',
      category: 'Networking',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Pod fails to start due to image pull timeout from slow registry',
      skills: ['Image Registries', 'Pull Policies', 'Timeouts'],
      problem: 'Image pull times out due to slow private registry',
      realWorldContext: 'Network issues with registries can prevent pod startup',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: private-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: private-app
  template:
    metadata:
      labels:
        app: private-app
    spec:
      containers:
      - name: app
        image: slow-registry.company.com/myapp:latest
        imagePullPolicy: Always  # Always pulls from slow registry`,
      hints: [
        'Slow registry causes image pull timeouts',
        'Consider using IfNotPresent pull policy',
        'Check registry connectivity and performance',
        'Consider image caching or local registry'
      ],
      solution: 'Change imagePullPolicy to IfNotPresent or fix registry performance issues'
    },
    {
      id: 42,
      title: 'Service Without Selector',
      description: 'Service defined but has no selector',
      difficulty: 'Intermediate',
      category: 'Networking',
      estimatedTime: '12 min',
      completed: false,
      locked: false,
      scenario: 'Service exists but doesn\'t route traffic to any pods',
      skills: ['Services', 'Selectors', 'Endpoints'],
      problem: 'Service has no selector so it doesn\'t automatically create endpoints',
      realWorldContext: 'Services without selectors require manual endpoint management',
      brokenYaml: `apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  ports:
  - port: 80
    targetPort: 80
  # Missing selector - no pods will be selected
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:latest`,
      hints: [
        'Service has no selector to match pods',
        'Add selector to automatically target pods',
        'Selector should match pod labels (app: web)',
        'Without selector, service creates no endpoints'
      ],
      solution: 'Add selector to service to match pod labels and create endpoints automatically'
    },
    {
      id: 43,
      title: 'Invalid HostAlias',
      description: 'Host alias in Pod spec causes DNS resolution errors',
      difficulty: 'Intermediate',
      category: 'Networking',
      estimatedTime: '15 min',
      completed: false,
      locked: false,
      scenario: 'Application cannot resolve hostnames due to incorrect host aliases',
      skills: ['DNS', 'Host Aliases', 'Name Resolution'],
      problem: 'Invalid IP address in hostAliases causes DNS issues',
      realWorldContext: 'Wrong host aliases can break application connectivity',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
spec:
  hostAliases:
  - ip: "invalid-ip-address"  # Invalid IP format
    hostnames:
    - "database.local"
  containers:
  - name: web
    image: nginx:latest`,
      hints: [
        'hostAliases IP must be valid IPv4 or IPv6 address',
        'Current IP "invalid-ip-address" is not valid',
        'Use proper IP format like "192.168.1.100"',
        'Check IP address format and reachability'
      ],
      solution: 'Fix hostAliases IP to use valid IP address format'
    },
    {
      id: 44,
      title: 'Stale PVC Bound',
      description: 'Deleted PVC still bound due to reclaim policy',
      difficulty: 'Intermediate',
      category: 'Storage',
      estimatedTime: '20 min',
      completed: false,
      locked: false,
      scenario: 'Storage space not reclaimed after deleting PVC',
      skills: ['Persistent Volumes', 'Reclaim Policies', 'Storage Management'],
      problem: 'PV reclaim policy prevents automatic cleanup of storage',
      realWorldContext: 'Wrong reclaim policies can waste storage resources',
      brokenYaml: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain  # PV won't be cleaned up
  hostPath:
    path: /data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi`,
      hints: [
        'PV reclaim policy is set to Retain',
        'Retain policy keeps PV after PVC deletion',
        'Change to Delete for automatic cleanup',
        'Or manually clean up retained PVs'
      ],
      solution: 'Change persistentVolumeReclaimPolicy from Retain to Delete for automatic cleanup'
    },
    {
      id: 45,
      title: 'Failing CronJob',
      description: 'CronJob fails silently due to time zone mismatch',
      difficulty: 'Intermediate',
      category: 'Scheduling',
      estimatedTime: '18 min',
      completed: false,
      locked: false,
      scenario: 'Scheduled job runs at wrong time due to timezone issues',
      skills: ['CronJobs', 'Scheduling', 'Timezones'],
      problem: 'CronJob schedule doesn\'t account for timezone differences',
      realWorldContext: 'Timezone issues cause jobs to run at unexpected times',
      brokenYaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-job
spec:
  schedule: "0 2 * * *"  # 2 AM, but in what timezone?
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:latest
            command: ["backup-script.sh"]
          restartPolicy: OnFailure`,
      hints: [
        'CronJob schedule uses cluster timezone by default',
        'Specify timezone explicitly for predictable scheduling',
        'Add timeZone field to CronJob spec',
        'Consider UTC for consistency across regions'
      ],
      solution: 'Add explicit timeZone field to CronJob spec for predictable scheduling'
    },
    {
      id: 46,
      title: 'Affinity Rules Too Strict',
      description: 'Pod never scheduled due to tight affinity rules',
      difficulty: 'Intermediate',
      category: 'Scheduling',
      estimatedTime: '20 min',
      completed: false,
      locked: false,
      scenario: 'Pods remain pending because no nodes satisfy affinity requirements',
      skills: ['Node Affinity', 'Pod Scheduling', 'Node Selection'],
      problem: 'Node affinity rules are too restrictive for available nodes',
      realWorldContext: 'Overly strict affinity rules can prevent pod scheduling',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: strict-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: strict
  template:
    metadata:
      labels:
        app: strict
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node-type
                operator: In
                values: ["gpu-node"]  # No nodes have this label
              - key: zone
                operator: In
                values: ["us-west-1a"]  # Very specific zone
      containers:
      - name: app
        image: nginx:latest`,
      hints: [
        'Node affinity requires nodes with specific labels',
        'Check if nodes actually have required labels',
        'Use preferredDuringScheduling for soft requirements',
        'Relax affinity rules or add required labels to nodes'
      ],
      solution: 'Relax node affinity rules or ensure nodes have required labels'
    },

    // NEW ADVANCED CHALLENGES (20)
    {
      id: 47,
      title: 'NetworkPolicy Misrouting',
      description: 'Policy allows egress to wrong subnet',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '25 min',
      completed: false,
      locked: false,
      scenario: 'Application can access unauthorized networks due to incorrect network policy',
      skills: ['Network Policies', 'Security', 'Network Segmentation'],
      problem: 'NetworkPolicy egress rules allow access to unintended subnets',
      realWorldContext: 'Wrong network policies can create security vulnerabilities',
      brokenYaml: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-netpol
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0  # Allows access to entire internet
        except:
        - 169.254.169.254/32  # Only blocks metadata service`,
      hints: [
        'NetworkPolicy allows egress to entire internet (0.0.0.0/0)',
        'This is too permissive for security',
        'Restrict CIDR to only required networks',
        'Use specific IP blocks for database, APIs, etc.'
      ],
      solution: 'Restrict egress CIDR blocks to only required networks instead of 0.0.0.0/0'
    },
    {
      id: 48,
      title: 'Wrong RBAC for CRDs',
      description: 'Controller can\'t access custom resources',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '30 min',
      completed: false,
      locked: false,
      scenario: 'Custom controller fails to manage custom resources due to insufficient permissions',
      skills: ['RBAC', 'Custom Resources', 'Controllers'],
      problem: 'ServiceAccount lacks permissions to access custom resource definitions',
      realWorldContext: 'RBAC misconfigurations prevent controllers from functioning',
      brokenYaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: controller-role
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
# Missing permissions for custom resources
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: controller-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: controller-role
subjects:
- kind: ServiceAccount
  name: controller-sa
  namespace: default`,
      hints: [
        'Controller needs permissions for custom resources',
        'Add custom resource API group to ClusterRole',
        'Include verbs like create, update, patch, delete',
        'Check what custom resources the controller manages'
      ],
      solution: 'Add custom resource permissions to ClusterRole for controller access'
    },
    {
      id: 49,
      title: 'StatefulSet Ordering Broken',
      description: 'PVCs reused across replicas, causing data mixup',
      difficulty: 'Advanced',
      category: 'Storage',
      estimatedTime: '25 min',
      completed: false,
      locked: false,
      scenario: 'StatefulSet pods get wrong persistent volumes causing data corruption',
      skills: ['StatefulSets', 'Persistent Storage', 'Pod Ordering'],
      problem: 'StatefulSet volumeClaimTemplate doesn\'t create unique PVCs per pod',
      realWorldContext: 'Wrong StatefulSet configuration can cause data corruption',
      brokenYaml: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: database
  replicas: 3
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: db
        image: postgres:13
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  # Missing volumeClaimTemplates - pods share same PVC`,
      hints: [
        'StatefulSet needs volumeClaimTemplates for unique PVCs',
        'Without templates, all pods share same storage',
        'Add volumeClaimTemplates section',
        'Each pod should get its own PVC automatically'
      ],
      solution: 'Add volumeClaimTemplates to create unique PVCs for each StatefulSet pod'
    },
    {
      id: 50,
      title: 'Overprovisioned HPA',
      description: 'HPA scales up to 50 pods, crashing cluster',
      difficulty: 'Advanced',
      category: 'Autoscaling',
      estimatedTime: '20 min',
      completed: false,
      locked: false,
      scenario: 'HPA scales too aggressively causing cluster resource exhaustion',
      skills: ['HPA', 'Resource Management', 'Cluster Capacity'],
      problem: 'HPA maxReplicas set too high for cluster capacity',
      realWorldContext: 'Aggressive scaling can overwhelm cluster resources',
      brokenYaml: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 1
  maxReplicas: 50  # Too high for cluster capacity
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50`,
      hints: [
        'maxReplicas of 50 may exceed cluster capacity',
        'Check cluster node count and resources',
        'Set reasonable maxReplicas based on capacity',
        'Consider resource requests per pod'
      ],
      solution: 'Reduce maxReplicas to reasonable value based on cluster capacity'
    },
    {
      id: 51,
      title: 'ReadWriteOnce Conflict',
      description: '2 pods mount same RWO PVC — one crashes',
      difficulty: 'Advanced',
      category: 'Storage',
      estimatedTime: '22 min',
      completed: false,
      locked: false,
      scenario: 'Multiple pods try to mount ReadWriteOnce volume causing failures',
      skills: ['Persistent Volumes', 'Access Modes', 'Storage Conflicts'],
      problem: 'Multiple pods cannot mount ReadWriteOnce PVC simultaneously',
      realWorldContext: 'RWO volumes can only be mounted by one pod at a time',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: shared-storage-app
spec:
  replicas: 2  # Multiple pods trying to mount RWO volume
  selector:
    matchLabels:
      app: shared-app
  template:
    metadata:
      labels:
        app: shared-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        volumeMounts:
        - name: shared-data
          mountPath: /data
      volumes:
      - name: shared-data
        persistentVolumeClaim:
          claimName: rwo-pvc  # ReadWriteOnce PVC
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: rwo-pvc
spec:
  accessModes:
  - ReadWriteOnce  # Only one pod can mount this
  resources:
    requests:
      storage: 1Gi`,
      hints: [
        'ReadWriteOnce volumes can only be mounted by one pod',
        'Deployment has 2 replicas trying to mount same RWO PVC',
        'Use ReadWriteMany for multi-pod access',
        'Or reduce replicas to 1 for RWO volumes'
      ],
      solution: 'Change access mode to ReadWriteMany or reduce deployment replicas to 1'
    },
    {
      id: 52,
      title: 'Seccomp Blocks Syscall',
      description: 'Pod blocked by seccomp profile',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '28 min',
      completed: false,
      locked: false,
      scenario: 'Application fails due to seccomp profile blocking required system calls',
      skills: ['Security Contexts', 'Seccomp', 'System Calls'],
      problem: 'Seccomp profile blocks system calls needed by application',
      realWorldContext: 'Restrictive seccomp profiles can break application functionality',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: restricted-app
spec:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: profiles/strict.json  # Very restrictive profile
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true`,
      hints: [
        'Seccomp profile may be too restrictive',
        'Check what system calls the application needs',
        'Use RuntimeDefault profile for less restriction',
        'Or create custom profile allowing required syscalls'
      ],
      solution: 'Use less restrictive seccomp profile or allow required system calls'
    },
    {
      id: 53,
      title: 'DNS Overwrites HOSTS File',
      description: 'Pod DNS overrides hardcoded hosts',
      difficulty: 'Advanced',
      category: 'Debugging',
      estimatedTime: '25 min',
      completed: false,
      locked: false,
      scenario: 'Application cannot resolve hostnames due to DNS policy conflicts',
      skills: ['DNS Policy', 'Host Files', 'Name Resolution'],
      problem: 'DNS policy overrides custom host file entries',
      realWorldContext: 'DNS policies can interfere with custom hostname resolution',
      brokenYaml: `apiVersion: v1
kind: Pod
metadata:
  name: custom-dns-app
spec:
  dnsPolicy: ClusterFirst  # Overrides custom hosts
  hostAliases:
  - ip: "192.168.1.100"
    hostnames:
    - "custom-service.local"
  containers:
  - name: app
    image: myapp:latest
    # App expects to resolve custom-service.local`,
      hints: [
        'ClusterFirst DNS policy may override hostAliases',
        'Try None DNS policy for full control',
        'Or use Default to respect host DNS settings',
        'Configure custom DNS servers if needed'
      ],
      solution: 'Change DNS policy to None or Default to respect custom host aliases'
    },
    {
      id: 54,
      title: 'API Rate Limits Hit',
      description: 'App gets 429 Too Many Requests errors',
      difficulty: 'Advanced',
      category: 'Performance',
      estimatedTime: '30 min',
      completed: false,
      locked: false,
      scenario: 'Application overwhelms Kubernetes API server with too many requests',
      skills: ['API Rate Limiting', 'Client Configuration', 'Performance Tuning'],
      problem: 'Application makes too many API calls without proper rate limiting',
      realWorldContext: 'Excessive API calls can overwhelm the Kubernetes API server',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-heavy-app
spec:
  replicas: 10
  selector:
    matchLabels:
      app: api-app
  template:
    metadata:
      labels:
        app: api-app
    spec:
      containers:
      - name: app
        image: kubectl:latest
        command: ['sh', '-c']
        args: ['while true; do kubectl get pods; sleep 0.1; done']  # Too frequent API calls`,
      hints: [
        'Application makes API calls every 0.1 seconds',
        'This overwhelms the API server with requests',
        'Implement proper rate limiting and backoff',
        'Use informers/watchers instead of polling'
      ],
      solution: 'Implement proper rate limiting, use longer intervals, or use watch APIs instead of polling'
    },
    {
      id: 55,
      title: 'PodSecurityPolicy Too Strict',
      description: 'Pod blocked due to privilege constraints',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '25 min',
      completed: false,
      locked: false,
      scenario: 'Pod creation fails due to overly restrictive security policies',
      skills: ['Pod Security Policies', 'Security Contexts', 'Privilege Management'],
      problem: 'PodSecurityPolicy prevents pod from running with required privileges',
      realWorldContext: 'Strict security policies can prevent legitimate workloads',
      brokenYaml: `apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: strict-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  runAsUser:
    rule: MustRunAsNonRoot
  fsGroup:
    rule: RunAsAny
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
---
apiVersion: v1
kind: Pod
metadata:
  name: system-app
spec:
  containers:
  - name: app
    image: system-tool:latest
    securityContext:
      runAsUser: 0  # Needs to run as root but PSP forbids it`,
      hints: [
        'PodSecurityPolicy requires non-root user',
        'Application needs to run as root (user 0)',
        'Either modify PSP to allow root or change app',
        'Consider if root access is really necessary'
      ],
      solution: 'Modify PodSecurityPolicy to allow required privileges or change application to run as non-root'
    },
    {
      id: 56,
      title: 'Custom AdmissionController Rejects Pod',
      description: 'Policy blocks pod for no sidecar',
      difficulty: 'Advanced',
      category: 'Security',
      estimatedTime: '35 min',
      completed: false,
      locked: false,
      scenario: 'Custom admission controller blocks pod creation due to missing sidecar',
      skills: ['Admission Controllers', 'Webhooks', 'Policy Enforcement'],
      problem: 'Admission webhook requires sidecar but pod doesn\'t have one',
      realWorldContext: 'Custom admission controllers enforce organizational policies',
      brokenYaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  # Missing annotation required by admission controller
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
      # Missing: sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: web
        image: nginx:latest
        # Missing required sidecar container`,
      hints: [
        'Admission controller requires sidecar injection',
        'Add required annotation for sidecar injection',
        'Or add sidecar container manually',
        'Check admission controller policy requirements'
      ],
      solution: 'Add required sidecar annotation or container to satisfy admission controller policy'
    }
  ];

  const selectedChallenge = challenges.find(c => c.id === parseInt(selectedChallengeId || '0'));

  // Category styling and icons
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Debugging':
        return {
          bg: 'bg-red-50 border-red-200 hover:bg-red-100',
          icon: '🛠️',
          color: 'text-red-700',
          badge: 'bg-red-100 text-red-700'
        };
      case 'Networking':
        return {
          bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
          icon: '🌐',
          color: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700'
        };
      case 'Storage':
        return {
          bg: 'bg-green-50 border-green-200 hover:bg-green-100',
          icon: '💾',
          color: 'text-green-700',
          badge: 'bg-green-100 text-green-700'
        };
      case 'Security':
        return {
          bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
          icon: '🔒',
          color: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-700'
        };
      case 'YAML/Debug':
        return {
          bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
          icon: '📝',
          color: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-700'
        };
      case 'Performance':
        return {
          bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
          icon: '⚡',
          color: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
          icon: '⚙️',
          color: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  // Skill tag colors
  const getSkillTagStyle = (skill: string) => {
    const skillColors = {
      'Pods': 'bg-blue-100 text-blue-700',
      'Services': 'bg-green-100 text-green-700',
      'Deployments': 'bg-purple-100 text-purple-700',
      'ConfigMaps': 'bg-orange-100 text-orange-700',
      'Secrets': 'bg-red-100 text-red-700',
      'Volumes': 'bg-teal-100 text-teal-700',
      'Networking': 'bg-indigo-100 text-indigo-700',
      'Security': 'bg-pink-100 text-pink-700',
      'YAML': 'bg-yellow-100 text-yellow-700',
      'Debugging': 'bg-red-100 text-red-700'
    };
    return skillColors[skill as keyof typeof skillColors] || 'bg-slate-100 text-slate-700';
  };

  // Progress status
  const getProgressStatus = (challenge: any) => {
    if (challenge.completed) return { icon: '✅', text: 'Completed', color: 'text-green-600' };
    if (challenge.locked) return { icon: '🔒', text: 'Locked', color: 'text-slate-400' };
    return { icon: '⏳', text: 'Available', color: 'text-blue-600' };
  };

  // Filtered challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    const matchesSkill = selectedSkill === 'All' || challenge.skills.includes(selectedSkill);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesSkill;
  });

  // Get unique values for filters
  const categories = ['All', ...Array.from(new Set(challenges.map(c => c.category)))];
  const difficulties = ['All', ...Array.from(new Set(challenges.map(c => c.difficulty)))];
  const skills = ['All', ...Array.from(new Set(challenges.flatMap(c => c.skills)))];

  // Statistics
  const completedCount = challenges.filter(c => c.completed).length;
  const availableCount = challenges.filter(c => !c.locked).length;
  const totalCount = challenges.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Intermediate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Networking': return Network;
      case 'Debugging': return AlertTriangle;
      case 'Configuration': return Settings;
      case 'Storage': return Database;
      case 'Security': return Shield;
      case 'Resource Management': return BarChart3;
      case 'Autoscaling': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Networking': return 'text-blue-600 bg-blue-50';
      case 'Debugging': return 'text-red-600 bg-red-50';
      case 'Configuration': return 'text-purple-600 bg-purple-50';
      case 'Storage': return 'text-indigo-600 bg-indigo-50';
      case 'Security': return 'text-orange-600 bg-orange-50';
      case 'Resource Management': return 'text-emerald-600 bg-emerald-50';
      case 'Autoscaling': return 'text-cyan-600 bg-cyan-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const handleStartChallenge = (challengeId: number) => {
    setSearchParams({ challenge: challengeId.toString() });
    setShowHints(false);
    setHintsRevealed(0);
  };

  const handleBackToChallenges = () => {
    setSearchParams({});
    setShowHints(false);
    setHintsRevealed(0);
  };

  const revealNextHint = () => {
    if (selectedChallenge && hintsRevealed < selectedChallenge.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  if (selectedChallenge) {
    return (
      <div className="h-full flex flex-col">
        {/* Challenge Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToChallenges}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Challenges</span>
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-xl font-bold text-slate-900">{selectedChallenge.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                    {selectedChallenge.difficulty}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedChallenge.category)}`}>
                    {selectedChallenge.category}
                  </span>
                </div>
                <p className="text-slate-600">{selectedChallenge.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints ({hintsRevealed}/{selectedChallenge.hints.length})</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="flex-1 flex">
          {/* Main Challenge Area */}
          <div className="flex-1">
            <ChallengePlayground challenge={selectedChallenge} />
          </div>

          {/* Hints Panel */}
          <AnimatePresence>
            {showHints && (
              <motion.div
                className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Hints & Context</h3>
                  <button
                    onClick={() => setShowHints(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Real-world Context */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💼 Real-World Context</h4>
                  <p className="text-sm text-blue-700">{selectedChallenge.realWorldContext}</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">🎯 Skills Practiced</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progressive Hints */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900">💡 Progressive Hints</h4>
                  {selectedChallenge.hints.map((hint, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        index < hintsRevealed
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-slate-50 border-slate-200 cursor-pointer hover:bg-slate-100'
                      }`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: index < hintsRevealed ? 1 : 0.7 }}
                      onClick={() => index === hintsRevealed && revealNextHint()}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hint {index + 1}
                        </span>
                        {index < hintsRevealed ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : index === hintsRevealed ? (
                          <span className="text-xs text-blue-600 font-medium">Click to reveal</span>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      {index < hintsRevealed ? (
                        <p className="text-sm text-slate-600">{hint}</p>
                      ) : index === hintsRevealed ? (
                        <p className="text-sm text-slate-400">Click to reveal this hint</p>
                      ) : (
                        <p className="text-sm text-slate-400">Complete previous hints first</p>
                      )}
                    </motion.div>
                  ))}

                  {hintsRevealed < selectedChallenge.hints.length && (
                    <button
                      onClick={revealNextHint}
                      className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Reveal Next Hint ({hintsRevealed + 1}/{selectedChallenge.hints.length})
                    </button>
                  )}
                </div>

                {/* Problem Description */}
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-900 mb-2">🔍 Problem Analysis:</h4>
                  <p className="text-sm text-red-700">{selectedChallenge.problem}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const groupedChallenges = {
    beginner: challenges.filter(c => c.difficulty === 'Beginner'),
    intermediate: challenges.filter(c => c.difficulty === 'Intermediate'),
    advanced: challenges.filter(c => c.difficulty === 'Advanced'),
  };

  const stats = [
    { label: 'Completed', value: challenges.filter(c => c.completed).length.toString(), color: 'text-emerald-600' },
    { label: 'Available', value: challenges.filter(c => !c.locked).length.toString(), color: 'text-blue-600' },
    { label: 'Total', value: challenges.length.toString(), color: 'text-slate-600' },
  ];

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
            Debug Challenges
          </h1>
          <p className="text-slate-600">
            Test your Kubernetes troubleshooting skills with real-world production scenarios
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 cursor-pointer hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedSkill('All');
              setSearchQuery('');
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 cursor-pointer hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedSkill('All');
              setSearchQuery('');
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Available</p>
                <p className="text-3xl font-bold text-blue-600">{availableCount}</p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(availableCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedSkill('All');
              setSearchQuery('');
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Total Challenges</p>
                <p className="text-3xl font-bold text-slate-700">{totalCount}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs text-slate-600">Progress:</span>
                  <span className="text-xs font-medium text-slate-700">{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search challenges by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? '🧩 All Categories' : `${getCategoryStyle(category).icon} ${category}`}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'All' ? '📊 All Levels' : `${difficulty}`}
                  </option>
                ))}
              </select>

              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {skills.slice(0, 10).map(skill => (
                  <option key={skill} value={skill}>
                    {skill === 'All' ? '🎯 All Skills' : skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedSkill !== 'All') && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-slate-600">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                  {getCategoryStyle(selectedCategory).icon} {selectedCategory}
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                  {selectedDifficulty}
                </span>
              )}
              {selectedSkill !== 'All' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                  {selectedSkill}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setSelectedSkill('All');
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredChallenges.length} of {totalCount} challenges
          </div>
        </div>

        {/* Challenge Levels */}
        <div className="space-y-8">
          {Object.entries({
            beginner: filteredChallenges.filter(c => c.difficulty === 'Beginner'),
            intermediate: filteredChallenges.filter(c => c.difficulty === 'Intermediate'),
            advanced: filteredChallenges.filter(c => c.difficulty === 'Advanced'),
          }).filter(([level, levelChallenges]) => levelChallenges.length > 0).map(([level, levelChallenges], levelIndex) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: levelIndex * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  level === 'beginner' ? 'bg-emerald-100 text-emerald-600' :
                  level === 'intermediate' ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {level === 'beginner' ? <Star className="w-5 h-5" /> :
                   level === 'intermediate' ? <Target className="w-5 h-5" /> :
                   <Trophy className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 capitalize">{level} Challenges</h2>
                  <p className="text-slate-600">
                    {level === 'beginner' && 'Start with fundamental debugging scenarios'}
                    {level === 'intermediate' && 'Tackle complex configuration and networking issues'}
                    {level === 'advanced' && 'Master production-level incident response'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {levelChallenges.map((challenge, index) => {
                  const CategoryIcon = getCategoryIcon(challenge.category);
                  return (
                    <motion.div
                      key={challenge.id}
                      className={`${getCategoryStyle(challenge.category).bg} rounded-2xl p-6 shadow-sm border transition-all duration-200 ${
                        !challenge.locked ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : 'opacity-60'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (levelIndex * 0.1) + (index * 0.05) }}
                      onClick={() => !challenge.locked && handleStartChallenge(challenge.id)}
                      whileHover={{ y: -2 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {challenge.completed ? (
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center relative">
                              <CheckCircle className="w-7 h-7 text-emerald-600" />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          ) : challenge.locked ? (
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                              <Lock className="w-7 h-7 text-slate-400" />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryStyle(challenge.category).badge}`}>
                              <span className="text-xl">{getCategoryStyle(challenge.category).icon}</span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-lg font-semibold ${getCategoryStyle(challenge.category).color}`}>
                                {challenge.title}
                              </h3>
                              <span className={`${getProgressStatus(challenge).color} text-xs font-medium`}>
                                {getProgressStatus(challenge).icon} {getProgressStatus(challenge).text}
                              </span>
                            </div>
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryStyle(challenge.category).badge}`}>
                              {getCategoryStyle(challenge.category).icon} {challenge.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <div className="text-xs text-slate-500">
                            Challenge #{challenge.id}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-sm mb-4">
                        {challenge.description}
                      </p>

                      {/* Scenario */}
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-slate-900 mb-2">🎯 Scenario:</h4>
                        <p className="text-sm text-slate-600">{challenge.scenario}</p>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${getCategoryStyle(challenge.category).color}`}>
                          🎯 Skills you'll practice:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {challenge.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className={`px-3 py-1 text-xs rounded-full font-medium ${getSkillTagStyle(skill)}`}
                            >
                              {skill}
                            </span>
                          ))}
                          {challenge.skills.length > 4 && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                              +{challenge.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable Preview */}
                      <AnimatePresence>
                        {expandedCard === challenge.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-200 pt-4 mt-4"
                          >
                            <div className="space-y-3">
                              <div>
                                <h5 className={`text-sm font-medium mb-2 ${getCategoryStyle(challenge.category).color}`}>
                                  🎯 Objectives:
                                </h5>
                                <ul className="text-sm text-slate-600 space-y-1">
                                  {challenge.objectives?.map((objective, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>{objective}</span>
                                    </li>
                                  )) || [
                                    <li key="default" className="flex items-start space-x-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>Identify and fix the configuration issue</span>
                                    </li>,
                                    <li key="default2" className="flex items-start space-x-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>Understand the root cause of the problem</span>
                                    </li>
                                  ]}
                                </ul>
                              </div>

                              <div>
                                <h5 className={`text-sm font-medium mb-2 ${getCategoryStyle(challenge.category).color}`}>
                                  📋 Prerequisites:
                                </h5>
                                <div className="text-sm text-slate-600">
                                  Basic understanding of {challenge.skills.slice(0, 2).join(' and ')}
                                </div>
                              </div>

                              {challenge.hints && challenge.hints.length > 0 && (
                                <div>
                                  <h5 className={`text-sm font-medium mb-2 ${getCategoryStyle(challenge.category).color}`}>
                                    💡 Available Hints:
                                  </h5>
                                  <div className="text-sm text-slate-600">
                                    {challenge.hints.length} progressive hints available during the challenge
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{challenge.estimatedTime}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(expandedCard === challenge.id ? null : challenge.id);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            {expandedCard === challenge.id ? 'Hide Details' : 'Show Preview'}
                          </button>
                        </div>

                        {!challenge.locked && (
                          <div className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                            <Play className="w-4 h-4" />
                            <span>{challenge.completed ? 'Retry Challenge' : 'Start Debugging'}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Section */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-800 px-6 py-3 rounded-full border border-purple-200">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Master all challenges to become a Kubernetes debugging expert!</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Challenges;