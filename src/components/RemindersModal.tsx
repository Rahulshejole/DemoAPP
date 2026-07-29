import React, { useState } from 'react';
import { X, Calendar, Plus, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { EventReminder } from '../types';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: EventReminder[];
  onAddReminder: (reminder: EventReminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleAutoWish: (id: string) => void;
  onCreateWish: (reminder: EventReminder) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onToggleAutoWish,
  onCreateWish,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [personName, setPersonName] = useState('');
  const [designation, setDesignation] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'birthday' | 'anniversary' | 'festival'>('birthday');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!personName.trim()) return;
    onAddReminder({
      id: `rem-${Date.now()}`,
      personName,
      designation: designation || "Constituent Leader",
      date: date || "Upcoming",
      daysLeftText: "in 7 days",
      type,
      autoGenerateWish: true,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    });
    setPersonName('');
    setDesignation('');
    setDate('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#1B3A6B] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Birthday & Event Reminders</h3>
              <p className="text-xs text-white/80">Auto-generate wish posters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Saved Contacts & Events ({reminders.length})
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e05a2b] flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="p-3.5 rounded-xl border border-[#FF6B35] bg-amber-50/50 space-y-3">
              <h4 className="text-xs font-bold text-[#1A1D24]">New Reminder Event</h4>

              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Full Name (e.g. Ramesh ji Patil)"
                className="w-full p-2 text-xs border border-[#E4E7EC] rounded-lg bg-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Post / Designation"
                  className="w-full p-2 text-xs border border-[#E4E7EC] rounded-lg bg-white"
                />

                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date e.g. Aug 15"
                  className="w-full p-2 text-xs border border-[#E4E7EC] rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 rounded-lg bg-[#1B3A6B] text-white text-xs font-semibold"
                >
                  Save Reminder
                </button>
              </div>
            </div>
          )}

          {/* Reminders List */}
          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 rounded-2xl border border-[#E4E7EC] bg-white shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rem.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"}
                      alt={rem.personName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E4E7EC]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1D24]">{rem.personName}</h4>
                      <p className="text-[11px] text-[#6B7280]">{rem.designation}</p>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {rem.date} ({rem.daysLeftText})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E4E7EC]/60 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rem.autoGenerateWish}
                      onChange={() => onToggleAutoWish(rem.id)}
                      className="rounded text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <span className="text-[11px] text-[#6B7280]">Auto Wish Poster</span>
                  </label>

                  <button
                    onClick={() => {
                      onClose();
                      onCreateWish(rem);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#FF6B35] text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-[#e05a2b]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Create Wish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
