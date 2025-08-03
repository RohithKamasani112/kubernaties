import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Layers,
  Users,
  ArrowRight,
  Zap,
  User
} from 'lucide-react';

const KubernetesDashboard: React.FC = () => {
  const exploreFeatures = [
    {
      title: 'Learning Paths',
      description: 'Structured learning paths for modern web development',
      icon: BookOpen,
      href: '/web-elevate/paths',
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Interactive Playground',
      description: 'Experiment with React components in a live coding environment',
      icon: Code,
      href: '/web-elevate/playground',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    },
    {
      title: 'Debug Challenges',
      description: 'Fix real-world bugs and improve your debugging skills',
      icon: Zap,
      href: '/web-elevate/debug-projects',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100'
    },
    {
      title: 'Blueprints',
      description: 'Project templates and architectural patterns',
      icon: Layers,
      href: '/web-elevate/blueprints',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    },
    {
      title: 'Collaboration',
      description: 'Work together on projects and share knowledge',
      icon: Users,
      href: '/web-elevate/collaboration',
      gradient: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      devInProgress: true
    },
    {
      title: 'Portfolio',
      description: 'Showcase your projects and achievements',
      icon: User,
      href: '/web-elevate/portfolio',
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100',
      devInProgress: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Platform Ready</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Web Development Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master modern web development with interactive lessons, hands-on challenges, and comprehensive documentation
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Explore Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Features</h2>
            <p className="text-lg text-gray-600">Choose your learning path and start building amazing web applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exploreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  to={feature.href}
                  className={`block ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 ${
                    feature.devInProgress ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {feature.devInProgress && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          Dev
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                  <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    <span>{feature.devInProgress ? 'Coming Soon' : 'Get Started'}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KubernetesDashboard;