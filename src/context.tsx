
import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

import type { Language } from './types';
import * as store from './storage';
import { loadLanguage, saveLanguage } from './storage';
import { tr } from './utils';

// --------------------------------------------------
// ADMIN MODULE TYPE
// --------------------------------------------------

export type AdminModule =
  | 'users'
  | 'reporters'
  | 'kyc'
  | 'newsQueue'
  | 'editor'
  | 'breakingNews'
  | 'categories'
  | 'locations'
  | 'notifications'
  | 'analytics'
  | 'auditLog';

// --------------------------------------------------
// ROUTE TYPE
// --------------------------------------------------

export type Route =
  | { name: 'home' }
  | { name: 'audioNews' }
  | { name: 'category'; category: string }
  | { name: 'article'; id: string }
  | { name: 'search'; q: string }
  | { name: 'calendar' }
  | { name: 'notifications' }
  | { name: 'profile' }
  | { name: 'login' }
  | { name: 'userRegister' }
  | { name: 'otp'; mode: 'user' | 'reporter'; pendingRoute?: Route }
  | { name: 'reporterLogin' }
  | { name: 'reporterRegister' }
  | { name: 'reporterDashboard' }
  | { name: 'adminLogin' }
  | { name: 'adminDashboard' }
  | { name: 'adminCategories' }
  | { name: 'adminModule'; module: AdminModule };

// --------------------------------------------------
// ADMIN SESSION
// --------------------------------------------------

interface AdminSession {
  email: string;
  loggedIn: boolean;
}

// --------------------------------------------------
// APP CONTEXT TYPE
// --------------------------------------------------

interface AppContextType {
  route: Route;
  navigate: (r: Route) => void;

  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;

  location: string;
  setLocation: (l: string) => void;

  district: string;
  setDistrict: (d: string) => void;

  session: {
    type: 'user' | 'reporter' | null;
    id: string | null;
  };

  refreshSession: () => void;
  logout: () => void;

  currentUser: store.UserAccount | null;
  currentReporter: store.ReporterAccount | null;

  adminSession: AdminSession | null;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
}

// --------------------------------------------------
// HASH ROUTING
// --------------------------------------------------

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '');

  if (!hash || hash === '/') {
    return { name: 'home' };
  }

  if (hash === '/admin-login') {
    return { name: 'adminLogin' };
  }

  if (hash === '/admin/dashboard') {
    return { name: 'adminDashboard' };
  }

  if (hash === '/admin/categories') {
    return { name: 'adminCategories' };
  }

  // Admin module routes
  const adminModuleMatch = hash.match(/^\/admin\/module\/([^/?]+)/);

  if (adminModuleMatch) {
    const moduleName = decodeURIComponent(adminModuleMatch[1]);

    const validModules: AdminModule[] = [
      'users',
      'reporters',
      'kyc',
      'newsQueue',
      'editor',
      'breakingNews',
      'categories',
      'locations',
      'notifications',
      'analytics',
      'auditLog',
    ];

    if (validModules.includes(moduleName as AdminModule)) {
      return {
        name: 'adminModule',
        module: moduleName as AdminModule,
      };
    }
  }

  const [path, query] = hash.split('?');
  const parts = path.split('/').filter(Boolean);

  if (!parts.length) {
    return { name: 'home' };
  }

  switch (parts[0]) {
    case 'home':
      return { name: 'home' };

    case 'audioNews':
      return { name: 'audioNews' };

    case 'category':
      return {
        name: 'category',
        category: decodeURIComponent(parts[1] ?? 'Home'),
      };

    case 'article':
      return {
        name: 'article',
        id: parts[1] ?? '',
      };

    case 'search':
      return {
        name: 'search',
        q: decodeURIComponent(query?.split('=')[1] ?? ''),
      };

    case 'calendar':
      return { name: 'calendar' };

    case 'notifications':
      return { name: 'notifications' };

    case 'profile':
      return { name: 'profile' };

    case 'login':
      return { name: 'login' };

    case 'userRegister':
      return { name: 'userRegister' };

    case 'reporterLogin':
      return { name: 'reporterLogin' };

    case 'reporterRegister':
      return { name: 'reporterRegister' };

    case 'reporterDashboard':
      return { name: 'reporterDashboard' };

    case 'otp':
      return {
        name: 'otp',
        mode: parts[1] === 'reporter' ? 'reporter' : 'user',
      };

    default:
      return { name: 'home' };
  }
}

// --------------------------------------------------
// ROUTE TO HASH
// --------------------------------------------------

