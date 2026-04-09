import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function StudentsForD2() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isSupervisor = user?.role === 'Supervisor';
  const isEvaluator = user?.role === 'Evaluator';
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    if (!groupId) {
      setLoading(false);
      return;
    }

    async function run() {
      setLoading(true);
      setError('');
      setSessionOk(false);
      setStudents([]);

      try {
        const sessionRes = await api.get('/api/sessions/active-id');
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;

        if (!isAdmin) {
          if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
            if (!cancelled) setSessionOk(false);
            return;
          }
        }

        if (!cancelled) setSessionOk(true);

        const res = await api.get(`/api/groups/${groupId}/members`);
        if (!cancelled) setStudents(Array.isArray(res.data?.students) ? res.data.students : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message ?? err.message ?? 'Failed to load students.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [groupId, isAdmin, user?.sessionId]);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Students for D2</h1>
        <p className="text-sm text-gray-500">Students in this group. Click a roll number to manage D2 marks.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading students…</p>
        </div>
      ) : !sessionOk ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Students for D2</h2>
          <p className="text-sm text-gray-700">Your session is not active for now.</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No students in this group.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {students.map((s) => (
              <li key={s._id} className="p-4 hover:bg-gray-50/50 flex items-center justify-between">
                <div>
                  <Link
                    to={
                      isEvaluator
                        ? `/dashboard/evaluator/give-d2-marks/group/${groupId}/student/${s._id}`
                        : isSupervisor
                          ? `/dashboard/supervisor/give-d2-marks/group/${groupId}/student/${s._id}`
                          : `/dashboard/give-d2-marks/group/${groupId}/student/${s._id}`
                    }
                    state={{ rollNo: s.rollNo, fullName: s.fullName }}
                    className="text-accent font-medium hover:underline"
                  >
                    {s.rollNo}
                  </Link>
                  <span className="text-gray-600 ml-2">{s.fullName}</span>
                </div>
                {isAdmin && s.adminD2Marks && (
                  <span className="inline-flex items-center text-green-600 text-sm font-medium" title="Admin D2 marks recorded">
                    ✓
                  </span>
                )}
                {isSupervisor && s.supervisorD2Marks && (
                  <span
                    className="inline-flex items-center text-green-600 text-sm font-medium"
                    title="Supervisor D2 marks recorded"
                  >
                    ✓
                  </span>
                )}
                {isEvaluator && s.evaluatorD2Marks && (
                  <span
                    className="inline-flex items-center text-green-600 text-sm font-medium"
                    title="Evaluator D2 marks recorded"
                  >
                    ✓
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

