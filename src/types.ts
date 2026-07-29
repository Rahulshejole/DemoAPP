export type CanvasAspect = '3:4' | '1:1' | '9:16' | '16:9' | '3.5:2';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'badge' | 'shape' | 'footer';
  content?: string;
  src?: string;
  x: number; // percentage or px
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  rotation?: number;
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: 'political' | 'business' | 'quotes' | 'special';
  subCategory: string;
  language: 'Marathi' | 'Hindi' | 'English';
  aspectRatio: CanvasAspect;
  isPro?: boolean;
  previewUrl: string;
  tags: string[];
  backgroundColor: string;
  gradientBg?: string;
  elements: CanvasElement[];
  partyThemeColor?: string;
}

export interface UserProfile {
  name: string;
  designation1: string; // Elected post / Ward / Constituency / Business Title
  designation2: string; // Secondary role / Committee / Dept
  contactNumber: string;
  email: string;
  address: string;
  registrationNo: string; // Ward No / Business Reg No
  avatarUrl: string;
  partyLogoUrl: string;
  partyName: string;
  primaryBrandColor: string; // Hex e.g. #1B3A6B or #FF7A1A
  secondaryBrandColor: string;
  preferredLanguage: 'Marathi' | 'Hindi' | 'English';
  socialLinks: {
    instagram: string;
    twitter: string;
    whatsapp: string;
    facebook: string;
    mapLocation: string;
  };
}

export interface DraftItem {
  id: string;
  title: string;
  category: string;
  lastEdited: string;
  thumbnailUrl: string;
  templateData: {
    aspectRatio: CanvasAspect;
    backgroundColor: string;
    gradientBg?: string;
    elements: CanvasElement[];
  };
}

export interface DownloadedItem {
  id: string;
  title: string;
  downloadedAt: string;
  thumbnailUrl: string;
  category: string;
}

export interface EventReminder {
  id: string;
  type: 'birthday' | 'anniversary' | 'festival' | 'rally';
  personName: string;
  designation?: string;
  date: string; // YYYY-MM-DD or readable
  daysLeftText: string;
  avatarUrl?: string;
  autoGenerateWish: boolean;
  notes?: string;
}

export interface CategoryCard {
  id: string;
  title: string;
  description: string;
  categoryKey: 'political' | 'business' | 'quotes' | 'special';
  bgColor: string; // Tailwind class or hex
  iconColor: string;
  iconName: string;
  subCategories: string[];
}
