import { useNavigate } from 'react-router-dom';
import StudentRegisterForm from '../Register/StudentRegisterForm';

export default function CreateStudentAccount() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <StudentRegisterForm onBack={() => navigate(-1)} />
    </div>
  );
}

