import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Construction,
  Play,
  Target,
  Code,
  Cloud,
  Shield,
  Database,
  Zap
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const LearningPathsPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');

  const features = [
    { name: 'Overview', description: 'Get started', active: false },
    { name: 'Scenarios', description: 'Bit-sized examples', active: false },
    { name: 'AI Gen', description: 'Text → architecture', active: false },
    { name: 'Builder', description: 'Drag & drop', active: false },
    { name: 'Paths', description: 'Guided learning', active: true }
  ];

  const learningPaths = [
    {
      id: 'aws-fundamentals',
      title: 'AWS Fundamentals',
      description: 'Master the basics of Amazon Web Services from compute to storage',
      level: 'beginner',
      provider: 'AWS',
      modules: 8,
      duration: '12h',
      progress: 3,
      totalProgress: 8,
      progressPercent: 38,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      icon: Cloud,
      students: '2.1K',
      rating: 4.8
    },
    {
      id: 'azure-solutions',
      title: 'Azure Cloud Solutions',
      description: 'Build scalable applications and services on Microsoft Azure',
      level: 'intermediate',
      provider: 'Azure',
      modules: 10,
      duration: '18h',
      progress: 0,
      totalProgress: 10,
      progressPercent: 0,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      icon: Shield,
      students: '1.8K',
      rating: 4.7
    },
    {
      id: 'gcp-mastery',
      title: 'GCP Architecture Mastery',
      description: 'Design enterprise-grade solutions on Google Cloud Platform',
      level: 'expert',
      provider: 'GCP',
      modules: 12,
      duration: '25h',
      progress: 0,
      totalProgress: 12,
      progressPercent: 0,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      icon: Database,
      students: '1.2K',
      rating: 4.9
    },
    {
      id: 'multi-cloud',
      title: 'Multi-Cloud Architecture',
      description: 'Master hybrid and multi-cloud deployment strategies',
      level: 'expert',
      provider: 'Multi-Cloud',
      modules: 15,
      duration: '30h',
      progress: 0,
      totalProgress: 15,
      progressPercent: 0,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      icon: Zap,
      students: '856',
      rating: 4.8
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'expert': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPaths = learningPaths.filter(path => {
    const levelMatch = selectedLevel === 'All Levels' || path.level === selectedLevel.toLowerCase();
    const providerMatch = selectedProvider === 'All Providers' || path.provider === selectedProvider;
    return levelMatch && providerMatch;
  });

  return (
    <>
      <Helmet>
        <title>Learning Paths - Cloud Architecture</title>
        <meta name="description" content="Structured learning paths for mastering cloud architecture across AWS, Azure, and GCP" />
      </Helmet>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Learning Paths</h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Structured learning journeys to master cloud architecture across different platforms and skill levels
              </p>
            </div>

            {/* Features Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                <div className="flex space-x-2">
                  {features.map((feature, index) => (
                    <div
                      key={feature.name}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        feature.active
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{feature.name}</div>
                        <div className="text-xs opacity-75">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-slate-700">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-slate-700">Cloud Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option>All Providers</option>
                  <option>AWS</option>
                  <option>Azure</option>
                  <option>GCP</option>
                  <option>Multi-Cloud</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${path.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <path.icon className="w-full h-full" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(path.level)} bg-white/20 text-white`}>
                        {path.level}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{path.modules}/{path.modules}</div>
                        <div className="text-sm opacity-90">Modules</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{path.title}</h3>
                    <p className="text-white/90 leading-relaxed">{path.description}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Progress Bar */}
                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{path.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${path.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Duration</span>
                      </div>
                      <div className="font-bold text-gray-900">{path.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Students</span>
                      </div>
                      <div className="font-bold text-gray-900">{path.students}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Rating</span>
                      </div>
                      <div className="font-bold text-gray-900">{path.rating}</div>
                    </div>
                  </div>

                  {/* Development Banner */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <Construction className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-semibold text-orange-800 text-sm">🚧 Development in Progress</div>
                        <div className="text-orange-600 text-xs">Learning paths are being built. Expected release: Q3 2024</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-3 px-6 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Construction className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPathsPage;
