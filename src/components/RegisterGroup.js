import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20';
const labelClass = 'text-[13px] font-medium text-gray-900';
const errorClass = 'text-xs text-red-600 mt-0.5';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

function getStudentDisplay(student) {
  return student ? `${student.rollNo ?? ''} — ${student.fullName ?? '—'}`.trim() || '—' : '—';
}

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  const [ideaName, setIdeaName] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [memberQueries, setMemberQueries] = useState([]); // roll no / search text per slot
  const [focusedMemberIndex, setFocusedMemberIndex] = useState(null); // for dropdown visibility
  const [supervisorId, setSupervisorId] = useState('');
  const [meStudent, setMeStudent] = useState(null);

  /** Prefer /me payload; fall back to JWT-backed auth id (same value) if shape differs. */
  const selfStudentId = useMemo(
    () => meStudent?._id ?? user?.id ?? null,
    [meStudent?._id, user?.id]
  );

  useEffect(() => {
    if (!user?.token || user?.role !== 'Student') {
      setMeStudent(null);
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
        setMeStudent(student ?? null);
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
      })
      .catch(() => {
        setSessionActive(false);
        setMeStudent(null);
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

  useLayoutEffect(() => {
    if (!sessionActive || !selfStudentId) return;
    const len = maxMembers;
    const selfDisplay = meStudent ? getStudentDisplay(meStudent) : '';
    setMemberIds((prev) => {
      const next = Array(len).fill('');
      next[0] = selfStudentId;
      for (let i = 1; i < len; i += 1) {
        next[i] = i < prev.length ? prev[i] : '';
      }
      return next;
    });
    setMemberQueries((prev) => {
      const next = Array(len).fill('');
      next[0] = selfDisplay;
      for (let i = 1; i < len; i += 1) {
        next[i] = i < prev.length ? prev[i] : '';
      }
      return next;
    });
  }, [sessionActive, maxMembers, selfStudentId, meStudent]);

  const getFilteredStudentsForSlot = (slotIndex) => {
    const query = (memberQueries[slotIndex] ?? '').trim().toLowerCase();
    const otherIds = memberIds.filter((_, i) => i !== slotIndex && memberIds[i]);
    const excludeSet = new Set(otherIds);
    if (!query) {
      return students.filter((s) => !excludeSet.has(s._id));
    }
    return students.filter((s) => {
      if (excludeSet.has(s._id)) return false;
      const roll = (s.rollNo ?? '').toLowerCase();
      const name = (s.fullName ?? '').toLowerCase();
      return roll.includes(query) || name.includes(query);
    });
  };

  const handleMemberInputChange = (index, value) => {
    if (index === 0) return;
    setMemberQueries((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setMemberIds((prev) => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const handleMemberSelect = (index, studentId) => {
    if (index === 0) return;
    const s = students.find((x) => x._id === studentId);
    setMemberIds((prev) => {
      const next = [...prev];
      next[index] = studentId;
      return next;
    });
    setMemberQueries((prev) => {
      const next = [...prev];
      next[index] = s ? getStudentDisplay(s) : '';
      return next;
    });
    setFocusedMemberIndex(null);
  };

  const handleMemberFocus = (index) => setFocusedMemberIndex(index);
  const handleMemberBlur = () => setTimeout(() => setFocusedMemberIndex(null), 150);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const nameTrimmed = ideaName?.trim() || '';
    if (nameTrimmed.length < 2) {
      setSubmitError('Idea name is required (at least 2 characters).');
      return;
    }

    if (!selfStudentId || String(memberIds[0] ?? '') !== String(selfStudentId)) {
      setSubmitError('Your account must be listed as the first member.');
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
      setMemberIds(() => {
        const arr = Array(maxMembers).fill('');
        if (selfStudentId) arr[0] = selfStudentId;
        return arr;
      });
      setMemberQueries(() => {
        const arr = Array(maxMembers).fill('');
        if (meStudent) arr[0] = getStudentDisplay(meStudent);
        return arr;
      });
      setFocusedMemberIndex(null);
      setSupervisorId(supervisors[0]?._id ?? '');
      showToast('Group submitted for approval.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register group.';
      setSubmitError(msg);
      showToast(msg, 'error');
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

      {toast.show && (
        <div
          style={{ animation: 'toast-fade-in 0.25s ease-out' }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          role="alert"
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

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

        {Array.from({ length: maxMembers }, (_, i) => {
          const isSelfSlot = i === 0;
          const selectedStudent = memberIds[i] ? students.find((s) => s._id === memberIds[i]) : null;
          const displaySource = isSelfSlot && meStudent ? selectedStudent || meStudent : selectedStudent;
          const inputValue = displaySource
            ? getStudentDisplay(displaySource)
            : (memberQueries[i] ?? '');
          const showDropdown = !isSelfSlot && focusedMemberIndex === i;
          const filtered = getFilteredStudentsForSlot(i);
          return (
            <div key={i} className={fieldWrapClass}>
              <label htmlFor={`member-${i}`} className={labelClass}>
                Member {i + 1}
                {isSelfSlot ? (
                  <span className="text-gray-500 font-normal"> (you — cannot be changed)</span>
                ) : (
                  <> — Roll no or name {i < minMembers ? <span className="text-red-500">*</span> : null}</>
                )}
              </label>
              <div className="relative">
                <input
                  id={`member-${i}`}
                  type="text"
                  placeholder={isSelfSlot ? '' : 'Type roll no or name to search…'}
                  value={inputValue}
                  onChange={(e) => handleMemberInputChange(i, e.target.value)}
                  onFocus={() => !isSelfSlot && handleMemberFocus(i)}
                  onBlur={handleMemberBlur}
                  readOnly={isSelfSlot}
                  tabIndex={isSelfSlot ? -1 : undefined}
                  className={
                    isSelfSlot
                      ? `${inputClass} bg-gray-50 text-gray-700 cursor-default`
                      : inputClass
                  }
                  autoComplete="off"
                  aria-autocomplete={isSelfSlot ? 'none' : 'list'}
                  aria-expanded={showDropdown && filtered.length > 0}
                  aria-controls={showDropdown ? `member-list-${i}` : undefined}
                />
                {showDropdown && filtered.length > 0 && (
                  <ul
                    id={`member-list-${i}`}
                    className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
                    role="listbox"
                  >
                    {filtered.slice(0, 20).map((s) => (
                      <li
                        key={s._id}
                        role="option"
                        className="px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-accent/10 focus:bg-accent/10 focus:outline-none"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleMemberSelect(i, s._id);
                        }}
                      >
                        {getStudentDisplay(s)}
                      </li>
                    ))}
                    {filtered.length > 20 && (
                      <li className="px-3 py-2 text-xs text-gray-500">Type more to narrow results</li>
                    )}
                  </ul>
                )}
                {showDropdown && (memberQueries[i] ?? '').trim() && filtered.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 py-2 px-3 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-500">
                    No matching student
                  </div>
                )}
              </div>
            </div>
          );
        })}

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
