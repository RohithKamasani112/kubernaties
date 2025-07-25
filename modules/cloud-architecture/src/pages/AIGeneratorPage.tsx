import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Cloud, 
  Shield, 
  DollarSign, 
  Code, 
  Award, 
  CheckCircle,
  Sparkles,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AIGeneratorPage: React.FC = () => {
  const [requirements, setRequirements] = useState('');
  const [cloudProvider, setCloudProvider] = useState('auto-select');
  const [complexity, setComplexity] = useState('moderate');
  const [includeCostEstimates, setIncludeCostEstimates] = useState(true);
  const [includeSecurityRecommendations, setIncludeSecurityRecommendations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArchitecture, setGeneratedArchitecture] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedArchitecture(`# Generated Cloud Architecture

## Architecture Overview
Based on your requirements: "${requirements}"

## Infrastructure Components
- **Load Balancer**: Application Load Balancer (ALB)
- **Compute**: Auto Scaling Group with EC2 instances
- **Database**: Amazon RDS (PostgreSQL)
- **Storage**: Amazon S3 for static assets
- **CDN**: Amazon CloudFront
- **Monitoring**: CloudWatch + X-Ray

## Security Recommendations
- Enable WAF on ALB
- Use VPC with private subnets
- Implement IAM roles with least privilege
- Enable encryption at rest and in transit

## Cost Estimation
- Monthly estimate: $450-650
- Primary costs: EC2 instances (60%), RDS (25%), Data transfer (15%)

## Terraform Code
\`\`\`hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "main-igw"
  }
}
\`\`\`
`);
      setIsGenerating(false);
    }, 3000);
  };

  const examplePrompts = [
    "Build me a fault-tolerant architecture to host a web app with auto-scaling, database, and CDN on AWS",
    "Create a serverless data processing pipeline for real-time analytics with cost optimization",
    "Design a multi-region disaster recovery setup for a critical e-commerce application"
  ];

  return (
    <>
      <Helmet>
        <title>AI-Powered Architecture Generator - Cloud Architecture</title>
        <meta name="description" content="Generate production-ready cloud architectures with AI assistance" />
      </Helmet>

      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI-Powered Architecture Generator</h1>
                <p className="text-slate-600">Describe your requirements in natural language and get production-ready cloud architectures with cost estimates, security recommendations, and export-ready code.</p>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Cloud className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Multi-Cloud Support</h3>
              <p className="text-xs text-slate-600">AWS, Azure, GCP</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Cost Estimation</h3>
              <p className="text-xs text-slate-600">Real-time pricing</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Code Generation</h3>
              <p className="text-xs text-slate-600">Terraform, CloudFormation</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Best Practices</h3>
              <p className="text-xs text-slate-600">Security & performance</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Pro Tips</h3>
              <p className="text-xs text-slate-600">Expert recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Describe Your Architecture</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cloud Provider</label>
                    <select 
                      value={cloudProvider}
                      onChange={(e) => setCloudProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="auto-select">Auto-select</option>
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">Google Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Complexity</label>
                    <select 
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="simple">Simple</option>
                      <option value="moderate">Moderate</option>
                      <option value="complex">Complex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={includeCostEstimates}
                          onChange={(e) => setIncludeCostEstimates(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">Include cost estimates</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={includeSecurityRecommendations}
                          onChange={(e) => setIncludeSecurityRecommendations(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">Security recommendations</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe your architecture requirements... e.g., "Build a scalable web app with auto-scaling, database, and CDN on AWS"
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe your architecture requirements..."
                    className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!requirements.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                    </>
                  )}
                </button>

                {/* Example Prompts */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-700 mb-3">💡 Try these examples:</p>
                  <div className="space-y-2">
                    {examplePrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setRequirements(prompt)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Capabilities Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">AI Capabilities</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900">Multi-Cloud Support</h4>
                      <p className="text-sm text-slate-600">AWS, Azure, GCP</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900">Cost Estimation</h4>
                      <p className="text-sm text-slate-600">Real-time pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900">Code Generation</h4>
                      <p className="text-sm text-slate-600">Terraform, CloudFormation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900">Best Practices</h4>
                      <p className="text-sm text-slate-600">Security & performance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pro Tip</h3>
                <p className="text-sm text-slate-700">
                  Be specific about your requirements: traffic volume, data storage needs, compliance requirements, and performance expectations for better results.
                </p>
              </div>
            </div>
          </div>

          {/* Generated Architecture Results */}
          {generatedArchitecture && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Generated Architecture</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">{generatedArchitecture}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIGeneratorPage;
