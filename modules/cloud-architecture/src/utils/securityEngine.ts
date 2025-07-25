// Security Analysis Engine for Cloud Architecture

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'access' | 'encryption' | 'compliance' | 'monitoring';
  check: (components: ArchitectureComponent[]) => SecurityViolation[];
}

export interface SecurityViolation {
  ruleId: string;
  componentId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  references?: string[];
}

export interface ArchitectureComponent {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  connections: string[];
}

export interface SecurityReport {
  overallScore: number;
  violations: SecurityViolation[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
}

export class SecurityEngine {
  private static instance: SecurityEngine;
  private rules: SecurityRule[] = [];

  private constructor() {
    this.initializeRules();
  }

  public static getInstance(): SecurityEngine {
    if (!SecurityEngine.instance) {
      SecurityEngine.instance = new SecurityEngine();
    }
    return SecurityEngine.instance;
  }

  private initializeRules(): void {
    this.rules = [
      {
        id: 'public-s3-bucket',
        name: 'Public S3 Bucket',
        description: 'S3 buckets should not be publicly accessible unless explicitly required',
        severity: 'high',
        category: 'access',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 's3').forEach(bucket => {
            if (bucket.properties.publicRead || bucket.properties.publicWrite) {
              violations.push({
                ruleId: 'public-s3-bucket',
                componentId: bucket.id,
                message: `S3 bucket "${bucket.name}" is configured for public access`,
                severity: 'high',
                recommendation: 'Restrict bucket access to specific IAM roles or users. Use bucket policies and ACLs to control access.',
                references: ['https://docs.aws.amazon.com/s3/latest/userguide/access-control-best-practices.html']
              });
            }
          });
          
          return violations;
        }
      },
      {
        id: 'unencrypted-rds',
        name: 'Unencrypted RDS Instance',
        description: 'RDS instances should have encryption at rest enabled',
        severity: 'high',
        category: 'encryption',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 'rds').forEach(db => {
            if (!db.properties.encrypted) {
              violations.push({
                ruleId: 'unencrypted-rds',
                componentId: db.id,
                message: `RDS instance "${db.name}" does not have encryption enabled`,
                severity: 'high',
                recommendation: 'Enable encryption at rest for RDS instances to protect sensitive data.',
                references: ['https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html']
              });
            }
          });
          
