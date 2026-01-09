
import React, { useState } from 'react';
import { Class } from '../types';
import { INITIAL_CLASSES } from '../constants';
// Added Award to the import list to resolve the "Cannot find name 'Award'" error
import { Plus, Play, MoreVertical, MessageSquare, ListRestart, Award } from 'lucide-react';
import { summarizeTranscript } from '../services/geminiService';

interface ClassManagerProps {
  onSelectClass: (c: Class) => void;
}

const ClassManager: React.FC<ClassManagerProps> = ({ onSelectClass }) => {
  const [classes, setClasses] = useState<Class[]>(INITIAL_CLASSES);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

  const handleSummarize = async (id: string, transcript: string | undefined) => {
    setLoadingSummary(id);
    const summary = await summarizeTranscript(transcript);
    setSummaries(prev => ({ ...prev, [id]: summary }));
    setLoadingSummary(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Repositorio de Clases</h2>
          <p className="text-slate-500">Fase 2: Estrategia de IA por Armin Salazar & AIWIS</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm">
          <Plus className="w-5 h-5" />
          Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col hover:shadow-lg transition-all group">
            <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectClass(cls)}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <Play className="text-white w-12 h-12 fill-current" />
              </div>
              <img src={`https://picsum.photos/seed/${cls.id}/600/400`} alt={cls.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded">
                {cls.duration}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                  Instructor: {cls.instructor}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {cls.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                {cls.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {cls.tags?.map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => onSelectClass(cls)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Transcripción
                </button>
                <button 
                  onClick={() => handleSummarize(cls.id, cls.transcription)}
                  disabled={loadingSummary === cls.id}
                  className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  title="Generar Resumen con IA"
                >
                  <ListRestart className={`w-5 h-5 ${loadingSummary === cls.id ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {summaries[cls.id] && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-900 animate-fadeIn">
                  <div className="font-bold flex items-center gap-2 mb-2">
                    {/* Fixed whitespace in JSX tag and ensured Award is available */}
                    <Award className="w-4 h-4" /> Resumen IA
                  </div>
                  {summaries[cls.id]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassManager;
