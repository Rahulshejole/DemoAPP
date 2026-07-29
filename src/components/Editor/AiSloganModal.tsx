import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, PlusCircle, Check } from 'lucide-react';

interface AiSloganModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
  initialCategory?: string;
  initialLanguage?: 'Marathi' | 'Hindi' | 'English';
}

export const AiSloganModal: React.FC<AiSloganModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  initialCategory = "Political Campaign",
  initialLanguage = "Marathi",
}) => {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<'Marathi' | 'Hindi' | 'English'>(initialLanguage);
  const [category, setCategory] = useState(initialCategory);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slogans, setSlogans] = useState<string[]>([
    "विकास हेच आमचे उत्तर - समृद्ध आणि प्रगत मतदारसंघाचा संकल्प!",
    "जनसेवा हीच ईश्वरसेवा - तुमच्या विश्वासाला आमचा प्रणाम!",
    "नवा विचार, नवा विश्वास - चला घडवूया प्रगतीचा इतिहास!",
    "सशक्त युवा, समृद्ध व्यापार - हर कदम आपके साथ!",
  ]);

  if (!isOpen) return null;

  const fallbackSlogans: Record<string, Record<string, string[]>> = {
    "Political Campaign": {
      Hindi: [
        "विकास ही हमारा संकल्प है - समृद्ध और सशक्त क्षेत्र का निर्माण!",
        "जन सेवा ही सर्वोपरि - आपकी प्रगति, हमारा ध्येय!",
        "एकता, उन्नति और विश्वास - मिलकर बनाएंगे बेहतर कल!",
        "सशक्त युवा, समृद्ध भारत - हर कदम आपके साथ!",
        "नया सवेरा, नई उम्मीद - विकास की राह पर साथ चलें!",
      ],
      Marathi: [
        "विकास हेच आमचे उत्तर - समृद्ध आणि प्रगत मतदारसंघाचा संकल्प!",
        "जनसेवा हीच ईश्वरसेवा - तुमच्या विश्वासाला आमचा प्रणाम!",
        "नवा विचार, नवा विश्वास - चला घडवूया प्रगतीचा इतिहास!",
        "आपला माणूस, आपला हक्काचा विकास!",
        "सशक्त महाराष्ट्र, समृद्ध भारत - आमचा संकल्प!",
      ],
      English: [
        "Leadership through Progress, Prosperity through Unity!",
        "Dedicated to Public Service & Community Upliftment!",
        "Building a Brighter, Stronger Tomorrow Together!",
        "Your Trust is Our Commitment to Excellence!",
        "Progress for All, Development for Every Home!",
      ],
    },
    "Leader Birthday": {
      Hindi: [
        "जन्मदिन की हार्दिक शुभकामनाएं - आपका मार्गदर्शन हमारी प्रेरणा!",
        "बहुत बहुत बधाई हो - आपके नेतृत्व में आगे बढ़ता रहे क्षेत्र!",
        "दीर्घायु हों, स्वस्थ रहें - जनता की दुआएं आपके साथ!",
        "जन्मदिन मुबारक हो - आप हमारे प्रेरणास्रोत हैं!",
        "हार्दिक अभिनंदन - आपकी सेवा का ऋण कभी नहीं उतरेगा!",
      ],
      Marathi: [
        "वाढदिवसाच्या हार्दिक शुभेच्छा - आपले नेतृत्व आमची प्रेरणा!",
        "दीर्घायुरोग्य लाभो - आपल्या सेवेस सलाम!",
        "शतायुषी व्हा - जनतेच्या मनात आपले स्थान अढळ!",
        "वाढदिवस मुबारक - आपले कार्य अजरामर राहील!",
        "अनेक शुभेच्छा - आपल्या नेतृत्वाने क्षेत्र समृद्ध झाले!",
      ],
      English: [
        "Wishing Many Happy Returns of the Day to Our Beloved Leader!",
        "May Your Leadership Continue to Inspire Thousands!",
        "Happy Birthday - Your Dedication to Public Service is Unmatched!",
        "A Leader, A Visionary, A Inspiration - Happy Birthday!",
        "Heartiest Wishes on Your Special Day - Keep Serving with Dedication!",
      ],
    },
    "Business Offer": {
      Hindi: [
        "महा सेल - अभी खरीदें और 50% तक बचाएं!",
        "सीमित समय का ऑफर - आज ही का फायदा उठाएं!",
        "हमारी गुणवत्ता, आपका विश्वास - खरीदारी का सबसे अच्छा मौका!",
        "विशेष छूट सिर्फ आपके लिए - जल्दी करें स्टॉक सीमित है!",
        "बेस्ट डील, बेस्ट प्राइस - आपकी खुशी हमारी प्राथमिकता!",
      ],
      Marathi: [
        "महा सेल - आताच खरेदी करा आणि ५०% पर्यंत वाचवा!",
        "मर्यादित वेळाची ऑफर - आजच फायदा घ्या!",
        "आमची गुणवत्ता, तुमचा विश्वास - खरेदीची सर्वोत्तम संधी!",
        "विशेष सूट फक्त तुमच्यासाठी - लवकर करा स्टॉक मर्यादित!",
        "बेस्ट डील, बेस्ट किंमत - तुमचा आनंद आमची प्राथमिकता!",
      ],
      English: [
        "Mega Sale - Up to 50% Off on All Products!",
        "Limited Time Offer - Grab the Best Deals Today!",
        "Quality You Trust, Prices You Love - Shop Now!",
        "Exclusive Discount Just for You - Hurry, Limited Stock!",
        "Best Deal, Best Price - Your Satisfaction is Our Priority!",
      ],
    },
    "Festival Greeting": {
      Hindi: [
        "दीपावली की हार्दिक शुभकामनाएं - खुशियों और समृद्धि का त्योहार!",
        "आप सभी को त्योहार की ढेर सारी शुभकामनाएं!",
        "नए साल की शुभकामनाएं - नई उम्मीदें, नई खुशियां!",
        "पर्व की बधाई - आपका जीवन सदा खुशहाल रहे!",
        "हर त्योहार लाए खुशियां - आपके परिवार को हार्दिक शुभकामनाएं!",
      ],
      Marathi: [
        "दिवाळीच्या हार्दिक शुभेच्छा - आनंद आणि समृद्धीचा सण!",
        "सर्वांना सणाच्या खूप शुभेच्छा!",
        "नवीन वर्षाच्या शुभेच्छा - नव्या आशा, नव्या खुशी!",
        "उत्सवाच्या शुभेच्छा - तुमचे जीवन सदा आनंदी राहो!",
        "प्रत्येक सण आनंद घेऊन येवो - तुमच्या परिवाराला हार्दिक शुभेच्छा!",
      ],
      English: [
        "Wishing You a Joyful and Prosperous Festival Season!",
        "Heartiest Greetings on This Auspicious Occasion!",
        "May This Festival Bring Joy, Peace & Prosperity to All!",
        "Happy Celebrations - May Every Moment Be Filled with Happiness!",
        "Season's Greetings to You and Your Family!",
      ],
    },
    "Motivational Quote": {
      Hindi: [
        "सफलता उसे मिलती है जो कोशिश करना नहीं छोड़ता!",
        "हर मुश्किल एक नए अवसर की शुरुआत है!",
        "जीत उसकी होती है जो हार मानना नहीं जानता!",
        "सपने वो नहीं जो सोने में आएं, सपने वो हैं जो सोने न दें!",
        "एक कदम आगे बढ़ाओ, मंजिल खुद चली आएगी!",
      ],
      Marathi: [
        "यश त्यालाच मिळते जो प्रयत्न सोडत नाही!",
        "प्रत्येक अडचण नव्या संधीची सुरुवात आहे!",
        "जिंकतो तो ज्याला हार माहीत नाही!",
        "स्वप्ने ती नाहीत जी झोपेत पडतात, स्वप्ने ती आहेत जी झोपू देत नाहीत!",
        "एक पाऊल पुढे टाका, ध्येय स्वतः येईल!",
      ],
      English: [
        "Success Belongs to Those Who Never Stop Trying!",
        "Every Challenge is the Beginning of a New Opportunity!",
        "Winners Never Quit, Quitters Never Win!",
        "Dream Big, Work Hard, Stay Focused and Never Give Up!",
        "One Step Forward Every Day Leads to Great Achievements!",
      ],
    },
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const categoryData = fallbackSlogans[category] || fallbackSlogans["Political Campaign"];
      const langData = categoryData[language] || categoryData["English"];
      setSlogans(langData);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-gradient-to-r from-[#1B3A6B] to-[#3D5A99] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold">AI Slogan & Quote Assistant</h3>
              <p className="text-xs text-white/80">Gemini-powered text writer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1A1D24] block mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-2 text-xs border border-[#E4E7EC] rounded-xl bg-white focus:ring-2 focus:ring-[#1B3A6B]/30"
              >
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1A1D24] block mb-1">Studio Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-xs border border-[#E4E7EC] rounded-xl bg-white focus:ring-2 focus:ring-[#1B3A6B]/30"
              >
                <option value="Political Campaign">Political Campaign</option>
                <option value="Leader Birthday">Leader Birthday Wish</option>
                <option value="Business Offer">Business Offer & Sale</option>
                <option value="Festival Greeting">Festival Greeting</option>
                <option value="Motivational Quote">Motivational Quote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1A1D24] block mb-1">
              Custom Topic / Ward / Focus (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ward 14 Road Development, Diwali Discount 20%..."
              className="w-full p-2.5 text-xs border border-[#E4E7EC] rounded-xl bg-white focus:ring-2 focus:ring-[#1B3A6B]/30"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            id="ai-slogan-generate-btn"
            className="w-full py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e05a2b] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Slogans with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Slogans</span>
              </>
            )}
          </button>

          {/* Slogan Options List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
              Click to insert onto poster canvas:
            </span>

            {slogans.map((sloganText, index) => (
              <div
                key={index}
                onClick={() => {
                  onInsertText(sloganText);
                  onClose();
                }}
                className="p-3 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] hover:bg-white hover:border-[#1B3A6B] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <p className="text-xs font-medium text-[#1A1D24] leading-relaxed">
                  “{sloganText}”
                </p>
                <button className="px-2.5 py-1 rounded-lg bg-[#1B3A6B] text-white text-[11px] font-semibold opacity-90 group-hover:opacity-100 shrink-0 flex items-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
