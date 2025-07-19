export interface CloudScenario {
  id: string;
  title: string;
  prompt: string;
  level: 'beginner' | 'intermediate' | 'expert';
  provider: 'aws' | 'azure' | 'gcp' | 'multi-cloud' | 'hybrid';
  category: 'web-hosting' | 'serverless' | 'containers' | 'data' | 'ml-ai' | 'security' | 'devops' | 'iot' | 'enterprise';
  services: string[];
  architecture: string;
  exportFormats: string[];
  estimatedTime: string;
  costLevel: 'low' | 'medium' | 'high';
  tags: string[];
  description: string;
}

export const cloudScenarios: CloudScenario[] = [
  // BEGINNER SCENARIOS
  {
    id: 'aws-static-website',
    title: 'Static Website Hosting on AWS',
    prompt: 'Build me a simple architecture to host a static website on AWS.',
    level: 'beginner',
    provider: 'aws',
    category: 'web-hosting',
    services: ['S3', 'CloudFront', 'Route 53', 'IAM'],
    architecture: 'S3 (static hosting), CloudFront (CDN), Route 53, IAM policy',
    exportFormats: ['PNG', 'Terraform'],
    estimatedTime: '15 minutes',
    costLevel: 'low',
    tags: ['static', 'cdn', 'dns', 'beginner-friendly'],
    description: 'Learn the fundamentals of hosting static websites on AWS with global CDN distribution.'
  },
  {
    id: 'azure-vm-hosting',
    title: 'Basic VM Hosting on Azure',
    prompt: 'I want to deploy a web server on Azure with basic security and availability.',
    level: 'beginner',
    provider: 'azure',
    category: 'web-hosting',
    services: ['Virtual Machine', 'Load Balancer', 'NSG', 'Storage Account'],
    architecture: 'Azure Virtual Machine, Azure Load Balancer, NSG, Storage Account',
    exportFormats: ['PNG', 'ARM Template'],
    estimatedTime: '20 minutes',
    costLevel: 'medium',
    tags: ['vm', 'load-balancer', 'security', 'availability'],
    description: 'Deploy and secure virtual machines on Azure with proper networking and load balancing.'
  },
  {
    id: 'gcp-cloud-function',
    title: 'GCP Cloud Functions with Pub/Sub',
    prompt: 'Trigger a GCP Cloud Function from a Pub/Sub event.',
    level: 'beginner',
    provider: 'gcp',
    category: 'serverless',
    services: ['Cloud Functions', 'Pub/Sub'],
    architecture: 'Pub/Sub → Cloud Function',
    exportFormats: ['PNG', 'Deployment Manager'],
    estimatedTime: '10 minutes',
    costLevel: 'low',
    tags: ['serverless', 'event-driven', 'messaging'],
    description: 'Understand event-driven serverless computing with Google Cloud Functions and Pub/Sub.'
  },

  // INTERMEDIATE SCENARIOS
  {
    id: 'gcp-scalable-webapp',
    title: 'Scalable Web App on GCP',
    prompt: 'Create a scalable architecture for a React web app with a Node.js backend on GCP.',
    level: 'intermediate',
    provider: 'gcp',
    category: 'web-hosting',
    services: ['Cloud Run', 'Cloud Storage', 'Firestore', 'Cloud Load Balancer', 'Cloud Build'],
    architecture: 'Cloud Run or GKE, Cloud Storage, Firestore, Cloud Load Balancer',
    exportFormats: ['PNG', 'YAML', 'Terraform'],
    estimatedTime: '45 minutes',
    costLevel: 'medium',
    tags: ['scalable', 'containers', 'ci-cd', 'full-stack'],
    description: 'Build a production-ready scalable web application with automated CI/CD on Google Cloud.'
  },
  {
    id: 'aws-serverless-api',
    title: 'Serverless API on AWS',
    prompt: 'Design a serverless REST API on AWS.',
    level: 'intermediate',
    provider: 'aws',
    category: 'serverless',
    services: ['API Gateway', 'Lambda', 'DynamoDB', 'CloudWatch', 'Cognito'],
    architecture: 'API Gateway → Lambda → DynamoDB',
    exportFormats: ['PNG', 'CloudFormation', 'SAM'],
    estimatedTime: '40 minutes',
    costLevel: 'low',
    tags: ['serverless', 'api', 'nosql', 'authentication'],
    description: 'Create a fully serverless REST API with authentication, logging, and monitoring.'
  },
  {
    id: 'azure-kubernetes-cicd',
    title: 'Kubernetes Deployment with CI/CD',
    prompt: 'Build me a Kubernetes-based architecture for microservices with CI/CD on Azure.',
    level: 'intermediate',
    provider: 'azure',
    category: 'containers',
    services: ['AKS', 'Azure Container Registry', 'Azure DevOps', 'Ingress Controller', 'Prometheus', 'Grafana'],
    architecture: 'AKS cluster, Azure Container Registry, Azure DevOps pipelines',
    exportFormats: ['YAML', 'PNG', 'Helm Charts'],
    estimatedTime: '60 minutes',
    costLevel: 'medium',
    tags: ['kubernetes', 'microservices', 'ci-cd', 'monitoring'],
    description: 'Deploy microservices on Kubernetes with complete CI/CD pipeline and monitoring stack.'
  },

  // EXPERT SCENARIOS
  {
    id: 'aws-multi-region-dr',
    title: 'Multi-Region Failover (AWS)',
    prompt: 'Show a multi-region disaster recovery setup for a production workload on AWS.',
    level: 'expert',
    provider: 'aws',
    category: 'enterprise',
    services: ['RDS', 'S3', 'Route 53', 'CloudFormation', 'Lambda'],
    architecture: 'RDS with cross-region read replica, S3 cross-region replication',
    exportFormats: ['CloudFormation', 'PNG', 'Cost Analysis'],
    estimatedTime: '90 minutes',
    costLevel: 'high',
    tags: ['disaster-recovery', 'multi-region', 'high-availability', 'enterprise'],
    description: 'Design enterprise-grade disaster recovery with automated failover across AWS regions.'
  },
  {
    id: 'azure-data-lake',
    title: 'Data Lake & Analytics Pipeline (Azure)',
    prompt: 'Create a data lake and ETL pipeline for big data processing on Azure.',
    level: 'expert',
    provider: 'azure',
    category: 'data',
    services: ['Data Lake Gen2', 'Data Factory', 'Synapse Analytics', 'Blob Storage', 'Databricks'],
    architecture: 'Azure Data Lake Gen2, Data Factory, Synapse Analytics',
    exportFormats: ['PNG', 'ARM Template', 'Data Flow Diagram'],
    estimatedTime: '120 minutes',
    costLevel: 'high',
    tags: ['big-data', 'analytics', 'etl', 'machine-learning'],
    description: 'Build a comprehensive data lake and analytics pipeline for enterprise big data processing.'
  },
  {
    id: 'gcp-iot-realtime',
    title: 'Real-Time IoT Architecture (GCP)',
    prompt: 'Design an IoT architecture for thousands of devices sending data in real-time to GCP.',
    level: 'expert',
    provider: 'gcp',
    category: 'iot',
    services: ['IoT Core', 'Pub/Sub', 'Dataflow', 'BigQuery', 'Cloud Functions'],
    architecture: 'IoT Core, Pub/Sub, Dataflow, BigQuery',
    exportFormats: ['PNG', 'Terraform', 'Monitoring Dashboard'],
    estimatedTime: '100 minutes',
    costLevel: 'high',
    tags: ['iot', 'real-time', 'streaming', 'big-data'],
    description: 'Handle massive IoT data streams with real-time processing and analytics on Google Cloud.'
  },
  {
    id: 'saas-multi-tenant',
    title: 'SaaS Multi-Tenant Architecture',
    prompt: 'I need a multi-tenant SaaS architecture that supports scaling, isolation, and monitoring.',
    level: 'expert',
    provider: 'multi-cloud',
    category: 'enterprise',
    services: ['Kubernetes', 'OAuth', 'Prometheus', 'ELK Stack', 'Load Balancers'],
    architecture: 'Tenant isolation with Kubernetes namespaces',
    exportFormats: ['YAML', 'PNG', 'Security Audit'],
    estimatedTime: '150 minutes',
    costLevel: 'high',
    tags: ['saas', 'multi-tenant', 'kubernetes', 'security', 'monitoring'],
    description: 'Design a secure, scalable multi-tenant SaaS platform with proper isolation and monitoring.'
  },
  {
    id: 'aws-ml-secure',
    title: 'Secure ML Deployment on AWS',
    prompt: 'Deploy a machine learning model with secure APIs and role-based access control on AWS.',
    level: 'expert',
    provider: 'aws',
    category: 'ml-ai',
    services: ['SageMaker', 'API Gateway', 'Lambda', 'IAM', 'CloudTrail'],
    architecture: 'SageMaker endpoint, API Gateway, Lambda auth (JWT), IAM roles',
    exportFormats: ['CloudFormation', 'PNG', 'Cost Estimation'],
    estimatedTime: '80 minutes',
    costLevel: 'medium',
    tags: ['machine-learning', 'security', 'api', 'rbac'],
    description: 'Deploy ML models securely with proper authentication, authorization, and audit trails.'
  },

  // SECURITY & COMPLIANCE
  {
    id: 'azure-zero-trust',
    title: 'Zero Trust Architecture on Azure',
    prompt: 'Design a zero trust network architecture on Azure for internal applications with identity enforcement and segmentation.',
    level: 'expert',
    provider: 'azure',
    category: 'security',
    services: ['Azure AD', 'Conditional Access', 'Azure Firewall', 'Azure Bastion', 'NSGs'],
    architecture: 'Azure AD, Conditional Access, Azure Firewall, Azure Bastion',
    exportFormats: ['PNG', 'Security Policy', 'ARM Template'],
    estimatedTime: '110 minutes',
    costLevel: 'high',
    tags: ['zero-trust', 'security', 'identity', 'network-segmentation'],
    description: 'Implement zero trust security model with comprehensive identity and network controls.'
  },
  {
    id: 'aws-pci-ecommerce',
    title: 'PCI-Compliant E-commerce App on AWS',
    prompt: 'Build a PCI-DSS compliant architecture for an e-commerce app on AWS.',
    level: 'expert',
    provider: 'aws',
    category: 'security',
    services: ['ALB', 'ECS Fargate', 'RDS', 'WAF', 'CloudTrail', 'GuardDuty', 'IAM'],
    architecture: 'ALB → ECS (Fargate), RDS with encryption',
    exportFormats: ['CloudFormation', 'PNG', 'Compliance Checklist'],
    estimatedTime: '130 minutes',
    costLevel: 'high',
    tags: ['pci-compliance', 'e-commerce', 'security', 'encryption'],
    description: 'Build PCI-DSS compliant e-commerce platform with comprehensive security controls.'
  },

  // MACHINE LEARNING & AI
  {
    id: 'gcp-ml-pipeline',
    title: 'End-to-End ML Pipeline on GCP',
    prompt: 'Show an end-to-end machine learning workflow on GCP from data ingestion to model training and deployment.',
    level: 'expert',
    provider: 'gcp',
    category: 'ml-ai',
    services: ['BigQuery', 'Dataflow', 'AI Platform Training', 'Model Registry', 'Cloud Run'],
    architecture: 'BigQuery → Dataflow → AI Platform Training → Model Registry → Cloud Run',
    exportFormats: ['PNG', 'Terraform', 'Kubeflow Pipeline'],
    estimatedTime: '140 minutes',
    costLevel: 'high',
    tags: ['machine-learning', 'mlops', 'data-pipeline', 'model-deployment'],
    description: 'Complete MLOps pipeline from data ingestion to model deployment and monitoring.'
  },
  {
    id: 'azure-ml-autoscale',
    title: 'Real-Time ML Inference with Auto-Scaling',
    prompt: 'Design a low-latency ML inference architecture on Azure that auto-scales based on request load.',
    level: 'expert',
    provider: 'azure',
    category: 'ml-ai',
    services: ['AKS', 'KEDA', 'Azure ML', 'ONNX', 'Azure Monitor'],
    architecture: 'Azure Kubernetes Service + KEDA',
    exportFormats: ['YAML', 'PNG', 'Performance Metrics'],
    estimatedTime: '95 minutes',
    costLevel: 'medium',
    tags: ['machine-learning', 'auto-scaling', 'low-latency', 'kubernetes'],
    description: 'Deploy ML models with automatic scaling based on demand and performance requirements.'
  },

  // MULTI-CLOUD & HYBRID
  {
    id: 'hybrid-aws-onprem',
    title: 'Hybrid Cloud with On-Prem and AWS',
    prompt: 'Design a hybrid cloud architecture with an on-prem data center connected to AWS.',
    level: 'expert',
    provider: 'hybrid',
    category: 'enterprise',
    services: ['Direct Connect', 'VPN', 'Transit Gateway', 'Active Directory', 'CloudWatch'],
    architecture: 'Direct Connect, VPN, Transit Gateway',
    exportFormats: ['PNG', 'Network Diagram', 'CloudFormation'],
    estimatedTime: '120 minutes',
    costLevel: 'high',
    tags: ['hybrid-cloud', 'on-premises', 'networking', 'identity-federation'],
    description: 'Connect on-premises infrastructure with AWS using secure, high-performance networking.'
  },
  {
    id: 'multi-cloud-redundancy',
    title: 'Multi-Cloud Redundancy (AWS + GCP)',
    prompt: 'Build a highly available web app across AWS and GCP with DNS-based routing and shared storage.',
    level: 'expert',
    provider: 'multi-cloud',
    category: 'enterprise',
    services: ['AWS ALB', 'GCP Load Balancer', 'Route 53', 'Cloud DNS', 'S3', 'GCS'],
    architecture: 'AWS ALB + GCP Load Balancer',
    exportFormats: ['PNG', 'Multi-Cloud Diagram', 'Cost Comparison'],
    estimatedTime: '160 minutes',
    costLevel: 'high',
    tags: ['multi-cloud', 'high-availability', 'dns-routing', 'redundancy'],
    description: 'Achieve ultimate availability by distributing workloads across multiple cloud providers.'
  }
];

export const getScenariosByLevel = (level: 'beginner' | 'intermediate' | 'expert') => {
  return cloudScenarios.filter(scenario => scenario.level === level);
};

export const getScenariosByProvider = (provider: 'aws' | 'azure' | 'gcp' | 'multi-cloud' | 'hybrid') => {
  return cloudScenarios.filter(scenario => scenario.provider === provider);
};

export const getScenariosByCategory = (category: string) => {
  return cloudScenarios.filter(scenario => scenario.category === category);
};

export const searchScenarios = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return cloudScenarios.filter(scenario => 
    scenario.title.toLowerCase().includes(lowercaseQuery) ||
    scenario.description.toLowerCase().includes(lowercaseQuery) ||
    scenario.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    scenario.services.some(service => service.toLowerCase().includes(lowercaseQuery))
  );
};
