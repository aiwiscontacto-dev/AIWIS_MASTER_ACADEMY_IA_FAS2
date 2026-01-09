
import React from 'react';
import { ViewType } from '../types';
import { LayoutDashboard, Video, Users, FileText, Settings, Award } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Clases y Videos', icon: Video },
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'content', label: 'Materiales', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none">AIWIS</span>
          <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">Fase 2 Adopción</span>
        </div>
      </div>

      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${
              currentView === item.id 
                ? 'bg-blue-600 text-white border-r-4 border-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">AS</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">Armin Salazar</span>
            <span className="text-xs text-slate-400">CEO / Instructor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
