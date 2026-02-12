import RegisterForm from './RegisterForm.js';

export default function SupervisorRegisterForm({ onBack, onSubmit }) {
  return (
    <RegisterForm
      role="supervisor"
      roleLabel="Supervisor"
      onBack={onBack}
      onSubmit={onSubmit ?? (() => {})}
    />
  );
}
