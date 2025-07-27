import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Target,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Code,
  Layers,
  Trophy,
  Zap,
  BookOpen,
  FileText,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const BlueprintDetail: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const navigate = useNavigate();
  const { blueprints, startBlueprint, createPlaygroundSession } = useWebElevateStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'requirements'>('overview');
  
  const blueprint = blueprints.find(b => b.id === blueprintId);

  if (!blueprint) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blueprint Not Found</h1>
          <Link
            to="/web-elevate/blueprints"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Blueprints
          </Link>
        </div>
      </div>
    );
  }

  const handleStartBlueprint = () => {
    if (!blueprint.isStarted) {
      startBlueprint(blueprint.id);
    }
    // Create playground session and navigate
    const sessionId = createPlaygroundSession('blueprint', blueprint.id);
    navigate(`/web-elevate/playground/${sessionId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/web-elevate/blueprints"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blueprints</span>
        </Link>
      </motion.div>

      {/* Blueprint Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{blueprint.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getDifficultyColor(blueprint.difficulty)}`}>
                    {blueprint.difficulty}
                  </span>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {blueprint.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-6">{blueprint.description}</p>

            {/* Scenario */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Project Scenario</h3>
              <p className="text-blue-800 text-sm">{blueprint.scenario}</p>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Technologies You'll Use</h3>
              <div className="flex flex-wrap gap-2">
                {blueprint.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{blueprint.estimatedTime}</div>
                <div className="text-sm text-gray-500">Est. Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{blueprint.deliverables.length}</div>
                <div className="text-sm text-gray-500">Deliverables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{blueprint.userStories.length}</div>
                <div className="text-sm text-gray-500">User Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.round(blueprint.progress)}%</div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            {blueprint.progress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Overall Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(blueprint.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${blueprint.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Action Panel */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-6">
              {blueprint.isUnlocked ? (
                <div className="space-y-4">
                  <button
                    onClick={handleStartBlueprint}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>{blueprint.isStarted ? 'Continue Building' : 'Start Blueprint'}</span>
                  </button>
                  
                  <Link
                    to="/web-elevate/playground"
                    className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Code className="w-5 h-5" />
                    <span>Open Playground</span>
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Prerequisites Required
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete the required learning paths to unlock this blueprint.
                  </p>
                  <div className="space-y-2">
                    {blueprint.prerequisites.map((prereq, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded border">
                        {prereq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium text-gray-900 capitalize">{blueprint.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900 capitalize">{blueprint.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Estimate</span>
                    <span className="font-medium text-gray-900">{blueprint.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'architecture', label: 'Architecture', icon: Layers },
            { id: 'requirements', label: 'Requirements', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* User Stories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Stories</h3>
                <div className="space-y-3">
                  {blueprint.userStories.map((story, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{story}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concepts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Concepts You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {blueprint.concepts.map((concept, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Deliverables</h3>
                <div className="space-y-2">
                  {blueprint.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Trophy className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Architecture</h3>
              <div className="bg-gray-50 rounded-lg p-6 min-h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium mb-2">Architecture Diagram</h4>
                  <p className="text-sm">Interactive architecture diagram will be displayed here</p>
                </div>
              </div>
              
              {/* Architecture Components */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">System Components</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blueprint.architectureComponents.map((component) => (
                    <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{component.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {component.technologies.map((tech) => (
                          <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Requirements</h3>
                <div className="space-y-3">
                  {blueprint.technicalRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Criteria</h3>
                <div className="space-y-3">
                  {blueprint.tests.map((test) => (
                    <div key={test.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {test.type} test
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BlueprintDetail;
