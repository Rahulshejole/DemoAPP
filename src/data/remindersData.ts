import { EventReminder } from '../types';

export const initialReminders: EventReminder[] = [
  {
    id: "rem-1",
    type: "birthday",
    personName: "Hon. Ramesh Ji Kadam",
    designation: "District President & Social Leader",
    date: "Tomorrow, July 29",
    daysLeftText: "Tomorrow",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    autoGenerateWish: true,
    notes: "Send personalized birthday wish poster with constituency photo.",
  },
  {
    id: "rem-2",
    type: "festival",
    personName: "Independence Day Celebrations",
    designation: "National Event",
    date: "Aug 15, 2026",
    daysLeftText: "in 18 days",
    avatarUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=200&auto=format&fit=crop&q=80",
    autoGenerateWish: true,
    notes: "Tricolor flag hoisting invitation & greeting banner.",
  },
  {
    id: "rem-3",
    type: "anniversary",
    personName: "Apex Retailers Association",
    designation: "5th Business Anniversary",
    date: "Aug 02, 2026",
    daysLeftText: "in 5 days",
    avatarUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&auto=format&fit=crop&q=80",
    autoGenerateWish: false,
    notes: "Discount & offer promo poster.",
  },
];
