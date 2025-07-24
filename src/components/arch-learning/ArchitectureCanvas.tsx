import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Shield,
  Database,
  Server,
  Globe,
  Network,
  Lock,
  Zap
} from 'lucide-react';
import { CloudScenario } from '../../data/cloudScenarios';
import { DeployedResource } from './InteractiveLearningPath';

interface ArchitectureCanvasProps {
  deployedResources: DeployedResource[];
  onResourceUpdate: (resources: DeployedResource[]) => void;
  isAnimating: boolean;
  scenario: CloudScenario;
}

interface ConnectionLine {
  from: string;
  to: string;
  type: 'data' | 'control' | 'security' | 'request' | 'response';
  animated: boolean;
  label?: string;
  color?: string;
  dashArray?: string;
}

interface FlowAnimation {
  id: string;
  path: string[];
  currentStep: number;
  type: 'request' | 'data' | 'deployment' | 'scaling';
  color: string;
  speed: number;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  deployedResources,
  onResourceUpdate,
  isAnimating,
  scenario
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [connections, setConnections] = useState<ConnectionLine[]>([]);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [flowAnimation, setFlowAnimation] = useState(false);
  const [activeFlows, setActiveFlows] = useState<FlowAnimation[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [animationType, setAnimationType] = useState<'request' | 'data' | 'deployment' | 'scaling'>('request');
  const [showAnimationControls, setShowAnimationControls] = useState(false);

  // Auto-generate intelligent connections between resources
  useEffect(() => {
    const newConnections: ConnectionLine[] = [];

    // Create intelligent connections based on resource types
    deployedResources.forEach((resource, index) => {
      deployedResources.forEach((otherResource, otherIndex) => {
        if (index !== otherIndex) {
          const connection = generateConnection(resource, otherResource);
          if (connection) {
            newConnections.push({
              ...connection,
              animated: flowAnimation
            });
          }
        }
      });
    });

    setConnections(newConnections);
  }, [deployedResources, flowAnimation]);

  // Generate intelligent connections based on resource types
  const generateConnection = (from: DeployedResource, to: DeployedResource): Omit<ConnectionLine, 'animated'> | null => {
    const fromType = from.type.toLowerCase();
    const toType = to.type.toLowerCase();

    // Define connection rules
    const connectionRules: Record<string, { targets: string[]; type: ConnectionLine['type']; label: string; color: string }> = {
      'alb': { targets: ['ec2', 'ecs', 'lambda'], type: 'request', label: 'HTTP/HTTPS', color: '#3b82f6' },
      'ec2': { targets: ['rds', 's3', 'dynamodb'], type: 'data', label: 'Data Access', color: '#10b981' },
      'lambda': { targets: ['dynamodb', 's3', 'rds'], type: 'data', label: 'Function Call', color: '#f59e0b' },
      's3': { targets: ['cloudfront'], type: 'data', label: 'Content Delivery', color: '#8b5cf6' },
      'vpc': { targets: ['ec2', 'rds', 'alb'], type: 'control', label: 'Network', color: '#6b7280' },
      'iam': { targets: ['ec2', 'lambda', 's3'], type: 'security', label: 'Access Control', color: '#ef4444' }
    };

    const rule = connectionRules[fromType];
    if (rule && rule.targets.includes(toType)) {
      return {
        from: from.id,
        to: to.id,
        type: rule.type,
        label: rule.label,
        color: rule.color,
        dashArray: rule.type === 'security' ? '5,5' : undefined
      };
    }

    return null;
  };

  // Start flow animation
  const startFlowAnimation = (type: FlowAnimation['type']) => {
    if (deployedResources.length < 2) return;

    const flowPaths = generateFlowPaths(type);
    const newFlows: FlowAnimation[] = flowPaths.map((path, index) => ({
      id: `flow-${Date.now()}-${index}`,
      path,
      currentStep: 0,
      type,
      color: getFlowColor(type),
      speed: animationSpeed
    }));

    setActiveFlows(newFlows);

    // Auto-advance flows
    const interval = setInterval(() => {
      setActiveFlows(prevFlows => {
        const updatedFlows = prevFlows.map(flow => ({
          ...flow,
          currentStep: (flow.currentStep + 1) % flow.path.length
        }));

        // Remove completed flows after a few cycles
        return updatedFlows.filter(flow => flow.currentStep < flow.path.length * 3);
      });
    }, 1000 / animationSpeed);

    // Clean up after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      setActiveFlows([]);
    }, 10000);
  };

  // Generate flow paths based on animation type
  const generateFlowPaths = (type: FlowAnimation['type']): string[][] => {
    const paths: string[][] = [];

    switch (type) {
      case 'request':
        // User request flow: ALB -> EC2 -> RDS
        const alb = deployedResources.find(r => r.type === 'alb');
        const ec2 = deployedResources.find(r => r.type === 'ec2');
        const rds = deployedResources.find(r => r.type === 'rds');
        if (alb && ec2) {
          paths.push([alb.id, ec2.id, ...(rds ? [rds.id] : [])]);
        }
        break;

      case 'data':
        // Data synchronization flow
        const s3 = deployedResources.find(r => r.type === 's3');
        const lambda = deployedResources.find(r => r.type === 'lambda');
        if (s3 && lambda) {
          paths.push([s3.id, lambda.id]);
        }
        break;

      case 'deployment':
        // Deployment flow through all resources
        if (deployedResources.length > 1) {
          paths.push(deployedResources.map(r => r.id));
        }
        break;

      case 'scaling':
        // Auto-scaling events
        const scalableResources = deployedResources.filter(r =>
          ['ec2', 'ecs', 'lambda'].includes(r.type)
        );
        scalableResources.forEach(resource => {
          paths.push([resource.id]);
        });
        break;
    }

    return paths;
  };

  const getFlowColor = (type: FlowAnimation['type']): string => {
    switch (type) {
      case 'request': return '#3b82f6';
      case 'data': return '#10b981';
      case 'deployment': return '#f59e0b';
      case 'scaling': return '#8b5cf6';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 's3': return <Database className="w-6 h-6" />;
      case 'ec2': return <Server className="w-6 h-6" />;
      case 'vpc': return <Network className="w-6 h-6" />;
      case 'lambda': return <Zap className="w-6 h-6" />;
      case 'rds': return <Database className="w-6 h-6" />;
      case 'alb': return <Globe className="w-6 h-6" />;
      default: return <Server className="w-6 h-6" />;
    }
  };

  const getSecurityColor = (level: 'secure' | 'warning' | 'critical') => {
    switch (level) {
      case 'secure': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'critical': return 'border-red-500 bg-red-50';
    }
  };

  const getSecurityIcon = (level: 'secure' | 'warning' | 'critical') => {
    switch (level) {
      case 'secure': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const handleResourceMove = useCallback((resourceId: string, newPosition: { x: number; y: number }) => {
    const updatedResources = deployedResources.map(resource =>
      resource.id === resourceId ? { ...resource, position: newPosition } : resource
    );
    onResourceUpdate(updatedResources);
  }, [deployedResources, onResourceUpdate]);

  const handleClearCanvas = () => {
    onResourceUpdate([]);
    setConnections([]);
  };

  const handleAnimateFlow = () => {
    if (flowAnimation) {
      setFlowAnimation(false);
      setActiveFlows([]);
    } else {
      setFlowAnimation(true);
      startFlowAnimation(animationType);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-slate-900">Architecture Visualizer</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {scenario.provider.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={handleAnimateFlow}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  flowAnimation
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {flowAnimation ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{flowAnimation ? 'Stop' : 'Animate'}</span>
              </button>

              {/* Animation Controls Dropdown */}
              {flowAnimation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Animation Type</label>
                      <select
                        value={animationType}
                        onChange={(e) => {
                          setAnimationType(e.target.value as any);
                          if (flowAnimation) {
                            startFlowAnimation(e.target.value as any);
                          }
                        }}
                        className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="request">Request Flow</option>
                        <option value="data">Data Flow</option>
                        <option value="deployment">Deployment</option>
                        <option value="scaling">Auto Scaling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Speed: {animationSpeed}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => startFlowAnimation('request')}
                        className="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                      >
                        Request
                      </button>
                      <button
                        onClick={() => startFlowAnimation('data')}
                        className="flex-1 text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                      >
                        Data
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Grid className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="w-full h-full relative"
          style={{ 
            backgroundImage: showGrid ? 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)' : 'none',
            backgroundSize: showGrid ? '20px 20px' : 'none',
            transform: `scale(${zoomLevel / 100})`
          }}
        >
          {/* Connection Lines and Flow Animations */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* Connection Lines */}
            {connections.map((connection, index) => {
              const fromResource = deployedResources.find(r => r.id === connection.from);
              const toResource = deployedResources.find(r => r.id === connection.to);

              if (!fromResource || !toResource) return null;

              // Calculate line properties
              const x1 = fromResource.position.x;
              const y1 = fromResource.position.y;
              const x2 = toResource.position.x;
              const y2 = toResource.position.y;

              // Calculate midpoint for label
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              // Calculate angle for label rotation
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

              return (
                <g key={`${connection.from}-${connection.to}`}>
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={connection.color || (connection.type === 'security' ? '#ef4444' : '#3b82f6')}
                    strokeWidth="2"
                    strokeDasharray={connection.dashArray || (connection.animated ? "5,5" : "none")}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    {connection.animated && (
                      <animate
                        attributeName="stroke-dashoffset"
                        values="10;0"
                        dur={`${1 / animationSpeed}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </motion.line>

                  {/* Connection Label */}
                  {connection.label && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-25"
                        y="-10"
                        width="50"
                        height="20"
                        rx="4"
                        fill="white"
                        stroke={connection.color || '#3b82f6'}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="sans-serif"
                        fill={connection.color || '#3b82f6'}
                      >
                        {connection.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Flow Animation Dots */}
            {activeFlows.map(flow => {
              if (flow.path.length < 2 || flow.currentStep >= flow.path.length) return null;

              const currentResourceId = flow.path[flow.currentStep];
              const currentResource = deployedResources.find(r => r.id === currentResourceId);

              if (!currentResource) return null;

              return (
                <g key={flow.id}>
                  <motion.circle
                    cx={currentResource.position.x}
                    cy={currentResource.position.y}
                    r="6"
                    fill={flow.color}
                    opacity="0.7"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2 / flow.speed,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.circle
                    cx={currentResource.position.x}
                    cy={currentResource.position.y}
                    r="3"
                    fill={flow.color}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 1 / flow.speed,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Deployed Resources */}
          <AnimatePresence>
            {deployedResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute p-4 rounded-xl border-2 bg-white shadow-lg cursor-move ${getSecurityColor(resource.securityLevel)}`}
                style={{
                  left: resource.position.x,
                  top: resource.position.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: selectedResource === resource.id ? 10 : 2
                }}
                drag
                onDragEnd={(e, info) => {
                  const newX = resource.position.x + info.offset.x;
                  const newY = resource.position.y + info.offset.y;
                  handleResourceMove(resource.id, { x: newX, y: newY });
                }}
                onClick={() => setSelectedResource(selectedResource === resource.id ? null : resource.id)}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 1000 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{resource.name}</p>
                    <p className="text-xs text-slate-600 truncate">{resource.type.toUpperCase()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getSecurityIcon(resource.securityLevel)}
                  </div>
                </div>

                {/* Resource Details Panel */}
                {selectedResource === resource.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[200px] z-20"
                  >
                    <h4 className="font-semibold text-slate-900 mb-2">{resource.name}</h4>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div><strong>Type:</strong> {resource.type}</div>
                      <div><strong>Security:</strong> {resource.securityLevel}</div>
                      <div><strong>Connections:</strong> {resource.connections.length}</div>
                    </div>
                  </motion.div>
                )}

                {/* Animation pulse effect when flow is active */}
                {flowAnimation && (
                  <motion.div
                    className="absolute inset-0 bg-blue-400 rounded-xl opacity-20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {deployedResources.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Architecture Canvas</h3>
                <p className="text-slate-600 text-sm">
                  Complete tutorial steps to see your<br />
                  architecture come to life
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <span>Resources: {deployedResources.length}</span>
            <span>Connections: {connections.length}</span>
            <span>Zoom: {zoomLevel}%</span>
            {flowAnimation && (
              <>
                <span className="text-green-600">● Live Animation</span>
                <span>Flows: {activeFlows.length}</span>
                <span>Speed: {animationSpeed}x</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {flowAnimation ? (
              <span>🎬 Showing {animationType} flow animation</span>
            ) : (
              <span>💡 Click Animate to see data flows</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureCanvas;
