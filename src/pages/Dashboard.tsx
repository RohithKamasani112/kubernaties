import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Target,
  Clock,
  Star,
  BookOpen,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      icon: CheckCircle,
      value: '3',
      label: 'Lessons Completed',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      value: '1',
      label: 'Challenges Solved',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Clock,
      value: '2.5h',
      label: 'Time Spent',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Star,
      value: 'Beginner',
      label: 'Current Level',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      icon: BookOpen,
      title: 'Continue Learning',
      description: 'Resume your current lesson',
      color: 'bg-blue-500',
      link: '/lessons'
    },
    {
      icon: PlayCircle,
      title: 'Try Playground',
      description: 'Experiment with Kubernetes',
      color: 'bg-green-500',
      link: '/playground'
    },
    {
      icon: Target,
      title: 'Take Challenge',
      description: 'Test your debugging skills',
      color: 'bg-orange-500',
      link: '/challenges'
    }
  ];

  const recentActivity = [
    {
      icon: BookOpen,
      title: 'What is a Pod?',
      time: '2 hours ago',
      type: 'lesson',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Award,
      title: 'Deploying with Deployment',
      time: '1 day ago',
      type: 'completed',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Target,
      title: 'Broken Service Challenge',
      time: '2 days ago',
      type: 'challenge',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: BookOpen,
      title: 'Services and Networking',
      time: 'In progress',
      type: 'current',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Ready to master Kubernetes? Let's continue your learning journey.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105 group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;