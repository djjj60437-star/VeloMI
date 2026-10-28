import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Plus,
  Mic,
  MicOff,
  AudioLines,
  Download,
  Image as ImageIcon,
  Camera,
  FileSpreadsheet,
  FileText,
  X,
  Code2,
  Eye,
} from 'lucide-react';
import { Message } from '../types';
import { VeloLogo } from './VeloLogo';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { VoiceRecordingBar } from './VoiceRecordingBar';
import { CreationProjectCard } from './CreationProjectCard';
import { ProjectManifest } from '../engine/creationEngine';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (
    content: string,
    options?: {
      attachments?: Array<{ mimeType: string; data: string; name: string }>;
      thinkingEnabled?: boolean;
      webSearchEnabled?: boolean;
    }
  ) => void;
  onRegenerate: () => void;
  onOpenVoiceMode: () => void;
  thinkingEnabled: boolean;
  onToggleThinking: () => void;
  onOpenLivePreview?: (title: string, code: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onRegenerate,
  onOpenVoiceMode,
  thinkingEnabled,
  onToggleThinking,
  onOpenLivePreview,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{ name: string; type: string; data: string; size: number }>
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Universal Voice Recorder Hook
  const {
    isRecording,
    duration,
    volumeLevel,
    transcript,
    audioBlob,
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: `تسجيل_صوتي_${new Date().toLocaleTimeString('ar-SA')}.webm`,
            type: audioBlob.type || 'audio/webm',
            data: base64,
            size: audioBlob.size,
          },
        ]);
        setInputValue('استمع إلى هذه الرسالة الصوتية ونفّذ المطلوب منها:');
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [isRecording, transcript, audioBlob]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleThinkingCollapse = (msgId: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string, id: string) => {
    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'كود برمجي')
      .replace(/[*#_>`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.includes('Arabic')
    );
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    onSendMessage(trimmed || 'يرجى تحليل وفحص المرفقات بدقة.', {
      attachments: attachedFiles.map((f) => ({
        mimeType: f.type,
        data: f.data,
        name: f.name,
      })),
      thinkingEnabled,
    });

    setInputValue('');
    setAttachedFiles([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || 'text/plain',
            data: result,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Render markdown with code block highlighting
  const renderMessageContent = (content: string) => {
    // Check for Velo Creation Engine Project Manifest
    const creationProjectRegex = /<!-- VELO_CREATION_PROJECT:\s*([\s\S]*?)\s*-->/;
    const creationMatch = content.match(creationProjectRegex);
    let creationManifest: ProjectManifest | null = null;
    let cleanContent = content;

    if (creationMatch && creationMatch[1]) {
      try {
        creationManifest = JSON.parse(creationMatch[1]);
        cleanContent = content.replace(creationProjectRegex, '').trim();
      } catch (e) {
        console.warn('Failed to parse creation manifest:', e);
      }
    }

    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];

    if (creationManifest) {
      parts.push(
        <CreationProjectCard
          key="creation-project-card"
          manifest={creationManifest}
          onOpenLivePreview={onOpenLivePreview || (() => {})}
        />
      );
    }

    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(cleanContent)) !== null) {
      const textBefore = cleanContent.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
            {formatInlineMarkdown(textBefore)}
          </div>
        );
      }

      const lang = match[1] || 'code';
      const code = match[2];
      const codeId = `code-${match.index}`;

      parts.push(
        <div
          key={codeId}
          className="my-3 rounded-2xl overflow-hidden border border-neutral-800 bg-[#121620] text-neutral-100 shadow-xl"
          dir="ltr"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a2130] text-xs text-neutral-300 font-mono border-b border-neutral-700/60">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang}</span>
            </span>

            <div className="flex items-center gap-2">
              {(code.includes('<') ||
                lang.includes('html') ||
                lang.includes('jsx') ||
                lang.includes('tsx') ||
                lang.includes('react') ||
                lang.includes('javascript') ||
                lang.includes('js') ||
                code.includes('import') ||
                code.includes('function') ||
                code.includes('return') ||
                code.includes('const')) &&
                onOpenLivePreview && (
                  <button
                    onClick={() => onOpenLivePreview('مشروع Velo التفاعلي', code)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs text-white font-sans font-black shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>▶ تشغيل ومعاينة حية</span>
                  </button>
                )}

              <button
                onClick={() => copyToClipboard(code, codeId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-btn text-xs hover:text-white"
              >
                {copiedId === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-sans">نسخ الكود</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto text-[13.5px] font-mono leading-relaxed bg-[#0d1117] selection:bg-blue-900">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
          {formatInlineMarkdown(content.substring(lastIndex))}
        </div>
      );
    }

    return parts;
  };

  const formatInlineMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={lIdx} className="text-[17px] font-bold text-white mt-3.5 mb-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lIdx} className="text-[19px] font-extrabold text-white mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lIdx} className="text-[21px] font-black text-white mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={lIdx} className="mr-4 list-disc text-slate-200 my-0.5">
            {renderBoldText(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={lIdx} className="mr-4 list-decimal text-slate-200 my-0.5">
            {renderBoldText(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lIdx} className="border-r-4 border-cyan-500 pr-3 my-2 text-cyan-200 italic bg-cyan-950/40 p-2 rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      return (
        <span key={lIdx} className="text-slate-200">
          {renderBoldText(line)}
          {lIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  const renderBoldText = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-neutral-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className="bg-blue-50/80 text-blue-800 px-1.5 py-0.5 rounded text-[13px] font-mono border border-blue-200/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[760px] mx-auto flex flex-col gap-6">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const msgCopied = copiedId === message.id;

            return (
              <div
                key={message.id}
                className={`flex gap-3 text-right ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <VeloLogo size={32} />
                  </div>
                )}

                <div className={`flex flex-col max-w-[88%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* User Attachments Preview */}
                  {message.attachedFiles && message.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 justify-end">
                      {message.attachedFiles.map((file, i) => (
                        <div
                          key={i}
                          className="rounded-2xl overflow-hidden glass-panel p-1.5 max-w-[220px]"
                        >
                          {file.type.startsWith('image/') && file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-full h-28 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="p-2 text-xs flex items-center gap-1.5 text-neutral-700">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="truncate">{file.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Thinking Accordion (for Velo MI 6.1 Ultra) */}
                  {!isUser && message.thinking && (
                    <div className="w-full mb-3 rounded-2xl glass-panel overflow-hidden text-xs border border-blue-200/50">
                      <button
                        onClick={() => toggleThinkingCollapse(message.id)}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-right hover:bg-blue-50/50 transition-colors font-medium text-neutral-700"
                      >
                        <div className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            خوارزمية تفكير Velo MI 6.1
                          </span>
                        </div>
                        {expandedThinking[message.id] ? (
                          <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                      </button>

                      {expandedThinking[message.id] && (
                        <div className="p-3.5 border-t border-blue-100/60 text-neutral-600 font-mono text-[12px] bg-slate-50/60 whitespace-pre-wrap leading-relaxed">
                          {message.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sources Chips */}
                  {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {message.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 glass-btn text-blue-700 text-xs px-3 py-1 rounded-full transition-colors border border-blue-200/80"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                          <span className="max-w-[160px] truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Main Bubble with Glass Aesthetics */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-[15.5px] leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/20'
                        : 'glass-panel text-neutral-900 w-full'
                    }`}
                  >
                    {renderMessageContent(message.content)}

                    {/* Photorealistic Image Generation Result */}
                    {message.imageUrl && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-blue-200/60 shadow-lg relative group">
                        <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 font-mono font-bold">
                          <Camera className="w-3 h-3 text-cyan-400" />
                          <span>Photorealistic 8K</span>
                        </div>
                        <img
                          src={message.imageUrl}
                          alt="Velo MI Photorealistic Generation"
                          className="w-full max-h-[480px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-101"
                        />
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(message.imageUrl!);
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'velo-design-8k.png';
                              a.click();
                              URL.revokeObjectURL(url);
                            } catch {
                              window.open(message.imageUrl, '_blank');
                            }
                          }}
                          className="absolute bottom-3 left-3 bg-black/85 hover:bg-black text-white px-3.5 py-2 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs backdrop-blur-md shadow-lg cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-cyan-400" />
                          <span>تحميل التصميم بدقة 8K</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Glass Action Bar (for assistant) */}
                  {!isUser && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-neutral-500">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        title="نسخ الإجابة"
                        className="p-1.5 rounded-xl glass-btn hover:text-neutral-900"
                      >
                        {msgCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => speakText(message.content, message.id)}
                        title={speakingMessageId === message.id ? 'إيقاف الصوت' : 'استماع صوتي'}
                        className={`p-1.5 rounded-xl glass-btn hover:text-neutral-900 ${
                          speakingMessageId === message.id ? 'text-blue-600 border-blue-400' : ''
                        }`}
                      >
                        {speakingMessageId === message.id ? (
                          <VolumeX className="w-4 h-4 animate-pulse text-blue-600" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        title="مفيد"
                        className="p-1.5 rounded-xl glass-btn hover:text-neutral-900"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      <button
                        title="غير مفيد"
                        className="p-1.5 rounded-xl glass-btn hover:text-neutral-900"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={onRegenerate}
                        title="إعادة التوليد بواسطة Velo MI"
                        className="p-1.5 rounded-xl glass-btn hover:text-neutral-900"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Smart Latency & Reasoning Pipeline Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 text-right animate-fadeIn">
              <VeloLogo size={32} />
              <div className="flex flex-col gap-1.5 glass-panel p-3.5 rounded-2xl border border-blue-200/60 shadow-sm max-w-md">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold text-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>🧠 تحليل الطلب وفهم النية (Intent)...</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                    ⏱️ متوقع: ~1.5s
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
                  <span className="text-cyan-600 font-bold">🔧 تحضير الأدوات والاستدلال المنطقي</span>
                  <span>•</span>
                  <span>✍️ صياغة الرد الطبيعي المباشر</span>
                </div>

                {/* Latency Progress Bar */}
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-1.5 rounded-full animate-pulse w-4/5" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Glass Input Bar */}
      <div className="w-full px-4 pt-2 pb-5 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent">
        <div className="max-w-[760px] mx-auto">
          <div className="glass-pill rounded-[28px] p-2.5 transition-all focus-within:ring-2 focus-within:ring-cyan-500/40 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            {/* Attached file chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 pt-1 pb-2 border-b border-cyan-950/60">
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 glass-panel px-3 py-1 rounded-full text-xs text-slate-200 border border-cyan-500/30"
                  >
                    {file.type.startsWith('image/') ? (
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button
                      onClick={() => setAttachedFiles((p) => p.filter((_, i) => i !== idx))}
                      className="hover:text-red-400"
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
                onCancel={stopRecording}
              />
            ) : (
              <div className="flex items-center gap-2 px-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  accept="image/*,audio/*,.csv,.json,.txt,.pdf,.xlsx,.py,.js"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="إرفاق ملف أو صورة"
                  className="w-9 h-9 rounded-full glass-btn flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <Plus className="w-5 h-5 stroke-[2.2]" />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="اسأل Velo MI عن أي شيء..."
                  className="flex-1 text-[15.5px] text-white placeholder-slate-400 outline-none bg-transparent resize-none py-1.5 px-1 leading-normal max-h-32"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={onToggleThinking}
                    title="تفعيل وضع التفكير لـ Velo MI"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      thinkingEnabled
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                        : 'glass-btn text-slate-300 hover:text-white border-cyan-900/50'
                    }`}
                  >
                    <Brain className={`w-3.5 h-3.5 ${thinkingEnabled ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>التفكير</span>
                  </button>

                  {/* Glowing Cyan Microphone button matching the user's screenshot */}
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

                  <button
                    onClick={onOpenVoiceMode}
                    title="Velo Voice Mode"
                    className="w-8 h-8 rounded-full glass-btn-primary flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <AudioLines className="w-4 h-4 stroke-[2.3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-[11px] text-center text-neutral-400 mt-2 font-medium">
            يعمل Velo MI 6.1 Ultra بخوارزميات مفتوحة المصدر فائقة الدقة والأمان.
          </p>
        </div>
      </div>
    </div>
  );
};
