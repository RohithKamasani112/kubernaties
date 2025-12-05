export interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'access-control' | 'encryption' | 'network' | 'monitoring' | 'configuration';
  title: string;
  description: string;
  recommendation: string;
  owaspCategory?: string;
  cweId?: string;
  resources: string[];
}

export interface BestPractice {
  id: string;
  category: 'performance' | 'cost' | 'reliability' | 'security' | 'operational';
  title: string;
  description: string;
  implementation: string;
  impact: 'high' | 'medium' | 'low';
  resources: string[];
}

export interface SecurityValidationResult {
  score: number;
  issues: SecurityIssue[];
  bestPractices: BestPractice[];
  owaspCompliance: {
    category: string;
    compliant: boolean;
    issues: string[];
  }[];
}

// OWASP Cloud Top 10 categories
export const OWASP_CLOUD_TOP_10 = [
  'Insufficient Identity, Credential, Access and Key Management',
  'Insecure Interfaces and APIs',
  'Misconfiguration and Inadequate Change Control',
  'Lack of Cloud Security Architecture and Strategy',
  'Insufficient Identity, Credential, Access and Key Management',
  'Account Hijacking',
  'Malicious Insiders',
  'Advanced Persistent Threats (APTs)',
  'Data Loss',
  'Insufficient Due Diligence'
];

export class SecurityEngine {
  private static instance: SecurityEngine;

  public static getInstance(): SecurityEngine {
    if (!SecurityEngine.instance) {
      SecurityEngine.instance = new SecurityEngine();
    }
    return SecurityEngine.instance;
  }

  public validateInfrastructureCode(code: string, resourceType: string, provider: string): SecurityValidationResult {
    const issues: SecurityIssue[] = [];
    const bestPractices: BestPractice[] = [];
    let score = 100;

    // AWS-specific security checks
    if (provider === 'aws') {
      issues.push(...this.validateAWSResources(code, resourceType));
      bestPractices.push(...this.getAWSBestPractices(code, resourceType));
    }

    // Azure-specific security checks
    if (provider === 'azure') {
      issues.push(...this.validateAzureResources(code, resourceType));
      bestPractices.push(...this.getAzureBestPractices(code, resourceType));
    }

    // GCP-specific security checks
    if (provider === 'gcp') {
      issues.push(...this.validateGCPResources(code, resourceType));
      bestPractices.push(...this.getGCPBestPractices(code, resourceType));
    }

    // Calculate security score
    score = this.calculateSecurityScore(issues);

    // OWASP compliance check
    const owaspCompliance = this.checkOwaspCompliance(issues);

    return {
      score,
      issues,
      bestPractices,
      owaspCompliance
    };
  }

  private validateAWSResources(code: string, resourceType: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    switch (resourceType) {
      case 's3':
        issues.push(...this.validateS3Security(code));
        break;
      case 'ec2':
        issues.push(...this.validateEC2Security(code));
        break;
      case 'rds':
        issues.push(...this.validateRDSSecurity(code));
        break;
      case 'vpc':
        issues.push(...this.validateVPCSecurity(code));
        break;
      case 'iam':
        issues.push(...this.validateIAMSecurity(code));
        break;
    }

    return issues;
  }

  private validateS3Security(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for public read access
    if (code.includes('public-read') || code.includes('public-read-write')) {
      issues.push({
        id: 's3-public-access',
        severity: 'critical',
        category: 'access-control',
        title: 'S3 Bucket Public Access',
        description: 'S3 bucket is configured with public read or write access',
        recommendation: 'Remove public access and use CloudFront or signed URLs for public content',
        owaspCategory: 'Misconfiguration and Inadequate Change Control',
        cweId: 'CWE-732',
        resources: ['aws_s3_bucket', 'aws_s3_bucket_acl']
      });
    }

    // Check for encryption
    if (!code.includes('server_side_encryption') && !code.includes('encryption')) {
      issues.push({
        id: 's3-no-encryption',
        severity: 'high',
        category: 'encryption',
        title: 'S3 Bucket Not Encrypted',
        description: 'S3 bucket does not have server-side encryption enabled',
        recommendation: 'Enable server-side encryption with AES-256 or KMS',
        owaspCategory: 'Data Loss',
        cweId: 'CWE-311',
        resources: ['aws_s3_bucket_server_side_encryption_configuration']
      });
    }

    // Check for versioning
    if (!code.includes('versioning') || code.includes('versioning.*false')) {
      issues.push({
        id: 's3-no-versioning',
        severity: 'medium',
        category: 'configuration',
        title: 'S3 Versioning Disabled',
        description: 'S3 bucket versioning is not enabled',
        recommendation: 'Enable versioning to protect against accidental deletions',
        resources: ['aws_s3_bucket_versioning']
      });
    }

    // Check for logging
    if (!code.includes('logging') && !code.includes('access_log')) {
      issues.push({
        id: 's3-no-logging',
        severity: 'medium',
        category: 'monitoring',
        title: 'S3 Access Logging Disabled',
        description: 'S3 bucket access logging is not configured',
        recommendation: 'Enable access logging for audit and monitoring purposes',
        resources: ['aws_s3_bucket_logging']
      });
    }

    return issues;
  }

