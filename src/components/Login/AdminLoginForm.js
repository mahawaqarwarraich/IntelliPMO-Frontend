import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field, values, touchedState) {
  const val = (values[field.name] ?? '').trim();
  const t = touchedState[field.name];

  if (!val) {
    return t ? 'This field is required.' : null;
  }

  switch (field.name) {
    case 'email':
      if (!EMAIL_REGEX.test(val)) return 'Please enter a valid email address.';
      return null;
    case 'password':
      return val.length < MIN_PASSWORD_LENGTH ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` : null;
    default:
      return null;
  }
}

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed';
const labelClass = 'text-[13px] font-medium text-gray-900';
const errorClass = 'text-xs text-red-600 mt-0.5';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

export default function AdminLoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);
  const firstErrorIdRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    if (submitError) setSubmitError('');
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getError = (field, touchedState) => validateField(field, values, touchedState ?? touched);

  useEffect(() => {
    if (!submitError || !firstErrorIdRef.current) return;
    const el = document.getElementById(firstErrorIdRef.current);
    el?.focus?.();
    firstErrorIdRef.current = null;
  }, [submitError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const allTouched = { email: true, password: true };
    setTouched(allTouched);

    const emailError = getError({ name: 'email' }, allTouched);
    const passwordError = getError({ name: 'password' }, allTouched);
    if (emailError || passwordError) {
      firstErrorIdRef.current = emailError ? 'email' : 'password';
      setSubmitError('Please fix the errors below.');
      return;
    }

    const payload = {
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    setSubmitting(true);
    try {
      const res = await api.post('/api/admins/login', payload);
      const id = res.data.admin?._id;
      const token = res.data.token;
      if (id && token) {
        login({ id, token, role: 'Admin' });
      }
      showToast(res.data?.message || 'Logged in successfully.', 'success');
      onSuccess?.(res.data);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.join(' ') : err.message) ||
        'Login failed. Please check your email and password.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const emailError = getError({ name: 'email' }, touched);
  const passwordError = getError({ name: 'password' }, touched);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary tracking-wide m-0 mb-1">
          UOG | FMS
        </h1>
        <p className="text-sm text-gray-500 font-normal m-0">
          FYP Management System
        </p>
      </header>
      <div className="w-full max-w-[min(90vw,28rem)] bg-white rounded-xl shadow-card border border-gray-200 p-8">
        {toast.show && (
        <div
          style={{ animation: 'toast-fade-in 0.25s ease-out' }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          role="alert"
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
        )}

        <form
          className="flex flex-col gap-4 sm:gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-transparent border-0 text-gray-500 text-sm cursor-pointer p-0 mb-1 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
          onClick={() => navigate('/')}
          aria-label="Back"
        >
          ← Back
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 mb-1">
          Log in as Admin
        </h2>

        {submitError && (
          <div
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          <div className={fieldWrapClass}>
            <label htmlFor="email" className={labelClass}>
              Email<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. admin@uog.edu.pk"
              value={values.email ?? ''}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              className={inputClass}
              autoComplete="email"
            />
            {emailError && (
              <span id="email-error" className={errorClass} role="alert">
                {emailError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="password" className={labelClass}>
              Password<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={values.password ?? ''}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              required
              autoComplete="current-password"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'password-error' : undefined}
              className={inputClass}
            />
            {passwordError && (
              <span id="password-error" className={errorClass} role="alert">
                {passwordError}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full sm:w-auto py-2.5 px-5 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>

       
        </form>
      </div>
    </div>
  );
}
