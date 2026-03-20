import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';

export default function AdminD1EvaluationForm() {
  const { groupId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rollNo = location.state?.rollNo ?? '';
  const fullName = location.state?.fullName ?? '';

  const [marksOutOf10, setMarksOutOf10] = useState('');
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
    if (marksOutOf10 === '' || marksOutOf10 == null) return null;
    const n = Number(marksOutOf10);
    return Number.isFinite(n) ? n : null;
  }, [marksOutOf10]);

  const handleSubmit = useCallback(async () => {
    if (numericMarks == null) {
      showToast('Please enter marks out of 10.', 'error');
      return;
    }
    if (numericMarks < 0 || numericMarks > 10) {
      showToast('Marks must be between 0 and 10.', 'error');
      return;
    }
    if (!studentId) {
      showToast('Student not found.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/d1-evaluation-form/${studentId}`, {
        adminMarks: numericMarks,
      });
      showToast('Marks saved successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save marks.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }, [numericMarks, studentId, showToast]);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/give-d1-marks/group/${groupId}`)}
          className="text-sm font-medium text-accent hover:underline mb-2"
        >
          ← Back to students
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin D1 Evaluation Form</h1>
        {(rollNo || fullName) && (
          <p className="text-sm text-gray-500">
            {rollNo ? `Roll No: ${rollNo}` : ''} {fullName ? `· ${fullName}` : ''}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Additional marks</h2>
          <p className="text-sm text-gray-500 mt-1">
            Marks out of 10 (for meeting deadlines and attending workshops).
          </p>
        </div>

        <div className="max-w-sm">
          <label htmlFor="marks10" className="block text-sm font-medium text-gray-700 mb-1">
            Marks (0–10)
          </label>
          <input
            id="marks10"
            type="number"
            min={0}
            max={10}
            step={1}
            value={marksOutOf10}
            onChange={(e) => setMarksOutOf10(e.target.value)}
            placeholder="e.g. 8"
            className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
          />
          <p className="text-xs text-gray-500 mt-1">Only numbers from 0 to 10 are allowed.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30"
          >
            Submit marks
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
