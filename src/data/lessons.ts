export interface LessonQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LessonAnimation {
  title: string;
  description: string;
  scenes: Array<{
    title: string;
    description: string;
    duration: number;
  }>;
}

export interface LessonContent {
  introduction: string;
  conceptExplanation: string;
  animation: LessonAnimation;
  yamlExample?: {
    title: string;
    code: string;
    explanation: string;
  };
  keyPoints: string[];
  quiz: LessonQuiz[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  tags: string[];
  content: LessonContent;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'What is Kubernetes?',
    description: 'Core idea behind K8s with animated diagrams',
    duration: '10 min',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    tags: ['fundamentals', 'overview', 'introduction'],
    content: {
      introduction: 'Kubernetes is an open-source container orchestration platform designed to automate the deployment, scaling, and operational management of containerized applications.',
      conceptExplanation: `Kubernetes is an open-source container orchestration platform designed to automate the deployment, scaling, and operational management of containerized applications. Initially conceived and developed by Google, it is now a flagship project maintained by the Cloud Native Computing Foundation (CNCF). The primary objective of Kubernetes is to provide a portable, extensible, and self-healing framework for managing workloads and services, thereby abstracting the complexities of the underlying physical or virtual infrastructure.

The evolution of Kubernetes from Google's internal systems, such as Borg, to an open-source CNCF project signifies a broader industry movement towards standardized, community-driven cloud-native technologies. This transition reflects a collective endeavor to address the inherent complexities of distributed systems, fostering enhanced interoperability and mitigating vendor lock-in.`,
      animation: {
        title: 'Kubernetes: The Container Orchestrator',
        description: 'Comprehensive visual introduction to Kubernetes as a powerful orchestrator for containerized applications, highlighting its key benefits',
        scenes: [
          {
            title: 'The Problem - Manual Management',
            description: 'A chaotic scene with individual "App Containers" (represented as small boxes) floating aimlessly. A human hand tries to manually place them on multiple "Servers" (simple server rack icons), but containers keep falling off or crashing. A "Scalability" graph sputters, and "Reliability" shows red crosses.',
            duration: 4000
          },
          {
            title: 'Introducing Kubernetes - The Orchestrator',
            description: 'A vibrant "Kubernetes Logo" appears, then transforms into a central "Orchestration Hub" (a stylized conductor or maestro icon). The chaotic containers are drawn towards it.',
            duration: 3000
          },
          {
            title: 'Automation in Action',
            description: 'The "Orchestration Hub" sends instructions. Containers neatly arrange themselves into "Pods" (small capsules), which are then automatically placed onto various "Nodes" (server racks). Arrows show continuous monitoring and adjustment.',
            duration: 4000
          },
          {
            title: 'Key Benefits - Scalability',
            description: 'A "Traffic Spike" icon appears. The Orchestration Hub automatically duplicates running Pods, adding more to Nodes to handle the load. The "Scalability" graph now shows a smooth, upward curve.',
            duration: 3000
          },
          {
            title: 'Key Benefits - Resilience',
            description: 'One of the "Nodes" briefly glitches or disappears. The Orchestration Hub immediately detects this, and the Pods from the failed node are seamlessly (and quickly) moved to healthy nodes. The "Reliability" graph shows green checkmarks.',
            duration: 3000
          },
          {
            title: 'Key Benefits - Portability',
            description: 'The Orchestration Hub and Nodes are shown in different environments: a "Cloud Icon" (e.g., AWS, GCP, Azure), then an "On-Premise Server" icon, then a "Laptop" icon. The Pods seamlessly move between these environments.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'The "Kubernetes Logo" reappears, surrounded by icons representing "Scalability," "Resilience," "Automation," "Portability."',
            duration: 2000
          }
        ]
      },
      keyPoints: [
        'Kubernetes is an open-source container orchestration platform',
        'It automates deployment, scaling, and management of containerized applications',
        'Originally developed by Google, now maintained by CNCF',
        'Provides portable, extensible, and self-healing framework',
        'Abstracts complexities of underlying infrastructure'
      ],
      quiz: [
        {
          question: 'What is the primary purpose of Kubernetes?',
          options: [
            'To develop programming languages',
            'To manage virtual machines',
            'To automate the deployment and management of containerized applications',
            'To provide a storage management system'
          ],
          correct: 2,
          explanation: 'Kubernetes is an orchestration platform specifically designed to handle the lifecycle of containerized applications, from deployment to scaling and self-healing.'
        },
        {
          question: 'Kubernetes was originally developed by which company?',
          options: [
            'Microsoft',
            'Amazon',
            'Google',
            'IBM'
          ],
          correct: 2,
          explanation: 'Kubernetes originated from Google\'s internal systems and was later open-sourced.'
        },
        {
          question: 'Which organization currently maintains Kubernetes as a flagship project?',
          options: [
            'OpenStack Foundation',
            'Linux Foundation',
            'Cloud Native Computing Foundation (CNCF)',
            'Apache Software Foundation'
          ],
          correct: 2,
          explanation: 'Kubernetes is a graduated project under the Cloud Native Computing Foundation (CNCF), indicating its maturity and widespread adoption.'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Declarative vs. Imperative Management',
    description: 'Understanding the fundamental approach of Kubernetes',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'Core Concepts',
    tags: ['declarative', 'imperative', 'management', 'yaml'],
    content: {
      introduction: 'Kubernetes fundamentally operates on a declarative model, where users define the desired state of their applications and infrastructure using manifest files.',
      conceptExplanation: `Kubernetes fundamentally operates on a declarative model, where users define the desired state of their applications and infrastructure using manifest files, typically in YAML or JSON format. The Kubernetes control plane continuously works to reconcile the actual state of the cluster with this declared desired state. This approach means that users specify what they want the system to achieve, rather than providing explicit step-by-step instructions on how to achieve it.

While imperative commands, such as kubectl run or kubectl create, can be employed for quick, ad-hoc operations, the declarative approach is universally recommended for managing complex, version-controlled deployments. The strong emphasis on declarative configuration represents a foundational design philosophy that underpins Kubernetes' inherent self-healing and automation capabilities.`,
      animation: {
        title: 'Declarative vs Imperative Cooking',
        description: 'Compare declarative and imperative approaches using a cooking analogy',
        scenes: [
          {
            title: 'Imperative - The Chef\'s Instructions',
            description: 'Show a chef (user) giving very specific, step-by-step instructions to a robot chef (Kubernetes). "First, chop the onions. Then, sauté them for 5 minutes. Next, add the tomatoes..."',
            duration: 4000
          },
          {
            title: 'Declarative - The Recipe Book',
            description: 'Transition to the chef (user) simply handing the robot chef a complete, detailed recipe book (YAML manifest) that describes the desired outcome: "A delicious lasagna."',
            duration: 3000
          },
          {
            title: 'Self-Healing in Action',
            description: 'Show the robot chef making a mistake (e.g., burning a corner of the lasagna). Instead of the human chef intervening, the robot chef automatically detects the deviation and corrects it.',
            duration: 4000
          },
          {
            title: 'Version Control (GitOps)',
            description: 'Show multiple recipe books (different versions of the desired state) stored neatly in a library (Git repository). The chef can easily pick any previous version.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Declarative Pod Definition',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: web
spec:
  containers:
  - name: web
    image: nginx:1.20
    ports:
    - containerPort: 80`,
        explanation: 'This YAML manifest declares the desired state: a Pod named "my-app" running nginx. Kubernetes will ensure this state is maintained.'
      },
      keyPoints: [
        'Declarative: Define "what" you want, not "how" to achieve it',
        'Kubernetes continuously reconciles actual state with desired state',
        'YAML/JSON manifests serve as the single source of truth',
        'Enables GitOps workflows and version control',
        'Self-healing capabilities through continuous reconciliation'
      ],
      quiz: [
        {
          question: 'In a declarative management model, what does the user primarily define?',
          options: [
            'Step-by-step instructions on how to achieve a state',
            'The desired state of the system',
            'The current actual state of the system',
            'Imperative commands for immediate execution'
          ],
          correct: 1,
          explanation: 'Declarative management focuses on defining "what" the system should look like, and Kubernetes works to achieve and maintain that state.'
        },
        {
          question: 'Which of the following is a key benefit of Kubernetes\' declarative approach?',
          options: [
            'It requires constant manual intervention for updates',
            'It makes rollbacks more complex and time-consuming',
            'It enables self-healing and automated reconciliation of the cluster state',
            'It only supports simple, single-container applications'
          ],
          correct: 2,
          explanation: 'The declarative model allows Kubernetes to continuously monitor and correct deviations from the desired state, leading to self-healing and automation.'
        },
        {
          question: 'What is the recommended approach for managing complex, version-controlled deployments in Kubernetes?',
          options: [
            'Using only imperative kubectl commands',
            'Manually scripting all deployment steps',
            'Employing a declarative approach with manifest files',
            'Directly modifying cluster components without configuration files'
          ],
          correct: 2,
          explanation: 'Declarative manifest files (YAML/JSON) are the standard and recommended way to manage Kubernetes resources, especially for version control and automation.'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Kubernetes Objects and YAML Fundamentals',
    description: 'Understanding spec, status, and YAML structure',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Core Concepts',
    tags: ['objects', 'yaml', 'spec', 'status'],
    content: {
      introduction: 'Kubernetes Objects are persistent entities within the Kubernetes system that serve to represent the desired state of the cluster.',
      conceptExplanation: `Kubernetes Objects are persistent entities within the Kubernetes system that serve to represent the desired state of the cluster. These objects comprehensively describe what containerized applications are running, on which nodes they are deployed, the resources allocated to those applications, and the policies governing their behavior.

Each Kubernetes object is fundamentally defined by two nested fields: the spec and the status. The spec field, which is provided by the user, outlines the desired state or the intended characteristics of the object. Conversely, the status field describes the actual state of the object and is continuously supplied and updated by the Kubernetes system itself.`,
      animation: {
        title: 'The Blueprint and the Builder',
        description: 'Understanding spec vs status through a construction analogy',
        scenes: [
          {
            title: 'The Blueprint and the Builder',
            description: 'Show a user holding a detailed blueprint (YAML file) for a house. This blueprint represents the "desired state." A robot builder (Kubernetes Control Plane) is trying to build the house according to the blueprint.',
            duration: 3000
          },
          {
            title: 'spec vs. status',
            description: 'Zoom into the blueprint. Highlight a section labeled "Desired House (spec)" with details like "3 bedrooms, red roof, 2 windows." Then, show the actual house being built with "Current House (status)" showing "2 bedrooms, blue roof, 1 window."',
            duration: 4000
          },
          {
            title: 'Reconciliation Loop',
            description: 'Animate the robot builder continuously comparing the "Desired House (spec)" with the "Current House (status)." When a mismatch is detected (e.g., blue roof instead of red), the robot immediately starts painting the roof red.',
            duration: 4000
          },
          {
            title: 'YAML Structure',
            description: 'Show the blueprint transforming into a YAML file. Highlight apiVersion, kind, metadata, spec as main sections. Show key: value pairs, lists with hyphens, and nested dictionaries with indentation.',
            duration: 4000
          },
          {
            title: 'Configuration as Code',
            description: 'Show the YAML file being stored in a Git repository (a versioned folder). Illustrate how changes to the YAML file are tracked, reviewed, and automatically applied by the robot builder.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Basic Kubernetes Object Structure',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: default
  labels:
    app: web
    tier: frontend
spec:
  containers:
  - name: web-container
    image: nginx:1.20
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"`,
        explanation: 'This YAML shows the four main sections: apiVersion (API version), kind (object type), metadata (identifying information), and spec (desired state). Kubernetes will continuously work to make the actual state match this specification.'
      },
      keyPoints: [
        'Every Kubernetes object has spec (desired state) and status (actual state)',
        'YAML is the primary format for defining Kubernetes resources',
        'Four main sections: apiVersion, kind, metadata, spec',
        'Indentation uses spaces only (no tabs allowed)',
        'Configuration as code enables version control and automation'
      ],
      quiz: [
        {
          question: 'Which field in a Kubernetes object\'s YAML manifest defines its desired state?',
          options: [
            'metadata',
            'status',
            'spec',
            'apiVersion'
          ],
          correct: 2,
          explanation: 'The spec field is where the user declares the intended configuration and characteristics of the Kubernetes object.'
        },
        {
          question: 'What is the primary file format used to define Kubernetes objects declaratively?',
          options: [
            'JSON',
            'XML',
            'YAML',
            'TXT'
          ],
          correct: 2,
          explanation: 'YAML is the most common and recommended format for defining Kubernetes resources due to its human readability and support for complex structures.'
        },
        {
          question: 'In YAML, what is strictly forbidden for defining hierarchical structure?',
          options: [
            'Spaces',
            'Hyphens',
            'Tabs',
            'Colons'
          ],
          correct: 2,
          explanation: 'YAML relies on strict indentation using spaces, and tabs are not allowed as they can be interpreted inconsistently by different tools.'
        }
      ]
    }
  },
  {
    id: 4,
    title: "Labels and Annotations: Organizing Resources",
    description: "Learn how to organize and select Kubernetes objects using labels and annotations",
    duration: "8 minutes",
    difficulty: 'Beginner' as const,
    category: "Core Concepts",
    tags: ["labels", "annotations", "selectors", "organization"],
    content: {
      introduction: "Labels are fundamental key-value pairs attached to Kubernetes objects, serving as a primary mechanism for organizing and selecting subsets of objects. They enable loose coupling and dynamic relationships between various components.",
      keyPoints: [
        "Labels are key-value pairs used for organizing and selecting objects",
        "Selectors are queries that match objects based on their labels",
        "Services use labels to identify which Pods to route traffic to",
        "Annotations store non-identifying metadata for tools and information",
        "Well-designed labeling strategy is critical for effective resource management"
      ],
      conceptExplanation: "Labels enable Kubernetes' internal object discovery and grouping, while annotations provide additional metadata that doesn't affect object selection but can influence tool behavior.",
      animation: {
        title: "Labels and Annotations: Organizing Resources",
        description: "Technical demonstration of how Labels are used for selecting, grouping, and managing resources, and how Annotations attach non-identifying metadata",
        scenes: [
          {
            title: "The Problem - Unorganized Resources",
            description: "Many generic Pod, Service, and Deployment icons floating chaotically in a Namespace. No clear way to identify which belong to which application or environment.",
            duration: 4000
          },
          {
            title: "Introducing Labels - Key-Value Tags",
            description: "Label icon (simple tag) with key:value pairs like app:frontend, env:production, version:v1. Labels serve as resource identification mechanism.",
            duration: 4000
          },
          {
            title: "Attaching Labels to Resources",
            description: "Deployment YAML shows labels in metadata and Pod template. Deployment, ReplicaSet, and Pods all get consistent labels like app:myapp, tier:web.",
            duration: 4000
          },
          {
            title: "Label Selectors - Grouping & Filtering",
            description: "User types 'kubectl get pods -l app=myapp'. Only Pods with app:myapp label appear. Service uses selector to find matching Pods for traffic routing.",
            duration: 4000
          },
          {
            title: "Service Label Selection",
            description: "Service YAML shows selector field matching Pod labels. Traffic flows from Service to only those Pods with matching labels, enabling dynamic service discovery.",
            duration: 4000
          },
          {
            title: "Annotations - Non-Identifying Metadata",
            description: "Annotation icon with examples: build-info, contact-email, documentation-url. Annotations store metadata that tools can use but don't affect object selection.",
            duration: 4000
          },
          {
            title: "Labels vs Annotations Usage",
            description: "Side-by-side comparison: Labels for Identity & Selection (used by Kubernetes), Annotations for Metadata (used by tools and humans).",
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: "Pod with Labels and Annotations",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-application
    tier: frontend
    version: v1.2.0
    environment: production
  annotations:
    deployment.kubernetes.io/revision: "3"
    kubernetes.io/created-by: "deployment-controller"
    description: "Frontend web server for my application"
spec:
  containers:
  - name: web-server
    image: nginx:1.21
    ports:
    - containerPort: 80`,
        explanation: "This Pod has labels for organization and selection (app, tier, version, environment) and annotations for metadata that tools can use but don't affect object selection."
      },
      quiz: [
        {
          question: "What is the primary purpose of Kubernetes Labels?",
          options: [
            "To store sensitive data like passwords",
            "To provide a unique identifier for every Pod",
            "To organize and select subsets of Kubernetes objects",
            "To define network routing rules"
          ],
          correct: 2,
          explanation: "Labels are key-value pairs used for grouping and filtering resources, which is essential for how Services and other controllers identify their target Pods."
        },
        {
          question: "Which Kubernetes object commonly uses labels to identify the Pods it should route traffic to?",
          options: [
            "ConfigMap",
            "Secret",
            "Service",
            "PersistentVolume"
          ],
          correct: 2,
          explanation: "Services use label selectors to dynamically discover and route traffic to the correct set of Pods."
        },
        {
          question: "What is the main difference between Labels and Annotations in Kubernetes?",
          options: [
            "Labels are for sensitive data, while Annotations are for non-sensitive data",
            "Labels are used for identifying and selecting objects, while Annotations are for non-identifying metadata",
            "Labels can be modified after creation, while Annotations cannot",
            "Labels are cluster-scoped, while Annotations are namespace-scoped"
          ],
          correct: 1,
          explanation: "Labels are functional for Kubernetes' internal logic (like selectors), while annotations store arbitrary, non-identifying metadata for tools or informational purposes."
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Control Plane Overview',
    description: 'Understanding the central nervous system of Kubernetes',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'Architecture',
    tags: ['control-plane', 'architecture', 'master-nodes'],
    content: {
      introduction: 'The Kubernetes control plane functions as the central nervous system of the cluster, orchestrating resources and continuously striving to maintain the declared desired state.',
      conceptExplanation: 'The control plane comprises several core components, which are typically deployed on dedicated machines often referred to as "master nodes". These components work in synergy to ensure clusters run optimally, handling decision-making, scheduling, and responding to cluster events. Nodes which have these components running generally don\'t have any user containers running.',
      animation: {
        title: 'The Control Plane - The Brain',
        description: 'Breaking down the Kubernetes Control Plane and explaining the role of its core components',
        scenes: [
          {
            title: 'The Control Plane - The Brain',
            description: 'A large, segmented "Brain" icon appears, labeled "Kubernetes Control Plane." It has distinct sections, currently empty. Around it, simple "Worker Node" icons are present but inactive.',
            duration: 3000
          },
          {
            title: 'Kube-API Server - The Front Desk',
            description: 'A section of the brain lights up and becomes a "Front Desk" or "Reception" icon labeled "API Server." Incoming "User Commands" (e.g., a kubectl icon) and "Internal Component Requests" (small data packets) flow into it. Arrows flow out to other brain sections.',
            duration: 4000
          },
          {
            title: 'Etcd - The Memory',
            description: 'Another section of the brain lights up, forming a "Database/Memory Bank" icon labeled "Etcd." Data packets flow from the API Server into Etcd for storage and back out for retrieval. Show a small "Consistency" lock icon.',
            duration: 3000
          },
          {
            title: 'Kube-Scheduler - The Matchmaker',
            description: 'A new section lights up, becoming a "Matchmaker/Logic Processor" icon labeled "Kube-Scheduler." A "New Pod Request" (a small Pod outline) comes from the API Server to the Scheduler. The Scheduler has "eyes" that look at available Worker Nodes (miniature nodes appear next to it, showing CPU/Mem metrics). It then draws a dotted line to the best matching Worker Node.',
            duration: 4000
          },
          {
            title: 'Kube-Controller Manager - The Task Master',
            description: 'The last major section lights up, forming a "Multi-Task Manager/Gear System" icon labeled "Kube-Controller Manager." Inside, smaller, distinct "Controller" icons (e.g., "Deployment Controller," "ReplicaSet Controller," "Node Controller") are working. Each controller continuously compares the desired state (from Etcd via API Server) with the actual state and sends "Action!" commands back through the API Server.',
            duration: 4000
          },
          {
            title: 'Cloud Controller Manager (Optional)',
            description: 'Briefly show a "Cloud Provider" icon connected to the Kube-Controller Manager via a smaller, separate module. Show it managing cloud-specific resources like Load Balancers or disk volumes.',
            duration: 2000
          },
          {
            title: 'Control Plane Summary',
            description: 'All Control Plane components are shown together, neatly arranged within the "Brain" rectangle, with arrows showing their interactions, all flowing through the central API Server.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Control Plane Pod Example',
        code: `apiVersion: v1
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
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC`,
        explanation: 'This shows how the API server component is typically deployed as a static pod on control plane nodes.'
      },
      keyPoints: [
        'Control plane manages the entire cluster state',
        'Components include API Server, etcd, Scheduler, and Controller Manager',
        'Typically runs on dedicated master nodes',
        'Handles all cluster decision-making and orchestration',
        'Critical for cluster stability and operations'
      ],
      quiz: [
        {
          question: 'What is the primary role of the Kubernetes control plane?',
          options: [
            'Running application containers',
            'Managing cluster state and orchestration',
            'Providing storage for applications',
            'Handling network traffic routing'
          ],
          correct: 1,
          explanation: 'The control plane is responsible for managing the overall cluster state and orchestrating all cluster operations.'
        },
        {
          question: 'Which of the following is NOT typically a control plane component?',
          options: [
            'kube-apiserver',
            'etcd',
            'kubelet',
            'kube-scheduler'
          ],
          correct: 2,
          explanation: 'kubelet runs on worker nodes, not on the control plane. It\'s the node agent that communicates with the control plane.'
        }
      ]
    }
  },
  {
    id: 6,
    title: 'Kube-API Server: The Central Interface',
    description: 'The primary front door and communication hub for Kubernetes',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['api-server', 'authentication', 'authorization'],
    content: {
      introduction: 'The kube-apiserver serves as the primary front door and central communication hub for the Kubernetes cluster, exposing the Kubernetes API.',
      conceptExplanation: 'All operations within the cluster, including the creation, modification, and deletion of Kubernetes objects, are routed through this API server. It is responsible for validating and configuring data for all API objects, such as Pods, Services, and Deployments. The API server\'s role as the singular point of entry and validation highlights its critical importance for both the security and stability of the entire cluster.',
      animation: {
        title: 'API Server Operations',
        description: 'How the API server processes requests and maintains cluster state',
        scenes: [
          {
            title: 'Request Gateway',
            description: 'API server receives and validates all cluster requests',
            duration: 3000
          },
          {
            title: 'Authentication & Authorization',
            description: 'Security checks and RBAC validation process',
            duration: 4000
          },
          {
            title: 'etcd Communication',
            description: 'Storing and retrieving cluster state from etcd',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'API Server Configuration',
        code: `apiVersion: v1
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
    - --authorization-mode=Node,RBAC
    - --enable-admission-plugins=NamespaceLifecycle,NodeRestriction
    - --etcd-servers=https://127.0.0.1:2379
    - --secure-port=6443`,
        explanation: 'This shows key API server configuration parameters including authorization modes and admission plugins.'
      },
      keyPoints: [
        'Central communication hub for all cluster operations',
        'Validates and processes all API requests',
        'Implements authentication and authorization',
        'Single source of truth for cluster state',
        'Critical security and performance component'
      ],
      quiz: [
        {
          question: 'What happens to requests that fail authentication at the API server?',
          options: [
            'They are forwarded to etcd for validation',
            'They are rejected immediately',
            'They are queued for later processing',
            'They are sent to the scheduler'
          ],
          correct: 1,
          explanation: 'The API server rejects unauthenticated requests immediately as part of its security validation process.'
        },
        {
          question: 'Which security mechanism is checked by the API server after authentication?',
          options: [
            'Network policies',
            'Pod security policies',
            'Role-Based Access Control (RBAC)',
            'Container runtime security'
          ],
          correct: 2,
          explanation: 'RBAC policies are checked by the API server to authorize requests after a user or service account has been authenticated.'
        }
      ]
    }
  },
  {
    id: 7,
    title: 'etcd: Distributed Key-Value Store',
    description: 'The consistent and highly-available backbone of Kubernetes',
    duration: '18 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['etcd', 'storage', 'consistency', 'backup'],
    content: {
      introduction: 'etcd is a consistent and highly-available key-value store that serves as the single source of truth for the entire cluster\'s state.',
      conceptExplanation: 'All persistent data, encompassing configurations, secrets, and the current state of all Kubernetes objects, resides within etcd. The reliability and consistency of etcd are therefore foundational to the overall stability and operational integrity of the Kubernetes cluster. etcd uses the Raft consensus algorithm to maintain consistency across multiple nodes.',
      animation: {
        title: 'etcd Operations',
        description: 'Understanding how etcd maintains cluster state consistency',
        scenes: [
          {
            title: 'Data Storage',
            description: 'How Kubernetes objects are stored as key-value pairs in etcd',
            duration: 3000
          },
          {
            title: 'Raft Consensus',
            description: 'How etcd maintains consistency across multiple nodes using Raft',
            duration: 4000
          },
          {
            title: 'Backup and Recovery',
            description: 'Critical importance of etcd backups for cluster recovery',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'etcd Backup Script',
        code: `#!/bin/bash
# etcd backup script
ETCDCTL_API=3 etcdctl snapshot save backup.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \\
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# Verify backup
ETCDCTL_API=3 etcdctl --write-out=table snapshot status backup.db`,
        explanation: 'This script shows how to create and verify etcd backups, which are critical for cluster disaster recovery.'
      },
      keyPoints: [
        'Single source of truth for all cluster state',
        'Uses Raft consensus algorithm for consistency',
        'Stores all Kubernetes objects as key-value pairs',
        'Critical component requiring regular backups',
        'Performance directly impacts cluster responsiveness'
      ],
      quiz: [
        {
          question: 'What consensus algorithm does etcd use to maintain consistency?',
          options: [
            'Paxos',
            'Raft',
            'Byzantine Fault Tolerance',
            'Gossip Protocol'
          ],
          correct: 1,
          explanation: 'etcd uses the Raft consensus algorithm to ensure consistency and fault tolerance across multiple nodes.'
        },
        {
          question: 'How are Kubernetes Secrets stored in etcd by default?',
          options: [
            'Fully encrypted',
            'Compressed and encrypted',
            'Base64 encoded but unencrypted at rest',
            'Plain text'
          ],
          correct: 2,
          explanation: 'While Secret values are base64 encoded, this is not encryption, and etcd requires explicit configuration for encryption at rest to secure sensitive data.'
        }
      ]
    }
  },
  {
    id: 8,
    title: 'Kube-Scheduler: Pod Placement Logic',
    description: 'Understanding how Kubernetes intelligently places Pods on nodes',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['scheduler', 'pod-placement', 'node-affinity', 'resources'],
    content: {
      introduction: 'The kube-scheduler continuously monitors for newly created Pods that are not yet assigned to a node and subsequently assigns each Pod to the most suitable worker node.',
      conceptExplanation: 'Its decision-making process is sophisticated, taking into account a multitude of constraints. These include the Pod\'s resource requests (CPU, memory), node resource availability, hardware and software considerations, data locality, inter-workload interference, and various policy restrictions. The scheduler\'s intelligent placement decisions directly influence application performance, cost efficiency, and overall fault tolerance.',
      animation: {
        title: 'Scheduler Decision Process',
        description: 'How the scheduler evaluates and selects the best node for each Pod',
        scenes: [
          {
            title: 'Pod Queue Processing',
            description: 'Scheduler continuously monitors for unscheduled Pods',
            duration: 3000
          },
          {
            title: 'Node Filtering',
            description: 'Filtering nodes based on resource requirements and constraints',
            duration: 4000
          },
          {
            title: 'Scoring and Selection',
            description: 'Scoring remaining nodes and selecting the optimal placement',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Pod with Scheduling Constraints',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: scheduled-pod
spec:
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 256Mi
  nodeSelector:
    disktype: ssd
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/arch
            operator: In
            values:
            - amd64`,
        explanation: 'This Pod specification includes resource requests, node selector, and node affinity rules that guide the scheduler\'s placement decision.'
      },
      keyPoints: [
        'Assigns Pods to the most suitable nodes based on multiple criteria',
        'Considers resource requests, node capacity, and constraints',
        'Uses filtering and scoring algorithms for optimal placement',
        'Supports advanced features like affinity and anti-affinity',
        'Critical for cluster efficiency and application performance'
      ],
      quiz: [
        {
          question: 'What happens if the scheduler cannot find a suitable node for a Pod?',
          options: [
            'The Pod is automatically deleted',
            'The Pod remains in Pending state',
            'The scheduler creates a new node',
            'The Pod is assigned to a random node'
          ],
          correct: 1,
          explanation: 'If no suitable node is found, the Pod remains in Pending state until a node becomes available that meets its requirements.'
        },
        {
          question: 'Which feature allows you to prevent certain Pods from being scheduled on specific nodes?',
          options: [
            'Node selectors',
            'Resource quotas',
            'Taints',
            'Network policies'
          ],
          correct: 2,
          explanation: 'Taints are applied to nodes to mark them as undesirable for Pods without corresponding tolerations.'
        }
      ]
    }
  },
  {
    id: 9,
    title: 'Kube-Controller-Manager: Cluster State Reconciliation',
    description: 'The engine that ensures desired state matches actual state',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['controller-manager', 'reconciliation', 'self-healing'],
    content: {
      introduction: 'The kube-controller-manager is responsible for running a suite of controllers that continuously monitor the cluster\'s actual state and initiate corrective actions to align it with the declared desired state.',
      conceptExplanation: 'This component embodies Kubernetes\' fundamental principles of self-healing and automation. Examples of controllers include the Node Controller (tracks node status), Job Controller (manages one-time tasks), Replication Controller (maintains Pod replicas), and Service Account Controller (manages service accounts). The "reconciliation loop" is the core engine that ensures cluster stability and application availability.',
      animation: {
        title: 'Controller Reconciliation Loop',
        description: 'How controllers continuously maintain desired cluster state',
        scenes: [
          {
            title: 'State Monitoring',
            description: 'Controllers continuously watch for changes in cluster state',
            duration: 3000
          },
          {
            title: 'Drift Detection',
            description: 'Identifying differences between desired and actual state',
            duration: 4000
          },
          {
            title: 'Corrective Actions',
            description: 'Taking automated actions to restore desired state',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Deployment Controller in Action',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
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
        - containerPort: 80
---
# If a Pod is deleted, the Deployment controller
# automatically creates a new one to maintain replicas: 3`,
        explanation: 'The Deployment controller continuously ensures that exactly 3 nginx Pods are running, automatically replacing any that fail or are deleted.'
      },
      keyPoints: [
        'Runs multiple controllers for different resource types',
        'Implements the reconciliation loop pattern',
        'Provides self-healing capabilities to the cluster',
        'Ensures actual state matches desired state continuously',
        'Core component for Kubernetes automation'
      ],
      quiz: [
        {
          question: 'What is the fundamental principle that controllers use to maintain cluster state?',
          options: [
            'Event-driven processing',
            'Batch processing',
            'Reconciliation loop',
            'Polling mechanism'
          ],
          correct: 2,
          explanation: 'The reconciliation loop is the fundamental principle by which Kubernetes maintains the desired state of the cluster.'
        },
        {
          question: 'Which controller is responsible for maintaining the desired number of Pod replicas?',
          options: [
            'Node Controller',
            'ReplicaSet Controller',
            'Service Controller',
            'Namespace Controller'
          ],
          correct: 1,
          explanation: 'The ReplicaSet Controller (managed by Deployments) ensures the specified number of Pod replicas are running at all times.'
        }
      ]
    }
  },
  {
    id: 10,
    title: 'Cloud-Controller-Manager: Cloud Provider Integration',
    description: 'Seamless integration with underlying cloud providers',
    duration: '12 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['cloud-controller', 'cloud-integration', 'load-balancers'],
    content: {
      introduction: 'The cloud-controller-manager is an optional component that facilitates seamless integration with underlying cloud providers.',
      conceptExplanation: 'It manages cloud-specific resources, such as load balancers, storage volumes, and network routes, by interacting with the cloud provider\'s API. This component abstracts away the inherent differences between various cloud providers, offering a consistent interface for managing cloud-specific resources within a Kubernetes cluster. It is important to note that this component is not typically present in on-premise Kubernetes deployments.',
      animation: {
        title: 'Cloud Integration',
        description: 'How Kubernetes integrates with cloud provider services',
        scenes: [
          {
            title: 'Cloud API Communication',
            description: 'Controller communicates with cloud provider APIs',
            duration: 3000
          },
          {
            title: 'Load Balancer Provisioning',
            description: 'Automatic creation of cloud load balancers for Services',
            duration: 4000
          },
          {
            title: 'Storage Integration',
            description: 'Dynamic provisioning of cloud storage volumes',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Cloud LoadBalancer Service',
        code: `apiVersion: v1
kind: Service
metadata:
  name: web-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
---
# The cloud-controller-manager will automatically
# provision an AWS Network Load Balancer`,
        explanation: 'This Service of type LoadBalancer triggers the cloud-controller-manager to provision a cloud load balancer automatically.'
      },
      keyPoints: [
        'Optional component for cloud provider integration',
        'Manages cloud-specific resources like load balancers',
        'Abstracts differences between cloud providers',
        'Not needed for on-premise deployments',
        'Enables seamless multi-cloud and hybrid deployments'
      ],
      quiz: [
        {
          question: 'Is the cloud-controller-manager required for all Kubernetes clusters?',
          options: [
            'Yes, it is always required',
            'No, it is an optional component for cloud integrations',
            'Only for production clusters',
            'Only for clusters with more than 10 nodes'
          ],
          correct: 1,
          explanation: 'This component is specific to cloud environments and is not needed for on-premise clusters.'
        },
        {
          question: 'What type of Kubernetes Service typically requires the cloud-controller-manager?',
          options: [
            'ClusterIP',
            'NodePort',
            'LoadBalancer',
            'ExternalName'
          ],
          correct: 2,
          explanation: 'LoadBalancer Services rely on the cloud-controller-manager to provision cloud load balancers.'
        }
      ]
    }
  },
  {
    id: 11,
    title: 'Worker Node Overview',
    description: 'Understanding the machines that run your applications',
    duration: '10 min',
    difficulty: 'Beginner',
    category: 'Architecture',
    tags: ['worker-nodes', 'kubelet', 'container-runtime'],
    content: {
      introduction: 'Worker nodes are the machines responsible for running the actual containerized applications, encapsulated within Pods.',
      conceptExplanation: 'Each node is equipped with the necessary components to execute these Pods and is continuously managed by the control plane. A Kubernetes node can be either a physical machine or a virtual machine (VM). These nodes pool together to create a more powerful machine, and when programs are deployed onto the clusters, they will handle the work distribution to other nodes.',
      animation: {
        title: 'Worker Node - The Workhorse',
        description: 'Explaining the components residing on a Kubernetes Worker Node and how they enable Pod execution and networking',
        scenes: [
          {
            title: 'The Worker Node - The Workhorse',
            description: 'A single "Worker Node" icon (a simple server rack) appears, prominent in the center. Its internal components are initially empty. Outside, the "Control Plane" brain icon is visible in the background, subtly connected.',
            duration: 3000
          },
          {
            title: 'Kubelet - The Node\'s Agent',
            description: 'A section of the Worker Node lights up, revealing a "Node Agent/Butler" icon labeled "Kubelet." Show a connection (arrow) from the Control Plane\'s API Server directly to the Kubelet.',
            duration: 3000
          },
          {
            title: 'Container Runtime - The Engine Room',
            description: 'Another section of the Node lights up, showing a "Container Engine" icon (e.g., Docker whale, containerd logo) labeled "Container Runtime." Show the Kubelet handing off a "Container Specification" to the Container Runtime, which then spawns "Container" icons.',
            duration: 4000
          },
          {
            title: 'Kube-Proxy - The Network Enforcer',
            description: 'A third section of the Node lights up, showing a "Network Router/Traffic Cop" icon labeled "Kube-Proxy." Incoming "Traffic" (represented by small car icons) flows towards it. Kube-Proxy then directs the traffic to specific "Pod" icons within the node.',
            duration: 4000
          },
          {
            title: 'Pods - The Application Units',
            description: 'Multiple "Pod" icons (the capsules containing containers) populate the Worker Node. They appear to be actively running applications.',
            duration: 3000
          },
          {
            title: 'Worker Node Summary & Interaction',
            description: 'All Worker Node components are shown within the Node rectangle, with arrows illustrating their internal interactions and the Kubelet\'s communication with the Control Plane. Show traffic flowing into Kube-Proxy and then to Pods.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Node Information',
        code: `# View node information
kubectl get nodes -o wide

# Describe a specific node
kubectl describe node worker-node-1

# Node status example
apiVersion: v1
kind: Node
metadata:
  name: worker-node-1
status:
  conditions:
  - type: Ready
    status: "True"
    reason: KubeletReady
  nodeInfo:
    kubeletVersion: v1.28.0
    containerRuntimeVersion: containerd://1.6.6
    operatingSystem: linux
    architecture: amd64`,
        explanation: 'This shows how to inspect worker node information and the typical status information available for each node.'
      },
      keyPoints: [
        'Run the actual application containers within Pods',
        'Can be physical machines or virtual machines',
        'Managed by the control plane components',
        'Pool together to provide distributed computing power',
        'Essential components: kubelet, kube-proxy, container runtime'
      ],
      quiz: [
        {
          question: 'What is the primary purpose of worker nodes in a Kubernetes cluster?',
          options: [
            'Managing cluster state',
            'Running application containers',
            'Storing cluster configuration',
            'Handling API requests'
          ],
          correct: 1,
          explanation: 'Worker nodes are responsible for running the actual containerized applications within Pods.'
        },
        {
          question: 'Which component on worker nodes receives instructions from the Control Plane?',
          options: [
            'kube-proxy',
            'container runtime',
            'kubelet',
            'etcd'
          ],
          correct: 2,
          explanation: 'The kubelet is the agent on each worker node that receives instructions from the Control Plane and ensures Pods are running as expected.'
        }
      ]
    }
  },
  {
    id: 12,
    title: 'Kubelet: Node Agent and Pod Management',
    description: 'The primary agent that manages Pod lifecycle on each node',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Architecture',
    tags: ['kubelet', 'pod-lifecycle', 'health-probes', 'node-agent'],
    content: {
      introduction: 'The kubelet acts as the primary "node agent" running on every worker node in the cluster.',
      conceptExplanation: 'Its fundamental responsibility is to receive instructions from the control plane, primarily via the API server, and ensure that containers are running as expected within their respective Pods. The kubelet meticulously manages the entire lifecycle of Pods, which includes pulling container images from registries, initiating and terminating containers, and continuously monitoring their health status. The kubelet serves as the direct execution arm of the control plane.',
      animation: {
        title: 'Kubelet Operations',
        description: 'How kubelet manages Pod lifecycle and health monitoring',
        scenes: [
          {
            title: 'Pod Specification Receipt',
            description: 'Kubelet receives Pod specifications from the API server',
            duration: 3000
          },
          {
            title: 'Container Management',
            description: 'Pulling images, starting containers, and managing their lifecycle',
            duration: 4000
          },
          {
            title: 'Health Monitoring',
            description: 'Continuous health checks and reporting back to control plane',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Pod with Health Probes',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: healthy-pod
spec:
  containers:
  - name: app
    image: nginx
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
      periodSeconds: 5
    resources:
      requests:
        cpu: 100m
        memory: 128Mi`,
        explanation: 'The kubelet executes these health probes to monitor container health and readiness, taking corrective actions when needed.'
      },
      keyPoints: [
        'Primary node agent running on every worker node',
        'Manages complete Pod lifecycle from creation to termination',
        'Pulls container images and starts/stops containers',
        'Executes health probes and reports Pod status',
        'Critical for ensuring application availability and health'
      ],
      quiz: [
        {
          question: 'What is the kubelet\'s primary responsibility?',
          options: [
            'Managing network routing',
            'Storing cluster state',
            'Managing Pod lifecycle on nodes',
            'Load balancing traffic'
          ],
          correct: 2,
          explanation: 'The kubelet is responsible for managing the complete lifecycle of Pods on worker nodes, including container execution and health monitoring.'
        },
        {
          question: 'Which types of probes does the kubelet execute to monitor container health?',
          options: [
            'Network and Storage Probes',
            'Liveness and Readiness Probes',
            'CPU and Memory Probes',
            'Security and Compliance Probes'
          ],
          correct: 1,
          explanation: 'Liveness probes check if an application is running, and readiness probes check if it\'s ready to serve traffic, both managed by the kubelet.'
        }
      ]
    }
  },
  {
    id: 13,
    title: 'Kube-Proxy: Network Proxy and Load Balancing',
    description: 'Network connectivity and load balancing for Kubernetes Services',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Networking',
    tags: ['kube-proxy', 'networking', 'load-balancing', 'iptables'],
    content: {
      introduction: 'Kube-proxy is a network proxy component that runs on each Kubernetes node.',
      conceptExplanation: 'Its primary function is to maintain network rules on the node, typically utilizing iptables or IPVS, to ensure seamless communication among Pods and between Pods and external entities. This component is instrumental in implementing the Kubernetes Service concept, providing essential network connectivity and load balancing capabilities for Services within the cluster. Kube-proxy abstracts network complexities from applications by implementing virtual IP addresses for Services.',
      animation: {
        title: 'Kube-Proxy Network Operations',
        description: 'How kube-proxy enables Service networking and load balancing',
        scenes: [
          {
            title: 'Service Discovery',
            description: 'How Services provide stable network endpoints for dynamic Pods',
            duration: 3000
          },
          {
            title: 'Traffic Routing',
            description: 'iptables rules routing traffic from Services to backend Pods',
            duration: 4000
          },
          {
            title: 'Load Balancing',
            description: 'Distributing incoming requests across multiple Pod replicas',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Service with Multiple Backends',
        code: `apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
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
        image: nginx
        ports:
        - containerPort: 8080`,
        explanation: 'Kube-proxy automatically load balances traffic from the Service to all three Pod replicas, updating rules as Pods are added or removed.'
      },
      keyPoints: [
        'Runs on every node to provide network proxy functionality',
        'Implements Kubernetes Service networking using iptables/IPVS',
        'Provides load balancing across Service backend Pods',
        'Abstracts Pod IP addresses behind stable Service IPs',
        'Essential for microservices communication and service discovery'
      ],
      quiz: [
        {
          question: 'What is the primary benefit of kube-proxy for applications?',
          options: [
            'It provides persistent storage',
            'It provides stable network endpoints for ephemeral Pods',
            'It manages container images',
            'It handles authentication'
          ],
          correct: 1,
          explanation: 'By abstracting dynamic Pod IPs behind stable Service IPs, kube-proxy enables applications to find and communicate with each other reliably.'
        },
        {
          question: 'Which technologies does kube-proxy typically use to implement network rules?',
          options: [
            'DNS and DHCP',
            'iptables or IPVS',
            'BGP and OSPF',
            'HTTP and HTTPS'
          ],
          correct: 1,
          explanation: 'Kube-proxy uses iptables (default) or IPVS to implement network rules for Service traffic routing and load balancing.'
        }
      ]
    }
  },
  {
    id: 14,
    title: 'Container Runtime: Executing Containers',
    description: 'The software layer responsible for running containers',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'Architecture',
    tags: ['container-runtime', 'docker', 'containerd', 'cri'],
    content: {
      introduction: 'The container runtime is the software layer directly responsible for executing containers on a worker node.',
      conceptExplanation: 'Kubernetes supports a variety of container runtimes, including but not limited to Docker, containerd, and CRI-O. All supported runtimes must adhere to the Kubernetes Container Runtime Interface (CRI), a standardized API that allows Kubernetes to interact with different container execution engines. The abstraction provided by CRI is pivotal, as it allows Kubernetes to maintain flexibility regarding the underlying container execution engine.',
      animation: {
        title: 'Container Runtime Operations',
        description: 'How container runtimes execute and manage containers',
        scenes: [
          {
            title: 'Image Management',
            description: 'Pulling and managing container images from registries',
            duration: 3000
          },
          {
            title: 'Container Execution',
            description: 'Starting, stopping, and managing container processes',
            duration: 4000
          },
          {
            title: 'CRI Interface',
            description: 'How kubelet communicates with runtimes through CRI',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Runtime Configuration',
        code: `# Check container runtime on a node
kubectl get nodes -o wide

# Example output showing containerd
NAME           STATUS   ROLES    AGE   VERSION   CONTAINER-RUNTIME
worker-node-1  Ready    <none>   1d    v1.28.0   containerd://1.6.6

# Runtime configuration in kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
imageServiceEndpoint: unix:///var/run/containerd/containerd.sock`,
        explanation: 'This shows how to identify the container runtime and configure kubelet to communicate with it through the CRI.'
      },
      keyPoints: [
        'Software layer that executes containers on worker nodes',
        'Must implement the Container Runtime Interface (CRI)',
        'Common runtimes: Docker, containerd, CRI-O',
        'Provides flexibility and prevents vendor lock-in',
        'Handles image pulling, container lifecycle, and resource management'
      ],
      quiz: [
        {
          question: 'What interface must container runtimes implement to work with Kubernetes?',
          options: [
            'Container Network Interface (CNI)',
            'Container Runtime Interface (CRI)',
            'Container Storage Interface (CSI)',
            'Open Container Initiative (OCI)'
          ],
          correct: 1,
          explanation: 'All Kubernetes-compatible container runtimes must implement the Container Runtime Interface (CRI) for standardized communication.'
        },
        {
          question: 'Which of the following is a supported container runtime for Kubernetes?',
          options: [
            'VirtualBox',
            'VMware',
            'Docker',
            'Hyper-V'
          ],
          correct: 2,
          explanation: 'Docker, containerd, and CRI-O are common container runtimes that adhere to the CRI.'
        }
      ]
    }
  },
  {
    id: 15,
    title: 'Pods: The Smallest Deployable Unit',
    description: 'Understanding the fundamental building block of Kubernetes applications',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'Workloads',
    tags: ['pods', 'containers', 'networking', 'storage'],
    content: {
      introduction: 'A Pod represents the smallest and most fundamental deployable unit within Kubernetes.',
      conceptExplanation: 'It encapsulates a single instance of a running process within a cluster and can contain one or more containers that share the same network namespace, enabling communication via localhost, and common storage resources. Pods are designed to host co-located containers that are tightly coupled and require shared resources for efficient communication and resource utilization. Each Pod gets its own IP address and shares storage volumes among its containers.',
      animation: {
        title: 'Pods: The Container\'s Home',
        description: 'Explaining what a Kubernetes Pod is, its components, how it spins up, and how traffic reaches it',
        scenes: [
          {
            title: 'The Container\'s Home',
            description: 'A solitary "Application Container" (a simple box with an app icon) floats in space. It looks a bit lonely.',
            duration: 3000
          },
          {
            title: 'Introducing the Pod - The Capsule',
            description: 'A transparent, rounded "Pod Capsule" appears and envelops the application container. The Pod Capsule gets a private "IP Address" sticker. Show a "Shared Network" cloud inside the Pod.',
            duration: 3000
          },
          {
            title: 'Multi-Container Pods (Sidecar Example)',
            description: 'Inside the Pod Capsule, a second, smaller "Sidecar Container" (e.g., a "Logger" container, or a "Proxy" container) appears next to the main application container. They share the same IP and network.',
            duration: 4000
          },
          {
            title: 'Pod Spin-Up (Simplified Flow)',
            description: 'Step A: Request: A "Deployment Manifest" (YAML icon) is sent to the "Kubernetes Control Plane" (brain icon). Step B: Scheduling: The Control Plane (specifically the Scheduler) picks a "Worker Node" (server rack). Step C: Kubelet Action: The "Kubelet" agent on the Worker Node receives the Pod\'s blueprint. Step D: Container Creation: The "Container Runtime" pulls the image and starts the container inside the Pod capsule.',
            duration: 5000
          },
          {
            title: 'Pod Lifecycle Stages',
            description: 'A Pod icon animates through different states with text overlays: Pending: Pod outline, "waiting for resources/scheduling." ContainerCreating: Pod outline, internal gears turning, "image pulling." Running: Pod is solid, active, "application healthy." Succeeded: Pod turns green, "task completed." (for Jobs) Failed: Pod turns red, "error, terminated." (for Jobs/errors)',
            duration: 4000
          },
          {
            title: 'Pod Ephemeral Nature & Service Abstraction',
            description: 'Show a Pod icon. It flickers and then disappears, a new Pod icon appears in a different location/IP. Then, a "Service" icon (a stable box with a lightning bolt) appears, connected to multiple different Pods (that appeared and disappeared). "Client" sends traffic to the Service.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The Pod capsule icon is central, with connections to "Container," "IP," "Volume," and arrows pointing to "Scalability" and "Resilience."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Multi-Container Pod Example',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: web-server
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: shared-data
      mountPath: /usr/share/nginx/html
  - name: content-puller
    image: alpine/git
    command: ['sh', '-c', 'git clone https://github.com/example/content.git /data && sleep 3600']
    volumeMounts:
    - name: shared-data
      mountPath: /data
  volumes:
  - name: shared-data
    emptyDir: {}`,
        explanation: 'This Pod contains two containers sharing a volume: one serves web content while the other pulls content from git.'
      },
      keyPoints: [
        'Smallest deployable unit in Kubernetes',
        'Can contain one or more tightly coupled containers',
        'Containers share network namespace and storage volumes',
        'Each Pod gets a unique IP address',
        'Ephemeral by nature - data is lost when Pod terminates'
      ],
      quiz: [
        {
          question: 'What happens to data stored in an ephemeral volume when a Pod is terminated?',
          options: [
            'It is backed up automatically',
            'It is moved to another Pod',
            'It is permanently deleted along with the Pod',
            'It is stored in etcd'
          ],
          correct: 2,
          explanation: 'Ephemeral volumes are tied to the Pod\'s lifecycle, and their data is lost when the Pod is terminated.'
        },
        {
          question: 'How do containers within the same Pod communicate with each other?',
          options: [
            'Through the cluster DNS',
            'Via localhost as they share the same network namespace',
            'Using the Pod IP address',
            'Through environment variables only'
          ],
          correct: 1,
          explanation: 'Containers in the same Pod share the network namespace, allowing them to communicate over localhost.'
        }
      ]
    }
  },
  {
    id: 16,
    title: 'Pod Lifecycle and Phases',
    description: 'Understanding the journey of a Pod from creation to termination',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['pod-lifecycle', 'phases', 'troubleshooting', 'debugging'],
    content: {
      introduction: 'Pods progress through a series of distinct lifecycle phases, each indicative of their current state within the cluster.',
      conceptExplanation: 'The phases include: Pending (Pod accepted but containers not yet created), Running (all containers created and at least one running), Succeeded (all containers terminated successfully), Failed (at least one container terminated with failure), and Unknown (Pod state cannot be determined). Understanding these phases is crucial for troubleshooting and monitoring application health.',
      animation: {
        title: 'Pod Lifecycle Journey',
        description: 'Following a Pod through its complete lifecycle phases',
        scenes: [
          {
            title: 'Pod Creation',
            description: 'From API request to Pending state',
            duration: 3000
          },
          {
            title: 'Scheduling and Running',
            description: 'Scheduler assigns Pod to node, containers start running',
            duration: 4000
          },
          {
            title: 'Termination Scenarios',
            description: 'Different ways a Pod can end: Success, Failure, or Unknown',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Pod Status Information',
        code: `# Check Pod status
kubectl get pods -o wide

# Detailed Pod information
kubectl describe pod my-pod

# Example Pod status output
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
status:
  phase: Running
  conditions:
  - type: Initialized
    status: "True"
  - type: Ready
    status: "True"
  - type: ContainersReady
    status: "True"
  - type: PodScheduled
    status: "True"
  containerStatuses:
  - name: my-container
    state:
      running:
        startedAt: "2023-01-01T10:00:00Z"
    ready: true
    restartCount: 0`,
        explanation: 'This shows how to inspect Pod status and the detailed information available for troubleshooting Pod issues.'
      },
      keyPoints: [
        'Pods progress through distinct lifecycle phases',
        'Pending phase indicates scheduling or image pull delays',
        'Running phase means at least one container is active',
        'Failed phase requires investigation and potential restart',
        'Pod conditions provide detailed status information'
      ],
      quiz: [
        {
          question: 'What does it mean when a Pod is in the "Pending" phase?',
          options: [
            'The Pod is running successfully',
            'The Pod has been accepted but containers are not yet created',
            'The Pod has failed and needs restart',
            'The Pod is being deleted'
          ],
          correct: 1,
          explanation: 'Pending phase indicates the Pod has been accepted by Kubernetes but one or more containers have not yet been created, often due to scheduling or image pull issues.'
        },
        {
          question: 'Which command provides the most comprehensive information for troubleshooting a Pod?',
          options: [
            'kubectl get pod',
            'kubectl logs pod',
            'kubectl delete pod',
            'kubectl describe pod <pod-name>'
          ],
          correct: 3,
          explanation: 'kubectl describe pod provides a comprehensive overview of a Pod\'s state, including events, resource usage, and conditions, which is crucial for troubleshooting.'
        }
      ]
    }
  },
  {
    id: 17,
    title: 'Multi-Container Pods: Patterns and Use Cases',
    description: 'When and how to use multiple containers in a single Pod',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['multi-container', 'sidecar', 'ambassador', 'adapter'],
    content: {
      introduction: 'A Pod can be configured to contain more than one container when these containers are tightly coupled and necessitate sharing resources.',
      conceptExplanation: 'Containers co-located within a multi-container Pod share the same network namespace, allowing them to communicate efficiently via localhost, and can also share volumes for data exchange. Common patterns include: Sidecar (helper container), Ambassador (proxy container), and Adapter (data transformation container). These patterns enable separation of concerns while maintaining tight coupling.',
      animation: {
        title: 'Multi-Container Patterns',
        description: 'Exploring different multi-container Pod patterns and their use cases',
        scenes: [
          {
            title: 'Sidecar Pattern',
            description: 'Helper container providing additional functionality',
            duration: 3000
          },
          {
            title: 'Ambassador Pattern',
            description: 'Proxy container handling external communication',
            duration: 4000
          },
          {
            title: 'Adapter Pattern',
            description: 'Container transforming data for the main application',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Sidecar Logging Pattern',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: sidecar-logging-pod
spec:
  containers:
  - name: main-app
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: logs
      mountPath: /var/log/nginx
  - name: log-shipper
    image: fluent/fluent-bit
    volumeMounts:
    - name: logs
      mountPath: /var/log/nginx
      readOnly: true
    - name: fluent-bit-config
      mountPath: /fluent-bit/etc
  volumes:
  - name: logs
    emptyDir: {}
  - name: fluent-bit-config
    configMap:
      name: fluent-bit-config`,
        explanation: 'This demonstrates the sidecar pattern where a logging agent runs alongside the main application to collect and ship logs.'
      },
      keyPoints: [
        'Multiple containers share network namespace and volumes',
        'Communication via localhost between containers',
        'Common patterns: Sidecar, Ambassador, Adapter',
        'Enables separation of concerns with tight coupling',
        'Useful for cross-cutting concerns like logging and monitoring'
      ],
      quiz: [
        {
          question: 'How do containers in a multi-container Pod communicate with each other?',
          options: [
            'Through the Kubernetes API',
            'Via cluster DNS',
            'Via localhost as they share the same network namespace',
            'Through environment variables only'
          ],
          correct: 2,
          explanation: 'Containers in the same Pod share the network namespace, allowing them to communicate over localhost.'
        },
        {
          question: 'Which pattern involves a helper container that enhances the main application?',
          options: [
            'Ambassador pattern',
            'Adapter pattern',
            'Sidecar pattern',
            'Proxy pattern'
          ],
          correct: 2,
          explanation: 'The Sidecar pattern involves a helper container that provides additional functionality to the main application container.'
        }
      ]
    }
  },
  {
    id: 18,
    title: 'ReplicaSets: Ensuring Pod Availability',
    description: 'Maintaining desired number of Pod replicas for high availability',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['replicaset', 'replicas', 'high-availability', 'scaling'],
    content: {
      introduction: 'A ReplicaSet ensures that a specified number of Pod replicas are running at any given time.',
      conceptExplanation: 'It continuously monitors the cluster to maintain the desired state, automatically creating new Pods if some fail or are deleted, and removing excess Pods if there are too many. ReplicaSets use label selectors to identify which Pods they manage. While you can create ReplicaSets directly, they are typically managed by higher-level controllers like Deployments, which provide additional features like rolling updates.',
      animation: {
        title: 'ReplicaSets: Ensuring Pod Availability',
        description: 'Explaining how Kubernetes ReplicaSets maintain the desired number of Pod replicas and provide high availability through automatic recovery',
        scenes: [
          {
            title: 'The Problem - Single Point of Failure',
            description: 'A single "Pod" is running an application. If this Pod crashes or the node fails, the application becomes unavailable. Users cannot access the service, leading to downtime.',
            duration: 4000
          },
          {
            title: 'Introducing ReplicaSets - The Pod Manager',
            description: 'A "ReplicaSet" icon (a manager with a clipboard) appears. It is configured with a "desired replica count" (e.g., replicas: 3). The ReplicaSet creates and manages multiple identical Pods.',
            duration: 3000
          },
          {
            title: 'Label Selectors - Pod Identification',
            description: 'The ReplicaSet uses "Label Selectors" (a magnifying glass) to identify which Pods it manages. Pods with matching labels (e.g., app=web, version=v1) are highlighted and connected to the ReplicaSet.',
            duration: 3000
          },
          {
            title: 'Continuous Monitoring',
            description: 'The ReplicaSet continuously monitors the cluster. It counts the number of running Pods that match its selector and compares this to the desired replica count. Show a "monitoring dashboard" with current vs desired counts.',
            duration: 4000
          },
          {
            title: 'Automatic Recovery - Pod Failure',
            description: 'One of the Pods fails (turns red and disappears). The ReplicaSet immediately detects that the current count (2) is less than desired (3). It automatically creates a new Pod to replace the failed one.',
            duration: 4000
          },
          {
            title: 'Scaling Operations',
            description: 'The desired replica count is updated (e.g., from 3 to 5). The ReplicaSet detects the change and creates 2 additional Pods. Conversely, if scaled down (5 to 2), it terminates excess Pods.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The ReplicaSet icon is central, connected to multiple Pods, with benefits highlighted: "High Availability," "Automatic Recovery," "Desired State," "Load Distribution."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'ReplicaSet Configuration',
        code: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
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
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi`,
        explanation: 'This ReplicaSet ensures exactly 3 nginx Pods are always running, automatically replacing any that fail.'
      },
      keyPoints: [
        'Maintains specified number of Pod replicas',
        'Automatically replaces failed or deleted Pods',
        'Uses label selectors to identify managed Pods',
        'Provides basic high availability and fault tolerance',
        'Usually managed by Deployments rather than created directly'
      ],
      quiz: [
        {
          question: 'What happens if you manually delete a Pod managed by a ReplicaSet?',
          options: [
            'The Pod is permanently deleted',
            'The ReplicaSet creates a new Pod to replace it',
            'The ReplicaSet reduces its replica count',
            'An error is logged but nothing happens'
          ],
          correct: 1,
          explanation: 'ReplicaSets continuously monitor and maintain the desired number of replicas, automatically creating new Pods to replace deleted ones.'
        },
        {
          question: 'How does a ReplicaSet identify which Pods it should manage?',
          options: [
            'By Pod name prefix',
            'By namespace location',
            'By label selectors',
            'By creation timestamp'
          ],
          correct: 2,
          explanation: 'ReplicaSets use label selectors to identify and manage Pods that match the specified labels.'
        }
      ]
    }
  },
  {
    id: 19,
    title: 'Deployments: Declarative Application Management',
    description: 'The preferred way to manage stateless applications in Kubernetes',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['deployments', 'rolling-updates', 'rollbacks', 'declarative'],
    content: {
      introduction: 'Deployments provide a declarative way to manage stateless applications, offering features like rolling updates, rollbacks, and scaling.',
      conceptExplanation: 'A Deployment manages ReplicaSets and provides declarative updates to Pods. When you update a Deployment, it creates a new ReplicaSet and gradually shifts traffic from the old ReplicaSet to the new one, enabling zero-downtime deployments. Deployments maintain a revision history, allowing you to rollback to previous versions if issues arise. This makes Deployments the preferred method for managing stateless applications.',
      animation: {
        title: 'Deployments: Managing Application Lifecycle',
        description: 'Explaining Kubernetes Deployments, their relationship with ReplicaSets, and how they enable rolling updates and rollbacks',
        scenes: [
          {
            title: 'The Problem - Manual Pod Management',
            description: 'A user manually creates individual "Pod" icons. When one Pod fails (turns red), the user has to manually detect and replace it. When the user wants to update the application, they have to manually delete old Pods and create new ones, causing downtime.',
            duration: 4000
          },
          {
            title: 'Introducing Deployments - The Application Manager',
            description: 'A "Deployment" icon (a manager with a clipboard) appears. The Deployment creates a "ReplicaSet" (a smaller manager), which in turn creates and manages multiple "Pod" icons.',
            duration: 3000
          },
          {
            title: 'Self-Healing in Action',
            description: 'One of the Pods fails (turns red). The ReplicaSet immediately detects this and creates a new Pod to replace it, maintaining the desired number of replicas.',
            duration: 3000
          },
          {
            title: 'Rolling Updates - Zero Downtime',
            description: 'The user updates the Deployment (e.g., new image version). The Deployment creates a new ReplicaSet (v2). The new ReplicaSet gradually creates new Pods while the old ReplicaSet gradually terminates old Pods. Show traffic flowing to both old and new Pods during the transition.',
            duration: 5000
          },
          {
            title: 'Rollback Capability',
            description: 'The new version has issues (some v2 Pods turn red). The Deployment quickly switches back to the old ReplicaSet (v1), terminating the problematic v2 Pods and scaling up the stable v1 Pods.',
            duration: 4000
          },
          {
            title: 'Scaling Operations',
            description: 'The Deployment receives a scaling command. The current ReplicaSet adjusts the number of Pods accordingly (scaling up or down) to match the new desired replica count.',
            duration: 3000
          },
          {
            title: 'Deployment Hierarchy Summary',
            description: 'Show the complete hierarchy: "Deployment" manages "ReplicaSet(s)" which manage "Pod(s)". Highlight the benefits: "Self-Healing," "Rolling Updates," "Rollbacks," "Scaling."',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Deployment with Rolling Update Strategy',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
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
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi`,
        explanation: 'This Deployment uses rolling update strategy to ensure zero-downtime deployments when updating the application.'
      },
      keyPoints: [
        'Provides declarative management of stateless applications',
        'Manages ReplicaSets automatically',
        'Supports rolling updates for zero-downtime deployments',
        'Maintains revision history for easy rollbacks',
        'Preferred method for managing stateless workloads'
      ],
      quiz: [
        {
          question: 'What is the main advantage of using Deployments over ReplicaSets directly?',
          options: [
            'Better performance',
            'Lower resource usage',
            'Rolling updates and rollback capabilities',
            'Simpler configuration'
          ],
          correct: 2,
          explanation: 'Deployments provide rolling updates and rollback capabilities that ReplicaSets alone do not offer, enabling zero-downtime deployments.'
        },
        {
          question: 'During a rolling update, what does the "maxSurge" parameter control?',
          options: [
            'Maximum number of Pods that can be unavailable',
            'Maximum number of additional Pods that can be created',
            'Maximum time for the update to complete',
            'Maximum number of rollback revisions to keep'
          ],
          correct: 1,
          explanation: 'maxSurge controls the maximum number of additional Pods that can be created above the desired replica count during a rolling update.'
        }
      ]
    }
  },
  {
    id: 20,
    title: 'Services: Stable Network Endpoints',
    description: 'Providing consistent access to dynamic Pod collections',
    duration: '18 min',
    difficulty: 'Intermediate',
    category: 'Networking',
    tags: ['services', 'networking', 'load-balancing', 'service-discovery'],
    content: {
      introduction: 'Services provide a stable network endpoint for accessing a dynamic set of Pods.',
      conceptExplanation: 'Since Pods are ephemeral and their IP addresses change when they are recreated, Services abstract this complexity by providing a consistent virtual IP address and DNS name. Services use label selectors to determine which Pods should receive traffic and automatically load balance requests across healthy Pods. Different Service types (ClusterIP, NodePort, LoadBalancer) provide different levels of network exposure.',
      animation: {
        title: 'Services: The Network Abstraction',
        description: 'Explaining how Kubernetes Services provide stable network endpoints for dynamic Pod collections and enable service discovery',
        scenes: [
          {
            title: 'The Problem - Dynamic Pod IPs',
            description: 'Multiple "Pod" icons are running, each with a different IP address (e.g., 10.1.1.5, 10.1.1.8, 10.1.1.12). A "Client" tries to connect to them directly. Suddenly, one Pod dies and is replaced with a new Pod that has a different IP address (e.g., 10.1.1.20). The Client\'s connection breaks.',
            duration: 4000
          },
          {
            title: 'Introducing Services - The Stable Endpoint',
            description: 'A "Service" icon (a stable gateway or proxy) appears between the Client and the Pods. The Service gets a stable "Virtual IP" (e.g., 10.96.1.100) and a "DNS Name" (e.g., my-app-service).',
            duration: 3000
          },
          {
            title: 'Label Selectors - Finding the Right Pods',
            description: 'The Service uses "Label Selectors" (a magnifying glass) to identify which Pods it should route traffic to. Pods with matching labels (e.g., app=web) are highlighted and connected to the Service.',
            duration: 3000
          },
          {
            title: 'Load Balancing in Action',
            description: 'The Client sends requests to the Service\'s stable IP. The Service distributes (load balances) these requests across the healthy Pods. Show arrows from the Service to different Pods, representing traffic distribution.',
            duration: 4000
          },
          {
            title: 'Self-Healing and Dynamic Updates',
            description: 'One Pod fails and is replaced. The Service automatically detects the new Pod (via label selectors) and starts routing traffic to it, while removing the failed Pod from its pool.',
            duration: 4000
          },
          {
            title: 'Service Types Overview',
            description: 'Show three different Service types: ClusterIP: Internal access only (within cluster). NodePort: External access via Node IPs. LoadBalancer: External access via cloud load balancer.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The Service icon is central, connected to multiple Pods, with benefits highlighted: "Stable Endpoint," "Load Balancing," "Service Discovery," "Decoupling."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Service Types Example',
        code: `# ClusterIP Service (default)
apiVersion: v1
kind: Service
metadata:
  name: internal-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
# NodePort Service
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080
  type: NodePort`,
        explanation: 'ClusterIP provides internal cluster access, while NodePort exposes the service on each node\'s IP at a static port.'
      },
      keyPoints: [
        'Provide stable network endpoints for ephemeral Pods',
        'Use label selectors to identify backend Pods',
        'Automatically load balance traffic across healthy Pods',
        'Different types provide different exposure levels',
        'Essential for microservices communication'
      ],
      quiz: [
        {
          question: 'Why are Services necessary in Kubernetes?',
          options: [
            'To provide persistent storage',
            'To manage container images',
            'To provide stable network endpoints for ephemeral Pods',
            'To handle authentication'
          ],
          correct: 2,
          explanation: 'Services are necessary because Pods are ephemeral and their IP addresses change, so Services provide stable endpoints for accessing dynamic Pod collections.'
        },
        {
          question: 'Which Service type is accessible from outside the Kubernetes cluster by default?',
          options: [
            'ClusterIP',
            'NodePort',
            'ExternalName',
            'Headless'
          ],
          correct: 1,
          explanation: 'NodePort Services are accessible from outside the cluster by exposing the service on each node\'s IP at a static port.'
        }
      ]
    }
  },
  {
    id: 21,
    title: 'Rolling Updates and Rollbacks',
    description: 'Zero-downtime deployments and safe rollback strategies',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['rolling-updates', 'rollbacks', 'deployment-strategy', 'zero-downtime'],
    content: {
      introduction: 'Rolling updates enable zero-downtime deployments by gradually replacing old application versions with new ones.',
      conceptExplanation: 'Kubernetes Deployments support rolling updates as the default strategy, which incrementally replaces Pods with new versions while maintaining service availability. The process is controlled by parameters like maxUnavailable and maxSurge. If issues arise, rollbacks can quickly revert to previous versions using the deployment revision history. This approach minimizes risk and ensures continuous service availability during updates.',
      animation: {
        title: 'Rolling Update Process',
        description: 'Visualizing how rolling updates maintain availability during deployments',
        scenes: [
          {
            title: 'Current State',
            description: 'Application running with version 1.0 across multiple Pods',
            duration: 3000
          },
          {
            title: 'Rolling Update',
            description: 'Gradually replacing v1.0 Pods with v2.0 while maintaining availability',
            duration: 4000
          },
          {
            title: 'Rollback Scenario',
            description: 'Quickly reverting to previous version when issues are detected',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Rolling Update Configuration',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1    # Max 1 Pod can be unavailable
      maxSurge: 1          # Max 1 extra Pod during update
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
        image: myapp:v2.0
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`,
        explanation: 'This configuration ensures at least 3 Pods remain available during updates, with readiness probes ensuring new Pods are healthy before receiving traffic.'
      },
      keyPoints: [
        'Enables zero-downtime deployments through gradual Pod replacement',
        'Controlled by maxUnavailable and maxSurge parameters',
        'Maintains service availability throughout the update process',
        'Supports quick rollbacks to previous versions',
        'Uses readiness probes to ensure new Pods are healthy'
      ],
      quiz: [
        {
          question: 'What does the "maxSurge" parameter control during a rolling update?',
          options: [
            'Maximum number of Pods that can be unavailable',
            'Maximum number of additional Pods created above desired count',
            'Maximum time allowed for the update',
            'Maximum number of failed Pods before rollback'
          ],
          correct: 1,
          explanation: 'maxSurge controls how many additional Pods can be created above the desired replica count during a rolling update.'
        },
        {
          question: 'How can you quickly rollback a Deployment to the previous version?',
          options: [
            'kubectl delete deployment',
            'kubectl rollout undo deployment <name>',
            'kubectl scale deployment <name> --replicas=0',
            'kubectl restart deployment <name>'
          ],
          correct: 1,
          explanation: 'kubectl rollout undo allows you to quickly rollback a Deployment to the previous revision in its history.'
        }
      ]
    }
  },
  {
    id: 22,
    title: 'ReplicaSets: Ensuring Desired Pod Count',
    description: 'Understanding the controller that maintains Pod replicas',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['replicaset', 'pod-management', 'scaling', 'fault-tolerance'],
    content: {
      introduction: 'ReplicaSets ensure that a specified number of Pod replicas are running at any given time.',
      conceptExplanation: 'A ReplicaSet continuously monitors the cluster state and takes corrective action to maintain the desired number of Pod replicas. It uses label selectors to identify which Pods it manages and automatically creates or deletes Pods as needed. While ReplicaSets can be created directly, they are typically managed by higher-level controllers like Deployments, which provide additional features like rolling updates and rollback capabilities.',
      animation: {
        title: 'ReplicaSet Management',
        description: 'How ReplicaSets maintain desired Pod count and handle failures',
        scenes: [
          {
            title: 'Desired State Monitoring',
            description: 'ReplicaSet continuously watches Pod count vs desired replicas',
            duration: 3000
          },
          {
            title: 'Automatic Recovery',
            description: 'Creating replacement Pods when existing ones fail',
            duration: 4000
          },
          {
            title: 'Scaling Operations',
            description: 'Adding or removing Pods when replica count changes',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'ReplicaSet Example',
        code: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend-replicaset
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
      tier: web
  template:
    metadata:
      labels:
        app: frontend
        tier: web
    spec:
      containers:
      - name: frontend
        image: nginx:1.20
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi`,
        explanation: 'This ReplicaSet ensures exactly 3 frontend Pods are always running, automatically replacing any that fail or are deleted.'
      },
      keyPoints: [
        'Maintains specified number of Pod replicas automatically',
        'Uses label selectors to identify managed Pods',
        'Provides basic fault tolerance and high availability',
        'Usually managed by Deployments rather than created directly',
        'Continuously reconciles actual state with desired state'
      ],
      quiz: [
        {
          question: 'What happens if you manually delete a Pod managed by a ReplicaSet?',
          options: [
            'The Pod stays deleted permanently',
            'The ReplicaSet creates a new Pod to replace it',
            'The ReplicaSet decreases its replica count',
            'An error is logged but no action is taken'
          ],
          correct: 1,
          explanation: 'ReplicaSets continuously monitor and maintain the desired number of replicas, automatically creating new Pods to replace deleted ones.'
        },
        {
          question: 'How does a ReplicaSet identify which Pods it should manage?',
          options: [
            'By Pod name patterns',
            'By namespace location',
            'By label selectors',
            'By creation timestamps'
          ],
          correct: 2,
          explanation: 'ReplicaSets use label selectors to identify and manage Pods that match the specified labels.'
        }
      ]
    }
  },
  {
    id: 23,
    title: 'StatefulSets: Managing Stateful Applications',
    description: 'Stable identity and ordered deployment for stateful workloads',
    duration: '20 min',
    difficulty: 'Advanced',
    category: 'Workloads',
    tags: ['statefulset', 'stateful-apps', 'persistent-storage', 'ordered-deployment'],
    content: {
      introduction: 'StatefulSets manage stateful applications that require stable network identities, persistent storage, and ordered deployment.',
      conceptExplanation: 'Unlike Deployments, StatefulSets provide guarantees about the ordering and uniqueness of Pods. Each Pod gets a stable hostname, persistent storage, and ordinal index. StatefulSets are ideal for databases, distributed systems, and applications that require stable network identities or persistent data. They ensure ordered deployment, scaling, and termination, making them suitable for applications with specific startup dependencies.',
      animation: {
        title: 'StatefulSets: Managing Stateful Applications',
        description: 'Explaining how Kubernetes StatefulSets provide stable identity, persistent storage, and ordered deployment for stateful applications like databases',
        scenes: [
          {
            title: 'The Problem - Stateless vs Stateful Applications',
            description: 'Show "Stateless Apps" (web servers) that can be easily replaced vs "Stateful Apps" (databases) that need stable identity, persistent data, and specific startup order. Highlight the challenges of running databases in Kubernetes.',
            duration: 4000
          },
          {
            title: 'Introducing StatefulSets - The Database Manager',
            description: 'A "StatefulSet" icon (a database manager with a clipboard) appears. Unlike Deployments, StatefulSets provide guarantees about Pod identity, storage, and ordering.',
            duration: 3000
          },
          {
            title: 'Stable Network Identity',
            description: 'StatefulSet Pods get predictable names: database-0, database-1, database-2. Each Pod has a stable hostname and DNS entry that persists across restarts, unlike Deployment Pods with random names.',
            duration: 4000
          },
          {
            title: 'Persistent Storage Binding',
            description: 'Each StatefulSet Pod gets its own "Persistent Volume Claim" (PVC). Show database-0 → pvc-0, database-1 → pvc-1. This binding persists even if Pods are deleted and recreated.',
            duration: 4000
          },
          {
            title: 'Ordered Deployment and Scaling',
            description: 'StatefulSet creates Pods sequentially: database-0 starts first, then database-1, then database-2. Each Pod must be "Ready" before the next one starts. This ensures proper initialization order.',
            duration: 4000
          },
          {
            title: 'Ordered Termination',
            description: 'When scaling down, StatefulSet terminates Pods in reverse order: database-2 first, then database-1, then database-0. This ensures graceful shutdown and data consistency.',
            duration: 4000
          },
          {
            title: 'Headless Service Integration',
            description: 'StatefulSets work with "Headless Services" to provide direct Pod-to-Pod communication. Show how each Pod gets its own DNS entry: database-0.service.namespace.svc.cluster.local.',
            duration: 4000
          },
          {
            title: 'Use Cases and Benefits',
            description: 'Show common StatefulSet applications: Databases: MySQL, PostgreSQL, MongoDB. Distributed Systems: Kafka, Elasticsearch, Cassandra. Benefits: Data Persistence, Stable Identity, Ordered Operations.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The StatefulSet icon is central, connected to ordered Pods with persistent storage, with benefits: "Stable Identity," "Persistent Data," "Ordered Operations," "Database Ready."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'StatefulSet with Persistent Storage',
        code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database-cluster
spec:
  serviceName: "database-service"
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
      - name: database
        image: postgres:13
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: myapp
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi`,
        explanation: 'This StatefulSet creates 3 database Pods (database-cluster-0, database-cluster-1, database-cluster-2) each with its own persistent storage.'
      },
      keyPoints: [
        'Provides stable network identities and persistent storage',
        'Ensures ordered deployment, scaling, and termination',
        'Each Pod gets a predictable hostname and ordinal index',
        'Ideal for databases and distributed systems',
        'Maintains Pod-to-storage relationships across restarts'
      ],
      quiz: [
        {
          question: 'What is the main difference between StatefulSets and Deployments?',
          options: [
            'StatefulSets are faster to deploy',
            'StatefulSets provide stable identity and ordered operations',
            'StatefulSets use less resources',
            'StatefulSets are only for web applications'
          ],
          correct: 1,
          explanation: 'StatefulSets provide stable network identities, persistent storage, and ordered deployment/scaling, unlike Deployments which treat Pods as interchangeable.'
        },
        {
          question: 'How are StatefulSet Pods named?',
          options: [
            'Random names like Deployment Pods',
            'Based on the container image name',
            'Predictable names with ordinal indices (e.g., web-0, web-1)',
            'Based on the node they run on'
          ],
          correct: 2,
          explanation: 'StatefulSet Pods are named predictably with ordinal indices, like <statefulset-name>-<ordinal>, ensuring stable network identities.'
        }
      ]
    }
  },
  {
    id: 24,
    title: 'DaemonSet: Ensuring One Pod Per Node',
    description: 'Running system-level services across all cluster nodes',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['daemonset', 'node-agents', 'system-services', 'cluster-wide'],
    content: {
      introduction: 'DaemonSets ensure that a copy of a Pod runs on all (or selected) nodes in the cluster.',
      conceptExplanation: 'DaemonSets are typically used for cluster-wide services like log collection, monitoring agents, or network plugins that need to run on every node. When nodes are added to the cluster, DaemonSet Pods are automatically scheduled on them. When nodes are removed, those Pods are garbage collected. DaemonSets can also use node selectors to run only on specific nodes that match certain criteria.',
      animation: {
        title: 'DaemonSet: Ensuring One Pod Per Node',
        description: 'Explaining how Kubernetes DaemonSets ensure system-level services run on every node in the cluster for cluster-wide functionality',
        scenes: [
          {
            title: 'The Problem - System Services Gap',
            description: 'A Kubernetes cluster with multiple "Worker Nodes" but no system-level services like log collection, monitoring agents, or network plugins. Each node operates in isolation without essential cluster-wide services.',
            duration: 4000
          },
          {
            title: 'Introducing DaemonSets - The Node Guardian',
            description: 'A "DaemonSet" icon (a guardian or supervisor) appears. It is responsible for ensuring that specific system services run on every node in the cluster.',
            duration: 3000
          },
          {
            title: 'Automatic Pod Placement',
            description: 'The DaemonSet automatically creates one "Pod" on each "Worker Node" in the cluster. Show identical Pods (e.g., log-collector, monitoring-agent) appearing on each node simultaneously.',
            duration: 4000
          },
          {
            title: 'Node Addition - Automatic Scaling',
            description: 'A new "Worker Node" joins the cluster. The DaemonSet immediately detects this and automatically schedules its Pod on the new node, ensuring consistent coverage.',
            duration: 4000
          },
          {
            title: 'Node Removal - Automatic Cleanup',
            description: 'A "Worker Node" is removed from the cluster (maintenance, failure, scaling down). The DaemonSet automatically cleans up the Pod that was running on that node.',
            duration: 3000
          },
          {
            title: 'Node Selectors - Targeted Deployment',
            description: 'Show advanced usage: DaemonSet with "Node Selectors" (e.g., disktype=ssd, zone=us-west). Only nodes matching the selector criteria get the DaemonSet Pods, enabling targeted deployment.',
            duration: 4000
          },
          {
            title: 'Common Use Cases',
            description: 'Show typical DaemonSet applications: Log Collection: Fluentd/Filebeat on every node. Monitoring: Node Exporter for metrics. Networking: CNI plugins, kube-proxy. Security: Security agents and scanners.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The DaemonSet icon is central, connected to multiple nodes with identical Pods, with benefits: "Cluster-wide Coverage," "Automatic Management," "System Services," "Node Lifecycle Awareness."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'DaemonSet for Log Collection',
        code: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
  labels:
    app: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: log-collector
        image: fluent/fluent-bit:1.8
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      nodeSelector:
        kubernetes.io/os: linux`,
        explanation: 'This DaemonSet runs a log collector on every Linux node, mounting the host /var/log directory to collect system logs.'
      },
      keyPoints: [
        'Ensures one Pod runs on all or selected nodes',
        'Automatically schedules Pods on new nodes',
        'Ideal for system-level services and monitoring agents',
        'Supports node selectors for targeted deployment',
        'Pods are garbage collected when nodes are removed'
      ],
      quiz: [
        {
          question: 'What happens when a new node joins a cluster with an existing DaemonSet?',
          options: [
            'Nothing happens automatically',
            'A DaemonSet Pod is automatically scheduled on the new node',
            'The DaemonSet needs to be manually updated',
            'All DaemonSet Pods are recreated'
          ],
          correct: 1,
          explanation: 'DaemonSets automatically schedule Pods on new nodes that join the cluster, ensuring the desired state is maintained.'
        },
        {
          question: 'Which type of application is most suitable for DaemonSets?',
          options: [
            'Web applications',
            'Databases',
            'Log collection agents',
            'Batch processing jobs'
          ],
          correct: 2,
          explanation: 'Log collection agents and other system-level services that need to run on every node are ideal candidates for DaemonSets.'
        }
      ]
    }
  },
  {
    id: 25,
    title: 'Jobs: Run-to-Completion Workloads',
    description: 'Managing batch processing and one-time tasks',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['jobs', 'batch-processing', 'one-time-tasks', 'completion'],
    content: {
      introduction: 'Jobs manage Pods that are expected to run to completion, making them ideal for batch processing and one-time tasks.',
      conceptExplanation: 'Unlike Deployments that maintain long-running services, Jobs ensure that a specified number of Pods successfully complete their tasks. Jobs can run Pods sequentially or in parallel, and they handle Pod failures by restarting them until the desired number of successful completions is reached. Jobs are perfect for data processing, backups, migrations, and other finite workloads.',
      animation: {
        title: 'Jobs: Run-to-Completion Workloads',
        description: 'Explaining how Kubernetes Jobs manage batch processing and one-time tasks that need to run to completion, unlike long-running services',
        scenes: [
          {
            title: 'The Problem - Long-Running vs Finite Tasks',
            description: 'Show "Long-Running Services" (web servers, APIs) that should never stop vs "Finite Tasks" (data processing, backups, migrations) that need to complete and exit. Highlight the challenge of managing completion.',
            duration: 4000
          },
          {
            title: 'Introducing Jobs - The Task Manager',
            description: 'A "Job" icon (a task manager with a checklist) appears. Jobs are designed to run Pods that perform specific tasks and then terminate successfully.',
            duration: 3000
          },
          {
            title: 'Single Task Execution',
            description: 'Show a simple Job creating one "Pod" to perform a task (e.g., database backup). The Pod runs, completes the task, and exits with success (exit code 0). The Job marks the task as completed.',
            duration: 4000
          },
          {
            title: 'Failure Handling and Retries',
            description: 'A Pod fails during task execution (exit code 1). The Job automatically creates a new Pod to retry the task. Show the retry mechanism with backoffLimit controlling maximum retry attempts.',
            duration: 4000
          },
          {
            title: 'Parallel Processing',
            description: 'Show a Job with parallelism=3 creating multiple Pods simultaneously to process tasks in parallel (e.g., processing different data chunks). This speeds up completion for large workloads.',
            duration: 4000
          },
          {
            title: 'Completion Tracking',
            description: 'Show completions=5 where the Job needs 5 successful Pod completions. Track progress: 1/5, 2/5, 3/5, 4/5, 5/5 complete. The Job finishes when the target is reached.',
            duration: 4000
          },
          {
            title: 'Job Lifecycle States',
            description: 'Show Job progression through states: Active: Pods are running. Succeeded: Required completions reached. Failed: Exceeded backoffLimit retries. Show how to monitor job status.',
            duration: 4000
          },
          {
            title: 'Common Use Cases',
            description: 'Show typical Job applications: Data Processing: ETL pipelines, batch analytics. Maintenance: Database migrations, cleanup tasks. Backups: Scheduled data backups. CI/CD: Build and test jobs.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The Job icon is central, connected to completed tasks with checkmarks, with benefits: "Task Completion," "Failure Recovery," "Parallel Processing," "Batch Ready."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Parallel Job Example',
        code: `apiVersion: batch/v1
kind: Job
metadata:
  name: data-processing-job
spec:
  completions: 10        # Total successful completions needed
  parallelism: 3         # Max Pods running in parallel
  backoffLimit: 3        # Max retries for failed Pods
  template:
    spec:
      containers:
      - name: processor
        image: data-processor:v1.0
        command: ["python", "process_data.py"]
        env:
        - name: BATCH_SIZE
          value: "1000"
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 1000m
            memory: 2Gi
      restartPolicy: Never`,
        explanation: 'This Job processes data in parallel using up to 3 Pods at a time, requiring 10 successful completions total.'
      },
      keyPoints: [
        'Manages Pods that run to completion rather than continuously',
        'Handles Pod failures by restarting until success',
        'Supports both sequential and parallel execution',
        'Ideal for batch processing, backups, and migrations',
        'Tracks completion count and provides failure handling'
      ],
      quiz: [
        {
          question: 'What is the main difference between a Job and a Deployment?',
          options: [
            'Jobs are faster to create',
            'Jobs manage Pods that run to completion, Deployments manage long-running services',
            'Jobs use less resources',
            'Jobs can only run one Pod at a time'
          ],
          correct: 1,
          explanation: 'Jobs are designed for finite tasks that run to completion, while Deployments manage long-running services that should stay running.'
        },
        {
          question: 'What does the "parallelism" field control in a Job?',
          options: [
            'Total number of completions needed',
            'Maximum number of Pods running simultaneously',
            'Number of retries for failed Pods',
            'Timeout for job completion'
          ],
          correct: 1,
          explanation: 'The parallelism field controls the maximum number of Pods that can run simultaneously to complete the job tasks.'
        }
      ]
    }
  },
  {
    id: 26,
    title: 'CronJobs: Scheduled Workloads',
    description: 'Running Jobs on a time-based schedule like cron',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Workloads',
    tags: ['cronjob', 'scheduled-tasks', 'automation', 'periodic-jobs'],
    content: {
      introduction: 'CronJobs create Jobs on a repeating schedule, similar to the traditional cron utility in Unix systems.',
      conceptExplanation: 'CronJobs are perfect for periodic tasks like backups, report generation, data cleanup, or any recurring maintenance tasks. They use the standard cron format for scheduling and can be configured with policies for handling missed executions, concurrent runs, and job history retention. CronJobs provide a reliable way to automate routine operations in your Kubernetes cluster.',
      animation: {
        title: 'CronJobs: Scheduled Workloads',
        description: 'Explaining how Kubernetes CronJobs automate recurring tasks by creating Jobs on a time-based schedule, similar to traditional cron',
        scenes: [
          {
            title: 'The Problem - Manual Recurring Tasks',
            description: 'Show manual recurring tasks: daily backups, weekly reports, monthly cleanup. A system administrator manually running these tasks at specific times, leading to inconsistency and human error.',
            duration: 4000
          },
          {
            title: 'Introducing CronJobs - The Scheduler',
            description: 'A "CronJob" icon (a clock with a task list) appears. CronJobs automate the creation of Jobs based on time schedules, eliminating manual intervention.',
            duration: 3000
          },
          {
            title: 'Cron Schedule Format',
            description: 'Show the cron format: "0 2 * * *" (daily at 2 AM). Break down the five fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6). Show common examples.',
            duration: 4000
          },
          {
            title: 'Automatic Job Creation',
            description: 'At the scheduled time (e.g., 2:00 AM), the CronJob automatically creates a new "Job" which then creates "Pods" to execute the task. Show the hierarchy: CronJob → Job → Pod.',
            duration: 4000
          },
          {
            title: 'Concurrency Control',
            description: 'Show concurrencyPolicy options: Allow: Multiple jobs can run simultaneously. Forbid: Skip new job if previous is still running. Replace: Cancel previous job and start new one.',
            duration: 4000
          },
          {
            title: 'History and Cleanup',
            description: 'Show successfulJobsHistoryLimit and failedJobsHistoryLimit controlling how many completed Jobs to keep. Old Jobs are automatically cleaned up to prevent resource accumulation.',
            duration: 3000
          },
          {
            title: 'Missed Executions Handling',
            description: 'Show startingDeadlineSeconds: if a scheduled execution is missed (cluster downtime), CronJob can skip it or run it late based on the deadline configuration.',
            duration: 4000
          },
          {
            title: 'Common Use Cases',
            description: 'Show typical CronJob applications: Backups: Daily database backups. Reports: Weekly analytics reports. Cleanup: Monthly log cleanup. Monitoring: Hourly health checks.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The CronJob icon is central, connected to a clock and multiple scheduled Jobs, with benefits: "Automated Scheduling," "Reliable Execution," "History Management," "No Manual Intervention."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Daily Backup CronJob',
        code: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 2 * * *"    # Every day at 2:00 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:v1.0
            command: ["sh", "-c"]
            args:
            - |
              echo "Starting backup at $(date)"
              # Backup commands here
              pg_dump mydb > /backup/backup-$(date +%Y%m%d).sql
              echo "Backup completed at $(date)"
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1`,
        explanation: 'This CronJob runs a database backup every day at 2 AM, keeping the last 3 successful and 1 failed job for history.'
      },
      keyPoints: [
        'Creates Jobs automatically on a time-based schedule',
        'Uses standard cron format for scheduling',
        'Perfect for backups, cleanup, and maintenance tasks',
        'Configurable policies for concurrency and history',
        'Provides reliable automation for recurring operations'
      ],
      quiz: [
        {
          question: 'What does the cron expression "0 */6 * * *" mean?',
          options: [
            'Every 6 minutes',
            'Every 6 hours',
            'Every 6 days',
            'At 6 AM every day'
          ],
          correct: 1,
          explanation: 'The expression "0 */6 * * *" means every 6 hours (at minute 0 of hours 0, 6, 12, 18).'
        },
        {
          question: 'What happens if a CronJob is scheduled to run while the previous Job is still running?',
          options: [
            'The new Job is automatically cancelled',
            'Both Jobs run concurrently by default',
            'The old Job is terminated',
            'An error is logged'
          ],
          correct: 1,
          explanation: 'By default, CronJobs allow concurrent execution. You can use concurrencyPolicy to control this behavior.'
        }
      ]
    }
  },
  {
    id: 27,
    title: 'Node Affinity: Preferring and Requiring Nodes',
    description: 'Advanced Pod scheduling based on node characteristics',
    duration: '18 min',
    difficulty: 'Advanced',
    category: 'Scheduling',
    tags: ['node-affinity', 'scheduling', 'node-selection', 'constraints'],
    content: {
      introduction: 'Node affinity allows you to constrain which nodes your Pods can be scheduled on based on node labels.',
      conceptExplanation: 'Node affinity is a more expressive and flexible alternative to nodeSelector. It supports both "required" rules (hard constraints) and "preferred" rules (soft constraints). Required rules must be met for a Pod to be scheduled, while preferred rules are used as hints to the scheduler. This enables sophisticated scheduling decisions based on node characteristics like hardware capabilities, geographic location, or availability zones.',
      animation: {
        title: 'Node Affinity: Advanced Node Assignment',
        description: 'Explaining Node Affinity as a more powerful and flexible way to constrain Pods to specific nodes based on labels, including preferred and required rules',
        scenes: [
          {
            title: 'Node Selector\'s Limitations Recap',
            description: 'Show a nodeSelector: disktype: ssd rule. A "What about \'preferred\' nodes? Or multiple conditions?" thought bubble appears.',
            duration: 3000
          },
          {
            title: 'Introducing Node Affinity - The Smart Matchmaker',
            description: 'A "Node Affinity" icon (a sophisticated matchmaker with a spectrum of preferences) appears.',
            duration: 3000
          },
          {
            title: 'requiredDuringSchedulingIgnoredDuringExecution',
            description: 'A Pod YAML shows requiredDuringSchedulingIgnoredDuringExecution. A Pod must land on a node with disktype: ssd (Node A). If Node A is unavailable, the Pod stays pending. If Node A\'s label changes while the Pod is running, the Pod continues to run (ignored during execution).',
            duration: 4000
          },
          {
            title: 'preferredDuringSchedulingIgnoredDuringExecution',
            description: 'A Pod YAML shows preferredDuringSchedulingIgnoredDuringExecution for disktype: ssd (Node A), but Node A is busy. The Pod prefers Node A, but can still go to Node B (with disktype: hdd) if A is full. If Node A\'s label changes while Pod is running, it stays running.',
            duration: 4000
          },
          {
            title: 'Match Operators (In, NotIn, Exists, etc.)',
            description: 'Show Pod requests using operators: environment In (prod, staging): Pod can go to either Prod or Staging nodes. zone NotIn (us-east-1a): Pod avoids specific zone.',
            duration: 4000
          },
          {
            title: 'Weighting for Preferred Rules',
            description: 'Two preferred rules for a Pod (e.g., disktype: ssd with weight 10, hasgpu: true with weight 5). The Scheduler evaluates nodes, gives higher preference to the stronger match.',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Granular Control," "Resilience," "Optimized Placement."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'The Node Affinity matchmaker intelligently placing Pods on the most suitable nodes, considering various preferences and requirements.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Node Affinity Example',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: gpu-workload
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/arch
            operator: In
            values:
            - amd64
          - key: node-type
            operator: In
            values:
            - gpu-node
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: zone
            operator: In
            values:
            - us-west-1a
      - weight: 50
        preference:
          matchExpressions:
          - key: instance-type
            operator: In
            values:
            - p3.2xlarge
  containers:
  - name: gpu-app
    image: tensorflow/tensorflow:latest-gpu`,
        explanation: 'This Pod requires AMD64 GPU nodes but prefers specific zones and instance types with weighted preferences.'
      },
      keyPoints: [
        'More flexible than nodeSelector with required and preferred rules',
        'Supports complex expressions with multiple operators',
        'Enables sophisticated scheduling based on node characteristics',
        'Weighted preferences allow fine-tuned scheduling decisions',
        'Critical for workloads with specific hardware or location requirements'
      ],
      quiz: [
        {
          question: 'What is the difference between "required" and "preferred" node affinity?',
          options: [
            'Required rules are faster to evaluate',
            'Required rules must be met for scheduling, preferred rules are hints',
            'Preferred rules take priority over required rules',
            'There is no difference'
          ],
          correct: 1,
          explanation: 'Required rules are hard constraints that must be satisfied for a Pod to be scheduled, while preferred rules are soft constraints used as scheduling hints.'
        },
        {
          question: 'Which operator would you use to ensure a Pod is NOT scheduled on nodes with a specific label?',
          options: [
            'In',
            'NotIn',
            'Exists',
            'DoesNotExist'
          ],
          correct: 1,
          explanation: 'The NotIn operator ensures that the node label value is not in the specified list of values.'
        }
      ]
    }
  },
  {
    id: 28,
    title: 'Pod Affinity and Anti-Affinity',
    description: 'Co-locating or separating Pods based on relationships',
    duration: '19 min',
    difficulty: 'Advanced',
    category: 'Scheduling',
    tags: ['pod-affinity', 'anti-affinity', 'co-location', 'separation'],
    content: {
      introduction: 'Pod affinity and anti-affinity allow you to constrain Pod scheduling based on the labels of other Pods already running on nodes.',
      conceptExplanation: 'Pod affinity enables you to co-locate Pods (e.g., web servers with their caches), while anti-affinity helps spread Pods across nodes for high availability. Like node affinity, it supports both required (hard) and preferred (soft) constraints. This is particularly useful for performance optimization, fault tolerance, and security isolation by controlling which Pods run together or separately.',
      animation: {
        title: 'Pod Affinity/Anti-Affinity: Co-locating/Separating Pods',
        description: 'Explaining Pod Affinity and Anti-Affinity rules for co-locating or separating Pods based on the labels of other Pods',
        scenes: [
          {
            title: 'The Problem - Suboptimal Pod Placement',
            description: 'A "Frontend Pod A" and "Backend Pod A" are deployed far apart on different nodes, causing high network latency. Also, "Replica 1" and "Replica 2" of "App X" are on the same node, making them vulnerable if that node fails.',
            duration: 4000
          },
          {
            title: 'Introducing Pod Affinity/Anti-Affinity - The Relationship Rules',
            description: 'A "Pod Affinity/Anti-Affinity" controller (a relationship counselor icon). It has rules for "attraction" (affinity) and "repulsion" (anti-affinity) between Pods.',
            duration: 3000
          },
          {
            title: 'Pod Affinity - Co-location (Required/Preferred)',
            description: 'Required: "Frontend Pod B" is about to be scheduled. Its affinity rule states it must be on the same node as "Backend Pod B" (matching label app: backend). The Scheduler places Frontend B next to Backend B. Preferred: "Frontend Pod C" prefers to be on the same node as "Backend Pod C," but if that node is full, it can go elsewhere.',
            duration: 4000
          },
          {
            title: 'Pod Anti-Affinity - Separation (Required/Preferred)',
            description: 'Required: "App X - Replica 2" is about to be scheduled. Its anti-affinity rule states it must NOT be on the same node as "App X - Replica 1" (matching label app: app-x). The Scheduler places Replica 2 on a different node than Replica 1. If no other node, it stays pending. Preferred: "App Y - Replica 2" prefers not to be on the same node as "App Y - Replica 1," but if no other option, it can go there.',
            duration: 4000
          },
          {
            title: 'topologyKey - Defining the Scope',
            description: 'Show nodes grouped into different "zones" or "racks." The topologyKey: kubernetes.io/hostname means \'same node.\' topologyKey: topology.kubernetes.io/zone means \'same zone.\'',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Low Latency," "High Availability," "Resource Optimization."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A well-arranged cluster where related Pods are close, and redundant Pods are spread out for resilience.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Web App with Cache Affinity',
        code: `apiVersion: apps/v1
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
      affinity:
        podAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - redis-cache
              topologyKey: kubernetes.io/hostname
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-app
            topologyKey: kubernetes.io/hostname
      containers:
      - name: web-app
        image: nginx:1.20`,
        explanation: 'This deployment prefers to run near Redis cache Pods but requires that web-app Pods are spread across different nodes.'
      },
      keyPoints: [
        'Controls Pod placement based on other Pod locations',
        'Affinity co-locates related Pods for performance',
        'Anti-affinity spreads Pods for high availability',
        'Uses topology keys to define scheduling domains',
        'Essential for performance optimization and fault tolerance'
      ],
      quiz: [
        {
          question: 'What is the primary use case for Pod anti-affinity?',
          options: [
            'Improving network performance',
            'Reducing resource usage',
            'Spreading Pods across nodes for high availability',
            'Simplifying configuration'
          ],
          correct: 2,
          explanation: 'Pod anti-affinity is primarily used to spread Pods across different nodes or zones to improve fault tolerance and high availability.'
        },
        {
          question: 'What does the topologyKey define in Pod affinity rules?',
          options: [
            'The Pod labels to match',
            'The scheduling domain or boundary',
            'The weight of the preference',
            'The container image to use'
          ],
          correct: 1,
          explanation: 'The topologyKey defines the scheduling domain or boundary, such as nodes (kubernetes.io/hostname) or zones (topology.kubernetes.io/zone).'
        }
      ]
    }
  },
  {
    id: 29,
    title: 'Taints and Tolerations',
    description: 'Excluding or allowing Pods on specific nodes',
    duration: '17 min',
    difficulty: 'Advanced',
    category: 'Scheduling',
    tags: ['taints', 'tolerations', 'node-exclusion', 'dedicated-nodes'],
    content: {
      introduction: 'Taints and tolerations work together to ensure that Pods are not scheduled onto inappropriate nodes.',
      conceptExplanation: 'Taints are applied to nodes to repel Pods that do not have matching tolerations. Tolerations are applied to Pods to allow them to be scheduled on nodes with matching taints. This mechanism is useful for dedicating nodes to specific workloads, handling node conditions, or creating specialized node pools. Common use cases include GPU nodes, master nodes, or nodes with specific hardware requirements.',
      animation: {
        title: 'Taints and Tolerations: Excluding/Allowing Pods',
        description: 'Explaining Taints on nodes that repel Pods, and Tolerations on Pods that allow them to be scheduled on tainted nodes, enabling specialized node usage',
        scenes: [
          {
            title: 'The Default - All Nodes Are Equal',
            description: 'Multiple "Worker Nodes" and multiple "Pod" icons. The "Scheduler" places Pods freely on any node.',
            duration: 3000
          },
          {
            title: 'Introducing Taints - The \'No Entry\' Sign on a Node',
            description: 'A "Worker Node" suddenly gets a "Taint" (a glowing "No Entry" sign) with a reason, e.g., dedicated=gpu:NoSchedule. When a regular "Pod" tries to land on it, it\'s repelled and bounces off.',
            duration: 4000
          },
          {
            title: 'Taint Effects',
            description: 'Show the Taint on the node. NoSchedule: Pods cannot be scheduled onto this node (hovering). PreferNoSchedule: Pods try not to schedule here, but might if no other option. NoExecute: Pods already running are evicted, and new ones are not scheduled.',
            duration: 4000
          },
          {
            title: 'Introducing Tolerations - The \'Access Pass\' for a Pod',
            description: 'A special "GPU-App Pod" icon appears. Its YAML has a toleration matching the dedicated=gpu taint. This Pod has an "Access Pass" icon.',
            duration: 3000
          },
          {
            title: 'Taint and Toleration Working Together',
            description: 'The "GPU-App Pod" with its matching toleration approaches the "Tainted GPU Node." The "Access Pass" validates, and the Pod smoothly lands on the node. Regular Pods are still repelled.',
            duration: 4000
          },
          {
            title: 'Use Cases',
            description: 'Node A tainted dedicated=gpu:NoSchedule, only "GPU-Pods" land. Node B tainted node.kubernetes.io/unschedulable:NoSchedule (master node default). Node C tainted outage:true:NoExecute.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'A cluster with specialized nodes (tainted) hosting specific workloads (tolerating Pods), while general workloads run elsewhere.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'GPU Node Taint and Toleration',
        code: `# Taint a node for GPU workloads
kubectl taint nodes gpu-node-1 nvidia.com/gpu=true:NoSchedule

# Pod with toleration for GPU nodes
apiVersion: v1
kind: Pod
metadata:
  name: gpu-workload
spec:
  tolerations:
  - key: nvidia.com/gpu
    operator: Equal
    value: "true"
    effect: NoSchedule
  - key: node.kubernetes.io/not-ready
    operator: Exists
    effect: NoExecute
    tolerationSeconds: 300
  nodeSelector:
    accelerator: nvidia-tesla-k80
  containers:
  - name: gpu-app
    image: tensorflow/tensorflow:latest-gpu
    resources:
      limits:
        nvidia.com/gpu: 1`,
        explanation: 'This configuration dedicates GPU nodes to GPU workloads only, while allowing a grace period for node issues.'
      },
      keyPoints: [
        'Taints repel Pods without matching tolerations',
        'Tolerations allow Pods to be scheduled on tainted nodes',
        'Useful for dedicating nodes to specific workloads',
        'Three taint effects: NoSchedule, PreferNoSchedule, NoExecute',
        'Essential for managing specialized hardware and node conditions'
      ],
      quiz: [
        {
          question: 'What happens when a node is tainted with NoExecute effect?',
          options: [
            'New Pods cannot be scheduled on the node',
            'Existing Pods are immediately evicted unless they have tolerations',
            'The node is marked as unschedulable',
            'Only system Pods can run on the node'
          ],
          correct: 1,
          explanation: 'NoExecute effect evicts existing Pods that do not have matching tolerations, in addition to preventing new Pod scheduling.'
        },
        {
          question: 'Which taint effect only affects new Pod scheduling but not existing Pods?',
          options: [
            'NoExecute',
            'NoSchedule',
            'PreferNoSchedule',
            'EvictPods'
          ],
          correct: 1,
          explanation: 'NoSchedule prevents new Pods from being scheduled on the node but does not affect existing Pods already running.'
        }
      ]
    }
  },
  {
    id: 30,
    title: 'Node Selector: Simple Node Filtering',
    description: 'Basic node selection using labels for Pod placement',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'Scheduling',
    tags: ['node-selector', 'node-labels', 'simple-scheduling', 'placement'],
    content: {
      introduction: 'Node selector provides a simple way to constrain Pod scheduling to nodes with specific labels.',
      conceptExplanation: 'Node selector is the simplest form of node selection constraint in Kubernetes. It uses a map of key-value pairs that must match node labels for a Pod to be scheduled on that node. While less flexible than node affinity, it\'s easier to understand and sufficient for basic scheduling requirements. Common use cases include selecting nodes with specific hardware, operating systems, or availability zones.',
      animation: {
        title: 'Node Selector: Simple Node Assignment',
        description: 'Explaining Node Selector as a basic method to schedule Pods onto specific nodes based on matching labels',
        scenes: [
          {
            title: 'The Default Scheduling Problem',
            description: 'A "Pod" icon appears. The "Scheduler" (from Control Plane) tries to place it. Several "Worker Nodes" are available. The Pod lands on a random node. A "Needs specific hardware!" thought bubble appears above the Pod.',
            duration: 3000
          },
          {
            title: 'Introducing Node Labels',
            description: 'Two "Worker Nodes." "Node A" gets a label: disktype: ssd. "Node B" gets a label: disktype: hdd.',
            duration: 3000
          },
          {
            title: 'Introducing Node Selector - The Simple Match',
            description: 'The "Pod" icon\'s YAML definition is updated to include nodeSelector: disktype: ssd. A "Node Selector" rule (a filter) is visible inside the Pod.',
            duration: 3000
          },
          {
            title: 'Scheduling with Node Selector',
            description: 'The "Pod" with nodeSelector: disktype: ssd is submitted. The "Scheduler" reads this. It only considers "Node A" (the one with disktype: ssd). The Pod is then placed on "Node A." "Node B" is ignored.',
            duration: 4000
          },
          {
            title: 'No Match Found',
            description: 'A new Pod requests nodeSelector: gpu: true. No existing nodes have this label. The Pod remains in a "Pending" state, hovering above the nodes.',
            duration: 3000
          },
          {
            title: 'Limitations',
            description: 'A single Node Selector rule. A "Complex Logic Needed!" thought bubble appears.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A Pod neatly placed on the correct, labeled node.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'SSD Storage Node Selection',
        code: `# Label nodes with storage type
kubectl label nodes worker-1 storage-type=ssd
kubectl label nodes worker-2 storage-type=hdd
kubectl label nodes worker-3 storage-type=ssd

# Pod requiring SSD storage
apiVersion: v1
kind: Pod
metadata:
  name: database-pod
spec:
  nodeSelector:
    storage-type: ssd
    kubernetes.io/arch: amd64
  containers:
  - name: database
    image: postgres:13
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    emptyDir: {}`,
        explanation: 'This Pod will only be scheduled on nodes labeled with storage-type=ssd and amd64 architecture.'
      },
      keyPoints: [
        'Simplest form of node selection in Kubernetes',
        'Uses key-value pairs that must match node labels',
        'All specified labels must match for scheduling',
        'Less flexible than node affinity but easier to use',
        'Perfect for basic hardware or zone requirements'
      ],
      quiz: [
        {
          question: 'What happens if a Pod\'s nodeSelector cannot be satisfied by any node?',
          options: [
            'The Pod is scheduled on a random node',
            'The Pod remains in Pending state',
            'The Pod is automatically deleted',
            'The nodeSelector is ignored'
          ],
          correct: 1,
          explanation: 'If no nodes match the nodeSelector requirements, the Pod remains in Pending state until a suitable node becomes available.'
        },
        {
          question: 'How many of the nodeSelector labels must match for a Pod to be scheduled?',
          options: [
            'At least one label must match',
            'Most labels must match',
            'All specified labels must match',
            'Only the first label needs to match'
          ],
          correct: 2,
          explanation: 'All key-value pairs specified in nodeSelector must match the node labels for the Pod to be scheduled on that node.'
        }
      ]
    }
  },
  {
    id: 31,
    title: 'Resource Quotas: Namespace-level Resource Limits',
    description: 'Managing and limiting resource consumption per namespace',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Resource Management',
    tags: ['resource-quotas', 'namespace-limits', 'resource-management', 'multi-tenancy'],
    content: {
      introduction: 'Resource quotas provide constraints that limit aggregate resource consumption per namespace.',
      conceptExplanation: 'Resource quotas enable cluster administrators to control resource usage across different teams or applications by setting limits at the namespace level. They can limit the total amount of compute resources (CPU, memory), storage, and the number of objects (Pods, Services, etc.) that can be created in a namespace. This is essential for multi-tenant clusters and preventing resource starvation.',
      animation: {
        title: 'Resource Quotas: Namespace Resource Limits',
        description: 'Explaining Resource Quotas as a way to limit the total consumption of resources (CPU, Memory, Pod count, etc.) within a specific Kubernetes Namespace',
        scenes: [
          {
            title: 'The Problem - Uncontrolled Namespace Usage',
            description: 'A "Dev Namespace" and a "Prod Namespace." The "Dev" Namespace is spawning many, many "Pods" and consuming a huge amount of "CPU" and "Memory," impacting the entire cluster. The "Prod" Namespace is struggling.',
            duration: 4000
          },
          {
            title: 'Introducing Resource Quota - The Namespace Budget',
            description: 'A "Resource Quota" icon (a "Budget Meter" or "Cap" specific to a Namespace) appears and surrounds the "Dev Namespace."',
            duration: 3000
          },
          {
            title: 'Defining a Resource Quota',
            description: 'A YAML definition for a Resource Quota: name: dev-quota, hard: requests.cpu: 4, limits.memory: 8Gi, pods: 20. This quota is applied to the "Dev Namespace."',
            duration: 4000
          },
          {
            title: 'Enforcement in Action',
            description: 'The "Dev Namespace" starts to create Pods. A "Pod Counter" goes up. When it hits 20, any new Pod creation attempts fail ("Quota Exceeded!"). The "CPU Meter" for the namespace slowly rises. When total CPU requests reach 4 CPU, any new Pods requiring CPU are blocked.',
            duration: 5000
          },
          {
            title: 'Types of Resources Quotas Can Limit',
            description: 'Show icons for cpu, memory, pods, deployments, services, persistentvolumeclaims, etc.',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Fairness," "Cost Control," "Stability."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'The "Dev Namespace" operating within its budget, and the "Prod Namespace" now having sufficient resources, ensuring a healthy, multi-tenant cluster.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Comprehensive Resource Quota',
        code: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: development
spec:
  hard:
    # Compute resources
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi

    # Storage resources
    requests.storage: 100Gi
    persistentvolumeclaims: "10"

    # Object counts
    pods: "20"
    services: "10"
    secrets: "20"
    configmaps: "20"

    # Extended resources
    requests.nvidia.com/gpu: "2"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: development
spec:
  limits:
  - default:
      cpu: 500m
      memory: 512Mi
    defaultRequest:
      cpu: 100m
      memory: 128Mi
    type: Container`,
        explanation: 'This quota limits the development namespace to specific resource amounts and object counts, with default limits for containers.'
      },
      keyPoints: [
        'Controls aggregate resource consumption per namespace',
        'Limits both compute resources and object counts',
        'Essential for multi-tenant cluster management',
        'Prevents resource starvation between teams',
        'Works with LimitRanges for complete resource control'
      ],
      quiz: [
        {
          question: 'What happens when you try to create a Pod that would exceed the namespace resource quota?',
          options: [
            'The Pod is created with reduced resources',
            'The Pod creation is rejected',
            'The oldest Pod is deleted to make room',
            'The quota is automatically increased'
          ],
          correct: 1,
          explanation: 'When a resource quota would be exceeded, the API server rejects the Pod creation request to enforce the quota limits.'
        },
        {
          question: 'Which resource types can be limited by ResourceQuotas?',
          options: [
            'Only CPU and memory',
            'Only object counts',
            'Compute resources, storage, and object counts',
            'Only persistent storage'
          ],
          correct: 2,
          explanation: 'ResourceQuotas can limit compute resources (CPU, memory), storage resources, object counts, and extended resources like GPUs.'
        }
      ]
    }
  },
  {
    id: 32,
    title: 'Limit Ranges: Pod and Container Resource Defaults',
    description: 'Setting default and maximum resource constraints for containers',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'Resource Management',
    tags: ['limit-ranges', 'resource-defaults', 'container-limits', 'resource-constraints'],
    content: {
      introduction: 'Limit ranges enforce minimum, maximum, and default resource requirements and limits for Pods and containers in a namespace.',
      conceptExplanation: 'While resource quotas control aggregate namespace consumption, limit ranges control individual Pod and container resource usage. They can set default requests and limits for containers that don\'t specify them, enforce minimum and maximum values, and ensure resource requests don\'t exceed limits. This prevents individual workloads from consuming excessive resources and ensures consistent resource allocation.',
      animation: {
        title: 'Limit Range Enforcement',
        description: 'How limit ranges control individual container resources',
        scenes: [
          {
            title: 'Default Assignment',
            description: 'Applying default resource values to containers',
            duration: 3000
          },
          {
            title: 'Validation Checks',
            description: 'Enforcing minimum and maximum resource constraints',
            duration: 4000
          },
          {
            title: 'Resource Consistency',
            description: 'Ensuring requests don\'t exceed limits',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Comprehensive Limit Range',
        code: `apiVersion: v1
kind: LimitRange
metadata:
  name: resource-constraints
  namespace: production
spec:
  limits:
  # Container limits
  - type: Container
    default:          # Default limits
      cpu: 500m
      memory: 512Mi
    defaultRequest:   # Default requests
      cpu: 100m
      memory: 128Mi
    min:             # Minimum values
      cpu: 50m
      memory: 64Mi
    max:             # Maximum values
      cpu: 2000m
      memory: 2Gi
    maxLimitRequestRatio:  # Limit/Request ratios
      cpu: 4
      memory: 2

  # Pod limits
  - type: Pod
    max:
      cpu: 4000m
      memory: 4Gi

  # PVC limits
  - type: PersistentVolumeClaim
    min:
      storage: 1Gi
    max:
      storage: 100Gi`,
        explanation: 'This limit range sets defaults, minimums, maximums, and ratios for containers, Pods, and storage in the production namespace.'
      },
      keyPoints: [
        'Controls individual Pod and container resource usage',
        'Sets default requests and limits for containers',
        'Enforces minimum and maximum resource values',
        'Ensures resource requests don\'t exceed limits',
        'Complements resource quotas for complete resource management'
      ],
      quiz: [
        {
          question: 'What happens when a container doesn\'t specify resource requests or limits in a namespace with a LimitRange?',
          options: [
            'The container is rejected',
            'Default values from the LimitRange are applied',
            'The container runs without any limits',
            'Maximum values are automatically assigned'
          ],
          correct: 1,
          explanation: 'When containers don\'t specify resource requests or limits, the default values defined in the LimitRange are automatically applied.'
        },
        {
          question: 'What does maxLimitRequestRatio control in a LimitRange?',
          options: [
            'The maximum number of containers per Pod',
            'The ratio between resource limits and requests',
            'The maximum resource usage per namespace',
            'The number of Pods that can be created'
          ],
          correct: 1,
          explanation: 'maxLimitRequestRatio controls the maximum allowed ratio between resource limits and requests, preventing excessive overcommitment.'
        }
      ]
    }
  },
  {
    id: 33,
    title: 'Horizontal Pod Autoscaler (HPA)',
    description: 'Automatically scaling Pods based on CPU, memory, and custom metrics',
    duration: '18 min',
    difficulty: 'Advanced',
    category: 'Autoscaling',
    tags: ['hpa', 'horizontal-scaling', 'metrics', 'auto-scaling'],
    content: {
      introduction: 'Horizontal Pod Autoscaler automatically scales the number of Pods in a deployment based on observed CPU utilization, memory usage, or custom metrics.',
      conceptExplanation: 'HPA continuously monitors resource metrics and adjusts the replica count to maintain target utilization levels. It can scale based on CPU, memory, or custom metrics from external systems. The autoscaler uses a control loop that periodically queries metrics, calculates desired replica count, and updates the target deployment. This ensures applications can handle varying load automatically while optimizing resource usage.',
      animation: {
        title: 'Horizontal Pod Autoscaler (HPA): Automatic Scaling',
        description: 'Explaining how the Horizontal Pod Autoscaler automatically scales the number of Pod replicas based on observed resource utilization (CPU, Memory) or custom metrics',
        scenes: [
          {
            title: 'The Problem - Manual Scaling',
            description: 'Three "App Pods" running. A "Traffic Meter" shows a sudden spike in "Incoming Requests" (many small arrows flowing in), and the "CPU Usage" meter for the Pods quickly goes from green to red. A "Human Operator" is frantically trying to manually scale up the replicas using kubectl scale.',
            duration: 4000
          },
          {
            title: 'Introducing HPA - The Automatic Scaler',
            description: 'A "Horizontal Pod Autoscaler (HPA)" icon (a robot with an up/down arrow and a graph) appears. It monitors the "App Pods."',
            duration: 3000
          },
          {
            title: 'HPA Configuration & Metrics',
            description: 'The HPA\'s configuration (YAML): minReplicas: 3, maxReplicas: 10, targetCPUUtilizationPercentage: 50. Show a "Metrics Server" (a sensor icon) feeding real-time CPU data to the HPA.',
            duration: 4000
          },
          {
            title: 'Scaling Out (Up)',
            description: 'The "Traffic Meter" spikes again, and "CPU Usage" for the 3 current Pods exceeds 50%. The HPA detects this. It increases the "desired replicas" to 5. New "App Pods" (2 of them) quickly spin up and join the fleet, distributing the load. The "CPU Usage" meter goes back to green.',
            duration: 4000
          },
          {
            title: 'Scaling In (Down)',
            description: 'The "Traffic Meter" shows a dip in "Incoming Requests." The "CPU Usage" for the 5 Pods drops below 50%. The HPA detects this. It decreases the "desired replicas" back to 3. Two "App Pods" gracefully shut down.',
            duration: 4000
          },
          {
            title: 'Interaction with Deployment/ReplicaSet',
            description: 'The HPA interacts directly with the "Deployment" (or ReplicaSet) to adjust the replicas field. Show the HPA sending commands to the Deployment.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Responsiveness," "Efficiency," "Cost Savings." Benefits: "Responsiveness," "Resource Efficiency," "Cost Savings."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A dynamic fleet of App Pods, constantly adjusting its size based on demand, overseen by the HPA. Benefits: "Automatic Scaling," "Load Response," "Resource Optimization."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Multi-Metric HPA Configuration',
        code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
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
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60`,
        explanation: 'This HPA scales based on CPU, memory, and custom HTTP request metrics with controlled scaling behavior to prevent thrashing.'
      },
      keyPoints: [
        'Automatically adjusts Pod replicas based on metrics',
        'Supports CPU, memory, and custom metrics',
        'Prevents resource waste and ensures performance',
        'Configurable scaling policies and stabilization windows',
        'Essential for handling variable application load'
      ],
      quiz: [
        {
          question: 'What is the primary purpose of the Horizontal Pod Autoscaler?',
          options: [
            'To increase Pod resource limits',
            'To automatically adjust the number of Pod replicas',
            'To move Pods between nodes',
            'To restart failed Pods'
          ],
          correct: 1,
          explanation: 'HPA automatically adjusts the number of Pod replicas in a deployment based on observed metrics to handle varying load.'
        },
        {
          question: 'What happens if HPA tries to scale below minReplicas or above maxReplicas?',
          options: [
            'The scaling operation fails with an error',
            'The limits are ignored and scaling continues',
            'Scaling is constrained to stay within the specified bounds',
            'The HPA is automatically disabled'
          ],
          correct: 2,
          explanation: 'HPA respects the minReplicas and maxReplicas bounds, ensuring the replica count never goes outside these limits.'
        }
      ]
    }
  },
  {
    id: 34,
    title: 'Vertical Pod Autoscaler (VPA)',
    description: 'Automatically adjusting CPU and memory resources for individual Pods',
    duration: '16 min',
    difficulty: 'Advanced',
    category: 'Autoscaling',
    tags: ['vpa', 'vertical-scaling', 'resource-optimization', 'right-sizing'],
    content: {
      introduction: 'Vertical Pod Autoscaler automatically adjusts CPU and memory requests and limits for containers based on historical usage patterns.',
      conceptExplanation: 'VPA analyzes resource usage patterns and recommends or automatically applies optimal resource requests and limits. Unlike HPA which scales the number of Pods, VPA scales the resources of individual Pods. It operates in three modes: Off (recommendations only), Initial (sets resources at Pod creation), and Auto (updates running Pods). VPA is crucial for right-sizing applications and optimizing cluster resource utilization.',
      animation: {
        title: 'Vertical Pod Autoscaler (VPA): Automatic Resource Adjustment',
        description: 'Explaining how the Vertical Pod Autoscaler automatically adjusts CPU and Memory requests and limits for containers in a Pod, based on historical and real-time usage',
        scenes: [
          {
            title: 'The Problem - Static Resource Limits',
            description: 'A "Pod" icon with a container. Its "CPU Request" is set to 200m, "Memory Request" to 256Mi. The container\'s actual "CPU Usage" fluctuates wildly (from 50m to 800m), and "Memory Usage" also varies (from 100Mi to 600Mi). This leads to either "wasted resources" (if limits too high) or "throttling/OOMKilled" (if limits too low).',
            duration: 4000
          },
          {
            title: 'Introducing VPA - The Resource Optimizer',
            description: 'A "Vertical Pod Autoscaler (VPA)" icon (a robot with a brain and a slider for resources) appears. It monitors the "Pod."',
            duration: 3000
          },
          {
            title: 'VPA Operation (Monitoring & Recommendation)',
            description: 'The VPA continuously monitors the Pod\'s actual "CPU Usage" and "Memory Usage" over time. It analyzes patterns. A "Recommendation" bubble appears with new values: cpu: 350m, memory: 400Mi.',
            duration: 4000
          },
          {
            title: 'Update Modes',
            description: 'Show the VPA making a recommendation. Off: VPA only provides recommendations, doesn\'t apply. Initial: Applies recommendations only on Pod startup. Recreate: Recreates Pod with new resources when needed (causes brief disruption). Auto: VPA updates Pod resources in place (if supported by runtime, usually recreates).',
            duration: 4000
          },
          {
            title: 'VPA in Action (Recreate Mode Example)',
            description: 'The "Pod" is running. The VPA recommends new resource settings. The VPA "recreates" the Pod. The old Pod gracefully shuts down, and a new Pod spins up with the updated CPU and Memory requests/limits applied.',
            duration: 4000
          },
          {
            title: 'VPA vs. HPA (Side-by-Side)',
            description: 'Left: "HPA" icon: "Number of Pods." (Horizontal arrow). Right: "VPA" icon: "Size of Pods." (Vertical arrow). HPA: Scales Pod Count, VPA: Scales Pod Size.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Resource Efficiency," "Cost Savings," "Performance." Benefits: "Optimized Resource Utilization," "Cost Savings," "Stability."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'An application Pod running optimally, its resource allocation dynamically adjusted by the VPA. Benefits: "Right-Sizing," "Resource Optimization," "Performance Tuning."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'VPA Configuration with Update Policy',
        code: `apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: web-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  updatePolicy:
    updateMode: "Auto"    # Off, Initial, or Auto
  resourcePolicy:
    containerPolicies:
    - containerName: web-container
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2000m
        memory: 2Gi
      controlledResources: ["cpu", "memory"]
      controlledValues: RequestsAndLimits
---
# Check VPA recommendations
apiVersion: v1
kind: Pod
metadata:
  name: vpa-status-check
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl
    command: ["kubectl", "describe", "vpa", "web-app-vpa"]`,
        explanation: 'This VPA automatically optimizes resources for the web-app deployment within specified bounds, updating both requests and limits.'
      },
      keyPoints: [
        'Automatically optimizes CPU and memory for individual Pods',
        'Analyzes historical usage patterns for recommendations',
        'Three modes: Off (recommendations), Initial, and Auto',
        'Helps right-size applications and optimize resource usage',
        'Complements HPA for comprehensive autoscaling'
      ],
      quiz: [
        {
          question: 'What is the main difference between HPA and VPA?',
          options: [
            'HPA is faster than VPA',
            'HPA scales Pod count, VPA scales Pod resources',
            'VPA only works with StatefulSets',
            'HPA requires custom metrics, VPA does not'
          ],
          correct: 1,
          explanation: 'HPA scales the number of Pod replicas horizontally, while VPA scales the CPU and memory resources of individual Pods vertically.'
        },
        {
          question: 'In which VPA mode are resource recommendations applied automatically to running Pods?',
          options: [
            'Off mode',
            'Initial mode',
            'Auto mode',
            'Manual mode'
          ],
          correct: 2,
          explanation: 'Auto mode automatically applies VPA recommendations to running Pods, potentially causing Pod restarts when resources are updated.'
        }
      ]
    }
  },
  {
    id: 35,
    title: 'Cluster Autoscaler: Scaling Nodes in the Cluster',
    description: 'Automatically adding or removing nodes based on Pod scheduling needs',
    duration: '17 min',
    difficulty: 'Advanced',
    category: 'Autoscaling',
    tags: ['cluster-autoscaler', 'node-scaling', 'infrastructure-scaling', 'cost-optimization'],
    content: {
      introduction: 'Cluster Autoscaler automatically adjusts the size of the Kubernetes cluster by adding or removing nodes based on Pod scheduling requirements.',
      conceptExplanation: 'Cluster Autoscaler monitors for Pods that cannot be scheduled due to insufficient resources and automatically adds nodes to accommodate them. It also removes underutilized nodes when Pods can be rescheduled elsewhere. This provides dynamic infrastructure scaling, optimizing both performance and cost. It works with cloud providers\' auto-scaling groups and requires proper configuration of node groups and scaling policies.',
      animation: {
        title: 'Cluster Autoscaler: Node Scaling',
        description: 'Explaining how the Cluster Autoscaler automatically adjusts the number of nodes in your cluster based on pending Pods or underutilized nodes',
        scenes: [
          {
            title: 'The Problem - Node Shortage/Waste',
            description: 'A cluster with a fixed number of "Worker Nodes." Many "Pending Pods" (floating above nodes, looking for space). Text: "Nodes Full!" Alternatively, many "Worker Nodes" but few "Running Pods," with most nodes showing low CPU/Memory usage. Text: "Wasting Resources!"',
            duration: 4000
          },
          {
            title: 'Introducing Cluster Autoscaler - The Infrastructure Manager',
            description: 'A "Cluster Autoscaler (CA)" icon (a construction robot with a "Node" blueprint) appears outside the Kubernetes cluster, interacting with the "Cloud Provider" (e.g., AWS, GCP).',
            duration: 3000
          },
          {
            title: 'Scaling Up (Adding Nodes)',
            description: 'Many "Pending Pods" are waiting. The CA detects that existing nodes don\'t have enough capacity. The CA communicates with the "Cloud Provider." A new "Worker Node" magically appears and joins the cluster. The "Pending Pods" then get scheduled onto the new node.',
            duration: 4000
          },
          {
            title: 'Scaling Down (Removing Nodes)',
            description: 'Several "Worker Nodes" are underutilized (low CPU/Memory). The CA detects that some nodes are empty or can be drained of Pods without impacting service. The CA safely "drains" Pods from an underutilized node (Pod move to other nodes) and then instructs the "Cloud Provider" to remove the empty node. The node disappears.',
            duration: 4000
          },
          {
            title: 'Integration with Cloud Providers',
            description: 'Show the CA seamlessly communicating with different "Cloud Provider" APIs (e.g., AWS EC2, GCP Compute Engine, Azure VMs).',
            duration: 3000
          },
          {
            title: 'Interaction with HPA/VPA',
            description: '"HPA" scales Pods. If Pods need more resources, they become "Pending." This triggers "CA" to add nodes. "VPA" optimizes Pod sizes. This can reduce resource needs, potentially allowing "CA" to remove nodes.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Optimal Cost," "High Availability," "Simplified Operations." Benefits: "Cost Efficiency," "High Availability," "Zero Manual Node Ops."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A dynamically resizing Kubernetes cluster, efficiently matching infrastructure to workload demands, overseen by the Cluster Autoscaler. Benefits: "Dynamic Scaling," "Cost Optimization," "Infrastructure Automation."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Cluster Autoscaler Deployment',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.21.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/my-cluster
        - --balance-similar-node-groups
        - --scale-down-enabled=true
        - --scale-down-delay-after-add=10m
        - --scale-down-unneeded-time=10m`,
        explanation: 'This deployment configures Cluster Autoscaler for AWS with auto-discovery of node groups and balanced scaling policies.'
      },
      keyPoints: [
        'Automatically adds nodes when Pods cannot be scheduled',
        'Removes underutilized nodes to optimize costs',
        'Works with cloud provider auto-scaling groups',
        'Configurable scaling policies and timing parameters',
        'Essential for dynamic infrastructure management'
      ],
      quiz: [
        {
          question: 'When does Cluster Autoscaler add new nodes to the cluster?',
          options: [
            'When CPU usage is high',
            'When Pods cannot be scheduled due to insufficient resources',
            'Every hour automatically',
            'When manually triggered'
          ],
          correct: 1,
          explanation: 'Cluster Autoscaler adds nodes when there are Pods in Pending state that cannot be scheduled due to insufficient cluster resources.'
        },
        {
          question: 'What happens to Pods on a node that Cluster Autoscaler wants to remove?',
          options: [
            'The Pods are deleted permanently',
            'The Pods are rescheduled to other nodes',
            'The node removal is cancelled',
            'The Pods are paused until a new node is added'
          ],
          correct: 1,
          explanation: 'Before removing a node, Cluster Autoscaler ensures that all Pods on that node can be rescheduled to other available nodes in the cluster.'
        }
      ]
    }
  },
  {
    id: 36,
    title: 'Pod Disruption Budget (PDB)',
    description: 'Minimizing service interruptions during maintenance and updates',
    duration: '15 min',
    difficulty: 'Advanced',
    category: 'Reliability',
    tags: ['pdb', 'disruption-budget', 'high-availability', 'maintenance'],
    content: {
      introduction: 'Pod Disruption Budgets limit the number of Pods that can be voluntarily disrupted at the same time, ensuring service availability during maintenance.',
      conceptExplanation: 'PDBs protect applications from voluntary disruptions like node drains, cluster upgrades, or autoscaling events. They specify either the minimum number of Pods that must remain available (minAvailable) or the maximum number that can be unavailable (maxUnavailable). This ensures that critical services maintain sufficient capacity during planned maintenance operations.',
      animation: {
        title: 'PDB Protection During Maintenance',
        description: 'How PDBs ensure service availability during cluster operations',
        scenes: [
          {
            title: 'Normal Operation',
            description: 'Application running with multiple Pod replicas',
            duration: 3000
          },
          {
            title: 'Maintenance Event',
            description: 'Node drain respects PDB constraints',
            duration: 4000
          },
          {
            title: 'Service Continuity',
            description: 'Minimum Pods maintained throughout the process',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'PDB for Critical Service',
        code: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-app-pdb
spec:
  minAvailable: 2    # At least 2 Pods must remain available
  selector:
    matchLabels:
      app: web-app
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: database-pdb
spec:
  maxUnavailable: 1  # At most 1 Pod can be unavailable
  selector:
    matchLabels:
      app: database
      tier: primary
---
# Check PDB status
kubectl get pdb
kubectl describe pdb web-app-pdb`,
        explanation: 'These PDBs ensure the web app maintains at least 2 Pods and the database allows at most 1 Pod to be unavailable during disruptions.'
      },
      keyPoints: [
        'Protects applications from voluntary disruptions',
        'Ensures minimum service availability during maintenance',
        'Uses minAvailable or maxUnavailable constraints',
        'Essential for high-availability applications',
        'Works with node drains and cluster operations'
      ],
      quiz: [
        {
          question: 'What is the primary purpose of a Pod Disruption Budget?',
          options: [
            'To limit Pod resource usage',
            'To ensure minimum service availability during voluntary disruptions',
            'To schedule Pods on specific nodes',
            'To restart failed Pods automatically'
          ],
          correct: 1,
          explanation: 'PDBs ensure that a minimum number of Pods remain available during voluntary disruptions like maintenance operations.'
        },
        {
          question: 'What happens if a node drain would violate a Pod Disruption Budget?',
          options: [
            'The drain operation is blocked until it can proceed safely',
            'The PDB is automatically disabled',
            'The Pods are forcefully terminated',
            'The drain operation is cancelled permanently'
          ],
          correct: 0,
          explanation: 'Node drain operations respect PDBs and will wait until they can proceed without violating the disruption budget constraints.'
        }
      ]
    }
  },
  {
    id: 37,
    title: 'Readiness Probes: Service Availability',
    description: 'Determining when Pods are ready to receive traffic',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Health Checks',
    tags: ['readiness-probes', 'health-checks', 'traffic-routing', 'service-mesh'],
    content: {
      introduction: 'Readiness probes determine when a Pod is ready to receive traffic, ensuring only healthy Pods serve requests.',
      conceptExplanation: 'Readiness probes are used by Services to determine which Pods should receive traffic. Unlike liveness probes, failing readiness probes don\'t restart the Pod but remove it from service endpoints. This is crucial for applications that need time to warm up, load data, or establish connections before serving traffic. Common probe types include HTTP GET, TCP socket, and exec commands.',
      animation: {
        title: 'Readiness Probes: Signaling Service Availability',
        description: 'Explaining how Readiness Probes serve as a mechanism for Kubernetes to determine if a container is ready to serve traffic, and if not, to remove it from Service load balancers',
        scenes: [
          {
            title: 'The Problem - Traffic to Unready Apps',
            description: 'A "Service" (load balancer) is routing traffic to a "Container" that has just started. Inside the container, the "App Process" is still initializing (gears turning, "Loading..." text). Traffic hits the unready app, resulting in "Error!" messages for the user.',
            duration: 4000
          },
          {
            title: 'Introducing Readiness Probe - The "Ready for Duty" Check',
            description: 'A "Readiness Probe" icon (a green light or "Ready" sign) appears, attached to the "Container." The "Service" has a connection to this probe.',
            duration: 3000
          },
          {
            title: 'Probe Types (HTTP, TCP, Exec)',
            description: 'Same as Liveness, but emphasize their role in signaling readiness. HTTP GET, TCP Socket, and Exec command probes for determining service readiness.',
            duration: 3000
          },
          {
            title: 'Readiness Probe in Action (Initialization & Traffic Routing)',
            description: 'A new "Container" starts up. The "App Process" inside is initializing. The "Readiness Probe" repeatedly fails (red light). The "Service" (load balancer) does NOT send traffic to this Pod. The Pod is momentarily "isolated." The "App Process" finishes initializing. The "Readiness Probe" starts succeeding (green light). The "Service" immediately starts sending traffic to the now-ready Pod.',
            duration: 5000
          },
          {
            title: 'Handling Mid-Life Unreadiness',
            description: 'A "Container" is running and serving traffic. It briefly becomes "unready" (e.g., database connection lost). The "Readiness Probe" fails. The "Service" immediately stops sending new traffic to this Pod. Existing connections might drain. The container recovers. The "Readiness Probe" succeeds again. The "Service" adds it back to its active endpoints.',
            duration: 4000
          },
          {
            title: 'Readiness vs. Liveness (Side-by-Side)',
            description: 'Left: "Liveness" icon (heart monitor): "Restart if unhealthy." Right: "Readiness" icon (green light): "Stop traffic if unready." Liveness: For Container Health; Readiness: For Service Availability.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Zero Downtime," "Reliable Deployments," "User Experience." Benefits: "Zero Downtime Deployments," "Improved User Experience."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A seamless flow of traffic to only truly ready application Pods, ensuring no errors for users during startup or temporary issues. Benefits: "Traffic Control," "Zero Downtime," "Reliable Service."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Comprehensive Readiness Probe Configuration',
        code: `apiVersion: apps/v1
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
      - name: web-app
        image: nginx:1.20
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 80
            httpHeaders:
            - name: Custom-Header
              value: Readiness-Check
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        livenessProbe:
          httpGet:
            path: /health/live
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3`,
        explanation: 'This configuration uses HTTP readiness probes to ensure Pods are ready before receiving traffic, with separate liveness checks.'
      },
      keyPoints: [
        'Determines when Pods are ready to receive traffic',
        'Failed probes remove Pod from service endpoints',
        'Essential for applications with startup dependencies',
        'Supports HTTP, TCP, and exec probe types',
        'Works with Services for intelligent traffic routing'
      ],
      quiz: [
        {
          question: 'What happens when a Pod\'s readiness probe fails?',
          options: [
            'The Pod is restarted immediately',
            'The Pod is removed from service endpoints',
            'The Pod is deleted and recreated',
            'Nothing happens to the Pod'
          ],
          correct: 1,
          explanation: 'When readiness probes fail, the Pod is removed from service endpoints but continues running, preventing it from receiving traffic.'
        },
        {
          question: 'When should you use readiness probes instead of liveness probes?',
          options: [
            'When you want to restart unhealthy Pods',
            'When you want to control traffic routing to Pods',
            'When you want to delete failed Pods',
            'When you want to scale the deployment'
          ],
          correct: 1,
          explanation: 'Readiness probes are used to control traffic routing, ensuring only ready Pods receive requests without restarting them.'
        }
      ]
    }
  },
  {
    id: 38,
    title: 'Liveness Probes: Container Health and Restart',
    description: 'Detecting and recovering from unhealthy container states',
    duration: '14 min',
    difficulty: 'Intermediate',
    category: 'Health Checks',
    tags: ['liveness-probes', 'health-checks', 'container-restart', 'recovery'],
    content: {
      introduction: 'Liveness probes detect when containers are unhealthy and automatically restart them to recover from failure states.',
      conceptExplanation: 'Liveness probes help recover from situations where containers are running but not functioning properly, such as deadlocks or memory leaks. When a liveness probe fails, Kubernetes restarts the container. This is different from readiness probes which only affect traffic routing. Liveness probes should be configured carefully to avoid unnecessary restarts during temporary issues.',
      animation: {
        title: 'Liveness Probes: Health Checks for Pods',
        description: 'Explaining how Liveness Probes serve as a mechanism for Kubernetes to determine if a container is still running and healthy, and if not, to restart it',
        scenes: [
          {
            title: 'The Problem - "Zombie" Containers',
            description: 'A "Container" icon is running, but inside, a small "App Process" is frozen or dead (e.g., stuck spinning wheel, a bug icon). Kubernetes still thinks the container is "Running" because the process hasn\'t exited, but the application is unresponsive.',
            duration: 4000
          },
          {
            title: 'Introducing Liveness Probe - The Heartbeat Monitor',
            description: 'A "Liveness Probe" icon (a stethoscope or heart monitor) appears, attached to the "Container."',
            duration: 3000
          },
          {
            title: 'Probe Types (HTTP, TCP, Exec)',
            description: '"HTTP GET": Probe sends an HTTP request to an endpoint (/healthz). If it gets 200 OK, green check. If timeout/error, red X. "TCP Socket": Probe tries to open a TCP connection to a port. If connection successful, green check. If failed, red X. "Exec": Probe runs a command inside the container. If command exits with 0, green check. If non-zero, red X.',
            duration: 4000
          },
          {
            title: 'Liveness Probe in Action (Failure & Restart)',
            description: 'The "Liveness Probe" (heart monitor) sends checks (e.g., every 5 seconds). The "App Process" inside the container suddenly freezes (bug icon). The Probe fails its checks repeatedly (e.g., 3 failures). Kubernetes (specifically the Kubelet) acts: it "kills" the unhealthy container. The container icon vanishes. A new container instance (fresh, healthy) immediately spins up to replace it.',
            duration: 5000
          },
          {
            title: 'Configuration Parameters',
            description: 'Show initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold. Configurable Parameters: "Delay," "Period," "Timeout," "Threshold."',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Self-Healing," "High Availability," "Reliability." Benefits: "Self-Healing," "Increased Application Reliability."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A Kubernetes cluster where all containers are actively monitored and automatically recovered if they become unhealthy. Benefits: "Self-Healing," "Automatic Recovery," "High Availability."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Liveness Probe Examples',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: liveness-examples
spec:
  containers:
  # HTTP liveness probe
  - name: web-server
    image: nginx:1.20
    ports:
    - containerPort: 80
    livenessProbe:
      httpGet:
        path: /health
        port: 80
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3

  # TCP liveness probe
  - name: database
    image: postgres:13
    ports:
    - containerPort: 5432
    livenessProbe:
      tcpSocket:
        port: 5432
      initialDelaySeconds: 60
      periodSeconds: 20
      timeoutSeconds: 5
      failureThreshold: 3

  # Exec liveness probe
  - name: worker
    image: worker-app:v1.0
    livenessProbe:
      exec:
        command:
        - /bin/sh
        - -c
        - "ps aux | grep '[w]orker-process' || exit 1"
      initialDelaySeconds: 30
      periodSeconds: 30
      timeoutSeconds: 10
      failureThreshold: 2`,
        explanation: 'This shows HTTP, TCP, and exec liveness probes for different types of applications with appropriate timing configurations.'
      },
      keyPoints: [
        'Detects unhealthy containers and restarts them',
        'Helps recover from deadlocks and unresponsive states',
        'Different from readiness probes which affect traffic routing',
        'Supports HTTP, TCP, and exec probe mechanisms',
        'Should be configured carefully to avoid unnecessary restarts'
      ],
      quiz: [
        {
          question: 'What happens when a container\'s liveness probe fails repeatedly?',
          options: [
            'The Pod is removed from service endpoints',
            'The container is restarted by Kubernetes',
            'The Pod is marked as unhealthy but continues running',
            'The entire Pod is deleted'
          ],
          correct: 1,
          explanation: 'When liveness probes fail repeatedly (exceeding failureThreshold), Kubernetes restarts the container to attempt recovery.'
        },
        {
          question: 'Why should liveness probes have longer timeouts than readiness probes?',
          options: [
            'To save cluster resources',
            'To avoid unnecessary container restarts during temporary issues',
            'To improve application performance',
            'To reduce network traffic'
          ],
          correct: 1,
          explanation: 'Liveness probes should be more tolerant of temporary issues since they trigger container restarts, which are more disruptive than traffic removal.'
        }
      ]
    }
  },
  {
    id: 39,
    title: 'Startup Probes: Handling Slow-Starting Applications',
    description: 'Protecting slow-starting containers during initialization',
    duration: '13 min',
    difficulty: 'Intermediate',
    category: 'Health Checks',
    tags: ['startup-probes', 'slow-startup', 'initialization', 'legacy-apps'],
    content: {
      introduction: 'Startup probes protect slow-starting containers by disabling liveness and readiness probes until the application has successfully started.',
      conceptExplanation: 'Some applications, especially legacy systems or those with complex initialization, can take a long time to start. Startup probes provide a way to handle this by temporarily disabling other probes until the container has successfully started. Once the startup probe succeeds, normal liveness and readiness probes take over. This prevents premature container restarts during lengthy startup processes.',
      animation: {
        title: 'Startup Probes: Handling Slow Initializations',
        description: 'Explaining how Startup Probes serve as a mechanism to handle containers that take a long time to start up, allowing Liveness and Readiness probes to wait until the application is truly initialized',
        scenes: [
          {
            title: 'The Problem - Liveness/Readiness Too Eager',
            description: 'A "Container" starts. Its "App Process" takes a very long time to initialize (e.g., 2 minutes, showing a long progress bar). A "Liveness Probe" (set to 10-second checks) and a "Readiness Probe" (also 10-second checks) immediately start firing. Both probes fail repeatedly before the app even has a chance to start. The Liveness Probe hits its failureThreshold and restarts the container prematurely. The cycle repeats, preventing the app from ever starting.',
            duration: 5000
          },
          {
            title: 'Introducing Startup Probe - The Patient Gatekeeper',
            description: 'A "Startup Probe" icon (a patient \'hourglass\' or \'waiting\' symbol) appears, positioned before the Liveness and Readiness probes.',
            duration: 3000
          },
          {
            title: 'Startup Probe in Action',
            description: 'A new "Container" starts. The "App Process" begins its long initialization. The "Startup Probe" starts checking. While the "Startup Probe" is running and failing, the "Liveness Probe" and "Readiness Probe" are completely paused or inactive. They are waiting patiently. The "App Process" finally finishes initializing. The "Startup Probe" succeeds (hourglass turns green). Only now do the "Liveness Probe" and "Readiness Probe" begin their regular checks. They immediately succeed, and the Pod is ready for traffic.',
            duration: 5000
          },
          {
            title: 'Configuration Parameters',
            description: 'Show initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold (can be very high for startup probe). Configurable Parameters: "Often Longer for Startup."',
            duration: 3000
          },
          {
            title: 'Use Cases',
            description: 'Icons for "Large Applications," "JVM Startups," "Database Initializations," "Warm-up Caches." Common Uses: "Apps with Long Startup Times."',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Reliable Bootstrapping," "Simplified Probe Config," "No Premature Restarts." Benefits: "Prevents Premature Restarts," "Simplifies Configuration."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A container smoothly starting up, with the Startup Probe ensuring it has enough time before other health checks kick in. Benefits: "Graceful Startup," "No Premature Restarts," "Simplified Configuration."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Startup Probe for Legacy Application',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: legacy-app
spec:
  containers:
  - name: legacy-app
    image: legacy-system:v2.1
    ports:
    - containerPort: 8080
    startupProbe:
      httpGet:
        path: /startup-check
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 30    # Allow up to 5 minutes for startup
      successThreshold: 1
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 0  # Disabled until startup probe succeeds
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 0  # Disabled until startup probe succeeds
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3`,
        explanation: 'This configuration allows up to 5 minutes for the legacy application to start before enabling normal health checks.'
      },
      keyPoints: [
        'Protects slow-starting containers from premature restarts',
        'Disables liveness and readiness probes during startup',
        'Essential for legacy applications with long initialization',
        'Prevents startup failures from triggering container restarts',
        'Enables normal health checking after successful startup'
      ],
      quiz: [
        {
          question: 'What happens to liveness and readiness probes while a startup probe is running?',
          options: [
            'They run in parallel with the startup probe',
            'They are disabled until the startup probe succeeds',
            'They run with reduced frequency',
            'They are permanently disabled'
          ],
          correct: 1,
          explanation: 'Liveness and readiness probes are disabled while the startup probe is running and only activate after the startup probe succeeds.'
        },
        {
          question: 'When should you use startup probes?',
          options: [
            'For all applications regardless of startup time',
            'Only for applications that start very quickly',
            'For applications with long or unpredictable startup times',
            'Only for database applications'
          ],
          correct: 2,
          explanation: 'Startup probes are most beneficial for applications with long or unpredictable startup times that might otherwise trigger premature liveness probe failures.'
        }
      ]
    }
  },
  {
    id: 40,
    title: 'Volumes: emptyDir - Temporary Scratch Space',
    description: 'Understanding ephemeral storage for Pod-level data sharing',
    duration: '14 min',
    difficulty: 'Beginner',
    category: 'Storage',
    tags: ['volumes', 'emptydir', 'ephemeral-storage', 'pod-storage'],
    content: {
      introduction: 'emptyDir volumes provide temporary storage that exists for the lifetime of a Pod, shared between all containers in the Pod.',
      conceptExplanation: 'emptyDir volumes are created when a Pod is assigned to a node and deleted when the Pod is removed. They provide a way for containers within a Pod to share files and can be stored in memory (tmpfs) or on disk. Common use cases include scratch space for computations, checkpointing long computations, and sharing files between sidecar containers.',
      animation: {
        title: 'Volumes: emptyDir - Temporary Scratch Space',
        description: 'Explaining how Kubernetes Volumes provide data persistence within Pods, focusing on emptyDir and hostPath types for temporary and node-specific storage',
        scenes: [
          {
            title: 'The Problem - Ephemeral Container Data',
            description: 'A "Container" writes data to its local filesystem (e.g., logs, cache files, temporary data). When the container crashes or restarts, all this data is lost. Show data disappearing when container restarts.',
            duration: 4000
          },
          {
            title: 'Introducing Volumes - Persistent Data Layer',
            description: 'A "Volume" icon (a storage box) appears inside the Pod, separate from the Container. This provides a persistent data layer that survives container restarts.',
            duration: 3000
          },
          {
            title: 'Volume Mounting',
            description: 'Show the "Volume" inside the Pod. An arrow from the Volume connects to a "mountPath" inside the Container\'s file system (e.g., /app/data). Data flows from the container to the volume and back.',
            duration: 4000
          },
          {
            title: 'Volume Type: emptyDir - Temporary Data',
            description: 'The "Volume" block transforms into an "Empty Box" icon labeled emptyDir. The Pod crashes, but immediately restarts on the same node. The emptyDir volume is still there, and the data is preserved. Then the entire Pod is deleted or rescheduled to a different node. The emptyDir and its data are gone.',
            duration: 4000
          },
          {
            title: 'Volume Type: hostPath - Node-Specific Data',
            description: 'The "Volume" block transforms into a "Hard Drive" icon labeled hostPath. An arrow connects it directly to the underlying "Worker Node\'s Disk." Data persists even if Pod is deleted, but only on that specific node.',
            duration: 4000
          },
          {
            title: 'Use Cases',
            description: 'Icons for emptyDir: "Scratch Space," "Caching," "Inter-container communication." Icons for hostPath: "Node Logs," "Persistent Configs for Node Agents" (with caution).',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The Pod icon with its internal Volume, demonstrating how data can persist beyond container restarts. Benefits: "Container Restart Survival," "Shared Storage," "Flexible Types."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'emptyDir Volume Examples',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: emptydir-examples
spec:
  containers:
  - name: writer
    image: busybox
    command: ['sh', '-c']
    args:
    - while true; do
        echo "$(date): Writing data" >> /shared/data.log;
        sleep 10;
      done
    volumeMounts:
    - name: shared-data
      mountPath: /shared
  - name: reader
    image: busybox
    command: ['sh', '-c']
    args:
    - while true; do
        if [ -f /shared/data.log ]; then
          tail -f /shared/data.log;
        fi;
        sleep 5;
      done
    volumeMounts:
    - name: shared-data
      mountPath: /shared
  volumes:
  - name: shared-data
    emptyDir: {}
  - name: memory-volume
    emptyDir:
      medium: Memory    # Store in RAM (tmpfs)
      sizeLimit: 1Gi`,
        explanation: 'This example shows containers sharing data via emptyDir, including both disk-based and memory-based volumes.'
      },
      keyPoints: [
        'Provides temporary storage for the lifetime of a Pod',
        'Shared between all containers in the same Pod',
        'Can be stored on disk or in memory (tmpfs)',
        'Data is lost when the Pod is deleted',
        'Useful for scratch space and inter-container communication'
      ],
      quiz: [
        {
          question: 'What happens to data in an emptyDir volume when a container restarts?',
          options: [
            'The data is permanently lost',
            'The data persists because the Pod is still running',
            'The data is backed up automatically',
            'The data is moved to persistent storage'
          ],
          correct: 1,
          explanation: 'emptyDir volumes persist for the lifetime of the Pod, so data survives container restarts but is lost when the Pod is deleted.'
        },
        {
          question: 'When would you use emptyDir with medium: Memory?',
          options: [
            'For long-term data storage',
            'For high-performance temporary storage',
            'For sharing data between Pods',
            'For database storage'
          ],
          correct: 1,
          explanation: 'Memory-based emptyDir (tmpfs) provides high-performance temporary storage for applications that need fast access to scratch space.'
        }
      ]
    }
  },
  {
    id: 41,
    title: 'Persistent Volumes (PV): Cluster Storage Resources',
    description: 'Understanding cluster-wide storage resources and their lifecycle',
    duration: '18 min',
    difficulty: 'Advanced',
    category: 'Storage',
    tags: ['persistent-volumes', 'pv', 'storage-lifecycle', 'cluster-storage'],
    content: {
      introduction: 'Persistent Volumes are cluster-wide storage resources that exist independently of any Pod and provide durable storage for applications.',
      conceptExplanation: 'PVs represent actual storage resources in the cluster, such as AWS EBS volumes, GCE persistent disks, or NFS shares. They have a lifecycle independent of Pods and can be provisioned statically by administrators or dynamically through StorageClasses. PVs support different access modes (ReadWriteOnce, ReadOnlyMany, ReadWriteMany) and reclaim policies (Retain, Delete, Recycle).',
      animation: {
        title: 'Persistent Volumes: Cluster Storage Resources',
        description: 'Explaining how Kubernetes Persistent Volumes provide durable, cluster-wide storage that exists independently of Pods',
        scenes: [
          {
            title: 'The Problem - Ephemeral Pod Storage',
            description: 'A "Pod" with a "Container" writes data to its local filesystem. When the Pod is deleted or crashes, all data is lost. This is problematic for databases, file uploads, or any persistent data.',
            duration: 4000
          },
          {
            title: 'Introducing Persistent Volumes - Durable Storage',
            description: 'A "Persistent Volume (PV)" icon (a storage disk or vault) appears, representing actual storage infrastructure (AWS EBS, GCE Persistent Disk, NFS, etc.). This storage exists independently of any Pod.',
            duration: 3000
          },
          {
            title: 'Static vs Dynamic Provisioning',
            description: 'Show two approaches: Static: Administrator pre-creates PVs manually. Dynamic: Storage Classes automatically create PVs on-demand when requested.',
            duration: 4000
          },
          {
            title: 'PV Characteristics',
            description: 'Show PV properties: Capacity: Storage size (e.g., 100Gi). Access Modes: ReadWriteOnce, ReadOnlyMany, ReadWriteMany. Storage Class: Performance tier (SSD, HDD). Reclaim Policy: What happens when released.',
            duration: 4000
          },
          {
            title: 'PV Lifecycle States',
            description: 'Show the PV state progression: Available: Ready for binding. Bound: Attached to a PVC. Released: PVC deleted, but not yet reclaimed. Failed: Automatic reclamation failed.',
            duration: 4000
          },
          {
            title: 'Reclaim Policies',
            description: 'When a PVC is deleted, show different reclaim behaviors: Retain: PV remains with data intact (manual cleanup required). Delete: PV and underlying storage are deleted automatically. Recycle: Data is scrubbed, PV becomes available again (deprecated).',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The PV storage icon is central, connected to "Durability," "Independence," "Flexibility," with benefits: "Data Persistence," "Pod Independence," "Storage Abstraction."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Static PV Provisioning',
        code: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: database-pv
  labels:
    type: ssd
    environment: production
spec:
  capacity:
    storage: 100Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  awsElasticBlockStore:
    volumeID: vol-12345678
    fsType: ext4
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: shared-nfs-pv
spec:
  capacity:
    storage: 500Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: nfs-server.example.com
    path: /shared/data
---
# Check PV status
kubectl get pv
kubectl describe pv database-pv`,
        explanation: 'These examples show static PV provisioning for both block storage (EBS) and network storage (NFS) with different access modes.'
      },
      keyPoints: [
        'Cluster-wide storage resources independent of Pods',
        'Support various storage backends (EBS, GCE, NFS, etc.)',
        'Different access modes for various use cases',
        'Reclaim policies control cleanup behavior',
        'Can be provisioned statically or dynamically'
      ],
      quiz: [
        {
          question: 'What is the difference between ReadWriteOnce and ReadWriteMany access modes?',
          options: [
            'ReadWriteOnce is faster than ReadWriteMany',
            'ReadWriteOnce allows one node, ReadWriteMany allows multiple nodes',
            'ReadWriteMany is only for databases',
            'There is no difference'
          ],
          correct: 1,
          explanation: 'ReadWriteOnce allows mounting by a single node, while ReadWriteMany allows mounting by multiple nodes simultaneously.'
        },
        {
          question: 'What happens to a PV with Retain reclaim policy when its PVC is deleted?',
          options: [
            'The PV is automatically deleted',
            'The PV remains available for manual cleanup',
            'The PV is immediately recycled',
            'The PV becomes corrupted'
          ],
          correct: 1,
          explanation: 'With Retain policy, the PV remains in the cluster after PVC deletion, requiring manual cleanup by administrators.'
        }
      ]
    }
  },
  {
    id: 42,
    title: 'Persistent Volume Claims (PVC): Storage Requests',
    description: 'Requesting and consuming persistent storage in applications',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Storage',
    tags: ['persistent-volume-claims', 'pvc', 'storage-requests', 'dynamic-provisioning'],
    content: {
      introduction: 'Persistent Volume Claims are requests for storage by users, similar to how Pods consume node resources.',
      conceptExplanation: 'PVCs allow users to request storage without knowing the details of the underlying storage infrastructure. They specify size, access modes, and optionally storage class. Kubernetes matches PVCs to available PVs or triggers dynamic provisioning. PVCs can be used by Pods to mount persistent storage, enabling data persistence across Pod restarts and rescheduling.',
      animation: {
        title: 'Persistent Volume Claims (PVC): Storage Requests',
        description: 'Explaining how Persistent Volume Claims abstract storage requests for Pods, providing a way to request storage without knowing underlying infrastructure details',
        scenes: [
          {
            title: 'The Pod\'s Storage Need',
            description: 'A "Pod" icon appears, looking for storage (a thought bubble with a small hard drive icon). The "PV Pool" is visible but distant and abstract. The Pod doesn\'t know how to talk to it directly.',
            duration: 4000
          },
          {
            title: 'Introducing Persistent Volume Claim (PVC) - The Request Form',
            description: 'A "Persistent Volume Claim (PVC)" icon appears as a "Request Form" (a clipboard with fields like "Capacity: 5Gi", "Access Mode: RWO"). The Pod sends its request to this PVC form.',
            duration: 3000
          },
          {
            title: 'PVC to PV Binding (Matching)',
            description: 'The "PVC Request Form" floats towards the "PV Pool." The "Kubernetes Control Plane" (represented by a \'Matchmaker\' character) reads the PVC\'s requirements and finds a matching "Persistent Volume (PV)" from the pool. A visible "Binding" connection (a rope) forms between the PVC and the PV.',
            duration: 4000
          },
          {
            title: 'Pod Consumes PVC',
            description: 'The now-bound "PVC" moves closer to the "Pod." An arrow shows the Pod mounting the PVC. The Pod can now read/write data to the storage represented by the PV, but it only interacts with the PVC.',
            duration: 4000
          },
          {
            title: 'Decoupling and Portability',
            description: 'The Pod is rescheduled from "Node A" to "Node B." The "PVC-PV Binding" remains stable. The Pod on "Node B" immediately re-connects to the same PVC (and thus the same PV/storage), without data loss.',
            duration: 4000
          },
          {
            title: 'PVC Lifecycle (Deletion)',
            description: 'The Pod is deleted. Then the "PVC Request Form" is deleted. When the PVC is deleted, the binding to the PV is released. The PV goes back to the "PV Pool" (or is deleted/retained based on its reclaim policy).',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'A simplified view showing a Pod consuming a PVC, which is connected to a PV, which represents the real storage. Benefits: "Storage Abstraction," "Pod Portability," "Lifecycle Management."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'PVC Usage in Applications',
        code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
  storageClassName: fast-ssd
  selector:
    matchLabels:
      environment: production
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: database
spec:
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
        env:
        - name: POSTGRES_DB
          value: myapp
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        ports:
        - containerPort: 5432
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: database-pvc`,
        explanation: 'This shows a PVC requesting fast SSD storage and a database deployment using that storage for data persistence.'
      },
      keyPoints: [
        'Requests for storage by users and applications',
        'Abstracts storage details from application developers',
        'Automatically binds to suitable PVs or triggers provisioning',
        'Enables data persistence across Pod lifecycle events',
        'Supports storage class selection for different performance tiers'
      ],
      quiz: [
        {
          question: 'What happens when a PVC cannot find a matching PV?',
          options: [
            'The PVC is automatically deleted',
            'The PVC remains Pending until a suitable PV is available',
            'A default PV is created automatically',
            'The application fails to start'
          ],
          correct: 1,
          explanation: 'When no suitable PV is available, the PVC remains in Pending state until a matching PV becomes available or is dynamically provisioned.'
        },
        {
          question: 'Can multiple Pods use the same PVC simultaneously?',
          options: [
            'Never, PVCs are always exclusive to one Pod',
            'Yes, if the underlying PV supports ReadWriteMany',
            'Only if the Pods are in the same namespace',
            'Only for read-only access'
          ],
          correct: 1,
          explanation: 'Multiple Pods can use the same PVC if the underlying PV supports ReadWriteMany access mode, allowing shared storage access.'
        }
      ]
    }
  },
  {
    id: 43,
    title: 'Storage Classes: Dynamic Volume Provisioning',
    description: 'Automating storage provisioning with different performance tiers',
    duration: '17 min',
    difficulty: 'Advanced',
    category: 'Storage',
    tags: ['storage-classes', 'dynamic-provisioning', 'storage-tiers', 'automation'],
    content: {
      introduction: 'Storage Classes enable dynamic provisioning of Persistent Volumes with different storage types and performance characteristics.',
      conceptExplanation: 'Storage Classes define the "classes" of storage available in a cluster, such as fast SSD, standard HDD, or replicated storage. When a PVC references a Storage Class, Kubernetes automatically provisions a PV with the specified characteristics. This eliminates the need for administrators to pre-provision storage and allows applications to request storage on-demand with specific performance requirements.',
      animation: {
        title: 'Storage Classes: Dynamic Volume Provisioning',
        description: 'Explaining how StorageClasses enable administrators to define storage types and automate Persistent Volume provisioning when requested by PVCs',
        scenes: [
          {
            title: 'The Problem - Manual PV Provisioning',
            description: 'A "Storage Administrator" manually creates many different "PV" YAMLs for various storage types (e.g., fast-ssd, slow-hdd, nfs). A "Developer" requests a "PVC," but has to wait for the Admin to manually create a matching PV. The process looks slow and involves a lot of back-and-forth.',
            duration: 4000
          },
          {
            title: 'Introducing StorageClass - The Blueprint for Storage',
            description: 'A "StorageClass" icon (a "Blueprint" or "Menu" for storage) appears. It contains definitions like "Name: fast-ssd," "Provisioner: AWS EBS," "IOPS: 3000."',
            duration: 3000
          },
          {
            title: 'Admin Defines StorageClasses',
            description: 'The "Storage Administrator" creates several different "StorageClass" blueprints (e.g., gold, silver, bronze), each pointing to different underlying "Storage Provisioners" (e.g., AWS EBS, Google PD, NFS). These are published to the cluster.',
            duration: 4000
          },
          {
            title: 'Developer Requests PVC (Dynamic Provisioning)',
            description: 'A "Developer" creates a "PVC" YAML. Instead of requesting a specific PV, the PVC specifies a storageClassName: gold. The PVC "request form" goes to the "Control Plane."',
            duration: 4000
          },
          {
            title: 'Automatic PV Creation (The Magic!)',
            description: 'The "Control Plane" (specifically the StorageClass Controller and relevant "CSI Driver" / "Provisioner") sees the PVC requesting gold storage. It consults the gold StorageClass blueprint. It then automatically creates a new "PV" in the "PV Pool" that perfectly matches the PVC\'s request and the StorageClass\'s definition (e.g., provisioning an AWS EBS volume). The PVC then binds to this newly created PV.',
            duration: 4000
          },
          {
            title: 'Default StorageClass (Optional)',
            description: 'If a PVC doesn\'t specify a storageClassName, it automatically gets bound to a "Default StorageClass" (marked with a "star" icon).',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Automation," "Self-Service," "Flexibility." Benefits: "Automation," "Self-Service," "Flexibility."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A smooth flow from Developer\'s PVC request to an automatically provisioned and bound PV, enabled by StorageClasses. Benefits: "Dynamic Provisioning," "Storage Tiers," "Developer Self-Service."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Storage Class Definitions',
        code: `# Fast SSD Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
---
# Standard HDD Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard-hdd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
---
# NFS Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: shared-nfs
provisioner: nfs.csi.k8s.io
parameters:
  server: nfs-server.example.com
  share: /shared
reclaimPolicy: Retain
volumeBindingMode: Immediate`,
        explanation: 'These Storage Classes provide different storage tiers: high-performance SSD, standard HDD, and shared NFS storage.'
      },
      keyPoints: [
        'Enables automatic PV provisioning on demand',
        'Defines different storage tiers and performance levels',
        'Eliminates need for manual PV pre-provisioning',
        'Supports various cloud and on-premises storage systems',
        'Allows volume expansion and custom provisioning parameters'
      ],
      quiz: [
        {
          question: 'What happens when a PVC specifies a Storage Class?',
          options: [
            'The PVC is rejected if no PV exists',
            'A new PV is automatically provisioned using the Storage Class',
            'The Storage Class is ignored',
            'The PVC waits indefinitely'
          ],
          correct: 1,
          explanation: 'When a PVC specifies a Storage Class, Kubernetes automatically provisions a new PV using the provisioner and parameters defined in that Storage Class.'
        },
        {
          question: 'What does volumeBindingMode: WaitForFirstConsumer do?',
          options: [
            'Delays PV creation until a Pod uses the PVC',
            'Creates the PV immediately when PVC is created',
            'Prevents the PVC from being used',
            'Makes the storage read-only'
          ],
          correct: 0,
          explanation: 'WaitForFirstConsumer delays PV provisioning until a Pod that uses the PVC is scheduled, ensuring the volume is created in the correct availability zone.'
        }
      ]
    }
  },
  {
    id: 44,
    title: 'ConfigMaps: Configuration Data Management',
    description: 'Storing and managing application configuration separately from code',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'Configuration',
    tags: ['configmaps', 'configuration', 'environment-variables', 'config-files'],
    content: {
      introduction: 'ConfigMaps store configuration data in key-value pairs, allowing you to decouple configuration from application code.',
      conceptExplanation: 'ConfigMaps provide a way to store non-confidential configuration data that can be consumed by Pods as environment variables, command-line arguments, or configuration files. This separation of configuration from application images enables the same image to be used across different environments (dev, staging, production) with different configurations. ConfigMaps can be created from literal values, files, or directories.',
      animation: {
        title: 'ConfigMaps: Configuration Data Management',
        description: 'Explaining how Kubernetes ConfigMaps store and provide configuration data to applications, enabling separation of config from code',
        scenes: [
          {
            title: 'The Problem - Hardcoded Configuration',
            description: 'An "Application Container" has configuration hardcoded inside it (e.g., database URLs, API endpoints). When the environment changes (dev to staging to production), a new container image must be built.',
            duration: 4000
          },
          {
            title: 'Introducing ConfigMaps - External Configuration',
            description: 'A "ConfigMap" icon (a settings/gear box) appears, containing key-value pairs (e.g., DB_HOST=postgres.prod.com, API_URL=https://api.prod.com). The Application Container is now "generic" and can be used in any environment.',
            duration: 3000
          },
          {
            title: 'ConfigMap Creation Methods',
            description: 'Show three ways to create ConfigMaps: From Literal Values: kubectl create configmap app-config --from-literal=key=value. From Files: kubectl create configmap app-config --from-file=config.properties. From Directories: kubectl create configmap app-config --from-file=config-dir/.',
            duration: 4000
          },
          {
            title: 'Consuming ConfigMaps - Environment Variables',
            description: 'The Pod spec references the ConfigMap. Inside the running container, the configuration appears as environment variables (e.g., echo $DB_HOST shows postgres.prod.com).',
            duration: 3000
          },
          {
            title: 'Consuming ConfigMaps - Volume Mounts',
            description: 'Alternatively, the ConfigMap is mounted as a volume inside the container. Configuration appears as files in a directory (e.g., /etc/config/db_host contains postgres.prod.com).',
            duration: 4000
          },
          {
            title: 'Multi-Environment Deployment',
            description: 'The same "Application Container" image is deployed in three environments: Dev, Staging, Production. Each environment has its own ConfigMap with environment-specific values, but the container image remains unchanged.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The ConfigMap icon is central, connected to "Environment Variables," "Volume Mounts," and "Multi-Environment" icons, with benefits: "Decoupling," "Reusability," "Environment-Specific Config."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'ConfigMap Creation and Usage',
        code: `# Create ConfigMap from literal values
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "postgres.example.com"
  database_port: "5432"
  log_level: "INFO"
  feature_flags: "feature1=true,feature2=false"
  app.properties: |
    server.port=8080
    server.servlet.context-path=/api
    logging.level.com.example=DEBUG
---
# Pod using ConfigMap
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:v1.0
    env:
    # Individual environment variables
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_host
    - name: LOG_LEVEL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: log_level
    envFrom:
    # All ConfigMap keys as environment variables
    - configMapRef:
        name: app-config
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
      items:
      - key: app.properties
        path: application.properties`,
        explanation: 'This shows ConfigMap creation and consumption via environment variables and file mounts in a Pod.'
      },
      keyPoints: [
        'Stores non-confidential configuration data',
        'Decouples configuration from application images',
        'Can be consumed as environment variables or files',
        'Enables same image across different environments',
        'Supports hot-reloading of configuration in some cases'
      ],
      quiz: [
        {
          question: 'What type of data should NOT be stored in ConfigMaps?',
          options: [
            'Application settings',
            'Database connection strings',
            'Passwords and API keys',
            'Feature flags'
          ],
          correct: 2,
          explanation: 'Sensitive data like passwords and API keys should be stored in Secrets, not ConfigMaps, as ConfigMaps are not encrypted.'
        },
        {
          question: 'What happens when you update a ConfigMap that is mounted as a volume?',
          options: [
            'The Pod must be restarted to see changes',
            'Changes are reflected automatically in the mounted files',
            'The ConfigMap update is rejected',
            'The volume becomes read-only'
          ],
          correct: 1,
          explanation: 'When a ConfigMap is mounted as a volume, changes to the ConfigMap are automatically reflected in the mounted files (though applications may need to reload configuration).'
        }
      ]
    }
  },
  {
    id: 45,
    title: 'Secrets: Sensitive Data Management',
    description: 'Securely storing and managing passwords, tokens, and certificates',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Security',
    tags: ['secrets', 'sensitive-data', 'encryption', 'security'],
    content: {
      introduction: 'Secrets store and manage sensitive information such as passwords, OAuth tokens, SSH keys, and TLS certificates.',
      conceptExplanation: 'Secrets are similar to ConfigMaps but are specifically designed for confidential data. They are base64 encoded (not encrypted by default) and can be encrypted at rest with additional configuration. Secrets can be consumed by Pods as environment variables or mounted as files. Kubernetes also provides built-in secret types for common use cases like TLS certificates and Docker registry credentials.',
      animation: {
        title: 'Secrets: Secure Sensitive Data Management',
        description: 'Explaining how Kubernetes Secrets store and manage sensitive information like passwords, tokens, and certificates securely',
        scenes: [
          {
            title: 'The Problem - Sensitive Data Exposure',
            description: 'An "Application Container" has sensitive data (passwords, API keys) hardcoded or stored in plain text ConfigMaps. This poses security risks as anyone with access to the container image or ConfigMap can see the sensitive information.',
            duration: 4000
          },
          {
            title: 'Introducing Secrets - Secure Storage',
            description: 'A "Secret" icon (a locked vault or safe) appears, containing sensitive key-value pairs (e.g., DB_PASSWORD=*****, API_KEY=*****). The data is base64 encoded and can be encrypted at rest.',
            duration: 3000
          },
          {
            title: 'Secret Types',
            description: 'Show different Secret types: Opaque: Generic secrets for arbitrary data. kubernetes.io/dockerconfigjson: Docker registry credentials. kubernetes.io/tls: TLS certificates and keys. kubernetes.io/service-account-token: Service account tokens.',
            duration: 4000
          },
          {
            title: 'Creating Secrets Securely',
            description: 'Show secure creation methods: kubectl create secret generic: From command line (data not stored in shell history). From files: kubectl create secret generic --from-file=secret.txt. YAML with stringData: Automatically base64 encoded.',
            duration: 4000
          },
          {
            title: 'Consuming Secrets - Environment Variables',
            description: 'The Pod spec references the Secret. Inside the running container, sensitive data appears as environment variables, but the original Secret remains protected in etcd.',
            duration: 3000
          },
          {
            title: 'Consuming Secrets - Volume Mounts',
            description: 'Alternatively, the Secret is mounted as a volume. Sensitive data appears as files in a directory (e.g., /etc/secrets/db-password), with proper file permissions for security.',
            duration: 4000
          },
          {
            title: 'Security Features',
            description: 'Highlight security features: RBAC: Controls who can access Secrets. Encryption at Rest: Optional etcd encryption. Automatic Rotation: For service account tokens. Memory-only: Secrets stored in tmpfs, not on disk.',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'The Secret vault icon is central, connected to "Encryption," "RBAC," "Secure Access," with benefits: "Data Protection," "Access Control," "Compliance."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Secret Types and Usage',
        code: `# Generic Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-password: cGFzc3dvcmQxMjM=  # base64 encoded
  api-key: YWJjZGVmZ2hpams=
stringData:  # Automatically base64 encoded
  database-username: admin
  jwt-secret: my-super-secret-jwt-key
---
# TLS Secret
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # base64 encoded certificate
  tls.key: LS0tLS1CRUdJTi... # base64 encoded private key
---
# Docker Registry Secret
apiVersion: v1
kind: Secret
metadata:
  name: registry-secret
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6... # base64 encoded docker config
---
# Pod using Secrets
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  imagePullSecrets:
  - name: registry-secret
  containers:
  - name: app
    image: private-registry.com/myapp:v1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: database-password
    volumeMounts:
    - name: tls-certs
      mountPath: /etc/tls
      readOnly: true
  volumes:
  - name: tls-certs
    secret:
      secretName: tls-secret`,
        explanation: 'This shows different Secret types and how they are consumed by Pods for various security use cases.'
      },
      keyPoints: [
        'Designed specifically for sensitive data storage',
        'Base64 encoded by default, can be encrypted at rest',
        'Multiple built-in types for common use cases',
        'Consumed via environment variables or file mounts',
        'Subject to RBAC for access control'
      ],
      quiz: [
        {
          question: 'How is data stored in Kubernetes Secrets by default?',
          options: [
            'Plain text',
            'Base64 encoded',
            'AES encrypted',
            'Hashed with SHA-256'
          ],
          correct: 1,
          explanation: 'By default, Secret data is base64 encoded (not encrypted). Encryption at rest requires additional etcd configuration.'
        },
        {
          question: 'What is the advantage of using stringData instead of data in a Secret?',
          options: [
            'stringData is more secure',
            'stringData is automatically base64 encoded',
            'stringData supports larger values',
            'stringData is encrypted'
          ],
          correct: 1,
          explanation: 'stringData allows you to provide plain text values that are automatically base64 encoded, making Secret creation easier.'
        }
      ]
    }
  },
  {
    id: 46,
    title: 'Services: ClusterIP - Internal Service Discovery',
    description: 'Enabling internal communication between Pods within the cluster',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Networking',
    tags: ['services', 'clusterip', 'service-discovery', 'internal-networking'],
    content: {
      introduction: 'ClusterIP Services provide stable internal endpoints for Pod-to-Pod communication within the Kubernetes cluster.',
      conceptExplanation: 'ClusterIP is the default Service type that creates a stable virtual IP address accessible only within the cluster. It provides service discovery and load balancing for Pods selected by label selectors. This enables loose coupling between application components, as clients can connect to the service name rather than individual Pod IPs, which change when Pods are recreated.',
      animation: {
        title: 'ClusterIP Service Discovery',
        description: 'How ClusterIP Services enable internal Pod communication',
        scenes: [
          {
            title: 'Service Creation',
            description: 'ClusterIP Service created with stable internal IP',
            duration: 3000
          },
          {
            title: 'Pod Selection',
            description: 'Service selects backend Pods using label selectors',
            duration: 4000
          },
          {
            title: 'Load Balancing',
            description: 'Traffic distributed across healthy Pod endpoints',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'ClusterIP Service Configuration',
        code: `# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP  # Default type
  selector:
    app: backend
    tier: api
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP
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
      tier: api
  template:
    metadata:
      labels:
        app: backend
        tier: api
    spec:
      containers:
      - name: api
        image: backend-api:v1.0
        ports:
        - containerPort: 8080
        - containerPort: 9090
---
# Frontend Pod accessing backend
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: frontend
    image: frontend:v1.0
    env:
    - name: BACKEND_URL
      value: "http://backend-service:80/api"`,
        explanation: 'This shows a ClusterIP Service providing internal access to backend Pods, with a frontend Pod consuming the service.'
      },
      keyPoints: [
        'Default Service type for internal cluster communication',
        'Provides stable virtual IP and DNS name',
        'Load balances traffic across selected Pods',
        'Enables service discovery within the cluster',
        'Not accessible from outside the cluster'
      ],
      quiz: [
        {
          question: 'How do Pods discover and connect to a ClusterIP Service?',
          options: [
            'By Pod IP addresses',
            'By Service name and port via DNS',
            'By node IP addresses',
            'By container names'
          ],
          correct: 1,
          explanation: 'Pods can discover ClusterIP Services using the service name as a DNS hostname, which resolves to the service\'s cluster IP.'
        },
        {
          question: 'Can ClusterIP Services be accessed from outside the Kubernetes cluster?',
          options: [
            'Yes, they are publicly accessible',
            'No, they are only accessible within the cluster',
            'Only with special configuration',
            'Only from the master node'
          ],
          correct: 1,
          explanation: 'ClusterIP Services are only accessible from within the Kubernetes cluster and cannot be reached from external clients.'
        }
      ]
    }
  },
  {
    id: 47,
    title: 'Services: NodePort - External Access via Node IPs',
    description: 'Exposing services externally through node IP addresses and ports',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'Networking',
    tags: ['services', 'nodeport', 'external-access', 'node-networking'],
    content: {
      introduction: 'NodePort Services expose applications externally by opening a specific port on all cluster nodes.',
      conceptExplanation: 'NodePort Services extend ClusterIP functionality by additionally opening a port (30000-32767 range) on every node in the cluster. External traffic can reach the service by connecting to any node\'s IP address on the allocated port. This provides a simple way to expose services externally without requiring a load balancer, though it has limitations in production environments.',
      animation: {
        title: 'NodePort External Access',
        description: 'How NodePort Services enable external connectivity',
        scenes: [
          {
            title: 'Port Allocation',
            description: 'NodePort allocated on all cluster nodes',
            duration: 3000
          },
          {
            title: 'External Request',
            description: 'External client connects to any node IP and port',
            duration: 4000
          },
          {
            title: 'Internal Routing',
            description: 'Traffic routed to appropriate Pod endpoints',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'NodePort Service Configuration',
        code: `apiVersion: v1
kind: Service
metadata:
  name: web-app-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
  - name: http
    port: 80        # ClusterIP port
    targetPort: 8080 # Pod port
    nodePort: 30080  # External port (optional, auto-assigned if not specified)
    protocol: TCP
---
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
        image: nginx:1.20
        ports:
        - containerPort: 8080
---
# Check service and access information
# kubectl get svc web-app-nodeport
# Access via: http://<node-ip>:30080`,
        explanation: 'This NodePort Service exposes the web application on port 30080 of all cluster nodes, accessible from external clients.'
      },
      keyPoints: [
        'Exposes services externally via node IP addresses',
        'Opens a port (30000-32767) on all cluster nodes',
        'Provides simple external access without load balancer',
        'Includes ClusterIP functionality for internal access',
        'Limited scalability and security in production'
      ],
      quiz: [
        {
          question: 'What port range is used for NodePort services?',
          options: [
            '1-1023',
            '8000-9000',
            '30000-32767',
            '80-8080'
          ],
          correct: 2,
          explanation: 'NodePort services use ports in the range 30000-32767, which can be specified or automatically assigned by Kubernetes.'
        },
        {
          question: 'How can external clients access a NodePort service?',
          options: [
            'Only through the master node',
            'Through any cluster node IP and the NodePort',
            'Only through worker nodes',
            'Through the service name'
          ],
          correct: 1,
          explanation: 'External clients can access NodePort services by connecting to any cluster node\'s IP address using the allocated NodePort.'
        }
      ]
    }
  },
  {
    id: 48,
    title: 'Services: LoadBalancer - Cloud Provider Integration',
    description: 'Leveraging cloud load balancers for production external access',
    duration: '17 min',
    difficulty: 'Advanced',
    category: 'Networking',
    tags: ['services', 'loadbalancer', 'cloud-integration', 'production-networking'],
    content: {
      introduction: 'LoadBalancer Services integrate with cloud provider load balancers to provide production-grade external access.',
      conceptExplanation: 'LoadBalancer Services extend NodePort functionality by provisioning an external load balancer from the cloud provider (AWS ELB, GCP Load Balancer, Azure Load Balancer). This provides a stable external IP address, SSL termination, health checks, and high availability. The cloud load balancer distributes traffic to the NodePorts across cluster nodes, providing enterprise-grade external connectivity.',
      animation: {
        title: 'LoadBalancer Service Architecture',
        description: 'How LoadBalancer Services integrate with cloud infrastructure',
        scenes: [
          {
            title: 'Cloud Provisioning',
            description: 'Cloud load balancer automatically provisioned',
            duration: 3000
          },
          {
            title: 'External Traffic',
            description: 'Internet traffic routed through cloud load balancer',
            duration: 4000
          },
          {
            title: 'High Availability',
            description: 'Load balancer distributes traffic across healthy nodes',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'LoadBalancer Service with Annotations',
        code: `apiVersion: v1
kind: Service
metadata:
  name: web-app-lb
  annotations:
    # AWS-specific annotations
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-west-2:123456789:certificate/12345"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
    # Health check configuration
    service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: "/health"
    service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "10"
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: https
    port: 443
    targetPort: 8080
    protocol: TCP
  loadBalancerSourceRanges:
  - "10.0.0.0/8"    # Restrict access to private networks
  - "172.16.0.0/12"
---
# Check external IP assignment
# kubectl get svc web-app-lb
# EXTERNAL-IP will show the cloud load balancer IP`,
        explanation: 'This LoadBalancer Service provisions an AWS Network Load Balancer with SSL termination and health checks.'
      },
      keyPoints: [
        'Integrates with cloud provider load balancers',
        'Provides stable external IP address',
        'Supports SSL termination and health checks',
        'Offers production-grade high availability',
        'Automatically manages cloud infrastructure'
      ],
      quiz: [
        {
          question: 'What happens when you create a LoadBalancer Service in a cloud environment?',
          options: [
            'Only a ClusterIP is created',
            'A cloud load balancer is automatically provisioned',
            'The service fails to create',
            'Only NodePorts are opened'
          ],
          correct: 1,
          explanation: 'LoadBalancer Services automatically provision an external load balancer from the cloud provider, providing a stable external IP.'
        },
        {
          question: 'What is the main advantage of LoadBalancer Services over NodePort Services?',
          options: [
            'Lower cost',
            'Faster performance',
            'Stable external IP and cloud integration',
            'Simpler configuration'
          ],
          correct: 2,
          explanation: 'LoadBalancer Services provide a stable external IP address and integrate with cloud provider features like SSL termination and health checks.'
        }
      ]
    }
  },
  {
    id: 49,
    title: 'Ingress: HTTP/HTTPS Routing and SSL Termination',
    description: 'Advanced HTTP routing with path-based and host-based rules',
    duration: '20 min',
    difficulty: 'Advanced',
    category: 'Networking',
    tags: ['ingress', 'http-routing', 'ssl-termination', 'path-routing'],
    content: {
      introduction: 'Ingress provides HTTP and HTTPS routing to services based on hostnames and paths, with SSL termination capabilities.',
      conceptExplanation: 'Ingress is an API object that manages external access to services via HTTP/HTTPS. It provides features like path-based routing, host-based routing, SSL termination, and load balancing. Ingress requires an Ingress Controller (like NGINX, Traefik, or cloud-specific controllers) to implement the routing rules. This enables sophisticated traffic management for web applications with a single external IP.',
      animation: {
        title: 'Ingress: HTTP/HTTPS Routing and SSL Termination',
        description: 'Explaining how Kubernetes Ingress provides advanced HTTP routing, SSL termination, and unified external access to multiple services',
        scenes: [
          {
            title: 'The Problem - Multiple External IPs',
            description: 'Multiple "LoadBalancer Services" each have their own external IP addresses (e.g., 203.0.113.1, 203.0.113.2, 203.0.113.3). This is expensive and complex to manage. Each service needs its own cloud load balancer.',
            duration: 4000
          },
          {
            title: 'Introducing Ingress - The Smart Router',
            description: 'An "Ingress Controller" (a smart router/gateway icon) appears with a single external IP address. It sits in front of multiple "ClusterIP Services" inside the cluster.',
            duration: 3000
          },
          {
            title: 'Host-Based Routing',
            description: 'External requests come to the single Ingress IP: api.example.com → API Service. app.example.com → Frontend Service. admin.example.com → Admin Service. The Ingress Controller routes based on the Host header.',
            duration: 4000
          },
          {
            title: 'Path-Based Routing',
            description: 'Requests to the same host but different paths: example.com/api → API Service. example.com/app → Frontend Service. example.com/admin → Admin Service. The Ingress Controller routes based on the URL path.',
            duration: 4000
          },
          {
            title: 'SSL Termination',
            description: 'HTTPS requests arrive at the Ingress Controller. The Ingress Controller handles SSL termination (decrypts HTTPS to HTTP) using TLS certificates stored in Kubernetes Secrets. Internal communication to services can be HTTP.',
            duration: 4000
          },
          {
            title: 'Advanced Features',
            description: 'Show additional capabilities: Rate Limiting: Throttling requests per client. URL Rewriting: Modifying paths before forwarding. Authentication: Basic auth or OAuth integration. Load Balancing: Distributing traffic across service endpoints.',
            duration: 4000
          },
          {
            title: 'Ingress Controller Requirement',
            description: 'Highlight that Ingress resources are just configuration. An "Ingress Controller" (NGINX, Traefik, HAProxy, cloud-specific) must be deployed to implement the routing rules.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'The Ingress Controller icon is central, connected to "Single IP," "SSL Termination," "Smart Routing," with benefits: "Cost Efficiency," "Centralized Management," "Advanced Features."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Comprehensive Ingress Configuration',
        code: `# TLS Certificate Secret
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # base64 encoded certificate
  tls.key: LS0tLS1CRUdJTi... # base64 encoded private key
---
# Ingress with multiple routing rules
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    - app.example.com
    secretName: tls-secret
  rules:
  # API service routing
  - host: api.example.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-v1-service
            port:
              number: 80
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: api-v2-service
            port:
              number: 80
  # Web application routing
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
      - path: /admin
        pathType: Prefix
        backend:
          service:
            name: admin-service
            port:
              number: 80`,
        explanation: 'This Ingress provides SSL termination and routes traffic to different services based on hostnames and paths.'
      },
      keyPoints: [
        'Provides HTTP/HTTPS routing based on hosts and paths',
        'Enables SSL termination and certificate management',
        'Supports multiple services behind a single IP',
        'Requires an Ingress Controller for implementation',
        'Offers advanced features like rate limiting and redirects'
      ],
      quiz: [
        {
          question: 'What is required for Ingress to function in a Kubernetes cluster?',
          options: [
            'Only the Ingress resource',
            'An Ingress Controller',
            'A LoadBalancer Service',
            'A NodePort Service'
          ],
          correct: 1,
          explanation: 'Ingress resources require an Ingress Controller (like NGINX or Traefik) to be installed in the cluster to implement the routing rules.'
        },
        {
          question: 'What is the main advantage of using Ingress over multiple LoadBalancer Services?',
          options: [
            'Better performance',
            'Lower cost and single entry point',
            'Easier configuration',
            'Better security'
          ],
          correct: 1,
          explanation: 'Ingress allows multiple services to share a single external IP address, reducing costs and providing a unified entry point for HTTP traffic.'
        }
      ]
    }
  },
  {
    id: 50,
    title: 'Network Policies: Micro-segmentation and Security',
    description: 'Implementing network security and traffic isolation between Pods',
    duration: '18 min',
    difficulty: 'Advanced',
    category: 'Security',
    tags: ['network-policies', 'micro-segmentation', 'security', 'traffic-isolation'],
    content: {
      introduction: 'Network Policies provide network-level security by controlling traffic flow between Pods, namespaces, and external endpoints.',
      conceptExplanation: 'Network Policies act as a firewall for Pods, defining which traffic is allowed to and from specific Pods. They support ingress (incoming) and egress (outgoing) rules based on Pod selectors, namespace selectors, and IP blocks. This enables micro-segmentation, where different application tiers can be isolated from each other, improving security posture and compliance.',
      animation: {
        title: 'Network Policies: Securing Network Traffic',
        description: 'Explaining how Network Policies control communication between Pods and network endpoints in a Kubernetes cluster, enhancing security through micro-segmentation',
        scenes: [
          {
            title: 'The Open Network Problem',
            description: 'A cluster with various "Pod" icons: "Frontend," "Backend-DB," "Admin-Tool," "Malicious-Pod." Show free-flowing, unchecked arrows of communication between all Pods, including from "Malicious-Pod" to "Backend-DB."',
            duration: 4000
          },
          {
            title: 'Introducing Network Policies - The Security Guard',
            description: 'A "Network Policy" controller (a security guard character with a clipboard and "Rulebook") appears. It inspects traffic between Pods.',
            duration: 3000
          },
          {
            title: 'How Network Policies Work (Label-Based)',
            description: 'The Network Policy Rulebook shows: "Apply to: app: backend-db," "Allow ingress from: app: frontend." The "Backend-DB" Pod has a "Shield" icon. Traffic from "Frontend" Pods passes through (green arrow). Traffic from "Admin-Tool" Pods is blocked (red X). Traffic from "Malicious-Pod" is strictly blocked.',
            duration: 4000
          },
          {
            title: 'Ingress Rules (Incoming Traffic)',
            description: 'Focus on a "Backend Pod" with a shield. Show a rule only allowing connections from "Frontend Pods" (based on their label). Other Pods trying to connect get blocked.',
            duration: 4000
          },
          {
            title: 'Egress Rules (Outgoing Traffic)',
            description: 'Focus on a "Frontend Pod." Show a rule allowing outgoing connections only to "Backend Service" and "External DNS." All other external connections are blocked.',
            duration: 4000
          },
          {
            title: 'Namespace Scoping',
            description: 'Show Network Policies applied within specific "Namespaces" only. A Policy in "Production Namespace" doesn\'t affect "Development Namespace."',
            duration: 4000
          },
          {
            title: 'Requirements: Network Plugin',
            description: 'Show that the Network Policy controller needs an underlying "Network Plugin" (e.g., Calico, Cilium, Weave Net) to enforce the rules.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A secure cluster where communication flows only along defined, allowed paths, depicted by green arrows between specific Pod groups, with red "X" blocking unauthorized traffic. Benefits: "Micro-segmentation," "Traffic Control," "Security Enhancement."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Multi-tier Application Network Policies',
        code: `# Frontend Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 0.0.0.0/0  # Allow from internet
        except:
        - 169.254.169.254/32  # Block metadata service
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: backend
    ports:
    - protocol: TCP
      port: 8080
  - to: []  # Allow DNS
    ports:
    - protocol: UDP
      port: 53
---
# Backend Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: database
    ports:
    - protocol: TCP
      port: 5432
---
# Database Network Policy (most restrictive)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: database-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: backend
    ports:
    - protocol: TCP
      port: 5432`,
        explanation: 'These policies implement a three-tier architecture with frontend, backend, and database isolation.'
      },
      keyPoints: [
        'Controls network traffic between Pods and external endpoints',
        'Supports ingress and egress traffic rules',
        'Enables micro-segmentation for improved security',
        'Uses selectors to target specific Pods or namespaces',
        'Requires CNI plugin support for enforcement'
      ],
      quiz: [
        {
          question: 'What happens to Pod communication when no Network Policies are applied?',
          options: [
            'All communication is blocked',
            'All communication is allowed',
            'Only internal communication is allowed',
            'Only external communication is allowed'
          ],
          correct: 1,
          explanation: 'By default, when no Network Policies are applied, all Pod-to-Pod communication is allowed within the cluster.'
        },
        {
          question: 'What is required for Network Policies to be enforced?',
          options: [
            'Only the Network Policy resource',
            'A CNI plugin that supports Network Policies',
            'A special security controller',
            'Root access to nodes'
          ],
          correct: 1,
          explanation: 'Network Policies require a CNI (Container Network Interface) plugin that supports policy enforcement, such as Calico or Cilium.'
        }
      ]
    }
  },
  {
    id: 51,
    title: 'RBAC: Role-Based Access Control',
    description: 'Implementing fine-grained security and access control',
    duration: '19 min',
    difficulty: 'Advanced',
    category: 'Security',
    tags: ['rbac', 'security', 'access-control', 'permissions'],
    content: {
      introduction: 'RBAC provides fine-grained access control to Kubernetes resources based on user roles and permissions.',
      conceptExplanation: 'RBAC uses four main components: Roles (define permissions), RoleBindings (bind roles to subjects), ClusterRoles (cluster-wide permissions), and ClusterRoleBindings (cluster-wide bindings). This enables the principle of least privilege, where users and service accounts only have the minimum permissions needed for their tasks.',
      animation: {
        title: 'RBAC: Role-Based Access Control',
        description: 'Explaining how Role-Based Access Control serves as the primary authorization mechanism in Kubernetes, defining who can do what on which resources',
        scenes: [
          {
            title: 'The Problem - Uncontrolled Access',
            description: 'A "User A" (e.g., Developer) and "User B" (e.g., Administrator) both issue commands to the "Kubernetes API Server." User A accidentally deletes a "Production Deployment." A "Disaster!" icon appears.',
            duration: 4000
          },
          {
            title: 'Introducing RBAC - The Security Gatekeeper',
            description: 'An "RBAC" icon (a security gate or bouncer with a "Rulebook") appears between the Users/Service Accounts and the "Kubernetes API Server."',
            duration: 3000
          },
          {
            title: 'Core Components - Role',
            description: 'A "Role" icon (a "Job Description" paper). It defines permissions within a single namespace (e.g., "Developer Role in dev-namespace: get, list, watch Pods").',
            duration: 4000
          },
          {
            title: 'Core Components - ClusterRole',
            description: 'A "ClusterRole" icon (a "Global Job Description"). It defines permissions across the entire cluster (e.g., "Cluster Admin Role: * on * resources").',
            duration: 4000
          },
          {
            title: 'Core Components - RoleBinding',
            description: 'A "RoleBinding" icon (a "Link" or "Assignment" between a Person/SA and a Role). "User A" is linked to "Developer Role" in dev-namespace.',
            duration: 4000
          },
          {
            title: 'Core Components - ClusterRoleBinding',
            description: 'A "ClusterRoleBinding" icon (a "Global Link"). "User B" is linked to "Cluster Admin Role."',
            duration: 4000
          },
          {
            title: 'RBAC in Action',
            description: '"User A" tries to delete a "Pod" in the prod-namespace. RBAC checks "User A\'s" bindings. User A only has "Developer Role" in dev-namespace. RBAC blocks the action (red X). "User B" tries to create a "new ClusterRole." RBAC checks "User B\'s" bindings. User B has "Cluster Admin Role." RBAC allows the action (green check).',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Security," "Compliance," "Least Privilege." Benefits: "Strong Security," "Principle of Least Privilege," "Auditing."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A secure Kubernetes cluster where every action is authorized by RBAC, ensuring only the right people/apps do the right things. Benefits: "Authorization Control," "Security Enforcement," "Audit Trail."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'RBAC Configuration Example',
        code: `# Namespace-scoped Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: pod-manager
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "create", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "patch"]
---
# Bind Role to User
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-manager-binding
  namespace: development
subjects:
- kind: User
  name: developer@company.com
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: deployment-sa
  namespace: development
roleRef:
  kind: Role
  name: pod-manager
  apiGroup: rbac.authorization.k8s.io
---
# Cluster-wide Role
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
- apiGroups: [""]
  resources: ["nodes", "nodes/status"]
  verbs: ["get", "list"]
- apiGroups: ["metrics.k8s.io"]
  resources: ["nodes", "pods"]
  verbs: ["get", "list"]`,
        explanation: 'This RBAC setup provides namespace-scoped pod management permissions and cluster-wide node reading permissions.'
      },
      keyPoints: [
        'Implements principle of least privilege',
        'Supports namespace and cluster-wide permissions',
        'Controls access to API resources and operations',
        'Essential for multi-tenant cluster security',
        'Integrates with external identity providers'
      ],
      quiz: [
        {
          question: 'What is the difference between Role and ClusterRole?',
          options: [
            'Role is for users, ClusterRole is for service accounts',
            'Role is namespace-scoped, ClusterRole is cluster-wide',
            'Role is read-only, ClusterRole allows writes',
            'There is no difference'
          ],
          correct: 1,
          explanation: 'Role defines permissions within a specific namespace, while ClusterRole defines permissions across the entire cluster.'
        },
        {
          question: 'What happens if a user has no RBAC permissions for a resource?',
          options: [
            'They get read-only access',
            'They get default permissions',
            'Access is denied',
            'They get admin access'
          ],
          correct: 2,
          explanation: 'Without explicit RBAC permissions, access to Kubernetes resources is denied by default, following the principle of least privilege.'
        }
      ]
    }
  },
  {
    id: 52,
    title: 'Service Accounts: Pod Identity and Authentication',
    description: 'Managing Pod identity and API access for applications',
    duration: '16 min',
    difficulty: 'Intermediate',
    category: 'Security',
    tags: ['service-accounts', 'pod-identity', 'authentication', 'api-access'],
    content: {
      introduction: 'Service Accounts provide identity for Pods and enable applications to authenticate with the Kubernetes API.',
      conceptExplanation: 'Every Pod runs with a Service Account that determines its identity and API permissions. Service Accounts can be bound to RBAC roles to control what resources the Pod can access. They automatically mount authentication tokens that applications can use to make authenticated API calls. This is essential for applications that need to interact with Kubernetes resources.',
      animation: {
        title: 'Service Accounts: Pod Identity',
        description: 'Explaining how Service Accounts provide identity for Pods and their processes, enabling them to authenticate and authorize with the Kubernetes API and other services',
        scenes: [
          {
            title: 'The Problem - Pods Need Identity',
            description: 'A "Pod" icon wants to interact with the "Kubernetes API Server" (e.g., kubectl get pods). It also wants to access an "External Service" (e.g., Cloud Database). A "Who am I?" thought bubble appears over the Pod.',
            duration: 4000
          },
          {
            title: 'Introducing Service Account - The Pod\'s Identity Card',
            description: 'A "Service Account" icon (an "ID Card" or "Persona" symbol) appears. By default, every Pod gets a default service account in its namespace.',
            duration: 3000
          },
          {
            title: 'Automatic Mount of Token',
            description: 'The "Service Account Token" (a small key icon) is automatically "mounted" into the Pod\'s container at a specific path (e.g., /var/run/secrets/kubernetes.io/serviceaccount/token). The container process uses this token.',
            duration: 4000
          },
          {
            title: 'Authenticating to Kubernetes API',
            description: 'The "Pod" (using its mounted token) sends a request to the "Kubernetes API Server." The API Server validates the token and the Pod\'s identity.',
            duration: 4000
          },
          {
            title: 'Authorization (via RBAC)',
            description: 'The API Server then checks "Role-Based Access Control (RBAC)" rules to see what the Service Account is allowed to do (e.g., "read ConfigMaps").',
            duration: 4000
          },
          {
            title: 'Custom Service Accounts',
            description: 'A "Developer" creates a new my-app-sa Service Account. A Pod\'s YAML specifies serviceAccountName: my-app-sa. This Pod now uses the custom SA, not the default.',
            duration: 4000
          },
          {
            title: 'Use Cases (Beyond API)',
            description: 'The Pod\'s SA identity can be used to integrate with "Cloud IAM" (e.g., AWS IAM Roles for Service Accounts) or other external systems.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Least Privilege," "Auditing," "Clear Separation." Benefits: Least Privilege, Granular Access Control.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A Pod operating confidently within the cluster, its identity clear and its permissions defined by its Service Account.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Service Account Configuration',
        code: `# Custom Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
  namespace: production
automountServiceAccountToken: true
---
# Role for Service Account
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: configmap-reader
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
---
# Bind Role to Service Account
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-configmap-reader
  namespace: production
subjects:
- kind: ServiceAccount
  name: app-service-account
  namespace: production
roleRef:
  kind: Role
  name: configmap-reader
  apiGroup: rbac.authorization.k8s.io
---
# Pod using Service Account
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
  namespace: production
spec:
  serviceAccountName: app-service-account
  containers:
  - name: app
    image: myapp:v1.0
    env:
    - name: KUBERNETES_NAMESPACE
      valueFrom:
        fieldRef:
          fieldPath: metadata.namespace
    volumeMounts:
    - name: token
      mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      readOnly: true`,
        explanation: 'This configuration creates a Service Account with ConfigMap reading permissions and assigns it to a Pod.'
      },
      keyPoints: [
        'Provides identity and authentication for Pods',
        'Enables applications to access Kubernetes API',
        'Works with RBAC for fine-grained permissions',
        'Automatically mounts authentication tokens',
        'Essential for Kubernetes-native applications'
      ],
      quiz: [
        {
          question: 'What happens if a Pod doesn\'t specify a Service Account?',
          options: [
            'The Pod fails to start',
            'The Pod uses the default Service Account',
            'The Pod runs without any identity',
            'The Pod gets admin permissions'
          ],
          correct: 1,
          explanation: 'If no Service Account is specified, the Pod automatically uses the "default" Service Account in its namespace.'
        },
        {
          question: 'How do applications in Pods authenticate with the Kubernetes API?',
          options: [
            'Using username and password',
            'Using the automatically mounted Service Account token',
            'Using SSH keys',
            'Using certificates only'
          ],
          correct: 1,
          explanation: 'Applications use the Service Account token that is automatically mounted in the Pod to authenticate with the Kubernetes API.'
        }
      ]
    }
  },
  {
    id: 53,
    title: 'Monitoring: Metrics Server and Resource Usage',
    description: 'Collecting and analyzing cluster and Pod resource metrics',
    duration: '17 min',
    difficulty: 'Intermediate',
    category: 'Observability',
    tags: ['monitoring', 'metrics-server', 'resource-usage', 'observability'],
    content: {
      introduction: 'Metrics Server collects resource usage data from nodes and Pods, enabling monitoring and autoscaling decisions.',
      conceptExplanation: 'Metrics Server is a cluster-wide aggregator of resource usage data that collects CPU and memory metrics from kubelets. It provides the foundation for horizontal Pod autoscaling, vertical Pod autoscaling, and kubectl top commands. The metrics are stored in memory and provide real-time resource usage information for monitoring and scaling decisions.',
      animation: {
        title: 'Metrics Server and Resource Usage Flow',
        description: 'Complete flow of metrics data from nodes and Pods through Kubelet to Metrics Server and its consumption by various Kubernetes components',
        scenes: [
          {
            title: 'Data Collection at Node/Pod Level',
            description: 'Kubelet acts as local agent, constantly observing and collecting CPU/Memory usage data from Pods and node. Small data packets flow from Pods to Kubelet.',
            duration: 4000
          },
          {
            title: 'Metrics Server - The Aggregator',
            description: 'Metrics Server Pod in kube-system namespace receives data from all Kubelets. Aggregates resource data and makes it available via standardized API endpoint.',
            duration: 4000
          },
          {
            title: 'HPA Consumption - Scaling Pods',
            description: 'HPA queries Metrics Server for Pod CPU utilization. When CPU goes high, HPA compares to target threshold and instructs Deployment to scale up with new Pods.',
            duration: 4000
          },
          {
            title: 'VPA Consumption - Right-Sizing Pods',
            description: 'VPA queries Metrics Server for Pod CPU/Memory usage history. Analyzes usage patterns and recommends or applies new Resource Requests & Limits.',
            duration: 4000
          },
          {
            title: 'kubectl top - Command-Line Visibility',
            description: 'User types kubectl top pod/node commands. Commands send requests to Metrics Server which responds with real-time CPU and Memory usage data.',
            duration: 4000
          },
          {
            title: 'Internal API and Data Flow',
            description: 'Complete flow diagram: Kubelet → Metrics Server (API) ← HPA, VPA, kubectl top. Metrics Server serves as core component for resource visibility.',
            duration: 3000
          },
          {
            title: 'Importance and Benefits',
            description: 'Crucial for Performance Tuning, Cost Optimization, Troubleshooting. Enables monitoring, autoscaling, and resource optimization.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Metrics Server Deployment and Usage',
        code: `# Metrics Server Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metrics-server
  namespace: kube-system
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      serviceAccountName: metrics-server
      containers:
      - name: metrics-server
        image: k8s.gcr.io/metrics-server/metrics-server:v0.6.1
        args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
        resources:
          requests:
            cpu: 100m
            memory: 200Mi
        ports:
        - containerPort: 4443
          name: https
          protocol: TCP
        securityContext:
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
---
# Check resource usage
# kubectl top nodes
# kubectl top pods
# kubectl top pods --containers
# kubectl top pods --sort-by=cpu`,
        explanation: 'This shows Metrics Server deployment and common commands for viewing resource usage across the cluster.'
      },
      keyPoints: [
        'Collects CPU and memory usage from nodes and Pods',
        'Enables kubectl top commands for resource monitoring',
        'Provides metrics for HPA and VPA autoscaling',
        'Stores metrics in memory for real-time access',
        'Essential foundation for cluster observability'
      ],
      quiz: [
        {
          question: 'What type of metrics does Metrics Server collect?',
          options: [
            'Only CPU metrics',
            'CPU and memory usage metrics',
            'Network and storage metrics',
            'Application-specific metrics'
          ],
          correct: 1,
          explanation: 'Metrics Server collects CPU and memory usage metrics from nodes and Pods, which are the core resource metrics for autoscaling.'
        },
        {
          question: 'How long does Metrics Server store historical data?',
          options: [
            'Forever',
            'One week',
            'It only stores current metrics in memory',
            'One month'
          ],
          correct: 2,
          explanation: 'Metrics Server only stores current resource usage data in memory and does not provide historical metrics storage.'
        }
      ]
    }
  },
  {
    id: 54,
    title: 'Logging: Container Logs and Centralized Collection',
    description: 'Managing application logs and implementing centralized logging',
    duration: '18 min',
    difficulty: 'Intermediate',
    category: 'Observability',
    tags: ['logging', 'container-logs', 'centralized-logging', 'troubleshooting'],
    content: {
      introduction: 'Container logging in Kubernetes involves collecting, storing, and analyzing logs from applications running in Pods.',
      conceptExplanation: 'Kubernetes automatically captures stdout and stderr from containers and stores them on nodes. For production environments, centralized logging solutions like ELK stack (Elasticsearch, Logstash, Kibana) or EFK stack (Elasticsearch, Fluentd, Kibana) are used to aggregate logs from all nodes. This enables log analysis, troubleshooting, and compliance across the entire cluster.',
      animation: {
        title: 'Container Logs and Centralized Collection',
        description: 'Complete flow of how container logs are generated, captured by Kubernetes, and collected using centralized logging stack',
        scenes: [
          {
            title: 'Log Generation (stdout/stderr)',
            description: 'Container applications print messages like "INFO: User logged in" and "ERROR: Database connection failed" to stdout and stderr streams.',
            duration: 4000
          },
          {
            title: 'Kubelet Log Capture',
            description: 'Kubelet on Worker Node intercepts stdout/stderr streams and writes logs to host filesystem (/var/log/pods/, /var/log/containers/). Log lines accumulate in these files.',
            duration: 4000
          },
          {
            title: 'Basic Log Access (kubectl logs)',
            description: 'User types kubectl logs <pod-name>. Command talks to Kubelet via API Server to fetch log content from node files. Log lines appear in terminal.',
            duration: 4000
          },
          {
            title: 'Centralized Log Collection - Log Agent',
            description: 'Log Agent Pod (Fluentd/Fluent Bit daemonset) deployed on each Worker Node. Agent mounts host log directory and continuously tails log files.',
            duration: 4000
          },
          {
            title: 'Log Processing & Forwarding',
            description: 'Log Agent processes raw logs: Parsing (extracts timestamps, levels), Enrichment (adds Pod name, Namespace, Labels), Filtering (removes noise). Processed data flows to centralized system.',
            duration: 4000
          },
          {
            title: 'Centralized Logging System (ELK/EFK)',
            description: 'ELK/EFK stack: Elasticsearch stores logs, Kibana provides web UI for searching and visualization with dashboards and graphs.',
            duration: 4000
          },
          {
            title: 'Log Analysis & Alerting',
            description: 'User uses Kibana dashboard to search for ERROR messages across all Pods. Alerts triggered based on specific log patterns.',
            duration: 3000
          },
          {
            title: 'Benefits',
            description: 'Enables faster troubleshooting, auditing, performance monitoring, and observability across entire cluster.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Logging Configuration and Best Practices',
        code: `# Application with structured logging
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
        image: nginx:1.20
        ports:
        - containerPort: 80
        # Configure log format
        env:
        - name: LOG_LEVEL
          value: "INFO"
        - name: LOG_FORMAT
          value: "json"
        # Resource limits for log storage
        resources:
          limits:
            ephemeral-storage: 1Gi
---
# Fluentd DaemonSet for log collection
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      serviceAccountName: fluentd
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
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
          path: /var/lib/docker/containers
---
# View logs commands
# kubectl logs pod-name
# kubectl logs -f deployment/web-app
# kubectl logs pod-name --previous`,
        explanation: 'This shows application logging configuration and Fluentd DaemonSet for centralized log collection.'
      },
      keyPoints: [
        'Kubernetes captures container stdout/stderr automatically',
        'Centralized logging enables cluster-wide log analysis',
        'Log agents like Fluentd collect logs from all nodes',
        'Structured logging improves searchability and analysis',
        'Essential for troubleshooting and compliance'
      ],
      quiz: [
        {
          question: 'Where does Kubernetes store container logs by default?',
          options: [
            'In a central database',
            'On the node where the Pod runs',
            'In cloud storage',
            'In memory only'
          ],
          correct: 1,
          explanation: 'By default, Kubernetes stores container logs on the node where the Pod is running, typically in /var/log/pods/.'
        },
        {
          question: 'What happens to logs when a Pod is deleted?',
          options: [
            'Logs are automatically backed up',
            'Logs are lost unless collected by a centralized system',
            'Logs are moved to persistent storage',
            'Logs are kept for 30 days'
          ],
          correct: 1,
          explanation: 'When a Pod is deleted, its logs are also lost unless they have been collected and stored by a centralized logging system.'
        }
      ]
    }
  },
  {
    id: 55,
    title: 'Troubleshooting: Common Issues and Debugging',
    description: 'Diagnosing and resolving common Kubernetes problems',
    duration: '20 min',
    difficulty: 'Advanced',
    category: 'Troubleshooting',
    tags: ['troubleshooting', 'debugging', 'problem-solving', 'diagnostics'],
    content: {
      introduction: 'Effective troubleshooting in Kubernetes requires understanding common failure patterns and diagnostic techniques.',
      conceptExplanation: 'Kubernetes troubleshooting involves systematic diagnosis of issues across multiple layers: application, Pod, Service, Node, and cluster levels. Common issues include image pull failures, resource constraints, networking problems, and configuration errors. Key diagnostic tools include kubectl describe, logs, events, and resource monitoring.',
      animation: {
        title: 'Troubleshooting Common Kubernetes Issues (Overview)',
        description: 'Providing a quick guide to common troubleshooting steps and tools for various Kubernetes resource issues',
        scenes: [
          {
            title: 'Issue: Pod Not Starting/Crashing',
            description: 'A "Pod" icon showing "Pending" or "CrashLoopBackOff" status (red X). User types kubectl describe pod <pod-name>. Output shows "Events" (red text). User types kubectl logs <pod-name>. Output shows "Application Logs." User types kubectl logs --previous <pod-name>. User types kubectl exec <pod-name> -- ls /app (checking files).',
            duration: 5000
          },
          {
            title: 'Issue: Application Not Accessible',
            description: 'A "User" trying to access a "Service" but getting "Connection Refused" or "Timeout." User types kubectl get svc <svc-name>. Check "IP" and "Ports." User types kubectl get ep <svc-name>. Check "Endpoints" (list of Pod IPs). If empty, implies no ready Pods. User types kubectl describe pod <pod-name>. Check "Readiness Probe" status. User types kubectl get ingress <ingress-name>. Check "Rules" and "Address."',
            duration: 5000
          },
          {
            title: 'Issue: Pods Pending (Not Scheduling)',
            description: 'Many "Pod" icons stuck in "Pending" state, floating above nodes. User types kubectl describe pod <pod-name>. Check "Events" for "FailedScheduling." User types kubectl get nodes. Check "Node Status" (Ready/NotReady) and "Resource Usage." Check "Resource Requests" vs. "Node Capacity." Check "Taints & Tolerations," "Node Selectors/Affinity," "Resource Quotas."',
            duration: 5000
          },
          {
            title: 'Issue: DNS Resolution Problems',
            description: 'A "Pod" trying to connect to a "Service" by name, failing. DNS server icon with a red X. User types kubectl exec <pod-name> -- nslookup <service-name>. Check "CoreDNS Pods" status in kube-system namespace. Check "Service IP" of CoreDNS.',
            duration: 4000
          },
          {
            title: 'General Troubleshooting Tools & Mindset',
            description: 'A "Magnifying Glass" icon. Icons for "Start Small," "Isolate," "Check Events," "Check Logs." Tools: kubectl describe, kubectl get, kubectl logs, kubectl exec. Key Tools: "kubectl describe," "logs," "exec."',
            duration: 4000
          },
          {
            title: 'Conclusion',
            description: 'A "Human Operator" confidently resolving issues using their kubectl toolkit. Benefits: "Systematic Approach," "Diagnostic Tools," "Problem Resolution."',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Troubleshooting Commands and Techniques',
        code: `# Essential troubleshooting commands
# Check Pod status and events
kubectl get pods -o wide
kubectl describe pod <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp

# Check logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl logs -f deployment/<deployment-name>

# Check resource usage
kubectl top nodes
kubectl top pods
kubectl describe node <node-name>

# Network troubleshooting
kubectl get svc
kubectl describe svc <service-name>
kubectl get endpoints <service-name>

# Debug Pod with temporary container
kubectl run debug-pod --image=busybox --rm -it -- sh

# Common troubleshooting scenarios
---
# Pod stuck in Pending state
apiVersion: v1
kind: Pod
metadata:
  name: debug-pending
spec:
  containers:
  - name: app
    image: nginx:1.20
    resources:
      requests:
        memory: "64Gi"  # Too much memory - will cause Pending
        cpu: "32"       # Too much CPU - will cause Pending
---
# Pod with ImagePullBackOff
apiVersion: v1
kind: Pod
metadata:
  name: debug-image-pull
spec:
  containers:
  - name: app
    image: nonexistent-image:latest  # Will cause ImagePullBackOff
---
# Pod with CrashLoopBackOff
apiVersion: v1
kind: Pod
metadata:
  name: debug-crash-loop
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "exit 1"]  # Will cause CrashLoopBackOff`,
        explanation: 'These examples show common troubleshooting commands and scenarios that cause typical Kubernetes issues.'
      },
      keyPoints: [
        'Systematic approach to problem diagnosis',
        'Understanding common failure patterns',
        'Using kubectl commands for data collection',
        'Analyzing logs, events, and resource usage',
        'Network and service connectivity troubleshooting'
      ],
      quiz: [
        {
          question: 'What is the first step when a Pod is stuck in Pending state?',
          options: [
            'Restart the Pod',
            'Check kubectl describe pod for events and resource requirements',
            'Delete and recreate the Pod',
            'Check the application logs'
          ],
          correct: 1,
          explanation: 'When a Pod is Pending, use kubectl describe pod to check events and resource requirements, as this usually indicates scheduling issues.'
        },
        {
          question: 'What does CrashLoopBackOff status indicate?',
          options: [
            'The Pod cannot be scheduled',
            'The container image cannot be pulled',
            'The container starts but keeps crashing',
            'The Pod has network issues'
          ],
          correct: 2,
          explanation: 'CrashLoopBackOff indicates that the container starts successfully but then crashes repeatedly, causing Kubernetes to restart it with increasing delays.'
        }
      ]
    }
  },
  {
    id: 56,
    title: 'Best Practices: Production-Ready Deployments',
    description: 'Implementing production best practices for reliability and security',
    duration: '22 min',
    difficulty: 'Expert',
    category: 'Best Practices',
    tags: ['best-practices', 'production', 'reliability', 'security'],
    content: {
      introduction: 'Production Kubernetes deployments require careful attention to security, reliability, performance, and operational practices.',
      conceptExplanation: 'Production-ready Kubernetes involves multiple layers of best practices: resource management, security hardening, monitoring, backup strategies, and operational procedures. Key areas include proper resource limits, health checks, security contexts, network policies, RBAC, and disaster recovery planning.',
      animation: {
        title: 'Kubernetes in Production: Best Practices',
        description: 'Highlighting critical considerations and best practices for running Kubernetes workloads in a production environment',
        scenes: [
          {
            title: 'From Dev to Prod',
            description: 'A "Dev Environment" (simple, few components) transforming into a "Production Environment" (complex, robust, with many safeguards).',
            duration: 4000
          },
          {
            title: 'High Availability & Resiliency',
            description: '"Control Plane" components spread across multiple "Availability Zones." "Worker Nodes" distributed. "Pod Anti-Affinity" ensuring replicas are on different nodes.',
            duration: 4000
          },
          {
            title: 'Robust Storage Strategy',
            description: '"Persistent Volumes" backed by highly available, replicated storage (e.g., cloud block storage, shared file systems). "Volume Snapshots" for backups.',
            duration: 4000
          },
          {
            title: 'Scalability & Performance',
            description: '"HPA" scaling Pods, "VPA" right-sizing Pods, "Cluster Autoscaler" scaling Nodes. Load on the application is handled smoothly.',
            duration: 4000
          },
          {
            title: 'Comprehensive Observability',
            description: '"Metrics" flowing to Prometheus/Grafana. "Logs" flowing to a central logging system. "Traces" flowing to Jaeger. All feeding into a "Monitoring Dashboard."',
            duration: 4000
          },
          {
            title: 'Strong Security Posture',
            description: '"RBAC" protecting access. "Network Policies" controlling traffic. "Secrets Management." "Image Scanning."',
            duration: 4000
          },
          {
            title: 'GitOps & CI/CD for Deployments',
            description: '"Git" as the source of truth, feeding into "GitOps Operator" (Flux/Argo CD) for automated deployments. "CI/CD Pipeline" building images and pushing to Git.',
            duration: 4000
          },
          {
            title: 'Regular Maintenance & Upgrades',
            description: 'Icons for "Kubernetes Upgrades," "Node Patching," "Application Updates."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A thriving, stable, and secure production Kubernetes environment.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'Production-Ready Deployment Template',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-app
  labels:
    app: production-app
    version: v1.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: production-app
  template:
    metadata:
      labels:
        app: production-app
        version: v1.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
    spec:
      serviceAccountName: production-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: app
        image: myapp:v1.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        - containerPort: 9090
          name: metrics
        env:
        - name: LOG_LEVEL
          value: "INFO"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - production-app
              topologyKey: kubernetes.io/hostname`,
        explanation: 'This production-ready deployment includes security contexts, resource limits, health checks, and anti-affinity rules.'
      },
      keyPoints: [
        'Implement comprehensive security measures',
        'Use proper resource limits and health checks',
        'Enable monitoring and logging',
        'Plan for high availability and disaster recovery',
        'Follow operational best practices'
      ],
      quiz: [
        {
          question: 'Why should production containers run as non-root users?',
          options: [
            'Better performance',
            'Reduced security risk if container is compromised',
            'Easier debugging',
            'Lower resource usage'
          ],
          correct: 1,
          explanation: 'Running containers as non-root users reduces security risk by limiting the potential damage if a container is compromised.'
        },
        {
          question: 'What is the purpose of pod anti-affinity rules?',
          options: [
            'Improve performance',
            'Reduce costs',
            'Distribute pods across different nodes for high availability',
            'Simplify networking'
          ],
          correct: 2,
          explanation: 'Pod anti-affinity rules ensure that replicas of the same application are distributed across different nodes, improving availability and fault tolerance.'
        }
      ]
    }
  },
  {
    id: 57,
    title: 'Cluster Maintenance: Updates and Backup Strategies',
    description: 'Managing cluster lifecycle, updates, and disaster recovery',
    duration: '19 min',
    difficulty: 'Expert',
    category: 'Operations',
    tags: ['cluster-maintenance', 'updates', 'backup', 'disaster-recovery'],
    content: {
      introduction: 'Cluster maintenance involves regular updates, backup strategies, and disaster recovery planning for production Kubernetes environments.',
      conceptExplanation: 'Effective cluster maintenance includes Kubernetes version upgrades, node maintenance, etcd backups, and disaster recovery procedures. This requires careful planning to minimize downtime, ensure data protection, and maintain cluster security through regular updates.',
      animation: {
        title: 'Cluster Maintenance: Updates and Backup Strategies',
        description: 'Detailed processes of etcd backups, rolling cluster upgrades, and node maintenance for Kubernetes cluster',
        scenes: [
          {
            title: 'Importance of Backup - Disaster Strikes',
            description: 'Kubernetes Control Plane with API Server and etcd surrounded by Worker Nodes. Disaster icon hits etcd database causing data corruption. Whole cluster goes red and unresponsive.',
            duration: 4000
          },
          {
            title: 'etcd Backup Procedure',
            description: 'Operator runs "etcdctl snapshot save /backup/snapshot.db". Data flows from etcd to secure Backup Storage (S3 bucket, NFS). Emphasizes regular, automated backups.',
            duration: 4000
          },
          {
            title: 'Cluster Upgrade - The Challenge',
            description: 'Kubernetes Cluster running v1.28. New Version v1.29 appears. Challenge is upgrading without downtime for new features and security patches.',
            duration: 4000
          },
          {
            title: 'Rolling Control Plane Upgrade',
            description: 'Multiple Master Nodes (Control Plane instances). One by one, each Master goes offline for upgrade, then returns with new version. API Server remains available with traffic shifting to healthy masters.',
            duration: 4000
          },
          {
            title: 'Rolling Worker Node Upgrade',
            description: 'Worker Nodes with Pods. Step A: kubectl drain moves Pods to other nodes, node becomes Tainted. Step B: Node upgraded in-place or replaced. Step C: kubectl uncordon makes node available again.',
            duration: 5000
          },
          {
            title: 'Disaster Recovery Workflow',
            description: 'After disaster: New empty etcd cluster provisioned, latest snapshot restored, Control Plane components rebuilt, Worker Nodes rejoin. Cluster back online.',
            duration: 4000
          },
          {
            title: 'Automation & Tools',
            description: 'Icons for Kubespray, Kubeadm, Cloud Provider Managed K8s (EKS, GKE, AKS). Automate with tools and managed services.',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'Resilient Kubernetes cluster capable of withstanding failures and undergoing seamless updates. Maintenance crucial for production reliability.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Cluster Maintenance Procedures',
        code: `# etcd backup script
#!/bin/bash
ETCDCTL_API=3 etcdctl snapshot save backup.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \\
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# Verify backup
ETCDCTL_API=3 etcdctl --write-out=table snapshot status backup.db

# Node maintenance procedure
# 1. Drain node safely
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 2. Perform maintenance (OS updates, hardware changes, etc.)

# 3. Uncordon node
kubectl uncordon <node-name>

---
# PodDisruptionBudget for safe updates
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: critical-app
---
# Cluster upgrade checklist
# 1. Backup etcd
# 2. Update control plane components
# 3. Update worker nodes (rolling update)
# 4. Update CNI and other add-ons
# 5. Verify cluster functionality

# Velero backup configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: velero-config
  namespace: velero
data:
  cloud-provider: aws
  backup-location: s3://my-backup-bucket
  volume-snapshot-location: aws://us-west-2`,
        explanation: 'This shows essential cluster maintenance procedures including etcd backups, node maintenance, and disaster recovery tools.'
      },
      keyPoints: [
        'Regular etcd backups are critical for disaster recovery',
        'Use PodDisruptionBudgets to ensure availability during updates',
        'Plan rolling updates to minimize service disruption',
        'Test backup and recovery procedures regularly',
        'Maintain security through timely updates'
      ],
      quiz: [
        {
          question: 'What is the most critical component to backup in a Kubernetes cluster?',
          options: [
            'Application logs',
            'etcd database',
            'Container images',
            'Node configurations'
          ],
          correct: 1,
          explanation: 'The etcd database contains all cluster state and configuration data, making it the most critical component to backup for disaster recovery.'
        },
        {
          question: 'What does kubectl drain do during node maintenance?',
          options: [
            'Deletes all pods on the node',
            'Safely evicts pods and prevents new scheduling',
            'Shuts down the node',
            'Backs up node data'
          ],
          correct: 1,
          explanation: 'kubectl drain safely evicts pods from a node and marks it as unschedulable, allowing for safe maintenance without service disruption.'
        }
      ]
    }
  },
  {
    id: 58,
    title: 'Advanced Patterns: GitOps and Infrastructure as Code',
    description: 'Implementing modern deployment patterns and infrastructure automation',
    duration: '21 min',
    difficulty: 'Expert',
    category: 'Advanced Patterns',
    tags: ['gitops', 'infrastructure-as-code', 'automation', 'modern-patterns'],
    content: {
      introduction: 'GitOps and Infrastructure as Code represent modern approaches to managing Kubernetes deployments and infrastructure through declarative configuration.',
      conceptExplanation: 'GitOps uses Git repositories as the single source of truth for declarative infrastructure and applications. Tools like ArgoCD and Flux automatically sync cluster state with Git repositories. Infrastructure as Code (IaC) tools like Terraform and Pulumi manage cluster provisioning and configuration through code, enabling version control, peer review, and automated deployment pipelines.',
      animation: {
        title: 'GitOps (Flux/Argo CD): Automated Deployments',
        description: 'Explaining GitOps as a methodology for continuous delivery that uses Git as the single source of truth for declarative infrastructure and applications, enabling automated deployments with tools like Flux or Argo CD',
        scenes: [
          {
            title: 'The Problem - Manual/Scripted Deployments',
            description: 'A "Developer" commits code to "Git Repository." Then, they manually run kubectl apply commands or custom scripts to deploy to "Kubernetes Cluster." Or a "CI/CD Pipeline" pushes directly to the cluster. A "Discrepancy" icon (mismatch) between "Git State" and "Cluster State." It\'s hard to track who changed what, when.',
            duration: 4000
          },
          {
            title: 'Introducing GitOps - Git as the Source of Truth',
            description: 'A "Git Repository" (the central Git tree) is highlighted as the "Single Source of Truth." All desired cluster states (YAMLs) live here.',
            duration: 3000
          },
          {
            title: 'The GitOps Operator (Flux/Argo CD)',
            description: 'A "GitOps Operator" (e.g., Flux or Argo CD robot) is deployed inside the Kubernetes cluster.',
            duration: 3000
          },
          {
            title: 'The Pull-Based Deployment Model',
            description: 'Step A: "Developer" commits an update (e.g., image: v2) to the "Git Repository." Step B: The "GitOps Operator" continuously "pulls" and "monitors" the Git Repository. It detects the change. Step C: The "GitOps Operator" compares the "Desired State" (from Git) with the "Actual State" (in the cluster). Step D: The "GitOps Operator" then issues the necessary kubectl apply commands internally to bring the cluster\'s state into alignment with Git.',
            duration: 5000
          },
          {
            title: 'Rollback via Git',
            description: 'If a problem occurs, the "Developer" simply reverts the commit in "Git." The "GitOps Operator" detects this and automatically rolls back the cluster to the previous state.',
            duration: 4000
          },
          {
            title: 'Benefits',
            description: 'Icons for "Automation," "Auditability," "Security," "Reliability."',
            duration: 3000
          },
          {
            title: 'Conclusion',
            description: 'A seamless, automated deployment pipeline where Git is the central control point, and the GitOps operator ensures the cluster always reflects the desired state.',
            duration: 2000
          }
        ]
      },
      yamlExample: {
        title: 'GitOps and IaC Configuration',
        code: `# ArgoCD Application for GitOps
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/k8s-manifests
    targetRevision: main
    path: production/
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
# Kustomization for environment-specific configs
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ../../base
patchesStrategicMerge:
- deployment-patch.yaml
- service-patch.yaml
images:
- name: myapp
  newTag: v1.2.3
replicas:
- name: web-app
  count: 5
---
# Terraform for cluster provisioning
# main.tf
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = "1.24"

  vpc_config {
    subnet_ids = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy,
  ]
}

# Helm chart values for GitOps
# values.yaml
replicaCount: 3
image:
  repository: myapp
  tag: "v1.2.3"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
  - host: app.example.com
    paths:
    - path: /
      pathType: Prefix`,
        explanation: 'This shows GitOps configuration with ArgoCD, Kustomize for environment management, and Terraform for infrastructure provisioning.'
      },
      keyPoints: [
        'Git as single source of truth for infrastructure',
        'Automated deployment and synchronization',
        'Infrastructure as Code for reproducible environments',
        'Declarative configuration management',
        'Enhanced security through pull-based deployments'
      ],
      quiz: [
        {
          question: 'What is the main principle of GitOps?',
          options: [
            'Manual deployment processes',
            'Git repository as single source of truth',
            'Direct cluster access for deployments',
            'Push-based deployment model'
          ],
          correct: 1,
          explanation: 'GitOps uses Git repositories as the single source of truth, with automated systems pulling and applying changes to maintain desired state.'
        },
        {
          question: 'What advantage does Infrastructure as Code provide?',
          options: [
            'Faster application performance',
            'Version control and reproducible infrastructure',
            'Lower infrastructure costs',
            'Simplified application development'
          ],
          correct: 1,
          explanation: 'Infrastructure as Code enables version control, peer review, and reproducible infrastructure deployments through declarative configuration files.'
        }
      ]
    }
  },
  {
    id: 59,
    title: 'Namespaces: Logical Isolation',
    description: 'Understanding Kubernetes namespaces for resource organization and multi-tenancy',
    duration: '14 min',
    difficulty: 'Beginner',
    category: 'Core Concepts',
    tags: ['namespaces', 'isolation', 'multi-tenancy', 'organization'],
    content: {
      introduction: 'Namespaces provide logical isolation of resources within a single Kubernetes cluster, enabling multi-tenancy and better organization.',
      conceptExplanation: 'Namespaces are virtual partitions within a Kubernetes cluster that allow you to organize resources, prevent naming conflicts, and implement access control. They enable multiple teams or applications to share the same cluster while maintaining isolation. Each namespace provides a scope for names, meaning resources with the same name can exist in different namespaces without conflict.',
      animation: {
        title: 'Namespaces: Logical Isolation',
        description: 'Technical demonstration of how Namespaces provide logical isolation of resources within a single cluster, enabling multi-tenancy and better organization',
        scenes: [
          {
            title: 'The Problem - A Single, Chaotic Cluster',
            description: 'A single, large Kubernetes Cluster boundary. Inside, Pods, Deployments, and Services for App A (Dev), App B (Prod), Monitoring Tools are all mixed together, creating a mess. Name Conflicts (two web-app deployments) are shown. Security Risk! is flashing.',
            duration: 4000
          },
          {
            title: 'Introducing Namespaces - The Virtual Partitions',
            description: 'The Kubernetes Cluster boundary. Three distinct, transparent Namespace boxes appear within it: default, dev, prod, kube-system. Each is a logical partition.',
            duration: 4000
          },
          {
            title: 'Resource Scoping & Organization',
            description: 'App A Dev Pods/Deployments move into the dev Namespace box. App B Prod Pods/Deployments move into the prod Namespace box. Monitoring Tools move into monitoring (new namespace). Core Kubernetes components go into kube-system. Each namespace box now looks neat and organized.',
            duration: 4000
          },
          {
            title: 'Name Uniqueness within Namespace',
            description: 'Inside dev Namespace, there\'s a web-app Deployment. Inside prod Namespace, there\'s also a web-app Deployment. Both are valid because they are in different namespaces.',
            duration: 4000
          },
          {
            title: 'Multi-Tenancy & Access Control (RBAC Integration)',
            description: 'A Dev User tries to access Pods in the prod Namespace (red X). A Prod User successfully accesses Pods in prod (green check). This is enforced by RBAC rules tied to Namespaces.',
            duration: 4000
          },
          {
            title: 'Default Namespace & --namespace Flag',
            description: 'A User types kubectl get pods. It implicitly queries the default Namespace. User types kubectl get pods --namespace dev. It explicitly queries the dev Namespace.',
            duration: 4000
          },
          {
            title: 'Resource Isolation (Networking)',
            description: 'Show a Network Policy applied to the prod namespace, blocking traffic from dev. Pods in dev cannot talk to Pods in prod unless explicitly allowed.',
            duration: 3000
          }
        ]
      },
      yamlExample: {
        title: 'Namespace Creation and Resource Organization',
        code: `# Create development namespace
apiVersion: v1
kind: Namespace
metadata:
  name: development
  labels:
    environment: dev
    team: frontend
---
# Create production namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    environment: prod
    team: frontend
---
# Deploy application to specific namespace
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: development
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
        image: nginx:1.21
        ports:
        - containerPort: 80
---
# Service in the same namespace
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: development
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP`,
        explanation: 'This example shows how to create namespaces and deploy resources to specific namespaces, enabling organization and isolation.'
      },
      keyPoints: [
        'Provide logical isolation within a single cluster',
        'Enable multi-tenancy and resource organization',
        'Prevent naming conflicts between teams/applications',
        'Integrate with RBAC for access control',
        'Support resource quotas and limits per namespace'
      ],
      quiz: [
        {
          question: 'What is the primary purpose of Kubernetes Namespaces?',
          options: [
            'To provide physical isolation between applications',
            'To enable logical isolation and organization of resources',
            'To improve application performance',
            'To reduce cluster resource usage'
          ],
          correct: 1,
          explanation: 'Namespaces provide logical isolation within a single cluster, enabling better organization and multi-tenancy without requiring separate physical clusters.'
        },
        {
          question: 'Can two Deployments have the same name in a Kubernetes cluster?',
          options: [
            'No, names must be unique across the entire cluster',
            'Yes, if they are in different namespaces',
            'Yes, if they have different labels',
            'Only if they are in the same namespace'
          ],
          correct: 1,
          explanation: 'Resource names only need to be unique within a namespace, so two Deployments can have the same name if they are in different namespaces.'
        },
        {
          question: 'What happens when you run kubectl get pods without specifying a namespace?',
          options: [
            'It shows pods from all namespaces',
            'It shows pods from the default namespace',
            'It returns an error',
            'It shows pods from the kube-system namespace'
          ],
          correct: 1,
          explanation: 'When no namespace is specified, kubectl commands operate on the default namespace unless configured otherwise.'
        }
      ]
    }
  }
];

export const lessonCategories = [
  'Fundamentals',
  'Core Concepts',
  'Architecture',
  'Workloads',
  'Networking',
  'Storage',
  'Security',
  'Monitoring',
  'Advanced'
];

export default lessons;
