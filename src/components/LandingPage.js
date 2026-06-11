import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LOGO_PATH = `${process.env.PUBLIC_URL || ''}/intelliPMO-logo.svg`;
const HERO_BG = `${process.env.PUBLIC_URL || ''}/uog.PNG`;

const FEATURES = [
  {
    title: 'Group registration',
    description: 'Students form FYP groups, select supervisors, and track approval status in one place.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    title: 'Supervisor allocation',
    description: 'Match projects to domains and supervisors with transparent allocation workflows.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
  {
    title: 'D1 & D2 defenses',
    description: 'Panel setup, assignments, and structured evaluation forms for both defense stages.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    ),
  },
  {
    title: 'Deadlines & meetings',
    description: 'Session deadlines, meeting schedules, and submission tracking keep everyone aligned.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    title: 'Marks & grades',
    description: 'Rubric-based scoring rolls up to final grades with admin-controlled visibility for students.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
  {
    title: 'Collaboration & FIA',
    description: 'Group chat rooms and the FIA assistant support communication throughout the FYP lifecycle.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
];

const ROLES = [
  { label: 'Students', detail: 'Register groups, meet deadlines, view panels and grades.' },
  { label: 'Supervisors', detail: 'Review requests, conduct meetings, and submit D1/D2 marks.' },
  { label: 'Evaluators', detail: 'Assess defenses through structured evaluation rubrics.' },
  { label: 'Administrators', detail: 'Manage sessions, users, panels, and grade visibility.' },
];

const STEPS = [
  { step: '01', title: 'Session setup', text: 'Admin configures the active FYP session, domains, and accounts.' },
  { step: '02', title: 'Project formation', text: 'Students register groups and supervisors are allocated.' },
  { step: '03', title: 'Progress & defense', text: 'Meetings, deadlines, panels, and evaluations through D1 and D2.' },
  { step: '04', title: 'Results', text: 'Marks are consolidated and released when the admin enables grade visibility.' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const primaryCta = user ? { to: '/dashboard', label: 'Go to dashboard' } : { to: '/login', label: 'Log in' };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-primary-dark/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline hover:no-underline">
            <img src={LOGO_PATH} alt="IntelliPMO" className="h-8 sm:h-9 w-auto brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#features"
              className="hidden sm:inline text-sm text-white/80 hover:text-white no-underline hover:no-underline transition-colors"
            >
              Features
            </a>
            <Link
              to={primaryCta.to}
              className="inline-flex items-center py-2 px-4 sm:px-5 rounded-md bg-accent text-white text-sm font-semibold no-underline hover:no-underline hover:bg-accent-hover transition-colors shadow-sm"
            >
              {primaryCta.label}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[88vh] flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-primary-dark/70" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/88 to-primary/75"
          aria-hidden
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="max-w-2xl rounded-2xl border border-white/10 bg-primary-dark/80 backdrop-blur-md shadow-2xl p-6 sm:p-8 lg:p-10">
            <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3 landing-fade-in landing-hero-text">
              Final Year Project Management
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 landing-fade-in landing-delay-1 landing-hero-text">
              Run your FYP program with clarity, from idea to defense.
            </h1>
            <p className="text-base sm:text-lg text-white leading-relaxed mb-8 landing-fade-in landing-delay-2 landing-hero-text">
              IntelliPMO brings students, supervisors, evaluators, and administrators onto one platform for
              groups, allocations, defenses, deadlines, and grades.
            </p>
            <div className="flex flex-wrap gap-3 landing-fade-in landing-delay-3">
              <Link
                to={primaryCta.to}
                className="inline-flex py-3 px-6 rounded-md bg-accent text-white font-semibold no-underline hover:no-underline hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
              >
                {primaryCta.label}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex py-3 px-6 rounded-md border border-white/30 text-white font-semibold no-underline hover:no-underline hover:bg-white/10 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Built for the full FYP lifecycle</h2>
            <p className="text-gray-600">
              Everything your faculty needs to coordinate final-year projects — without scattered spreadsheets and email chains.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 hover:border-accent/30 hover:shadow-card transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20 bg-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How IntelliPMO works</h2>
            <p className="text-white/70">A clear path from session start to published results.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="relative rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="text-3xl font-bold text-accent/80">{s.step}</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">One platform, every role</h2>
            <p className="text-gray-600">Each user sees tools tailored to their responsibilities in the FYP process.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES.map((r) => (
              <div key={r.label} className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                <h3 className="font-semibold text-primary mb-2">{r.label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-white/85 mb-6 max-w-xl mx-auto">
            Sign in with your university credentials to access your dashboard.
          </p>
          <Link
            to={primaryCta.to}
            className="inline-flex py-3 px-8 rounded-md bg-white text-primary font-semibold no-underline hover:no-underline hover:bg-gray-100 transition-colors shadow-lg"
          >
            {primaryCta.label}
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <img src={LOGO_PATH} alt="IntelliPMO" className="h-7 w-auto opacity-80" />
          <p className="m-0 text-center sm:text-right">IntelliPMO — FYP Management System</p>
        </div>
      </footer>
    </div>
  );
}
