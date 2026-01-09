
import { Company, Phase, Module, Class, Student } from './types';

const STORAGE_KEY = 'aiwis_portal_db';

interface DB {
  companies: Company[];
  phases: Phase[];
  modules: Module[];
  classes: Class[];
  students: Student[];
}

const INITIAL_DB: DB = {
  companies: [
    { id: 'c1', name: 'AIWIS Global' },
    { id: 'c2', name: 'Tech Corp' }
  ],
  phases: [
    { id: 'p1', name: 'Fase 1: Adopción Básica', companyId: 'c1' },
    { id: 'p2', name: 'Fase 2: Implementación IA', companyId: 'c1' }
  ],
  modules: [
    { id: 'm1', phaseId: 'p1', name: 'Semana 1: Fundamentos' },
    { id: 'm2', phaseId: 'p1', name: 'Semana 2: Herramientas' }
  ],
  classes: [
    { id: 'cls1', moduleId: 'm1', title: 'Introducción a LLMs', description: 'Qué son y cómo funcionan.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ],
  students: [
    { id: 's1', username: 'armin.aiwis', name: 'Armin Salazar', email: 'armin@aiwis.ai', password: '1234', companyId: 'c1', role: 'admin', completedClasses: [] },
    { id: 's2', username: 'alumno1', name: 'Juan Perez', email: 'juan@tech.com', password: '123', companyId: 'c2', role: 'student', completedClasses: [] }
  ]
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
