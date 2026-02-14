import { useState, useCallback, useRef } from 'react';
import { api } from '../../api/client';

const DEPARTMENTS = ['CS', 'IT', 'SE'];
const SESSION_YEAR_REGEX = /^\d{4}-\d{4}$/;
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function validateSessionYear(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Session year is required.';
  if (!SESSION_YEAR_REGEX.test(v)) return 'Use format YYYY-YYYY (e.g. 2021-2025).';
  const [start, end] = v.split('-').map(Number);
  if (end <= start) return 'End year must be greater than start year.';
  return null;
}

function validateRequired(value, label = 'This field') {
  const v = typeof value === 'number' ? value : (value ?? '').toString().trim();
  if (v === '' || (typeof value === 'number' && (isNaN(value) || value === null))) return `${label} is required.`;
  return null;
}

function validateNumber(value, { min, max, integer = false, label = 'Value' }) {
  const n = Number(value);
  if (value === '' || value === null || value === undefined) return `${label} is required.`;
  if (Number.isNaN(n)) return `${label} must be a number.`;
  if (integer && !Number.isInteger(n)) return `${label} must be a whole number.`;
  if (min != null && n < min) return `${label} must be at least ${min}.`;
  if (max != null && n > max) return `${label} must be at most ${max}.`;
  return null;
}

const inputBase =
  'w-full min-w-0 py-2.5 px-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent disabled:bg-gray-50 disabled:cursor-not-allowed';
const inputClass = `${inputBase} border-gray-200`;
const inputErrorClass = `${inputBase} border-red-400`;
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'text-xs text-red-600 mt-0.5';

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      {children}
      {error && <p className={errorClass} role="alert">{error}</p>}
    </div>
  );
}

