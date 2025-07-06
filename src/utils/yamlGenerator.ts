import { Node, Edge } from 'reactflow';
import * as yaml from 'js-yaml';

export const generateYamlFromNodes = (nodes: Node[], edges: Edge[]): string => {
  if (nodes.length === 0) {
    return '# Add components to the canvas to generate YAML\n# Drag and drop from the component palette on the left';
  }

  const resources: any[] = [];

  nodes.forEach((node) => {
    const config = node.data.config;
    const componentType = node.data.componentType;

    switch (componentType) {
      case 'pod':
        resources.push(generatePodYaml(config));
        break;
      case 'deployment':
        resources.push(generateDeploymentYaml(config));
        break;
      case 'statefulset':
        resources.push(generateStatefulSetYaml(config));
        break;
      case 'daemonset':
        resources.push(generateDaemonSetYaml(config));
        break;
      case 'job':
        resources.push(generateJobYaml(config));
        break;
      case 'cronjob':
        resources.push(generateCronJobYaml(config));
        break;
      case 'service':
        resources.push(generateServiceYaml(config));
        break;
      case 'ingress':
        resources.push(generateIngressYaml(config));
        break;
      case 'networkpolicy':
        resources.push(generateNetworkPolicyYaml(config));
        break;
      case 'configmap':
        resources.push(generateConfigMapYaml(config));
        break;
      case 'secret':
        resources.push(generateSecretYaml(config));
        break;
      case 'serviceaccount':
        resources.push(generateServiceAccountYaml(config));
        break;
      case 'pvc':
        resources.push(generatePVCYaml(config));
        break;
      case 'pv':
        resources.push(generatePVYaml(config));
        break;
      case 'storageclass':
        resources.push(generateStorageClassYaml(config));
        break;
      case 'role':
        resources.push(generateRoleYaml(config));
        break;
      case 'clusterrole':
        resources.push(generateClusterRoleYaml(config));
        break;
      case 'rolebinding':
        resources.push(generateRoleBindingYaml(config));
        break;
      case 'clusterrolebinding':
        resources.push(generateClusterRoleBindingYaml(config));
        break;
      case 'hpa':
        resources.push(generateHPAYaml(config));
        break;
      case 'vpa':
        resources.push(generateVPAYaml(config));
        break;
    }
  });

  // Convert resources to YAML with separators
  const yamlDocs = resources.map(resource => yaml.dump(resource, {
    indent: 2,
    lineWidth: 120,
    noRefs: true
  }));

  return yamlDocs.join('---\n');
};

const generatePodYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-app' }
  },
  spec: {
    containers: [
      {
        name: 'main',
        image: config.image,
        ports: [
          {
            containerPort: config.port || 80,
            name: 'http'
          }
        ],
        resources: {
          requests: {
            memory: '64Mi',
            cpu: '250m'
          },
          limits: {
            memory: '128Mi',
            cpu: '500m'
          }
        },
        livenessProbe: {
          httpGet: {
            path: '/health',
            port: config.port || 80
          },
          initialDelaySeconds: 30,
          periodSeconds: 10
        },
        readinessProbe: {
          httpGet: {
            path: '/ready',
            port: config.port || 80
          },
          initialDelaySeconds: 5,
          periodSeconds: 5
        }
      }
    ]
  }
});

const generateDeploymentYaml = (config: any) => ({
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-app' }
  },
  spec: {
    replicas: config.replicas || 3,
    selector: {
      matchLabels: config.labels || { app: 'my-app' }
    },
    template: {
      metadata: {
        labels: config.labels || { app: 'my-app' }
      },
      spec: {
        containers: [
          {
            name: 'main',
            image: config.image,
            ports: [
              {
                containerPort: config.port || 80,
                name: 'http'
              }
            ],
            resources: {
              requests: {
                memory: '64Mi',
                cpu: '250m'
              },
              limits: {
                memory: '128Mi',
                cpu: '500m'
              }
            },
            livenessProbe: {
              httpGet: {
                path: '/health',
                port: config.port || 80
              },
              initialDelaySeconds: 30,
              periodSeconds: 10
            },
            readinessProbe: {
              httpGet: {
                path: '/ready',
                port: config.port || 80
              },
              initialDelaySeconds: 5,
              periodSeconds: 5
            }
          }
        ]
      }
    }
  }
});

