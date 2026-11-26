import { useMemo } from 'react';
import { useApp } from '../context';
import { loadArticles } from '../storage';
import { ArticleCard, ArticleMeta, BackButton, ShareButton, AdBanner, SectionTitle } from '../components/ui';
import { formatDateTime } from '../utils';

export function ArticleDetailPage({ id }: { id: string }) {
  const { t, navigate } = useApp();
  const article = useMemo(() => loadArticles().find((a) => a.id === id), [id]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-headline text-2xl font-bold text-news-ink mb-2">Article not found</h1>
        <p className="text-news-slate mb-6">This article may have been removed or never existed.</p>
        <button onClick={() => navigate({ name: 'home' })} className="bg-news-red hover:bg-news-redDark text-white px-5 py-2 rounded font-semibold">Back to Home</button>
      </div>
    );
  }

  const related = loadArticles()
    .filter((a) => a.status === 'published' && a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const paragraphs = article.content.split('\n').filter((p) => p.trim());

  return (
    <article className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
      <BackButton label="Back" />

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {article.breaking && (
          <div className="bg-news-red text-white px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulseRed" /> {t('common.breaking')}
          </div>
        )}
        <div className="p-5 sm:p-8">
          <div className="text-xs uppercase tracking-widest text-news-red font-bold mb-2">{t(`nav.${article.category}`)}</div>
          <h1 className="font-headline text-3xl sm:text-4xl font-black text-news-ink leading-tight">{article.headline}</h1>
          <p className="text-lg text-news-slate mt-3 leading-relaxed">{article.summary}</p>
          <ArticleMeta article={article} full />
        </div>

        <img src={article.image} alt={article.headline} className="w-full h-72 sm:h-96 object-cover" />

        <div className="p-5 sm:p-8">
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i} className={`text-news-ink leading-relaxed mb-4 ${i === 0 ? 'text-lg first-letter:text-5xl first-letter:font-headline first-letter:font-bold first-letter:text-news-red first-letter:mr-1 first-letter:float-left' : ''}`}>
                {p}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-news-ash">
            <div className="text-sm">
              <div className="font-semibold text-news-ink">{article.reporter}</div>
              <div className="text-xs text-news-slate">{formatDateTime(article.date)}</div>
            </div>
            <ShareButton title={article.headline} />
          </div>
        </div>
      </div>

      <AdBanner />

      {related.length > 0 && (
        <section className="mt-2">
          <SectionTitle title={t('common.related')} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </article>
  );
}
