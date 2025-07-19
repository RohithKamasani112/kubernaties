import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  RotateCcw,
  FileText,
  Zap,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Activity,
  Network,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Challenge {
  id: number;
  title: string;
  brokenYaml: string;
  problem: string;
  solution: string;
  hints: string[];
  scenario: string;
  realWorldContext: string;
}

interface ChallengePlaygroundProps {
  challenge: Challenge;
}

const ChallengePlayground: React.FC<ChallengePlaygroundProps> = ({ challenge }) => {
  const [yamlContent, setYamlContent] = useState(challenge.brokenYaml);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    issues: string[];
  } | null>(null);
  const [showTrafficFlow, setShowTrafficFlow] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [realTimeValidation, setRealTimeValidation] = useState<{
    hasChanges: boolean;
    isLikelyCorrect: boolean;
  }>({ hasChanges: false, isLikelyCorrect: false });

  useEffect(() => {
    setYamlContent(challenge.brokenYaml);
    setValidationResult(null);
    setRealTimeValidation({ hasChanges: false, isLikelyCorrect: false });
  }, [challenge]);

  // Real-time validation as user types - MUST match the full validation logic
  useEffect(() => {
    const hasChanges = yamlContent !== challenge.brokenYaml;
    let isLikelyCorrect = false;

    if (hasChanges) {
      // Real-time validation that matches the full validation logic exactly
      switch (challenge.id) {
        case 1: // Pod CrashLoopBackOff - Fix container command
          const hasRemovedCommand = !yamlContent.includes('command:') || !yamlContent.includes('wrong-command');
          const hasRemovedArgs = !yamlContent.includes('args:') || !yamlContent.includes('wrong-command');
          const hasNginxImage = yamlContent.includes('nginx:latest');
          isLikelyCorrect = hasRemovedCommand && hasRemovedArgs && hasNginxImage;
          break;

        case 2: // Service Not Routing to Pod - Fix service selector
          const hasCorrectServiceSelector = yamlContent.includes('app: web-application') &&
                                           yamlContent.match(/selector:\s*\n\s*app: web-application/);
          const hasDeploymentLabels = yamlContent.includes('app: web-application') &&
                                     yamlContent.match(/labels:\s*\n\s*app: web-application/);
          isLikelyCorrect = hasCorrectServiceSelector && hasDeploymentLabels;
          break;

        case 3: // App Not Accessible Externally - Fix service type
          isLikelyCorrect = yamlContent.includes('type: NodePort') || yamlContent.includes('type: LoadBalancer');
          break;

        case 4: // Missing ConfigMap challenge
          const hasConfigMap = yamlContent.includes('kind: ConfigMap') && yamlContent.includes('name: app-config');
          const hasConfigMapData = yamlContent.includes('data:');
          isLikelyCorrect = hasConfigMap && hasConfigMapData;
          break;

        case 5: // Secret Not Mounted challenge
          isLikelyCorrect = yamlContent.includes('secretName: db-credentials');
          break;

        case 6: // Readiness Probe Failing challenge
          const hasCorrectProbePath = yamlContent.includes('path: /') && !yamlContent.includes('path: /health');
          const hasCorrectProbePort = yamlContent.includes('port: 80') && !yamlContent.includes('port: 8080');
          isLikelyCorrect = hasCorrectProbePath && hasCorrectProbePort;
          break;

        case 7: // ImagePullBackOff challenge
          isLikelyCorrect = yamlContent.includes('nginx:latest') && !yamlContent.includes('nginxx:latest');
          break;

        case 8: // Pod Stuck in Pending challenge
          const hasReasonableResources = yamlContent.includes('cpu: "100m"') || yamlContent.includes('cpu: "200m"') ||
                                        yamlContent.includes('memory: "128Mi"') || yamlContent.includes('memory: "256Mi"');
          const noExcessiveResources = !yamlContent.includes('cpu: "4"') && !yamlContent.includes('memory: "8Gi"');
          isLikelyCorrect = hasReasonableResources && noExcessiveResources;
          break;

        case 9: // Wrong Environment Variable challenge
          const hasValidDatabaseUrl = yamlContent.includes('DATABASE_URL') &&
                                     !yamlContent.includes('value: ""') &&
                                     (yamlContent.includes('postgresql://') || yamlContent.includes('postgres://'));
          isLikelyCorrect = hasValidDatabaseUrl;
          break;

        case 10: // Liveness Probe Causes Pod Restart challenge
          const hasIncreasedInitialDelay = !yamlContent.includes('initialDelaySeconds: 1') &&
                                          (yamlContent.includes('initialDelaySeconds: 30') || yamlContent.includes('initialDelaySeconds: 15'));
          const hasIncreasedTimeout = !yamlContent.includes('timeoutSeconds: 1') &&
                                     (yamlContent.includes('timeoutSeconds: 5') || yamlContent.includes('timeoutSeconds: 10'));
          const hasIncreasedFailureThreshold = !yamlContent.includes('failureThreshold: 1') &&
                                              (yamlContent.includes('failureThreshold: 3') || yamlContent.includes('failureThreshold: 5'));
          isLikelyCorrect = hasIncreasedInitialDelay && hasIncreasedTimeout && hasIncreasedFailureThreshold;
          break;

        case 11: // Broken Ingress Route challenge
          const hasCorrectIngressPath = yamlContent.includes('path: /app') && !yamlContent.includes('path: /wrong');
          const hasCorrectServiceName = yamlContent.includes('name: web-service') && !yamlContent.includes('name: wrong-service');
          isLikelyCorrect = hasCorrectIngressPath && hasCorrectServiceName;
          break;

        case 12: // HPA Not Scaling challenge
          const hasResourceLimits12 = yamlContent.includes('limits:') && yamlContent.includes('cpu:');
          const hasHPAMetrics = yamlContent.includes('targetCPUUtilizationPercentage') || yamlContent.includes('metrics:');
          isLikelyCorrect = hasResourceLimits12 && hasHPAMetrics;
          break;

        case 13: // RBAC Access Denied challenge
          const hasRoleBinding = yamlContent.includes('kind: RoleBinding') || yamlContent.includes('kind: ClusterRoleBinding');
          const hasServiceAccountRef = yamlContent.includes('kind: ServiceAccount');
          isLikelyCorrect = hasRoleBinding && hasServiceAccountRef;
          break;

        case 14: // NetworkPolicy Blocks All Traffic challenge
          const hasAllowPolicy = yamlContent.includes('policyTypes:') && yamlContent.includes('Ingress');
          const hasFromSelector = yamlContent.includes('from:') || yamlContent.includes('namespaceSelector:');
          isLikelyCorrect = hasAllowPolicy && hasFromSelector;
          break;

        case 15: // PersistentVolume Not Bound challenge
          const hasMatchingStorageClass = yamlContent.includes('storageClassName: fast-ssd');
          const hasMatchingSize = yamlContent.includes('storage: 10Gi');
          isLikelyCorrect = hasMatchingStorageClass && hasMatchingSize;
          break;

        case 21: // Wrong Container Port challenge
          isLikelyCorrect = yamlContent.includes('containerPort: 80') && !yamlContent.includes('containerPort: 8080');
          break;

        case 22: // No Resource Limits challenge
          const hasResourceSection = yamlContent.includes('resources:');
          const hasLimits = yamlContent.includes('limits:');
          const hasRequests = yamlContent.includes('requests:');
          isLikelyCorrect = hasResourceSection && hasLimits && hasRequests;
          break;

        case 23: // Forgotten VolumeMount challenge
          const hasVolumeMounts = yamlContent.includes('volumeMounts:');
          const hasMountPath = yamlContent.includes('mountPath:');
          const hasVolumeReference = yamlContent.includes('name: config-volume');
          isLikelyCorrect = hasVolumeMounts && hasMountPath && hasVolumeReference;
          break;

        case 24: // Bad Label Selector challenge
          const hasMatchingLabels = (yamlContent.includes('app: web-app') &&
                                   yamlContent.match(/selector:\s*\n\s*matchLabels:\s*\n\s*app: web-app/) &&
                                   yamlContent.match(/labels:\s*\n\s*app: web-app/)) ||
                                   (yamlContent.includes('app: frontend') &&
                                   yamlContent.match(/selector:\s*\n\s*matchLabels:\s*\n\s*app: frontend/) &&
                                   yamlContent.match(/labels:\s*\n\s*app: frontend/));
          isLikelyCorrect = hasMatchingLabels;
          break;

        case 25: // Missing Service challenge
          const hasServiceDefinition = yamlContent.includes('kind: Service');
          const hasServiceSelector = yamlContent.includes('selector:') && yamlContent.includes('app: web');
          const hasServicePorts = yamlContent.includes('port: 80') && yamlContent.includes('targetPort: 80');
          isLikelyCorrect = hasServiceDefinition && hasServiceSelector && hasServicePorts;
          break;

        case 26: // Duplicate Port Numbers challenge
          const portMatches = yamlContent.match(/containerPort: (\d+)/g);
          const hasDuplicatePorts = portMatches && portMatches.length > 1 &&
                                   portMatches[0] === portMatches[1];
          isLikelyCorrect = !hasDuplicatePorts;
          break;

        case 27: // Wrong Volume Type challenge
          const hasPersistentVolumeClaim = yamlContent.includes('persistentVolumeClaim:');
          const noEmptyDir = !yamlContent.includes('emptyDir: {}');
          isLikelyCorrect = hasPersistentVolumeClaim && noEmptyDir;
          break;

        case 28: // Crash from Bad ENV challenge
          isLikelyCorrect = yamlContent.includes('key: database_url') && !yamlContent.includes('key: db_url');
          break;

        case 29: // Image Tag "latest" Problem challenge
          isLikelyCorrect = !yamlContent.includes(':latest') &&
                           (yamlContent.includes(':v1.') || yamlContent.includes(':1.') || yamlContent.includes(':stable'));
          break;

        case 30: // Secret in Wrong Namespace challenge
          isLikelyCorrect = yamlContent.includes('namespace: development') ||
                           !yamlContent.includes('namespace: production');
          break;

        case 31: // Missing Entrypoint challenge
          isLikelyCorrect = yamlContent.includes('command:') &&
                           (yamlContent.includes('sleep') || yamlContent.includes('sh') || yamlContent.includes('echo'));
          break;

        case 32: // Wrong Image Pull Policy challenge
          const hasCorrectPullPolicy = yamlContent.includes('imagePullPolicy: Always') ||
                                      yamlContent.includes('imagePullPolicy: IfNotPresent');
          isLikelyCorrect = hasCorrectPullPolicy && !yamlContent.includes('imagePullPolicy: Never');
          break;

        case 33: // Namespace Missing challenge
          isLikelyCorrect = yamlContent.includes('kind: Namespace') ||
                           !yamlContent.includes('namespace: non-existent-namespace');
          break;

        case 34: // Init Container Fails challenge
          isLikelyCorrect = yamlContent.includes('command:') &&
                           !yamlContent.includes('invalid-command') &&
                           (yamlContent.includes('echo') || yamlContent.includes('sleep') || yamlContent.includes('true'));
          break;

        case 35: // Wrong ConfigMap Key challenge
          isLikelyCorrect = yamlContent.includes('key: database_host') && !yamlContent.includes('key: db_host');
          break;

        case 36: // Excessive Log Volume challenge
          isLikelyCorrect = yamlContent.includes('ephemeral-storage') ||
                           yamlContent.includes('while false') ||
                           !yamlContent.includes('while true');
          break;

        case 37: // No Readiness Check challenge
          isLikelyCorrect = yamlContent.includes('readinessProbe:') &&
                           yamlContent.includes('httpGet:') &&
                           yamlContent.includes('path:');
          break;

        case 38: // Wrong Deployment Strategy challenge
          isLikelyCorrect = yamlContent.includes('type: RollingUpdate') && !yamlContent.includes('type: Recreate');
          break;

        case 39: // Readiness Probe Uses Wrong Path challenge
          isLikelyCorrect = yamlContent.includes('path: /status') && !yamlContent.includes('path: /healthz');
          break;

        case 40: // Resource Starvation challenge
          const hasResourceSection40 = yamlContent.includes('resources:');
          const hasLimits40 = yamlContent.includes('limits:');
          const hasRequests40 = yamlContent.includes('requests:');
          isLikelyCorrect = hasResourceSection40 && hasLimits40 && hasRequests40;
          break;

        case 41: // Image Registry Timeout challenge
          isLikelyCorrect = yamlContent.includes('imagePullPolicy: IfNotPresent') && !yamlContent.includes('imagePullPolicy: Always');
          break;

        case 42: // Service Without Selector challenge
          isLikelyCorrect = yamlContent.includes('selector:') && yamlContent.includes('app: web');
          break;

        case 43: // Invalid HostAlias challenge
          isLikelyCorrect = !yamlContent.includes('999.999.999.999') && yamlContent.includes('192.168.1.100');
          break;

        case 44: // Stale PVC Bound challenge
          isLikelyCorrect = yamlContent.includes('persistentVolumeReclaimPolicy: Delete') && !yamlContent.includes('persistentVolumeReclaimPolicy: Retain');
          break;

        case 45: // Failing CronJob challenge
          isLikelyCorrect = yamlContent.includes('timeZone:') && yamlContent.includes('UTC');
          break;

        case 46: // Affinity Rules Too Strict challenge
          isLikelyCorrect = yamlContent.includes('preferredDuringSchedulingIgnoredDuringExecution') && !yamlContent.includes('requiredDuringSchedulingIgnoredDuringExecution');
          break;

        case 47: // NetworkPolicy Misrouting challenge
          isLikelyCorrect = yamlContent.includes('cidr: 10.0.0.0/8') && !yamlContent.includes('cidr: 0.0.0.0/0');
          break;

        case 48: // Wrong RBAC for CRDs challenge
          isLikelyCorrect = yamlContent.includes('customresources') || yamlContent.includes('mycrds');
          break;

        case 49: // StatefulSet Ordering Broken challenge
          isLikelyCorrect = yamlContent.includes('volumeClaimTemplates:') && !yamlContent.includes('persistentVolumeClaim:');
          break;

        case 50: // Overprovisioned HPA challenge
          isLikelyCorrect = yamlContent.includes('maxReplicas: 10') && !yamlContent.includes('maxReplicas: 50');
          break;

        case 51: // ReadWriteOnce Conflict challenge
          isLikelyCorrect = yamlContent.includes('ReadWriteMany') && !yamlContent.includes('ReadWriteOnce');
          break;

        case 52: // Seccomp Blocks Syscall challenge
          isLikelyCorrect = yamlContent.includes('type: Unconfined') && !yamlContent.includes('type: RuntimeDefault');
          break;

        case 53: // DNS Overwrites HOSTS File challenge
          isLikelyCorrect = yamlContent.includes('dnsPolicy: None') && !yamlContent.includes('dnsPolicy: ClusterFirst');
          break;

        case 54: // API Rate Limits Hit challenge
          isLikelyCorrect = yamlContent.includes('value: "30"') && !yamlContent.includes('value: "1"');
          break;

        case 55: // PodSecurityPolicy Too Strict challenge
          isLikelyCorrect = yamlContent.includes('runAsNonRoot: false') && !yamlContent.includes('runAsNonRoot: true');
          break;

        case 56: // Custom AdmissionController Rejects Pod challenge
          isLikelyCorrect = yamlContent.includes('name: sidecar') && yamlContent.includes('image: sidecar:latest');
          break;

        default:
          // More strict generic validation for challenges without specific logic
          const hasValidYaml = yamlContent.includes('apiVersion') && yamlContent.includes('kind');
          const hasSignificantChanges = hasChanges && Math.abs(yamlContent.length - challenge.brokenYaml.length) > 10;
          isLikelyCorrect = hasValidYaml && hasSignificantChanges;
      }
    }

    setRealTimeValidation({ hasChanges, isLikelyCorrect });
  }, [yamlContent, challenge.id, challenge.brokenYaml]);

  const validateSolution = async () => {
    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced validation logic based on challenge ID
    let isValid = false;
    let message = '';
    let issues: string[] = [];

    switch (challenge.id) {
      case 1: // Pod in CrashLoopBackOff - Fix container command
        const hasRemovedCommand = !yamlContent.includes('command:') || !yamlContent.includes('wrong-command');
        const hasRemovedArgs = !yamlContent.includes('args:') || !yamlContent.includes('wrong-command');
        const hasNginxImage = yamlContent.includes('nginx:latest');

        if (hasRemovedCommand && hasRemovedArgs && hasNginxImage) {
          isValid = true;
          message = 'Perfect! You removed the incorrect command and args. Nginx will now start with its default configuration and the pod should run successfully.';
        } else {
          if (!hasRemovedCommand || !hasRemovedArgs) {
            issues.push('The command and args with "wrong-command" are still present - remove them to let nginx start normally');
          }
          if (!hasNginxImage) {
            issues.push('Make sure you\'re using the nginx:latest image');
          }
          message = 'The CrashLoopBackOff issue is not resolved yet. The container command is still incorrect.';
        }
        break;

      case 2: // Service Not Routing to Pod - Fix service selector
        const hasCorrectServiceSelector = yamlContent.includes('app: web-application') &&
                                         yamlContent.match(/selector:\s*\n\s*app: web-application/);
        const hasDeploymentLabels = yamlContent.includes('app: web-application') &&
                                   yamlContent.match(/labels:\s*\n\s*app: web-application/);

        if (hasCorrectServiceSelector && hasDeploymentLabels) {
          isValid = true;
          message = 'Excellent! You fixed the service selector to match the pod labels. Traffic can now flow properly from the service to the pods.';
        } else {
          if (!hasCorrectServiceSelector) {
            issues.push('Service selector should be "app: web-application" to match the deployment pod labels');
          }
          if (!hasDeploymentLabels) {
            issues.push('Make sure the deployment template labels are "app: web-application"');
          }
          message = 'Service selector mismatch is not resolved yet. Traffic cannot reach the pods.';
        }
        break;

      case 3: // App Not Accessible Externally - Fix service type
        const hasNodePortType = yamlContent.includes('type: NodePort') || yamlContent.includes('type: LoadBalancer');

        if (hasNodePortType) {
          isValid = true;
          message = 'Excellent! You changed the service type to allow external access. The application should now be accessible from outside the cluster.';
        } else {
          issues = [
            'Service type is still ClusterIP which only allows internal cluster access',
            'Change the service type to "NodePort" or "LoadBalancer" for external access',
            'If using NodePort, consider adding a nodePort field to specify the port'
          ];
          message = 'The service is still not accessible externally. Change the service type.';
        }
        break;

      case 4: // Missing ConfigMap challenge
        const hasConfigMap = yamlContent.includes('kind: ConfigMap') && yamlContent.includes('name: app-config');
        const hasConfigMapData = yamlContent.includes('data:');

        if (hasConfigMap && hasConfigMapData) {
          isValid = true;
          message = 'Perfect! You created the missing ConfigMap. The application can now access its configuration data.';
        } else {
          if (!hasConfigMap) {
            issues.push('Missing ConfigMap with name "app-config"');
          }
          if (!hasConfigMapData) {
            issues.push('ConfigMap needs a data section with configuration values');
          }
          message = 'The missing ConfigMap issue is not resolved yet.';
        }
        break;

      case 5: // Secret Not Mounted challenge
        const hasCorrectSecretName = yamlContent.includes('secretName: db-credentials');

        if (hasCorrectSecretName) {
          isValid = true;
          message = 'Great! You fixed the secret name reference. The application can now access the mounted credentials.';
        } else {
          issues.push('Secret name in volume should be "db-credentials" not "db-secret"');
          message = 'The secret mounting issue is not resolved yet.';
        }
        break;

      case 6: // Readiness Probe Failing challenge
        const hasCorrectProbePath = yamlContent.includes('path: /') && !yamlContent.includes('path: /health');
        const hasCorrectProbePort = yamlContent.includes('port: 80') && !yamlContent.includes('port: 8080');

        if (hasCorrectProbePath && hasCorrectProbePort) {
          isValid = true;
          message = 'Excellent! You fixed the readiness probe path and port. Pods should now become ready correctly.';
        } else {
          if (!hasCorrectProbePath) {
            issues.push('Readiness probe path should be "/" not "/health" for nginx');
          }
          if (!hasCorrectProbePort) {
            issues.push('Readiness probe port should be 80 not 8080 for nginx');
          }
          message = 'Readiness probe configuration is still incorrect.';
        }
        break;

      case 7: // ImagePullBackOff challenge
        const hasCorrectImageName = yamlContent.includes('nginx:latest') && !yamlContent.includes('nginxx:latest');

        if (hasCorrectImageName) {
          isValid = true;
          message = 'Perfect! You fixed the image name typo. The container should now pull successfully.';
        } else {
          issues.push('Image name should be "nginx:latest" not "nginxx:latest"');
          message = 'Image name typo is not fixed yet.';
        }
        break;

      case 8: // Pod Stuck in Pending challenge
        const hasReasonableResources = yamlContent.includes('cpu: "100m"') || yamlContent.includes('cpu: "200m"') ||
                                      yamlContent.includes('memory: "128Mi"') || yamlContent.includes('memory: "256Mi"');
        const noExcessiveResources = !yamlContent.includes('cpu: "4"') && !yamlContent.includes('memory: "8Gi"');

        if (hasReasonableResources && noExcessiveResources) {
          isValid = true;
          message = 'Great! You reduced the resource requests to reasonable values. The pod should now be scheduled.';
        } else {
          if (!noExcessiveResources) {
            issues.push('Resource requests are still too high (4 CPUs, 8GB RAM)');
          }
          if (!hasReasonableResources) {
            issues.push('Set reasonable resource requests like 100m CPU and 128Mi memory');
          }
          message = 'Resource requests are still too high for the cluster.';
        }
        break;

      case 21: // Wrong Container Port challenge
        const hasCorrectContainerPort = yamlContent.includes('containerPort: 80') && !yamlContent.includes('containerPort: 8080');
        const hasCorrectTargetPort = yamlContent.includes('targetPort: 80');

        if (hasCorrectContainerPort) {
          isValid = true;
          message = 'Perfect! You fixed the container port to match nginx default port 80.';
        } else {
          issues.push('Container port should be 80 to match nginx default, not 8080');
          message = 'Container port mismatch is not resolved yet.';
        }
        break;

      case 22: // No Resource Limits challenge
        const hasResourceSection = yamlContent.includes('resources:');
        const hasLimits = yamlContent.includes('limits:');
        const hasRequests = yamlContent.includes('requests:');

        if (hasResourceSection && hasLimits && hasRequests) {
          isValid = true;
          message = 'Excellent! You added resource limits and requests to prevent resource abuse.';
        } else {
          if (!hasResourceSection) {
            issues.push('Add a resources section to the container');
          }
          if (!hasLimits) {
            issues.push('Add resource limits to prevent excessive consumption');
          }
          if (!hasRequests) {
            issues.push('Add resource requests for proper scheduling');
          }
          message = 'Resource limits are still missing.';
        }
        break;

      case 23: // Forgotten VolumeMount challenge
        const hasVolumeMounts = yamlContent.includes('volumeMounts:');
        const hasMountPath = yamlContent.includes('mountPath:');
        const hasVolumeReference = yamlContent.includes('name: config-volume');

        if (hasVolumeMounts && hasMountPath && hasVolumeReference) {
          isValid = true;
          message = 'Great! You added the missing volumeMounts section. The container can now access the volume.';
        } else {
          if (!hasVolumeMounts) {
            issues.push('Add volumeMounts section to the container');
          }
          if (!hasMountPath) {
            issues.push('Specify mountPath where the volume should be mounted');
          }
          if (!hasVolumeReference) {
            issues.push('Reference the config-volume in volumeMounts');
          }
          message = 'Volume mount configuration is incomplete.';
        }
        break;

      case 24: // Bad Label Selector challenge
        const hasMatchingLabels = (yamlContent.includes('app: web-app') &&
                                 yamlContent.match(/selector:\s*\n\s*matchLabels:\s*\n\s*app: web-app/) &&
                                 yamlContent.match(/labels:\s*\n\s*app: web-app/)) ||
                                 (yamlContent.includes('app: frontend') &&
                                 yamlContent.match(/selector:\s*\n\s*matchLabels:\s*\n\s*app: frontend/) &&
                                 yamlContent.match(/labels:\s*\n\s*app: frontend/));

        if (hasMatchingLabels) {
          isValid = true;
          message = 'Excellent! You fixed the label selector mismatch. The deployment can now manage its pods correctly.';
        } else {
          issues = [
            'Deployment selector still doesn\'t match pod template labels',
            'Both selector.matchLabels and template.metadata.labels should use the same value',
            'Either change both to "app: web-app" or both to "app: frontend"'
          ];
          message = 'Label selector mismatch is not resolved yet.';
        }
        break;



      case 25: // Missing Service challenge
        const hasServiceDefinition = yamlContent.includes('kind: Service');
        const hasServiceSelector = yamlContent.includes('selector:') && yamlContent.includes('app: web');
        const hasServicePorts = yamlContent.includes('port: 80') && yamlContent.includes('targetPort: 80');

        if (hasServiceDefinition && hasServiceSelector && hasServicePorts) {
          isValid = true;
          message = 'Perfect! You created the missing Service to expose the pods.';
        } else {
          if (!hasServiceDefinition) {
            issues.push('Create a Service resource with kind: Service');
          }
          if (!hasServiceSelector) {
            issues.push('Service needs a selector that matches pod labels (app: web)');
          }
          if (!hasServicePorts) {
            issues.push('Service needs port configuration (port: 80, targetPort: 80)');
          }
          message = 'Service is still missing or incomplete.';
        }
        break;

      case 26: // Duplicate Port Numbers challenge
        const portMatches = yamlContent.match(/containerPort: (\d+)/g);
        const hasDuplicatePorts = portMatches && portMatches.length > 1 &&
                                 portMatches[0] === portMatches[1];

        if (!hasDuplicatePorts) {
          isValid = true;
          message = 'Great! You fixed the duplicate port numbers. Each port must be unique.';
        } else {
          issues.push('Container still has duplicate port numbers - each port must be unique');
          message = 'Duplicate port numbers are not resolved yet.';
        }
        break;

      case 27: // Wrong Volume Type challenge
        const hasPersistentVolumeClaim = yamlContent.includes('persistentVolumeClaim:');
        const noEmptyDir = !yamlContent.includes('emptyDir: {}');

        if (hasPersistentVolumeClaim && noEmptyDir) {
          isValid = true;
          message = 'Excellent! You replaced emptyDir with persistentVolumeClaim for data persistence.';
        } else {
          if (!hasPersistentVolumeClaim) {
            issues.push('Replace emptyDir with persistentVolumeClaim for persistent storage');
          }
          if (!noEmptyDir) {
            issues.push('Remove emptyDir volume type as it loses data on restart');
          }
          message = 'Volume type is still not persistent.';
        }
        break;

      case 9: // Wrong Environment Variable challenge
        const hasValidDatabaseUrl = yamlContent.includes('DATABASE_URL') &&
                                   !yamlContent.includes('value: ""') &&
                                   (yamlContent.includes('postgresql://') || yamlContent.includes('postgres://'));

        if (hasValidDatabaseUrl) {
          isValid = true;
          message = 'Perfect! You provided a valid DATABASE_URL. The application should now start correctly.';
        } else {
          if (yamlContent.includes('value: ""')) {
            issues.push('DATABASE_URL environment variable is empty - provide a valid database connection string');
          } else {
            issues.push('DATABASE_URL should contain a valid PostgreSQL connection string');
          }
          message = 'DATABASE_URL environment variable is still invalid.';
        }
        break;

      case 10: // Liveness Probe Causes Pod Restart challenge
        const hasIncreasedInitialDelay = !yamlContent.includes('initialDelaySeconds: 1') &&
                                        (yamlContent.includes('initialDelaySeconds: 30') || yamlContent.includes('initialDelaySeconds: 15'));
        const hasIncreasedTimeout = !yamlContent.includes('timeoutSeconds: 1') &&
                                   (yamlContent.includes('timeoutSeconds: 5') || yamlContent.includes('timeoutSeconds: 10'));
        const hasIncreasedFailureThreshold = !yamlContent.includes('failureThreshold: 1') &&
                                            (yamlContent.includes('failureThreshold: 3') || yamlContent.includes('failureThreshold: 5'));

        if (hasIncreasedInitialDelay && hasIncreasedTimeout && hasIncreasedFailureThreshold) {
          isValid = true;
          message = 'Excellent! You made the liveness probe less aggressive. Pods should stop restarting unnecessarily.';
        } else {
          if (!hasIncreasedInitialDelay) {
            issues.push('Increase initialDelaySeconds to give the app time to start (e.g., 30 seconds)');
          }
          if (!hasIncreasedTimeout) {
            issues.push('Increase timeoutSeconds to allow more time for response (e.g., 5 seconds)');
          }
          if (!hasIncreasedFailureThreshold) {
            issues.push('Increase failureThreshold to be less sensitive (e.g., 3 failures)');
          }
          message = 'Liveness probe is still too aggressive and causing restarts.';
        }
        break;

      case 11: // Broken Ingress Route challenge
        const hasCorrectIngressPath = yamlContent.includes('path: /app') && !yamlContent.includes('path: /wrong');
        const hasCorrectServiceName = yamlContent.includes('name: web-service') && !yamlContent.includes('name: wrong-service');

        if (hasCorrectIngressPath && hasCorrectServiceName) {
          isValid = true;
          message = 'Perfect! You fixed the ingress path and service name. Traffic should now route correctly.';
        } else {
          if (!hasCorrectIngressPath) {
            issues.push('Fix the ingress path from "/wrong" to "/app" to match the application route');
          }
          if (!hasCorrectServiceName) {
            issues.push('Fix the service name from "wrong-service" to "web-service" to match the actual service');
          }
          message = 'Ingress routing is still broken due to incorrect path or service name.';
        }
        break;

      case 12: // HPA Not Scaling challenge
        const hasResourceLimits12 = yamlContent.includes('limits:') && yamlContent.includes('cpu:');
        const hasHPAMetrics = yamlContent.includes('targetCPUUtilizationPercentage') || yamlContent.includes('metrics:');

        if (hasResourceLimits12 && hasHPAMetrics) {
          isValid = true;
          message = 'Excellent! You added CPU limits and HPA metrics. Autoscaling should now work properly.';
        } else {
          if (!hasResourceLimits12) {
            issues.push('Add CPU limits to the deployment for HPA to measure utilization');
          }
          if (!hasHPAMetrics) {
            issues.push('Add targetCPUUtilizationPercentage or metrics to the HPA configuration');
          }
          message = 'HPA cannot scale without proper resource limits and metrics configuration.';
        }
        break;

      case 13: // RBAC Access Denied challenge
        const hasRoleBinding = yamlContent.includes('kind: RoleBinding') || yamlContent.includes('kind: ClusterRoleBinding');
        const hasServiceAccountRef = yamlContent.includes('kind: ServiceAccount');

        if (hasRoleBinding && hasServiceAccountRef) {
          isValid = true;
          message = 'Great! You created the missing RoleBinding to grant API access to the ServiceAccount.';
        } else {
          if (!hasRoleBinding) {
            issues.push('Create a RoleBinding or ClusterRoleBinding to grant permissions');
          }
          if (!hasServiceAccountRef) {
            issues.push('Ensure the ServiceAccount is properly referenced in the RoleBinding');
          }
          message = 'RBAC access is still denied due to missing role binding.';
        }
        break;

      case 14: // NetworkPolicy Blocks All Traffic challenge
        const hasAllowPolicy = yamlContent.includes('policyTypes:') && yamlContent.includes('Ingress');
        const hasFromSelector = yamlContent.includes('from:') || yamlContent.includes('namespaceSelector:');

        if (hasAllowPolicy && hasFromSelector) {
          isValid = true;
          message = 'Perfect! You created an allow policy to permit necessary traffic through the NetworkPolicy.';
        } else {
          if (!hasAllowPolicy) {
            issues.push('Add policyTypes with Ingress to define allowed traffic');
          }
          if (!hasFromSelector) {
            issues.push('Add from selectors to specify which sources can send traffic');
          }
          message = 'NetworkPolicy still blocks all traffic due to missing allow rules.';
        }
        break;

      case 15: // PersistentVolume Not Bound challenge
        const hasMatchingStorageClass = yamlContent.includes('storageClassName: fast-ssd');
        const hasMatchingSize = yamlContent.includes('storage: 10Gi');

        if (hasMatchingStorageClass && hasMatchingSize) {
          isValid = true;
          message = 'Excellent! You fixed the storage class and size mismatch. PVC should now bind to PV.';
        } else {
          if (!hasMatchingStorageClass) {
            issues.push('Change storageClassName to "fast-ssd" to match the PersistentVolume');
          }
          if (!hasMatchingSize) {
            issues.push('Change storage size to "10Gi" to match the PersistentVolume capacity');
          }
          message = 'PVC still cannot bind due to storage class or size mismatch.';
        }
        break;

      case 28: // Crash from Bad ENV challenge
        const hasCorrectConfigMapKey = yamlContent.includes('key: database_url') && !yamlContent.includes('key: db_url');

        if (hasCorrectConfigMapKey) {
          isValid = true;
          message = 'Perfect! You fixed the ConfigMap key reference to match the actual key name.';
        } else {
          issues.push('ConfigMap key reference should be "database_url" not "db_url"');
          message = 'ConfigMap key mismatch is not resolved yet.';
        }
        break;

      case 29: // Image Tag "latest" Problem challenge
        const hasSpecificTag = !yamlContent.includes(':latest') &&
                              (yamlContent.includes(':v1.') || yamlContent.includes(':1.') || yamlContent.includes(':stable'));

        if (hasSpecificTag) {
          isValid = true;
          message = 'Excellent! You replaced "latest" with a specific version tag for predictable deployments.';
        } else {
          issues.push('Replace ":latest" tag with a specific version like ":v1.2.3" or ":stable"');
          message = 'Image tag is still using "latest" which causes deployment issues.';
        }
        break;

      case 30: // Secret in Wrong Namespace challenge
        const secretInCorrectNamespace = yamlContent.includes('namespace: development') ||
                                        !yamlContent.includes('namespace: production');

        if (secretInCorrectNamespace) {
          isValid = true;
          message = 'Great! You moved the secret to the same namespace as the pod.';
        } else {
          issues.push('Secret should be in the same namespace as the pod (development, not production)');
          message = 'Secret is still in the wrong namespace.';
        }
        break;

      case 31: // Missing Entrypoint challenge
        const hasCommand = yamlContent.includes('command:') &&
                          (yamlContent.includes('sleep') || yamlContent.includes('sh') || yamlContent.includes('echo'));

        if (hasCommand) {
          isValid = true;
          message = 'Perfect! You added a command to keep the container running.';
        } else {
          issues.push('Add a command like ["sleep", "3600"] to provide an entrypoint for the container');
          message = 'Container still has no entrypoint and will crash.';
        }
        break;

      case 32: // Wrong Image Pull Policy challenge
        const hasCorrectPullPolicy = yamlContent.includes('imagePullPolicy: Always') ||
                                    yamlContent.includes('imagePullPolicy: IfNotPresent');

        if (hasCorrectPullPolicy && !yamlContent.includes('imagePullPolicy: Never')) {
          isValid = true;
          message = 'Excellent! You changed the image pull policy to allow image updates.';
        } else {
          issues.push('Change imagePullPolicy from "Never" to "Always" or "IfNotPresent"');
          message = 'Image pull policy still prevents pulling updated images.';
        }
        break;

      case 33: // Namespace Missing challenge
        const hasNamespaceCreation = yamlContent.includes('kind: Namespace') ||
                                    !yamlContent.includes('namespace: non-existent-namespace');

        if (hasNamespaceCreation) {
          isValid = true;
          message = 'Great! You either created the namespace or removed the reference to the non-existent namespace.';
        } else {
          issues.push('Either create the namespace first or remove the namespace reference');
          message = 'Namespace issue is not resolved yet.';
        }
        break;

      case 34: // Init Container Fails challenge
        const hasValidInitCommand = yamlContent.includes('command:') &&
                                   !yamlContent.includes('invalid-command') &&
                                   (yamlContent.includes('echo') || yamlContent.includes('sleep') || yamlContent.includes('true'));

        if (hasValidInitCommand) {
          isValid = true;
          message = 'Perfect! You fixed the init container command. The pod should now start successfully.';
        } else {
          issues.push('Fix the init container command to use a valid command like "echo" or "sleep"');
          message = 'Init container command is still invalid.';
        }
        break;

      case 35: // Wrong ConfigMap Key challenge
        const hasCorrectKey = yamlContent.includes('key: database_host') && !yamlContent.includes('key: db_host');

        if (hasCorrectKey) {
          isValid = true;
          message = 'Excellent! You fixed the ConfigMap key reference to match the actual key.';
        } else {
          issues.push('ConfigMap key should be "database_host" not "db_host"');
          message = 'ConfigMap key reference is still incorrect.';
        }
        break;

      case 36: // Excessive Log Volume challenge
        const hasLogLimits = yamlContent.includes('ephemeral-storage') ||
                            yamlContent.includes('while false') ||
                            !yamlContent.includes('while true');

        if (hasLogLimits) {
          isValid = true;
          message = 'Great! You either limited log storage or reduced log generation.';
        } else {
          issues.push('Either add ephemeral-storage limits or modify the command to reduce log volume');
          message = 'Excessive logging issue is not resolved yet.';
        }
        break;

      case 37: // No Readiness Check challenge
        const hasReadinessProbe = yamlContent.includes('readinessProbe:') &&
                                 yamlContent.includes('httpGet:') &&
                                 yamlContent.includes('path:');

        if (hasReadinessProbe) {
          isValid = true;
          message = 'Perfect! You added a readiness probe to ensure pods are ready before receiving traffic.';
        } else {
          issues.push('Add a readiness probe with httpGet to check if the pod is ready');
          message = 'Readiness probe is still missing.';
        }
        break;

      case 38: // Wrong Deployment Strategy challenge
        const hasRollingUpdate = yamlContent.includes('type: RollingUpdate') && !yamlContent.includes('type: Recreate');

        if (hasRollingUpdate) {
          isValid = true;
          message = 'Excellent! You changed the deployment strategy to RollingUpdate for zero-downtime deployments.';
        } else {
          issues.push('Change deployment strategy from "Recreate" to "RollingUpdate" to avoid downtime');
          message = 'Deployment strategy is still causing downtime during updates.';
        }
        break;

      case 39: // Readiness Probe Uses Wrong Path challenge
        const hasCorrectPath = yamlContent.includes('path: /status') && !yamlContent.includes('path: /healthz');

        if (hasCorrectPath) {
          isValid = true;
          message = 'Perfect! You fixed the readiness probe path to match the application endpoint.';
        } else {
          issues.push('Change readiness probe path from "/healthz" to "/status" to match the app endpoint');
          message = 'Readiness probe is still using the wrong path.';
        }
        break;

      case 40: // Resource Starvation challenge
        const hasResourceSection40 = yamlContent.includes('resources:');
        const hasLimits40 = yamlContent.includes('limits:');
        const hasRequests40 = yamlContent.includes('requests:');

        if (hasResourceSection40 && hasLimits40 && hasRequests40) {
          isValid = true;
          message = 'Excellent! You added resource limits and requests to prevent resource starvation.';
        } else {
          if (!hasResourceSection40) {
            issues.push('Add a resources section to the container');
          }
          if (!hasLimits40) {
            issues.push('Add resource limits to prevent excessive consumption');
          }
          if (!hasRequests40) {
            issues.push('Add resource requests for proper scheduling');
          }
          message = 'Resource configuration is still missing to prevent starvation.';
        }
        break;

      case 41: // Image Registry Timeout challenge
        const hasCorrectPullPolicy41 = yamlContent.includes('imagePullPolicy: IfNotPresent') && !yamlContent.includes('imagePullPolicy: Always');

        if (hasCorrectPullPolicy41) {
          isValid = true;
          message = 'Great! You changed the pull policy to use cached images and avoid registry timeouts.';
        } else {
          issues.push('Change imagePullPolicy from "Always" to "IfNotPresent" to use cached images');
          message = 'Image pull policy still causes registry timeout issues.';
        }
        break;

      case 42: // Service Without Selector challenge
        const hasServiceSelector42 = yamlContent.includes('selector:') && yamlContent.includes('app: web');

        if (hasServiceSelector42) {
          isValid = true;
          message = 'Perfect! You added a selector to the service to route traffic to pods.';
        } else {
          issues.push('Add a selector to the service that matches the pod labels (app: web)');
          message = 'Service still has no selector and cannot route traffic.';
        }
        break;

      case 43: // Invalid HostAlias challenge
        const hasValidIP = !yamlContent.includes('999.999.999.999') && yamlContent.includes('192.168.1.100');

        if (hasValidIP) {
          isValid = true;
          message = 'Excellent! You fixed the invalid IP address in the host alias.';
        } else {
          issues.push('Replace the invalid IP "999.999.999.999" with a valid IP like "192.168.1.100"');
          message = 'Host alias still contains an invalid IP address.';
        }
        break;

      case 44: // Stale PVC Bound challenge
        const hasDeletePolicy = yamlContent.includes('persistentVolumeReclaimPolicy: Delete') && !yamlContent.includes('persistentVolumeReclaimPolicy: Retain');

        if (hasDeletePolicy) {
          isValid = true;
          message = 'Great! You changed the reclaim policy to automatically clean up PVs.';
        } else {
          issues.push('Change persistentVolumeReclaimPolicy from "Retain" to "Delete" for auto-cleanup');
          message = 'PV reclaim policy still causes stale PVC binding issues.';
        }
        break;

      case 45: // Failing CronJob challenge
        const hasTimeZone = yamlContent.includes('timeZone:') && yamlContent.includes('UTC');

        if (hasTimeZone) {
          isValid = true;
          message = 'Perfect! You added an explicit timezone to prevent scheduling issues.';
        } else {
          issues.push('Add "timeZone: UTC" to the CronJob spec for explicit timezone handling');
          message = 'CronJob still has timezone ambiguity causing failures.';
        }
        break;

      case 46: // Affinity Rules Too Strict challenge
        const hasPreferredAffinity = yamlContent.includes('preferredDuringSchedulingIgnoredDuringExecution') && !yamlContent.includes('requiredDuringSchedulingIgnoredDuringExecution');

        if (hasPreferredAffinity) {
          isValid = true;
          message = 'Excellent! You relaxed the affinity rules to use preferred instead of required.';
        } else {
          issues.push('Change affinity from "requiredDuringSchedulingIgnoredDuringExecution" to "preferredDuringSchedulingIgnoredDuringExecution"');
          message = 'Affinity rules are still too strict for pod scheduling.';
        }
        break;

      case 47: // NetworkPolicy Misrouting challenge
        const hasRestrictedCIDR = yamlContent.includes('cidr: 10.0.0.0/8') && !yamlContent.includes('cidr: 0.0.0.0/0');

        if (hasRestrictedCIDR) {
          isValid = true;
          message = 'Great! You restricted the CIDR to internal network only.';
        } else {
          issues.push('Change CIDR from "0.0.0.0/0" to "10.0.0.0/8" to restrict to internal network');
          message = 'NetworkPolicy is still too permissive with CIDR range.';
        }
        break;

      case 48: // Wrong RBAC for CRDs challenge
        const hasCustomResourcePerms = yamlContent.includes('customresources') || yamlContent.includes('mycrds');

        if (hasCustomResourcePerms) {
          isValid = true;
          message = 'Perfect! You added permissions for custom resources.';
        } else {
          issues.push('Add "customresources" and "mycrds" to the resources list in RBAC');
          message = 'RBAC still lacks permissions for custom resources.';
        }
        break;

      case 49: // StatefulSet Ordering Broken challenge
        const hasVolumeClaimTemplates = yamlContent.includes('volumeClaimTemplates:') && !yamlContent.includes('persistentVolumeClaim:');

        if (hasVolumeClaimTemplates) {
          isValid = true;
          message = 'Excellent! You replaced shared PVC with volumeClaimTemplates for proper StatefulSet ordering.';
        } else {
          issues.push('Replace shared PVC with volumeClaimTemplates to ensure each pod gets its own storage');
          message = 'StatefulSet still uses shared PVC causing data mixup.';
        }
        break;

      case 50: // Overprovisioned HPA challenge
        const hasReasonableMaxReplicas = yamlContent.includes('maxReplicas: 10') && !yamlContent.includes('maxReplicas: 50');

        if (hasReasonableMaxReplicas) {
          isValid = true;
          message = 'Great! You reduced maxReplicas to a reasonable number.';
        } else {
          issues.push('Change maxReplicas from 50 to 10 to prevent cluster overload');
          message = 'HPA maxReplicas is still too high and can crash the cluster.';
        }
        break;

      case 51: // ReadWriteOnce Conflict challenge
        const hasReadWriteMany = yamlContent.includes('ReadWriteMany') && !yamlContent.includes('ReadWriteOnce');

        if (hasReadWriteMany) {
          isValid = true;
          message = 'Perfect! You changed the access mode to allow multiple pods to mount the volume.';
        } else {
          issues.push('Change accessModes from "ReadWriteOnce" to "ReadWriteMany" to allow multiple pods');
          message = 'PVC access mode still prevents multiple pods from mounting.';
        }
        break;

      case 52: // Seccomp Blocks Syscall challenge
        const hasUnconfinedSeccomp = yamlContent.includes('type: Unconfined') && !yamlContent.includes('type: RuntimeDefault');

        if (hasUnconfinedSeccomp) {
          isValid = true;
          message = 'Great! You changed to a less restrictive seccomp profile.';
        } else {
          issues.push('Change seccomp type from "RuntimeDefault" to "Unconfined" to allow required syscalls');
          message = 'Seccomp profile is still too restrictive for this application.';
        }
        break;

      case 53: // DNS Overwrites HOSTS File challenge
        const hasNoneDNSPolicy = yamlContent.includes('dnsPolicy: None') && !yamlContent.includes('dnsPolicy: ClusterFirst');

        if (hasNoneDNSPolicy) {
          isValid = true;
          message = 'Excellent! You changed DNS policy to respect custom host aliases.';
        } else {
          issues.push('Change dnsPolicy from "ClusterFirst" to "None" to respect hostAliases');
          message = 'DNS policy still overrides custom host aliases.';
        }
        break;

      case 54: // API Rate Limits Hit challenge
        const hasReducedPolling = yamlContent.includes('value: "30"') && !yamlContent.includes('value: "1"');

        if (hasReducedPolling) {
          isValid = true;
          message = 'Perfect! You reduced the polling frequency to avoid rate limits.';
        } else {
          issues.push('Change polling interval from "1" second to "30" seconds to avoid rate limits');
          message = 'Application is still polling too frequently and hitting rate limits.';
        }
        break;

      case 55: // PodSecurityPolicy Too Strict challenge
        const allowsRootAccess = yamlContent.includes('runAsNonRoot: false') && !yamlContent.includes('runAsNonRoot: true');

        if (allowsRootAccess) {
          isValid = true;
          message = 'Great! You allowed root access for this application that requires it.';
        } else {
          issues.push('Change runAsNonRoot from "true" to "false" to allow required root access');
          message = 'Pod security policy still blocks required root access.';
        }
        break;

      case 56: // Custom AdmissionController Rejects Pod challenge
        const hasSidecar = yamlContent.includes('name: sidecar') && yamlContent.includes('image: sidecar:latest');

        if (hasSidecar) {
          isValid = true;
          message = 'Perfect! You added the required sidecar container to satisfy the admission controller.';
        } else {
          issues.push('Add a sidecar container with name "sidecar" and image "sidecar:latest"');
          message = 'Pod still lacks the required sidecar container.';
        }
        break;

      default:
        // More strict generic validation for challenges without specific logic
        const hasValidYaml = yamlContent.includes('apiVersion') && yamlContent.includes('kind');
        const hasChanges = yamlContent !== challenge.brokenYaml;
        const hasSignificantChanges = hasChanges && Math.abs(yamlContent.length - challenge.brokenYaml.length) > 10;

        if (hasValidYaml && hasSignificantChanges) {
          // For challenges without specific validation, require significant changes
          isValid = true;
          message = `Good progress! You made significant changes to the configuration. This challenge (ID: ${challenge.id}) uses generic validation - the specific solution may vary.`;
          issues = ['✅ Changes detected - verify the solution matches the expected fix'];
        } else {
          if (!hasValidYaml) {
            issues.push('YAML structure appears invalid - check syntax and required fields');
          }
          if (!hasChanges) {
            issues.push('No changes detected from the original broken configuration');
          } else if (!hasSignificantChanges) {
            issues.push('Changes are too minor - make more substantial fixes to resolve the issue');
          }
          message = 'Please make meaningful changes to fix the configuration issue.';
        }
    }

    setValidationResult({ isValid, message, issues });
    setIsValidating(false);

    if (isValid) {
      toast.success('🎉 Challenge completed successfully!');
    } else {
      toast.error('Solution not correct yet. Check the feedback!');
    }
  };

  const resetChallenge = () => {
    setYamlContent(challenge.brokenYaml);
    setValidationResult(null);
    toast.success('Challenge reset to initial state');
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
    },
    theme: 'vs-light',
    wordWrap: 'on' as const,
    automaticLayout: true,
    readOnly: false,
    folding: true,
    foldingStrategy: 'indentation' as const,
    showFoldingControls: 'always' as const,
  };

  // Traffic flow visualization component
  const TrafficFlowDiagram = () => (
    <div className="bg-slate-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
        <Network className="w-4 h-4 mr-2" />
        Traffic Flow Analysis
      </h4>
      <div className="space-y-3">
        {/* Traffic flow steps */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className={`w-3 h-3 rounded-full ${validationResult?.isValid ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-16">External</span>
            <ArrowRight className="w-3 h-3" />
            <span className="w-16">Ingress</span>
            <ArrowRight className="w-3 h-3" />
            <span className="w-16">Service</span>
            <ArrowRight className="w-3 h-3" />
            <span>Pods</span>
          </div>
          <div className={`text-xs font-medium ${validationResult?.isValid ? 'text-emerald-600' : 'text-red-600'}`}>
            Status: {validationResult?.isValid ? 'Traffic Flowing ✓' : 'Traffic Blocked ✗'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Challenge Info */}
      <div className="bg-red-50 border-b border-red-200 p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-900 mb-1">🚨 Production Issue Detected</h3>
            <p className="text-sm text-red-700 mb-2">{challenge.scenario}</p>
            <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
              <strong>Root Cause:</strong> {challenge.problem}
            </div>
          </div>
        </div>
      </div>

      {/* Editor and Analysis */}
      <div className="flex-1 flex">
        {/* Main Editor */}
        <div className={`flex flex-col ${showTrafficFlow ? 'flex-1' : 'w-full'}`}>
          {/* Real-time Feedback Bar */}
          {realTimeValidation.hasChanges && (
            <div className={`px-4 py-2 text-sm font-medium ${
              realTimeValidation.isLikelyCorrect
                ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-200'
                : 'bg-orange-50 text-orange-700 border-b border-orange-200'
            }`}>
              <div className="flex items-center space-x-2">
                {realTimeValidation.isLikelyCorrect ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>✓ Changes look good! Click "Test Solution" to validate.</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span>⚠ Keep working on the solution. Check the hints if needed.</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">
                  Fix the YAML Configuration
                </span>
                <span className="text-xs text-slate-500">
                  {yamlContent.split('\n').length} lines
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTrafficFlow(!showTrafficFlow)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {showTrafficFlow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>Analysis</span>
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetChallenge}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={validateSolution}
                  disabled={isValidating || !realTimeValidation.hasChanges}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !realTimeValidation.hasChanges
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : realTimeValidation.isLikelyCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isValidating ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>
                        {!realTimeValidation.hasChanges
                          ? 'Make Changes First'
                          : realTimeValidation.isLikelyCorrect
                          ? 'Test Solution ✓'
                          : 'Test Solution'
                        }
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showSolution ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Hide Solution</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Show Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* YAML Editor */}
          <div className={`flex-1 ${isExpanded ? 'fixed inset-0 z-50 bg-white' : ''}`}>
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={yamlContent}
              onChange={(value) => setYamlContent(value || '')}
              options={editorOptions}
            />
          </div>
        </div>

        {/* Traffic Flow Analysis Panel */}
        <AnimatePresence>
          {showTrafficFlow && !isExpanded && (
            <motion.div
              className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <TrafficFlowDiagram />
                
                {/* System Status */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    System Status
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Pods:</span>
                      <span className="text-emerald-600">3/3 Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className={validationResult?.isValid ? 'text-emerald-600' : 'text-red-600'}>
                        {validationResult?.isValid ? 'Connected' : 'No Endpoints'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ingress:</span>
                      <span className="text-blue-600">Configured</span>
                    </div>
                  </div>
                </div>

                {/* Live Logs Simulation */}
                <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                  <div className="text-slate-400 mb-2">Live Logs:</div>
                  <div className="space-y-1 text-slate-300">
                    <div className="text-emerald-400">✓ Pods started successfully</div>
                    <div className={validationResult?.isValid ? 'text-emerald-400' : 'text-red-400'}>
                      {validationResult?.isValid ? '✓ Service endpoints available' : '✗ Service has no endpoints'}
                    </div>
                    <div className={validationResult?.isValid ? 'text-emerald-400' : 'text-yellow-400'}>
                      {validationResult?.isValid ? '✓ Traffic routing successfully' : '⚠ Traffic routing failed'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <motion.div
          className={`border-t p-4 ${
            validationResult.isValid 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-red-50 border-red-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h4 className={`text-sm font-medium mb-2 ${
                validationResult.isValid ? 'text-emerald-900' : 'text-red-900'
              }`}>
                {validationResult.isValid ? '🎉 Solution Correct!' : '🔍 Issues Found'}
              </h4>
              <p className={`text-sm mb-3 ${
                validationResult.isValid ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {validationResult.message}
              </p>
              
              {validationResult.issues.length > 0 && (
                <div className="space-y-1">
                  {validationResult.issues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
                      <div className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}

              {validationResult.isValid && (
                <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>What you learned:</strong> This challenge taught you about {challenge.title.toLowerCase()} - a common production issue that DevOps engineers face regularly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Solution Display */}
      {showSolution && (
        <motion.div
          className="border-t bg-blue-50 border-blue-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-2 text-blue-900">
                  💡 Solution Explanation
                </h4>
                <p className="text-sm mb-3 text-blue-700">
                  {challenge.solution}
                </p>

                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <h5 className="text-xs font-medium text-blue-800 mb-2">Key Learning Points:</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• {challenge.realWorldContext}</li>
                    <li>• Always verify that selectors match labels exactly</li>
                    <li>• Use kubectl commands to debug connectivity issues</li>
                    <li>• Test your configuration in a development environment first</li>
                  </ul>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Apply the correct solution based on challenge ID
                      let correctedYaml = challenge.brokenYaml;

                      switch (challenge.id) {
                        case 1: // Pod in CrashLoopBackOff - Remove wrong command
                          correctedYaml = challenge.brokenYaml
                            .replace(/\s*command: \[.*?\]\n/, '')
                            .replace(/\s*args: \[.*?\]\s*# This command doesn't exist\n/, '');
                          break;
                        case 2: // Service selector mismatch
                          correctedYaml = challenge.brokenYaml.replace(
                            'app: web-app  # This doesn\'t match the pod labels!',
                            'app: web-application  # Now matches the pod labels!'
                          );
                          break;
                        case 3: // App Not Accessible Externally - Change service type
                          correctedYaml = challenge.brokenYaml.replace(
                            'type: ClusterIP  # This only allows internal access',
                            'type: NodePort  # Now allows external access\n  nodePort: 30080  # External port'
                          );
                          break;
                        case 4: // Missing ConfigMap - Add ConfigMap
                          correctedYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://localhost:5432/myapp"
  log_level: "info"
  max_connections: "100"
---
${challenge.brokenYaml}`;
                          break;
                        case 5: // Secret Not Mounted - Fix secret name
                          correctedYaml = challenge.brokenYaml.replace(
                            'secretName: db-secret  # Wrong secret name!',
                            'secretName: db-credentials  # Now matches the actual secret!'
                          );
                          break;
                        case 6: // Readiness Probe Failing - Fix path and port
                          correctedYaml = challenge.brokenYaml.replace(
                            'path: /health  # This endpoint doesn\'t exist in nginx\n            port: 8080     # Wrong port',
                            'path: /  # Root path exists in nginx\n            port: 80     # Correct port'
                          );
                          break;
                        case 7: // ImagePullBackOff - Fix image name typo
                          correctedYaml = challenge.brokenYaml.replace(
                            'image: nginxx:latest  # Typo in image name!',
                            'image: nginx:latest  # Fixed image name'
                          );
                          break;
                        case 8: // Pod Stuck in Pending - Reduce resource requests
                          correctedYaml = challenge.brokenYaml.replace(
                            'cpu: "4"      # Requesting 4 CPUs\n        memory: "8Gi" # Requesting 8GB RAM',
                            'cpu: "100m"   # Reasonable CPU request\n        memory: "128Mi" # Reasonable memory request'
                          ).replace(
                            'cpu: "4"\n        memory: "8Gi"',
                            'cpu: "200m"\n        memory: "256Mi"'
                          );
                          break;
                        case 9: // Wrong Environment Variable - Fix DATABASE_URL
                          correctedYaml = challenge.brokenYaml.replace(
                            'value: ""  # Empty value causes app to crash!',
                            'value: "postgresql://user:pass@db:5432/myapp"  # Valid database URL'
                          );
                          break;
                        case 10: // Liveness Probe Causes Pod Restart - Adjust timing
                          correctedYaml = challenge.brokenYaml.replace(
                            'initialDelaySeconds: 5   # Too short!\n          periodSeconds: 5        # Too frequent!\n          timeoutSeconds: 1       # Too short!\n          failureThreshold: 1     # Too strict!',
                            'initialDelaySeconds: 30  # Give app time to start\n          periodSeconds: 30       # Check every 30 seconds\n          timeoutSeconds: 5       # Allow 5 seconds for response\n          failureThreshold: 3     # Allow 3 failures before restart'
                          );
                          break;
                        case 11: // Broken Ingress Route - Fix service name and pathType
                          correctedYaml = challenge.brokenYaml.replace(
                            'name: api-svc  # Wrong service name!',
                            'name: api-service  # Correct service name'
                          ).replace(
                            'pathType: Exact  # Too restrictive',
                            'pathType: Prefix  # More flexible'
                          );
                          break;
                        case 12: // HPA Not Scaling - Add resource requests
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 13: // RBAC Access Denied - Add missing permissions
                          correctedYaml = challenge.brokenYaml.replace(
                            'verbs: ["get"]  # Missing permissions!',
                            'verbs: ["get", "list", "watch", "create"]  # Complete permissions'
                          );
                          break;
                        case 14: // NetworkPolicy Blocks All Traffic - Add allow rules
                          correctedYaml = challenge.brokenYaml.replace(
                            'policyTypes:\n  - Ingress\n  - Egress\n  # No rules = deny all!',
                            `policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 53  # DNS
    - protocol: UDP
      port: 53  # DNS`
                          );
                          break;
                        case 15: // PersistentVolume Not Bound - Fix storage class and access mode
                          correctedYaml = challenge.brokenYaml.replace(
                            'storageClassName: fast-ssd  # This class doesn\'t exist!',
                            'storageClassName: standard  # Use existing storage class'
                          ).replace(
                            'accessModes:\n    - ReadWriteMany  # Not supported by this storage class',
                            'accessModes:\n    - ReadWriteOnce  # Supported access mode'
                          );
                          break;
                        case 21: // Wrong Container Port - Fix port number
                          correctedYaml = challenge.brokenYaml.replace(
                            'containerPort: 8080  # Wrong port for nginx!',
                            'containerPort: 80  # Correct nginx port'
                          );
                          break;
                        case 22: // No Resource Limits - Add resource constraints
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 23: // Forgotten VolumeMount - Add volumeMounts
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 24: // Bad Label Selector - Fix selector mismatch
                          correctedYaml = challenge.brokenYaml.replace(
                            'app: frontend  # This doesn\'t match template labels',
                            'app: web-app  # Now matches template labels'
                          );
                          break;
                        case 25: // Missing Service - Add Service
                          correctedYaml = `${challenge.brokenYaml}
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP`;
                          break;
                        case 26: // Duplicate Port Numbers - Fix duplicate port
                          correctedYaml = challenge.brokenYaml.replace(
                            'name: metrics\n        containerPort: 80  # Duplicate port!',
                            'name: metrics\n        containerPort: 8080  # Fixed duplicate port'
                          );
                          break;
                        case 27: // Wrong Volume Type - Replace emptyDir with PVC
                          correctedYaml = challenge.brokenYaml.replace(
                            'emptyDir: {}  # Data will be lost on pod restart!',
                            'persistentVolumeClaim:\n        claimName: data-pvc  # Persistent storage'
                          );
                          break;
                        case 28: // Crash from Bad ENV - Fix ConfigMap key name
                          correctedYaml = challenge.brokenYaml.replace(
                            'key: db_host  # Wrong key name!',
                            'key: database_host  # Correct key name'
                          );
                          break;
                        case 29: // Image Tag "latest" Problem - Use specific tag
                          correctedYaml = challenge.brokenYaml.replace(
                            'image: myapp:latest  # "latest" doesn\'t trigger updates',
                            'image: myapp:v1.2.3  # Specific version tag'
                          );
                          break;
                        case 30: // Secret in Wrong Namespace - Move secret to correct namespace
                          correctedYaml = challenge.brokenYaml.replace(
                            'namespace: production  # Wrong namespace!',
                            'namespace: default  # Same namespace as pod'
                          );
                          break;
                        case 31: // Missing Entrypoint - Add command
                          correctedYaml = challenge.brokenYaml.replace(
                            'image: busybox:latest',
                            'image: busybox:latest\n        command: ["sleep", "3600"]  # Add entrypoint'
                          );
                          break;
                        case 32: // Wrong Image Pull Policy - Fix pull policy
                          correctedYaml = challenge.brokenYaml.replace(
                            'imagePullPolicy: Never  # Won\'t pull updated images',
                            'imagePullPolicy: Always  # Always pull latest image'
                          );
                          break;
                        case 33: // Namespace Missing - Create namespace first
                          correctedYaml = `apiVersion: v1
kind: Namespace
metadata:
  name: production
---
${challenge.brokenYaml}`;
                          break;
                        case 34: // Init Container Fails - Fix invalid command
                          correctedYaml = challenge.brokenYaml.replace(
                            'command: ["invalid-command"]  # This command doesn\'t exist',
                            'command: ["echo", "Init completed"]  # Valid command'
                          );
                          break;
                        case 35: // Wrong ConfigMap Key - Fix key reference
                          correctedYaml = challenge.brokenYaml.replace(
                            'key: db_host  # Wrong key name!',
                            'key: database_host  # Correct key name'
                          );
                          break;
                        case 36: // Excessive Log Volume - Add resource limits
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `resources:
          limits:
            ephemeral-storage: 1Gi  # Limit log storage
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 37: // No Readiness Check - Add readiness probe
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 38: // Wrong Deployment Strategy - Change to RollingUpdate
                          correctedYaml = challenge.brokenYaml.replace(
                            'type: Recreate  # Causes downtime!',
                            'type: RollingUpdate  # Zero downtime updates'
                          );
                          break;
                        case 39: // Readiness Probe Uses Wrong Path - Fix path
                          correctedYaml = challenge.brokenYaml.replace(
                            'path: /healthz  # Wrong endpoint!',
                            'path: /status  # Correct endpoint'
                          );
                          break;
                        case 40: // Resource Starvation - Add resource requests
                          correctedYaml = challenge.brokenYaml.replace(
                            'ports:\n        - containerPort: 80',
                            `resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
        ports:
        - containerPort: 80`
                          );
                          break;
                        case 41: // Image Registry Timeout - Change pull policy
                          correctedYaml = challenge.brokenYaml.replace(
                            'imagePullPolicy: Always  # Always pulls from slow registry',
                            'imagePullPolicy: IfNotPresent  # Use cached image if available'
                          );
                          break;
                        case 42: // Service Without Selector - Add selector
                          correctedYaml = challenge.brokenYaml.replace(
                            'spec:\n  ports:',
                            'spec:\n  selector:\n    app: web  # Add selector to match pods\n  ports:'
                          );
                          break;
                        case 43: // Invalid HostAlias - Fix IP address
                          correctedYaml = challenge.brokenYaml.replace(
                            'ip: "999.999.999.999"  # Invalid IP!',
                            'ip: "192.168.1.100"  # Valid IP address'
                          );
                          break;
                        case 44: // Stale PVC Bound - Change reclaim policy
                          correctedYaml = challenge.brokenYaml.replace(
                            'persistentVolumeReclaimPolicy: Retain  # Keeps PV after PVC deletion',
                            'persistentVolumeReclaimPolicy: Delete  # Auto-cleanup PV'
                          );
                          break;
                        case 45: // Failing CronJob - Add timezone
                          correctedYaml = challenge.brokenYaml.replace(
                            'schedule: "0 2 * * *"  # Ambiguous timezone',
                            'schedule: "0 2 * * *"\n  timeZone: "UTC"  # Explicit timezone'
                          );
                          break;
                        case 46: // Affinity Rules Too Strict - Relax affinity
                          correctedYaml = challenge.brokenYaml.replace(
                            'requiredDuringSchedulingIgnoredDuringExecution:',
                            'preferredDuringSchedulingIgnoredDuringExecution:\n        - weight: 100\n          preference:'
                          );
                          break;
                        case 47: // NetworkPolicy Misrouting - Restrict CIDR
                          correctedYaml = challenge.brokenYaml.replace(
                            'cidr: 0.0.0.0/0  # Too permissive!',
                            'cidr: 10.0.0.0/8  # Restrict to internal network'
                          );
                          break;
                        case 48: // Wrong RBAC for CRDs - Add custom resource permissions
                          correctedYaml = challenge.brokenYaml.replace(
                            'resources: ["pods", "services"]  # Missing custom resources!',
                            'resources: ["pods", "services", "customresources", "mycrds"]  # Add custom resources'
                          );
                          break;
                        case 49: // StatefulSet Ordering Broken - Add volumeClaimTemplates
                          correctedYaml = challenge.brokenYaml.replace(
                            'volumes:\n      - name: data\n        persistentVolumeClaim:\n          claimName: shared-data  # Shared PVC causes data mixup!',
                            'volumeClaimTemplates:\n  - metadata:\n      name: data\n    spec:\n      accessModes: ["ReadWriteOnce"]\n      resources:\n        requests:\n          storage: 1Gi'
                          );
                          break;
                        case 50: // Overprovisioned HPA - Reduce maxReplicas
                          correctedYaml = challenge.brokenYaml.replace(
                            'maxReplicas: 50  # Too many replicas!',
                            'maxReplicas: 10  # Reasonable maximum'
                          );
                          break;
                        case 51: // ReadWriteOnce Conflict - Change access mode or reduce replicas
                          correctedYaml = challenge.brokenYaml.replace(
                            'accessModes:\n      - ReadWriteOnce  # Only one pod can mount this!',
                            'accessModes:\n      - ReadWriteMany  # Multiple pods can mount'
                          );
                          break;
                        case 52: // Seccomp Blocks Syscall - Use less restrictive profile
                          correctedYaml = challenge.brokenYaml.replace(
                            'type: RuntimeDefault  # Too restrictive for this app',
                            'type: Unconfined  # Less restrictive profile'
                          );
                          break;
                        case 53: // DNS Overwrites HOSTS File - Change DNS policy
                          correctedYaml = challenge.brokenYaml.replace(
                            'dnsPolicy: ClusterFirst  # Overrides hostAliases',
                            'dnsPolicy: None  # Respects custom DNS settings'
                          );
                          break;
                        case 54: // API Rate Limits Hit - Implement rate limiting
                          correctedYaml = challenge.brokenYaml.replace(
                            'value: "1"  # Polling every second is too frequent!',
                            'value: "30"  # Poll every 30 seconds'
                          );
                          break;
                        case 55: // PodSecurityPolicy Too Strict - Allow required privileges
                          correctedYaml = challenge.brokenYaml.replace(
                            'runAsNonRoot: true  # App needs root access',
                            'runAsNonRoot: false  # Allow root access'
                          );
                          break;
                        case 56: // Custom AdmissionController Rejects Pod - Add required sidecar
                          correctedYaml = challenge.brokenYaml.replace(
                            'containers:\n      - name: app',
                            `containers:
      - name: sidecar
        image: sidecar:latest
        ports:
        - containerPort: 8080
      - name: app`
                          );
                          break;
                        default:
                          // For challenges without specific fixes, show the solution text
                          correctedYaml = challenge.brokenYaml;
                          toast.info('This challenge requires manual fixes based on the solution explanation above');
                          break;
                      }

                      setYamlContent(correctedYaml);
                      setShowSolution(false);
                      toast.success('Applied solution to editor');
                    }}
                    className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Apply Solution to Editor
                  </button>
                  <span className="text-xs text-blue-600">
                    Try to understand the changes before applying
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengePlayground;