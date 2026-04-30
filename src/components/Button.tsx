"use client";

import React from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  href?: string;
}

export function Button({ 
  children, 
  className, 
  variant = "primary", 
  href, 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-8 py-4 rounded-3xl font-bold transition-all active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2 text-center no-underline";
  
  const variants = {
    primary: "btn-primary bg-luna-pink-deep text-white shadow-lg shadow-luna-pink-deep/20 hover:opacity-90",
    secondary: "btn-secondary bg-luna-purple-deep text-white shadow-lg shadow-luna-purple-deep/20 hover:opacity-90",
    outline: "bg-white border-2 border-luna-pink-soft text-luna-purple-deep hover:bg-luna-pink-soft/20 shadow-sm",
    ghost: "bg-transparent text-luna-purple-deep hover:bg-luna-pink-soft/20",
  };

  const combinedStyles = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
