import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Main from './components/Main';
import StudentLoginForm from './components/Login/StudentLoginForm';
import AdminLoginForm from './components/Login/AdminLoginForm';
import SupervisorLoginForm from './components/Login/SupervisorLoginForm';
import EvaluatorLoginForm from './components/Login/EvaluatorLoginForm';
import DashboardLayout from './components/DashboardLayout';
import DashboardPlaceholder from './components/DashboardPlaceholder';
import ManageSessions from './components/admin/ManageSessions';
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
        <Route path="admin/manage-sessions" element={<ManageSessions />} />
        <Route path="admin/manage-events" element={<DashboardPlaceholder />} />
        <Route path="admin/manage-students" element={<DashboardPlaceholder />} />
        <Route path="admin/manage-supervisors" element={<DashboardPlaceholder />} />
        <Route path="admin/manage-evaluators" element={<DashboardPlaceholder />} />
        <Route path="admin/manage-domains" element={<DashboardPlaceholder />} />
        <Route path="admin/evaluator-panels" element={<DashboardPlaceholder />} />
        <Route path="admin/all-sessions" element={<DashboardPlaceholder />} />
        <Route path="admin/all-domains" element={<DashboardPlaceholder />} />
        <Route path="admin/all-supervisors" element={<DashboardPlaceholder />} />
        <Route path="admin/all-evaluators" element={<DashboardPlaceholder />} />
        <Route path="admin/groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="admin/groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="admin/domains-supervisors" element={<DashboardPlaceholder />} />
        <Route path="admin/session-policy" element={<DashboardPlaceholder />} />
        <Route path="admin/fyp-resources" element={<DashboardPlaceholder />} />
        <Route path="admin/fyp-events" element={<DashboardPlaceholder />} />
        <Route path="admin/previous-fyps" element={<DashboardPlaceholder />} />
        <Route path="admin/supervisor-allocation" element={<DashboardPlaceholder />} />
        <Route path="admin/group-requests" element={<DashboardPlaceholder />} />
        <Route path="admin/give-marks" element={<DashboardPlaceholder />} />
        <Route path="student/chat-homes" element={<DashboardPlaceholder />} />
        <Route path="student/all-domains" element={<DashboardPlaceholder />} />
        <Route path="student/domains-supervisors" element={<DashboardPlaceholder />} />
        <Route path="student/session-policy" element={<DashboardPlaceholder />} />
        <Route path="student/fyp-resources" element={<DashboardPlaceholder />} />
        <Route path="student/fyp-events" element={<DashboardPlaceholder />} />
        <Route path="student/previous-fyps" element={<DashboardPlaceholder />} />
        <Route path="student/register-group" element={<DashboardPlaceholder />} />
        <Route path="student/request-status" element={<DashboardPlaceholder />} />
        <Route path="student/fyp-guide" element={<DashboardPlaceholder />} />
        <Route path="student/meetings" element={<DashboardPlaceholder />} />
        <Route path="student/supervisor-allocation" element={<DashboardPlaceholder />} />
        <Route path="student/groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="student/groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="supervisor/all-domains" element={<DashboardPlaceholder />} />
        <Route path="supervisor/domains-supervisors" element={<DashboardPlaceholder />} />
        <Route path="supervisor/session-policy" element={<DashboardPlaceholder />} />
        <Route path="supervisor/fyp-resources" element={<DashboardPlaceholder />} />
        <Route path="supervisor/fyp-events" element={<DashboardPlaceholder />} />
        <Route path="supervisor/create-meeting" element={<DashboardPlaceholder />} />
        <Route path="supervisor/all-meetings" element={<DashboardPlaceholder />} />
        <Route path="supervisor/allocation-status" element={<DashboardPlaceholder />} />
        <Route path="supervisor/group-requests" element={<DashboardPlaceholder />} />
        <Route path="supervisor/groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="supervisor/groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="supervisor/give-marks" element={<DashboardPlaceholder />} />
        <Route path="evaluator/all-domains" element={<DashboardPlaceholder />} />
        <Route path="evaluator/domains-supervisors" element={<DashboardPlaceholder />} />
        <Route path="evaluator/session-policy" element={<DashboardPlaceholder />} />
        <Route path="evaluator/fyp-resources" element={<DashboardPlaceholder />} />
        <Route path="evaluator/fyp-events" element={<DashboardPlaceholder />} />
        <Route path="evaluator/groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="evaluator/groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="evaluator/assigned-groups" element={<DashboardPlaceholder />} />
        <Route path="evaluator/give-marks" element={<DashboardPlaceholder />} />
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
