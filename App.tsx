
import React, { useState, useEffect } from 'react';
import { Student, ViewType, Company, Phase, Module, Class } from './types';
import { getDB, saveDB } from './store';
import { 
  LayoutDashboard, Users, Building2, BookOpen, Settings, LogOut, 
  Menu, X, CheckCircle2, Circle, ChevronRight, PlayCircle, Sparkles, BrainCircuit
} from 'lucide-react';
import { summarizeContent, generateQuizFromContent } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<Student | null>(null);
  const [view, setView] = useState<ViewType>('dashboard');
  const [db, setDb] = useState(getDB());
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Auth Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = db.students.find(s => s.username === loginForm.username && s.password === loginForm.password);
    if (found) setUser(found);
    else alert('Credenciales incorrectas');
  };

  const logout = () => {
    setUser(null);
    setView('dashboard');
  };

  const updateDB = (newDb: any) => {
    setDb(newDb);
    saveDB(newDb);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AIWIS Academy</h1>
            <p className="text-slate-400 text-sm">Portal de Adopción de IA</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Entrar al Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  const userCompany = db.companies.find(c => c.id === user.companyId);
  const userPhases = db.phases.filter(p => p.companyId === user.companyId || user.role === 'admin');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">AIWIS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X /></button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<BookOpen />} label="Mi Aprendizaje" active={view === 'learning'} onClick={() => setView('learning')} />
          
          {user.role === 'admin' && (
            <div className="mt-8">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Administración</p>
              <NavItem icon={<Building2 />} label="Empresas" active={view === 'companies-admin'} onClick={() => setView('companies-admin')} />
              <NavItem icon={<Users />} label="Alumnos" active={view === 'students-admin'} onClick={() => setView('students-admin')} />
              <NavItem icon={<Settings />} label="Contenido Master" active={view === 'content-admin'} onClick={() => setView('content-admin')} />
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl mb-4">
            <img src={`https://picsum.photos/seed/${user.id}/100`} className="w-10 h-10 rounded-full" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase">{userCompany?.name}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600"><Menu /></button>
          <div className="flex items-center gap-2">
             <span className="text-slate-400 text-sm">Empresa:</span>
             <span className="font-bold text-slate-800">{userCompany?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Progreso Total</span>
               <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all" 
                    style={{ width: `${(user.completedClasses.length / Math.max(db.classes.length, 1)) * 100}%` }}
                  ></div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {view === 'dashboard' && <Dashboard user={user} db={db} />}
          {view === 'learning' && <LearningPortal user={user} db={db} updateDB={updateDB} />}
          {view === 'content-admin' && <ContentAdmin db={db} updateDB={updateDB} />}
          {view === 'companies-admin' && <CompaniesAdmin db={db} updateDB={updateDB} />}
          {view === 'students-admin' && <StudentsAdmin db={db} updateDB={updateDB} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {React.cloneElement(icon, { size: 20 })}
    <span className="font-medium">{label}</span>
  </button>
);

// --- Subcomponentes ---

const Dashboard = ({ user, db }: any) => {
  const completed = user.completedClasses.length;
  const total = db.classes.filter((c:any) => {
     const mod = db.modules.find((m:any) => m.id === c.moduleId);
     const phase = db.phases.find((p:any) => p.id === mod?.phaseId);
     return phase?.companyId === user.companyId || user.role === 'admin';
  }).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <Sparkles className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/5" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Hola, {user.name} 👋</h2>
          <p className="text-blue-100 mb-6 max-w-lg">Bienvenido a la Fase 2 de tu transformación con IA. Continúa donde lo dejaste.</p>
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold uppercase opacity-60">Clases Vistas</p>
                <p className="text-2xl font-bold">{completed} / {total}</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold uppercase opacity-60">Puntos IA</p>
                <p className="text-2xl font-bold">{completed * 100}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningPortal = ({ user, db, updateDB }: any) => {
  const phases = db.phases.filter((p:any) => p.companyId === user.companyId || user.role === 'admin');
  
  return (
    <div className="space-y-12">
      {phases.map((phase: any) => (
        <div key={phase.id} className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">{phase.name}</h3>
          
          {db.modules.filter((m:any) => m.phaseId === phase.id).map((module: any) => (
            <div key={module.id} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">{module.name}</h4>
              
              {/* Netflix Style Slider */}
              <div className="flex overflow-x-auto gap-6 pb-4 px-4 no-scrollbar">
                {db.classes.filter((c:any) => c.moduleId === module.id).map((cls: any) => {
                  const isDone = user.completedClasses.includes(cls.id);
                  return (
                    <div key={cls.id} className="min-w-[320px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
                       <div className="aspect-video bg-slate-900 relative">
                          <img src={`https://picsum.photos/seed/${cls.id}/600/400`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                          </div>
                          {isDone && (
                            <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                               <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                       </div>
                       <div className="p-6">
                          <h5 className="font-bold text-slate-900 mb-2 truncate">{cls.title}</h5>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4">{cls.description}</p>
                          <div className="flex items-center justify-between">
                             <button 
                               onClick={() => {
                                 const newStudents = db.students.map((s:any) => {
                                   if (s.id === user.id) {
                                     const list = s.completedClasses.includes(cls.id) 
                                       ? s.completedClasses.filter((id:any) => id !== cls.id)
                                       : [...s.completedClasses, cls.id];
                                     return { ...s, completedClasses: list };
                                   }
                                   return s;
                                 });
                                 updateDB({ ...db, students: newStudents });
                               }}
                               className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                                 isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300'
                               }`}
                             >
                               {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                               {isDone ? 'Completado' : 'Marcar visto'}
                             </button>
                             <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                <ChevronRight className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// --- Panel de Administración Maestro ---

const ContentAdmin = ({ db, updateDB }: any) => {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Configuración de Contenido</h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
          + Nueva Fase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {db.phases.map((p: any) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all group">
            <h3 className="font-bold text-slate-900 mb-4">{p.name}</h3>
            <div className="space-y-2">
               {db.modules.filter((m:any) => m.phaseId === p.id).map((m:any) => (
                 <div key={m.id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-600">{m.name}</span>
                    <button className="text-xs text-blue-600 font-bold hover:underline">Editar</button>
                 </div>
               ))}
            </div>
            <button className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 transition-all">
              + Agregar Módulo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompaniesAdmin = ({ db, updateDB }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Empresas</h2>
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nombre</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {db.companies.map((c: any) => (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-800">{c.name}</td>
              <td className="p-4 text-slate-500 font-mono text-xs">{c.id}</td>
              <td className="p-4 text-right">
                <button className="text-blue-600 text-xs font-bold px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StudentsAdmin = ({ db, updateDB }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Gestión de Alumnos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {db.students.map((s: any) => {
        const company = db.companies.find((c:any) => c.id === s.companyId);
        return (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center group">
             <img src={`https://picsum.photos/seed/${s.id}/200`} className="w-20 h-20 rounded-2xl mb-4 shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform" />
             <h4 className="font-bold text-slate-900">{s.name}</h4>
             <p className="text-xs text-slate-400 mb-2">{s.email}</p>
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 mb-4">{company?.name}</span>
             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all" 
                  style={{ width: `${(s.completedClasses.length / Math.max(db.classes.length, 1)) * 100}%` }}
                ></div>
             </div>
             <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{s.completedClasses.length} clases completadas</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default App;
