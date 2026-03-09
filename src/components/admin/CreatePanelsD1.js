import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { api } from '../../api/client';

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20';
const labelClass = 'text-[13px] font-medium text-gray-900';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';
const selectClass =
  'w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed';

export default function CreatePanelsD1() {
  const [loading, setLoading] = useState(true);
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState('');

  const [panelName, setPanelName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('');
  const [members, setMembers] = useState([]);
  const [creating, setCreating] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    setEvaluators([]);

    api
      .get('/api/evaluators', { params: { defenseType: 'd1' } })
      .then((res) => {
        const list = Array.isArray(res.data?.evaluators) ? res.data.evaluators : [];
        setEvaluators(list);
      })
      .catch((err) => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to load evaluators.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvaluators = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    const list = Array.isArray(evaluators) ? evaluators : [];
    if (!q) return list;
    return list.filter((e) => String(e.evaluatorName || '').toLowerCase().includes(q));
  }, [evaluators, search]);

  const membersSet = useMemo(() => new Set(members.map((m) => m._id)), [members]);

  const canAdd = useMemo(() => {
    if (!selectedEvaluatorId) return false;
    if (membersSet.has(selectedEvaluatorId)) return false;
    return filteredEvaluators.some((e) => String(e._id) === String(selectedEvaluatorId));
  }, [selectedEvaluatorId, membersSet, filteredEvaluators]);

  const handleAdd = useCallback(() => {
    if (!canAdd) return;
    const found = filteredEvaluators.find((e) => String(e._id) === String(selectedEvaluatorId));
    if (!found) return;
    setMembers((prev) => [...prev, { _id: found._id, evaluatorName: found.evaluatorName, email: found.email }]);
    setSelectedEvaluatorId('');
  }, [canAdd, filteredEvaluators, selectedEvaluatorId]);

  const handleRemove = useCallback((id) => {
    setMembers((prev) => prev.filter((m) => String(m._id) !== String(id)));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!panelName.trim()) {
      showToast('Please enter panel name.', 'error');
      return;
    }
    if (members.length === 0) {
      showToast('Please add at least one evaluator.', 'error');
      return;
    }
    setCreating(true);
    try {
      await api.post('/api/panels/d1', {
        panelName: panelName.trim(),
        members: members.map((m) => m._id),
      });
      showToast('Panel created successfully.', 'success');
      setPanelName('');
      setSearch('');
      setSelectedEvaluatorId('');
      setMembers([]);
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to create panel.';
      showToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  }, [members, panelName, showToast]);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create panels for D1</h1>
        <p className="text-sm text-gray-500">Create evaluator panels using D1 evaluators from the active session.</p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading evaluators…</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`${fieldWrapClass} lg:col-span-1`}>
              <label htmlFor="panelName" className={labelClass}>
                Panel name <span className="text-red-500">*</span>
              </label>
              <input
                id="panelName"
                type="text"
                value={panelName}
                onChange={(e) => setPanelName(e.target.value)}
                placeholder="e.g. Panel A"
                className={inputClass}
              />
            </div>

            <div className={`${fieldWrapClass} lg:col-span-1`}>
              <label htmlFor="searchEvaluator" className={labelClass}>Search evaluator</label>
              <input
                id="searchEvaluator"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className={inputClass}
              />
            </div>

            <div className={`${fieldWrapClass} lg:col-span-1`}>
              <label htmlFor="selectEvaluator" className={labelClass}>
                Select evaluator <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  id="selectEvaluator"
                  value={selectedEvaluatorId}
                  onChange={(e) => setSelectedEvaluatorId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select evaluator</option>
                  {filteredEvaluators.map((e) => (
                    <option key={e._id} value={e._id} disabled={membersSet.has(String(e._id))}>
                      {e.evaluatorName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className="shrink-0 py-2.5 px-4 bg-accent text-white border-0 rounded-md font-semibold text-[14px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                {filteredEvaluators.length} evaluator(s) shown
                {members.length ? ` • ${members.length} added` : ''}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Selected members</h2>
            {members.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/40 p-6 text-sm text-gray-500 text-center">
                No evaluators added yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                {members.map((m) => (
                  <div key={m._id} className="flex items-center justify-between gap-3 p-3 bg-white">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.evaluatorName ?? '—'}</p>
                      <p className="text-xs text-gray-500 truncate">{m.email ?? ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(m._id)}
                      className="py-1.5 px-3 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500">
              Tip: Use search to quickly find evaluators by name, then add them to the panel.
            </p>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="w-full sm:w-auto py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating…' : 'Create panel'}
            </button>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{ animation: 'toast-fade-in 0.25s ease-out' }}
          role="alert"
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

