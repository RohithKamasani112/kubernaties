import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Globe, 
  ArrowRight, 
  Box, 
  Network,
  HardDrive,
  Settings,
  Shield,
  Zap
} from 'lucide-react';

interface ArchitectureDiagramProps {
  type: string;
  components: string[];
  flow: string[];
  animated?: boolean;
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ 
  type, 
  components, 
  flow, 
  animated = true 
}) => {
  const getIcon = (component: string) => {
    const comp = component.toLowerCase();
    if (comp.includes('pod') || comp.includes('container')) return Box;
    if (comp.includes('service') || comp.includes('nodeport') || comp.includes('clusterip')) return Network;
    if (comp.includes('database') || comp.includes('storage') || comp.includes('pvc') || comp.includes('pv')) return Database;
    if (comp.includes('nginx') || comp.includes('web') || comp.includes('frontend')) return Globe;
    if (comp.includes('backend') || comp.includes('api')) return Server;
    if (comp.includes('config') || comp.includes('secret')) return Settings;
    if (comp.includes('volume') || comp.includes('disk')) return HardDrive;
    if (comp.includes('security') || comp.includes('rbac')) return Shield;
    return Zap;
  };

  const getColor = (component: string) => {
    const comp = component.toLowerCase();
    if (comp.includes('pod') || comp.includes('container')) return 'bg-blue-100 text-blue-600 border-blue-200';
    if (comp.includes('service')) return 'bg-green-100 text-green-600 border-green-200';
    if (comp.includes('database') || comp.includes('storage')) return 'bg-purple-100 text-purple-600 border-purple-200';
    if (comp.includes('nginx') || comp.includes('web')) return 'bg-orange-100 text-orange-600 border-orange-200';
    if (comp.includes('backend') || comp.includes('api')) return 'bg-red-100 text-red-600 border-red-200';
    if (comp.includes('config') || comp.includes('secret')) return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const renderSinglePod = () => (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <Globe className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm text-gray-600">User</span>
        </div>
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </motion.div>
        
        <motion.div
          className="flex flex-col items-center p-4 border-2 border-blue-200 rounded-lg bg-blue-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box className="w-12 h-12 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-blue-800">NGINX Pod</span>
          <span className="text-xs text-blue-600">Port 80</span>
        </motion.div>
      </motion.div>
      
      {animated && (
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{
            x: [0, 100, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );

  const renderNodePortService = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <Globe className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm text-gray-600">External User</span>
        </div>
        
        <ArrowRight className="w-6 h-6 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-4 border-2 border-green-200 rounded-lg bg-green-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Network className="w-12 h-12 text-green-600 mb-2" />
          <span className="text-sm font-medium text-green-800">NodePort Service</span>
          <span className="text-xs text-green-600">Port 30080</span>
        </motion.div>
        
        <ArrowRight className="w-6 h-6 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-4 border-2 border-blue-200 rounded-lg bg-blue-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box className="w-12 h-12 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-blue-800">NGINX Pod</span>
          <span className="text-xs text-blue-600">Port 80</span>
        </motion.div>
      </div>
      
      {animated && (
        <motion.div
          className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Traffic Flow: External → Node:30080 → Service → Pod:80
        </motion.div>
      )}
    </div>
  );

  const renderClusterIPLoadBalancer = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <Server className="w-8 h-8 text-purple-500 mb-2" />
          <span className="text-sm text-gray-600">Internal Service</span>
        </div>
        
        <ArrowRight className="w-6 h-6 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-4 border-2 border-green-200 rounded-lg bg-green-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Network className="w-12 h-12 text-green-600 mb-2" />
          <span className="text-sm font-medium text-green-800">ClusterIP Service</span>
          <span className="text-xs text-green-600">Load Balancer</span>
        </motion.div>
        
        <ArrowRight className="w-6 h-6 text-gray-400" />
        
        <div className="flex flex-col space-y-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="flex items-center p-2 border border-blue-200 rounded bg-blue-50"
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
            >
              <Box className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-xs text-blue-800">Pod {i}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {animated && (
        <motion.div
          className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Round-robin load balancing across 3 healthy pods
        </motion.div>
      )}
    </div>
  );

  const renderFrontendBackend = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <Globe className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm text-gray-600">User</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-3 border-2 border-orange-200 rounded-lg bg-orange-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Globe className="w-10 h-10 text-orange-600 mb-1" />
          <span className="text-xs font-medium text-orange-800">Frontend</span>
          <span className="text-xs text-orange-600">React</span>
        </motion.div>
        
        <ArrowRight className="w-4 h-4 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-3 border-2 border-red-200 rounded-lg bg-red-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Server className="w-10 h-10 text-red-600 mb-1" />
          <span className="text-xs font-medium text-red-800">Backend</span>
          <span className="text-xs text-red-600">Flask API</span>
        </motion.div>
      </div>
      
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-2">Internal DNS Resolution</div>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">backend-service:5000</code>
      </div>
      
      {animated && (
        <motion.div
          className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          API calls via Kubernetes internal DNS
        </motion.div>
      )}
    </div>
  );

  const renderPersistentVolume = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-4">
        <motion.div
          className="flex flex-col items-center p-3 border-2 border-blue-200 rounded-lg bg-blue-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="w-10 h-10 text-blue-600 mb-1" />
          <span className="text-xs font-medium text-blue-800">App Pod</span>
          <span className="text-xs text-blue-600">/data mount</span>
        </motion.div>
        
        <ArrowRight className="w-4 h-4 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-3 border-2 border-purple-200 rounded-lg bg-purple-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Settings className="w-10 h-10 text-purple-600 mb-1" />
          <span className="text-xs font-medium text-purple-800">PVC</span>
          <span className="text-xs text-purple-600">1Gi</span>
        </motion.div>
        
        <ArrowRight className="w-4 h-4 text-gray-400" />
        
        <motion.div
          className="flex flex-col items-center p-3 border-2 border-green-200 rounded-lg bg-green-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <HardDrive className="w-10 h-10 text-green-600 mb-1" />
          <span className="text-xs font-medium text-green-800">PV</span>
          <span className="text-xs text-green-600">Storage</span>
        </motion.div>
      </div>
      
      {animated && (
        <motion.div
          className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Data persists across pod restarts
        </motion.div>
      )}
    </div>
  );

  const renderDiagram = () => {
    switch (type) {
      case 'single-pod':
        return renderSinglePod();
      case 'nodeport-service':
        return renderNodePortService();
      case 'clusterip-loadbalancer':
        return renderClusterIPLoadBalancer();
      case 'frontend-backend':
        return renderFrontendBackend();
      case 'persistent-volume':
        return renderPersistentVolume();
      default:
        return (
          <div className="flex items-center space-x-4">
            {components.map((component, index) => {
              const Icon = getIcon(component);
              return (
                <React.Fragment key={component}>
                  <motion.div
                    className={`flex flex-col items-center p-3 border-2 rounded-lg ${getColor(component)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Icon className="w-8 h-8 mb-1" />
                    <span className="text-xs font-medium">{component}</span>
                  </motion.div>
                  {index < components.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Architecture Diagram</h4>
        {renderDiagram()}
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
