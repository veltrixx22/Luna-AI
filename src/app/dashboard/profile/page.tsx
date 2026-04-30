"use client";

import React from "react";
import * as motion from "motion/react-client";
import { User as UserIcon, Mail, Settings, ShieldCheck, LogOut, ChevronRight, UserCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems = [
    { label: "Configurações da Conta", icon: Settings, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Dados e Privacidade", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
    { label: "Sobre a Luna AI", icon: UserCircle, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      <h1 className="text-3xl font-brand text-luna-purple-deep px-2">Meu Perfil</h1>

      {/* Profile Header */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 flex flex-col items-center text-center gap-4"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-luna-pink-vibrant to-luna-purple-light p-1 shadow-warm">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-brand text-luna-purple-deep">
            {user?.name.charAt(0)}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-luna-purple-deep">{user?.name}</h2>
          <div className="flex items-center justify-center gap-1 text-luna-burgundy/40 font-bold uppercase tracking-widest text-[10px] mt-1">
            <Mail size={12} />
            {user?.email}
          </div>
        </div>
        <button className="mt-2 px-6 py-2 rounded-full border-2 border-luna-pink-soft text-luna-pink-deep font-bold text-xs hover:bg-luna-pink-soft transition-all">
          Editar Perfil
        </button>
      </motion.section>

      {/* Menu Sections */}
      <section className="space-y-4">
        {menuItems.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={item.label}
            className="glass-card p-5 flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <item.icon size={22} />
              </div>
              <span className="font-bold text-luna-purple-deep">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-luna-burgundy/20 group-hover:text-luna-pink-deep transition-colors" />
          </motion.div>
        ))}
      </section>

      {/* Logout */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="w-full p-6 rounded-3xl bg-red-50 border-2 border-red-100 flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-100 transition-all"
      >
        <LogOut size={20} />
        Sair da conta
      </motion.button>

      <div className="text-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-luna-burgundy/20">Luna AI Beta v1.0.0</p>
      </div>
    </div>
  );
}
