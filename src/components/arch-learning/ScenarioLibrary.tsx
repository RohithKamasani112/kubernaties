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
  Code,
  FileImage,
  FileCode,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Eye,
  Edit3,
  Terminal,
  Lightbulb
} from 'lucide-react';
import { cloudScenarios, CloudScenario, getScenariosByLevel, getScenariosByProvider, searchScenarios } from '../../data/cloudScenarios';
import AdvancedInteractiveTutorial from './AdvancedInteractiveTutorial';
import InteractiveLearningPath from './InteractiveLearningPath';

// Helper function to get tutorial steps for a scenario
const getTutorialSteps = (scenario: CloudScenario) => {
  const baseSteps = [
    { title: 'Architecture Overview', duration: '5 min', type: 'overview' },
    { title: 'Service Configuration', duration: '10 min', type: 'configuration' },
    { title: 'Hands-on Implementation', duration: '15 min', type: 'implementation' },
    { title: 'Testing & Validation', duration: '10 min', type: 'testing' },
    { title: 'Best Practices', duration: '5 min', type: 'best-practices' }
  ];

  // Customize steps based on scenario complexity
  if (scenario.level === 'expert') {
    return [
      ...baseSteps,
      { title: 'Advanced Configuration', duration: '15 min', type: 'advanced' },
      { title: 'Security Hardening', duration: '10 min', type: 'security' },
      { title: 'Monitoring Setup', duration: '10 min', type: 'monitoring' }
    ];
  }

  return baseSteps;
};

const ScenarioLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp' | 'multi-cloud' | 'hybrid'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<CloudScenario | null>(null);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(false);
  const [showAdvancedTutorial, setShowAdvancedTutorial] = useState(false);
  const [showInteractiveLearningPath, setShowInteractiveLearningPath] = useState(false);
  const [learningPathScenario, setLearningPathScenario] = useState<CloudScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Filter scenarios based on search and filters
  const filteredScenarios = useMemo(() => {
    let scenarios = cloudScenarios;

    // Apply search
    if (searchQuery.trim()) {
      scenarios = searchScenarios(searchQuery);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      scenarios = getScenariosByLevel(selectedLevel, scenarios);
    }

    // Apply provider filter
    if (selectedProvider !== 'all') {
      scenarios = getScenariosByProvider(selectedProvider, scenarios);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      scenarios = scenarios.filter(scenario => scenario.category === selectedCategory);
    }

    return scenarios;
  }, [searchQuery, selectedLevel, selectedProvider, selectedCategory]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(cloudScenarios.map(scenario => scenario.category))];
    return cats.sort();
  }, []);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return '🟠';
      case 'azure': return '🔵';
      case 'gcp': return '🟢';
      case 'multi-cloud': return '🌈';
      case 'hybrid': return '🔗';
      default: return '☁️';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cloud Architecture Scenarios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn cloud architecture patterns through hands-on interactive tutorials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>

              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Providers</option>
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="gcp">Google Cloud</option>
                <option value="multi-cloud">Multi-Cloud</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700">
                  {filteredScenarios.length} scenarios
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Provider Header */}
              <div className={`h-2 ${
                scenario.provider === 'aws' ? 'bg-orange-500' :
                scenario.provider === 'azure' ? 'bg-blue-500' :
                scenario.provider === 'gcp' ? 'bg-green-500' :
                'bg-purple-500'
              }`} />

              {/* Card Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      scenario.provider === 'aws' ? 'bg-orange-100' :
                      scenario.provider === 'azure' ? 'bg-blue-100' :
                      scenario.provider === 'gcp' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      <span className="text-lg">{getProviderIcon(scenario.provider)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{scenario.provider}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(scenario.level)}`}>
                    {scenario.level}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {scenario.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {scenario.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {service}
                    </span>
                  ))}
                  {scenario.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      +{scenario.services.length - 3} more
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{scenario.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className={`w-4 h-4 ${getCostColor(scenario.costLevel)}`} />
                    <span className={getCostColor(scenario.costLevel)}>{scenario.costLevel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setLearningPathScenario(scenario);
                    setShowInteractiveLearningPath(true);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors ${
                    scenario.provider === 'aws' ? 'bg-orange-500 hover:bg-orange-600' :
                    scenario.provider === 'azure' ? 'bg-blue-500 hover:bg-blue-600' :
                    scenario.provider === 'gcp' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Try Interactive Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* INTERACTIVE LEARNING PATH MODAL */}
    <AnimatePresence>
      {showInteractiveLearningPath && learningPathScenario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInteractiveLearningPath(false);
              setLearningPathScenario(null);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{getProviderIcon(learningPathScenario.provider)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{learningPathScenario.title}</h2>
                    <p className="text-blue-100">Interactive Learning Path</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInteractiveLearningPath(false);
                    setLearningPathScenario(null);
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(90vh-120px)] flex">
              {/* Left Panel - Tutorial Steps */}
              <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Learning Steps</h3>
                  <div className="space-y-3">
                    {getTutorialSteps(learningPathScenario).map((step, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          currentStep === index
                            ? 'bg-blue-100 border-blue-300 shadow-md'
                            : completedSteps.includes(index)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setCurrentStep(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            completedSteps.includes(index)
                              ? 'bg-green-500 text-white'
                              : currentStep === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {completedSteps.includes(index) ? '✓' : index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{step.title}</div>
                            <div className="text-sm text-slate-500">{step.duration}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Content */}
              <div className="flex-1 flex flex-col">
                {/* Step Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <InteractiveTutorialContent
                    scenario={learningPathScenario}
                    currentStep={currentStep}
                    onStepComplete={(stepIndex) => {
                      if (!completedSteps.includes(stepIndex)) {
                        setCompletedSteps([...completedSteps, stepIndex]);
                      }
                      if (stepIndex < getTutorialSteps(learningPathScenario).length - 1) {
                        setCurrentStep(stepIndex + 1);
                      }
                    }}
                  />
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                      disabled={currentStep === 0}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>Previous</span>
                    </button>

                    <div className="text-sm text-slate-600">
                      Step {currentStep + 1} of {getTutorialSteps(learningPathScenario).length}
                    </div>

                    <button
                      onClick={() => {
                        if (!completedSteps.includes(currentStep)) {
                          setCompletedSteps([...completedSteps, currentStep]);
                        }
                        if (currentStep < getTutorialSteps(learningPathScenario).length - 1) {
                          setCurrentStep(currentStep + 1);
                        }
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <span>{currentStep === getTutorialSteps(learningPathScenario).length - 1 ? 'Complete' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

// Interactive Tutorial Content Component
const InteractiveTutorialContent: React.FC<{
  scenario: CloudScenario;
  currentStep: number;
  onStepComplete: (stepIndex: number) => void;
}> = ({ scenario, currentStep, onStepComplete }) => {
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);

  const steps = getTutorialSteps(scenario);
  const step = steps[currentStep];

  const getStepContent = () => {
    switch (step?.type) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{scenario.title}</h2>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">What You'll Learn</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• How to architect {scenario.title.toLowerCase()}</li>
                <li>• Best practices for {scenario.provider.toUpperCase()} services</li>
                <li>• Security and cost optimization techniques</li>
                <li>• Real-world implementation patterns</li>
              </ul>
            </div>
            <InteractiveArchitectureDiagram scenario={scenario} />
          </div>
        );

      case 'configuration':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Service Configuration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Required Services</h3>
                <div className="space-y-3">
                  {scenario.services.map((service, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border">
                      <div className="font-medium text-slate-900">{service}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Click to configure this service →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Configuration Code</h3>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-400 mb-2"># {scenario.provider.toUpperCase()} Configuration</div>
                  {scenario.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="mb-2">
                      <span className="text-blue-400">{service.toLowerCase().replace(/\s+/g, '_')}</span>
                      <span className="text-white"> = </span>
                      <span className="text-yellow-400">"{service.toLowerCase().replace(/\s+/g, '-')}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'implementation':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Hands-on Implementation</h2>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">Implementation Challenge</h3>
              <p className="text-purple-800 mb-4">
                Implement the {scenario.title} architecture using the provided template.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>
              {showHint && (
                <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                  <p className="text-purple-800 text-sm">
                    💡 Start by defining your resource groups and networking components first.
                  </p>
                </div>
              )}
            </div>
            <CodeEditor
              value={userCode}
              onChange={setUserCode}
              language="yaml"
              placeholder="# Implement your solution here..."
            />
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Testing & Validation</h2>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-3">Validation Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-yellow-800">Infrastructure deployed successfully</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-yellow-400 rounded-full" />
                  <span className="text-yellow-800">Services are healthy and responding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-yellow-400 rounded-full" />
                  <span className="text-yellow-800">Security configurations verified</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Test Commands</h3>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>$ curl -X GET https://your-endpoint.com/health</div>
                <div className="text-green-300">✓ Status: 200 OK</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">{step?.title}</h2>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                This step provides hands-on experience with {scenario.title.toLowerCase()}.
                Follow the interactive guide to complete the implementation.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {getStepContent()}

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
        </button>

        <div className="flex space-x-3">
          {currentStep > 0 && (
            <button className="px-4 py-2 text-slate-600 hover:text-slate-800">
              Previous
            </button>
          )}
          <button
            onClick={() => onStepComplete(currentStep)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>Complete Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showHint && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="font-medium text-blue-900 mb-2">💡 Hint</div>
          <p className="text-blue-800 text-sm">
            Focus on understanding the relationship between {scenario.services.slice(0, 2).join(' and ')}
            in this architecture pattern.
          </p>
        </div>
      )}
    </div>
  );
};

// Interactive Architecture Diagram Component
const InteractiveArchitectureDiagram: React.FC<{ scenario: CloudScenario }> = ({ scenario }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServiceIcon = (service: string) => {
    const icons: { [key: string]: string } = {
      'S3': '🪣', 'Lambda': '⚡', 'API Gateway': '🚪', 'DynamoDB': '🗄️',
      'CloudFront': '🌐', 'Route 53': '🗺️', 'EC2': '💻', 'RDS': '🗃️',
      'VPC': '🏠', 'IAM': '🔐', 'CloudWatch': '📊', 'SNS': '📢',
      'Azure Functions': '⚡', 'App Service': '🌐', 'Cosmos DB': '🌌',
      'Azure SQL': '🗃️', 'Storage Account': '📦', 'Key Vault': '🔑',
      'Cloud Run': '🏃', 'Cloud Functions': '⚡', 'Cloud SQL': '🗃️',
      'Cloud Storage': '🪣', 'BigQuery': '📊', 'Pub/Sub': '📢'
    };
    return icons[service] || '⚙️';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
        <span>🏗️</span>
        <span>Architecture Overview</span>
      </h3>

      <div className="bg-white rounded-lg p-6 border-2 border-dashed border-slate-300 min-h-[300px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {scenario.services.slice(0, 6).map((service, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedService === service
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedService(selectedService === service ? null : service)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{getServiceIcon(service)}</div>
                <div className="text-sm font-medium text-slate-900">{service}</div>
                <div className="text-xs text-slate-500 mt-1">{scenario.provider.toUpperCase()}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 className="font-semibold text-blue-900 mb-2">{selectedService}</h4>
            <p className="text-blue-800 text-sm">
              Core component in the {scenario.title} architecture. Click to explore configuration options.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Code Editor Component
const CodeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}> = ({ value, onChange, language, placeholder }) => {
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{language.toUpperCase()}</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-green-400 resize-none focus:outline-none"
        style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
      />
    </div>
  );
};

export default ScenarioLibrary;
