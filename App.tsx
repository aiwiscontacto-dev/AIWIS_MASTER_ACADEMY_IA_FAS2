
import React, { useState } from 'react';
import { ViewType, Class } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import StudentManager from './components/StudentManager';
import ClassDetail from './components/ClassDetail';
import { INITIAL_CONTENT } from './constants';
import { FileText, Link as LinkIcon, Download, Sparkles } from 'lucide-react';

const ContentManager: React.FC = () => (
  <div className="p-8 space-y-8 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Materiales y Recursos</h2>
      <p className="text-slate-500">Descarga guías, prompts y documentos estratégicos de AIWIS.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {INITIAL_CONTENT.map((item) => (
        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {item.type === 'PDF' ? <FileText className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">{item.category}</span>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 leading-tight">{item.title}</h3>
          <p className="text-xs text-slate-500 mb-6">Última actualización: Enero 2024</p>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            Acceder Recurso
          </button>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const renderContent = () => {
    if (selectedClass) {
      return <ClassDetail cls={selectedClass} onBack={() => setSelectedClass(null)} />;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'classes':
        return <ClassManager onSelectClass={(c) => setSelectedClass(c)} />;
      case 'students':
        return <StudentManager />;
      case 'content':
        return <ContentManager />;
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Configuración del Portal</h2>
            <p className="text-slate-500">Ajustes del sistema de capacitación.</p>
            <div className="mt-8 p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 italic">
              Configuraciones avanzadas de API y Permisos próximamente...
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 ml-64 min-h-screen pb-20">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Servidor AIWIS Activo</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold">Créditos de IA: Ilimitados</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Admin AIWIS</p>
                <p className="text-[10px] text-slate-400 font-medium">Control de Fase 2</p>
              </div>
              <img src="https://picsum.photos/seed/admin/100" className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" alt="Admin" />
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default App;
