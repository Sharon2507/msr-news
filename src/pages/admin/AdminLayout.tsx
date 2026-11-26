
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminModule, Route } from '../../context';

import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Inbox,
  FileEdit,
  Radio,
  Folder,
  MapPin,
  Bell,
  BarChart3,
  History,
  LogOut,
  Menu,
  X,
  Newspaper,
  Globe,
} from 'lucide-react';

import { useApp } from '../../context';

type MenuItem = {
  label: string;
  icon: typeof LayoutDashboard;
  module?: AdminModule;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'User Management', icon: Users, module: 'users' },
  { label: 'Reporter Management', icon: UserCheck, module: 'reporters' },
  { label: 'KYC Verification', icon: ShieldCheck, module: 'kyc' },
  { label: 'News Queue', icon: Inbox, module: 'newsQueue' },
  { label: 'Editor Workspace', icon: FileEdit, module: 'editor' },
  { label: 'Breaking News', icon: Radio, module: 'breakingNews' },
  { label: 'Categories', icon: Folder, module: 'categories' },
  { label: 'Location Management', icon: MapPin, module: 'locations' },
  { label: 'Notifications', icon: Bell, module: 'notifications' },
  { label: 'Analytics', icon: BarChart3, module: 'analytics' },
  { label: 'Audit Log', icon: History, module: 'auditLog' },
];

export function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    adminSession,
    adminLogout,
    showToast,
    navigate,
    route,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Check which sidebar item is currently selected
  const isActive = (item: MenuItem) => {
    if (item.label === 'Dashboard') {
      return route.name === 'adminDashboard';
    }

    if (item.module && route.name === 'adminModule') {
      return route.module === item.module;
    }

    return false;
  };

  // Navigate to the selected admin page
  const handleMenuClick = (item: MenuItem) => {
    if (item.label === 'Dashboard') {
      navigate({ name: 'adminDashboard' });
      setMobileOpen(false);
      return;
    }

    if (item.module) {
      navigate({
        name: 'adminModule',
        module: item.module,
      });
    }

    setMobileOpen(false);
  };

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-gray-900">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[275px] flex-col bg-[#102B55] text-white shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-600 p-2.5">
              <Newspaper size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-wide">
                MSR NEWS
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-blue-200">
                ADMINISTRATION
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleMenuClick(item)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/20'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile and Logout */}
        <div className="border-t border-white/10 p-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                Administrator
              </p>

              <p className="truncate text-xs text-blue-200">
                {adminSession?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-600 hover:text-white"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-[275px]">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-7">

          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-200 p-2 text-[#102B55] hover:bg-blue-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                MSR NEWS / Administration
              </p>

              <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                Admin Control Panel
              </h2>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">

            <span className="hidden rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 sm:inline-flex">
              ● Demo Mode
            </span>

            <button
              type="button"
              onClick={() => {
                navigate({ name: 'home' });
                showToast('Opening public MSR NEWS website');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-[#102B55] transition hover:border-red-300 hover:text-red-600"
            >
              <Globe size={17} />
              <span className="hidden sm:inline">
                Public Website
              </span>
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
