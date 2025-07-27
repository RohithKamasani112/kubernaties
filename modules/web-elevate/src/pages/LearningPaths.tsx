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
  Zap,
  Trophy,
  Target,
  Flame,
  Award,
  TrendingUp,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import GamificationPanel from '../components/GamificationPanel';

const LearningPaths: React.FC = () => {
  const { learningPaths, startPath, userProgress, awardPoints, updateStreak, initializeApp, isInitialized } = useWebElevateStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showGamificationPanel, setShowGamificationPanel] = React.useState(false);

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

      {/* Gamification Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Your Learning Journey</span>
            </h2>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">Level {userProgress.level}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Points */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-xl font-bold text-gray-900">{(userProgress?.totalPoints || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Learning Streak</p>
                  <p className="text-xl font-bold text-gray-900">{userProgress.learningStreak?.currentStreak || 0} days</p>
                </div>
              </div>
            </div>

            {/* Completed Modules */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">{userProgress?.completedModules?.length || 0} modules</p>
                </div>
              </div>
            </div>

            {/* Experience Progress */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Level Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((userProgress.experiencePoints || 0) / (userProgress.experienceToNextLevel || 100)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {userProgress.experiencePoints || 0}/{userProgress.experienceToNextLevel || 100}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                updateStreak();
                awardPoints(10, 'Daily check-in');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Gift className="w-4 h-4" />
              <span>Daily Check-in (+10 XP)</span>
            </button>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
              <Target className="w-4 h-4" />
              <span>Daily Challenge</span>
            </button>
            <button
              onClick={() => setShowGamificationPanel(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              <Award className="w-4 h-4" />
              <span>View Achievements</span>
            </button>
          </div>
        </div>
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

      {/* Featured Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Path
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              The Full-Stack Blueprint
            </h2>
            <p className="text-indigo-100 text-lg mb-6 max-w-2xl">
              Build a complete Kanban board application from React frontend to Node.js backend,
              including authentication, real-time updates, and deployment to the cloud.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/web-elevate/paths/fullstack-project"
                className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Building</span>
              </Link>
              <div className="flex items-center space-x-6 text-indigo-100">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">50+ Hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">1.2K Students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
            </div>
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
            
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${path.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <PathIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                      {path.isStarted && (
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

                  {/* Gamification Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span>{path.modules.length * 50} XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-purple-500" />
                      <span>{path.difficulty === 'beginner' ? '⭐' : path.difficulty === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-blue-500" />
                      <span>{Math.floor(path.modules.length / 3)} badges</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/web-elevate/paths/${path.id}`}
                    onClick={() => {
                      if (!path.isStarted) {
                        handleStartPath(path.id);
                        awardPoints(25, `Started ${path.title} learning path`);
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
                        <span>Start Path (+25 XP)</span>
                      </>
                    )}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
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

      {/* Gamification Panel */}
      <GamificationPanel
        isOpen={showGamificationPanel}
        onClose={() => setShowGamificationPanel(false)}
      />
    </div>
  );
};

export default LearningPaths;
