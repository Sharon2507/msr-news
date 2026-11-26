// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { LayoutDashboard, User, ShieldCheck, FilePlus2, FileText, CheckCircle2, Clock, XCircle, LogOut, Eye, Trash2, Edit3, Send, Save, X, Newspaper, AlertCircle, } from 'lucide-react';
import { useApp } from '../context';
import { loadSubmissions, updateSubmission, deleteSubmission, saveCustomArticle, updateReporter, genId, } from '../storage';
import { CATEGORIES, DISTRICTS, LOCATIONS } from '../types';
import { LANG_LABELS, formatDate, formatDateTime, readFileAsDataURL } from '../utils';
export function ReporterDashboardPage() {
    const { currentReporter, logout, showToast, navigate } = useApp();
    const [tab, setTab] = useState('overview');
    const [editing, setEditing] = useState(null);
    const [, force] = useState(0);
    const refresh = () => force((n) => n + 1);
    if (!currentReporter) {
        return (_jsxs("div", { className: "max-w-md mx-auto py-20 text-center", children: [_jsx("p", { className: "text-news-slate", children: "Reporter session expired. Please log in again." }), _jsx("button", { onClick: () => navigate({ name: 'reporterLogin' }), className: "mt-4 bg-[#d71920] text-white px-5 py-2 rounded font-semibold", children: "Reporter Login" })] }));
    }
    if (currentReporter.verificationStatus !== 'Approved') {
        return _jsx(NotApproved, { reporter: currentReporter });
    }
    const subs = loadSubmissions().filter((s) => s.reporterId === currentReporter.id);
    const published = subs.filter((s) => s.status === 'published');
    const pending = subs.filter((s) => s.status === 'pending');
    const rejected = subs.filter((s) => s.status === 'rejected');
    const tabs = [
        { id: 'overview', label: 'Overview', icon: _jsx(LayoutDashboard, { size: 16 }) },
        { id: 'create', label: 'Create News', icon: _jsx(FilePlus2, { size: 16 }) },
        { id: 'submitted', label: 'My Submissions', icon: _jsx(FileText, { size: 16 }), count: subs.filter((s) => !s.isDraft).length },
        { id: 'published', label: 'Published', icon: _jsx(CheckCircle2, { size: 16 }), count: published.length },
        { id: 'pending', label: 'Pending', icon: _jsx(Clock, { size: 16 }), count: pending.length },
        { id: 'rejected', label: 'Rejected', icon: _jsx(XCircle, { size: 16 }), count: rejected.length },
        { id: 'profile', label: 'Profile', icon: _jsx(User, { size: 16 }) },
        { id: 'verification', label: 'Verification', icon: _jsx(ShieldCheck, { size: 16 }) },
    ];
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-3 sm:px-6 py-6", children: [_jsxs("div", { className: "bg-[#003478] text-white rounded-lg p-5 mb-5 flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-news-red flex items-center justify-center text-white font-bold overflow-hidden", children: currentReporter.photo ? _jsx("img", { src: currentReporter.photo, alt: "", className: "w-full h-full object-cover" }) : currentReporter.fullName[0] }), _jsxs("div", { children: [_jsx("h1", { className: "font-headline text-2xl font-bold", children: currentReporter.fullName }), _jsxs("div", { className: "text-sm opacity-80", children: [currentReporter.reporterId, " \u00B7 ", currentReporter.district] })] })] }), _jsxs("button", { onClick: () => { logout(); }, className: "bg-white/10 hover:bg-[#d71920] px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-colors", children: [_jsx(LogOut, { size: 16 }), " Logout"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5", children: [_jsx("aside", { className: "bg-white rounded-lg shadow-card p-3 h-fit lg:sticky lg:top-44", children: _jsx("nav", { className: "flex lg:flex-col gap-1 overflow-x-auto no-scrollbar", children: tabs.map((tb) => (_jsxs("button", { onClick: () => { setTab(tb.id); setEditing(null); }, className: `flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-colors ${tab === tb.id ? 'bg-[#d71920] text-white' : 'text-news-ink hover:bg-news-ash/60'}`, children: [tb.icon, " ", tb.label, tb.count !== undefined && tb.count > 0 && _jsx("span", { className: `ml-auto text-xs rounded-full px-1.5 ${tab === tb.id ? 'bg-white/20' : 'bg-news-ash'}`, children: tb.count })] }, tb.id))) }) }), _jsxs("section", { className: "bg-white rounded-lg shadow-card p-5", children: [tab === 'overview' && _jsx(Overview, { subs: subs, published: published, pending: pending, rejected: rejected, onCreate: () => setTab('create') }), tab === 'create' && _jsx(CreateNewsForm, { reporter: currentReporter, editing: editing, onDone: () => { setEditing(null); setTab('submitted'); refresh(); } }), tab === 'submitted' && _jsx(SubmissionList, { subs: subs.filter((s) => !s.isDraft), onEdit: (s) => { setEditing(s); setTab('create'); }, onDelete: (id) => { deleteSubmission(id); refresh(); showToast('Submission deleted'); }, onPublish: refresh }), tab === 'published' && _jsx(SubmissionList, { subs: published, onEdit: (s) => { setEditing(s); setTab('create'); }, onDelete: (id) => { deleteSubmission(id); refresh(); }, onPublish: refresh }), tab === 'pending' && _jsx(SubmissionList, { subs: pending, onEdit: (s) => { setEditing(s); setTab('create'); }, onDelete: (id) => { deleteSubmission(id); refresh(); }, onPublish: refresh }), tab === 'rejected' && _jsx(SubmissionList, { subs: rejected, onEdit: (s) => { setEditing(s); setTab('create'); }, onDelete: (id) => { deleteSubmission(id); refresh(); }, onPublish: refresh }), tab === 'profile' && _jsx(ReporterProfile, {}), tab === 'verification' && _jsx(VerificationPanel, {})] })] })] }));
}
function StatCard({ label, value, icon, color }) {
    return (_jsxs("div", { className: "bg-white border border-news-ash rounded-lg p-4", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center mb-2 ${color}`, children: icon }), _jsx("div", { className: "text-2xl font-bold text-news-ink", children: value }), _jsx("div", { className: "text-xs text-news-slate font-medium", children: label })] }));
}
function Overview({ subs, published, pending, rejected, onCreate }) {
    const recent = [...subs].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5);
    return (_jsxs("div", { children: [_jsx("h2", { className: "font-headline text-xl font-bold mb-4", children: "Dashboard Overview" }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6", children: [_jsx(StatCard, { label: "Total Submissions", value: subs.length, icon: _jsx(FileText, { size: 18, className: "text-news-ink" }), color: "bg-news-ash" }), _jsx(StatCard, { label: "Published", value: published.length, icon: _jsx(CheckCircle2, { size: 18, className: "text-green-600" }), color: "bg-green-100" }), _jsx(StatCard, { label: "Pending", value: pending.length, icon: _jsx(Clock, { size: 18, className: "text-amber-600" }), color: "bg-amber-100" }), _jsx(StatCard, { label: "Rejected", value: rejected.length, icon: _jsx(XCircle, { size: 18, className: "text-news-red" }), color: "bg-news-red/10" })] }), _jsxs("button", { onClick: onCreate, className: "w-full bg-[#d71920] hover:bg-news-red text-white font-semibold py-2.5 rounded mb-6 flex items-center justify-center gap-2", children: [_jsx(FilePlus2, { size: 18 }), " Create New News Article"] }), _jsx("h3", { className: "font-headline text-lg font-bold mb-3", children: "Recent Submissions" }), recent.length === 0 ? (_jsx("div", { className: "text-center py-8 text-news-slate text-sm border border-dashed border-news-ash rounded-lg", children: "No submissions yet. Click \"Create New News Article\" to begin." })) : (_jsx("div", { className: "space-y-2", children: recent.map((s) => (_jsxs("div", { className: "flex items-center justify-between border border-news-ash rounded-lg p-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-semibold text-sm text-news-ink truncate", children: s.headline || '(untitled draft)' }), _jsxs("div", { className: "text-xs text-news-slate", children: [s.category, " \u00B7 ", formatDate(s.date)] })] }), _jsx(StatusBadge, { status: s.status, draft: s.isDraft })] }, s.id))) }))] }));
}
function StatusBadge({ status, draft }) {
    if (draft)
        return _jsx("span", { className: "text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold", children: "Draft" });
    if (status === 'published')
        return _jsxs("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1", children: [_jsx(CheckCircle2, { size: 12 }), " Published"] });
    if (status === 'pending')
        return _jsxs("span", { className: "text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " Pending"] });
    return _jsxs("span", { className: "text-xs bg-[#d71920]/10 text-news-red px-2 py-0.5 rounded font-semibold flex items-center gap-1", children: [_jsx(XCircle, { size: 12 }), " Rejected"] });
}
function CreateNewsForm({ reporter, editing, onDone }) {
    const { showToast } = useApp();
    const [form, setForm] = useState({
        headline: editing?.headline ?? '',
        summary: editing?.summary ?? '',
        content: editing?.content ?? '',
        category: editing?.category ?? 'Politics',
        location: editing?.location ?? LOCATIONS[0],
        district: editing?.district ?? DISTRICTS[0],
        language: (editing?.language ?? 'en'),
        image: editing?.image ?? '',
        videoName: editing?.videoName ?? '',
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const validate = (forDraft) => {
        const e = {};
        if (!form.headline.trim())
            e.headline = 'Headline required';
        if (!forDraft) {
            if (!form.summary.trim())
                e.summary = 'Short description required';
            if (form.content.trim().length < 50)
                e.content = 'Full content must be at least 50 characters';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const onImage = async (e) => {
        const f = e.target.files?.[0];
        if (f)
            set('image', await readFileAsDataURL(f));
    };
    const onVideo = (e) => {
        const f = e.target.files?.[0];
        if (f)
            set('videoName', f.name);
    };
    const save = (asDraft, status) => {
        if (!validate(asDraft)) {
            showToast('Please fix the errors before saving');
            return;
        }
        const sub = {
            id: editing?.id ?? genId('sub'),
            headline: form.headline.trim(),
            summary: form.summary.trim(),
            content: form.content.trim(),
            category: form.category,
            location: form.location,
            district: form.district,
            language: form.language,
            image: form.image,
            videoName: form.videoName,
            reporterId: reporter.id,
            reporterName: reporter.fullName,
            date: editing?.date ?? new Date().toISOString(),
            status,
            isDraft: asDraft,
        };
        updateSubmission(sub);
        showToast(asDraft ? 'Draft saved' : 'News submitted for review');
        onDone();
    };
    const validCats = CATEGORIES.filter((c) => !['Home', 'Latest News', 'Headlines'].includes(c));
    return (_jsxs("div", { children: [_jsx("h2", { className: "font-headline text-xl font-bold mb-4", children: editing ? 'Edit News' : 'Create News Article' }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "News Headline" }), _jsx("input", { value: form.headline, onChange: (e) => set('headline', e.target.value), placeholder: "Enter the headline", className: inputCls }), errors.headline && _jsx("p", { className: "text-xs text-news-red mt-1", children: errors.headline })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Short Description" }), _jsx("textarea", { value: form.summary, onChange: (e) => set('summary', e.target.value), rows: 2, placeholder: "A one-line summary", className: inputCls }), errors.summary && _jsx("p", { className: "text-xs text-news-red mt-1", children: errors.summary })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Full News Content" }), _jsx("textarea", { value: form.content, onChange: (e) => set('content', e.target.value), rows: 7, placeholder: "Write the full article. Separate paragraphs with blank lines.", className: inputCls }), errors.content && _jsx("p", { className: "text-xs text-news-red mt-1", children: errors.content })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Category" }), _jsx("select", { value: form.category, onChange: (e) => set('category', e.target.value), className: inputCls, children: validCats.map((c) => _jsx("option", { children: c }, c)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Location" }), _jsx("select", { value: form.location, onChange: (e) => set('location', e.target.value), className: inputCls, children: LOCATIONS.map((l) => _jsx("option", { children: l }, l)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "District" }), _jsx("select", { value: form.district, onChange: (e) => set('district', e.target.value), className: inputCls, children: DISTRICTS.map((d) => _jsx("option", { children: d }, d)) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Language" }), _jsx("select", { value: form.language, onChange: (e) => set('language', e.target.value), className: inputCls, children: Object.keys(LANG_LABELS).map((l) => _jsx("option", { value: l, children: LANG_LABELS[l] }, l)) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Upload News Image" }), _jsxs("label", { className: "block border-2 border-dashed border-news-ash rounded-lg p-4 text-center hover:border-news-red cursor-pointer text-sm text-news-slate", children: [form.image ? 'Image selected ✓' : 'Click to select image', _jsx("input", { type: "file", accept: "image/*", onChange: onImage, className: "hidden" })] }), form.image && _jsx("img", { src: form.image, alt: "", className: "mt-2 max-h-32 rounded object-cover" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Upload News Video" }), _jsxs("label", { className: "block border-2 border-dashed border-news-ash rounded-lg p-4 text-center hover:border-news-red cursor-pointer text-sm text-news-slate", children: [form.videoName ? `Video: ${form.videoName}` : 'Click to select video', _jsx("input", { type: "file", accept: "video/*", onChange: onVideo, className: "hidden" })] }), _jsx("p", { className: "text-[11px] text-news-slate mt-1", children: "Video file name is stored for the demo." })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 pt-2 border-t border-news-ash", children: [_jsxs("button", { onClick: () => save(true, 'draft'), className: "flex-1 min-w-[120px] bg-news-ash hover:bg-news-ash/70 text-news-ink font-semibold py-2.5 rounded text-sm flex items-center justify-center gap-2", children: [_jsx(Save, { size: 16 }), " Save Draft"] }), _jsxs("button", { onClick: () => setPreviewOpen(true), className: "flex-1 min-w-[120px] border-2 border-news-ink text-news-ink font-semibold py-2.5 rounded text-sm flex items-center justify-center gap-2 hover:bg-news-ink hover:text-white transition-colors", children: [_jsx(Eye, { size: 16 }), " Preview"] }), _jsxs("button", { onClick: () => save(false, 'pending'), className: "flex-1 min-w-[120px] bg-news-red hover:bg-[#d71920] text-white font-semibold py-2.5 rounded text-sm flex items-center justify-center gap-2", children: [_jsx(Send, { size: 16 }), " Submit News"] })] })] }), previewOpen && (_jsx(PreviewModal, { form: form, reporterName: reporter.fullName, onClose: () => setPreviewOpen(false) }))] }));
}
function PreviewModal({ form, reporterName, onClose }) {
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 z-[60] flex items-start justify-center p-4 overflow-auto", onClick: onClose, children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full my-8", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-news-ash", children: [_jsxs("h3", { className: "font-headline text-lg font-bold flex items-center gap-2", children: [_jsx(Eye, { size: 18 }), " Preview"] }), _jsx("button", { onClick: onClose, className: "text-news-slate hover:text-news-ink", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-news-red font-bold mb-1", children: form.category }), _jsx("h1", { className: "font-headline text-2xl font-bold text-news-ink", children: form.headline || '(headline)' }), form.summary && _jsx("p", { className: "text-news-slate mt-2", children: form.summary }), _jsxs("div", { className: "text-xs text-news-slate mt-2 border-y border-news-ash py-2", children: ["By ", reporterName, " \u00B7 ", formatDateTime(new Date().toISOString())] }), form.image && _jsx("img", { src: form.image, alt: "", className: "w-full h-64 object-cover rounded my-3" }), _jsx("div", { className: "prose max-w-none text-news-ink whitespace-pre-wrap", children: form.content || '(no content)' })] })] }) }));
}
function SubmissionList({ subs, onEdit, onDelete, onPublish }) {
    const { showToast } = useApp();
    if (subs.length === 0)
        return _jsx("div", { className: "text-center py-12 text-news-slate border border-dashed border-news-ash rounded-lg", children: "Nothing here yet." });
    const sorted = [...subs].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return (_jsx("div", { className: "space-y-3", children: sorted.map((s) => (_jsxs("div", { className: "border border-news-ash rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h3", { className: "font-headline text-lg font-bold text-news-ink", children: s.headline }), _jsx("p", { className: "text-sm text-news-slate line-clamp-2", children: s.summary }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-news-slate mt-2", children: [_jsx("span", { className: "bg-[#d71920]/10 text-news-red font-semibold px-2 py-0.5 rounded", children: s.category }), _jsxs("span", { children: [s.location, " \u00B7 ", s.district] }), _jsx("span", { children: formatDate(s.date) })] })] }), _jsx(StatusBadge, { status: s.status, draft: s.isDraft })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-3 pt-3 border-t border-news-ash", children: [_jsxs("button", { onClick: () => onEdit(s), className: "text-xs font-semibold text-news-ink hover:text-news-red flex items-center gap-1", children: [_jsx(Edit3, { size: 14 }), " Edit"] }), _jsxs("button", { onClick: () => onDelete(s.id), className: "text-xs font-semibold text-news-red hover:underline flex items-center gap-1", children: [_jsx(Trash2, { size: 14 }), " Delete"] }), s.status === 'pending' && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => {
                                        publishSubmission(s);
                                        onPublish();
                                        showToast('Editorial review complete — article published');
                                    }, className: "text-xs font-semibold text-green-700 hover:underline flex items-center gap-1 ml-auto", children: [_jsx(CheckCircle2, { size: 14 }), " Simulate Approve & Publish"] }), _jsxs("button", { onClick: () => {
                                        s.status = 'rejected';
                                        s.isDraft = false;
                                        updateSubmission(s);
                                        onPublish();
                                        showToast('Article rejected (simulated)');
                                    }, className: "text-xs font-semibold text-news-red hover:underline flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), " Simulate Reject"] })] })), s.status === 'published' && (_jsxs("span", { className: "text-xs text-green-700 font-semibold flex items-center gap-1 ml-auto", children: [_jsx(CheckCircle2, { size: 14 }), " Live on public feed"] }))] })] }, s.id))) }));
}
function publishSubmission(s) {
    s.status = 'published';
    s.isDraft = false;
    updateSubmission(s);
    // Add to public articles
    const article = {
        id: `pub-${s.id}`,
        headline: s.headline,
        summary: s.summary,
        content: s.content,
        category: s.category,
        reporter: s.reporterName,
        date: s.date,
        location: s.location,
        district: s.district,
        image: s.image || 'https://images.pexels.com/photos/36376215/pexels-photo-36376215.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        status: 'published',
    };
    saveCustomArticle(article);
}
function ReporterProfile() {
    const { currentReporter } = useApp();
    if (!currentReporter)
        return null;
    return (_jsxs("div", { children: [_jsx("h2", { className: "font-headline text-xl font-bold mb-4", children: "Reporter Profile" }), _jsxs("div", { className: "flex items-center gap-4 mb-5", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-[#d71920] flex items-center justify-center text-white text-2xl font-bold overflow-hidden", children: currentReporter.photo ? _jsx("img", { src: currentReporter.photo, alt: "", className: "w-full h-full object-cover" }) : currentReporter.fullName[0] }), _jsxs("div", { children: [_jsx("h3", { className: "font-headline text-xl font-bold", children: currentReporter.fullName }), _jsx("p", { className: "text-sm text-news-slate", children: currentReporter.reporterId })] })] }), _jsxs("dl", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3", children: [_jsx(InfoRow, { label: "Email", value: currentReporter.email }), _jsx(InfoRow, { label: "Mobile", value: currentReporter.mobile }), _jsx(InfoRow, { label: "District", value: currentReporter.district }), _jsx(InfoRow, { label: "Address", value: currentReporter.address }), _jsx(InfoRow, { label: "ID Document", value: currentReporter.idDocumentName || '—' }), _jsx(InfoRow, { label: "Status", value: currentReporter.verificationStatus })] })] }));
}
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: "border-b border-news-ash pb-2", children: [_jsx("dt", { className: "text-xs uppercase tracking-wider text-news-slate font-semibold", children: label }), _jsx("dd", { className: "text-sm text-news-ink font-medium truncate", children: value })] }));
}
function VerificationPanel() {
    const { currentReporter, showToast, refreshSession } = useApp();
    if (!currentReporter)
        return null;
    const r = currentReporter;
    const order = ['Pending Verification', 'Under Review', 'Approved'];
    const idx = order.indexOf(r.verificationStatus);
    return (_jsxs("div", { children: [_jsx("h2", { className: "font-headline text-xl font-bold mb-4", children: "Verification Status" }), _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded p-3 mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { size: 16, className: "text-amber-600 shrink-0 mt-0.5" }), _jsxs("p", { className: "text-xs text-amber-800", children: [_jsx("strong", { children: "Demo:" }), " You can advance the verification status here for demonstration. No admin dashboard is involved."] })] }), _jsxs("div", { className: "bg-white border-2 border-news-ash rounded-lg p-5", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx(ShieldCheck, { size: 28, className: "text-news-red" }), _jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-news-slate", children: "Current Status" }), _jsx("div", { className: "font-headline text-lg font-bold text-news-ink", children: r.verificationStatus })] })] }), r.idDocumentName && _jsxs("p", { className: "text-sm text-news-slate", children: ["ID document: ", r.idDocumentName] }), r.photo && _jsx("img", { src: r.photo, alt: "", className: "w-20 h-20 rounded-full object-cover mt-2" })] }), r.verificationStatus !== 'Approved' && (_jsx("button", { onClick: () => { const nr = { ...r, verificationStatus: order[Math.min(idx + 1, 2)] }; updateReporter(nr); refreshSession(); showToast('Status advanced (simulated)'); }, className: "mt-4 w-full bg-news-ink hover:bg-[#d71920] text-white py-2.5 rounded font-semibold text-sm", children: "Simulate Next Verification Step" }))] }));
}
function NotApproved({ reporter }) {
    const { navigate, refreshSession, showToast } = useApp();
    const color = statusColor(reporter.verificationStatus);
    return (_jsx("div", { className: "max-w-lg mx-auto px-4 py-10", children: _jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 text-center", children: [_jsx("div", { className: `w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${color.icon}`, children: reporter.verificationStatus === 'Rejected' ? _jsx(XCircle, { size: 36, className: "text-news-red" }) : _jsx(Clock, { size: 36, className: "text-amber-600" }) }), _jsx("h1", { className: "font-headline text-2xl font-bold text-news-ink", children: reporter.verificationStatus }), _jsx("p", { className: "text-sm text-news-slate mt-2 mb-5", children: reporter.verificationStatus === 'Rejected'
                        ? 'Your reporter application was not approved. Please contact the MSR NEWS desk.'
                        : 'Your reporter account is awaiting verification. Dashboard access will open once your account is approved.' }), reporter.verificationStatus !== 'Approved' && reporter.verificationStatus !== 'Rejected' && (_jsx("button", { onClick: () => {
                        const order = ['Pending Verification', 'Under Review', 'Approved'];
                        const idx = order.indexOf(reporter.verificationStatus);
                        const next = order[Math.min(idx + 1, 2)];
                        updateReporter({ ...reporter, verificationStatus: next });
                        refreshSession();
                        showToast(`Status advanced to: ${next}`);
                        if (next === 'Approved')
                            setTimeout(() => window.location.reload(), 600);
                        else
                            window.location.reload();
                    }, className: "w-full bg-news-ink hover:bg-[#d71920] text-white py-2.5 rounded font-semibold text-sm mb-3", children: "Simulate Next Verification Step" })), _jsx("button", { onClick: () => navigate({ name: 'home' }), className: "w-full border-2 border-news-ash rounded py-2.5 font-semibold text-sm text-news-ink hover:bg-news-ash/40", children: "Back to Home" })] }) }));
}
function statusColor(s) {
    if (s === 'Approved')
        return { icon: 'bg-green-100' };
    if (s === 'Rejected')
        return { icon: 'bg-news-red/10' };
    if (s === 'Under Review')
        return { icon: 'bg-blue-100' };
    return { icon: 'bg-amber-100' };
}
const inputCls = 'w-full px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-news-red transition-colors bg-white';
// re-exports to avoid unused warnings
export const _u = { Newspaper, LayoutDashboard, User, ShieldCheck, FilePlus2, FileText, CheckCircle2, Clock, XCircle, LogOut, Eye, Trash2, Edit3, Send, Save, X, AlertCircle };
export const _m = useMemo;
