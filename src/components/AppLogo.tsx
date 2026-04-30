"use client";

import React from "react";
import { Droplets } from "lucide-react";

export function AppLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-tr from-luna-pink-vibrant to-luna-purple-light rounded-xl flex items-center justify-center shadow-lg">
        <Droplets className="text-white" size={20} />
      </div>
      <h2 className="text-2xl font-brand">Luna AI</h2>
    </div>
  );
}
