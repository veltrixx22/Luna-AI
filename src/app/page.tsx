"use client";

import React from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { 
  Shield, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  History, 
  Smartphone, 
  Plus, 
  Heart,
  Droplets,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/Button";
import { AppLogo } from "@/components/AppLogo";
import { FeatureCard } from "@/components/FeatureCard";
import { Card } from "@/components/Card";

export default function LandingPage() {
  return (
    <main className="landing-page selection:bg-luna-pink-soft selection:text-luna-pink-deep">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-luna-pink-soft rounded-full blur-[120px] opacity-70 animate-pulse" />
      <div className="absolute top-[20%] -right-48 w-[500px] h-[500px] bg-luna-lilac-soft rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-luna-pink-soft rounded-full blur-[80px] opacity-40" />

      {/* Navigation / Header */}
      <nav className="relative z-20 px-6 py-8 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <AppLogo />
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-luna-purple-deep hover:opacity-70 transition-all">Entrar</Link>
          <Link href="/register" className="btn-primary text-sm py-3 px-8 rounded-2xl shadow-md border-none cursor-pointer no-underline bg-luna-pink-deep text-white">Começar Grátis</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="app-badge"
        >
          <Sparkles className="text-luna-pink-vibrant" size={16} />
          <span>Privado, Seguro & Simples</span>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1, duration: 0.8 }}
           className="hero-card"
        >
          <h1 className="hero-title">
            Seu corpo, sua jornada, <br />
            <span className="text-luna-pink-vibrant">sua saúde íntima.</span>
          </h1>
          
          <p className="hero-subtitle">
            Conecte-se com você mesma através de previsões inteligentes e 
            o suporte gentil da Luna AI. Feito para quem busca clareza.
          </p>
          
          <div className="cta-row">
            <Link href="/register" className="btn-primary">
              Prever meu ciclo
              <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn-secondary">
              Acessar minha conta
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Hero Mockup Preview */}
      <section className="px-6 relative z-10 max-w-6xl mx-auto mb-20">
         <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
         >
           <div className="glass-card p-4 md:p-6 overflow-hidden border-2 border-white/50 ring-1 ring-luna-pink-soft/20">
              <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-luna-pink-soft to-luna-lilac-soft rounded-[32px] flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luna1/1600/900')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl text-luna-pink-vibrant animate-float">
                       <Droplets size={40} />
                    </div>
                    <h3 className="text-3xl font-brand mb-2">Simplicidade e Precisão</h3>
                    <p className="text-luna-burgundy/40 uppercase tracking-widest font-bold text-xs">Desenvolvido para sua rotina</p>
                 </div>
              </div>
           </div>
         </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white/50 py-24 border-y border-luna-pink-soft/20">
        <div className="text-center mb-16 px-6">
          <h2 className="text-4xl md:text-5xl font-brand mb-6 text-luna-purple-deep">Tudo o que você precisa</h2>
          <p className="text-luna-burgundy/60 max-w-2xl mx-auto text-lg font-medium">
            Ferramentas intuitivas para acompanhar seu ciclo menstrual, sintomas e bem-estar diário.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Calendar size={28} /></div>
            <h3 className="feature-title">Recorde do Ciclo</h3>
            <p className="feature-description">Marque o início de cada ciclo com um toque, histórico completo e organizado.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Sparkles size={28} /></div>
            <h3 className="feature-title">IA Preditiva</h3>
            <p className="feature-description">Algoritmos inteligentes que aprendem com seu corpo para prever próximas fases.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Heart size={28} /></div>
            <h3 className="feature-title">Sintomas & Humor</h3>
            <p className="feature-description">Registre como se sente fisicamente e emocionalmente em cada fase do mês.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MessageSquare size={28} /></div>
            <h3 className="feature-title">Suporte Humanizado</h3>
            <p className="feature-description">Tire dúvidas sobre saúde feminina com a Luna AI de forma educativa e segura.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><History size={28} /></div>
            <h3 className="feature-title">Análise de Padrões</h3>
            <p className="feature-description">Entenda o que é recorrente no seu ciclo através de insights automáticos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Smartphone size={28} /></div>
            <h3 className="feature-title">Sempre com Você</h3>
            <p className="feature-description">Interface otimizada para celular. Funciona como um app real direto no navegador.</p>
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="px-6 py-24">
        <div className="privacy-card">
          <div className="w-20 h-20 bg-luna-pink-soft rounded-full flex items-center justify-center mx-auto mb-10 text-luna-pink-deep">
            <ShieldCheck size={40} />
          </div>
          <h3 className="hero-title" style={{ fontSize: '32px' }}>Sua privacidade é nossa prioridade</h3>
          <p className="hero-subtitle">
            Acreditamos que dados de saúde são sagrados. Seus registros são criptografados 
            e nunca são vendidos para terceiros. Você tem controle total.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest font-bold text-luna-burgundy/40">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-luna-pink-vibrant" />
                Sem anúncios
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-luna-purple-light" />
                Criptografia Real
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-luna-pink-deep" />
                Uso Educativo
             </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="medical-disclaimer bg-white/30 backdrop-blur-sm">
        <div className="disclaimer-badge">
           <Shield size={16} />
           <span>Aviso Importante</span>
        </div>
        <p className="disclaimer-text">
          As informações fornecidas pela Luna AI têm caráter exclusivamente informativo e educativo. 
          Não substituem o aconselhamento, diagnóstico ou tratamento médico profissional. 
          Sempre procure orientação médica para qualquer dúvida relacionada à sua saúde.
        </p>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32 text-center bg-luna-purple-deep text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-luna-purple-deep to-luna-pink-deep opacity-50" />
          <div className="max-w-4xl mx-auto relative z-10">
             <h2 className="text-4xl md:text-6xl font-brand mb-8 text-white">Comece sua jornada hoje.</h2>
             <p className="text-lg md:text-xl opacity-70 mb-12 max-w-xl mx-auto font-medium">
                Junte-se a milhares de outras pessoas que escolheram viver com mais clareza e acolhimento.
             </p>
             <Link href="/register" className="btn-primary" style={{ backgroundColor: 'white', color: '#4A148C' }}>
                Criar conta gratuita
                <ArrowRight size={20} />
             </Link>
          </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 text-center border-t border-luna-pink-soft/10 bg-luna-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 opacity-40 mb-8">
             <Droplets size={24} className="text-luna-pink-vibrant" />
             <span className="font-brand text-xl">Luna AI</span>
          </div>
          <nav className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-luna-burgundy/40 mb-8">
             <Link href="#" className="hover:text-luna-pink-deep">Privacidade</Link>
             <Link href="#" className="hover:text-luna-pink-deep">Termos</Link>
             <Link href="#" className="hover:text-luna-pink-deep">Contato</Link>
          </nav>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 text-luna-purple-deep">
            &copy; 2026 Luna AI &bull; Cuidado, Clareza e Conexão.
          </div>
        </div>
      </footer>
      
      {/* Decorative Floating Icon for subtle movement */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none opacity-20 hidden lg:block">
         <motion.div
           animate={{ 
             y: [0, -20, 0],
             rotate: [0, 5, -5, 0]
           }}
           transition={{ 
             duration: 6,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         >
           <Droplets size={120} className="text-luna-pink-soft" />
         </motion.div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
