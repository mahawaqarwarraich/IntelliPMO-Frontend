import { useParams, useNavigate } from 'react-router-dom';

export default function AdminD1EvaluationForm() {
  const { groupId, studentId } = useParams();
  const navigate = useNavigate();

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
        <p className="text-sm text-gray-500">Student ID: {studentId ?? '—'} · Group ID: {groupId ?? '—'}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
        D1 evaluation form fields and submit will appear here.
      </div>
    </div>
  );
}
