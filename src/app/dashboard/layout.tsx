"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Calendar, PlusCircle, MessageSquare, User as UserIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const navItems = [
    { icon: Home, label: "Início", path: "/dashboard", activeColor: "text-luna-pink-deep" },
    { icon: Calendar, label: "Ciclo", path: "/dashboard/cycle", activeColor: "text-luna-purple-light" },
    { icon: PlusCircle, label: "Sintomas", path: "/dashboard/symptoms", activeColor: "text-luna-purple-light" },
    { icon: MessageSquare, label: "Luna AI", path: "/dashboard/chat", activeColor: "text-luna-purple-light" },
    { icon: UserIcon, label: "Perfil", path: "/dashboard/profile", activeColor: "text-luna-purple-light" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luna-bg">
        <div className="w-12 h-12 border-4 border-luna-pink-deep border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 flex flex-col">
      {/* Background Decorative Blobs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-luna-pink-soft rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      <div className="fixed top-1/2 -right-24 w-80 h-80 bg-luna-lilac-soft rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white/60 backdrop-blur-xl border-r border-white/20 flex-col py-8 px-6 z-40">
        <div className="text-2xl font-brand mb-12 px-2">Luna AI</div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                pathname === item.path 
                  ? "bg-white shadow-soft text-luna-purple-deep" 
                  : "text-gray-400 hover:bg-white/40"
              )}
            >
              <item.icon size={20} strokeWidth={pathname === item.path ? 2.5 : 2} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 w-full flex-1">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-8 left-6 right-6 h-16 bg-white/80 backdrop-blur-2xl border border-luna-pink-soft rounded-full shadow-2xl flex items-center justify-around px-8 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              pathname === item.path ? item.activeColor : "text-luna-purple-light opacity-30"
            )}
          >
            <item.icon size={20} strokeWidth={pathname === item.path ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
