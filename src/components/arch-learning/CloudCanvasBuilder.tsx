import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Play,
  Pause,
  Download,
  Save,
  RotateCcw,
  Zap,
  Database,
  Server,
  Globe,
  Shield,
  Network,
  Code,
  Layers,
  Settings,
  Eye,
  Share2,
  Plus,
  Minus,
  Grid,
  Move,
  Search,
  Filter,
  Star,
  BookOpen,
  Lock,
  Cloud,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface CloudService {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp' | 'kubernetes';
  category: 'compute' | 'storage' | 'database' | 'networking' | 'security' | 'analytics' | 'ai-ml' | 'devops' | 'containers';
  icon: string;
  color: string;
  description: string;
  pricing: 'free-tier' | 'low' | 'medium' | 'high';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  documentation?: string;
  bestPractices?: string[];
  securityTips?: string[];
}

interface CanvasNode {
  id: string;
  service: CloudService;
  position: { x: number; y: number };
  connections: string[];
  metadata?: Record<string, any>;
}

const CloudCanvasBuilder: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp' | 'kubernetes'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showServiceDetails, setShowServiceDetails] = useState<string | null>(null);

  const cloudServices: CloudService[] = [
    // AWS Services - Compute
    {
      id: 'aws-ec2', name: 'EC2', provider: 'aws', category: 'compute',
      icon: '🖥️', color: 'bg-orange-100 text-orange-700',
      description: 'Scalable virtual servers in the cloud',
      pricing: 'free-tier', complexity: 'beginner',
      tags: ['virtual-machines', 'compute', 'scalable'],
      bestPractices: ['Use appropriate instance types', 'Enable monitoring', 'Configure security groups'],
      securityTips: ['Restrict SSH access', 'Use IAM roles', 'Enable encryption']
    },
    {
      id: 'aws-lambda', name: 'Lambda', provider: 'aws', category: 'compute',
      icon: '⚡', color: 'bg-orange-100 text-orange-700',
      description: 'Run code without managing servers',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['serverless', 'event-driven', 'microservices'],
      bestPractices: ['Optimize function size', 'Use environment variables', 'Monitor performance'],
      securityTips: ['Least privilege IAM', 'Encrypt environment variables', 'VPC configuration']
    },
    {
      id: 'aws-ecs', name: 'ECS', provider: 'aws', category: 'containers',
      icon: '📦', color: 'bg-orange-100 text-orange-700',
      description: 'Fully managed container orchestration',
      pricing: 'low', complexity: 'intermediate',
      tags: ['containers', 'docker', 'orchestration'],
      bestPractices: ['Use Fargate for serverless', 'Configure health checks', 'Implement auto-scaling'],
      securityTips: ['Scan container images', 'Use task roles', 'Network isolation']
    },

    // AWS Services - Storage
    {
      id: 'aws-s3', name: 'S3', provider: 'aws', category: 'storage',
      icon: '🪣', color: 'bg-orange-100 text-orange-700',
      description: 'Scalable object storage service',
      pricing: 'free-tier', complexity: 'beginner',
      tags: ['object-storage', 'backup', 'static-hosting'],
      bestPractices: ['Use lifecycle policies', 'Enable versioning', 'Configure CORS'],
      securityTips: ['Block public access', 'Enable encryption', 'Use bucket policies']
    },
    {
      id: 'aws-ebs', name: 'EBS', provider: 'aws', category: 'storage',
      icon: '💽', color: 'bg-orange-100 text-orange-700',
      description: 'High-performance block storage',
      pricing: 'low', complexity: 'beginner',
      tags: ['block-storage', 'persistent', 'high-performance'],
      bestPractices: ['Choose appropriate volume type', 'Enable snapshots', 'Monitor IOPS'],
      securityTips: ['Enable encryption at rest', 'Secure snapshot sharing', 'Access control']
    },

    // AWS Services - Database
    {
      id: 'aws-rds', name: 'RDS', provider: 'aws', category: 'database',
      icon: '🗄️', color: 'bg-orange-100 text-orange-700',
      description: 'Managed relational database service',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['relational', 'managed', 'mysql', 'postgresql'],
      bestPractices: ['Enable Multi-AZ', 'Configure backups', 'Use read replicas'],
      securityTips: ['Enable encryption', 'Use VPC security groups', 'Regular security updates']
    },
    {
      id: 'aws-dynamodb', name: 'DynamoDB', provider: 'aws', category: 'database',
      icon: '⚡', color: 'bg-orange-100 text-orange-700',
      description: 'Fast NoSQL database service',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['nosql', 'serverless', 'fast', 'scalable'],
      bestPractices: ['Design efficient partition keys', 'Use GSI wisely', 'Monitor capacity'],
      securityTips: ['Enable encryption', 'Use IAM policies', 'VPC endpoints']
    },

    // AWS Services - Networking
    {
      id: 'aws-vpc', name: 'VPC', provider: 'aws', category: 'networking',
      icon: '🌐', color: 'bg-orange-100 text-orange-700',
      description: 'Isolated cloud resources network',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['networking', 'isolation', 'subnets'],
      bestPractices: ['Use multiple AZs', 'Implement proper CIDR', 'Configure route tables'],
      securityTips: ['Use NACLs', 'Configure security groups', 'Enable flow logs']
    },
    {
      id: 'aws-alb', name: 'ALB', provider: 'aws', category: 'networking',
      icon: '⚖️', color: 'bg-orange-100 text-orange-700',
      description: 'Application load balancer',
      pricing: 'low', complexity: 'intermediate',
      tags: ['load-balancer', 'high-availability', 'ssl'],
      bestPractices: ['Configure health checks', 'Use SSL certificates', 'Enable access logs'],
      securityTips: ['Configure WAF', 'Use security groups', 'SSL/TLS termination']
    },

    // AWS Services - Security
    {
      id: 'aws-iam', name: 'IAM', provider: 'aws', category: 'security',
      icon: '🔐', color: 'bg-orange-100 text-orange-700',
      description: 'Identity and access management',
      pricing: 'free-tier', complexity: 'advanced',
      tags: ['security', 'access-control', 'policies'],
      bestPractices: ['Use least privilege', 'Enable MFA', 'Regular access reviews'],
      securityTips: ['Rotate access keys', 'Use roles over users', 'Monitor CloudTrail']
    },

    // Azure Services - Compute
    {
      id: 'azure-vm', name: 'Virtual Machines', provider: 'azure', category: 'compute',
      icon: '💻', color: 'bg-blue-100 text-blue-700',
      description: 'Scalable virtual machines on Azure',
      pricing: 'free-tier', complexity: 'beginner',
      tags: ['virtual-machines', 'windows', 'linux'],
      bestPractices: ['Use managed disks', 'Configure auto-shutdown', 'Enable monitoring'],
      securityTips: ['Use Azure Security Center', 'Enable disk encryption', 'Configure NSGs']
    },
    {
      id: 'azure-functions', name: 'Functions', provider: 'azure', category: 'compute',
      icon: '⚡', color: 'bg-blue-100 text-blue-700',
      description: 'Event-driven serverless compute',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['serverless', 'event-driven', 'microservices'],
      bestPractices: ['Use consumption plan', 'Optimize cold starts', 'Monitor performance'],
      securityTips: ['Use managed identity', 'Secure function keys', 'Network restrictions']
    },

    // Azure Services - Storage
    {
      id: 'azure-storage', name: 'Storage Account', provider: 'azure', category: 'storage',
      icon: '💾', color: 'bg-blue-100 text-blue-700',
      description: 'Scalable cloud storage solution',
      pricing: 'free-tier', complexity: 'beginner',
      tags: ['blob-storage', 'file-storage', 'queue-storage'],
      bestPractices: ['Use appropriate access tiers', 'Enable soft delete', 'Configure lifecycle'],
      securityTips: ['Enable encryption', 'Use private endpoints', 'Configure firewall']
    },

    // GCP Services - Compute
    {
      id: 'gcp-compute', name: 'Compute Engine', provider: 'gcp', category: 'compute',
      icon: '🔧', color: 'bg-green-100 text-green-700',
      description: 'Scalable virtual machine instances',
      pricing: 'free-tier', complexity: 'beginner',
      tags: ['virtual-machines', 'scalable', 'preemptible'],
      bestPractices: ['Use preemptible instances', 'Configure auto-scaling', 'Use custom images'],
      securityTips: ['Use service accounts', 'Enable OS Login', 'Configure firewall rules']
    },
    {
      id: 'gcp-functions', name: 'Cloud Functions', provider: 'gcp', category: 'compute',
      icon: '⚡', color: 'bg-green-100 text-green-700',
      description: 'Serverless execution environment',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['serverless', 'event-driven', 'http-triggers'],
      bestPractices: ['Optimize function memory', 'Use environment variables', 'Monitor execution'],
      securityTips: ['Use IAM roles', 'Secure environment variables', 'VPC connector']
    },

    // Kubernetes Services
    {
      id: 'k8s-pod', name: 'Pod', provider: 'kubernetes', category: 'containers',
      icon: '🐳', color: 'bg-purple-100 text-purple-700',
      description: 'Smallest deployable unit in Kubernetes',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['containers', 'workload', 'scheduling'],
      bestPractices: ['Use resource limits', 'Configure health checks', 'Use labels'],
      securityTips: ['Run as non-root', 'Use security contexts', 'Network policies']
    },
    {
      id: 'k8s-service', name: 'Service', provider: 'kubernetes', category: 'networking',
      icon: '🔗', color: 'bg-purple-100 text-purple-700',
      description: 'Expose applications running on pods',
      pricing: 'free-tier', complexity: 'intermediate',
      tags: ['networking', 'load-balancing', 'discovery'],
      bestPractices: ['Use appropriate service types', 'Configure selectors', 'Use annotations'],
      securityTips: ['Restrict service access', 'Use TLS', 'Network policies']
    }
  ];

  const filteredServices = useMemo(() => {
    return cloudServices.filter(service => {
      const providerMatch = selectedProvider === 'all' || service.provider === selectedProvider;
      const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
      const complexityMatch = selectedComplexity === 'all' || service.complexity === selectedComplexity;
      const searchMatch = searchQuery === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return providerMatch && categoryMatch && complexityMatch && searchMatch;
    });
  }, [selectedProvider, selectedCategory, selectedComplexity, searchQuery, cloudServices]);

  const handleServiceDrop = useCallback((service: CloudService, position: { x: number; y: number }) => {
    const newNode: CanvasNode = {
      id: `${service.id}-${Date.now()}`,
      service,
      position,
      connections: []
    };
    setCanvasNodes(prev => [...prev, newNode]);
  }, []);

  const handleNodeMove = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    setCanvasNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position: newPosition } : node
    ));
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setCanvasNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const handleClearCanvas = () => {
    setCanvasNodes([]);
  };

  const handleAnimateFlow = () => {
    setIsAnimating(!isAnimating);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'compute': return <Server className="w-4 h-4" />;
      case 'storage': return <Database className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'networking': return <Network className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'analytics': return <Layers className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
          <Palette className="w-4 h-4" />
          <span>Interactive Cloud Canvas Builder</span>
        </div>
        
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Design Your Cloud Architecture
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Drag and drop cloud services to create interactive architecture diagrams with real-time flow animations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Service Palette */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-fit sticky top-6">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Service Palette</h3>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Provider Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Providers</option>
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">Google Cloud</option>
                  <option value="kubernetes">Kubernetes</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="compute">Compute</option>
                  <option value="storage">Storage</option>
                  <option value="database">Database</option>
                  <option value="networking">Networking</option>
                  <option value="security">Security</option>
                  <option value="analytics">Analytics</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="devops">DevOps</option>
                  <option value="containers">Containers</option>
                </select>
              </div>

              {/* Complexity Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Complexity</label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Filter Summary */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                Showing {filteredServices.length} of {cloudServices.length} services
              </div>
            </div>

            {/* Enhanced Services List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600">No services found</p>
                  <p className="text-xs text-slate-500">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <motion.div
                      key={service.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(service));
                      }}
                      className={`relative p-3 rounded-xl border border-slate-200 cursor-move hover:shadow-lg transition-all duration-200 ${service.color} group`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowServiceDetails(showServiceDetails === service.id ? null : service.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg">{service.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-sm truncate">{service.name}</p>
                            <div className="flex items-center space-x-1">
                              {service.pricing === 'free-tier' && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Free</span>
                              )}
                              {service.complexity === 'beginner' && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Easy</span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2">{service.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {service.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {service.tags.length > 2 && (
                              <span className="text-xs text-slate-500">+{service.tags.length - 2}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowServiceDetails(showServiceDetails === service.id ? null : service.id);
                            }}
                            className="p-1 hover:bg-white/50 rounded transition-colors"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                          {getCategoryIcon(service.category)}
                        </div>
                      </div>

                      {/* Drag Indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move className="w-3 h-3 text-slate-400" />
                      </div>

                      {/* Service Details Popup */}
                      {showServiceDetails === service.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-200 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-1">{service.name}</h4>
                              <p className="text-xs text-slate-600">{service.description}</p>
                            </div>

                            {service.bestPractices && service.bestPractices.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-green-700 mb-1 flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Best Practices</span>
                                </h5>
                                <ul className="text-xs text-slate-600 space-y-0.5">
                                  {service.bestPractices.slice(0, 2).map((practice, index) => (
                                    <li key={index} className="flex items-start space-x-1">
                                      <span className="text-green-500 mt-0.5">•</span>
                                      <span>{practice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {service.securityTips && service.securityTips.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-red-700 mb-1 flex items-center space-x-1">
                                  <Shield className="w-3 h-3" />
                                  <span>Security Tips</span>
                                </h5>
                                <ul className="text-xs text-slate-600 space-y-0.5">
                                  {service.securityTips.slice(0, 2).map((tip, index) => (
                                    <li key={index} className="flex items-start space-x-1">
                                      <span className="text-red-500 mt-0.5">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <span>Complexity: {service.complexity}</span>
                                <span>•</span>
                                <span>Pricing: {service.pricing}</span>
                              </div>
                              <button
                                onClick={() => setShowServiceDetails(null)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            {/* Canvas Toolbar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-bold text-slate-900">Architecture Canvas</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAnimateFlow}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isAnimating 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isAnimating ? 'Stop' : 'Animate'}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-lg transition-colors ${
                      showGrid ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleClearCanvas}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </button>

                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>

                <button className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div 
              className="relative h-96 bg-slate-50 overflow-hidden"
              style={{ 
                backgroundImage: showGrid ? 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'none',
                transform: `scale(${zoomLevel / 100})`
              }}
              onDrop={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (100 / zoomLevel);
                const y = (e.clientY - rect.top) * (100 / zoomLevel);
                
                try {
                  const service = JSON.parse(e.dataTransfer.getData('application/json'));
                  handleServiceDrop(service, { x, y });
                } catch (error) {
                  console.error('Error parsing dropped service:', error);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Canvas Nodes */}
              <AnimatePresence>
                {canvasNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute p-3 rounded-lg border-2 border-slate-300 bg-white shadow-lg cursor-move ${node.service.color}`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                    drag
                    onDragEnd={(e, info) => {
                      const newX = node.position.x + info.offset.x;
                      const newY = node.position.y + info.offset.y;
                      handleNodeMove(node.id, { x: newX, y: newY });
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, zIndex: 1000 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{node.service.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{node.service.name}</p>
                        <p className="text-xs opacity-75">{node.service.provider.toUpperCase()}</p>
                      </div>
                      <button
                        onClick={() => handleNodeDelete(node.id)}
                        className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Animation pulse effect when animating */}
                    {isAnimating && (
                      <motion.div
                        className="absolute inset-0 bg-blue-400 rounded-lg opacity-20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {canvasNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Palette className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Building</h3>
                    <p className="text-slate-600">Drag services from the palette to create your architecture</p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Stats */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center space-x-4">
                  <span>Services: {canvasNodes.length}</span>
                  <span>Zoom: {zoomLevel}%</span>
                  <span>Grid: {showGrid ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💡 Tip: Drag services to the canvas and use the animate button to see data flow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudCanvasBuilder;
