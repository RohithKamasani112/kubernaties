// Export System for Cloud Architecture Diagrams

export interface ExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'json' | 'terraform' | 'cloudformation';
  quality?: 'low' | 'medium' | 'high';
  includeMetadata?: boolean;
  includeComments?: boolean;
}

export interface ArchitectureComponent {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

export interface ArchitectureDiagram {
  id: string;
  name: string;
  description: string;
  components: ArchitectureComponent[];
  metadata: {
    created: string;
    modified: string;
    author: string;
    version: string;
  };
}

export class ExportSystem {
  private static instance: ExportSystem;

  private constructor() {}

  public static getInstance(): ExportSystem {
    if (!ExportSystem.instance) {
      ExportSystem.instance = new ExportSystem();
    }
    return ExportSystem.instance;
  }

  public async exportDiagram(
    diagram: ArchitectureDiagram,
    options: ExportOptions
  ): Promise<Blob | string> {
    switch (options.format) {
      case 'json':
        return this.exportToJSON(diagram, options);
      case 'terraform':
        return this.exportToTerraform(diagram, options);
      case 'cloudformation':
        return this.exportToCloudFormation(diagram, options);
      case 'pdf':
        return this.exportToPDF(diagram, options);
      case 'png':
        return this.exportToPNG(diagram, options);
      case 'svg':
        return this.exportToSVG(diagram, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private exportToJSON(diagram: ArchitectureDiagram, options: ExportOptions): string {
    const exportData = {
      ...diagram,
      exportOptions: options,
      exportedAt: new Date().toISOString()
    };

    if (!options.includeMetadata) {
      delete exportData.metadata;
    }

    return JSON.stringify(exportData, null, 2);
  }

  private exportToTerraform(diagram: ArchitectureDiagram, options: ExportOptions): string {
    let terraform = `# Generated Terraform configuration for ${diagram.name}\n`;
    terraform += `# Created: ${new Date().toISOString()}\n\n`;

    // Provider configuration
    terraform += `terraform {\n`;
    terraform += `  required_providers {\n`;
    terraform += `    aws = {\n`;
    terraform += `      source  = "hashicorp/aws"\n`;
    terraform += `      version = "~> 5.0"\n`;
    terraform += `    }\n`;
    terraform += `  }\n`;
    terraform += `}\n\n`;

    terraform += `provider "aws" {\n`;
    terraform += `  region = var.aws_region\n`;
    terraform += `}\n\n`;

    // Variables
    terraform += `variable "aws_region" {\n`;
    terraform += `  description = "AWS region"\n`;
    terraform += `  type        = string\n`;
    terraform += `  default     = "us-west-2"\n`;
    terraform += `}\n\n`;

    // Convert components to Terraform resources
    for (const component of diagram.components) {
      terraform += this.componentToTerraform(component);
      terraform += '\n';
    }

    return terraform;
  }

  private componentToTerraform(component: ArchitectureComponent): string {
    const resourceName = component.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    switch (component.type.toLowerCase()) {
      case 'ec2':
        return `resource "aws_instance" "${resourceName}" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "${component.properties.instanceType || 't3.micro'}"
  
  tags = {
    Name = "${component.name}"
  }
}`;

      case 'rds':
        return `resource "aws_db_instance" "${resourceName}" {
  identifier = "${resourceName}"
  engine     = "${component.properties.engine || 'mysql'}"
  engine_version = "${component.properties.version || '8.0'}"
  instance_class = "${component.properties.instanceClass || 'db.t3.micro'}"
  allocated_storage = ${component.properties.storage || 20}
  
  db_name  = "${component.properties.dbName || 'mydb'}"
  username = "${component.properties.username || 'admin'}"
  password = "${component.properties.password || 'changeme'}"
  
  skip_final_snapshot = true
  
  tags = {
    Name = "${component.name}"
  }
}`;

      case 's3':
        return `resource "aws_s3_bucket" "${resourceName}" {
  bucket = "${resourceName}-\${random_string.bucket_suffix.result}"
  
  tags = {
    Name = "${component.name}"
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}`;

      case 'alb':
      case 'load_balancer':
        return `resource "aws_lb" "${resourceName}" {
  name               = "${resourceName}"
  internal           = ${component.properties.internal || false}
  load_balancer_type = "${component.properties.type || 'application'}"
  
  tags = {
    Name = "${component.name}"
  }
}`;

      default:
        return `# ${component.type} resource not yet supported in Terraform export
# Component: ${component.name}
# Type: ${component.type}`;
    }
  }

  private exportToCloudFormation(diagram: ArchitectureDiagram, options: ExportOptions): string {
    const template = {
      AWSTemplateFormatVersion: '2010-09-09',
      Description: `CloudFormation template for ${diagram.name}`,
      Parameters: {
        EnvironmentName: {
          Type: 'String',
          Default: 'dev',
          Description: 'Environment name prefix'
        }
      },
      Resources: {} as Record<string, any>,
      Outputs: {} as Record<string, any>
    };

    // Convert components to CloudFormation resources
    for (const component of diagram.components) {
      const resourceName = component.name.replace(/[^a-zA-Z0-9]/g, '');
      template.Resources[resourceName] = this.componentToCloudFormation(component);
    }

    return JSON.stringify(template, null, 2);
  }

  private componentToCloudFormation(component: ArchitectureComponent): any {
    switch (component.type.toLowerCase()) {
      case 'ec2':
        return {
          Type: 'AWS::EC2::Instance',
          Properties: {
            ImageId: 'ami-0c02fb55956c7d316',
            InstanceType: component.properties.instanceType || 't3.micro',
            Tags: [
              {
                Key: 'Name',
                Value: component.name
              }
            ]
          }
        };

      case 'rds':
        return {
          Type: 'AWS::RDS::DBInstance',
          Properties: {
            DBInstanceIdentifier: component.name.toLowerCase(),
            Engine: component.properties.engine || 'mysql',
            EngineVersion: component.properties.version || '8.0',
            DBInstanceClass: component.properties.instanceClass || 'db.t3.micro',
            AllocatedStorage: component.properties.storage || 20,
            DBName: component.properties.dbName || 'mydb',
            MasterUsername: component.properties.username || 'admin',
            MasterUserPassword: component.properties.password || 'changeme',
            Tags: [
              {
                Key: 'Name',
                Value: component.name
              }
            ]
          }
        };

      case 's3':
        return {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: `${component.name.toLowerCase()}-\${AWS::AccountId}`,
            Tags: [
              {
                Key: 'Name',
                Value: component.name
              }
            ]
          }
        };

      default:
        return {
          Type: 'AWS::CloudFormation::WaitConditionHandle',
          Properties: {},
          Metadata: {
            Comment: `${component.type} resource not yet supported in CloudFormation export`
          }
        };
    }
  }

  private async exportToPDF(diagram: ArchitectureDiagram, options: ExportOptions): Promise<Blob> {
    // This would typically use a library like jsPDF or Puppeteer
    // For now, return a placeholder
    const content = `PDF Export of ${diagram.name}\n\nThis would contain the visual diagram.`;
    return new Blob([content], { type: 'application/pdf' });
  }

  private async exportToPNG(diagram: ArchitectureDiagram, options: ExportOptions): Promise<Blob> {
    // This would typically use canvas or SVG to PNG conversion
    // For now, return a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png');
    });
  }

  private async exportToSVG(diagram: ArchitectureDiagram, options: ExportOptions): Promise<string> {
    let svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<title>${diagram.name}</title>`;
    
    // Add components as SVG elements
    for (const component of diagram.components) {
      svg += `<rect x="${component.position.x}" y="${component.position.y}" width="100" height="60" fill="#e2e8f0" stroke="#64748b" rx="8"/>`;
      svg += `<text x="${component.position.x + 50}" y="${component.position.y + 35}" text-anchor="middle" font-family="Arial" font-size="12">${component.name}</text>`;
    }
    
    svg += `</svg>`;
    return svg;
  }

  public downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

export default ExportSystem;