          return violations;
        }
      },
      {
        id: 'ec2-public-ip',
        name: 'EC2 Instance with Public IP',
        description: 'EC2 instances should not have public IP addresses unless required',
        severity: 'medium',
        category: 'network',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 'ec2').forEach(instance => {
            if (instance.properties.publicIp || instance.properties.associatePublicIpAddress) {
              violations.push({
                ruleId: 'ec2-public-ip',
                componentId: instance.id,
                message: `EC2 instance "${instance.name}" has a public IP address`,
                severity: 'medium',
                recommendation: 'Place EC2 instances in private subnets and use NAT Gateway or ALB for internet access.',
                references: ['https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html']
              });
            }
          });
          
          return violations;
        }
      },
      {
        id: 'missing-security-groups',
        name: 'Missing Security Groups',
        description: 'All EC2 instances should have security groups configured',
        severity: 'high',
        category: 'network',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 'ec2').forEach(instance => {
            if (!instance.properties.securityGroups || instance.properties.securityGroups.length === 0) {
              violations.push({
                ruleId: 'missing-security-groups',
                componentId: instance.id,
                message: `EC2 instance "${instance.name}" does not have security groups configured`,
                severity: 'high',
                recommendation: 'Configure security groups to control inbound and outbound traffic to EC2 instances.',
                references: ['https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html']
              });
            }
          });
          
          return violations;
        }
      },
      {
        id: 'overly-permissive-sg',
        name: 'Overly Permissive Security Group',
        description: 'Security groups should not allow unrestricted access (0.0.0.0/0)',
        severity: 'critical',
        category: 'network',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 'securitygroup').forEach(sg => {
            const rules = sg.properties.inboundRules || [];
            rules.forEach((rule: any, index: number) => {
              if (rule.source === '0.0.0.0/0' && rule.port !== 80 && rule.port !== 443) {
                violations.push({
                  ruleId: 'overly-permissive-sg',
                  componentId: sg.id,
                  message: `Security group "${sg.name}" allows unrestricted access on port ${rule.port}`,
                  severity: 'critical',
                  recommendation: 'Restrict security group rules to specific IP ranges or security groups.',
                  references: ['https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html']
                });
              }
            });
          });
          
          return violations;
        }
      },
      {
        id: 'missing-cloudtrail',
        name: 'Missing CloudTrail',
        description: 'CloudTrail should be enabled for audit logging',
        severity: 'medium',
        category: 'monitoring',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          const hasCloudTrail = components.some(c => c.type.toLowerCase() === 'cloudtrail');
          
          if (!hasCloudTrail) {
            violations.push({
              ruleId: 'missing-cloudtrail',
              componentId: 'architecture',
              message: 'CloudTrail is not configured for this architecture',
              severity: 'medium',
              recommendation: 'Enable CloudTrail to log API calls and provide audit trail for compliance.',
              references: ['https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html']
            });
          }
          
          return violations;
        }
      },
      {
        id: 'missing-waf',
        name: 'Missing WAF Protection',
        description: 'Web applications should be protected by AWS WAF',
        severity: 'medium',
        category: 'network',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          const hasALB = components.some(c => c.type.toLowerCase() === 'alb' || c.type.toLowerCase() === 'applicationloadbalancer');
          const hasWAF = components.some(c => c.type.toLowerCase() === 'waf');
          
          if (hasALB && !hasWAF) {
            violations.push({
              ruleId: 'missing-waf',
              componentId: 'architecture',
              message: 'Application Load Balancer is not protected by AWS WAF',
              severity: 'medium',
              recommendation: 'Configure AWS WAF to protect against common web exploits and attacks.',
              references: ['https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html']
            });
          }
          
          return violations;
        }
      },
      {
        id: 'unencrypted-ebs',
        name: 'Unencrypted EBS Volumes',
        description: 'EBS volumes should be encrypted',
        severity: 'high',
        category: 'encryption',
        check: (components) => {
          const violations: SecurityViolation[] = [];
          
          components.filter(c => c.type.toLowerCase() === 'ebs' || c.type.toLowerCase() === 'ec2').forEach(component => {
            const volumes = component.properties.volumes || [];
            volumes.forEach((volume: any, index: number) => {
              if (!volume.encrypted) {
                violations.push({
                  ruleId: 'unencrypted-ebs',
                  componentId: component.id,
                  message: `EBS volume in "${component.name}" is not encrypted`,
                  severity: 'high',
                  recommendation: 'Enable EBS encryption to protect data at rest.',
                  references: ['https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html']
                });
              }
            });
          });
          
          return violations;
        }
      }
    ];
  }

  public analyzeArchitecture(components: ArchitectureComponent[]): SecurityReport {
    const violations: SecurityViolation[] = [];
    
    // Run all security rules
    for (const rule of this.rules) {
      const ruleViolations = rule.check(components);
      violations.push(...ruleViolations);
    }
    
    // Calculate summary
    const summary = {
      critical: violations.filter(v => v.severity === 'critical').length,
      high: violations.filter(v => v.severity === 'high').length,
      medium: violations.filter(v => v.severity === 'medium').length,
      low: violations.filter(v => v.severity === 'low').length
    };
    
    // Calculate overall score (0-100)
    const totalViolations = summary.critical + summary.high + summary.medium + summary.low;
    const weightedScore = (summary.critical * 4) + (summary.high * 3) + (summary.medium * 2) + (summary.low * 1);
    const maxPossibleScore = this.rules.length * 4;
    const overallScore = Math.max(0, Math.round(((maxPossibleScore - weightedScore) / maxPossibleScore) * 100));
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(violations);
    
    return {
      overallScore,
      violations,
      summary,
      recommendations
    };
  }

  private generateRecommendations(violations: SecurityViolation[]): string[] {
    const recommendations: string[] = [];
    
    if (violations.some(v => v.severity === 'critical')) {
      recommendations.push('Address critical security issues immediately to prevent potential breaches.');
    }
    
    if (violations.some(v => v.ruleId === 'public-s3-bucket')) {
      recommendations.push('Review and restrict S3 bucket permissions to prevent data exposure.');
    }
    
    if (violations.some(v => v.category === 'encryption')) {
      recommendations.push('Enable encryption for all data storage services to protect sensitive information.');
    }
    
    if (violations.some(v => v.category === 'network')) {
      recommendations.push('Implement network segmentation and proper security group configurations.');
    }
    
    if (violations.some(v => v.category === 'monitoring')) {
      recommendations.push('Enable comprehensive logging and monitoring for security visibility.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your architecture follows security best practices. Continue monitoring for new threats.');
    }
    
    return recommendations;
  }

  public getRuleById(ruleId: string): SecurityRule | undefined {
    return this.rules.find(rule => rule.id === ruleId);
  }

  public getAllRules(): SecurityRule[] {
    return [...this.rules];
  }

  public addCustomRule(rule: SecurityRule): void {
    this.rules.push(rule);
  }
}

export default SecurityEngine;
