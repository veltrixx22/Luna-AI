"use client";

import React from "react";
import * as motion from "motion/react-client";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="feature-card transition-all group"
    >
      <div className="feature-icon group-hover:bg-luna-pink-vibrant group-hover:text-white transition-all">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
