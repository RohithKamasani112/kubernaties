// Gamification System for Cloud Architecture Learning

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xp: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  scenariosCompleted: number;
  totalTime: number;
  currentStreak: number;
  level: number;
  xp: number;
  achievements: string[];
  categories: {
    [key: string]: number;
  };
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  title: string;
  benefits: string[];
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

export class GamificationSystem {
  private static instance: GamificationSystem;
  private achievements: Achievement[] = [];
  private levels: LevelInfo[] = [];

  private constructor() {
    this.initializeAchievements();
    this.initializeLevels();
  }

  public static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem();
    }
    return GamificationSystem.instance;
  }

  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first-scenario',
        title: 'First Steps',
        description: 'Complete your first scenario',
        icon: '🎯',
        rarity: 'Common',
        xp: 50,
        condition: (stats) => stats.scenariosCompleted >= 1
      },
      {
        id: 'web-master',
        title: 'Web Architecture Master',
        description: 'Complete 5 web application scenarios',
        icon: '🌐',
        rarity: 'Rare',
        xp: 200,
        condition: (stats) => (stats.categories['Web Applications'] || 0) >= 5
      },
      {
        id: 'security-expert',
        title: 'Security Expert',
        description: 'Complete all security scenarios',
        icon: '🛡️',
        rarity: 'Epic',
        xp: 500,
        condition: (stats) => (stats.categories['Security'] || 0) >= 3
      },
      {
        id: 'speed-runner',
        title: 'Speed Runner',
        description: 'Complete a scenario in under 15 minutes',
        icon: '⚡',
        rarity: 'Rare',
        xp: 150,
        condition: (stats) => stats.scenariosCompleted >= 1 // Simplified for demo
      },
      {
        id: 'data-architect',
        title: 'Data Architect',
        description: 'Master all data pipeline scenarios',
        icon: '📊',
        rarity: 'Epic',
        xp: 400,
        condition: (stats) => (stats.categories['Data & Analytics'] || 0) >= 3
      },
      {
        id: 'cloud-native',
        title: 'Cloud Native',
        description: 'Complete 10 scenarios using serverless',
        icon: '☁️',
        rarity: 'Legendary',
        xp: 1000,
        condition: (stats) => (stats.categories['Serverless'] || 0) >= 10
      }
    ];
  }

  private initializeLevels(): void {
    this.levels = [
      {
        level: 1,
        xpRequired: 0,
        title: 'Cloud Novice',
        benefits: ['Access to basic scenarios', 'Progress tracking']
      },
      {
        level: 2,
        xpRequired: 500,
        title: 'Cloud Explorer',
        benefits: ['Intermediate scenarios unlocked', 'Export to PDF']
      },
      {
        level: 3,
        xpRequired: 1500,
        title: 'Cloud Architect',
        benefits: ['Advanced scenarios unlocked', 'Terraform export']
      },
      {
        level: 4,
        xpRequired: 3000,
        title: 'Cloud Expert',
        benefits: ['Expert scenarios unlocked', 'Custom templates']
      },
      {
        level: 5,
        xpRequired: 5000,
        title: 'Cloud Master',
        benefits: ['All features unlocked', 'Priority support']
      }
    ];
  }

  public checkAchievements(stats: UserStats): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    for (const achievement of this.achievements) {
      if (!stats.achievements.includes(achievement.id) && achievement.condition(stats)) {
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  }

  public calculateLevel(xp: number): LevelInfo {
    let currentLevel = this.levels[0];
    
    for (const level of this.levels) {
      if (xp >= level.xpRequired) {
        currentLevel = level;
      } else {
        break;
      }
    }
    
    return currentLevel;
  }

  public getNextLevel(currentLevel: number): LevelInfo | null {
    return this.levels.find(level => level.level === currentLevel + 1) || null;
  }

  public calculateXpForScenario(difficulty: string, timeSpent: number): number {
    const baseXp = {
      'Beginner': 50,
      'Intermediate': 100,
      'Advanced': 200
    };

    let xp = baseXp[difficulty as keyof typeof baseXp] || 50;
    
    // Bonus for completing quickly
    if (timeSpent < 900) { // Less than 15 minutes
      xp += 25;
    }
    
    return xp;
  }

  public getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find(achievement => achievement.id === id);
  }

  public getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getLevels(): LevelInfo[] {
    return [...this.levels];
  }

  public getUserProgress(userId: string = 'default'): UserProgress {
    try {
      const data = localStorage.getItem(`cloud-arch-progress-${userId}`);
      if (data) {
        const progress = JSON.parse(data);
        // Convert date strings back to Date objects
        progress.lastActiveDate = new Date(progress.lastActiveDate);
        progress.achievements.forEach((achievement: Achievement & { unlockedAt?: Date }) => {
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
      experienceToNextLevel: 500,
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
      localStorage.setItem(`cloud-arch-progress-${progress.userId}`, JSON.stringify(progress));
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
        totalScenarios > 1 ? (currentAvg * (totalScenarios - 1) + updates.securityScore) / totalScenarios : updates.securityScore;
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
        const userStats: UserStats = {
          scenariosCompleted: progress.statistics.scenariosCompleted,
          totalTime: progress.totalTimeSpent,
          currentStreak: progress.currentStreak,
          level: progress.level,
          xp: progress.experiencePoints,
          achievements: progress.achievements.map(a => a.id),
          categories: {} // Simplified for now
        };

        if (achievement.condition(userStats)) {
          const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
          progress.achievements.push(unlockedAchievement);
          newAchievements.push(unlockedAchievement);
          progress.totalPoints += achievement.xp;
          progress.experiencePoints += achievement.xp;
        }
      }
    });

    // Check for level up
    while (progress.experiencePoints >= progress.experienceToNextLevel) {
      progress.experiencePoints -= progress.experienceToNextLevel;
      progress.level++;
      const nextLevel = this.getNextLevel(progress.level);
      progress.experienceToNextLevel = nextLevel ? nextLevel.xpRequired - this.calculateLevel(progress.totalPoints).xpRequired : 1000;
      levelUp = true;
    }

    this.saveUserProgress(progress);

    return { newAchievements, levelUp };
  }
}

export default GamificationSystem;
