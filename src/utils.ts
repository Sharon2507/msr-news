
import type { Language } from './types';
import { T } from './data';

// --------------------------------------------------
// TRANSLATION
// --------------------------------------------------

export function tr(lang: Language, key: string): string {
  return T[lang]?.[key] ?? T.en?.[key] ?? key;
}

// --------------------------------------------------
// LOCALE
// --------------------------------------------------

export function getLocale(lang: Language): string {
  const locales: Record<Language, string> = {
    en: 'en-IN',
    te: 'te-IN',
    hi: 'hi-IN',
  };

  return locales[lang];
}

// --------------------------------------------------
// DATE FORMAT
// --------------------------------------------------

export function formatDate(
  iso: string,
  lang: Language = 'en'
): string {
  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) return iso;

  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  try {
    return d.toLocaleDateString(getLocale(lang), opts);
  } catch {
    return d.toDateString();
  }
}

// --------------------------------------------------
// DATE AND TIME FORMAT
// --------------------------------------------------

export function formatDateTime(
  iso: string,
  lang: Language = 'en'
): string {
  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) return iso;

  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  try {
    return d.toLocaleString(getLocale(lang), opts);
  } catch {
    return d.toLocaleString();
  }
}

// --------------------------------------------------
// TIME AGO
// --------------------------------------------------

export function timeAgo(
  iso: string,
  lang: Language = 'en'
): string {
  const diff = Date.now() - new Date(iso).getTime();

  if (Number.isNaN(diff)) return '';

  const mins = Math.max(0, Math.floor(diff / 60000));

  if (lang === 'te') {
    if (mins < 1) return 'ఇప్పుడే';
    if (mins < 60) return `${mins} నిమిషాల క్రితం`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} గంటల క్రితం`;

    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} రోజుల క్రితం`;
  }

  if (lang === 'hi') {
    if (mins < 1) return 'अभी-अभी';
    if (mins < 60) return `${mins} मिनट पहले`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} घंटे पहले`;

    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} दिन पहले`;
  }

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(iso, lang);
}

// --------------------------------------------------
// FILE READER
// --------------------------------------------------

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ''));
}

// --------------------------------------------------
// LANGUAGE LABELS
// --------------------------------------------------

export const LANG_LABELS: Record<Language, string> = {
  en: 'English',
  te: 'తెలుగు',
  hi: 'हिन्दी',
};
