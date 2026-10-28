import React from 'react';
import { Square, Check, X, Mic } from 'lucide-react';

interface VoiceRecordingBarProps {
  isRecording: boolean;
  duration: number;
  volumeLevel: number;
  transcript: string;
  onStop: () => void;
  onCancel: () => void;
}

export const VoiceRecordingBar: React.FC<VoiceRecordingBarProps> = ({
  isRecording,
  duration,
  volumeLevel,
  transcript,
  onStop,
  onCancel,
}) => {
  if (!isRecording) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Generate 8 sound wave bars that bounce based on real mic volume level
  const bars = [0.3, 0.6, 0.9, 1.0, 0.8, 0.5, 0.7, 0.4];

  return (
    <div className="flex-1 flex items-center justify-between gap-3 px-2 py-1 animate-fadeIn text-slate-100">
      {/* Right side (RTL start): Recording status + Timer */}
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>REC {formatTime(duration)}</span>
        </span>

        {/* Real Live Volume Sound Waves */}
        <div className="flex items-center gap-1 h-5">
          {bars.map((mult, i) => {
            const h = Math.max(4, Math.round(volumeLevel * mult * 0.22) + 4);
            return (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full transition-all duration-75"
              />
            );
          })}
        </div>
      </div>

      {/* Center: Live spoken transcript preview */}
      <div className="flex-1 min-w-0 text-center px-2">
        <span className="text-xs text-cyan-300 font-medium truncate block font-sans">
          {transcript || 'تحدث الآن، Velo MI يستمع لصوتك بدقة...'}
        </span>
      </div>

      {/* Left side (RTL end): Control buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onCancel}
          title="إلغاء التسجيل"
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onStop}
          title="إيقاف واعتماد الصوت"
          className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/30 hover:brightness-110 transition-all cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>تم</span>
        </button>
      </div>
    </div>
  );
};
