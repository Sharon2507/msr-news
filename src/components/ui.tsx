// @ts-nocheck

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link as LinkIcon, ArrowLeft, Share2, Clock, MapPin } from 'lucide-react';
import { useApp } from '../context';
import { formatDate, timeAgo } from '../utils';

// Category-wise label colors
const getCategoryColor = (category) => {
    const colors = {
        agriculture: 'bg-green-100 text-green-700',
        technology: 'bg-blue-100 text-blue-700',
        politics: 'bg-red-100 text-red-700',
        sports: 'bg-orange-100 text-orange-700',
        entertainment: 'bg-purple-100 text-purple-700',
        cinema: 'bg-purple-100 text-purple-700',
        business: 'bg-gray-200 text-gray-700',
        finance: 'bg-indigo-100 text-indigo-700',
        education: 'bg-teal-100 text-teal-700',
        health: 'bg-pink-100 text-pink-700',
        'local news': 'bg-cyan-100 text-cyan-700',
        'district news': 'bg-emerald-100 text-emerald-700',
        headlines: 'bg-yellow-100 text-yellow-800',
    };

    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

export function ArticleCard({ article, variant = 'default' }) {
    const { navigate, t } = useApp();

    // Compact Article Card
    if (variant === 'compact') {
        return (
            _jsx("button", {
                onClick: () => navigate({ name: 'article', id: article.id }),
                className: "flex gap-3 group text-left w-full",
                children: _jsxs("div", {
                    className: "min-w-0",
                    children: [
                        _jsx("div", {
                            className: "mb-1",
                            children: _jsx("span", {
                                className: `inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${getCategoryColor(article.category)}`,
                                children: article.category
                            })
                        }),
                        _jsx("h4", {
                            className: "text-sm font-semibold text-news-ink leading-snug group-hover:text-news-red transition-colors line-clamp-2",
                            children: article.headline
                        }),
                        _jsx("div", {
                            className: "text-[11px] text-news-slate mt-0.5",
                            children: timeAgo(article.date)
                        })
                    ]
                })
            })
        );
    }

    // Featured Article Card
    if (variant === 'feature') {
        return (
            _jsx("button", {
                onClick: () => navigate({ name: 'article', id: article.id }),
                className: "group block w-full min-h-[320px] text-left relative overflow-hidden rounded-lg shadow-card bg-gradient-to-br from-news-ink via-slate-800 to-black",
                children: _jsxs("div", {
                    className: "absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white",
                    children: [
                        _jsxs("div", {
                            className: "flex items-center gap-2 mb-2",
                            children: [
                                article.breaking && _jsx("span", {
                                    className: "bg-news-red text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulseRed",
                                    children: t('common.breaking')
                                }),
                                _jsx("span", {
                                    className: `text-[11px] uppercase tracking-wider font-bold px-2 py-1 rounded ${getCategoryColor(article.category)}`,
                                    children: article.category
                                })
                            ]
                        }),
                        _jsx("h3", {
                            className: "font-headline text-xl sm:text-2xl font-bold leading-tight group-hover:text-news-redLight transition-colors",
                            children: article.headline
                        }),
                        _jsx("p", {
                            className: "text-sm opacity-90 mt-1.5 line-clamp-2",
                            children: article.summary
                        }),
                        _jsxs("div", {
                            className: "text-[11px] opacity-75 mt-2",
                            children: [
                                t('common.by'),
                                " ",
                                article.reporter,
                                " · ",
                                formatDate(article.date)
                            ]
                        })
                    ]
                })
            })
        );
    }

    // Default Article Card
    return (
        _jsxs("button", {
            onClick: () => navigate({ name: 'article', id: article.id }),
            className: "group block bg-white rounded-lg overflow-hidden shadow-card hover:shadow-headline transition-all text-left",
            children: [
                _jsxs("div", {
                    className: "px-4 pt-4",
                    children: [
                        _jsx("span", {
                            className: `absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getCategoryColor(article.category)}`,
                            children: article.category
                        }),
                        article.breaking && _jsx("span", {
                            className: "absolute top-2 right-2 bg-news-red text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulseRed",
                            children: t('common.breaking')
                        })
                    ]
                }),
                _jsxs("div", {
                    className: "p-4",
                    children: [
                        _jsx("h3", {
                            className: "font-headline text-lg font-bold text-news-ink leading-snug group-hover:text-news-red transition-colors line-clamp-3",
                            children: article.headline
                        }),
                        _jsx("p", {
                            className: "text-sm text-news-slate mt-1.5 line-clamp-2",
                            children: article.summary
                        }),
                        _jsxs("div", {
                            className: "flex items-center justify-between mt-3 pt-3 border-t border-news-ash text-[11px] text-news-slate",
                            children: [
                                _jsx("span", {
                                    className: "font-medium text-news-ink",
                                    children: article.reporter
                                }),
                                _jsx("span", {
                                    children: timeAgo(article.date)
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    );
}

export function BreakingBanner({ articles }) {
    const { navigate, t } = useApp();
    const breaking = articles.filter((a) => a.breaking).slice(0, 6);

    if (breaking.length === 0)
        return null;

    return (
        _jsx("div", {
            className: "bg-news-red text-white",
            children: _jsxs("div", {
                className: "max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-3",
                children: [
                    _jsxs("span", {
                        className: "bg-white text-news-red text-xs font-black px-2.5 py-1 rounded shrink-0 uppercase tracking-wider flex items-center gap-1.5",
                        children: [
                            _jsx("span", {
                                className: "w-2 h-2 bg-news-red rounded-full animate-pulseRed"
                            }),
                            " ",
                            t('common.breaking')
                        ]
                    }),
                    _jsx("div", {
                        className: "overflow-hidden flex-1",
                        children: _jsx("div", {
                            className: "flex gap-8 animate-ticker whitespace-nowrap",
                            children: [...breaking, ...breaking].map((a, i) => (
                                _jsxs("button", {
                                    onClick: () => navigate({ name: 'article', id: a.id }),
                                    className: "text-sm hover:underline inline-flex items-center gap-2",
                                    children: [
                                        _jsx("span", {
                                            className: "opacity-80",
                                            children: "•"
                                        }),
                                        " ",
                                        a.headline
                                    ]
                                }, i)
                            ))
                        })
                    })
                ]
            })
        })
    );
}

export function SectionTitle({ title, accent }) {
    return (
        _jsxs("div", {
            className: "flex items-center gap-3 mb-5",
            children: [
                _jsx("h2", {
                    className: "font-headline text-xl sm:text-2xl font-bold text-news-ink",
                    children: title
                }),
                _jsx("div", {
                    className: "flex-1 h-0.5 bg-gradient-to-r from-news-red to-transparent"
                }),
                accent && _jsx("span", {
                    className: "text-xs text-news-slate font-medium hidden sm:inline",
                    children: accent
                })
            ]
        })
    );
}

export function AdBanner({ label = 'ADVERTISEMENT' }) {
    return (
        _jsxs("div", {
            className: "bg-white border border-news-ash rounded-lg p-4 text-center my-6",
            children: [
                _jsx("div", {
                    className: "text-[10px] text-news-slate uppercase tracking-widest mb-2",
                    children: label
                }),
                _jsx("div", {
                    className: "h-24 sm:h-28 bg-gradient-to-r from-news-ash to-white rounded flex items-center justify-center",
                    children: _jsxs("div", {
                        className: "text-center",
                        children: [
                            _jsx("div", {
                                className: "font-headline text-2xl font-bold text-news-red/60",
                                children: "MSR NEWS"
                            }),
                            _jsx("div", {
                                className: "text-xs text-news-slate",
                                children: "Your advertisement here · advertise@msrnews.demo"
                            })
                        ]
                    })
                })
            ]
        })
    );
}

export function BackButton({ label }) {
    const { navigate } = useApp();

    return (
        _jsxs("button", {
            onClick: () => navigate({ name: 'home' }),
            className: "inline-flex items-center gap-1.5 text-sm text-news-slate hover:text-news-red transition-colors mb-4 font-medium",
            children: [
                _jsx(ArrowLeft, { size: 16 }),
                " ",
                label
            ]
        })
    );
}

export function ArticleMeta({ article, full = false }) {
    const { t } = useApp();

    return (
        _jsxs("div", {
            className: `flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-news-slate ${full ? 'border-y border-news-ash py-3 my-4' : ''}`,
            children: [
                _jsx("span", {
                    className: "flex items-center gap-1 font-semibold text-news-ink",
                    children: article.reporter
                }),
                _jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [
                        _jsx(Clock, { size: 12 }),
                        " ",
                        formatDate(article.date)
                    ]
                }),
                _jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [
                        _jsx(MapPin, { size: 12 }),
                        " ",
                        article.location,
                        article.district && article.district !== article.location
                            ? `, ${article.district}`
                            : ''
                    ]
                }),
                _jsx("span", {
                    className: "bg-news-red/10 text-news-red font-semibold px-2 py-0.5 rounded",
                    children: t(`nav.${article.category}`)
                })
            ]
        })
    );
}

export function ShareButton({ title }) {
    const { showToast } = useApp();

    const share = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            }
            catch {
                // fallthrough
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            showToast('Link copied to clipboard');
        }
        catch {
            showToast('Share link ready');
        }
    };

    return (
        _jsxs("button", {
            onClick: share,
            className: "inline-flex items-center gap-2 bg-news-ink hover:bg-news-red text-white px-4 py-2 rounded text-sm font-semibold transition-colors",
            children: [
                _jsx(Share2, { size: 16 }),
                " Share"
            ]
        })
    );
}

export const _icons = { LinkIcon };
