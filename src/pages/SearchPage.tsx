
// @ts-nocheck
import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

import { useApp } from '../context';
import {
  loadUsers,
  saveUsers,
  genId,
} from '../storage';

import {
  AuthShell,
  Field,
  FieldError,
  inputCls,
  submitBtn,
  authText,
} from './AuthShared';

export function UserRegisterPage() {
  const { lang, navigate, showToast } = useApp();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const msg = (value) => authText(lang, value);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = msg('Please enter your full name.');
    }

    if (!form.email.trim()) {
      newErrors.email = msg('Please enter your email address.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = msg('Please enter a valid email address.');
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = msg('Please enter your mobile number.');
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      newErrors.mobile = msg('Enter a valid 10-digit mobile number.');
    }

    if (!form.password) {
      newErrors.password = msg('Please enter a password.');
    } else if (form.password.length < 8) {
      newErrors.password = msg('Password must contain at least 8 characters.');
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = msg('Please confirm your password.');
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = msg('Passwords do not match.');
    }

    const users = loadUsers() || [];

    const existingEmail = users.some(
      (user) =>
        user.email?.toLowerCase() === form.email.trim().toLowerCase()
    );

    const existingMobile = users.some(
      (user) => user.mobile === form.mobile.trim()
    );

    if (existingEmail) {
      newErrors.email = msg('This email is already registered.');
    }

    if (existingMobile) {
      newErrors.mobile = msg('This mobile number is already registered.');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const users = loadUsers() || [];

      const newUser = {
        id: genId(),
        fullName: form.fullName.trim(),
        name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: form.password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);

      showToast(
        msg('Registration successful! Please login.'),
        'success'
      );

      navigate('login');
    } catch (error) {
      console.error('Registration error:', error);

      showToast(
        msg('Registration failed. Please try again.'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join MSR NEWS and stay updated with the latest news"
      showGoogle={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <Field
          label="Full Name"
          error={errors.fullName}
        >
          <div className="relative">
            <User
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                updateField('fullName', e.target.value)
              }
              placeholder={msg('Enter your full name')}
              className={`${inputCls} pl-11`}
              autoComplete="name"
            />
          </div>
        </Field>

        {/* Email */}
        <Field
          label="Email Address"
          error={errors.email}
        >
          <div className="relative">
            <Mail
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField('email', e.target.value)
              }
              placeholder={msg('Enter your email address')}
              className={`${inputCls} pl-11`}
              autoComplete="email"
            />
          </div>
        </Field>

        {/* Mobile */}
        <Field
          label="Mobile Number"
          error={errors.mobile}
        >
          <div className="relative">
            <Phone
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) =>
                updateField('mobile', e.target.value)
              }
              placeholder={msg('Enter 10-digit mobile number')}
              maxLength={10}
              className={`${inputCls} pl-11`}
              autoComplete="tel"
            />
          </div>
        </Field>

        {/* Password */}
        <Field
          label="Password"
          error={errors.password}
        >
          <div className="relative">
            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) =>
                updateField('password', e.target.value)
              }
              placeholder={msg('Create a password')}
              className={`${inputCls} pl-11 pr-12`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
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
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) =>
                updateField('confirmPassword', e.target.value)
              }
              placeholder={msg('Confirm your password')}
              className={`${inputCls} pl-11 pr-12`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`${submitBtn} flex w-full items-center justify-center gap-2`}
        >
          <UserPlus size={19} />
          {loading
            ? msg('Creating Account...')
            : msg('Create Account')}
        </button>

        {/* Login Link */}
        <div className="pt-3 text-center text-sm text-gray-600">
          {msg('Already have an account?')}{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            className="font-bold text-red-600 hover:text-red-700"
          >
            {msg('Login')}
          </button>
        </div>

      </form>
    </AuthShell>
  );
}

export default UserRegisterPage;
