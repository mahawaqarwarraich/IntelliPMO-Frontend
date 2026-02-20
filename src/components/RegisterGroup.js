import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20';
const labelClass = 'text-[13px] font-medium text-gray-900';
const errorClass = 'text-xs text-red-600 mt-0.5';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

export default function RegisterGroup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [minMembers, setMinMembers] = useState(1);
  const [maxMembers, setMaxMembers] = useState(3);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [ideaName, setIdeaName] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [supervisorId, setSupervisorId] = useState('');

  useEffect(() => {
    if (!user?.token || user?.role !== 'Student') {
      setLoading(false);
      setSessionActive(false);
      return;
    }

    setLoading(true);
    setSessionActive(false);

    Promise.all([api.get('/api/sessions/active'), api.get('/api/students/me')])
      .then(([sessionRes, meRes]) => {
        const activeSession = sessionRes.data?.activeSession;
        const student = meRes.data?.student;
        const mySessionId = student?.session_id ?? null;
        const activeId = activeSession?._id ?? null;

        if (!activeId || !mySessionId || String(mySessionId) !== String(activeId)) {
          setSessionActive(false);
          setMaxMembers(activeSession?.maxMembers ?? 3);
          setMinMembers(Math.max(1, Number(activeSession?.minMembers) ?? 1));
          return;
        }

        const max = Math.max(1, Number(activeSession.maxMembers) || 3);
        const min = Math.max(1, Math.min(Number(activeSession.minMembers) ?? 1, max));
        setSessionActive(true);
        setMaxMembers(max);
        setMinMembers(min);
        setMemberIds((prev) => {
          return prev.length === max ? prev : Array(max).fill('');
        });
      })
      .catch(() => {
        setSessionActive(false);
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.role]);

  useEffect(() => {
    if (!sessionActive || !user?.token) return;

    Promise.all([api.get('/api/students/list'), api.get('/api/domains-supervisors')])
      .then(([studentsRes, supervisorsRes]) => {
        setStudents(studentsRes.data?.students ?? []);
        setSupervisors(supervisorsRes.data?.supervisors ?? []);
        if (!supervisorId && supervisorsRes.data?.supervisors?.length) {
          setSupervisorId(supervisorsRes.data.supervisors[0]._id || '');
        }
      })
      .catch(() => {
        setStudents([]);
        setSupervisors([]);
      });
  }, [sessionActive, user?.token]);

  useEffect(() => {
    if (!sessionActive) return;
    setMemberIds((prev) => {
      const len = maxMembers;
      if (prev.length === len) return prev;
      const next = Array(len).fill('');
      prev.forEach((v, i) => {
        if (i < len) next[i] = v;
      });
      return next;
    });
  }, [sessionActive, maxMembers]);

  const handleMemberChange = (index, value) => {
    setMemberIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const nameTrimmed = ideaName?.trim() || '';
    if (nameTrimmed.length < 2) {
      setSubmitError('Idea name is required (at least 2 characters).');
      return;
    }

    const members = memberIds.filter((id) => id != null && id !== '');
    if (members.length < minMembers) {
      setSubmitError(`Select at least ${minMembers} member(s) for the group.`);
      return;
    }

    const uniqueMembers = [...new Set(members)];
    if (uniqueMembers.length !== members.length) {
      setSubmitError('Each member can only be selected once.');
      return;
    }

    if (!supervisorId?.trim()) {
      setSubmitError('Please select a supervisor.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/groups', {
        ideaName: nameTrimmed,
        ideaDescription: (ideaDescription ?? '').trim(),
        supervisor_id: supervisorId.trim(),
        members: uniqueMembers,
      });
      setSubmitSuccess('Group submitted for approval.');
      setIdeaName('');
      setIdeaDescription('');
      setMemberIds(Array(maxMembers).fill(''));
      setSupervisorId(supervisors[0]?._id ?? '');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register group.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Register Group</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Register Group</h2>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Register Group</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your idea and select group members (up to {maxMembers}) and a supervisor.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="rounded-md bg-green-50 border border-green-200 py-2 px-3 text-sm text-green-700" role="alert">
            {submitSuccess}
          </div>
        )}

        <div className={fieldWrapClass}>
          <label htmlFor="ideaName" className={labelClass}>
            Enter idea name <span className="text-red-500">*</span>
          </label>
          <input
            id="ideaName"
            type="text"
            placeholder="e.g. Smart Attendance System"
            value={ideaName}
            onChange={(e) => setIdeaName(e.target.value)}
            className={inputClass}
            maxLength={200}
          />
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="ideaDescription" className={labelClass}>
            Enter idea description
          </label>
          <textarea
            id="ideaDescription"
            placeholder="Brief description of your project idea"
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            className={inputClass + ' min-h-[100px] resize-y'}
            maxLength={2000}
            rows={4}
          />
        </div>

        {Array.from({ length: maxMembers }, (_, i) => (
          <div key={i} className={fieldWrapClass}>
            <label htmlFor={`rollNo-${i}`} className={labelClass}>
              Select roll no {i + 1} {i < minMembers ? <span className="text-red-500">*</span> : null}
            </label>
            <select
              id={`rollNo-${i}`}
              value={memberIds[i] ?? ''}
              onChange={(e) => handleMemberChange(i, e.target.value)}
              className={inputClass}
              required={i < minMembers}
            >
              <option value="">— Select student —</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.rollNo} — {s.fullName ?? '—'}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className={fieldWrapClass}>
          <label htmlFor="supervisor" className={labelClass}>
            Select supervisor <span className="text-red-500">*</span>
          </label>
          <select
            id="supervisor"
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">— Select supervisor —</option>
            {supervisors.map((s) => (
              <option key={s._id} value={s._id}>
                {s.supervisorName ?? '—'} {s.domainName ? `(${s.domainName})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Registering…' : 'Register group'}
          </button>
        </div>
      </form>
    </div>
  );
}