  private validateEC2Security(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for SSH access from anywhere
    if (code.includes('0.0.0.0/0') && code.includes('22')) {
      issues.push({
        id: 'ec2-ssh-open',
        severity: 'critical',
        category: 'network',
        title: 'SSH Open to Internet',
        description: 'EC2 security group allows SSH access from anywhere (0.0.0.0/0)',
        recommendation: 'Restrict SSH access to specific IP ranges or use bastion hosts',
        owaspCategory: 'Insecure Interfaces and APIs',
        cweId: 'CWE-284',
        resources: ['aws_security_group', 'aws_security_group_rule']
      });
    }

    // Check for IMDSv2
    if (!code.includes('metadata_options') || !code.includes('http_tokens.*required')) {
      issues.push({
        id: 'ec2-imdsv1',
        severity: 'medium',
        category: 'configuration',
        title: 'IMDSv1 Enabled',
        description: 'EC2 instance allows IMDSv1 which is less secure',
        recommendation: 'Enforce IMDSv2 by setting http_tokens to required',
        owaspCategory: 'Insufficient Identity, Credential, Access and Key Management',
        resources: ['aws_instance']
      });
    }

    return issues;
  }

  private validateRDSSecurity(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for encryption
    if (!code.includes('encrypted.*true') && !code.includes('storage_encrypted.*true')) {
      issues.push({
        id: 'rds-no-encryption',
        severity: 'high',
        category: 'encryption',
        title: 'RDS Not Encrypted',
        description: 'RDS instance does not have encryption at rest enabled',
        recommendation: 'Enable encryption at rest for the RDS instance',
        owaspCategory: 'Data Loss',
        cweId: 'CWE-311',
        resources: ['aws_db_instance']
      });
    }

    // Check for public access
    if (code.includes('publicly_accessible.*true')) {
      issues.push({
        id: 'rds-public-access',
        severity: 'critical',
        category: 'network',
        title: 'RDS Publicly Accessible',
        description: 'RDS instance is configured to be publicly accessible',
        recommendation: 'Set publicly_accessible to false and use VPC for access',
        owaspCategory: 'Misconfiguration and Inadequate Change Control',
        resources: ['aws_db_instance']
      });
    }

    return issues;
  }

  private validateVPCSecurity(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for flow logs
    if (!code.includes('aws_flow_log') && !code.includes('flow_log')) {
      issues.push({
        id: 'vpc-no-flow-logs',
        severity: 'medium',
        category: 'monitoring',
        title: 'VPC Flow Logs Disabled',
        description: 'VPC does not have flow logs enabled',
        recommendation: 'Enable VPC flow logs for network monitoring and security analysis',
        owaspCategory: 'Insufficient Due Diligence',
        resources: ['aws_flow_log']
      });
    }

    return issues;
  }

  private validateIAMSecurity(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for wildcard permissions
    if (code.includes('"*"') && code.includes('Action')) {
      issues.push({
        id: 'iam-wildcard-permissions',
        severity: 'high',
        category: 'access-control',
        title: 'IAM Wildcard Permissions',
        description: 'IAM policy uses wildcard (*) permissions',
        recommendation: 'Use specific permissions following the principle of least privilege',
        owaspCategory: 'Insufficient Identity, Credential, Access and Key Management',
        cweId: 'CWE-269',
        resources: ['aws_iam_policy', 'aws_iam_role_policy']
      });
    }

    return issues;
  }

  private validateAzureResources(code: string, resourceType: string): SecurityIssue[] {
    // Azure-specific validation logic
    return [];
  }

  private validateGCPResources(code: string, resourceType: string): SecurityIssue[] {
    // GCP-specific validation logic
    return [];
  }

  private getAWSBestPractices(code: string, resourceType: string): BestPractice[] {
    const practices: BestPractice[] = [];

    switch (resourceType) {
      case 's3':
        practices.push({
          id: 's3-lifecycle-policy',
          category: 'cost',
          title: 'Configure S3 Lifecycle Policies',
          description: 'Automatically transition objects to cheaper storage classes',
          implementation: 'Add lifecycle configuration to move old objects to IA or Glacier',
          impact: 'high',
          resources: ['aws_s3_bucket_lifecycle_configuration']
        });
        break;
      case 'ec2':
        practices.push({
          id: 'ec2-monitoring',
          category: 'operational',
          title: 'Enable Detailed Monitoring',
          description: 'Enable detailed CloudWatch monitoring for better observability',
          implementation: 'Set monitoring = true in EC2 instance configuration',
          impact: 'medium',
          resources: ['aws_instance']
        });
        break;
    }

    return practices;
  }

  private getAzureBestPractices(code: string, resourceType: string): BestPractice[] {
    return [];
  }

  private getGCPBestPractices(code: string, resourceType: string): BestPractice[] {
    return [];
  }

  private calculateSecurityScore(issues: SecurityIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  private checkOwaspCompliance(issues: SecurityIssue[]): Array<{ category: string; compliant: boolean; issues: string[] }> {
    return OWASP_CLOUD_TOP_10.map(category => {
      const categoryIssues = issues.filter(issue => issue.owaspCategory === category);
      return {
        category,
        compliant: categoryIssues.length === 0,
        issues: categoryIssues.map(issue => issue.title)
      };
    });
  }
}
