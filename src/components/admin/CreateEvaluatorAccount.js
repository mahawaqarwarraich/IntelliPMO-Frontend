import { useNavigate } from 'react-router-dom';
import EvaluatorRegisterForm from '../Register/EvaluatorRegisterForm';

export default function CreateEvaluatorAccount() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <EvaluatorRegisterForm onBack={() => navigate(-1)} />
    </div>
  );
}

