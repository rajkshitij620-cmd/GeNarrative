import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award, Globe, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative">
      {/* Background radial glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Our Mission & Cultural Ethics</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ethical AI for <span className="text-gradient-primary">Living Traditions</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Preserving artistic sovereignty and cultural nuance in an era of automated multimodal intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-violet-500/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Cultural Sovereignty Principle</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            In classical performing arts—such as Indian Kathak, Bharatanatyam, and Bengali folk theatre—a single mudra or rhythmic foot pattern (Tatkar) carries centuries of spiritual and cultural meaning. Generic automated AI models frequently misinterpret these gestures as random body movements.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            RASA CUE solves this by putting the artist in absolute control. AI acts as an assistive drafter; the human choreographer is the sole authority on meaning, description style, and cultural intention.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-cyan-500/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Universal Inclusion Mandate</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Accessibility should never be an afterthought or an awkward add-on. By encoding accessibility as first-class synchronized time-coded metadata at the point of creation, performances become universally accessible anywhere—in grand opera houses, intimate studio theatres, or living room screens.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Audience members do not need specialized headsets or proprietary hardware; any modern smartphone scanning a paper ticket QR code transforms into an immediate multisensory accessibility console.
          </p>
        </div>
      </div>

      <div className="glass-panel-elevated p-8 sm:p-10 rounded-3xl border border-violet-500/30 text-center space-y-5 relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto leading-snug">
          "AI proposes. The artist approves. Everyone experiences the art."
        </h3>
        <p className="text-xs sm:text-sm text-violet-300 font-mono">
          Engineered for the Google AI Hackathon 2026 • Full Multimodal Architecture
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Get Started with RASA CUE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
