import React from 'react';
import { Bell, HelpCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onExportFullProjectPdf?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const brandColor = profile.primaryBrandColor || '#C94B4B';

  return (
    <header 
      className="sticky top-0 z-30 text-white px-3.5 py-2.5 flex items-center justify-between shadow-md border-b border-white/10 transition-colors duration-300"
      style={{ backgroundColor: brandColor }}
    >
      {/* Left: User Profile */}
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onOpenProfile}>
        <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40 group-hover:ring-white transition-all shadow-sm"
            />
            {profile.partyLogoUrl && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-gray-200 overflow-hidden p-0.5 shadow-xs">
                <img src={profile.partyLogoUrl} alt="Party logo" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <div className="hidden xs:block">
            <h2 className="text-xs font-bold text-white tracking-wide truncate max-w-[110px] sm:max-w-[180px]">
              {profile.name || "Leader"}
            </h2>
            <p className="text-[10px] text-rose-100 font-medium truncate max-w-[110px]">
              {profile.designation1 || "Poster Studio"}
            </p>
          </div>
        </div>

      {/* Center Brand Title */}
      <div className="text-center">
        <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1">
          <span>DesignCraft</span>
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">
        {/* Support Icon Button */}
        <button
          onClick={() => {
            const whatsappUrl = `https://wa.me/918554850850?text=${encodeURIComponent("Namaste! I need help with DesignCraft Poster Studio.")}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          title="Customer Support"
          id="header-support-btn"
        >
          <HelpCircle className="w-4 h-4 text-white" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          title="Notifications & Event Reminders"
          id="header-notification-bell"
        >
          <Bell className="w-4 h-4 text-white" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-gray-950 text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#7A2B3E] shadow-sm">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};


