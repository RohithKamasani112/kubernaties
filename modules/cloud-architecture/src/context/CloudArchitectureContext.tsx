import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GamificationSystem, UserProgress } from '../utils/gamificationSystem';
import { ExportSystem, ProjectData } from '../utils/exportSystem';
import { SecurityEngine } from '../utils/securityEngine';

interface CloudArchitectureState {
  userProgress: UserProgress | null;
  currentProject: ProjectData | null;
  isLoading: boolean;
  error: string | null;
  achievements: any[];
  projects: ProjectData[];
}

type CloudArchitectureAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_PROGRESS'; payload: UserProgress }
  | { type: 'SET_CURRENT_PROJECT'; payload: ProjectData | null }
  | { type: 'SET_ACHIEVEMENTS'; payload: any[] }
  | { type: 'SET_PROJECTS'; payload: ProjectData[] }
  | { type: 'ADD_ACHIEVEMENT'; payload: any }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> };

const initialState: CloudArchitectureState = {
  userProgress: null,
  currentProject: null,
  isLoading: false,
  error: null,
  achievements: [],
  projects: [],
};

const cloudArchitectureReducer = (
  state: CloudArchitectureState,
  action: CloudArchitectureAction
): CloudArchitectureState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER_PROGRESS':
      return { ...state, userProgress: action.payload };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_ACHIEVEMENT':
      return { 
        ...state, 
        achievements: [...state.achievements, action.payload] 
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: state.userProgress 
          ? { ...state.userProgress, ...action.payload }
          : null
      };
    default:
      return state;
  }
};

interface CloudArchitectureContextType {
  state: CloudArchitectureState;
  dispatch: React.Dispatch<CloudArchitectureAction>;
  
  // Services
  gamificationSystem: GamificationSystem;
  exportSystem: ExportSystem;
  securityEngine: SecurityEngine;
  
  // Actions
  loadUserProgress: () => void;
  updateUserProgress: (updates: any) => Promise<{ newAchievements: any[]; levelUp: boolean }>;
  saveProject: (project: ProjectData) => void;
  loadProject: (projectId: string) => void;
  loadAllProjects: () => void;
  validateCode: (code: string, resourceType: string, provider: string) => any;
}

const CloudArchitectureContext = createContext<CloudArchitectureContextType | undefined>(undefined);

export const useCloudArchitecture = () => {
  const context = useContext(CloudArchitectureContext);
  if (context === undefined) {
    throw new Error('useCloudArchitecture must be used within a CloudArchitectureProvider');
  }
  return context;
};

interface CloudArchitectureProviderProps {
  children: React.ReactNode;
}

export const CloudArchitectureProvider: React.FC<CloudArchitectureProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cloudArchitectureReducer, initialState);
  
  // Initialize services
  const gamificationSystem = GamificationSystem.getInstance();
  const exportSystem = ExportSystem.getInstance();
  const securityEngine = SecurityEngine.getInstance();

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
    loadAllProjects();
  }, []);

  const loadUserProgress = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const progress = gamificationSystem.getUserProgress('default');
      dispatch({ type: 'SET_USER_PROGRESS', payload: progress });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to load user progress:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user progress' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUserProgress = async (updates: any) => {
    try {
      const result = gamificationSystem.updateProgress('default', updates);
      
      // Reload user progress
      const updatedProgress = gamificationSystem.getUserProgress('default');
      dispatch({ type: 'SET_USER_PROGRESS', payload: updatedProgress });
      
      // Add new achievements
      if (result.newAchievements.length > 0) {
        result.newAchievements.forEach(achievement => {
          dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
        });
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update user progress:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update progress' });
      return { newAchievements: [], levelUp: false };
    }
  };

  const saveProject = (project: ProjectData) => {
    try {
      exportSystem.saveProject(project);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      loadAllProjects(); // Refresh projects list
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to save project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save project' });
    }
  };

  const loadProject = (projectId: string) => {
    try {
      const project = exportSystem.loadProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to load project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load project' });
    }
  };

  const loadAllProjects = () => {
    try {
      const projects = exportSystem.getAllProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to load projects:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' });
    }
  };

  const validateCode = (code: string, resourceType: string, provider: string) => {
    try {
      return securityEngine.validateInfrastructureCode(code, resourceType, provider);
    } catch (error) {
      console.error('Failed to validate code:', error);
      return {
        score: 0,
        issues: [],
        bestPractices: [],
        owaspCompliance: []
      };
    }
  };

  const contextValue: CloudArchitectureContextType = {
    state,
    dispatch,
    gamificationSystem,
    exportSystem,
    securityEngine,
    loadUserProgress,
    updateUserProgress,
    saveProject,
    loadProject,
    loadAllProjects,
    validateCode,
  };

  return (
    <CloudArchitectureContext.Provider value={contextValue}>
      {children}
    </CloudArchitectureContext.Provider>
  );
};
