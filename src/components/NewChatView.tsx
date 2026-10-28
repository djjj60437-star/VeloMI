import React, { useState, useRef, useEffect } from 'react';
import {
  SquarePen,
  Mic,
  MicOff,
  Plus,
  ArrowUp,
  Brain,
  Globe,
  Camera,
  GraduationCap,
  Code2,
  FileSpreadsheet,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { VeloLogo } from './VeloLogo';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { VoiceRecordingBar } from './VoiceRecordingBar';

interface NewChatViewProps {
  onSendMessage: (
    content: string,
    options?: {
      attachments?: Array<{ mimeType: string; data: string; name: string }>;
      thinkingEnabled?: boolean;
      webSearchEnabled?: boolean;
      isImageGeneration?: boolean;
    }
  ) => void;
  onOpenVoiceMode: () => void;
  thinkingEnabled: boolean;
  onToggleThinking: () => void;
  onOpenStudentHub: () => void;
  onOpenDevStudio: () => void;
  t?: Record<string, string>;
}

export const NewChatView: React.FC<NewChatViewProps> = ({
  onSendMessage,
  onOpenVoiceMode,
  thinkingEnabled,
  onToggleThinking,
  onOpenStudentHub,
  onOpenDevStudio,
  t = {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [webSearchActive, setWebSearchActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{ name: string; type: string; data: string }>
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real, Universal Voice Recorder Hook
  const {
    isRecording,
    duration,
    volumeLevel,
    transcript,
    audioBlob,
    error: voiceError,
    startRecording,
    stopRecording,
    toggleRecording,
  } = useVoiceRecorder((liveText) => {
    if (liveText) {
      setInputValue((prev) => (prev ? `${prev} ${liveText}` : liveText));
    }
  });

  // When recording stops and we have audio or transcript
  useEffect(() => {
    if (!isRecording && transcript) {
      setInputValue((prev) => {
        if (!prev || prev.includes(transcript)) return transcript;
        return `${prev} ${transcript}`;
      });
    } else if (!isRecording && audioBlob && !inputValue.trim() && !transcript) {
      // Add audio voice recording as attachment if no transcript was generated
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: `تسجيل_صوتي_${new Date().toLocaleTimeString('ar-SA')}.webm`,
            type: audioBlob.type || 'audio/webm',
            data: base64,
          },
        ]);
        setInputValue('استمع إلى هذه الرسالة الصوتية ونفّذ المطلوب منها:');
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [isRecording, transcript, audioBlob]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isRecording) {
      stopRecording();
    }
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    onSendMessage(inputValue, {
      attachments: attachedFiles.map((f) => ({
        name: f.name,
        mimeType: f.type,
        data: f.data,
      })),
      thinkingEnabled,
      webSearchEnabled: webSearchActive,
    });

    setInputValue('');
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || 'application/octet-stream',
            data: base64Data,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full pb-14 pt-3 animate-fadeIn select-none">
      {/* Velo MI Glowing Hero Logo */}
      <div className="mb-5 flex flex-col items-center">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-45 group-hover:opacity-75 transition duration-500 animate-pulse" />
          <div className="relative transform group-hover:scale-105 transition-transform duration-300">
            <VeloLogo size={82} />
          </div>
        </div>

        {/* Title & Model Tag */}
        <h1 className="text-[30px] md:text-[34px] font-black text-white tracking-tight mt-3 text-center select-none flex items-center gap-2">
          <span>{t.heroTitle || 'ما الذي تريد إنجازه مع'}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
            Velo MI
          </span>
          <span>؟</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 text-center font-medium max-w-xl">
          {t.heroSubtitle || 'النموذج الخارق 6.1 Ultra — بناء تطبيقات ومواقع تفوق ريبليت، مستندات Word/Excel/PPT للطلاب، وتوليد صور حقيقية.'}
        </p>
      </div>

      {/* Interactive Glass Capsule Input Bar */}
      <div className={`w-full max-w-[740px] glass-pill rounded-[30px] p-2.5 transition-all duration-300 border shadow-[0_0_25px_rgba(6,182,212,0.18)] ${
        isRecording ? 'border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)] ring-2 ring-red-500/30' : 'border-cyan-500/40 focus-within:ring-2 focus-within:ring-cyan-500/40'
      }`}>
        {/* Attached files preview chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-1 pb-2 border-b border-cyan-950/60">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 glass-panel px-3 py-1 rounded-full text-xs text-slate-200 border border-cyan-500/40"
              >
                {file.type.startsWith('image/') ? (
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                ) : file.type.startsWith('audio/') ? (
                  <Mic className="w-3.5 h-3.5 text-red-400" />
                ) : file.name.endsWith('.csv') || file.name.endsWith('.xlsx') ? (
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="max-w-[140px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Row or Live Recording Bar */}
        {isRecording ? (
          <VoiceRecordingBar
            isRecording={isRecording}
            duration={duration}
            volumeLevel={volumeLevel}
            transcript={transcript}
            onStop={stopRecording}
            onCancel={() => {
              stopRecording();
            }}
          />
        ) : (
          <div className="flex items-center gap-2 px-1">
            {/* Right side (RTL start): Attachment '+' glass button */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*,audio/*,.csv,.json,.txt,.pdf,.xlsx,.py,.js,.ts,.docx,.pptx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="إرفاق صور، ملفات صوتية، مستندات، أبحاث، أو أكواد"
                className="w-9 h-9 rounded-full glass-btn flex items-center justify-center text-slate-300 hover:text-white"
              >
                <Plus className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Text input / textarea */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={t.inputPlaceholder || 'اسأل Velo MI، اطلب بحثاً أو ملف Word/Excel، أو اكتب تطبيقك البرمجي...'}
              className="flex-1 text-[15.5px] text-white placeholder-slate-400 outline-none bg-transparent resize-none py-2 px-1.5 leading-normal max-h-32"
            />

            {/* Left side (RTL end): Glass Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* التفكير (Deep Thinking Toggle) */}
              <button
                onClick={onToggleThinking}
                title="تفعيل خوارزمية التفكير العميق لـ Velo MI"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  thinkingEnabled
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                    : 'glass-btn text-slate-300 hover:text-white border-cyan-900/50'
                }`}
              >
                <Brain className={`w-3.5 h-3.5 ${thinkingEnabled ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{t.thinking || 'التفكير'}</span>
              </button>

              {/* Glowing Microphone button (Exact match to user's screenshot) */}
              <button
                onClick={toggleRecording}
                title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تسجيل صوتي فوري'}
                className={`p-2 rounded-full glass-btn cursor-pointer transition-all duration-300 relative ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-110'
                    : 'text-cyan-400 hover:text-white border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 text-red-400 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Voice Mode Modal trigger */}
              <button
                onClick={onOpenVoiceMode}
                title="المحادثة الصوتية التفاعلية الكاملة (Voice Mode)"
                className="p-2 rounded-full glass-btn-primary flex items-center justify-center text-white cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
                  <span className="w-0.5 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </button>

              {/* Submit arrow button */}
              <button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() && attachedFiles.length === 0}
                title="إرسال الطلب"
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
                  inputValue.trim() || attachedFiles.length > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25 scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {voiceError && (
        <div className="mt-2 text-xs text-red-400 font-mono bg-red-950/40 border border-red-500/30 px-3 py-1 rounded-full animate-fadeIn">
          {voiceError}
        </div>
      )}

      {/* Feature Action Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 w-full max-w-[740px]">
        {/* 1. مركز الطلاب الأكاديمي */}
        <button
          onClick={onOpenStudentHub}
          className="glass-btn p-3 rounded-2xl flex items-center gap-2.5 text-right border-slate-800 hover:border-cyan-500/40 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-blue-500/25">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-white">{t.featureStudents || 'مركز الطلاب'}</span>
            <span className="text-[10.5px] text-slate-400">{t.featureStudentsSub || 'Word, Excel, PPT'}</span>
          </div>
        </button>

        {/* 2. المطور الخارق */}
        <button
          onClick={onOpenDevStudio}
          className="glass-btn p-3 rounded-2xl flex items-center gap-2.5 text-right border-slate-800 hover:border-cyan-500/40 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-cyan-500/25">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-white">{t.featureDev || 'المطور الخارق'}</span>
            <span className="text-[10.5px] text-slate-400">{t.featureDevSub || 'تفوق Replit و Claude'}</span>
          </div>
        </button>

        {/* 3. صور Real 8K عبر Nano Banana 2 */}
        <button
          onClick={() => {
            onSendMessage('أنشئ لي صورة فوتوغرافية واقعية فائقة الدقة 8K عبر نموذج Nano Banana 2 لمنظر سينمائي واقعي ملموس مع إضاءة طبيعية واحترافية.', {
              isImageGeneration: true,
            });
          }}
          className="glass-btn p-3 rounded-2xl flex items-center gap-2.5 text-right border-slate-800 hover:border-cyan-500/40 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-indigo-500/25">
            <Camera className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-white">{t.featurePhotos || 'صور Real 8K'}</span>
            <span className="text-[10.5px] text-slate-400">{t.featurePhotosSub || 'Nano Banana 2 فوتوغرافية'}</span>
          </div>
        </button>

        {/* 4. بحث وتوثيق Google */}
        <button
          onClick={() => {
            setWebSearchActive((prev) => !prev);
            setInputValue('ابحث في Google عن أحدث الأخبار العالمية والتقنية اليوم مع توثيق الروابط: ');
          }}
          className="glass-btn p-3 rounded-2xl flex items-center gap-2.5 text-right border-slate-800 hover:border-cyan-500/40 group cursor-pointer"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
            webSearchActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          }`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-white">{t.featureSearch || 'بحث Google'}</span>
            <span className="text-[10.5px] text-slate-400">
              {webSearchActive ? 'مفعل الآن' : t.featureSearchSub || 'مصادر حية موثقة'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
