"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as motion from "motion/react-client";
import { User as UserIcon, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import { AppLogo } from "@/components/AppLogo";
import { Card } from "@/components/Card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { checkUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    if (!email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await checkUser();
        router.push("/onboarding");
      } else {
        setError(data.error || "Erro ao criar conta");
      }
    } catch (err: any) {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luna-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-luna-pink-soft rounded-full blur-[100px] opacity-60 -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-luna-lilac-soft rounded-full blur-[100px] opacity-60 -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card glass className="p-10 shadow-warm">
          <div className="flex flex-col items-center mb-10 text-center">
            <AppLogo className="mb-6" />
            <h1 className="text-3xl font-brand mb-2">Comece sua jornada</h1>
            <p className="text-luna-burgundy/60 font-medium">Cuidado, clareza e conexão com você mesma.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/40 ml-4">Nome Completo</label>
              <div className="relative group">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-luna-purple-light opacity-40 group-focus-within:text-luna-pink-vibrant group-focus-within:opacity-100 transition-all" size={20} />
                <input 
                  type="text" 
                  className="input-field pl-14" 
                  placeholder="Como quer ser chamada?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/40 ml-4">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-luna-purple-light opacity-40 group-focus-within:text-luna-pink-vibrant group-focus-within:opacity-100 transition-all" size={20} />
                <input 
                  type="email" 
                  className="input-field pl-14" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/40 ml-4">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-luna-purple-light opacity-40 group-focus-within:text-luna-pink-vibrant group-focus-within:opacity-100 transition-all" size={20} />
                  <input 
                    type="password" 
                    className="input-field pl-14" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-luna-burgundy/40 ml-4">Confirmar</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-luna-purple-light opacity-40 group-focus-within:text-luna-pink-vibrant group-focus-within:opacity-100 transition-all" size={20} />
                  <input 
                    type="password" 
                    className="input-field pl-14" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 accent-luna-pink-deep rounded"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-[10px] uppercase font-bold text-luna-burgundy/40 tracking-wider">
                Concordo com os <Link href="#" className="text-luna-pink-deep hover:underline">termos</Link> e <Link href="#" className="text-luna-pink-deep hover:underline">privacidade</Link>.
              </label>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold italic flex items-center gap-2 border border-red-100"
              >
                <Sparkles size={16} />
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 shadow-xl shadow-luna-pink-deep/20"
            >
              {loading ? "Criando..." : "Começar minha jornada"}
              <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-luna-pink-soft/30">
            <p className="text-sm text-luna-burgundy/60 font-medium">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-luna-pink-deep font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
