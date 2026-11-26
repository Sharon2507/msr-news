
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../context';
import { loadUsers, saveSession } from '../storage';
import {
  AuthShell,
  Field,
  FieldError,
  inputCls,
  authText,
} from './AuthShared';

export function UserLoginPage() {
  const { navigate, showToast, lang } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const entered = identifier.trim();
    const normalized = entered.toLowerCase();

    if (!entered || !password) {
      setError('Please complete all fields.');
      return;
    }

    const users = loadUsers() || [];

    const user = users.find(
      (item: any) =>
        item.email?.trim().toLowerCase() === normalized ||
        item.mobile?.trim() === entered
    );

    if (!user) {
      setError('Account not found. Please register first.');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password.');
      return;
    }

    saveSession({
      type: 'user',
      id: user.id,
    });

    showToast?.(
      `${lang === 'te' ? 'స్వాగతం' : 'Welcome'}, ${user.fullName || 'User'}!`
    );

    navigate({ name: 'home' });
  };

  const googleDemo = () => {
    showToast?.(
      lang === 'te'
        ? 'Google సైన్ ఇన్ డెమో మాత్రమే.'
        : 'Google sign-in is a demo button.'
    );
  };

  return (
    <AuthShell
      title="User Login"
      subtitle="Sign in to your MSR NEWS account"
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
              }}
              placeholder={authText(lang, 'Enter registered email or mobile')}
              className={`${inputCls} pl-10`}
              autoComplete="username"
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

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700"
        >
          <LogIn size={18} />
          {authText(lang, 'Sign In')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {authText(lang, "Don't have an account?")}{' '}
        <button
          type="button"
          onClick={() => navigate({ name: 'userRegister' })}
          className="font-semibold text-red-600 hover:underline"
        >
          {authText(lang, 'Register')}
        </button>
      </p>
    </AuthShell>
  );
}

export default UserLoginPage;
