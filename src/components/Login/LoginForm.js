import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field, values, touchedState) {
  const val = (values[field.name] ?? '').trim();
  const t = touchedState[field.name];

  if (!val) return t ? 'This field is required.' : null;

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

async function tryLogin(payload) {
  // Try known email+password login endpoints (students currently use rollNo in backend).
  const attempts = [
    { role: 'Admin', url: '/api/admins/login', key: 'admin' },
    { role: 'Supervisor', url: '/api/supervisors/login', key: 'supervisor' },
    { role: 'Evaluator', url: '/api/evaluators/login', key: 'evaluator' },
  ];

  let lastErr = null;
  for (const a of attempts) {
    try {
      const res = await api.post(a.url, payload);
      return { ...a, res };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Login failed.');
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstErrorIdRef = useRef(null);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    if (submitError) setSubmitError('');
  };

  const handleBlur = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }));

  const getError = (field, touchedState) => validateField(field, values, touchedState ?? touched);

  useEffect(() => {
    if (!submitError || !firstErrorIdRef.current) return;
    const el = document.getElementById(firstErrorIdRef.current);
    el?.focus?.();
    firstErrorIdRef.current = null;
  }, [submitError]);

  const handleSubmit = useCallback(
    async (e) => {
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

      const payload = { email: values.email.trim().toLowerCase(), password: values.password };

      setSubmitting(true);
      try {
        const result = await tryLogin(payload);
        const token = result.res.data?.token;
        const userObj = result.res.data?.[result.key];
        const id = userObj?._id;
        const fullName = userObj?.fullName;
        const department = userObj?.department;
        const sessionId = userObj?.session_id;
        const defenseType = userObj?.defenseType;

        if (id && token) {
          login({ id, token, role: result.role, fullName, department, sessionId, defenseType });
          navigate('/dashboard');
          return;
        }
        setSubmitError('Login failed. Please try again.');
      } catch (err) {
        const data = err.response?.data;
        setSubmitError(
          data?.message || (Array.isArray(data?.errors) ? data.errors.join(' ') : err.message) || 'Login failed.'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getError, login, navigate, values.email, values.password]
  );

  const emailError = getError({ name: 'email' }, touched);
  const passwordError = getError({ name: 'password' }, touched);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <header className="text-center mb-6">
        <img
          src={`${process.env.PUBLIC_URL || ''}/intelliPMO-logo.svg`}
          alt="IntelliPMO"
          className="h-12 sm:h-14 w-auto max-w-[min(70vw,18rem)] mx-auto object-contain"
          decoding="async"
        />
      </header>

      <div className="w-full max-w-[min(90vw,28rem)] bg-white rounded-xl shadow-card border border-gray-200 p-8">
        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit} noValidate>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 mb-1">Log in</h2>

          {submitError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3" role="alert">
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
                placeholder="e.g. name@example.com"
                value={values.email}
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
                value={values.password}
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

