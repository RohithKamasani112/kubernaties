import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Play,
  ArrowRight,
  Star,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const Dashboard: React.FC = () => {
  const { learningPaths, userProgress, initializeApp, isInitialized } = useWebElevateStore();

  // Initialize the app when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  const stats = [
    {
      label: 'Learning Paths',
      value: learningPaths.filter(p => p.isStarted).length,
      total: learningPaths.length,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Modules Completed',
      value: userProgress.completedModules.length,
      total: learningPaths.reduce((acc, path) => acc + path.modules.length, 0),
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Current Streak',
      value: userProgress.streak,
      total: null,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Total Hours',
      value: userProgress.totalHours,
      total: null,
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentActivity = [
    {
      type: 'completed',
      title: 'Completed "React Components" module',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'started',
      title: 'Started "State Management" challenge',
      time: '1 day ago',
      icon: Play,
      color: 'text-blue-600'
    },
    {
      type: 'achievement',
      title: 'Earned "First Steps" achievement',
      time: '2 days ago',
      icon: Trophy,
      color: 'text-yellow-600'
    }
  ];

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current path',
      icon: Play,
      href: '/web-elevate/paths/react-fundamentals',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Browse Paths',
      description: 'Explore all learning paths',
      icon: BookOpen,
      href: '/web-elevate/paths',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Debug Challenges',
      description: 'Fix bugs and improve skills',
      icon: Zap,
      href: '/web-elevate/debug-projects',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Open Playground',
      description: 'Start coding immediately',
      icon: Code,
      href: '/web-elevate/playground',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'View Portfolio',
      description: 'See your achievements',
      icon: Trophy,
      href: '/web-elevate/portfolio',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Join Community',
      description: 'Collaborate with peers',
      icon: Users,
      href: '/web-elevate/collaboration',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const dailyChallenge = {
    title: "Build a Responsive Card Component",
    description: "Create a reusable card component with hover effects and responsive design",
    difficulty: "Intermediate",
    estimatedTime: "30 min",
    technologies: ["React", "CSS", "Flexbox"],
    points: 150
  };

  const learningTips = [
    "💡 Practice coding for at least 30 minutes daily to build consistency",
    "🔍 Always test your code in different browsers for compatibility",
    "📚 Read other developers' code to learn new patterns and techniques",
    "🚀 Build projects outside of tutorials to reinforce your learning"
  ];

  const todaysTip = learningTips[Math.floor(Math.random() * learningTips.length)];

  return (
    <>
      {/* Development Notice Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium">🚧 Web Elevate is currently under development - Preview features may be incomplete</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12" />
          </div>
          
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back to Web Elevate! 👋
            </h1>
            <p className="text-indigo-100 text-lg mb-6">
              Ready to continue your web development journey? Let's build something amazing today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/web-elevate/paths"
                className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Continue Learning</span>
              </Link>
              <Link
                to="/web-elevate/playground"
                className="inline-flex items-center space-x-2 bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-300 transition-colors"
              >
                <Code className="w-5 h-5" />
                <span>Open Playground</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.total && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">of {stat.total}</div>
                </div>
              )}
              {!stat.total && (
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
            {stat.total && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(stat.value / stat.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Link
                  to={action.href}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1 block"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Challenge</h2>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dailyChallenge.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{dailyChallenge.estimatedTime}</span>
                      </span>
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {dailyChallenge.difficulty}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{dailyChallenge.points} pts</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{dailyChallenge.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {dailyChallenge.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-white text-gray-700 px-2 py-1 rounded border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to="/web-elevate/playground"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Challenge</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Learning Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Learning Tip</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Tip</h3>
                  <p className="text-gray-700">{todaysTip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity & Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  to="/web-elevate/portfolio"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                >
                  <span>View all activity</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Community Trends */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Trends</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">React Hooks trending</p>
                      <p className="text-xs text-gray-500">+25% this week</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">156 learners online</p>
                      <p className="text-xs text-gray-500">Join the discussion</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New TypeScript path</p>
                      <p className="text-xs text-gray-500">Just released!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Learning Paths Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Learning Paths</h2>
          <Link
            to="/web-elevate/paths"
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View all paths</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.slice(0, 3).map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                to={`/web-elevate/paths/${path.id}`}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${path.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {path.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{path.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{path.duration}</span>
                  <span>{path.modules.length} modules</span>
                </div>
                
                {path.progress > 0 && (
                  <div className="mb-3">
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
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {path.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {path.technologies.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{path.technologies.length - 2} more
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default Dashboard;
