import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Calendar,
  Code,
  Target,
  TrendingUp,
  Share2,
  Download,
  Eye,
  Github,
  ExternalLink,
  Award,
  Clock,
  Users,
  Zap,
  BookOpen,
  Settings,
  Copy,
  CheckCircle,
  Globe,
  Mail,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

const Portfolio: React.FC = () => {
  const { userProgress, learningPaths, blueprints } = useWebElevateStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'achievements' | 'share'>('overview');
  const [isPublic, setIsPublic] = useState(false);
  const [portfolioUrl] = useState('https://webelevate.dev/portfolio/john-doe');
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedProjects = blueprints.filter(b => b.isCompleted);
  const inProgressProjects = blueprints.filter(b => b.isStarted && !b.isCompleted);
  const totalHours = userProgress.totalHours || 42; // Mock data
  const streak = userProgress.streak || 7; // Mock data

  const mockProfile = {
    name: 'John Doe',
    title: 'Full-Stack Developer',
    bio: 'Passionate web developer with expertise in React, Node.js, and modern web technologies. Currently learning advanced cloud architecture and DevOps practices.',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    github: 'johndoe',
    linkedin: 'johndoe',
    twitter: 'johndoe',
    website: 'https://johndoe.dev'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6 mb-6 lg:mb-0">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{mockProfile.name}</h1>
              <p className="text-indigo-100 text-lg mb-2">{mockProfile.title}</p>
              <p className="text-indigo-200 text-sm max-w-md">{mockProfile.bio}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{totalHours} hours learned</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">{streak} day streak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">{completedProjects.length} projects completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button className="flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share Portfolio</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
      >
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'skills', label: 'Skills', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'share', label: 'Share & Export', icon: Share2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'overview' && <OverviewTab userProgress={userProgress} completedProjects={completedProjects} inProgressProjects={inProgressProjects} />}
        {activeTab === 'projects' && <ProjectsTab completedProjects={completedProjects} inProgressProjects={inProgressProjects} />}
        {activeTab === 'skills' && <SkillsTab userProgress={userProgress} />}
        {activeTab === 'achievements' && <AchievementsTab userProgress={userProgress} />}
        {activeTab === 'share' && <ShareTab portfolioUrl={portfolioUrl} isPublic={isPublic} setIsPublic={setIsPublic} onCopyUrl={handleCopyUrl} copied={copied} profile={mockProfile} />}
      </motion.div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ userProgress: any; completedProjects: any[]; inProgressProjects: any[] }> = ({
  userProgress,
  completedProjects,
  inProgressProjects
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Quick Stats */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userProgress.completedModules?.length || 12}
            </div>
            <div className="text-sm text-gray-500">Modules Completed</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedProjects.length}</div>
            <div className="text-sm text-gray-500">Projects Built</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userProgress.achievements?.length || 8}
            </div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Completed', item: 'React Hooks Module', time: '2 hours ago', type: 'module' },
              { action: 'Started', item: 'Kanban Board Blueprint', time: '1 day ago', type: 'project' },
              { action: 'Earned', item: 'Code Warrior Achievement', time: '3 days ago', type: 'achievement' },
              { action: 'Completed', item: 'JavaScript Fundamentals Path', time: '1 week ago', type: 'path' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'module' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'project' ? 'bg-green-100 text-green-600' :
                  activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'module' && <BookOpen className="w-4 h-4" />}
                  {activity.type === 'project' && <Code className="w-4 h-4" />}
                  {activity.type === 'achievement' && <Trophy className="w-4 h-4" />}
                  {activity.type === 'path' && <Target className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action} <span className="text-indigo-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Preview & Learning Streak */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
          <div className="space-y-3">
            {(userProgress.skillsGraph || [
              { skill: 'React', level: 3, experience: 320 },
              { skill: 'JavaScript', level: 5, experience: 580 },
              { skill: 'Node.js', level: 2, experience: 180 },
              { skill: 'CSS', level: 4, experience: 420 }
            ]).slice(0, 4).map((skill) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">Lv.{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Streak</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">7 Days</div>
            <p className="text-sm text-gray-500 mb-4">Keep it up! You're on fire 🔥</p>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${
                    i < 7 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { name: 'Code Warrior', icon: Code, color: 'bg-blue-100 text-blue-600' },
              { name: 'First Steps', icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Goal Crusher', icon: Target, color: 'bg-green-100 text-green-600' }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${achievement.color}`}>
                  <achievement.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects Tab Component
const ProjectsTab: React.FC<{ completedProjects: any[]; inProgressProjects: any[] }> = ({
  completedProjects,
  inProgressProjects
}) => {
  return (
    <div className="space-y-8">
      {/* Completed Projects */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Completed Projects ({completedProjects.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{project.title}</h4>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Completed
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{project.estimatedTime}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress Projects */}
      {inProgressProjects.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">In Progress ({inProgressProjects.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{project.title}</h4>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    In Progress
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{Math.round(project.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Continue Building
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Skills Tab Component
const SkillsTab: React.FC<{ userProgress: any }> = ({ userProgress }) => {
  const skills = userProgress.skillsGraph || [
    { skill: 'React', level: 3, experience: 320, category: 'Frontend' },
    { skill: 'JavaScript', level: 5, experience: 580, category: 'Programming' },
    { skill: 'Node.js', level: 2, experience: 180, category: 'Backend' },
    { skill: 'CSS', level: 4, experience: 420, category: 'Frontend' },
    { skill: 'TypeScript', level: 2, experience: 150, category: 'Programming' },
    { skill: 'MongoDB', level: 2, experience: 120, category: 'Database' },
    { skill: 'Express', level: 3, experience: 200, category: 'Backend' },
    { skill: 'Git', level: 4, experience: 380, category: 'Tools' }
  ];

  const categories = ['All', 'Frontend', 'Backend', 'Programming', 'Database', 'Tools'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Skills ({filteredSkills.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map((skill) => (
            <div key={skill.skill} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(skill.level / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Level {skill.level}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{skill.experience} XP</span>
                <span>{Math.round((skill.experience % 100) / 100 * 100)}% to next level</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Docker', reason: 'Enhance your DevOps skills', difficulty: 'Intermediate' },
            { name: 'GraphQL', reason: 'Modern API development', difficulty: 'Intermediate' },
            { name: 'AWS', reason: 'Cloud deployment skills', difficulty: 'Advanced' }
          ].map((recommendation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">{recommendation.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{recommendation.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {recommendation.difficulty}
                </span>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Achievements Tab Component
const AchievementsTab: React.FC<{ userProgress: any }> = ({ userProgress }) => {
  const achievements = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Completed your first module',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 'code-warrior',
      name: 'Code Warrior',
      description: 'Completed 5 coding challenges',
      icon: Code,
      color: 'bg-green-100 text-green-600',
      earned: true,
      earnedDate: '2024-01-20'
    },
    {
      id: 'goal-crusher',
      name: 'Goal Crusher',
      description: 'Completed a learning path',
      icon: Target,
      color: 'bg-purple-100 text-purple-600',
      earned: true,
      earnedDate: '2024-01-25'
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintained a 30-day learning streak',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      earned: false
    },
    {
      id: 'project-builder',
      name: 'Project Builder',
      description: 'Completed 3 blueprint projects',
      icon: Trophy,
      color: 'bg-red-100 text-red-600',
      earned: false
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Helped 10 other learners',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600',
      earned: false
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-8">
      {/* Earned Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Earned Achievements ({earnedAchievements.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedAchievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${achievement.color}`}>
                <achievement.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{achievement.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              <p className="text-xs text-gray-500">
                Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Locked Achievements ({lockedAchievements.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedAchievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 opacity-60">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <achievement.icon className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{achievement.name}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Share Tab Component
const ShareTab: React.FC<{
  portfolioUrl: string;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  onCopyUrl: () => void;
  copied: boolean;
  profile: any;
}> = ({ portfolioUrl, isPublic, setIsPublic, onCopyUrl, copied, profile }) => {
  return (
    <div className="space-y-8">
      {/* Public Portfolio Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Visibility</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Make Portfolio Public</h4>
            <p className="text-sm text-gray-600">Allow others to view your portfolio via a public link</p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {isPublic && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">Your Public Portfolio URL</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 bg-white border border-indigo-200 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={onCopyUrl}
                className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Social Sharing */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Share on LinkedIn</h4>
              <p className="text-sm text-gray-600">Showcase your achievements</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Twitter className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Share on Twitter</h4>
              <p className="text-sm text-gray-600">Tell the world about your progress</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Github className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Update GitHub Profile</h4>
              <p className="text-sm text-gray-600">Add to your README</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Email Portfolio</h4>
              <p className="text-sm text-gray-600">Send to potential employers</p>
            </div>
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download as PDF</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export as JSON</span>
          </button>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Public Portfolio Preview</h4>
            <p className="text-sm text-gray-600 mb-4">
              See how your portfolio appears to visitors
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Preview Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
