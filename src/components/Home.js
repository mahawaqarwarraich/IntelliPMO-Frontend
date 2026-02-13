import { useState } from 'react';

// ─── Mock data (no API) ─────────────────────────────────────────────────────
const MOCK_USER = {
  fullName: 'Dr. Sarah Ahmed',
  role: 'Admin',
  photoUrl: null, // placeholder: use initial
};

const ROLE_LINKS = {
  Admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' },
  ],
  Student: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-projects', label: 'My Projects' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'profile', label: 'Profile' },
  ],
  Supervisor: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-groups', label: 'My Groups' },
    { id: 'evaluations', label: 'Evaluations' },
    { id: 'profile', label: 'Profile' },
  ],
  Evaluator: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assigned', label: 'Assigned Evaluations' },
    { id: 'marks', label: 'Marks' },
    { id: 'profile', label: 'Profile' },
  ],
};

const ICONS = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  sessions: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

function NavIcon({ id }) {
  return <span className="flex-shrink-0">{ICONS[id] || ICONS.default}</span>;
}

function getInitial(name) {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name || '?').slice(0, 2).toUpperCase();
}

export default function Home() {
  const [activeLink, setActiveLink] = useState('dashboard');
  const user = MOCK_USER;
  const links = ROLE_LINKS[user.role] || ROLE_LINKS.Admin;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-primary-dark flex flex-col text-white shadow-lg">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold tracking-wide text-white">UOG | FMS</h1>
          <p className="text-xs text-white/70 mt-0.5">FYP Management System</p>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitial(user.fullName)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-xs text-white/80 truncate">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {links.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveLink(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    activeLink === item.id
                      ? 'bg-accent text-white'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <NavIcon id={item.id} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10">
          <p className="text-xs text-white/60 px-2">FMS v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 sm:p-8">
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-1 capitalize">
              {links.find((l) => l.id === activeLink)?.label || activeLink}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Content for this section will load here.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4 [&_svg]:w-10 [&_svg]:h-10">
                  <NavIcon id={activeLink in ICONS ? activeLink : 'default'} />
                </div>
                <h3 className="text-gray-700 font-medium mb-1">
                  {links.find((l) => l.id === activeLink)?.label || activeLink}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  This is placeholder content. When you connect APIs, data for this page will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
