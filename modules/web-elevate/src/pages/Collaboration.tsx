import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Video,
  Code,
  Star,
  Clock,
  User,
  Plus,
  GitBranch,
  CheckCircle,
  Calendar,
  Zap,
  Heart,
  Award,
  BookOpen,
  Coffee,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Collaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'community'>('overview');

  const collaborationFeatures = [
    {
      icon: Users,
      title: 'Peer Code Reviews',
      description: 'Get feedback from experienced developers and help others improve their code.',
      status: 'Coming Soon',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: 'Live Coding Sessions',
      description: 'Join real-time coding sessions with mentors and fellow learners.',
      status: 'Coming Soon',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Community Chat',
      description: 'Connect with developers worldwide in our supportive community.',
      status: 'Coming Soon',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: GitBranch,
      title: 'Project Collaboration',
      description: 'Work together on real-world projects and build your portfolio.',
      status: 'Coming Soon',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const upcomingFeatures = [
    {
      icon: Award,
      title: 'Mentorship Program',
      description: 'Get paired with experienced developers for personalized guidance.',
      timeline: 'Q2 2025'
    },
    {
      icon: BookOpen,
      title: 'Study Groups',
      description: 'Join or create study groups for specific technologies and topics.',
      timeline: 'Q2 2025'
    },
    {
      icon: Coffee,
      title: 'Virtual Meetups',
      description: 'Attend virtual tech talks, workshops, and networking events.',
      timeline: 'Q3 2025'
    }
  ];

  const communityStats = [
    { label: 'Active Developers', value: '2.1K+', icon: Users },
    { label: 'Code Reviews', value: '450+', icon: Code },
    { label: 'Live Sessions', value: '120+', icon: Video },
    { label: 'Projects Shared', value: '89+', icon: GitBranch }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Collaboration Hub</span>
            <Heart className="w-4 h-4" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Together, Grow Together
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow developers, share knowledge, and accelerate your learning through collaboration.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'features', label: 'Features', icon: Zap },
              { id: 'community', label: 'Community', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Community Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {communityStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
                    >
                      <Icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Coming Soon Notice */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Collaboration Features Coming Soon!</h2>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  We're building an amazing collaboration platform where you can connect with fellow developers, 
                  share code, get reviews, and learn together. Stay tuned for updates!
                </p>
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Calendar className="w-4 h-4" />
                  <span>Expected Launch: Q2 2025</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid md:grid-cols-2 gap-8">
              {collaborationFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {feature.status}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Be part of a supportive community of developers who are passionate about learning and growing together.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {upcomingFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                    >
                      <Icon className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {feature.timeline}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Collaboration;
