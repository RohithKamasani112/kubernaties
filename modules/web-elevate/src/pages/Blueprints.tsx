import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
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
  Smartphone,
  Trophy,
  Zap,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const Blueprints: React.FC = () => {
  const { blueprints, startBlueprint } = useWebElevateStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Blueprints', icon: Target },
    { id: 'frontend', name: 'Frontend', icon: Code },
    { id: 'backend', name: 'Backend', icon: Server },
    { id: 'fullstack', name: 'Full-Stack', icon: Layers },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
  ];

  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesCategory = selectedCategory === 'all' || blueprint.category === selectedCategory;
    const matchesSearch = blueprint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blueprint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blueprint.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleStartBlueprint = (blueprintId: string) => {
    startBlueprint(blueprintId);
  };

  const getBlueprintIcon = (category: string) => {
    switch (category) {
      case 'frontend': return Code;
      case 'backend': return Server;
      case 'fullstack': return Layers;
      case 'mobile': return Smartphone;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
          Project Blueprints
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Apply your skills to real-world scenarios. Build complete projects that solve actual problems
          and showcase your expertise to potential employers.
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
              placeholder="Search blueprints, technologies..."
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

      {/* Featured Blueprint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Blueprint
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Build a Real-time Kanban Board
            </h2>
            <p className="text-purple-100 text-lg mb-6 max-w-2xl">
              Create a collaborative project management tool with drag-and-drop functionality, 
              real-time updates, and user authentication. Perfect for showcasing full-stack skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/web-elevate/blueprints/kanban-board"
                className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Building</span>
              </Link>
              <div className="flex items-center space-x-6 text-purple-100">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">15-20 Hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Intermediate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">Popular</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blueprints Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            All Blueprints ({filteredBlueprints.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlueprints.map((blueprint, index) => {
            const BlueprintIcon = getBlueprintIcon(blueprint.category);
            
            return (
              <motion.div
                key={blueprint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <BlueprintIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(blueprint.difficulty)}`}>
                        {blueprint.difficulty}
                      </span>
                      {!blueprint.isUnlocked && (
                        <span className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      )}
                      {blueprint.isStarted && (
                        <span className="text-xs text-blue-600 font-medium">In Progress</span>
                      )}
                      {blueprint.isCompleted && (
                        <span className="text-xs text-green-600 font-medium flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{blueprint.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blueprint.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blueprint.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {blueprint.technologies.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{blueprint.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  {blueprint.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{Math.round(blueprint.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${blueprint.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{blueprint.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{blueprint.deliverables.length} deliverables</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {blueprint.isUnlocked ? (
                    <Link
                      to={`/web-elevate/blueprints/${blueprint.id}`}
                      onClick={() => !blueprint.isStarted && handleStartBlueprint(blueprint.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      {blueprint.isStarted ? (
                        <>
                          <Target className="w-4 h-4" />
                          <span>Continue Blueprint</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Start Blueprint</span>
                        </>
                      )}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <div className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-500 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      <span>Complete Prerequisites</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredBlueprints.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Blueprints;
