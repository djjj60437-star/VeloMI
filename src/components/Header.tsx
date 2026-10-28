import React from 'react';
import {
  PanelRightOpen,
  Share2,
  SquarePen,
  GraduationCap,
  Code2,
  Globe,
  Globe2,
  ShieldCheck,
  User as UserIcon,
  Cloud,
} from 'lucide-react';
import { User } from '../types';
import { VeloLogo } from './VeloLogo';
import { SUPPORTED_LANGUAGES } from '../data/translations';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenStudentHub: () => void;
  onOpenDevStudio: () => void;
  onOpenGoogleHub: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  currentLang: string;
  onOpenLanguageModal: () => void;
  t: Record<string, string>;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  onOpenStudentHub,
  onOpenDevStudio,
  onOpenGoogleHub,
  currentUser,
  onOpenAuth,
  currentLang,
  onOpenLanguageModal,
  t,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="h-14 w-full flex items-center justify-between px-3 md:px-5 z-20 shrink-0 bg-[#050b16]/85 backdrop-blur-md border-b border-cyan-950/60 shadow-md text-slate-100">
      {/* Right side (RTL start): Sidebar toggle, New Chat, Student Hub, Dev Studio */}
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            title="فتح الشريط الجانبي"
            className="p-2 rounded-xl glass-btn text-slate-300 hover:text-white"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onNewChat}
          title={t.newChat || 'محادثة جديدة'}
          className="px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold text-slate-200 flex items-center gap-1.5"
        >
          <SquarePen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{t.newChat || 'محادثة جديدة'}</span>
        </button>

        {/* زر الطلاب للبحوث والمستندات (Word, Excel, PowerPoint, PDF) */}
        <button
          onClick={onOpenStudentHub}
          title="مركز الطلاب والباحثين: إعداد ملفات Word و Excel و PowerPoint و PDF"
          className="px-3 py-1.5 rounded-xl glass-btn border-blue-500/30 text-xs font-bold text-blue-300 flex items-center gap-1.5 hover:border-blue-400 transition-all cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="hidden md:inline">{t.studentHub || 'مركز الطلاب'}</span>
        </button>

        {/* أداة البرمجة وبناء التطبيقات وألعاب VR و EXE */}
        <button
          onClick={onOpenDevStudio}
          title="بناء تطبيقات، ألعاب VR، وملفات EXE تفوق Replit بكود لا تكشفه أدوات فحص AI"
          className="px-3 py-1.5 rounded-xl glass-btn border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1.5 hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>{t.devStudio || 'المطور الخارق'} (EXE/VR)</span>
        </button>

        {/* بوابة خدمات Google الشاملة */}
        <button
          onClick={onOpenGoogleHub}
          title="الربط مع كافة خدمات Google"
          className="hidden lg:flex px-2.5 py-1.5 rounded-xl glass-btn text-xs font-semibold text-slate-300 items-center gap-1.5 hover:text-white border-cyan-900/50"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.googleHub || 'خدمات Google'}</span>
        </button>
      </div>

      {/* Center: Velo MI 6.1 Ultra Glass Badge */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel shadow-xs border border-cyan-500/30 bg-[#091224]/80">
          <VeloLogo size={22} />
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="text-white font-extrabold tracking-tight">Velo MI</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold tracking-wide shadow-xs">
              6.1 Ultra
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="الخوارزميات متصلة وتعمل بكامل طاقتها" />
        </div>
      </div>

      {/* Left side (RTL end): Language Selector, Auth & Security & Share */}
      <div className="flex items-center gap-2">
        {/* زر لغات العالم (World Languages Button) */}
        <button
          onClick={onOpenLanguageModal}
          title="تغيير لغة النظام والتحدث بكافة لغات العالم"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-btn border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <span className="text-sm">{currentLangObj.flag}</span>
          <span className="hidden sm:inline font-mono">{currentLangObj.nativeName}</span>
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* User Account / Firebase Auth Button */}
        {currentUser?.isLoggedIn ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full glass-panel border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-cyan-500"
            />
            <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate hidden md:inline">
              {currentUser.name}
            </span>
            <span title="موثق عبر Google Firebase">
              <Cloud className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-btn text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all border border-cyan-500/40"
          >
            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.login || 'تسجيل الدخول'}</span>
          </button>
        )}

        <div
          title="نظام مفتوح المصدر مؤمن بالكامل ضد الهجمات السيبرانية"
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xs select-none"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>حماية سيبرانية</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ رابط Velo MI إلى الحافظة بنجاح!');
          }}
          title="مشاركة الرابط"
          className="p-2 rounded-xl glass-btn text-slate-400 hover:text-white"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
