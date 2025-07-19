import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Tag, 
  Play, 
  Download, 
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Database,
  Globe,
  Server,
  Brain,
  Layers,
  Network,
  Code
} from 'lucide-react';
import { cloudScenarios, CloudScenario, getScenariosByLevel, getScenariosByProvider, searchScenarios } from '../../data/cloudScenarios';

const ScenarioLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp' | 'multi-cloud' | 'hybrid'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<CloudScenario | null>(null);

  const filteredScenarios = useMemo(() => {
    let scenarios = cloudScenarios;

    // Apply search
    if (searchQuery) {
      scenarios = searchScenarios(searchQuery);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      scenarios = scenarios.filter(s => s.level === selectedLevel);
    }

    // Apply provider filter
    if (selectedProvider !== 'all') {
      scenarios = scenarios.filter(s => s.provider === selectedProvider);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      scenarios = scenarios.filter(s => s.category === selectedCategory);
    }

    return scenarios;
  }, [searchQuery, selectedLevel, selectedProvider, selectedCategory]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'expert': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return '🟠';
      case 'azure': return '🔵';
      case 'gcp': return '🟢';
      case 'multi-cloud': return '🌐';
      case 'hybrid': return '🔗';
      default: return '☁️';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-hosting': return <Globe className="w-4 h-4" />;
      case 'serverless': return <Zap className="w-4 h-4" />;
      case 'containers': return <Layers className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'ml-ai': return <Brain className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'devops': return <Code className="w-4 h-4" />;
      case 'iot': return <Network className="w-4 h-4" />;
      case 'enterprise': return <Server className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getCostColor = (costLevel: string) => {
    switch (costLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">


      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{cloudScenarios.length}</div>
            <div className="text-sm text-slate-600">Total Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">9</div>
            <div className="text-sm text-slate-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-slate-600">Cloud Providers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-slate-600">Production Ready</div>
          </div>
        </div>
      </div>

      {/* Compact Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500 text-sm"
            />
          </div>

          {/* Quick Filters */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Providers</option>
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="gcp">GCP</option>
            <option value="multi-cloud">Multi-Cloud</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="web-hosting">Web Hosting</option>
            <option value="serverless">Serverless</option>
            <option value="containers">Containers</option>
            <option value="data">Data & Analytics</option>
            <option value="ml-ai">ML & AI</option>
            <option value="security">Security</option>
            <option value="devops">DevOps</option>
          </select>

          {/* Results Count */}
          <div className="text-sm text-slate-600 font-medium">
            {filteredScenarios.length} scenarios
          </div>
        </div>

      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getProviderIcon(scenario.provider)}</span>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getLevelColor(scenario.level)}`}></div>
                </div>
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(scenario.category)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                {scenario.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {scenario.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(scenario.costLevel)}`}>
                  {scenario.costLevel} cost
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{scenario.estimatedTime}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getLevelColor(scenario.level)}`}>
                  {scenario.level}
                </span>
              </div>

              {/* Services */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {scenario.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {service}
                    </span>
                  ))}
                  {scenario.services.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      +{scenario.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-6 pb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedScenario(scenario)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Try It</span>
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No scenarios found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Scenario Detail Modal */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScenario(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedScenario.title}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getProviderIcon(selectedScenario.provider)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getLevelColor(selectedScenario.level)}`}>
                        {selectedScenario.level}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedScenario(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600">{selectedScenario.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">User Prompt</h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 italic">"{selectedScenario.prompt}"</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Architecture Overview</h3>
                    <p className="text-slate-600">{selectedScenario.architecture}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Services Involved</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScenario.services.map((service, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Estimated Time</h3>
                      <p className="text-slate-600">{selectedScenario.estimatedTime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Cost Level</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCostColor(selectedScenario.costLevel)}`}>
                        {selectedScenario.costLevel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Export Formats</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScenario.exportFormats.map((format, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Start Building</span>
                    </button>
                    <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioLibrary;
