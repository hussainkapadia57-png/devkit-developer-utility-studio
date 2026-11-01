import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, ArrowRight, Clock } from 'lucide-react';
import { getToolById } from '../lib/toolsData';
import { EmptyState } from '../components/common/EmptyState';
import { IconRenderer } from '../components/common/IconRenderer';
import { useAppStore } from '../stores/useAppStore';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { recentTools, clearRecentTools, historyEnabled } = useAppStore();

  const formatRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'Just now';
    const minutes = Math.floor(diffSec / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-[#8B7CFF]" />
            Recently Used Utilities
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Privacy notice: Only tool navigation history is recorded. Sensitive inputs, tokens, and payloads are never stored.
          </p>
        </div>

        {recentTools.length > 0 && (
          <button
            type="button"
            onClick={clearRecentTools}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F07178] hover:bg-[#F07178]/10 border border-[#F07178]/20 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      {!historyEnabled && (
        <div className="p-4 rounded-xl border border-[#E8B45B]/30 bg-[#E8B45B]/10 text-xs text-[#E8B45B]">
          History tracking is currently disabled in your Settings.
        </div>
      )}

      {/* History List */}
      {recentTools.length > 0 ? (
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] divide-y divide-[#252D3A]/60 overflow-hidden">
          {recentTools.map((item) => {
            const tool = getToolById(item.toolId);
            if (!tool) return null;

            return (
              <div
                key={item.toolId}
                onClick={() => navigate(tool.path)}
                className="flex items-center justify-between p-4 hover:bg-[#171D28]/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#171D28] border border-[#252D3A] text-[#8B7CFF] group-hover:border-[#8B7CFF]/40 transition-colors">
                    <IconRenderer name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F3F5F9] group-hover:text-[#8B7CFF] transition-colors">
                        {tool.name}
                      </span>
                      <span className="text-xs text-[#697386]">· {tool.category}</span>
                    </div>
                    <p className="text-xs text-[#929BAA] line-clamp-1">{tool.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#697386] font-mono-code flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#697386] group-hover:text-[#F3F5F9] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No recent activity"
          description="Tools you open will be remembered here for easy resumption."
          action={{
            label: 'Explore Tools',
            onClick: () => navigate('/tools'),
          }}
        />
      )}
    </div>
  );
};
