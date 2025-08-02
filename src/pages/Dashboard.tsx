import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Target,
  Clock,
  Star,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Activity,
  MessageSquare,
  Bug,
  Lightbulb,
  ExternalLink,
  Send,
  Play,
  Layers,
  FileText,
  Video,
  PlayCircle
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const Dashboard: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const features = [
    {
      icon: Play,
      title: 'Interactive Playground',
      description: 'Experiment with Kubernetes in a safe environment. Deploy, scale, and manage containers.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/kubernetes/playground',
      animation: 'hover:scale-105'
    },
    {
      icon: BookOpen,
      title: 'Guided Lessons',
      description: 'Learn Kubernetes step-by-step with interactive tutorials and hands-on exercises.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/kubernetes/lessons',
      animation: 'hover:scale-105'
    },
    {
      icon: Target,
      title: 'Debug Challenges',
      description: 'Test your skills with real-world debugging scenarios and troubleshooting tasks.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      link: '/kubernetes/challenges',
      animation: 'hover:scale-105'
    },
    {
      icon: Layers,
      title: 'YAML Examples',
      description: 'Explore curated Kubernetes manifests and learn best practices through examples.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/kubernetes/examples',
      animation: 'hover:scale-105'
    },
    {
      icon: Bug,
      title: 'K8s Debugging',
      description: 'Master debugging techniques with interactive cluster troubleshooting scenarios.',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      link: '/kubernetes/debugging',
      animation: 'hover:scale-105'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Access comprehensive guides, references, and best practices for Kubernetes.',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      link: '/kubernetes/docs',
      animation: 'hover:scale-105'
    },

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
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Give Feedback</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* YouTube Video Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Platform Introduction</h3>
                  <p className="text-sm text-gray-600">Learn how Samwi accelerates your Kubernetes journey</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-gray-100"
                  >
                    <iframe
                      src="https://www.youtube.com/embed/kymYGrHpboM"
                      title="Samwi Platform Introduction"
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </motion.div>
                </div>

                {/* Quick Features */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm">Interactive Learning</h4>
                      <p className="text-blue-700 text-xs">Hands-on tutorials</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900 text-sm">Debug Challenges</h4>
                      <p className="text-green-700 text-xs">Real-world scenarios</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Play className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-purple-900 text-sm">Live Playground</h4>
                      <p className="text-purple-700 text-xs">Safe experimentation</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  to={feature.link}
                  className={`block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${feature.animation} h-full`}
                >
                  {/* Icon with gradient background */}
                  <div className="relative mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    {/* Animated background effect */}
                    <div className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg opacity-20 group-hover:scale-125 transition-transform duration-300 -z-10`}></div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Action indicator */}
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
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
                    onClick={() => setShowFeedbackModal(true)}
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
                    onClick={() => setShowFeedbackModal(true)}
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
                    onClick={() => setShowFeedbackModal(true)}
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
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Share Your Feedback</span>
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


      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};

export default Dashboard;