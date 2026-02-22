import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function SupervisorAllocation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setSupervisors([]);
    setError('');

    api
      .get('/api/sessions/active-id')
      .then((sessionRes) => {
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        if (user?.role === 'Admin') {
          setSessionOk(true);
          return api.get('/api/supervisors');
        }
        const mySessionId = user?.sessionId ?? null;
        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          setSessionOk(false);
          return null;
        }
        setSessionOk(true);
        return api.get('/api/supervisors');
      })
      .then((res) => {
        if (res?.data?.supervisors) setSupervisors(res.data.supervisors);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load data.');
      })
      .finally(() => setLoading(false));
  }, [user?.role, user?.sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Supervisor Allocation Status</h2>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Supervisor Allocation Status</h2>
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Supervisor Allocation Status</h2>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Supervisor Allocation Status</h2>
      <p className="text-sm text-gray-500 mb-6">Supervisors and their allocated group count for the active session.</p>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Number</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Supervisor name</th>
              <th className="py-3 px-4 text-[13px] font-semibold text-gray-900">Groups count</th>
            </tr>
          </thead>
          <tbody>
            {supervisors.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 px-4 text-center text-sm text-gray-500">
                  No supervisors found for the active session.
                </td>
              </tr>
            ) : (
              supervisors.map((row) => (
                <tr key={row._id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-700">{row.number}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{row.supervisorName ?? '—'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{row.groupsCount ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
