import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

// Public
import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./pages/components/RequireAuth";
import PersistLogin from "./pages/PersistLogin";
import NotFound404 from "./pages/NotFound404";
// Admin
import MainPage from "./pages/main/Mainpage";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Grades from "./pages/admin/Grades";
import GradesCurrent from "./pages/admin/components/Grade/GradesCurrent";
import GradesForm from "./pages/admin/components/Grade/GradesForm";
import GradeTaskForms from "./pages/admin/components/Grade/TaskForms";
import GradeTaskTable from "./pages/admin/components/Grade/TaskTable";
import Employees from "./pages/admin/Employees";
import FacultyProfile from "./pages/admin/components/Employee/FacultyProfile";
import FacultyProfileEdit from "./pages/admin/components/Employee/FacultyProfileEdit";
import Students from "./pages/admin/Students";
import StudentProfile from "./pages/admin/components/Student/StudentProfile";
import StudentProfileEdit from "./pages/admin/components/Student/StudentProfileEdit";
import StudentRecord from "./pages/admin/components/Student/StudentRecord";
import StudentTasks from "./pages/admin/components/Student/StudentTasks";
import Maintenance from "./pages/admin/Maintenance";
import Subjects from "./pages/Teachers/TeachersSubjects";
import Level from "./pages/admin/Level";
import Section from "./pages/admin/Section";
import Department from "./pages/admin/Department";
import SchoolYear from "./pages/admin/SchoolYear";
import Task from "./pages/admin/Task";
import Taskform from "./pages/admin/components/Task/Taskform";
import Adviser from "./pages/admin/Adviser";
import ActiveStudents from "./pages/admin/ActiveStudents";
import LoginHistoryTable from "./pages/admin/components/LoginHistory/LoginHistoryTable";

import GenerateActiveYearGrades from "./pages/admin/components/GeneratePDF/GenerateActiveYearGrades";
// Teachers'
import TeacherOutlet from "./pages/Teachers/TeacherOutlet";
import TeacherDashboard from "./pages/Teachers/TeacherDashboard";
import TeachersEnrolledStudents from "./pages/Teachers/TeachersEnrolledStudents";
import TeachersGrades from "./pages/Teachers/TeachersGrades";
import TeachersStudents from "./pages/Teachers/TeachersStudents";
import TeachersSubjects from "./pages/Teachers/TeachersSubjects";
import TeachersLevel from "./pages/Teachers/TeachersLevel";
import TeachersSection from "./pages/Teachers/TeachersSection";
// Students
import StudentMain from "./pages/Student/StudentMain";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentGrades from "./pages/Student/StudentGrades";
import StudentRecords from "./pages/Student/Grades/StudentRecords";
import StudentTask from "./pages/Student/Grades/StudentTask";
import StudentGenerateActiveYearGrades from "./pages/Student/GeneratePDF/StudentGenerateActiveYearGrades";

import RecordTable from "./pages/admin/components/Record/RecordTable";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
const ROLES = {
  Admin: 2001,
  Teacher: 2002,
  Student: 2003,
};

function App() {
  const [theme, colorMode] = useMode();
  const { auth, setAuth, persist, setPersist } = useAuth();

  console.log("Login APP:", auth);
  console.log("Login APP lenght:", Object.keys(auth).length);
  console.log("Login APP:", auth?.roles?.includes(2001));
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* PUBLIC ROUTES*/}

            <Route
              path="/"
              element={
                auth?.roles?.includes(2001) ? (
                  <Navigate to="/admin" />
                ) : auth?.roles?.includes(2002) ? (
                  <Navigate to="/teacher" />
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="login"
              element={
                Object.keys(auth).length > 0 ? <Navigate to="/" /> : <Login />
              }
            />

            <Route
              path="register"
              element={
                Object.keys(auth).length > 0 ? (
                  <Navigate to="/" />
                ) : (
                  <Register />
                )
              }
            />
            <Route path="reset" element={<ResetPassword />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            {/* ADMIN ROUTES*/}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin" element={<MainPage />}>
                  <Route index element={<Dashboard />} />
                  <Route path="grade" element={<Grades />} />
                  <Route
                    path="grade/:level/:year/:id"
                    element={<GradesCurrent />}
                  />

                  <Route
                    path="record/grade/:id/:year"
                    element={<GradesForm />}
                  />
                  <Route
                    path="record/task/:id/:year"
                    element={<GradeTaskTable />}
                  />
                  <Route
                    path="record/task/add/:id/:year"
                    element={<GradeTaskForms />}
                  />
                  <Route path="user" element={<Users />} />
                  <Route path="student" element={<Students />} />
                  <Route path="student/:id" element={<StudentProfile />} />
                  <Route
                    path="student/edit/:id"
                    element={<StudentProfileEdit />}
                  />
                  <Route
                    path="student/record/grade/:id/:year"
                    element={<StudentRecord />}
                  />
                  <Route
                    path="student/record/tasks/:id/:year"
                    element={<GradeTaskTable />}
                  />
                  <Route path="task" element={<Task />} />
                  <Route path="task/add" element={<Taskform />} />
                  <Route path="subject" element={<Subjects />} />
                  <Route path="faculty" element={<Employees />} />
                  <Route path="faculty/:id" element={<FacultyProfile />} />
                  <Route
                    path="faculty/edit/:id"
                    element={<FacultyProfileEdit />}
                  />
                  <Route path="adviser" element={<Adviser />} />
                  <Route path="level" element={<Level />} />
                  <Route path="section" element={<Section />} />
                  <Route path="department" element={<Department />} />
                  <Route path="schoolyear" element={<SchoolYear />} />
                  <Route path="enrolled" element={<ActiveStudents />} />
                  <Route path="record" element={<RecordTable />} />
                  <Route
                    path="generatepdf/:id"
                    element={<GenerateActiveYearGrades />}
                  />

                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="loginHistory" element={<LoginHistoryTable />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Teacher]} />}>
                <Route path="/teacher" element={<TeacherOutlet />}>
                  <Route index element={<TeacherDashboard />} />
                  <Route path="grade" element={<TeachersGrades />} />
                  <Route path="student" element={<TeachersStudents />} />
                  <Route path="active" element={<TeachersEnrolledStudents />} />
                  <Route path="level" element={<TeachersLevel />} />
                  <Route path="section" element={<TeachersSection />} />
                  <Route path="subject" element={<TeachersSubjects />} />
                </Route>
              </Route>
              {/* <Route element={<RequireAuth allowedRoles={[ROLES.Student]} />}>
                <Route path="/student" element={<StudentMain />}>
                  <Route index element={<StudentDashboard />} />
                </Route>
              </Route> */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Student]} />}>
                <Route path="/student" element={<StudentMain />}>
                  <Route index element={<StudentDashboard />} />
                  <Route path="grade" element={<StudentGrades />} />
                  <Route
                    path="grade/record/:year/:level/:id"
                    element={<StudentRecords />}
                  />
                  <Route
                    path="grade/record/tasks/:year/:id"
                    element={<StudentTask />}
                  />
                  <Route
                    path="grade/record/generatepdf/:id/:year"
                    element={<StudentGenerateActiveYearGrades />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
