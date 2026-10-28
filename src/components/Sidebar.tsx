import React from 'react';
import {
  SquarePen,
  Image as ImageIcon,
  Library,
  Clock,
  Compass,
  Folder,
  Terminal,
  MoreHorizontal,
  Search,
  PanelRightClose,
  Trash2,
  Sparkles,
  Shield,
  Zap,
  GraduationCap,
  Code2,
  Globe,
  Brain,
} from 'lucide-react';
import { ChatSession, User } from '../types';
import { VeloLogo } from './VeloLogo';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenModal: (modalName: string) => void;
  userEmail?: string;
  currentUser?: User | null;
  onOpenAuth?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenModal,
  userEmail = 'djjj60437@gmail.com',
  currentUser,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-[260px] h-screen bg-[#040914]/95 backdrop-blur-2xl border-l border-cyan-950/60 flex flex-col justify-between select-none z-30 transition-all duration-200 shrink-0 shadow-2xl text-slate-200">
      {/* Top Header & Navigation Menu */}
      <div className="flex flex-col flex-1 overflow-y-auto px-3 pt-3.5 pb-2">
        {/* Header row: Velo MI Logo + Search + Collapse toggle */}
        <div className="flex items-center justify-between px-2 mb-3.5">
          <div className="flex items-center gap-2">
            <VeloLogo size={28} />
            <div className="flex items-center">
              <span className="text-[17px] font-black tracking-tight text-white">
                Velo
              </span>
              <span className="text-[17px] font-black tracking-tight text-cyan-400 mr-1">
                MI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => onOpenModal('search')}
              title="بحث في المحادثات"
              className="p-1.5 rounded-xl glass-btn text-slate-400 hover:text-white"
            >
              <Search className="w-[17px] h-[17px]" />
            </button>
            <button
              onClick={onToggle}
              title="إغلاق الشريط الجانبي"
              className="p-1.5 rounded-xl glass-btn text-slate-400 hover:text-white"
            >
              <PanelRightClose className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* Action Items List with Glass buttons */}
        <nav className="flex flex-col gap-1 text-[13.5px] text-slate-300 font-medium">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right transition-all duration-200 cursor-pointer ${
              activeSessionId === null
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'glass-btn hover:text-white'
            }`}
          >
            <span className="flex-1 text-right">محادثة جديدة</span>
            <SquarePen
              className={`w-4 h-4 shrink-0 mr-2 ${
                activeSessionId === null ? 'text-slate-950' : 'text-cyan-400'
              }`}
            />
          </button>

          <button
            onClick={() => onOpenModal('students')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right glass-btn border-blue-500/30 text-blue-300 hover:text-white font-bold cursor-pointer"
          >
            <span className="flex-1 text-right">مركز الطلاب (Word/Excel/PPT)</span>
            <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mr-2" />
          </button>

          <button
            onClick={() => onOpenModal('dev')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right glass-btn border-cyan-500/30 text-cyan-300 hover:text-white font-bold cursor-pointer"
          >
            <span className="flex-1 text-right">المطور الخارق (EXE/VR Studio)</span>
            <Code2 className="w-4 h-4 text-cyan-400 shrink-0 mr-2" />
          </button>

          {/* ذاكرة Velo AI طويلة الأمد */}
          <button
            onClick={() => onOpenModal('memory')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right glass-btn border-cyan-500/30 text-cyan-300 hover:text-white font-bold cursor-pointer"
          >
            <span className="flex-1 text-right">ذاكرة Velo AI (الذكريات المحفوظة)</span>
            <Brain className="w-4 h-4 text-cyan-400 shrink-0 mr-2" />
          </button>
        </nav>

        {/* Section: المحادثات الأخيرة */}
        <div className="mt-5 mb-1.5 px-2.5 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-400">
            المحادثات الأخيرة
          </span>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
            Velo 6.1
          </span>
        </div>

        {/* Recent Chats List with glass effects */}
        <div className="flex flex-col gap-1 mt-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 shadow-xs border border-cyan-500/40 font-bold text-white'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                <span className="truncate flex-1 text-right pl-2">
                  {session.title}
                </span>

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                    title="حذف المحادثة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-cyan-950/60 bg-[#050b16]/95 backdrop-blur-md">
        <div
          onClick={onOpenAuth}
          className="flex items-center gap-2.5 p-2 rounded-xl glass-btn cursor-pointer hover:border-cyan-400 transition-all border-cyan-900/60"
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-cyan-500 object-cover shadow-xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              {(currentUser?.name || userEmail).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1 text-right">
            <span className="text-[13px] font-semibold text-white truncate">
              {currentUser?.name || userEmail}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              <span>{currentUser?.isLoggedIn ? 'Google Firebase نشط' : 'Velo Ultra مفعل'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
