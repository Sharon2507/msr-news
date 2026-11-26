import { useMemo } from 'react';
import { useApp } from '../context';
import { loadArticles } from '../storage';
import { ArticleCard, SectionTitle, BackButton, AdBanner } from '../components/ui';
import type { Category } from '../types';

const VALID_CATEGORIES: string[] = [
  'Latest News', 'Politics', 'Sports', 'Finance', 'Business', 'Education',
  'Health', 'Entertainment', 'Cinema', 'Technology', 'Local News',
  'District News', 'Headlines',
];

export function CategoryPage({ category }: { category: string }) {
  const { t, district } = useApp();
  const cat = (VALID_CATEGORIES.includes(category) ? category : 'Home') as Category;

  const articles = useMemo(() => {
    const all = loadArticles().filter((a) => a.status === 'published');
    if (cat === 'Latest News') return [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (cat === 'Headlines') return [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (cat === 'Local News') return all.filter((a) => a.category === 'Local News');
    if (cat === 'District News') {
      const filtered = all.filter((a) => a.category === 'District News');
      return district !== 'All Districts' ? filtered.filter((a) => a.district === district) : filtered;
    }
    return all.filter((a) => a.category === cat);
  }, [cat, district]);

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      <BackButton label="Back to Home" />
      <div className="bg-news-ink text-white rounded-lg px-6 py-5 mb-6">
        <div className="text-[11px] uppercase tracking-widest text-news-redLight font-semibold mb-1">Section</div>
        <h1 className="font-headline text-3xl sm:text-4xl font-black">{t(`nav.${cat}`)}</h1>
        <p className="text-sm opacity-70 mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''}{district !== 'All Districts' && cat === 'District News' ? ` in ${district}` : ''}</p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-news-slate border border-news-ash">
          No articles in this section yet.
        </div>
      ) : (
        <>
          {featured && (
            <section className="mb-8">
              <SectionTitle title="Featured" />
              <ArticleCard article={featured} variant="feature" />
            </section>
          )}

          <AdBanner />

          <section className="mb-8">
            <SectionTitle title="More in this section" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
