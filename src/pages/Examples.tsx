import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Play,
  Star,
  Clock,
  Users,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Target,
  Code,
  Zap,
  Eye,
  Copy,
  Download,
  Layers,
  Activity,
  CheckCircle
} from 'lucide-react';
import { perfectDesigns, PerfectDesign } from '../data/perfectDesigns';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import toast from 'react-hot-toast';

const Examples: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<PerfectDesign | null>(null);
  const [showArchitecture, setShowArchitecture] = useState<string | null>(null);
  const navigate = useNavigate();
  // No longer need store functions since we're using URL parameters

  const categories = [
    { id: 'all', name: 'All Perfect Designs', count: perfectDesigns.length, color: 'bg-slate-100 text-slate-700', icon: '📚' },
    { id: 'Basic', name: 'Basic', count: perfectDesigns.filter(e => e.category === 'Basic').length, color: 'bg-green-100 text-green-700', icon: '🌱' },
    { id: 'Intermediate', name: 'Intermediate', count: perfectDesigns.filter(e => e.category === 'Intermediate').length, color: 'bg-blue-100 text-blue-700', icon: '🔧' },
    { id: 'Advanced', name: 'Advanced', count: perfectDesigns.filter(e => e.category === 'Advanced').length, color: 'bg-orange-100 text-orange-700', icon: '🚀' },
    { id: 'Production', name: 'Production', count: perfectDesigns.filter(e => e.category === 'Production').length, color: 'bg-purple-100 text-purple-700', icon: '⚡' },
    { id: 'Debugging', name: 'Debugging', count: perfectDesigns.filter(e => e.category === 'Debugging').length, color: 'bg-red-100 text-red-700', icon: '🐛' },
  ];

  const difficulties = [
    { level: 1, name: 'Beginner', color: 'text-green-600 bg-green-100' },
    { level: 2, name: 'Easy', color: 'text-blue-600 bg-blue-100' },
    { level: 3, name: 'Intermediate', color: 'text-yellow-600 bg-yellow-100' },
    { level: 4, name: 'Advanced', color: 'text-orange-600 bg-orange-100' },
    { level: 5, name: 'Expert', color: 'text-red-600 bg-red-100' },
  ];

  const filteredDesigns = perfectDesigns.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.concepts.some(concept => concept.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === null || design.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const loadDesignIntoPlayground = async (design: PerfectDesign) => {
    try {
      // Navigate to playground with YAML parameter (same approach as documentation)
      const playgroundUrl = `/playground?yaml=${encodeURIComponent(design.yaml)}`;
      navigate(playgroundUrl);

      // Show a brief notification since the user is navigating away
      toast.success(`Loading "${design.title}" into playground...`, {
        icon: '🚀',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error loading design:', error);
      toast.error('Failed to load design into playground');
    }
  };

  const copyYamlToClipboard = (yaml: string) => {
    navigator.clipboard.writeText(yaml);
    toast.success('YAML copied to clipboard!');
  };

  const getDifficultyColor = (difficulty: number) => {
    const difficultyObj = difficulties.find(d => d.level === difficulty);
    return difficultyObj?.color || 'text-gray-600 bg-gray-100';
  };

  const getDifficultyText = (difficulty: number) => {
    const difficultyObj = difficulties.find(d => d.level === difficulty);
    return difficultyObj?.name || 'Unknown';
  };







  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="h-full overflow-y-auto">
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Lightbulb className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Perfect Kubernetes Designs
          </motion.h1>

          <motion.p
            className="text-xl text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Explore production-ready Kubernetes architectures with interactive diagrams, traffic flow animations,
            and complete YAML configurations. Each design shows how traffic flows and includes troubleshooting guides.
          </motion.p>

          {/* Enhanced Production Traffic Flow Banner */}
          <motion.div
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl p-8 max-w-5xl mx-auto mt-8 text-white shadow-2xl border border-purple-400 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Animated Traffic Flow Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/2 left-0 transform -translate-y-1/2 flex items-center space-x-2"
                animate={{ x: [0, 300, 600, 900] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-200 rounded-full"></div>
              </motion.div>
              <motion.div
                className="absolute top-1/3 left-0 transform -translate-y-1/2 flex items-center space-x-1"
                animate={{ x: [0, 400, 800] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-1 h-1 bg-green-300 rounded-full"></div>
              </motion.div>
              <motion.div
                className="absolute top-2/3 left-0 transform -translate-y-1/2 flex items-center space-x-1"
                animate={{ x: [0, 500, 1000] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
              </motion.div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="bg-white/20 p-3 rounded-full"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center space-x-2">
                      <span>🚀 See How Production Traffic Flows</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    </h2>
                    <p className="text-purple-100 text-lg">
                      Watch live traffic • Load balancing • Auto-scaling • Fault tolerance
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    setSelectedCategory('Production');
                    // Scroll to the designs section
                    setTimeout(() => {
                      const designsSection = document.getElementById('designs-section');
                      if (designsSection) {
                        designsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-2xl flex items-center space-x-3 text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 10px 30px rgba(255, 193, 7, 0.3)",
                      "0 15px 40px rgba(255, 193, 7, 0.5)",
                      "0 10px 30px rgba(255, 193, 7, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-6 h-6" />
                  <span>See Production Traffic</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Production Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Live Traffic Flow</span>
                </div>
                <p className="text-sm text-purple-100">See how requests flow through complex architectures</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Enterprise Patterns</span>
                </div>
                <p className="text-sm text-purple-100">Istio, GitOps, multi-cluster, ML pipelines</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Debug Scenarios</span>
                </div>
                <p className="text-sm text-purple-100">Real troubleshooting with step-by-step solutions</p>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Search */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search perfect designs by name, description, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Category Filter Cards */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(category => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `${category.color} border-current shadow-lg scale-105`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-slate-900">{category.name}</div>
                <div className="text-xs text-slate-600 mt-1">{category.count} designs</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter by Difficulty</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedDifficulty === null
                  ? 'bg-slate-200 text-slate-800 shadow-md'
                  : 'bg-white border border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              All Levels
            </button>
            {difficulties.map(difficulty => (
              <button
                key={difficulty.level}
                onClick={() => setSelectedDifficulty(difficulty.level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty.level
                    ? `${difficulty.color} shadow-md`
                    : 'bg-white border border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Perfect Designs Grid */}
        <motion.div
          id="designs-section"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 ${
                design.category === 'Production'
                  ? 'border-purple-300 ring-2 ring-purple-100 bg-gradient-to-br from-white to-purple-50'
                  : 'border-slate-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors">
                        {design.title}
                      </h3>
                      {design.category === 'Production' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          <Zap className="w-3 h-3 mr-1" />
                          Production
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(design.difficulty)}`}>
                    Level {design.difficulty}
                  </div>
                </div>

                <p className="text-slate-600 mb-4">
                  {design.description}
                </p>

                {/* Architecture Overview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Layers className="w-4 h-4 mr-1" />
                    Architecture Components
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {design.architecture.components.slice(0, 4).map(component => (
                      <span
                        key={component}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {component}
                      </span>
                    ))}
                    {design.architecture.components.length > 4 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        +{design.architecture.components.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Traffic Flow Animation */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Traffic Flow
                  </h4>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded mb-3">
                    {design.animation.trafficFlow}
                  </div>

                  {/* Enhanced Play Button with Tooltip */}
                  <div className="relative group">
                    <motion.button
                      onClick={() => setShowArchitecture(showArchitecture === design.id ? null : design.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        boxShadow: [
                          "0 4px 15px rgba(34, 197, 94, 0.3)",
                          "0 6px 20px rgba(34, 197, 94, 0.5)",
                          "0 4px 15px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-5 h-5" />
                      <span>Click me to see traffic flow!</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Activity className="w-5 h-5" />
                      </motion.div>
                    </motion.button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      View interactive architecture diagram with animated traffic flow
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>

                {/* Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Concepts</h4>
                  <div className="flex flex-wrap gap-1">
                    {design.concepts.slice(0, 3).map(concept => (
                      <span
                        key={concept}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                    {design.concepts.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        +{design.concepts.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {design.estimatedTime}
                    </span>
                    <span className="capitalize">{design.category}</span>
                  </div>
                  <span className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Production Ready
                  </span>
                </div>
              </div>

              {/* Architecture Diagram */}
              {showArchitecture === design.id && (
                <div className="px-6 pb-4">
                  <ArchitectureDiagram
                    type={design.architecture.diagram}
                    components={design.architecture.components}
                    flow={design.architecture.flow}
                    animated={true}
                  />
                </div>
              )}

              {/* Card Footer - Enhanced with Tooltips */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="flex space-x-2">
                  <div className="relative group flex-1">
                    <button
                      onClick={() => copyYamlToClipboard(design.yaml)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy YAML</span>
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Copy Kubernetes YAML to clipboard
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>

                  <div className="relative group flex-1">
                    <button
                      onClick={() => loadDesignIntoPlayground(design)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>Load in Playground</span>
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Load this design into the interactive playground
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredDesigns.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No perfect designs found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
          </motion.div>
        )}
        </motion.div>
      </div>
    </div>
  );
};

export default Examples;
