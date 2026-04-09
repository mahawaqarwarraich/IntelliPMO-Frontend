import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SupervisorD2EvaluationForm() {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'Supervisor';

  const { groupId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rollNo = location.state?.rollNo ?? '';
  const fullName = location.state?.fullName ?? '';

  const [marksOutOf20, setMarksOutOf20] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  const numericMarks = useMemo(() => {
    if (marksOutOf20 === '' || marksOutOf20 == null) return null;
    const n = Number(marksOutOf20);
    return Number.isFinite(n) ? n : null;
  }, [marksOutOf20]);

  const handleSubmit = useCallback(async () => {
    if (!isSupervisor) {
      showToast('Only supervisors can access this page.', 'error');
      return;
    }
    if (numericMarks == null) {
      showToast('Please enter marks out of 20.', 'error');
      return;
    }
    if (numericMarks < 0 || numericMarks > 20) {
      showToast('Marks must be between 0 and 20.', 'error');
      return;
    }
    if (!studentId) {
      showToast('Student not found.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/d2-evaluation-form/${studentId}`, {
        supervisorMarks: numericMarks,
      });
      showToast('Marks saved successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save marks.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }, [isSupervisor, numericMarks, studentId, showToast]);

  if (!isSupervisor) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Supervisor D2 Evaluation Form</h1>
          <p className="text-sm text-gray-700">Only supervisors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/give-d2-marks/group/${groupId}`)}
          className="text-sm font-medium text-accent hover:underline mb-2"
        >
          ← Back to students
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Supervisor D2 Evaluation Form</h1>
        {(rollNo || fullName) && (
          <p className="text-sm text-gray-500">
            {rollNo ? `Roll No: ${rollNo}` : ''} {fullName ? `· ${fullName}` : ''}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Supervisor marks</h2>
          <p className="text-sm text-gray-500 mt-1">Marks out of 20 (for meetings and project progress).</p>
        </div>

        <div className="max-w-sm">
          <label htmlFor="marks20d2" className="block text-sm font-medium text-gray-700 mb-1">
            Marks (0–20)
          </label>
          <input
            id="marks20d2"
            type="number"
            min={0}
            max={20}
            step={1}
            value={marksOutOf20}
            onChange={(e) => setMarksOutOf20(e.target.value)}
            placeholder="e.g. 16"
            className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
          />
          <p className="text-xs text-gray-500 mt-1">Only numbers from 0 to 20 are allowed.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : 'Submit marks'}
          </button>
        </div>
      </div>

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

