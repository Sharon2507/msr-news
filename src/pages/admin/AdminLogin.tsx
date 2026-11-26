
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Newspaper,
  ShieldAlert,
} from 'lucide-react';

import { useApp } from '../../context';

export function AdminLoginPage() {
  const { adminLogin, navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    const success = adminLogin(email, password);

    if (success) {
      showToast('Welcome to MSR NEWS Admin Panel!');
      navigate({ name: 'adminDashboard' });
      return;
    }

    setError('Invalid admin email or password.');
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#071A35] via-[#102B55] to-[#173F70] px-4 py-10">

      {/* Decorative backgrounds */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />

      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl lg:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#102B55] p-10 text-white lg:flex">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[45px] border-red-500/10" />

          <div className="relative">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-600 p-3 shadow-lg">
                <Newspaper size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-wide">
                  MSR NEWS
                </h1>

                <p className="text-xs tracking-[0.25em] text-blue-200">
                  DIGITAL NEWS PLATFORM
                </p>
              </div>
            </div>

            <div className="mt-24">

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-400">
                Administration
              </p>

              <h2 className="text-4xl font-extrabold leading-tight">
                Control your
                <span className="block text-red-400">
                  newsroom.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                Manage reporters, verify news, publish stories and
                monitor your MSR NEWS platform from one place.
              </p>

            </div>
          </div>

          <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">

            <ShieldCheck className="text-red-400" size={28} />

            <div>
              <p className="font-semibold">
                Authorized Admin Access
              </p>

              <p className="text-xs text-blue-100">
                Demo administrator portal
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">

          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8 text-center lg:text-left">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#102B55] lg:mx-0">
                <ShieldCheck size={34} />
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
                Admin Portal
              </span>

              <h2 className="mt-5 text-3xl font-extrabold text-gray-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to access your admin dashboard.
              </p>

            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>

                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Admin Email
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-blue-700 focus-within:bg-white">

                  <Mail size={19} className="shrink-0 text-blue-800" />

                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter admin email"
                    className="w-full bg-transparent px-3 py-4 text-sm text-gray-900 outline-none"
                    autoComplete="username"
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-blue-700 focus-within:bg-white">

                  <Lock size={19} className="shrink-0 text-blue-800" />

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter password"
                    className="w-full bg-transparent px-3 py-4 text-sm text-gray-900 outline-none"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-gray-500 transition hover:text-blue-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <ShieldAlert size={18} className="mt-0.5 shrink-0" />

                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#102B55] to-[#1C4B82] px-5 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Admin Sign In'}

                <ArrowRight size={19} />
              </button>

            </form>

            {/* Demo Credentials */}
            <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#102B55]">
                Demo Login Credentials
              </p>

              <p className="text-sm text-gray-800">
                Email: <strong>admin@msrnews.com</strong>
              </p>

              <p className="mt-1 text-sm text-gray-800">
                Password: <strong>Admin@123</strong>
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Demo only. Do not use these credentials in a live website.
              </p>

            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate({ name: 'home' })}
              className="mt-7 w-full text-center text-sm font-semibold text-gray-500 transition hover:text-red-600"
            >
              Back to public website
            </button>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} MSR NEWS. Admin Portal.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
