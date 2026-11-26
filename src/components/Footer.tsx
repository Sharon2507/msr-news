// @ts-nocheck
import {
  Newspaper,
  Info,
  ShieldCheck,
  Youtube,
  Instagram,
  Facebook,
} from 'lucide-react';

import { useApp } from '../context';
import { CATEGORIES } from '../types';
import { resetAll } from '../storage';

export function Footer() {
  const { navigate, t, showToast } = useApp();

  return (
    <footer className="bg-[#003478] text-white mt-0">
      <div className="h-1 w-full bg-black"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#d71920] text-white p-1.5 rounded">
                <Newspaper size={20} />
              </div>
              <div className="font-headline text-2xl font-black">
                MSR <span className="text-[#d71920]">NEWS</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Bringing Truth to Light.
              A digital newspaper covering politics,
              sports, finance, local and district news.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#d71920]">Sections</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {CATEGORIES.slice(0, 8).map((c) => (
                <button key={c} onClick={() => navigate({ name: 'category', category: c })} className="text-sm opacity-80 hover:opacity-100 hover:text-[#f7d04e] transition text-left">
                  {t(`nav.${c}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#d71920]">More</h4>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => navigate({ name: 'calendar' })} className="text-sm opacity-80 hover:opacity-100 hover:text-[#f7d04e] transition text-left">{t('common.calendar')}</button>
              <button onClick={() => navigate({ name: 'notifications' })} className="text-sm opacity-80 hover:opacity-100 hover:text-[#f7d04e] transition text-left">{t('common.notifications')}</button>
              <button onClick={() => navigate({ name: 'reporterRegister' })} className="text-sm opacity-80 hover:opacity-100 hover:text-[#f7d04e] transition text-left">Register as Reporter</button>
              <button onClick={() => navigate({ name: 'category', category: 'Headlines' })} className="text-sm opacity-80 hover:opacity-100 hover:text-[#f7d04e] transition text-left">{t('nav.Headlines')}</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#d71920]">About this demo</h4>
            <div className="flex items-start gap-2 text-xs opacity-80 mb-2">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>OTP, identity verification and face verification are simulated demonstrations, not real security checks.</span>
            </div>
            <div className="flex items-start gap-2 text-xs opacity-80 mb-3">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              <span>No backend, database or external service is connected. All data is stored in your browser only.</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset all demo data (accounts, submissions, notifications, preferences)?')) {
                  resetAll();
                  showToast('Demo data reset. Reloading...');
                  setTimeout(() => window.location.reload(), 800);
                }
              }}
              className="text-xs bg-white/10 hover:bg-[#d71920] px-3 py-1.5 rounded transition-colors"
            >
              {t('common.resetDemo')}
            </button>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-7">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-[#f7d04e]">Download Our App</h4>
              <a href="#" aria-label="Google Play Store" title="Google Play Store" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-[#f7d04e] transition hover:scale-110">
                <svg viewBox="0 0 512 512" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="#00D7FE" d="M48 32 L280 256 L48 480 Q32 472 32 448 L32 64 Q32 40 48 32Z" />
                  <path fill="#00F076" d="M48 32 L330 190 L280 256Z" />
                  <path fill="#FFCE00" d="M280 256 L330 190 L460 230 Q496 256 460 282 L330 322Z" />
                  <path fill="#F53349" d="M280 256 L330 322 L48 480Z" />
                </svg>
              </a>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-[#f7d04e]">Follow Us</h4>
              <div className="flex items-center justify-center gap-4">
                <a href="#" aria-label="YouTube" title="YouTube" className="w-11 h-11 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition"><Youtube size={23} className="text-white" /></a>
                <a href="#" aria-label="Instagram" title="Instagram" className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center hover:scale-110 transition"><Instagram size={23} className="text-white" /></a>
                <a href="#" aria-label="Facebook" title="Facebook" className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition"><Facebook size={23} className="text-white" /></a>
                <a href="#" aria-label="X" title="X" className="w-11 h-11 rounded-full bg-black flex items-center justify-center hover:scale-110 transition"><span className="text-white text-xl font-bold">𝕏</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-7 pt-5 text-center text-xs opacity-60">
          © {new Date().getFullYear()} MSR NEWS — Bringing Truth to Light.
        </div>
      </div>
    </footer>
  );
}
