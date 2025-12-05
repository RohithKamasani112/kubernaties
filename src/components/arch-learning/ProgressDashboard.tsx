import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  TrendingUp,
  Target,
  Clock,
  Star,
  Trophy,
  Zap,
  Shield,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Medal,
  Crown,
  Flame
} from 'lucide-react';
import { GamificationSystem, UserProgress, Achievement, LeaderboardEntry } from '../../utils/gamificationSystem';

interface ProgressDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  isOpen,
  onClose,
  userId = 'default'
}) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Achievement['category']>('all');
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);

  const gamificationSystem = GamificationSystem.getInstance();

  useEffect(() => {
    if (isOpen) {
      const progress = gamificationSystem.getUserProgress(userId);
      setUserProgress(progress);
      
      const leaderboardData = gamificationSystem.getLeaderboard(10);
      setLeaderboard(leaderboardData);
    }
  }, [isOpen, userId]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'rare': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'epic': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'legendary': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return <Target className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'architecture': return <Award className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      case 'mastery': return <Crown className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.min((current / total) * 100, 100);
  };

  const filteredAchievements = userProgress?.achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  ) || [];

  const nextAchievement = gamificationSystem.getProgressToNextAchievement(userId);

  if (!isOpen || !userProgress) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Progress Dashboard</h2>
              <p className="text-sm text-slate-600">Track your learning journey and achievements</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Level Badge */}
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-slate-900">Level {userProgress.level}</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'achievements' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'leaderboard' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Leaderboard</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Steps Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{userProgress.statistics.stepsCompleted}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Scenarios</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{userProgress.statistics.scenariosCompleted}</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Total Points</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{userProgress.totalPoints}</div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Current Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{userProgress.currentStreak} days</div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Level Progress</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-slate-900">Level {userProgress.level}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Experience Points</span>
                      <span>{userProgress.experiencePoints} / {userProgress.experienceToNextLevel}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${getProgressPercentage(userProgress.experiencePoints, userProgress.experienceToNextLevel)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Next Achievement */}
                {nextAchievement && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Achievement</h3>
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{nextAchievement.achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{nextAchievement.achievement.title}</h4>
                        <p className="text-sm text-slate-600 mb-3">{nextAchievement.achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Progress</span>
                            <span>{nextAchievement.progress} / {nextAchievement.total}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${getProgressPercentage(nextAchievement.progress, nextAchievement.total)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Achievements */}
                {userProgress.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProgress.achievements
                        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
                        .slice(0, 4)
                        .map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`p-4 rounded-xl border ${getRarityColor(achievement.rarity)}`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{achievement.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{achievement.title}</h4>
                                <p className="text-sm opacity-90">{achievement.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs font-medium">{achievement.rarity.toUpperCase()}</span>
                                  <span className="text-sm font-semibold">+{achievement.points} pts</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 space-y-6"
              >
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedCategory === 'all'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {['learning', 'security', 'architecture', 'collaboration', 'mastery'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as Achievement['category'])}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === category
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {getCategoryIcon(category as Achievement['category'])}
                      <span className="capitalize">{category}</span>
                    </button>
                  ))}
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${getRarityColor(achievement.rarity)}`}
                      onClick={() => setExpandedAchievement(
                        expandedAchievement === achievement.id ? null : achievement.id
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded">
                                {achievement.rarity.toUpperCase()}
                              </span>
                              <span className="text-sm font-semibold">+{achievement.points} pts</span>
                            </div>
                          </div>
                        </div>
                        {expandedAchievement === achievement.id ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </div>
                      
                      {expandedAchievement === achievement.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-white/30"
                        >
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(achievement.category)}
                              <span className="font-medium capitalize">{achievement.category}</span>
                            </div>
                            {achievement.unlockedAt && (
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {filteredAchievements.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Achievements Yet</h3>
                    <p className="text-slate-600">
                      Complete learning steps and scenarios to unlock achievements!
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Leaderboard</h3>
                  <p className="text-slate-600">See how you rank against other learners</p>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Leaderboard Data</h3>
                    <p className="text-slate-600">
                      Be the first to appear on the leaderboard by completing scenarios!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={entry.userId}
                        className={`p-4 rounded-xl border transition-all ${
                          entry.userId === userId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {index < 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {index === 0 ? <Crown className="w-4 h-4" /> :
                                 index === 1 ? <Medal className="w-4 h-4" /> :
                                 <Award className="w-4 h-4" />}
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                                {entry.rank}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-slate-900">{entry.username}</h4>
                              {entry.userId === userId && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>Level {entry.level}</span>
                              <span>{entry.totalPoints} points</span>
                              <span>{entry.achievements} achievements</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900">{entry.totalPoints}</div>
                            <div className="text-xs text-slate-500">points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;
