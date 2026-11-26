
import { useState } from 'react';
import {
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Info,
} from 'lucide-react';

import { useApp } from '../context';
import { loadReporters, saveSession } from '../storage';

import {
  AuthShell,
  Field,
  FieldError,
  inputCls,
  authText,
} from './AuthShared';

export function ReporterLoginPage() {
  const { navigate, showToast, refreshSession, lang } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState<any>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setStatusMessage(null);

    const entered = identifier.trim();
    const normalized = entered.toLowerCase();
    const enteredReporterId = reporterId.trim();

    if (!entered || !enteredReporterId || !password) {
      setError('Please complete all fields.');
      return;
    }

    const reporters = loadReporters() || [];

    const reporter = reporters.find(
      (item: any) =>
        item.email?.trim().toLowerCase() === normalized ||
        item.mobile?.trim() === entered
    );

    if (!reporter) {
      setError('Reporter account not found. Please register first.');
      return;
    }

    if (reporter.reporterId?.trim() !== enteredReporterId) {
      setError('Reporter ID does not match.');
      return;
    }

    if (reporter.password !== password) {
      setError('Incorrect password.');
      return;
    }

    const status = reporter.verificationStatus || 'Pending Verification';

    if (status === 'Rejected') {
      setStatusMessage({
        type: 'error',
        text: 'Your reporter application was rejected. Please contact the MSR NEWS desk.',
      });
      return;
    }

    if (status !== 'Approved') {
      setStatusMessage({
        type: 'pending',
        text:
          status === 'Under Review'
            ? 'Your documents are under review. Dashboard access will be available after approval.'
            : 'Your account is pending verification. Dashboard access will be available after approval.',
      });
      return;
    }

    saveSession({ type: 'reporter', id: reporter.id });
    refreshSession?.();

    showToast?.(
      `${lang === 'te' ? 'స్వాగతం' : 'Welcome'}, ${reporter.fullName || 'Reporter'}!`
    );

    navigate({ name: 'reporterDashboard' });
  };

  const googleDemo = () => {
    showToast?.(
      lang === 'te'
        ? 'Google సైన్ ఇన్ డెమో మాత్రమే. రిపోర్టర్ ఐడి మరియు ఆమోదం అవసరం.'
        : 'Google sign-in is a demo button. Reporter ID and approval checks are still required.'
    );
  };

  return (
    <AuthShell
      title="Reporter Login"
      subtitle="Sign in to your MSR NEWS reporter account"
      onGoogleClick={googleDemo}
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email or Mobile Number">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError('');
                setStatusMessage(null);
              }}
              placeholder={authText(lang, 'Enter registered email or mobile')}
              className={`${inputCls} pl-10`}
              autoComplete="username"
              required
            />
          </div>
        </Field>

        <Field label="Reporter ID">
          <div className="relative">
            <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={reporterId}
              onChange={(e) => {
                setReporterId(e.target.value);
                setError('');
                setStatusMessage(null);
              }}
              placeholder={authText(lang, 'Enter your Reporter ID')}
              className={`${inputCls} pl-10`}
              required
            />
          </div>
        </Field>

        <Field label="Password">
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
                setStatusMessage(null);
              }}
              placeholder={authText(lang, 'Enter your password')}
              className={`${inputCls} pl-10 pr-12`}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={authText(lang, showPassword ? 'Hide password' : 'Show password')}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <FieldError>{error}</FieldError>

        {statusMessage && (
          <div
            className={`flex gap-3 rounded-xl border p-4 text-sm ${
              statusMessage.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
          >
            {statusMessage.type === 'error'
              ? <AlertCircle size={19} className="shrink-0" />
              : <Info size={19} className="shrink-0" />}
            <p>{authText(lang, statusMessage.text)}</p>
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
        >
          <LogIn size={18} />
          {authText(lang, 'Reporter Sign In')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {authText(lang, "Don't have a reporter account?")}{' '}
        <button
          type="button"
          onClick={() => navigate({ name: 'reporterRegister' })}
          className="font-semibold text-red-600 hover:underline"
        >
          {authText(lang, 'Register as Reporter')}
        </button>
      </p>
    </AuthShell>
  );
}

export default ReporterLoginPage;
