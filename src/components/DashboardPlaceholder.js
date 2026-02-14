import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sidebarLinks } from '../config/sidebarLinks';

/**
 * Placeholder content for dashboard routes. Shows the current section title and a generic message.
 * Replace with real page components per route when ready.
 */
export default function DashboardPlaceholder() {
  const location = useLocation();
  const { user } = useAuth();
  const roleKey = (user?.role || '').toLowerCase();
  const links = sidebarLinks[roleKey] || sidebarLinks.admin;
  const current = links.find((l) => l.path === location.pathname);
  const title = current?.label || 'Dashboard';

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">Content for this section will load here.</p>
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-gray-700 font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            This is placeholder content. When you connect APIs, data for this page will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
