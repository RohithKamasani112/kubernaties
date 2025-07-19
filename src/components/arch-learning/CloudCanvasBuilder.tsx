import React, { useState, useCallback } from 'react';
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
  Move
} from 'lucide-react';

interface CloudService {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp';
  category: 'compute' | 'storage' | 'database' | 'networking' | 'security' | 'analytics';
  icon: string;
  color: string;
  description: string;
}

interface CanvasNode {
  id: string;
  service: CloudService;
  position: { x: number; y: number };
  connections: string[];
}

const CloudCanvasBuilder: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  const cloudServices: CloudService[] = [
    // AWS Services
    { id: 'aws-ec2', name: 'EC2', provider: 'aws', category: 'compute', icon: '🖥️', color: 'bg-orange-100 text-orange-700', description: 'Virtual servers in the cloud' },
    { id: 'aws-lambda', name: 'Lambda', provider: 'aws', category: 'compute', icon: '⚡', color: 'bg-orange-100 text-orange-700', description: 'Serverless compute service' },
    { id: 'aws-s3', name: 'S3', provider: 'aws', category: 'storage', icon: '🪣', color: 'bg-orange-100 text-orange-700', description: 'Object storage service' },
    { id: 'aws-rds', name: 'RDS', provider: 'aws', category: 'database', icon: '🗄️', color: 'bg-orange-100 text-orange-700', description: 'Managed relational database' },
    { id: 'aws-vpc', name: 'VPC', provider: 'aws', category: 'networking', icon: '🌐', color: 'bg-orange-100 text-orange-700', description: 'Virtual private cloud' },
    { id: 'aws-alb', name: 'ALB', provider: 'aws', category: 'networking', icon: '⚖️', color: 'bg-orange-100 text-orange-700', description: 'Application load balancer' },
    
    // Azure Services
    { id: 'azure-vm', name: 'Virtual Machines', provider: 'azure', category: 'compute', icon: '💻', color: 'bg-blue-100 text-blue-700', description: 'Scalable virtual machines' },
    { id: 'azure-functions', name: 'Functions', provider: 'azure', category: 'compute', icon: '⚡', color: 'bg-blue-100 text-blue-700', description: 'Event-driven serverless compute' },
    { id: 'azure-storage', name: 'Storage Account', provider: 'azure', category: 'storage', icon: '💾', color: 'bg-blue-100 text-blue-700', description: 'Cloud storage solution' },
    { id: 'azure-sql', name: 'SQL Database', provider: 'azure', category: 'database', icon: '🗃️', color: 'bg-blue-100 text-blue-700', description: 'Managed SQL database' },
    { id: 'azure-vnet', name: 'Virtual Network', provider: 'azure', category: 'networking', icon: '🔗', color: 'bg-blue-100 text-blue-700', description: 'Private network in Azure' },
    
    // GCP Services
    { id: 'gcp-compute', name: 'Compute Engine', provider: 'gcp', category: 'compute', icon: '🔧', color: 'bg-green-100 text-green-700', description: 'Virtual machine instances' },
    { id: 'gcp-functions', name: 'Cloud Functions', provider: 'gcp', category: 'compute', icon: '⚡', color: 'bg-green-100 text-green-700', description: 'Serverless execution environment' },
    { id: 'gcp-storage', name: 'Cloud Storage', provider: 'gcp', category: 'storage', icon: '☁️', color: 'bg-green-100 text-green-700', description: 'Object storage and serving' },
    { id: 'gcp-sql', name: 'Cloud SQL', provider: 'gcp', category: 'database', icon: '🗂️', color: 'bg-green-100 text-green-700', description: 'Fully managed relational database' },
    { id: 'gcp-vpc', name: 'VPC Network', provider: 'gcp', category: 'networking', icon: '🌍', color: 'bg-green-100 text-green-700', description: 'Virtual private cloud network' }
  ];

  const filteredServices = cloudServices.filter(service => {
    const providerMatch = selectedProvider === 'all' || service.provider === selectedProvider;
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    return providerMatch && categoryMatch;
  });

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
        {/* Service Palette */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-fit sticky top-6">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Service Palette</h3>
              
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
                </select>
              </div>
            </div>

            {/* Services List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(service));
                    }}
                    className={`p-3 rounded-lg border border-slate-200 cursor-move hover:shadow-md transition-all duration-200 ${service.color}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{service.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{service.name}</p>
                        <p className="text-xs opacity-75 truncate">{service.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
