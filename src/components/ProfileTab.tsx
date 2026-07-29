import React, { useState } from 'react';
import { 
  Folder, Camera, Edit2, Download, Instagram, Twitter, 
  MessageSquare, Facebook, MapPin, Check, Palette, Sparkles, X, Mail, FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onExportDigitalCard: () => void;
  onOpenRemindersManager: () => void;
  onExportFullProjectPdf?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onExportDigitalCard,
  onOpenRemindersManager,
  onExportFullProjectPdf,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [activeBrandColor, setActiveBrandColor] = useState<string>(profile.primaryBrandColor || '#C94B4B');
  const [showColorPicker, setShowColorPicker] = useState(false);

  React.useEffect(() => {
    if (profile.primaryBrandColor) {
      setActiveBrandColor(profile.primaryBrandColor);
    }
  }, [profile.primaryBrandColor]);

  const brandColors = [
    { name: 'Red Crimson', hex: '#C94B4B' },
    { name: 'Saffron Orange', hex: '#FF7200' },
    { name: 'Deep Navy', hex: '#1B3A6B' },
    { name: 'Royal Emerald', hex: '#1B5E20' },
    { name: 'Imperial Violet', hex: '#4A154B' },
    { name: 'Dark Teal', hex: '#0F766E' },
    { name: 'Maroon Red', hex: '#7A2B3E' },
    { name: 'Charcoal Slate', hex: '#1F2937' },
  ];

  const handleColorSelect = (hex: string) => {
    setActiveBrandColor(hex);
    const updated = { ...editedProfile, primaryBrandColor: hex };
    setEditedProfile(updated);
    onUpdateProfile(updated);
    setShowColorPicker(false);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ ...editedProfile, primaryBrandColor: activeBrandColor });
    setIsEditing(false);
  };

  const handleLanguageChange = (lang: 'Marathi' | 'Hindi' | 'English') => {
    const next = { ...editedProfile, preferredLanguage: lang };
    setEditedProfile(next);
    onUpdateProfile(next);
  };

  return (
    <div
      className="min-h-screen pb-32 pt-3 px-4 text-white max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn transition-colors duration-300"
      style={{ backgroundColor: activeBrandColor }}
    >
      {/* A. Top Bar (Clean, Language Selector) */}
      <div className="flex items-center justify-between mb-4">
        {/* Subtle Brand Theme Toggle Icon */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 border border-white/30 shadow-xs transition-transform active:scale-95"
            title="Change Brand Theme Color"
          >
            <Palette className="w-4 h-4" />
          </button>

          {showColorPicker && (
            <div className="absolute left-0 top-10 bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-200 z-30 flex items-center gap-2 animate-fadeIn">
              {brandColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleColorSelect(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    activeBrandColor === c.hex ? 'border-black scale-110 shadow-md' : 'border-transparent opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Language Selector Pill */}
        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xs">
          {(['Marathi', 'Hindi', 'English'] as const).map((lang) => {
            const isActive = editedProfile.preferredLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {lang === 'Marathi' ? 'मराठी' : lang === 'Hindi' ? 'हिंदी' : 'English'}
              </button>
            );
          })}
        </div>
      </div>

      {/* B. Leader Identity Card */}
      <div
        id="identity-card-export-target"
        className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-rose-100/50 relative space-y-4 mb-4 text-gray-900"
      >
        {/* BJP / Party Lotus Emblem Logo at top center */}
        <div className="flex justify-center pt-1 pb-1">
          {profile.partyLogoUrl ? (
            <img
              src={profile.partyLogoUrl}
              alt="Party Logo"
              className="h-12 max-w-[140px] object-contain drop-shadow-xs"
            />
          ) : (
            /* BJP Lotus Vector Emblem (Saffron & Green) */
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-[#FF7200]" viewBox="0 0 100 100" fill="currentColor">
                {/* Lotus Petals */}
                <path d="M50 10 C45 30 35 45 35 60 C35 70 42 78 50 78 C58 78 65 70 65 60 C65 45 55 30 50 10 Z" fill="#FF7200" />
                <path d="M30 30 C20 45 15 60 20 72 C25 80 38 82 45 75 C38 65 32 48 30 30 Z" fill="#FF7200" opacity="0.9" />
                <path d="M70 30 C80 45 85 60 80 72 C75 80 62 82 55 75 C62 65 68 48 70 30 Z" fill="#FF7200" opacity="0.9" />
                <path d="M15 50 C10 62 12 75 20 80 C28 85 40 82 42 75 C30 73 20 62 15 50 Z" fill="#FF7200" opacity="0.8" />
                <path d="M85 50 C90 62 88 75 80 80 C72 85 60 82 58 75 C70 73 80 62 85 50 Z" fill="#FF7200" opacity="0.8" />
                {/* Stem / Base */}
                <path d="M35 84 L65 84 L60 90 L40 90 Z" fill="#138808" />
                <path d="M40 92 L60 92 L55 96 L45 96 Z" fill="#138808" />
              </svg>
            </div>
          )}
        </div>

        {/* Profile Avatar Image (Circular, Left Aligned, ~130px) */}
        <div className="flex items-center justify-start pt-1">
          <div className="relative shrink-0">
            <img
              src={editedProfile.avatarUrl}
              alt={editedProfile.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
            {isEditing && (
              <label className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#FF7200] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = (ev) =>
                        setEditedProfile({ ...editedProfile, avatarUrl: ev.target?.result as string });
                      r.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Name & Designation Block (Matches Screenshot Typography) */}
        <div className="space-y-1 pt-1">
          {/* Main Name (Bold Devnagari / English H1) */}
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight leading-snug">
            {editedProfile.name}
          </h1>

          {/* Subtitle 1 (Bold Black) */}
          <p className="text-base font-bold text-[#1F2937] leading-snug">
            {editedProfile.designation1}
          </p>

          {/* Subtitle 2 (Muted Gray) */}
          <p className="text-sm font-normal text-[#6B7280]">
            {editedProfile.designation2}
          </p>
        </div>

        {/* Social Outline Icons Row (Instagram, X, WhatsApp, Facebook, Location) */}
        <div className="pt-3 flex items-center gap-4 text-[#111827]">
          <a
            href={editedProfile.socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition-opacity"
            title="Instagram"
          >
            <Instagram className="w-6 h-6 stroke-[1.8]" />
          </a>
          <a
            href={editedProfile.socialLinks.twitter}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition-opacity"
            title="X / Twitter"
          >
            <Twitter className="w-6 h-6 stroke-[1.8]" />
          </a>
          <a
            href={editedProfile.socialLinks.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition-opacity"
            title="WhatsApp"
          >
            <MessageSquare className="w-6 h-6 stroke-[1.8]" />
          </a>
          <a
            href={editedProfile.socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition-opacity"
            title="Facebook"
          >
            <Facebook className="w-6 h-6 stroke-[1.8]" />
          </a>
          <a
            href={editedProfile.socialLinks.mapLocation}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition-opacity"
            title="Office Location"
          >
            <MapPin className="w-6 h-6 stroke-[1.8]" />
          </a>
        </div>


      </div>

      {/* C. Personal Information Card */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-rose-100/50 space-y-4 mb-4 text-gray-900">
        {/* Section Header Row */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            {/* Square Blue Outline Folder Icon Container */}
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] flex items-center justify-center">
              <Folder className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="text-lg font-bold text-[#1F2937]">
              Personal Information :-
            </h2>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            id="profile-toggle-edit-btn"
            className="text-xs font-bold text-[#FF7200] hover:underline flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200"
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Save</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        {/* Individual Light-Gray Field Cards (Exactly matching screenshot) */}
        <div className="space-y-3">
          {[
            {
              label: "Name :-",
              key: "name",
              val: editedProfile.name,
            },
            {
              label: "Contact Number :-",
              key: "contactNumber",
              val: editedProfile.contactNumber,
            },
            {
              label: "Address :-",
              key: "address",
              val: editedProfile.address,
            },
            {
              label: "Designation / Post :-",
              key: "designation1",
              val: editedProfile.designation1,
            },
            {
              label: "Party / Ward / Reg. No. :-",
              key: "registrationNo",
              val: editedProfile.registrationNo,
            },
          ].map((field) => (
            <div
              key={field.key}
              className="p-4 rounded-xl bg-[#F3F5F8] border border-slate-100/80 space-y-1"
            >
              <span className="text-xs font-semibold text-[#4B5563] block">
                {field.label}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={field.val}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, [field.key]: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-sm font-bold text-[#111827] focus:ring-2 focus:ring-[#FF7200]"
                />
              ) : (
                <p className="text-base font-bold text-[#111827] leading-snug">
                  {field.val || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onExportDigitalCard}
          id="profile-export-digital-card-btn"
          className="w-full py-3.5 rounded-2xl bg-white text-[#111827] font-extrabold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-lg border border-white/40"
        >
          <Download className="w-4 h-4 text-[#FF7200]" />
          <span>Export Digital Visiting Card (Image/PDF)</span>
        </button>

        <button
          onClick={onOpenRemindersManager}
          className="w-full py-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30 hover:bg-white/30 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Manage Birthday & Event Reminders</span>
        </button>
      </div>
    </div>
  );
};


