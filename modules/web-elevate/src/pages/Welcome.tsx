import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Code, 
  BookOpen, 
  Target, 
  Users, 
  User,
  ArrowRight,
  Construction,
  Eye,
  Rocket
} from 'lucide-react';

const Welcome: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Learning Paths',
      description: 'Structured courses from beginner to expert',
      status: 'Preview Available'
    },
    {
      icon: Code,
      title: 'Interactive Playground',
      description: 'Code editor with live preview and testing',
      status: 'Preview Available'
    },
    {
      icon: Target,
      title: 'Project Blueprints',
      description: 'Real-world projects and challenges',
      status: 'Preview Available'
    },
    {
      icon: Users,
      title: 'Collaboration Hub',
      description: 'Peer reviews and live coding sessions',
      status: 'Preview Available'
    },
    {
      icon: User,
      title: 'Portfolio Builder',
      description: 'Showcase your projects and skills',
      status: 'Preview Available'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Development Notice Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
            <Construction className="w-5 h-5" />
            <span className="font-medium">Web Elevate is currently under development - Preview features available</span>
            <Construction className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Web Elevate</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master modern web development through interactive learning, real-world projects, and AI-powered guidance. 
            Currently in development - explore our preview features!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/web-elevate/dashboard"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/web-elevate/paths"
              className="border-2 border-indigo-200 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Learning Paths</span>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preview Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600 font-medium">{feature.status}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Development Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-200"
        >
          <div className="flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-indigo-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're actively developing Web Elevate to provide the best learning experience. 
            Preview features are available now, with full functionality coming soon!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-gray-600">✨ Enhanced AI Features</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-gray-600">🎯 Advanced Projects</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-gray-600">🤝 Live Collaboration</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-gray-600">📊 Progress Analytics</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
