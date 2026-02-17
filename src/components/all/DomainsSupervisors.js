import { useState, useEffect } from 'react';
import { api } from '../../api/client';

export default function DomainsSupervisors() {
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  const [activeSessionYear, setActiveSessionYear] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch active session year and supervisors in parallel
    Promise.all([
      api.get('/api/sessions/active'),
      api.get('/api/domains-supervisors'),
    ])
      .then(([sessionRes, supervisorsRes]) => {
        const activeSession = sessionRes.data?.activeSession;
        setActiveSessionYear(activeSession?.year ?? null);
        setSupervisors(supervisorsRes.data?.supervisors ?? []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load data.');
        setSupervisors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Domains and Supervisors
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {activeSessionYear
              ? `Supervisors and their domains for the session ${activeSessionYear}.`
              : 'Supervisors and their domains for the active session.'}
          </p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Domains and Supervisors
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {activeSessionYear
              ? `Supervisors and their domains for the session ${activeSessionYear}.`
              : 'Supervisors and their domains for the active session.'}
          </p>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Domains and Supervisors
        </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {activeSessionYear
              ? `Supervisors and their domains for the session ${activeSessionYear}.`
              : 'Supervisors and their domains for the active session.'}
          </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]" aria-label="Domains and supervisors list">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-20">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Domain name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supervisor name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supervisor email</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500 text-sm">
                    No supervisors found for the active session.
                  </td>
                </tr>
              ) : (
                supervisors.map((row) => (
                  <tr key={row.number} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-sm text-gray-600">{row.number}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.domainName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{row.supervisorName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{row.supervisorEmail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
