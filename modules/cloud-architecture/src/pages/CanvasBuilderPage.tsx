import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  Download,
  Upload,
  Layers,
  Settings,
  Trash2,
  Copy,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Eye,
  Play,
  Pause,
  Share2,
  MessageSquare,
  GitBranch,
  Lock,
  Unlock,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  RotateCcw,
  Move,
  Type,
  Eraser,
  Link,
  Zap,
  Brain,
  Code,
  FileText,
  Image,
  Users,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Target,
  Sparkles,
  Sun,
  Moon,
  Edit3,
  Database,
  Server,
  Globe,
  Network,
  Shield,
  Monitor,
  Cpu,
  HardDrive,
  Cloud,
  Activity,
  BarChart3,
  Workflow,
  Package,
  Terminal,
  GitCommit,
  Boxes,
  Container,
  Route,
  Wifi,
  Key,
  FileCode,
  Gauge,
  DollarSign,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  Fork,
  ExternalLink,
  MousePointer,
  Hand,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  MoreHorizontal,
  Tag,
  MapPin,
  Sliders,
  Code2,
  FileJson,
  Camera,
  Presentation,
  Send,
  ChevronUp,
  Minimize,
  Maximize,
  RotateCw
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCloudArchitecture } from '../context/CloudArchitectureContext';

// Enhanced interfaces for cloud-native visual architecture builder
interface CloudService {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp' | 'custom';
  category: string; // e.g., 'networking', 'compute', 'storage', 'security', etc.
  subcategory?: string; // e.g., 'vpc', 'ec2', 's3', 'iam'
  icon: React.ComponentType<any> | string;
  color: string;
  description: string;
  tags: string[];
  properties: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
      default: any;
      options?: string[];
      required?: boolean;
      description?: string;
    };
  };
  documentation?: string;
  terraformResource?: string;
  awsService?: string;
  azureService?: string;
  gcpService?: string;
}

interface CanvasNode {
  id: string;
  service: CloudService;
  position: { x: number; y: number };
  size: { width: number; height: number };
  label: string;
  properties: Record<string, any>;
  region?: string;
  zone?: string;
  tags: Record<string, string>;
  notes?: string;
  groupId?: string;
  locked?: boolean;
  visible?: boolean;
  created: Date;
  modified: Date;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'network' | 'data' | 'dependency' | 'control';
  label?: string;
  animated?: boolean;
  bidirectional?: boolean;
  style?: {
    color?: string;
    width?: number;
    dashArray?: string;
  };
}

interface CanvasGroup {
  id: string;
  name: string;
  type: 'vpc' | 'subnet' | 'security-group' | 'custom';
  nodes: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  collapsed: boolean;
  properties: Record<string, any>;
}

