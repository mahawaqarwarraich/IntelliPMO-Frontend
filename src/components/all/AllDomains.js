import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function AllDomains() {
  const { user } = useAuth();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get('/api/domains')
      .then((res) => {
        if (!cancelled) {
          setDomains(res.data?.domains ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load domains.');
          setDomains([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            All Domains
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            List of all registered domains.
          </p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading domains…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            All Domains
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            List of all registered domains.
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
          All Domains
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          List of all registered domains.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]" aria-label="Domains list">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-20">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Domain name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                {isAdmin && (
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 w-24">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="py-8 px-4 text-center text-gray-500 text-sm">
                    No domains found.
                  </td>
                </tr>
              ) : (
                domains.map((d, index) => (
                  <tr key={d._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{d.description || '—'}</td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          aria-label={`Delete ${d.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    )}
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
