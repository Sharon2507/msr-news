
// @ts-nocheck
import { useEffect, useRef, useState } from 'react';

import {
  User,
  Mail,
  Phone,
  Lock,
  IdCard,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

import { useApp } from '../context';

import {
  addReporter,
  loadReporters,
  saveSession,
  updateReporter,
  genId,
} from '../storage';

import { DISTRICTS } from '../types';

import {
  isValidEmail,
  isValidMobile,
  readFileAsDataURL,
} from '../utils';

import {
  AuthShell,
  Field,
  FieldError,
  inputCls,
  submitBtn,
  authText,
} from './AuthShared';

const STEPS = [
  'Details',
  'ID Document',
  'Photo',
  'Face Check',
  'OTP',
];

export function ReporterRegisterPage() {
  const { navigate, showToast, refreshSession, lang } = useApp();

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirm: '',
    reporterId: '',
    address: '',
    district: DISTRICTS?.[0] || '',
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [idDocName, setIdDocName] = useState('');
  const [idDocPreview, setIdDocPreview] = useState('');

  const [faceImage, setFaceImage] = useState('');
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceVerifying, setFaceVerifying] = useState(false);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const msg = (value) => authText(lang, value);

  // Update form fields
  const set = (key, value) => {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));

    setErrors((old) => ({
      ...old,
      [key]: '',
    }));
  };

  // Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  // Attach camera stream
  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOn]);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  // Validate registration details
  const validateDetails = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!isValidEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!isValidMobile(form.mobile.trim())) {
      nextErrors.mobile = 'Enter a valid mobile number.';
    }

    if (form.password.length < 6) {
      nextErrors.password =
        'Password must contain at least 6 characters.';
    }

    if (form.confirm !== form.password) {
      nextErrors.confirm = 'Passwords do not match.';
    }

    if (!form.reporterId.trim()) {
      nextErrors.reporterId = 'Reporter ID is required.';
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Address is required.';
    }

    const existing = loadReporters() || [];

    if (
      existing.some(
        (reporter) =>
          reporter.email?.toLowerCase() ===
          form.email.trim().toLowerCase()
      )
    ) {
      nextErrors.email = 'This email is already registered.';
    }

    if (
      existing.some(
        (reporter) => reporter.mobile === form.mobile.trim()
      )
    ) {
      nextErrors.mobile =
        'This mobile number is already registered.';
    }

    if (
      existing.some(
        (reporter) =>
          reporter.reporterId === form.reporterId.trim()
      )
    ) {
      nextErrors.reporterId =
        'This Reporter ID is already registered.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Open camera
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API unavailable');
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
          },
        });

      streamRef.current = stream;

      setCameraOn(true);
    } catch (error) {
      showToast?.(
        msg('Camera is not available. Please upload a photo instead.')
      );
    }
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      setFaceImage(
        canvas.toDataURL('image/jpeg', 0.82)
      );

      setFaceVerified(false);
    }

    stopCamera();
  };

  // Upload ID document
  const uploadId = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validImage = file.type.startsWith('image/');
    const validPdf = file.type === 'application/pdf';

    if (!validImage && !validPdf) {
      showToast?.(msg('Please select an image or PDF file.'));
      event.target.value = '';
      return;
    }

    setIdDocName(file.name);

    try {
      if (validImage) {
        setIdDocPreview(await readFileAsDataURL(file));
      } else {
        setIdDocPreview('pdf-selected');
      }
    } catch {
      setIdDocName('');
      setIdDocPreview('');
      showToast?.(msg('Unable to read the selected document.'));
    }
  };

  // Upload reporter photo
  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast?.(msg('Please select an image file.'));
      event.target.value = '';
      return;
    }

    try {
      setFaceImage(await readFileAsDataURL(file));
      setFaceVerified(false);
      stopCamera();
    } catch {
      showToast?.(msg('Unable to read the selected photo.'));
    }
  };

  // Continue to next step
  const next = () => {
    if (step === 0 && !validateDetails()) {
      return;
    }

    if (step === 1 && !idDocName) {
      showToast?.(msg('Please upload an ID document.'));
      return;
    }

    if (step === 2 && !faceImage) {
      showToast?.(msg('Please capture or upload a photograph.'));
      return;
    }

    if (step === 3 && !faceVerified) {
      showToast?.(
        msg('Complete the simulated face verification first.')
      );
      return;
    }

    stopCamera();

    setStep((current) => Math.min(current + 1, 4));
  };

  // Go back
  const back = () => {
    stopCamera();

    setStep((current) => Math.max(current - 1, 0));
  };

  // Demo face verification
  const runFaceVerification = () => {
    setFaceVerifying(true);

    window.setTimeout(() => {
      setFaceVerifying(false);
      setFaceVerified(true);

      showToast?.(msg('Demo face verification completed.'));
    }, 900);
  };

  // Save registration
  const finishRegistration = () => {
    const reporter = {
      id: genId('rep'),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim(),
      password: form.password,
      reporterId: form.reporterId.trim(),
      idDocumentName: idDocName,
      idDocumentPreview: idDocPreview,
      photo: faceImage,
      address: form.address.trim(),
      district: form.district,
      verificationStatus: 'Pending Verification',
      createdAt: new Date().toISOString(),
    };

    addReporter(reporter);

    saveSession({
      type: 'reporter',
      id: reporter.id,
    });

    refreshSession?.();

    setSubmitted(true);

    showToast?.(
      msg('Reporter registration submitted successfully.')
    );
  };

  // Verify OTP
  const verifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP.');
      return;
    }

    if (otp !== '123456') {
      setOtpError('Incorrect OTP. Demo OTP is 123456.');
      return;
    }

    setOtpError('');

    finishRegistration();
  };

  // Registration success screen
  if (submitted) {
    return (
      <AuthShell
        title="Registration Submitted"
        subtitle="Your reporter application has been received."
        showGoogle={false}
      >
        <div className="py-3 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={38} />
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            {msg('Thank you for registering!')}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {msg('Your account status is Pending Verification. You can check the demo status below.')}
          </p>

          <button
            type="button"
            onClick={() => setStep(5)}
            className={`${submitBtn} mt-6`}
          >
            {msg('View Verification Status')}
          </button>
        </div>

        {step === 5 && (
          <VerificationStatusView
            onHome={() => navigate({ name: 'home' })}
            lang={lang}
          />
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reporter Registration"
      subtitle="Join MSR NEWS as a reporter (demo)"
      showGoogle={false}
    >
      {/* Registration progress */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((label, index) => (
          <div
            key={label}
            className="flex min-w-fit items-center gap-1.5"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                index < step
                  ? 'bg-green-500 text-white'
                  : index === step
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < step ? (
                <CheckCircle2 size={15} />
              ) : (
                index + 1
              )}
            </span>

            <span
              className={`text-xs font-medium ${
                index === step
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {msg(label)}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Reporter Details */}
      {step === 0 && (
        <div className="space-y-4">
          <Field label="Full Name" error={errors.fullName}>
            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder={msg('Enter full name')}
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="you@example.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

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
                />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={msg(showPassword ? 'Hide password' : 'Show password')}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password" error={errors.confirm}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                placeholder={msg('Confirm password')}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Reporter ID Number" error={errors.reporterId}>
            <div className="relative">
              <IdCard
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={form.reporterId}
                onChange={(e) => set('reporterId', e.target.value)}
                placeholder="e.g. MSR-REP-100"
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          <Field label="Address" error={errors.address}>
            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder={msg('Street, city')}
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          <Field label="District">
            <select
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              className={inputCls}
            >
              {(DISTRICTS || []).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {/* STEP 2: ID Document */}
      {step === 1 && (
        <div className="space-y-4">
          <DemoNote>
            {msg('Demo only: identity documents are not checked by a verification service.')}
          </DemoNote>

          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-red-500">
            <Upload
              size={28}
              className="mx-auto mb-2 text-gray-500"
            />

            <span className="block text-sm font-semibold text-gray-700">
              {msg('Upload ID Document')}
            </span>

            <span className="mt-1 block text-xs text-gray-500">
              {msg('Image or PDF')}
            </span>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={uploadId}
              className="hidden"
            />
          </label>

          {idDocName && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm">
              <FileText size={18} className="text-red-600" />

              <span className="min-w-0 flex-1 truncate">
                {idDocName}
              </span>

              <CheckCircle2 size={18} className="text-green-600" />
            </div>
          )}

          {idDocPreview && idDocPreview !== 'pdf-selected' && (
            <img
              src={idDocPreview}
              alt="ID document preview"
              className="max-h-48 w-full rounded-lg border object-contain"
            />
          )}

          {idDocPreview === 'pdf-selected' && (
            <p className="text-sm text-green-700">
              {msg('PDF document selected successfully.')}
            </p>
          )}
        </div>
      )}

      {/* STEP 3: Reporter Photo */}
      {step === 2 && (
        <div className="space-y-4">
          <DemoNote>
            {msg('Camera capture is a local demo. Your photo is not sent to a server.')}
          </DemoNote>

          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-900">
            {faceImage ? (
              <img
                src={faceImage}
                alt="Reporter preview"
                className="h-full w-full object-contain"
              />
            ) : cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera size={42} className="text-white/40" />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex flex-wrap gap-2">
            {!cameraOn && !faceImage && (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 rounded-lg bg-[#003478] px-4 py-2.5 text-sm font-semibold text-white"
              >
                {msg('Open Camera')}
              </button>
            )}

            {cameraOn && (
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {msg('Capture Photo')}
              </button>
            )}

            {cameraOn && (
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm"
              >
                {msg('Cancel')}
              </button>
            )}

            <label className="flex-1 cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-700">
              {msg('Upload Photo')}

              <input
                type="file"
                accept="image/*"
                onChange={uploadPhoto}
                className="hidden"
              />
            </label>

            {faceImage && (
              <button
                type="button"
                onClick={() => {
                  setFaceImage('');
                  setFaceVerified(false);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm"
              >
                {msg('Retake')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Face Verification */}
      {step === 3 && (
        <div className="space-y-4">
          <DemoNote>
            {msg('This is simulated face verification only. It does not perform biometric identity matching.')}
          </DemoNote>

          <div className="rounded-xl border p-5 text-center">
            {faceImage && (
              <img
                src={faceImage}
                alt="Face preview"
                className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
              />
            )}

            {faceVerified ? (
              <>
                <CheckCircle2
                  size={38}
                  className="mx-auto mb-2 text-green-600"
                />

                <h3 className="font-bold text-gray-900">
                  {msg('Face Verification Passed (Demo)')}
                </h3>
              </>
            ) : (
              <>
                <ShieldCheck
                  size={38}
                  className="mx-auto mb-2 text-[#003478]"
                />

                <h3 className="font-bold text-gray-900">
                  {msg('Face Verification')}
                </h3>

                <p className="my-2 text-sm text-gray-500">
                  {msg('Run the simulated face check to continue.')}
                </p>

                <button
                  type="button"
                  disabled={faceVerifying}
                  onClick={runFaceVerification}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
                >
                  {faceVerifying ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={17} />
                  )}

                  {msg(faceVerifying ? 'Checking...' : 'Run Face Verification')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: OTP */}
      {step === 4 && (
        <div className="space-y-4">
          <DemoNote>
            {msg('Demo OTP:')} <strong>123456</strong>.{' '}
            {msg('No real SMS is sent.')}
          </DemoNote>

          <Field label="Enter 6-digit OTP">
            <input
              value={otp}
              onChange={(e) => {
                setOtp(
                  e.target.value.replace(/\D/g, '').slice(0, 6)
                );

                setOtpError('');
              }}
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 123456"
              className={inputCls}
            />
          </Field>

          <FieldError>{otpError}</FieldError>

          <button
            type="button"
            onClick={verifyOtp}
            className={submitBtn}
          >
            {msg('Verify OTP & Submit Registration')}
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex gap-3 border-t pt-5">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold text-gray-700"
          >
            <ArrowLeft size={16} />
            {msg('Back')}
          </button>
        )}

        {step < 4 && (
          <button
            type="button"
            onClick={next}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            {msg('Continue')}
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Reporter login link */}
      <p className="mt-5 text-center text-sm text-gray-500">
        {msg('Already a reporter?')}{' '}

        <button
          type="button"
          onClick={() => navigate({ name: 'reporterLogin' })}
          className="font-semibold text-red-600 hover:underline"
        >
          {msg('Reporter Login')}
        </button>
      </p>
    </AuthShell>
  );
}

// Reporter verification status component
function VerificationStatusView({ onHome, lang }) {
  const { refreshSession, showToast, navigate } = useApp();

  const msg = (value) => authText(lang, value);

  const [status, setStatus] = useState(() => {
    const session = JSON.parse(
      localStorage.getItem('msrnews_session') || '{}'
    );

    return (
      (loadReporters() || []).find(
        (reporter) => reporter.id === session.id
      )?.verificationStatus || 'Pending Verification'
    );
  });

  // Simulate verification status changes
  const advanceStatus = () => {
    const session = JSON.parse(
      localStorage.getItem('msrnews_session') || '{}'
    );

    const reporter = (loadReporters() || []).find(
      (item) => item.id === session.id
    );

    if (!reporter) {
      showToast?.(
        lang === 'te'
          ? 'రిపోర్టర్ ఖాతా కనుగొనబడలేదు.'
          : 'Reporter account not found.'
      );
      return;
    }

    const states = [
      'Pending Verification',
      'Under Review',
      'Approved',
    ];

    const index = states.indexOf(
      reporter.verificationStatus
    );

    const nextStatus =
      states[Math.min(index + 1, states.length - 1)];

    updateReporter({
      ...reporter,
      verificationStatus: nextStatus,
    });

    setStatus(nextStatus);

    refreshSession?.();

    showToast?.(
      `${lang === 'te' ? 'డెమో స్థితి నవీకరించబడింది' : 'Demo status updated'}: ${msg(nextStatus)}`
    );
  };

  const approved = status === 'Approved';

  return (
    <div className="mt-5 space-y-4">
      <div
        className={`rounded-xl border p-4 ${
          approved
            ? 'border-green-200 bg-green-50'
            : 'border-amber-200 bg-amber-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {approved ? (
            <CheckCircle2 className="text-green-600" />
          ) : (
            <Clock className="text-amber-600" />
          )}

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              {msg('Verification Status')}
            </p>

            <p className="font-bold text-gray-900">
              {msg(status)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {approved
            ? msg('Your reporter account is approved in this demo.')
            : msg('Your application is waiting for review. The status button below simulates the review workflow.')}
        </p>
      </div>

      {!approved && (
        <button
          type="button"
          onClick={advanceStatus}
          className="w-full rounded-lg bg-[#003478] py-3 font-semibold text-white"
        >
          {msg('Simulate Next Verification Step')}
        </button>
      )}

      {approved && (
        <button
          type="button"
          onClick={() => navigate({ name: 'reporterDashboard' })}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white"
        >
          {msg('Open Reporter Dashboard')}
        </button>
      )}

      <button
        type="button"
        onClick={onHome}
        className="w-full rounded-lg border py-3 font-semibold text-gray-700"
      >
        {msg('Back to Home')}
      </button>
    </div>
  );
}

// Demo information message
function DemoNote({ children }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <ShieldAlert size={17} className="shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default ReporterRegisterPage;
