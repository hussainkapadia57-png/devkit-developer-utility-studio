import React from 'react';
import {
  Braces,
  Binary,
  KeyRound,
  FileCode,
  Link2,
  GitCompare,
  ShieldCheck,
  Fingerprint,
  Clock,
  Minimize2,
  Type,
  Palette,
  Search,
  Star,
  History,
  Settings,
  Info,
  Check,
  Copy,
  Trash2,
  Download,
  Moon,
  Sun,
  Menu,
  X,
  Database,
  Shield,
  FileText,
  Code,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface IconRendererProps extends LucideProps {
  name: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Braces':
      return <Braces {...props} />;
    case 'Binary':
      return <Binary {...props} />;
    case 'KeyRound':
      return <KeyRound {...props} />;
    case 'Regex':
      return <Terminal {...props} />;
    case 'Link2':
      return <Link2 {...props} />;
    case 'GitCompare':
      return <GitCompare {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Fingerprint':
      return <Fingerprint {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Minimize2':
      return <Minimize2 {...props} />;
    case 'Type':
      return <Type {...props} />;
    case 'Palette':
      return <Palette {...props} />;
    case 'Database':
      return <Database {...props} />;
    case 'FileCode':
      return <FileCode {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Code':
      return <Code {...props} />;
    case 'RefreshCw':
      return <RefreshCw {...props} />;
    case 'Search':
      return <Search {...props} />;
    case 'Star':
      return <Star {...props} />;
    case 'History':
      return <History {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'Info':
      return <Info {...props} />;
    case 'Check':
      return <Check {...props} />;
    case 'Copy':
      return <Copy {...props} />;
    case 'Trash2':
      return <Trash2 {...props} />;
    case 'Download':
      return <Download {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'Sun':
      return <Sun {...props} />;
    case 'Menu':
      return <Menu {...props} />;
    case 'X':
      return <X {...props} />;
    case 'ArrowRight':
      return <ArrowRight {...props} />;
    case 'ExternalLink':
      return <ExternalLink {...props} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'AlertCircle':
      return <AlertCircle {...props} />;
    case 'HelpCircle':
      return <HelpCircle {...props} />;
    default:
      return <Code {...props} />;
  }
};
