import React from 'react';
import { Zap, Moon, Sun, User, Radio } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeDownloadsCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeDownloadsCount,
  isDarkMode,
  toggleDarkMode,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0b1326]/85 backdrop-blur-xl border-b border-[#222a3d]/50">
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 focus:outline-none group text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#29a195] flex items-center justify-center text-[#00302b] shadow-[0_0_12px_rgba(107,216,203,0.3)] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-semibold text-lg sm:text-xl tracking-tight text-[#dae2fd] group-hover:text-white transition-colors">
              StreamGrab
            </span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Download Quick Indicator */}
          {activeDownloadsCount > 0 && activeTab !== 'downloads' && (
            <button
              onClick={() => setActiveTab('downloads')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171f33] border border-[#6bd8cb]/30 text-[#6bd8cb] text-xs font-medium hover:bg-[#222a3d] transition-all shadow-sm"
              title="View active downloads"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#00F0FF]" />
              <span className="hidden sm:inline">Downloading:</span>
              <span className="font-semibold">{activeDownloadsCount}</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#bcc9c6] hover:text-[#dae2fd] hover:bg-[#171f33] transition-colors"
            title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#6bd8cb] flex items-center justify-center text-[#003732] hover:ring-2 hover:ring-[#00F0FF] transition-all shadow-sm"
            title="User Account"
            aria-label="User Account"
          >
            <User className="w-4 h-4 font-bold" />
          </button>
        </div>
      </div>
    </header>
  );
};
