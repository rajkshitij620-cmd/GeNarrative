import React from 'react';
import { Eye, Headphones, Activity, Sliders } from 'lucide-react';

export default function ModeBadge({ mode, size = 'sm' }) {
  const configs = {
    visual: {
      label: 'Visual Mode',
      icon: Eye,
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    audio: {
      label: 'Audio Mode',
      icon: Headphones,
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    haptic: {
      label: 'Haptic Mode',
      icon: Activity,
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    artist: {
      label: 'Artist Mode',
      icon: Sliders,
      bg: 'bg-primary-500/10 text-primary-400 border-primary-500/30'
    }
  };

  const current = configs[mode.toLowerCase()] || configs.visual;
  const Icon = current.icon;

  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-xs gap-2' : 'px-2 py-0.5 text-[11px] gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${current.bg} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      <span>{current.label}</span>
    </span>
  );
}
