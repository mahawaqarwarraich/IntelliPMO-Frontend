import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ToggleGrade() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showGrade, setShowGrade] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    setStatusLoading(true);
    setError('');
    api
      .get('/api/marks/show-grade-status')
      .then((res) => {
        setShowGrade(Boolean(res.data?.showGrade));
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? err.message ?? 'Request failed.');
      })
      .finally(() => setStatusLoading(false));
  }, [isAdmin]);

  const handleToggle = useCallback(async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/api/marks/toggle-show-grade');
      const matched = res.data?.matchedCount ?? 0;
      const modified = res.data?.modifiedCount ?? 0;
      if (typeof res.data?.showGrade === 'boolean') {
        setShowGrade(res.data.showGrade);
      }
      setMessage(
        res.data?.message
          ? `${res.data.message} (${modified} record(s) updated out of ${matched} matched.)`
          : 'Toggle completed.'
      );
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Request failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Toggle grade</h1>
          <p className="text-sm text-gray-700">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Toggle grade visibility</h1>
        <p className="text-sm text-gray-500">Control whether students in the active session can see their grades.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          Click the button below to <strong>toggle</strong> grade visibility for every student in the{' '}
          <strong>active FYP session</strong>. When grades are hidden, students do not see their letter grade and GPA
          display; when shown, they can. You can use this to fully control how and when marks appear to students.
        </p>

        <div className="mb-4">
          <div className="text-sm text-gray-700">
            Current status:{' '}
            {statusLoading || showGrade == null ? (
              <span className="font-medium text-gray-500">Loading…</span>
            ) : showGrade ? (
              <span className="font-semibold text-green-700">Showing marks to students</span>
            ) : (
              <span className="font-semibold text-amber-700">Hiding marks from students</span>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700 mb-4" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md bg-green-50 border border-green-200 py-2 px-3 text-sm text-green-800 mb-4" role="status">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Working…' : 'Toggle grade visibility (active session)'}
        </button>
      </div>
    </div>
  );
}
