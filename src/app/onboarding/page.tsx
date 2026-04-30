"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { Droplets, Sparkles, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    cycleRegularity: "regular",
    usageGoal: "tracking",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkUser } = useAuth();

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await checkUser();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luna-bg flex items-center justify-center p-6 bg-texture overflow-hidden relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-luna-pink-soft rounded-full blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-luna-lilac-soft rounded-full blur-3xl opacity-60 -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full p-10 py-12"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-luna-pink-deep rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={24} />
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-brand text-luna-purple-deep mb-2">Seja bem-vinda!</h1>
              <p className="text-luna-burgundy/60 font-medium leading-relaxed px-4">Queremos te conhecer melhor para personalizar sua experiência na Luna.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/60 ml-2">Qual seu principal objetivo?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "tracking", label: "Acompanhar ciclo" },
                    { id: "pregnancy", label: "Engravidar" },
                    { id: "contraception", label: "Evitar gravidez" },
                    { id: "health", label: "Monitorar saúde" },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({ ...formData, usageGoal: goal.id })}
                      className={`p-4 rounded-3xl border-2 transition-all text-xs font-bold uppercase tracking-tight ${formData.usageGoal === goal.id ? 'border-luna-pink-deep bg-white shadow-soft text-luna-pink-deep' : 'border-transparent bg-luna-bg text-luna-purple-deep opacity-60'}`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2 group">
              Continuar
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-brand text-luna-purple-deep mb-2">Sobre seu ciclo</h2>
              <p className="text-luna-burgundy/60 font-medium">Dados médios nos ajudam em previsões iniciais.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/60 ml-2">Duração média do ciclo (dias)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.averageCycleLength}
                  onChange={(e) => setFormData({ ...formData, averageCycleLength: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/60 ml-2">Duração média da menstruação (dias)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.averagePeriodDuration}
                  onChange={(e) => setFormData({ ...formData, averagePeriodDuration: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-3xl bg-luna-bg text-luna-purple-deep font-bold border-2 border-transparent hover:border-luna-pink-soft transition-all">Voltar</button>
              <button 
                onClick={handleFinish} 
                disabled={loading}
                className="flex-[2] btn-primary py-5 text-lg flex items-center justify-center gap-2"
              >
                {loading ? "Salvando..." : "Finalizar"}
                <Check size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-10">
          <div className={`w-2 h-2 rounded-full transition-all ${step === 1 ? 'w-6 bg-luna-pink-deep' : 'bg-luna-pink-soft'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${step === 2 ? 'w-6 bg-luna-pink-deep' : 'bg-luna-pink-soft'}`} />
        </div>
      </motion.div>
    </div>
  );
}
