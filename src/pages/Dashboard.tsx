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
  Activity,
  MessageSquare,
  Bug,
  Lightbulb,
  ExternalLink,
  Send
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
    <div className="bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">Samwi</span>! 👋
              </h1>
              <p className="text-gray-600">Welcome to Samwi's KubeQuest learning platform! Ready to master Kubernetes and cloud technologies?</p>
            </div>

            {/* Quick Feedback CTA */}
            <div className="flex-shrink-0">
              <button
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Give Feedback</span>
              </button>
            </div>
          </div>
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

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Help Shape KubeQuest's Future
                </h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Your feedback drives our improvements! Whether you've found a bug, have a brilliant feature idea,
                or want to share your learning experience - we want to hear from you.
              </p>
            </div>

            {/* Quick Feedback Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-red-100 hover:border-red-200 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bug className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Report a Bug</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Something not working as expected? Let us know so we can fix it quickly.
                  </p>
                  <button
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center"
                  >
                    Report Bug <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-yellow-100 hover:border-yellow-200 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Suggest Feature</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Have an idea that could make learning even better? Share it with us!
                  </p>
                  <button
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center justify-center"
                  >
                    Share Idea <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-green-100 hover:border-green-200 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">General Feedback</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Share your overall experience and help us understand what's working well.
                  </p>
                  <button
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-center"
                  >
                    Give Feedback <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="text-center">
              <button
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Open Complete Feedback Form</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Quick & easy • Takes 2-3 minutes • Your input shapes our roadmap
              </p>

              {/* Alternative Contact */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-2">
                  Prefer email? You can also reach us directly:
                </p>
                <a
                  href="mailto:samwi.global@gmail.com?subject=Feedback for KubeQuest Platform"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>samwi.global@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Feedback Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
          className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Give Feedback"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Give Feedback
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;