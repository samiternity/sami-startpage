// Deep module: configuration store for start page shortcuts
const STORAGE_KEY = 'aura_startpage_shortcuts';

export const DEFAULT_SHORTCUTS = [
  // Row 1: Socials & University LMS
  { 
    id: 'x', 
    title: 'X', 
    url: 'https://x.com', 
    color: '#ffffff', 
    gradient: ['#ffffff', '#94a3b8'], 
    icon: 'x', 
    row: 1 
  },
  { 
    id: 'instagram', 
    title: 'Instagram', 
    url: 'https://instagram.com', 
    color: '#E1306C', 
    gradient: ['#833ab4', '#fd1d1d', '#fcb045'], 
    icon: 'instagram', 
    row: 1 
  },
  { 
    id: 'youtube', 
    title: 'YouTube', 
    url: 'https://youtube.com', 
    color: '#FF0000', 
    gradient: ['#ff3b30', '#c41c14'], 
    icon: 'youtube', 
    row: 1 
  },
  { 
    id: 'ytmusic', 
    title: 'YouTube Music', 
    url: 'https://music.youtube.com', 
    color: '#FF0000', 
    gradient: ['#ff1744', '#ff5252'], 
    icon: 'ytmusic', 
    row: 1 
  },
  { 
    id: 'linkedin', 
    title: 'LinkedIn', 
    url: 'https://linkedin.com', 
    color: '#0A66C2', 
    gradient: ['#0077b5', '#00a0dc'], 
    icon: 'linkedin', 
    row: 1 
  },
  { 
    id: 'github', 
    title: 'GitHub', 
    url: 'https://github.com', 
    color: '#ffffff', 
    gradient: ['#ffffff', '#8b949e'], 
    icon: 'github', 
    row: 1 
  },
  { 
    id: 'lms', 
    title: 'LMS+', 
    url: 'https://lmsplus.xyz/lms/monitor', 
    color: '#d4af37', 
    gradient: ['#fef3c7', '#d4af37', '#92400e'], 
    icon: 'anchor', 
    row: 1 
  },

  // Row 2: AI Tools
  { 
    id: 'grok', 
    title: 'Grok', 
    url: 'https://grok.com', 
    color: '#ffffff', 
    gradient: ['#ffffff', '#818cf8'], 
    icon: 'grok', 
    row: 2 
  },
  { 
    id: 'gemini', 
    title: 'Gemini', 
    url: 'https://gemini.google.com', 
    color: '#1BA0E2', 
    gradient: ['#1ba0e2', '#9b51e0'], 
    icon: 'gemini', 
    row: 2 
  },
  { 
    id: 'chatgpt', 
    title: 'ChatGPT', 
    url: 'https://chatgpt.com', 
    color: '#10A37F', 
    gradient: ['#10a37f', '#059669'], 
    icon: 'chatgpt', 
    row: 2 
  },
  { 
    id: 'notebooklm', 
    title: 'NotebookLM', 
    url: 'https://notebooklm.google.com', 
    color: '#4285F4', 
    gradient: ['#4285f4', '#00c9a7'], 
    icon: 'notebooklm', 
    row: 2 
  },
  { 
    id: 'claude', 
    title: 'Claude', 
    url: 'https://claude.ai', 
    color: '#D97757', 
    gradient: ['#d97757', '#f59e0b'], 
    icon: 'claude', 
    row: 2 
  },
  { 
    id: 'perplexity', 
    title: 'Perplexity', 
    url: 'https://perplexity.ai', 
    color: '#20B8CD', 
    gradient: ['#20b8cd', '#3b82f6'], 
    icon: 'perplexity', 
    row: 2 
  }
];

export function getShortcuts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SHORTCUTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SHORTCUTS;
    let modified = false;

    // Auto-migrate LMS+ URL & styling if cached
    const lmsItem = parsed.find(s => s.id === 'lms');
    if (lmsItem && lmsItem.url !== 'https://lmsplus.xyz/lms/monitor') {
      lmsItem.url = 'https://lmsplus.xyz/lms/monitor';
      lmsItem.color = '#d4af37';
      lmsItem.gradient = ['#fef3c7', '#d4af37', '#92400e'];
      modified = true;
    }

    // Auto-migrate GitHub shortcut if missing in cached storage
    if (!parsed.some(s => s.id === 'github')) {
      const githubItem = {
        id: 'github',
        title: 'GitHub',
        url: 'https://github.com',
        color: '#ffffff',
        gradient: ['#ffffff', '#8b949e'],
        icon: 'github',
        row: 1
      };
      const linkedinIdx = parsed.findIndex(s => s.id === 'linkedin');
      if (linkedinIdx !== -1) {
        parsed.splice(linkedinIdx + 1, 0, githubItem);
      } else {
        const lmsIdx = parsed.findIndex(s => s.id === 'lms');
        if (lmsIdx !== -1) {
          parsed.splice(lmsIdx, 0, githubItem);
        } else {
          parsed.push(githubItem);
        }
      }
      modified = true;
    }

    if (modified) {
      saveShortcuts(parsed);
    }
    return parsed;
  } catch {
    return DEFAULT_SHORTCUTS;
  }
}

export function saveShortcuts(shortcuts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
  } catch (err) {
    console.error('Failed to save shortcuts:', err);
  }
}
