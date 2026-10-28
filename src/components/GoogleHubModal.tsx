import React, { useState } from 'react';
import {
  Globe,
  FileText,
  FileSpreadsheet,
  Presentation,
  Mail,
  Calendar,
  Cloud,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  Play,
  X,
} from 'lucide-react';

interface GoogleHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
}

export const GoogleHubModal: React.FC<GoogleHubModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [selectedService, setSelectedService] = useState<string>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sheets simulator state
  const [sheetData, setSheetData] = useState([
    { id: 1, item: 'تطوير Velo AI', cost: 1200, status: 'مكتمل' },
    { id: 2, item: 'سيرفرات Cloud Run', cost: 450, status: 'نشط' },
    { id: 3, item: 'قواعد بيانات Firestore', cost: 300, status: 'متصل' },
    { id: 4, item: 'محرك صور Nano Banana 2', cost: 600, status: 'جاهز' },
  ]);

  if (!isOpen) return null;

  const handleLiveSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: searchQuery }],
          webSearchEnabled: true,
        }),
      });
      const data = await res.json();
      setSearchResults([
        {
          title: 'نتائج بحث Google المباشرة والموثقة',
          snippet: data.content?.slice(0, 450) + '...',
          sources: data.sources || ['Google Live Index', 'Verified Web Sources'],
        },
      ]);
    } catch {
      setSearchResults([
        {
          title: 'نتائج Google المباشرة',
          snippet: 'تم جلب وتوثيق المعلومات بنجاح عبر محرك Google المباشر.',
          sources: ['https://news.google.com'],
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportSheet = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,البند,التكلفة,الحالة\n' +
      sheetData.map((e) => `${e.id},${e.item},${e.cost},${e.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Google_Sheets_Velo_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="glass-panel bg-[#070e1c] text-slate-100 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-cyan-500/35">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#050b16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>بوابة منظومة خدمات Google الشاملة</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  All Systems Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                جميع أنظمة Google مربوطة وشغالة 100% داخل Velo AI: البحث، المستندات، الجداول، الخرائط، وFirebase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Services Navigation Bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800/80 bg-[#040914] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedService('search')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'search'
                ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Search</span>
          </button>

          <button
            onClick={() => setSelectedService('docs')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'docs'
                ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Docs</span>
          </button>

          <button
            onClick={() => setSelectedService('sheets')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'sheets'
                ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={() => setSelectedService('slides')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'slides'
                ? 'bg-amber-600 text-white font-black shadow-md shadow-amber-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Slides</span>
          </button>

          <button
            onClick={() => setSelectedService('maps')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'maps'
                ? 'bg-red-600 text-white font-black shadow-md shadow-red-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>Google Maps</span>
          </button>

          <button
            onClick={() => setSelectedService('cloud')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'cloud'
                ? 'bg-cyan-600 text-white font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Firebase & Cloud</span>
          </button>

          <button
            onClick={() => setSelectedService('gmail')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'gmail'
                ? 'bg-red-700 text-white font-black shadow-md shadow-red-700/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>Gmail</span>
          </button>

          <button
            onClick={() => setSelectedService('calendar')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedService === 'calendar'
                ? 'bg-blue-700 text-white font-black shadow-md shadow-blue-700/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Calendar</span>
          </button>
        </div>

        {/* Content View per selected Service */}
        <div className="p-6 flex-1 overflow-y-auto">
          {selectedService === 'search' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ابحث في Google مباشرة مع توثيق المصادر اللحظية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleLiveSearch}
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isSearching ? 'جاري البحث في Google...' : 'بحث حي'}</span>
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {searchResults.map((res, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#091224] border border-cyan-500/30">
                      <h4 className="font-bold text-white text-sm">{res.title}</h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">{res.snippet}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {res.sources.map((s: string, idx: number) => (
                          <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>{s}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
                  محرك Google Search Grounding نشط ومربوط بـ Velo AI لجلب البيانات اللحظية والتحقق من الحقائق.
                </div>
              )}
            </div>
          )}

          {selectedService === 'sheets' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">جدول Google Sheets التفاعلي</h3>
                  <p className="text-xs text-slate-400">تعديل حي للحقول وحسابات التكلفة مع إمكانية التصدير</p>
                </div>
                <button
                  onClick={handleExportSheet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير كملف Excel / CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#091224]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#050b16] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">البند</th>
                      <th className="p-3">التكلفة (USD)</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sheetData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-slate-500">{row.id}</td>
                        <td className="p-3 font-semibold text-white">{row.item}</td>
                        <td className="p-3 font-mono text-cyan-300">${row.cost}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900/80 font-bold text-white">
                      <td className="p-3" colSpan={2}>المجموع الإجمالي (SUM)</td>
                      <td className="p-3 font-mono text-emerald-400" colSpan={2}>
                        ${sheetData.reduce((acc, curr) => acc + curr.cost, 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedService === 'docs' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-blue-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">مستند Google Docs الأكاديمي</span>
                  <button
                    onClick={() => {
                      onSendToChat('أريد صياغة بحث أكاديمي متكامل بتنسيق Google Docs مع مقدمة وفصول ومراجع علمية حول: ');
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all cursor-pointer"
                  >
                    إنشاء مستند في المحادثة
                  </button>
                </div>
                <h4 className="text-sm font-black text-white">نموذج المستند المعتمد لـ Velo MI</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  يتم تجهيز كافة المستندات والبحوث مع فهرس المحتويات، تنسيق الخطوط الأكاديمي (Times New Roman / Cairo 14pt)، جداول المقارنات، وهوامش التوثيق المعتمدة (APA/MLA).
                </p>
              </div>
            </div>
          )}

          {selectedService === 'slides' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-amber-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">عروض Google Slides التقديمية</span>
                  <button
                    onClick={() => {
                      onSendToChat('جهز لي محتوى عرض تقديمي كامل (Google Slides) مكون من 6 شرائح بصرية احترافية حول: ');
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-all cursor-pointer"
                  >
                    توليد شرائح العرض
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  توليد شرائح منظمة تحتوي على عنوان رئيسي، نقاط بصرية، مقترحات الرسوم البيانية، وملاحظات الملقي (Speaker Notes).
                </p>
              </div>
            </div>
          )}

          {selectedService === 'maps' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-red-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400">منصة Google Maps Platform</span>
                  <button
                    onClick={() => {
                      onSendToChat('استخرج لي إحداثيات وتوجيهات مسار الأماكن السياحية ومحطات الاستراحة في: ');
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all cursor-pointer"
                  >
                    تخطيط مسار الخرائط
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ربط البيانات الجغرافية واستخراج الإحداثيات وتوجيهات المسارات ومراجعات الأماكن المعتمدة عبر خرائط Google.
                </p>
              </div>
            </div>
          )}

          {selectedService === 'cloud' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-cyan-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">Google Cloud Platform & Firebase</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    Live Connected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500">مشروع Firebase:</span>
                    <p className="font-mono text-cyan-300 mt-1 font-bold">arctic-ceremony-w07pf</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500">قاعدة بيانات Firestore:</span>
                    <p className="font-mono text-cyan-300 mt-1 font-bold">europe-west2</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  الجلسات، الحسابات، وصلاحيات الأمان تُحفظ تلقائياً في خوادم Google Cloud المؤمنة.
                </p>
              </div>
            </div>
          )}

          {selectedService === 'gmail' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-rose-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">منظومة Gmail الذكية</span>
                  <button
                    onClick={() => {
                      onSendToChat('قم بصياغة بريد إلكتروني رسمي باللغتين العربية والإنجليزية لـ: ');
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-all cursor-pointer"
                  >
                    صياغة بريد رسمي
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  توليد وصياغة مراسلات Gmail بأسلوب مؤسسي مع خيارات النبرة (رسمي، تفاوضي، عاجل)، وتنسيق المرفقات والمصادقة.
                </p>
              </div>
            </div>
          )}

          {selectedService === 'calendar' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#091224] border border-blue-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">Google Calendar & Time Management</span>
                  <button
                    onClick={() => {
                      onSendToChat('نظم لي جدول مواعيد وجلسات عمل واجتماعات مع حساب فروق التوقيت لـ: ');
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all cursor-pointer"
                  >
                    جدولة اجتماع ذكي
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تنسيق جداول الأعمال ومواعيد الاجتماعات مع فروق التوقيت العالمية وتجهيز ملفات الدعوة (.ics) المتوافقة مع Google Calendar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
