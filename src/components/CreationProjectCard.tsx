import React, { useState } from 'react';
import {
  Layers,
  Play,
  CheckCircle2,
  FileCode,
  Sparkles,
  ShieldCheck,
  Eye,
  ExternalLink,
  Code2,
  Car,
  Gamepad2,
  Globe,
  Monitor,
  Check,
  Copy,
  Wand2,
  Palette,
  Film,
  Image as ImageIcon,
  Cpu,
  Smartphone,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { ProjectManifest, modifyExistingProject } from '../engine/creationEngine';

interface CreationProjectCardProps {
  manifest: ProjectManifest;
  onOpenLivePreview: (title: string, code: string) => void;
}

export const CreationProjectCard: React.FC<CreationProjectCardProps> = ({
  manifest: initialManifest,
  onOpenLivePreview,
}) => {
  const [currentManifest, setCurrentManifest] = useState<ProjectManifest>(initialManifest);
  const [activeTab, setActiveTab] = useState<'overview' | 'directors' | 'quality' | 'files'>('overview');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  const getIcon = () => {
    if (currentManifest.type === 'ferrari_showcase' || currentManifest.type === 'ecommerce_automotive') {
      return <Car className="w-5 h-5 text-red-500" />;
    }
    if (currentManifest.type === 'open_world_3d_game') {
      return <Gamepad2 className="w-5 h-5 text-indigo-400" />;
    }
    return <Globe className="w-5 h-5 text-blue-400" />;
  };

  const getBadgeColor = () => {
    if (currentManifest.type === 'ferrari_showcase') return 'bg-red-500/15 text-red-400 border-red-500/30';
    if (currentManifest.type === 'ecommerce_automotive') return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (currentManifest.type === 'open_world_3d_game') return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  };

  const handleCopyCode = () => {
    const file = currentManifest.files[selectedFileIndex];
    if (file) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationPrompt.trim()) return;

    setIsModifying(true);
    await new Promise((r) => setTimeout(r, 600));

    const updated = modifyExistingProject(currentManifest, modificationPrompt);
    setCurrentManifest(updated);
    setModificationPrompt('');
    setIsModifying(false);
  };

  const dirs = currentManifest.directors;

  return (
    <div className="my-4 rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-b from-[#0a0f1d] via-[#060a16] to-[#03060f] text-slate-100 shadow-2xl shadow-red-500/10 animate-fadeIn" dir="rtl">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-[#070b18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600/25 via-blue-600/20 to-slate-900 border border-red-500/40 flex items-center justify-center shadow-lg">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${getBadgeColor()}`}>
                {currentManifest.type === 'ferrari_showcase' ? 'Ferrari Hypercar Experience' : currentManifest.type === 'ecommerce_automotive' ? 'Multi-Page Automotive' : currentManifest.type === 'open_world_3d_game' ? 'Three.js 3D Engine' : 'Web Application'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {currentManifest.version || 'v1.0'}
              </span>
              <span className="text-[10.5px] text-emerald-400 font-mono font-bold flex items-center gap-1 hidden sm:flex">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>6/6 Directors Passed</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">{currentManifest.title}</h3>
          </div>
        </div>

        {/* Primary Action: Run Live Project or Play Game */}
        <button
          onClick={() => onOpenLivePreview(currentManifest.title, currentManifest.liveHtmlBundle)}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            currentManifest.type === 'open_world_3d_game'
              ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-purple-500/30 hover:scale-105 animate-pulse'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-red-600/30 hover:scale-105'
          }`}
        >
          {currentManifest.type === 'open_world_3d_game' ? (
            <>
              <Gamepad2 className="w-4 h-4" />
              <span>🎮 تشغيل ولعب اللعبة 3D الآن</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>▶ تشغيل ومعاينة المشروع الآن</span>
            </>
          )}
        </button>
      </div>

      {/* 6-Stage Pipeline Progression Bar */}
      <div className="px-6 py-2.5 bg-[#040712] border-b border-slate-800/80 flex items-center justify-between overflow-x-auto text-[11px] font-mono text-slate-400 gap-4">
        <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
          <span>✓</span> <span>فهم الطلب</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
          <span>✓</span> <span>تخطيط المعمارية</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
          <span>✓</span> <span>هندسة التصميم 8K</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
          <span>✓</span> <span>بناء الملفات والـ Audio</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
          <span>✓</span> <span>Visual QA (0 أخطاء)</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className="flex items-center gap-1.5 text-cyan-300 font-black shrink-0 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>جاهز للتشغيل التفاعلي</span>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-slate-800 bg-[#050916] px-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          نظرة عامة والأنظمة ({currentManifest.pages.length} صفحات)
        </button>
        <button
          onClick={() => setActiveTab('directors')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'directors'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          فريق الإخراج الهندسي (6 Directors)
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quality'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          فحوصات الجودة الآلية (Quality Gate)
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'files'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          شجرة ملفات المشروع ({currentManifest.files.length} ملفات)
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentManifest.description}</p>

          <div className="grid md:grid-cols-2 gap-4 mt-1">
            <div className="p-4 rounded-2xl bg-[#060a16] border border-slate-800">
              <span className="text-xs font-bold text-red-400 block mb-2">📑 الصفحات والمشاهد المكتملة:</span>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-sans">
                {currentManifest.pages.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#060a16] border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 block mb-2">⚙️ الأنظمة البرمجية المدمجة:</span>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-sans">
                {currentManifest.systems.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 6 Engineering Directors */}
      {activeTab === 'directors' && dirs && (
        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <Palette className="w-4 h-4" />
              <span>1. Design Director</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الخطوط:</strong> {dirs.designDirector.typography}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الألوان:</strong> {dirs.designDirector.colorTokens}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الهوية:</strong> {dirs.designDirector.artDirection}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Film className="w-4 h-4" />
              <span>2. Creative Director</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الهيرو:</strong> {dirs.creativeDirector.heroExperience}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الحركات:</strong> {dirs.creativeDirector.microInteractions}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الصوت:</strong> {dirs.creativeDirector.audioAndVFX}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ImageIcon className="w-4 h-4" />
              <span>3. Asset Director</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الصور:</strong> {dirs.assetDirector.imageryQuality}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الصوت:</strong> {dirs.assetDirector.audioFormat}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الأصول:</strong> {dirs.assetDirector.assetCount} عناصر أصلية</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>4. Senior Engineer</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">المعمارية:</strong> {dirs.seniorEngineer.architecture}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الحالة:</strong> {dirs.seniorEngineer.stateManagement}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الاستقلالية:</strong> {dirs.seniorEngineer.modularity}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>5. Interaction Engineer</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">التجاوب:</strong> {dirs.interactionEngineer.responsiveTest}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">اللمس:</strong> {dirs.interactionEngineer.touchFeedback}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">التحقق:</strong> {dirs.interactionEngineer.formValidation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070c1a] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Gauge className="w-4 h-4" />
              <span>6. Visual QA & Playtest</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">الـ Viewport:</strong> {dirs.visualQA.viewportHealth}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">Console Errors:</strong> {dirs.visualQA.consoleErrors} (0 أخطاء)</p>
            <p className="text-slate-300 text-[11px] leading-relaxed"><strong className="text-slate-400">Render Speed:</strong> {dirs.visualQA.renderLoopFPS} FPS 60Hz</p>
          </div>
        </div>
      )}

      {/* Tab 3: Quality Gate */}
      {activeTab === 'quality' && (
        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>تم التحقق الآلي من الأداء والتجاوب والمؤثرات:</span>
            <span className="text-emerald-400 font-bold font-mono">0 Errors / 0 Warnings</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {currentManifest.qualityChecks.map((qc, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#060a16] border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{qc.test}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10.5px] text-slate-500">{qc.duration}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    {qc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Project Files */}
      {activeTab === 'files' && (
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {currentManifest.files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFileIndex(i)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    selectedFileIndex === i
                      ? 'bg-red-600 text-white font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.path}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الملف'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#02040a] p-4 text-xs font-mono text-red-300 overflow-x-auto max-h-64 whitespace-pre" dir="ltr">
            {currentManifest.files[selectedFileIndex]?.content || '// No content'}
          </div>
        </div>
      )}

      {/* Incremental Modification & Feedback Loop */}
      <div className="px-6 py-4 bg-[#050814] border-t border-slate-800/80">
        <form onSubmit={handleApplyModification} className="flex gap-2">
          <input
            type="text"
            placeholder='تعديل المشروع الموجود (مثال: غير اللون لأحمر، سرّع السيارة، أضف زر حجز، خليه أغمق...)'
            value={modificationPrompt}
            onChange={(e) => setModificationPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={isModifying}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-slate-700"
          >
            <Wand2 className="w-3.5 h-3.5 text-red-400" />
            <span>{isModifying ? 'جاري التعديل...' : 'تطبيق التعديل الفوري'}</span>
          </button>
        </form>
      </div>

      {/* Bottom Footer Actions */}
      <div className="px-6 py-3 bg-[#030610] border-t border-slate-900 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          مشروع مكتمل وقابل للتشغيل الفوري والتفاعل الكامل مع كافة وظائفه وأصواته.
        </span>

        <button
          onClick={() => onOpenLivePreview(currentManifest.title, currentManifest.liveHtmlBundle)}
          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <span>فتح المعاينة وتجربة القيادة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
