import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, RotateCw, Save, Download, Share2, Type, 
  Image as ImageIcon, Sparkles, Palette, Layers, Frame, Lock, Unlock, 
  Trash2, Eye, EyeOff, Plus, Check, Sliders, ShieldCheck, Copy, FileText, ChevronDown
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { CanvasAspect, CanvasElement, DesignTemplate, DraftItem, UserProfile } from '../../types';
import { partyLogos } from '../../data/templatesData';
import { AiSloganModal } from './AiSloganModal';
import { exportElementToPdf } from '../../utils/pdfExport';

interface CanvasEditorProps {
  initialTemplate?: DesignTemplate | null;
  initialDraft?: DraftItem | null;
  profile: UserProfile;
  onBack: () => void;
  onSaveDraft: (draftData: Partial<DraftItem>) => void;
  onSaveDownloaded: (title: string, category: string, thumbnailUrl: string) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  initialTemplate,
  initialDraft,
  profile,
  onBack,
  onSaveDraft,
  onSaveDownloaded,
}) => {
  // State
  const [aspectRatio, setAspectRatio] = useState<CanvasAspect>(
    initialDraft?.templateData.aspectRatio || initialTemplate?.aspectRatio || '3:4'
  );

  const [backgroundColor, setBackgroundColor] = useState<string>(
    initialDraft?.templateData.backgroundColor || initialTemplate?.backgroundColor || '#1B3A6B'
  );

  const [gradientBg, setGradientBg] = useState<string | undefined>(
    initialDraft?.templateData.gradientBg || initialTemplate?.gradientBg || 'linear-gradient(180deg, #1B3A6B 0%, #0F2347 100%)'
  );

  const [elements, setElements] = useState<CanvasElement[]>(
    initialDraft?.templateData.elements || initialTemplate?.elements || [
      {
        id: 'el-title-default',
        type: 'text',
        content: '॥ विकास व समृद्धी संकल्प ॥',
        x: 10,
        y: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        zIndex: 2,
      },
      {
        id: 'el-sub-default',
        type: 'text',
        content: 'सशक्त समाज, प्रगत भारत',
        x: 10,
        y: 22,
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        zIndex: 2,
      },
    ]
  );

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [includeProfileFooter, setIncludeProfileFooter] = useState<boolean>(true);
  const [footerStyle, setFooterStyle] = useState<'navy' | 'saffron' | 'glass' | 'tricolor'>('navy');
  const [activeTool, setActiveTool] = useState<'text' | 'logos' | 'ai' | 'bg' | 'frames' | 'layers' | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showShareSuccess, setShowShareSuccess] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string>("Poster Downloaded Successfully!");
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Undo/Redo stack
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Record history state
  const pushState = (newElements: CanvasElement[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newElements);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setElements(newElements);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Add text element
  const handleAddText = (textStr: string = "New Text Line") => {
    const newEl: CanvasElement = {
      id: `el-text-${Date.now()}`,
      type: 'text',
      content: textStr,
      x: 15,
      y: 35 + elements.length * 5,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      zIndex: elements.length + 1,
      visible: true,
    };
    pushState([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Add Party Logo or Badge element
  const handleAddLogoBadge = (symbol: string, color: string, label: string) => {
    const newEl: CanvasElement = {
      id: `el-badge-${Date.now()}`,
      type: 'badge',
      content: symbol,
      color: color,
      x: 40,
      y: 20,
      fontSize: 36,
      zIndex: elements.length + 1,
      visible: true,
    };
    pushState([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Upload custom photo
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const newEl: CanvasElement = {
          id: `el-img-${Date.now()}`,
          type: 'image',
          src: src,
          x: 25,
          y: 30,
          width: 50,
          height: 35,
          zIndex: elements.length + 1,
          visible: true,
        };
        pushState([...elements, newEl]);
        setSelectedElementId(newEl.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update selected element property
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    const nextEls = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, ...updates };
      }
      return el;
    });
    pushState(nextEls);
  };

  // Delete selected element
  const handleDeleteSelected = () => {
    if (!selectedElementId) return;
    const nextEls = elements.filter((el) => el.id !== selectedElementId);
    pushState(nextEls);
    setSelectedElementId(null);
  };

  // Export & Download
  const handleDownloadPoster = async (format: 'png' | 'pdf' = 'png') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      if (format === 'pdf') {
        const filename = `DesignCraft_${Date.now()}.pdf`;
        const dataUrl = await exportElementToPdf(canvasRef.current, filename);
        
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        onSaveDownloaded(
          initialTemplate?.title || "Custom Poster",
          initialTemplate?.category || "political",
          dataUrl
        );
        setExportSuccessMessage("Exported as PDF Document Successfully!");
      } else {
        const dataUrl = await toPng(canvasRef.current, { cacheBust: true, quality: 0.95 });
        const link = document.createElement('a');
        const filename = `DesignCraft_${Date.now()}.png`;
        link.download = filename;
        link.href = dataUrl;
        link.click();

        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        onSaveDownloaded(
          initialTemplate?.title || "Custom Poster",
          initialTemplate?.category || "political",
          dataUrl
        );
        setExportSuccessMessage("Exported as PNG Image Successfully!");
      }

      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 4000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Save Draft
  const handleSaveDraftAction = async () => {
    let thumbUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400";
    if (canvasRef.current) {
      try {
        thumbUrl = await toPng(canvasRef.current, { quality: 0.6 });
      } catch (e) {
        console.error("Thumb fail", e);
      }
    }

    onSaveDraft({
      id: initialDraft?.id || `draft-${Date.now()}`,
      title: initialTemplate?.title || "Custom Poster Draft",
      category: initialTemplate?.category || "political",
      lastEdited: "Just now",
      thumbnailUrl: thumbUrl,
      templateData: {
        aspectRatio,
        backgroundColor,
        gradientBg,
        elements,
      },
    });

    confetti({ particleCount: 40, spread: 40 });
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Aspect ratio styling classes
  const aspectClasses: Record<CanvasAspect, string> = {
    '3:4': 'aspect-[3/4]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-[16/9]',
    '3.5:2': 'aspect-[3.5/2]',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1D24] text-white flex flex-col justify-between overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 px-4 bg-gradient-to-r from-[#C94B4B] via-[#9E3B48] to-[#7A2B3E] border-b border-white/10 flex items-center justify-between z-10 shrink-0 text-white shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
            title="Back"
            id="editor-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 border-l border-white/20 pl-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-30 text-white transition-colors"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-30 text-white transition-colors"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-bold truncate max-w-[130px] sm:max-w-[200px] text-white">
          {initialTemplate?.title || "Poster Studio"}
        </h3>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleSaveDraftAction}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white flex items-center gap-1 border border-white/20 backdrop-blur-md transition-all active:scale-95"
            id="editor-save-draft-btn"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              id="editor-export-download-btn"
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-11 w-44 bg-[#1F2937] border border-gray-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-fadeIn">
                <button
                  onClick={() => handleDownloadPoster('pdf')}
                  id="editor-export-pdf-btn"
                  className="w-full px-3.5 py-2 text-left hover:bg-gray-700 text-amber-300 font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadPoster('png')}
                  id="editor-export-png-btn"
                  className="w-full px-3.5 py-2 text-left hover:bg-gray-700 text-gray-200 font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export as PNG Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Center Canvas Workspace */}
      <div className="flex-1 bg-[#0F172A] overflow-auto flex items-center justify-center p-4 relative">
        {/* Canvas Card */}
        <div
          ref={canvasRef}
          id="poster-canvas-export-target"
          className={`w-full max-w-[340px] sm:max-w-[400px] ${aspectClasses[aspectRatio]} relative shadow-2xl overflow-hidden rounded-xl border border-white/10 select-none`}
          style={{
            background: gradientBg || backgroundColor,
          }}
          onClick={() => setSelectedElementId(null)}
        >
          {/* Elements Rendering */}
          {elements.map((el) => {
            if (el.visible === false) return null;
            const isSelected = el.id === selectedElementId;

            if (el.type === 'text') {
              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  className={`absolute cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-[#FF6B35] ring-offset-2 ring-offset-transparent' : ''
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    color: el.color,
                    fontSize: `${el.fontSize}px`,
                    fontWeight: el.fontWeight as any,
                    textAlign: el.textAlign || 'center',
                    backgroundColor: el.backgroundColor,
                    zIndex: el.zIndex,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    width: '80%',
                    transform: 'translateX(-0%)',
                  }}
                >
                  {el.content}
                </div>
              );
            }

            if (el.type === 'badge') {
              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  className={`absolute cursor-pointer flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-[#FF6B35]' : ''
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    fontSize: `${el.fontSize}px`,
                    zIndex: el.zIndex,
                  }}
                >
                  <span>{el.content}</span>
                </div>
              );
            }

            if (el.type === 'image') {
              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  className={`absolute cursor-pointer overflow-hidden rounded-lg ${
                    isSelected ? 'ring-2 ring-[#FF6B35]' : ''
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    width: `${el.width}%`,
                    height: `${el.height}%`,
                    zIndex: el.zIndex,
                  }}
                >
                  <img src={el.src} alt="Canvas graphic" className="w-full h-full object-cover" />
                </div>
              );
            }

            return null;
          })}

          {/* User Profile Auto-Filled Footer Frame */}
          {includeProfileFooter && (
            <div
              className={`absolute bottom-0 left-0 right-0 p-3 z-30 flex items-center justify-between border-t border-white/20 ${
                footerStyle === 'navy'
                  ? 'bg-[#1B3A6B]/95 text-white'
                  : footerStyle === 'saffron'
                  ? 'bg-[#FF6B35] text-white'
                  : footerStyle === 'glass'
                  ? 'bg-black/60 backdrop-blur-md text-white'
                  : 'bg-gradient-to-r from-[#FF9933] via-white to-[#128807] text-gray-900 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50 border border-white"
                />
                <div>
                  <h4 className="text-xs font-bold leading-tight truncate max-w-[170px]">
                    {profile.name}
                  </h4>
                  <p className="text-[10px] opacity-90 truncate max-w-[170px]">
                    {profile.designation1}
                  </p>
                  <p className="text-[9px] opacity-75">{profile.contactNumber}</p>
                </div>
              </div>

              {profile.partyLogoUrl && (
                <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shrink-0 border border-gray-200">
                  <img src={profile.partyLogoUrl} alt="Party logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Element Quick Floating Inspector */}
      {selectedElement && (
        <div className="bg-gray-900 border-t border-gray-800 p-2 px-4 flex items-center justify-between text-xs text-gray-200 z-20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#FF6B35] capitalize">
              Selected ({selectedElement.type})
            </span>
            {selectedElement.type === 'text' && (
              <input
                type="text"
                value={selectedElement.content || ''}
                onChange={(e) => updateSelectedElement({ content: e.target.value })}
                className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs text-white max-w-[140px]"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedElement.color || '#FFFFFF'}
              onChange={(e) => updateSelectedElement({ color: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              title="Color"
            />
            <button
              onClick={handleDeleteSelected}
              className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tool Sheet Controller */}
      <div className="bg-[#111827] border-t border-gray-800 z-20">
        {/* Active Tool Sub-Panel */}
        {activeTool && (
          <div className="p-3 bg-gray-900 border-b border-gray-800 text-xs space-y-3 max-h-[220px] overflow-y-auto">
            {/* TEXT TOOL */}
            {activeTool === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200">Text Options</span>
                  <button onClick={() => setActiveTool(null)} className="text-gray-400">Close</button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddText("॥ वाढदिवसाच्या शुभेच्छा ॥")}
                    className="flex-1 py-1.5 rounded bg-[#1B3A6B] text-white font-medium"
                  >
                    + Marathi Greeting
                  </button>
                  <button
                    onClick={() => handleAddText("विकास संकल्प 2026")}
                    className="flex-1 py-1.5 rounded bg-[#FF6B35] text-white font-medium"
                  >
                    + Hindi Slogan
                  </button>
                </div>
              </div>
            )}

            {/* LOGOS & BADGES TOOL */}
            {activeTool === 'logos' && (
              <div className="space-y-2">
                <span className="font-semibold text-gray-200 block">Select Party Symbol or Upload Photo</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <label className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 cursor-pointer text-center text-gray-300 hover:bg-gray-700 shrink-0">
                    <span className="text-xs font-semibold">+ Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {partyLogos.map((logo, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddLogoBadge(logo.svg, logo.color, logo.label)}
                      className="p-2 rounded-xl bg-gray-800 border border-gray-700 hover:border-[#FF6B35] shrink-0 flex flex-col items-center gap-0.5"
                    >
                      <span className="text-xl">{logo.svg}</span>
                      <span className="text-[9px] text-gray-400">{logo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BACKGROUND TOOL */}
            {activeTool === 'bg' && (
              <div className="space-y-2">
                <span className="font-semibold text-gray-200 block">Poster Background Colors & Gradients</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { label: "Navy", grad: "linear-gradient(180deg, #1B3A6B 0%, #0F2347 100%)" },
                    { label: "Saffron", grad: "linear-gradient(135deg, #FF6B35 0%, #D97706 100%)" },
                    { label: "Tricolor", grad: "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)" },
                    { label: "Gold", grad: "linear-gradient(135deg, #D4AF37 0%, #85581A 100%)" },
                    { label: "Emerald", grad: "linear-gradient(135deg, #065F46 0%, #047857 100%)" },
                    { label: "Dark Royal", grad: "linear-gradient(135deg, #111827 0%, #1F2937 100%)" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGradientBg(preset.grad)}
                      className="w-12 h-12 rounded-xl border border-white/20 shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                      style={{ background: preset.grad }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTERS & FRAMES TOOL */}
            {activeTool === 'frames' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200">User Profile Footer Overlay</span>
                  <button
                    onClick={() => setIncludeProfileFooter(!includeProfileFooter)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      includeProfileFooter ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {includeProfileFooter ? 'Footer ON' : 'Footer OFF'}
                  </button>
                </div>

                {includeProfileFooter && (
                  <div className="flex gap-2 pt-1">
                    {(['navy', 'saffron', 'glass', 'tricolor'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setFooterStyle(style)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border ${
                          footerStyle === style ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF6B35]' : 'border-gray-700 bg-gray-800 text-gray-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bottom Horizontal Icon Navigation Bar */}
        <div className="flex items-center justify-around h-14 px-2">
          <button
            onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
            className={`flex flex-col items-center gap-1 text-xs ${activeTool === 'text' ? 'text-[#FF6B35]' : 'text-gray-400'}`}
          >
            <Type className="w-5 h-5" />
            <span>Text</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'logos' ? null : 'logos')}
            className={`flex flex-col items-center gap-1 text-xs ${activeTool === 'logos' ? 'text-[#FF6B35]' : 'text-gray-400'}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Logos</span>
          </button>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex flex-col items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Slogan</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'bg' ? null : 'bg')}
            className={`flex flex-col items-center gap-1 text-xs ${activeTool === 'bg' ? 'text-[#FF6B35]' : 'text-gray-400'}`}
          >
            <Palette className="w-5 h-5" />
            <span>Bg Colors</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'frames' ? null : 'frames')}
            className={`flex flex-col items-center gap-1 text-xs ${activeTool === 'frames' ? 'text-[#FF6B35]' : 'text-gray-400'}`}
          >
            <Frame className="w-5 h-5" />
            <span>Frame</span>
          </button>
        </div>
      </div>

      {/* AI Slogan Generator Modal */}
      <AiSloganModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onInsertText={(generatedText) => handleAddText(generatedText)}
        initialCategory={initialTemplate?.category || "Political Campaign"}
        initialLanguage={initialTemplate?.language || "Marathi"}
      />

      {/* Success Toast / Notification */}
      {showShareSuccess && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}
    </div>
  );
};