interface CanvasProject {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  connections: Connection[];
  groups: CanvasGroup[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  settings: {
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    theme: 'light' | 'dark';
  };
  metadata: {
    created: Date;
    modified: Date;
    author: string;
    version: number;
    tags: string[];
    isPublic: boolean;
  };
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  author: string;
  rating: number;
  submissions: number;
  sampleSolution?: CanvasProject;
}

interface ExportOptions {
  format: 'image' | 'json' | 'terraform' | 'cdk';
  imageFormat?: 'png' | 'svg';
  includeMetadata?: boolean;
  optimizeForProduction?: boolean;
}

interface CanvasBuilderPageProps {}

const CanvasBuilderPage: React.FC<CanvasBuilderPageProps> = () => {
  const { state } = useCloudArchitecture();

  // Core project state
  const [currentProject, setCurrentProject] = useState<CanvasProject>({
    id: 'new-project',
    name: 'Untitled Architecture',
    description: '',
    nodes: [],
    connections: [],
    groups: [],
    viewport: { x: 0, y: 0, zoom: 100 },
    settings: {
      showGrid: true,
      snapToGrid: true,
      gridSize: 20,
      theme: 'light'
    },
    metadata: {
      created: new Date(),
      modified: new Date(),
      author: 'Current User',
      version: 1,
      tags: [],
      isPublic: false
    }
  });

  // UI state
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'connect' | 'text' | 'shape'>('select');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Panel states
  const [activeProvider, setActiveProvider] = useState<'aws' | 'azure' | 'gcp' | 'custom'>('aws');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [bottomPanelTab, setBottomPanelTab] = useState<'scenario' | 'comments' | 'ai' | 'cost'>('scenario');

  // Export and sharing
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'image',
    imageFormat: 'png',
    includeMetadata: true
  });

  // History for undo/redo
  const [history, setHistory] = useState<CanvasProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Comprehensive cloud services data according to specifications
  const cloudServices: CloudService[] = [
    // AWS Networking
    {
      id: 'aws-vpc',
      name: 'VPC',
      provider: 'aws',
      category: 'networking',
      subcategory: 'vpc',
      icon: Network,
      color: 'bg-purple-500',
      description: 'Virtual Private Cloud - Isolated network environment',
      tags: ['networking', 'isolation', 'security'],
      properties: {
        cidrBlock: { type: 'string', default: '10.0.0.0/16', required: true, description: 'CIDR block for the VPC' },
        enableDnsHostnames: { type: 'boolean', default: true, description: 'Enable DNS hostnames' },
        enableDnsSupport: { type: 'boolean', default: true, description: 'Enable DNS support' }
      },
      terraformResource: 'aws_vpc',
      awsService: 'VPC'
    },
    {
      id: 'aws-subnet-public',
      name: 'Public Subnet',
      provider: 'aws',
      category: 'networking',
      subcategory: 'subnet',
      icon: Globe,
      color: 'bg-green-500',
      description: 'Public subnet with internet access',
      tags: ['networking', 'public', 'internet'],
      properties: {
        cidrBlock: { type: 'string', default: '10.0.1.0/24', required: true, description: 'CIDR block for the subnet' },
        availabilityZone: { type: 'select', default: 'us-east-1a', options: ['us-east-1a', 'us-east-1b', 'us-east-1c'], description: 'Availability Zone' },
        mapPublicIpOnLaunch: { type: 'boolean', default: true, description: 'Auto-assign public IP' }
      },
      terraformResource: 'aws_subnet'
    },
    {
      id: 'aws-subnet-private',
      name: 'Private Subnet',
      provider: 'aws',
      category: 'networking',
      subcategory: 'subnet',
      icon: Shield,
      color: 'bg-red-500',
      description: 'Private subnet without direct internet access',
      tags: ['networking', 'private', 'secure'],
      properties: {
        cidrBlock: { type: 'string', default: '10.0.2.0/24', required: true, description: 'CIDR block for the subnet' },
        availabilityZone: { type: 'select', default: 'us-east-1a', options: ['us-east-1a', 'us-east-1b', 'us-east-1c'], description: 'Availability Zone' }
      },
      terraformResource: 'aws_subnet'
    },
    {
      id: 'aws-igw',
      name: 'Internet Gateway',
      provider: 'aws',
      category: 'networking',
      subcategory: 'gateway',
      icon: Wifi,
      color: 'bg-blue-500',
      description: 'Provides internet access to VPC',
      tags: ['networking', 'internet', 'gateway'],
      properties: {
        name: { type: 'string', default: 'main-igw', description: 'Gateway name' }
      },
      terraformResource: 'aws_internet_gateway'
    },
    {
      id: 'aws-nat-gateway',
      name: 'NAT Gateway',
      provider: 'aws',
      category: 'networking',
      subcategory: 'gateway',
      icon: Route,
      color: 'bg-indigo-500',
      description: 'Enables outbound internet access for private subnets',
      tags: ['networking', 'nat', 'outbound'],
      properties: {
        allocationId: { type: 'string', default: '', description: 'Elastic IP allocation ID' },
        subnetId: { type: 'string', default: '', required: true, description: 'Subnet ID for NAT Gateway' }
      },
      terraformResource: 'aws_nat_gateway'
    },
    {
      id: 'aws-alb',
      name: 'Application Load Balancer',
      provider: 'aws',
      category: 'networking',
      subcategory: 'load-balancer',
      icon: BarChart3,
      color: 'bg-purple-600',
      description: 'Distributes incoming application traffic',
      tags: ['load-balancer', 'traffic', 'high-availability'],
      properties: {
        scheme: { type: 'select', default: 'internet-facing', options: ['internet-facing', 'internal'], description: 'Load balancer scheme' },
        ipAddressType: { type: 'select', default: 'ipv4', options: ['ipv4', 'dualstack'], description: 'IP address type' },
        subnets: { type: 'multiselect', default: [], description: 'Subnets for load balancer' }
      },
      terraformResource: 'aws_lb'
    },
    {
      id: 'aws-route53',
      name: 'Route 53',
      provider: 'aws',
      category: 'networking',
      subcategory: 'dns',
      icon: Globe,
      color: 'bg-orange-600',
      description: 'Scalable DNS and domain name registration',
      tags: ['dns', 'domain', 'routing'],
      properties: {
        hostedZoneName: { type: 'string', default: 'example.com', description: 'Domain name' },
        recordType: { type: 'select', default: 'A', options: ['A', 'AAAA', 'CNAME', 'MX'], description: 'DNS record type' }
      },
      terraformResource: 'aws_route53_zone'
    },

    // AWS Compute
    {
      id: 'aws-ec2',
      name: 'EC2',
      provider: 'aws',
      category: 'compute',
      subcategory: 'virtual-machine',
      icon: Server,
      color: 'bg-orange-500',
      description: 'Virtual servers in the cloud',
      tags: ['compute', 'virtual-machine', 'scalable'],
      properties: {
        instanceType: { type: 'select', default: 't3.micro', options: ['t3.micro', 't3.small', 't3.medium', 'm5.large'], description: 'Instance type' },
        ami: { type: 'string', default: 'ami-0abcdef1234567890', description: 'Amazon Machine Image ID' },
        keyName: { type: 'string', default: '', description: 'Key pair name' },
        subnetId: { type: 'string', default: '', description: 'Subnet ID' },
        securityGroups: { type: 'multiselect', default: [], description: 'Security groups' }
      },
      terraformResource: 'aws_instance'
    },
    {
      id: 'aws-lambda',
      name: 'Lambda',
      provider: 'aws',
      category: 'compute',
      subcategory: 'serverless',
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'Run code without thinking about servers',
      tags: ['serverless', 'function', 'event-driven'],
      properties: {
        runtime: { type: 'select', default: 'nodejs18.x', options: ['nodejs18.x', 'python3.9', 'java11', 'dotnet6'], description: 'Runtime environment' },
        memory: { type: 'number', default: 128, description: 'Memory allocation (MB)' },
        timeout: { type: 'number', default: 30, description: 'Timeout (seconds)' },
        handler: { type: 'string', default: 'index.handler', description: 'Function handler' }
      },
      terraformResource: 'aws_lambda_function'
    },
    {
      id: 'aws-ecs',
      name: 'ECS',
      provider: 'aws',
      category: 'compute',
      subcategory: 'containers',
      icon: Container,
      color: 'bg-blue-600',
      description: 'Elastic Container Service for Docker containers',
      tags: ['containers', 'docker', 'orchestration'],
      properties: {
        clusterName: { type: 'string', default: 'my-cluster', description: 'ECS cluster name' },
        launchType: { type: 'select', default: 'FARGATE', options: ['FARGATE', 'EC2'], description: 'Launch type' },
        cpu: { type: 'select', default: '256', options: ['256', '512', '1024'], description: 'CPU units' },
        memory: { type: 'select', default: '512', options: ['512', '1024', '2048'], description: 'Memory (MB)' }
      },
      terraformResource: 'aws_ecs_service'
    },
    {
      id: 'aws-eks',
      name: 'EKS',
      provider: 'aws',
      category: 'compute',
      subcategory: 'kubernetes',
      icon: Boxes,
      color: 'bg-indigo-600',
      description: 'Managed Kubernetes service',
      tags: ['kubernetes', 'containers', 'orchestration'],
      properties: {
        clusterName: { type: 'string', default: 'my-eks-cluster', description: 'EKS cluster name' },
        version: { type: 'select', default: '1.24', options: ['1.24', '1.25', '1.26'], description: 'Kubernetes version' },
        nodeGroupInstanceType: { type: 'select', default: 't3.medium', options: ['t3.medium', 't3.large', 'm5.large'], description: 'Node group instance type' }
      },
      terraformResource: 'aws_eks_cluster'
    },

    // AWS Storage & Database
    {
      id: 'aws-s3',
      name: 'S3',
      provider: 'aws',
      category: 'storage',
      subcategory: 'object-storage',
      icon: HardDrive,
      color: 'bg-green-500',
      description: 'Object storage built to store and retrieve any amount of data',
      tags: ['storage', 'object', 'scalable'],
      properties: {
        bucketName: { type: 'string', default: 'my-bucket', required: true, description: 'S3 bucket name' },
        versioning: { type: 'boolean', default: false, description: 'Enable versioning' },
        encryption: { type: 'boolean', default: true, description: 'Enable encryption' },
        publicAccess: { type: 'boolean', default: false, description: 'Allow public access' }
      },
      terraformResource: 'aws_s3_bucket'
    },
    {
      id: 'aws-rds',
      name: 'RDS',
      provider: 'aws',
      category: 'database',
      subcategory: 'relational',
      icon: Database,
      color: 'bg-blue-500',
      description: 'Managed relational database service',
      tags: ['database', 'relational', 'managed'],
      properties: {
        engine: { type: 'select', default: 'mysql', options: ['mysql', 'postgres', 'mariadb', 'oracle'], description: 'Database engine' },
        instanceClass: { type: 'select', default: 'db.t3.micro', options: ['db.t3.micro', 'db.t3.small', 'db.m5.large'], description: 'Instance class' },
        allocatedStorage: { type: 'number', default: 20, description: 'Storage size (GB)' },
        multiAZ: { type: 'boolean', default: false, description: 'Multi-AZ deployment' },
        backupRetentionPeriod: { type: 'number', default: 7, description: 'Backup retention (days)' }
      },
      terraformResource: 'aws_db_instance'
    },
    {
      id: 'aws-dynamodb',
      name: 'DynamoDB',
      provider: 'aws',
      category: 'database',
      subcategory: 'nosql',
      icon: Database,
      color: 'bg-purple-500',
      description: 'Fast and flexible NoSQL database service',
      tags: ['database', 'nosql', 'serverless'],
      properties: {
        tableName: { type: 'string', default: 'my-table', required: true, description: 'Table name' },
        hashKey: { type: 'string', default: 'id', required: true, description: 'Hash key attribute' },
        billingMode: { type: 'select', default: 'PAY_PER_REQUEST', options: ['PAY_PER_REQUEST', 'PROVISIONED'], description: 'Billing mode' },
        readCapacity: { type: 'number', default: 5, description: 'Read capacity units' },
        writeCapacity: { type: 'number', default: 5, description: 'Write capacity units' }
      },
      terraformResource: 'aws_dynamodb_table'
    },
    {
      id: 'aws-elasticache',
      name: 'ElastiCache',
      provider: 'aws',
      category: 'database',
      subcategory: 'cache',
      icon: Activity,
      color: 'bg-red-500',
      description: 'In-memory caching service',
      tags: ['cache', 'redis', 'memcached'],
      properties: {
        engine: { type: 'select', default: 'redis', options: ['redis', 'memcached'], description: 'Cache engine' },
        nodeType: { type: 'select', default: 'cache.t3.micro', options: ['cache.t3.micro', 'cache.t3.small', 'cache.m5.large'], description: 'Node type' },
        numCacheNodes: { type: 'number', default: 1, description: 'Number of cache nodes' },
        port: { type: 'number', default: 6379, description: 'Port number' }
      },
      terraformResource: 'aws_elasticache_cluster'
    },

    // AWS Security
    {
      id: 'aws-iam-role',
      name: 'IAM Role',
      provider: 'aws',
      category: 'security',
      subcategory: 'identity',
      icon: Key,
      color: 'bg-yellow-600',
      description: 'Identity and Access Management role',
      tags: ['security', 'iam', 'permissions'],
      properties: {
        roleName: { type: 'string', default: 'my-role', required: true, description: 'Role name' },
        assumeRolePolicy: { type: 'string', default: '{}', description: 'Assume role policy document' },
        description: { type: 'string', default: '', description: 'Role description' }
      },
      terraformResource: 'aws_iam_role'
    },
    {
      id: 'aws-security-group',
      name: 'Security Group',
      provider: 'aws',
      category: 'security',
      subcategory: 'firewall',
      icon: Shield,
      color: 'bg-red-600',
      description: 'Virtual firewall for controlling traffic',
      tags: ['security', 'firewall', 'network'],
      properties: {
        name: { type: 'string', default: 'my-sg', required: true, description: 'Security group name' },
        description: { type: 'string', default: 'Security group', description: 'Description' },
        vpcId: { type: 'string', default: '', description: 'VPC ID' }
      },
      terraformResource: 'aws_security_group'
    },
    {
      id: 'aws-waf',
      name: 'WAF',
      provider: 'aws',
      category: 'security',
      subcategory: 'web-firewall',
      icon: Shield,
      color: 'bg-orange-700',
      description: 'Web Application Firewall',
      tags: ['security', 'waf', 'web-protection'],
      properties: {
        name: { type: 'string', default: 'my-waf', required: true, description: 'WAF name' },
        scope: { type: 'select', default: 'REGIONAL', options: ['REGIONAL', 'CLOUDFRONT'], description: 'WAF scope' }
      },
      terraformResource: 'aws_wafv2_web_acl'
    },

    // AWS Monitoring
    {
      id: 'aws-cloudwatch',
      name: 'CloudWatch',
      provider: 'aws',
      category: 'monitoring',
      subcategory: 'metrics',
      icon: Monitor,
      color: 'bg-blue-700',
      description: 'Monitoring and observability service',
      tags: ['monitoring', 'metrics', 'logs'],
      properties: {
        logGroupName: { type: 'string', default: '/aws/lambda/my-function', description: 'Log group name' },
        retentionInDays: { type: 'number', default: 14, description: 'Log retention period' },
        metricName: { type: 'string', default: 'my-metric', description: 'Custom metric name' }
      },
      terraformResource: 'aws_cloudwatch_log_group'
    },
    {
      id: 'aws-xray',
      name: 'X-Ray',
      provider: 'aws',
      category: 'monitoring',
      subcategory: 'tracing',
      icon: Activity,
      color: 'bg-purple-700',
      description: 'Distributed tracing service',
      tags: ['tracing', 'debugging', 'performance'],
      properties: {
        tracingConfig: { type: 'select', default: 'Active', options: ['Active', 'PassThrough'], description: 'Tracing configuration' },
        samplingRate: { type: 'number', default: 0.1, description: 'Sampling rate' }
      },
      terraformResource: 'aws_xray_sampling_rule'
    },

    // AWS Developer Tools
    {
      id: 'aws-codebuild',
      name: 'CodeBuild',
      provider: 'aws',
      category: 'devops',
      subcategory: 'build',
      icon: Package,
      color: 'bg-green-700',
      description: 'Fully managed build service',
      tags: ['ci-cd', 'build', 'automation'],
      properties: {
        projectName: { type: 'string', default: 'my-build-project', required: true, description: 'Project name' },
        serviceRole: { type: 'string', default: '', description: 'Service role ARN' },
        computeType: { type: 'select', default: 'BUILD_GENERAL1_SMALL', options: ['BUILD_GENERAL1_SMALL', 'BUILD_GENERAL1_MEDIUM', 'BUILD_GENERAL1_LARGE'], description: 'Compute type' }
      },
      terraformResource: 'aws_codebuild_project'
    },
    {
      id: 'aws-codepipeline',
      name: 'CodePipeline',
      provider: 'aws',
      category: 'devops',
      subcategory: 'pipeline',
      icon: Workflow,
      color: 'bg-indigo-700',
      description: 'Continuous integration and delivery service',
      tags: ['ci-cd', 'pipeline', 'automation'],
      properties: {
        pipelineName: { type: 'string', default: 'my-pipeline', required: true, description: 'Pipeline name' },
        roleArn: { type: 'string', default: '', description: 'Service role ARN' },
        artifactStore: { type: 'string', default: '', description: 'Artifact store S3 bucket' }
      },
      terraformResource: 'aws_codepipeline'
    },
    {
      id: 'aws-cloudformation',
      name: 'CloudFormation',
      provider: 'aws',
      category: 'devops',
      subcategory: 'infrastructure',
      icon: FileCode,
      color: 'bg-orange-800',
      description: 'Infrastructure as Code service',
      tags: ['iac', 'infrastructure', 'automation'],
      properties: {
        stackName: { type: 'string', default: 'my-stack', required: true, description: 'Stack name' },
        templateUrl: { type: 'string', default: '', description: 'Template URL' },
        parameters: { type: 'string', default: '{}', description: 'Stack parameters (JSON)' }
      },
      terraformResource: 'aws_cloudformation_stack'
    },

    // Azure Services
    {
      id: 'azure-vnet',
      name: 'Virtual Network',
      provider: 'azure',
      category: 'networking',
      subcategory: 'vnet',
      icon: Network,
      color: 'bg-blue-500',
      description: 'Azure virtual network for isolated communication',
      tags: ['networking', 'isolation', 'azure'],
      properties: {
        name: { type: 'string', default: 'my-vnet', required: true, description: 'VNet name' },
        addressSpace: { type: 'string', default: '10.0.0.0/16', required: true, description: 'Address space' },
        location: { type: 'select', default: 'East US', options: ['East US', 'West US', 'Central US'], description: 'Azure region' }
      },
      azureService: 'Virtual Network'
    },
    {
      id: 'azure-nsg',
      name: 'Network Security Group',
      provider: 'azure',
      category: 'security',
      subcategory: 'firewall',
      icon: Shield,
      color: 'bg-red-500',
      description: 'Network security group for traffic filtering',
      tags: ['security', 'firewall', 'azure'],
      properties: {
        name: { type: 'string', default: 'my-nsg', required: true, description: 'NSG name' },
        location: { type: 'select', default: 'East US', options: ['East US', 'West US', 'Central US'], description: 'Azure region' }
      },
      azureService: 'Network Security Group'
    },
    {
      id: 'azure-vm',
      name: 'Virtual Machine',
      provider: 'azure',
      category: 'compute',
      subcategory: 'virtual-machine',
      icon: Server,
      color: 'bg-blue-600',
      description: 'Azure virtual machine',
      tags: ['compute', 'virtual-machine', 'azure'],
      properties: {
        name: { type: 'string', default: 'my-vm', required: true, description: 'VM name' },
        size: { type: 'select', default: 'Standard_B1s', options: ['Standard_B1s', 'Standard_B2s', 'Standard_D2s_v3'], description: 'VM size' },
        osType: { type: 'select', default: 'Linux', options: ['Linux', 'Windows'], description: 'Operating system' },
        adminUsername: { type: 'string', default: 'azureuser', description: 'Admin username' }
      },
      azureService: 'Virtual Machines'
    },

    // GCP Services
    {
      id: 'gcp-vpc',
      name: 'VPC Network',
      provider: 'gcp',
      category: 'networking',
      subcategory: 'vpc',
      icon: Network,
      color: 'bg-red-500',
      description: 'Google Cloud VPC network',
      tags: ['networking', 'isolation', 'gcp'],
      properties: {
        name: { type: 'string', default: 'my-vpc', required: true, description: 'VPC name' },
        autoCreateSubnetworks: { type: 'boolean', default: false, description: 'Auto create subnetworks' },
        routingMode: { type: 'select', default: 'REGIONAL', options: ['REGIONAL', 'GLOBAL'], description: 'Routing mode' }
      },
      gcpService: 'VPC Network'
    },
    {
      id: 'gcp-compute-engine',
      name: 'Compute Engine',
      provider: 'gcp',
      category: 'compute',
      subcategory: 'virtual-machine',
      icon: Server,
      color: 'bg-red-600',
      description: 'Google Cloud virtual machines',
      tags: ['compute', 'virtual-machine', 'gcp'],
      properties: {
        name: { type: 'string', default: 'my-instance', required: true, description: 'Instance name' },
        machineType: { type: 'select', default: 'e2-micro', options: ['e2-micro', 'e2-small', 'e2-medium'], description: 'Machine type' },
        zone: { type: 'select', default: 'us-central1-a', options: ['us-central1-a', 'us-central1-b', 'us-east1-a'], description: 'Zone' },
        bootDisk: { type: 'select', default: 'debian-11', options: ['debian-11', 'ubuntu-20-04', 'centos-7'], description: 'Boot disk image' }
      },
      gcpService: 'Compute Engine'
    },
    {
      id: 'gcp-cloud-storage',
      name: 'Cloud Storage',
      provider: 'gcp',
      category: 'storage',
      subcategory: 'object-storage',
      icon: HardDrive,
      color: 'bg-green-600',
      description: 'Google Cloud object storage',
      tags: ['storage', 'object', 'gcp'],
      properties: {
        name: { type: 'string', default: 'my-bucket', required: true, description: 'Bucket name' },
        location: { type: 'select', default: 'US', options: ['US', 'EU', 'ASIA'], description: 'Storage location' },
        storageClass: { type: 'select', default: 'STANDARD', options: ['STANDARD', 'NEARLINE', 'COLDLINE'], description: 'Storage class' }
      },
      gcpService: 'Cloud Storage'
    },

    // Custom Components
    {
      id: 'custom-note',
      name: 'Note',
      provider: 'custom',
      category: 'annotation',
      subcategory: 'text',
      icon: FileText,
      color: 'bg-yellow-400',
      description: 'Text annotation for documentation',
      tags: ['annotation', 'text', 'documentation'],
      properties: {
        text: { type: 'string', default: 'Add your note here...', description: 'Note text' },
        fontSize: { type: 'select', default: 'medium', options: ['small', 'medium', 'large'], description: 'Font size' },
        backgroundColor: { type: 'select', default: 'yellow', options: ['yellow', 'blue', 'green', 'red'], description: 'Background color' }
      }
    },
    {
      id: 'custom-shape-rectangle',
      name: 'Rectangle',
      provider: 'custom',
      category: 'shape',
      subcategory: 'basic',
      icon: Square,
      color: 'bg-gray-400',
      description: 'Basic rectangle shape',
      tags: ['shape', 'rectangle', 'basic'],
      properties: {
        width: { type: 'number', default: 100, description: 'Width in pixels' },
        height: { type: 'number', default: 60, description: 'Height in pixels' },
        fillColor: { type: 'select', default: 'transparent', options: ['transparent', 'blue', 'green', 'red'], description: 'Fill color' },
        borderColor: { type: 'select', default: 'black', options: ['black', 'blue', 'green', 'red'], description: 'Border color' }
      }
    },
    {
      id: 'custom-terraform-block',
      name: 'Terraform Block',
      provider: 'custom',
      category: 'infrastructure',
      subcategory: 'code',
      icon: FileCode,
      color: 'bg-purple-600',
      description: 'Custom Terraform configuration block',
      tags: ['terraform', 'iac', 'custom'],
      properties: {
        resourceType: { type: 'string', default: 'aws_instance', description: 'Terraform resource type' },
        resourceName: { type: 'string', default: 'example', description: 'Resource name' },
        configuration: { type: 'string', default: '{}', description: 'Terraform configuration (JSON)' }
      }
    },
    {
      id: 'custom-external-link',
      name: 'External Link',
      provider: 'custom',
      category: 'reference',
      subcategory: 'link',
      icon: ExternalLink,
      color: 'bg-blue-400',
      description: 'Link to external resources or documentation',
      tags: ['link', 'external', 'reference'],
      properties: {
        url: { type: 'string', default: 'https://example.com', description: 'URL' },
        title: { type: 'string', default: 'External Resource', description: 'Link title' },
        description: { type: 'string', default: 'Description of the external resource', description: 'Link description' }
      }
    },
    {
      id: 'aws-lambda',
      name: 'Lambda',
      provider: 'aws',
      category: 'serverless',
      icon: 'λ',
      color: 'bg-orange-600',
      description: 'Run code without thinking about servers',
      pricing: 'low',
      complexity: 'intermediate',
      tags: ['serverless', 'function', 'event-driven'],
      ports: { in: ['api-gateway', 'event'], out: ['database', 'storage', 'api'] },
      properties: {
        runtime: 'nodejs18.x',
        memory: 128,
        timeout: 30,
        environment: {}
      },
      compatibleWith: ['aws-api-gateway', 'aws-dynamodb', 'aws-s3', 'aws-sqs']
    },
    {
      id: 'aws-rds',
      name: 'RDS',
      provider: 'aws',
      category: 'database',
      icon: '🗄️',
      color: 'bg-blue-500',
      description: 'Managed relational database service',
      pricing: 'medium',
      complexity: 'intermediate',
      tags: ['database', 'relational', 'managed'],
      ports: { in: ['database'], out: [] },
      properties: {
        engine: 'mysql',
        instanceClass: 'db.t3.micro',
        allocatedStorage: 20,
        multiAZ: false
      },
      compatibleWith: ['aws-ec2', 'aws-lambda', 'aws-vpc']
    },
    {
      id: 'aws-s3',
      name: 'S3',
      provider: 'aws',
      category: 'storage',
      icon: '🪣',
      color: 'bg-green-500',
      description: 'Object storage built to store and retrieve any amount of data',
      pricing: 'low',
      complexity: 'beginner',
      tags: ['storage', 'object', 'scalable'],
      ports: { in: ['api'], out: ['cdn'] },
      properties: {
        bucketName: '',
        versioning: false,
        encryption: true,
        publicAccess: false
      },
      compatibleWith: ['aws-cloudfront', 'aws-lambda', 'aws-ec2']
    },
    {
      id: 'aws-vpc',
      name: 'VPC',
      provider: 'aws',
      category: 'networking',
      icon: '🌐',
      color: 'bg-purple-500',
      description: 'Virtual private cloud for isolated network',
      pricing: 'free-tier',
      complexity: 'intermediate',
      tags: ['networking', 'security', 'isolation'],
      ports: { in: [], out: [] },
      properties: {
        cidrBlock: '10.0.0.0/16',
        enableDnsHostnames: true,
        enableDnsSupport: true
      },
      compatibleWith: ['aws-ec2', 'aws-rds', 'aws-alb', 'aws-nat-gateway']
    },
    {
      id: 'aws-alb',
      name: 'Application Load Balancer',
      provider: 'aws',
      category: 'networking',
      icon: '⚖️',
      color: 'bg-purple-600',
      description: 'Distribute incoming traffic across multiple targets',
      pricing: 'medium',
      complexity: 'intermediate',
      tags: ['load-balancer', 'traffic', 'high-availability'],
      ports: { in: ['http', 'https'], out: ['ec2', 'ecs'] },
      properties: {
        scheme: 'internet-facing',
        ipAddressType: 'ipv4',
        subnets: [],
        securityGroups: []
      },
      compatibleWith: ['aws-ec2', 'aws-ecs', 'aws-vpc']
    },

    // Azure Services
    {
      id: 'azure-vm',
      name: 'Virtual Machine',
      provider: 'azure',
      category: 'compute',
      icon: '🖥️',
      color: 'bg-blue-500',
      description: 'Scalable virtual machines on demand',
      pricing: 'medium',
      complexity: 'beginner',
      tags: ['compute', 'virtual-machine', 'windows', 'linux'],
      ports: { in: ['rdp', 'ssh', 'http'], out: ['database', 'storage'] },
      properties: {
        size: 'Standard_B1s',
        osType: 'Linux',
        adminUsername: 'azureuser',
        location: 'East US'
      },
      compatibleWith: ['azure-sql', 'azure-storage', 'azure-vnet']
    },
    {
      id: 'azure-functions',
      name: 'Azure Functions',
      provider: 'azure',
      category: 'serverless',
      icon: 'ƒ',
      color: 'bg-blue-600',
      description: 'Event-driven serverless compute platform',
      pricing: 'low',
      complexity: 'intermediate',
      tags: ['serverless', 'function', 'event-driven'],
      ports: { in: ['http', 'timer', 'queue'], out: ['database', 'storage'] },
      properties: {
        runtime: 'node',
        version: '18',
        plan: 'Consumption'
      },
      compatibleWith: ['azure-sql', 'azure-storage', 'azure-service-bus']
    },

    // GCP Services
    {
      id: 'gcp-compute-engine',
      name: 'Compute Engine',
      provider: 'gcp',
      category: 'compute',
      icon: '🖥️',
      color: 'bg-red-500',
      description: 'Virtual machines running in Google\'s data centers',
      pricing: 'medium',
      complexity: 'beginner',
      tags: ['compute', 'virtual-machine', 'scalable'],
      ports: { in: ['ssh', 'http', 'https'], out: ['database', 'storage'] },
      properties: {
        machineType: 'e2-micro',
        zone: 'us-central1-a',
        bootDisk: 'debian-11'
      },
      compatibleWith: ['gcp-cloud-sql', 'gcp-cloud-storage', 'gcp-vpc']
    },
    {
      id: 'gcp-cloud-functions',
      name: 'Cloud Functions',
      provider: 'gcp',
      category: 'serverless',
      icon: 'ƒ',
      color: 'bg-red-600',
      description: 'Event-driven serverless functions',
      pricing: 'low',
      complexity: 'intermediate',
      tags: ['serverless', 'function', 'event-driven'],
      ports: { in: ['http', 'pubsub', 'storage'], out: ['database', 'api'] },
      properties: {
        runtime: 'nodejs18',
        memory: '256MB',
        trigger: 'HTTP'
      },
      compatibleWith: ['gcp-cloud-sql', 'gcp-pubsub', 'gcp-cloud-storage']
    }
  ];

  // Utility functions
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getServicesByProvider = (provider: string) => {
    if (provider === 'all') return cloudServices;
    return cloudServices.filter(service => service.provider === provider);
  };

  const getServicesByCategory = (services: CloudService[], category: string) => {
    if (category === 'all') return services;
    return services.filter(service => service.category === category);
  };

  const searchServices = (services: CloudService[], query: string) => {
    if (!query) return services;
    const lowercaseQuery = query.toLowerCase();
    return services.filter(service =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery) ||
      service.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const organizeServicesByCategory = (services: CloudService[]) => {
    const categories: { [key: string]: CloudService[] } = {};
    services.forEach(service => {
      if (!categories[service.category]) {
        categories[service.category] = [];
      }
      categories[service.category].push(service);
    });
    return categories;
  };

  const addToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...currentProject });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentProject({ ...history[historyIndex - 1] });
      setHasUnsavedChanges(true);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentProject({ ...history[historyIndex + 1] });
      setHasUnsavedChanges(true);
    }
  };


  const snapToGridPosition = (position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  };

  const getFilteredServices = useCallback(() => {
    return cloudServices.filter(service => {
      const matchesProvider = selectedProvider === 'all' || service.provider === selectedProvider;
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'all' || service.complexity === selectedComplexity;
      const matchesSearch = searchQuery === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesProvider && matchesCategory && matchesComplexity && matchesSearch;
    });
  }, [selectedProvider, selectedCategory, selectedComplexity, searchQuery]);

  // Event handlers
  const handleServiceDrop = useCallback((service: CloudService, position: { x: number; y: number }) => {
    const snappedPosition = snapToGridPosition(position);
    const newNode: CanvasNode = {
      id: generateId(),
      service,
      position: snappedPosition,
      size: { width: 120, height: 80 },
      connections: [],
      properties: { ...service.properties },
      metadata: {
        created: new Date(),
        modified: new Date(),
        version: 1
      },
      locked: false,
      visible: true
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodes([newNode.id]);
    setHasUnsavedChanges(true);

    // Add to history
    addToHistory('add-node', { node: newNode });

    // Check for AI suggestions
    checkAISuggestions([...nodes, newNode]);
  }, [nodes, snapToGrid, gridSize]);

  const handleNodeMove = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    const snappedPosition = snapToGridPosition(newPosition);
    setNodes(prev => prev.map(node =>
      node.id === nodeId
        ? {
            ...node,
            position: snappedPosition,
            metadata: { ...node.metadata, modified: new Date() }
          }
        : node
    ));
    setHasUnsavedChanges(true);
  }, [snapToGrid, gridSize]);

  const handleNodeSelect = useCallback((nodeId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedNodes(prev =>
        prev.includes(nodeId)
          ? prev.filter(id => id !== nodeId)
          : [...prev, nodeId]
      );
    } else {
      setSelectedNodes([nodeId]);
    }
  }, []);

  const handleNodeDelete = useCallback((nodeIds: string[]) => {
    const nodesToDelete = nodes.filter(node => nodeIds.includes(node.id));
    setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)));
    setConnections(prev => prev.filter(conn =>
      !nodeIds.includes(conn.from) && !nodeIds.includes(conn.to)
    ));
    setSelectedNodes([]);
    setHasUnsavedChanges(true);

    // Add to history
    addToHistory('delete-nodes', { nodes: nodesToDelete });
  }, [nodes]);

  const handleConnectionCreate = useCallback((fromNodeId: string, toNodeId: string, connectionType: Connection['type'] = 'data') => {
    const fromNode = nodes.find(n => n.id === fromNodeId);
    const toNode = nodes.find(n => n.id === toNodeId);

    if (!fromNode || !toNode) return;

    // Check compatibility
    const isCompatible = fromNode.service.compatibleWith?.includes(toNode.service.id) ||
                        toNode.service.compatibleWith?.includes(fromNode.service.id);

    const newConnection: Connection = {
      id: generateId(),
      from: fromNodeId,
      to: toNodeId,
      type: connectionType,
      properties: {},
      animated: false,
      bidirectional: false
    };

    setConnections(prev => [...prev, newConnection]);
    setConnectionMode({ active: false });
    setHasUnsavedChanges(true);

    // Add to history
    addToHistory('add-connection', { connection: newConnection });

    // Show compatibility warning if needed
    if (!isCompatible) {
      setAiAssistant(prev => ({
        ...prev,
        suggestions: [...prev.suggestions, {
          id: generateId(),
          type: 'connection',
          title: 'Compatibility Warning',
          description: `${fromNode.service.name} and ${toNode.service.name} may not be directly compatible. Consider adding intermediate components.`,
          severity: 'warning'
        }]
      }));
    }
  }, [nodes]);

  const addToActionHistory = (action: string, data: any) => {
    const newHistoryItem = {
      action,
      data,
      timestamp: new Date(),
      nodes: [...nodes],
      connections: [...connections]
    };

    setHistory(prev => [...prev.slice(0, historyIndex + 1), newHistoryItem]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setNodes(previousState.nodes);
      setConnections(previousState.connections);
      setHistoryIndex(prev => prev - 1);
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setConnections(nextState.connections);
      setHistoryIndex(prev => prev + 1);
      setHasUnsavedChanges(true);
    }
  };

  const checkAISuggestions = (currentNodes: CanvasNode[]) => {
    const suggestions: AISuggestion[] = [];

    // Check for missing security groups
    const ec2Nodes = currentNodes.filter(n => n.service.id === 'aws-ec2');
    const hasSecurityGroup = currentNodes.some(n => n.service.category === 'security');

    if (ec2Nodes.length > 0 && !hasSecurityGroup) {
      suggestions.push({
        id: generateId(),
        type: 'security-issue',
        title: 'Missing Security Group',
        description: 'EC2 instances should be protected by security groups to control inbound and outbound traffic.',
        severity: 'warning',
        autoFix: true
      });
    }

    // Check for missing load balancer in multi-instance setup
    if (ec2Nodes.length > 1) {
      const hasLoadBalancer = currentNodes.some(n => n.service.name.includes('Load Balancer'));
      if (!hasLoadBalancer) {
        suggestions.push({
          id: generateId(),
          type: 'optimization',
          title: 'Consider Load Balancer',
          description: 'Multiple EC2 instances benefit from a load balancer for high availability and traffic distribution.',
          severity: 'info',
          autoFix: true
        });
      }
    }

    setAiAssistant(prev => ({ ...prev, suggestions }));
  };

  return (
    <>
      <Helmet>
        <title>Cloud Architecture Canvas Builder</title>
        <meta name="description" content="Visual cloud architecture builder for students and professionals to design, simulate, and share full cloud solutions." />
      </Helmet>

      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* 🧱 1. Top Header Bar */}
        <div className={`h-16 border-b flex items-center justify-between px-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Left Section - Project Name */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-6 h-6 text-blue-600" />
              <input
                type="text"
                value={currentProject.name}
                onChange={(e) => setCurrentProject(prev => ({
                  ...prev,
                  name: e.target.value,
                  metadata: { ...prev.metadata, modified: new Date() }
                }))}
                className={`text-lg font-semibold bg-transparent border-none outline-none ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                placeholder="Project Name"
              />
              {hasUnsavedChanges && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
              )}
            </div>
          </div>

          {/* Center Section - Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentProject({
                  id: generateId(),
                  name: 'Untitled Architecture',
                  description: '',
                  nodes: [],
                  connections: [],
                  groups: [],
                  viewport: { x: 0, y: 0, zoom: 100 },
                  settings: currentProject.settings,
                  metadata: {
                    created: new Date(),
                    modified: new Date(),
                    author: 'Current User',
                    version: 1,
                    tags: [],
                    isPublic: false
                  }
                });
                setHistory([]);
                setHistoryIndex(-1);
                setHasUnsavedChanges(false);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>

            <button
              onClick={() => {
                // Save logic
                setHasUnsavedChanges(false);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasUnsavedChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowExportModal(true)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setShowPublishModal(true)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Publish</span>
            </button>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSimulating
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'Stop' : 'Simulate'} Flow</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/canvas/${currentProject.id}`);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>
          </div>

          {/* Right Section - Toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-yellow-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentProject(prev => ({
                ...prev,
                settings: { ...prev.settings, showGrid: !prev.settings.showGrid }
              }))}
              className={`p-2 rounded-lg transition-colors ${
                currentProject.settings.showGrid
                  ? 'bg-blue-100 text-blue-600'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* 🟦 2. Left Sidebar — Component Library with Search */}
          <div className={`w-80 border-r flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search: ec2, lambda, load balancer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Provider Tabs */}
            <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex">
                {[
                  { id: 'aws', label: 'AWS', color: 'text-orange-600' },
                  { id: 'azure', label: 'Azure', color: 'text-blue-600' },
                  { id: 'gcp', label: 'GCP', color: 'text-red-600' },
                  { id: 'custom', label: 'Custom', color: 'text-gray-600' }
                ].map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProvider(provider.id as any)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      activeProvider === provider.id
                        ? `${provider.color} border-b-2 border-current`
                        : isDarkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Services List */}
            <div className="flex-1 overflow-y-auto">
              {(() => {
                const filteredServices = searchServices(
                  getServicesByProvider(activeProvider === 'all' ? 'aws' : activeProvider),
                  searchQuery
                );
                const categorizedServices = organizeServicesByCategory(filteredServices);

                return Object.entries(categorizedServices).map(([category, services]) => (
                  <div key={category} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`px-4 py-2 text-sm font-semibold ${
                      isDarkMode ? 'text-gray-300 bg-gray-750' : 'text-gray-700 bg-gray-50'
                    }`}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    <div className="p-2">
                      {services.map(service => {
                        const IconComponent = typeof service.icon === 'string' ?
                          () => <span className="text-lg">{service.icon}</span> :
                          service.icon;

                        return (
                          <motion.div
                            key={service.id}
                            draggable
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/json', JSON.stringify(service));
                            }}
                            className={`flex items-center space-x-3 p-3 m-1 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                              isDarkMode
                                ? 'hover:bg-gray-700 border border-gray-600'
                                : 'hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center text-white`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {service.name}
                              </div>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                {service.description}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* 🟨 3. Main Canvas (Editable Architecture Space) */}
          <div className="flex-1 relative overflow-hidden">
            {/* Grid Background */}
            {currentProject.settings.showGrid && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px),
                    linear-gradient(to bottom, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px)
                  `,
                  backgroundSize: `${currentProject.settings.gridSize}px ${currentProject.settings.gridSize}px`,
                  transform: `scale(${currentProject.viewport.zoom / 100}) translate(${currentProject.viewport.x}px, ${currentProject.viewport.y}px)`
                }}
              />
            )}

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `scale(${currentProject.viewport.zoom / 100}) translate(${currentProject.viewport.x}px, ${currentProject.viewport.y}px)`,
                transformOrigin: '0 0'
              }}
              onDrop={(e) => {
                e.preventDefault();
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;

                const x = (e.clientX - rect.left) * (100 / currentProject.viewport.zoom) - currentProject.viewport.x;
                const y = (e.clientY - rect.top) * (100 / currentProject.viewport.zoom) - currentProject.viewport.y;

                try {
                  const service = JSON.parse(e.dataTransfer.getData('application/json'));
                  handleServiceDrop(service, { x, y });
                } catch (error) {
                  console.error('Error parsing dropped service:', error);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => {
                if (e.target === canvasRef.current) {
                  setSelectedNodes([]);
                  setSelectedConnections([]);
                }
              }}
            >
              {/* Connection Lines SVG */}
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={isDarkMode ? '#9ca3af' : '#64748b'}
                    />
                  </marker>
                  <marker
                    id="arrowhead-selected"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#3b82f6"
                    />
                  </marker>
                </defs>

                {currentProject.connections.map((connection) => {
                  const fromNode = currentProject.nodes.find(n => n.id === connection.from);
                  const toNode = currentProject.nodes.find(n => n.id === connection.to);

                  if (!fromNode || !toNode) return null;

                  const isSelected = selectedConnections.includes(connection.id);
                  const x1 = fromNode.position.x + fromNode.size.width / 2;
                  const y1 = fromNode.position.y + fromNode.size.height / 2;
                  const x2 = toNode.position.x + toNode.size.width / 2;
                  const y2 = toNode.position.y + toNode.size.height / 2;

                  return (
                    <g key={connection.id}>
                      <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSelected ? '#3b82f6' : (isDarkMode ? '#9ca3af' : '#64748b')}
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray={connection.type === 'dependency' ? '5,5' : 'none'}
                        markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
                        className="pointer-events-auto cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConnections([connection.id]);
                          setSelectedNodes([]);
                        }}
                      />

                      {/* Animated flow dots */}
                      {isSimulating && connection.animated && (
                        <motion.circle
                          r="3"
                          fill="#3b82f6"
                          initial={{ x: x1, y: y1 }}
                          animate={{ x: x2, y: y2 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}

                      {/* Connection label */}
                      {isSelected && (
                        <text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 - 10}
                          textAnchor="middle"
                          className={`text-xs font-medium ${isDarkMode ? 'fill-gray-300' : 'fill-slate-600'}`}
                        >
                          {connection.type}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Canvas Nodes */}
              <AnimatePresence>
                {currentProject.nodes.map((node) => {
                  const isSelected = selectedNodes.includes(node.id);
                  const IconComponent = typeof node.service.icon === 'string' ?
                    () => <span className="text-lg">{node.service.icon}</span> :
                    node.service.icon;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute cursor-move ${node.locked ? 'cursor-not-allowed' : ''}`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        width: node.size.width,
                        height: node.size.height,
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSelected ? 10 : 2
                      }}
                      drag={!node.locked}
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        if (!node.locked) {
                          const newX = node.position.x + info.offset.x;
                          const newY = node.position.y + info.offset.y;

                          setCurrentProject(prev => ({
                            ...prev,
                            nodes: prev.nodes.map(n =>
                              n.id === node.id
                                ? { ...n, position: { x: newX, y: newY }, modified: new Date() }
                                : n
                            ),
                            metadata: { ...prev.metadata, modified: new Date() }
                          }));
                          addToHistory();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedTool === 'connect') {
                          // Connection logic here
                        } else {
                          setSelectedNodes(e.ctrlKey || e.metaKey ?
                            (selectedNodes.includes(node.id) ?
                              selectedNodes.filter(id => id !== node.id) :
                              [...selectedNodes, node.id]) :
                            [node.id]
                          );
                        }
                      }}
                    >
                      <div
                        className={`w-full h-full rounded-xl border-2 shadow-lg transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 shadow-blue-200 shadow-lg'
                            : isDarkMode
                              ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                              : 'border-gray-300 bg-white hover:border-gray-400'
                        } ${node.locked ? 'opacity-75' : ''}`}
                      >
                        {/* Node Header */}
                        <div className={`p-3 rounded-t-xl ${node.service.color} text-white`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="text-sm font-semibold truncate">{node.label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {node.locked && <Lock className="w-3 h-3" />}
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                node.service.provider === 'aws' ? 'bg-orange-200 text-orange-800' :
                                node.service.provider === 'azure' ? 'bg-blue-200 text-blue-800' :
                                node.service.provider === 'gcp' ? 'bg-red-200 text-red-800' :
                                'bg-gray-200 text-gray-800'
                              }`}>
                                {node.service.provider.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Node Body */}
                        <div className={`p-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {node.service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {node.service.category}
                            </span>
                            {Object.keys(node.properties).length > 0 && (
                              <span className="text-xs text-blue-500">
                                Configured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty State */}
              {currentProject.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Cloud className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Start Building Your Architecture
                    </h3>
                    <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Drag cloud services from the left panel to create your architecture.
                      Use the search to find specific services quickly.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setActiveProvider('aws')}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add AWS Services</span>
                      </button>
                      <button
                        onClick={() => setActiveProvider('azure')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Azure Services</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* 🟨 4. Right Sidebar — Properties Panel */}
          <div className={`w-80 border-l flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {selectedNodes.length === 1 ? (
              <div className="flex-1 overflow-y-auto">
                {(() => {
                  const selectedNode = currentProject.nodes.find(n => n.id === selectedNodes[0]);
                  if (!selectedNode) return null;

                  const IconComponent = typeof selectedNode.service.icon === 'string' ?
                    () => <span className="text-lg">{selectedNode.service.icon}</span> :
                    selectedNode.service.icon;

                  return (
                    <div className="p-4 space-y-6">
                      {/* Component Info */}
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Component Properties
                        </h3>

                        <div className={`flex items-center space-x-3 p-3 rounded-lg mb-4 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className={`w-10 h-10 ${selectedNode.service.color} rounded-lg flex items-center justify-center text-white`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedNode.service.name}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {selectedNode.service.provider.toUpperCase()} • {selectedNode.service.category}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ID & Label */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ID & Label
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Label
                            </label>
                            <input
                              type="text"
                              value={selectedNode.label}
                              onChange={(e) => {
                                setCurrentProject(prev => ({
                                  ...prev,
                                  nodes: prev.nodes.map(node =>
                                    node.id === selectedNode.id
                                      ? { ...node, label: e.target.value, modified: new Date() }
                                      : node
                                  ),
                                  metadata: { ...prev.metadata, modified: new Date() }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              ID
                            </label>
                            <input
                              type="text"
                              value={selectedNode.id}
                              readOnly
                              className={`w-full px-3 py-2 border rounded-lg ${
                                isDarkMode
                                  ? 'bg-gray-600 border-gray-600 text-gray-300'
                                  : 'bg-gray-50 border-gray-300 text-gray-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Region/Zone */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Region & Zone
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Region
                            </label>
                            <select
                              value={selectedNode.region || 'us-east-1'}
                              onChange={(e) => {
                                setCurrentProject(prev => ({
                                  ...prev,
                                  nodes: prev.nodes.map(node =>
                                    node.id === selectedNode.id
                                      ? { ...node, region: e.target.value, modified: new Date() }
                                      : node
                                  ),
                                  metadata: { ...prev.metadata, modified: new Date() }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            >
                              <option value="us-east-1">US East (N. Virginia)</option>
                              <option value="us-west-2">US West (Oregon)</option>
                              <option value="eu-west-1">Europe (Ireland)</option>
                              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Zone
                            </label>
                            <select
                              value={selectedNode.zone || 'a'}
                              onChange={(e) => {
                                setCurrentProject(prev => ({
                                  ...prev,
                                  nodes: prev.nodes.map(node =>
                                    node.id === selectedNode.id
                                      ? { ...node, zone: e.target.value, modified: new Date() }
                                      : node
                                  ),
                                  metadata: { ...prev.metadata, modified: new Date() }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            >
                              <option value="a">Zone A</option>
                              <option value="b">Zone B</option>
                              <option value="c">Zone C</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Configuration Properties */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Configuration
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(selectedNode.service.properties).map(([key, propConfig]) => (
                            <div key={key}>
                              <label className={`block text-sm font-medium mb-1 capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                {propConfig.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {propConfig.type === 'select' ? (
                                <select
                                  value={selectedNode.properties[key] || propConfig.default}
                                  onChange={(e) => {
                                    setCurrentProject(prev => ({
                                      ...prev,
                                      nodes: prev.nodes.map(node =>
                                        node.id === selectedNode.id
                                          ? {
                                              ...node,
                                              properties: { ...node.properties, [key]: e.target.value },
                                              modified: new Date()
                                            }
                                          : node
                                      ),
                                      metadata: { ...prev.metadata, modified: new Date() }
                                    }));
                                    setHasUnsavedChanges(true);
                                  }}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    isDarkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                >
                                  {propConfig.options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : propConfig.type === 'boolean' ? (
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedNode.properties[key] || propConfig.default}
                                    onChange={(e) => {
                                      setCurrentProject(prev => ({
                                        ...prev,
                                        nodes: prev.nodes.map(node =>
                                          node.id === selectedNode.id
                                            ? {
                                                ...node,
                                                properties: { ...node.properties, [key]: e.target.checked },
                                                modified: new Date()
                                              }
                                            : node
                                        ),
                                        metadata: { ...prev.metadata, modified: new Date() }
                                      }));
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {propConfig.description}
                                  </span>
                                </label>
                              ) : (
                                <input
                                  type={propConfig.type === 'number' ? 'number' : 'text'}
                                  value={selectedNode.properties[key] || propConfig.default}
                                  onChange={(e) => {
                                    const value = propConfig.type === 'number' ?
                                      parseInt(e.target.value) || 0 :
                                      e.target.value;

                                    setCurrentProject(prev => ({
                                      ...prev,
                                      nodes: prev.nodes.map(node =>
                                        node.id === selectedNode.id
                                          ? {
                                              ...node,
                                              properties: { ...node.properties, [key]: value },
                                              modified: new Date()
                                            }
                                          : node
                                      ),
                                      metadata: { ...prev.metadata, modified: new Date() }
                                    }));
                                    setHasUnsavedChanges(true);
                                  }}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    isDarkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                  placeholder={propConfig.description}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags & Notes */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tags & Notes
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Notes
                            </label>
                            <textarea
                              value={selectedNode.notes || ''}
                              onChange={(e) => {
                                setCurrentProject(prev => ({
                                  ...prev,
                                  nodes: prev.nodes.map(node =>
                                    node.id === selectedNode.id
                                      ? { ...node, notes: e.target.value, modified: new Date() }
                                      : node
                                  ),
                                  metadata: { ...prev.metadata, modified: new Date() }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              rows={3}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="Add notes about this component..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Actions
                        </h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setCurrentProject(prev => ({
                                ...prev,
                                nodes: prev.nodes.map(node =>
                                  node.id === selectedNode.id
                                    ? { ...node, locked: !node.locked }
                                    : node
                                ),
                                metadata: { ...prev.metadata, modified: new Date() }
                              }));
                            }}
                            className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              selectedNode.locked
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {selectedNode.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            <span>{selectedNode.locked ? 'Unlock' : 'Lock'} Component</span>
                          </button>

                          <button
                            onClick={() => {
                              setCurrentProject(prev => ({
                                ...prev,
                                nodes: prev.nodes.filter(node => node.id !== selectedNode.id),
                                connections: prev.connections.filter(conn =>
                                  conn.from !== selectedNode.id && conn.to !== selectedNode.id
                                ),
                                metadata: { ...prev.metadata, modified: new Date() }
                              }));
                              setSelectedNodes([]);
                              addToHistory();
                            }}
                            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Component</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <Settings className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                  <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedNodes.length === 0 ? 'No Component Selected' : 'Multiple Components Selected'}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedNodes.length === 0
                      ? 'Select a component to view and edit its properties'
                      : `${selectedNodes.length} components selected`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🟫 5. Bottom Panel (Collapsible) */}
        {showBottomPanel && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className={`border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            {/* Bottom Panel Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex space-x-1">
                {[
                  { id: 'scenario', label: 'Scenario', icon: BookOpen },
                  { id: 'comments', label: 'Comments', icon: MessageCircle },
                  { id: 'ai', label: 'AI Suggestions', icon: Brain },
                  { id: 'cost', label: 'Cost Estimation', icon: DollarSign }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setBottomPanelTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        bottomPanelTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowBottomPanel(false)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Panel Content */}
            <div className="h-64 overflow-y-auto">
              {bottomPanelTab === 'scenario' && (
                <div className="p-4">
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Design Challenge: E-commerce Platform
                    </h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Create a scalable e-commerce platform that can handle 10,000 concurrent users during peak shopping seasons.
                      The architecture should include web servers, database, caching, and CDN for global content delivery.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4" />
                        <span>45 minutes</span>
                      </span>
                      <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Target className="w-4 h-4" />
                        <span>Intermediate</span>
                      </span>
                      <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Star className="w-4 h-4" />
                        <span>150 points</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {bottomPanelTab === 'comments' && (
                <div className="p-4">
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          JD
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              John Doe
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              2 hours ago
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Consider adding a load balancer between the web servers and the database for better performance.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {bottomPanelTab === 'ai' && (
                <div className="p-4">
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <div className="flex items-start space-x-2">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Suggestion: Add Auto Scaling
                          </h4>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Your EC2 instances could benefit from auto scaling to handle traffic spikes automatically.
                          </p>
                          <button className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-l-4 border-yellow-500 ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Security Warning
                          </h4>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Your database is in a public subnet. Consider moving it to a private subnet for better security.
                          </p>
                          <button className="mt-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors">
                            Fix Security Issue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bottomPanelTab === 'cost' && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Monthly Cost
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-green-600">$247.50</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Estimated for us-east-1
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Cost Breakdown
                        </h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>EC2 Instances</span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>$156.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>RDS Database</span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>$67.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Load Balancer</span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>$24.00</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Gauge className="w-5 h-5 text-orange-600" />
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Optimization
                        </h4>
                      </div>
                      <div className="text-sm">
                        <div className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Potential savings: <span className="font-medium text-orange-600">$45/month</span>
                        </div>
                        <button className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors">
                          View Recommendations
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Bottom Panel Toggle */}
        {!showBottomPanel && (
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowBottomPanel(true)}
              className={`w-full py-2 text-center text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronUp className="w-4 h-4 mx-auto" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CanvasBuilderPage;
