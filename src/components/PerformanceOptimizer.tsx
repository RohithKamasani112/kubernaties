import React, { useEffect } from 'react';

/**
 * Performance Optimizer Component
 * Applies global optimizations for smooth animations and high-quality rendering
 */
const PerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    // Enable hardware acceleration for smooth animations
    const enableHardwareAcceleration = () => {
      const style = document.createElement('style');
      style.textContent = `
        /* Global performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Hardware acceleration for animated elements */
        [class*="motion-"], 
        [class*="animate-"],
        .framer-motion-element {
          transform: translateZ(0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* High-quality image rendering */
        img, 
        picture, 
        svg {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        /* Optimize text rendering */
        body, 
        h1, h2, h3, h4, h5, h6, 
        p, span, div {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* Optimize for high DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          img, picture, svg {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Apply optimizations
    enableHardwareAcceleration();

    // Optimize for 60fps animations
    const optimizeAnimationFrame = () => {
      let ticking = false;
      
      const updateAnimations = () => {
        // Force repaint for smooth animations
        document.body.style.transform = 'translateZ(0)';
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateAnimations);
          ticking = true;
        }
      };

      // Listen for scroll events to optimize performance
      window.addEventListener('scroll', requestTick, { passive: true });
      window.addEventListener('resize', requestTick, { passive: true });

      return () => {
        window.removeEventListener('scroll', requestTick);
        window.removeEventListener('resize', requestTick);
      };
    };

    const cleanup = optimizeAnimationFrame();

    // Preload critical fonts for better text rendering
    const preloadFonts = () => {
      // Skip font preloading for now since we don't have actual font URLs
      // This prevents the invalid href errors
      console.log('Font preloading skipped - using system fonts');
    };

    preloadFonts();

    return cleanup;
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
