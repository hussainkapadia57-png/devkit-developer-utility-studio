import React from 'react';
import { Download } from 'lucide-react';
import { downloadFile } from '../../lib/downloadUtils';
import { useAppStore } from '../../stores/useAppStore';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
  title?: string;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  mimeType = 'text/plain;charset=utf-8',
  label = 'Download',
  className = '',
  size = 'sm',
  title = 'Download file',
  disabled = false,
}) => {
  const addToast = useAppStore((s) => s.addToast);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!content) {
      addToast({
        type: 'warning',
        title: 'Nothing to download',
        message: 'Content is empty',
        duration: 2000,
      });
      return;
    }

    try {
      downloadFile(content, filename, mimeType);
      addToast({
        type: 'success',
        title: `Downloaded ${filename}`,
        duration: 2500,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Download failed',
        duration: 3000,
      });
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 rounded-lg cursor-pointer select-none border border-[#252D3A] bg-[#171D28] hover:bg-[#1D2532] text-[#F3F5F9] hover:border-[#3B465A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7CFF]/50';

  const sizeStyles = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm';

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={`${baseStyles} ${sizeStyles} ${className} ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-[#171D28]' : ''}`}
    >
      <Download className="w-3.5 h-3.5 opacity-80" />
      <span>{label}</span>
    </button>
  );
};
