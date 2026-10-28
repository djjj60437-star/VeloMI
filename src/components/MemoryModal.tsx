import React, { useState } from 'react';
import {
  Brain,
  X,
  Trash2,
  Plus,
  Edit2,
  Check,
  Sparkles,
  ShieldCheck,
  FolderKanban,
  User,
  MessagesSquare,
  Sliders,
} from 'lucide-react';
import {
  MemoryItem,
  getStoredMemories,
  addMemory,
  deleteMemory,
  updateMemory,
} from '../data/memoryManager';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => getStoredMemories());
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'project' | 'conversation' | 'preference'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('personal');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  if (!isOpen) return null;

  const filteredMemories =
    activeTab === 'all' ? memories : memories.filter((m) => m.category === activeTab);

  const handleAdd = () => {
    if (!newKey.trim() || !newContent.trim()) return;
    const added = addMemory(newCategory, newKey.trim(), newContent.trim());
    setMemories([added, ...memories]);
    setNewKey('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = deleteMemory(id);
    setMemories(updated);
  };

  const handleStartEdit = (m: MemoryItem) => {
    setEditingId(m.id);
    setEditingText(m.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    const updated = updateMemory(id, editingText.trim());
    setMemories(updated);
    setEditingId(null);
  };

  const getCategoryIcon = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'personal':
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-blue-400" />;
      case 'conversation':
        return <MessagesSquare className="w-4 h-4 text-indigo-400" />;
      case 'preference':
        return <Sliders className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCategoryLabel = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'personal':
        return 'ذاكرة شخصية';
      case 'project':
        return 'ذاكرة المشاريع';
      case 'conversation':
        return 'ذاكرة المحادثات';
      case 'preference':
        return 'ذاكرة التفضيلات';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="glass-panel bg-[#070e1c] text-slate-100 rounded-3xl w-full max-w-3xl max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-cyan-500/35">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#050b16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ذاكرة Velo AI الذكية طويلة الأمد</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Long-term Memory
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                يتذكر مشاريعك، أسلوبك، وتفضيلاتك في كافة المحادثات مع إمكانية التعديل والحذف الكامل للخصوصية
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

        {/* Tab filters and Add memory button */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800/80 bg-[#040914] text-xs font-bold overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              الكل ({memories.length})
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              شخصية
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'project'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              مشاريع
            </button>
            <button
              onClick={() => setActiveTab('preference')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'preference'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              تفضيلات
            </button>
          </div>

          <button
            onClick={() => setIsAdding((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة ذكرى جديدة</span>
          </button>
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <div className="p-4 bg-[#0a1428] border-b border-cyan-500/30 flex flex-col gap-3 animate-fadeIn">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="عنوان الذكرى (مثال: لغة البرمجة المفضلة، أسلوب الرد)..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 outline-none font-bold"
              >
                <option value="personal">شخصية</option>
                <option value="project">مشروع</option>
                <option value="preference">تفضيل</option>
                <option value="conversation">محادثة</option>
              </select>
            </div>
            <textarea
              placeholder="اكتب ما ترغب أن يتذكره Velo AI عنك بشكل دائم في كافة جلساتك القادمة..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-md cursor-pointer hover:brightness-110"
              >
                حفظ في الذاكرة الدائمة
              </button>
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-3">
          {filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              لا توجد ذكريات محفوظة ضمن هذا التصنيف حالياً.
            </div>
          ) : (
            filteredMemories.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-[#091224] border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col gap-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/80">
                      {getCategoryIcon(m.category)}
                    </div>
                    <span className="font-bold text-sm text-white">{m.key}</span>
                    <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {getCategoryLabel(m.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(m)}
                      title="تعديل الذكرى"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      title="حذف من الذاكرة (انسَ هذا)"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === m.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-white font-medium outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSaveEdit(m.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                      >
                        حفظ التعديل
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pr-1">
                    {m.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-[#050b16] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>الذاكرة خاصة بك 100% ومحمية ومدمجة بسياق Velo AI التلقائي</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            {memories.length} ذكريات نشطة
          </span>
        </div>
      </div>
    </div>
  );
};
