import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Layout wrapper for the dashboard: Sidebar (role-based links) + main content area (Outlet).
 * Styling and colors match the original dashboard layout.
 */
export default function DashboardLayout() {
  return (
    <div className="flex h-screen min-h-0 bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="p-6 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
