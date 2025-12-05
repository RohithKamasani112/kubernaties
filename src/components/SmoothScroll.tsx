import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  speed?: number;
  enabled?: boolean;
}

/**
 * SmoothScroll Component
 * Provides buttery smooth scrolling experience with optimized performance
 */
const SmoothScroll: React.FC<SmoothScrollProps> = ({ 
  children, 
  speed = 0.8,
  enabled = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const currentScrollY = useRef(0);
  const targetScrollY = useRef(0);

  useEffect(() => {
    if (!enabled || !containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Set up smooth scrolling
    const setupSmoothScroll = () => {
      // Set container height to match content
      const updateHeight = () => {
        if (content) {
          container.style.height = `${content.offsetHeight}px`;
        }
      };

      updateHeight();

      // Handle scroll events
      const handleScroll = () => {
        targetScrollY.current = window.scrollY;
      };

      // Smooth animation loop
      const animate = () => {
        // Lerp (linear interpolation) for smooth movement
        currentScrollY.current += (targetScrollY.current - currentScrollY.current) * speed;

        // Apply transform with hardware acceleration
        if (content) {
          content.style.transform = `translate3d(0, ${-currentScrollY.current}px, 0)`;
        }

        // Continue animation if there's still movement
        if (Math.abs(targetScrollY.current - currentScrollY.current) > 0.1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      // Start animation loop
      const startAnimation = () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(animate);
      };

      // Event listeners
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateHeight, { passive: true });

      // Start the animation
      startAnimation();

      // Cleanup function
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateHeight);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    };

    const cleanup = setupSmoothScroll();

    return cleanup;
  }, [enabled, speed]);

  // If smooth scroll is disabled, render normally
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative">
      <div 
        ref={contentRef}
        className="fixed top-0 left-0 w-full"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
