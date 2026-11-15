import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, QrCode, ArrowUpRight, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080C] text-gray-400 text-sm relative overflow-hidden">
      {/* Subtle bottom spotlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-violet-600/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/20 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">RASA CUE</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              "One Performance. Multiple Ways to Experience Art."
              The world's first AI-powered performance accessibility platform engineered with complete artist creative sovereignty.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational • 2026 Production Ready</span>
            </div>
          </div>

          {/* Four Accessibility Modes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4 font-mono">Accessibility Layers</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/features#visual" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>1. Visual Mode (Tri-Lingual Captions)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                </Link>
              </li>
              <li>
                <Link to="/features#audio" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>2. Audio Mode (Descriptive Narration)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                </Link>
              </li>
              <li>
                <Link to="/features#haptic" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>3. Haptic Mode (Tactile Rhythm & Tatkar)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                </Link>
              </li>
              <li>
                <Link to="/features#artist" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>4. Artist Studio (Cultural Approval Gate)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethics & Philosophy Card */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4 font-mono">Core Manifesto</h4>
            <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-1.5 text-violet-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>AI Proposes. The Artist Approves.</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                Original video and musical acoustics always remain 100% untouched. Accessibility content exists solely as separate, synchronized, artist-verified layers.
              </p>
            </div>
          </div>

          {/* Quick Links & Demo */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4 font-mono">Quick Access</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-cyan-400 font-medium">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>How QR Accessibility Works</span>
                </Link>
              </li>
              <li>
                <Link to="/artist/dashboard" className="hover:text-white transition-colors">
                  Artist Studio Dashboard
                </Link>
              </li>
              <li>
                <Link to="/audience/dashboard" className="hover:text-white transition-colors">
                  Audience Portal & Saved Library
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Cultural Protection Architecture
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 RASA CUE Inc. Engineered for Inclusive Performing Arts.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Privacy & Data Ethics</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Cultural Mudra Protection</span>
            <span>•</span>
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
