import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LandingPage from './components/LandingPage';
import LoginForm from './components/Login/LoginForm';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import DashboardPlaceholder from './components/DashboardPlaceholder';
import ToggleGrade from './components/admin/ToggleGrade';
import FypGuide from './components/FypGuide';
import FypGrade from './components/FypGrade';
import FypResources from './components/FypResources';
import FypEvents from './components/FypEvents';
import ManageSessions from './components/admin/ManageSessions';
import ManageDomains from './components/admin/ManageDomains';
import ManageStudents from './components/admin/ManageStudents';
import ManageSupervisors from './components/admin/ManageSupervisors';
import ManageEvaluators from './components/admin/ManageEvaluators';
import CreateStudentAccount from './components/admin/CreateStudentAccount';
import CreateSupervisorAccount from './components/admin/CreateSupervisorAccount';
import CreateEvaluatorAccount from './components/admin/CreateEvaluatorAccount';
import SessionPolicy from './components/all/SessionPolicy';
import AllDomains from './components/all/AllDomains';
import DomainsSupervisors from './components/all/DomainsSupervisors';
import RegisterGroup from './components/RegisterGroup';
import GroupStatus from './components/GroupStatus';
import SupervisorAllocation from './components/SupervisorAllocation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminGroupRequest from './components/admin/AdminGroupRequest';
import SupervisorGroupRequest from './components/supervisor/SupervisorGroupRequest';
import AllGroups from './components/all/AllGroups';
import ChatRoom from './components/all/ChatRoom';
import Group from './components/all/Group';
import MyGroup from './components/supervisor/MyGroup';
import CreateMeeting from './components/supervisor/CreateMeeting';
import AllMeetings from './components/all/AllMeetings';
import CreateDeadline from './components/admin/CreateDeadline';
import AllDeadlines from './components/all/AllDeadlines';
import AllSubmissions from './components/all/AllSubmissions';
import CreatePanelsD1 from './components/admin/CreatePanelsD1';
import CreatePanelsD2 from './components/admin/CreatePanelsD2';
import PanelAssignmentD1 from './components/admin/PanelAssignmentD1';
import PanelAssignmentD2 from './components/admin/PanelAssignmentD2';
import PanelsForD1 from './components/all/PanelsForD1';
import PanelsForD2 from './components/all/PanelsForD2';
import GiveD1MarksAdmin from './components/admin/GiveD1Marks';
import GiveD1MarksSupervisor from './components/supervisor/GiveD1Marks';
import GiveD1MarksEvaluator from './components/evaluator/GiveD1Marks';
import StudentsForD1 from './components/all/StudentsForD1';
import AdminD1EvaluationForm from './components/admin/AdminD1EvaluationForm';
import SupervisorD1EvaluationForm from './components/supervisor/SupervisorD1EvaluationForm';
import EvaluatorD1EvaluationForm from './components/evaluator/EvaluatorD1EvaluationForm';
import GiveD2MarksAdmin from './components/admin/GiveD2Marks';
import StudentsForD2 from './components/all/StudentsForD2';
import AdminD2EvaluationForm from './components/admin/AdminD2EvaluationForm';
import GiveD2MarksSupervisor from './components/supervisor/GiveD2Marks';
import SupervisorD2EvaluationForm from './components/supervisor/SupervisorD2EvaluationForm';
import GiveD2MarksEvaluator from './components/evaluator/GiveD2Marks';
import EvaluatorD2EvaluationForm from './components/evaluator/EvaluatorD2EvaluationForm';
import FIA from './components/FIA';
import SetPassword from './components/SetPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/set-password" element={<SetPassword />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="admin/create-student-account" element={<CreateStudentAccount />} />
        <Route path="admin/create-supervisor-account" element={<CreateSupervisorAccount />} />
        <Route path="admin/create-evaluator-account" element={<CreateEvaluatorAccount />} />
        <Route path="manage-sessions" element={<ManageSessions />} />
        <Route path="manage-events" element={<DashboardPlaceholder />} />
        <Route path="manage-students" element={<ManageStudents />} />
        <Route path="manage-supervisors" element={<ManageSupervisors />} />
        <Route path="manage-evaluators" element={<ManageEvaluators />} />
        <Route path="manage-domains" element={<ManageDomains />} />
        <Route path="evaluator-panels" element={<DashboardPlaceholder />} />
        <Route path="create-panels-d1" element={<CreatePanelsD1 />} />
        <Route path="create-panels-d2" element={<CreatePanelsD2 />} />
        <Route path="panel-assignment-d1" element={<PanelAssignmentD1 />} />
        <Route path="panel-assignment-d2" element={<PanelAssignmentD2 />} />
        <Route path="panels-d1" element={<PanelsForD1 />} />
        <Route path="panels-d2" element={<PanelsForD2 />} />
        <Route path="all-sessions" element={<DashboardPlaceholder />} />
        <Route path="all-domains" element={<AllDomains />} />
        <Route path="all-supervisors" element={<DashboardPlaceholder />} />
        <Route path="all-evaluators" element={<DashboardPlaceholder />} />
        <Route path="all-groups" element={<AllGroups />} />
        <Route path="groups-defense1" element={<DashboardPlaceholder />} />
        <Route path="groups-defense2" element={<DashboardPlaceholder />} />
        <Route path="domains-supervisors" element={<DomainsSupervisors />} />
        <Route path="session-policy" element={<SessionPolicy />} />
        <Route path="fyp-resources" element={<FypResources />} />
        <Route path="fyp-events" element={<FypEvents />} />
        <Route path="previous-fyps" element={<DashboardPlaceholder />} />
        <Route path="supervisor-allocation" element={<ProtectedRoute><SupervisorAllocation /></ProtectedRoute>} />
        <Route path="admin/group-requests" element={<AdminGroupRequest />} />
        <Route path="supervisor/group-requests" element={<SupervisorGroupRequest />} />
        <Route path="my-groups" element={<MyGroup />} />
        <Route path="give-marks" element={<DashboardPlaceholder />} />
        <Route path="give-d1-marks" element={<GiveD1MarksAdmin />} />
        <Route path="supervisor/give-d1-marks" element={<GiveD1MarksSupervisor />} />
        <Route path="evaluator/give-d1-marks" element={<GiveD1MarksEvaluator />} />
        <Route path="give-d1-marks/group/:groupId" element={<StudentsForD1 />} />
        <Route path="give-d1-marks/group/:groupId/student/:studentId" element={<AdminD1EvaluationForm />} />
        <Route path="supervisor/give-d1-marks/group/:groupId/student/:studentId" element={<SupervisorD1EvaluationForm />} />
        <Route path="evaluator/give-d1-marks/group/:groupId/student/:studentId" element={<EvaluatorD1EvaluationForm />} />
        <Route path="give-d2-marks" element={<GiveD2MarksAdmin />} />
        <Route path="supervisor/give-d2-marks" element={<GiveD2MarksSupervisor />} />
        <Route path="evaluator/give-d2-marks" element={<GiveD2MarksEvaluator />} />
        <Route path="give-d2-marks/group/:groupId" element={<StudentsForD2 />} />
        <Route path="give-d2-marks/group/:groupId/student/:studentId" element={<AdminD2EvaluationForm />} />
        <Route path="supervisor/give-d2-marks/group/:groupId/student/:studentId" element={<SupervisorD2EvaluationForm />} />
        <Route path="evaluator/give-d2-marks/group/:groupId/student/:studentId" element={<EvaluatorD2EvaluationForm />} />
        <Route path="toggle-grade" element={<ToggleGrade />} />
        <Route path="chat-rooms" element={<ChatRoom />}>
          <Route path=":groupId" element={<Group />} />
        </Route>
        
        <Route path="register-group" element={<RegisterGroup />} />
        <Route path="request-status" element={<ProtectedRoute><GroupStatus /></ProtectedRoute>} />
        <Route path="fyp-guide" element={<FypGuide />} />
        <Route
          path="fyp-grade"
          element={
            <ProtectedRoute roles={['Student']}>
              <FypGrade />
            </ProtectedRoute>
          }
        />
        <Route path="fia" element={<FIA />} />
        <Route path="meetings" element={<DashboardPlaceholder />} />
        <Route path="create-meeting" element={<CreateMeeting />} />
        <Route path="all-meetings" element={<AllMeetings />} />
        <Route path="create-deadline" element={<CreateDeadline />} />
        <Route path="all-deadlines" element={<AllDeadlines />} />
        <Route path="all-submissions" element={<AllSubmissions />} />
        <Route path="allocation-status" element={<DashboardPlaceholder />} />
        <Route path="assigned-groups" element={<DashboardPlaceholder />} />
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
