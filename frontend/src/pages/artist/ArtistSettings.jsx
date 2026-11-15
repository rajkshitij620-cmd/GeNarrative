import React from 'react';
import { Settings, ShieldCheck, Cpu, Volume2, Smartphone } from 'lucide-react';

export default function ArtistSettings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Studio Engine Settings</h1>
        <p className="text-xs text-gray-400">Configure default AI model pipelines and accessibility defaults.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <div className="text-sm font-semibold text-white">AI Description Default Style</div>
              <div className="text-xs text-gray-400">Preferred default voice for generated descriptions.</div>
            </div>
            <select className="px-3 py-1.5 rounded-lg bg-surface border border-gray-700 text-xs text-white">
              <option value="poetic">Poetic (Evocative)</option>
              <option value="literal">Literal (Physical movement)</option>
              <option value="minimal">Minimal (Concise cues)</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <div className="text-sm font-semibold text-white">Automated Whisper Transcription</div>
              <div className="text-xs text-gray-400">Speech recognition on upload for Bengali, Hindi, and English.</div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">Enabled</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <div className="text-sm font-semibold text-white">Strict Artist Approval Mandate</div>
              <div className="text-xs text-gray-400">Never allow unreviewed AI suggestions to be visible to audiences.</div>
            </div>
            <span className="px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-xs font-semibold">Enforced</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Web Vibration Fallback Engine</div>
              <div className="text-xs text-gray-400">Emulate tactile pulses visually on unsupported devices (e.g. iOS Safari).</div>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
