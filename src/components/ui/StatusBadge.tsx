import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Zap, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export type StatusType = 'under-development' | 'beta' | 'stable' | 'coming-soon' | 'experimental';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  animated = true,
  className = ''
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'under-development':
        return {
          label: 'Under Development',
          icon: Construction,
          colors: 'bg-orange-100 text-orange-700 border-orange-200',
          pulseColor: 'bg-orange-500'
        };
      case 'beta':
        return {
          label: 'Beta',
          icon: Zap,
          colors: 'bg-blue-100 text-blue-700 border-blue-200',
          pulseColor: 'bg-blue-500'
        };
      case 'stable':
        return {
          label: 'Stable',
          icon: CheckCircle,
          colors: 'bg-green-100 text-green-700 border-green-200',
          pulseColor: 'bg-green-500'
        };
      case 'coming-soon':
        return {
          label: 'Coming Soon',
          icon: Clock,
          colors: 'bg-purple-100 text-purple-700 border-purple-200',
          pulseColor: 'bg-purple-500'
        };
      case 'experimental':
        return {
          label: 'Experimental',
          icon: AlertTriangle,
          colors: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          pulseColor: 'bg-yellow-500'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertTriangle,
          colors: 'bg-gray-100 text-gray-700 border-gray-200',
          pulseColor: 'bg-gray-500'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'md':
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
      default:
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const Icon = config.icon;

  return (
    <motion.div
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${config.colors} ${sizeClasses.container} ${className}`}
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={animated ? { duration: 0.2 } : undefined}
    >
      <div className="relative">
        <Icon className={sizeClasses.icon} />
        {animated && (status === 'under-development' || status === 'beta') && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.pulseColor} opacity-20`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <span className={`font-semibold ${sizeClasses.text}`}>
        {config.label}
      </span>
    </motion.div>
  );
};

export default StatusBadge;
