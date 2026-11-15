import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  Sliders,
  ShieldCheck,
  Eye,
  Headphones,
  Activity,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function AIAnalysisStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [statusData, setStatusData] = useState({
    status: 'processing',
    progress: 25,
    stage: 'Extracting audio and speech recognition (Whisper)...'
  });
  const [performance, setPerformance] = useState(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    // Fetch performance info
    const fetchPerf = async () => {
      try {
        const res = await api.get(`/performances/${id}`);
        if (res.data.success) {
          setPerformance(res.data.performance);
        }
      } catch (err) {
        console.warn('Could not fetch performance details:', err);
      }
    };
    fetchPerf();

    // Poll AI processing status
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/ai/status/${id}`);
        if (res.data.success) {
          setStatusData(res.data);
          if (res.data.status === 'completed' || res.data.status === 'needs_review' || res.data.status === 'approved') {
            setPolling(false);
          }
        }
      } catch (err) {
        console.warn('AI status polling error:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [id]);

  const stages = [
    {
      name: 'Speech & Spoken Recognition (Whisper)',
      desc: 'Audio extraction, multi-speaker segmentation, Bengali, Hindi, and English transcription.',
      active: statusData.progress >= 20,
      done: statusData.progress > 35
    },
    {
      name: 'Human Movement & Mudra Tracking (MediaPipe)',
      desc: 'Full-body pose estimation, Samputa, Pataka, and Mayura mudra candidate timestamping.',
      active: statusData.progress >= 40,
      done: statusData.progress > 60
    },
    {
      name: 'Scene & Lighting Boundary Detection (OpenCV)',
      desc: 'Keyframe extraction, lighting transitions, and spatial focus tracking.',
      active: statusData.progress >= 65,
      done: statusData.progress > 80
    },
    {
      name: 'Music & Beat Intensity Analysis (Librosa)',
      desc: 'Acoustic onset detection, Ghungroo metallic chiming, and Tabla Theka pulse estimation.',
      active: statusData.progress >= 80,
      done: statusData.progress > 90
    },
    {
      name: 'Creative Description Synthesis (Gemini API)',
      desc: 'Multimodal synthesis of Literal, Poetic, and Minimal accessibility descriptions.',
      active: statusData.progress >= 90,
      done: statusData.progress >= 100
    }
  ];

  const isCompleted = statusData.progress >= 100 || statusData.status === 'completed' || statusData.status === 'needs_review' || statusData.status === 'approved';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Multimodal Pipeline Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Performance Understanding
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Analyzing "{performance?.title || 'Uploaded Performance'}" across speech, movement, scene, and sound tracks.
        </p>
      </div>

      {/* OVERALL PROGRESS CARD */}
      <div className="glass-panel-elevated p-8 rounded-3xl border border-primary-500/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary-600/30 text-primary-300 animate-pulse'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isCompleted ? 'Creative Timeline Synthesized' : 'AI Analysis in Progress'}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {statusData.stage || 'Analyzing multimodal cues...'}
              </p>
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {statusData.progress}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
          <div
            className="bg-gradient-to-r from-primary-600 via-indigo-500 to-accent-blue h-full rounded-full transition-all duration-500 shadow-lg shadow-primary-600/50"
            style={{ width: `${statusData.progress}%` }}
          />
        </div>

        {/* Action Button when finished */}
        {isCompleted && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AI has proposed cues. Complete artist review is now required.</span>
            </div>
            <Link
              to={`/artist/studio/${id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Artist Control Studio to Review & Approve</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* DETAILED MULTI-STAGE BREAKDOWN */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span>Multimodal Pipeline Stages</span>
        </h3>

        <div className="space-y-3">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl glass-panel border transition-all ${
                stage.done
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : stage.active
                  ? 'border-primary-500/50 bg-primary-950/20 shadow-md shadow-primary-600/10'
                  : 'border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{stage.name}</span>
                    {stage.done && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        Ready
                      </span>
                    )}
                    {stage.active && !stage.done && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-primary-500/30 text-primary-300 font-semibold animate-pulse">
                        Analyzing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{stage.desc}</p>
                </div>

                <div className="shrink-0 mt-0.5">
                  {stage.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : stage.active ? (
                    <Clock className="w-5 h-5 text-primary-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-700" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
