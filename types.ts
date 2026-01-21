export enum ProjectType {
  LLM = 'LLM',
  ML = 'ML'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  subProjectName: string;
  type: ProjectType;
  createdAt: Date;
  status: 'active' | 'training' | 'deployed' | 'draft';
  accuracy?: number; // For ML
  modelName?: string; // For LLM
  externalUrl?: string; // For Dify/External integration
}

export interface User {
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}