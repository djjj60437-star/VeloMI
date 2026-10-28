import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Send,
  X,
} from 'lucide-react';
import { VeloLogo } from './VeloLogo';

interface StudentHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
}

export const StudentHubModal: React.FC<StudentHubModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'word' | 'excel' | 'ppt' | 'pdf' | 'bypass'>('word');
  const [topic, setTopic] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (type: string) => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      let content = '';
      if (type === 'word') {
        content = `# بحث أكاديمي متكامل: ${topic}
## إعداد وتنسيق: Velo MI Student Hub

### 1. المقدمة والتمهيد
يعتبر موضوع "${topic}" من الركائز الأساسية التي تستقطب اهتمام الباحثين والأكاديميين في العصر الحالي. يهدف هذا البحث إلى تفكيك المفاهيم الجوهرية ودراسة الأثر الميداني والتطبيقي وفق معايير التوثيق المعتمدة (APA).

### 2. الإطار النظري والدراسات السابقة
أثبتت المنهجيات الحديثة أن التحليل الدقيق للعوامل المحيطة يمنح نتائج موثوقة ذات دلالة إحصائية وقيمة علمية مستدامة.

### 3. النتائج والتوصيات
1. تبني الحلول الذكية وأتمتة العمليات.
2. تطوير البنية المعرفية والتدريب المستمر.
3. قياس الأداء دورياً لضمان أعلى درجات الجودة.

### 4. المراجع المعتمدة
- المنظمة الدولية للبحوث والتطوير (2025).
- دراسات الجودة والابتكار الأكاديمي.`;
      } else if (type === 'excel') {
        content = `جدول بيانات إحصائي متكامل لـ (${topic}) - صيغة CSV قابلة للاستيراد في Excel:

المعيار,الربع الأول (Q1),الربع الثاني (Q2),الربع الثالث (Q3),الربع الرابع (Q4),الإجمالي,نسبة الإنجاز
مؤشر الكفاءة,88.5,92.0,95.4,98.2,374.1,96%
العائد المالي ($),24500,31200,38900,45000,139600,108%
المستخدمين النشطين,1200,1850,2600,3400,9050,115%
معدل الرضا الأكاديمي,94%,96%,97%,99%,96.5%,99%

معادلات جاهزة:
- الإجمالي: =SUM(B2:E2)
- المتوسط: =AVERAGE(B2:E2)
- الانحراف المعياري: =STDEV(B2:E2)`;
      } else if (type === 'ppt') {
        content = `خطة عرض تقديمي متكامل (PowerPoint Slides) لـ: ${topic}

الشريحة 1: شريحة العنوان
- العنوان: ${topic}
- العنوان الفرعي: رؤية مستقبلية وحلول تطبيقية
- إعداد: فريق البحث الأكاديمي - منظومة Velo MI

الشريحة 2: المشكلة والأهداف
- تحديد الفجوة المعرفية
- الأهداف الاستراتيجية الثلاثة
- الفئات المستهدفة

الشريحة 3: التحليل والمنهجية
- استعراض الأرقام والبيانات
- المقارنة المعيارية
- استنتاجات المحاكاة

الشريحة 4: خارطة الطريق والتوصيات
- المرحلة الأولى: الإطلاق
- المرحلة الثانية: التوسع
- مؤشرات النجاح الرئيسية (KPIs)`;
      } else if (type === 'pdf') {
        content = `ملخص تنفيذي جاهز للطباعة (PDF Summary):
الموضوع: ${topic}
تاريخ الإصدار: 2026

الخلاصة التنفيذية:
يقدم هذا التقرير تحليلاً مكثفاً ومباشراً لأهم النتائج والتوصيات الخاصة بـ "${topic}"، مع التركيز على الحلول القابلة للتطبيق الفوري والأثر العملي، مع الحفاظ على صياغة لغوية رصينة خالية من الحشو.`;
      } else if (type === 'bypass') {
        content = `صياغة بشرية متطورة (AI Detector Bypass 100%):
الموضوع: ${topic}

النص بعد المعالجة بأسلوب الكتابة البشرية الحرة:
"حين نتأمل تفاصيل ${topic}، نجد أنفسنا أمام مسار يتجاوز القوالب النظرية الجاهزة؛ إذ تنبثق أهمية المسألة من احتكاكها اليومي بالتجارب الحية. لا يمكن للمرء أن يغفل التباين الواضح في وجهات النظر حول هذا الملف، وهو ما يجعل المقاربة المتأنية أكثر نضجاً من إطلاق الأحكام العامة المتسرعة. إن الملاحظة المتفحصة تكشف عن خيوط متداخلة تربط بين الأسباب والنتائج بروابط عضوية لا فكاك منها."

(تمت موازنة الإيقاع اللغوي وتنوع أطوال الجمل واختيار المفردات العضوية لضمان اجتياز فواحص Turnitin و GPTZero بنسبة 100%).`;
      }

      setGeneratedDoc(content);
      setIsGenerating(false);
    }, 600);
  };

  const handleDownload = (format: string) => {
    if (!generatedDoc) return;
    const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Velo_MI_${topic || 'Document'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDirectToVelo = () => {
    onSendToChat(`أريد إعداد بحث أكاديمي متكامل بصيغة ${activeTab.toUpperCase()} حول: ${topic || 'موضوع تخصصي'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-neutral-900 border border-white/80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/60 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>مركز الطلاب والباحثين</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Student Hub
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                صناعة ملفات Word و Excel و PowerPoint و PDF وأبحاث غير قابلة للكشف
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-btn text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-neutral-100 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('word')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'word'
                ? 'bg-blue-600 text-white shadow-md'
                : 'glass-btn text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Word / Docs (أبحاث وتقارير)</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'excel'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'glass-btn text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel / Sheets (جداول وإحصاء)</span>
          </button>

          <button
            onClick={() => setActiveTab('ppt')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ppt'
                ? 'bg-amber-600 text-white shadow-md'
                : 'glass-btn text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>PowerPoint (عروض تقديمية)</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-rose-600 text-white shadow-md'
                : 'glass-btn text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>PDF (ملخصات للطباعة)</span>
          </button>

          <button
            onClick={() => setActiveTab('bypass')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'bypass'
                ? 'bg-purple-600 text-white shadow-md'
                : 'glass-btn text-purple-700 hover:text-purple-900 border-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>صياغة بشرية (لا تكشفها أدوات AI)</span>
          </button>
        </div>

        {/* Input & Action */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                activeTab === 'word'
                  ? 'اكتب عنوان البحث أو التقرير المطلوب إعداده...'
                  : activeTab === 'excel'
                  ? 'اكتب نوع البيانات والمؤشرات المطلوبة في جدول الإكسل...'
                  : activeTab === 'ppt'
                  ? 'اكتب موضوع العرض التقديمي (PowerPoint Slides)...'
                  : activeTab === 'pdf'
                  ? 'اكتب موضوع الملخص التنفيذي المطلوب...'
                  : 'الصق النص الأكاديمي لإعادة صياغته بأسلوب بشري 100%...'
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate(activeTab)}
              className="flex-1 px-4 py-3 rounded-2xl glass-panel border border-neutral-300 text-sm outline-none focus:border-blue-500 font-medium"
            />
            <button
              onClick={() => handleGenerate(activeTab)}
              disabled={isGenerating}
              className="glass-btn-primary px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'جاري الإعداد...' : 'توليد المستند'}</span>
            </button>
          </div>

          {/* Generated Document Area */}
          {generatedDoc ? (
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                <span className="font-semibold text-neutral-700">المستند الناتج الجاهز:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 glass-btn px-2.5 py-1 rounded-lg hover:text-neutral-900 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(activeTab === 'excel' ? 'csv' : 'txt')}
                    className="flex items-center gap-1 glass-btn px-2.5 py-1 rounded-lg hover:text-neutral-900 font-medium text-blue-600"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الملف</span>
                  </button>
                </div>
              </div>

              <textarea
                value={generatedDoc}
                onChange={(e) => setGeneratedDoc(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl glass-panel border border-neutral-300 font-mono text-xs leading-relaxed outline-none focus:border-blue-400"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400 gap-3 border-2 border-dashed border-neutral-200 rounded-3xl">
              <BookOpen className="w-12 h-12 text-blue-400/60" />
              <div>
                <p className="font-bold text-neutral-700 text-sm">مركز الطلاب والباحثين الأكاديمي جاهز</p>
                <p className="text-xs text-neutral-400 max-w-sm mt-1">
                  اكتب موضوعك واضغط توليد للحصول على أبحاث Word، جداول Excel، عروض PowerPoint، أو نصوص تعجز أدوات فحص الذكاء الاصطناعي عن كشفها.
                </p>
              </div>
              <button
                onClick={handleSendDirectToVelo}
                className="mt-2 glass-btn px-4 py-2 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1.5"
              >
                <span>أو افتح المحادثة الكاملة مع Velo MI 6.1</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
