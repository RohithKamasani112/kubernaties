import React, { useState } from 'react';
import { TabButtonGroup, TabButtonGroupViolet, TabButtonGroupBlue } from './TabButtonGroup';
import { 
  Code, 
  Layers, 
  Zap, 
  Settings, 
  Users,
  BookOpen,
  Cpu,
  Globe,
  Database
} from 'lucide-react';

export const TabButtonDemo: React.FC = () => {
  const [activeTab1, setActiveTab1] = useState('overview');
  const [activeTab2, setActiveTab2] = useState('scenarios');
  const [activeTab3, setActiveTab3] = useState('builder');

  const developerTabs = [
    {
      id: 'overview',
      label: 'Overview',
      subtext: 'Platform intro',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'scenarios',
      label: 'Scenarios',
      subtext: '35+ real examples',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'ai-gen',
      label: 'AI Gen',
      subtext: 'Text → architecture',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'builder',
      label: 'Builder',
      subtext: 'Drag & drop',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'paths',
      label: 'Paths',
      subtext: 'Guided learning',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const cloudTabs = [
    {
      id: 'compute',
      label: 'Compute',
      subtext: 'VMs & containers',
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: 'storage',
      label: 'Storage',
      subtext: 'Databases & files',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'networking',
      label: 'Networking',
      subtext: 'Load balancers & CDN',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'security',
      label: 'Security',
      subtext: 'IAM & encryption',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const simpleTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtext: 'Overview & metrics'
    },
    {
      id: 'projects',
      label: 'Projects',
      subtext: 'Manage workspaces'
    },
    {
      id: 'team',
      label: 'Team',
      subtext: 'Collaborate & share'
    },
    {
      id: 'settings',
      label: 'Settings',
      subtext: 'Configure platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Modern Tab Button Groups
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beautiful, responsive tab navigation components with smooth animations, 
            hover effects, and multiple color themes for developer platforms.
          </p>
        </div>

        {/* Indigo Theme */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Indigo Theme</h2>
            <p className="text-gray-600">Default indigo gradient with clean styling</p>
          </div>
          
          <TabButtonGroup
            tabs={developerTabs}
            activeTab={activeTab1}
            onTabChange={setActiveTab1}
            className="justify-center"
          />
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Active tab: <span className="font-semibold text-indigo-600">{activeTab1}</span>
            </p>
          </div>
        </div>

        {/* Violet Theme */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Violet Theme</h2>
            <p className="text-gray-600">Purple gradient with violet hover effects</p>
          </div>
          
          <TabButtonGroupViolet
            tabs={cloudTabs}
            activeTab={activeTab2}
            onTabChange={setActiveTab2}
            className="justify-center"
          />
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Active tab: <span className="font-semibold text-violet-600">{activeTab2}</span>
            </p>
          </div>
        </div>

        {/* Blue Theme */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Theme</h2>
            <p className="text-gray-600">Classic blue gradient with subtle animations</p>
          </div>
          
          <TabButtonGroupBlue
            tabs={simpleTabs}
            activeTab={activeTab3}
            onTabChange={setActiveTab3}
            className="justify-center"
          />
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Active tab: <span className="font-semibold text-blue-600">{activeTab3}</span>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smooth Animations</h3>
                  <p className="text-sm text-gray-600">300ms transitions with easing for professional feel</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hover Effects</h3>
                  <p className="text-sm text-gray-600">Subtle scale and color changes on interaction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accessibility</h3>
                  <p className="text-sm text-gray-600">Focus rings and keyboard navigation support</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Responsive Design</h3>
                  <p className="text-sm text-gray-600">Adapts to different screen sizes with flex wrap</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Multiple Themes</h3>
                  <p className="text-sm text-gray-600">Indigo, violet, and blue color variants</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Icon Support</h3>
                  <p className="text-sm text-gray-600">Optional icons with proper spacing and colors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
