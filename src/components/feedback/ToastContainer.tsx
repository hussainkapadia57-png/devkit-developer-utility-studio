import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-[#8B7CFF] shrink-0" />;
        let borderColor = 'border-[#252D3A]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-[#32C48D] shrink-0" />;
          borderColor = 'border-[#32C48D]/30';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-[#F07178] shrink-0" />;
          borderColor = 'border-[#F07178]/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-[#E8B45B] shrink-0" />;
          borderColor = 'border-[#E8B45B]/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-[#171D28] border ${borderColor} rounded-xl shadow-xl text-xs text-[#F3F5F9] animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            <div className="pt-0.5">{icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-[#F3F5F9]">{toast.title}</div>
              {toast.message && <p className="text-[#929BAA] mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#697386] hover:text-[#F3F5F9] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
