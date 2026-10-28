export interface MemoryItem {
  id: string;
  category: 'personal' | 'project' | 'conversation' | 'preference';
  key: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = 'velo_mi_memories';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'personal',
    key: 'أسلوب التواصل واللغة',
    content: 'المستخدم يفضل الردود الذكية العفوية بالعربية (بما فيها اللهجة الأردنية الودودة)، بدون حشو روبوتي أو مقدمات طويلة.',
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'mem-2',
    category: 'project',
    key: 'مشروع Velo AI Ultra',
    content: 'المشروع الحالي هو بناء نظام Velo AI المتفوق (بناء مواقع تفاعلية، ألعاب واقع افتراضي 3D، ملفات EXE، واستوديو صور Nano Banana 2).',
    updatedAt: Date.now() - 1800000,
  },
  {
    id: 'mem-3',
    category: 'preference',
    key: 'التشغيل الفوري والتنفيذ الذاتي',
    content: 'يفضل المستخدم دائماً أن يقوم Velo AI بالبناء المتأني عالي الجودة مع إمكانية التشغيل الفوري المباشر للموقع أو اللعبة داخل التطبيق.',
    updatedAt: Date.now() - 900000,
  },
  {
    id: 'mem-4',
    category: 'conversation',
    key: 'منظومة خدمات Google',
    content: 'المستخدم يعتمد على الربط الكامل بمنظومة خدمات Google (Search, Docs, Sheets, Slides, Drive, Firebase, Maps).',
    updatedAt: Date.now() - 300000,
  },
];

export const getStoredMemories = (): MemoryItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load memories:', e);
  }
  return INITIAL_MEMORIES;
};

export const saveMemories = (memories: MemoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error('Failed to save memories:', e);
  }
};

export const addMemory = (
  category: MemoryItem['category'],
  key: string,
  content: string
): MemoryItem => {
  const current = getStoredMemories();
  const newItem: MemoryItem = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    category,
    key,
    content,
    updatedAt: Date.now(),
  };
  const updated = [newItem, ...current];
  saveMemories(updated);
  return newItem;
};

export const deleteMemory = (id: string): MemoryItem[] => {
  const current = getStoredMemories();
  const updated = current.filter((m) => m.id !== id);
  saveMemories(updated);
  return updated;
};

export const updateMemory = (id: string, newContent: string): MemoryItem[] => {
  const current = getStoredMemories();
  const updated = current.map((m) =>
    m.id === id ? { ...m, content: newContent, updatedAt: Date.now() } : m
  );
  saveMemories(updated);
  return updated;
};

export const formatMemoriesForContext = (): string => {
  const memories = getStoredMemories();
  if (memories.length === 0) return '';

  return (
    '--- ذاكرة Velo AI طويلة الأمد عن المستخدم ومشاريع وتفضيلاته ---\n' +
    memories.map((m) => `• [${m.category.toUpperCase()} - ${m.key}]: ${m.content}`).join('\n') +
    '\n--------------------------------------------------------------'
  );
};
