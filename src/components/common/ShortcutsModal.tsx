import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K  /  ⌘K', description: 'Open global search modal from anywhere' },
    { key: 'Esc', description: 'Close modals, drawers, and active dialogs' },
    { key: 'Ctrl + Enter  /  ⌘↵', description: 'Run active tool operation (Format, Decode, Compare, Minify)' },
    { key: 'Tab', description: 'Insert 2-space indentation inside code editors' },
    { key: '?', description: 'Open this keyboard shortcuts reference' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#252D3A] bg-[#11151D] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D1017] border-b border-[#252D3A]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#8B7CFF]" />
            <h3 className="text-sm font-semibold text-[#F3F5F9]">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#697386] hover:text-[#F3F5F9] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#171D28]/60 border border-[#252D3A]/50 text-xs"
            >
              <span className="text-[#929BAA]">{sc.description}</span>
              <kbd className="px-2 py-1 font-mono-code text-[11px] font-semibold text-[#8B7CFF] bg-[#1D2532] border border-[#252D3A] rounded">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-[#0D1017] border-t border-[#252D3A] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
