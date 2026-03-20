import { useLocation, useParams } from 'react-router-dom';

export default function EvaluatorD1EvaluationForm() {
  const { groupId, studentId } = useParams();
  const location = useLocation();
  const rollNo = location.state?.rollNo ?? '';
  const fullName = location.state?.fullName ?? '';

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Evaluator D1 Evaluation Form</h1>
        {(rollNo || fullName) && (
          <p className="text-sm text-gray-500">
            {rollNo ? `Roll No: ${rollNo}` : ''} {fullName ? `· ${fullName}` : ''}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Placeholder</h2>
          <p className="text-sm text-gray-500 mt-1">
            Evaluator marks UI will be implemented here.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Group ID: <span className="font-medium">{groupId ?? '—'}</span>
          </p>
          <p className="mt-1">
            Student ID: <span className="font-medium">{studentId ?? '—'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

