import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';

const MIN_PASSWORD_LENGTH = 6;

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setMessage({ type: '', text: '' });
    setVerifyError('');

    if (!token) {
      setTokenValid(false);
      setVerifying(false);
      setVerifyError('Missing token. Please use the link from your email.');
      return;
    }

    let cancelled = false;
    setVerifying(true);
    api
      .get('/verify-token', { params: { token } })
      .then(() => {
        if (cancelled) return;
        setTokenValid(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setTokenValid(false);
        setVerifyError(err.response?.data?.message || 'Invalid or expired token.');
      })
      .finally(() => {
        if (cancelled) return;
        setVerifying(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!token) {
      setMessage({ type: 'error', text: 'Missing token. Please use the link from your email.' });
      return;
    }
    if (newPassword.trim().length < MIN_PASSWORD_LENGTH) {
      setMessage({ type: 'error', text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/set-password', { token, new_password: newPassword });
      setMessage({ type: 'success', text: res.data?.message || 'Password set successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to set password.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-dark m-0 mb-2">Set your password</h1>
        <p className="text-sm text-gray-600 m-0 mb-6">
          Use this page to set your password for IntelliPMO.
        </p>

        {verifying ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin align-middle" aria-hidden />
            <span className="ml-3 text-sm text-gray-700">Verifying token…</span>
          </div>
        ) : !tokenValid ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700 m-0">{verifyError || 'Invalid or expired token.'}</p>
            <p className="text-xs text-gray-600 mt-3 mb-0">
              Go back to the{' '}
              <Link to="/" className="text-accent font-medium hover:underline">
                home page
              </Link>
              .
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {message.text && (
              <div
                className={`text-sm rounded-lg border px-3 py-2 ${
                  message.type === 'success'
                    ? 'text-green-700 bg-green-50 border-green-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}
                role="alert"
              >
                {message.text}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-[13px] font-medium text-gray-900">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
                placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-medium text-gray-900">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
                placeholder="Re-enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full py-2.5 px-5 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving…' : 'Set password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

