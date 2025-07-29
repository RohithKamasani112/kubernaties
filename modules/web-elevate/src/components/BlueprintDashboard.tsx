import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  Star,
  Users,
  Code,
  Zap,
  ChevronRight,
  Play,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Layers,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';
import { Blueprint, BlueprintCategory } from '../data/blueprintTypes';
import { allBlueprints, blueprintCategories } from '../data/blueprintData';

interface BlueprintDashboardProps {
  onBlueprintSelect: (blueprintId: string) => void;
}

const BlueprintDashboard: React.FC<BlueprintDashboardProps> = ({ onBlueprintSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'categories' | 'progress'>('browse');

  // Filter blueprints
  const filteredBlueprints = allBlueprints.filter(blueprint => {
    const matchesSearch = blueprint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blueprint.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || blueprint.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fullstack': return <Layers className="w-5 h-5" />;
      case 'frontend': return <Globe className="w-5 h-5" />;
      case 'backend': return <Database className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const renderBlueprintCard = (blueprint: Blueprint) => (
    <motion.div
      key={blueprint.id}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onBlueprintSelect(blueprint.id)}
    >
      {/* Header with gradient */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(blueprint.difficulty)}`}>
              {blueprint.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-white">
              {getCategoryIcon(blueprint.category)}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg leading-tight">{blueprint.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blueprint.description}</p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(blueprint.technologies || blueprint.tags || []).slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
            >
              {tech}
            </span>
          ))}
          {(blueprint.technologies || blueprint.tags || []).length > 4 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
              +{(blueprint.technologies || blueprint.tags || []).length - 4}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Duration</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{blueprint.estimatedDuration}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs">XP</span>
            </div>
            <div className="text-sm font-semibold text-purple-600">{blueprint.totalXP}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Target className="w-3 h-3" />
              <span className="text-xs">Milestones</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{blueprint.milestones.length}</div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>0 building</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700">
            <Play className="w-4 h-4" />
            <span className="font-medium">Start Building</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderCategoryCard = (category: BlueprintCategory) => (
    <motion.div
      key={category.id}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => setSelectedCategory(category.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center text-2xl`}>
            {category.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {category.blueprints.length} blueprints
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Blueprints</h1>
                <p className="text-gray-600 mt-1">Build real-world projects with guided milestones</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Available Projects</div>
                  <div className="text-2xl font-bold text-blue-900">{allBlueprints.length}</div>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Total XP</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {allBlueprints.reduce((sum, b) => sum + b.totalXP, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'browse', label: 'Browse Projects', icon: BookOpen },
                  { id: 'categories', label: 'Categories', icon: Layers },
                  { id: 'progress', label: 'My Progress', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search blueprints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="fullstack">Full-Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Blueprints Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredBlueprints.map(renderBlueprintCard)}
              </AnimatePresence>
            </div>

            {filteredBlueprints.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blueprintCategories.map(renderCategoryCard)}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Your project progress and achievements will be displayed here.
              Start building your first blueprint to see your progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintDashboard;
