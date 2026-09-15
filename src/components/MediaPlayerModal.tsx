import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Share2, Film, Music, Check } from 'lucide-react';
import { HistoryItem } from '../types';

interface MediaPlayerModalProps {
  item: HistoryItem | null;
  onClose: () => void;
  onShare: (item: HistoryItem) => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({ item, onClose, onShare }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(25);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio tone generator / visualizer loop for realistic playback feel
  useEffect(() => {
    if (!item) return;
    setIsPlaying(true);
    setProgress(15);

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 300);
    }

    return () => clearInterval(interval);
  }, [item, isPlaying]);

  // Canvas visualizer animation
  useEffect(() => {
    if (!canvasRef.current || !item) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      step += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 32;
      const barWidth = canvas.width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const heightMultiplier = isPlaying ? Math.sin(step + i * 0.3) * 0.4 + 0.6 : 0.15;
        const barHeight = Math.max(4, Math.random() * 20 + heightMultiplier * 45);
        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, '#00F0FF');
        gradient.addColorStop(1, '#0E6B63');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-[#171f33] border border-[#2d3449] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#222a3d] bg-[#0b1326]/60">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#6bd8cb]/20 text-[#6bd8cb]">
              {item.badge}
            </span>
            <span className="text-sm font-medium text-[#dae2fd] truncate">
              {item.title}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onShare(item)}
              className="p-2 rounded-lg text-[#bcc9c6] hover:text-white hover:bg-[#222a3d] transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#bcc9c6] hover:text-white hover:bg-[#222a3d] transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video / Audio Stage */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
          {item.category === 'video' && item.thumbnailUrl ? (
            <div className="relative w-full h-full">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#131b2e] to-[#060e20] p-6">
              <div className="w-20 h-20 rounded-2xl bg-[#ffb59a]/15 text-[#ffb59a] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,181,154,0.15)]">
                <Music className="w-10 h-10" />
              </div>
              <span className="text-sm text-[#ffb59a] font-medium tracking-wide">
                High Fidelity Audio • 320kbps
              </span>
            </div>
          )}

          {/* Audio Visualizer Overlay */}
          <div className="absolute bottom-16 left-6 right-6 h-14 pointer-events-none opacity-80">
            <canvas ref={canvasRef} width={400} height={60} className="w-full h-full" />
          </div>

          {/* Play/Pause Large Center Overlay Trigger */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#6bd8cb] text-[#003732] flex items-center justify-center shadow-lg shadow-[#6bd8cb]/30 group-hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </div>
          </button>
        </div>

        {/* Player Controls Bar */}
        <div className="p-4 bg-[#131b2e] flex flex-col gap-3">
          {/* Timeline Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#bcc9c6] font-mono">01:24</span>
            <div
              className="relative flex-1 h-2 bg-[#222a3d] rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                setProgress(newPct);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] rounded-full shadow-[0_0_8px_rgba(107,216,203,0.5)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#bcc9c6] font-mono">{item.duration || '04:12'}</span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#6bd8cb] flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#bcc9c6] flex items-center justify-center transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="text-xs text-[#bcc9c6]">
                Format: <span className="text-[#dae2fd] font-medium">{item.format}</span> • {item.sizeString}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(item.sourceUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-xs font-medium text-[#bcc9c6] hover:text-[#dae2fd] transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#6bd8cb]" /> : null}
                <span>{copied ? 'Source Copied' : 'Copy Source'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
