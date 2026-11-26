import { useMemo } from 'react';
import { useApp } from '../context';
import { loadArticles } from '../storage';
import { ArticleCard, BreakingBanner, SectionTitle, AdBanner } from '../components/ui';

export function HomePage() {
  const { district } = useApp();
  const articles = useMemo(() => loadArticles().filter((a) => a.status === 'published'), []);

  const breaking = articles.filter((a) => a.breaking);
  const featured = articles.filter((a) => a.featured);
  const mainHeadline = featured[0] ?? articles[0];
  const secondaryHeadlines = articles.filter((a) => a.id !== mainHeadline?.id).slice(0, 4);

  const latest = [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6);
  const politics = articles.filter((a) => a.category === 'Politics').slice(0, 3);
  const sports = articles.filter((a) => a.category === 'Sports').slice(0, 3);
  const finance = articles.filter((a) => a.category === 'Finance' || a.category === 'Business').slice(0, 4);
  const eduHealth = [...articles.filter((a) => a.category === 'Education'), ...articles.filter((a) => a.category === 'Health')].slice(0, 4);
  const entCinema = [...articles.filter((a) => a.category === 'Entertainment'), ...articles.filter((a) => a.category === 'Cinema')].slice(0, 4);
  const tech = articles.filter((a) => a.category === 'Technology').slice(0, 3);
  const local = articles.filter((a) => (a.category === 'Local News' || a.category === 'District News'));
  const localFiltered = district !== 'All Districts' ? local.filter((a) => a.district === district) : local;
  const localTop = localFiltered.slice(0, 4);

  return (
    <div className="bg-news-paper">
      <BreakingBanner articles={breaking} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        {/* Main headlines grid */}
        <SectionTitle title="Main Headlines" accent={district !== 'All Districts' ? `Localised: ${district}` : undefined} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {mainHeadline && (
            <div className="lg:col-span-2">
              <ArticleCard article={mainHeadline} variant="feature" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            {secondaryHeadlines.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>

        <AdBanner />

        {/* Featured + Latest */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SectionTitle title="Latest News" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latest.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
          <aside>
            <SectionTitle title="Featured" />
            <div className="flex flex-col gap-4">
              {featured.slice(0, 3).map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}
            </div>
          </aside>
        </div>

        <CategoryRow title="Politics" articles={politics} />
        <CategoryRow title="Sports" articles={sports} />

        <AdBanner />

        <CategoryRow title="Finance & Business" articles={finance} />
        <CategoryRow title="Education & Health" articles={eduHealth} />
        <CategoryRow title="Entertainment & Cinema" articles={entCinema} />
        <CategoryRow title="Technology" articles={tech} />

        <AdBanner />

        {/* Local & District */}
        <SectionTitle title={district !== 'All Districts' ? `Local & District News — ${district}` : 'Local & District News'} />
        {localTop.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {localTop.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center text-news-slate border border-news-ash">
            No local news for <strong className="text-news-ink">{district}</strong> yet. Try another district from the selector.
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ title, articles }: { title: string; articles: import('../types').Article[] }) {
  const { navigate } = useApp();
  if (articles.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionTitle title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
      <button onClick={() => navigate({ name: 'category', category: title.includes('&') ? title.split('&')[0].trim() : title })} className="text-sm text-news-red hover:text-news-redDark font-semibold mt-4 inline-flex items-center gap-1">
        More {title} →
      </button>
    </section>
  );
}
