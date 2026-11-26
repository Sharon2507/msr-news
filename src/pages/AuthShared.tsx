
import React from 'react';
import { useApp } from '../context';

// ============================================
// AUTH INPUT AND BUTTON STYLES
// ============================================

export const inputCls =
  'w-full rounded-full border border-white/15 bg-[#193967]/50 px-5 py-3.5 text-white placeholder:text-blue-100/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.20)] outline-none backdrop-blur-md transition-all duration-300 focus:border-orange-400 focus:bg-[#244779]/70 focus:ring-2 focus:ring-orange-400/20';

export const submitBtn =
  'w-full rounded-full bg-gradient-to-r from-[#ff252d] to-[#ff895c] py-3.5 font-bold text-white shadow-[0_8px_22px_rgba(255,65,55,0.30)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,65,55,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';

// ============================================
// ENGLISH TO TELUGU TRANSLATIONS
// ============================================

const translations: Record<string, string> = {
  'Login': 'లాగిన్',
  'Register': 'నమోదు',
  'Sign In': 'సైన్ ఇన్',
  'Sign Up': 'సైన్ అప్',

  'Email': 'ఈమెయిల్',
  'Email Address': 'ఈమెయిల్ చిరునామా',
  'Mobile Number': 'మొబైల్ నంబర్',
  'Email or Mobile Number': 'ఈమెయిల్ లేదా మొబైల్ నంబర్',

  'Password': 'పాస్‌వర్డ్',
  'Confirm Password': 'పాస్‌వర్డ్ నిర్ధారించండి',
  'Full Name': 'పూర్తి పేరు',

  'Enter your name': 'మీ పేరు నమోదు చేయండి',
  'Enter your email': 'మీ ఈమెయిల్ నమోదు చేయండి',
  'Enter your password': 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
  'Create password': 'పాస్‌వర్డ్ సృష్టించండి',
  'Confirm password': 'పాస్‌వర్డ్ నిర్ధారించండి',

  'Forgot Password?': 'పాస్‌వర్డ్ మర్చిపోయారా?',
  'Continue with Google': 'Google తో కొనసాగించండి',
  'Or continue with': 'లేదా దీనితో కొనసాగించండి',

  'Already have an account?': 'మీకు ఇప్పటికే ఖాతా ఉందా?',
  "Don't have an account?": 'మీకు ఖాతా లేదా?',

  'Create Account': 'ఖాతా సృష్టించండి',
  'Welcome Back': 'తిరిగి స్వాగతం',
  'Create Your Account': 'మీ ఖాతాను సృష్టించండి',

  'Please complete all fields.': 'దయచేసి అన్ని వివరాలను నమోదు చేయండి.',
  'Full name is required.': 'పూర్తి పేరు నమోదు చేయండి.',
  'Email is required.': 'ఈమెయిల్ నమోదు చేయండి.',
  'Mobile number is required.': 'మొబైల్ నంబర్ నమోదు చేయండి.',
  'Password is required.': 'పాస్‌వర్డ్ నమోదు చేయండి.',
  'Please confirm your password.': 'దయచేసి పాస్‌వర్డ్ నిర్ధారించండి.',

  'Enter a valid email address.': 'సరైన ఈమెయిల్ చిరునామా నమోదు చేయండి.',
  'Enter a valid mobile number.': 'సరైన మొబైల్ నంబర్ నమోదు చేయండి.',
  'Password must contain at least 8 characters.': 'పాస్‌వర్డ్‌లో కనీసం 8 అక్షరాలు ఉండాలి.',
  'Passwords do not match.': 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.',

  'This email is already registered.': 'ఈ ఈమెయిల్ ఇప్పటికే నమోదు చేయబడింది.',
  'This mobile number is already registered.': 'ఈ మొబైల్ నంబర్ ఇప్పటికే నమోదు చేయబడింది.',

  'Account not found. Please register first.': 'ఖాతా కనుగొనబడలేదు. దయచేసి ముందుగా నమోదు చేసుకోండి.',
  'Incorrect password.': 'తప్పు పాస్‌వర్డ్.',
  'Account created successfully.': 'ఖాతా విజయవంతంగా సృష్టించబడింది.',
  'Registration successful! Please login.': 'నమోదు విజయవంతమైంది! దయచేసి లాగిన్ చేయండి.',
  'Registration failed. Please try again.': 'నమోదు విఫలమైంది. మళ్లీ ప్రయత్నించండి.',
  'Creating Account...': 'ఖాతా సృష్టించబడుతోంది...',

  // Reporter Authentication
  'Reporter Login': 'రిపోర్టర్ లాగిన్',
  'Reporter Registration': 'రిపోర్టర్ నమోదు',
  'Reporter Sign In': 'రిపోర్టర్ సైన్ ఇన్',
  'Reporter ID': 'రిపోర్టర్ ఐడి',
  'Reporter ID Number': 'రిపోర్టర్ ఐడి నంబర్',

  'Address': 'చిరునామా',
  'District': 'జిల్లా',
  'Details': 'వివరాలు',
  'ID Document': 'గుర్తింపు పత్రం',
  'Photo': 'ఫోటో',
  'Face Check': 'ముఖ ధృవీకరణ',
  'OTP': 'ఓటీపీ',

  'Continue': 'కొనసాగించండి',
  'Back': 'వెనుకకు',
  'Submit': 'సమర్పించండి',
  'Verify OTP': 'ఓటీపీ ధృవీకరించండి',

  'Upload ID Document': 'గుర్తింపు పత్రాన్ని అప్‌లోడ్ చేయండి',
  'Upload Photo': 'ఫోటో అప్‌లోడ్ చేయండి',
  'Open Camera': 'కెమెరా తెరవండి',
  'Capture Photo': 'ఫోటో తీయండి',
  'Retake': 'మళ్లీ తీయండి',
  'Cancel': 'రద్దు చేయండి',

  'Registration Submitted': 'నమోదు సమర్పించబడింది',
  'Thank you for registering!': 'నమోదు చేసుకున్నందుకు ధన్యవాదాలు!',

  'Verification Status': 'ధృవీకరణ స్థితి',
  'Pending Verification': 'ధృవీకరణ పెండింగ్‌లో ఉంది',
  'Under Review': 'పరిశీలనలో ఉంది',
  'Approved': 'ఆమోదించబడింది',
  'Rejected': 'తిరస్కరించబడింది',

  'Show password': 'పాస్‌వర్డ్ చూపించండి',
  'Hide password': 'పాస్‌వర్డ్ దాచండి',

  'Enter registered email or mobile': 'నమోదు చేసిన ఈమెయిల్ లేదా మొబైల్ నమోదు చేయండి',
  'Enter your Reporter ID': 'మీ రిపోర్టర్ ఐడి నమోదు చేయండి',
  'Enter full name': 'పూర్తి పేరు నమోదు చేయండి',
  '10-digit number': '10 అంకెల నంబర్',
  'Street, city': 'వీధి, నగరం',

  'Register as Reporter': 'రిపోర్టర్‌గా నమోదు చేసుకోండి',
  'Already a reporter?': 'మీరు ఇప్పటికే రిపోర్టరా?',

  'Your documents are under review. Dashboard access will be available after approval.':
    'మీ పత్రాలు పరిశీలనలో ఉన్నాయి. ఆమోదం పొందిన తర్వాత డాష్‌బోర్డ్ అందుబాటులో ఉంటుంది.',

  'Your account is pending verification. Dashboard access will be available after approval.':
    'మీ ఖాతా ధృవీకరణ కోసం వేచి ఉంది. ఆమోదం పొందిన తర్వాత డాష్‌బోర్డ్ అందుబాటులో ఉంటుంది.',

  'Your reporter application was rejected. Please contact the MSR NEWS desk.':
    'మీ రిపోర్టర్ దరఖాస్తు తిరస్కరించబడింది. దయచేసి MSR NEWS కార్యాలయాన్ని సంప్రదించండి.',

  'Reporter account not found. Please register first.':
    'రిపోర్టర్ ఖాతా కనుగొనబడలేదు. దయచేసి ముందుగా నమోదు చేసుకోండి.',

  'Reporter ID does not match.': 'రిపోర్టర్ ఐడి సరిపోలడం లేదు.',
  'Incorrect OTP. Demo OTP is 123456.': 'ఓటీపీ తప్పు. డెమో ఓటీపీ 123456.',
  'Please enter a 6-digit OTP.': 'దయచేసి 6 అంకెల ఓటీపీ నమోదు చేయండి.',

  'Please upload an ID document.': 'దయచేసి గుర్తింపు పత్రాన్ని అప్‌లోడ్ చేయండి.',
  'Please capture or upload a photograph.': 'దయచేసి ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి.',
  'Complete the simulated face verification first.': 'ముందుగా డెమో ముఖ ధృవీకరణ పూర్తి చేయండి.',

  'Camera is not available. Please upload a photo instead.': 'కెమెరా అందుబాటులో లేదు. దయచేసి ఫోటో అప్‌లోడ్ చేయండి.',
  'Please select an image or PDF file.': 'దయచేసి చిత్రం లేదా PDF ఫైల్ ఎంచుకోండి.',
  'Unable to read the selected document.': 'ఎంచుకున్న పత్రాన్ని చదవలేకపోయాము.',
  'Unable to read the selected photo.': 'ఎంచుకున్న ఫోటోను చదవలేకపోయాము.',

  'Demo only: identity documents are not checked by a verification service.':
    'ఇది డెమో మాత్రమే: గుర్తింపు పత్రాలు ధృవీకరణ సేవ ద్వారా తనిఖీ చేయబడవు.',

  'Camera capture is a local demo. Your photo is not sent to a server.':
    'కెమెరా ఫోటో డెమో మాత్రమే. మీ ఫోటో సర్వర్‌కు పంపబడదు.',

  'This is simulated face verification only. It does not perform biometric identity matching.':
    'ఇది డెమో ముఖ ధృవీకరణ మాత్రమే. బయోమెట్రిక్ గుర్తింపు తనిఖీ చేయబడదు.',

  'Face Verification': 'ముఖ ధృవీకరణ',
  'Face Verification Passed (Demo)': 'ముఖ ధృవీకరణ విజయవంతమైంది (డెమో)',
  'Run Face Verification': 'ముఖ ధృవీకరణ ప్రారంభించండి',
  'Checking...': 'తనిఖీ జరుగుతోంది...',

  'Demo OTP:': 'డెమో ఓటీపీ:',
  'No real SMS is sent.': 'నిజమైన SMS పంపబడదు.',
  'Enter 6-digit OTP': '6 అంకెల ఓటీపీ నమోదు చేయండి',
  'Verify OTP & Submit Registration': 'ఓటీపీ ధృవీకరించి నమోదు సమర్పించండి',

  'Your reporter application has been received.': 'మీ రిపోర్టర్ దరఖాస్తు అందింది.',

  'Your account status is Pending Verification. You can check the demo status below.':
    'మీ ఖాతా ధృవీకరణ కోసం వేచి ఉంది. కింద డెమో స్థితిని చూడవచ్చు.',

  'View Verification Status': 'ధృవీకరణ స్థితిని చూడండి',

  'Your reporter account is approved in this demo.':
    'ఈ డెమోలో మీ రిపోర్టర్ ఖాతా ఆమోదించబడింది.',

  'Your application is waiting for review. The status button below simulates the review workflow.':
    'మీ దరఖాస్తు పరిశీలన కోసం వేచి ఉంది. కింది బటన్ డెమో ప్రక్రియను చూపిస్తుంది.',

  'Simulate Next Verification Step': 'తదుపరి ధృవీకరణ దశను చూపించండి',
  'Open Reporter Dashboard': 'రిపోర్టర్ డాష్‌బోర్డ్ తెరవండి',
  'Back to Home': 'హోమ్‌కు తిరిగి వెళ్లండి',
};

