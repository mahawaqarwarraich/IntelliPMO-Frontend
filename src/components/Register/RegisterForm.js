import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../../api/client.js';

const DEPARTMENTS = ['IT', 'CS', 'SE'];

const ROLE_CONFIG = {
  admin: [
    { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Ali Ahmed', required: true },
    { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'e.g. admin_uog', required: true },
    { name: 'email', label: 'University email', type: 'email', placeholder: 'name@uog.edu.pk', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', required: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••', required: true },
    { name: 'session', label: 'Session', type: 'text', placeholder: 'e.g. 2021-2025', required: true },
  ],
  student: [
    { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Ali Ahmed', required: true },
    { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
    { name: 'rollNo', label: 'Roll number', type: 'text', placeholder: 'e.g. 21011519-085', required: true },
    { name: 'cgpa', label: 'CGPA', type: 'number', placeholder: 'e.g. 3.2', required: true, min: 0, max: 4, step: 0.1 },
    { name: 'email', label: 'University email', type: 'email', placeholder: '21011519-085@uog.edu.pk', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', required: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••', required: true },
    { name: 'session', label: 'Session', type: 'text', placeholder: 'e.g. 2021-2025', required: true },
  ],
  supervisor: [
    { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Dr. Naveed Khan', required: true },
    { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'e.g. dr.naveed', required: true },
    { name: 'email', label: 'University email', type: 'email', placeholder: 'name@uog.edu.pk', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', required: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••', required: true },
    { name: 'domain', label: 'Domain', type: 'text', placeholder: 'e.g. AI, Web, Data Science', required: true },
    { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g. Professor, Assistant Professor', required: true },
  ],
  evaluator: [
    { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Prof. Sara Ali', required: true },
    { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'e.g. evaluator1', required: true },
    { name: 'email', label: 'University email', type: 'email', placeholder: 'name@uog.edu.pk', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', required: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••', required: true },
    { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g. Professor, External Examiner', required: true },
  ],
};

const MIN_PASSWORD_LENGTH = 6;
const MIN_FULLNAME_LENGTH = 2;
const MAX_FULLNAME_LENGTH = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_EMAIL_REGEX = /^\d{8}-\d{3}@uog\.edu\.pk$/i;
const ROLL_NO_REGEX = /^\d{8}-\d{3}$/;
const SESSION_REGEX = /^\d{4}-\d{4}$/;
const FULLNAME_REGEX = /^[\p{L}\s\-'.]+$/u;

function validateField(field, values, touchedState, role) {
  const val = (values[field.name] ?? '').trim();
  const t = touchedState[field.name];

  if (field.required && !val) {
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
    case 'email': {
      if (role === 'student') {
        if (!STUDENT_EMAIL_REGEX.test(val)) {
          return 'Email must be like 21011519-085@uog.edu.pk (8 digits, hyphen, 3 digits).';
        }
        return null;
      }
      if (!EMAIL_REGEX.test(val)) return 'Enter a valid email address.';
      const domain = val.split('@')[1]?.toLowerCase();
      if (domain !== 'uog.edu.pk') return 'Email must be from @uog.edu.pk.';
      return null;
    }
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
    case 'username':
      if (val.length < 2) return 'Enter at least 2 characters.';
      return null;
    default:
      return null;
  }
}

export default function RegisterForm({ role, roleLabel, onBack, onSubmit }) {
  const fields = ROLE_CONFIG[role] || [];
  const [values, setValues] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'select' ? '' : '' }), {})
  );
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

  const getError = (field, touchedState) => validateField(field, values, touchedState ?? touched, role);

  useEffect(() => {
    if (!submitError || !firstErrorIdRef.current) return;
    const el = document.getElementById(firstErrorIdRef.current);
    el?.focus?.();
    firstErrorIdRef.current = null;
  }, [submitError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const allTouched = fields.reduce((acc, f) => ({ ...acc, [f.name]: true }), {});
    setTouched(allTouched);

    const errors = fields.map((f) => ({ field: f, error: getError(f, allTouched) })).filter((e) => e.error);
    if (errors.length > 0) {
      firstErrorIdRef.current = errors[0].field.name;
      setSubmitError('Please fix the errors below.');
      return;
    }

    const payload = { ...values };
    delete payload.confirmPassword;

    if (role === 'student') {
      setSubmitting(true);
      try {
        const res = await api.post('/api/students/register', payload);
        showToast(res.data?.message || 'Account created successfully.', 'success');
        setValues(fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'select' ? '' : '' }), {}));
        setTouched({});
      } catch (err) {
        const data = err.response?.data;
        const message = data?.message || (Array.isArray(data?.errors) ? data.errors.join(' ') : err.message) || 'Registration failed. Please try again.';
        showToast(message, 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      onSubmit(payload);
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    }
  };

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
        className="flex flex-col gap-4 sm:gap-5 w-full max-w-full"
        onSubmit={handleSubmit}
        noValidate
      >
        <button
        type="button"
        className="inline-flex items-center gap-1.5 bg-transparent border-0 text-gray-500 text-sm cursor-pointer p-0 mb-1 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 rounded"
        onClick={onBack}
        aria-label="Back to role selection"
      >
        ← Back
      </button>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 mb-1">
        Register as {roleLabel}
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
        {fields.map((field) => {
          const error = getError(field, touched);
          return (
            <div key={field.name} className="flex flex-col gap-1.5 min-w-0">
              <label htmlFor={field.name} className="text-[13px] font-medium text-gray-900">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={handleChange(field.name)}
                  onBlur={handleBlur(field.name)}
                  required={field.required}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${field.name}-error` : undefined}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select department</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={handleChange(field.name)}
                  onBlur={handleBlur(field.name)}
                  required={field.required}
                  {...(field.min != null && { min: field.min })}
                  {...(field.max != null && { max: field.max })}
                  {...(field.step != null && { step: field.step })}
                  autoComplete={field.name === 'password' || field.name === 'confirmPassword' ? 'new-password' : 'off'}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${field.name}-error` : undefined}
                  className="w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              )}
              {error && (
                <span id={`${field.name}-error`} className="text-xs text-red-600 mt-0.5" role="alert">
                  {error}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full sm:w-auto py-2.5 px-5 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
    </>
  );
}
