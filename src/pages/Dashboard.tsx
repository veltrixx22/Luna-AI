import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Cycle, SymptomLog } from "../types";
import { motion } from "motion/react";
import { format, addDays, differenceInDays, parseISO, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Calendar, MessageCircle, ArrowRight, Zap, Droplets, Smile, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [lastLog, setLastLog] = useState<SymptomLog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cyclesRes, symptomsRes] = await Promise.all([
          fetch("/api/cycles"),
          fetch("/api/symptoms"),
        ]);
        const cyclesData = await cyclesRes.json();
        const symptomsData = await symptomsRes.json();
        setCycles(cyclesData);
        if (symptomsData.length > 0) setLastLog(symptomsData[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-luna-rose border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const lastCycle = cycles[0];
  const profile = user?.profile;

  // Calculations
  const today = new Date();
  let daysUntilNext = 0;
  let nextPeriodDateString = "-";
  let cycleDay = 1;
  let statusText = "Dados insuficientes";
  let phaseColor = "text-gray-400";

  if (lastCycle && profile) {
    const lastStart = parseISO(lastCycle.periodStartDate);
    const avgCycle = profile.averageCycleLength;
    const nextPeriodDate = addDays(lastStart, avgCycle);
    
    daysUntilNext = differenceInDays(nextPeriodDate, today);
    nextPeriodDateString = format(nextPeriodDate, "d 'de' MMMM", { locale: ptBR });
    cycleDay = differenceInDays(today, lastStart) + 1;

    if (cycleDay <= profile.averagePeriodDuration) {
      statusText = "Menstruação";
      phaseColor = "text-luna-pink-deep";
    } else if (cycleDay >= avgCycle - 16 && cycleDay <= avgCycle - 12) {
      statusText = "Janela Fértil";
      phaseColor = "text-luna-burgundy";
    } else {
      statusText = "Fase Folicular";
      phaseColor = "text-luna-purple-deep";
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-luna-pink-vibrant to-luna-purple-light rounded-xl flex items-center justify-center shadow-lg">
            <Droplets className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-brand leading-none">Luna AI</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-luna-burgundy opacity-60 font-bold">Bem-vinda</p>
            <p className="text-lg font-brand">{user?.name.split(' ')[0]}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-luna-pink-soft p-1">
            <div className="w-full h-full bg-luna-lilac-soft rounded-full flex items-center justify-center font-serif text-luna-purple-deep">
              {user?.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Status Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Progress Circle SVG */}
          <svg className="absolute w-full h-full -rotate-90">
            <circle cx="144" cy="144" r="130" stroke="#FCE4EC" strokeWidth="16" fill="transparent" />
            <circle 
              cx="144" cy="144" r="130" 
              stroke="url(#grad1)" 
              strokeWidth="16" 
              fill="transparent" 
              strokeDasharray="816" 
              strokeDashoffset={816 - (Math.min(cycleDay, profile?.averageCycleLength || 28) / (profile?.averageCycleLength || 28)) * 816} 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#EC407A', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#AB47BC', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="text-center z-10">
            <p className="text-[10px] uppercase tracking-widest text-luna-burgundy font-bold opacity-50 mb-1">Dia do Ciclo</p>
            <p className="text-8xl font-serif italic text-luna-purple-deep">{cycleDay}</p>
            <div className="mt-4 py-1 px-4 bg-luna-pink-soft text-luna-burgundy rounded-full text-xs font-bold inline-block">
              {statusText}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-12 w-full text-center">
          <div>
            <p className="text-luna-burgundy opacity-60 text-xs font-bold uppercase tracking-wider">Próxima Menstruação</p>
            <p className="text-2xl font-brand mt-1">em {daysUntilNext > 0 ? daysUntilNext : 0} dias</p>
            <p className="text-[10px] text-luna-purple-light font-bold mt-1 uppercase">{nextPeriodDateString}</p>
          </div>
          <div>
            <p className="text-luna-burgundy opacity-60 text-xs font-bold uppercase tracking-wider">Fase do Ciclo</p>
            <p className="text-2xl font-brand mt-1">{statusText}</p>
            <p className="text-[10px] text-luna-purple-light font-bold mt-1 uppercase">Energia & Cuidado</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate("/cycle")}
          className="flex-1 py-5 bg-luna-pink-deep text-white rounded-3xl font-bold shadow-xl shadow-luna-pink-deep/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Registrar
        </button>
        <button 
          onClick={() => navigate("/symptoms")}
          className="flex-1 py-5 bg-white border border-luna-pink-soft text-luna-purple-deep rounded-3xl font-bold shadow-sm hover:bg-luna-pink-soft/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap size={20} />
          Sintomas
        </button>
      </div>

      {/* AI Assistance Section */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/chat")}
        className="bg-gradient-to-br from-luna-purple-deep to-luna-purple-light rounded-[40px] p-8 text-white relative overflow-hidden cursor-pointer shadow-warm"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
          <MessageCircle size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <p className="font-brand text-2xl text-white">Luna AI</p>
          </div>
          
          <div className="bg-white/10 rounded-3xl p-5 text-sm leading-relaxed border border-white/10 italic">
            "Olá {user?.name.split(' ')[0]}! Como você está se sentindo hoje? Se tiver qualquer dúvida sobre sua fase atual, estou aqui para ajudar."
          </div>
          
          <div className="flex items-center justify-between text-white/60">
            <p className="text-[10px] uppercase font-bold tracking-widest">Conversar com Luna</p>
            <ArrowRight size={20} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
