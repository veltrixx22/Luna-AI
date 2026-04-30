import React, { useContext } from "react";
import { AuthContext } from "../App";
import { LogOut, User as UserIcon, Shield, Trash2, Heart, Award, Share2 } from "lucide-react";
import { motion } from "motion/react";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center py-6">
        <div className="w-24 h-24 rounded-[40px] bg-gradient-to-br from-luna-rose to-luna-lilac mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-6 ring-4 ring-white">
          {user?.name.charAt(0)}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
        <p className="text-gray-400 font-medium">{user?.email}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Configurações</h3>
        
        <div className="glass-card overflow-hidden">
          <ProfileLink icon={UserIcon} label="Informações Pessoais" />
          <ProfileLink icon={Heart} label="Preferências do Ciclo" />
          <ProfileLink icon={Shield} label="Privacidade e Segurança" />
          <ProfileLink icon={Share2} label="Convidar Amigas" />
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2 pt-4">Conta</h3>
        
        <div className="glass-card overflow-hidden">
          <button 
            onClick={() => window.confirm("Tem certeza que deseja sair?") && logout()}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all text-left"
          >
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <span className="font-bold">Sair da Conta</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-all text-left border-t border-gray-50">
            <div className="flex items-center gap-4 text-red-500">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <span className="font-bold">Excluir Conta</span>
            </div>
          </button>
        </div>

        <div className="text-center p-8 opacity-40">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1">Luna AI v1.0.0</div>
          <p className="text-[10px] leading-relaxed">Feito para apoiar e educar mulheres sobre sua saúde menstrual. Sempre consulte um médico.</p>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all text-left border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-luna-bg flex items-center justify-center text-luna-rose">
          <Icon size={20} />
        </div>
        <span className="font-bold text-gray-700">{label}</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
    </button>
  );
}
