import { useState } from 'react';
import { Bell, Check, Trash2, CheckCheck, AlertCircle, Newspaper } from 'lucide-react';
import { useApp } from '../context';
import { loadNotifications, saveNotifications, type NotificationItem } from '../storage';
import { timeAgo } from '../utils';

const TYPE_META: Record<string, { label: string; color: string }> = {
  breaking: { label: 'Breaking News', color: 'bg-news-red/10 text-news-red' },
  latest: { label: 'Latest News', color: 'bg-blue-100 text-blue-700' },
  local: { label: 'Local News', color: 'bg-green-100 text-green-700' },
  district: { label: 'District Updates', color: 'bg-amber-100 text-amber-700' },
  announcement: { label: 'Announcement', color: 'bg-purple-100 text-purple-700' },
  approval: { label: 'Reporter Approval', color: 'bg-green-100 text-green-700' },
  submission: { label: 'Submission Status', color: 'bg-news-ink/10 text-news-ink' },
};

export function NotificationsPage() {
  const { navigate, session, t } = useApp();
  const [items, setItems] = useState<NotificationItem[]>(loadNotifications());

  const update = (ns: NotificationItem[]) => { setItems(ns); saveNotifications(ns); };
  const markRead = (id: string) => update(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => update(items.map((n) => ({ ...n, read: true })));
  const clearAll = () => update([]);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="bg-[#003478] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={24} />
            <div>
              <h1 className="font-headline text-xl font-bold">{t('common.notifications')}</h1>
              <p className="text-xs opacity-80">{unread} unread · {items.length} total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={markAll} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded flex items-center gap-1.5" disabled={items.length === 0}><CheckCheck size={14} /> {t('common.markAllRead')}</button>
            <button onClick={clearAll} className="text-xs bg-white/10 hover:bg-news-redDark px-3 py-1.5 rounded flex items-center gap-1.5" disabled={items.length === 0}><Trash2 size={14} /> {t('common.clearAll')}</button>
          </div>
        </div>

        <div>
          {items.length === 0 ? (
            <div className="p-12 text-center text-news-slate">
              <AlertCircle size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No notifications yet.</p>
            </div>
          ) : (
            items.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.announcement;
              return (
                <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-news-ash hover:bg-news-ash/30 transition-colors ${!n.read ? 'bg-[#003478]/5' : ''}`}>
                  <button onClick={() => markRead(n.id)} className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${n.read ? 'bg-green-500 border-green-500 text-white' : 'border-news-ash hover:border-[#003478]'}`} aria-label="Mark read">
                    {n.read && <Check size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${meta.color}`}>{meta.label}</span>
                      <span className="text-[11px] text-news-slate">{timeAgo(n.date)}</span>
                    </div>
                    <div className="font-semibold text-sm text-news-ink">{n.title}</div>
                    <div className="text-sm text-news-slate">{n.body}</div>
                  </div>
                  {n.articleId && (
                    <button onClick={() => navigate({ name: 'article', id: n.articleId! })} className="shrink-0 text-[#003478] hover:text-news-redDark" title="Open article">
                      <Newspaper size={18} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {!session.type && (
        <p className="text-center text-xs text-news-slate mt-4">Personal notifications (approval, submission status) appear after you log in.</p>
      )}
    </div>
  );
}
