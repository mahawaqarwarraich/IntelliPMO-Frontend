import RegisterForm from './RegisterForm.js';

export default function AdminRegisterForm({ onBack, onSubmit }) {
  return (
    <RegisterForm
      role="admin"
      roleLabel="Admin"
      onBack={onBack}
      onSubmit={onSubmit ?? (() => {})}
    />
  );
}
