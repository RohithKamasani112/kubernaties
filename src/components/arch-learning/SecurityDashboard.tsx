import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb,
  TrendingUp,
  Award,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { SecurityEngine, SecurityValidationResult, SecurityIssue, BestPractice } from '../../utils/securityEngine';

interface SecurityDashboardProps {
  code: string;
  resourceType: string;
  provider: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  code,
  resourceType,
  provider,
  isVisible,
  onToggle
}) => {
  const [validationResult, setValidationResult] = useState<SecurityValidationResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['issues']));
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);

  const securityEngine = SecurityEngine.getInstance();

  useEffect(() => {
    if (code && resourceType && provider) {
      const result = securityEngine.validateInfrastructureCode(code, resourceType, provider);
      setValidationResult(result);
    }
  }, [code, resourceType, provider, securityEngine]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-100';
    if (score >= 70) return 'text-yellow-700 bg-yellow-100';
    if (score >= 50) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  if (!validationResult) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg">
      {/* Header */}
      <div 
        className="p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Security Analysis</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(validationResult.score)}`}>
              Score: {validationResult.score}/100
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {validationResult.issues.length > 0 && (
              <span className="text-sm text-red-600 font-medium">
                {validationResult.issues.length} issue{validationResult.issues.length !== 1 ? 's' : ''}
              </span>
            )}
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Security Score Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{validationResult.score}</div>
                  <div className="text-sm text-slate-600">Security Score</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{validationResult.issues.length}</div>
                  <div className="text-sm text-slate-600">Issues Found</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{validationResult.bestPractices.length}</div>
                  <div className="text-sm text-slate-600">Recommendations</div>
                </div>
              </div>

              {/* Security Issues */}
              {validationResult.issues.length > 0 && (
                <div className="border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('issues')}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-slate-900">Security Issues</span>
                      <span className="text-sm text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        {validationResult.issues.length}
                      </span>
                    </div>
                    {expandedSections.has('issues') ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('issues') && (
                    <div className="border-t border-slate-200 p-3 space-y-3">
                      {validationResult.issues.map((issue, index) => (
                        <motion.div
                          key={issue.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getSeverityColor(issue.severity)}`}
                          onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                        >
                          <div className="flex items-start space-x-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{issue.title}</h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">
                                  {issue.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm opacity-90 mb-2">{issue.description}</p>
                              
                              {selectedIssue?.id === issue.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-3 pt-3 border-t border-white/30"
                                >
                                  <div className="space-y-2">
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                                      <p className="text-sm opacity-90">{issue.recommendation}</p>
                                    </div>
                                    {issue.owaspCategory && (
                                      <div>
                                        <h5 className="font-medium text-sm mb-1">OWASP Category:</h5>
                                        <p className="text-sm opacity-90">{issue.owaspCategory}</p>
                                      </div>
                                    )}
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">Affected Resources:</h5>
                                      <div className="flex flex-wrap gap-1">
                                        {issue.resources.map((resource) => (
                                          <span key={resource} className="text-xs bg-white/50 px-2 py-0.5 rounded">
                                            {resource}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Best Practices */}
              {validationResult.bestPractices.length > 0 && (
                <div className="border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('practices')}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-slate-900">Best Practices</span>
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {validationResult.bestPractices.length}
                      </span>
                    </div>
                    {expandedSections.has('practices') ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.has('practices') && (
                    <div className="border-t border-slate-200 p-3 space-y-3">
                      {validationResult.bestPractices.map((practice, index) => (
                        <motion.div
                          key={practice.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-start space-x-3">
                            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-green-900">{practice.title}</h4>
                                <span className="text-xs text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
                                  {practice.impact.toUpperCase()} IMPACT
                                </span>
                              </div>
                              <p className="text-sm text-green-800 mb-2">{practice.description}</p>
                              <p className="text-sm text-green-700 font-medium">{practice.implementation}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* OWASP Compliance */}
              <div className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => toggleSection('owasp')}
                  className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-slate-900">OWASP Cloud Top 10</span>
                  </div>
                  {expandedSections.has('owasp') ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
                
                {expandedSections.has('owasp') && (
                  <div className="border-t border-slate-200 p-3">
                    <div className="grid grid-cols-1 gap-2">
                      {validationResult.owaspCompliance.map((compliance, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border ${
                            compliance.compliant 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {compliance.compliant ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              compliance.compliant ? 'text-green-900' : 'text-red-900'
                            }`}>
                              {compliance.category}
                            </span>
                          </div>
                          {!compliance.compliant && compliance.issues.length > 0 && (
                            <div className="mt-1 ml-6">
                              <ul className="text-xs text-red-800 space-y-0.5">
                                {compliance.issues.map((issue, issueIndex) => (
                                  <li key={issueIndex}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityDashboard;
