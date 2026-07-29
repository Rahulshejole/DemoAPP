import React, { useState, useEffect } from 'react';
import { 
  Search, Vote, Briefcase, Quote, Sparkles, Heart, Edit2, Calendar, 
  ChevronRight, Gift, Cake, MessageCircle
} from 'lucide-react';
import { DesignTemplate, DraftItem, EventReminder, UserProfile } from '../types';

interface HomeTabProps {
  profile: UserProfile;
  templates: DesignTemplate[];
  drafts: DraftItem[];
  reminders: EventReminder[];
  favorites: string[]; // template IDs
  onSelectTemplate: (template: DesignTemplate) => void;
  onOpenDraft: (draft: DraftItem) => void;
  onToggleFavorite: (templateId: string) => void;
  onSelectCategory: (categoryKey: string) => void;
  onCreateWishFromReminder: (reminder: EventReminder) => void;
  onOpenSeeAllTemplates: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  templates,
  drafts,
  reminders,
  favorites,
  onSelectTemplate,
  onOpenDraft,
  onToggleFavorite,
  onSelectCategory,
  onCreateWishFromReminder,
  onOpenSeeAllTemplates,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = [
    { id: 'all', label: 'All' },
    { id: 'suvichar', label: 'सुविचार' },
    { id: 'trending', label: 'Trending' },
    { id: 'nisarg', label: 'जागतिक निसर्ग संवर्धन दिन' },
    { id: 'shubh_sakal', label: 'शुभ सकाळ' },
    { id: 'political', label: 'राजकीय' },
  ];

  const banners = [
    {
      id: "b1",
      title: "Political Campaign 2026",
      subtitle: "Leader Birthday & Rally Poster Presets",
      bgGradient: "bg-gradient-to-r from-[#C94B4B] via-[#9E3B48] to-[#7A2B3E]",
      ctaText: "Explore Posters",
      categoryKey: "political",
    },
    {
      id: "b2",
      title: "Business Offer & Sale Greetings",
      subtitle: "Boost Sales with Festival Discount Banners",
      bgGradient: "bg-gradient-to-r from-[#FF6B35] to-[#D9381E]",
      ctaText: "Create Offer Banner",
      categoryKey: "business",
    },
    {
      id: "b3",
      title: "Daily Inspiration & Quotes",
      subtitle: "Share Thoughtful Marathi & Hindi Slogans",
      bgGradient: "bg-gradient-to-r from-[#10B981] to-[#047857]",
      ctaText: "Get Quotes",
      categoryKey: "quotes",
    },
  ];

