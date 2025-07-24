import { DeployedResource } from '../components/arch-learning/InteractiveLearningPath';
import { CloudScenario } from '../data/cloudScenarios';
import { LearningScenario } from '../data/learningScenarios';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  scenario: CloudScenario;
  learningScenario?: LearningScenario;
  deployedResources: DeployedResource[];
  currentStep: number;
  completedSteps: number[];
  code: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags: string[];
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'json' | 'pdf' | 'terraform' | 'yaml' | 'cloudformation';
  includeCode: boolean;
  includeDocumentation: boolean;
  includeSecurityAnalysis: boolean;
  includeBestPractices: boolean;
  theme: 'light' | 'dark';
  quality: 'low' | 'medium' | 'high';
}

export interface VersionHistory {
  version: number;
  timestamp: Date;
  changes: string[];
  snapshot: ProjectData;
}

export class ExportSystem {
  private static instance: ExportSystem;
  private storageKey = 'kubequest-arch-projects';
  private versionHistoryKey = 'kubequest-arch-versions';

  public static getInstance(): ExportSystem {
    if (!ExportSystem.instance) {
      ExportSystem.instance = new ExportSystem();
    }
    return ExportSystem.instance;
  }

  // Save/Load functionality
  public saveProject(projectData: ProjectData): void {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === projectData.id);
      
