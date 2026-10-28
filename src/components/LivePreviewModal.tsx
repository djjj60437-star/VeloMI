import React, { useState } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Download,
  Copy,
  Check,
  Code2,
  Eye,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { transpileToRunnableHtml } from '../engine/sandboxRuntime';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code: string;
  language?: string;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  code,
  language = 'html',
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen) return null;

  // Prepare executable HTML with universal React/Babel/Three.js sandbox compiler
  const getRenderableHtml = () => {
    return transpileToRunnableHtml(code, title || 'Velo MI Live App');
  };

  const handleDownload = () => {
    const content = getRenderableHtml();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'velo-app'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
        {/* Top Control Bar */}
        <div className="h-14 px-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          {/* Title & badge */}
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-sm text-white max-w-[200px] sm:max-w-xs truncate">
              {title || 'معاينة التطبيق التفاعلي'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold hidden sm:inline">
              Velo Live Engine
            </span>
          </div>

          {/* Device Responsive Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setDevice('desktop')}
              title="سطح المكتب (Desktop)"
              className={`p-1.5 rounded-lg transition-colors ${
                device === 'desktop' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              title="جهاز لوحي (Tablet 768px)"
              className={`p-1.5 rounded-lg transition-colors ${
                device === 'tablet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              title="هاتف ذكي (Mobile 375px)"
              className={`p-1.5 rounded-lg transition-colors ${
                device === 'mobile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'preview' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>المعاينة</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'code' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>الكود</span>
              </button>
            </div>

            <button
              onClick={() => setIframeKey((k) => k + 1)}
              title="إعادة تحميل المعاينة"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              title="نسخ الكود"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              title="تحميل كملف HTML جاهز"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">تحميل التطبيق</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 flex items-center justify-center overflow-auto">
          {viewMode === 'preview' ? (
            <div
              className={`h-full bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border border-slate-700 ${
                device === 'desktop'
                  ? 'w-full'
                  : device === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              <iframe
                key={iframeKey}
                title="Velo Live Sandbox"
                srcDoc={getRenderableHtml()}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-[#0d121f] rounded-2xl border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-auto">
              <pre className="leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
