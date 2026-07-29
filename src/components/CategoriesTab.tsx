import React, { useState } from 'react';
import { Vote, Briefcase, Quote, Sparkles, ChevronRight, Frame, Image, QrCode, Video, ArrowLeft } from 'lucide-react';
import { categoryCardsData, sampleTemplates, sampleQuotesList } from '../data/templatesData';
import { DesignTemplate } from '../types';

interface CategoriesTabProps {
  onSelectTemplate: (template: DesignTemplate) => void;
  onOpenQuickTool: (toolName: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  onSelectTemplate,
  onOpenQuickTool,
}) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>('political');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');

  const otherTools = [
    { id: 'photo-frame', label: 'Photo Frame Maker', icon: Frame, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { id: 'logo-maker', label: 'Logo / Crest Maker', icon: Image, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { id: 'qr-card', label: 'QR Business Card', icon: QrCode, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: 'video-greetings', label: 'Video & Audio Wishes', icon: Video, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  const categoryIcons: Record<string, any> = {
    political: Vote,
    business: Briefcase,
    quotes: Quote,
    special: Sparkles,
  };

  const currentCategory = categoryCardsData.find((c) => c.categoryKey === selectedCategoryKey);

  // Filter templates for selected category
  const activeCategoryTemplates = sampleTemplates.filter((t) => {
    if (selectedCategoryKey && t.category !== selectedCategoryKey) return false;
    if (selectedSubCategory !== 'All' && t.subCategory !== selectedSubCategory) return false;
    if (selectedLanguageFilter !== 'All' && t.language !== selectedLanguageFilter) return false;
    return true;
  });

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-3xl animate-fadeIn space-y-6">
      {!selectedCategoryKey ? (
        <>
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Explore Categories</h1>
            <p className="text-xs text-gray-500">Select a design studio or utility tool below</p>
          </div>

          {/* 4 Feature Cards Stacked Vertically */}
          <div className="space-y-3">
            {categoryCardsData.map((cat) => {
              const Icon = categoryIcons[cat.categoryKey] || Vote;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryKey(cat.categoryKey);
                    setSelectedSubCategory('All');
                  }}
                  id={`category-card-${cat.categoryKey}`}
                  className="p-4 rounded-[16px] border border-gray-100 bg-white hover:border-[#C94B4B]/40 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 h-[95px]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${cat.iconColor} flex items-center justify-center shrink-0 border border-black/5 shadow-2xs`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{cat.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-[#C94B4B]">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* "Other Tools" Section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-gray-900">Other Design Utilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {otherTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onOpenQuickTool(tool.id)}
                    className="p-3.5 rounded-[16px] border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex items-center gap-3 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl ${tool.color} border flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{tool.label}</h4>
                      <span className="text-[10px] text-gray-500">Free Studio</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Sub-category detail view */
        <div className="space-y-4">
          {/* Back button & Category title */}
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
            <button
              onClick={() => setSelectedCategoryKey(null)}
              className="flex items-center gap-2 text-xs font-bold text-[#C94B4B] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Categories</span>
            </button>
            <span className="text-xs font-extrabold text-gray-900 capitalize px-2.5 py-1 rounded-full bg-rose-50 text-[#C94B4B] border border-rose-100">
              {currentCategory?.title}
            </span>
          </div>

          {/* Sub-category Pill Chips Row (Outline with red text, filled when active) */}
          {currentCategory && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {currentCategory.subCategories.map((sub) => {
                const isSelected = selectedSubCategory === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#C94B4B] to-[#7A2B3E] text-white border-transparent shadow-sm'
                        : 'bg-white text-[#C94B4B] border-[#C94B4B]/30 hover:bg-rose-50'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}

          {/* Language filter row */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-1 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="font-bold text-gray-800">Language Filter:</span>
            <div className="flex items-center gap-1">
              {['All', 'Marathi', 'Hindi', 'English'].map((lang) => {
                const isSel = selectedLanguageFilter === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguageFilter(lang)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isSel
                        ? 'bg-[#C94B4B] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Quotes List layout if quotes category */}
          {selectedCategoryKey === 'quotes' ? (
            <div className="space-y-3">
              {sampleQuotesList.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-[16px] text-white shadow-md space-y-3 relative overflow-hidden"
                  style={{ background: q.bgGradient }}
                >
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md">
                    {q.category} Quote
                  </span>
                  <p className="text-sm sm:text-base font-bold leading-relaxed">
                    “{q.quoteTextMr || q.quoteText}”
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/90 font-medium">— {q.author}</span>
                    <button
                      onClick={() =>
                        onSelectTemplate({
                          id: `custom-quote-${q.id}`,
                          title: `${q.author} Quote Banner`,
                          category: 'quotes',
                          subCategory: q.category,
                          language: 'Marathi',
                          aspectRatio: '1:1',
                          previewUrl: '',
                          tags: ['Quote'],
                          backgroundColor: '#1B3A6B',
                          gradientBg: q.bgGradient,
                          elements: [
                            {
                              id: 'q-text',
                              type: 'text',
                              content: `“${q.quoteTextMr || q.quoteText}”`,
                              x: 5,
                              y: 20,
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: '#FFFFFF',
                              textAlign: 'center',
                              zIndex: 2,
                            },
                            {
                              id: 'q-author',
                              type: 'text',
                              content: `— ${q.author}`,
                              x: 10,
                              y: 60,
                              fontSize: 14,
                              color: '#FDE047',
                              textAlign: 'center',
                              zIndex: 2,
                            },
                            {
                              id: 'el-footer',
                              type: 'footer',
                              x: 0,
                              y: 82,
                              width: 100,
                              height: 18,
                              zIndex: 10,
                            },
                          ],
                        })
                      }
                      className="px-3 py-1.5 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-gray-100 shadow-xs active:scale-95 transition-all"
                    >
                      Use as Design
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Template Grid */
            <div className="grid grid-cols-2 gap-3">
              {activeCategoryTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="group rounded-[16px] border border-gray-100 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                    <img
                      src={template.previewUrl}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-md text-[#C94B4B] uppercase border border-gray-200/80 shadow-2xs">
                      {template.language}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-900 truncate">{template.title}</h3>
                    <p className="text-[10px] text-gray-500 capitalize">{template.subCategory}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