function routeToHash(r: Route): string {
  switch (r.name) {
    case 'home':
      return '#/';

    case 'audioNews':
      return '#/audioNews';

    case 'category':
      return `#/category/${encodeURIComponent(r.category)}`;

    case 'article':
      return `#/article/${r.id}`;

    case 'search':
      return `#/search?q=${encodeURIComponent(r.q)}`;

    case 'calendar':
      return '#/calendar';

    case 'notifications':
      return '#/notifications';

    case 'profile':
      return '#/profile';

    case 'login':
      return '#/login';

    case 'userRegister':
      return '#/userRegister';

    case 'reporterLogin':
      return '#/reporterLogin';

    case 'reporterRegister':
      return '#/reporterRegister';

    case 'reporterDashboard':
      return '#/reporterDashboard';

    case 'otp':
      return `#/otp/${r.mode}`;

    case 'adminLogin':
      return '#/admin-login';

    case 'adminDashboard':
      return '#/admin/dashboard';

    case 'adminCategories':
      return '#/admin/categories';

    case 'adminModule':
      return `#/admin/module/${encodeURIComponent(r.module)}`;
  }
}

// --------------------------------------------------
// LOAD ADMIN SESSION
// --------------------------------------------------

function loadAdminSession(): AdminSession | null {
  try {
    const saved = localStorage.getItem('msr_demo_admin_session');

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (parsed?.loggedIn === true && parsed?.email) {
      return parsed as AdminSession;
    }

    return null;
  } catch {
    return null;
  }
}

// --------------------------------------------------
// APP PROVIDER
// --------------------------------------------------

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [route, setRoute] = useState<Route>(parseHash);

  const [lang, setLangState] = useState<Language>(loadLanguage());

  const [location, setLocationState] = useState<string>(
    store.loadLocation()
  );

  const [district, setDistrictState] = useState<string>(
    store.loadDistrict()
  );

  const [session, setSession] = useState(store.loadSession());

  const [adminSession, setAdminSession] = useState<AdminSession | null>(
    loadAdminSession
  );

  const [toast, setToast] = useState<string | null>(null);

  // Listen to browser URL changes
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
    };

    window.addEventListener('hashchange', onHash);

    return () => {
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // Scroll to top after navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const navigate = useCallback((r: Route) => {
    const nextHash = routeToHash(r);

    if (window.location.hash === nextHash) {
      setRoute(parseHash());
    } else {
      window.location.hash = nextHash;
    }
  }, []);

  // Language
  const setLang = useCallback((l: Language) => {
    setLangState(l);
    saveLanguage(l);
  }, []);

  // Location
  const setLocation = useCallback((l: string) => {
    setLocationState(l);
    store.saveLocation(l);
  }, []);

  // District
  const setDistrict = useCallback((d: string) => {
    setDistrictState(d);
    store.saveDistrict(d);
  }, []);

  // User and reporter session
  const refreshSession = useCallback(() => {
    setSession(store.loadSession());
  }, []);

  const logout = useCallback(() => {
    store.saveSession({ type: null, id: null });
    setSession({ type: null, id: null });
    navigate({ name: 'home' });
  }, [navigate]);

  // Admin login - frontend demo
  const adminLogin = useCallback(
    (email: string, password: string): boolean => {
      const validEmail = 'admin@msrnews.com';
      const validPassword = 'Admin@123';

      if (
        email.trim().toLowerCase() === validEmail &&
        password === validPassword
      ) {
        const newSession: AdminSession = {
          email: validEmail,
          loggedIn: true,
        };

        localStorage.setItem(
          'msr_demo_admin_session',
          JSON.stringify(newSession)
        );

        setAdminSession(newSession);

        return true;
      }

      return false;
    },
    []
  );

  const adminLogout = useCallback(() => {
    localStorage.removeItem('msr_demo_admin_session');
    setAdminSession(null);
    navigate({ name: 'adminLogin' });
  }, [navigate]);

  // Toast notification
  const showToast = useCallback((msg: string) => {
    setToast(msg);

    window.setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  // Current user
  const currentUser =
    session.type === 'user' && session.id
      ? store.loadUsers().find((u) => u.id === session.id) ?? null
      : null;

  // Current reporter
  const currentReporter =
    session.type === 'reporter' && session.id
      ? store.loadReporters().find((r) => r.id === session.id) ?? null
      : null;

  // Context value
  const ctx: AppContextType = {
    route,
    navigate,

    lang,
    setLang,
    t: (key: string) => tr(lang, key),

    location,
    setLocation,

    district,
    setDistrict,

    session,
    refreshSession,
    logout,

    currentUser,
    currentReporter,

    adminSession,
    adminLogin,
    adminLogout,

    toast,
    showToast,
  };

  return (
    <AppContext.Provider value={ctx}>
      {children}
    </AppContext.Provider>
  );
}
