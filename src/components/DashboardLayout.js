import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Layout wrapper for the dashboard: Sidebar (role-based links) + main content area (Outlet).
 * Styling and colors match the original dashboard layout.
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 sm:p-8">
          <h1>Dashboard</h1>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
