import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * Provides high-quality image rendering with lazy loading and performance optimizations
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 'high',
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Quality-based rendering settings
  const getQualitySettings = () => {
    switch (quality) {
      case 'ultra':
        return {
          imageRendering: '-webkit-optimize-contrast',
          filter: 'contrast(1.02) saturate(1.05)',
        };
      case 'high':
        return {
          imageRendering: '-webkit-optimize-contrast',
          filter: 'contrast(1.01) saturate(1.02)',
        };
      case 'medium':
        return {
          imageRendering: 'auto',
        };
      case 'low':
        return {
          imageRendering: 'auto',
          filter: 'blur(0.5px)',
        };
      default:
        return {};
    }
  };

  const qualityStyles = getQualitySettings();

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px) brightness(0.9)',
          }}
        />
      )}

      {/* Main Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500`}
          style={{
            ...qualityStyles,
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-slate-400 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-slate-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
