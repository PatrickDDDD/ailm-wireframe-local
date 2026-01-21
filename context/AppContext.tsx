import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ProjectType, User } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Extend MOCK_PROJECTS with the requested "Unfitted" scenario
  const extendedProjects = [
    ...MOCK_PROJECTS,
    {
      id: '4',
      name: 'AutoML模型未拟合示例',
      description: '演示当数据质量不足导致模型效果不佳时的分析报告',
      subProjectName: '实验组 C - 原始数据',
      type: ProjectType.ML,
      createdAt: new Date('2023-12-20'),
      status: 'deployed', 
      accuracy: 56.4 // Low accuracy to indicate poor fit
    }
  ] as Project[];

  const [projects, setProjects] = useState<Project[]>(extendedProjects);

  const login = (email: string) => {
    // Simulation of login
    setUser({
      email,
      avatar: `https://ui-avatars.com/api/?name=${email}&background=0ea5e9&color=fff`
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addProject = (newProjectData: Omit<Project, 'id' | 'createdAt' | 'status'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      status: 'active', // Default status
      accuracy: newProjectData.type === ProjectType.ML ? 0 : undefined,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppContext.Provider value={{ user, login, logout, projects, addProject, deleteProject }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};