      if (existingIndex >= 0) {
        // Update existing project
        const oldProject = projects[existingIndex];
        projectData.version = oldProject.version + 1;
        projectData.updatedAt = new Date();
        
        // Save version history
        this.saveVersionHistory(projectData.id, {
          version: oldProject.version,
          timestamp: oldProject.updatedAt,
          changes: this.detectChanges(oldProject, projectData),
          snapshot: oldProject
        });
        
        projects[existingIndex] = projectData;
      } else {
        // New project
        projectData.version = 1;
        projectData.createdAt = new Date();
        projectData.updatedAt = new Date();
        projects.push(projectData);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save project:', error);
      throw new Error('Failed to save project to local storage');
    }
  }

  public loadProject(projectId: string): ProjectData | null {
    try {
      const projects = this.getAllProjects();
      return projects.find(p => p.id === projectId) || null;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }

  public getAllProjects(): ProjectData[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  public deleteProject(projectId: string): void {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
      
      // Also delete version history
      this.deleteVersionHistory(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project');
    }
  }

  // Version History
  private saveVersionHistory(projectId: string, version: VersionHistory): void {
    try {
      const allVersions = this.getAllVersionHistory();
      if (!allVersions[projectId]) {
        allVersions[projectId] = [];
      }
      
      allVersions[projectId].push(version);
      
      // Keep only last 10 versions
      if (allVersions[projectId].length > 10) {
        allVersions[projectId] = allVersions[projectId].slice(-10);
      }
      
      localStorage.setItem(this.versionHistoryKey, JSON.stringify(allVersions));
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  }

  public getVersionHistory(projectId: string): VersionHistory[] {
    try {
      const allVersions = this.getAllVersionHistory();
      return allVersions[projectId] || [];
    } catch (error) {
      console.error('Failed to load version history:', error);
      return [];
    }
  }

  private getAllVersionHistory(): Record<string, VersionHistory[]> {
    try {
      const data = localStorage.getItem(this.versionHistoryKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load version history:', error);
      return {};
    }
  }

  private deleteVersionHistory(projectId: string): void {
    try {
      const allVersions = this.getAllVersionHistory();
      delete allVersions[projectId];
      localStorage.setItem(this.versionHistoryKey, JSON.stringify(allVersions));
    } catch (error) {
      console.error('Failed to delete version history:', error);
    }
  }

  private detectChanges(oldProject: ProjectData, newProject: ProjectData): string[] {
    const changes: string[] = [];
    
    if (oldProject.deployedResources.length !== newProject.deployedResources.length) {
      changes.push(`Resources changed: ${oldProject.deployedResources.length} → ${newProject.deployedResources.length}`);
    }
    
    if (oldProject.currentStep !== newProject.currentStep) {
      changes.push(`Step changed: ${oldProject.currentStep} → ${newProject.currentStep}`);
    }
    
    if (oldProject.completedSteps.length !== newProject.completedSteps.length) {
      changes.push(`Completed steps: ${oldProject.completedSteps.length} → ${newProject.completedSteps.length}`);
    }
    
    if (oldProject.code !== newProject.code) {
      changes.push('Code updated');
    }
    
    return changes;
  }

  // Export functionality
  public async exportProject(projectData: ProjectData, options: ExportOptions): Promise<Blob> {
    switch (options.format) {
      case 'json':
        return this.exportAsJSON(projectData, options);
      case 'terraform':
        return this.exportAsTerraform(projectData, options);
      case 'yaml':
        return this.exportAsYAML(projectData, options);
      case 'cloudformation':
        return this.exportAsCloudFormation(projectData, options);
      case 'png':
        return this.exportAsPNG(projectData, options);
      case 'svg':
        return this.exportAsSVG(projectData, options);
      case 'pdf':
        return this.exportAsPDF(projectData, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private exportAsJSON(projectData: ProjectData, options: ExportOptions): Blob {
    const exportData = {
      project: {
        name: projectData.name,
        description: projectData.description,
        scenario: projectData.scenario.title,
        provider: projectData.scenario.provider,
        createdAt: projectData.createdAt,
        version: projectData.version
      },
      architecture: {
        resources: projectData.deployedResources.map(resource => ({
          id: resource.id,
          type: resource.type,
          name: resource.name,
          properties: resource.properties,
          position: resource.position,
          securityLevel: resource.securityLevel
        })),
        connections: projectData.deployedResources.flatMap(resource =>
          resource.connections.map(connectionId => ({
            from: resource.id,
            to: connectionId,
            type: 'data'
          }))
        )
      },
      ...(options.includeCode && { code: projectData.code }),
      ...(options.includeDocumentation && {
        documentation: {
          scenario: projectData.learningScenario?.description,
          objectives: projectData.learningScenario?.learningObjectives,
          prerequisites: projectData.learningScenario?.prerequisites
        }
      })
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  }

  private exportAsTerraform(projectData: ProjectData, options: ExportOptions): Blob {
    let terraformCode = `# Generated by KubeQuest Arch Learning
# Project: ${projectData.name}
# Provider: ${projectData.scenario.provider}
# Generated at: ${new Date().toISOString()}

terraform {
  required_providers {
    ${projectData.scenario.provider} = {
      source  = "hashicorp/${projectData.scenario.provider}"
      version = "~> 5.0"
    }
  }
}

provider "${projectData.scenario.provider}" {
  region = "us-west-2"  # Update as needed
}

`;

    // Add resource configurations
    projectData.deployedResources.forEach(resource => {
      terraformCode += `
resource "${projectData.scenario.provider}_${resource.type}" "${resource.id.replace(/-/g, '_')}" {
  # Configuration for ${resource.name}
  # TODO: Add specific configuration based on resource type
  
  tags = {
    Name        = "${resource.name}"
    Environment = "learning"
    Project     = "${projectData.name}"
  }
}
`;
    });

    if (options.includeDocumentation) {
      terraformCode += `
# Documentation
# ${projectData.description}
# 
# Learning Objectives:
${projectData.learningScenario?.learningObjectives?.map(obj => `# - ${obj}`).join('\n') || ''}
`;
    }

    return new Blob([terraformCode], { type: 'text/plain' });
  }

  private exportAsYAML(projectData: ProjectData, options: ExportOptions): Blob {
    // For Kubernetes resources
    let yamlContent = `# Generated by KubeQuest Arch Learning
# Project: ${projectData.name}
# Generated at: ${new Date().toISOString()}

`;

    projectData.deployedResources.forEach(resource => {
      if (projectData.scenario.provider === 'kubernetes') {
        yamlContent += `---
apiVersion: v1
kind: ${resource.type === 'pod' ? 'Pod' : 'Service'}
metadata:
  name: ${resource.name.toLowerCase()}
  labels:
    app: ${resource.name.toLowerCase()}
    project: ${projectData.name.toLowerCase().replace(/\s+/g, '-')}
spec:
  # TODO: Add specific configuration based on resource type
  
`;
      }
    });

    return new Blob([yamlContent], { type: 'text/yaml' });
  }

  private exportAsCloudFormation(projectData: ProjectData, options: ExportOptions): Blob {
    const cfTemplate = {
      AWSTemplateFormatVersion: '2010-09-09',
      Description: `${projectData.name} - Generated by KubeQuest Arch Learning`,
      Parameters: {},
      Resources: {},
      Outputs: {}
    };

    // Add resources to CloudFormation template
    projectData.deployedResources.forEach(resource => {
      const resourceName = resource.id.replace(/-/g, '');
      cfTemplate.Resources[resourceName] = {
        Type: `AWS::${this.getAWSResourceType(resource.type)}`,
        Properties: {
          // TODO: Add specific properties based on resource type
          Tags: [
            { Key: 'Name', Value: resource.name },
            { Key: 'Project', Value: projectData.name },
            { Key: 'Environment', Value: 'learning' }
          ]
        }
      };
    });

    return new Blob([JSON.stringify(cfTemplate, null, 2)], { type: 'application/json' });
  }

  private getAWSResourceType(resourceType: string): string {
    const typeMap: Record<string, string> = {
      's3': 'S3::Bucket',
      'ec2': 'EC2::Instance',
      'rds': 'RDS::DBInstance',
      'vpc': 'EC2::VPC',
      'lambda': 'Lambda::Function',
      'alb': 'ElasticLoadBalancingV2::LoadBalancer'
    };
    return typeMap[resourceType] || 'CloudFormation::CustomResource';
  }

  private async exportAsPNG(projectData: ProjectData, options: ExportOptions): Promise<Blob> {
    // This would require canvas rendering of the architecture diagram
    // For now, return a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;
    
    // Draw background
    ctx.fillStyle = options.theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = options.theme === 'dark' ? '#ffffff' : '#000000';
    ctx.font = '24px Arial';
    ctx.fillText(projectData.name, 50, 50);
    
    // Draw resources (simplified)
    projectData.deployedResources.forEach((resource, index) => {
      const x = 100 + (index % 3) * 200;
      const y = 150 + Math.floor(index / 3) * 150;
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, 120, 80);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(resource.name, x + 10, y + 30);
      ctx.fillText(resource.type, x + 10, y + 50);
    });
    
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob!), 'image/png');
    });
  }

  private async exportAsSVG(projectData: ProjectData, options: ExportOptions): Promise<Blob> {
    // Generate SVG representation of the architecture
    let svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${options.theme === 'dark' ? '#1e293b' : '#ffffff'}"/>
  <text x="50" y="50" font-family="Arial" font-size="24" fill="${options.theme === 'dark' ? '#ffffff' : '#000000'}">${projectData.name}</text>
`;

    projectData.deployedResources.forEach((resource, index) => {
      const x = 100 + (index % 3) * 200;
      const y = 150 + Math.floor(index / 3) * 150;
      
      svg += `
  <rect x="${x}" y="${y}" width="120" height="80" fill="#3b82f6" rx="8"/>
  <text x="${x + 10}" y="${y + 30}" font-family="Arial" font-size="14" fill="#ffffff">${resource.name}</text>
  <text x="${x + 10}" y="${y + 50}" font-family="Arial" font-size="12" fill="#ffffff">${resource.type}</text>
`;
    });

    svg += '</svg>';
    
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  private async exportAsPDF(projectData: ProjectData, options: ExportOptions): Promise<Blob> {
    // This would require a PDF library like jsPDF
    // For now, return a simple text-based PDF placeholder
    const content = `KubeQuest Architecture Export

Project: ${projectData.name}
Description: ${projectData.description}
Provider: ${projectData.scenario.provider}
Created: ${projectData.createdAt}
Version: ${projectData.version}

Resources:
${projectData.deployedResources.map(r => `- ${r.name} (${r.type})`).join('\n')}

${options.includeCode ? `\nCode:\n${projectData.code}` : ''}
`;
    
    return new Blob([content], { type: 'text/plain' });
  }

  // Utility methods
  public generateProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStorageUsage(): { used: number; total: number; percentage: number } {
    try {
      const projects = this.getAllProjects();
      const versions = this.getAllVersionHistory();
      const used = JSON.stringify({ projects, versions }).length;
      const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
      
      return {
        used,
        total,
        percentage: (used / total) * 100
      };
    } catch (error) {
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  public clearStorage(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.versionHistoryKey);
  }
}