export default function ManageSessions() {
  const [createForm, setCreateForm] = useState({
    sessionYear: '',
    minCGPA: '',
    minMembers: '',
    maxMembers: '',
    minGroups: '',
    maxGroups: '',
    numEvaluations: '',
    defense1Weightage: '',
    defense2Weightage: '',
    department: '',
  });
  const [createTouched, setCreateTouched] = useState({});
  const [createSubmitMessage, setCreateSubmitMessage] = useState({ type: '', text: '' });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  const [statusForm, setStatusForm] = useState({ sessionYear: '', department: '', status: 'active' });
  const [statusTouched, setStatusTouched] = useState({});
  const [statusSubmitMessage, setStatusSubmitMessage] = useState({ type: '', text: '' });
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const setCreate = useCallback((name, value) => {
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    setCreateTouched((prev) => ({ ...prev, [name]: true }));
  }, []);
  const setStatus = useCallback((name, value) => {
    setStatusForm((prev) => ({ ...prev, [name]: value }));
    setStatusTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Create/Update validation
  const createErrors = {
    sessionYear: validateSessionYear(createForm.sessionYear),
    minCGPA: createTouched.minCGPA
      ? validateNumber(createForm.minCGPA, { min: 1, max: 4, label: 'Min CGPA' })
      : null,
    minMembers: createTouched.minMembers
      ? validateNumber(createForm.minMembers, { min: 1, integer: true, label: 'Min members' })
      : null,
    maxMembers: createTouched.maxMembers
      ? (() => {
          const e = validateNumber(createForm.maxMembers, { min: 1, integer: true, label: 'Max members' });
          if (e) return e;
          const min = Number(createForm.minMembers);
          const max = Number(createForm.maxMembers);
          if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) return 'Max members must be ≥ min members.';
          return null;
        })()
      : null,
    minGroups: createTouched.minGroups
      ? validateNumber(createForm.minGroups, { min: 0, integer: true, label: 'Min groups per supervisor' })
      : null,
    maxGroups: createTouched.maxGroups
      ? (() => {
          const e = validateNumber(createForm.maxGroups, { min: 0, integer: true, label: 'Max groups per supervisor' });
          if (e) return e;
          const min = Number(createForm.minGroups);
          const max = Number(createForm.maxGroups);
          if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) return 'Max groups must be ≥ min groups.';
          return null;
        })()
      : null,
    numEvaluations: createTouched.numEvaluations
      ? validateNumber(createForm.numEvaluations, { min: 0, integer: true, label: 'Number of evaluations' })
      : null,
    defense1Weightage: createTouched.defense1Weightage
      ? validateNumber(createForm.defense1Weightage, { min: 0, max: 100, label: 'Defense 1 weightage' })
      : null,
    defense2Weightage: createTouched.defense2Weightage
      ? validateNumber(createForm.defense2Weightage, { min: 0, max: 100, label: 'Defense 2 weightage' })
      : null,
    department: createTouched.department ? (createForm.department ? null : 'Please select a department.') : null,
  };
  const createValid = !Object.values(createErrors).some(Boolean);

  const statusErrors = {
    sessionYear: validateSessionYear(statusForm.sessionYear),
    department: statusTouched.department ? (statusForm.department ? null : 'Please select a department.') : null,
  };
  const statusValid = !Object.values(statusErrors).some(Boolean);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(createForm).map((k) => [k, true]));
    setCreateTouched(allTouched);
    const errs = {
      sessionYear: validateSessionYear(createForm.sessionYear),
      minCGPA: validateNumber(createForm.minCGPA, { min: 1, max: 4, label: 'Min CGPA' }),
      minMembers: validateNumber(createForm.minMembers, { min: 1, integer: true, label: 'Min members' }),
      maxMembers: (() => {
        const e = validateNumber(createForm.maxMembers, { min: 1, integer: true, label: 'Max members' });
        if (e) return e;
        const min = Number(createForm.minMembers);
        const max = Number(createForm.maxMembers);
        if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) return 'Max members must be ≥ min members.';
        return null;
      })(),
      minGroups: validateNumber(createForm.minGroups, { min: 0, integer: true, label: 'Min groups per supervisor' }),
      maxGroups: (() => {
        const e = validateNumber(createForm.maxGroups, { min: 0, integer: true, label: 'Max groups per supervisor' });
        if (e) return e;
        const min = Number(createForm.minGroups);
        const max = Number(createForm.maxGroups);
        if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) return 'Max groups must be ≥ min groups.';
        return null;
      })(),
      numEvaluations: validateNumber(createForm.numEvaluations, { min: 0, integer: true, label: 'Number of evaluations' }),
      defense1Weightage: validateNumber(createForm.defense1Weightage, { min: 0, max: 100, label: 'Defense 1 weightage' }),
      defense2Weightage: validateNumber(createForm.defense2Weightage, { min: 0, max: 100, label: 'Defense 2 weightage' }),
      department: createForm.department ? null : 'Please select a department.',
    };
    if (Object.values(errs).some(Boolean)) {
      setCreateSubmitMessage({ type: 'error', text: 'Please fix the errors below.' });
      return;
    }
    setCreateSubmitting(true);
    setCreateSubmitMessage({ type: '', text: '' });
    const payload = {
      sessionYear: createForm.sessionYear.trim(),
      department: createForm.department,
      status: 'draft',
      minCGPA: Number(createForm.minCGPA),
      minMembers: Number(createForm.minMembers),
      maxMembers: Number(createForm.maxMembers),
      minGroups: Number(createForm.minGroups),
      maxGroups: Number(createForm.maxGroups),
      numEvaluations: Number(createForm.numEvaluations),
      defense1Weightage: Number(createForm.defense1Weightage),
      defense2Weightage: Number(createForm.defense2Weightage),
    };
    api
      .post('/api/admins/save-session', payload)
      .then((res) => {
        const message = res.data?.message || 'Session saved successfully.';
        setCreateSubmitMessage({ type: 'success', text: message });
        showToast(message, 'success');
        setCreateForm({
          sessionYear: '',
          minCGPA: '',
          minMembers: '',
          maxMembers: '',
          minGroups: '',
          maxGroups: '',
          numEvaluations: '',
          defense1Weightage: '',
          defense2Weightage: '',
          department: '',
        });
        setCreateTouched({});
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(' ') : null) ||
          err.message ||
          'Failed to save session.';
        setCreateSubmitMessage({ type: 'error', text: msg });
        showToast(msg, 'error');
      })
      .finally(() => setCreateSubmitting(false));
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    setStatusTouched({ sessionYear: true, department: true, status: true });
    const sessionErr = validateSessionYear(statusForm.sessionYear);
    const deptErr = statusForm.department ? null : 'Please select a department.';
    if (sessionErr || deptErr) {
      setStatusSubmitMessage({ type: 'error', text: sessionErr || deptErr });
      return;
    }
    setStatusSubmitting(true);
    setStatusSubmitMessage({ type: '', text: '' });
    const payload = {
      sessionYear: statusForm.sessionYear.trim(),
      department: statusForm.department,
      status: statusForm.status,
    };
    api
      .post('/api/admins/update-session', payload)
      .then((res) => {
        const message = res.data?.message || 'Status updated successfully.';
        setStatusSubmitMessage({ type: 'success', text: message });
        showToast(message, 'success');
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(' ') : null) ||
          err.message ||
          'Failed to update status.';
        setStatusSubmitMessage({ type: 'error', text: msg });
        showToast(msg, 'error');
      })
      .finally(() => setStatusSubmitting(false));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
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
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Manage FYP Sessions
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Create or update sessions and change their status.
        </p>
      </header>

      {/* Create / Update — primary card */}
      <section
        className="rounded-2xl border-2 border-accent/30 bg-white shadow-card overflow-hidden"
        aria-labelledby="create-heading"
      >
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-5 py-4 sm:px-6 sm:py-5 border-b border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 id="create-heading" className="text-lg sm:text-xl font-semibold text-gray-900">
                Create or update session
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Set session year, group rules, weightages, and department.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <Field id="create-year" label="Session year (e.g. 2021-2025)" error={createErrors.sessionYear}>
              <input
                id="create-year"
                type="text"
                placeholder="2021-2025"
                value={createForm.sessionYear}
                onChange={(e) => setCreate('sessionYear', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, sessionYear: true }))}
                className={createErrors.sessionYear ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.sessionYear}
              />
            </Field>
            <Field id="create-department" label="Department" error={createErrors.department}>
              <select
                id="create-department"
                value={createForm.department}
                onChange={(e) => setCreate('department', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, department: true }))}
                className={createErrors.department ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.department}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field id="create-minCGPA" label="Min CGPA (1–4)" error={createErrors.minCGPA}>
              <input
                id="create-minCGPA"
                type="number"
                min={1}
                max={4}
                step="0.01"
                placeholder="e.g. 2.5"
                value={createForm.minCGPA}
                onChange={(e) => setCreate('minCGPA', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, minCGPA: true }))}
                className={createErrors.minCGPA ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.minCGPA}
              />
            </Field>
            <Field id="create-minMembers" label="Min members per group" error={createErrors.minMembers}>
              <input
                id="create-minMembers"
                type="number"
                min={1}
                placeholder="e.g. 2"
                value={createForm.minMembers}
                onChange={(e) => setCreate('minMembers', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, minMembers: true }))}
                className={createErrors.minMembers ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.minMembers}
              />
            </Field>
            <Field id="create-maxMembers" label="Max members per group" error={createErrors.maxMembers}>
              <input
                id="create-maxMembers"
                type="number"
                min={1}
                placeholder="e.g. 4"
                value={createForm.maxMembers}
                onChange={(e) => setCreate('maxMembers', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, maxMembers: true }))}
                className={createErrors.maxMembers ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.maxMembers}
              />
            </Field>
            <Field id="create-minGroups" label="Min groups per supervisor" error={createErrors.minGroups}>
              <input
                id="create-minGroups"
                type="number"
                min={0}
                placeholder="e.g. 0"
                value={createForm.minGroups}
                onChange={(e) => setCreate('minGroups', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, minGroups: true }))}
                className={createErrors.minGroups ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.minGroups}
              />
            </Field>
            <Field id="create-maxGroups" label="Max groups per supervisor" error={createErrors.maxGroups}>
              <input
                id="create-maxGroups"
                type="number"
                min={0}
                placeholder="e.g. 5"
                value={createForm.maxGroups}
                onChange={(e) => setCreate('maxGroups', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, maxGroups: true }))}
                className={createErrors.maxGroups ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.maxGroups}
              />
            </Field>
            <Field id="create-numEval" label="Number of evaluations" error={createErrors.numEvaluations}>
              <input
                id="create-numEval"
                type="number"
                min={0}
                placeholder="e.g. 2"
                value={createForm.numEvaluations}
                onChange={(e) => setCreate('numEvaluations', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, numEvaluations: true }))}
                className={createErrors.numEvaluations ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.numEvaluations}
              />
            </Field>
            <Field id="create-d1" label="Defense 1 weightage (%)" error={createErrors.defense1Weightage}>
              <input
                id="create-d1"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 50"
                value={createForm.defense1Weightage}
                onChange={(e) => setCreate('defense1Weightage', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, defense1Weightage: true }))}
                className={createErrors.defense1Weightage ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.defense1Weightage}
              />
            </Field>
            <Field id="create-d2" label="Defense 2 weightage (%)" error={createErrors.defense2Weightage}>
              <input
                id="create-d2"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 50"
                value={createForm.defense2Weightage}
                onChange={(e) => setCreate('defense2Weightage', e.target.value)}
                onBlur={() => setCreateTouched((t) => ({ ...t, defense2Weightage: true }))}
                className={createErrors.defense2Weightage ? inputErrorClass : inputClass}
                aria-invalid={!!createErrors.defense2Weightage}
              />
            </Field>
          </div>
          {createSubmitMessage.text && (
            <p
              className={`mt-4 text-sm ${createSubmitMessage.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
              role="status"
            >
              {createSubmitMessage.text}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={createSubmitting}
              className="px-5 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createSubmitting ? 'Saving…' : 'Save session'}
            </button>
          </div>
        </form>
      </section>

      {/* Change session status */}
      <section
        className="rounded-2xl border-2 border-amber-200/60 bg-white shadow-card overflow-hidden max-w-2xl"
        aria-labelledby="status-heading"
      >
        <div className="bg-gradient-to-r from-amber-50 to-amber-50/80 px-5 py-4 sm:px-6 sm:py-5 border-b border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h2 id="status-heading" className="text-lg sm:text-xl font-semibold text-gray-900">
                Change session status
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Set a session to draft, active, or inactive by year and department.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleStatusSubmit} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <Field id="status-year" label="Session year (e.g. 2021-2025)" error={statusErrors.sessionYear}>
              <input
                id="status-year"
                type="text"
                placeholder="2021-2025"
                value={statusForm.sessionYear}
                onChange={(e) => setStatus('sessionYear', e.target.value)}
                onBlur={() => setStatusTouched((t) => ({ ...t, sessionYear: true }))}
                className={statusErrors.sessionYear ? inputErrorClass : inputClass}
                aria-invalid={!!statusErrors.sessionYear}
              />
            </Field>
            <Field id="status-department" label="Department" error={statusErrors.department}>
              <select
                id="status-department"
                value={statusForm.department}
                onChange={(e) => setStatus('department', e.target.value)}
                onBlur={() => setStatusTouched((t) => ({ ...t, department: true }))}
                className={statusErrors.department ? inputErrorClass : inputClass}
                aria-invalid={!!statusErrors.department}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field id="status-value" label="New status">
              <select
                id="status-value"
                value={statusForm.status}
                onChange={(e) => setStatus('status', e.target.value)}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>
          {statusSubmitMessage.text && (
            <p
              className={`mt-4 text-sm ${statusSubmitMessage.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
              role="status"
            >
              {statusSubmitMessage.text}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={statusSubmitting}
              className="px-5 py-2.5 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {statusSubmitting ? 'Updating…' : 'Update status'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
