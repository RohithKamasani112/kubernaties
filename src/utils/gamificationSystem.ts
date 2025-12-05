export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'security' | 'architecture' | 'collaboration' | 'mastery';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'steps_completed' | 'scenarios_completed' | 'security_score' | 'best_practices' | 'time_spent' | 'streak';
    value: number;
    provider?: string;
    level?: string;
  };
  unlockedAt?: Date;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  achievements: Achievement[];
  completedScenarios: string[];
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  lastActiveDate: Date;
  statistics: {
    stepsCompleted: number;
    scenariosCompleted: number;
    averageSecurityScore: number;
    bestPracticesFollowed: number;
    projectsSaved: number;
    projectsExported: number;
  };
  badges: {
    id: string;
    earnedAt: Date;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  level: number;
  achievements: number;
  completedScenarios: number;
  rank: number;
}

export class GamificationSystem {
  private static instance: GamificationSystem;
  private storageKey = 'kubequest-user-progress';
  private leaderboardKey = 'kubequest-leaderboard';

  public static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem();
    }
    return GamificationSystem.instance;
  }

  private achievements: Achievement[] = [
    // Learning Achievements
    {
      id: 'first-step',
      title: 'First Steps',
      description: 'Complete your first learning step',
      icon: '🎯',
      category: 'learning',
      points: 10,
      rarity: 'common',
      requirements: { type: 'steps_completed', value: 1 }
    },
    {
      id: 'quick-learner',
      title: 'Quick Learner',
      description: 'Complete 10 learning steps',
      icon: '⚡',
      category: 'learning',
      points: 50,
      rarity: 'common',
      requirements: { type: 'steps_completed', value: 10 }
    },
    {
      id: 'dedicated-student',
      title: 'Dedicated Student',
      description: 'Complete 50 learning steps',
      icon: '📚',
      category: 'learning',
      points: 200,
      rarity: 'rare',
      requirements: { type: 'steps_completed', value: 50 }
    },
    {
      id: 'master-architect',
      title: 'Master Architect',
      description: 'Complete 100 learning steps',
      icon: '🏗️',
      category: 'learning',
      points: 500,
      rarity: 'epic',
      requirements: { type: 'steps_completed', value: 100 }
    },

    // Security Achievements
    {
      id: 'security-conscious',
      title: 'Security Conscious',
      description: 'Achieve a security score of 90 or higher',
      icon: '🛡️',
      category: 'security',
      points: 75,
      rarity: 'rare',
      requirements: { type: 'security_score', value: 90 }
    },
    {
      id: 'security-expert',
      title: 'Security Expert',
      description: 'Maintain a security score of 95+ for 5 scenarios',
      icon: '🔒',
      category: 'security',
      points: 150,
      rarity: 'epic',
      requirements: { type: 'security_score', value: 95 }
    },
    {
      id: 'best-practices-advocate',
      title: 'Best Practices Advocate',
      description: 'Follow 25 best practices recommendations',
      icon: '✅',
      category: 'security',
      points: 100,
      rarity: 'rare',
      requirements: { type: 'best_practices', value: 25 }
    },

    // Architecture Achievements
    {
      id: 'aws-beginner',
      title: 'AWS Beginner',
      description: 'Complete your first AWS scenario',
      icon: '🟠',
      category: 'architecture',
      points: 25,
      rarity: 'common',
      requirements: { type: 'scenarios_completed', value: 1, provider: 'aws' }
    },
    {
      id: 'azure-beginner',
      title: 'Azure Beginner',
      description: 'Complete your first Azure scenario',
      icon: '🔵',
      category: 'architecture',
      points: 25,
      rarity: 'common',
      requirements: { type: 'scenarios_completed', value: 1, provider: 'azure' }
    },
    {
      id: 'gcp-beginner',
      title: 'GCP Beginner',
      description: 'Complete your first GCP scenario',
      icon: '🟢',
      category: 'architecture',
      points: 25,
      rarity: 'common',
      requirements: { type: 'scenarios_completed', value: 1, provider: 'gcp' }
    },
    {
      id: 'multi-cloud-architect',
      title: 'Multi-Cloud Architect',
      description: 'Complete scenarios on all three major cloud providers',
      icon: '☁️',
      category: 'architecture',
      points: 200,
      rarity: 'epic',
      requirements: { type: 'scenarios_completed', value: 3 }
    },

    // Mastery Achievements
    {
      id: 'scenario-master',
      title: 'Scenario Master',
      description: 'Complete 10 different scenarios',
      icon: '🏆',
      category: 'mastery',
      points: 300,
      rarity: 'epic',
      requirements: { type: 'scenarios_completed', value: 10 }
    },
    {
      id: 'cloud-expert',
      title: 'Cloud Expert',
      description: 'Complete 25 different scenarios',
      icon: '👑',
      category: 'mastery',
      points: 750,
      rarity: 'legendary',
      requirements: { type: 'scenarios_completed', value: 25 }
    },
    {
      id: 'learning-streak',
      title: 'Learning Streak',
      description: 'Learn for 7 consecutive days',
      icon: '🔥',
      category: 'learning',
      points: 100,
      rarity: 'rare',
      requirements: { type: 'streak', value: 7 }
    },
    {
      id: 'marathon-learner',
      title: 'Marathon Learner',
      description: 'Spend 10 hours learning',
      icon: '⏰',
      category: 'learning',
      points: 200,
      rarity: 'rare',
      requirements: { type: 'time_spent', value: 600 } // 600 minutes = 10 hours
    }
  ];

  public getUserProgress(userId: string = 'default'): UserProgress {
    try {
      const data = localStorage.getItem(`${this.storageKey}-${userId}`);
      if (data) {
        const progress = JSON.parse(data);
        // Convert date strings back to Date objects
        progress.lastActiveDate = new Date(progress.lastActiveDate);
        progress.achievements.forEach((achievement: Achievement) => {
          if (achievement.unlockedAt) {
            achievement.unlockedAt = new Date(achievement.unlockedAt);
          }
        });
        progress.badges.forEach((badge: any) => {
          badge.earnedAt = new Date(badge.earnedAt);
        });
        return progress;
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }

    // Return default progress
    return {
      userId,
      totalPoints: 0,
      level: 1,
      experiencePoints: 0,
      experienceToNextLevel: 100,
      achievements: [],
      completedScenarios: [],
      currentStreak: 0,
      longestStreak: 0,
      totalTimeSpent: 0,
      lastActiveDate: new Date(),
      statistics: {
        stepsCompleted: 0,
        scenariosCompleted: 0,
        averageSecurityScore: 0,
        bestPracticesFollowed: 0,
        projectsSaved: 0,
        projectsExported: 0
      },
      badges: []
    };
  }

  public saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(`${this.storageKey}-${progress.userId}`, JSON.stringify(progress));
      this.updateLeaderboard(progress);
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  public updateProgress(
    userId: string = 'default',
    updates: {
      stepsCompleted?: number;
      scenariosCompleted?: string[];
      securityScore?: number;
      bestPracticesFollowed?: number;
      timeSpent?: number;
      projectsSaved?: number;
      projectsExported?: number;
    }
  ): { newAchievements: Achievement[]; levelUp: boolean } {
    const progress = this.getUserProgress(userId);
    const newAchievements: Achievement[] = [];
    let levelUp = false;

    // Update statistics
    if (updates.stepsCompleted !== undefined) {
      progress.statistics.stepsCompleted += updates.stepsCompleted;
    }
    if (updates.scenariosCompleted) {
      updates.scenariosCompleted.forEach(scenarioId => {
        if (!progress.completedScenarios.includes(scenarioId)) {
          progress.completedScenarios.push(scenarioId);
          progress.statistics.scenariosCompleted++;
        }
      });
    }
    if (updates.securityScore !== undefined) {
      const currentAvg = progress.statistics.averageSecurityScore;
      const totalScenarios = progress.statistics.scenariosCompleted;
      progress.statistics.averageSecurityScore = 
        (currentAvg * (totalScenarios - 1) + updates.securityScore) / totalScenarios;
    }
    if (updates.bestPracticesFollowed !== undefined) {
      progress.statistics.bestPracticesFollowed += updates.bestPracticesFollowed;
    }
    if (updates.timeSpent !== undefined) {
      progress.totalTimeSpent += updates.timeSpent;
    }
    if (updates.projectsSaved !== undefined) {
      progress.statistics.projectsSaved += updates.projectsSaved;
    }
    if (updates.projectsExported !== undefined) {
      progress.statistics.projectsExported += updates.projectsExported;
    }

    // Update streak
    const today = new Date();
    const lastActive = new Date(progress.lastActiveDate);
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      progress.currentStreak++;
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }
    } else if (daysDiff > 1) {
      progress.currentStreak = 1;
    }
    
    progress.lastActiveDate = today;

    // Check for new achievements
    this.achievements.forEach(achievement => {
      if (!progress.achievements.find(a => a.id === achievement.id)) {
        if (this.checkAchievementRequirements(achievement, progress)) {
          const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
          progress.achievements.push(unlockedAchievement);
          newAchievements.push(unlockedAchievement);
          progress.totalPoints += achievement.points;
          progress.experiencePoints += achievement.points;
        }
      }
    });

    // Check for level up
    while (progress.experiencePoints >= progress.experienceToNextLevel) {
      progress.experiencePoints -= progress.experienceToNextLevel;
      progress.level++;
      progress.experienceToNextLevel = this.calculateExperienceToNextLevel(progress.level);
      levelUp = true;
    }

    this.saveUserProgress(progress);

    return { newAchievements, levelUp };
  }

  private checkAchievementRequirements(achievement: Achievement, progress: UserProgress): boolean {
    const req = achievement.requirements;
    
    switch (req.type) {
      case 'steps_completed':
        return progress.statistics.stepsCompleted >= req.value;
      case 'scenarios_completed':
        if (req.provider) {
          const providerScenarios = progress.completedScenarios.filter(id => 
            id.includes(req.provider!)
          );
          return providerScenarios.length >= req.value;
        }
        return progress.statistics.scenariosCompleted >= req.value;
      case 'security_score':
        return progress.statistics.averageSecurityScore >= req.value;
      case 'best_practices':
        return progress.statistics.bestPracticesFollowed >= req.value;
      case 'time_spent':
        return progress.totalTimeSpent >= req.value;
      case 'streak':
        return progress.currentStreak >= req.value;
      default:
        return false;
    }
  }

  private calculateExperienceToNextLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  public getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(this.leaderboardKey);
      if (data) {
        const leaderboard = JSON.parse(data);
        return leaderboard.slice(0, limit);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    return [];
  }

  private updateLeaderboard(progress: UserProgress): void {
    try {
      let leaderboard = this.getLeaderboard(100); // Get top 100
      
      // Remove existing entry for this user
      leaderboard = leaderboard.filter(entry => entry.userId !== progress.userId);
      
      // Add updated entry
      leaderboard.push({
        userId: progress.userId,
        username: `User ${progress.userId}`, // In a real app, this would come from user data
        totalPoints: progress.totalPoints,
        level: progress.level,
        achievements: progress.achievements.length,
        completedScenarios: progress.statistics.scenariosCompleted,
        rank: 0 // Will be calculated below
      });
      
      // Sort by total points (descending)
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
      
      // Assign ranks
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
      
      localStorage.setItem(this.leaderboardKey, JSON.stringify(leaderboard));
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
    }
  }

  public getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  public getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  public getUserRank(userId: string = 'default'): number {
    const leaderboard = this.getLeaderboard(1000);
    const entry = leaderboard.find(entry => entry.userId === userId);
    return entry?.rank || 0;
  }

  public getProgressToNextAchievement(userId: string = 'default'): {
    achievement: Achievement;
    progress: number;
    total: number;
  } | null {
    const userProgress = this.getUserProgress(userId);
    const unlockedIds = userProgress.achievements.map(a => a.id);
    
    const nextAchievements = this.achievements
      .filter(achievement => !unlockedIds.includes(achievement.id))
      .map(achievement => {
        const req = achievement.requirements;
        let current = 0;
        
        switch (req.type) {
          case 'steps_completed':
            current = userProgress.statistics.stepsCompleted;
            break;
          case 'scenarios_completed':
            current = userProgress.statistics.scenariosCompleted;
            break;
          case 'security_score':
            current = userProgress.statistics.averageSecurityScore;
            break;
          case 'best_practices':
            current = userProgress.statistics.bestPracticesFollowed;
            break;
          case 'time_spent':
            current = userProgress.totalTimeSpent;
            break;
          case 'streak':
            current = userProgress.currentStreak;
            break;
        }
        
        return {
          achievement,
          progress: Math.min(current, req.value),
          total: req.value
        };
      })
      .filter(item => item.progress < item.total)
      .sort((a, b) => (b.progress / b.total) - (a.progress / a.total));
    
    return nextAchievements[0] || null;
  }
}
