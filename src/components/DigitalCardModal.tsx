import React, { useRef, useState } from 'react';
import { X, Download, Share2, ShieldCheck, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { exportElementToPdf } from '../utils/pdfExport';

interface DigitalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const DigitalCardModal: React.FC<DigitalCardModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCard = async (format: 'png' | 'pdf' = 'png') => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      if (format === 'pdf') {
        const filename = `DigitalVisitingCard_${profile.name.replace(/\s+/g, '_')}.pdf`;
        await exportElementToPdf(cardRef.current, filename);
      } else {
        const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `DigitalVisitingCard_${profile.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }

      confetti({ particleCount: 60, spread: 50 });
    } catch (e) {
      console.error("Card download fail", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] text-white w-full max-w-sm rounded-3xl shadow-2xl p-5 relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <h3 className="text-sm font-bold flex items-center gap-2 text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Digital Visiting Card</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Target Frame */}
        <div
          ref={cardRef}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#1B3A6B] via-[#0F2347] to-[#1A1D24] text-white space-y-4 shadow-xl border border-white/20 relative overflow-hidden"
        >
          {/* Header Party Logo & Name */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div>
              <h2 className="text-lg font-bold">{profile.name}</h2>
              <p className="text-xs text-amber-300 font-semibold">{profile.designation1}</p>
              <p className="text-[10px] text-gray-300">{profile.designation2}</p>
            </div>
            {profile.partyLogoUrl && (
              <img
                src={profile.partyLogoUrl}
                alt="Party Logo"
                className="w-12 h-12 object-contain bg-white/10 p-1 rounded-full border border-white/20"
              />
            )}
          </div>

          {/* Contact details */}
          <div className="space-y-2 text-xs text-gray-200">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{profile.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span className="truncate">{profile.address}</span>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-gray-400 font-medium">
            <span>PosterForge Digital Card</span>
            <span>{profile.partyName}</span>
          </div>
        </div>

        {/* Download Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDownloadCard('pdf')}
            disabled={isDownloading}
            id="digital-card-download-pdf-btn"
            className="py-3 rounded-2xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => handleDownloadCard('png')}
            disabled={isDownloading}
            id="digital-card-download-btn"
            className="py-3 rounded-2xl bg-[#FF6B35] text-white font-bold text-xs hover:bg-[#e05a2b] transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
