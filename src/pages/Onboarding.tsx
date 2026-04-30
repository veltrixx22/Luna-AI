import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AuthContext } from "../App";
import { Calendar, RefreshCcw, Target } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    lastPeriod: "",
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    cycleRegularity: "regular",
    usageGoal: "track",
  });
  const [loading, setLoading] = useState(false);
  
  const { checkUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Save profile
      await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          averageCycleLength: data.averageCycleLength,
          averagePeriodDuration: data.averagePeriodDuration,
          cycleRegularity: data.cycleRegularity,
          usageGoal: data.usageGoal,
        }),
      });

      // Save initial cycle record if lastPeriod is provided
      if (data.lastPeriod) {
        await fetch("/api/cycles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            periodStartDate: data.lastPeriod,
            notes: "Registro inicial do onboarding",
          }),
        });
      }

      await checkUser();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-luna-bg font-sans">
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-xl glass-card p-8 md:p-12"
      >
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-all ${step >= i ? 'bg-luna-rose' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-luna-rose/10 rounded-3xl flex items-center justify-center text-luna-rose mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h1 className="text-2xl font-bold">Sobre seu último ciclo</h1>
            <p className="text-gray-500">Quando começou sua última menstruação?</p>
            <input 
              type="date" 
              className="input-field text-center" 
              value={data.lastPeriod}
              onChange={(e) => setData({ ...data, lastPeriod: e.target.value })}
            />
            <button onClick={() => setStep(2)} className="btn-primary w-full mt-4">Continuar</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-luna-lilac/10 rounded-3xl flex items-center justify-center text-luna-lilac mx-auto mb-6">
              <RefreshCcw size={32} />
            </div>
            <h1 className="text-2xl font-bold">Padrões do seu ciclo</h1>
            <div className="space-y-4">
              <div className="text-left">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Duração média do ciclo (dias)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.averageCycleLength}
                  onChange={(e) => setData({ ...data, averageCycleLength: parseInt(e.target.value) })}
                />
              </div>
              <div className="text-left">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Quantos dias dura sua menstruação?</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.averagePeriodDuration}
                  onChange={(e) => setData({ ...data, averagePeriodDuration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full mt-4">Continuar</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-luna-coral/10 rounded-3xl flex items-center justify-center text-luna-coral mx-auto mb-6">
              <Target size={32} />
            </div>
            <h1 className="text-2xl font-bold">Seu objetivo</h1>
            <p className="text-gray-500">O que você busca com a Luna AI?</p>
            <div className="grid grid-cols-1 gap-3 text-left">
              {[
                { id: "track", label: "Apenas acompanhar meu ciclo" },
                { id: "symptoms", label: "Entender meus sintomas" },
                { id: "pregnancy", label: "Planejar gravidez" },
                { id: "avoid", label: "Evitar gravidez" },
              ].map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setData({ ...data, usageGoal: goal.id })}
                  className={`p-4 rounded-2xl border transition-all text-sm font-medium ${data.usageGoal === goal.id ? 'border-luna-rose bg-luna-rose/5 text-luna-rose shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
            <button 
              disabled={loading} 
              onClick={handleFinish} 
              className="btn-primary w-full mt-4 flex justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Concluir configuração"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
