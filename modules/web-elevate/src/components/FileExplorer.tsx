import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Search, 
  ChevronRight, 
  ChevronDown,
  FileText,
  Code,
  Image,
  Settings,
  Database
} from 'lucide-react';

interface FileExplorerProps {
  files: string[];
  selectedFile: string;
  modifiedFiles: Set<string>;
  onFileSelect: (filename: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  extension?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  modifiedFiles,
  onFileSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));

  // Build file tree structure
  const buildFileTree = (filePaths: string[]): FileNode[] => {
    const root: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    filePaths.forEach(filePath => {
      const parts = filePath.split('/');
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (index === parts.length - 1) {
          // It's a file
          const fileNode: FileNode = {
            name: part,
            path: currentPath,
            type: 'file',
            extension: part.split('.').pop()
          };
          
          if (parentPath) {
            const parentNode = folderMap.get(parentPath);
            if (parentNode) {
              parentNode.children = parentNode.children || [];
              parentNode.children.push(fileNode);
            }
          } else {
            root.push(fileNode);
          }
        } else {
          // It's a folder
          if (!folderMap.has(currentPath)) {
            const folderNode: FileNode = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: []
            };
            
            folderMap.set(currentPath, folderNode);
            
            if (parentPath) {
              const parentNode = folderMap.get(parentPath);
              if (parentNode) {
                parentNode.children = parentNode.children || [];
                parentNode.children.push(folderNode);
              }
            } else {
              root.push(folderNode);
            }
          }
        }
      });
    });

    return root;
  };

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText className="w-4 h-4 text-pink-500" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'json':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'sql':
        return <Database className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
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
    const isSelected = node.type === 'file' && selectedFile === node.path;
    const isModified = node.type === 'file' && modifiedFiles.has(node.path);
    
    // Filter based on search query
    if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      // For folders, check if any children match
      if (node.type === 'folder' && node.children) {
        const hasMatchingChildren = node.children.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (child.type === 'folder' && child.children?.some(grandchild => 
            grandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        );
        if (!hasMatchingChildren) return null;
      } else if (node.type === 'file') {
        return null;
      }
    }

    return (
      <div key={node.path}>
        <motion.div
          className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded ${
            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
          whileHover={{ backgroundColor: isSelected ? undefined : '#f3f4f6' }}
          transition={{ duration: 0.1 }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3" /> {/* Spacer for alignment */}
              {getFileIcon(node.extension)}
            </>
          )}
          
          <span className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>
            {node.name}
          </span>
          
          {isModified && (
            <div className="w-2 h-2 bg-orange-500 rounded-full ml-auto" title="Modified" />
          )}
        </motion.div>

        {/* Render children if folder is expanded */}
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

  const fileTree = buildFileTree(files);
  const filteredFiles = searchQuery 
    ? files.filter(file => file.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Explorer</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery ? (
          // Show flat list when searching
          <div className="space-y-1">
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => {
                const isSelected = selectedFile === file;
                const isModified = modifiedFiles.has(file);
                const extension = file.split('.').pop();
                
                return (
                  <motion.div
                    key={file}
                    className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                    onClick={() => onFileSelect(file)}
                    whileHover={{ backgroundColor: isSelected ? undefined : '#f3f4f6' }}
                  >
                    {getFileIcon(extension)}
                    <span className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>
                      {file}
                    </span>
                    {isModified && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full ml-auto" title="Modified" />
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                No files found matching "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          // Show tree structure when not searching
          <div className="space-y-1">
            {fileTree.map(node => renderFileNode(node))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 text-xs text-gray-500">
        {files.length} file{files.length !== 1 ? 's' : ''}
        {modifiedFiles.size > 0 && (
          <span className="ml-2 text-orange-600">
            • {modifiedFiles.size} modified
          </span>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
