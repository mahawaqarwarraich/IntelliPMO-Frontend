import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function GroupStatus() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setSessionActive(false);
    setGroup(null);
    setError('');

    api.get('/api/sessions/active-id')
      .then((sessionRes) => {
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user.sessionId ?? null;

        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          setSessionActive(false);
          return null;
        }

        setSessionActive(true);
        return api.get(`/api/groups/${user.id}`);
      })
      .then((groupRes) => {
        if (groupRes?.data?.group) setGroup(groupRes.data.group);
        else setGroup(null);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('');
          setGroup(null);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load data.');
        }
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.id, user?.sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Status</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Status</h2>
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Status</h2>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Status</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600">You are not in a group.</p>
        </div>
      </div>
    );
  }

  const approvalLabel = (status) =>
    status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Pending';

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Request Status</h2>
      <p className="text-sm text-gray-500 mb-6">Your group approval status.</p>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Idea name</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Supervisor approval</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Supervisor message</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Admin approval</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Admin message</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 last:border-b-0">
              <td className="py-3 px-4 text-sm text-gray-900">{group.ideaName ?? '—'}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{approvalLabel(group.supervisorStatus)}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{group.supervisorMessage || '—'}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{approvalLabel(group.adminStatus)}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{group.adminMessage || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
