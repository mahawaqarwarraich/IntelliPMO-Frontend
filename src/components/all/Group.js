import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function Group() {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [canAccessGroup, setCanAccessGroup] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setCanAccessGroup(false);

    if (!user?.token || !groupId) {
      setLoading(false);
      return;
    }

    api
      .get('/api/sessions/active-id')
      .then((sessionRes) => {
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;
        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          setSessionOk(false);
          setLoading(false);
          return;
        }
        setSessionOk(true);

        if (user?.role === 'Student') {
          return api
            .get('/api/students/me')
            .then((meRes) => {
              const studentGroupId = meRes.data?.student?.group_id ?? null;
              setCanAccessGroup(!!studentGroupId && String(studentGroupId) === String(groupId));
            })
            .catch(() => setCanAccessGroup(false));
        }
        if (user?.role === 'Supervisor') {
          return api
            .get('/api/supervisor/groups/own')
            .then((groupsRes) => {
              const groups = groupsRes.data?.groups ?? [];
              const belongs = groups.some((g) => String(g._id) === String(groupId));
              setCanAccessGroup(belongs);
            })
            .catch(() => setCanAccessGroup(false));
        }
        setCanAccessGroup(false);
      })
      .catch(() => {
        setSessionOk(false);
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.sessionId, user?.role, groupId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (!canAccessGroup) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-800 font-medium">You cannot access this group chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Group chat</h2>
      <p className="text-sm text-gray-600">
        Group chat placeholder for group {groupId || '—'}. Implementation coming soon.
      </p>
    </div>
  );
}
