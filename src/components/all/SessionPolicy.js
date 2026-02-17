import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

const labelClass = 'text-sm font-medium text-gray-500';
const valueClass = 'text-base text-gray-900 font-medium';

function PolicyRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 border-b border-gray-100 last:border-0">
      <dt className={labelClass}>{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}

function PolicyCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <dl className="px-5 py-2">{children}</dl>
    </section>
  );
}

export default function SessionPolicy() {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const year = user?.session;

  useEffect(() => {
    if (!year) {
      setLoading(false);
      setError('Your session is not set. You cannot view session policy.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get('/api/session-policy', { params: { year } })
      .then((res) => {
        if (!cancelled) {
          setSession(res.data?.session ?? null);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(' ') : null) ||
            err.message ||
            'Failed to load session policy.';
          setError(msg);
          setSession(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Session Policy
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Rules and settings for your FYP session.
          </p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading session policy…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Session Policy
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Rules and settings for your FYP session.
          </p>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
            Session Policy
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Rules and settings for your FYP session.
          </p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600">No session policy found for your session.</p>
        </div>
      </div>
    );
  }

  const statusLabel = session.status === 'active' ? 'Active' : session.status === 'draft' ? 'Draft' : 'Inactive';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Session Policy
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Rules and settings for your FYP session ({session.year}).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PolicyCard title="Session details">
          <PolicyRow label="Session year" value={session.year} />
          <PolicyRow label="Status" value={statusLabel} />
        </PolicyCard>

        <PolicyCard title="Group rules">
          <PolicyRow label="Min members per group" value={session.minMembers} />
          <PolicyRow label="Max members per group" value={session.maxMembers} />
          <PolicyRow label="Min groups per supervisor" value={session.minGroups} />
          <PolicyRow label="Max groups per supervisor" value={session.maxGroups} />
        </PolicyCard>

        <PolicyCard title="Eligibility & evaluation" className="lg:col-span-2">
          <PolicyRow label="Minimum CGPA" value={session.minCGPA} />
          <PolicyRow label="Number of evaluations" value={session.numEvaluation} />
          <PolicyRow label="Defense 1 weightage (%)" value={`${session.d1Weightage}%`} />
          <PolicyRow label="Defense 2 weightage (%)" value={`${session.d2Weightage}%`} />
        </PolicyCard>
      </div>
    </div>
  );
}
