
import React, { useState } from 'react';
import { Class } from '../types';
import { ArrowLeft, Send, Sparkles, User, Bot } from 'lucide-react';
import { chatWithClass } from '../services/geminiService';

interface ClassDetailProps {
  cls: Class;
  onBack: () => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ cls, onBack }) => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question;
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    const answer = await chatWithClass(cls.transcription, userMsg);
    setChat(prev => [...prev, { role: 'ai', text: answer }]);
    setIsTyping(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Regresar al Repositorio
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
            <video controls className="w-full h-full">
              <source src={cls.videoUrl} type="video/mp4" />
            </video>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{cls.title}</h1>
              <span className="text-slate-400 text-sm font-medium">{cls.date}</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                <User className="w-4 h-4" />
                {cls.instructor}
              </div>
              <div className="flex gap-2">
                {cls.tags?.map(t => <span key={t} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">#{t}</span>)}
              </div>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-lg font-bold mb-2">Transcripción Completa</h3>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-light whitespace-pre-line italic">
                "{cls.transcription}"
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col h-[600px] border border-slate-800">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">AI Tutor Fase 2</h3>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Entrenado con esta clase</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
              {chat.length === 0 && (
                <div className="text-center py-10 px-4">
                  <Bot className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">¿Tienes dudas sobre los temas de Armin Salazar o AIWIS en esta clase? ¡Pregúntame!</p>
                </div>
              )}
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none animate-pulse text-blue-400 text-sm">
                    Analizando transcripción...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAsk} className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe tu duda aquí..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
