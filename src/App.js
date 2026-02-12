import { Routes, Route } from 'react-router-dom';
import './index.css';
import Main from './components/Main';
import StudentLoginForm from './components/Login/StudentLoginForm';
import Home from './components/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Home />} />
      <Route path="/student-login" element={<StudentLoginForm />} />
    </Routes>
  );
}

export default App;
