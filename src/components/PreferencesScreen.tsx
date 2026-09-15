import React, { useState } from 'react';
import {
  Sliders,
  FolderOpen,
  Wifi,
  Music,
  Palette,
  Info,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  HardDrive,
  X,
  Send,
} from 'lucide-react';
import { AppSettings } from '../types';

interface PreferencesScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenQualityModal: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenQualityModal,
  onShowToast,
}) => {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderPathInput, setFolderPathInput] = useState(settings.downloadLocation);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSaveLocation = () => {
    onUpdateSettings({ downloadLocation: folderPathInput });
    setShowFolderModal(false);
    onShowToast(`Download path updated: ${folderPathInput}`, 'success');
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      onShowToast('Please write a brief comment first', 'error');
      return;
    }
    setShowFeedbackModal(false);
    setFeedbackText('');
    onShowToast('Feedback sent successfully. Thank you!', 'success');
  };

  const faqs = [
    {
      q: 'Which video platforms are currently supported?',
      a: 'StreamGrab supports YouTube, TikTok, Instagram Reels, Facebook Watch, Twitter/X, Vimeo, Twitch VODs, and direct MP4/HLS streams.',
    },
    {
      q: 'How do I download in 4K resolution?',
      a: 'Make sure your Default Video Quality is set to 4K Ultra HD. If the source stream has 4K available, StreamGrab will automatically download the highest fidelity.',
    },
    {
      q: 'Where are downloaded files saved?',
      a: `Files are saved to your selected directory (${settings.downloadLocation}). You can open them from any media player or file manager.`,
    },
    {
      q: 'Does StreamGrab work without Wi-Fi?',
      a: 'Yes! However, if "Wi-Fi Only Downloads" is enabled in settings, downloads will pause when on cellular data to prevent extra mobile charges.',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-28 pt-4 max-w-4xl mx-auto">
      {/* Screen Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-headline font-semibold text-2xl sm:text-3xl text-[#dae2fd]">
          Preferences
        </h1>
        <p className="text-sm text-[#bcc9c6]">
          Customize your download engine, storage paths, and app experience.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Download Engine Section */}
        <div className="flex flex-col gap-2.5">
          <h2 className="font-headline font-semibold text-base sm:text-lg text-[#6bd8cb]">
            Download Engine
          </h2>

          <div className="flex flex-col bg-[#171f33] rounded-2xl border border-[#222a3d] overflow-hidden divide-y divide-[#222a3d]">
            {/* Default Video Quality */}
            <div
              onClick={onOpenQualityModal}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#222a3d]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Default Video Quality
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    {settings.defaultQuality} (Recommended)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#bcc9c6] shrink-0">
                <span className="text-sm font-medium text-[#dae2fd]">
                  {settings.defaultQuality.split(' ')[0]}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Download Location */}
            <div
              onClick={() => setShowFolderModal(true)}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#222a3d]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Download Location
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate max-w-[220px] sm:max-w-xs font-mono">
                    {settings.downloadLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#6bd8cb] shrink-0">
                <span className="text-sm font-semibold">Change</span>
              </div>
            </div>

            {/* Wi-Fi Only Downloads Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Wi-Fi Only Downloads
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    Prevent accidental cellular data usage
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.wifiOnly}
                onClick={() => {
                  const nextVal = !settings.wifiOnly;
                  onUpdateSettings({ wifiOnly: nextVal });
                  onShowToast(
                    nextVal ? 'Wi-Fi only mode enabled' : 'Cellular downloads allowed',
                    'info'
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.wifiOnly ? 'bg-[#6bd8cb]' : 'bg-[#2d3449]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.wifiOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Extract MP3 Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Auto-Extract MP3
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    Save audio track alongside video
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.autoExtractMp3}
                onClick={() => {
                  const nextVal = !settings.autoExtractMp3;
                  onUpdateSettings({ autoExtractMp3: nextVal });
                  onShowToast(
                    nextVal ? 'Auto audio extraction enabled' : 'Auto audio extraction turned off',
                    'info'
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoExtractMp3 ? 'bg-[#6bd8cb]' : 'bg-[#2d3449]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.autoExtractMp3 ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Storage Health Analyzer */}
        <div className="flex flex-col gap-2.5">
          <h2 className="font-headline font-semibold text-base sm:text-lg text-[#6bd8cb]">
            Device Storage
          </h2>

          <div className="bg-[#171f33] rounded-2xl border border-[#222a3d] p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#00F0FF]" />
                <span className="text-sm font-medium text-[#dae2fd]">StreamGrab Storage</span>
              </div>
              <span className="text-xs font-mono text-[#bcc9c6]">4.2 GB of 128 GB used</span>
            </div>

            {/* Storage Progress bar */}
            <div className="w-full h-3 rounded-full bg-[#222a3d] overflow-hidden flex">
              <div className="h-full bg-[#6bd8cb]" style={{ width: '65%' }} title="Videos: 3.4 GB" />
              <div className="h-full bg-[#ffb59a]" style={{ width: '22%' }} title="Audio: 800 MB" />
              <div className="h-full bg-[#00F0FF]" style={{ width: '13%' }} title="Cache: 150 MB" />
            </div>

            <div className="flex items-center gap-4 text-xs text-[#bcc9c6] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6bd8cb]" />
                <span>Videos (3.4 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb59a]" />
                <span>Audio (800 MB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                <span>Cache (150 MB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="flex flex-col gap-2.5">
          <h2 className="font-headline font-semibold text-base sm:text-lg text-[#6bd8cb]">
            Appearance
          </h2>

          <div className="bg-[#171f33] rounded-2xl border border-[#222a3d] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    App Theme
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    Electric Obsidian Dark
                  </span>
                </div>
              </div>

              <div className="flex bg-[#222a3d] p-1 rounded-xl border border-[#2d3449]">
                <button
                  onClick={() => {
                    onUpdateSettings({ theme: 'dark' });
                    onShowToast('Switched to Dark Theme', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settings.theme === 'dark'
                      ? 'bg-[#6bd8cb] text-[#003732] shadow-sm font-semibold'
                      : 'text-[#bcc9c6] hover:text-[#dae2fd]'
                  }`}
                >
                  Dark
                </button>

                <button
                  onClick={() => {
                    onUpdateSettings({ theme: 'system' });
                    onShowToast('Theme set to System Default', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settings.theme === 'system'
                      ? 'bg-[#6bd8cb] text-[#003732] shadow-sm font-semibold'
                      : 'text-[#bcc9c6] hover:text-[#dae2fd]'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About & Support Section */}
        <div className="flex flex-col gap-2.5">
          <h2 className="font-headline font-semibold text-base sm:text-lg text-[#6bd8cb]">
            About & Support
          </h2>

          <div className="flex flex-col bg-[#171f33] rounded-2xl border border-[#222a3d] overflow-hidden divide-y divide-[#222a3d]">
            {/* Version Info */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    StreamGrab Version
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    v2.4.8-stable
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#0E6B63]/30 text-[#6bd8cb] text-xs font-semibold border border-[#6bd8cb]/30">
                Up to date
              </span>
            </div>

            {/* Help Center */}
            <div
              onClick={() => setShowFaqModal(true)}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#222a3d]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Help & FAQ
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    Troubleshooting and guides
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#bcc9c6]" />
            </div>

            {/* Send Feedback */}
            <div
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#222a3d]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#29a195]/30 text-[#6bd8cb] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base text-[#dae2fd]">
                    Send Feedback
                  </span>
                  <span className="text-xs text-[#bcc9c6] truncate">
                    Report bugs or request features
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#bcc9c6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Change Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-semibold text-lg text-[#dae2fd]">
                Set Download Location
              </h3>
              <button
                onClick={() => setShowFolderModal(false)}
                className="text-[#bcc9c6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#bcc9c6]">
              Choose where high-definition videos and audio files should be saved on your device:
            </p>

            <input
              type="text"
              value={folderPathInput}
              onChange={(e) => setFolderPathInput(e.target.value)}
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#6bd8cb]"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowFolderModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222a3d] text-[#dae2fd] text-xs font-medium hover:bg-[#2d3449]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="flex-1 py-2.5 rounded-xl bg-[#6bd8cb] text-[#003732] text-xs font-semibold hover:bg-[#89f5e7]"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#6bd8cb]" />
                <h3 className="font-headline font-semibold text-lg text-[#dae2fd]">
                  Help & Frequently Asked Questions
                </h3>
              </div>
              <button
                onClick={() => setShowFaqModal(false)}
                className="text-[#bcc9c6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              {faqs.map((f, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#222a3d] border border-[#2d3449]">
                  <h4 className="text-sm font-semibold text-[#dae2fd] mb-1">{f.q}</h4>
                  <p className="text-xs text-[#bcc9c6] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#222a3d] text-[#dae2fd] text-sm font-medium hover:bg-[#2d3449]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#6bd8cb]" />
                <h3 className="font-headline font-semibold text-lg text-[#dae2fd]">
                  Send Feedback
                </h3>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-[#bcc9c6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#bcc9c6]">
              Have a suggestion, bug report, or platform request? Let the StreamGrab development team know:
            </p>

            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you like or what could be improved..."
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#bcc9c6] focus:outline-none focus:ring-2 focus:ring-[#6bd8cb]"
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222a3d] text-[#dae2fd] text-xs font-medium hover:bg-[#2d3449]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] text-[#003732] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#6bd8cb]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
