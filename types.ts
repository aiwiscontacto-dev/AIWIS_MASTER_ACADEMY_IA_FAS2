
export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Class {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  transcription?: string;
  summary?: string;
  quiz?: QuizQuestion[];
  isCompleted?: boolean; // Para el alumno actual
  // Added missing fields to support initialization and UI
  instructor?: string;
  date?: string;
  duration?: string;
  tags?: string[];
}

export interface Module {
  id: string;
  phaseId: string;
  name: string; // Ej: Semana 1
}

export interface Phase {
  id: string;
  name: string; // Ej: Fase 1
  companyId: string;
}

export interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  companyId: string;
  completedClasses: string[]; // IDs de clases vistas
  role: 'admin' | 'student';
  // Added missing fields to support initialization and UI
  progress?: number;
  lastActive?: string;
  avatar?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  url: string;
  category: string;
}

export type ViewType = 'dashboard' | 'content-admin' | 'students-admin' | 'companies-admin' | 'learning' | 'classes' | 'students' | 'content' | 'settings';
