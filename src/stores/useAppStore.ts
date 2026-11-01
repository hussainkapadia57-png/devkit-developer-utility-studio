import { create } from 'zustand';
import { LayoutDensity, RecentToolItem, ThemeMode, ToastMessage } from '../types';

interface AppState {
  // Favorites
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // Recent History
  recentTools: RecentToolItem[];
  recordToolVisit: (toolId: string) => void;
  clearRecentTools: () => void;
  historyEnabled: boolean;
  setHistoryEnabled: (enabled: boolean) => void;

  // Appearance & Interface
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: LayoutDensity;
  setDensity: (density: LayoutDensity) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Clear all stored data
  clearAllData: () => void;
}

const STORAGE_KEY_FAVORITES = 'devkit_favorites';
const STORAGE_KEY_RECENTS = 'devkit_recents';
const STORAGE_KEY_THEME = 'devkit_theme';
const STORAGE_KEY_DENSITY = 'devkit_density';
const STORAGE_KEY_HISTORY_ENABLED = 'devkit_history_enabled';
const STORAGE_KEY_SIDEBAR = 'devkit_sidebar_collapsed';

const getInitialFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return ['json-formatter', 'base64', 'jwt-decoder', 'regex-tester'];
};

const getInitialRecents = (): RecentToolItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

const getInitialTheme = (): ThemeMode => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode;
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // fallback
  }
  return 'dark';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } else if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Run immediately on module evaluation
if (typeof window !== 'undefined') {
  applyThemeToDOM(getInitialTheme());
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: getInitialFavorites(),
  toggleFavorite: (toolId: string) => {
    const current = get().favorites;
    const exists = current.includes(toolId);
    const updated = exists ? current.filter((id) => id !== toolId) : [...current, toolId];
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    } catch {
      // storage error
    }
    set({ favorites: updated });
    get().addToast({
      type: 'info',
      title: exists ? 'Removed from favorites' : 'Added to favorites',
      duration: 2500,
    });
  },
  isFavorite: (toolId: string) => get().favorites.includes(toolId),

  recentTools: getInitialRecents(),
  recordToolVisit: (toolId: string) => {
    if (!get().historyEnabled) return;
    const current = get().recentTools.filter((item) => item.toolId !== toolId);
    const updated = [{ toolId, timestamp: Date.now() }, ...current].slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(updated));
    } catch {
      // storage error
    }
    set({ recentTools: updated });
  },
  clearRecentTools: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_RECENTS);
    } catch {
      // storage error
    }
    set({ recentTools: [] });
    get().addToast({
      type: 'success',
      title: 'Recent history cleared',
      duration: 3000,
    });
  },
  historyEnabled: (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY_ENABLED);
      return raw !== null ? JSON.parse(raw) : true;
    } catch {
      return true;
    }
  })(),
  setHistoryEnabled: (enabled: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY_ENABLED, JSON.stringify(enabled));
    } catch {
      // storage error
    }
    set({ historyEnabled: enabled });
  },

  theme: getInitialTheme(),
  setTheme: (theme: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // storage error
    }
    applyThemeToDOM(theme);
    set({ theme });
  },

  density: (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DENSITY) as LayoutDensity;
      return raw === 'compact' ? 'compact' : 'comfortable';
    } catch {
      return 'comfortable';
    }
  })(),
  setDensity: (density: LayoutDensity) => {
    try {
      localStorage.setItem(STORAGE_KEY_DENSITY, density);
    } catch {
      // storage error
    }
    set({ density });
  },

  sidebarCollapsed: (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SIDEBAR);
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  })(),
  setSidebarCollapsed: (collapsed: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, JSON.stringify(collapsed));
    } catch {
      // storage error
    }
    set({ sidebarCollapsed: collapsed });
  },
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    get().setSidebarCollapsed(next);
  },

  isSearchOpen: false,
  setIsSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 3000,
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },
  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clearAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_FAVORITES);
      localStorage.removeItem(STORAGE_KEY_RECENTS);
      localStorage.removeItem(STORAGE_KEY_THEME);
      localStorage.removeItem(STORAGE_KEY_DENSITY);
      localStorage.removeItem(STORAGE_KEY_HISTORY_ENABLED);
      localStorage.removeItem(STORAGE_KEY_SIDEBAR);
    } catch {
      // storage error
    }
    set({
      favorites: ['json-formatter', 'base64', 'jwt-decoder', 'regex-tester'],
      recentTools: [],
      theme: 'dark',
      density: 'comfortable',
      historyEnabled: true,
      sidebarCollapsed: false,
    });
    applyThemeToDOM('dark');
    get().addToast({
      type: 'success',
      title: 'All local preferences and history reset',
      duration: 3500,
    });
  },
}));