const generateStatefulSetYaml = (config: any) => ({
  apiVersion: 'apps/v1',
  kind: 'StatefulSet',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-app' }
  },
  spec: {
    serviceName: config.serviceName || 'my-service',
    replicas: config.replicas || 3,
    selector: {
      matchLabels: config.labels || { app: 'my-app' }
    },
    template: {
      metadata: {
        labels: config.labels || { app: 'my-app' }
      },
      spec: {
        containers: [
          {
            name: 'main',
            image: config.image || 'nginx:latest',
            ports: [
              {
                containerPort: config.port || 80
              }
            ]
          }
        ]
      }
    },
    volumeClaimTemplates: [
      {
        metadata: {
          name: 'data'
        },
        spec: {
          accessModes: ['ReadWriteOnce'],
          resources: {
            requests: {
              storage: '10Gi'
            }
          }
        }
      }
    ]
  }
});

const generateDaemonSetYaml = (config: any) => ({
  apiVersion: 'apps/v1',
  kind: 'DaemonSet',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-app' }
  },
  spec: {
    selector: {
      matchLabels: config.labels || { app: 'my-app' }
    },
    template: {
      metadata: {
        labels: config.labels || { app: 'my-app' }
      },
      spec: {
        containers: [
          {
            name: 'main',
            image: config.image || 'nginx:latest',
            ports: [
              {
                containerPort: config.port || 80
              }
            ]
          }
        ]
      }
    }
  }
});

const generateJobYaml = (config: any) => ({
  apiVersion: 'batch/v1',
  kind: 'Job',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-job' }
  },
  spec: {
    template: {
      spec: {
        containers: [
          {
            name: 'main',
            image: config.image || 'busybox:latest',
            command: ['sh', '-c', 'echo "Job completed successfully"']
          }
        ],
        restartPolicy: 'Never'
      }
    },
    backoffLimit: 4
  }
});

const generateCronJobYaml = (config: any) => ({
  apiVersion: 'batch/v1',
  kind: 'CronJob',
  metadata: {
    name: config.name,
    labels: config.labels || { app: 'my-cronjob' }
  },
  spec: {
    schedule: config.schedule || '0 2 * * *',
    jobTemplate: {
      spec: {
        template: {
          spec: {
            containers: [
              {
                name: 'main',
                image: config.image || 'busybox:latest',
                command: ['sh', '-c', 'echo "Scheduled job completed"']
              }
            ],
            restartPolicy: 'OnFailure'
          }
        }
      }
    }
  }
});

const generateServiceYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: config.name
  },
  spec: {
    selector: config.selector || { app: 'my-app' },
    ports: [
      {
        port: config.port || 80,
        targetPort: config.targetPort || 80,
        protocol: 'TCP'
      }
    ],
    type: config.type || 'ClusterIP'
  }
});

const generateIngressYaml = (config: any) => ({
  apiVersion: 'networking.k8s.io/v1',
  kind: 'Ingress',
  metadata: {
    name: config.name,
    annotations: {
      'nginx.ingress.kubernetes.io/rewrite-target': '/'
    }
  },
  spec: {
    rules: [
      {
        host: config.host || 'example.com',
        http: {
          paths: [
            {
              path: config.path || '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: config.serviceName || 'my-service',
                  port: {
                    number: config.servicePort || 80
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }
});

const generateNetworkPolicyYaml = (config: any) => ({
  apiVersion: 'networking.k8s.io/v1',
  kind: 'NetworkPolicy',
  metadata: {
    name: config.name
  },
  spec: {
    podSelector: {
      matchLabels: config.selector || { app: 'my-app' }
    },
    policyTypes: ['Ingress', 'Egress'],
    ingress: [
      {
        from: [
          {
            podSelector: {
              matchLabels: { role: 'frontend' }
            }
          }
        ],
        ports: [
          {
            protocol: 'TCP',
            port: 80
          }
        ]
      }
    ]
  }
});

const generateConfigMapYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: config.name
  },
  data: config.data || {
    'app.conf': 'debug=true\nport=8080',
    'database.url': 'postgresql://localhost:5432/mydb'
  }
});

const generateSecretYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    name: config.name
  },
  type: config.type || 'Opaque',
  data: config.data || {
    username: 'YWRtaW4=',
    password: 'MWYyZDFlMmU2N2Rm'
  }
});

const generateServiceAccountYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'ServiceAccount',
  metadata: {
    name: config.name,
    namespace: config.namespace || 'default'
  }
});

const generatePVCYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    name: config.name
  },
  spec: {
    accessModes: [config.accessMode || 'ReadWriteOnce'],
    resources: {
      requests: {
        storage: config.size || '10Gi'
      }
    },
    storageClassName: config.storageClass || 'standard'
  }
});

const generatePVYaml = (config: any) => ({
  apiVersion: 'v1',
  kind: 'PersistentVolume',
  metadata: {
    name: config.name
  },
  spec: {
    capacity: {
      storage: config.size || '10Gi'
    },
    accessModes: [config.accessMode || 'ReadWriteOnce'],
    persistentVolumeReclaimPolicy: 'Retain',
    storageClassName: config.storageClass || 'standard',
    hostPath: {
      path: '/mnt/data'
    }
  }
});

const generateStorageClassYaml = (config: any) => ({
  apiVersion: 'storage.k8s.io/v1',
  kind: 'StorageClass',
  metadata: {
    name: config.name
  },
  provisioner: config.provisioner || 'kubernetes.io/aws-ebs',
  parameters: {
    type: 'gp2',
    fsType: 'ext4'
  }
});

const generateRoleYaml = (config: any) => ({
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'Role',
  metadata: {
    name: config.name,
    namespace: config.namespace || 'default'
  },
  rules: [
    {
      apiGroups: [''],
      resources: ['pods'],
      verbs: ['get', 'list', 'watch']
    }
  ]
});

const generateClusterRoleYaml = (config: any) => ({
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'ClusterRole',
  metadata: {
    name: config.name
  },
  rules: [
    {
      apiGroups: [''],
      resources: ['nodes'],
      verbs: ['get', 'list', 'watch']
    }
  ]
});

const generateRoleBindingYaml = (config: any) => ({
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'RoleBinding',
  metadata: {
    name: config.name,
    namespace: config.namespace || 'default'
  },
  subjects: [
    {
      kind: 'ServiceAccount',
      name: config.serviceAccount || 'default',
      namespace: config.namespace || 'default'
    }
  ],
  roleRef: {
    kind: 'Role',
    name: config.roleName || 'my-role',
    apiGroup: 'rbac.authorization.k8s.io'
  }
});

const generateClusterRoleBindingYaml = (config: any) => ({
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'ClusterRoleBinding',
  metadata: {
    name: config.name
  },
  subjects: [
    {
      kind: 'ServiceAccount',
      name: config.serviceAccount || 'default',
      namespace: config.namespace || 'default'
    }
  ],
  roleRef: {
    kind: 'ClusterRole',
    name: config.roleName || 'my-cluster-role',
    apiGroup: 'rbac.authorization.k8s.io'
  }
});

const generateHPAYaml = (config: any) => ({
  apiVersion: 'autoscaling/v2',
  kind: 'HorizontalPodAutoscaler',
  metadata: {
    name: config.name
  },
  spec: {
    scaleTargetRef: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: config.targetDeployment || 'my-deployment'
    },
    minReplicas: config.minReplicas || 1,
    maxReplicas: config.maxReplicas || 10,
    metrics: [
      {
        type: 'Resource',
        resource: {
          name: 'cpu',
          target: {
            type: 'Utilization',
            averageUtilization: config.cpuThreshold || 80
          }
        }
      }
    ]
  }
});

const generateVPAYaml = (config: any) => ({
  apiVersion: 'autoscaling.k8s.io/v1',
  kind: 'VerticalPodAutoscaler',
  metadata: {
    name: config.name
  },
  spec: {
    targetRef: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: config.targetDeployment || 'my-deployment'
    },
    updatePolicy: {
      updateMode: config.updateMode || 'Auto'
    }
  }
});