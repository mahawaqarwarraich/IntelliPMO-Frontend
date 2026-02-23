import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../api/client';

const inputClass =
  'w-full min-w-0 py-2 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[2px] focus:ring-accent/20';

export default function AdminGroupRequest() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);
  const [localApprovals, setLocalApprovals] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/api/groups/status', { params: { status: 0 } })
      .then((res) => {
        const list = res.data?.groups ?? [];
        setGroups(list);
        const approvals = {};
        const messages = {};
        list.forEach((g) => {
          approvals[g._id] = g.adminStatus === 'accepted' ? 'accepted' : 'rejected';
          messages[g._id] = g.adminMessage ?? '';
        });
        setLocalApprovals(approvals);
        setLocalMessages(messages);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load groups.');
        setGroups([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const setApproval = (groupId, value) => {
    setLocalApprovals((prev) => ({ ...prev, [groupId]: value }));
  };

  const setMessage = (groupId, value) => {
    setLocalMessages((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleSave = () => {
    showToast('Save is not available.', 'error');
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '—';
    try {
      return new Date(dateVal).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return String(dateVal);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Group Requests</h1>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Group Requests</h1>
      <p className="text-sm text-gray-500 mb-6">Approve or reject group requests (oldest first).</p>

      {toast.show && (
        <div
          style={{ animation: 'toast-fade-in 0.25s ease-out' }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          role="alert"
        >
          <span>{toast.message}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700 mb-4" role="alert">
          {error}
        </div>
      )}

      {groups.length === 0 && !error && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No pending group requests.
        </div>
      )}

      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g._id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700">Idea name</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700">Supervisor name</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700">Supervisor approval</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700">Your approval</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700">Any message</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-gray-700 w-[100px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-900 align-top">{g.ideaName ?? '—'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 align-top">{g.supervisorName ?? '—'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 align-top">
                      {g.supervisorStatus === 'accepted' ? 'Accepted' : g.supervisorStatus === 'rejected' ? 'Rejected' : 'Pending'}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-wrap gap-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`approval-${g._id}`}
                            checked={(localApprovals[g._id] ?? 'rejected') === 'accepted'}
                            onChange={() => setApproval(g._id, 'accepted')}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="text-sm">Accepted</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`approval-${g._id}`}
                            checked={(localApprovals[g._id] ?? 'rejected') === 'rejected'}
                            onChange={() => setApproval(g._id, 'rejected')}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="text-sm">Rejected</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <textarea
                        placeholder="Optional message"
                        value={localMessages[g._id] ?? ''}
                        onChange={(e) => setMessage(g._id, e.target.value)}
                        className={inputClass + ' min-h-[80px] resize-y text-sm'}
                        rows={3}
                      />
                    </td>
                    <td className="py-3 px-4 align-top">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="py-2 px-4 bg-accent text-white border-0 rounded-md font-medium text-sm cursor-pointer hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
              Requested at: {formatDate(g.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
