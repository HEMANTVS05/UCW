'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, UserPlus, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  const [mode, setMode] = useState('login'); // 'login' | 'register'
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
          },
        ];
        localStorage.setItem('ucw_users_db', JSON.stringify(defaultUsers));
      }
    }
  }, []);

  const handleRegister = (e) => {
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

      const newUser = {
        username: regForm.username.trim(),
        displayName: regForm.displayName.trim() || regForm.username.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email.trim(),
        password: regForm.password,
        area: regForm.area,
      };

      usersDb.push(newUser);
      localStorage.setItem('ucw_users_db', JSON.stringify(usersDb));
      localStorage.setItem('username', newUser.displayName);
      localStorage.setItem('ucw_current_user', JSON.stringify(newUser));

      setSuccessMessage('REGISTRATION_SUCCESSFUL. REDIRECTING...');
      setTimeout(() => {
        router.push(`/?user=${encodeURIComponent(newUser.displayName)}`);
      }, 1000);
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
        // Fallback for easy testing if no match
        localStorage.setItem('username', loginIdentifier.trim());
        router.push(`/?user=${encodeURIComponent(loginIdentifier.trim())}`);
      }
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
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black text-white glitch uppercase tracking-tighter leading-none"
            data-text={mode === 'login' ? 'SYSTEM.ENTRY' : 'SYSTEM.REGISTER'}
          >
            {mode === 'login' ? 'SYSTEM.ENTRY' : 'SYSTEM.REGISTER'}
          </h1>
          <p className="font-mono text-xs mt-3 text-white/50 uppercase tracking-widest">
            {mode === 'login'
              ? '// initialize connection sequence'
              : '// register new operator profile'}
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
          {mode === 'login' ? (
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
          ) : (
            /* ────────────────── REGISTER FORM ────────────────── */
            <motion.form
              key="register-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
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
                <span>Complete Registration</span>
                <UserPlus className="w-5 h-5" />
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
