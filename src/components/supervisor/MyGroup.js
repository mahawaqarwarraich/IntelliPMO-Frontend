import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function MyGroup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setGroups([]);
    setError('');

    if (!user?.token) {
      setLoading(false);
      return;
    }

    api
      .get('/api/sessions/active-id')
      .then((sessionRes) => {
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;
        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          setSessionOk(false);
          setLoading(false);
          return null;
        }
        setSessionOk(true);
        return api.get('/api/supervisor/groups/own');
      })
      .then((res) => {
        if (res?.data?.groups != null) setGroups(res.data.groups);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load groups.');
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">My groups</h1>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">My groups</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">My groups</h1>
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">My groups</h1>
      <p className="text-sm text-gray-500 mb-6">
        Groups you have accepted (active session).
      </p>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No groups yet.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div
              key={g._id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
            >
              <h2 className="text-base font-semibold text-gray-900">
                {g.ideaName ?? '—'}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
