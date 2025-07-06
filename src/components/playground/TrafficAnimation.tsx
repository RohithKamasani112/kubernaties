import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Edge } from 'reactflow';

interface TrafficAnimationProps {
  nodes: Node[];
  edges: Edge[];
}

interface TrafficParticle {
  id: string;
  path: { x: number; y: number }[];
  currentIndex: number;
  type: 'request' | 'response';
  status: 'success' | 'error';
}

const TrafficAnimation: React.FC<TrafficAnimationProps> = ({ nodes, edges }) => {
  const [particles, setParticles] = useState<TrafficParticle[]>([]);

  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) {
      setParticles([]);
      return;
    }

    // Generate traffic simulation
    const interval = setInterval(() => {
      generateTrafficParticle();
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes, edges]);

  const generateTrafficParticle = () => {
    if (edges.length === 0) return;

    // Find a path from ingress/service to pods
    const ingressNodes = nodes.filter(n => n.data.componentType === 'ingress');
    const serviceNodes = nodes.filter(n => n.data.componentType === 'service');
    const podNodes = nodes.filter(n => n.data.componentType === 'pod' || n.data.componentType === 'deployment');

    let startNode = null;
    let endNode = null;

    if (ingressNodes.length > 0 && serviceNodes.length > 0) {
      startNode = ingressNodes[Math.floor(Math.random() * ingressNodes.length)];
      endNode = serviceNodes[Math.floor(Math.random() * serviceNodes.length)];
    } else if (serviceNodes.length > 0 && podNodes.length > 0) {
      startNode = serviceNodes[Math.floor(Math.random() * serviceNodes.length)];
      endNode = podNodes[Math.floor(Math.random() * podNodes.length)];
    }

    if (!startNode || !endNode) return;

    const path = [
      { x: startNode.position.x + 70, y: startNode.position.y + 30 },
      { x: endNode.position.x + 70, y: endNode.position.y + 30 }
    ];

    const particle: TrafficParticle = {
      id: `particle-${Date.now()}-${Math.random()}`,
      path,
      currentIndex: 0,
      type: 'request',
      status: Math.random() > 0.2 ? 'success' : 'error'
    };

    setParticles(prev => [...prev, particle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id));
    }, 3000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-3 h-3 rounded-full ${
              particle.status === 'success' 
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' 
                : 'bg-red-500 shadow-lg shadow-red-500/50'
            }`}
            initial={{ 
              x: particle.path[0].x, 
              y: particle.path[0].y,
              scale: 0.5,
              opacity: 0
            }}
            animate={{ 
              x: particle.path[particle.path.length - 1].x,
              y: particle.path[particle.path.length - 1].y,
              scale: 1,
              opacity: 1
            }}
            exit={{ 
              scale: 0,
              opacity: 0
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              scale: { duration: 0.2 },
              opacity: { duration: 0.2 }
            }}
          >
            {/* Trailing effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${
                particle.status === 'success' ? 'bg-emerald-300' : 'bg-red-300'
              }`}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TrafficAnimation;