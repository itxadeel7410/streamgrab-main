import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { QUALITY_OPTIONS } from '../data/mockData';

interface QualityModalProps {
  isOpen: boolean;
  selectedQuality: string;
  onSelect: (qualityLabel: string) => void;
  onClose: () => void;
  title?: string;
}

export const QualityModal: React.FC<QualityModalProps> = ({
  isOpen,
  selectedQuality,
  onSelect,
  onClose,
  title = 'Select Default Quality',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in p-0 sm:p-4">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-[#171f33] border-t sm:border border-[#2d3449] w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl z-10 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-[#2d3449] rounded-full mx-auto mb-1 shrink-0" />

        <div className="flex items-center justify-between">
          <h3 className="font-headline font-semibold text-lg text-[#dae2fd]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#bcc9c6] hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#bcc9c6]">
          Higher quality streams require more bandwidth and device storage space.
        </p>

        <div className="flex flex-col gap-2.5 mt-1">
          {QUALITY_OPTIONS.map((opt) => {
            const isSelected = selectedQuality.toLowerCase().includes(opt.id) || selectedQuality === opt.label;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  onSelect(opt.label);
                  onClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#6bd8cb]/15 border border-[#6bd8cb]/50 shadow-[0_0_12px_rgba(107,216,203,0.15)]'
                    : 'bg-[#222a3d] hover:bg-[#2d3449] border border-transparent'
                }`}
              >
                <div className="flex flex-col pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm sm:text-base ${isSelected ? 'text-[#6bd8cb]' : 'text-[#dae2fd]'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0b1326] text-[#bcc9c6]">
                      {opt.estimatedSize}
                    </span>
                  </div>
                  <span className="text-xs text-[#bcc9c6] mt-0.5">{opt.description}</span>
                </div>

                <div className="shrink-0 pl-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${isSelected ? 'text-[#6bd8cb]' : 'text-transparent'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
