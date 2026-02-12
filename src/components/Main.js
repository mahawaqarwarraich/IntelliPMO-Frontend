import { useState } from 'react';
import StudentRegisterForm from './Register/StudentRegisterForm.js';
import AdminRegisterForm from './Register/AdminRegisterForm.js';
import SupervisorRegisterForm from './Register/SupervisorRegisterForm.js';
import EvaluatorRegisterForm from './Register/EvaluatorRegisterForm.js';

const ROLES = [
  { id: 'admin', label: 'Admin', initial: 'A' },
  { id: 'student', label: 'Student', initial: 'S' },
  { id: 'supervisor', label: 'Supervisor', initial: 'V' },
  { id: 'evaluator', label: 'Evaluator', initial: 'E' },
];

export default function Main() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleBack = () => setSelectedRole(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary tracking-wide m-0 mb-1">
          UOG | FMS
        </h1>
        <p className="text-sm text-gray-500 font-normal m-0">
          FYP Management System
        </p>
      </header>
      <div className="w-full max-w-[min(90vw,28rem)] bg-white rounded-xl shadow-card border border-gray-200 p-8">
        {selectedRole == null ? (
          <>
            <h2 className="text-center text-gray-800 font-semibold text-lg mb-6">
              Select your role to continue
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150 min-h-[120px]"
                  aria-label={`Select ${role.label}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mb-2">
                    {role.initial}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-center">
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : selectedRole === 'student' ? (
          <StudentRegisterForm onBack={handleBack} />
        ) : selectedRole === 'admin' ? (
          <AdminRegisterForm onBack={handleBack} />
        ) : selectedRole === 'supervisor' ? (
          <SupervisorRegisterForm onBack={handleBack} />
        ) : selectedRole === 'evaluator' ? (
          <EvaluatorRegisterForm onBack={handleBack} />
        ) : null}
      </div>
    </div>
  );
}
