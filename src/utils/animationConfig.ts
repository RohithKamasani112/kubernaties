/**
 * Animation Configuration
 * Centralized configuration for smooth, high-performance animations
 */

// Optimized easing curves for smooth animations
export const easingCurves = {
  // Standard smooth curve - best for most UI animations
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  
  // Bouncy curve - for playful interactions
  bouncy: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Sharp curve - for quick, snappy animations
  sharp: [0.4, 0, 0.2, 1] as const,
  
  // Gentle curve - for subtle animations
  gentle: [0.25, 0.1, 0.25, 1] as const,
  
  // Spring-like curve - for natural feeling animations
  spring: [0.175, 0.885, 0.32, 1.275] as const,
};

// Standard animation durations (in seconds)
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  medium: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

// Standard delays for staggered animations
export const delays = {
  none: 0,
  tiny: 0.05,
  small: 0.1,
  medium: 0.2,
  large: 0.3,
  huge: 0.5,
};

// Common animation variants for framer-motion
export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  scaleOut: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
  
  // Rotation animations
  rotateIn: {
    initial: { opacity: 0, rotate: -180, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.8 },
  },
  
  // Complex animations
  bounceIn: {
    initial: { opacity: 0, scale: 0.3, rotate: -120 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.3, rotate: 120 },
  },
  
  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
  
  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};

// Standard transition configurations
export const transitions = {
  // Smooth transition for most UI elements
  smooth: {
    duration: durations.normal,
    ease: easingCurves.smooth,
  },
  
  // Fast transition for quick interactions
  fast: {
    duration: durations.fast,
    ease: easingCurves.sharp,
  },
  
  // Bouncy transition for playful elements
  bouncy: {
    duration: durations.medium,
    ease: easingCurves.bouncy,
  },
  
  // Spring transition for natural feeling
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  
  // Gentle spring for subtle animations
  gentleSpring: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  
  // Stiff spring for snappy animations
  stiffSpring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
  },
};

// Hover and tap animations for interactive elements
export const interactionAnimations = {
  // Standard button hover
  buttonHover: {
    scale: 1.03,
    y: -2,
    transition: transitions.fast,
  },
  
  // Button tap
  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
  
  // Card hover
  cardHover: {
    scale: 1.02,
    y: -4,
    transition: transitions.smooth,
  },
  
  // Icon hover
  iconHover: {
    scale: 1.1,
    rotate: 5,
    transition: transitions.fast,
  },
  
  // Link hover
  linkHover: {
    scale: 1.05,
    transition: transitions.fast,
  },
};

// Performance optimization settings
export const performanceSettings = {
  // Will-change properties for different animation types
  willChange: {
    transform: "transform",
    opacity: "opacity",
    transformOpacity: "transform, opacity",
    all: "transform, opacity, filter",
  },
  
  // Hardware acceleration styles
  hardwareAcceleration: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
    perspective: 1000,
  },
  
  // Reduced motion settings
  reducedMotion: {
    duration: 0.01,
    transition: { duration: 0.01 },
  },
};

// Utility function to create optimized motion props
export const createMotionProps = (
  variant: keyof typeof animationVariants,
  transition?: keyof typeof transitions,
  delay?: number
) => ({
  ...animationVariants[variant],
  transition: {
    ...(transition ? transitions[transition] : transitions.smooth),
    delay: delay || 0,
  },
  style: performanceSettings.hardwareAcceleration,
});

// Utility function for responsive animations
export const createResponsiveAnimation = (
  mobileVariant: keyof typeof animationVariants,
  desktopVariant: keyof typeof animationVariants
) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return isMobile ? animationVariants[mobileVariant] : animationVariants[desktopVariant];
};

export default {
  easingCurves,
  durations,
  delays,
  animationVariants,
  transitions,
  interactionAnimations,
  performanceSettings,
  createMotionProps,
  createResponsiveAnimation,
};
