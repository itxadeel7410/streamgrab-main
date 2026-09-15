import React, { useState } from 'react';
import {
  Link as LinkIcon,
  ClipboardPaste,
  X,
  Zap,
  HelpCircle,
  Download,
  Check,
  Loader2,
  Video,
  Music,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ActiveDownload, RecentLink } from '../types';

interface HomeScreenProps {
  recentLinks: RecentLink[];
  onClearRecentLinks: () => void;
  onStartDownload: (download: Omit<ActiveDownload, 'id'>) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  defaultQuality: string;
}

interface DetectedVideoPreview {
  url: string;
  title: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'Twitter/X' | 'Vimeo';
  creator: string;
  duration: string;
  thumbnailUrl: string;
  formats: {
    id: string;
    label: string;
    resolution: string;
    size: string;
    type: 'MP4' | 'WEBM' | 'MP3';
    badge: string;
  }[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentLinks,
  onClearRecentLinks,
  onStartDownload,
  onShowToast,
  defaultQuality,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedVideo, setDetectedVideo] = useState<DetectedVideoPreview | null>(null);
  const [selectedFormatId, setSelectedFormatId] = useState('1080p');
  const [inputError, setInputError] = useState(false);

  // Quick platform demo URLs
  const platforms = [
    {
      name: 'YouTube',
      icon: 'smart_display',
      color: 'text-red-400',
      sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      preview: {
        title: 'Cyberpunk 2077 Next-Gen Gameplay Walkthrough 4K',
        creator: 'NightCity Media',
        duration: '18:42',
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAqNNEmNYX7oEWuzdflc2vaxmexySGF96KiUNH8RbC0LQ1xTP9Z-razsQES7MJj7nRE_L3GxGQR1wr8Ti1HYq_sie7gM-ATmFBebEC2vmkUsMCu22imA1Edj8tKvMPenjr5CJ9jSZjujLldoDocByH_B8w6t45WTFqAvf2UtK_oUaDk92TsUr2CGsZp_C8W38Vkb-32_yCxRDfE8RPwKjjSQNsK7J-zW3tPpAJjdhTslqOTMpfRY4FSsg',
      },
    },
    {
      name: 'TikTok',
      icon: 'movie',
      color: 'text-[#dae2fd]',
      sampleUrl: 'https://www.tiktok.com/@vibecity/video/72918239019',
      preview: {
        title: 'Futuristic Cyberpunk Aesthetic Transition #fyp #vfx',
        creator: '@neonvibes',
        duration: '00:45',
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAyEDlalKlwteafT82z7PdDAuXib8DDDFz_lnmcG04AvVKv1Q6FrXBj8oC8CLtLmu0-noYPD9z1f-F5IYMmLviKNavQifEkKm3t-CWSA35KDqaZEu_8FZaGa0gCX8qyIql1KosjI13exk6lwsq0CKyE-ZCLzIMEPpa4-yxiRYiZ4mxYXktx_z7HaAJ7Q86yqw1uFiIdFhnxvb-oxJHM31W6naIUKEbFUfMZj-8zGgm48HSjkA8-4IO6sw',
      },
    },
    {
      name: 'Instagram',
      icon: 'photo_camera',
      color: 'text-pink-400',
      sampleUrl: 'https://www.instagram.com/reel/C89abX104/',
      preview: {
        title: 'Cinematic Sunset Over Metropolis 4K Reel',
        creator: '@cityscapes_daily',
        duration: '01:15',
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAIGhjikrW80cHdD-4-0OyFET0mxdVrtPBynsLsmdwQ19j4l3v-BGyJeZS8cTPmdOXk0jgSVTLlFOZLiQ3jtgrWhZUdmMOH6i-lxFqoIMuWOopTzmsvqGbSK7hjCJXZKIeABjQPMLYwvzRKg6KPIjh8zSEGIy4Ethl75nkzmf2De3kliwGxgEeTtXz9m0w_TCDTerpkwPs40fU6DBS0dOZoeI5jTR5W3_EKiKDlnzhRD0FFKUk8k4eHCg',
      },
    },
    {
      name: 'Facebook',
      icon: 'public',
      color: 'text-blue-400',
      sampleUrl: 'https://www.facebook.com/watch/?v=981273948',
      preview: {
        title: 'World Tech Expo: Quantum Computing Breakthroughs',
        creator: 'Future Tech Horizons',
        duration: '14:20',
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBBrQYa_eRwA9RxuwPBjNSS4j7A6euMnO90s2mBCde1cezqd_JWlWzFYX4mEPnLIF6CcMgyLNkV1owfVa756FqhOHP1grmZDzra4MogoSaiZlxQGqAWgBQoWM7sT3XOMhUnAndxM5r2t0DNYQZMbr3zCeZAGA2Kvk5siQFjeNeZe4HVzHN8cbnc0WwVtqNOAD-_wyo5v82qEsX56BF7OBCzXCi8QMxMYbwdyHJpPoYKkVE2KBShfdeevQ',
      },
    },
    {
      name: 'Twitter/X',
      icon: 'tag',
      color: 'text-[#00F0FF]',
      sampleUrl: 'https://x.com/tech_insider/status/17849102839',
      preview: {
        title: 'Next Gen Neural Engine Architecture in 60s',
        creator: '@TechInsider',
        duration: '01:00',
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBZpChrrv2HTx7pPDNtsh4tfi1TFpTjlEt4uHyu9WgObYnEHlUz2_9bZ5-zUBm9FqhM9i4N6X3rXOD3BRfvDzZtx0W7T6hSnH-wELYZT-SiPV9HFcNhxxIRBSOZ5hiZluX2OiWWjiMcDkJdbl-s5EfOf8HStGJrdrukCGJ6vxAQFZSNe1omn6zRaDWKpYidd1RGtPHH0EfLmFVRddV--EBVd5Iu0uQkO2lJQzSKvnyr6Srpo3eQCU4KGw',
      },
    },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        setInputError(false);
        onShowToast('Pasted URL from clipboard', 'info');
      } else {
        setUrlInput('https://youtube.com/watch?v=dQw4w9WgXcQ');
        onShowToast('Pasted sample YouTube link', 'info');
      }
    } catch {
      // Fallback
      setUrlInput('https://youtube.com/watch?v=dQw4w9WgXcQ');
      onShowToast('Pasted sample YouTube link', 'info');
    }
  };

  const handleAnalyzeAndDownload = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setInputError(true);
      setTimeout(() => setInputError(false), 1200);
      onShowToast('Please paste a video link first', 'error');
      return;
    }

    setIsAnalyzing(true);

    // Simulate link analysis & stream resolution parsing
    setTimeout(() => {
      setIsAnalyzing(false);

      // Derive platform
      let platformName: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'Twitter/X' | 'Vimeo' = 'YouTube';
      if (trimmed.includes('tiktok')) platformName = 'TikTok';
      else if (trimmed.includes('instagram')) platformName = 'Instagram';
      else if (trimmed.includes('facebook')) platformName = 'Facebook';
      else if (trimmed.includes('twitter') || trimmed.includes('x.com')) platformName = 'Twitter/X';
      else if (trimmed.includes('vimeo')) platformName = 'Vimeo';

      const matchPlatform = platforms.find((p) => p.name === platformName);

      setDetectedVideo({
        url: trimmed,
        title: matchPlatform?.preview.title || 'Extracted Ultra HD Video Stream',
        platform: platformName,
        creator: matchPlatform?.preview.creator || 'Verified Channel',
        duration: matchPlatform?.preview.duration || '08:30',
        thumbnailUrl:
          matchPlatform?.preview.thumbnailUrl ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAqNNEmNYX7oEWuzdflc2vaxmexySGF96KiUNH8RbC0LQ1xTP9Z-razsQES7MJj7nRE_L3GxGQR1wr8Ti1HYq_sie7gM-ATmFBebEC2vmkUsMCu22imA1Edj8tKvMPenjr5CJ9jSZjujLldoDocByH_B8w6t45WTFqAvf2UtK_oUaDk92TsUr2CGsZp_C8W38Vkb-32_yCxRDfE8RPwKjjSQNsK7J-zW3tPpAJjdhTslqOTMpfRY4FSsg',
        formats: [
          { id: '4k', label: '4K Ultra HD 60fps', resolution: '3840x2160', size: '2.1 GB', type: 'MP4', badge: '4K 60FPS' },
          { id: '1080p', label: '1080p Full HD', resolution: '1920x1080', size: '820 MB', type: 'MP4', badge: '1080p' },
          { id: '720p', label: '720p HD Standard', resolution: '1280x720', size: '390 MB', type: 'MP4', badge: '720p' },
          { id: 'mp3', label: 'Audio Only (High Quality)', resolution: '320kbps MP3', size: '18 MB', type: 'MP3', badge: 'MP3' },
        ],
      });
    }, 1100);
  };

  const handleConfirmDownload = () => {
    if (!detectedVideo) return;

    const chosenFormat = detectedVideo.formats.find((f) => f.id === selectedFormatId) || detectedVideo.formats[1];
    const totalMB =
      chosenFormat.id === '4k'
        ? 2150
        : chosenFormat.id === '1080p'
        ? 820
        : chosenFormat.id === '720p'
        ? 390
        : 18;

    onStartDownload({
      title: detectedVideo.title,
      platform: detectedVideo.platform,
      quality: chosenFormat.badge,
      format: chosenFormat.type,
      downloadedMB: 1,
      totalMB,
      speedMBps: 12.4,
      etaSeconds: Math.ceil(totalMB / 12.4),
      progress: 1,
      status: 'downloading',
      thumbnailUrl: detectedVideo.thumbnailUrl,
      sourceUrl: detectedVideo.url,
      timestamp: 'Just now',
    });

    setDetectedVideo(null);
    setUrlInput('');
    onShowToast(`Downloading "${detectedVideo.title.slice(0, 28)}..."`, 'success');
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-28 pt-4 max-w-4xl mx-auto">
      {/* Hero / URL Input Section */}
      <div className="flex flex-col gap-4 p-5 sm:p-7 rounded-2xl bg-[#171f33] relative overflow-hidden border border-[#222a3d] shadow-xl">
        {/* Ambient glow backgrounds */}
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-[#6bd8cb]/12 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-[#00F0FF]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-1 z-10">
          <span className="text-xs font-semibold text-[#6bd8cb] tracking-wider uppercase">
            LIGHTNING FAST GRABBER
          </span>
          <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-[#dae2fd] tracking-tight">
            Paste your video link
          </h1>
          <p className="text-sm text-[#bcc9c6]">
            Supports YouTube, TikTok, Instagram, and more in stunning 4K/1080p.
          </p>
        </div>

        {/* URL Input Box with action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-1 z-10">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#bcc9c6]">
              <LinkIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="url-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeAndDownload()}
              placeholder="Paste video URL here..."
              className={`w-full pl-11 pr-24 py-4 rounded-xl bg-[#2d3449] text-[#dae2fd] placeholder:text-[#bcc9c6] focus:outline-none focus:ring-2 text-base transition-all ${
                inputError ? 'ring-2 ring-red-400 bg-red-950/20' : 'focus:ring-[#6bd8cb]'
              }`}
            />

            {/* Clear Button */}
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute inset-y-0 right-16 pr-2 flex items-center text-[#bcc9c6] hover:text-white transition-colors"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Paste Button */}
            <button
              onClick={handlePaste}
              className="absolute right-2.5 top-2.5 bottom-2.5 px-3 rounded-lg bg-[#171f33] text-[#dae2fd] text-xs font-medium hover:bg-[#31394d] transition-colors flex items-center gap-1.5 shadow-sm border border-[#2d3449]"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-[#6bd8cb]" />
              <span>Paste</span>
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleAnalyzeAndDownload}
            disabled={isAnalyzing}
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] text-[#003732] font-headline font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#6bd8cb]/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-75 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Detected Bottom Sheet / Modal */}
      {detectedVideo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="relative bg-[#171f33] border border-[#2d3449] w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6bd8cb]" />
                <h3 className="font-headline font-semibold text-lg text-[#dae2fd]">
                  Video Stream Ready
                </h3>
              </div>
              <button
                onClick={() => setDetectedVideo(null)}
                className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#bcc9c6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video preview card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#222a3d] border border-[#2d3449]">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                <img
                  src={detectedVideo.thumbnailUrl}
                  alt={detectedVideo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[10px] font-medium text-white">
                  {detectedVideo.duration}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#6bd8cb]">{detectedVideo.platform}</span>
                <h4 className="text-sm font-medium text-[#dae2fd] truncate">{detectedVideo.title}</h4>
                <span className="text-xs text-[#bcc9c6]">{detectedVideo.creator}</span>
              </div>
            </div>

            {/* Quality options list */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#bcc9c6]">
                Select Download Format
              </span>
              {detectedVideo.formats.map((fmt) => {
                const isSelected = selectedFormatId === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormatId(fmt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#6bd8cb]/15 border border-[#6bd8cb]/60 shadow-[0_0_10px_rgba(107,216,203,0.15)]'
                        : 'bg-[#222a3d] hover:bg-[#2d3449] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${fmt.type === 'MP3' ? 'bg-[#ffb59a]/15 text-[#ffb59a]' : 'bg-[#6bd8cb]/15 text-[#6bd8cb]'}`}>
                        {fmt.type === 'MP3' ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#dae2fd] flex items-center gap-2">
                          <span>{fmt.label}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0b1326] text-[#6bd8cb]">
                            {fmt.badge}
                          </span>
                        </div>
                        <span className="text-xs text-[#bcc9c6]">{fmt.resolution}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-[#dae2fd]">{fmt.size}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#6bd8cb] text-[#003732]' : 'border border-[#bcc9c6]/30'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDetectedVideo(null)}
                className="flex-1 py-3 rounded-xl bg-[#222a3d] text-[#dae2fd] text-sm font-medium hover:bg-[#2d3449] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDownload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] text-[#003732] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6bd8cb]/20 hover:opacity-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Start Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supported Platforms Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-[#dae2fd]">Supported Platforms</h2>
          <span className="text-xs text-[#bcc9c6]">50+ sites supported</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setUrlInput(p.sampleUrl);
                onShowToast(`Loaded sample ${p.name} link`, 'info');
              }}
              className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#222a3d] transition-all group cursor-pointer"
              title={`Paste sample link from ${p.name}`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-[#2d3449] flex items-center justify-center ${p.color} group-hover:scale-110 transition-transform shadow-inner`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {p.icon}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#bcc9c6] group-hover:text-white transition-colors truncate">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 1-Tap Instructions Section */}
      <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-[#171f33]/60 border border-[#222a3d]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0E6B63] flex items-center justify-center text-[#dae2fd]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-headline font-semibold text-[#dae2fd]">
            How to download in 1 tap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171f33] border border-[#222a3d]">
            <div className="w-8 h-8 rounded-lg bg-[#29a195] text-[#00302b] flex items-center justify-center font-headline font-semibold text-sm shrink-0 shadow-sm">
              1
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#dae2fd] font-medium">Copy Link</span>
              <span className="text-xs text-[#bcc9c6] mt-0.5">
                Copy any video URL from your favorite social app.
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171f33] border border-[#222a3d]">
            <div className="w-8 h-8 rounded-lg bg-[#29a195] text-[#00302b] flex items-center justify-center font-headline font-semibold text-sm shrink-0 shadow-sm">
              2
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#dae2fd] font-medium">Paste & Analyze</span>
              <span className="text-xs text-[#bcc9c6] mt-0.5">
                Tap paste to insert link into the grabber box.
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171f33] border border-[#222a3d]">
            <div className="w-8 h-8 rounded-lg bg-[#29a195] text-[#00302b] flex items-center justify-center font-headline font-semibold text-sm shrink-0 shadow-sm">
              3
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#dae2fd] font-medium">Hit Download</span>
              <span className="text-xs text-[#bcc9c6] mt-0.5">
                Enjoy your video instantly offline in HD quality.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Pasted Links Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-[#dae2fd]">
            Recent Pasted Links
          </h2>
          {recentLinks.length > 0 && (
            <button
              onClick={onClearRecentLinks}
              className="text-xs text-[#6bd8cb] hover:underline cursor-pointer"
            >
              Clear History
            </button>
          )}
        </div>

        {recentLinks.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#171f33] border border-[#222a3d] text-center text-xs text-[#bcc9c6]">
            No recent links. Paste any video URL above to get started!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentLinks.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] border border-[#222a3d] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-lg bg-[#2d3449] shrink-0 overflow-hidden relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="text-sm text-[#dae2fd] truncate font-medium group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#bcc9c6] truncate font-mono">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUrlInput(item.url);
                    handleAnalyzeAndDownload();
                  }}
                  className="w-9 h-9 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#6bd8cb] hover:bg-[#6bd8cb] hover:text-[#003732] transition-all shrink-0 ml-2 cursor-pointer shadow-sm"
                  title="Download this video"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
