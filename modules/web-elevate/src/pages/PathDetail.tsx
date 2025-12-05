import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Lock,
  CheckCircle,
  Clock,
  BookOpen,
  Code,
  Target,
  Zap,
  Users,
  Star,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const PathDetail: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { learningPaths, userProgress, startPath } = useWebElevateStore();
  
  const path = learningPaths.find(p => p.id === pathId);

  if (!path) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Path Not Found</h1>
          <Link
            to="/web-elevate/paths"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  const getModuleIcon = (module: any) => {
    if (module.isCompleted) return CheckCircle;
    if (module.isInProgress) return RotateCcw;
    if (module.isLocked) return Lock;
    return Play;
  };

  const getModuleIconColor = (module: any) => {
    if (module.isCompleted) return 'text-green-600';
    if (module.isInProgress) return 'text-blue-600';
    if (module.isLocked) return 'text-gray-400';
    return 'text-indigo-600';
  };

  const getModuleStatus = (module: any) => {
    if (module.isCompleted) return 'Completed';
    if (module.isInProgress) return 'In Progress';
    if (module.isLocked) return 'Locked';
    return 'Ready to Start';
  };

  const handleStartPath = () => {
    if (!path.isStarted) {
      startPath(path.id);
    }
  };

  const nextModule = path.modules.find(m => !m.isCompleted && !m.isLocked);
  const completedModules = path.modules.filter(m => m.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/web-elevate/paths"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Paths</span>
        </Link>
      </motion.div>

      {/* Path Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-xl flex items-center justify-center`}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{path.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {path.difficulty}
                  </span>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {path.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-6">{path.description}</p>

            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Technologies You'll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {path.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{path.modules.length}</div>
                <div className="text-sm text-gray-500">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{path.duration}</div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{completedModules}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.round(path.progress)}%</div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            {path.progress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Overall Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(path.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${path.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Action Panel */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-6">
              {path.isStarted ? (
                <div className="space-y-4">
                  {nextModule ? (
                    <Link
                      to={`/web-elevate/paths/${path.id}/modules/${nextModule.id}`}
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      <span>Continue Learning</span>
                    </Link>
                  ) : (
                    <div className="text-center">
                      <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Congratulations!
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        You've completed this learning path.
                      </p>
                      <Link
                        to="/web-elevate/portfolio"
                        className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        <Trophy className="w-5 h-5" />
                        <span>View Certificate</span>
                      </Link>
                    </div>
                  )}
                  
                  <Link
                    to="/web-elevate/playground"
                    className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Code className="w-5 h-5" />
                    <span>Open Playground</span>
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Begin your journey and start building real projects.
                  </p>
                  <button
                    onClick={handleStartPath}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Path</span>
                  </button>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium text-gray-900 capitalize">{path.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900 capitalize">{path.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{path.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modules List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Modules</h2>
        
        <div className="space-y-4">
          {path.modules.map((module, index) => {
            const ModuleIcon = getModuleIcon(module);
            const iconColor = getModuleIconColor(module);
            const isClickable = !module.isLocked;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                  isClickable 
                    ? 'hover:shadow-md hover:border-indigo-200 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {isClickable ? (
                  <Link
                    to={`/web-elevate/paths/${path.id}/modules/${module.id}`}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ModuleIcon className={`w-5 h-5 ${iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {module.title}
                        </h3>
                        <span className={`text-sm font-medium ${iconColor}`}>
                          {getModuleStatus(module)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{module.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span className="capitalize">{module.type}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ModuleIcon className={`w-5 h-5 ${iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {module.title}
                        </h3>
                        <span className={`text-sm font-medium ${iconColor}`}>
                          {getModuleStatus(module)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{module.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span className="capitalize">{module.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PathDetail;
