import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lightbulb,
  AlertTriangle,
  Book,
  ExternalLink,
  Copy,
  Terminal,
  FileText,
  Settings,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Code,
  Search,
  HelpCircle
} from 'lucide-react';

interface ErrorExplanation {
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  commonCauses: string[];
  symptoms: string[];
  solution: {
    immediate: string[];
    detailed: string[];
    commands: string[];
    yaml?: string;
  };
  prevention: string[];
  relatedConcepts: string[];
  learnMore: {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'video' | 'blog' | 'tool';
  }[];
  examples: {
    title: string;
    description: string;
    command?: string;
    output?: string;
    explanation?: string;
  }[];
  troubleshooting: {
    step: string;
    command?: string;
    expectedResult: string;
    troubleIfFails: string;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
}

interface ErrorExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorText: string;
  onExecuteCommand?: (command: string) => void;
}

const ErrorExplanationModal: React.FC<ErrorExplanationModalProps> = ({
  isOpen,
  onClose,
  errorText,
  onExecuteCommand
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'solution' | 'examples' | 'learn'>('explanation');

  // Analyze error text and return explanation
  const getErrorExplanation = (error: string): ErrorExplanation => {
    const lowerError = error.toLowerCase();

    // CrashLoopBackOff
    if (lowerError.includes('crashloopbackoff') || lowerError.includes('crash') || lowerError.includes('exit code 1')) {
      return {
        title: 'CrashLoopBackOff Error',
        category: 'Pod Lifecycle',
        severity: 'critical',
        description: 'CrashLoopBackOff indicates that a pod is repeatedly crashing and Kubernetes is backing off on restarting it. This happens when a container exits with a non-zero exit code or fails to start properly.',
        commonCauses: [
          'Missing or incorrect environment variables',
          'Application configuration errors',
          'Missing dependencies or files',
          'Insufficient resources (memory/CPU)',
          'Incorrect container image or tag',
          'Application bugs or runtime errors',
          'Failed health checks (liveness/readiness probes)'
        ],
        symptoms: [
          'Pod status shows CrashLoopBackOff',
          'High restart count in pod description',
          'Container exits immediately after starting',
          'Error logs showing application failures',
          'Exponential backoff delay between restart attempts'
        ],
        solution: {
          immediate: [
            'Check pod logs for error messages',
            'Examine pod events for failure reasons',
            'Verify environment variables are set correctly',
            'Check resource limits and requests'
          ],
          detailed: [
            'Review application startup requirements',
            'Validate container image and dependencies',
            'Check file permissions and volume mounts',
            'Verify network connectivity to required services',
            'Review and adjust health check configurations',
            'Implement proper error handling in application'
          ],
          commands: [
            'kubectl logs <pod-name>',
            'kubectl logs <pod-name> --previous',
            'kubectl describe pod <pod-name>',
            'kubectl get events --field-selector involvedObject.name=<pod-name>'
          ]
        },
        prevention: [
          'Implement comprehensive application testing',
          'Use init containers for dependency checks',
          'Set appropriate resource limits and requests',
          'Configure proper health checks with reasonable timeouts',
          'Use configuration validation in CI/CD pipelines',
          'Monitor application metrics and logs'
        ],
        relatedConcepts: [
          'Pod Lifecycle',
          'Container Exit Codes',
          'Restart Policies',
          'Health Checks',
          'Resource Management',
          'Environment Variables'
        ],
        learnMore: [
          {
            title: 'Kubernetes Pod Lifecycle',
            url: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/',
            type: 'documentation'
          },
          {
            title: 'Debugging Pods',
            url: 'https://kubernetes.io/docs/tasks/debug-application-cluster/debug-pods/',
            type: 'documentation'
          },
          {
            title: 'Container Probes',
            url: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes',
            type: 'documentation'
          },
          {
            title: 'CrashLoopBackOff Troubleshooting Guide',
            url: 'https://kubernetes.io/docs/tasks/debug-application-cluster/debug-pods/#my-pod-stays-pending',
            type: 'tutorial'
          },
          {
            title: 'Kubernetes Debugging Video Tutorial',
            url: 'https://www.youtube.com/watch?v=debugging-k8s',
            type: 'video'
          }
        ],
        examples: [
          {
            title: 'Check Current Pod Status',
            description: 'View the current status and restart count of pods',
            command: 'kubectl get pods',
            output: 'NAME                    READY   STATUS             RESTARTS   AGE\napp-pod-abc123         0/1     CrashLoopBackOff   5          10m',
            explanation: 'The RESTARTS column shows how many times the pod has crashed. High numbers indicate a persistent issue.'
          },
          {
            title: 'Examine Pod Events',
            description: 'Look for specific error events related to the pod',
            command: 'kubectl describe pod app-pod-abc123',
            output: 'Events:\n  Warning  BackOff    2m   kubelet  Back-off restarting failed container',
            explanation: 'Events section shows the timeline of what happened to the pod, including restart attempts.'
          },
          {
            title: 'Check Previous Container Logs',
            description: 'View logs from the crashed container instance',
            command: 'kubectl logs app-pod-abc123 --previous',
            output: 'panic: missing environment variable DATABASE_URL\ngoroutine 1 [running]:\nmain.main()',
            explanation: 'Previous logs show why the container crashed. This example shows a missing environment variable.'
          }
        ],
        troubleshooting: [
          {
            step: '1. Check pod status and restart count',
            command: 'kubectl get pods',
            expectedResult: 'Pod should show CrashLoopBackOff status with restart count',
            troubleIfFails: 'If pod is not in CrashLoopBackOff, check for other issues like Pending or ImagePullBackOff'
          },
          {
            step: '2. Examine container logs for errors',
            command: 'kubectl logs <pod-name> --previous',
            expectedResult: 'Should show error messages or stack traces from the crashed container',
            troubleIfFails: 'If no logs available, container might be failing before logging starts - check image and startup command'
          },
          {
            step: '3. Check pod events for additional context',
            command: 'kubectl describe pod <pod-name>',
            expectedResult: 'Events section should show restart attempts and any error messages',
            troubleIfFails: 'If no relevant events, check node logs or cluster-level issues'
          },
          {
            step: '4. Verify environment variables and configuration',
            command: 'kubectl get pod <pod-name> -o yaml',
            expectedResult: 'Should show all environment variables and configuration',
            troubleIfFails: 'Compare with working configuration or application requirements'
          }
        ],
        difficulty: 'intermediate',
        estimatedTime: '15-30 minutes',
        tags: ['crashloop', 'pod-lifecycle', 'debugging', 'containers', 'restart-policy']
      };
    }

    // ImagePullBackOff
    if (lowerError.includes('imagepullbackoff') || lowerError.includes('image') && lowerError.includes('pull')) {
      return {
        title: 'ImagePullBackOff Error',
        category: 'Container Images',
        severity: 'high',
        description: 'ImagePullBackOff occurs when Kubernetes cannot pull the specified container image from the registry. This prevents the pod from starting.',
        commonCauses: [
          'Incorrect image name or tag',
          'Image does not exist in the registry',
          'Authentication issues with private registries',
          'Network connectivity problems',
          'Registry is down or unreachable',
          'Image pull secrets not configured',
          'Typos in image specification'
        ],
        symptoms: [
          'Pod status shows ImagePullBackOff or ErrImagePull',
          'Container cannot start',
          'Events show image pull failures',
          'Long delays in pod startup',
          'Error messages about image access'
        ],
        solution: {
          immediate: [
            'Verify image name and tag are correct',
            'Check if image exists in the registry',
            'Verify registry authentication',
            'Test network connectivity to registry'
          ],
          detailed: [
            'Configure image pull secrets for private registries',
            'Use fully qualified image names',
            'Implement image scanning and validation',
            'Set up registry mirrors for reliability',
            'Use specific image tags instead of latest',
            'Monitor registry health and availability'
          ],
          commands: [
            'kubectl describe pod <pod-name>',
            'kubectl get events --field-selector reason=Failed',
            'docker pull <image-name>',
            'kubectl create secret docker-registry <secret-name>'
          ]
        },
        prevention: [
          'Use specific image tags in production',
          'Implement image validation in CI/CD',
          'Set up private registry with proper authentication',
          'Monitor registry availability',
          'Use image pull policies appropriately',
          'Test image accessibility before deployment'
        ],
        relatedConcepts: [
          'Container Registries',
          'Image Pull Secrets',
          'Image Pull Policies',
          'Docker Authentication',
          'Registry Security',
          'Image Tagging'
        ],
        learnMore: [
          {
            title: 'Images and Containers',
            url: 'https://kubernetes.io/docs/concepts/containers/images/',
            type: 'documentation'
          },
          {
            title: 'Pull an Image from a Private Registry',
            url: 'https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/',
            type: 'tutorial'
          },
          {
            title: 'Container Registry Best Practices',
            url: 'https://cloud.google.com/architecture/best-practices-for-operating-containers',
            type: 'blog'
          },
          {
            title: 'Docker Registry Authentication',
            url: 'https://docs.docker.com/registry/spec/auth/',
            type: 'documentation'
          }
        ],
        examples: [
          {
            title: 'Check Image Pull Status',
            description: 'Examine why image pull is failing',
            command: 'kubectl describe pod <pod-name>',
            output: 'Events:\n  Warning  Failed     1m   kubelet  Failed to pull image "myapp:v1.0": rpc error',
            explanation: 'The Events section shows the specific error when trying to pull the image. Look for authentication, network, or image name issues.'
          },
          {
            title: 'Test Image Accessibility',
            description: 'Manually test if the image can be pulled',
            command: 'docker pull myapp:v1.0',
            output: 'Error response from daemon: pull access denied for myapp, repository does not exist',
            explanation: 'This confirms the image name is incorrect or the repository is private and requires authentication.'
          },
          {
            title: 'Create Image Pull Secret',
            description: 'Set up authentication for private registry',
            command: 'kubectl create secret docker-registry regcred --docker-server=<registry> --docker-username=<user> --docker-password=<pass>',
            output: 'secret/regcred created',
            explanation: 'Creates a secret that can be referenced in pod specs to authenticate with private registries.'
          }
        ],
        troubleshooting: [
          {
            step: '1. Verify image name and tag',
            command: 'kubectl get pod <pod-name> -o yaml | grep image',
            expectedResult: 'Should show the exact image name and tag being used',
            troubleIfFails: 'Check deployment or pod specification for typos in image name'
          },
          {
            step: '2. Test image pull manually',
            command: 'docker pull <image-name>',
            expectedResult: 'Image should pull successfully',
            troubleIfFails: 'If fails, check image exists in registry and you have access'
          },
          {
            step: '3. Check image pull secrets',
            command: 'kubectl get secrets | grep docker-registry',
            expectedResult: 'Should show configured registry secrets',
            troubleIfFails: 'Create image pull secret for private registry access'
          },
          {
            step: '4. Verify pod uses correct secret',
            command: 'kubectl get pod <pod-name> -o yaml | grep imagePullSecrets',
            expectedResult: 'Should reference the correct image pull secret',
            troubleIfFails: 'Add imagePullSecrets to pod specification'
          }
        ],
        difficulty: 'beginner',
        estimatedTime: '10-20 minutes',
        tags: ['imagepull', 'registry', 'authentication', 'containers', 'docker']
      };
    }

    // Pending Pod
    if (lowerError.includes('pending') || lowerError.includes('failedscheduling')) {
      return {
        title: 'Pod Scheduling Issues',
        category: 'Scheduling',
        severity: 'high',
        description: 'Pods remain in Pending state when the Kubernetes scheduler cannot find a suitable node to run them. This indicates resource constraints or scheduling conflicts.',
        commonCauses: [
          'Insufficient CPU or memory on nodes',
          'Node selector constraints not met',
          'Taints and tolerations mismatch',
          'Affinity/anti-affinity rules blocking placement',
          'No nodes available in the cluster',
          'Resource quotas exceeded',
          'Persistent volume availability issues'
        ],
        symptoms: [
          'Pod status remains Pending',
          'FailedScheduling events in pod description',
          'No node assignment in pod details',
          'Scheduler warnings in cluster events',
          'Resource requests cannot be satisfied'
        ],
        solution: {
          immediate: [
            'Check node resource availability',
            'Review pod resource requests',
            'Examine scheduling constraints',
            'Verify node conditions and taints'
          ],
          detailed: [
            'Scale cluster nodes if needed',
            'Optimize resource requests and limits',
            'Review and adjust scheduling policies',
            'Implement cluster autoscaling',
            'Monitor resource utilization trends',
            'Plan capacity based on workload requirements'
          ],
          commands: [
            'kubectl describe pod <pod-name>',
            'kubectl get nodes -o wide',
            'kubectl top nodes',
            'kubectl describe nodes'
          ]
        },
        prevention: [
          'Implement cluster autoscaling',
          'Monitor resource utilization',
          'Set appropriate resource requests',
          'Plan cluster capacity',
          'Use resource quotas wisely',
          'Regular cluster health checks'
        ],
        relatedConcepts: [
          'Kubernetes Scheduler',
          'Node Selection',
          'Resource Management',
          'Taints and Tolerations',
          'Affinity Rules',
          'Cluster Autoscaling'
        ],
        learnMore: [
          {
            title: 'Kubernetes Scheduler',
            url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/'
          },
          {
            title: 'Managing Resources',
            url: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/'
          }
        ],
        examples: [
          {
            title: 'Check Scheduling Events',
            description: 'See why pod cannot be scheduled',
            command: 'kubectl describe pod <pod-name>',
            output: 'Events:\n  Warning  FailedScheduling  1m  default-scheduler  0/3 nodes are available'
          }
        ]
      };
    }

    // Generic error explanation
    return {
      title: 'Kubernetes Error Analysis',
      category: 'General',
      severity: 'medium',
      description: 'This appears to be a Kubernetes-related error. The specific error message can help identify the root cause and appropriate solution.',
      commonCauses: [
        'Configuration issues',
        'Resource constraints',
        'Network connectivity problems',
        'Permission or authentication issues',
        'Application-specific errors'
      ],
      symptoms: [
        'Error messages in logs or events',
        'Unexpected pod or service behavior',
        'Resource status showing issues',
        'Application functionality problems'
      ],
      solution: {
        immediate: [
          'Check the specific error message details',
          'Examine related resource status',
          'Review recent configuration changes',
          'Check cluster and node health'
        ],
        detailed: [
          'Analyze logs and events systematically',
          'Verify configuration against documentation',
          'Test connectivity and permissions',
          'Implement monitoring and alerting',
          'Review best practices for the affected component'
        ],
        commands: [
          'kubectl get events --sort-by=.metadata.creationTimestamp',
          'kubectl logs <resource-name>',
          'kubectl describe <resource-type> <resource-name>',
          'kubectl get <resource-type> -o yaml'
        ]
      },
      prevention: [
        'Implement comprehensive monitoring',
        'Use infrastructure as code',
        'Regular health checks and testing',
        'Follow Kubernetes best practices',
        'Maintain up-to-date documentation'
      ],
      relatedConcepts: [
        'Kubernetes Troubleshooting',
        'Resource Management',
        'Monitoring and Observability',
        'Best Practices',
        'Error Handling'
      ],
      learnMore: [
        {
          title: 'Troubleshooting Applications',
          url: 'https://kubernetes.io/docs/tasks/debug-application-cluster/'
        },
        {
          title: 'Kubernetes Best Practices',
          url: 'https://kubernetes.io/docs/concepts/configuration/overview/'
        }
      ],
      examples: [
        {
          title: 'General Debugging Approach',
          description: 'Start with basic resource inspection',
          command: 'kubectl get all',
          output: 'Lists all resources in the current namespace'
        }
      ]
    };
  };

  const explanation = getErrorExplanation(errorText);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <span className="text-lg animate-pulse">🚨</span>;
      case 'high': return <span className="text-lg">⚠️</span>;
      case 'medium': return <span className="text-lg">🟡</span>;
      case 'low': return <span className="text-lg">ℹ️</span>;
      default: return <span className="text-lg">❓</span>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700 border-green-300',
      intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      advanced: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'tutorial': return '🎓';
      case 'video': return '🎥';
      case 'blog': return '📝';
      case 'tool': return '🔧';
      default: return '🔗';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">🧠 AI Error Analysis</h2>
                  <p className="text-blue-100 text-sm">📂 {explanation.category} • 🎯 {explanation.difficulty} level</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Title and Metadata */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{explanation.title}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border bg-white ${getSeverityColor(explanation.severity)}`}>
                    {getSeverityIcon(explanation.severity)}
                    <span className="text-sm font-bold capitalize">{explanation.severity}</span>
                  </div>
                </div>
              </div>

              {/* Metadata badges */}
              <div className="flex items-center space-x-3 text-sm">
                <div className={`px-3 py-1 rounded-full border bg-white ${getDifficultyBadge(explanation.difficulty)}`}>
                  <span className="font-medium">🎓 {explanation.difficulty}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30">
                  <span className="font-medium">⏱️ {explanation.estimatedTime}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30">
                  <span className="font-medium">🏷️ {explanation.tags?.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex space-x-1 p-1">
              {[
                { id: 'explanation', label: '📖 Explanation', icon: Book, emoji: '📖' },
                { id: 'solution', label: '🔧 Solution', icon: Target, emoji: '🔧' },
                { id: 'examples', label: '💡 Examples', icon: Code, emoji: '💡' },
                { id: 'learn', label: '📚 Learn More', icon: ExternalLink, emoji: '📚' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <span className="text-base">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'explanation' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Description</span>
                  </h4>
                  <p className="text-blue-800 leading-relaxed">{explanation.description}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center space-x-2">
                    <span>🔍</span>
                    <span>Common Causes</span>
                  </h4>
                  <ul className="space-y-2">
                    {explanation.commonCauses.map((cause, index) => (
                      <li key={index} className="flex items-start space-x-2 text-red-800">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Symptoms</span>
                  </h4>
                  <ul className="space-y-2">
                    {explanation.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-2 text-yellow-800">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Concepts */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                    <span>🔗</span>
                    <span>Related Concepts</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedConcepts.map((concept, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-300">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-6">
                {/* Immediate Actions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Immediate Actions</span>
                  </h4>
                  <ol className="space-y-2">
                    {explanation.solution.immediate.map((action, index) => (
                      <li key={index} className="flex items-start space-x-3 text-green-800">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Diagnostic Commands */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                    <span>💻</span>
                    <span>Diagnostic Commands</span>
                  </h4>
                  <div className="space-y-3">
                    {explanation.solution.commands.map((command, index) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <code className="flex-1 text-green-400 font-mono text-sm">{command}</code>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => copyToClipboard(command)}
                              className="p-2 text-slate-400 hover:text-green-400 transition-colors rounded hover:bg-slate-800"
                              title="Copy command"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {onExecuteCommand && (
                              <button
                                onClick={() => onExecuteCommand(command)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors font-medium"
                              >
                                🚀 Run
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Troubleshooting Steps */}
                {explanation.troubleshooting && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                      <span>🔧</span>
                      <span>Step-by-Step Troubleshooting</span>
                    </h4>
                    <div className="space-y-4">
                      {explanation.troubleshooting.map((step, index) => (
                        <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                              <h5 className="font-medium text-blue-900">{step.step}</h5>
                              {step.command && (
                                <div className="bg-slate-900 rounded p-2">
                                  <code className="text-green-400 text-sm">{step.command}</code>
                                </div>
                              )}
                              <div className="text-sm">
                                <p className="text-green-700"><strong>✅ Expected:</strong> {step.expectedResult}</p>
                                <p className="text-red-700 mt-1"><strong>❌ If fails:</strong> {step.troubleIfFails}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Solution Steps */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Detailed Solution Steps</span>
                  </h4>
                  <ol className="space-y-2">
                    {explanation.solution.detailed.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3 text-purple-800">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-4">
                {explanation.examples.map((example, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{example.title}</h4>
                    <p className="text-slate-700 mb-3">{example.description}</p>
                    {example.command && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between bg-slate-900 text-green-400 p-2 rounded text-sm">
                          <code>{example.command}</code>
                          <button
                            onClick={() => copyToClipboard(example.command)}
                            className="p-1 text-slate-400 hover:text-green-400"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    {example.output && (
                      <div className="bg-slate-100 p-3 rounded text-sm">
                        <pre className="text-slate-800 whitespace-pre-wrap">{example.output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'learn' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Related Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedConcepts.map((concept, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Learn More</h4>
                  <div className="space-y-2">
                    {explanation.learnMore.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 hover:text-blue-800">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Prevention Tips</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {explanation.prevention.map((tip, index) => (
                      <li key={index} className="text-slate-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorExplanationModal;
