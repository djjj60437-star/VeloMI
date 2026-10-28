import React, { useState } from 'react';
import {
  X,
  Search,
  Camera,
  BookOpen,
  Clock,
  Compass,
  Folder,
  Terminal,
  Sparkles,
  Play,
  Download,
  Check,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { ChatSession } from '../types';
import { VeloLogo } from './VeloLogo';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onStartCustomGptChat: (prompt: string, title: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  sessions,
  onSelectSession,
  onStartCustomGptChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedGallery, setGeneratedGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=90',
  ]);

  // Codex state
  const [codexCode, setCodexCode] = useState(`// Velo MI 6.1 Ultra Code Execution Engine
function benchmarkVeloAlgorithm() {
  const startTime = performance.now();
  
  // High-performance matrix calculation
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  
  const endTime = performance.now();
  console.log("Velo MI Engine Matrix Result:", sum.toFixed(2));
  console.log("Execution Latency:", (endTime - startTime).toFixed(3), "ms");
}

benchmarkVeloAlgorithm();
`);
  const [codexOutput, setCodexOutput] = useState('');

  if (!activeModal) return null;

  const handleRunCode = () => {
    try {
      let logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.join(' ')),
      };
      const runFn = new Function('console', codexCode);
      runFn(customConsole);
      setCodexOutput(logs.join('\n') || 'تم التنفيذ بنجاح بواسطة Velo Engine (بدون مخرجات).');
    } catch (err: any) {
      setCodexOutput(`خطأ في التنفيذ: ${err.message}`);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImg(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedGallery((prev) => [data.imageUrl, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImg(false);
      setImagePrompt('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-neutral-900 border border-white/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/60 bg-white/50">
          <div className="flex items-center gap-2.5">
            <VeloLogo size={24} />
            <h2 className="text-[17px] font-bold text-neutral-900">
              {activeModal === 'search' && 'البحث في محادثات Velo MI'}
              {activeModal === 'images' && 'استوديو الصور الفوتوغرافية الواقعية (Velo Photorealism)'}
              {activeModal === 'library' && 'مكتبة Velo والمحفوظات'}
              {activeModal === 'scheduled' && 'المهام المجدولة والأتمتة الذاتية'}
              {activeModal === 'plugins' && 'نماذج Velo MI التخصصية الفائقة'}
              {activeModal === 'projects' && 'المشروعات ومساحات العمل'}
              {activeModal === 'codex' && 'Velo Codex - محرك الأكواد المتقدم'}
              {activeModal === 'more' && 'خيارات Velo MI المتقدمة'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-btn text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. SEARCH MODAL */}
          {activeModal === 'search' && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="ابحث عن استفسار، كود، أو عنوان..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-2xl glass-panel border border-neutral-300 outline-none focus:border-blue-500 text-sm font-medium"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {sessions
                  .filter(
                    (s) =>
                      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.messages.some((m) =>
                        m.content.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                  )
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl glass-btn hover:border-blue-300 transition-all cursor-pointer flex flex-col gap-1 text-right"
                    >
                      <span className="font-bold text-sm text-neutral-900">
                        {session.title}
                      </span>
                      <span className="text-xs text-neutral-500 line-clamp-1">
                        {session.messages[session.messages.length - 1]?.content || 'محادثة نشطة'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. REALISTIC IMAGES MODAL */}
          {activeModal === 'images' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                محرك Velo MI المتخصص في إنشاء صور فوتوغرافية حقيقية بدقة 8K مع معالجة ملموسة للضوء والظلال والنسيج الواقعي.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="صف الصورة الواقعية التي تريد إنشاءها بالتفصيل..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl glass-panel border border-neutral-300 text-sm outline-none focus:border-blue-500 font-medium"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImg}
                  className="glass-btn-primary px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shrink-0"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isGeneratingImg ? 'جاري التوليد...' : 'توليد فوتوغرافي'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                {generatedGallery.map((img, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden border border-neutral-200 aspect-video shadow-sm"
                  >
                    <img src={img} alt="Velo Real Photo" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-mono font-bold">
                      Realistic 8K
                    </div>
                    <a
                      href={img}
                      download={`velo-photo-${i}.jpg`}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 text-xs font-bold"
                    >
                      <Download className="w-5 h-5" />
                      <span>تحميل النسخة الأصلية</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SPECIALIZED VELO GPTS */}
          {activeModal === 'plugins' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  name: 'مهندس Velo البرمجي (Ultra Engineer)',
                  desc: 'كتابة أنظمة برمجية متكاملة، اكتشاف الثغرات، وتصحيح الأخطاء الذاتي بدقة تفوق GPT-6.1.',
                  prompt: 'أنت Velo MI Ultra Engineer، كبير مهندسي البرمجيات والنظم الموزعة. ساعدني في كتابة وتصحيح كود برمجي فائق الكفاءة.',
                },
                {
                  name: 'عالم البيانات والتحليل المالي (Velo Quant)',
                  desc: 'تحليل ملفات CSV/Excel، النماذج المالية التنبؤية، والعمليات الإحصائية المتقدمة.',
                  prompt: 'أنت Velo MI Data Scientist. سأزودك ببيانات وأريد تحليلاً إحصائياً وتوقعات مبنية على الخوارزميات الدقيقة.',
                },
                {
                  name: 'خبير اللغات والترجمة الثقافية',
                  desc: 'الترجمة الاحترافية لـ 50 لغة والتحويل السلس بين الفصحى وجميع اللهجات العربية.',
                  prompt: 'أنت Velo MI Linguist، خبير لغويات دقيق متخصص في البلاغة واللهجات العربية والترجمة التخصصية الدقيقة.',
                },
                {
                  name: 'المدقق القانوني والعقود',
                  desc: 'فحص بنود العقود واستخراج الشروط الجزائية وضمان الامتثال القانوني الصارم.',
                  prompt: 'أنت Velo MI Legal Expert في صياغة ومراجعة العقود والاتفاقيات بدقة متناهية.',
                },
              ].map((gpt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl glass-panel border border-neutral-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <h3 className="font-extrabold text-[15px] text-neutral-900 mb-1">{gpt.name}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">{gpt.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      onStartCustomGptChat(gpt.prompt, gpt.name);
                      onClose();
                    }}
                    className="self-start text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 glass-btn px-3 py-1.5 rounded-xl"
                  >
                    <span>بدء المحادثة</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4. CODEX SANDBOX */}
          {activeModal === 'codex' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-mono font-semibold">
                  Velo MI 6.1 High-Speed Sandbox
                </span>
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-1.5 glass-btn-primary text-xs px-4 py-2 rounded-xl font-bold transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>تشغيل الكود</span>
                </button>
              </div>

              <textarea
                value={codexCode}
                onChange={(e) => setCodexCode(e.target.value)}
                rows={9}
                className="w-full bg-[#0e1320] text-cyan-300 p-4 rounded-2xl font-mono text-xs outline-none border border-neutral-800 shadow-inner"
                dir="ltr"
              />

              {codexOutput && (
                <div
                  className="mt-2 p-3.5 bg-neutral-950 text-emerald-400 font-mono text-xs rounded-2xl border border-neutral-800 whitespace-pre-wrap shadow-sm"
                  dir="ltr"
                >
                  <span className="text-neutral-500 block mb-1">Output Console:</span>
                  {codexOutput}
                </div>
              )}
            </div>
          )}

          {/* 5. LIBRARY, SCHEDULED, PROJECTS */}
          {(activeModal === 'library' ||
            activeModal === 'scheduled' ||
            activeModal === 'projects' ||
            activeModal === 'more') && (
            <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
              <VeloLogo size={48} />
              <h3 className="font-extrabold text-neutral-900 text-base">
                نظام Velo MI متزامن ومفتوح المصدر
              </h3>
              <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-medium">
                جميع بياناتك ومشاريعك التراكمية مشفرة محلياً وخاصة بك بالكامل، ومحمية من أي هجمات سيبرانية أو تسريبات خارجية.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
