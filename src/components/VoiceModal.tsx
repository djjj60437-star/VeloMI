import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { VeloLogo } from './VeloLogo';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceMessageSent: (text: string) => Promise<string | void>;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onVoiceMessageSent,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiResponseText, setAiResponseText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanupAudio();
      return;
    }

    startListening();

    return () => {
      cleanupAudio();
    };
  }, [isOpen]);

  const cleanupAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    window.speechSynthesis.cancel();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsListening(false);
    setIsAiSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setUserTranscript('التعرف الصوتي غير مدعوم في متصفحك.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (isAiSpeaking) {
          window.speechSynthesis.cancel();
          setIsAiSpeaking(false);
        }

        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }

        setUserTranscript(current);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (current.trim()) {
            handleUserVoiceInput(current.trim());
          }
        }, 1500);
      };

      recognition.onerror = () => {};

      recognition.onend = () => {
        if (isOpen && !isMuted && !isAiSpeaking) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to init speech recognition:', err);
    }
  };

  const handleUserVoiceInput = async (spokenText: string) => {
    cleanupAudio();
    setIsAiSpeaking(true);
    setAiResponseText('Velo MI 6.1 يفكر...');

    try {
      const response = await onVoiceMessageSent(spokenText);
      const textToSpeak = typeof response === 'string' && response
        ? response
        : 'أهلاً بك! أنا Velo MI معك بكامل إمكانياتي. كيف أساعدك الآن؟';

      setAiResponseText(textToSpeak);

      const cleaned = textToSpeak
        .replace(/```[\s\S]*?```/g, 'كود برمجي')
        .replace(/[*#_>`]/g, '')
        .slice(0, 300);

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.name.includes('Arabic')
      );
      if (arVoice) utterance.voice = arVoice;

      utterance.onend = () => {
        setIsAiSpeaking(false);
        startListening();
      };
      utterance.onerror = () => {
        setIsAiSpeaking(false);
        startListening();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setIsAiSpeaking(false);
      startListening();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListening();
    } else {
      setIsMuted(true);
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b19]/95 backdrop-blur-2xl flex flex-col justify-between items-center text-white p-6 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <VeloLogo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">Velo MI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-400 font-bold border border-blue-500/30">
                6.1 Voice
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">
              المحادثة الصوتية فائقة الاستجابة
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Voice Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto relative">
        {/* Pulsing Aura Rings */}
        <div
          className={`absolute w-80 h-80 rounded-full blur-3xl transition-all duration-700 ${
            isAiSpeaking
              ? 'bg-gradient-to-r from-blue-600/50 via-cyan-400/50 to-indigo-600/50 scale-125 animate-pulse'
              : isListening
              ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 scale-105 animate-pulse'
              : 'bg-neutral-800/30 scale-90'
          }`}
        />

        {/* Central Fluid Voice Orb with Velo Logo watermark */}
        <div
          className={`relative z-10 w-44 h-44 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-xl ${
            isAiSpeaking
              ? 'bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 scale-110 shadow-cyan-500/40'
              : isListening
              ? 'bg-gradient-to-tr from-slate-900 via-blue-950 to-cyan-950 scale-100 shadow-blue-500/30'
              : 'bg-neutral-900'
          }`}
        >
          <div className="w-36 h-36 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
            {isAiSpeaking ? (
              <div className="flex flex-col items-center gap-2">
                <Volume2 className="w-10 h-10 text-white animate-bounce" />
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-bold">
                  Velo 6.1
                </span>
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-6 bg-cyan-400 rounded-full animate-[pulse_0.8s_infinite]" />
                <span className="w-2 h-12 bg-white rounded-full animate-[pulse_0.6s_infinite]" />
                <span className="w-2 h-8 bg-blue-400 rounded-full animate-[pulse_0.9s_infinite]" />
                <span className="w-2 h-4 bg-cyan-300 rounded-full animate-[pulse_0.7s_infinite]" />
              </div>
            ) : (
              <MicOff className="w-10 h-10 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="mt-8 text-center max-w-lg px-4">
          <p className="text-lg font-bold text-neutral-100 mb-2">
            {isAiSpeaking
              ? 'Velo MI يتحدث الآن...'
              : isListening
              ? 'تحدث، Velo MI يستمع إليك...'
              : 'الميكروفون مكتوم'}
          </p>

          {userTranscript && (
            <p className="text-sm text-neutral-300 line-clamp-2 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
              "{userTranscript}"
            </p>
          )}

          {isAiSpeaking && aiResponseText && (
            <p className="text-xs text-cyan-300/90 line-clamp-3 mt-2 font-arabic leading-relaxed">
              {aiResponseText}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Glass Controls */}
      <div className="w-full max-w-sm flex items-center justify-center gap-5 pb-6">
        <button
          onClick={toggleMute}
          title={isMuted ? 'تشغيل الميكروفون' : 'كتم الميكروفون'}
          className={`p-4 rounded-2xl transition-all shadow-md backdrop-blur-md border ${
            isMuted
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-white/10 text-neutral-200 border-white/10 hover:bg-white/20'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {isAiSpeaking && (
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsAiSpeaking(false);
              startListening();
            }}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-sm font-bold text-cyan-300 border border-cyan-500/30 backdrop-blur-md transition-colors"
          >
            مقاطعة والتحدث
          </button>
        )}

        <button
          onClick={onClose}
          className="p-4 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white transition-all shadow-lg hover:scale-105 border border-red-500/30"
          title="إنهاء المكالمة الصوتية"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
