import React, { useState } from 'react';
import { FolderHeart, Edit2, Download, Trash2, Heart, Plus, FileText } from 'lucide-react';
import { DesignTemplate, DraftItem, DownloadedItem } from '../types';
import { exportImageToPdf } from '../utils/pdfExport';

interface MyDesignsTabProps {
  drafts: DraftItem[];
  downloaded: DownloadedItem[];
  favorites: string[];
  templates: DesignTemplate[];
  onOpenDraft: (draft: DraftItem) => void;
  onDeleteDraft: (draftId: string) => void;
  onSelectTemplate: (template: DesignTemplate) => void;
  onOpenCreateNew: () => void;
}

export const MyDesignsTab: React.FC<MyDesignsTabProps> = ({
  drafts,
  downloaded,
  favorites,
  templates,
  onOpenDraft,
  onDeleteDraft,
  onSelectTemplate,
  onOpenCreateNew,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'drafts' | 'downloaded' | 'favorites'>('drafts');

  const favoriteTemplates = templates.filter((t) => favorites.includes(t.id));

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-3xl animate-fadeIn space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Studio Designs</h1>
          <p className="text-xs text-gray-500">Saved drafts, downloads & favorite templates</p>
        </div>

        <button
          onClick={onOpenCreateNew}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C94B4B] to-[#7A2B3E] text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:opacity-95 transition-all active:scale-95"
          id="my-designs-new-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex rounded-2xl bg-gray-100 p-1 border border-gray-200/80">
        {(['drafts', 'downloaded', 'favorites'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            id={`my-designs-tab-${tab}`}
            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeSubTab === tab
                ? 'bg-white text-[#C94B4B] shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab === 'drafts'
              ? `Drafts (${drafts.length})`
              : tab === 'downloaded'
              ? `Saved (${downloaded.length})`
              : `Favorites (${favorites.length})`}
          </button>
        ))}
      </div>

      {/* DRAFTS TAB */}
      {activeSubTab === 'drafts' && (
        <div className="space-y-3">
          {drafts.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-[16px] border border-dashed border-gray-200 bg-white space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#C94B4B] mx-auto flex items-center justify-center">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No saved drafts yet</h3>
              <p className="text-xs text-gray-500">Start creating political or business designs to save progress here.</p>
              <button
                onClick={onOpenCreateNew}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C94B4B] to-[#7A2B3E] text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
              >
                Create First Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="group rounded-[16px] border border-gray-100 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div
                    onClick={() => onOpenDraft(draft)}
                    className="aspect-[3/4] bg-gray-50 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={draft.thumbnailUrl}
                      alt={draft.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C94B4B] text-white uppercase shadow-2xs">
                      DRAFT
                    </span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between border-t border-gray-100 bg-white">
                    <div className="truncate pr-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{draft.title}</h4>
                      <p className="text-[10px] text-gray-500">{draft.lastEdited}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenDraft(draft)}
                        className="p-1.5 rounded-lg bg-rose-50 text-[#C94B4B] hover:bg-[#C94B4B] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteDraft(draft.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOWNLOADED TAB */}
      {activeSubTab === 'downloaded' && (
        <div className="space-y-3">
          {downloaded.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-[16px] border border-dashed border-gray-200 bg-white space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No downloaded posters</h3>
              <p className="text-xs text-gray-500">Exported designs will be preserved here for easy re-sharing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {downloaded.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[16px] border border-gray-100 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white uppercase shadow-2xs">
                      EXPORTED
                    </span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between border-t border-gray-100 bg-white">
                    <div className="truncate pr-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-500">{item.downloadedAt}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => exportImageToPdf(item.thumbnailUrl, `Poster_${item.id}.pdf`)}
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                        title="Download as PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={item.thumbnailUrl}
                        download={`Export_${item.id}.png`}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Download as PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAVORITES TAB */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-3">
          {favoriteTemplates.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-[16px] border border-dashed border-gray-200 bg-white space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#C94B4B] mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No favorite templates</h3>
              <p className="text-xs text-gray-500">Tap the heart icon on any trending poster to bookmark it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoriteTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="rounded-[16px] border border-gray-100 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                    <img src={template.previewUrl} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 bg-white border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{template.title}</h4>
                    <span className="text-[10px] text-[#C94B4B] font-bold capitalize">{template.category}</span>
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

