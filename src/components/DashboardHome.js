import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();
  
  const greeting = user?.fullName
    ? `Welcome back, ${user.fullName.split(' ')[0]}`
    : 'Welcome';

  const roleLabel = user?.role || 'User';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 sm:mb-16">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-primary-dark p-8 sm:p-12 lg:p-16 text-white shadow-xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold m-0 mb-3 leading-tight">
              {greeting}
            </h1>
            <p className="text-white/90 text-lg sm:text-xl m-0 mb-6">
              FYP Management System
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold border border-white/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
        {/* Main Welcome Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">
                IntelliPMO
              </h2>
              <p className="text-sm text-gray-500 m-0">Final Year Project Management</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed m-0">
            Manage your Final Year Projects efficiently. Access session policies, browse domains and supervisors, 
            and utilize all the tools available in your dashboard to streamline your FYP workflow.
          </p>
        </div>

        {/* Features Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 m-0 mb-4">
            What you can do
          </h3>
          <ul className="space-y-3 m-0 p-0 list-none">
            {[
              'View session policies and rules',
              'Browse available domains',
              'Explore supervisors and their expertise',
              'Access FYP resources and events',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/5 to-accent/10 p-6 sm:p-8 text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 m-0 mb-2">
          Ready to get started?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 m-0 mb-6 max-w-2xl mx-auto">
          Use the sidebar navigation to explore all available features and manage your Final Year Project activities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Quick Navigation</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">View Policies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
