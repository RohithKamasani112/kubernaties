import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Code,
  Image,
  FileText,
  Settings,
  Play,
  Star
} from 'lucide-react';
import { cloudScenarios } from '../../data/cloudScenarios';

interface GeneratedArchitecture {
  id: string;
  prompt: string;
  title: string;
  description: string;
  provider: 'aws' | 'azure' | 'gcp';
  services: string[];
  architecture: string;
  costEstimate: string;
  securityNotes: string[];
  bestPractices: string[];
  exportOptions: string[];
  timestamp: Date;
}

const AIArchitectureGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArchitecture, setGeneratedArchitecture] = useState<GeneratedArchitecture | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'aws' | 'azure' | 'gcp'>('auto');
  const [includeCosting, setIncludeCosting] = useState(true);
  const [includeSecurity, setIncludeSecurity] = useState(true);
  const [complexityLevel, setComplexityLevel] = useState<'simple' | 'moderate' | 'complex'>('moderate');

  const examplePrompts = [
    "Build me a fault-tolerant architecture to host a React app with CloudFront, S3, and Lambda.",
    "Create a serverless data processing pipeline for real-time analytics.",
    "Design a microservices architecture with auto-scaling and monitoring.",
    "Set up a secure multi-tenant SaaS platform with role-based access.",
    "Build a machine learning pipeline from data ingestion to model deployment.",
    "Create a disaster recovery setup across multiple regions."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation (in real implementation, this would call an AI API)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated architecture based on prompt
    const mockArchitecture: GeneratedArchitecture = {
      id: Date.now().toString(),
      prompt: prompt,
      title: "Scalable Web Application Architecture",
      description: "A production-ready, fault-tolerant web application architecture with auto-scaling, monitoring, and security best practices.",
      provider: selectedProvider === 'auto' ? 'aws' : selectedProvider,
      services: [
        "Application Load Balancer",
        "Auto Scaling Groups", 
        "EC2 Instances",
        "RDS Multi-AZ",
        "ElastiCache",
        "CloudFront",
        "S3",
        "CloudWatch",
        "WAF",
        "Route 53"
      ],
      architecture: "CloudFront → ALB → Auto Scaling Group (EC2) → RDS Multi-AZ with ElastiCache for session storage and S3 for static assets",
      costEstimate: "$150-300/month for moderate traffic (10k-50k users)",
      securityNotes: [
        "WAF protection against common attacks",
        "Security groups with least privilege access",
        "RDS encryption at rest and in transit",
        "CloudTrail for audit logging",
        "IAM roles with minimal permissions"
      ],
      bestPractices: [
        "Multi-AZ deployment for high availability",
        "Auto Scaling for cost optimization",
        "CloudWatch monitoring and alerting",
        "Regular automated backups",
        "Blue-green deployment strategy"
      ],
      exportOptions: ["CloudFormation", "Terraform", "CDK", "PNG Diagram", "PDF Report"],
      timestamp: new Date()
    };

    setGeneratedArchitecture(mockArchitecture);
    setIsGenerating(false);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
          <Bot className="w-4 h-4" />
          <span>AI-Powered Architecture Generator</span>
          <Sparkles className="w-4 h-4" />
        </div>
        
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Generate Cloud Architectures with AI
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Describe your requirements in natural language and get production-ready cloud architectures 
          with cost estimates, security recommendations, and export-ready code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>Describe Your Architecture</span>
            </h3>

            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cloud Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="auto">Auto-select</option>
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">Google Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Complexity</label>
                <select
                  value={complexityLevel}
                  onChange={(e) => setComplexityLevel(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-slate-700">Options</label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeCosting}
                    onChange={(e) => setIncludeCosting(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-700">Include cost estimates</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeSecurity}
                    onChange={(e) => setIncludeSecurity(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-700">Security recommendations</span>
                </label>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your architecture requirements... e.g., 'Build a scalable web app with auto-scaling, database, and CDN on AWS'"
                className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Architecture</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Example Prompts */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Try these examples:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Multi-Cloud Support</p>
                  <p className="text-sm text-slate-600">AWS, Azure, GCP</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cost Estimation</p>
                  <p className="text-sm text-slate-600">Real-time pricing</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Code Generation</p>
                  <p className="text-sm text-slate-600">Terraform, CloudFormation</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Best Practices</p>
                  <p className="text-sm text-slate-600">Security & performance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pro Tip</h3>
            <p className="text-sm text-slate-700">
              Be specific about your requirements: traffic volume, data storage needs, 
              compliance requirements, and performance expectations for better results.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Architecture Results */}
      <AnimatePresence>
        {generatedArchitecture && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            {/* Results Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{generatedArchitecture.title}</h3>
                  <p className="opacity-90">{generatedArchitecture.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {generatedArchitecture.provider === 'aws' ? '🟠' : 
                     generatedArchitecture.provider === 'azure' ? '🔵' : '🟢'}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {generatedArchitecture.provider.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Architecture Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Architecture Overview</span>
                    </h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                      {generatedArchitecture.architecture}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Services Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedArchitecture.services.map((service, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {includeCosting && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Cost Estimate</span>
                      </h4>
                      <p className="text-slate-700 bg-green-50 p-4 rounded-lg border border-green-200">
                        {generatedArchitecture.costEstimate}
                      </p>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-6">
                  {includeSecurity && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Security Recommendations</span>
                      </h4>
                      <ul className="space-y-2">
                        {generatedArchitecture.securityNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Best Practices</span>
                    </h4>
                    <ul className="space-y-2">
                      {generatedArchitecture.bestPractices.map((practice, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Options</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {generatedArchitecture.exportOptions.map((option, idx) => (
                    <button
                      key={idx}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      {option.includes('PNG') || option.includes('PDF') ? 
                        <Image className="w-4 h-4" /> : 
                        <Code className="w-4 h-4" />
                      }
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  <Play className="w-4 h-4" />
                  <span>Build in Canvas</span>
                </button>
                <button 
                  onClick={() => copyToClipboard(generatedArchitecture.prompt)}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIArchitectureGenerator;
