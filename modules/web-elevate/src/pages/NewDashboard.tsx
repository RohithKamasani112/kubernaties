import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Code,
  Users,
  Star,
  ChevronRight,
  Zap,
  Target,
  Calendar,
  CheckCircle,
  Flame
} from 'lucide-react';

const NewDashboard: React.FC = () => {
  const userStats = [
    {
      label: 'Learning Paths Enrolled',
      value: '3',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Modules Completed',
      value: '12',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Current Streak',
      value: '7',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      suffix: '🔥'
    },
    {
      label: 'Total Learning Time',
      value: '24h',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const learningPaths = [
    {
      id: 'react-mastery',
      title: 'React Mastery',
      progress: 60,
      totalModules: 10,
      completedModules: 6,
      nextModule: 'React Hooks Deep Dive',
      color: 'from-blue-500 to-cyan-500',
      xpReward: 150
    },
    {
      id: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      progress: 85,
      totalModules: 8,
      completedModules: 7,
      nextModule: 'Async/Await Patterns',
      color: 'from-yellow-500 to-orange-500',
      xpReward: 120
    },
    {
      id: 'node-backend',
      title: 'Node.js Backend',
      progress: 30,
      totalModules: 12,
      completedModules: 4,
      nextModule: 'Express Middleware',
      color: 'from-green-500 to-emerald-500',
      xpReward: 200
    }
  ];

  const recentActivity = [
    {
      type: 'completed',
      title: 'Completed "React State Management"',
      time: '2 hours ago',
      xp: 25,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'achievement',
      title: 'Earned "10 Day Streak" badge',
      time: 'Yesterday',
      xp: 50,
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      type: 'started',
      title: 'Started "React Hooks Deep Dive"',
      time: 'Yesterday',
      xp: 0,
      icon: Play,
      color: 'text-blue-600'
    },
    {
      type: 'completed',
      title: 'Completed "JavaScript Promises"',
      time: '2 days ago',
      xp: 30,
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Compact Greeting & XP Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold mb-1">
              Welcome back, John! 👋
            </h1>
            <p className="text-purple-100 text-sm">Ready to continue your learning journey?</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-200">Today</p>
            <p className="text-sm font-semibold">{currentTime}</p>
          </div>
        </div>

        {/* Compact XP Progress */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold">Level 2 Developer</h3>
            <p className="text-purple-100 text-xs">250 / 500 XP to Level 3</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">250 XP</div>
            <div className="text-purple-100 text-xs">Total Earned</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Compact Resume Learning CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-4"
      >
        <Link
          to="/web-elevate/paths/react-mastery"
          className="block bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Resume: React Mastery Path
                </h3>
                <p className="text-gray-600 text-xs">Continue where you left off • Next: React Hooks Deep Dive</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>
      </motion.div>

      {/* Blueprint Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-4"
      >
        <Link
          to="/blueprint-builder"
          className="block bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  🚀 New: Project Blueprints
                </h3>
                <p className="text-indigo-100 text-sm">
                  Build real-world projects with guided milestones and AI assistance
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-1">
                24 Projects
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white transition-colors ml-auto" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Compact Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className={`${stat.bgColor} rounded-lg p-3 text-center`}
              >
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Your Learning Paths</h2>
            <Link
              to="/web-elevate/paths"
              className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{path.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    +{path.xpReward} XP
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{path.completedModules}/{path.totalModules} modules</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className={`bg-gradient-to-r ${path.color} h-1.5 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${path.progress}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Next: {path.nextModule}</p>
                  <Link
                    to={`/web-elevate/paths/${path.id}`}
                    className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors"
                  >
                    Continue
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compact Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-2 pb-2 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className={`w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center`}>
                      <Icon className={`w-3 h-3 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.xp > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            +{activity.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewDashboard;
