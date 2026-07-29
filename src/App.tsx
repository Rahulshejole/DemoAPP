/**
 * DesignCraft - Poster Studio
 * Ad-Free, Modern Editorial Redesign Application
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { NotificationModal } from './components/NotificationModal';
import { HomeTab } from './components/HomeTab';
import { CategoriesTab } from './components/CategoriesTab';
import { CanvasEditor } from './components/Editor/CanvasEditor';
import { MyDesignsTab } from './components/MyDesignsTab';
import { ProfileTab } from './components/ProfileTab';
import { RemindersModal } from './components/RemindersModal';
import { DigitalCardModal } from './components/DigitalCardModal';

import { initialProfile } from './data/initialProfile';
import { initialReminders } from './data/remindersData';
import { sampleTemplates } from './data/templatesData';
import { UserProfile, DraftItem, DownloadedItem, EventReminder, DesignTemplate } from './types';
import { exportFullProjectDossierToPdf } from './utils/pdfExport';

export default function App() {
  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('politcraft_onboarding_done') !== 'true';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('politcraft_user_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  // Drafts
  const [drafts, setDrafts] = useState<DraftItem[]>(() => {
    const saved = localStorage.getItem('politcraft_drafts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "draft-sample-1",
        title: "Leader Birthday Wish Draft",
        category: "political",
        lastEdited: "10 mins ago",
        thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
        templateData: {
          aspectRatio: "3:4",
          backgroundColor: "#1B3A6B",
          gradientBg: "linear-gradient(180deg, #1B3A6B 0%, #0F2347 100%)",
          elements: [
            {
              id: "el-1",
              type: "text",
              content: "॥ वाढदिवसाच्या हार्दिक शुभेच्छा ॥",
              x: 10,
              y: 8,
              fontSize: 22,
              fontWeight: "bold",
              color: "#FFD700",
              textAlign: "center",
              zIndex: 2,
            },
            {
              id: "el-2",
              type: "text",
              content: "लोकप्रिय नेतृत्व व जनसेवक",
              x: 10,
              y: 20,
              fontSize: 16,
              color: "#FFFFFF",
              textAlign: "center",
              zIndex: 2,
            },
          ],
        },
      },
    ];
  });

  // Downloaded Posters
  const [downloaded, setDownloaded] = useState<DownloadedItem[]>(() => {
    const saved = localStorage.getItem('politcraft_downloaded');
    return saved ? JSON.parse(saved) : [];
  });

  // Reminders
  const [reminders, setReminders] = useState<EventReminder[]>(() => {
    const saved = localStorage.getItem('politcraft_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('politcraft_favorites');
    return saved ? JSON.parse(saved) : ["tpl-pol-1", "tpl-biz-1"];
  });

  // Editor states
  const [activeEditorTemplate, setActiveEditorTemplate] = useState<DesignTemplate | null>(null);
  const [activeEditorDraft, setActiveEditorDraft] = useState<DraftItem | null>(null);

  // Modals
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isDigitalCardOpen, setIsDigitalCardOpen] = useState(false);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('politcraft_user_profile', JSON.stringify(profile));
  }, [profile]);

  // Save drafts
  useEffect(() => {
    localStorage.setItem('politcraft_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Save downloaded
  useEffect(() => {
    localStorage.setItem('politcraft_downloaded', JSON.stringify(downloaded));
  }, [downloaded]);

  // Save reminders
  useEffect(() => {
    localStorage.setItem('politcraft_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('politcraft_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('politcraft_onboarding_done', 'true');
    setShowOnboarding(false);
  };

  const handleToggleFavorite = (templateId: string) => {
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter((id) => id !== templateId));
    } else {
      setFavorites([...favorites, templateId]);
    }
  };

  const handleSelectTemplateForEditor = (template: DesignTemplate) => {
    setActiveEditorTemplate(template);
    setActiveEditorDraft(null);
    setActiveTab('create');
  };

  const handleOpenDraftForEditor = (draft: DraftItem) => {
    setActiveEditorDraft(draft);
    setActiveEditorTemplate(null);
    setActiveTab('create');
  };

  const handleSaveDraft = (draftData: Partial<DraftItem>) => {
    const exists = drafts.find((d) => d.id === draftData.id);
    if (exists) {
      setDrafts(drafts.map((d) => (d.id === draftData.id ? { ...d, ...draftData } as DraftItem : d)));
    } else {
      setDrafts([draftData as DraftItem, ...drafts]);
    }
  };

  const handleSaveDownloaded = (title: string, category: string, thumbnailUrl: string) => {
    const newItem: DownloadedItem = {
      id: `dl-${Date.now()}`,
      title,
      category,
      downloadedAt: "Just now",
      thumbnailUrl,
    };
    setDownloaded([newItem, ...downloaded]);
  };

  const handleCreateWishFromReminder = (reminder: EventReminder) => {
    const wishTemplate: DesignTemplate = {
      id: `wish-${reminder.id}`,
      title: `${reminder.personName} Wish Poster`,
      category: "political",
      subCategory: "Leader Wishes",
      language: "Marathi",
      aspectRatio: "3:4",
      previewUrl: reminder.avatarUrl || "",
      tags: ["Wish", reminder.personName],
      backgroundColor: "#1B3A6B",
      gradientBg: "linear-gradient(180deg, #1B3A6B 0%, #0F2347 100%)",
      elements: [
        {
          id: "w-header",
          type: "text",
          content: "॥ वाढदिवसाच्या हार्दिक शुभेच्छा ॥",
          x: 10,
          y: 8,
          fontSize: 22,
          fontWeight: "bold",
          color: "#FFD700",
          textAlign: "center",
          zIndex: 2,
        },
        {
          id: "w-name",
          type: "text",
          content: reminder.personName,
          x: 10,
          y: 20,
          fontSize: 26,
          fontWeight: "bold",
          color: "#FF6B35",
          textAlign: "center",
          zIndex: 2,
        },
        {
          id: "w-desig",
          type: "text",
          content: reminder.designation || "जनसेवक व सामाजिक नेते",
          x: 10,
          y: 30,
          fontSize: 14,
          color: "#FFFFFF",
          textAlign: "center",
          zIndex: 2,
        },
      ],
    };
    handleSelectTemplateForEditor(wishTemplate);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleFinishOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1D24] antialiased select-none font-sans">
      {/* Header (Hidden when inside full-screen canvas editor tab) */}
      {activeTab !== 'create' && (
        <Header
          profile={profile}
          unreadNotificationsCount={reminders.length}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          onExportFullProjectPdf={() => exportFullProjectDossierToPdf({ profile, drafts, downloaded, reminders })}
        />
      )}

      {/* Root Tab Content */}
      <main className="w-full">
        {activeTab === 'home' && (
          <HomeTab
            profile={profile}
            templates={sampleTemplates}
            drafts={drafts}
            reminders={reminders}
            favorites={favorites}
            onSelectTemplate={handleSelectTemplateForEditor}
            onOpenDraft={handleOpenDraftForEditor}
            onToggleFavorite={handleToggleFavorite}
            onSelectCategory={() => setActiveTab('categories')}
            onCreateWishFromReminder={handleCreateWishFromReminder}
            onOpenSeeAllTemplates={() => setActiveTab('categories')}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            onSelectTemplate={handleSelectTemplateForEditor}
            onOpenQuickTool={() => {
              handleSelectTemplateForEditor(sampleTemplates[0]);
            }}
          />
        )}

        {activeTab === 'create' && (
          <CanvasEditor
            initialTemplate={activeEditorTemplate}
            initialDraft={activeEditorDraft}
            profile={profile}
            onBack={() => setActiveTab('home')}
            onSaveDraft={handleSaveDraft}
            onSaveDownloaded={handleSaveDownloaded}
          />
        )}

        {activeTab === 'my-designs' && (
          <MyDesignsTab
            drafts={drafts}
            downloaded={downloaded}
            favorites={favorites}
            templates={sampleTemplates}
            onOpenDraft={handleOpenDraftForEditor}
            onDeleteDraft={(id) => setDrafts(drafts.filter((d) => d.id !== id))}
            onSelectTemplate={handleSelectTemplateForEditor}
            onOpenCreateNew={() => {
              setActiveEditorTemplate(sampleTemplates[0]);
              setActiveEditorDraft(null);
              setActiveTab('create');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
            onExportDigitalCard={() => setIsDigitalCardOpen(true)}
            onOpenRemindersManager={() => setIsRemindersOpen(true)}
            onExportFullProjectPdf={() => exportFullProjectDossierToPdf({ profile, drafts, downloaded, reminders })}
          />
        )}
      </main>

      {/* Bottom Navigation (Hidden when in Canvas Editor) */}
      {activeTab !== 'create' && (
        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      )}

      {/* Global Modals */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        reminders={reminders}
        onCreateWish={handleCreateWishFromReminder}
      />

      <RemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        reminders={reminders}
        onAddReminder={(rem) => setReminders([...reminders, rem])}
        onDeleteReminder={(id) => setReminders(reminders.filter((r) => r.id !== id))}
        onToggleAutoWish={(id) =>
          setReminders(
            reminders.map((r) => (r.id === id ? { ...r, autoGenerateWish: !r.autoGenerateWish } : r))
          )
        }
        onCreateWish={handleCreateWishFromReminder}
      />

      <DigitalCardModal
        isOpen={isDigitalCardOpen}
        onClose={() => setIsDigitalCardOpen(false)}
        profile={profile}
      />
    </div>
  );
}
