// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Mail, Phone, Globe, Camera, Lock, Bell, LogOut, Save, Edit3, X } from 'lucide-react';
import { useApp } from '../context';
import { loadUsers, updateUser, saveSession } from '../storage';
import { LANG_LABELS, readFileAsDataURL } from '../utils';
export function ProfilePage() {
    const { currentUser, navigate, logout, showToast, refreshSession, lang, setLang } = useApp();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        fullName: currentUser?.fullName ?? '',
        email: currentUser?.email ?? '',
        mobile: currentUser?.mobile ?? '',
        preferredLanguage: currentUser?.preferredLanguage ?? lang,
        photo: currentUser?.photo ?? '',
    });
    const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
    const [notifSettings, setNotifSettings] = useState({ breaking: true, latest: true, local: true, district: true });
    const [tab, setTab] = useState('profile');
    if (!currentUser) {
        return (_jsxs("div", { className: "max-w-md mx-auto py-20 text-center", children: [_jsx("p", { className: "text-news-slate", children: "Please log in to view your profile." }), _jsx("button", { onClick: () => navigate({ name: 'login' }), className: "mt-4 bg-news-red text-white px-5 py-2 rounded font-semibold", children: "User Login" })] }));
    }
    const saveProfile = () => {
        const updated = { ...currentUser, ...form };
        updateUser(updated);
        saveSession({ type: 'user', id: updated.id });
        refreshSession();
        setLang(form.preferredLanguage);
        setEditing(false);
        showToast('Profile updated successfully');
    };
    const changePwd = () => {
        if (pwd.current !== currentUser.password) {
            showToast('Current password is incorrect');
            return;
        }
        if (pwd.next.length < 6) {
            showToast('New password must be at least 6 characters');
            return;
        }
        if (pwd.next !== pwd.confirm) {
            showToast('Passwords do not match');
            return;
        }
        updateUser({ ...currentUser, password: pwd.next });
        showToast('Password changed (demo)');
        setPwd({ current: '', next: '', confirm: '' });
    };
    return (_jsx("div", { className: "max-w-3xl mx-auto px-3 sm:px-6 py-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: [_jsxs("div", { className: "bg-[#003478] text-white p-6 flex items-center gap-4", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-news-red flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0", children: form.photo ? _jsx("img", { src: form.photo, alt: "", className: "w-full h-full object-cover" }) : currentUser.fullName[0] }), _jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "font-headline text-2xl font-bold truncate", children: currentUser.fullName }), _jsx("p", { className: "text-sm opacity-80 truncate", children: currentUser.email }), _jsx("span", { className: "inline-block mt-1 text-xs bg-white/15 px-2 py-0.5 rounded", children: "Reader Account" })] }), _jsxs("button", { onClick: () => logout(), className: "ml-auto bg-white/10 hover:bg-news-red px-3 py-2 rounded text-sm font-semibold flex items-center gap-1.5", children: [_jsx(LogOut, { size: 16 }), " Logout"] })] }), _jsx("div", { className: "flex border-b border-news-ash", children: [['profile', 'Profile', _jsx(User, { size: 16 }, "u")], ['password', 'Change Password', _jsx(Lock, { size: 16 }, "l")], ['notifications', 'Notification Settings', _jsx(Bell, { size: 16 }, "b")]].map(([id, label, icon]) => (_jsxs("button", { onClick: () => setTab(id), className: `flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === id ? 'border-news-red text-news-red' : 'border-transparent text-news-slate hover:text-news-ink'}`, children: [icon, " ", label] }, id))) }), _jsxs("div", { className: "p-6", children: [tab === 'profile' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "font-headline text-lg font-bold", children: "Profile Information" }), !editing ? (_jsxs("button", { onClick: () => setEditing(true), className: "text-sm text-news-red font-semibold flex items-center gap-1 hover:underline", children: [_jsx(Edit3, { size: 14 }), " Edit"] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setEditing(false), className: "text-sm text-news-slate flex items-center gap-1", children: [_jsx(X, { size: 14 }), " Cancel"] }), _jsxs("button", { onClick: saveProfile, className: "text-sm text-news-red font-semibold flex items-center gap-1", children: [_jsx(Save, { size: 14 }), " Save"] })] }))] }), editing && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-1", children: "Profile Photo" }), _jsxs("label", { className: "inline-flex items-center gap-2 bg-news-ash hover:bg-news-ash/70 px-3 py-2 rounded cursor-pointer text-sm", children: [_jsx(Camera, { size: 16 }), " Upload Photo", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => { const f = e.target.files?.[0]; if (f)
                                                        readFileAsDataURL(f).then((d) => setForm((p) => ({ ...p, photo: d }))); } })] })] })), _jsx(Field2, { label: "Full Name", icon: _jsx(User, { size: 16 }), value: form.fullName, editable: editing, onChange: (v) => setForm((p) => ({ ...p, fullName: v })) }), _jsx(Field2, { label: "Email", icon: _jsx(Mail, { size: 16 }), value: form.email, editable: editing, onChange: (v) => setForm((p) => ({ ...p, email: v })) }), _jsx(Field2, { label: "Mobile", icon: _jsx(Phone, { size: 16 }), value: form.mobile, editable: editing, onChange: (v) => setForm((p) => ({ ...p, mobile: v })) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: "Preferred Language" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Globe, { size: 16, className: "text-news-slate" }), editing ? (_jsx("select", { value: form.preferredLanguage, onChange: (e) => setForm((p) => ({ ...p, preferredLanguage: e.target.value })), className: "flex-1 px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-[#003478]", children: Object.keys(LANG_LABELS).map((l) => _jsx("option", { value: l, children: LANG_LABELS[l] }, l)) })) : _jsx("span", { className: "text-sm text-news-ink", children: LANG_LABELS[form.preferredLanguage] })] })] })] })), tab === 'password' && (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("h2", { className: "font-headline text-lg font-bold", children: "Change Password" }), _jsx("p", { className: "text-xs text-news-slate bg-amber-50 border border-amber-200 rounded px-3 py-2", children: "Demo only. Passwords are stored in your browser and are not transmitted anywhere." }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-1", children: "Current Password" }), _jsx("input", { type: "password", value: pwd.current, onChange: (e) => setPwd((p) => ({ ...p, current: e.target.value })), className: "w-full px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-news-red" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-1", children: "New Password" }), _jsx("input", { type: "password", value: pwd.next, onChange: (e) => setPwd((p) => ({ ...p, next: e.target.value })), className: "w-full px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-[#003478]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-1", children: "Confirm New Password" }), _jsx("input", { type: "password", value: pwd.confirm, onChange: (e) => setPwd((p) => ({ ...p, confirm: e.target.value })), className: "w-full px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-news-red" })] }), _jsxs("button", { onClick: changePwd, className: "bg-news-red hover:bg-[#00275A] text-white px-5 py-2.5 rounded font-semibold text-sm flex items-center gap-2", children: [_jsx(Save, { size: 16 }), " Update Password"] })] })), tab === 'notifications' && (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("h2", { className: "font-headline text-lg font-bold", children: "Notification Settings" }), _jsx("p", { className: "text-xs text-news-slate", children: "Choose which demo notifications you'd like to see." }), [
                                    ['breaking', 'Breaking News'],
                                    ['latest', 'Latest News'],
                                    ['local', 'Local News'],
                                    ['district', 'District Updates'],
                                ].map(([key, label]) => (_jsxs("label", { className: "flex items-center justify-between border-b border-news-ash pb-3 cursor-pointer", children: [_jsx("span", { className: "text-sm font-medium text-news-ink", children: label }), _jsx("button", { type: "button", onClick: () => setNotifSettings((p) => ({ ...p, [key]: !p[key] })), className: `w-11 h-6 rounded-full transition-colors relative ${notifSettings[key] ? 'bg-news-red' : 'bg-news-ash'}`, children: _jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifSettings[key] ? 'translate-x-5' : 'translate-x-0.5'}` }) })] }, key)))] }))] })] }) }));
}
function Field2({ label, icon, value, editable, onChange }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-news-ink mb-1", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-news-slate", children: icon }), editable ? (_jsx("input", { value: value, onChange: (e) => onChange(e.target.value), className: "flex-1 px-3 py-2.5 border-2 border-news-ash rounded text-sm focus:outline-none focus:border-news-red" })) : (_jsx("span", { className: "text-sm text-news-ink", children: value }))] })] }));
}
// keep import alive
export const _loadUsers = loadUsers;
