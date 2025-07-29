import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Zap, 
  TrendingUp, 
  Award,
  BookOpen,
  Target,
  ChevronRight,
  Play,
  Lock,
  CheckCircle
} from 'lucide-react';
import { debugChallenges } from '../data/debugChallenges';
import { reactDebugChallenges } from '../data/reactDebugChallenges';
import { angularDebugChallenges } from '../data/angularDebugChallenges';
import { nodeDebugChallenges } from '../data/nodeDebugChallenges';
import { allDebugCategories } from '../data/debugPlatformComplete';
import { DebugChallenge, DebugCategory } from '../data/debugPlatformComplete';
import DebugChallengeViewer from './DebugChallengeViewer';

interface DebugPlatformDashboardProps {
  onChallengeSelect?: (challengeId: string) => void;
}

const DebugPlatformDashboard: React.FC<DebugPlatformDashboardProps> = ({ 
  onChallengeSelect 
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'challenges' | 'categories' | 'progress'>('challenges');

  // Use existing challenges and categories
  const allChallenges = [
    ...reactDebugChallenges,
    ...angularDebugChallenges,
    ...nodeDebugChallenges,
    ...debugChallenges
  ];

  // Filter challenges based on search and filters
  const filteredChallenges = allChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = selectedTech === 'all' || challenge.techStack === selectedTech;
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesTech && matchesDifficulty;
  });

  // Handle challenge selection
  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    onChallengeSelect?.(challengeId);
  };

  // Handle back from challenge
  const handleBackFromChallenge = () => {
    setSelectedChallenge(null);
  };

  // If a challenge is selected, show the challenge viewer
  if (selectedChallenge) {
    return (
      <DebugChallengeViewer
        challengeId={selectedChallenge}
        onBack={handleBackFromChallenge}
        onComplete={(challengeId, xpEarned) => {
          console.log(`Challenge ${challengeId} completed! XP earned: ${xpEarned}`);
          // Handle challenge completion
        }}
      />
    );
  }

  const renderChallengeCard = (challenge: DebugChallenge) => (
    <motion.div
      key={challenge.id}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => handleChallengeSelect(challenge.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{challenge.description}</p>
        </div>
        <div className="ml-4 flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {challenge.difficulty}
          </span>
          <span className="text-sm text-gray-500 mt-1">{challenge.techStack}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{challenge.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{challenge.xpReward} XP</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex flex-wrap gap-1">
            {challenge.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {challenge.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{challenge.tags.length - 2}</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );

  const renderCategoryCard = (category: DebugCategory) => (
    <motion.div
      key={category.id}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          category.techStack === 'React' ? 'bg-blue-100 text-blue-800' :
          category.techStack === 'Angular' ? 'bg-red-100 text-red-800' :
          'bg-green-100 text-green-800'
        }`}>
          {category.techStack}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{category.totalChallenges}</div>
          <div className="text-xs text-gray-500">Challenges</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{category.totalXP}</div>
          <div className="text-xs text-gray-500">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{category.estimatedTime}</div>
          <div className="text-xs text-gray-500">Est. Time</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(category.challenges.length / category.totalChallenges) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {category.challenges.length}/{category.totalChallenges}
          </span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Challenges
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Debug Challenges</h1>
                <p className="text-gray-600 mt-1">Master debugging skills with hands-on challenges</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Available Challenges</div>
                  <div className="text-2xl font-bold text-blue-900">{allChallenges.length}</div>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Total XP</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {allChallenges.reduce((sum, c) => sum + c.xpReward, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'challenges', label: 'Challenges', icon: Target },
                  { id: 'categories', label: 'Categories', icon: BookOpen },
                  { id: 'progress', label: 'Progress', icon: TrendingUp }
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
        {activeTab === 'challenges' && (
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
                      placeholder="Search challenges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Technologies</option>
                    <option value="React">React</option>
                    <option value="Angular">Angular</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredChallenges.map(renderChallengeCard)}
              </AnimatePresence>
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {allDebugCategories.map(renderCategoryCard)}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Progress tracking will be implemented here. Track your completed challenges, 
              earned XP, and skill progression across different technologies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPlatformDashboard;
