import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  X, 
  Search, 
  Filter, 
  Star, 
  Play, 
  Eye,
  Code,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { perfectDesigns, PerfectDesign } from '../../data/perfectDesigns';
import { useKubernetesStore } from '../../store/kubernetesStore';
import toast from 'react-hot-toast';

interface ExamplesGalleryProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExample, setSelectedExample] = useState<PerfectDesign | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const { updateNodes, updateEdges, clearCanvas } = useKubernetesStore();

  const categories = [
    { id: 'all', name: 'All Examples', count: perfectDesigns.length },
    { id: 'Basic', name: 'Basic', count: perfectDesigns.filter(e => e.category === 'Basic').length },
    { id: 'Intermediate', name: 'Intermediate', count: perfectDesigns.filter(e => e.category === 'Intermediate').length },
    { id: 'Advanced', name: 'Advanced', count: perfectDesigns.filter(e => e.category === 'Advanced').length },
    { id: 'Production', name: 'Production', count: perfectDesigns.filter(e => e.category === 'Production').length },
    { id: 'Debugging', name: 'Debugging', count: perfectDesigns.filter(e => e.category === 'Debugging').length },
  ];

  const filteredExamples = perfectDesigns.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.concepts.some(concept => concept.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-orange-600 bg-orange-100';
      case 5: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const loadExample = (example: PerfectDesign) => {
    clearCanvas();

    // Create nodes from perfect design architecture
    const nodes = example.architecture.components.map((component, index) => ({
      id: `${component.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      type: 'kubernetesNode',
      position: { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 150 },
      data: {
        label: component,
        componentType: component.toLowerCase().includes('pod') ? 'pod' :
                      component.toLowerCase().includes('service') ? 'service' :
                      component.toLowerCase().includes('ingress') ? 'ingress' :
                      component.toLowerCase().includes('deployment') ? 'deployment' :
                      component.toLowerCase().includes('configmap') ? 'configmap' :
                      component.toLowerCase().includes('secret') ? 'secret' : 'pod',
        config: {
          name: component.toLowerCase().replace(/\s+/g, '-'),
          namespace: 'default'
        }
      }
    }));

    // Create basic edges connecting components
    const edges = nodes.slice(0, -1).map((node, index) => ({
      id: `edge-${index}`,
      source: node.id,
      target: nodes[index + 1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6' }
    }));

    updateNodes(nodes);
    updateEdges(edges);

    toast.success(`Loaded "${example.title}" example`, {
      icon: '🚀',
      duration: 3000,
    });

    onClose();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Examples Gallery</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Examples List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredExamples.map(example => (
                <motion.div
                  key={example.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedExample?.id === example.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedExample(example)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900 text-sm">{example.title}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(example.difficulty)}`}>
                      {getDifficultyText(example.difficulty)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{example.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {example.concepts.slice(0, 3).map(concept => (
                      <span
                        key={concept}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                    {example.concepts.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        +{example.concepts.length - 3}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedExample ? (
            <>
              {/* Example Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedExample.title}</h1>
                    <p className="text-slate-600">{selectedExample.description}</p>
                  </div>
                  <button
                    onClick={() => loadExample(selectedExample)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Load Example</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedExample.difficulty)}`}>
                    {getDifficultyText(selectedExample.difficulty)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedExample.difficulty ? 'text-yellow-400 fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 capitalize">{selectedExample.category}</span>
                </div>
              </div>

              {/* Example Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Learning Objectives */}
                  <div>
                    <button
                      onClick={() => toggleSection('objectives')}
                      className="flex items-center space-x-2 text-lg font-semibold text-slate-900 mb-3"
                    >
                      {expandedSections.includes('objectives') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>Learning Objectives</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.includes('objectives') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-2 ml-7">
                            {selectedExample.learningObjectives.map((objective, index) => (
                              <li key={index} className="flex items-start space-x-2 text-slate-700">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Real-World Use Case */}
                  <div>
                    <button
                      onClick={() => toggleSection('usecase')}
                      className="flex items-center space-x-2 text-lg font-semibold text-slate-900 mb-3"
                    >
                      {expandedSections.includes('usecase') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span>Real-World Use Case</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.includes('usecase') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-700 ml-7">{selectedExample.realWorldUseCase}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* YAML Preview */}
                  <div>
                    <button
                      onClick={() => toggleSection('yaml')}
                      className="flex items-center space-x-2 text-lg font-semibold text-slate-900 mb-3"
                    >
                      {expandedSections.includes('yaml') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <Code className="w-5 h-5 text-green-600" />
                      <span>YAML Configuration</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.includes('yaml') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-7">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{selectedExample.yaml}</code>
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select an Example</h3>
                <p className="text-slate-600">Choose an example from the sidebar to view details and load it into the playground.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExamplesGallery;
