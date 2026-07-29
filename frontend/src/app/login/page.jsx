'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, UserPlus, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';

const AREAS = [
  'SALIGRAMAM_SEC',
  'PORUR_SEC',
  'MADIPAKKAM_SEC',
  'CHENNAI_CENTRAL',
  'VELACHERY_SEC',
  'ADYAR_SEC',
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regForm, setRegForm] = useState({
    username: '',
    displayName: '',
    phone: '',
    email: '',
    password: '',
    area: AREAS[0],
  });

  // OTP State
  const [otpValue, setOtpValue] = useState('');

  useEffect(() => {
    // Initialize mock database if needed
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('ucw_users_db');
      if (!existing) {
        const defaultUsers = [
          {
            username: 'hemant',
            displayName: 'Hemant VS',
            phone: '9876543210',
            email: 'hemant@ucw.app',
            password: 'password123',
            area: 'SALIGRAMAM_SEC',
            avatar: null, // No avatar initially
          },
        ];
        localStorage.setItem('ucw_users_db', JSON.stringify(defaultUsers));
      }
    }
  }, []);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regForm.username || !regForm.email || !regForm.password) {
      setErrorMessage('ALL_REQUIRED_FIELDS_MUST_BE_FILLED');
      return;
    }

    if (typeof window !== 'undefined') {
      const usersDb = JSON.parse(localStorage.getItem('ucw_users_db') || '[]');
      const userExists = usersDb.some(
        (u) =>
          u.username.toLowerCase() === regForm.username.toLowerCase() ||
          u.email.toLowerCase() === regForm.email.toLowerCase()
      );

      if (userExists) {
        setErrorMessage('USER_OR_EMAIL_ALREADY_REGISTERED');
        return;
      }

      // Proceed to OTP mode instead of saving immediately
      setSuccessMessage('VERIFICATION_CODE_SENT_TO_EMAIL');
      setMode('otp');
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpValue.length < 4) {
      setErrorMessage('INVALID_OTP_CODE_ENTERED');
      return;
    }

    if (typeof window !== 'undefined') {
      const usersDb = JSON.parse(localStorage.getItem('ucw_users_db') || '[]');
      
      const newUser = {
        username: regForm.username.trim(),
        displayName: regForm.displayName.trim() || regForm.username.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email.trim(),
        password: regForm.password,
        area: regForm.area,
        avatar: null,
      };

      usersDb.push(newUser);
      localStorage.setItem('ucw_users_db', JSON.stringify(usersDb));

      setSuccessMessage('REGISTRATION_COMPLETE. PLEASE_LOGIN.');
      
      setTimeout(() => {
        setMode('login');
        setLoginIdentifier(newUser.username);
        setLoginPassword('');
        setSuccessMessage('');
        setOtpValue('');
      }, 2000);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier || !loginPassword) {
      setErrorMessage('ENTER_CREDENTIALS');
      return;
    }

    if (typeof window !== 'undefined') {
      const usersDb = JSON.parse(localStorage.getItem('ucw_users_db') || '[]');
      const foundUser = usersDb.find(
        (u) =>
          (u.username.toLowerCase() === loginIdentifier.toLowerCase() ||
            u.email.toLowerCase() === loginIdentifier.toLowerCase()) &&
          u.password === loginPassword
      );

      if (foundUser) {
        localStorage.setItem('username', foundUser.displayName || foundUser.username);
        localStorage.setItem('ucw_current_user', JSON.stringify(foundUser));
        setSuccessMessage('ACCESS_GRANTED. INITIALIZING...');
        setTimeout(() => {
          router.push(`/?user=${encodeURIComponent(foundUser.displayName || foundUser.username)}`);
        }, 800);
      } else {
        // Mock fallback login for testing
        const fallbackUser = {
          username: loginIdentifier.trim(),
          displayName: loginIdentifier.trim(),
          area: AREAS[0],
          avatar: null
        };
        localStorage.setItem('username', loginIdentifier.trim());
        localStorage.setItem('ucw_current_user', JSON.stringify(fallbackUser));
        router.push(`/?user=${encodeURIComponent(loginIdentifier.trim())}`);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    if (typeof window !== 'undefined') {
      const googleUser = {
        username: 'google_user',
        displayName: 'Google User',
        email: 'google@example.com',
        area: AREAS[0],
        avatar: null
      };
      localStorage.setItem('username', googleUser.displayName);
      localStorage.setItem('ucw_current_user', JSON.stringify(googleUser));
      setSuccessMessage('GOOGLE_AUTH_SUCCESS. INITIALIZING...');
      setTimeout(() => {
        router.push(`/?user=${encodeURIComponent(googleUser.displayName)}`);
      }, 800);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-black p-4 py-12">
      {/* Structural background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner marks */}
      <div className="fixed top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/40 z-0 pointer-events-none" />
      <div className="fixed top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/40 z-0 pointer-events-none" />
      <div className="fixed bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/40 z-0 pointer-events-none" />
      <div className="fixed bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/40 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg brutalist-panel p-6 sm:p-8 z-10 my-auto shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
      >
        {/* Header */}
        <div className="flex flex-col items-start mb-8 pb-4 border-b-2 border-white/20">
          <div className="w-10 h-10 bg-white flex items-center justify-center mb-4">
            {mode === 'otp' ? (
               <ShieldCheck className="w-6 h-6 text-black" />
            ) : (
               <Terminal className="w-6 h-6 text-black" />
            )}
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black text-white glitch uppercase tracking-tighter leading-none"
            data-text={mode === 'login' ? 'SYSTEM.ENTRY' : mode === 'register' ? 'SYSTEM.REGISTER' : 'SYSTEM.VERIFY'}
          >
            {mode === 'login' ? 'SYSTEM.ENTRY' : mode === 'register' ? 'SYSTEM.REGISTER' : 'SYSTEM.VERIFY'}
          </h1>
          <p className="font-mono text-xs mt-3 text-white/50 uppercase tracking-widest">
            {mode === 'login'
              ? '// initialize connection sequence'
              : mode === 'register' ? '// register new operator profile' : '// await security override code'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-secondary/20 border-2 border-secondary text-secondary font-mono text-xs flex items-center gap-3 uppercase">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>ERR: {errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-white/10 border-2 border-white text-white font-mono text-xs flex items-center gap-3 uppercase">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            /* ────────────────── LOGIN FORM ────────────────── */
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                  &gt;&nbsp;Email_Or_Username
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="ENTER_EMAIL_OR_USERNAME_"
                  className="w-full px-4 py-4 bg-black border-2 border-white text-white font-mono text-sm
                             placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                  &gt;&nbsp;Authentication_Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="ENTER_PASSWORD_"
                  className="w-full px-4 py-4 bg-black border-2 border-white text-white font-mono text-sm
                             placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="brutalist-button w-full flex items-center justify-between mt-4 py-4"
              >
                <span>Execute Access</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink-0 mx-4 text-white/50 text-xs font-mono uppercase">Or_Continue_With</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black border-2 border-white font-mono text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In With Google
              </button>

              <div className="pt-6 border-t border-white/20 text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  [?] NEW OPERATOR? REGISTER HERE
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'register' && (
            /* ────────────────── REGISTER FORM ────────────────── */
            <motion.form
              key="register-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                    &gt;&nbsp;Username
                  </label>
                  <input
                    type="text"
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    placeholder="USERNAME_"
                    className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                               placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                    &gt;&nbsp;Display_Name
                  </label>
                  <input
                    type="text"
                    value={regForm.displayName}
                    onChange={(e) => setRegForm({ ...regForm, displayName: e.target.value })}
                    placeholder="DISPLAY_NAME_"
                    className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                               placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                    &gt;&nbsp;Phone_Number
                  </label>
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="PHONE_NUMBER_"
                    className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                               placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                {/* Area / Sector */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                    &gt;&nbsp;Area_Sector
                  </label>
                  <select
                    value={regForm.area}
                    onChange={(e) => setRegForm({ ...regForm, area: e.target.value })}
                    className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                               focus:outline-none focus:border-secondary transition-colors cursor-pointer"
                  >
                    {AREAS.map((area) => (
                      <option key={area} value={area} className="bg-black text-white">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                  &gt;&nbsp;Email_Address
                </label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="EMAIL_ADDRESS_"
                  className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                             placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                  &gt;&nbsp;Password
                </label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="PASSWORD_"
                  className="w-full px-3 py-3.5 bg-black border-2 border-white text-white font-mono text-xs
                             placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="brutalist-button w-full flex items-center justify-between mt-6 py-4"
              >
                <span>Verify with Email</span>
                <Mail className="w-5 h-5" />
              </button>

              <div className="pt-6 border-t border-white/20 text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  [&lt;] ALREADY REGISTERED? LOGIN HERE
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'otp' && (
            /* ────────────────── OTP FORM ────────────────── */
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleOtpVerify}
              className="space-y-6"
            >
              <div className="text-white/70 font-mono text-sm mb-4 leading-relaxed">
                A verification code has been transmitted to <span className="text-white font-bold">{regForm.email}</span>.<br />
                Please enter the sequence below to authorize this profile.
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70">
                  &gt;&nbsp;Verification_Code
                </label>
                <input
                  type="text"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="X X X X X X"
                  className="w-full px-4 py-5 bg-black border-2 border-white text-white font-mono text-2xl tracking-[0.5em] text-center
                             placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="brutalist-button w-full flex items-center justify-between mt-4 py-4"
              >
                <span>Confirm Authentication</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <div className="pt-6 border-t border-white/20 text-center">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  [&lt;] CANCEL REGISTRATION SEQUENCE
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
