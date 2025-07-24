import { LearningStep } from '../components/arch-learning/InteractiveLearningPath';

export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  provider: 'aws' | 'azure' | 'gcp' | 'kubernetes' | 'multi-cloud';
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'web-hosting' | 'serverless' | 'containers' | 'data' | 'ml-ai' | 'security' | 'devops' | 'iot' | 'enterprise';
  estimatedTime: string;
  prerequisites: string[];
  learningObjectives: string[];
  steps: LearningStep[];
  finalArchitecture: {
    description: string;
    components: string[];
    connections: Array<{ from: string; to: string; type: string }>;
  };
  achievements: string[];
  nextScenarios: string[];
}

export const learningScenarios: LearningScenario[] = [
  {
    id: 'aws-static-website-complete',
    title: 'Complete Static Website on AWS',
    description: 'Build a production-ready static website with global CDN, custom domain, and SSL certificate',
    provider: 'aws',
    level: 'beginner',
    category: 'web-hosting',
    estimatedTime: '45 minutes',
    prerequisites: ['Basic HTML/CSS knowledge', 'AWS account'],
    learningObjectives: [
      'Understand S3 static website hosting',
      'Configure CloudFront CDN',
      'Set up custom domain with Route 53',
      'Implement SSL/TLS certificates',
      'Apply security best practices'
    ],
    steps: [
      {
        id: 'create-s3-bucket',
        title: 'Create S3 Bucket for Website Hosting',
        concept: 'Amazon S3 can host static websites by serving HTML, CSS, JavaScript, and other static assets directly from a bucket. This is cost-effective and highly scalable.',
        problem: 'You need to host a static website that can handle traffic spikes and serve content globally with low latency.',
        task: 'Create an S3 bucket configured for static website hosting with proper public access settings.',
        codeTemplate: `resource "aws_s3_bucket" "website" {
  bucket = "___FILL_IN___"
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "___FILL_IN___"
  }

  error_document {
    key = "___FILL_IN___"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = ___FILL_IN___
  block_public_policy     = ___FILL_IN___
  ignore_public_acls      = ___FILL_IN___
  restrict_public_buckets = ___FILL_IN___
}`,
        expectedCode: 'my-awesome-website-bucket-12345',
        resourceType: 's3',
        language: 'terraform',
        validation: (code: string) => {
          const hasValidBucketName = code.includes('"') && !code.includes('___FILL_IN___') && code.includes('my-');
          const hasIndexDocument = code.includes('index.html');
          const hasErrorDocument = code.includes('error.html') || code.includes('404.html');
          const hasPublicAccess = code.includes('false');
          
          const securityIssues = [];
          const bestPractices = [];
          
          if (!hasValidBucketName) {
            return { isValid: false, message: 'Please provide a unique bucket name (e.g., "my-awesome-website-bucket-12345")' };
          }
          if (!hasIndexDocument) {
            return { isValid: false, message: 'Please specify "index.html" as the index document' };
          }
          if (!hasErrorDocument) {
            securityIssues.push('Missing error document configuration');
          }
          if (!hasPublicAccess) {
            securityIssues.push('Public access settings not configured properly');
          }
          
          bestPractices.push('Consider enabling versioning for your S3 bucket');
          bestPractices.push('Add bucket encryption for enhanced security');
          bestPractices.push('Configure lifecycle policies for cost optimization');
          
          return { 
            isValid: true, 
            message: 'Excellent! S3 bucket configured correctly for static hosting.',
            securityIssues: securityIssues.length > 0 ? securityIssues : undefined,
            bestPractices 
          };
        },
        hints: [
          'Bucket names must be globally unique across all AWS accounts',
          'Use lowercase letters, numbers, and hyphens only',
          'The index document is typically "index.html"',
          'Set public access block to false for website hosting'
        ],
        securityTips: [
          'Enable bucket versioning to protect against accidental deletions',
          'Configure bucket encryption at rest',
          'Use CloudFront instead of direct S3 access for better security',
          'Implement proper IAM policies for bucket access'
        ],
        bestPractices: [
          'Use descriptive, meaningful bucket names with random suffix',
          'Enable CloudTrail logging for audit trails',
          'Configure lifecycle policies for cost optimization',
          'Use CloudFront for global content delivery'
        ]
      },
      {
        id: 'configure-cloudfront',
        title: 'Set Up CloudFront CDN',
        concept: 'CloudFront is AWS\'s Content Delivery Network (CDN) that caches content at edge locations worldwide, reducing latency and improving user experience.',
        problem: 'Your static website needs to load quickly for users around the world and handle traffic spikes efficiently.',
        task: 'Create a CloudFront distribution that serves your S3 website content with caching and compression.',
        codeTemplate: `resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.website.website_endpoint
    origin_id   = "___FILL_IN___"

    custom_origin_config {
      http_port              = ___FILL_IN___
      https_port             = ___FILL_IN___
      origin_protocol_policy = "___FILL_IN___"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = ___FILL_IN___
  default_root_object = "___FILL_IN___"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "___FILL_IN___"
    compress               = ___FILL_IN___
    viewer_protocol_policy = "___FILL_IN___"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = ___FILL_IN___
  }
}`,
        expectedCode: 'S3-Website-Origin',
        resourceType: 'cloudfront',
        language: 'terraform',
        validation: (code: string) => {
          const hasOriginId = code.includes('S3-Website-Origin') || code.includes('website-origin');
          const hasHttpPort = code.includes('80');
          const hasHttpsPort = code.includes('443');
          const hasProtocolPolicy = code.includes('http-only') || code.includes('https-only');
          const hasEnabled = code.includes('true');
          const hasRootObject = code.includes('index.html');
          const hasCompress = code.includes('true');
          const hasViewerPolicy = code.includes('redirect-to-https') || code.includes('https-only');
          
          const securityIssues = [];
          const bestPractices = [];
          
          if (!hasOriginId) {
            return { isValid: false, message: 'Please provide an origin ID (e.g., "S3-Website-Origin")' };
          }
          if (!hasEnabled) {
            return { isValid: false, message: 'Please enable the CloudFront distribution (enabled = true)' };
          }
          if (!hasViewerPolicy || code.includes('allow-all')) {
            securityIssues.push('Consider using "redirect-to-https" for better security');
          }
          if (!hasCompress) {
            bestPractices.push('Enable compression to reduce bandwidth and improve performance');
          }
          
          bestPractices.push('Configure custom error pages for better user experience');
          bestPractices.push('Set up CloudWatch monitoring for the distribution');
          bestPractices.push('Consider using AWS WAF for additional security');
          
          return { 
            isValid: true, 
            message: 'Great! CloudFront distribution configured successfully.',
            securityIssues: securityIssues.length > 0 ? securityIssues : undefined,
            bestPractices 
          };
        },
        hints: [
          'Origin ID can be any descriptive name like "S3-Website-Origin"',
          'HTTP port is typically 80, HTTPS port is 443',
          'Use "http-only" for S3 website endpoints',
          'Enable compression for better performance'
        ],
        securityTips: [
          'Use "redirect-to-https" to enforce HTTPS',
          'Configure Origin Access Identity for direct S3 access',
          'Set up AWS WAF for additional protection',
          'Enable CloudTrail logging for the distribution'
        ],
        bestPractices: [
          'Enable compression to reduce bandwidth costs',
          'Configure appropriate cache behaviors',
          'Set up custom error pages',
          'Use CloudWatch for monitoring and alerting'
        ]
      },
      {
        id: 'setup-route53',
        title: 'Configure Custom Domain with Route 53',
        concept: 'Route 53 is AWS\'s DNS service that can route traffic to your CloudFront distribution using a custom domain name.',
        problem: 'Users should access your website using a memorable custom domain instead of the CloudFront distribution URL.',
        task: 'Create a Route 53 hosted zone and configure DNS records to point your domain to CloudFront.',
        codeTemplate: `resource "aws_route53_zone" "website" {
  name = "___FILL_IN___"
}

resource "aws_route53_record" "website" {
  zone_id = aws_route53_zone.website.zone_id
  name    = "___FILL_IN___"
  type    = "___FILL_IN___"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = ___FILL_IN___
  }
}

resource "aws_route53_record" "website_www" {
  zone_id = aws_route53_zone.website.zone_id
  name    = "___FILL_IN___"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}`,
        expectedCode: 'example.com',
        resourceType: 'route53',
        language: 'terraform',
        validation: (code: string) => {
          const hasDomainName = code.includes('.com') || code.includes('.org') || code.includes('.net');
          const hasARecord = code.includes('"A"');
          const hasWwwRecord = code.includes('www.');
          const hasEvaluateHealth = code.includes('false');
          
          const securityIssues = [];
          const bestPractices = [];
          
          if (!hasDomainName) {
            return { isValid: false, message: 'Please provide a valid domain name (e.g., "example.com")' };
          }
          if (!hasARecord) {
            return { isValid: false, message: 'Please specify "A" as the record type' };
          }
          
          bestPractices.push('Consider setting up health checks for high availability');
          bestPractices.push('Configure TTL values appropriately');
          bestPractices.push('Set up monitoring for DNS queries');
          
          return { 
            isValid: true, 
            message: 'Perfect! Route 53 DNS configuration completed.',
            bestPractices 
          };
        },
        hints: [
          'Use your actual domain name (e.g., "example.com")',
          'A records are used for IPv4 addresses',
          'Include both apex domain and www subdomain',
          'Set evaluate_target_health to false for CloudFront'
        ],
        securityTips: [
          'Enable DNSSEC for additional security',
          'Monitor DNS queries for suspicious activity',
          'Use Route 53 Resolver DNS Firewall',
          'Configure proper TTL values'
        ],
        bestPractices: [
          'Set up health checks for critical endpoints',
          'Use geolocation routing for global applications',
          'Configure CloudWatch alarms for DNS failures',
          'Document your DNS configuration'
        ]
      }
    ],
    finalArchitecture: {
      description: 'A complete static website hosting solution with global CDN, custom domain, and SSL',
      components: ['S3 Bucket', 'CloudFront Distribution', 'Route 53 Hosted Zone', 'SSL Certificate'],
      connections: [
        { from: 'Route 53', to: 'CloudFront', type: 'DNS' },
        { from: 'CloudFront', to: 'S3 Bucket', type: 'Origin' },
        { from: 'User', to: 'Route 53', type: 'DNS Query' },
        { from: 'User', to: 'CloudFront', type: 'HTTPS Request' }
      ]
    },
    achievements: [
      'Static Website Master',
      'CDN Configuration Expert',
      'DNS Management Pro',
      'Security Best Practices'
    ],
    nextScenarios: [
      'aws-serverless-api',
      'aws-dynamic-website',
      'aws-multi-region-website'
    ]
  }
];

export const getScenarioById = (id: string): LearningScenario | undefined => {
  return learningScenarios.find(scenario => scenario.id === id);
};

export const getScenariosByProvider = (provider: string): LearningScenario[] => {
  return learningScenarios.filter(scenario => scenario.provider === provider);
};

export const getScenariosByLevel = (level: string): LearningScenario[] => {
  return learningScenarios.filter(scenario => scenario.level === level);
};

export const getScenariosByCategory = (category: string): LearningScenario[] => {
  return learningScenarios.filter(scenario => scenario.category === category);
};