// ============================================
// TRANSLATION FUNCTION
// ============================================

export const authText = (lang: string, value: string) => {
  if (lang === 'te') {
    return translations[value] || value;
  }

  return value;
};

// ============================================
// FIELD COMPONENT
// ============================================

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  const { lang } = useApp();

  return (
    <div className="space-y-2">
      <label className="block pl-2 text-sm font-semibold tracking-wide text-orange-200">
        {authText(lang, label)}
      </label>

      {children}

      {error && (
        <p className="pl-3 text-xs font-medium text-red-300">
          {authText(lang, error)}
        </p>
      )}
    </div>
  );
}

// ============================================
// GENERAL ERROR COMPONENT
// ============================================

export function FieldError({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { lang } = useApp();

  if (!children) return null;

  return (
    <p className="text-sm font-medium text-red-300">
      {typeof children === 'string'
        ? authText(lang, children)
        : children}
    </p>
  );
}

// ============================================
// GOOGLE BUTTON
// ============================================

export function GoogleButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { lang } = useApp();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-3 text-sm font-semibold text-gray-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl"
    >
      <span className="text-xl font-black text-blue-600">G</span>

      {authText(lang, 'Continue with Google')}
    </button>
  );
}

// ============================================
// AUTH SHELL PROPS
// ============================================

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onGoogleClick?: () => void;
  showGoogle?: boolean;
}

