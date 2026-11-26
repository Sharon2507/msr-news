import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context';
import { AuthShell } from './UserAuth';

const DEMO_OTP = '123456';

export function OtpPage({ mode }: { mode: 'user' | 'reporter' }) {
  const { navigate, showToast, refreshSession, logout } = useApp();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resends, setResends] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) { setError('Enter all 6 digits'); return; }
    if (code !== DEMO_OTP) { setError('Incorrect OTP. Use the demo OTP 123456.'); return; }
    setError('');
    setVerified(true);
    showToast('OTP verified successfully!');
    refreshSession();
    setTimeout(() => navigate(mode === 'reporter' ? { name: 'reporterDashboard' } : { name: 'home' }), 1500);
  };

  const resend = () => {
    setResends((r) => r + 1);
    setError('');
    showToast(`Demo OTP resent: ${DEMO_OTP}`);
  };

  if (verified) {
    return (
      <AuthShell title="Verified" subtitle="Demo OTP verification successful">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h2 className="font-headline text-xl font-bold text-news-ink">Verification Complete</h2>
          <p className="text-sm text-news-slate mt-1">Redirecting you now...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={mode === 'reporter' ? 'Reporter OTP Verification' : 'OTP Verification'} subtitle="Demo verification — no real SMS is sent">
      <div className="bg-news-red/10 border border-news-red/30 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
        <ShieldCheck size={18} className="text-news-red shrink-0 mt-0.5" />
        <div className="text-xs text-news-ink">
          <strong className="text-news-red">Demo Verification.</strong> Your simulated OTP is{' '}
          <span className="font-mono font-bold tracking-widest text-news-red text-base">{DEMO_OTP}</span>. Enter it below.
        </div>
      </div>

      <form onSubmit={verify} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-news-ink mb-2">Enter 6-digit OTP</label>
          <div className="flex gap-2 justify-between">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKey(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-news-ash rounded focus:outline-none focus:border-news-red transition-colors"
              />
            ))}
          </div>
          {error && <p className="text-xs text-news-red mt-2 font-medium">{error}</p>}
        </div>

        <button type="submit" className="w-full bg-news-red hover:bg-news-redDark text-white font-semibold py-2.5 rounded transition-colors flex items-center justify-center gap-2">
          <KeyRound size={18} /> Verify OTP
        </button>

        <div className="text-center text-sm">
          <button type="button" onClick={resend} className="text-news-red hover:underline inline-flex items-center gap-1">
            <RefreshCw size={14} /> Resend OTP {resends > 0 && <span className="text-news-slate">(sent {resends}x)</span>}
          </button>
        </div>

        <div className="text-center text-xs text-news-slate pt-2 border-t border-news-ash">
          <button type="button" onClick={() => { logout(); }} className="hover:text-news-red">Cancel and return to home</button>
        </div>
      </form>
    </AuthShell>
  );
}
