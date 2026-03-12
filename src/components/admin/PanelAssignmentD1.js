import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { api } from '../../api/client';

const labelClass = 'text-[13px] font-medium text-gray-900';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';
const selectClass =
  'w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 disabled:bg-gray-50 disabled:cursor-not-allowed';

export default function PanelAssignmentD1() {
  const [loading, setLoading] = useState(true);
  const [panels, setPanels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [selectedPanelId, setSelectedPanelId] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
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

  const loadData = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/api/panels', { params: { defenseType: 'd1' } }),
      api.get('/api/admin/groups/registered-unassigned'),
    ])
      .then(([panelsRes, groupsRes]) => {
        const panelList = Array.isArray(panelsRes.data?.panels) ? panelsRes.data.panels : [];
        const groupList = Array.isArray(groupsRes.data?.groups) ? groupsRes.data.groups : [];
        console.log('GET /api/admin/groups/registered-unassigned result:', groupsRes.data);
        setPanels(panelList);
        setGroups(groupList);
      })
      .catch((err) => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to load data.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableGroups = useMemo(() => (Array.isArray(groups) ? groups : []), [groups]);

  const toggleGroup = useCallback((groupId) => {
    setSelectedGroupIds((prev) => {
      const id = String(groupId);
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }, []);

  const selectAllGroups = useCallback(() => {
    setSelectedGroupIds(availableGroups.map((g) => String(g._id)));
  }, [availableGroups]);

  const clearGroups = useCallback(() => {
    setSelectedGroupIds([]);
  }, []);

  const handleCreateAssignment = useCallback(async () => {
    if (!selectedPanelId) {
      showToast('Please select a panel.', 'error');
      return;
    }
    if (selectedGroupIds.length === 0) {
      showToast('Please select at least one group.', 'error');
      return;
    }
    setCreating(true);
    try {
      const res = await api.post(`/api/panels/${selectedPanelId}/assign-groups`, {
        groupIds: selectedGroupIds,
      });
      const msg = res.data?.message ?? 'Assignment(s) created successfully.';
      showToast(msg, 'success');
      setSelectedPanelId('');
      setSelectedGroupIds([]);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to create assignment(s).';
      showToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  }, [selectedPanelId, selectedGroupIds, showToast, loadData]);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Panel assignment for D1</h1>
        <p className="text-sm text-gray-500">
          Assign FYP groups to D1 panels. Select a panel, then choose groups to associate with it.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading panels and groups…</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 border border-red-200 py-2 px-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7 space-y-6">
          <div className={fieldWrapClass}>
            <label htmlFor="selectPanel" className={labelClass}>
              Select panel <span className="text-red-500">*</span>
            </label>
            <select
              id="selectPanel"
              value={selectedPanelId}
              onChange={(e) => setSelectedPanelId(e.target.value)}
              className={selectClass}
            >
              <option value="">Choose a panel</option>
              {panels.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.panelName}
                </option>
              ))}
            </select>
            {panels.length === 0 && (
              <p className="text-xs text-amber-600">No D1 panels found for the active session. Create panels first.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className={labelClass}>
                Select groups to assign <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllGroups}
                  disabled={availableGroups.length === 0}
                  className="text-sm font-medium text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearGroups}
                  className="text-sm font-medium text-gray-600 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
            {availableGroups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/40 p-6 text-sm text-gray-500 text-center">
                No unassigned registered groups in the active session.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                {availableGroups.map((g) => {
                  const id = String(g._id);
                  const checked = selectedGroupIds.includes(id);
                  return (
                    <label
                      key={g._id}
                      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50/80 ${
                        checked ? 'bg-accent/5' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGroup(g._id)}
                        className="mt-1 rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{g.ideaName ?? '—'}</p>
                        {g.ideaDescription && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{g.ideaDescription}</p>
                        )}
                        {g.supervisorName && (
                          <p className="text-xs text-gray-500 mt-0.5">Supervisor: {g.supervisorName}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
            {availableGroups.length > 0 && (
              <p className="text-[11px] text-gray-500 mt-1.5">
                {selectedGroupIds.length} of {availableGroups.length} group(s) selected
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500">
              After creating an assignment you can select another panel and assign more groups.
            </p>
            <button
              type="button"
              onClick={handleCreateAssignment}
              disabled={creating || !selectedPanelId || selectedGroupIds.length === 0}
              className="w-full sm:w-auto py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating…' : 'Create assignment'}
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

