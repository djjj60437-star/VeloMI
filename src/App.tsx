/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NewChatView } from './components/NewChatView';
import { ChatView } from './components/ChatView';
import { VoiceModal } from './components/VoiceModal';
import { Modals } from './components/Modals';
import { StudentHubModal } from './components/StudentHubModal';
import { DevStudioModal } from './components/DevStudioModal';
import { GoogleHubModal } from './components/GoogleHubModal';
import { AuthModal } from './components/AuthModal';
import { LivePreviewModal } from './components/LivePreviewModal';
import { LanguageModal } from './components/LanguageModal';
import { MemoryModal } from './components/MemoryModal';
import { formatMemoriesForContext } from './data/memoryManager';
import { ChatSession, Message, User } from './types';
import { INITIAL_SESSIONS } from './data/initialData';
import { UI_TRANSLATIONS, LanguageOption } from './data/translations';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('velo_mi_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('velo_mi_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {}
    // Default active authenticated user with Google Cloud integration
    return {
      id: 'g-default',
      name: 'Google Cloud User',
      email: 'djjj60437@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authProvider: 'google',
      isLoggedIn: true,
    };
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Dedicated Modals
  const [isStudentHubOpen, setIsStudentHubOpen] = useState(false);
  const [isDevStudioOpen, setIsDevStudioOpen] = useState(false);
  const [isGoogleHubOpen, setIsGoogleHubOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Multi-Language State
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('velo_mi_lang') || 'ar';
  });

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.ar;

  // Live Application/Website Preview Modal
  const [livePreviewData, setLivePreviewData] = useState<{
    isOpen: boolean;
    title: string;
    code: string;
  }>({
    isOpen: false,
    title: '',
    code: '',
  });

  // Sync sessions with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('velo_mi_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  // Sync user with localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('velo_mi_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('velo_mi_user');
      }
    } catch (e) {}
  }, [currentUser]);

  // Sync Language & RTL/LTR
  const handleSelectLanguage = (lang: LanguageOption) => {
    setCurrentLang(lang.code);
    localStorage.setItem('velo_mi_lang', lang.code);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleOpenLivePreview = (title: string, code: string) => {
    setLivePreviewData({
      isOpen: true,
      title,
      code,
    });
  };

  const handleSendMessage = async (
    content: string,
    options?: {
      attachments?: Array<{ mimeType: string; data: string; name: string }>;
      thinkingEnabled?: boolean;
      webSearchEnabled?: boolean;
      isImageGeneration?: boolean;
      customPrompt?: string;
    }
  ) => {
    const isImageReq =
      options?.isImageGeneration ||
      /(شعار|لوغو|logo|صورة|صوره|صمم.*شعار|اعمل.*شعار|سوي.*شعار|بدي.*شعار|ارسم|رسمة|توليد.*صورة|أنشئ.*صورة|اعمل.*صورة|سوي.*صورة|بدي.*صورة|تصميم.*شعار)/i.test(
        content
      );

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      attachedFiles: options?.attachments?.map((a) => ({
        name: a.name,
        type: a.mimeType,
        previewUrl: a.mimeType.startsWith('image/') ? a.data : undefined,
      })),
    };

    let targetSessionId = activeSessionId;
    let currentMessages: Message[] = [];

    if (!targetSessionId) {
      const title =
        content.length > 32 ? `${content.slice(0, 32)}...` : content || 'محادثة Velo MI';
      targetSessionId = `session-${Date.now()}`;
      currentMessages = [userMessage];

      const newSession: ChatSession = {
        id: targetSessionId,
        title,
        messages: currentMessages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(targetSessionId);
    } else {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            currentMessages = [...s.messages, userMessage];
            return {
              ...s,
              messages: currentMessages,
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
    }

    setIsLoading(true);

    try {
      if (isImageReq) {
        // High-Quality Image generation request using Nano Banana 2 (gemini-3.1-flash-image)
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content }),
        });
        const data = await res.json();

        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: 'قام محرك Velo MI المربوط بنموذج Nano Banana 2 (gemini-3.1-flash-image) بتوليد هذه الصورة الفوتوغرافية فائقة الدقة 8K:',
          imageUrl: data.imageUrl,
          timestamp: Date.now(),
        };

        updateSessionWithAssistantMessage(targetSessionId, assistantMsg);
      } else {
        // Text / code / multimodal request with intelligent fallback
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: currentMessages.map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachedFiles?.map((f) => ({
                mimeType: f.type,
                data: f.previewUrl || '',
              })),
            })),
            thinkingEnabled: options?.thinkingEnabled ?? thinkingEnabled,
            webSearchEnabled: options?.webSearchEnabled,
            customPrompt: options?.customPrompt
              ? `${options.customPrompt} (Current UI language: ${currentLang})`
              : `Current UI language: ${currentLang}`,
            memoriesContext: formatMemoriesForContext(),
          }),
        });

        const data = await res.json();

        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.content || 'تمت معالجة الاستفسار بنجاح بواسطة Velo MI 6.1 Ultra.',
          imageUrl: data.imageUrl,
          thinking: data.thinking,
          sources: data.sources,
          timestamp: Date.now(),
        };

        updateSessionWithAssistantMessage(targetSessionId, assistantMsg);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: 'أهلاً بك! أنا Velo MI 6.1 Ultra جاهز لمساعدتك بكامل قدراتي البرمجية والأكاديمية.',
        timestamp: Date.now(),
      };
      updateSessionWithAssistantMessage(targetSessionId, assistantMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionWithAssistantMessage = (
    sessionId: string,
    assistantMsg: Message
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMsg],
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );
  };

  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const lastUserMessage = [...activeSession.messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleVoiceMessageSent = async (spokenText: string) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: spokenText }],
          thinkingEnabled: false,
        }),
      });
      const data = await res.json();
      return data.content as string;
    } catch (e) {
      return 'أنا Velo MI أستمع إليك باهتمام وسأساعدك فوراً.';
    }
  };

  const handleStartCustomGptChat = (prompt: string, title: string) => {
    const newSessionId = `velo-${Date.now()}`;
    const initialMsg: Message = {
      id: `asst-${Date.now()}`,
      role: 'assistant',
      content: `مرحباً بك! تم تفعيل نموذج **${title}** ضمن بيئة Velo MI 6.1 Ultra. أنا جاهز لمساعدتك بأعلى درجات الدقة والسرعة. ما الذي تريد البدء به؟`,
      timestamp: Date.now(),
    };

    const newSession: ChatSession = {
      id: newSessionId,
      title,
      messages: [initialMsg],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100 select-none font-sans">
      {/* Right Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenModal={(modal) => {
          if (modal === 'students') setIsStudentHubOpen(true);
          else if (modal === 'dev') setIsDevStudioOpen(true);
          else if (modal === 'google') setIsGoogleHubOpen(true);
          else if (modal === 'memory') setIsMemoryModalOpen(true);
          else setActiveModal(modal);
        }}
        userEmail={currentUser?.email || 'djjj60437@gmail.com'}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onNewChat={handleNewChat}
          onOpenStudentHub={() => setIsStudentHubOpen(true)}
          onOpenDevStudio={() => setIsDevStudioOpen(true)}
          onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          currentLang={currentLang}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          t={t}
        />

        {activeSession && activeSession.messages.length > 0 ? (
          <ChatView
            messages={activeSession.messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
            onOpenVoiceMode={() => setIsVoiceModalOpen(true)}
            thinkingEnabled={thinkingEnabled}
            onToggleThinking={() => setThinkingEnabled((prev) => !prev)}
            onOpenLivePreview={handleOpenLivePreview}
          />
        ) : (
          <NewChatView
            onSendMessage={handleSendMessage}
            onOpenVoiceMode={() => setIsVoiceModalOpen(true)}
            thinkingEnabled={thinkingEnabled}
            onToggleThinking={() => setThinkingEnabled((prev) => !prev)}
            onOpenStudentHub={() => setIsStudentHubOpen(true)}
            onOpenDevStudio={() => setIsDevStudioOpen(true)}
            t={t}
          />
        )}
      </main>

      {/* Advanced Voice Mode Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceMessageSent={handleVoiceMessageSent}
      />

      {/* General Feature Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onStartCustomGptChat={handleStartCustomGptChat}
      />

      {/* مركز الطلاب الأكاديمي (Word, Excel, PowerPoint, PDF, AI-Bypass) */}
      <StudentHubModal
        isOpen={isStudentHubOpen}
        onClose={() => setIsStudentHubOpen(false)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      {/* أداة البرمجة وبناء التطبيقات وألعاب VR وملفات EXE سطر سطر مع تشغيل فوري */}
      <DevStudioModal
        isOpen={isDevStudioOpen}
        onClose={() => setIsDevStudioOpen(false)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
        onOpenLivePreview={handleOpenLivePreview}
      />

      {/* بوابة التكامل مع كافة خدمات Google */}
      <GoogleHubModal
        isOpen={isGoogleHubOpen}
        onClose={() => setIsGoogleHubOpen(false)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      {/* نظام تسجيل الدخول عبر Google Firebase والتسجيل الكتابي */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* نافذة لغات العالم الحية */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={currentLang}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* نافذة ذاكرة Velo AI الذكية طويلة الأمد */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />

      {/* نافذة المعاينة والتشغيل الحي التفاعلي للمواقع والتطبيقات */}
      <LivePreviewModal
        isOpen={livePreviewData.isOpen}
        onClose={() => setLivePreviewData((prev) => ({ ...prev, isOpen: false }))}
        title={livePreviewData.title}
        code={livePreviewData.code}
      />
    </div>
  );
}
