import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { UserProfile, DraftItem, DownloadedItem, EventReminder } from '../types';

/**
 * Converts a DOM element into a PDF file download.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = `PosterForge_Design_${Date.now()}.pdf`
): Promise<string> {
  // Capture high-quality PNG
  const dataUrl = await toPng(element, { cacheBust: true, quality: 0.98 });

  // Load image to get native pixel dimensions
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const width = img.width;
  const height = img.height;
  const orientation = width > height ? 'landscape' : 'portrait';

  // Create PDF with identical pixel dimensions
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(filename);

  return dataUrl;
}

/**
 * Converts an image Data URL to a PDF file download.
 */
export async function exportImageToPdf(
  dataUrl: string,
  filename: string = `PosterForge_Design_${Date.now()}.pdf`
): Promise<void> {
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const width = img.width;
  const height = img.height;
  const orientation = width > height ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(filename);
}

/**
 * Generates and downloads a complete multi-page PDF Dossier of the entire PosterForge Project.
 */
export async function exportFullProjectDossierToPdf(data: {
  profile: UserProfile;
  drafts: DraftItem[];
  downloaded: DownloadedItem[];
  reminders: EventReminder[];
}): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { profile, drafts, downloaded, reminders } = data;
  const timestamp = new Date().toLocaleString('en-IN');

  // Colors
  const primaryColor = [27, 58, 107]; // Navy #1B3A6B
  const accentColor = [255, 107, 53]; // Orange #FF6B35
  const darkText = [31, 41, 55]; // Gray-800
  const lightBg = [247, 248, 250];

  // PAGE 1: COVER & LEADER DOSSIER
  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PosterForge Project Portfolio', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Full Project & Leader Profile Dossier • Exported PDF', 14, 28);
  doc.text(`Generated: ${timestamp}`, 130, 28);

  // Section 1: Leader Profile & Personal Information
  let y = 48;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, y, 186, 76, 4, 4, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Leader Identity & Personal Information', 18, y + 10);

  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const fields = [
    { label: 'Name:', val: profile.name || 'N/A' },
    { label: 'Designation / Post:', val: profile.designation1 || 'N/A' },
    { label: 'Secondary Title:', val: profile.designation2 || 'N/A' },
    { label: 'Contact Number:', val: profile.contactNumber || 'N/A' },
    { label: 'Address:', val: profile.address || 'N/A' },
    { label: 'Party / Ward / Reg. No:', val: profile.registrationNo || 'N/A' },
    { label: 'Preferred Language:', val: profile.preferredLanguage || 'English' },
    { label: 'Email / Handle:', val: profile.email || 'N/A' },
  ];

  let fy = y + 20;
  fields.forEach((f, idx) => {
    const col = idx % 2 === 0 ? 18 : 108;
    if (idx % 2 === 0 && idx > 0) fy += 12;

    doc.setFont('helvetica', 'bold');
    doc.text(f.label, col, fy);
    doc.setFont('helvetica', 'normal');
    doc.text(f.val, col + 38, fy);
  });

  // Section 2: Social Media Handles
  y = 132;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, y, 186, 32, 4, 4, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Social Handles & Links', 18, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Instagram: ${profile.socialLinks.instagram}`, 18, y + 18);
  doc.text(`Twitter / X: ${profile.socialLinks.twitter}`, 108, y + 18);
  doc.text(`WhatsApp: ${profile.socialLinks.whatsapp}`, 18, y + 25);
  doc.text(`Facebook: ${profile.socialLinks.facebook}`, 108, y + 25);

  // Section 3: Saved Drafts Summary
  y = 172;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, y, 186, 50, 4, 4, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`3. Saved Project Drafts (${drafts.length})`, 18, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  if (drafts.length === 0) {
    doc.text('No active drafts saved.', 18, y + 20);
  } else {
    drafts.slice(0, 4).forEach((draft, idx) => {
      const dy = y + 20 + idx * 7;
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${draft.title}`, 18, dy);
      doc.setFont('helvetica', 'normal');
      doc.text(`(${draft.category} • Edited: ${draft.lastEdited})`, 100, dy);
    });
  }

  // Section 4: Downloaded Posters History
  y = 230;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, y, 186, 50, 4, 4, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`4. Downloaded Poster History (${downloaded.length})`, 18, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  if (downloaded.length === 0) {
    doc.text('No posters downloaded yet.', 18, y + 20);
  } else {
    downloaded.slice(0, 4).forEach((dl, idx) => {
      const dly = y + 20 + idx * 7;
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${dl.title}`, 18, dly);
      doc.setFont('helvetica', 'normal');
      doc.text(`(${dl.category} • ${dl.downloadedAt})`, 100, dly);
    });
  }

  // PAGE 2: EVENT REMINDERS & PROJECT SUMMARY
  doc.addPage();

  // Page 2 Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Event & Birthday Reminders Schedule', 14, 16);

  y = 34;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, y, 186, 110, 4, 4, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`5. Active Reminders & Contacts (${reminders.length})`, 18, y + 12);

  doc.setFontSize(9);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  reminders.forEach((rem, idx) => {
    const ry = y + 24 + idx * 12;
    if (ry < 135) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${rem.personName}`, 18, ry);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${rem.date} | Type: ${rem.type} | Auto Wish: ${rem.autoGenerateWish ? 'ON' : 'OFF'}`, 75, ry);
      doc.text(`Designation: ${rem.designation || 'Leader'}`, 18, ry + 5);
    }
  });

  // Footer
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PosterForge — Complete Poster Studio', 14, 290);

  doc.save(`PosterForge_Full_Project_${Date.now()}.pdf`);
}

