import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../api/client';

export default function ManageEvaluators() {
  const [loading, setLoading] = useState(true);
  const [evaluators, setEvaluators] = useState([]);
  const [activeSessionYear, setActiveSessionYear] = useState(null);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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

  const fetchEvaluators = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get('/api/sessions/active'),
      api.get('/api/evaluators'),
    ])
      .then(([sessionRes, evaluatorsRes]) => {
        const activeSession = sessionRes.data?.activeSession;
        setActiveSessionYear(activeSession?.year ?? null);
        setEvaluators(evaluatorsRes.data?.evaluators ?? []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load evaluators.');
        setEvaluators([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEvaluators();
  }, [fetchEvaluators]);

  const handleDelete = (evaluator) => {
    if (!evaluator?._id) return;
    if (!window.confirm(`Are you sure you want to delete ${evaluator.evaluatorName} (${evaluator.email})?`)) {
      return;
    }
    setDeletingId(evaluator._id);
    api
      .delete(`/api/evaluators/${evaluator._id}`)
      .then(() => {
        setEvaluators((prev) => prev.filter((e) => e._id !== evaluator._id));
        showToast('Evaluator deleted successfully.', 'success');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Failed to delete evaluator.';
        showToast(msg, 'error');
      })
      .finally(() => setDeletingId(null));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Manage Evaluators
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {activeSessionYear
              ? `List of evaluators for the session ${activeSessionYear}.`
              : 'List of evaluators for the active session.'}
          </p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading evaluators…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Manage Evaluators
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {activeSessionYear
              ? `List of evaluators for the session ${activeSessionYear}.`
              : 'List of evaluators for the active session.'}
          </p>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Manage Evaluators
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {activeSessionYear
            ? `List of evaluators for the session ${activeSessionYear}.`
            : 'List of evaluators for the active session.'}
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]" aria-label="Evaluators list">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-20">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Evaluator name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluators.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500 text-sm">
                    No evaluators found for the active session.
                  </td>
                </tr>
              ) : (
                evaluators.map((evaluator) => (
                  <tr key={evaluator._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-sm text-gray-600">{evaluator.number}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{evaluator.evaluatorName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{evaluator.email}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(evaluator)}
                        disabled={deletingId === evaluator._id}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label={`Delete ${evaluator.evaluatorName}`}
                      >
                        {deletingId === evaluator._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
