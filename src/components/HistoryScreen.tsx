import React, { useState } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Trash2,
  Play,
  Share2,
  MoreVertical,
  Music,
  Film,
  Sparkles,
  ExternalLink,
  Copy,
  FolderOpen,
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryScreenProps {
  history: HistoryItem[];
  onPlayItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAllHistory: () => void;
  onShareItem: (item: HistoryItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onPlayItem,
  onDeleteItem,
  onClearAllHistory,
  onShareItem,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'audio' | '4k'>('all');
  const [isListening, setIsListening] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Compute stats
  const totalFiles = history.length;
  const videoCount = history.filter((h) => h.category === 'video').length;
  const audioCount = history.filter((h) => h.category === 'audio').length;
  const ultraCount = history.filter((h) => h.badge.includes('4K')).length;

  // Filter items
  const filteredItems = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.format.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'video') return item.category === 'video';
    if (activeFilter === 'audio') return item.category === 'audio';
    if (activeFilter === '4k') return item.badge.includes('4K');
    return true;
  });

  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    onShowToast('Listening for search query...', 'info');

    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Cyberpunk');
      onShowToast('Voice recognized: "Cyberpunk"', 'success');
    }, 1600);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-28 pt-4 max-w-4xl mx-auto">
      {/* Top Search & Quick Stats Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-semibold text-2xl sm:text-3xl text-[#dae2fd]">
              Download History
            </h1>
            <p className="text-xs sm:text-sm text-[#bcc9c6] mt-0.5">
              {totalFiles} completed files • 4.2 GB total storage
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearAllHistory}
              className="w-10 h-10 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] flex items-center justify-center text-[#dae2fd] hover:text-red-400 transition-all border border-[#2d3449] cursor-pointer shadow-sm"
              title="Clear all completed history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#bcc9c6]">
            <Search className="w-4 h-4" />
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search downloaded files..."
            className="w-full bg-[#222a3d] text-[#dae2fd] placeholder:text-[#bcc9c6] text-sm pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6bd8cb] transition-all border border-[#2d3449]"
          />

          <button
            onClick={handleVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${
              isListening ? 'text-[#00F0FF] animate-pulse' : 'text-[#bcc9c6] hover:text-white'
            }`}
            title="Voice search"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#6bd8cb] text-[#003732] shadow-sm shadow-[#6bd8cb]/20 font-semibold'
                : 'bg-[#222a3d] text-[#bcc9c6] hover:text-[#dae2fd]'
            }`}
          >
            All Files ({totalFiles})
          </button>

          <button
            onClick={() => setActiveFilter('video')}
            className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              activeFilter === 'video'
                ? 'bg-[#6bd8cb] text-[#003732] shadow-sm shadow-[#6bd8cb]/20 font-semibold'
                : 'bg-[#222a3d] text-[#bcc9c6] hover:text-[#dae2fd]'
            }`}
          >
            Videos ({videoCount})
          </button>

          <button
            onClick={() => setActiveFilter('audio')}
            className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              activeFilter === 'audio'
                ? 'bg-[#6bd8cb] text-[#003732] shadow-sm shadow-[#6bd8cb]/20 font-semibold'
                : 'bg-[#222a3d] text-[#bcc9c6] hover:text-[#dae2fd]'
            }`}
          >
            Audio ({audioCount})
          </button>

          <button
            onClick={() => setActiveFilter('4k')}
            className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              activeFilter === '4k'
                ? 'bg-[#6bd8cb] text-[#003732] shadow-sm shadow-[#6bd8cb]/20 font-semibold'
                : 'bg-[#222a3d] text-[#bcc9c6] hover:text-[#dae2fd]'
            }`}
          >
            4K Ultra ({ultraCount})
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex flex-col gap-3.5">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#171f33] border border-[#222a3d] text-center gap-3">
            <Sparkles className="w-8 h-8 text-[#6bd8cb]" />
            <h3 className="text-base font-headline font-semibold text-[#dae2fd]">
              No files found
            </h3>
            <p className="text-xs text-[#bcc9c6] max-w-xs">
              {searchQuery
                ? `No downloads match "${searchQuery}". Try a different keyword.`
                : 'No files in this category yet.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#171f33] rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-[#222a3d] transition-all hover:bg-[#1a233a] group relative"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Thumbnail */}
                <div
                  onClick={() => onPlayItem(item)}
                  className="relative w-28 sm:w-32 h-16 sm:h-18 rounded-xl shrink-0 overflow-hidden cursor-pointer bg-[#2d3449] flex items-center justify-center group/thumb"
                >
                  {item.category === 'video' && item.thumbnailUrl ? (
                    <>
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#0b1326]/20" />
                      <div
                        className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0b1326]/80 backdrop-blur-md text-[10px] font-bold ${
                          item.badge.includes('4K') ? 'text-[#6bd8cb]' : 'text-[#00F0FF]'
                        }`}
                      >
                        {item.badge}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#222a3d] to-[#131b2e] relative">
                      <Music className="w-7 h-7 text-[#ffb59a]" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0b1326]/80 backdrop-blur-md text-[10px] font-bold text-[#ffb59a]">
                        MP3
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      onClick={() => onPlayItem(item)}
                      className="text-sm sm:text-base font-medium text-[#dae2fd] truncate group-hover:text-white transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h2>

                    {/* More Menu Toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="text-[#bcc9c6] hover:text-white shrink-0 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#222a3d] border border-[#2d3449] shadow-2xl py-1.5 z-20 animate-fade-in text-xs">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.sourceUrl);
                              onShowToast('Source link copied to clipboard', 'info');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-[#dae2fd] hover:bg-[#2d3449] flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#6bd8cb]" />
                            <span>Copy Video Link</span>
                          </button>
                          <button
                            onClick={() => {
                              onShowToast(`File location: /storage/emulated/0/StreamGrab/${item.title.slice(0, 16)}.${item.format.toLowerCase()}`, 'info');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-[#dae2fd] hover:bg-[#2d3449] flex items-center gap-2"
                          >
                            <FolderOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
                            <span>Show in Folder</span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteItem(item.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete File</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-[#bcc9c6]">{item.sizeString}</span>
                    <span className="w-1 h-1 rounded-full bg-[#3d4947]" />
                    <span className="text-xs text-[#bcc9c6]">{item.dateString}</span>
                    <span className="w-1 h-1 rounded-full bg-[#3d4947]" />
                    <span
                      className={`text-xs font-semibold ${
                        item.badge.includes('4K')
                          ? 'text-[#6bd8cb]'
                          : item.format === 'MP3'
                          ? 'text-[#ffb59a]'
                          : 'text-[#00F0FF]'
                      }`}
                    >
                      {item.format}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222a3d]/60">
                <button
                  onClick={() => onPlayItem(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] text-xs font-semibold hover:bg-[#6bd8cb] hover:text-[#003732] transition-all cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => onShareItem(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] text-xs font-medium hover:bg-[#2d3449] hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#222a3d] text-red-400 text-xs font-medium hover:bg-red-950/40 hover:text-red-300 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
