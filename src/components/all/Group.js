import { useParams } from 'react-router-dom';

export default function Group() {
  const { groupId } = useParams();

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Group chat</h2>
      <p className="text-sm text-gray-600">
        Group chat placeholder for group {groupId || '—'}. Implementation coming soon.
      </p>
    </div>
  );
}

