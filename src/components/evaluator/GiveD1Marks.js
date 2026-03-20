import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function GiveD1MarksEvaluator() {
  const { user } = useAuth();
  const isEvaluator = user?.role === 'Evaluator';

  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isEvaluator) {
        setSessionOk(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setSessionOk(false);
      setGroups([]);

      try {
        const sessionRes = await api.get('/api/sessions/active-id');
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;

        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          if (!cancelled) setSessionOk(false);
          return;
        }

        if (!cancelled) setSessionOk(true);

        const groupsRes = await api.get('/api/evaluator/groups/own');
        const list = Array.isArray(groupsRes.data?.groups) ? groupsRes.data.groups : [];
        if (!cancelled) setGroups(list);
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message ?? err.message ?? 'Failed to load groups.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [isEvaluator, user?.sessionId]);

  if (!isEvaluator) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Give D1 marks</h1>
          <p className="text-sm text-gray-700">Only evaluators can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
          <p className="text-sm text-gray-500">Loading your assigned D1 groups…</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading groups…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Give D1 marks</h1>
          <p className="text-sm text-gray-700">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
          <p className="text-sm text-gray-500">Enter or view D1 evaluation marks for your groups.</p>
        </div>
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No D1 groups found for you in the active session.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div
              key={g._id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 hover:border-accent hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Idea name</span>
                  <p className="text-gray-900 mt-0.5 font-medium">{g.ideaName ?? '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Supervisor</span>
                  <p className="text-gray-900 mt-0.5">{g.supervisorName ?? '—'}</p>
                </div>
              </div>
              {g.ideaDescription && (
                <div className="mt-3 text-sm">
                  <span className="font-medium text-gray-500">Description</span>
                  <p className="text-gray-700 mt-0.5 line-clamp-2">{g.ideaDescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
