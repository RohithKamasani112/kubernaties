import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Play, 
  Clock, 
  Star, 
  Award,
  Target,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Trophy,
  Brain,
  Code,
  Shield,
  Database,
  Network,
  Globe
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'lesson' | 'lab' | 'project' | 'quiz';
  completed: boolean;
  locked: boolean;
  prerequisites: string[];
  skills: string[];
  icon: React.ReactNode;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  provider: 'aws' | 'azure' | 'gcp' | 'multi-cloud';
  level: 'beginner' | 'intermediate' | 'expert';
  totalModules: number;
  completedModules: number;
  estimatedHours: number;
  modules: LearningModule[];
  color: string;
  icon: string;
}

const LearningPathSystem: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp' | 'multi-cloud'>('all');

  const learningPaths: LearningPath[] = [
    {
      id: 'aws-beginner',
      title: 'AWS Fundamentals',
      description: 'Master the basics of Amazon Web Services from compute to storage',
      provider: 'aws',
      level: 'beginner',
      totalModules: 8,
      completedModules: 3,
      estimatedHours: 12,
      color: 'from-orange-500 to-red-500',
      icon: '🟠',
      modules: [
        {
          id: 'aws-intro',
          title: 'Introduction to AWS',
          description: 'Learn AWS basics, regions, and core services',
          duration: '45 min',
          difficulty: 'beginner',
          type: 'lesson',
          completed: true,
          locked: false,
          prerequisites: [],
          skills: ['AWS Basics', 'Cloud Concepts'],
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          id: 'aws-ec2',
          title: 'EC2 Virtual Servers',
          description: 'Launch and manage virtual servers in the cloud',
          duration: '60 min',
          difficulty: 'beginner',
          type: 'lab',
          completed: true,
          locked: false,
          prerequisites: ['aws-intro'],
          skills: ['EC2', 'Virtual Machines'],
          icon: <Code className="w-4 h-4" />
        },
        {
          id: 'aws-s3',
          title: 'S3 Object Storage',
          description: 'Store and retrieve files using Amazon S3',
          duration: '50 min',
          difficulty: 'beginner',
          type: 'lab',
          completed: true,
          locked: false,
          prerequisites: ['aws-intro'],
          skills: ['S3', 'Object Storage'],
          icon: <Database className="w-4 h-4" />
        },
        {
          id: 'aws-vpc',
          title: 'VPC Networking',
          description: 'Create secure private networks in AWS',
          duration: '75 min',
          difficulty: 'intermediate',
          type: 'lab',
          completed: false,
          locked: false,
          prerequisites: ['aws-ec2'],
          skills: ['VPC', 'Networking', 'Security'],
          icon: <Network className="w-4 h-4" />
        },
        {
          id: 'aws-rds',
          title: 'RDS Databases',
          description: 'Set up managed relational databases',
          duration: '65 min',
          difficulty: 'intermediate',
          type: 'lab',
          completed: false,
          locked: false,
          prerequisites: ['aws-vpc'],
          skills: ['RDS', 'Databases', 'SQL'],
          icon: <Database className="w-4 h-4" />
        },
        {
          id: 'aws-lambda',
          title: 'Serverless with Lambda',
          description: 'Build serverless applications with AWS Lambda',
          duration: '80 min',
          difficulty: 'intermediate',
          type: 'project',
          completed: false,
          locked: true,
          prerequisites: ['aws-rds'],
          skills: ['Lambda', 'Serverless', 'API Gateway'],
          icon: <Zap className="w-4 h-4" />
        },
        {
          id: 'aws-security',
          title: 'AWS Security Best Practices',
          description: 'Implement security controls and monitoring',
          duration: '90 min',
          difficulty: 'advanced',
          type: 'lesson',
          completed: false,
          locked: true,
          prerequisites: ['aws-lambda'],
          skills: ['IAM', 'Security', 'CloudTrail'],
          icon: <Shield className="w-4 h-4" />
        },
        {
          id: 'aws-final-project',
          title: 'Build a Complete Web App',
          description: 'Deploy a full-stack application using multiple AWS services',
          duration: '120 min',
          difficulty: 'advanced',
          type: 'project',
          completed: false,
          locked: true,
          prerequisites: ['aws-security'],
          skills: ['Full-Stack', 'Architecture', 'DevOps'],
          icon: <Trophy className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'azure-intermediate',
      title: 'Azure Cloud Solutions',
      description: 'Build scalable applications and services on Microsoft Azure',
      provider: 'azure',
      level: 'intermediate',
      totalModules: 10,
      completedModules: 0,
      estimatedHours: 18,
      color: 'from-blue-500 to-cyan-500',
      icon: '🔵',
      modules: []
    },
    {
      id: 'gcp-expert',
      title: 'GCP Architecture Mastery',
      description: 'Design enterprise-grade solutions on Google Cloud Platform',
      provider: 'gcp',
      level: 'expert',
      totalModules: 12,
      completedModules: 0,
      estimatedHours: 25,
      color: 'from-green-500 to-emerald-500',
      icon: '🟢',
      modules: []
    },
    {
      id: 'multi-cloud-expert',
      title: 'Multi-Cloud Architecture',
      description: 'Master hybrid and multi-cloud deployment strategies',
      provider: 'multi-cloud',
      level: 'expert',
      totalModules: 15,
      completedModules: 0,
      estimatedHours: 30,
      color: 'from-purple-500 to-pink-500',
      icon: '🌐',
      modules: []
    }
  ];

  const filteredPaths = learningPaths.filter(path => {
    const levelMatch = selectedLevel === 'all' || path.level === selectedLevel;
    const providerMatch = selectedProvider === 'all' || path.provider === selectedProvider;
    return levelMatch && providerMatch;
  });

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'lab': return <Code className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          <span>Guided Learning Paths</span>
        </div>
        
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Structured Cloud Learning Journey
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Follow curated learning paths from beginner to expert with hands-on labs, projects, and assessments
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cloud Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Providers</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">Google Cloud</option>
              <option value="multi-cloud">Multi-Cloud</option>
            </select>
          </div>
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200 overflow-hidden cursor-pointer"
            onClick={() => setSelectedPath(path)}
          >
            {/* Path Header */}
            <div className={`bg-gradient-to-r ${path.color} text-white p-6`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{path.icon}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {path.level}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{path.title}</h3>
              <p className="opacity-90 text-sm">{path.description}</p>
            </div>

            {/* Path Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{path.completedModules}/{path.totalModules}</div>
                  <div className="text-sm text-slate-600">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{path.estimatedHours}h</div>
                  <div className="text-sm text-slate-600">Duration</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm text-slate-600">
                    {Math.round((path.completedModules / path.totalModules) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(path.completedModules / path.totalModules) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <span>View Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Path Detail Modal */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPath(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${selectedPath.color} text-white p-8`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-4xl">{selectedPath.icon}</span>
                      <div>
                        <h2 className="text-3xl font-bold">{selectedPath.title}</h2>
                        <p className="opacity-90">{selectedPath.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{selectedPath.estimatedHours} hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>{selectedPath.totalModules} modules</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>{selectedPath.level}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPath(null)}
                    className="text-white/80 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modules List */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Learning Modules</h3>
                <div className="space-y-4">
                  {selectedPath.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        module.completed 
                          ? 'border-green-200 bg-green-50' 
                          : module.locked 
                            ? 'border-slate-200 bg-slate-50 opacity-60' 
                            : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            module.completed 
                              ? 'bg-green-500 text-white' 
                              : module.locked 
                                ? 'bg-slate-300 text-slate-500' 
                                : 'bg-blue-500 text-white'
                          }`}>
                            {module.completed ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : module.locked ? (
                              <Lock className="w-6 h-6" />
                            ) : (
                              module.icon
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-slate-900">{module.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                                {module.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium flex items-center space-x-1">
                                {getModuleTypeIcon(module.type)}
                                <span>{module.type}</span>
                              </span>
                            </div>
                            <p className="text-slate-600 mb-3">{module.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{module.duration}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {module.skills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!module.locked && (
                            <button className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                              module.completed 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}>
                              <Play className="w-4 h-4" />
                              <span>{module.completed ? 'Review' : 'Start'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Path Actions */}
                <div className="mt-8 flex space-x-4">
                  <button className={`flex-1 bg-gradient-to-r ${selectedPath.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}>
                    <Play className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </button>
                  <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathSystem;
