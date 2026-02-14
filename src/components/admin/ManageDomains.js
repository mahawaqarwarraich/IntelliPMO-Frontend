import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';

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
      {error && (
        <p className={errorClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ManageDomains() {
  const [domains, setDomains] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, description: false });

  const fetchDomains = useCallback(() => {
    setLoadingDomains(true);
    api
      .get('/api/domains')
      .then((res) => setDomains(res.data?.domains ?? []))
      .catch(() => setDomains([]))
      .finally(() => setLoadingDomains(false));
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  useEffect(() => {
    if (!selectedId) {
      setName('');
      setDescription('');
      return;
    }
    const d = domains.find((x) => x._id === selectedId);
    if (d) {
      setName(d.name ?? '');
      setDescription(d.description ?? '');
    }
  }, [selectedId, domains]);

  const nameError = touched.name && !name.trim() ? 'Domain name is required.' : null;
  const valid = name.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true });
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Domain name is required.' });
      return;
    }
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    const payload = { name: name.trim(), description: description.trim() };
    const promise = selectedId
      ? api.put(`/api/domains/${selectedId}`, payload)
      : api.post('/api/domains', payload);
    promise
      .then((res) => {
        const msg = res.data?.message || (selectedId ? 'Domain updated successfully.' : 'Domain created successfully.');
        setMessage({ type: 'success', text: msg });
        setSelectedId('');
        setName('');
        setDescription('');
        setTouched({ name: false, description: false });
        fetchDomains();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(' ') : null) ||
          err.message ||
          (selectedId ? 'Failed to update domain.' : 'Failed to create domain.');
        setMessage({ type: 'error', text: msg });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Manage Domains
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Create a new domain or select an existing one to update its name and description.
        </p>
      </header>

      <section
        className="rounded-2xl border-2 border-accent/30 bg-white shadow-card overflow-hidden"
        aria-labelledby="domain-heading"
      >
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-5 py-4 sm:px-6 sm:py-5 border-b border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h2 id="domain-heading" className="text-lg sm:text-xl font-semibold text-gray-900">
                Create or update domain
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Enter domain name and description.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <Field id="domain-select" label="Select domain to edit (leave empty to create new)">
            <select
              id="domain-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={inputClass}
              disabled={loadingDomains}
            >
              <option value="">— Create new domain —</option>
              {domains.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="domain-name" label="Domain name" error={nameError}>
            <input
              id="domain-name"
              type="text"
              placeholder="e.g. Web Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={nameError ? inputErrorClass : inputClass}
              aria-invalid={!!nameError}
            />
          </Field>
          <Field id="domain-description" label="Domain description">
            <textarea
              id="domain-description"
              rows={3}
              placeholder="Brief description of the domain"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              className={inputClass}
            />
          </Field>
          {message.text && (
            <p
              className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
              role="status"
            >
              {message.text}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || !valid}
              className="px-5 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving…' : selectedId ? 'Update domain' : 'Create domain'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
