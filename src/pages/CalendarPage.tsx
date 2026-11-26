
import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Newspaper,
  Clock,
} from 'lucide-react';

import { loadArticles } from '../storage';
import { ArticleCard, BackButton } from '../components/ui';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Convert local date into YYYY-MM-DD without timezone shifting.
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Format archive date.
function formatArchiveDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function CalendarPage() {
  const [todayKey] = useState(() => toDateKey(new Date()));

  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selected, setSelected] = useState(todayKey);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date(`${todayKey}T00:00:00`);
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = toDateKey(yesterday);

  // Load only published articles.
  const articles = useMemo(
    () => loadArticles().filter((article) => article.status === 'published'),
    []
  );

  // Count published articles for each date.
  const dateCount = useMemo(() => {
    const map: Record<string, number> = {};

    articles.forEach((article) => {
      const key = article.date.slice(0, 10);
      map[key] = (map[key] ?? 0) + 1;
    });

    return map;
  }, [articles]);

  // Get articles for selected date.
  const selectedArticles = useMemo(() => {
    if (!selected) return [];

    return articles
      .filter((article) => article.date.slice(0, 10) === selected)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [articles, selected]);

  // Navigate to previous month.
  const previousMonth = () => {
    setCursor(new Date(year, month - 1, 1));
  };

  // Navigate to next month, but not beyond current month.
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);

    if (next <= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCursor(next);
    }
  };

  // Select a date.
  const selectDate = (dateKey: string) => {
    if (dateKey > todayKey) return;

    setSelected(dateKey);

    const [y, m] = dateKey.split('-').map(Number);
    setCursor(new Date(y, m - 1, 1));
  };

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">

      <BackButton label="Back to Home" />

      {/* ARCHIVE HEADER */}
      <div className="bg-news-ink text-white rounded-lg px-5 sm:px-6 py-6 mb-6">

        <div className="text-[11px] uppercase tracking-widest text-news-redLight font-semibold mb-2 flex items-center gap-2">
          <CalIcon size={15} />
          MSR NEWS ARCHIVES
        </div>

        <h1 className="font-headline text-3xl sm:text-4xl font-black">
          News Calendar & Archives
        </h1>

        <p className="text-sm opacity-75 mt-2">
          Missed yesterday's news? Select any previous date and read
          all the published news from that day.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">

          <button
            type="button"
            onClick={() => selectDate(todayKey)}
            className="bg-white text-news-ink px-4 py-2 rounded-md text-xs font-bold hover:bg-news-ash transition-colors"
          >
            Today's News
          </button>

          <button
            type="button"
            onClick={() => selectDate(yesterdayKey)}
            className="bg-news-red text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-news-redDark transition-colors"
          >
            Yesterday's News
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

        {/* CALENDAR */}
        <div className="bg-white rounded-lg shadow-card p-4 sm:p-5 h-fit">

          {/* MONTH NAVIGATION */}
          <div className="flex items-center justify-between mb-5">

            <button
              type="button"
              onClick={previousMonth}
              className="p-2 hover:bg-news-ash rounded-md transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={21} />
            </button>

            <h2 className="font-headline text-lg font-bold text-news-ink">
              {cursor.toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <button
              type="button"
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="p-2 hover:bg-news-ash rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next month"
            >
              <ChevronRight size={21} />
            </button>

          </div>

          {/* WEEKDAYS */}
          <div className="grid grid-cols-7 gap-1 mb-2">

            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold text-news-slate py-2"
              >
                {day}
              </div>
            ))}

          </div>

          {/* DATE GRID */}
          <div className="grid grid-cols-7 gap-1">

            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;

              const date = new Date(year, month, day);
              const dateKey = toDateKey(date);

              const count = dateCount[dateKey] ?? 0;

              const isSelected = selected === dateKey;
              const isToday = todayKey === dateKey;
              const isFuture = dateKey > todayKey;
              const hasArticles = count > 0;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isFuture}
                  onClick={() => selectDate(dateKey)}
                  title={
                    isFuture
                      ? 'Future dates are unavailable'
                      : `${count} published article(s)`
                  }
                  className={`aspect-square rounded-md text-sm flex flex-col items-center justify-center relative transition-colors ${
                    isFuture
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                        ? 'bg-news-red text-white font-bold'
                        : isToday
                          ? 'border-2 border-news-red text-news-red font-bold'
                          : hasArticles
                            ? 'bg-news-red/10 hover:bg-news-red/20 text-news-ink'
                            : 'hover:bg-news-ash text-news-slate'
                  }`}
                >
                  {day}

                  {hasArticles && (
                    <span
                      className={`absolute bottom-1 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-news-red'
                      }`}
                    />
                  )}

                </button>
              );
            })}

          </div>

          {/* CALENDAR LEGEND */}
          <div className="mt-5 pt-4 border-t border-news-ash space-y-2">

            <div className="flex items-center gap-2 text-xs text-news-slate">
              <span className="w-2 h-2 bg-news-red rounded-full" />
              Published news available
            </div>

            <div className="flex items-center gap-2 text-xs text-news-slate">
              <span className="w-3 h-3 border-2 border-news-red rounded-sm" />
              Today
            </div>

            <div className="flex items-center gap-2 text-xs text-news-slate">
              <span className="w-3 h-3 bg-gray-200 rounded-sm" />
              Future date unavailable
            </div>

          </div>
        </div>

        {/* SELECTED DATE NEWS */}
        <div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

            <div>
              {/* Replaced SectionTitle to fix missing accent prop */}
              <h2 className="font-headline text-xl font-bold text-news-ink">
                {selected ? 'Archived News' : 'Select a Date'}
              </h2>

              {selected && (
                <p className="text-sm text-news-slate mt-1">
                  {formatArchiveDate(selected)}
                </p>
              )}
            </div>

            {selected && (
              <span className="bg-news-red/10 text-news-red px-3 py-1.5 rounded-full text-xs font-bold">
                {selectedArticles.length} Articles
              </span>
            )}

          </div>

          {selectedArticles.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {selectedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}

            </div>

          ) : (

            <div className="bg-white rounded-lg p-8 sm:p-12 text-center text-news-slate border border-news-ash">

              <Newspaper
                size={42}
                className="mx-auto mb-3 opacity-40"
              />

              <h3 className="font-bold text-news-ink">
                No published news on this date
              </h3>

              <p className="text-sm mt-2">
                Please select another date from the calendar
                to explore the news archive.
              </p>

              <button
                type="button"
                onClick={() => selectDate(todayKey)}
                className="mt-5 bg-news-red text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-news-redDark"
              >
                Back to Today's News
              </button>

            </div>

          )}

          {/* ARCHIVE INFORMATION */}
          <div className="mt-6 bg-white border border-news-ash rounded-lg p-4">

            <div className="flex items-center gap-2 text-news-ink font-bold text-sm">
              <Clock size={17} className="text-news-red" />
              About News Archives
            </div>

            <p className="text-xs text-news-slate mt-2 leading-relaxed">
              MSR NEWS archives display published articles according
              to their publication date. Pending, rejected and draft
              articles are not displayed.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
