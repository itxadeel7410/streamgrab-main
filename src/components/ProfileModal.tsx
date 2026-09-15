import React from 'react';
import { X, User, Zap, ShieldCheck, HardDrive, CheckCircle2, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#6bd8cb] flex items-center justify-center text-[#003732] font-bold shadow-md shadow-[#6bd8cb]/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-semibold text-base text-[#dae2fd]">
                Adeel Boss
              </h3>
              <span className="text-xs text-[#bcc9c6]">adeelboss877@gmail.com</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#bcc9c6] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Membership Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#29a195]/20 to-[#00F0FF]/15 border border-[#6bd8cb]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-[#6bd8cb] fill-current" />
            <div>
              <div className="text-sm font-semibold text-[#dae2fd]">StreamGrab Pro 5G</div>
              <div className="text-xs text-[#bcc9c6]">Unlimited 4K & High-Speed Multi-Thread</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6bd8cb] text-[#003732] text-[10px] font-bold">
            ACTIVE
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#222a3d] border border-[#2d3449]">
            <span className="text-xs text-[#bcc9c6]">Captured Media</span>
            <div className="text-lg font-headline font-semibold text-[#dae2fd] mt-0.5">24 Files</div>
          </div>
          <div className="p-3 rounded-xl bg-[#222a3d] border border-[#2d3449]">
            <span className="text-xs text-[#bcc9c6]">Data Saved</span>
            <div className="text-lg font-headline font-semibold text-[#dae2fd] mt-0.5">4.2 GB</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              onShowToast('Account synchronization active', 'success');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#29a195] text-[#00302b] text-xs font-semibold hover:bg-[#6bd8cb] transition-colors shadow-sm"
          >
            Sync Cloud Presets
          </button>
          <button
            onClick={() => {
              onShowToast('Logged out of session', 'info');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#222a3d] text-red-400 text-xs font-medium hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
