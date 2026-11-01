export type ToolCategory =
  | 'Data & JSON'
  | 'Encoders & Decoders'
  | 'Security & Hashing'
  | 'Text Utilities'
  | 'Web Development'
  | 'Converters';

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  description: string;
  detailedDescription: string;
  path: string;
  iconName: string;
  keywords: string[];
}

export interface RecentToolItem {
  toolId: string;
  timestamp: number;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type LayoutDensity = 'comfortable' | 'compact';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
