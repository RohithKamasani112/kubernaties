import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { LessonAnimation as LessonAnimationType } from '../../data/lessons';

interface LessonAnimationProps {
  animation: LessonAnimationType;
  onComplete?: () => void;
}

const LessonAnimation: React.FC<LessonAnimationProps> = ({ animation, onComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-start animation when component mounts
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
    }
  }, [hasStarted]);

  // Auto-advance scenes
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPlaying && currentScene < animation.scenes.length) {
      const scene = animation.scenes[currentScene];
      timeout = setTimeout(() => {
        if (currentScene < animation.scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
        } else {
          setIsPlaying(false);
          onComplete?.();
        }
      }, scene.duration);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, currentScene, animation.scenes, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    setHasStarted(false);
  };

  const currentSceneData = animation.scenes[currentScene];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4"
        >
          <Eye className="w-5 h-5 text-purple-600" />
          <span className="text-purple-800 font-medium">Interactive Animation</span>
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{animation.title}</h3>
        <p className="text-lg text-gray-600">{animation.description}</p>
      </div>

      {/* Animation Canvas */}
      <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-300 shadow-inner overflow-hidden">
        <div className="h-96 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center w-full"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <div className="inline-flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-800 font-medium text-sm">
                    Scene {currentScene + 1} of {animation.scenes.length}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-blue-900 mb-4">
                  {currentSceneData?.title}
                </h4>
                <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm max-w-2xl mx-auto">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentSceneData?.description}
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Visual Elements */}
              <motion.div
                className="flex justify-center items-center mt-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <KubernetesVisualElements sceneIndex={currentScene} animationTitle={animation.title} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-200 to-purple-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScene + 1) / animation.scenes.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Simplified Controls */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <button
          onClick={handlePlayPause}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scene Indicator */}
      <div className="text-center mt-4">
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <div className="flex space-x-1">
            {animation.scenes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentScene ? 'bg-blue-500' :
                  index < currentScene ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {currentScene + 1} of {animation.scenes.length}
          </span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Visual Elements Component
const KubernetesVisualElements: React.FC<{ sceneIndex: number; animationTitle: string }> = ({ sceneIndex, animationTitle }) => {
  // Different visual sets based on animation title
  const getVisualElements = () => {
    if (animationTitle.includes('Monolith') || animationTitle.includes('Container')) {
      return [
        { icon: '🏢', label: 'Monolith', color: 'from-red-400 to-red-600' },
        { icon: '📦', label: 'Container', color: 'from-blue-400 to-blue-600' },
        { icon: '🎯', label: 'Orchestration', color: 'from-yellow-400 to-yellow-600' },
        { icon: '⚓', label: 'Kubernetes', color: 'from-green-400 to-green-600' },
        { icon: '✨', label: 'Benefits', color: 'from-purple-400 to-purple-600' }
      ];
    } else if (animationTitle.includes('Cooking') || animationTitle.includes('Recipe')) {
      return [
        { icon: '👨‍🍳', label: 'Chef Instructions', color: 'from-orange-400 to-orange-600' },
        { icon: '📖', label: 'Recipe Book', color: 'from-blue-400 to-blue-600' },
        { icon: '🔧', label: 'Self-Healing', color: 'from-green-400 to-green-600' },
        { icon: '📚', label: 'Version Control', color: 'from-purple-400 to-purple-600' }
      ];
    } else if (animationTitle.includes('Blueprint') || animationTitle.includes('YAML')) {
      return [
        { icon: '📋', label: 'Blueprint', color: 'from-blue-400 to-blue-600' },
        { icon: '⚖️', label: 'Spec vs Status', color: 'from-green-400 to-green-600' },
        { icon: '🔄', label: 'Reconciliation', color: 'from-yellow-400 to-yellow-600' },
        { icon: '📄', label: 'YAML', color: 'from-purple-400 to-purple-600' },
        { icon: '🗂️', label: 'Git Repository', color: 'from-indigo-400 to-indigo-600' }
      ];
    } else if (animationTitle.includes('Toy') || animationTitle.includes('Label')) {
      return [
        { icon: '🧸', label: 'Unorganized Toys', color: 'from-red-400 to-red-600' },
        { icon: '🏷️', label: 'Labels', color: 'from-blue-400 to-blue-600' },
        { icon: '🎯', label: 'Selectors', color: 'from-green-400 to-green-600' },
        { icon: '📝', label: 'Annotations', color: 'from-purple-400 to-purple-600' }
      ];
    } else {
      // Default Kubernetes elements
      return [
        { icon: '⚓', label: 'Kubernetes', color: 'from-blue-400 to-blue-600' },
        { icon: '📦', label: 'Pod', color: 'from-green-400 to-green-600' },
        { icon: '🔧', label: 'Service', color: 'from-yellow-400 to-yellow-600' },
        { icon: '🎯', label: 'Deployment', color: 'from-purple-400 to-purple-600' }
      ];
    }
  };

  const elements = getVisualElements();
  const currentElement = elements[sceneIndex] || elements[0];

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        key={`${sceneIndex}-${animationTitle}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentElement.color} flex items-center justify-center text-4xl shadow-lg`}
      >
        {currentElement.icon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          {currentElement.label}
        </span>
      </motion.div>
    </div>
  );
};

export default LessonAnimation;
