import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Eye,
  Headphones,
  Activity,
  Sliders,
  ShieldCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Play,
  Volume2,
  Vibrate,
  Smartphone,
  ChevronDown,
  Layers,
  Lock,
  Compass,
  ArrowUpRight,
  Globe2,
  Zap,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('visual');
  const [hapticTriggered, setHapticTriggered] = useState(false);
  const [artistApproved, setArtistApproved] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  // Real tactile vibration trigger for mobile/compatible devices
  const triggerHaptic = (pattern = [100, 50, 100, 50, 200]) => {
    setHapticTriggered(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
    setTimeout(() => setHapticTriggered(false), 900);
  };

  const modesData = {
    visual: {
      id: 'visual',
      title: 'Visual Mode',
      tag: 'Deaf & Hard-of-Hearing',
      badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
      icon: Eye,
      description: 'Synchronized multilingual captions (Bengali, Hindi, English), sound event indicators, and mudra descriptors mapped frame-by-frame.',
      sampleSnippet: '"00:35 • Graceful 360° spin with extended arms [Ghungroo crescendo in Teentaal]"',
      metrics: '3 Languages • Sub-second Sync'
    },
    audio: {
      id: 'audio',
      title: 'Audio Mode',
      tag: 'Blind & Low-Vision',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      icon: Headphones,
      description: 'Artist-approved descriptive voice narration explaining scene lighting, dancer gaze, and choreographic mudras without masking original flute and tabla.',
      sampleSnippet: '"Lighting transitions to warm amber. Performer steps forward in Mayura mudra, evoking seasonal renewal."',
      metrics: 'Zero Audio Replacement • Spatial Ducking'
    },
    haptic: {
      id: 'haptic',
      title: 'Haptic Mode',
      tag: 'Tactile Sensory Immersion',
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      icon: Activity,
      description: 'Tactile phone vibration patterns synchronized to rhythmic footwork (Tatkar), drum strikes (Tabla), and dynamic emotional crescendos.',
      sampleSnippet: 'Tatkar Footwork Pattern: [100ms, 40ms, 100ms, 40ms, 180ms] vibration cadence.',
      metrics: 'Web Vibration API • Wearable Ready'
    },
    artist: {
      id: 'artist',
      title: 'Artist Studio',
      tag: 'Core Sovereign Control',
      badgeColor: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
      icon: Sliders,
      description: 'The artist owns every accessibility cue. Granular timeline editor, cultural mudra protection, and final publish approval mandate.',
      sampleSnippet: 'Protected Cultural Element: Pataka & Mayura mudras locked against automated AI modification.',
      metrics: 'AI Proposes • Artist Approves'
    }
  };

  const faqs = [
    {
      q: 'How does RASA CUE protect the artist’s original work?',
      a: 'Original video and audio master files are completely untouched and immutable. Accessibility content exists solely as separate, synchronized multi-track metadata layers rendered dynamically on the audience’s device.'
    },
    {
      q: 'What happens if the AI misinterprets a traditional cultural mudra or step?',
      a: 'The "Artist Sovereign Mandate" ensures unapproved AI suggestions are NEVER published. The artist reviews every proposed cue in the Studio, can edit descriptions, lock cultural terms, or reject suggestions.'
    },
    {
      q: 'How do audiences access the experience in a live theater?',
      a: 'A single QR code is printed on theater programs or projected on stage screens. Audience members scan with any smartphone camera and choose their sensory preference (Visual, Audio, or Haptic) without downloading any mobile app.'
    },
    {
      q: 'How does Haptic Mode work on regular consumer smartphones?',
      a: 'It uses the standardized Web Vibration API natively supported in modern mobile browsers (Chrome, Edge, Samsung Internet). The phone vibrates in precise millisecond rhythmic pulses mapped to the performance beats.'
    }
  ];

  return (
    <div className="space-y-32 pb-24 overflow-hidden">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative pt-8 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[380px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-white/[0.12] text-xs font-medium text-gray-200 shadow-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-gray-400">AI PROPOSES • ARTIST APPROVES</span>
            <span className="text-gray-600">•</span>
            <span className="text-violet-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Production AI Platform
            </span>
          </motion.div>

          {/* Cinematic H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Every Performance Deserves to Be{' '}
            <span className="text-gradient-primary block sm:inline">
              Experienced by Everyone.
            </span>
          </motion.h1>

          {/* Lede Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Transform original dance, theater, and music into synchronized sensory layers—visual captions, descriptive audio narration, and tactile haptics. Built with complete artist creative sovereignty.
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/artist/upload"
              className="btn-shimmer flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Sliders className="w-4 h-4" />
              <span>Launch Artist Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="flex items-center gap-2.5 px-7 py-4 rounded-xl glass-panel-interactive border border-white/[0.15] text-white font-semibold text-sm hover:bg-white/[0.08]"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore Methodology</span>
            </Link>
          </motion.div>

          {/* Core Philosophy Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Untouched Original Audio & Video
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Separate Synchronized Layers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real Artist Verification
            </span>
          </motion.div>
        </div>

        {/* ========================================================
            INTERACTIVE MULTIMODAL SENSORY PLAYGROUND (HERO PREVIEW)
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl glass-panel-elevated border border-white/[0.12] overflow-hidden shadow-2xl relative"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono text-gray-400 font-semibold pl-2 border-l border-white/10">
                Multimodal Sensory Engine Preview
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {Object.values(modesData).map((m) => {
                const Icon = m.icon;
                const isActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{m.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playground Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-transparent to-black/50">
            {/* Visualizer / Video Simulator (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0A0D14] flex flex-col justify-between p-4 shadow-inner">
                {/* Simulated performance ambient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/60 via-indigo-950/40 to-cyan-950/40 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                {/* Top overlay pills */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/60 text-white border border-white/10 backdrop-blur-md">
                    LIVE TIME: 00:35.40
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${modesData[activeTab].badgeColor}`}>
                    Active: {modesData[activeTab].title}
                  </span>
                </div>

                {/* Center visual representation depending on active mode */}
                <div className="relative z-10 my-auto text-center py-6">
                  {activeTab === 'visual' && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="inline-block px-4 py-2 rounded-xl bg-black/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono shadow-2xl backdrop-blur-md">
                        [Ghungroo Chimes] • 360° Pataka Mudra Spin
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Bengali Captions: "আনন্দময় বসন্ত ঋতুতে ঘূর্ণন..."
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'audio' && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Animated audio equalizer bars */}
                      <div className="flex items-center justify-center gap-1.5 h-12">
                        {[40, 80, 55, 95, 30, 75, 90, 45, 85, 60, 100, 70, 40].map((h, i) => (
                          <span
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full animate-pulse"
                            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                          ></span>
                        ))}
                      </div>
                      <p className="text-xs text-emerald-300 font-medium max-w-md mx-auto italic bg-black/60 p-2.5 rounded-lg border border-emerald-500/30">
                        "Descriptive Voice: Lighting shifts to golden saffron as the performer initiates the choreographic sequence."
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'haptic' && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="relative inline-flex items-center justify-center">
                        <span className={`absolute w-16 h-16 rounded-full bg-amber-500/30 ${hapticTriggered ? 'animate-ping' : ''}`}></span>
                        <button
                          onClick={() => triggerHaptic()}
                          className="relative z-10 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 transition-all hover:scale-105"
                          title="Click to test real phone vibration"
                        >
                          <Vibrate className="w-6 h-6 animate-bounce" />
                        </button>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-300">Tap Icon to Feel Rhythmic Vibration</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">Cadence: [100ms, 50ms, 100ms] Tatkar Beats</div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'artist' && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-3 p-4 rounded-xl bg-black/75 border border-violet-500/40 text-left max-w-md mx-auto backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-violet-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-violet-400" /> Cultural Mudra Safeguard
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          PROTECTED
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-normal">
                        AI proposal locked for Kathak traditional intention. Artist approval required before audience broadcast.
                      </p>
                      <button
                        onClick={() => setArtistApproved(!artistApproved)}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          artistApproved
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                            : 'bg-violet-600 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{artistApproved ? 'Approved by Artist (Active)' : 'Click to Grant Approval'}</span>
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Bottom track bar */}
                <div className="relative z-10 flex items-center gap-3 pt-2 border-t border-white/10">
                  <span className="text-[10px] text-gray-400 font-mono">00:35</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 w-[58%]"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">01:00</span>
                </div>
              </div>
            </div>

            {/* Mode Details & Metrics (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${modesData[activeTab].badgeColor}`}>
                    {modesData[activeTab].tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {modesData[activeTab].title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mt-2">
                  {modesData[activeTab].description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold">
                  Live Synchronized Cue Sample
                </div>
                <div className="text-xs text-gray-200 font-mono italic leading-relaxed">
                  {modesData[activeTab].sampleSnippet}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-white/[0.08]">
                <span className="text-gray-400 font-mono">Platform Standard:</span>
                <span className="text-violet-300 font-semibold">{modesData[activeTab].metrics}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          METRICS & IMPACT RIBBON
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-gradient-silver">70M+</div>
            <div className="text-xs font-semibold text-gray-300">Deaf Audiences Empowered</div>
            <p className="text-[11px] text-gray-500">Live bilingual synchronized captions</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-gradient-silver">43M+</div>
            <div className="text-xs font-semibold text-gray-300">Blind & Low-Vision Patrons</div>
            <p className="text-[11px] text-gray-500">Spatial descriptive audio narration</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-gradient-primary">4 Modes</div>
            <div className="text-xs font-semibold text-gray-300">One Single Performance</div>
            <p className="text-[11px] text-gray-500">Visual, Audio, Haptic, & Artist</p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs font-semibold text-gray-300">Artist Creative Mandate</div>
            <p className="text-[11px] text-gray-500">Zero AI publishing without artist sign-off</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOUR MODES BENTO-GRID (PRODUCTION SAAS CARDS)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-violet-400">
            Multimodal Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Four Sensory Perspectives. One Unaltered Performance.
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every audience member has different sensory requirements. RASA CUE lets them choose their medium in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Visual Mode */}
          <div className="p-6 rounded-3xl glass-panel-interactive border border-white/[0.08] space-y-4 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-cyan-400">LAYER 01</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
                  Visual
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Visual Mode</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Synchronized tri-lingual captions (Bengali, Hindi, English), sound event descriptions, and stage movement direction indicators.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] text-[11px] font-mono text-cyan-200">
                "00:35 • Graceful 360° spin with extended arms [Ghungroo crescendo]"
              </div>
              <Link
                to="/features#visual"
                className="text-xs text-cyan-400 font-semibold flex items-center gap-1 hover:underline pt-1"
              >
                <span>Explore Visual Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Audio Mode */}
          <div className="p-6 rounded-3xl glass-panel-interactive border border-white/[0.08] space-y-4 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400">LAYER 02</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                  Audio
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Audio Mode</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Artist-approved descriptive voice narration explaining choreography, mudras, and scene lighting without replacing original music.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] text-[11px] font-mono text-emerald-200">
                "Descriptive voice in sync without masking flute, tabla, or bols."
              </div>
              <Link
                to="/features#audio"
                className="text-xs text-emerald-400 font-semibold flex items-center gap-1 hover:underline pt-1"
              >
                <span>Explore Audio Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Haptic Mode */}
          <div className="p-6 rounded-3xl glass-panel-interactive border border-white/[0.08] space-y-4 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-400">LAYER 03</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                  Haptic
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Haptic Mode</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Feel rhythmic beats, Kathak foot stomps, and emotional accents via standard smartphone vibration motors or wearable haptics.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] text-[11px] font-mono text-amber-200">
                "Tatkar footwork: [100ms, 40ms, 100ms] tactile rhythm pulses."
              </div>
              <Link
                to="/features#haptic"
                className="text-xs text-amber-400 font-semibold flex items-center gap-1 hover:underline pt-1"
              >
                <span>Explore Haptic Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Artist Control Studio */}
          <div className="p-6 rounded-3xl glass-panel-interactive border border-violet-500/30 space-y-4 flex flex-col justify-between group bg-gradient-to-b from-violet-950/20 to-transparent">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-violet-400">LAYER 04</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/40">
                  Artist Studio
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Artist Control Studio</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Complete authoring sovereignty. Customize, adjust timestamps, lock cultural terms, and approve before public broadcast.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] text-[11px] font-mono text-violet-200">
                "Protected Cultural Mudras: Pataka & Mayura locked by artist."
              </div>
              <Link
                to="/artist/upload"
                className="text-xs text-violet-400 font-semibold flex items-center gap-1 hover:underline pt-1"
              >
                <span>Enter Artist Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CORE PHILOSOPHY & WORKFLOW (4-STEP PIPELINE)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl glass-panel-elevated border border-white/[0.1] relative overflow-hidden space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-violet-400">
              The Sovereign Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How RASA CUE Transforms Live Performances
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Engineered so that AI acts as an assistive drafter, while the creator retains complete veto and editing authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 relative">
              <div className="text-3xl font-extrabold font-mono text-white/10 absolute top-3 right-3">01</div>
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-300 font-bold flex items-center justify-center text-sm border border-violet-500/30">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Upload Original Work</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Artist uploads live stage recording (MP4/MOV) with performance title, category, and cultural background context.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 relative">
              <div className="text-3xl font-extrabold font-mono text-white/10 absolute top-3 right-3">02</div>
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-300 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Multimodal AI Proposal</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                FastAPI engine (Whisper speech, MediaPipe poses, Librosa beats, Gemini) proposes multi-layer timeline cues.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 relative">
              <div className="text-3xl font-extrabold font-mono text-white/10 absolute top-3 right-3">03</div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Artist Review & Approval</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                The artist reviews proposed descriptions, refines cultural nuance, locks traditional terms, and grants approval.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 relative">
              <div className="text-3xl font-extrabold font-mono text-white/10 absolute top-3 right-3">04</div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                4
              </div>
              <h3 className="font-bold text-white text-sm">Instant QR Distribution</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Audience members scan the stage QR code with mobile cameras and immerse themselves in their preferred sensory layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-violet-400">
            Clarity & Cultural Respect
          </span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-violet-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-violet-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-gray-300 leading-relaxed font-normal border-t border-white/[0.04] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          FINAL CALL TO ACTION
          ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl glass-panel-elevated border border-white/[0.12] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-violet-600/20 blur-[100px] pointer-events-none rounded-full"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Inclusive Artistry in Action</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Make Your Performance Truly Inclusive?
          </h2>

          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Upload your dance, theater, or spoken word performance today. Empower deaf, blind, and neurodivergent audiences without compromising your artistic vision.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/artist/upload"
              className="btn-shimmer flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-sm shadow-xl shadow-white/10 hover:bg-gray-100 transition-all hover:scale-[1.02]"
            >
              <span>Upload Your Performance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/features"
              className="px-6 py-4 rounded-xl glass-panel border border-white/[0.12] text-white font-semibold text-sm hover:bg-white/[0.08] transition-all"
            >
              Explore 4 Modes Architecture
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
