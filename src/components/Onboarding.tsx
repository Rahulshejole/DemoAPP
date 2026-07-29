import React, { useState, useEffect } from 'react';
import { Vote, Briefcase, CalendarCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      icon: Vote,
      title: "Create Political Posters in Seconds",
      description: "Custom rally banners, leader birthday wishes, election campaign templates auto-filled with your party logo and photo.",
      accentBg: "bg-[#1B3A6B]",
      accentText: "text-[#1B3A6B]",
      tag: "POLITICAL STUDIO",
    },
    {
      icon: Briefcase,
      title: "Business Greetings & Festive Offers",
      description: "Elevate your brand with professional grand opening posters, discount banners, and digital visiting cards.",
      accentBg: "bg-[#FF6B35]",
      accentText: "text-[#FF6B35]",
      tag: "BUSINESS PROMO",
    },
    {
      icon: CalendarCheck,
      title: "Auto Birthday & Event Reminders",
      description: "Set reminders for key constituents & partners. Auto-generate personalized wishes in Marathi, Hindi & English.",
      accentBg: "bg-[#2E9E5B]",
      accentText: "text-[#2E9E5B]",
      tag: "SMART REMINDERS",
    },
  ];

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1B3A6B] via-[#0F2347] to-[#0A1830] text-white p-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
          <Vote className="w-10 h-10 text-[#FF6B35]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-center">PosterForge</h1>
        <p className="text-sm font-medium text-slate-300 mt-2 text-center max-w-xs">
          Political & Business Graphic Studio
        </p>
        <div className="mt-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-amber-300 border border-white/10">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          100% Clean • Ad-Free Editorial Layout
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F8FA] flex flex-col justify-between p-6 max-w-md mx-auto sm:max-w-xl">
      {/* Top Header with Skip */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold tracking-wider uppercase text-[#FF6B35]">
          {slide.tag}
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#1A1D24] px-3 py-1.5 rounded-full border border-[#E4E7EC] bg-white shadow-2xs"
          id="onboarding-skip-btn"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 text-center px-2">
        <div className={`w-28 h-28 rounded-3xl ${slide.accentBg} text-white flex items-center justify-center shadow-xl mb-8 transform transition-all duration-300 scale-100`}>
          <SlideIcon className="w-14 h-14" />
        </div>

        <h2 className="text-2xl font-bold text-[#1A1D24] mb-3 leading-snug">
          {slide.title}
        </h2>

        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
          {slide.description}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="pb-6">
        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#FF6B35]' : 'w-2 bg-[#E4E7EC]'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          id="onboarding-next-btn"
          className="w-full h-12 rounded-xl bg-[#FF6B35] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#e05a2b] transition-colors active:scale-98"
        >
          <span>{currentSlide === slides.length - 1 ? "Get Started" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
