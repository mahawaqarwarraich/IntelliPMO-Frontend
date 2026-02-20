import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitial(str) {
  if (!str) return 'U';
  const parts = String(str).trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return str.slice(0, 2).toUpperCase();
}

function getNavbarCenterPaths(role) {
  const r = (role || 'admin').toLowerCase();
  return [
    { label: 'FYP Guide', path: r === 'student' ? '/dashboard/fyp-guide' : '/dashboard/session-policy' },
    { label: 'FYP Events', path: '/dashboard/fyp-events' },
    { label: 'FYP Resources', path: '/dashboard/fyp-resources' },
  ];
}

const menuIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const closeIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const centerLinks = getNavbarCenterPaths(user?.role);
  const displayName = user?.fullName || user?.role || 'User';

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="flex-shrink-0 h-14 sm:h-16 flex items-center justify-between gap-2 px-3 sm:px-4 bg-white border-b border-gray-200 shadow-sm z-10">
      {/* Left: toggle + logo */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? closeIcon : menuIcon}
        </button>
        <NavLink
          to="/dashboard"
          className="flex flex-col min-w-0 hover:opacity-80 hover:no-underline transition-opacity focus:outline-none focus:ring-0 rounded px-1 -mx-1 no-underline"
        >
          <span className="text-base sm:text-lg font-bold text-primary-dark tracking-wide truncate">
            UOG | FMS
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 truncate">FYP Management System</span>
        </NavLink>
      </div>

      {/* Center: FYP Guide, FYP Events, FYP Resources */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Quick links">
        {centerLinks.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                isActive ? 'bg-accent/15 text-accent' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right: profile dropdown */}
      <div className="relative flex-shrink-0" ref={profileRef}>
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
          aria-label="Profile menu"
          aria-expanded={profileOpen}
          aria-haspopup="true"
        >
          {getInitial(user?.fullName || user?.role)}
        </button>
        {profileOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-56 py-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate" title={displayName}>
                {displayName}
              </p>
              <p className="text-xs text-gray-500">{user?.role || ''}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
