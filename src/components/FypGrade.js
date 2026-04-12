import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function FypGrade() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get('/api/marks/my-fyp-grade')
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Could not load FYP grade.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">FYP Grade</h1>

      {loading && <p className="text-gray-600">Loading…</p>}

      {!loading && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && data && !data.showGrade && (
        <p className="text-gray-700">Marks are not shown by the admin.</p>
      )}

      {!loading && !error && data?.showGrade && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900">
                  Grade
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900">
                  Percentage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 text-gray-900 font-medium">{data.grade ?? '—'}</td>
                <td className="px-4 py-3 text-gray-800">
                  {Number.isFinite(Number(data.percentage))
                    ? `${Number(data.percentage).toFixed(2)}%`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {Number.isFinite(Number(data.gpa)) ? Number(data.gpa).toFixed(2) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
