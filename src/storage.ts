import type { Article, Language, ArticleStatus } from './types';
import { SAMPLE_ARTICLES, sampleNotifications } from './data';

const PREFIX = 'msrnews_';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  preferredLanguage: Language;
  photo?: string;
}

export interface ReporterAccount {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  reporterId: string;
  idDocumentName?: string;
  idDocumentPreview?: string;
  photo?: string;
  address: string;
  district: string;
  verificationStatus: 'Pending Verification' | 'Under Review' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  articleId?: string;
}

export interface NewsSubmission {
  id: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  location: string;
  district: string;
  language: Language;
  image?: string;
  videoName?: string;
  reporterId: string;
  reporterName: string;
  date: string;
  status: ArticleStatus;
  isDraft: boolean;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

// Articles: merge sample articles with any reporter-published submissions
export function loadArticles(): Article[] {
  const custom = read<Article[]>(`articles`, []);
  const base = [...SAMPLE_ARTICLES];
  const merged: Article[] = [...base];
  custom.forEach((c) => {
    if (!merged.some((m) => m.id === c.id)) merged.push(c);
  });
  return merged;
}

export function saveCustomArticle(a: Article): void {
  const custom = read<Article[]>(`articles`, []);
  const idx = custom.findIndex((x) => x.id === a.id);
  if (idx >= 0) custom[idx] = a;
  else custom.push(a);
  write(`articles`, custom);
}

// Users
export function loadUsers(): UserAccount[] {
  return read<UserAccount[]>(`users`, []);
}
export function saveUsers(users: UserAccount[]): void {
  write(`users`, users);
}
export function addUser(u: UserAccount): void {
  const users = loadUsers();
  users.push(u);
  saveUsers(users);
}
export function updateUser(u: UserAccount): void {
  const users = loadUsers();
  const idx = users.findIndex((x) => x.id === u.id);
  if (idx >= 0) users[idx] = u;
  else users.push(u);
  saveUsers(users);
}

// Reporters
export function loadReporters(): ReporterAccount[] {
  // Seed a demo approved reporter on first load
  const existing = read<ReporterAccount[] | null>(`reporters`, null);
  if (!existing) {
    const seed: ReporterAccount[] = [
      {
        id: 'rep-demo',
        fullName: 'Anitha Reddy',
        email: 'reporter@msrnews.demo',
        mobile: '9000000001',
        password: 'reporter123',
        reporterId: 'MSR-REP-001',
        address: 'Banjara Hills, Hyderabad',
        district: 'Hyderabad',
        verificationStatus: 'Approved',
        createdAt: new Date().toISOString(),
      },
    ];
    write(`reporters`, seed);
    return seed;
  }
  return existing;
}
export function saveReporters(rs: ReporterAccount[]): void {
  write(`reporters`, rs);
}
export function addReporter(r: ReporterAccount): void {
  const rs = loadReporters();
  rs.push(r);
  saveReporters(rs);
}
export function updateReporter(r: ReporterAccount): void {
  const rs = loadReporters();
  const idx = rs.findIndex((x) => x.id === r.id);
  if (idx >= 0) rs[idx] = r;
  else rs.push(r);
  saveReporters(rs);
}

// Session
export function loadSession(): { type: 'user' | 'reporter' | null; id: string | null } {
  return read(`session`, { type: null, id: null });
}
export function saveSession(s: { type: 'user' | 'reporter' | null; id: string | null }): void {
  write(`session`, s);
}

// Notifications
export function loadNotifications(): NotificationItem[] {
  const existing = read<NotificationItem[] | null>(`notifications`, null);
  if (!existing) {
    const seed = sampleNotifications();
    write(`notifications`, seed);
    return seed;
  }
  return existing;
}
export function saveNotifications(ns: NotificationItem[]): void {
  write(`notifications`, ns);
}

// News submissions
export function loadSubmissions(): NewsSubmission[] {
  return read<NewsSubmission[]>(`submissions`, []);
}
export function saveSubmissions(s: NewsSubmission[]): void {
  write(`submissions`, s);
}
export function addSubmission(s: NewsSubmission): void {
  const all = loadSubmissions();
  all.push(s);
  saveSubmissions(all);
}
export function updateSubmission(s: NewsSubmission): void {
  const all = loadSubmissions();
  const idx = all.findIndex((x) => x.id === s.id);
  if (idx >= 0) all[idx] = s;
  else all.push(s);
  saveSubmissions(all);
}
export function deleteSubmission(id: string): void {
  const all = loadSubmissions().filter((s) => s.id !== id);
  saveSubmissions(all);
}

// Language preference
export function loadLanguage(): Language {
  return read<Language>(`language`, 'en');
}
export function saveLanguage(l: Language): void {
  write(`language`, l);
}

// Location preference
export function loadLocation(): string {
  return read<string>(`location`, 'Telangana');
}
export function saveLocation(l: string): void {
  write(`location`, l);
}
export function loadDistrict(): string {
  return read<string>(`district`, 'All Districts');
}
export function saveDistrict(d: string): void {
  write(`district`, d);
}

// Reset
export function resetAll(): void {
  const keys = ['articles', 'users', 'reporters', 'session', 'notifications', 'submissions', 'language', 'location', 'district'];
  keys.forEach((k) => localStorage.removeItem(PREFIX + k));
}

export function genId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
