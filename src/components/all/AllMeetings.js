import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AllMeetings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  const handleDelete = useCallback(
    (meetingId) => {
      if (!meetingId || deletingId) return;
      if (!window.confirm('Delete this meeting?')) return;
      setDeletingId(meetingId);
      api
        .delete(`/api/meetings/${meetingId}`)
        .then(() => {
          setMeetings((prev) => prev.filter((m) => m._id !== meetingId));
          showToast('Meeting deleted.', 'success');
        })
        .catch((err) => {
          const msg = err.response?.data?.message ?? err.message ?? 'Failed to delete meeting.';
          showToast(msg, 'error');
        })
        .finally(() => setDeletingId(null));
    },
    [deletingId, showToast]
  );

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setMeetings([]);
    setError('');

    if (!user?.token || (user?.role !== 'Supervisor' && user?.role !== 'Student')) {
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
        return api.get('/api/meetings');
      })
      .then((res) => {
        if (res?.data?.meetings != null) setMeetings(res.data.meetings);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load meetings.');
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.sessionId, user?.role]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">All meetings</h1>
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">All meetings</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">All meetings</h1>
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">All meetings</h1>
      <p className="text-sm text-gray-500 mb-6">
        {user?.role === 'Supervisor'
          ? 'Meetings you created for your groups (active session).'
          : 'Meetings created by your supervisor (active session).'}
      </p>

      {meetings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No meetings scheduled.
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <div
              key={m._id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-900">{m.meetingTitle ?? '—'}</h2>
                {user?.role === 'Supervisor' && (
                  <button
                    type="button"
                    onClick={() => handleDelete(m._id)}
                    disabled={deletingId === m._id}
                    className="py-1.5 px-3 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingId === m._id ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500 block">Group</span>
                  <p className="text-gray-900 mt-0.5">{m.groupName ?? '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 block">Date</span>
                  <p className="text-gray-900 mt-0.5">{formatDate(m.meetingDate)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 block">Time</span>
                  <p className="text-gray-900 mt-0.5">
                    {m.startingTime ?? '—'} – {m.endingTime ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 block">Location</span>
                  <p className="text-gray-900 mt-0.5">{m.meetingLocation ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{ animation: 'toast-fade-in 0.25s ease-out' }}
          role="alert"
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
