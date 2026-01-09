
import { Class, Student, ContentItem } from './types';

export const INITIAL_CLASSES: Class[] = [
  {
    id: '1',
    // Added moduleId to satisfy the Class interface requirements
    moduleId: 'm1',
    title: 'Fundamentos de la Adopción de IA en Corporaciones',
    description: 'Análisis de la infraestructura necesaria para integrar modelos generativos en el flujo de trabajo diario.',
    instructor: 'Armin Salazar',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcription: 'Bienvenidos a la Fase 2 de adopción. Hoy hablaremos sobre cómo la IA no es solo una herramienta, sino un cambio de paradigma organizacional. Armin Salazar aquí, CEO de AIWIS, listo para guiarles...',
    date: '2024-05-10',
    duration: '45:00',
    tags: ['Estrategia', 'C-Level', 'Implementación']
  },
  {
    id: '2',
    // Added moduleId to satisfy the Class interface requirements
    moduleId: 'm1',
    title: 'Optimización de Prompts Avanzados con AIWIS',
    description: 'Taller práctico sobre cómo estructurar prompts que reduzcan alucinaciones y maximicen la precisión del negocio.',
    instructor: 'AIWIS',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    transcription: 'En esta sesión técnica profundizaremos en el Chain-of-Thought y Few-Shot prompting para reportes financieros y análisis de mercado...',
    date: '2024-05-12',
    duration: '58:20',
    tags: ['Técnico', 'Prompt Engineering', 'Productividad']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { 
    id: '101', 
    // Added missing required properties for Student interface
    username: 'ana.martinez', 
    companyId: 'c1', 
    completedClasses: [], 
    role: 'student',
    name: 'Ana Martínez', 
    email: 'ana.m@empresa.com', 
    progress: 85, 
    lastActive: 'Hoy', 
    avatar: 'https://picsum.photos/seed/ana/100' 
  },
  { 
    id: '102', 
    // Added missing required properties for Student interface
    username: 'carlos.ruiz', 
    companyId: 'c1', 
    completedClasses: [], 
    role: 'student',
    name: 'Carlos Ruiz', 
    email: 'carlos.r@empresa.com', 
    progress: 42, 
    lastActive: 'Ayer', 
    avatar: 'https://picsum.photos/seed/carlos/100' 
  },
  { 
    id: '103', 
    // Added missing required properties for Student interface
    username: 'sofia.valdes', 
    companyId: 'c1', 
    completedClasses: [], 
    role: 'student',
    name: 'Sofía Valdés', 
    email: 'sofia.v@empresa.com', 
    progress: 100, 
    lastActive: 'Hace 3 días', 
    avatar: 'https://picsum.photos/seed/sofia/100' 
  },
  { 
    id: '104', 
    // Added missing required properties for Student interface
    username: 'jorge.blanco', 
    companyId: 'c1', 
    completedClasses: [], 
    role: 'student',
    name: 'Jorge Blanco', 
    email: 'jorge.b@empresa.com', 
    progress: 15, 
    lastActive: 'Hace 1 hora', 
    avatar: 'https://picsum.photos/seed/jorge/100' 
  },
];

export const INITIAL_CONTENT: ContentItem[] = [
  { id: 'c1', title: 'Guía de Ética en IA 2024', type: 'PDF', url: '#', category: 'Compliance' },
  { id: 'c2', title: 'Repositorio de Prompts Maestros', type: 'Prompt', url: '#', category: 'Recursos' },
  { id: 'c3', title: 'Calculadora de ROI de Implementación', type: 'Doc', url: '#', category: 'Finanzas' },
];
