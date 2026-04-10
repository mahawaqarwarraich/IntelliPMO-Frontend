import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const INITIAL_MARKS = {
  understandingOfExistingSystem: '',
  wellDefinedGoalsAndObjectives: '',
  conceptualArchitecture: '',
  presentationSkill: '',
  functionalRequirement: '',
  interfaces: '',
  usecaseDescription: '',
  usecaseDiagram: '',
  nonFunctionalAttribute: '',
  domainModelOrErd: '',
  classDiagramOrDataFlowDiagram: '',
  sequenceDiagramOrStateTransitionDiagram: '',
  stateChartDiagramOrArchitecturalDiagram: '',
  collaborationDiagramOrComponentDiagram: '',
  partialWorkingSystem: '',
};

const RUBRIC_MAX_BY_KEY = {
  understandingOfExistingSystem: 5,
  wellDefinedGoalsAndObjectives: 5,
  conceptualArchitecture: 5,
  presentationSkill: 5,
  functionalRequirement: 2,
  interfaces: 2,
  usecaseDescription: 2,
  usecaseDiagram: 2,
  nonFunctionalAttribute: 2,
  domainModelOrErd: 2,
  classDiagramOrDataFlowDiagram: 2,
  sequenceDiagramOrStateTransitionDiagram: 2,
  stateChartDiagramOrArchitecturalDiagram: 2,
  collaborationDiagramOrComponentDiagram: 2,
  partialWorkingSystem: 10,
};

export default function EvaluatorD2EvaluationForm() {
  const { user } = useAuth();
  const isEvaluator = user?.role === 'Evaluator';

  const { groupId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rollNo = location.state?.rollNo ?? '';
  const fullName = location.state?.fullName ?? '';

  const [marksByKey, setMarksByKey] = useState(INITIAL_MARKS);
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

  const evaluatorPatchResult = useMemo(() => {
    const body = {};
    for (const key of Object.keys(RUBRIC_MAX_BY_KEY)) {
      const raw = marksByKey[key];
      if (raw === '' || raw == null) {
        return { error: 'Please enter marks for every criterion before submitting.' };
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        return { error: `Invalid number for ${key}.` };
      }
      const max = RUBRIC_MAX_BY_KEY[key];
      if (n < 0 || n > max) {
        return { error: `${key} must be between 0 and ${max}.` };
      }
      body[key] = n;
    }
    return { body };
  }, [marksByKey]);

  const handleSubmit = useCallback(async () => {
    if (!isEvaluator) {
      showToast('Only evaluators can access this page.', 'error');
      return;
    }
    if (!studentId) {
      showToast('Student not found.', 'error');
      return;
    }
    if (evaluatorPatchResult.error) {
      showToast(evaluatorPatchResult.error, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/d2-evaluation-form/${studentId}`, evaluatorPatchResult.body);
      setMarksByKey({ ...INITIAL_MARKS });
      showToast('Marks saved successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save marks.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }, [isEvaluator, studentId, evaluatorPatchResult, showToast]);

  const handleDigitChange = useCallback((key, value) => {
    if (value === '') {
      setMarksByKey((prev) => ({ ...prev, [key]: '' }));
      return;
    }
    const digitsOnly = value.replace(/\D/g, '');
    setMarksByKey((prev) => ({ ...prev, [key]: digitsOnly }));
  }, []);

  const handleBlurClamp = useCallback((key, max) => {
    setMarksByKey((prev) => {
      const raw = prev[key];
      if (raw === '' || raw == null) return prev;
      const n = Number(raw);
      if (!Number.isFinite(n)) return { ...prev, [key]: '' };
      const clamped = Math.min(Math.max(0, Math.floor(n)), max);
      return { ...prev, [key]: String(clamped) };
    });
  }, []);

  if (!isEvaluator) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Evaluator D2 Evaluation Form</h1>
          <p className="text-sm text-gray-700">Only evaluators can access this page.</p>
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Evaluator D2 Evaluation Form</h1>
        {(rollNo || fullName) && (
          <p className="text-sm text-gray-500">
            {rollNo ? `Roll No: ${rollNo}` : ''} {fullName ? `· ${fullName}` : ''}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <p className="text-sm text-gray-500">Enter obtained marks for each criterion (0 up to the max shown).</p>
        </div>

        <div className="space-y-4">
          {Object.entries(RUBRIC_MAX_BY_KEY).map(([key, max]) => (
            <div key={key} className="max-w-sm">
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                {key} <span className="text-gray-400 font-normal">(0–{max})</span>
              </label>
              <input
                id={key}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={marksByKey[key]}
                onChange={(e) => handleDigitChange(key, e.target.value)}
                onBlur={() => handleBlurClamp(key, max)}
                placeholder="e.g. 1"
                className="w-full py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
              />
              <p className="text-xs text-gray-500 mt-1">Only numbers from 0 to {max} are allowed.</p>
            </div>
          ))}
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

