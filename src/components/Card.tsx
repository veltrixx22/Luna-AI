"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ 
  children, 
  className, 
  glass = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  glass?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-[40px] p-8 md:p-12",
      glass ? "glass-card" : "bg-white shadow-soft border border-luna-pink-soft/10",
      className
    )}>
      {children}
    </div>
  );
}
