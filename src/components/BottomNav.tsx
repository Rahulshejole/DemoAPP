import React from 'react';
import { Home, Sparkles, FolderHeart, User, Plus } from 'lucide-react';

export type NavTab = 'home' | 'categories' | 'create' | 'my-designs' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'categories' as NavTab, label: 'Greeting', icon: Sparkles },
    { id: 'create' as NavTab, label: 'Create', icon: Plus, isFab: true },
    { id: 'my-designs' as NavTab, label: 'Political', icon: FolderHeart },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] max-w-md mx-auto sm:max-w-xl md:max-w-4xl">
      <div className="flex items-center justify-around h-15 px-3 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-4 flex flex-col items-center">
                <button
                  onClick={() => onTabChange(item.id)}
                  id="bottom-nav-fab-create"
                  className={`w-13 h-13 rounded-full bg-gradient-to-tr from-[#C94B4B] to-[#FF6B35] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 ring-4 ring-white ${
                    isActive ? 'scale-105 ring-[#C94B4B]/30' : ''
                  }`}
                  title="Create Custom Poster"
                >
                  <Plus className="w-7 h-7 text-white stroke-[2.5]" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              id={`bottom-nav-tab-${item.id}`}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#C94B4B] bg-rose-50/80 font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'fill-current stroke-[2] scale-110' : 'stroke-[1.6]'}`} />
              {isActive ? (
                <span className="text-[10px] mt-0.5 font-bold tracking-tight text-[#C94B4B]">
                  {item.label}
                </span>
              ) : (
                <span className="text-[10px] mt-0.5 font-normal text-gray-400 hidden xs:inline">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

