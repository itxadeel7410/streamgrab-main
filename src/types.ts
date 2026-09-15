export type TabType = 'home' | 'downloads' | 'history' | 'settings';

export type VideoPlatform = 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'Twitter/X' | 'Vimeo' | 'Twitch' | 'Other';

export interface QualityOption {
  id: string;
  label: string;
  resolution: string;
  description: string;
  estimatedSize: string;
  fps?: number;
}

export interface ActiveDownload {
  id: string;
  title: string;
  platform: VideoPlatform;
  quality: string;
  format: 'MP4' | 'WEBM' | 'MP3';
  downloadedMB: number;
  totalMB: number;
  speedMBps: number;
  etaSeconds: number;
  progress: number; // 0 to 100
  status: 'downloading' | 'paused' | 'completed' | 'queued';
  thumbnailUrl: string;
  sourceUrl: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  badge: '4K UHD' | '1080p' | '720p' | 'MP3';
  format: 'MP4' | 'WEBM' | 'MP3';
  sizeString: string;
  dateString: string;
  category: 'video' | 'audio';
  duration?: string;
  sourceUrl: string;
  mediaType: 'video' | 'audio';
}

export interface RecentLink {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  platform: VideoPlatform;
  duration: string;
}

export interface AppSettings {
  defaultQuality: string;
  downloadLocation: string;
  wifiOnly: boolean;
  autoExtractMp3: boolean;
  theme: 'dark' | 'light' | 'system';
  concurrentLimit: number;
}
