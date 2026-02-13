import { Routes, Route } from 'react-router-dom';
import './index.css';
import Main from './components/Main';
import StudentLoginForm from './components/Login/StudentLoginForm';
import AdminLoginForm from './components/Login/AdminLoginForm';
import SupervisorLoginForm from './components/Login/SupervisorLoginForm';
import EvaluatorLoginForm from './components/Login/EvaluatorLoginForm';
import Home from './components/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Home />} />
      <Route path="/student-login" element={<StudentLoginForm />} />
      <Route path="/admin-login" element={<AdminLoginForm />} />
      <Route path="/supervisor-login" element={<SupervisorLoginForm />} />
      <Route path="/evaluator-login" element={<EvaluatorLoginForm />} />
    </Routes>
  );
}

export default App;
