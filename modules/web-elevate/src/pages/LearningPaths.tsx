import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Lock,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Code,
  Server,
  Layers,
  Zap
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const LearningPaths: React.FC = () => {
  const { learningPaths, startPath, initializeApp, isInitialized } = useWebElevateStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Initialize the app when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  const categories = [
    { id: 'all', name: 'All Paths', icon: BookOpen },
    { id: 'frontend', name: 'Front-End', icon: Code },
    { id: 'backend', name: 'Back-End', icon: Server },
    { id: 'fullstack', name: 'Full-Stack', icon: Layers },
  ];

  const filteredPaths = learningPaths.filter(path => {
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleStartPath = (pathId: string) => {
    startPath(pathId);
  };

  const getPathIcon = (category: string) => {
    switch (category) {
      case 'frontend': return Code;
      case 'backend': return Server;
      case 'fullstack': return Layers;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Path
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master web development through hands-on projects and interactive challenges.
          Each path is designed to take you from beginner to professional.
        </p>
      </motion.div>



      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search paths, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>



      {/* Learning Paths Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            All Learning Paths ({filteredPaths.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path, index) => {
            const PathIcon = getPathIcon(path.category);
            const isReact = path.id === 'react-mastery';
            const isComingSoon = !isReact;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`group bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 transform overflow-hidden ${
                  isReact
                    ? 'hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 cursor-pointer'
                    : 'opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="p-6 relative">
                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <motion.span
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 1, -1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                      >
                        🚀 Coming Soon
                      </motion.span>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-r ${path.color} rounded-lg flex items-center justify-center transition-transform duration-200 ${
                        isReact ? 'group-hover:scale-110' : ''
                      }`}
                      animate={isComingSoon ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={isComingSoon ? {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      } : {}}
                    >
                      <PathIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                      {path.isStarted && isReact && (
                        <span className="text-xs text-green-600 font-medium">In Progress</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{path.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {path.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {path.technologies.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{path.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{Math.round(path.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{path.modules.length} modules</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isReact ? (
                    <Link
                      to={`/web-elevate/paths/${path.id}`}
                      onClick={() => {
                        if (!path.isStarted) {
                          handleStartPath(path.id);
                        }
                      }}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        path.isStarted
                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {path.isStarted ? (
                        <>
                          <BookOpen className="w-4 h-4" />
                          <span>Continue Path</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Start Path</span>
                        </>
                      )}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.7, 0.9, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Coming Soon</span>
                      <Star className="w-4 h-4 animate-pulse" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No paths found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default LearningPaths;
