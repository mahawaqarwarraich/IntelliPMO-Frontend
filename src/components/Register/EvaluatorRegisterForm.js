import RegisterForm from './RegisterForm.js';

export default function EvaluatorRegisterForm({ onBack, onSubmit }) {
  return (
    <RegisterForm
      role="evaluator"
      roleLabel="Evaluator"
      onBack={onBack}
      onSubmit={onSubmit ?? (() => {})}
    />
  );
}
