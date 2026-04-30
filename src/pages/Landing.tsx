import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, Sparkles, Calendar, MessageSquare, History, Smartphone, Droplets, Plus } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-luna-bg text-luna-text">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-luna-pink-soft rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-luna-lilac-soft rounded-full blur-3xl opacity-60" />

      {/* Hero Section */}
      <header className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-luna-pink-vibrant to-luna-purple-light rounded-xl flex items-center justify-center shadow-lg">
            <Droplets className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-brand">Luna AI</h2>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif italic font-bold text-luna-purple-deep leading-tight mb-8"
        >
          Seu ciclo, seus sintomas e sua saúde íntima com <span className="text-luna-pink-vibrant">mais clareza.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-luna-burgundy/60 mb-12 max-w-2xl mx-auto font-medium"
        >
          Acompanhe sua menstruação, preveja sua próxima fase e tire dúvidas com nossa inteligência artificial feita para você.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={() => navigate("/register")} className="btn-primary">
            Criar minha conta
          </button>
          <button onClick={() => navigate("/login")} className="px-8 py-4 rounded-3xl font-bold bg-white border border-luna-pink-soft text-luna-purple-deep hover:bg-luna-pink-soft/10 transition-all shadow-sm">
            Já tenho conta
          </button>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section className="px-6 py-24 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Calendar} 
              title="Controle do Ciclo" 
              description="Registre o início e fim da menstruação com um toque." 
            />
            <FeatureCard 
              icon={Sparkles} 
              title="Previsões Inteligentes" 
              description="Saiba quando será sua próxima menstruação e janela fértil." 
            />
            <FeatureCard 
              icon={Plus} 
              title="Registro de Sintomas" 
              description="Monitore cólicas, fluxo, humor e outros sintomas diários." 
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Assistente com IA" 
              description="Tire dúvidas educacionais com a Luna AI de forma gentil." 
            />
            <FeatureCard 
              icon={History} 
              title="Histórico e Insights" 
              description="Visualize padrões no seu ciclo ao longo do tempo." 
            />
            <FeatureCard 
              icon={Smartphone} 
              title="App Instalável" 
              description="Adicione à tela inicial do seu celular como um app real." 
            />
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto relative z-10">
        <div className="glass-card p-10 md:p-16 border-luna-pink-soft/40 shadow-warm">
          <div className="w-16 h-16 bg-luna-pink-soft rounded-full flex items-center justify-center mx-auto mb-8 text-luna-pink-deep">
            <Shield size={32} />
          </div>
          <h3 className="text-3xl font-serif italic font-bold mb-6 text-luna-purple-deep">Privacidade e Segurança</h3>
          <p className="text-base text-luna-burgundy/70 leading-relaxed mb-4 max-w-2xl mx-auto">
            Seus dados são privados e não são compartilhados. A Luna AI oferece informações educativas e estimativas com base nos dados informados. 
          </p>
          <p className="text-xs uppercase tracking-widest font-bold text-luna-pink-deep bg-luna-pink-soft/30 px-6 py-2 rounded-full inline-block mt-4">
            Não substitui médicos ou diagnósticos profissionais.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-luna-purple-light opacity-50 text-xs font-bold uppercase tracking-widest">
        &copy; 2026 Luna AI &bull; Sua saúde, sua jornada.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-10 rounded-[40px] bg-luna-bg hover:shadow-warm transition-all group border border-transparent hover:border-luna-pink-soft"
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-luna-pink-vibrant mb-8 shadow-sm group-hover:bg-luna-pink-vibrant group-hover:text-white transition-all">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-serif italic font-bold mb-3 text-luna-purple-deep">{title}</h3>
      <p className="text-luna-burgundy/60 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
