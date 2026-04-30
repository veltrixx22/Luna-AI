import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, X, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { Cycle } from "../types";

export default function CyclePage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const fetchCycles = async () => {
    try {
      const res = await fetch("/api/cycles");
      const data = await res.json();
      setCycles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodStartDate: startDate, periodEndDate: endDate, notes }),
      });
      setShowForm(false);
      fetchCycles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold">Registro de Ciclo</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="w-10 h-10 rounded-full bg-luna-rose text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-3 border-luna-rose border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-4">
          {cycles.length === 0 && (
            <div className="glass-card p-12 text-center">
              <CalendarIcon size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Nenhum ciclo registrado ainda.</p>
            </div>
          )}
          {cycles.map((cycle) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={cycle.id} 
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-luna-rose/10 flex items-center justify-center text-luna-rose">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <div className="font-bold">Menstruação</div>
                    <div className="text-xs text-gray-400 font-medium">{format(parseISO(cycle.periodStartDate), "MMMM 'de' yyyy", { locale: ptBR })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-700">Início: {format(parseISO(cycle.periodStartDate), "dd/MM")}</div>
                  {cycle.periodEndDate && <div className="text-xs text-gray-400 font-medium">Fim: {format(parseISO(cycle.periodEndDate), "dd/MM")}</div>}
                </div>
              </div>
              {cycle.notes && <p className="text-sm text-gray-500 border-t border-gray-50 pt-3 italic">"{cycle.notes}"</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-8">Registrar Menstruação</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Data de Início</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 text-gray-400">Data de Término (Opcional)</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Notas</label>
                  <textarea 
                    className="input-field h-24 resize-none" 
                    placeholder="Como você se sentiu?" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg">Salvar Registro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
