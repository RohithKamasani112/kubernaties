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
      // Check if the question is related to cloud architecture
      const cloudKeywords = ['web app', 'architecture', 'aws', 'azure', 'gcp', 'cloud', 'server', 'database', 'api', 'microservice', 'container', 'kubernetes', 'docker', 'load balancer', 'cdn', 'storage', 'compute', 'scaling', 'deployment', 'infrastructure'];
      const isCloudRelated = cloudKeywords.some(keyword =>
        requirements.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!isCloudRelated) {
        setGeneratedArchitecture(`# ❌ Out of Scope

Sorry, I can only help with cloud architecture questions.

**OpenAI Integration in Progress** 🚧

Please ask questions related to:
- Cloud infrastructure design
- AWS, Azure, or GCP architectures
- Web application deployment
- Database and storage solutions
- Scaling and load balancing
- Security best practices
- Cost optimization

Try asking something like:
"Build a scalable web application with auto-scaling and database on AWS"`);
      } else {
        setGeneratedArchitecture(`# 🏗️ Scalable Web Application Architecture

**Architecture Overview**
CloudFront → ALB → Auto Scaling Group (EC2) → RDS Multi-AZ with ElastiCache for session storage and S3 for static assets.

## 🏛️ Architecture Overview

**Services Used**
- Application Load Balancer
- Auto Scaling Groups
- EC2 Instances
- CloudFront
- S3
- Route 53

## 🔒 Security Recommendations

✅ WAF protection against common attacks
✅ Security groups with least privilege access
✅ RDS encryption at rest and in transit
✅ CloudFront for audit logging
✅ IAM roles with minimal permissions

## 💰 Best Practices

✅ Multi-AZ deployment for high availability
✅ Auto Scaling for cost optimization
✅ CloudWatch monitoring and alerting
✅ Regular automated backups
✅ Blue-green deployment strategy

## 💵 Cost Estimate

**$150-300/month** for moderate traffic (10k users)
- EC2 instances: $80-150/month
- RDS: $40-80/month
- CloudFront: $10-20/month
- Load Balancer: $20-25/month

## 📤 Export Options

**CloudFormation** | **Terraform** | **CDK** | **PNG Diagram** | **PDF Report**`);
      }
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
                  {/* Architecture Result Card - Matching User's Mockup */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header with AWS badge */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">Scalable Web Application Architecture</h3>
                          <p className="text-purple-100 mt-1">A production-ready, fault-tolerant web application architecture with auto scaling, monitoring, and security best practices.</p>
                        </div>
                        <div className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                          AWS
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Architecture Overview & Services */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm">🏛️</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">Architecture Overview</h4>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              CloudFront → ALB → Auto Scaling Group (EC2) → RDS Multi-AZ with ElastiCache for session storage and S3 for static assets.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Services Used</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {['Application Load Balancer', 'Auto Scaling Groups', 'EC2 Instances', 'CloudFront', 'S3', 'Route 53'].map((service, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{service}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-sm">💰</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">Cost Estimate</h4>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="text-2xl font-bold text-gray-900 mb-1">$150-300/month</div>
                              <div className="text-sm text-gray-600">for moderate traffic (10k users)</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Security & Best Practices */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 text-sm">🔒</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">Security Recommendations</h4>
                            </div>
                            <div className="space-y-2">
                              {[
                                'WAF protection against common attacks',
                                'Security groups with least privilege access',
                                'RDS encryption at rest and in transit',
                                'CloudFront for audit logging',
                                'IAM roles with minimal permissions'
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 text-sm">⚡</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">Best Practices</h4>
                            </div>
                            <div className="space-y-2">
                              {[
                                'Multi-AZ deployment for high availability',
                                'Auto Scaling for cost optimization',
                                'CloudWatch monitoring and alerting',
                                'Regular automated backups',
                                'Blue-green deployment strategy'
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-600">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 text-sm">📤</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">Export Options</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { name: 'CloudFormation', icon: Code, color: 'bg-blue-500' },
                            { name: 'Terraform', icon: Code, color: 'bg-purple-500' },
                            { name: 'CDK', icon: Code, color: 'bg-green-500' },
                            { name: 'PNG Diagram', icon: Download, color: 'bg-orange-500' },
                            { name: 'PDF Report', icon: Download, color: 'bg-red-500' }
                          ].map((option, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              className="flex flex-col items-center space-y-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200"
                            >
                              <div className={`w-8 h-8 ${option.color} rounded-lg flex items-center justify-center`}>
                                <option.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">{option.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Code className="w-4 h-4" />
                          <span>Build in Canvas</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Prompt</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Regenerate</span>
                        </motion.button>
                      </div>
                    </div>
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
