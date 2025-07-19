import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer, ZoomIn, ZoomOut } from 'lucide-react';

interface PlaygroundTutorialAnimationsProps {
  showAnimations: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

const PlaygroundTutorialAnimations: React.FC<PlaygroundTutorialAnimationsProps> = ({
  showAnimations,
  onClose,
  isFirstTime = false
}) => {
  const [currentAnimation, setCurrentAnimation] = useState<'drag' | 'zoom'>('drag');
  const [animationCycle, setAnimationCycle] = useState(0);

  // For first-time users, show only drag animation and make it more subtle
  useEffect(() => {
    if (!showAnimations) return;

    if (isFirstTime) {
      // For first-time, only show drag animation
      setCurrentAnimation('drag');
      return;
    }

    const interval = setInterval(() => {
      setAnimationCycle(prev => prev + 1);
      setCurrentAnimation(prev => prev === 'drag' ? 'zoom' : 'drag');
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [showAnimations, isFirstTime]);

  if (!showAnimations) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[9999] pointer-events-none ${
          isFirstTime
            ? '' // No background overlay for first-time - keep interface fully visible
            : 'bg-black/20 backdrop-blur-sm flex items-center justify-center'
        }`}
      >
        {/* Close button - only show for manual tutorial */}
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg transition-all duration-200 pointer-events-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Drag and Drop Animation */}
        <AnimatePresence mode="wait">
          {currentAnimation === 'drag' && (
            <motion.div
              key="drag-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={isFirstTime ? "absolute inset-0" : "relative"}
            >
              {/* Realistic drag animation from sidebar to canvas */}
              {isFirstTime ? (
                // First-time subtle animation
                <>
                  {/* Subtle highlight on Pod component */}
                  <motion.div
                    className="absolute left-12 top-80 w-32 h-10 bg-blue-100/60 border-2 border-blue-300 rounded-md shadow-md z-[10000]"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0.5, 0]
                    }}
                    transition={{
                      duration: 4,
                      times: [0, 0.2, 0.8, 1],
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />

                  {/* Realistic dragged Pod component */}
                  <motion.div
                    className="absolute bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md shadow-lg flex items-center space-x-2 text-sm z-[10001]"
                    initial={{ x: 78, y: 335 }}
                    animate={{
                      x: [78, 200, 350, 500, 650],
                      y: [335, 330, 340, 350, 365],
                      rotate: [0, 2, -1, 1, 0]
                    }}
                    transition={{
                      duration: 4,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: [0.25, 0.46, 0.45, 0.94] // Natural easing
                    }}
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Pod</span>
                  </motion.div>

                  {/* Natural cursor movement */}
                  <motion.div
                    className="absolute pointer-events-none z-[10002]"
                    initial={{ x: 70, y: 325 }}
                    animate={{
                      x: [70, 190, 340, 490, 640],
                      y: [325, 320, 330, 340, 355]
                    }}
                    transition={{
                      duration: 4,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <MousePointer className="w-5 h-5 text-gray-700 drop-shadow-lg" />
                  </motion.div>

                  {/* Subtle canvas highlight */}
                  <motion.div
                    className="absolute right-20 top-72 w-40 h-24 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/60 z-[10000]"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0, 0.6, 0.6, 0]
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.5, 0.6, 0.9, 1],
                      repeat: Infinity,
                      repeatDelay: 0
                    }}
                  />

                  {/* Simple instruction text */}
                  <motion.div
                    className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 text-gray-600 px-4 py-2 rounded-lg text-sm shadow-md z-[10003] border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0.8, 0]
                    }}
                    transition={{
                      duration: 5,
                      times: [0, 0.1, 0.9, 1],
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    💡 Drag Pod from sidebar to canvas
                  </motion.div>
                </>
              ) : (
                // Manual tutorial - more prominent
                <>
                  {/* Component being dragged */}
                  <motion.div
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                    initial={{ x: -200, y: -100 }}
                    animate={{
                      x: [0, 150, 150],
                      y: [0, 0, 100]
                    }}
                    transition={{
                      duration: 3,
                      times: [0, 0.6, 1],
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <div className="w-4 h-4 bg-white/30 rounded"></div>
                    <span className="text-sm font-medium">Pod</span>
                  </motion.div>

                  {/* Cursor animation */}
                  <motion.div
                    className="absolute pointer-events-none"
                    initial={{ x: -220, y: -120 }}
                    animate={{
                      x: [0, 150, 150],
                      y: [0, 0, 100]
                    }}
                    transition={{
                      duration: 3,
                      times: [0, 0.6, 1],
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <MousePointer className="w-6 h-6 text-slate-700" />
                  </motion.div>

                  {/* Canvas representation */}
                  <motion.div
                    className="absolute top-20 left-20 w-64 h-40 border-2 border-dashed border-slate-400 rounded-lg bg-white/50"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-600 text-sm font-medium">Canvas</span>
                    </div>
                  </motion.div>

                  {/* Instruction text */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm font-medium text-slate-700 text-center">
                      Drag components from the sidebar to the canvas
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* Zoom Animation */}
          {currentAnimation === 'zoom' && (
            <motion.div
              key="zoom-animation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              {/* Canvas with zoom effect */}
              <motion.div
                className="w-64 h-40 border-2 border-slate-400 rounded-lg bg-white/80 relative overflow-hidden"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.3, 0.7, 1]
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.3, 0.7, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                {/* Sample components inside */}
                <div className="absolute top-4 left-4 w-8 h-6 bg-blue-400 rounded"></div>
                <div className="absolute top-4 right-4 w-8 h-6 bg-green-400 rounded"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-yellow-400 rounded"></div>
              </motion.div>

              {/* Zoom gesture indicators */}
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 4,
                  times: [0, 0.2, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                {/* Two finger gesture */}
                <motion.div
                  className="w-3 h-3 bg-slate-600 rounded-full"
                  animate={{ 
                    x: [-10, -15, -5, -10],
                    y: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
                <motion.div
                  className="w-3 h-3 bg-slate-600 rounded-full"
                  animate={{ 
                    x: [10, 15, 5, 10],
                    y: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              </motion.div>

              {/* Zoom icons */}
              <motion.div
                className="absolute -right-12 top-1/2 transform -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 0] }}
                transition={{
                  duration: 4,
                  times: [0, 0.3, 0.4, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                <ZoomIn className="w-6 h-6 text-green-600" />
              </motion.div>

              <motion.div
                className="absolute -right-12 top-1/2 transform -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 0] }}
                transition={{
                  duration: 4,
                  times: [0, 0.6, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                <ZoomOut className="w-6 h-6 text-red-600" />
              </motion.div>

              {/* Instruction text */}
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm font-medium text-slate-700 text-center">
                  Use two fingers to zoom in/out or mouse wheel
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animation indicator dots - only show for manual tutorial */}
        {!isFirstTime && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentAnimation === 'drag' ? 'bg-blue-500' : 'bg-white/50'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentAnimation === 'zoom' ? 'bg-blue-500' : 'bg-white/50'
            }`} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PlaygroundTutorialAnimations;
