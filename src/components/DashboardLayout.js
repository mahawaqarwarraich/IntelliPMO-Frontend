import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Layout: Navbar on top, then Sidebar + main content. Sidebar can be toggled.
 */
export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen min-h-0 bg-gray-50 overflow-hidden">
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((o) => !o)} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
