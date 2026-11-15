import React, { useState } from 'react';
import { Globe2, ChevronDown } from 'lucide-react';
import { INDIAN_OFFICIAL_LANGUAGES } from '../../constants/languages';

/**
 * LanguageDropdown — shows currently selected language,
 * on click opens a scrollable list of all 22 Indian official languages + English.
 *
 * Props:
 *   language    — current language value (e.g. 'english', 'hindi', 'bengali', or full value)
 *   setLanguage — setter function
 *   accentClass — optional Tailwind class for the active highlight (default: 'bg-primary-600/30 text-primary-200')
 */
export default function LanguageDropdown({ language, setLanguage, accentClass }) {
  const [open, setOpen] = useState(false);
  const accent = accentClass || 'bg-primary-600/30 text-primary-200';

  // Find currently selected language label
  const current =
    INDIAN_OFFICIAL_LANGUAGES.find(l => l.value.toLowerCase() === language) ||
    INDIAN_OFFICIAL_LANGUAGES.find(l => l.code === language) ||
    INDIAN_OFFICIAL_LANGUAGES[0]; // fallback: English

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-gray-700 hover:border-gray-500 text-xs font-medium text-gray-200 hover:text-white transition-all"
      >
        <Globe2 className="w-3.5 h-3.5 text-gray-400" />
        <span className="max-w-[90px] truncate">{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-56 max-h-72 overflow-y-auto rounded-xl bg-gray-900 border border-gray-700 shadow-2xl py-1">
          {INDIAN_OFFICIAL_LANGUAGES.map(l => {
            const isSelected =
              language === l.value.toLowerCase() || language === l.code;
            return (
              <button
                key={l.code}
                onMouseDown={() => {
                  setLanguage(l.value.toLowerCase());
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? `${accent} font-semibold`
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{l.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-80" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
