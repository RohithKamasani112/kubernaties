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

  // Use existing challenges and categories (deduplicated)
  const allChallenges = [
    ...reactDebugChallenges,
    ...angularDebugChallenges,
    ...nodeDebugChallenges,
    ...debugChallenges
  ].filter((challenge, index, array) =>
    array.findIndex(c => c.id === challenge.id) === index
  );

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
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleChallengeSelect(challenge.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {challenge.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{challenge.description}</p>
        </div>
        <div className="ml-4 flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            challenge.difficulty === 'beginner' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
            challenge.difficulty === 'intermediate' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
            'bg-gradient-to-r from-red-400 to-red-500 text-white'
          }`}>
            {challenge.difficulty.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            {challenge.techStack}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{challenge.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-lg">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">{challenge.xpReward} XP</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-wrap gap-1">
            {challenge.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {challenge.tags.length > 2 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{challenge.tags.length - 2}
              </span>
            )}
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  🐛 Debug Challenges
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mt-3 max-w-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Master debugging skills with hands-on challenges across React, Angular, and Node.js
                </motion.p>
              </div>

              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl shadow-lg">
                  <div className="text-sm text-blue-100 font-medium">Available Challenges</div>
                  <div className="text-3xl font-bold text-white">{allChallenges.length}</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 rounded-xl shadow-lg">
                  <div className="text-sm text-purple-100 font-medium">Total XP</div>
                  <div className="text-3xl font-bold text-white">
                    {allChallenges.reduce((sum, c) => sum + c.xpReward, 0)}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tab Navigation */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <nav className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
                {[
                  { id: 'challenges', label: 'Challenges', icon: Target },
                  { id: 'categories', label: 'Categories', icon: BookOpen },
                  { id: 'progress', label: 'Progress', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
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
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Progress tracking will be implemented here. Track your completed challenges,
              earned XP, and skill progression across different technologies.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-xl text-white">
                <div className="text-3xl font-bold">0</div>
                <div className="text-green-100">Challenges Completed</div>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-xl text-white">
                <div className="text-3xl font-bold">0</div>
                <div className="text-blue-100">Total XP Earned</div>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-xl text-white">
                <div className="text-3xl font-bold">0</div>
                <div className="text-purple-100">Skills Mastered</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebugPlatformDashboard;
