import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Book,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Network,
  Database,
  Server,
  Box,
  Shield,
  FileText,
  Settings,
  Terminal,
  Play,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ComponentDoc, k8sComponentDocs, InteractiveExample } from '../data/k8sComponentDocs';
import InteractiveTerminal from './InteractiveTerminal';

interface ComponentDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponent?: string;
}

const ComponentDocumentation: React.FC<ComponentDocumentationProps> = ({
  isOpen,
  onClose,
  selectedComponent
}) => {
  const [activeDoc, setActiveDoc] = useState<ComponentDoc | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedExample, setSelectedExample] = useState<InteractiveExample | null>(null);

  // Update activeDoc when selectedComponent changes
  React.useEffect(() => {
    if (selectedComponent) {
      const doc = k8sComponentDocs.find(doc => doc.id === selectedComponent);
      setActiveDoc(doc || null);
    } else {
      setActiveDoc(null);
    }
  }, [selectedComponent, isOpen]);

  const categoryIcons = {
    'control-plane': Server,
    'worker-node': Box,
    'workload': Settings,
    'storage': Database,
    'config': FileText,
    'networking': Network
  };

  const categoryColors = {
    'control-plane': 'bg-blue-100 text-blue-800 border-blue-200',
    'worker-node': 'bg-purple-100 text-purple-800 border-purple-200',
    'workload': 'bg-green-100 text-green-800 border-green-200',
    'storage': 'bg-orange-100 text-orange-800 border-orange-200',
    'config': 'bg-pink-100 text-pink-800 border-pink-200',
    'networking': 'bg-teal-100 text-teal-800 border-teal-200'
  };

  const connectionTypeColors = {
    'ConfigMap': 'bg-pink-100 text-pink-800',
    'Secret': 'bg-red-100 text-red-800',
    'Service': 'bg-green-100 text-green-800',
    'Ingress': 'bg-purple-100 text-purple-800',
    'PVC': 'bg-orange-100 text-orange-800',
    'Pod': 'bg-blue-100 text-blue-800',
    'Deployment': 'bg-indigo-100 text-indigo-800',
    'API': 'bg-gray-100 text-gray-800',
    'Storage': 'bg-yellow-100 text-yellow-800',
    'Network': 'bg-teal-100 text-teal-800',
    'Control': 'bg-cyan-100 text-cyan-800'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const groupedDocs = k8sComponentDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, ComponentDoc[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Content */}
            <div className="overflow-y-auto h-full">
              <div className="p-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {activeDoc && (
                        <>
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                            <Book className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[activeDoc.category]}`}>
                                {activeDoc.category.replace('-', ' ')}
                              </div>
                              <h1 className="text-2xl font-bold text-gray-900">
                                📦 {activeDoc.name}
                              </h1>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Complete documentation with security best practices
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {activeDoc ? (
                  <div className="space-y-8">

                    {/* Purpose */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🔍 Purpose
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {activeDoc.purpose}
                      </p>
                    </section>

                    {/* Detailed Explanation */}
                    {activeDoc.detailedExplanation && (
                      <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          📖 Detailed Explanation
                        </h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                          <div className="prose prose-blue max-w-none">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {activeDoc.detailedExplanation}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* YAML Manifest */}
                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          🧩 YAML Manifest
                        </h2>
                        <button
                          onClick={() => copyToClipboard(activeDoc.yamlManifest, 'yaml')}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                        >
                          {copiedField === 'yaml' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedField === 'yaml' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{activeDoc.yamlManifest}</code>
                        </pre>
                      </div>
                    </section>

                    {/* Field Breakdown */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🗂️ Field Breakdown
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Field</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Example Value</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Required</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeDoc.fields.map((field, index) => (
                              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                                <td className="px-4 py-3 text-sm font-mono text-gray-900">{field.field}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{field.description}</td>
                                <td className="px-4 py-3 text-sm font-mono text-blue-600">{field.exampleValue}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {field.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Connected Components & Relationships */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🔗 Connected Components & Relationships
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Connected Component</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Purpose</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Connection Method</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">Direction</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeDoc.connections.map((connection, index) => (
                              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{connection.component}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    connectionTypeColors[connection.type] || 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {connection.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{connection.purpose}</td>
                                <td className="px-4 py-3 text-sm font-mono text-blue-600">{connection.connectionMethod}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    {connection.direction === 'inbound' && <ArrowRight className="w-3 h-3 text-green-600 rotate-180" />}
                                    {connection.direction === 'outbound' && <ArrowRight className="w-3 h-3 text-blue-600" />}
                                    {connection.direction === 'bidirectional' && (
                                      <>
                                        <ArrowRight className="w-3 h-3 text-purple-600" />
                                        <ArrowRight className="w-3 h-3 text-purple-600 rotate-180" />
                                      </>
                                    )}
                                    <span className="text-xs text-gray-600 capitalize">{connection.direction}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Usage & Flow */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🛠️ Usage & Flow
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {activeDoc.usageFlow}
                      </p>
                    </section>

                    {/* Real World Example */}
                    {activeDoc.realWorldExample && (
                      <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🌍 Real-World Example
                        </h2>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {activeDoc.realWorldExample}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Interactive Examples */}
                    {activeDoc.interactiveExamples && activeDoc.interactiveExamples.length > 0 && (
                      <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          💻 Interactive Examples
                        </h2>
                        <div className="grid gap-4">
                          {activeDoc.interactiveExamples.map((example, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{example.title}</h4>
                                  <p className="text-gray-600 text-sm">{example.description}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedExample(example);
                                    setShowTerminal(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  <Terminal className="w-4 h-4" />
                                  Try It
                                </button>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                                <code className="text-gray-800">{example.command}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Best Practices */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        ⚠️ Best Practices
                      </h2>
                      <ul className="space-y-2">
                        {activeDoc.bestPractices.map((practice, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Security Best Practices */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🔒 Security Best Practices
                      </h2>
                      <ul className="space-y-2">
                        {activeDoc.securityBestPractices.map((practice, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Troubleshooting */}
                    {activeDoc.troubleshooting && activeDoc.troubleshooting.length > 0 && (
                      <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🔧 Troubleshooting
                        </h2>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {activeDoc.troubleshooting.map((issue, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    )}

                    {/* Related Docs */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        📎 Related Docs
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {activeDoc.relatedDocs.map((docId, index) => {
                          const relatedDoc = k8sComponentDocs.find(doc => doc.id === docId);
                          return (
                            <button
                              key={index}
                              onClick={() => relatedDoc && setActiveDoc(relatedDoc)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium transition-colors"
                            >
                              {relatedDoc?.name || docId}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Kubernetes References */}
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        📚 References
                      </h2>
                      <div className="space-y-2">
                        {activeDoc.kubernetesRefs.map((ref, index) => (
                          <a
                            key={index}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {ref}
                          </a>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Book className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      No Component Selected
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Click on any component in the K8s architecture diagram to view its complete documentation with security best practices.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>Tip:</strong> Each component documentation includes YAML manifests, field breakdowns, connections, and comprehensive security guidelines.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Interactive Terminal */}
          <InteractiveTerminal
            isOpen={showTerminal}
            onClose={() => setShowTerminal(false)}
            example={selectedExample}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComponentDocumentation;
