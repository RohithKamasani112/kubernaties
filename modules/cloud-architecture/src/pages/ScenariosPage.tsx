import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Play,
  BookOpen,
  Target,
  Zap,
  Shield,
  Globe,
  Database,
  Server,
  Cloud,
  Award,
  Layers,
  Lock,
  Cpu,
  Network,
  Bot
} from 'lucide-react';
import { cloudScenarios, CloudScenario } from '../../../../src/data/cloudScenarios';

interface ScenariosPageProps {}

const ScenariosPage: React.FC<ScenariosPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');

  // Icon mapping for different categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-hosting': return Globe;
      case 'serverless': return Zap;
      case 'containers': return Server;
      case 'data': return Database;
      case 'ml-ai': return Bot;
      case 'security': return Shield;
      case 'devops': return Target;
      case 'iot': return Network;
      case 'enterprise': return Award;
      default: return Cloud;
    }
  };

  // Color mapping for different providers
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'aws': return 'from-orange-500 to-red-500';
      case 'azure': return 'from-blue-500 to-indigo-500';
      case 'gcp': return 'from-green-500 to-emerald-500';
      case 'multi-cloud': return 'from-purple-500 to-pink-500';
      case 'hybrid': return 'from-gray-500 to-slate-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  // Filter scenarios based on search and filters
  const filteredScenarios = cloudScenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'all' || scenario.level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    const matchesProvider = selectedProvider === 'all' || scenario.provider === selectedProvider;

    return matchesSearch && matchesDifficulty && matchesCategory && matchesProvider;
  });
  // Get unique values for filters
  const difficulties = ['all', 'beginner', 'intermediate', 'expert'];
  const categories = ['all', ...new Set(cloudScenarios.map(s => s.category))];
  const providers = ['all', ...new Set(cloudScenarios.map(s => s.provider))];
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getCostColor = (costLevel: string) => {
    switch (costLevel) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Architecture Scenarios</h1>
              <p className="text-slate-600">
                Learn cloud architecture through hands-on scenarios. Each scenario includes guided tutorials,
                interactive coding, and live visualization.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{filteredScenarios.length}</div>
              <div className="text-sm text-slate-500">scenarios available</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scenarios, technologies, or concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>

            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>
                  {provider === 'all' ? 'All Providers' : provider.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredScenarios.length} of {cloudScenarios.length} scenarios
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => {
            const Icon = getCategoryIcon(scenario.category);
            const providerColor = getProviderColor(scenario.provider);

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${providerColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(scenario.level)}`}>
                      {scenario.level.charAt(0).toUpperCase() + scenario.level.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {scenario.provider.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {scenario.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {scenario.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                  {scenario.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      +{scenario.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{scenario.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCostColor(scenario.costLevel)}`}>
                        {scenario.costLevel.charAt(0).toUpperCase() + scenario.costLevel.slice(1)} Cost
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {scenario.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/cloud-architecture/studio/${scenario.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Learning</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No scenarios found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenariosPage;
