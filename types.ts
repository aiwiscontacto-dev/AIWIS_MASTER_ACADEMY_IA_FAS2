
export interface Class {
  id: string;
  title: string;
  description: string;
  instructor: 'AIWIS' | 'Armin Salazar' | 'Both';
  videoUrl: string;
  transcription: string;
  date: string;
  duration: string;
  tags: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  avatar: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'PDF' | 'Link' | 'Doc' | 'Prompt';
  url: string;
  category: string;
}

export type ViewType = 'dashboard' | 'classes' | 'students' | 'content' | 'settings' | 'class-detail';
