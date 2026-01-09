
import React, { useState, useEffect } from 'react';
import { Student, ViewType, Company, Phase, Module, Class, ContentItem } from './types';
import { getDB, saveDB, generateId } from './store';
import { 
  LayoutDashboard, Users, Building2, BookOpen, Settings, LogOut, 
  Menu, X, CheckCircle2, Circle, ChevronRight, PlayCircle, Sparkles, 
  BrainCircuit, Plus, Edit2, Trash2, Youtube, Video, ExternalLink, Save, ArrowLeft
} from 'lucide-react';
import { summarizeContent, generateQuizFromContent } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<Student | null>(null);
  const [view, setView] = useState<ViewType>('dashboard');
  const [db, setDb] = useState(getDB());
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const updateDB = (newDb: any) => {
    setDb(newDb);
    saveDB(newDb);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = db.students.find(s => s.username === loginForm.username && s.password === loginForm.password);
    if (found) setUser(found);
    else alert('Acceso Denegado: Usuario o Password incorrectos');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-3xl mb-4 shadow-xl shadow-blue-500/20">
              <BrainCircuit className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AIWIS Portal</h1>
            <p className="text-slate-500 text-sm mt-2">Gestión de Adopción de IA Fase 2</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-widest">Usuario</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="ej: armin.aiwis"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-widest">Password</label>
              <input 
                type="password" 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 transform active:scale-95">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  const userCompany = db.companies.find(c => c.id === user.companyId);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 border-r border-slate-800`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">AIWIS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X /></button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={view === 'dashboard'} onClick={() => {setView('dashboard'); setSelectedCompanyId(null);}} />
          <NavItem icon={<BookOpen />} label="Mi Aprendizaje" active={view === 'learning'} onClick={() => {setView('learning'); setSelectedCompanyId(null);}} />
          
          {user.role === 'admin' && (
            <div className="pt-8">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Master Admin</p>
              <NavItem icon={<Building2 />} label="Gestión Empresas" active={view === 'companies-admin'} onClick={() => {setView('companies-admin'); setSelectedCompanyId(null);}} />
              <NavItem icon={<Users />} label="Todos los Alumnos" active={view === 'students-admin'} onClick={() => {setView('students-admin'); setSelectedCompanyId(null);}} />
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-3xl border border-slate-800/50">
            <img src={`https://picsum.photos/seed/${user.id}/100`} className="w-10 h-10 rounded-2xl border border-slate-700" alt="Avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">{userCompany?.name || 'Admin Master'}</p>
            </div>
          </div>
          <button onClick={() => {setUser(null); setView('dashboard');}} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-500 hover:text-white transition-colors bg-slate-800/20 rounded-2xl border border-transparent hover:border-slate-700">
            <LogOut className="w-4 h-4" /> Salir del Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative h-screen">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600"><Menu /></button>
            <h2 className="font-bold text-slate-800 text-lg">
              {selectedCompanyId ? `Admin: ${db.companies.find(c => c.id === selectedCompanyId)?.name}` : 'Panel de Control'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estado</p>
                <p className="text-sm font-bold text-emerald-600">Conectado / Fase 2</p>
             </div>
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-100">
                {user.name.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-8 pb-32">
          {selectedCompanyId ? (
            <CompanyEditor companyId={selectedCompanyId} db={db} updateDB={updateDB} onBack={() => setSelectedCompanyId(null)} />
          ) : (
            <>
              {view === 'dashboard' && <Dashboard user={user} db={db} />}
              {view === 'learning' && <LearningPortal user={user} db={db} updateDB={updateDB} />}
              {view === 'companies-admin' && <CompaniesAdmin db={db} updateDB={updateDB} onManage={setSelectedCompanyId} />}
              {view === 'students-admin' && <StudentsAdmin db={db} updateDB={updateDB} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all transform active:scale-95 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

// --- DASHBOARD ---
const Dashboard = ({ user, db }: any) => {
  const isMaster = user.role === 'admin';
  const myClasses = db.classes.filter((c:any) => {
    const mod = db.modules.find((m:any) => m.id === c.moduleId);
    const ph = db.phases.find((p:any) => p.id === mod?.phaseId);
    return isMaster || ph?.companyId === user.companyId;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-600/30">Bienvenido de nuevo</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Hola, {user.name} 👋</h1>
          <p className="text-slate-400 max-w-xl text-lg mb-10 leading-relaxed">
            {isMaster ? 'Gestiona el ecosistema AIWIS y supervisa la adopción de IA de tus clientes corporativos.' : 'Continúa tu formación en la Fase 2 de Adopción de IA Estratégica.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-xs font-bold uppercase opacity-40 mb-2">Total Empresas</p>
                <p className="text-3xl font-bold">{db.companies.length}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-xs font-bold uppercase opacity-40 mb-2">Clases Disponibles</p>
                <p className="text-3xl font-bold">{myClasses.length}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-xs font-bold uppercase opacity-40 mb-2">Alumnos Activos</p>
                <p className="text-3xl font-bold">{db.students.length}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- GESTIÓN DE EMPRESAS ---
const CompaniesAdmin = ({ db, updateDB, onManage }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const addCompany = () => {
    if (!newCompanyName) return;
    const newCompany = { id: generateId(), name: newCompanyName };
    updateDB({ ...db, companies: [...db.companies, newCompany] });
    setNewCompanyName('');
    setIsAdding(false);
  };

  const deleteCompany = (id: string) => {
    if (!confirm('¿Seguro? Se borrarán fases, módulos, alumnos y clases asociadas.')) return;
    const filteredPhases = db.phases.filter((p:any) => p.companyId !== id);
    const phaseIdsToDelete = db.phases.filter((p:any) => p.companyId === id).map((p:any) => p.id);
    const filteredModules = db.modules.filter((m:any) => !phaseIdsToDelete.includes(m.phaseId));
    const moduleIdsToDelete = db.modules.filter((m:any) => phaseIdsToDelete.includes(m.phaseId)).map((m:any) => m.id);
    const filteredClasses = db.classes.filter((c:any) => !moduleIdsToDelete.includes(c.moduleId));
    const filteredStudents = db.students.filter((s:any) => s.companyId !== id);

    updateDB({
      ...db,
      companies: db.companies.filter((c:any) => c.id !== id),
      phases: filteredPhases,
      modules: filteredModules,
      classes: filteredClasses,
      students: filteredStudents
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Directorio de Empresas</h2>
          <p className="text-slate-500 text-sm">Gestiona los clientes corporativos del portal.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Nueva Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {db.companies.map((company: any) => (
          <div key={company.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all group flex flex-col justify-between h-64">
             <div>
               <div className="flex justify-between items-start mb-4">
                 <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building2 size={24} />
                 </div>
                 <button onClick={() => deleteCompany(company.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                 </button>
               </div>
               <h3 className="text-xl font-bold text-slate-800">{company.name}</h3>
               <p className="text-slate-400 text-xs mt-1 font-mono">{company.id}</p>
             </div>
             <button 
                onClick={() => onManage(company.id)}
                className="w-full mt-6 py-3 bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all"
              >
                Administrar Clases y Alumnos <ChevronRight size={16} />
             </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Nueva Empresa</h3>
            <input 
              autoFocus
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 text-lg mb-8 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la compañía..."
              value={newCompanyName}
              onChange={e => setNewCompanyName(e.target.value)}
            />
            <div className="flex gap-4">
               <button onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
               <button onClick={addCompany} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200">Crear Empresa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- EDITOR DE EMPRESA (JERARQUÍA COMPLETA) ---
const CompanyEditor = ({ companyId, db, updateDB, onBack }: any) => {
  const [activeTab, setActiveTab] = useState<'content' | 'students'>('content');
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const company = db.companies.find((c:any) => c.id === companyId);

  const companyPhases = db.phases.filter((p:any) => p.companyId === companyId);
  const companyStudents = db.students.filter((s:any) => s.companyId === companyId);

  // Phase Actions
  const addPhase = () => {
    const name = prompt('Nombre de la nueva Fase:');
    if (!name) return;
    updateDB({ ...db, phases: [...db.phases, { id: generateId(), companyId, name }] });
  };

  const deletePhase = (id: string) => {
    if (!confirm('¿Borrar fase y todo su contenido?')) return;
    const mToDelete = db.modules.filter((m:any) => m.phaseId === id).map((m:any) => m.id);
    updateDB({
      ...db,
      phases: db.phases.filter((p:any) => p.id !== id),
      modules: db.modules.filter((m:any) => m.phaseId !== id),
      classes: db.classes.filter((c:any) => !mToDelete.includes(c.moduleId))
    });
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-all">
        <ArrowLeft size={20} /> Volver al Directorio
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{company?.name}</h1>
          <p className="text-slate-500 font-medium">Panel de Gestión Jerárquica</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 md:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'content' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Fases y Clases
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex-1 md:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Alumnos ({companyStudents.length})
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Estructura de Aprendizaje</h3>
              <button onClick={addPhase} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Nueva Fase
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-12">
              {companyPhases.map((phase: any) => (
                <div key={phase.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                   <div className="bg-slate-50 px-8 py-6 flex justify-between items-center border-b border-slate-200">
                      <div className="flex items-center gap-4">
                         <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">F</div>
                         <h4 className="text-xl font-bold text-slate-900">{phase.name}</h4>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => deletePhase(phase.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                   </div>
                   <div className="p-8">
                      <ModuleEditor phaseId={phase.id} db={db} updateDB={updateDB} />
                   </div>
                </div>
              ))}
              {companyPhases.length === 0 && (
                <div className="py-20 text-center bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No hay fases creadas aún.</p>
                </div>
              )}
           </div>
        </div>
      ) : (
        <StudentManagerAdmin companyId={companyId} db={db} updateDB={updateDB} />
      )}
    </div>
  );
};

// --- EDITOR DE MÓDULOS (SUB-NIVEL) ---
const ModuleEditor = ({ phaseId, db, updateDB }: any) => {
  const modules = db.modules.filter((m:any) => m.phaseId === phaseId);

  const addModule = () => {
    const name = prompt('Nombre del Módulo (ej: Semana 1):');
    if (!name) return;
    updateDB({ ...db, modules: [...db.modules, { id: generateId(), phaseId, name }] });
  };

  const deleteModule = (id: string) => {
    if (!confirm('¿Borrar módulo y sus clases?')) return;
    updateDB({
      ...db,
      modules: db.modules.filter((m:any) => m.id !== id),
      classes: db.classes.filter((c:any) => c.moduleId !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Módulos por Fase</h5>
        <button onClick={addModule} className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
          <Plus size={14} /> Agregar Módulo
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((mod: any) => (
          <details key={mod.id} className="group bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden open:ring-2 open:ring-blue-100 transition-all">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
              <div className="flex items-center gap-4">
                 <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">M</span>
                 <span className="font-bold text-slate-700">{mod.name}</span>
                 <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                   {db.classes.filter((c:any) => c.moduleId === mod.id).length} Clases
                 </span>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={(e) => {e.preventDefault(); deleteModule(mod.id);}} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                 <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform" size={18} />
              </div>
            </summary>
            <div className="p-6 pt-0 border-t border-slate-100 bg-white">
               <ClassManagerAdmin moduleId={mod.id} db={db} updateDB={updateDB} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

// --- EDITOR DE CLASES (NIVEL FINAL) ---
const ClassManagerAdmin = ({ moduleId, db, updateDB }: any) => {
  const [isEditing, setIsEditing] = useState<any>(null);
  const classes = db.classes.filter((c:any) => c.moduleId === moduleId);

  const saveClass = (cls: any) => {
    const exists = db.classes.find((c:any) => c.id === cls.id);
    if (exists) {
      updateDB({ ...db, classes: db.classes.map((c:any) => c.id === cls.id ? cls : c) });
    } else {
      updateDB({ ...db, classes: [...db.classes, cls] });
    }
    setIsEditing(null);
  };

  const generateAIQuiz = async (cls: any) => {
    if (!cls.description && !cls.transcription) return alert('Sube contenido primero');
    alert('IA trabajando...');
    const quiz = await generateQuizFromContent(cls.transcription || cls.description);
    setIsEditing({ ...cls, quiz });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes.map((cls: any) => (
          <div key={cls.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center group">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                   {cls.videoUrl.includes('youtube') ? <Youtube size={20} /> : <Video size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{cls.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate w-32">{cls.id}</p>
                </div>
             </div>
             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(cls)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit2 size={14} /></button>
                <button onClick={() => updateDB({...db, classes: db.classes.filter((c:any) => c.id !== cls.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
             </div>
          </div>
        ))}
        <button 
          onClick={() => setIsEditing({ id: generateId(), moduleId, title: '', description: '', videoUrl: '', instructor: 'Armin Salazar', tags: [], completedClasses: [] })}
          className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-bold"
        >
          <Plus size={18} /> Nueva Clase
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl space-y-8 scrollbar-hide">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold">Editor de Clase</h3>
                 <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-slate-900"><X /></button>
              </div>

              <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Título de la Clase</label>
                   <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={isEditing.title}
                      onChange={e => setIsEditing({...isEditing, title: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Link YouTube o Google Meet</label>
                   <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="https://youtube.com/..."
                      value={isEditing.videoUrl}
                      onChange={e => setIsEditing({...isEditing, videoUrl: e.target.value})}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Instructor</label>
                      <input 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                          value={isEditing.instructor}
                          onChange={e => setIsEditing({...isEditing, instructor: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Fecha</label>
                      <input 
                          type="date"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                          value={isEditing.date}
                          onChange={e => setIsEditing({...isEditing, date: e.target.value})}
                      />
                    </div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Descripción / Contenido Master</label>
                   <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      value={isEditing.description}
                      onChange={e => setIsEditing({...isEditing, description: e.target.value})}
                   />
                 </div>

                 <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                    <div>
                       <p className="font-bold text-blue-900 text-sm">Funciones de IA</p>
                       <p className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">Powered by Gemini</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => generateAIQuiz(isEditing)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700"
                       >
                         <Sparkles size={14} /> Generar Quiz IA
                       </button>
                    </div>
                 </div>

                 {isEditing.quiz && (
                   <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
                      ✓ Quiz generado con {isEditing.quiz.length} preguntas.
                   </div>
                 )}
              </div>

              <div className="flex gap-4 pt-6">
                 <button onClick={() => setIsEditing(null)} className="flex-1 py-4 font-bold text-slate-400">Cancelar</button>
                 <button onClick={() => saveClass(isEditing)} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    <Save size={18} /> Guardar Clase
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- GESTIÓN DE ALUMNOS POR EMPRESA ---
const StudentManagerAdmin = ({ companyId, db, updateDB }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const students = db.students.filter((s:any) => s.companyId === companyId);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', email: '' });

  const addStudent = () => {
    if (!formData.name || !formData.username || !formData.password) return;
    const newStudent = { ...formData, id: generateId(), companyId, role: 'student', completedClasses: [] };
    updateDB({ ...db, students: [...db.students, newStudent] });
    setFormData({ name: '', username: '', password: '', email: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Cuentas de Alumnos</h3>
          <button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
            <Plus size={18} /> Nuevo Alumno
          </button>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre</th>
                  <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Login / Usuario</th>
                  <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</th>
                  <th className="p-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progreso</th>
                  <th className="p-6 text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {students.map((s: any) => (
                 <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                       <div className="flex items-center gap-3">
                          <img src={`https://picsum.photos/seed/${s.id}/100`} className="w-8 h-8 rounded-lg" />
                          <span className="font-bold text-slate-800">{s.name}</span>
                       </div>
                    </td>
                    <td className="p-6 font-mono text-sm text-blue-600">{s.username}</td>
                    <td className="p-6 font-mono text-sm text-slate-400">{s.password}</td>
                    <td className="p-6">
                       <div className="flex items-center gap-3">
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: `${s.completedClasses.length * 10}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{s.completedClasses.length} Clases</span>
                       </div>
                    </td>
                    <td className="p-6 text-right">
                       <button onClick={() => updateDB({...db, students: db.students.filter((st:any) => st.id !== s.id)})} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                       </button>
                    </td>
                 </tr>
               ))}
               {students.length === 0 && (
                 <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">No hay alumnos asignados a esta empresa.</td></tr>
               )}
            </tbody>
          </table>
       </div>

       {isAdding && (
         <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl space-y-6">
             <h3 className="text-2xl font-bold">Agregar Alumno</h3>
             <div className="space-y-4">
                <input placeholder="Nombre Completo" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <input placeholder="Usuario" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                   <input placeholder="Contraseña" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
             </div>
             <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 font-bold text-slate-400">Cancelar</button>
                <button onClick={addStudent} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200">Guardar Alumno</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

// --- TODOS LOS ALUMNOS (MASTER ADMIN) ---
const StudentsAdmin = ({ db, updateDB }: any) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Censo Global de Alumnos</h2>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-500">
          Total: {db.students.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {db.students.map((s: any) => {
          const company = db.companies.find((c:any) => c.id === s.companyId);
          return (
            <div key={s.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-xl hover:border-blue-200 transition-all">
               <img src={`https://picsum.photos/seed/${s.id}/200`} className="w-20 h-20 rounded-3xl mb-4 shadow-lg" alt="Student" />
               <h4 className="font-bold text-slate-900 leading-tight">{s.name}</h4>
               <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 mb-4">{company?.name || 'Sistema'}</p>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-auto">
                  <div className="h-full bg-emerald-500" style={{ width: `${s.completedClasses.length * 10}%` }}></div>
               </div>
               <div className="flex justify-between w-full mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{s.completedClasses.length} completadas</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {s.id.substr(0,4)}</span>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- PORTAL DE APRENDIZAJE (VISTA ALUMNO) ---
const LearningPortal = ({ user, db, updateDB }: any) => {
  const phases = db.phases.filter((p:any) => p.companyId === user.companyId || user.role === 'admin');
  
  if (phases.length === 0) {
    return (
      <div className="py-40 text-center space-y-4">
        <div className="bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-blue-500">
           <BookOpen size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">No hay contenido asignado</h3>
        <p className="text-slate-500">Comunícate con tu administrador para asignar fases de aprendizaje.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {phases.map((phase: any) => (
        <div key={phase.id} className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
             <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{phase.name}</h3>
          </div>
          
          <div className="space-y-10">
            {db.modules.filter((m:any) => m.phaseId === phase.id).map((module: any) => (
              <div key={module.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">{module.name}</h4>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                
                <div className="flex overflow-x-auto gap-8 pb-6 px-2 no-scrollbar scroll-smooth">
                  {db.classes.filter((c:any) => c.moduleId === module.id).map((cls: any) => {
                    const isDone = user.completedClasses.includes(cls.id);
                    return (
                      <div key={cls.id} className="min-w-[350px] bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col">
                         <div className="aspect-video bg-slate-900 relative">
                            <img src={`https://picsum.photos/seed/${cls.id}/600/400`} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900 transition-all text-white">
                                 <PlayCircle size={32} />
                               </div>
                            </div>
                            {isDone && (
                              <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] font-bold uppercase">
                                 <CheckCircle2 size={14} /> Completado
                              </div>
                            )}
                         </div>
                         <div className="p-8 flex-1 flex flex-col justify-between">
                            <div>
                               <h5 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{cls.title}</h5>
                               <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">{cls.description || 'Sin descripción.'}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
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
                                 className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-2xl border transition-all ${
                                   isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                                 }`}
                               >
                                 {isDone ? 'Ver de nuevo' : 'Ver Clase'}
                               </button>
                               <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.instructor || 'Armin Salazar'}</p>
                                  <p className="text-[10px] text-slate-300 font-medium">Fase 2 IA</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                  {db.classes.filter((c:any) => c.moduleId === module.id).length === 0 && (
                    <div className="w-full text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 italic text-slate-400">
                      Próximamente...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
