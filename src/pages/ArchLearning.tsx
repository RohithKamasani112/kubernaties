import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  Layers,
  Zap,
  BookOpen,
  Target,
  Users,
  Download,
  Play,
  Brain,
  Sparkles,
  ArrowRight,
  Award,
  Code,
  Palette,
  Bot,
  Share2,
  Rocket,
  Globe,
  Shield,
  Database,
  Network,
  Server,
  Settings
} from 'lucide-react';

// Import components
import ScenarioLibrary from '../components/arch-learning/ScenarioLibrary';
import { TabButtonGroup } from '../components/ui/TabButtonGroup';
import AIArchitectureGenerator from '../components/arch-learning/AIArchitectureGenerator';
import CloudCanvasBuilder from '../components/arch-learning/CloudCanvasBuilder';
import LearningPathSystem from '../components/arch-learning/LearningPathSystem';
import { StatusBadge } from '../components/ui/StatusBadge';

const ArchLearning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'builder' | 'ai-generator' | 'learning-paths'>('overview');

  const cloudProviders = [
    { name: 'AWS', icon: '🟠', color: 'from-orange-500 to-yellow-500', services: '200+' },
    { name: 'Azure', icon: '🔵', color: 'from-blue-500 to-cyan-500', services: '150+' },
    { name: 'GCP', icon: '🟢', color: 'from-green-500 to-emerald-500', services: '100+' }
  ];

  const learningLevels = [
    {
      level: 'Beginner',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      scenarios: 8,
      description: 'Static websites, basic VMs, simple storage'
    },
    {
      level: 'Intermediate',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      scenarios: 12,
      description: 'Serverless APIs, CI/CD, microservices'
    },
    {
      level: 'Expert',
      icon: <Award className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      scenarios: 15,
      description: 'Multi-region, ML pipelines, enterprise security'
    }
  ];

  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Interactive Canvas Builder',
      description: 'Drag-and-drop AWS, Azure, GCP services with auto-snap connectors and real-time animations',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Architecture Generator',
      description: 'Generate cloud architectures from natural language prompts with cost estimates and best practices',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Animated Flow Visualization',
      description: 'See request flow, fault tolerance, auto-scaling events, and data pipelines in real-time',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Export & Code Generation',
      description: 'Export to PNG, SVG, PDF, JSON, Terraform, CloudFormation, and Kubernetes YAML',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: 'Collaboration & Sharing',
      description: 'Comment, share, fork architectures, and get feedback from the community',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Guided Learning Paths',
      description: 'Structured progression from beginner to expert with hands-on labs and challenges',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Compact Header */}
      <section className="relative py-4 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Cloud Architecture Learning Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Master Cloud <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Architecture</span>
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto mb-4">
            Learn AWS, Azure, and GCP through interactive tools • 35+ scenarios • AI-powered generation
          </p>

          {/* Cloud Provider Support - Compact */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-slate-600 font-medium">Platforms:</span>
            {cloudProviders.map((provider, index) => (
              <div
                key={provider.name}
                className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-200"
              >
                <span className="text-sm">{provider.icon}</span>
                <span className="font-semibold text-slate-700 text-xs">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Under Development Banner */}
      <motion.section
        className="bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 border-b border-orange-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            <StatusBadge status="under-development" size="md" animated={true} />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-orange-800 mb-1">
                🚧 Feature Under Active Development
              </h3>
              <p className="text-sm text-orange-700">
                We're building something amazing! This feature is currently in development.
                Some functionality may be limited or experimental.
              </p>
            </div>
          </div>
        </div>
      </motion.section>





      {/* Horizontal Top Navigation */}
      <section className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Features</h3>
              <p className="text-sm text-slate-600">Choose your learning path</p>
            </div>
          </div>

          <TabButtonGroup
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                icon: <Globe className="w-5 h-5" />,
                subtext: 'Platform intro'
              },
              {
                id: 'scenarios',
                label: 'Scenarios',
                icon: <Layers className="w-5 h-5" />,
                subtext: '35+ real examples'
              },
              {
                id: 'ai-generator',
                label: 'AI Gen',
                icon: <Zap className="w-5 h-5" />,
                subtext: 'Text → architecture'
              },
              {
                id: 'builder',
                label: 'Builder',
                icon: <Code className="w-5 h-5" />,
                subtext: 'Drag & drop'
              },
              {
                id: 'learning-paths',
                label: 'Paths',
                icon: <Users className="w-5 h-5" />,
                subtext: 'Guided learning'
              }
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as any)}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Feature Overview with Immediate Sub-features */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                  {/* Scenario Library Features */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setActiveTab('scenarios')}>
                    <div className="flex items-center justify-between mb-3">
                      <Database className="w-6 h-6 text-blue-600" />
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    </div>
                    <h4 className="font-bold text-blue-900 mb-2">Scenario Library</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>35+ real-world examples</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Beginner → Expert levels</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>AWS, Azure, GCP, Multi-cloud</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cost estimates & best practices</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Generator Features */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setActiveTab('ai-generator')}>
                    <div className="flex items-center justify-between mb-3">
                      <Bot className="w-6 h-6 text-green-600" />
                      <ArrowRight className="w-4 h-4 text-green-500" />
                    </div>
                    <h4 className="font-bold text-green-900 mb-2">AI Generator</h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Natural language input</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Multi-cloud support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Cost & security analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Export to Terraform/CloudFormation</span>
                      </div>
                    </div>
                  </div>

                  {/* Canvas Builder Features */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setActiveTab('builder')}>
                    <div className="flex items-center justify-between mb-3">
                      <Palette className="w-6 h-6 text-orange-600" />
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-orange-900 mb-2">Canvas Builder</h4>
                    <div className="space-y-2 text-sm text-orange-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Drag & drop interface</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>450+ cloud services</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Real-time flow animations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Zoom, grid, export tools</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Paths Features */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setActiveTab('learning-paths')}>
                    <div className="flex items-center justify-between mb-3">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                      <ArrowRight className="w-4 h-4 text-purple-500" />
                    </div>
                    <h4 className="font-bold text-purple-900 mb-2">Learning Paths</h4>
                    <div className="space-y-2 text-sm text-purple-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Structured progression</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Lessons, labs, projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Skill development</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">🎓 Your Learning Progress</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">AWS Fundamentals</span>
                          <span className="text-slate-900 font-medium">3/8 modules</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '37%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Azure Solutions</span>
                          <span className="text-slate-900 font-medium">0/10 modules</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">GCP Mastery</span>
                          <span className="text-slate-900 font-medium">0/12 modules</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('learning-paths')}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Continue Learning
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">🚀 Quick Start Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveTab('scenarios')}
                        className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 text-left"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900 text-sm">Browse Scenarios</div>
                          <div className="text-xs text-blue-700">35+ examples</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab('ai-generator')}
                        className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 text-left"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-900 text-sm">Try AI Generator</div>
                          <div className="text-xs text-green-700">Text → architecture</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab('builder')}
                        className="flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 text-left"
                      >
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Palette className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-orange-900 text-sm">Start Building</div>
                          <div className="text-xs text-orange-700">Drag & drop</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab('learning-paths')}
                        className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 text-left"
                      >
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-purple-900 text-sm">Learn Structured</div>
                          <div className="text-xs text-purple-700">Guided paths</div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-2 text-sm text-slate-700">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">Pro Tip:</span>
                        <span>Start with scenarios to see examples, then use AI generator or builder to create your own!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'scenarios' && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ScenarioLibrary />
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CloudCanvasBuilder />
              </motion.div>
            )}

            {activeTab === 'ai-generator' && (
              <motion.div
                key="ai-generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AIArchitectureGenerator />
              </motion.div>
            )}

            {activeTab === 'learning-paths' && (
              <motion.div
                key="learning-paths"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <LearningPathSystem />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default ArchLearning;
