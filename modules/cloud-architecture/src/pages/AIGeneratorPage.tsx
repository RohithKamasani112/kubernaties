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

      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-lg mb-6"
              >
                <Sparkles className="w-8 h-8" />
                <span className="text-xl font-bold">AI Architecture Generator</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent"
              >
                Design Cloud Architectures with AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
              >
                Transform your ideas into production-ready cloud architectures. Simply describe what you need,
                and our AI will generate complete solutions with infrastructure code, cost estimates, and security best practices.
              </motion.p>
            </div>
          </div>

          {/* Enhanced Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          >
            {[
              { icon: Cloud, title: 'Multi-Cloud Support', desc: 'AWS, Azure, GCP', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
              { icon: DollarSign, title: 'Cost Estimation', desc: 'Real-time pricing', color: 'green', gradient: 'from-green-500 to-emerald-500' },
              { icon: Code, title: 'Code Generation', desc: 'Terraform, CloudFormation', color: 'purple', gradient: 'from-purple-500 to-violet-500' },
              { icon: Shield, title: 'Security First', desc: 'Best practices built-in', color: 'orange', gradient: 'from-orange-500 to-red-500' },
              { icon: Award, title: 'Expert Insights', desc: 'Pro recommendations', color: 'yellow', gradient: 'from-yellow-500 to-amber-500' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-slate-400 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Describe Your Architecture</h2>
                    <p className="text-slate-600">Tell us what you want to build, and we'll create it for you</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Cloud Provider</label>
                    <div className="relative">
                      <select
                        value={cloudProvider}
                        onChange={(e) => setCloudProvider(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                      >
                        <option value="auto-select">🤖 Auto-select Best</option>
                        <option value="aws">☁️ Amazon AWS</option>
                        <option value="azure">🔷 Microsoft Azure</option>
                        <option value="gcp">🌐 Google Cloud</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Complexity Level</label>
                    <div className="relative">
                      <select
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                      >
                        <option value="simple">🟢 Simple & Clean</option>
                        <option value="moderate">🟡 Moderate Scale</option>
                        <option value="complex">🔴 Enterprise Grade</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Additional Features</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 bg-white/50 rounded-xl border border-slate-200 hover:bg-white/80 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCostEstimates}
                          onChange={(e) => setIncludeCostEstimates(e.target.checked)}
                          className="rounded-lg border-slate-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">💰 Cost Estimates</span>
                      </label>
                      <label className="flex items-center p-3 bg-white/50 rounded-xl border border-slate-200 hover:bg-white/80 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSecurityRecommendations}
                          onChange={(e) => setIncludeSecurityRecommendations(e.target.checked)}
                          className="rounded-lg border-slate-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">🔒 Security Guide</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    ✨ Describe Your Vision
                  </label>
                  <div className="relative">
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Tell me what you want to build...

For example:
• 'Build a scalable web app with auto-scaling, database, and CDN on AWS'
• 'Create a serverless data processing pipeline for real-time analytics'
• 'Design a secure multi-tenant SaaS platform with role-based access'

Be as detailed as you like - the more context, the better the result!"
                      className="w-full h-40 px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-500 leading-relaxed"
                      style={{ fontSize: '16px' }}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                      {requirements.length}/2000 characters
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!requirements.trim() || isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin relative z-10" />
                      <span className="relative z-10">Generating Your Architecture...</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">Generate My Architecture</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse relative z-10"></div>
                    </>
                  )}
                </motion.button>

                {/* Enhanced Example Prompts */}
                <div className="mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">Quick Start Examples</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {examplePrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setRequirements(prompt)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="group text-left p-4 bg-gradient-to-r from-white/80 to-slate-50/80 hover:from-purple-50/80 hover:to-pink-50/80 rounded-xl border border-slate-200 hover:border-purple-300 text-sm text-slate-700 hover:text-slate-900 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-start space-x-3 relative z-10">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300"></div>
                          <span className="flex-1 leading-relaxed font-medium">"{prompt}"</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced AI Capabilities Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">AI Superpowers</h3>
                </div>

                <div className="space-y-5">
                  {[
                    { icon: Cloud, title: 'Multi-Cloud Mastery', desc: 'AWS, Azure, GCP expertise', color: 'from-blue-500 to-cyan-500' },
                    { icon: DollarSign, title: 'Smart Cost Analysis', desc: 'Real-time pricing & optimization', color: 'from-green-500 to-emerald-500' },
                    { icon: Code, title: 'Code Generation', desc: 'Terraform, CloudFormation, CDK', color: 'from-purple-500 to-violet-500' },
                    { icon: Shield, title: 'Security by Design', desc: 'Built-in best practices', color: 'from-orange-500 to-red-500' },
                    { icon: Award, title: 'Expert Insights', desc: 'Pro tips & recommendations', color: 'from-yellow-500 to-amber-500' }
                  ].map((capability, index) => (
                    <motion.div
                      key={capability.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${capability.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <capability.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1">{capability.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{capability.desc}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">Pro Tip</span>
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    The more detailed your description, the better our AI can tailor the architecture to your specific needs!
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pro Tip</h3>
                <p className="text-sm text-slate-700">
                  Be specific about your requirements: traffic volume, data storage needs, compliance requirements, and performance expectations for better results.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Generated Architecture Results */}
          {generatedArchitecture && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <div className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">🎉 Your Architecture is Ready!</h2>
                        <p className="text-green-100">Generated with AI-powered best practices</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
                      >
                        <Copy className="w-5 h-5" />
                        <span>Copy All</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-green-600 hover:bg-green-50 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export Code</span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 overflow-auto shadow-inner">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-slate-400 text-sm font-mono">architecture-output.md</span>
                    </div>
                    <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                      {generatedArchitecture}
                    </pre>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-blue-900">View in Studio</h4>
                        <p className="text-xs text-blue-700">Open in visual editor</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-purple-900">Refine Further</h4>
                        <p className="text-xs text-purple-700">Ask for modifications</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-green-900">Save & Share</h4>
                        <p className="text-xs text-green-700">Add to your collection</p>
                      </div>
                    </motion.button>
                  </div>
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