// ============================================
// AUTH SHELL - GLASSMORPHISM DESIGN
// ============================================

export function AuthShell({
  title,
  subtitle,
  children,
  onGoogleClick,
  showGoogle = true,
}: AuthShellProps) {
  const { lang, setLang } = useApp();

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#193768] px-4 py-12 sm:px-6">

      {/* Background lighting */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-red-500/10 blur-[110px]" />

      {/* Top decorative cube */}
      <div className="pointer-events-none absolute -right-12 -top-12 hidden h-64 w-64 md:block">
        <div
          className="absolute left-10 top-0 h-44 w-44 rotate-[-12deg] bg-[#ff252d]"
          style={{
            clipPath: 'polygon(0 25%, 65% 0, 100% 35%, 35% 65%)',
          }}
        />

        <div
          className="absolute left-10 top-10 h-44 w-44 rotate-[-12deg] bg-[#c91425]"
          style={{
            clipPath: 'polygon(0 0, 35% 40%, 35% 100%, 0 60%)',
          }}
        />

        <div
          className="absolute left-[66px] top-[50px] h-44 w-44 rotate-[-12deg] bg-[#ff4840]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
          }}
        />
      </div>

      {/* Bottom decorative cube */}
      <div className="pointer-events-none absolute -bottom-20 -left-16 hidden h-64 w-64 md:block">
        <div
          className="absolute left-5 top-0 h-48 w-48 rotate-[-12deg] bg-[#ff3036]"
          style={{
            clipPath: 'polygon(0 25%, 65% 0, 100% 35%, 35% 65%)',
          }}
        />

        <div
          className="absolute left-5 top-12 h-48 w-48 rotate-[-12deg] bg-[#c91425]"
          style={{
            clipPath: 'polygon(0 0, 35% 40%, 35% 100%, 0 60%)',
          }}
        />

        <div
          className="absolute left-[82px] top-[60px] h-48 w-48 rotate-[-12deg] bg-[#ff4840]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
          }}
        />
      </div>

      {/* Main authentication content */}
      <div className="relative z-10 w-full max-w-md">

        {/* Language selector */}
        <div className="mb-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
              lang === 'en'
                ? 'bg-white text-[#193768] shadow-lg'
                : 'border border-white/40 bg-white/5 text-white hover:bg-white/15'
            }`}
          >
            EN
          </button>

          <button
            type="button"
            onClick={() => setLang('te')}
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
              lang === 'te'
                ? 'bg-white text-[#193768] shadow-lg'
                : 'border border-white/40 bg-white/5 text-white hover:bg-white/15'
            }`}
          >
            తెలుగు
          </button>
        </div>

        {/* Glass card */}
        <div className="overflow-hidden rounded-[25px] border border-white/20 bg-white/[0.13] shadow-[0_25px_65px_rgba(0,0,0,0.35)] backdrop-blur-2xl">

          <div className="p-6 sm:p-8">

            {/* Brand and heading */}
            <div className="mb-7">
              <div className="mb-2 flex items-center justify-between gap-3">

                <h1 className="text-2xl font-extrabold tracking-wide text-[#ff986f] sm:text-3xl">
                  {authText(lang, title)}
                </h1>

                <div className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black tracking-wider text-white">
                  MSR NEWS
                </div>

              </div>

              <p className="text-sm leading-relaxed text-blue-100/80">
                {authText(lang, subtitle)}
              </p>
            </div>

            {/* Page form */}
            {children}

            {/* Google sign in */}
            {showGoogle && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/20" />

                  <span className="text-xs text-blue-100/80">
                    {authText(lang, 'Or continue with')}
                  </span>

                  <div className="h-px flex-1 bg-white/20" />
                </div>

                <GoogleButton onClick={onGoogleClick} />
              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs tracking-wide text-white/60">
          © {new Date().getFullYear()} MSR NEWS. All rights reserved.
        </p>

      </div>
    </div>
  );
}
