import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Play, 
  Clock, 
  Star, 
  BookOpen,
  Target,
  Lightbulb,
  Code,
  ChevronDown,
  ChevronRight,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';
import { yamlExamples, YamlExample } from '../../data/yamlExamples';
import { useKubernetesStore } from '../../store/kubernetesStore';

interface ExamplesGalleryProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExample, setSelectedExample] = useState<YamlExample | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { updateFromYaml, clearCanvas } = useKubernetesStore();

  // Filter examples based on search and category
  const filteredExamples = yamlExamples.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    { id: 'all', name: 'All Examples', count: yamlExamples.length },
    { id: 'Beginner', name: 'Beginner', count: yamlExamples.filter(e => e.category === 'Beginner').length },
    { id: 'Intermediate', name: 'Intermediate', count: yamlExamples.filter(e => e.category === 'Intermediate').length },
    { id: 'Advanced', name: 'Advanced', count: yamlExamples.filter(e => e.category === 'Advanced').length },
    { id: 'Production', name: 'Production', count: yamlExamples.filter(e => e.category === 'Production').length },
    { id: 'Specialized', name: 'Specialized', count: yamlExamples.filter(e => e.category === 'Specialized').length },
  ];

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100 border-green-200';
      case 2: return 'text-blue-600 bg-blue-100 border-blue-200';
      case 3: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 4: return 'text-orange-600 bg-orange-100 border-orange-200';
      case 5: return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Easy';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  const loadExample = async (example: YamlExample) => {
    try {
      clearCanvas();
      updateFromYaml(example.yaml);

      // Show a single consolidated notification after a brief delay to ensure loading is complete
      setTimeout(() => {
        toast.success(`✅ Loaded "${example.title}" example successfully!`, {
          icon: '🚀',
          duration: 4000,
          style: {
            maxWidth: '400px',
          },
        });
      }, 800);

      onClose();
    } catch (error) {
      console.error('Error loading example:', error);
      toast.error('Failed to load example. Please try again.', {
        duration: 3000,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-full max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Kubernetes Examples Gallery</h1>
                <p className="text-blue-100 mt-1">Ready-to-use configurations for learning and production</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-2xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-50 border-b border-slate-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search examples by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredExamples.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-6 bg-slate-100 rounded-full mb-4">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">No examples found</h3>
              <p className="text-slate-600">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredExamples.map(example => (
                <motion.div
                  key={example.id}
                  className={`bg-white border-2 border-slate-200 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 ${
                    viewMode === 'list' ? 'flex items-center space-x-6' : ''
                  }`}
                  onClick={() => setSelectedExample(example)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{example.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(example.difficulty)}`}>
                        {getDifficultyText(example.difficulty)}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-4 leading-relaxed">{example.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        {example.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {example.tags.length > 3 && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium">
                            +{example.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{example.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExample(example);
                        }}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadExample(example);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>Load Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Example Detail Modal */}
      <AnimatePresence>
        {selectedExample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60 p-4"
            onClick={() => setSelectedExample(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedExample.title}</h2>
                    <p className="text-blue-100 mt-1">{selectedExample.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedExample(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(selectedExample.difficulty)}`}>
                    {getDifficultyText(selectedExample.difficulty)}
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Clock className="w-4 h-4" />
                    <span>{selectedExample.estimatedTime}</span>
                  </div>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {selectedExample.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Learning Objectives */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 text-blue-600 mr-2" />
                      Learning Objectives
                    </h3>
                    <ul className="space-y-2">
                      {selectedExample.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-slate-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real-World Use Case */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      Real-World Use Case
                    </h3>
                    <p className="text-slate-700">{selectedExample.realWorldUseCase}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExample.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 p-6 flex space-x-4">
                <button
                  onClick={() => setSelectedExample(null)}
                  className="flex-1 bg-white text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    loadExample(selectedExample);
                    setSelectedExample(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Load Example</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExamplesGallery;