  // Auto-advance banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearTimeout(timer);
  }, [banners.length]);

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedTag && selectedTag !== 'all') {
      const matchTag = tpl.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase())) ||
                       tpl.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
                       tpl.category.toLowerCase().includes(selectedTag.toLowerCase());
      if (!matchTag) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tpl.title.toLowerCase().includes(q) ||
      tpl.tags.some((t) => t.toLowerCase().includes(q)) ||
      tpl.category.toLowerCase().includes(q) ||
      tpl.language.toLowerCase().includes(q)
    );
  });

  // Reusable Section Header Component
  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <div className="flex items-center justify-between mb-3 px-1">
      <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{title}</h2>
      <button
        onClick={onSeeAll || onOpenSeeAllTemplates}
        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 hover:bg-rose-100 text-[#C94B4B] border border-rose-200/60 flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
      >
        <span>Show All</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // Helper for template card
  const renderTemplateCard = (template: DesignTemplate, dateBadge?: { day: string; month: string }) => {
    const isFav = favorites.includes(template.id);
    return (
      <div
        key={template.id}
        className="group relative shrink-0 w-[145px] sm:w-[160px] rounded-[16px] border border-gray-100 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div
          className="relative aspect-[3/4] bg-gray-50 overflow-hidden cursor-pointer"
          onClick={() => onSelectTemplate(template)}
        >
          <img
            src={template.previewUrl}
            alt={template.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Date Badge Stacked for Upcoming Festival */}
          {dateBadge ? (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-gradient-to-b from-[#C94B4B] to-[#7A2B3E] text-white shadow-md text-center flex flex-col items-center leading-none">
              <span className="text-[11px] font-extrabold">{dateBadge.day}</span>
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-90">{dateBadge.month}</span>
            </div>
          ) : (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-md text-[#C94B4B] uppercase border border-gray-200/80 shadow-2xs">
              {template.language}
            </span>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
              isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-2.5 flex items-center justify-between border-t border-gray-100 bg-white">
          <div className="truncate pr-1">
            <h3 className="text-[12px] font-bold text-gray-800 truncate">
              {template.title}
            </h3>
            <p className="text-[10px] text-gray-500 capitalize truncate">
              {template.subCategory}
            </p>
          </div>

          <button
            onClick={() => onSelectTemplate(template)}
            className="p-1.5 rounded-lg bg-rose-50 text-[#C94B4B] hover:bg-[#C94B4B] hover:text-white transition-colors shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-28 space-y-6 pt-3 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-3xl animate-fadeIn">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search designs, quotes, templates..."
          id="home-search-input"
          className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200/80 rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C94B4B]/30 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Banner Carousel */}
      <div className="relative rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className={`p-5 text-white transition-all duration-500 min-h-[145px] flex flex-col justify-between ${banners[activeBannerIndex].bgGradient}`}>
          <div>
            <span className="text-[9px] font-extrabold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md">
              Featured Studio
            </span>
            <h3 className="text-lg font-bold mt-2 leading-tight">
              {banners[activeBannerIndex].title}
            </h3>
            <p className="text-xs text-white/90 mt-1">
              {banners[activeBannerIndex].subtitle}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => onSelectCategory(banners[activeBannerIndex].categoryKey)}
              className="px-4 py-1.5 rounded-full bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors shadow-xs"
            >
              {banners[activeBannerIndex].ctaText}
            </button>

            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeBannerIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Tag Chips Row (Outline pills with red text, filled when selected) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag.id || (tag.id === 'all' && selectedTag === null);
          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id === 'all' ? null : tag.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C94B4B] to-[#7A2B3E] text-white border-transparent shadow-sm'
                  : 'bg-white text-[#C94B4B] border-[#C94B4B]/30 hover:bg-rose-50'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* 1. TODAY'S DESIGN */}
      <section className="space-y-2">
        {renderSectionHeader("Today's Design")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(0, 5).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 2. UPCOMING FESTIVAL */}
      <section className="space-y-2">
        {renderSectionHeader("Upcoming Festival")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(1, 6).map((template) => renderTemplateCard(template, { day: '29', month: 'JUL' }))}
        </div>
      </section>

      {/* 3. CONGRATULATIONS / BIRTHDAY / ANNIVERSARY QUICK PILLS */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <button
          onClick={() => onSelectCategory('congratulations')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-gradient-to-r from-[#C94B4B] to-[#9E3B48] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all active:scale-95"
        >
          <Gift className="w-4 h-4 text-amber-300" />
          <span>Congratulations</span>
        </button>

        <button
          onClick={() => onSelectCategory('birthday')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-gradient-to-r from-[#C94B4B] to-[#9E3B48] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all active:scale-95"
        >
          <Cake className="w-4 h-4 text-amber-300" />
          <span>Birthday</span>
        </button>

        <button
          onClick={() => onSelectCategory('anniversary')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-gradient-to-r from-[#C94B4B] to-[#9E3B48] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all active:scale-95"
        >
          <Heart className="w-4 h-4 text-amber-300 fill-current" />
          <span>Anniversary</span>
        </button>
      </div>

      {/* 4. DESIGN EDITOR */}
      <section className="space-y-2">
        {renderSectionHeader("Design Editor")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(0, 5).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 5. POLITICAL DESIGN */}
      <section className="space-y-2">
        {renderSectionHeader("Political Design", () => onSelectCategory('political'))}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.filter(t => t.category === 'political' || t.tags.includes('political')).slice(0, 5).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* Subtle Ad Banner Card (Max 1 per screen, subtle card away from bottom nav) */}
      <div className="my-6 p-4 rounded-[16px] bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-50 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-white">
            Special Offer
          </span>
          <h4 className="text-xs font-bold text-gray-900 mt-1">Wallet Super Saver Discount</h4>
          <p className="text-[11px] text-gray-600">Recharge DesignCraft Wallet & Get ₹100 Cashback!</p>
        </div>
        <button
          onClick={() => alert('Recharge offer applied to account!')}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-black shrink-0 transition-colors"
        >
          SUPER100
        </button>
      </div>

      {/* 6. GOOD THOUGHTS */}
      <section className="space-y-2">
        {renderSectionHeader("Good Thoughts")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(2, 7).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 7. RELIGIOUS QUOTES */}
      <section className="space-y-2">
        {renderSectionHeader("Religious Quotes")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(1, 6).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 8. GOOD MORNING */}
      <section className="space-y-2">
        {renderSectionHeader("Good Morning")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(0, 5).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 9. GOOD NIGHT */}
      <section className="space-y-2">
        {renderSectionHeader("Good Night")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(3, 8).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* 10. MOTIVATIONAL QUOTE */}
      <section className="space-y-2">
        {renderSectionHeader("Motivational Quote")}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pl-0.5">
          {filteredTemplates.slice(0, 5).map((template) => renderTemplateCard(template))}
        </div>
      </section>

      {/* Floating WhatsApp Action Button (48px, proper margin from bottom nav) */}
      <button
        onClick={() => {
          const whatsappUrl = `https://wa.me/918554850850?text=${encodeURIComponent("Namaste! I need assistance with my DesignCraft poster designs.")}`;
          window.open(whatsappUrl, '_blank');
        }}
        id="home-floating-whatsapp-btn"
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl transition-transform active:scale-90 border-2 border-white"
        title="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
      </button>
    </div>
  );
};

