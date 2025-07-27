import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Star,
  Crown,
  Zap,
  Target,
  Flame,
  Gift,
  CheckCircle,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

interface GamificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ isOpen, onClose }) => {
  const { userProgress } = useWebElevateStore();

  const mockAchievements = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Started your first learning path',
      icon: '🚀',
      isUnlocked: true,
      rarity: 'common' as const,
      points: 25
    },
    {
      id: 'react-rookie',
      title: 'React Rookie',
      description: 'Completed 5 React modules',
      icon: '⚛️',
      isUnlocked: userProgress.completedModules.length >= 5,
      rarity: 'rare' as const,
      points: 100
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      isUnlocked: (userProgress.learningStreak?.currentStreak || 0) >= 7,
      rarity: 'epic' as const,
      points: 200
    },
    {
      id: 'code-ninja',
      title: 'Code Ninja',
      description: 'Completed 50 coding challenges',
      icon: '🥷',
      isUnlocked: false,
      rarity: 'legendary' as const,
      points: 500
    }
  ];

  const mockBadges = [
    {
      id: 'react-basics',
      name: 'React Basics',
      description: 'Mastered React fundamentals',
      icon: '⚛️',
      color: 'from-blue-500 to-cyan-500',
      isUnlocked: userProgress.completedModules.length >= 3
    },
    {
      id: 'javascript-pro',
      name: 'JavaScript Pro',
      description: 'Advanced JavaScript skills',
      icon: '🟨',
      color: 'from-yellow-500 to-orange-500',
      isUnlocked: userProgress.completedModules.length >= 10
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Solved 25 coding challenges',
      icon: '🧩',
      color: 'from-purple-500 to-pink-500',
      isUnlocked: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Your Achievements</h2>
                <p className="text-purple-100">Level {userProgress.level} • {userProgress.totalPoints} XP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Progress Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Progress Overview</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userProgress.completedModules.length}</p>
                    <p className="text-sm text-gray-600">Modules Completed</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userProgress.learningStreak?.currentStreak || 0}</p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userProgress.level}</p>
                    <p className="text-sm text-gray-600">Current Level</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Achievements</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-4 border-2 transition-all duration-200 ${
                    achievement.isUnlocked
                      ? getRarityColor(achievement.rarity)
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${achievement.isUnlocked ? '' : 'grayscale'}`}>
                      {achievement.isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          +{achievement.points} XP
                        </span>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                          achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-500" />
              <span>Badges</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-lg p-4 border-2 transition-all duration-200 ${
                    badge.isUnlocked
                      ? 'border-purple-200 bg-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center text-2xl ${
                      badge.isUnlocked ? '' : 'grayscale'
                    }`}>
                      {badge.isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GamificationPanel;
