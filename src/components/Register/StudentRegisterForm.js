import { useState, useRef, useEffect, useCallback } from 'react';
import StudentLoginForm from '../Login/StudentLoginForm';
import { api } from '../../api/client.js';

const DEPARTMENTS = ['IT', 'CS', 'SE'];

const FIELD_NAMES = [
  'fullName',
  'department',
  'rollNo',
  'cgpa',
  'email',
  'password',
  'confirmPassword',
  'session',
];

const INITIAL_VALUES = Object.fromEntries(FIELD_NAMES.map((name) => [name, '']));

const MIN_PASSWORD_LENGTH = 6;
const MIN_FULLNAME_LENGTH = 2;
const MAX_FULLNAME_LENGTH = 100;
const STUDENT_EMAIL_REGEX = /^\d{8}-\d{3}@uog\.edu\.pk$/i;
const ROLL_NO_REGEX = /^\d{8}-\d{3}$/;
const SESSION_REGEX = /^\d{4}-\d{4}$/;
const FULLNAME_REGEX = /^[\p{L}\s\-'.]+$/u;

function validateField(field, values, touchedState) {
  const val = (values[field.name] ?? '').trim();
  const t = touchedState[field.name];

  if (field.required !== false && !val) {
    return t ? 'This field is required.' : null;
  }
  if (!val) return null;

  switch (field.name) {
    case 'fullName':
      if (val.length < MIN_FULLNAME_LENGTH) return 'Enter at least 2 characters.';
      if (val.length > MAX_FULLNAME_LENGTH) return 'Name is too long.';
      if (!FULLNAME_REGEX.test(val)) return 'Use only letters, spaces, hyphens.';
      return null;
    case 'department':
      return null;
    case 'email':
      if (!STUDENT_EMAIL_REGEX.test(val)) {
        return 'Email must be like 21011519-085@uog.edu.pk (8 digits, hyphen, 3 digits).';
      }
      return null;
    case 'password':
      return val.length < MIN_PASSWORD_LENGTH ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` : null;
    case 'confirmPassword':
      return values.password !== values.confirmPassword ? 'Passwords do not match.' : null;
    case 'rollNo':
      if (!ROLL_NO_REGEX.test(val)) return 'Roll number must be like 21011519-085 (8 digits, hyphen, 3 digits).';
      return null;
    case 'session':
      if (!SESSION_REGEX.test(val)) return 'Session must be like 2021-2025 (year-year).';
      return null;
    case 'cgpa': {
      const num = parseFloat(val);
      if (Number.isNaN(num)) return 'Enter a valid number (0 to 4).';
      if (num < 0 || num > 4) return 'CGPA must be between 0 and 4.';
      return null;
    }
    default:
      return null;
  }
}

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed';
const selectClass =
  'w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed';
const labelClass = 'text-[13px] font-medium text-gray-900';
const errorClass = 'text-xs text-red-600 mt-0.5';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

export default function StudentRegisterForm({ onBack, onSubmit, onLogin }) {
  const [values, setValues] = useState(INITIAL_VALUES);
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
    const allTouched = Object.fromEntries(FIELD_NAMES.map((name) => [name, true]));
    setTouched(allTouched);

    const errors = FIELD_NAMES.map((name) => ({ name, error: getError({ name }, allTouched) })).filter((e) => e.error);
    if (errors.length > 0) {
      firstErrorIdRef.current = errors[0].name;
      setSubmitError('Please fix the errors below.');
      return;
    }

    const payload = { ...values };
    delete payload.confirmPassword;

    setSubmitting(true);
    try {
      const res = await api.post('/api/students/register', payload);
      showToast(res.data?.message || 'Account created successfully.', 'success');
      setValues(INITIAL_VALUES);
      setTouched({});
      onSubmit?.(payload);
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.join(' ') : err.message) ||
        'Registration failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fullNameError = getError({ name: 'fullName' }, touched);
  const departmentError = getError({ name: 'department' }, touched);
  const rollNoError = getError({ name: 'rollNo' }, touched);
  const cgpaError = getError({ name: 'cgpa' }, touched);
  const emailError = getError({ name: 'email' }, touched);
  const passwordError = getError({ name: 'password' }, touched);
  const confirmPasswordError = getError({ name: 'confirmPassword' }, touched);
  const sessionError = getError({ name: 'session' }, touched);

  return (
    <>
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
        {onBack && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-transparent border-0 text-gray-500 text-sm cursor-pointer p-0 mb-1 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
            onClick={onBack}
            aria-label="Back"
          >
            ← Back
          </button>
        )}
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 mb-1">
          Register as Student
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
            <label htmlFor="fullName" className={labelClass}>
              Full name<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Ali Ahmed"
              value={values.fullName ?? ''}
              onChange={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              required
              aria-invalid={!!fullNameError}
              aria-describedby={fullNameError ? 'fullName-error' : undefined}
              className={inputClass}
            />
            {fullNameError && (
              <span id="fullName-error" className={errorClass} role="alert">
                {fullNameError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="department" className={labelClass}>
              Department<span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={values.department || ''}
              onChange={handleChange('department')}
              onBlur={handleBlur('department')}
              required
              aria-invalid={!!departmentError}
              aria-describedby={departmentError ? 'department-error' : undefined}
              className={selectClass}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {departmentError && (
              <span id="department-error" className={errorClass} role="alert">
                {departmentError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="rollNo" className={labelClass}>
              Roll number<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="rollNo"
              name="rollNo"
              type="text"
              placeholder="e.g. 21011519-085"
              value={values.rollNo ?? ''}
              onChange={handleChange('rollNo')}
              onBlur={handleBlur('rollNo')}
              required
              aria-invalid={!!rollNoError}
              aria-describedby={rollNoError ? 'rollNo-error' : undefined}
              className={inputClass}
            />
            {rollNoError && (
              <span id="rollNo-error" className={errorClass} role="alert">
                {rollNoError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="cgpa" className={labelClass}>
              CGPA<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="cgpa"
              name="cgpa"
              type="number"
              placeholder="e.g. 3.2"
              value={values.cgpa ?? ''}
              onChange={handleChange('cgpa')}
              onBlur={handleBlur('cgpa')}
              required
              min={0}
              max={4}
              step={0.1}
              aria-invalid={!!cgpaError}
              aria-describedby={cgpaError ? 'cgpa-error' : undefined}
              className={inputClass}
            />
            {cgpaError && (
              <span id="cgpa-error" className={errorClass} role="alert">
                {cgpaError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="email" className={labelClass}>
              University email<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="21011519-085@uog.edu.pk"
              value={values.email ?? ''}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              className={inputClass}
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
              placeholder="Min 6 characters"
              value={values.password ?? ''}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              required
              autoComplete="new-password"
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

          <div className={fieldWrapClass}>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm password<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={values.confirmPassword ?? ''}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              required
              autoComplete="new-password"
              aria-invalid={!!confirmPasswordError}
              aria-describedby={confirmPasswordError ? 'confirmPassword-error' : undefined}
              className={inputClass}
            />
            {confirmPasswordError && (
              <span id="confirmPassword-error" className={errorClass} role="alert">
                {confirmPasswordError}
              </span>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="session" className={labelClass}>
              Session<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="session"
              name="session"
              type="text"
              placeholder="e.g. 2021-2025"
              value={values.session ?? ''}
              onChange={handleChange('session')}
              onBlur={handleBlur('session')}
              required
              aria-invalid={!!sessionError}
              aria-describedby={sessionError ? 'session-error' : undefined}
              className={inputClass}
            />
            {sessionError && (
              <span id="session-error" className={errorClass} role="alert">
                {sessionError}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full sm:w-auto py-2.5 px-5 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="mt-4 text-sm text-gray-600 m-0">
          Already have an account?{' '}
         <a href="/student-login" className=' className="bg-transparent border-0 p-0 text-accent font-medium cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"'>Log in</a>
        </p>
      </form>
    </>
  );
}
