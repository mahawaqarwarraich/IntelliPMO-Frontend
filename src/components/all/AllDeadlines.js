import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

/** Converts 24h time string (e.g. "14:30") to 12h with AM/PM (e.g. "2:30 PM"). */
function formatTimeWithAmPm(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '—';
  const [hStr, mStr] = timeStr.trim().split(':');
  const h = parseInt(hStr, 10);
  const m = mStr != null ? parseInt(mStr, 10) : 0;
  if (Number.isNaN(h)) return timeStr;
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  const min = Number.isNaN(m) ? '00' : String(m).padStart(2, '0');
  return `${hour12}:${min} ${ampm}`;
}

export default function AllDeadlines() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError('');
      setDeadlines([]);
      setSessionOk(false);

      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        // For students, enforce active-session check; admins can always view.
        if (user.role === 'Student') {
          const sessionRes = await api.get('/api/sessions/active-id');
          const activeSessionId = sessionRes.data?.activeSessionId ?? null;
          const mySessionId = user?.sessionId ?? null;
          if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
            if (!cancelled) {
              setSessionOk(false);
            }
            return;
          }
          if (!cancelled) {
            setSessionOk(true);
          }
        } else {
          // Admin or other roles: no session check required here.
          setSessionOk(true);
        }

        // Frontend-only for now: assume GET /api/deadlines will return { deadlines: [...] } when implemented.
        const res = await api.get('/api/deadlines');
        if (!cancelled && Array.isArray(res.data?.deadlines)) {
          setDeadlines(res.data.deadlines);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message ?? err.message ?? 'Failed to load deadlines.';
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [user?.token, user?.role, user?.sessionId]);

  const isStudent = user?.role === 'Student';

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">All deadlines</h1>
          <p className="text-sm text-gray-500">Loading deadlines…</p>
        </div>
      </div>
    );
  }

  if (isStudent && !sessionOk) {
    return (
      <div className="max-w-3xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">All deadlines</h1>
          <p className="text-sm text-gray-700">Your session is not active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">All deadlines</h1>
        <p className="text-sm text-gray-500">
          Below are the deadlines for the current FYP session. You can upload your relevant documents for each deadline.
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {deadlines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          No deadlines found.
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((d) => (
            <div
              key={d._id || `${d.deadlineName}-${d.dueDate}-${d.dueTime}`}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {d.deadlineName || 'Untitled deadline'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Due on {formatDate(d.dueDate)} at{' '}
                    <span className="font-medium">
                      {formatTimeWithAmPm(d.dueTime)}
                    </span>
                  </p>
                </div>
              </div>

              {d.description && (
                <p className="text-sm text-gray-700 whitespace-pre-line">{d.description}</p>
              )}

              <div className="border-t border-gray-100 pt-3 mt-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Upload file (doc, pdf, ppt)
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
                  accept=".doc,.docx,.pdf,.ppt,.pptx"
                />
                <div className="mt-3">
                  <button
                    type="button"
                    className="py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
