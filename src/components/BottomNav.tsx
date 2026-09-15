import React from 'react';
import { Home, Download, History, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeDownloadsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  activeDownloadsCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'downloads' as TabType, label: 'Downloads', icon: Download, badge: activeDownloadsCount },
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0b1326]/90 backdrop-blur-xl border-t border-[#222a3d]/60">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-2 sm:px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#29a195] text-[#00302b] font-semibold shadow-lg shadow-[#29a195]/20 scale-102'
                  : 'text-[#bcc9c6] hover:text-[#dae2fd] hover:bg-[#171f33]/60'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#00F0FF] text-[#003732] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-xs tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
