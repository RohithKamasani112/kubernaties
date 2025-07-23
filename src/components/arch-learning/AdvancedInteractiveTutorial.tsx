import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Terminal, 
  Eye, 
  Zap,
  Settings,
  Monitor,
  Database,
  Shield,
  Globe,
  Cpu,
  HardDrive,
  Network,
  Lock,
  TrendingUp,
  FileText,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { CloudScenario } from '../../data/cloudScenarios';

interface AdvancedInteractiveTutorialProps {
  scenario: CloudScenario;
  onClose: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  type: 'overview' | 'configuration' | 'implementation' | 'testing' | 'monitoring' | 'security';
  duration: string;
  interactive: boolean;
  codeExample?: string;
  visualDemo?: boolean;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

const AdvancedInteractiveTutorial: React.FC<AdvancedInteractiveTutorialProps> = ({ scenario, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showVisualDemo, setShowVisualDemo] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showHints, setShowHints] = useState(false);

  const steps: TutorialStep[] = [
    {
      id: 'overview',
      title: '🎯 Architecture Overview',
      description: 'Understanding the complete architecture and data flow',
      type: 'overview',
      duration: '5 min',
      interactive: true,
      visualDemo: true
    },
    {
      id: 'setup',
      title: '⚙️ Environment Setup',
      description: 'Configure your development environment and prerequisites',
      type: 'configuration',
      duration: '10 min',
      interactive: true,
      codeExample: `# Install required tools
npm install -g @aws-cdk/cli
aws configure
terraform --version`
    },
    {
      id: 'implementation',
      title: '🔨 Hands-on Implementation',
      description: 'Build the architecture step by step with real code',
      type: 'implementation',
      duration: '20 min',
      interactive: true,
      codeExample: generateImplementationCode(scenario)
    },
    {
      id: 'testing',
      title: '🧪 Testing & Validation',
      description: 'Test your implementation and validate functionality',
      type: 'testing',
      duration: '10 min',
      interactive: true,
      quiz: {
        question: `What is the primary benefit of using ${scenario.services[0]} in this architecture?`,
        options: [
          'Cost reduction',
          'Improved scalability',
          'Enhanced security',
          'All of the above'
        ],
        correct: 3
      }
    },
    {
      id: 'monitoring',
      title: '📊 Monitoring & Observability',
      description: 'Set up monitoring, logging, and alerting',
      type: 'monitoring',
      duration: '8 min',
      interactive: true
    },
    {
      id: 'security',
      title: '🔒 Security Hardening',
      description: 'Implement security best practices and compliance',
      type: 'security',
      duration: '12 min',
      interactive: true
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isPlaying && currentStepData?.visualDemo) {
      const interval = setInterval(() => {
        setTerminalOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Executing step ${currentStep + 1}...`,
          `[${new Date().toLocaleTimeString()}] ✅ ${currentStepData.title} completed`
        ]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep]);

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStepData.id)) {
      setCompletedSteps([...completedSteps, currentStepData.id]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const executeCode = () => {
    setTerminalOutput([]);
    setIsPlaying(true);
    
    // Simulate code execution
    setTimeout(() => {
      setTerminalOutput([
        '$ terraform init',
        'Initializing the backend...',
        'Terraform has been successfully initialized!',
        '',
        '$ terraform plan',
        'Refreshing Terraform state in-memory prior to plan...',
        `Plan: ${scenario.services.length} to add, 0 to change, 0 to destroy.`,
        '',
        '$ terraform apply',
        'Apply complete! Resources: 5 added, 0 changed, 0 destroyed.'
      ]);
      setIsPlaying(false);
    }, 3000);
  };

  const getStepIcon = (type: string) => {
    const icons = {
      overview: <Eye className="w-5 h-5" />,
      configuration: <Settings className="w-5 h-5" />,
      implementation: <Code className="w-5 h-5" />,
      testing: <CheckCircle className="w-5 h-5" />,
      monitoring: <Monitor className="w-5 h-5" />,
      security: <Shield className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Code className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{scenario.title}</h2>
              <p className="text-blue-100 mt-1">Interactive Learning Experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex h-full">
          {/* Left Sidebar - Steps */}
          <div className="w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-4">Learning Path</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    currentStep === index
                      ? 'bg-blue-100 border-blue-300 shadow-md'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setCurrentStep(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-500 text-white'
                        : currentStep === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        getStepIcon(step.type)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-slate-600">{step.duration}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    {getStepIcon(currentStepData.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{currentStepData.title}</h3>
                    <p className="text-slate-600">{currentStepData.description}</p>
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  {currentStepData.visualDemo && (
                    <VisualArchitectureDemo scenario={scenario} isPlaying={isPlaying} />
                  )}

                  {currentStepData.codeExample && (
                    <InteractiveCodeEditor
                      code={currentStepData.codeExample}
                      onChange={setUserCode}
                      onExecute={executeCode}
                      isExecuting={isPlaying}
                    />
                  )}

                  {terminalOutput.length > 0 && (
                    <TerminalOutput output={terminalOutput} />
                  )}

                  {currentStepData.quiz && (
                    <InteractiveQuiz
                      quiz={currentStepData.quiz}
                      selectedAnswer={quizAnswer}
                      onAnswerSelect={setQuizAnswer}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
                  </button>
                  
                  {currentStepData.interactive && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Pause' : 'Start Demo'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Previous
                    </button>
                  )}
                  
                  <button
                    onClick={handleStepComplete}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Step</span>
                  </button>
                </div>
              </div>

              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-900">💡 Pro Tip</div>
                      <p className="text-yellow-800 text-sm mt-1">
                        Focus on understanding how {scenario.services.slice(0, 2).join(' and ')} work together 
                        in this {scenario.level}-level architecture pattern.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to generate implementation code
function generateImplementationCode(scenario: CloudScenario): string {
  const providerConfigs = {
    aws: `# AWS Implementation for ${scenario.title}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

# Main resources
${scenario.services.slice(0, 3).map((service, index) => `
resource "aws_${service.toLowerCase().replace(/\s+/g, '_')}" "main_${index}" {
  name = "${scenario.id}-${service.toLowerCase().replace(/\s+/g, '-')}"
  
  tags = {
    Environment = "production"
    Project     = "${scenario.id}"
    Service     = "${service}"
  }
}`).join('\n')}`,

    azure: `# Azure Implementation for ${scenario.title}
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "${scenario.id}-rg"
  location = "East US"
}

${scenario.services.slice(0, 3).map((service, index) => `
resource "azurerm_${service.toLowerCase().replace(/\s+/g, '_')}" "main_${index}" {
  name                = "${scenario.id}-${service.toLowerCase().replace(/\s+/g, '-')}"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  
  tags = {
    Environment = "production"
    Project     = "${scenario.id}"
  }
}`).join('\n')}`,

    gcp: `# GCP Implementation for ${scenario.title}
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

${scenario.services.slice(0, 3).map((service, index) => `
resource "google_${service.toLowerCase().replace(/\s+/g, '_')}" "main_${index}" {
  name = "${scenario.id}-${service.toLowerCase().replace(/\s+/g, '-')}"
  
  labels = {
    environment = "production"
    project     = "${scenario.id.replace(/-/g, '_')}"
  }
}`).join('\n')}`
  };

  return providerConfigs[scenario.provider as keyof typeof providerConfigs] || providerConfigs.aws;
}

export default AdvancedInteractiveTutorial;
