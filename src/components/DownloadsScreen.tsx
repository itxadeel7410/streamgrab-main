import React from 'react';
import {
  RotateCw,
  Gauge,
  Pause,
  Play,
  X,
  Plus,
  Radio,
  Sparkles,
} from 'lucide-react';
import { ActiveDownload } from '../types';

interface DownloadsScreenProps {
  downloads: ActiveDownload[];
  onTogglePause: (id: string) => void;
  onCancelDownload: (id: string) => void;
  onTogglePauseAll: () => void;
  isAllPaused: boolean;
  onGoToHome: () => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  downloads,
  onTogglePause,
  onCancelDownload,
  onTogglePauseAll,
  isAllPaused,
  onGoToHome,
}) => {
  const activeCount = downloads.filter((d) => d.status === 'downloading').length;

  // Calculate total speed
  const totalSpeed = downloads
    .filter((d) => d.status === 'downloading')
    .reduce((acc, curr) => acc + curr.speedMBps, 0)
    .toFixed(1);

  return (
    <div className="flex flex-col w-full gap-6 pb-28 pt-4 max-w-4xl mx-auto">
      {/* Screen Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="font-headline font-semibold text-2xl sm:text-3xl text-[#dae2fd]">
            Active Downloads
          </h1>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#222a3d] text-[#6bd8cb] text-xs font-medium border border-[#6bd8cb]/20">
            <RotateCw
              className={`w-3.5 h-3.5 ${activeCount > 0 ? 'animate-spin' : ''}`}
            />
            <span>{activeCount} downloading</span>
          </div>
        </div>
        <p className="text-sm text-[#bcc9c6]">
          Real-time streams captured at maximum bandwidth.
        </p>
      </div>

      {/* Global Speed / Network Status Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171f33] p-4 sm:p-5 border border-[#222a3d] transition-all shadow-lg hover:shadow-[#6bd8cb]/5">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#6bd8cb]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#29a195]/30 flex items-center justify-center text-[#6bd8cb] border border-[#6bd8cb]/20 shadow-[0_0_15px_rgba(107,216,203,0.15)] shrink-0">
              <Gauge className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs text-[#bcc9c6] uppercase tracking-wider font-medium">
                Network Throughput
              </div>
              <div className="font-headline font-semibold text-xl sm:text-2xl text-[#dae2fd] flex items-center gap-2 mt-0.5">
                <span>{activeCount > 0 ? `${totalSpeed} MB/s` : '0.0 MB/s'}</span>
                <span className="text-[11px] text-[#6bd8cb] font-normal bg-[#6bd8cb]/15 px-2 py-0.5 rounded-full border border-[#6bd8cb]/30">
                  Peak 5G
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloads.length > 0 && (
              <button
                onClick={onTogglePauseAll}
                className="px-4 py-2.5 rounded-xl bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#3d4947]"
              >
                {isAllPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#6bd8cb]" />
                    <span>Resume All</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause All</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onGoToHome}
              className="px-3.5 py-2.5 rounded-xl bg-[#29a195] hover:bg-[#29a195]/90 text-[#00302b] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#29a195]/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Stream</span>
            </button>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="flex flex-col gap-4">
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#171f33] border border-[#222a3d] text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#222a3d] flex items-center justify-center text-[#6bd8cb]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-lg font-headline font-semibold text-[#dae2fd]">
                No active downloads right now
              </h3>
              <p className="text-xs text-[#bcc9c6]">
                All streams are idle. Paste a URL from YouTube, TikTok, or Instagram to begin fast grabbing.
              </p>
            </div>
            <button
              onClick={onGoToHome}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] text-[#003732] font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#6bd8cb]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Paste New Link</span>
            </button>
          </div>
        ) : (
          downloads.map((item) => {
            const isPaused = item.status === 'paused';
            const platformIconColor =
              item.platform === 'YouTube'
                ? 'text-red-400'
                : item.platform === 'Vimeo'
                ? 'text-purple-400'
                : item.platform === 'Twitch'
                ? 'text-blue-400'
                : 'text-[#6bd8cb]';

            const remainingTimeFormatted =
              item.etaSeconds > 60
                ? `${Math.floor(item.etaSeconds / 60)}m ${item.etaSeconds % 60}s left`
                : `${item.etaSeconds}s left`;

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-2xl bg-[#171f33] p-4 sm:p-5 flex flex-col gap-4 transition-all border ${
                  isPaused
                    ? 'border-[#222a3d] opacity-90'
                    : 'border-[#6bd8cb]/30 shadow-[0_0_20px_rgba(107,216,203,0.08)]'
                }`}
              >
                {/* Glowing top active border line */}
                {!isPaused && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6bd8cb] via-[#00F0FF] to-transparent" />
                )}

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-28 sm:w-32 h-18 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#2d3449]">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-opacity ${isPaused ? 'opacity-60' : 'opacity-100'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded backdrop-blur-md text-[10px] font-bold ${
                        isPaused ? 'bg-black/70 text-[#bcc9c6]' : 'bg-[#0b1326]/85 text-[#6bd8cb]'
                      }`}
                    >
                      {item.quality}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2d3449] text-[#bcc9c6] text-[10px] font-medium">
                        <span className={`w-2 h-2 rounded-full ${platformIconColor} bg-current`} />
                        {item.platform}
                      </span>
                      <span className="text-[#bcc9c6] text-xs">
                        • {(item.downloadedMB / 1024).toFixed(1)} GB / {(item.totalMB / 1024).toFixed(1)} GB
                      </span>
                    </div>

                    <h3
                      className={`font-headline font-medium text-sm sm:text-base truncate ${
                        isPaused ? 'text-[#bcc9c6]' : 'text-[#dae2fd]'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      {isPaused ? (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#f3c02f]" />
                          <span className="text-[#f3c02f]">Paused ({Math.round(item.progress)}%)</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#6bd8cb] animate-pulse" />
                          <span className="text-[#6bd8cb]">Downloading... {Math.round(item.progress)}%</span>
                        </>
                      )}
                    </div>

                    <div className="text-[#bcc9c6] font-mono text-xs">
                      {isPaused ? 'Queued' : `${item.speedMBps.toFixed(1)} MB/s • ${remainingTimeFormatted}`}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-[#2d3449] overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPaused
                          ? 'bg-[#f3c02f]'
                          : 'bg-gradient-to-r from-[#6bd8cb] to-[#00F0FF] shadow-[0_0_10px_rgba(107,216,203,0.5)]'
                      }`}
                      style={{ width: `${Math.max(3, item.progress)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#222a3d]/50">
                  {isPaused ? (
                    <button
                      onClick={() => onTogglePause(item.id)}
                      className="px-4 py-2 rounded-xl bg-[#6bd8cb] hover:bg-[#89f5e7] text-[#003732] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-[#6bd8cb]/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTogglePause(item.id)}
                      className="px-4 py-2 rounded-xl bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-[#3d4947]"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    onClick={() => onCancelDownload(item.id)}
                    className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-medium transition-colors flex items-center gap-1.5 border border-red-500/20 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
