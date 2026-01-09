
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Video, Clock, TrendingUp } from 'lucide-react';
import { INITIAL_STUDENTS, INITIAL_CLASSES } from '../constants';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Alumnos', value: INITIAL_STUDENTS.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Clases Publicadas', value: INITIAL_CLASSES.length, icon: Video, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Horas de Video', value: '12h 45m', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Compromiso IA', value: '88%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const chartData = INITIAL_STUDENTS.map(s => ({ name: s.name.split(' ')[0], progreso: s.progress ?? 0 }));

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bienvenido al Portal Fase 2</h1>
          <p className="text-slate-500">Gestión de adopción de IA liderada por AIWIS y Armin Salazar.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-200">En Vivo</span>
          <span className="px-3 py-1 bg-slate-50 text-slate-700 text-sm font-bold rounded-full border border-slate-200">Mayo 2024</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Progreso General por Alumno (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="progreso" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {INITIAL_STUDENTS.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center gap-4">
                <img src={student.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">Completó módulo de Prompting</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{student.lastActive}</span>
              </div>
            ))}
            <button className="w-full py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              Ver todos los registros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
