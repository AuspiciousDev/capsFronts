import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import "@fontsource/poppins";
import { UsersContextProvider } from "./context/UserContext";
import { EmployeesContextProvider } from "./context/EmployeeContext";
import { SubjectsContextProvider } from "./context/SubjectContext";
import { StudentsContextProvider } from "./context/StudentContext";
import { SchoolYearsContextProvider } from "./context/SchoolYearContext";
import { LevelsContextProvider } from "./context/LevelContext";
import { DepartmentsContextProvider } from "./context/DepartmentContext";
import { SectionsContextProvider } from "./context/SectionsContext";
import { ActiveStudentsContextProvider } from "./context/ActiveStudentContext";
import { GradesContextProvider } from "./context/GradesContext";
import { TasksContextProvider } from "./context/TaskContext";
import { TasksScoreContextProvider } from "./context/TaskScoreContext";
import { AdvisersContextProvider } from "./context/AdviserContext";
import { AuthProvider } from "./context/AuthProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UsersContextProvider>
        <EmployeesContextProvider>
          <StudentsContextProvider>
            <SchoolYearsContextProvider>
              <DepartmentsContextProvider>
                <LevelsContextProvider>
                  <SectionsContextProvider>
                    <SubjectsContextProvider>
                      <ActiveStudentsContextProvider>
                        <GradesContextProvider>
                          <TasksContextProvider>
                            <TasksScoreContextProvider>
                              <AdvisersContextProvider>
                                <App />
                              </AdvisersContextProvider>
                            </TasksScoreContextProvider>
                          </TasksContextProvider>
                        </GradesContextProvider>
                      </ActiveStudentsContextProvider>
                    </SubjectsContextProvider>
                  </SectionsContextProvider>
                </LevelsContextProvider>
              </DepartmentsContextProvider>
            </SchoolYearsContextProvider>
          </StudentsContextProvider>
        </EmployeesContextProvider>
      </UsersContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
