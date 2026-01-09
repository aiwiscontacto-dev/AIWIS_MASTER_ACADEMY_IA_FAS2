
import { Company, Phase, Module, Class, Student, ContentItem } from './types';

const STORAGE_KEY = 'aiwis_portal_db_v2';

interface DB {
  companies: Company[];
  phases: Phase[];
  modules: Module[];
  classes: Class[];
  students: Student[];
  content: ContentItem[];
}

const INITIAL_DB: DB = {
  companies: [
    { id: 'c1', name: 'AIWIS Global' }
  ],
  phases: [
    { id: 'p1', name: 'Fase 1: Adopción Básica', companyId: 'c1' },
    { id: 'p2', name: 'Fase 2: Implementación Pro', companyId: 'c1' }
  ],
  modules: [
    { id: 'm1', phaseId: 'p1', name: 'Semana 1: Fundamentos' }
  ],
  classes: [
    { 
      id: 'cls1', 
      moduleId: 'm1', 
      title: 'Bienvenida al Programa', 
      description: 'Primeros pasos en IA.', 
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      instructor: 'Armin Salazar',
      date: '2024-01-01',
      tags: ['Intro']
    },
  ],
  students: [
    { id: 's1', username: 'armin.aiwis', name: 'Armin Salazar', email: 'armin@aiwis.ai', password: '1234', companyId: 'c1', role: 'admin', completedClasses: [] }
  ],
  content: []
};

export const getDB = (): DB => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  return JSON.parse(saved);
};

export const saveDB = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
