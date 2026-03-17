import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function StudentsForD1() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    api
      .get(`/api/groups/${groupId}/members`)
      .then((res) => {
        setStudents(Array.isArray(res.data?.students) ? res.data.students : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? err.message ?? 'Failed to load students.');
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard/give-d1-marks')}
          className="text-sm font-medium text-accent hover:underline mb-2"
        >
          ← Back to Give D1 marks
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Students for D1</h1>
        <p className="text-sm text-gray-500">Students in this group. Click a roll number to manage D1 marks.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading students…</p>
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
                    to={`/dashboard/give-d1-marks/group/${groupId}/student/${s._id}`}
                    state={{ rollNo: s.rollNo, fullName: s.fullName }}
                    className="text-accent font-medium hover:underline"
                  >
                    {s.rollNo}
                  </Link>
                  <span className="text-gray-600 ml-2">{s.fullName}</span>
                </div>
                {isAdmin && s.adminD1Marks && (
                  <span
                    className="inline-flex items-center text-green-600 text-sm font-medium"
                    title="Admin D1 marks recorded"
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
