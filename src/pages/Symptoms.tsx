import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Smile, Frown, Meh, Zap, Droplets, Heart, Thermometer, Brain, Moon, Coffee, ArrowLeft } from "lucide-react";

export default function Symptoms() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    flowIntensity: "none",
    crampsLevel: "none",
    mood: "calm",
    symptoms: [] as string[],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const symptomOptions = [
    { id: "headache", label: "Dor de cabeça", icon: Brain },
    { id: "bloating", label: "Inchaço", icon: Thermometer },
    { id: "cramps", label: "Cólicas", icon: Zap },
    { id: "acne", label: "Acne", icon: Sparkles },
    { id: "backpain", label: "Dor lombar", icon: Heart },
    { id: "breast_tender", label: "Sensibilidade", icon: Heart },
    { id: "nausea", label: "Náusea", icon: Coffee },
    { id: "fatigue", label: "Cansaço", icon: Moon },
  ];

  const handleSymptomToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(id) 
        ? prev.symptoms.filter(s => s !== id) 
        : [...prev.symptoms, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Como você está hoje?</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date */}
        <section className="glass-card p-6">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-4">Data do Registro</label>
          <input 
            type="date" 
            className="input-field" 
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </section>

        {/* Mood */}
        <section className="glass-card p-6">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-6">Seu Humor</label>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "happy", label: "Feliz", icon: Smile, color: "text-green-500" },
              { id: "calm", label: "Calma", icon: Heart, color: "text-blue-400" },
              { id: "irritated", label: "Irritada", icon: Zap, color: "text-orange-500" },
              { id: "sad", label: "Triste", icon: Frown, color: "text-purple-500" },
              { id: "anxious", label: "Ansiosa", icon: Brain, color: "text-indigo-400" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormData({ ...formData, mood: m.id })}
                className={`flex flex-col items-center gap-2 p-4 min-w-[80px] rounded-2xl border-2 transition-all ${formData.mood === m.id ? 'border-luna-rose bg-luna-rose/5' : 'border-transparent bg-luna-bg'}`}
              >
                <m.icon size={24} className={formData.mood === m.id ? 'text-luna-rose' : m.color} />
                <span className="text-[10px] font-bold uppercase">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-4">Fluxo Menstrual</label>
            <div className="space-y-2">
              {["none", "light", "medium", "heavy"].map((level) => (
                <label key={level} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${formData.flowIntensity === level ? 'bg-luna-rose/10 text-luna-rose' : 'hover:bg-gray-50 text-gray-600'}`}>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="flow" 
                    checked={formData.flowIntensity === level} 
                    onChange={() => setFormData({ ...formData, flowIntensity: level })}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.flowIntensity === level ? 'border-luna-rose' : 'border-gray-200'}`}>
                    {formData.flowIntensity === level && <div className="w-2.5 h-2.5 bg-luna-rose rounded-full" />}
                  </div>
                  <span className="text-sm font-bold capitalize">{level === 'none' ? 'Nenhum' : level === 'light' ? 'Leve' : level === 'medium' ? 'Médio' : 'Intenso'}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="glass-card p-6">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-4">Nível de Cólica</label>
            <div className="space-y-2">
              {["none", "light", "medium", "intense"].map((level) => (
                <label key={level} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${formData.crampsLevel === level ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="cramps" 
                    checked={formData.crampsLevel === level} 
                    onChange={() => setFormData({ ...formData, crampsLevel: level })}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.crampsLevel === level ? 'border-orange-500' : 'border-gray-200'}`}>
                    {formData.crampsLevel === level && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                  </div>
                  <span className="text-sm font-bold capitalize">{level === 'none' ? 'Nenhuma' : level === 'light' ? 'Leve' : level === 'medium' ? 'Média' : 'Forte'}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Symptoms Checklist */}
        <section className="glass-card p-6">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-6">Outros Sintomas</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {symptomOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSymptomToggle(opt.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all text-center ${formData.symptoms.includes(opt.id) ? 'border-luna-rose bg-luna-rose/5 text-luna-rose' : 'border-transparent bg-luna-bg text-gray-500'}`}
              >
                <opt.icon size={20} />
                <span className="text-[10px] font-bold uppercase">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="glass-card p-6">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-4">Notas Adicionais</label>
          <textarea 
            placeholder="Alguma observação importante sobre hoje?"
            className="input-field h-32 resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </section>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full py-5 text-lg shadow-xl shadow-luna-rose/20"
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m12 3 1.912 4.913L18.825 9.825 13.913 11.737 12 16.65l-1.912-4.913L5.175 9.825l4.912-1.912L12 3Z" />
      <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
  );
}
