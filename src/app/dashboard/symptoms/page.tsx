"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";
import { Smile, Frown, Meh, Zap, Droplets, Heart, Thermometer, Brain, Moon, Coffee, ArrowLeft, Sparkles } from "lucide-react";

export default function SymptomsPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    flowIntensity: "none",
    crampsLevel: "none",
    mood: "calm",
    symptoms: [] as string[],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-luna-pink-soft rounded-full transition-all text-luna-purple-deep">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-brand text-luna-purple-deep">Como você está hoje?</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date */}
        <section className="glass-card p-6">
          <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-4 ml-2">Data do Registro</label>
          <input 
            type="date" 
            className="input-field" 
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </section>

        {/* Mood */}
        <section className="glass-card p-6">
          <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-6 ml-2">Seu Humor</label>
          <div className="flex justify-between gap-3 overflow-x-auto pb-4 scrollbar-none px-1">
            {[
              { id: "happy", label: "Feliz", icon: Smile, color: "text-green-500" },
              { id: "calm", label: "Calma", icon: Heart, color: "text-luna-purple-light" },
              { id: "irritated", label: "Irritada", icon: Zap, color: "text-orange-500" },
              { id: "sad", label: "Triste", icon: Frown, color: "text-indigo-500" },
              { id: "anxious", label: "Ansiosa", icon: Brain, color: "text-pink-500" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormData({ ...formData, mood: m.id })}
                className={`flex flex-col items-center gap-2 p-5 min-w-[90px] rounded-[32px] border-2 transition-all ${formData.mood === m.id ? 'border-luna-pink-deep bg-white shadow-soft scale-105' : 'border-transparent bg-luna-bg opacity-60 hover:opacity-100'}`}
              >
                <m.icon size={28} className={formData.mood === m.id ? 'text-luna-pink-deep' : m.color} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-luna-purple-deep">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6">
            <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-4 ml-2">Fluxo Menstrual</label>
            <div className="space-y-2">
              {["none", "light", "medium", "heavy"].map((level) => (
                <label key={level} className={`flex items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all ${formData.flowIntensity === level ? 'bg-luna-pink-soft/50 text-luna-pink-deep' : 'hover:bg-luna-pink-soft/20 text-luna-purple-deep opacity-60'}`}>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="flow" 
                    checked={formData.flowIntensity === level} 
                    onChange={() => setFormData({ ...formData, flowIntensity: level })}
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.flowIntensity === level ? 'border-luna-pink-deep bg-white' : 'border-luna-pink-soft'}`}>
                    {formData.flowIntensity === level && <div className="w-3 h-3 bg-luna-pink-deep rounded-full" />}
                  </div>
                  <span className="text-sm font-bold capitalize">{level === 'none' ? 'Nenhum' : level === 'light' ? 'Leve' : level === 'medium' ? 'Médio' : 'Intenso'}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="glass-card p-6">
            <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-4 ml-2">Nível de Cólica</label>
            <div className="space-y-2">
              {["none", "light", "medium", "intense"].map((level) => (
                <label key={level} className={`flex items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all ${formData.crampsLevel === level ? 'bg-luna-lilac-soft/50 text-luna-purple-deep' : 'hover:bg-luna-lilac-soft/20 text-luna-purple-deep opacity-60'}`}>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="cramps" 
                    checked={formData.crampsLevel === level} 
                    onChange={() => setFormData({ ...formData, crampsLevel: level })}
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.crampsLevel === level ? 'border-luna-purple-deep bg-white' : 'border-luna-lilac-soft'}`}>
                    {formData.crampsLevel === level && <div className="w-3 h-3 bg-luna-purple-deep rounded-full" />}
                  </div>
                  <span className="text-sm font-bold capitalize">{level === 'none' ? 'Nenhuma' : level === 'light' ? 'Leve' : level === 'medium' ? 'Média' : 'Forte'}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Symptoms Checklist */}
        <section className="glass-card p-6">
          <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-6 ml-2">Outros Sintomas</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {symptomOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSymptomToggle(opt.id)}
                className={`flex flex-col items-center gap-3 p-5 rounded-[32px] border-2 transition-all text-center ${formData.symptoms.includes(opt.id) ? 'border-luna-pink-deep bg-white shadow-soft text-luna-pink-deep scale-105' : 'border-transparent bg-luna-bg text-luna-purple-deep opacity-60 hover:opacity-100'}`}
              >
                <opt.icon size={24} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="glass-card p-6">
          <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy opacity-60 block mb-4 ml-2">Notas Adicionais</label>
          <textarea 
            placeholder="Como seu corpo se sente hoje?"
            className="input-field h-32 resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </section>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full py-5 text-lg shadow-xl shadow-luna-pink-deep/20"
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
}
