import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Edge } from 'reactflow';
import { 
  Minimize2, 
  Maximize2, 
  Eye, 
  EyeOff,
  Box,
  Layers,
  Network,
  Route,
  FileText,
  Lock,
  HardDrive,
  Settings
} from 'lucide-react';

interface MiniCanvasOverviewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
  onViewportChange?: (viewport: { x: number; y: number; zoom: number }) => void;
}

const MiniCanvasOverview: React.FC<MiniCanvasOverviewProps> = ({
  nodes,
  edges,
  onNodeClick,
  onViewportChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const miniCanvasRef = useRef<HTMLDivElement>(null);

  // Calculate bounds of all nodes
  const calculateBounds = () => {
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 200, maxY: 150 };
    }

    const positions = nodes.map(node => ({
      x: node.position.x,
      y: node.position.y
    }));

    const minX = Math.min(...positions.map(p => p.x)) - 50;
    const minY = Math.min(...positions.map(p => p.y)) - 50;
    const maxX = Math.max(...positions.map(p => p.x)) + 100;
    const maxY = Math.max(...positions.map(p => p.y)) + 100;

    return { minX, minY, maxX, maxY };
  };

  const bounds = calculateBounds();
  const canvasWidth = bounds.maxX - bounds.minX;
  const canvasHeight = bounds.maxY - bounds.minY;

  // Scale factor for mini canvas
  const miniWidth = isExpanded ? 300 : 180;
  const miniHeight = isExpanded ? 200 : 120;
  const scaleX = miniWidth / canvasWidth;
  const scaleY = miniHeight / canvasHeight;
  const scale = Math.min(scaleX, scaleY, 0.3);

  const getNodeIcon = (componentType: string) => {
    const icons: Record<string, any> = {
      pod: Box,
      deployment: Layers,
      service: Network,
      ingress: Route,
      configmap: FileText,
      secret: Lock,
      pvc: HardDrive,
      statefulset: Settings,
    };
    return icons[componentType] || Box;
  };

  const getNodeColor = (componentType: string) => {
    const colors: Record<string, string> = {
      pod: '#3b82f6',
      deployment: '#10b981',
      service: '#8b5cf6',
      ingress: '#f59e0b',
      configmap: '#06b6d4',
      secret: '#ef4444',
      pvc: '#6366f1',
      statefulset: '#84cc16',
    };
    return colors[componentType] || '#6b7280';
  };

  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };

  if (!isVisible) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          onClick={() => setIsVisible(true)}
          className="w-12 h-12 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-105"
          title="Show Mini Canvas"
        >
          <Eye className="w-5 h-5 text-slate-600" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700">
              Canvas Overview
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded transition-colors"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3 h-3 text-slate-600" />
              ) : (
                <Maximize2 className="w-3 h-3 text-slate-600" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded transition-colors"
              title="Hide Overview"
            >
              <EyeOff className="w-3 h-3 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Mini Canvas */}
        <div
          ref={miniCanvasRef}
          className="relative bg-slate-50 overflow-hidden cursor-pointer"
          style={{ width: miniWidth, height: miniHeight }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
              `,
              backgroundSize: `${20 * scale}px ${20 * scale}px`
            }}
          />

          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode) return null;

              const sourceX = (sourceNode.position.x - bounds.minX) * scale + 8;
              const sourceY = (sourceNode.position.y - bounds.minY) * scale + 8;
              const targetX = (targetNode.position.x - bounds.minX) * scale + 8;
              const targetY = (targetNode.position.y - bounds.minY) * scale + 8;

              return (
                <line
                  key={edge.id}
                  x1={sourceX}
                  y1={sourceY}
                  x2={targetX}
                  y2={targetY}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const x = (node.position.x - bounds.minX) * scale;
            const y = (node.position.y - bounds.minY) * scale;
            const Icon = getNodeIcon(node.data.componentType);
            const color = getNodeColor(node.data.componentType);

            return (
              <motion.div
                key={node.id}
                className="absolute cursor-pointer group"
                style={{
                  left: x,
                  top: y,
                  width: 16,
                  height: 16,
                }}
                onClick={() => handleNodeClick(node.id)}
                whileHover={{ scale: 1.2 }}
                title={`${node.data.label} (${node.data.componentType})`}
              >
                <div
                  className="w-full h-full rounded-sm flex items-center justify-center shadow-sm border border-white group-hover:shadow-md transition-all"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>
              </motion.div>
            );
          })}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Box className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">No components</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>{nodes.length} components</span>
            <span>{edges.length} connections</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniCanvasOverview;
