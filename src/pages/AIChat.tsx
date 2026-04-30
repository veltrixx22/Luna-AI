import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User as UserIcon, ShieldAlert, Sparkles, MessageCircle } from "lucide-react";
import { Message } from "../types";

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: "start",
        role: "assistant",
        content: "Olá! Eu sou a Luna AI. Estou aqui para ajudar você a entender melhor seu ciclo e saúde menstrual. Como posso te ajudar hoje?",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          createdAt: new Date().toISOString()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: data.error || "Ocorreu um erro. Verifique se as chaves da API estão configuradas.",
          createdAt: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-2xl mx-auto space-y-4">
      {/* Header mock */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-luna-purple-deep rounded-xl flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <h1 className="text-2xl font-brand">Luna AI</h1>
      </div>

      {/* Disclaimer */}
      <div className="bg-luna-pink-soft/30 border border-luna-pink-soft/50 p-4 rounded-3xl flex items-start gap-3">
        <ShieldAlert size={18} className="text-luna-pink-deep shrink-0 mt-0.5" />
        <p className="text-[10px] sm:text-xs text-luna-burgundy/60 font-bold uppercase tracking-tight">
          A Luna AI fornece informações educativas. Ela não substitui médicos ou diagnósticos profissionais. 
          Em caso de dor intensa ou urgência, procure um serviço de saúde.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.map((msm, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={idx}
            className={`flex ${msm.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-5 rounded-[32px] ${msm.role === 'user' ? 'bg-luna-pink-deep text-white rounded-tr-none shadow-lg shadow-luna-pink-deep/20' : 'bg-white shadow-soft rounded-tl-none border border-luna-pink-soft/20'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-60">
                {msm.role === 'assistant' ? <Sparkles size={12} /> : <UserIcon size={12} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {msm.role === 'assistant' ? 'Luna AI' : 'Você'}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msm.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-soft flex gap-1">
              <div className="w-1.5 h-1.5 bg-luna-rose rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-luna-rose rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-luna-rose rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative">
        <input 
          type="text"
          placeholder="Pergunte algo para Luna..."
          className="w-full px-6 py-4 pr-16 rounded-3xl border border-gray-100 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-luna-rose/20 transition-all font-medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-luna-rose text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
