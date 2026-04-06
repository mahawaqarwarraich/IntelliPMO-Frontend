import { useNavigate } from 'react-router-dom';
import SupervisorRegisterForm from '../Register/SupervisorRegisterForm';

export default function CreateSupervisorAccount() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <SupervisorRegisterForm onBack={() => navigate(-1)} />
    </div>
  );
}

