import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function PanelsForD1() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [panels, setPanels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      setSessionOk(false);
      setPanels([]);

      try {
        const sessionRes = await api.get('/api/sessions/active-id');
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;
        const isAdmin = user?.role === 'Admin';

        if (!isAdmin) {
          if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
            if (!cancelled) setSessionOk(false);
            return;
          }
        }
        if (!cancelled) setSessionOk(true);

        const panelsRes = await api.get('/api/panels', { params: { defenseType: 'd1' } });
        const list = Array.isArray(panelsRes.data?.panels) ? panelsRes.data.panels : [];
        if (!cancelled) setPanels(list);
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message ?? err.message ?? 'Failed to load panels.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [user?.role, user?.sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Panels for D1</h1>
          <p className="text-sm text-gray-700">Your session is not active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Panels for D1</h1>
        <p className="text-sm text-gray-500">D1 panels, their members and assigned groups for the active session.</p>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : panels.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No D1 panels found for the active session.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Panel name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Assigned Groups
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {panels.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {p.panelName ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {Array.isArray(p.memberNames) && p.memberNames.length > 0
                        ? p.memberNames.join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {Array.isArray(p.assignedGroupNames) && p.assignedGroupNames.length > 0
                        ? p.assignedGroupNames.join(', ')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
