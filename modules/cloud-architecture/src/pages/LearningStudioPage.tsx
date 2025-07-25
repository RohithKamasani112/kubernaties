import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Code, 
  Eye, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface LearningStudioPageProps {}

const LearningStudioPage: React.FC<LearningStudioPageProps> = () => {
  const { scenarioId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [codeContent, setCodeContent] = useState('');

  // Sample scenario data
  const scenario = {
    id: scenarioId || 'web-app-basic',
    title: 'Basic Web Application Architecture',
    description: 'Learn to design a scalable web application with load balancer, web servers, and database',
    difficulty: 'Beginner',
    estimatedTime: '30 minutes',
    steps: [
      {
        title: 'Understanding the Requirements',
        concept: 'Web Application Architecture',
        problem: 'Design a scalable web application that can handle increasing traffic',
        task: 'Create a basic 3-tier architecture with presentation, application, and data layers'
      },
      {
        title: 'Setting up Load Balancer',
        concept: 'Load Balancing',
        problem: 'Distribute incoming requests across multiple servers',
        task: 'Configure an Application Load Balancer to route traffic'
      },
      {
        title: 'Configuring Web Servers',
        concept: 'Auto Scaling',
        problem: 'Handle varying traffic loads automatically',
        task: 'Set up Auto Scaling Group with EC2 instances'
      }
    ]
  };

  const currentStepData = scenario.steps[currentStep];

  const handleApplyCode = () => {
    // Simulate applying the code to the architecture canvas
    console.log('Applying code:', codeContent);
  };

  const handleNextStep = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel - Guided Tutorial - Mobile Responsive */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{scenario.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">{scenario.difficulty} • {scenario.estimatedTime}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">{scenario.description}</p>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-500">{currentStep + 1} of {scenario.steps.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / scenario.steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">{currentStepData.title}</h2>
            
            {/* Concept */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-slate-800">Concept</h3>
              </div>
              <p className="text-slate-600 text-sm">{currentStepData.concept}</p>
            </div>

            {/* Problem */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-red-500" />
                <h3 className="font-semibold text-slate-800">Problem</h3>
              </div>
              <p className="text-slate-600 text-sm">{currentStepData.problem}</p>
            </div>

            {/* Task */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-slate-800">Your Task</h3>
              </div>
              <p className="text-slate-600 text-sm">{currentStepData.task}</p>
            </div>

            {/* Next Step Button */}
            <button
              onClick={handleNextStep}
              disabled={currentStep >= scenario.steps.length - 1}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{currentStep >= scenario.steps.length - 1 ? 'Complete' : 'Next Step'}</span>
              {currentStep < scenario.steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Middle Panel - Live Code Editor - Mobile Responsive */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Code Editor</h2>
          </div>
          <button
            onClick={handleApplyCode}
            className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 transition-colors touch-manipulation"
          >
            Apply
          </button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-3 sm:p-4 min-h-[200px] lg:min-h-0">
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="# Write your infrastructure code here
# Example: Terraform, CloudFormation, or Pulumi

resource &quot;aws_lb&quot; &quot;main&quot; {
  name               = &quot;web-app-lb&quot;
  internal           = false
  load_balancer_type = &quot;application&quot;

  subnets = [
    aws_subnet.public_1.id,
    aws_subnet.public_2.id
  ]
}"
            className="w-full h-full resize-none border border-slate-200 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Panel - Live Architecture Visualizer - Mobile Responsive */}
      <div className="w-full lg:w-1/3 flex flex-col min-h-[300px] lg:min-h-0">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center space-x-2">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Architecture Canvas</h2>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-3 sm:p-4 bg-slate-50">
          <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm sm:text-base">Architecture will appear here</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Write code and click Apply to visualize</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStudioPage;
