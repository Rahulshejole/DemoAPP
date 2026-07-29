import React from 'react';
import { X, Bell, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { EventReminder } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: EventReminder[];
  onCreateWish: (reminder: EventReminder) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onCreateWish,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center text-[#1B3A6B]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1A1D24]">Notifications</h3>
              <p className="text-xs text-[#6B7280]">Upcoming Birthdays & Events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-[#6B7280]"
            id="notification-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            <span>Reminders Today & Tomorrow</span>
            <span className="text-[#FF6B35]">{reminders.length} Active</span>
          </div>

          {reminders.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-[#E4E7EC] bg-white hover:border-[#1B3A6B]/30 transition-all flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={item.personName}
                  className="w-11 h-11 rounded-full object-cover border border-[#E4E7EC]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1D24]">{item.personName}</h4>
                  <p className="text-xs text-[#6B7280]">{item.designation}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date} ({item.daysLeftText})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCreateWish(item);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FF6B35] text-white text-xs font-medium hover:bg-[#e05a2b] transition-colors flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Wish</span>
              </button>
            </div>
          ))}

          {/* System Announcement */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#1B3A6B]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ad-Free Editorial Guarantee</span>
            </div>
            <p className="text-[#6B7280]">
              DesignCraft is completely ad-free. Enjoy instant canvas editing with pre-filled party logos and profile details.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E4E7EC] bg-[#F7F8FA] text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#1B3A6B] text-white text-xs font-medium hover:bg-[#152e55]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
