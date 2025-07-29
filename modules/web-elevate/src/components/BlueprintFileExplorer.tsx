import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  File,
  FileText,
  Folder,
  FolderOpen,
  Code,
  Image,
  Settings,
  Database,
  Globe,
  Package,
  GitBranch,
  Plus,
  MoreHorizontal,
  Circle
} from 'lucide-react';
import { ProjectFile } from '../data/blueprintTypes';

interface BlueprintFileExplorerProps {
  files: Record<string, ProjectFile>;
  activeFile: string;
  onFileSelect: (filePath: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  file?: ProjectFile;
}

const BlueprintFileExplorer: React.FC<BlueprintFileExplorerProps> = ({
  files,
  activeFile,
  onFileSelect
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/', '/src', '/public']));

  // Build file tree structure
  const buildFileTree = (): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // Create root folder node
    const rootNode: FileNode = {
      name: 'Project',
      path: '/',
      type: 'folder',
      children: []
    };
    folderMap.set('/', rootNode);
    tree.push(rootNode);

    // Process all files
    Object.values(files).forEach(file => {
      const pathParts = file.path.split('/').filter(part => part);
      let currentPath = '';
      let currentParent = rootNode;

      // Create folder structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath += '/' + pathParts[i];
        
        if (!folderMap.has(currentPath)) {
          const folderNode: FileNode = {
            name: pathParts[i],
            path: currentPath,
            type: 'folder',
            children: []
          };
          folderMap.set(currentPath, folderNode);
          currentParent.children!.push(folderNode);
          currentParent = folderNode;
        } else {
          currentParent = folderMap.get(currentPath)!;
        }
      }

      // Add file node
      const fileName = pathParts[pathParts.length - 1];
      const fileNode: FileNode = {
        name: fileName,
        path: file.path,
        type: 'file',
        file
      };
      currentParent.children!.push(fileNode);
    });

    // Sort children (folders first, then files, both alphabetically)
    const sortChildren = (node: FileNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortChildren);
      }
    };

    tree.forEach(sortChildren);
    return tree;
  };

  const getFileIcon = (fileName: string, isModified: boolean = false) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconClass = `w-4 h-4 ${isModified ? 'text-orange-500' : 'text-gray-500'}`;

    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <Code className={iconClass} style={{ color: '#61DAFB' }} />;
      case 'ts':
      case 'js':
        return <Code className={iconClass} style={{ color: '#F7DF1E' }} />;
      case 'css':
      case 'scss':
      case 'sass':
        return <Code className={iconClass} style={{ color: '#1572B6' }} />;
      case 'html':
        return <Globe className={iconClass} style={{ color: '#E34F26' }} />;
      case 'json':
        return <Settings className={iconClass} style={{ color: '#000000' }} />;
      case 'md':
        return <FileText className={iconClass} style={{ color: '#083FA1' }} />;
      case 'sql':
        return <Database className={iconClass} style={{ color: '#336791' }} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className={iconClass} style={{ color: '#FF6B6B' }} />;
      case 'gitignore':
        return <GitBranch className={iconClass} style={{ color: '#F05032' }} />;
      default:
        if (fileName === 'package.json') {
          return <Package className={iconClass} style={{ color: '#CB3837' }} />;
        }
        return <File className={iconClass} />;
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = node.type === 'file' && node.path === activeFile;
    const isModified = node.file?.modified || false;

    return (
      <div key={node.path}>
        <motion.div
          className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-gray-50 ${
            isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
          whileHover={{ backgroundColor: isActive ? undefined : '#f9fafb' }}
        >
          {node.type === 'folder' && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </motion.div>
          )}
          
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <div className="relative">
              {getFileIcon(node.name, isModified)}
              {isModified && (
                <Circle className="w-2 h-2 text-orange-500 absolute -top-1 -right-1 fill-current" />
              )}
            </div>
          )}
          
          <span 
            className={`text-sm truncate ${
              isActive ? 'text-blue-700 font-medium' : 'text-gray-700'
            } ${isModified ? 'italic' : ''}`}
          >
            {node.name}
            {isModified && node.type === 'file' && (
              <span className="text-orange-500 ml-1">•</span>
            )}
          </span>
        </motion.div>

        <AnimatePresence>
          {node.type === 'folder' && isExpanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map(child => renderFileNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const fileTree = buildFileTree();
  const modifiedFilesCount = Object.values(files).filter(f => f.modified).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Explorer</h3>
          <div className="flex items-center space-x-1">
            {modifiedFilesCount > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {modifiedFilesCount} modified
              </span>
            )}
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {fileTree.map(node => renderFileNode(node))}
        
        {Object.keys(files).length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <Folder className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Files will appear here as you build your project
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{Object.keys(files).length} files</span>
          {modifiedFilesCount > 0 && (
            <span className="text-orange-600">
              {modifiedFilesCount} unsaved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlueprintFileExplorer;
