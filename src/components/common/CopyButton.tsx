import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'ghost';
  title?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  size = 'sm',
  variant = 'secondary',
  title = 'Copy to clipboard',
}) => {
  const [copied, setCopied] = useState(false);
  const addToast = useAppStore((s) => s.addToast);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textToCopy) {
      addToast({
        type: 'warning',
        title: 'Nothing to copy',
        message: 'The content is empty',
        duration: 2000,
      });
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('execCommand failed');
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({
        type: 'success',
        title: 'Copied to clipboard',
        duration: 1800,
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      addToast({
        type: 'error',
        title: 'Copy failed',
        message: 'Clipboard permission was denied or not supported',
        duration: 3000,
      });
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 rounded-lg cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7CFF]/50';

  const sizeStyles = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm';

  const variantStyles = {
    primary: 'bg-[#8B7CFF] hover:bg-[#7867FB] text-white shadow-sm',
    secondary: 'bg-[#171D28] hover:bg-[#1D2532] text-[#F3F5F9] border border-[#252D3A] hover:border-[#3B465A]',
    ghost: 'bg-transparent hover:bg-[#171D28] text-[#929BAA] hover:text-[#F3F5F9]',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      aria-label={label}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className} ${copied ? 'border-[#32C48D]/40 text-[#32C48D]' : ''}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#32C48D]" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-current opacity-80" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
