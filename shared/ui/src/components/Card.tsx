import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hoverable?: boolean;
  animated?: boolean;
}

const cardVariants = {
  default: 'bg-white border border-slate-200',
  elevated: 'bg-white shadow-lg border border-slate-100',
  outlined: 'bg-transparent border-2 border-slate-300',
  filled: 'bg-slate-50 border border-slate-200',
};

const cardPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const cardRounded = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hoverable = false,
  animated = true,
  className,
  ...props
}) => {
  const CardComponent = animated ? motion.div : 'div';
  
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    ...(hoverable && {
      whileHover: { 
        y: -4,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      transition: { duration: 0.2 }
    })
  } : {};

  return (
    <CardComponent
      className={cn(
        'transition-all duration-200',
        cardVariants[variant],
        cardPadding[padding],
        cardRounded[rounded],
        hoverable && 'cursor-pointer',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

// Card sub-components
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn('text-lg font-semibold text-slate-900', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn('text-sm text-slate-600 mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('mt-4 pt-4 border-t border-slate-200', className)} {...props}>
    {children}
  </div>
);
