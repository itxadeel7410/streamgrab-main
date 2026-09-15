/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DownloadsScreen } from './components/DownloadsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { PreferencesScreen } from './components/PreferencesScreen';
import { QualityModal } from './components/QualityModal';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { ProfileModal } from './components/ProfileModal';
import { Toast, ToastMessage } from './components/Toast';
import {
  ActiveDownload,
  HistoryItem,
  RecentLink,
  AppSettings,
  TabType,
} from './types';
import {
  INITIAL_ACTIVE_DOWNLOADS,
  INITIAL_HISTORY,
  INITIAL_RECENT_LINKS,
} from './data/mockData';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Core Data State (with fallback to mock data)
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownload[]>(() => {
    const saved = localStorage.getItem('streamgrab_active_downloads');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_DOWNLOADS;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('streamgrab_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [recentLinks, setRecentLinks] = useState<RecentLink[]>(() => {
    const saved = localStorage.getItem('streamgrab_recent_links');
    return saved ? JSON.parse(saved) : INITIAL_RECENT_LINKS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('streamgrab_settings');
    return saved
      ? JSON.parse(saved)
      : {
          defaultQuality: '1080p Full HD',
          downloadLocation: '/storage/emulated/0/StreamGrab',
          wifiOnly: true,
          autoExtractMp3: false,
          theme: 'dark',
          concurrentLimit: 3,
        };
  });

  // UI States
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [playingMedia, setPlayingMedia] = useState<HistoryItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('streamgrab_active_downloads', JSON.stringify(activeDownloads));
  }, [activeDownloads]);

  useEffect(() => {
    localStorage.setItem('streamgrab_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('streamgrab_recent_links', JSON.stringify(recentLinks));
  }, [recentLinks]);

  useEffect(() => {
    localStorage.setItem('streamgrab_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Theme switching on root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark' || (settings.theme === 'system' && isDarkMode)) {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else {
      root.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, [settings.theme]);

  // Real-time background download simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDownloads((prevDownloads) => {
        let completedItem: ActiveDownload | null = null;

        const updated = prevDownloads.map((item) => {
          if (item.status !== 'downloading') return item;

          // Natural fluctuation in speed
          const speedDelta = (Math.random() - 0.5) * 1.2;
          const currentSpeed = Math.max(1.8, Math.min(24.5, item.speedMBps + speedDelta));
          const incrementMB = currentSpeed * 0.8;
          const newDownloadedMB = Math.min(item.totalMB, item.downloadedMB + incrementMB);
          const newProgress = Math.min(100, (newDownloadedMB / item.totalMB) * 100);
          const remainingMB = item.totalMB - newDownloadedMB;
          const newEta = Math.max(0, Math.ceil(remainingMB / currentSpeed));

          if (newProgress >= 100 && !completedItem) {
            completedItem = { ...item, progress: 100, downloadedMB: item.totalMB };
          }

          return {
            ...item,
            speedMBps: currentSpeed,
            downloadedMB: Math.round(newDownloadedMB),
            progress: newProgress,
            etaSeconds: newEta,
          };
        });

        // When an active download completes, move it to history
        if (completedItem) {
          const finished: ActiveDownload = completedItem;
          const newHistoryItem: HistoryItem = {
            id: `history-${Date.now()}`,
            title: finished.title,
            thumbnailUrl: finished.thumbnailUrl,
            badge: finished.quality.includes('4K')
              ? '4K UHD'
              : finished.format === 'MP3'
              ? 'MP3'
              : '1080p',
            format: finished.format,
            sizeString: `${(finished.totalMB / 1024).toFixed(1)} GB`,
            dateString: 'Just now',
            category: finished.format === 'MP3' ? 'audio' : 'video',
            duration: '06:30',
            sourceUrl: finished.sourceUrl,
            mediaType: finished.format === 'MP3' ? 'audio' : 'video',
          };

          setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
          showToast(`Completed download: "${finished.title.slice(0, 24)}..."`, 'success');

          return updated.filter((d) => d.id !== finished.id);
        }

        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      message,
      type,
    });
  };

  // Download Actions
  const handleStartDownload = (downloadData: Omit<ActiveDownload, 'id'>) => {
    const newDownload: ActiveDownload = {
      ...downloadData,
      id: `download-${Date.now()}`,
    };

    setActiveDownloads((prev) => [newDownload, ...prev]);

    // Add to recent pasted links if not already present
    setRecentLinks((prev) => {
      const exists = prev.some((l) => l.url === downloadData.sourceUrl);
      if (exists) return prev;
      return [
        {
          id: `recent-${Date.now()}`,
          title: downloadData.title,
          url: downloadData.sourceUrl,
          thumbnailUrl: downloadData.thumbnailUrl,
          platform: downloadData.platform,
          duration: '05:00',
        },
        ...prev.slice(0, 9),
      ];
    });

    setActiveTab('downloads');
  };

  const handleTogglePause = (id: string) => {
    setActiveDownloads((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'downloading' ? 'paused' : 'downloading';
          showToast(
            nextStatus === 'paused' ? 'Download paused' : 'Download resumed',
            'info'
          );
          return {
            ...d,
            status: nextStatus,
            speedMBps: nextStatus === 'paused' ? 0 : 5.4,
          };
        }
        return d;
      })
    );
  };

  const handleCancelDownload = (id: string) => {
    setActiveDownloads((prev) => prev.filter((d) => d.id !== id));
    showToast('Download cancelled', 'info');
  };

  const isAllPaused = activeDownloads.every((d) => d.status === 'paused');

  const handleTogglePauseAll = () => {
    const nextStatus = isAllPaused ? 'downloading' : 'paused';
    setActiveDownloads((prev) =>
      prev.map((d) => ({
        ...d,
        status: nextStatus,
        speedMBps: nextStatus === 'paused' ? 0 : 6.2,
      }))
    );
    showToast(isAllPaused ? 'Resumed all downloads' : 'Paused all downloads', 'info');
  };

  // History Actions
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('File removed from history', 'info');
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all download history records?')) {
      setHistory([]);
      showToast('Download history cleared', 'info');
    }
  };

  const handleShareItem = (item: HistoryItem) => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          url: item.sourceUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(item.sourceUrl);
      showToast('Video link copied to clipboard', 'success');
    }
  };

  const handleClearRecentLinks = () => {
    setRecentLinks([]);
    showToast('Pasted link history cleared', 'info');
  };

  const handleToggleDarkMode = () => {
    const nextTheme = settings.theme === 'dark' ? 'system' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-start selection:bg-[#6bd8cb]/30 selection:text-[#6bd8cb] relative">
      {/* Device Frame Viewport Toggle for Desktop / Mobile */}
      <div className="fixed top-2.5 right-20 z-50 hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171f33]/90 backdrop-blur-md border border-[#2d3449] text-xs font-medium text-[#bcc9c6] shadow-lg">
        <button
          onClick={() => setIsDeviceFrame(false)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
            !isDeviceFrame ? 'bg-[#29a195] text-[#00302b] font-semibold' : 'hover:text-white'
          }`}
          title="Wide Responsive View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Width</span>
        </button>
        <button
          onClick={() => setIsDeviceFrame(true)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
            isDeviceFrame ? 'bg-[#29a195] text-[#00302b] font-semibold' : 'hover:text-white'
          }`}
          title="Mobile Frame Preview"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Frame</span>
        </button>
      </div>

      {/* Main Container: Adaptable to Phone Frame or Fluid Width */}
      <div
        className={`w-full min-h-screen flex flex-col relative transition-all duration-300 ${
          isDeviceFrame
            ? 'max-w-[440px] my-6 border-8 border-[#171f33] rounded-[42px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden min-h-[920px] bg-[#0b1326]'
            : 'max-w-4xl mx-auto'
        }`}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeDownloadsCount={activeDownloads.filter((d) => d.status === 'downloading').length}
          isDarkMode={isDarkMode}
          toggleDarkMode={handleToggleDarkMode}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Content Screens */}
        <main className="flex-1 w-full px-4 sm:px-6 pt-20 flex flex-col">
          {activeTab === 'home' && (
            <HomeScreen
              recentLinks={recentLinks}
              onClearRecentLinks={handleClearRecentLinks}
              onStartDownload={handleStartDownload}
              onShowToast={showToast}
              defaultQuality={settings.defaultQuality}
            />
          )}

          {activeTab === 'downloads' && (
            <DownloadsScreen
              downloads={activeDownloads}
              onTogglePause={handleTogglePause}
              onCancelDownload={handleCancelDownload}
              onTogglePauseAll={handleTogglePauseAll}
              isAllPaused={isAllPaused}
              onGoToHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              history={history}
              onPlayItem={(item) => setPlayingMedia(item)}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAllHistory={handleClearAllHistory}
              onShareItem={handleShareItem}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <PreferencesScreen
              settings={settings}
              onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
              onOpenQualityModal={() => setIsQualityModalOpen(true)}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeDownloadsCount={activeDownloads.filter((d) => d.status === 'downloading').length}
        />
      </div>

      {/* Global Modals */}
      <QualityModal
        isOpen={isQualityModalOpen}
        selectedQuality={settings.defaultQuality}
        onSelect={(q) => {
          setSettings((prev) => ({ ...prev, defaultQuality: q }));
          showToast(`Default quality set to ${q}`, 'success');
        }}
        onClose={() => setIsQualityModalOpen(false)}
      />

      <MediaPlayerModal
        item={playingMedia}
        onClose={() => setPlayingMedia(null)}
        onShare={handleShareItem}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
