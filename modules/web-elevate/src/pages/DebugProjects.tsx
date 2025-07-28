import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bug,
  Clock,
  Target,
  Play,
  CheckCircle,
  Star,
  Filter,
  Search,
  ArrowLeft,
  Trophy,
  Zap,
  Code,
  Globe,
  Database,
  Smartphone,
  Award,
  TrendingUp,
  Layers,
  Server,
  Cpu
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import { debugChallenges } from '../data/debugChallenges';



const DebugProjects: React.FC = () => {
  const { userProgress, getDebugProjectProgress, initializeApp, isInitialized } = useWebElevateStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTechStack, setSelectedTechStack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize the app when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  // Use imported debugging projects

  const difficulties = [
    { id: 'all', name: 'All Levels', icon: Target },
    { id: 'beginner', name: 'Beginner', icon: Star },
    { id: 'intermediate', name: 'Intermediate', icon: TrendingUp },
    { id: 'advanced', name: 'Advanced', icon: Trophy }
  ];

  const techStacks = [
    { id: 'all', name: 'All Tech Stacks', icon: Layers, color: 'text-gray-600' },
    { id: 'React', name: 'React', icon: Code, color: 'text-blue-600' },
    { id: 'Angular', name: 'Angular', icon: Globe, color: 'text-red-600' },
    { id: 'Node.js', name: 'Node.js', icon: Server, color: 'text-green-600' }
  ];

  const filteredChallenges = debugChallenges.filter(challenge => {
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const matchesTechStack = selectedTechStack === 'all' || challenge.techStack === selectedTechStack;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesTechStack && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '⭐';
      case 'intermediate': return '⭐⭐';
      case 'advanced': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Link
            to="/web-elevate/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
            <Bug className="w-10 h-10 text-red-500" />
            <span>Debug Challenges</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fix real-world bugs across React, Angular, and Node.js. Each challenge includes broken code, hints, and step-by-step guidance to help you master debugging.
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bug className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{debugChallenges.length}</p>
              <p className="text-sm text-gray-600">Total Challenges</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {debugChallenges.filter(c => {
                  try {
                    return getDebugProjectProgress(c.id)?.isCompleted;
                  } catch (error) {
                    return false;
                  }
                }).length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {debugChallenges.reduce((sum, c) => {
                  try {
                    return sum + (getDebugProjectProgress(c.id)?.isCompleted ? c.xpReward : 0);
                  } catch (error) {
                    return sum;
                  }
                }, 0)}
              </p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((debugChallenges.filter(c => {
                  try {
                    return getDebugProjectProgress(c.id)?.isCompleted;
                  } catch (error) {
                    return false;
                  }
                }).length / debugChallenges.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search challenges, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Tech Stack Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {techStacks.map((stack) => (
              <button
                key={stack.id}
                onClick={() => setSelectedTechStack(stack.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTechStack === stack.id
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <stack.icon className={`w-4 h-4 ${stack.color}`} />
                <span>{stack.name}</span>
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <difficulty.icon className="w-4 h-4" />
                <span>{difficulty.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Debug Challenges ({filteredChallenges.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => {
            let progress = null;
            let isCompleted = false;

            try {
              progress = getDebugProjectProgress(challenge.id);
              isCompleted = progress?.isCompleted || false;
            } catch (error) {
              console.warn('Error getting debug challenge progress:', error);
              progress = null;
              isCompleted = false;
            }

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                    challenge.techStack === 'React' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    challenge.techStack === 'Angular' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}>
                    <Bug className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyIcon(challenge.difficulty)} {challenge.difficulty}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      challenge.techStack === 'React' ? 'bg-blue-100 text-blue-700' :
                      challenge.techStack === 'Angular' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {challenge.techStack}
                    </span>
                    {isCompleted && (
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-green-600 font-medium flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                        {progress?.bestScore && (
                          <span className="text-xs text-blue-600 font-medium">
                            Best: {progress.bestScore}%
                          </span>
                        )}
                        {progress?.bestTime && (
                          <span className="text-xs text-purple-600 font-medium">
                            {progress.bestTime}min
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{challenge.description}</p>

                {/* Root Cause */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-red-800 mb-1">🐛 Root Cause:</p>
                  <p className="text-sm text-red-700">{challenge.rootCause}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {challenge.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {challenge.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{challenge.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{challenge.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{challenge.hints.length} hints</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/web-elevate/debug-challenge/${challenge.id}`}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Try Again</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Debugging</span>
                    </>
                  )}
                </Link>
              </div>
            </motion.div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DebugProjects;
