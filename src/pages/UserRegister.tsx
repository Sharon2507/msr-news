
import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';

import { useApp } from '../context';
import { loadUsers, saveUsers, genId } from '../storage';

import {
  AuthShell,
  Field,
  FieldError,
  inputCls,
  authText,
} from './AuthShared';

export function UserRegisterPage() {
  const { navigate, showToast, lang } = useApp();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const msg = (value: string) => authText(lang, value);

  const set = (key: string, value: string) => {
    setForm((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: '' }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();

    // Full name validation
    if (!fullName) {
      nextErrors.fullName = msg('Full name is required.');
    }

    // Email validation
    if (!email) {
      nextErrors.email = msg('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = msg('Enter a valid email address.');
    }

    // Mobile validation
    if (!mobile) {
      nextErrors.mobile = msg('Mobile number is required.');
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      nextErrors.mobile = msg('Enter a valid mobile number.');
    }

    // Password validation
    if (!form.password) {
      nextErrors.password = msg('Password is required.');
    } else if (form.password.length < 8) {
      nextErrors.password = msg(
        'Password must contain at least 8 characters.'
      );
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = msg('Please confirm your password.');
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = msg('Passwords do not match.');
    }

    const users = loadUsers() || [];

    // Duplicate email validation
    if (
      email &&
      users.some(
        (user: any) => user.email?.toLowerCase() === email
      )
    ) {
      nextErrors.email = msg('This email is already registered.');
    }

    // Duplicate mobile validation
    if (
      mobile &&
      users.some((user: any) => user.mobile === mobile)
    ) {
      nextErrors.mobile = msg('This mobile number is already registered.');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: genId('usr'),
        fullName,
        email,
        mobile,
        password: form.password,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);

      showToast?.(
        lang === 'te'
          ? 'ఖాతా విజయవంతంగా సృష్టించబడింది.'
          : 'Account created successfully.'
      );

      navigate({ name: 'login' });
    } catch (error) {
      console.error('User registration error:', error);

      showToast?.(
        lang === 'te'
          ? 'ఖాతా సృష్టించడంలో సమస్య ఏర్పడింది.'
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join MSR NEWS and stay updated"
      showGoogle={false}
    >
      <form onSubmit={submit} className="space-y-4">

        {/* Full Name */}
        <Field label="Full Name" error={errors.fullName}>
          <div className="relative">
            <User
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder={msg('Enter your name')}
              className={`${inputCls} pl-10`}
              autoComplete="name"
              required
            />
          </div>
        </Field>

        {/* Email */}
        <Field label="Email" error={errors.email}>
          <div className="relative">
            <Mail
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder={msg('Enter your email')}
              className={`${inputCls} pl-10`}
              autoComplete="email"
              required
            />
          </div>
        </Field>

        {/* Mobile Number */}
        <Field label="Mobile Number" error={errors.mobile}>
          <div className="relative">
            <Phone
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.mobile}
              onChange={(e) =>
                set(
                  'mobile',
                  e.target.value.replace(/\D/g, '').slice(0, 10)
                )
              }
              placeholder={msg('10-digit number')}
              className={`${inputCls} pl-10`}
              autoComplete="tel"
              required
            />
          </div>
        </Field>

        {/* Password */}
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Lock
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder={msg('Create password')}
              className={`${inputCls} pl-10 pr-12`}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </Field>

        {/* Confirm Password */}
        <Field
          label="Confirm Password"
          error={errors.confirmPassword}
        >
          <div className="relative">
            <Lock
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) =>
                set('confirmPassword', e.target.value)
              }
              placeholder={msg('Confirm password')}
              className={`${inputCls} pl-10 pr-12`}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </Field>

        {/* General Error */}
        <FieldError>
          {Object.values(errors).find(Boolean) || ''}
        </FieldError>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 font-bold text-white shadow-lg shadow-red-200 transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus size={18} />

          {loading
            ? msg('Creating Account...')
            : msg('Create Account')}
        </button>

      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        {msg('Already have an account?')}{' '}

        <button
          type="button"
          onClick={() => navigate({ name: 'login' })}
          className="font-semibold text-red-600 hover:underline"
        >
          {msg('Sign In')}
        </button>
      </p>
    </AuthShell>
  );
}

export default UserRegisterPage;
