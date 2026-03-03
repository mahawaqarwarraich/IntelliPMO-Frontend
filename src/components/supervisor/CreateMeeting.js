import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20';
const labelClass = 'text-[13px] font-medium text-gray-900';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

export default function CreateMeeting() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const [meetingTitle, setMeetingTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [startingTime, setStartingTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setGroups([]);

    if (!user?.token || user?.role !== 'Supervisor') {
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
          return;
        }
        setSessionOk(true);
        return api.get('/api/supervisor/groups/own');
      })
      .then((res) => {
        if (res?.data?.groups != null) setGroups(res.data.groups);
      })
      .catch(() => setSessionOk(false))
      .finally(() => setLoading(false));
  }, [user?.token, user?.sessionId, user?.role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupId || !meetingTitle.trim() || !meetingDate || !meetingLocation.trim() || !startingTime || !endingTime) return;
    setSubmitting(true);
    api
      .post('/api/meetings', {
        group_id: groupId,
        meetingTitle: meetingTitle.trim(),
        meetingDate,
        meetingLocation: meetingLocation.trim(),
        startingTime,
        endingTime,
      })
      .then(() => {
        showToast('Meeting created successfully.', 'success');
        setMeetingTitle('');
        setGroupId('');
        setMeetingDate('');
        setMeetingLocation('');
        setStartingTime('');
        setEndingTime('');
      })
      .catch((err) => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to create meeting.';
        showToast(msg, 'error');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Create meeting</h1>
        <p className="text-sm text-gray-500 mb-6">Schedule a meeting with one of your groups.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={fieldWrapClass}>
            <label htmlFor="meeting-title" className={labelClass}>
              Meeting title <span className="text-red-500">*</span>
            </label>
            <input
              id="meeting-title"
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Weekly progress review"
              className={inputClass}
              required
            />
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="group" className={labelClass}>
              Select group <span className="text-red-500">*</span>
            </label>
            <select
              id="group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">— Select group —</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.ideaName ?? '—'}
                </option>
              ))}
            </select>
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="meeting-date" className={labelClass}>
              Meeting date <span className="text-red-500">*</span>
            </label>
            <input
              id="meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="meeting-location" className={labelClass}>
              Meeting location <span className="text-red-500">*</span>
            </label>
            <input
              id="meeting-location"
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="e.g. Room 101, Block A"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className={fieldWrapClass}>
              <label htmlFor="starting-time" className={labelClass}>
                Starting time <span className="text-red-500">*</span>
              </label>
              <input
                id="starting-time"
                type="time"
                value={startingTime}
                onChange={(e) => setStartingTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="ending-time" className={labelClass}>
                Ending time <span className="text-red-500">*</span>
              </label>
              <input
                id="ending-time"
                type="time"
                value={endingTime}
                onChange={(e) => setEndingTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating…' : 'Create meeting'}
            </button>
          </div>
        </form>
      </div>
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
