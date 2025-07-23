import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Zap, 
  Database, 
  Shield, 
  Globe, 
  Server,
  Network,
  HardDrive,
  Monitor
} from 'lucide-react';
import { DeployedResource } from './InteractiveLearningPath';
import { CloudScenario } from '../../data/cloudScenarios';

interface LiveArchitectureVisualizerProps {
  deployedResources: DeployedResource[];
  scenario: CloudScenario;
  currentStep: number;
}

interface VisualNode {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
  connections: string[];
}

export const LiveArchitectureVisualizer: React.FC<LiveArchitectureVisualizerProps> = ({
  deployedResources,
  scenario,
  currentStep
}) => {
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [animatingConnections, setAnimatingConnections] = useState<string[]>([]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'vpc': return <Network className="w-6 h-6" />;
      case 'subnet': return <Globe className="w-6 h-6" />;
      case 'ec2': return <Server className="w-6 h-6" />;
      case 'load_balancer': return <Zap className="w-6 h-6" />;
      case 'database': return <Database className="w-6 h-6" />;
      case 'security_group': return <Shield className="w-6 h-6" />;
      case 'storage': return <HardDrive className="w-6 h-6" />;
      case 'resource_group': return <Monitor className="w-6 h-6" />;
      default: return <Server className="w-6 h-6" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'vpc': return 'from-blue-500 to-blue-600';
      case 'subnet': return 'from-green-500 to-green-600';
      case 'ec2': return 'from-orange-500 to-orange-600';
      case 'load_balancer': return 'from-purple-500 to-purple-600';
      case 'database': return 'from-indigo-500 to-indigo-600';
      case 'security_group': return 'from-red-500 to-red-600';
      case 'storage': return 'from-yellow-500 to-yellow-600';
      case 'resource_group': return 'from-cyan-500 to-cyan-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const calculateNodePosition = (index: number, total: number, type: string) => {
    const centerX = 200;
    const centerY = 200;
    
    // Different positioning strategies based on resource type
    switch (type) {
      case 'vpc':
      case 'resource_group':
        return { x: centerX, y: 100 }; // Top center
      case 'subnet':
        return { x: centerX, y: 160 }; // Below VPC
      case 'ec2':
        return { x: centerX - 60, y: 220 }; // Left of center
      case 'load_balancer':
        return { x: centerX + 60, y: 220 }; // Right of center
      case 'database':
        return { x: centerX, y: 280 }; // Bottom center
      case 'security_group':
        return { x: centerX - 100, y: 160 }; // Left side
      default:
        // Circular arrangement for other resources
        const angle = (index * 2 * Math.PI) / total;
        const radius = 80;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
    }
  };

  useEffect(() => {
    const nodes: VisualNode[] = deployedResources.map((resource, index) => {
      const position = calculateNodePosition(index, deployedResources.length, resource.type);
      return {
        id: resource.id,
        type: resource.type,
        name: resource.name,
        x: position.x,
        y: position.y,
        icon: getResourceIcon(resource.type),
        color: getResourceColor(resource.type),
        connections: resource.connections
      };
    });

    setVisualNodes(nodes);

    // Animate connections when new resources are added
    if (deployedResources.length > 0) {
      const latestResource = deployedResources[deployedResources.length - 1];
      setAnimatingConnections([latestResource.id]);
      setTimeout(() => setAnimatingConnections([]), 2000);
    }
  }, [deployedResources]);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    visualNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = visualNodes.find(n => n.id === connectionId);
        if (targetNode) {
          const isAnimating = animatingConnections.includes(node.id);
          connections.push(
            <motion.line
              key={`${node.id}-${connectionId}`}
              x1={node.x}
              y1={node.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isAnimating ? 0.8 : 0.4 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        }
      });
    });

    return connections;
  };

  const renderDataFlow = () => {
    if (visualNodes.length < 2) return null;

    return (
      <motion.circle
        r="3"
        fill="#10b981"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          cx: visualNodes.map(node => node.x),
          cy: visualNodes.map(node => node.y)
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-slate-900">Live Architecture</span>
          <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
            {deployedResources.length} resources
          </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {deployedResources.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Eye className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Architecture Preview</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                Complete the first step to see your infrastructure come to life!
              </p>
            </div>
          </div>
        ) : (
          // Architecture Diagram
          <div className="relative w-full h-full">
            {/* Background Grid */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Connections */}
              {renderConnections()}
              
              {/* Data Flow Animation */}
              {renderDataFlow()}
            </svg>

            {/* Resource Nodes */}
            <AnimatePresence>
              {visualNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: node.x, top: node.y }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${node.color} rounded-xl shadow-lg flex items-center justify-center text-white group hover:scale-110 transition-transform cursor-pointer`}>
                    {node.icon}
                  </div>
                  
                  {/* Resource Label */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white px-2 py-1 rounded shadow-md border border-slate-200">
                      <div className="text-xs font-medium text-slate-900">{node.type.toUpperCase()}</div>
                      <div className="text-xs text-slate-600">{node.name}</div>
                    </div>
                  </div>

                  {/* Pulse Animation for New Resources */}
                  {animatingConnections.includes(node.id) && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${node.color} rounded-xl`}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: 2 }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Provider Logo */}
            <div className="absolute top-4 right-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                scenario.provider === 'aws' ? 'bg-orange-100' :
                scenario.provider === 'azure' ? 'bg-blue-100' :
                'bg-green-100'
              }`}>
                {scenario.provider === 'aws' ? '🟠' :
                 scenario.provider === 'azure' ? '🔵' :
                 '🟢'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="text-xs text-slate-600 mb-2 font-medium">Resource Types:</div>
        <div className="flex flex-wrap gap-2">
          {['vpc', 'subnet', 'ec2', 'load_balancer'].map(type => (
            <div key={type} className="flex items-center space-x-1">
              <div className={`w-3 h-3 bg-gradient-to-br ${getResourceColor(type)} rounded`} />
              <span className="text-xs text-slate-600 capitalize">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveArchitectureVisualizer;
