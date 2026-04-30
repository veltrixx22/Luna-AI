"use client";

import React, { useState, useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { Sparkles, Send, User as UserIcon, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/ai/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-luna-purple-deep rounded-xl flex items-center justify-center text-white shadow-lg">
          <Sparkles size={20} />
        </div>
        <h1 className="text-2xl font-brand text-luna-purple-deep">Luna AI</h1>
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
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-luna-pink-soft">
        {messages.length === 0 && (
          <div className="text-center py-12 opacity-40">
            <Sparkles size={48} className="mx-auto mb-4" />
            <p className="font-medium">Olá! Eu sou a Luna. Como posso te ajudar hoje?</p>
          </div>
        )}
        {messages.map((msm, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${msm.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-5 rounded-[32px] ${msm.role === 'user' ? 'bg-luna-pink-deep text-white rounded-tr-none shadow-lg shadow-luna-pink-deep/20' : 'bg-white shadow-soft rounded-tl-none border border-luna-pink-soft/20 text-luna-text'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-60">
                {msm.role === 'assistant' ? <Sparkles size={12} /> : <UserIcon size={12} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {msm.role === 'assistant' ? 'Luna AI' : 'Você'}
                </span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium markdown-body">
                <ReactMarkdown>{msm.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-soft p-5 rounded-[32px] rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-luna-pink-deep rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-luna-pink-deep rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-luna-pink-deep rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="O que você deseja saber?"
          className="w-full bg-white/80 backdrop-blur-xl border-2 border-luna-pink-soft rounded-full px-8 py-5 pr-16 focus:border-luna-pink-vibrant focus:ring-4 focus:ring-luna-pink-vibrant/10 outline-none shadow-lg transition-all font-medium"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-luna-pink-deep text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:grayscale transition-all shadow-lg"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
