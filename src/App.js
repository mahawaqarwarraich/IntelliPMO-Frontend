import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Main from './components/Main';
import StudentLoginForm from './components/Login/StudentLoginForm';
import AdminLoginForm from './components/Login/AdminLoginForm';
import SupervisorLoginForm from './components/Login/SupervisorLoginForm';
import EvaluatorLoginForm from './components/Login/EvaluatorLoginForm';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import DashboardPlaceholder from './components/DashboardPlaceholder';
import ManageSessions from './components/admin/ManageSessions';
import ManageDomains from './components/admin/ManageDomains';
import ManageStudents from './components/admin/ManageStudents';
import ManageSupervisors from './components/admin/ManageSupervisors';
import ManageEvaluators from './components/admin/ManageEvaluators';
import SessionPolicy from './components/all/SessionPolicy';
import AllDomains from './components/all/AllDomains';
import DomainsSupervisors from './components/all/DomainsSupervisors';
import RegisterGroup from './components/RegisterGroup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/student-login" element={<StudentLoginForm />} />
      <Route path="/admin-login" element={<AdminLoginForm />} />
      <Route path="/supervisor-login" element={<SupervisorLoginForm />} />
      <Route path="/evaluator-login" element={<EvaluatorLoginForm />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="manage-sessions" element={<ManageSessions />} />
        <Route path="manage-events" element={<DashboardPlaceholder />} />
        <Route path="manage-students" element={<ManageStudents />} />
        <Route path="manage-supervisors" element={<ManageSupervisors />} />
        <Route path="manage-evaluators" element={<ManageEvaluators />} />
        <Route path="manage-domains" element={<ManageDomains />} />
        <Route path="evaluator-panels" element={<DashboardPlaceholder />} />
        <Route path="all-sessions" element={<DashboardPlaceholder />} />
        <Route path="all-domains" element={<AllDomains />} />
        <Route path="all-supervisors" element={<DashboardPlaceholder />} />
        <Route path="all-evaluators" element={<DashboardPlaceholder />} />
        <Route path="groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="domains-supervisors" element={<DomainsSupervisors />} />
        <Route path="session-policy" element={<SessionPolicy />} />
        <Route path="fyp-resources" element={<DashboardPlaceholder />} />
        <Route path="fyp-events" element={<DashboardPlaceholder />} />
        <Route path="previous-fyps" element={<DashboardPlaceholder />} />
        <Route path="supervisor-allocation" element={<DashboardPlaceholder />} />
        <Route path="group-requests" element={<DashboardPlaceholder />} />
        <Route path="give-marks" element={<DashboardPlaceholder />} />
        <Route path="chat-homes" element={<DashboardPlaceholder />} />
        <Route path="register-group" element={<RegisterGroup />} />
        <Route path="request-status" element={<DashboardPlaceholder />} />
        <Route path="fyp-guide" element={<DashboardPlaceholder />} />
        <Route path="meetings" element={<DashboardPlaceholder />} />
        <Route path="create-meeting" element={<DashboardPlaceholder />} />
        <Route path="all-meetings" element={<DashboardPlaceholder />} />
        <Route path="allocation-status" element={<DashboardPlaceholder />} />
        <Route path="assigned-groups" element={<DashboardPlaceholder />} />
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
