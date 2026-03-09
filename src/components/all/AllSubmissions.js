import { useState, useEffect, useMemo } from 'react';
import { api } from '../../api/client';

const ALL_DEADLINES_VALUE = '';

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AllSubmissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [selectedDeadline, setSelectedDeadline] = useState(ALL_DEADLINES_VALUE);

  const deadlineOptions = useMemo(() => {
    const names = [...new Set(submissions.map((s) => s.deadlineName).filter(Boolean))].sort();
    return [{ value: ALL_DEADLINES_VALUE, label: 'All deadlines' }, ...names.map((name) => ({ value: name, label: name }))];
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (selectedDeadline === ALL_DEADLINES_VALUE) return submissions;
    return submissions.filter((s) => s.deadlineName === selectedDeadline);
  }, [submissions, selectedDeadline]);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSubmissions([]);

    api
      .get('/api/submissions')
      .then((res) => {
        if (Array.isArray(res.data?.submissions)) {
          setSubmissions(res.data.submissions);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to load submissions.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">All submissions</h1>
        <p className="text-sm text-gray-500">
          Submissions for deadlines in the active FYP session.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading submissions…</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="deadline-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by deadline
            </label>
            <select
              id="deadline-filter"
              value={selectedDeadline}
              onChange={(e) => setSelectedDeadline(e.target.value)}
              className="w-full sm:w-auto min-w-[200px] py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
            >
              {deadlineOptions.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500 text-sm">
              No submissions found for the active session.
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500 text-sm">
              No submissions for the selected deadline.
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Deadline
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        File
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Submitted by
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Submitted at
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredSubmissions.map((s) => (
                      <tr key={s._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                          {s.deadlineName || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {s.fileUrl ? (
                            <a
                              href={s.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:text-accent-hover underline underline-offset-2"
                            >
                              {s.fileName || 'Download'}
                            </a>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                          {s.rollNo || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              s.status === 'late'
                                ? 'bg-red-50 text-red-700 border border-red-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}
                          >
                            {s.status === 'late' ? 'Late' : 'On time'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                          {formatDateTime(s.submittedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

