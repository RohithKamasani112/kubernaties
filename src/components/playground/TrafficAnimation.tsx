import React, { useEffect, useState, useCallback } from 'react';
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
  sourceId: string;
  targetId: string;
  routePath: string[];
}

interface TrafficRoute {
  path: string[];
  coordinates: { x: number; y: number }[];
}

const TrafficAnimation: React.FC<TrafficAnimationProps> = ({ nodes, edges }) => {
  const [particles, setParticles] = useState<TrafficParticle[]>([]);
  const [podLoadBalancer, setPodLoadBalancer] = useState<Record<string, number>>({});

  // Get node center coordinates with proper bounds checking
  const getNodeCenter = useCallback((nodeId: string): { x: number; y: number } | null => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    // Calculate center based on node dimensions (assuming standard node size)
    const nodeWidth = 140; // Standard node width
    const nodeHeight = 80; // Standard node height

    return {
      x: node.position.x + nodeWidth / 2,
      y: node.position.y + nodeHeight / 2
    };
  }, [nodes]);

  // Find valid traffic routes following actual connections
  const findTrafficRoutes = useCallback((): TrafficRoute[] => {
    const routes: TrafficRoute[] = [];

    // Find entry points (ingress or services without incoming connections)
    const entryPoints = nodes.filter(node => {
      const hasIncomingEdges = edges.some(edge => edge.target === node.id);
      return (node.data.componentType === 'ingress') ||
             (node.data.componentType === 'service' && !hasIncomingEdges);
    });

    // For each entry point, find all possible paths to pods
    entryPoints.forEach(entryNode => {
      const visited = new Set<string>();
      const findPaths = (currentNodeId: string, currentPath: string[]): void => {
        if (visited.has(currentNodeId)) return;
        visited.add(currentNodeId);

        const currentNode = nodes.find(n => n.id === currentNodeId);
        if (!currentNode) return;

        // If we reached a pod or deployment, this is a valid endpoint
        if (['pod', 'deployment'].includes(currentNode.data.componentType)) {
          const coordinates = currentPath.map(nodeId => getNodeCenter(nodeId)).filter(Boolean) as { x: number; y: number }[];
          if (coordinates.length > 1) {
            routes.push({ path: [...currentPath], coordinates });
          }
          return;
        }

        // Continue following outgoing edges
        const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);
        outgoingEdges.forEach(edge => {
          findPaths(edge.target, [...currentPath, edge.target]);
        });
      };

      findPaths(entryNode.id, [entryNode.id]);
    });

    return routes;
  }, [nodes, edges, getNodeCenter]);

  // Load balancer for distributing traffic among pods
  const selectTargetPod = useCallback((serviceId: string, availablePods: string[]): string => {
    if (availablePods.length === 0) return '';
    if (availablePods.length === 1) return availablePods[0];

    // Round-robin load balancing
    const currentIndex = podLoadBalancer[serviceId] || 0;
    const selectedPod = availablePods[currentIndex % availablePods.length];

    setPodLoadBalancer(prev => ({
      ...prev,
      [serviceId]: (currentIndex + 1) % availablePods.length
    }));

    return selectedPod;
  }, [podLoadBalancer]);

  const generateTrafficParticle = useCallback(() => {
    const routes = findTrafficRoutes();
    if (routes.length === 0) return;

    // Select a random route
    const selectedRoute = routes[Math.floor(Math.random() * routes.length)];

    // For services connected to multiple pods, use load balancing
    const lastNodeId = selectedRoute.path[selectedRoute.path.length - 1];
    const lastNode = nodes.find(n => n.id === lastNodeId);

    let finalRoute = selectedRoute;

    // If the last node is a service, find connected pods and load balance
    if (lastNode?.data.componentType === 'service') {
      const connectedPods = edges
        .filter(edge => edge.source === lastNodeId)
        .map(edge => edge.target)
        .filter(targetId => {
          const targetNode = nodes.find(n => n.id === targetId);
          return targetNode?.data.componentType === 'pod' || targetNode?.data.componentType === 'deployment';
        });

      if (connectedPods.length > 0) {
        const selectedPod = selectTargetPod(lastNodeId, connectedPods);
        if (selectedPod) {
          const podCenter = getNodeCenter(selectedPod);
          if (podCenter) {
            finalRoute = {
              path: [...selectedRoute.path, selectedPod],
              coordinates: [...selectedRoute.coordinates, podCenter]
            };
          }
        }
      }
    }

    if (finalRoute.coordinates.length < 2) return;

    const particle: TrafficParticle = {
      id: `particle-${Date.now()}-${Math.random()}`,
      path: finalRoute.coordinates,
      currentIndex: 0,
      type: 'request',
      status: Math.random() > 0.15 ? 'success' : 'error', // 85% success rate
      sourceId: finalRoute.path[0],
      targetId: finalRoute.path[finalRoute.path.length - 1],
      routePath: finalRoute.path
    };

    setParticles(prev => [...prev, particle]);

    // Remove particle after animation completes
    const animationDuration = Math.max(2000, finalRoute.coordinates.length * 800);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id));
    }, animationDuration + 1000);
  }, [nodes, edges, findTrafficRoutes, selectTargetPod, getNodeCenter]);

  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) {
      setParticles([]);
      return;
    }

    // Generate traffic simulation with varying intervals
    const interval = setInterval(() => {
      generateTrafficParticle();
    }, 1500 + Math.random() * 1000); // Random interval between 1.5-2.5 seconds

    return () => clearInterval(interval);
  }, [generateTrafficParticle]);

  // Create smooth path animation through multiple waypoints
  const createPathAnimation = (path: { x: number; y: number }[]) => {
    if (path.length < 2) return {};

    const pathString = path.map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    }).join(' ');

    return {
      x: path.map(p => p.x),
      y: path.map(p => p.y),
      pathString
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Traffic path visualization */}
      <svg className="absolute inset-0 w-full h-full">
        {findTrafficRoutes().map((route, index) => (
          <motion.path
            key={`route-${index}`}
            d={createPathAnimation(route.coordinates).pathString}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <AnimatePresence>
        {particles.map((particle) => {
          const pathAnimation = createPathAnimation(particle.path);
          const duration = Math.max(1.5, particle.path.length * 0.6);

          return (
            <motion.div
              key={particle.id}
              className={`absolute w-3 h-3 rounded-full z-10 ${
                particle.status === 'success'
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                  : 'bg-red-500 shadow-lg shadow-red-500/50'
              }`}
              initial={{
                x: particle.path[0].x - 6, // Center the dot
                y: particle.path[0].y - 6,
                scale: 0.3,
                opacity: 0
              }}
              animate={{
                x: pathAnimation.x?.map(x => x - 6) || [particle.path[0].x - 6],
                y: pathAnimation.y?.map(y => y - 6) || [particle.path[0].y - 6],
                scale: [0.3, 1, 1, 0.8],
                opacity: [0, 1, 1, 0]
              }}
              exit={{
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration,
                ease: "easeInOut",
                times: [0, 0.1, 0.9, 1]
              }}
            >
              {/* Pulsing effect for active traffic */}
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  particle.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                }`}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />

              {/* Core particle */}
              <div className={`w-full h-full rounded-full ${
                particle.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
              }`} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TrafficAnimation;