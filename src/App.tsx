
import { useEffect, type ReactNode } from 'react';
import { AppProvider, useApp } from './context';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import SearchPage from './pages/SearchPage';

import { CalendarPage } from './pages/CalendarPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

import { UserLoginPage } from './pages/UserAuth';
import { UserRegisterPage } from './pages/UserRegister';

import { ReporterLoginPage } from './pages/ReporterLogin';
import { ReporterRegisterPage } from './pages/ReporterRegister';
import { ReporterDashboardPage } from './pages/ReporterDashboard';

import { AudioNewsPage } from './pages/AudioNewsPage';

// Admin pages

import { AdminLoginPage } from './pages/admin/AdminLogin';
import { AdminDashboardPage } from './pages/admin/AdminDashboard';

import { AdminModulePage } from './pages/admin/AdminModulePage';

// --------------------------------------------------
// ADMIN ROUTE GUARD
// --------------------------------------------------

function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { adminSession, navigate } = useApp();

  useEffect(() => {
    if (!adminSession?.loggedIn) {
      navigate({ name: 'adminLogin' });
    }
  }, [adminSession, navigate]);

  if (!adminSession?.loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#102B55]" />
          <p className="font-semibold text-gray-600">
            Redirecting to admin login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// --------------------------------------------------
// MAIN ROUTER
// --------------------------------------------------

function Router() {
  const { route } = useApp();

  switch (route.name) {
    // Public website
    case 'home':
      return <HomePage />;

    case 'category':
      return <CategoryPage category={route.category} />;

    case 'audioNews':
      return <AudioNewsPage />;

    case 'article':
      return <ArticleDetailPage id={route.id} />;

    case 'search':
      return <SearchPage/>;

    case 'calendar':
      return <CalendarPage />;

    case 'notifications':
      return <NotificationsPage />;

    case 'profile':
      return <ProfilePage />;

    // User authentication
    case 'login':
      return <UserLoginPage />;

    case 'userRegister':
      return <UserRegisterPage />;

    // Reporter authentication
    case 'reporterLogin':
      return <ReporterLoginPage />;

    case 'reporterRegister':
      return <ReporterRegisterPage />;

    case 'reporterDashboard':
      return <ReporterDashboardPage />;

    case 'otp':
      return <HomePage />;

    // Admin authentication
    case 'adminLogin':
      return <AdminLoginPage />;

    // Admin dashboard
    case 'adminDashboard':
      return (
        <AdminRouteGuard>
          <AdminDashboardPage />
        </AdminRouteGuard>
      );

    // All admin sidebar modules
    case 'adminModule':
      return (
        <AdminRouteGuard>
          <AdminModulePage module={route.module} />
        </AdminRouteGuard>
      );

    default:
      return <HomePage />;
  }
}

// --------------------------------------------------
// TOAST NOTIFICATION
// --------------------------------------------------

function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 animate-fadeIn rounded-lg bg-news-ink px-5 py-3 text-sm font-medium text-white shadow-headline">
      {toast}
    </div>
  );
}

// --------------------------------------------------
// APPLICATION SHELL
// --------------------------------------------------

function Shell() {
  const { route } = useApp();

  const isAuthPage =
    route.name === 'login' ||
    route.name === 'userRegister' ||
    route.name === 'reporterLogin' ||
    route.name === 'reporterRegister' ||
    route.name === 'otp';

  const isAdminPage =
    route.name === 'adminLogin' ||
    route.name === 'adminDashboard' ||
    route.name === 'adminModule';

  return (
    <div className="flex min-h-screen flex-col bg-news-paper">
      {!isAdminPage && <Header />}

      <main className="flex-1">
        <Router />
      </main>

      {!isAuthPage && !isAdminPage && <Footer />}

      <Toast />
    </div>
  );
}

// --------------------------------------------------
// ROOT APP
// --------------------------------------------------

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
