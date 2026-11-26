
// @ts-nocheck

import { useState, useRef, useEffect } from 'react';

import {
  Newspaper,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Globe,
  MapPin,
  CalendarDays,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Headphones,
} from 'lucide-react';

import { useApp } from '../context';

import {
  DISTRICTS,
  LOCATIONS,
  CATEGORIES,
} from '../types';

import { loadNotifications } from '../storage';

export function Header() {
  const {
    t,
    lang,
    setLang,
    navigate,
    session,
    currentUser,
    currentReporter,
    logout,
    location,
    setLocation,
    district,
    setDistrict,
  } = useApp();

  const [searchQ, setSearchQ] = useState('');
  const [showLang, setShowLang] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(false);

  const langRef = useRef(null);
  const locRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const notifs = loadNotifications();
  const unread = notifs.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      const target = e.target;

      if (langRef.current && !langRef.current.contains(target)) {
        setShowLang(false);
      }

      if (locRef.current && !locRef.current.contains(target)) {
        setShowLoc(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false);
      }

      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifs(false);
      }
    };

    document.addEventListener('mousedown', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  // Search functionality
  const submitSearch = (e) => {
    e.preventDefault();

    if (searchQ.trim()) {
      navigate({
        name: 'search',
        q: searchQ.trim(),
      });
    }
  };

  // Weather follows selected location
  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    async function getWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError(false);

        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
          { signal: controller.signal }
        );

        if (!geoResponse.ok) {
          throw new Error('Location lookup failed');
        }

        const geoData = await geoResponse.json();
        const place = geoData.results?.[0];

        if (!place) {
          throw new Error('Location not found');
        }

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`,
          { signal: controller.signal }
        );

        if (!weatherResponse.ok) {
          throw new Error('Weather unavailable');
        }

        const weatherData = await weatherResponse.json();

        setWeather({
          temperature: Math.round(
            weatherData.current.temperature_2m
          ),
          code: weatherData.current.weather_code,
          place: place.name,
        });

      } catch (error) {
        if (error.name !== 'AbortError') {
          setWeather(null);
          setWeatherError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setWeatherLoading(false);
        }
      }
    }

    getWeather();

    return () => controller.abort();
  }, [location]);

  // Category navigation
  const handleCategoryClick = (cat) => {
    if (cat === 'Audio News') {
      navigate({ name: 'audioNews' });
    } else if (cat === 'Home') {
      navigate({ name: 'home' });
    } else {
      navigate({
        name: 'category',
        category: cat,
      });
    }
  };

  return (
    <header className="bg-[#003478] border-b-4 border-[#d71920] sticky top-0 z-50 shadow-card">

      {/* MAIN HEADER */}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4">

        {/* MSR NEWS LOGO */}

        <button
          type="button"
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="bg-[#d71920] text-white p-1.5 rounded">
            <Newspaper size={24} />
          </div>

          <div className="text-left">
            <div className="font-headline text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
              MSR <span className="text-[#d71920]">NEWS</span>
            </div>

            <div className="text-[10px] sm:text-xs text-[#f7d04e] italic leading-tight">
              {t('Every Village, Every Story') || 'Bringing Truth to Light'}
            </div>
          </div>
        </button>

        {/* DESKTOP SEARCH */}

        <form
          onSubmit={submitSearch}
          className="flex-1 min-w-0 max-w-2xl hidden md:flex items-center"
        >
          <div className="flex w-full">

            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={t('common.search')}
              className="flex-1 min-w-0 px-4 py-2.5 border-2 border-news-ink border-r-0 rounded-l text-sm focus:outline-none focus:border-news-red"
            />

            <button
              type="submit"
              className="bg-news-ink hover:bg-news-red text-white px-5 rounded-r flex items-center gap-1.5 transition-colors font-semibold text-sm"
            >
              <Search size={16} />

              <span className="hidden lg:inline">
                {t('common.searchBtn')}
              </span>
            </button>

          </div>
        </form>

        {/* LANGUAGE, WEATHER, LOCATION AND CALENDAR */}

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          {/* LANGUAGE */}

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => {
                setShowLang((s) => !s);
                setShowLoc(false);
              }}
              className="flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-red-600 text-white transition-colors"
              aria-label="Select language"
              title="Select language"
            >
              <Globe size={19} />

              <span className="hidden xl:inline text-sm font-medium">
                {lang === 'te' ? 'తెలుగు' : 'English'}
              </span>

              <ChevronDown size={14} />
            </button>

            {showLang && (
              <div className="absolute right-0 top-full mt-2 bg-white text-news-ink rounded-md shadow-headline py-1 w-36 z-[60] animate-fadeIn">

                {[
                  { value: 'en', label: 'English' },
                  { value: 'te', label: 'తెలుగు' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => {
                      setLang(item.value);
                      setShowLang(false);
                    }}
                    className={`block w-full text-left px-3 py-2 hover:bg-news-ash text-sm ${
                      lang === item.value ? 'font-bold text-news-red' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

              </div>
            )}
          </div>

          {/* WEATHER */}

          <div
            className="flex items-center gap-1.5 px-2 py-2 text-white"
            title={weather ? `${weather.place}: ${weather.temperature}°C` : 'Weather'}
            aria-live="polite"
          >
            {weatherLoading ? (
              <CloudSun size={20} className="animate-pulse" />
            ) : weather ? (
              <>
                <WeatherIcon code={weather.code} />

                <span className="text-sm font-semibold whitespace-nowrap">
                  {weather.temperature}°C
                </span>

                <span className="hidden xl:inline text-xs max-w-[85px] truncate">
                  {weather.place}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1 text-xs">
                <CloudSun size={20} />
                <span className="hidden xl:inline">
                  {weatherError ? 'N/A' : 'Weather'}
                </span>
              </span>
            )}
          </div>

          {/* LOCATION */}

          <div className="relative" ref={locRef}>
            <button
              type="button"
              onClick={() => {
                setShowLoc((s) => !s);
                setShowLang(false);
              }}
              className="flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-red-600 text-white transition-colors"
            >
              <MapPin size={19} />

              <span className="hidden xl:inline text-sm font-medium max-w-[110px] truncate">
                {district}
              </span>

              <ChevronDown size={14} />
            </button>

            {showLoc && (
              <div className="absolute right-0 top-full mt-2 bg-white text-news-ink rounded-md shadow-headline py-1 w-48 max-h-72 overflow-auto z-[60] animate-fadeIn">

                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-news-slate font-semibold">
                  {t('header.location')}
                </div>

                {LOCATIONS.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => {
                      setLocation(l);
                      setShowLoc(false);
                    }}
                    className={`block w-full text-left px-3 py-2 hover:bg-news-ash text-xs ${
                      location === l ? 'font-bold text-news-red' : ''
                    }`}
                  >
                    {l}
                  </button>
                ))}

                <div className="border-t border-news-ash my-1" />

                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-news-slate font-semibold">
                  {t('header.district')}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDistrict('All Districts');
                    setShowLoc(false);
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-news-ash text-xs ${
                    district === 'All Districts' ? 'font-bold text-news-red' : ''
                  }`}
                >
                  {t('header.allDistricts')}
                </button>

                {DISTRICTS.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setDistrict(d);
                      setShowLoc(false);
                    }}
                    className={`block w-full text-left px-3 py-2 hover:bg-news-ash text-xs ${
                      district === d ? 'font-bold text-news-red' : ''
                    }`}
                  >
                    {d}
                  </button>
                ))}

              </div>
            )}
          </div>

          {/* CALENDAR */}

          <button
            type="button"
            onClick={() => navigate({ name: 'calendar' })}
            className="p-2 rounded-lg hover:bg-red-600 text-white transition-colors"
            aria-label="Open calendar"
            title="Calendar"
          >
            <CalendarDays size={20} />
          </button>

        </div>

        {/* NOTIFICATIONS AND PROFILE */}

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">

          {/* NOTIFICATIONS */}

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifs((s) => !s)}
              className="relative p-2 hover:bg-red-600 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-white" />

              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-news-red text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulseRed">
                  {unread}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 bg-white text-news-ink rounded-md shadow-headline w-80 max-w-[90vw] animate-fadeIn">

                <div className="flex items-center justify-between px-4 py-2.5 border-b border-news-ash">
                  <span className="font-bold text-sm">
                    {t('common.notifications')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifs(false);
                      navigate({ name: 'notifications' });
                    }}
                    className="text-xs text-news-red hover:underline"
                  >
                    {t('common.viewAll')}
                  </button>
                </div>

                <div className="max-h-80 overflow-auto">

                  {notifs.length === 0 && (
                    <p className="px-4 py-4 text-xs text-news-slate">
                      No notifications available.
                    </p>
                  )}

                  {notifs.slice(0, 5).map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => {
                        setShowNotifs(false);

                        if (n.articleId) {
                          navigate({
                            name: 'article',
                            id: n.articleId,
                          });
                        } else {
                          navigate({ name: 'notifications' });
                        }
                      }}
                      className={`block w-full text-left px-4 py-2.5 border-b border-news-ash/60 hover:bg-news-ash/40 ${
                        !n.read ? 'bg-news-red/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">

                        {!n.read && (
                          <span className="bg-news-red rounded-full w-2 h-2 mt-1.5 shrink-0" />
                        )}

                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-news-ink truncate">
                            {n.title}
                          </div>

                          <div className="text-[11px] text-news-slate truncate">
                            {n.body}
                          </div>
                        </div>

                      </div>
                    </button>
                  ))}

                </div>
              </div>
            )}
          </div>

          {/* PROFILE / SIGN IN */}

          <div className="relative" ref={profileRef}>

            {session?.type ? (

              <button
                type="button"
                onClick={() => setShowProfile((s) => !s)}
                className="flex items-center gap-2 bg-white hover:bg-red-50 px-2 sm:px-3 py-1.5 rounded-full transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#d71920] text-white flex items-center justify-center text-xs font-bold overflow-hidden">

                  {currentUser?.photo || currentReporter?.photo ? (
                    <img
                      src={currentUser?.photo || currentReporter?.photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser?.fullName?.[0] ||
                    currentReporter?.fullName?.[0] ||
                    'U'
                  )}

                </div>

                <span className="text-xs font-semibold text-news-ink hidden sm:inline max-w-[100px] truncate">
                  {currentUser?.fullName?.split(' ')[0] ||
                    currentReporter?.fullName?.split(' ')[0]}
                </span>

                <ChevronDown size={14} className="text-news-slate" />

              </button>

            ) : (

              <button
                type="button"
                onClick={() => setShowProfile((s) => !s)}
                className="flex items-center gap-1.5 bg-[#d71920] hover:bg-news-red text-white px-3 sm:px-4 py-2 rounded-full transition-colors text-sm font-semibold"
              >
                <User size={16} />

                <span className="hidden sm:inline">
                  {t('common.signIn')}
                </span>
              </button>

            )}

            {showProfile && (
              <div className="absolute right-0 top-12 bg-white text-news-ink rounded-md shadow-headline w-52 animate-fadeIn py-1">

                {session?.type ? (

                  <>
                    <div className="px-4 py-2 border-b border-news-ash">

                      <div className="text-sm font-semibold truncate">
                        {currentUser?.fullName || currentReporter?.fullName}
                      </div>

                      <div className="text-[11px] text-news-slate truncate">
                        {currentUser?.email || currentReporter?.email}
                      </div>

                      {session.type === 'reporter' && currentReporter && (
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-news-red">
                          {currentReporter.verificationStatus}
                        </div>
                      )}

                    </div>

                    {session.type === 'user' && (
                      <MenuItem
                        icon={<User size={14} />}
                        label={t('common.profile')}
                        onClick={() => {
                          setShowProfile(false);
                          navigate({ name: 'profile' });
                        }}
                      />
                    )}

                    {session.type === 'reporter' && (
                      <MenuItem
                        icon={<Newspaper size={14} />}
                        label={t('ReporterDashboard')}
                        onClick={() => {
                          setShowProfile(false);
                          navigate({ name: 'reporterDashboard' });
                        }}
                      />
                    )}

                    <MenuItem
                      icon={<LogOut size={14} />}
                      label={t('common.logout')}
                      onClick={() => {
                        setShowProfile(false);
                        logout();
                      }}
                      danger
                    />
                  </>

                ) : (

                  <>
                    <MenuItem
                      icon={<User size={14} />}
                      label={t('UserLogin')}
                      onClick={() => {
                        setShowProfile(false);
                        navigate({ name: 'login' });
                      }}
                    />

                    <MenuItem
                      icon={<Newspaper size={14} />}
                      label={t('ReporterLogin')}
                      onClick={() => {
                        setShowProfile(false);
                        navigate({ name: 'reporterLogin' });
                      }}
                    />

                    <div className="border-t border-news-ash my-1" />

                    <MenuItem
                      icon={<User size={14} />}
                      label={t('UserRegister')}
                      onClick={() => {
                        setShowProfile(false);
                        navigate({ name: 'userRegister' });
                      }}
                    />

                    <MenuItem
                      icon={<Newspaper size={14} />}
                      label={('ReporterRegister')}
                      onClick={() => {
                        setShowProfile(false);
                        navigate({ name: 'reporterRegister' });
                      }}
                    />
                  </>

                )}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* MOBILE SEARCH */}

      <div className="md:hidden px-3 pb-3">
        <form onSubmit={submitSearch} className="flex w-full">

          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t('common.search')}
            className="flex-1 min-w-0 px-3 py-2 border-2 border-news-ink border-r-0 rounded-l text-sm focus:outline-none focus:border-news-red"
          />

          <button
            type="submit"
            className="bg-news-ink hover:bg-news-red text-white px-4 rounded-r transition-colors"
          >
            <Search size={16} />
          </button>

        </form>
      </div>

      {/* CATEGORY NAVIGATION - AUDIO NEWS ALWAYS VISIBLE */}

      <nav className="bg-black text-white border-t border-white/20">
        <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto no-scrollbar">

          {[
            ...CATEGORIES.filter((cat) => cat !== 'Audio News'),
            'Audio News',
          ].map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="shrink-0 px-4 py-3 text-sm font-semibold whitespace-nowrap text-white hover:bg-red-600 transition-colors flex items-center gap-1.5"
            >
              {cat === 'Audio News' ? (
                <>
                  <Headphones size={16} />
                  <span>Audio News</span>
                </>
              ) : (
                t(`nav.${cat}`)
              )}
            </button>
          ))}

        </div>
      </nav>

    </header>
  );
}

// WEATHER ICON

function WeatherIcon({ code }) {
  if (code === 0) return <Sun size={20} />;
  if (code <= 3) return <CloudSun size={20} />;
  if (code <= 48) return <CloudFog size={20} />;
  if (code <= 57) return <CloudDrizzle size={20} />;

  if (code <= 67 || (code >= 80 && code <= 82)) {
    return <CloudRain size={20} />;
  }

  if (code <= 77) return <CloudSnow size={20} />;
  if (code >= 95) return <CloudLightning size={20} />;

  return <Cloud size={20} />;
}

// MENU ITEM COMPONENT

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-news-ash transition-colors ${
        danger
          ? 'text-news-red hover:bg-news-red/10'
          : 'text-news-ink'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Header;
