import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function GiveD1Marks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [ideaNameFilter, setIdeaNameFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/api/groups/registered')
      .then((res) => {
        setGroups(Array.isArray(res.data?.groups) ? res.data.groups : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? err.message ?? 'Failed to load groups.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredGroups = useMemo(() => {
    const q = (ideaNameFilter || '').trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => (g.ideaName || '').toLowerCase().includes(q));
  }, [groups, ideaNameFilter]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
          <p className="text-sm text-gray-500">Enter or view D1 evaluation marks.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading groups…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
          <p className="text-sm text-gray-500">Enter or view D1 evaluation marks.</p>
        </div>
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Give D1 marks</h1>
        <p className="text-sm text-gray-500">Registered groups (overall status approved). Select a group to enter or view D1 marks.</p>
      </div>

      {groups.length > 0 && (
        <div className="mb-4">
          <label htmlFor="idea-name-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by idea name
          </label>
          <input
            id="idea-name-filter"
            type="text"
            value={ideaNameFilter}
            onChange={(e) => setIdeaNameFilter(e.target.value)}
            placeholder="Type to filter…"
            className="w-full max-w-md py-2 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
          />
        </div>
      )}

      {groups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No registered groups in the active session.
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
          No groups match the filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((g) => (
            <div
              key={g._id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/dashboard/give-d1-marks/group/${g._id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/dashboard/give-d1-marks/group/${g._id}`);
                }
              }}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 hover:border-accent hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Idea name</span>
                  <p className="text-gray-900 mt-0.5 font-medium">{g.ideaName ?? '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Supervisor</span>
                  <p className="text-gray-900 mt-0.5">{g.supervisorName ?? '—'}</p>
                </div>
              </div>
              {g.ideaDescription && (
                <div className="mt-3 text-sm">
                  <span className="font-medium text-gray-500">Description</span>
                  <p className="text-gray-700 mt-0.5 line-clamp-2">{g.ideaDescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
