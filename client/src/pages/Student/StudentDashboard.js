import React from "react";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TablePagination,
  Divider,
  Select,
  NativeSelect,
  MenuItem,
  FormControl,
  TextField,
  Tabs,
  Tab,
  ButtonBase,
  AppBar,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  CheckCircle,
  Delete,
  Search,
  Add,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

import { format } from "date-fns-tz";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Bookmark } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useStudentsContext } from "../../hooks/useStudentsContext";
import { useGradesContext } from "../../hooks/useGradesContext";
import { useSubjectsContext } from "../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../hooks/useSectionContext";
import { useLevelsContext } from "../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../hooks/useActiveStudentContext";
import { useTasksContext } from "../../hooks/useTasksContext";
import { useTasksScoresContext } from "../../hooks/useTasksScoreContext";

import ConfirmDialogue from "../../global/ConfirmDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
import ValidateDialogue from "../../global/ValidateDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, persist, setPersist } = useAuth();

  const { id, year } = useParams();
  const [value, setValue] = React.useState(0);
  const [isloading, setIsLoading] = useState(false);

  const [getStudentData, setStudentData] = useState([]);
  const [getLevel, setLevel] = useState([]);

  var studName = useRef();
  var studLevel = useRef();
  var studSection = useRef();
  var studActive = useRef([]);
  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { tasks, taskDispatch } = useTasksContext();
  const { taskScore, taskScoreDispatch } = useTasksScoresContext();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [validateDialog, setValidateDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
    },
    // hide last border
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: colors.primary[100],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        // const apiStud = await axiosPrivate.get(`/api/students/search/${id}`, {
        //   headers: { "Content-Type": "application/json" },
        //   withCredentials: true,
        // });
        // if (apiStud?.status === 200) {
        //   const json = await apiStud.data;
        //   console.log(json);
        //   setIsLoading(false);
        //   setStudentData(json);
        // }
        const apiStud = await axiosPrivate.get(
          `/api/enrolled/search/${auth.username}`
        );
        if (apiStud?.status === 200) {
          const json = await apiStud.data;
          console.log("GET_SearchedStudent : ", json);
          setIsLoading(false);
          setStudentData(json && json[0]);
        }

        const response = await axiosPrivate.get("/api/subjects", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          // console.log(json);
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const getLevels = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getLevels.status === 200) {
          const json = await getLevels.data;
          // console.log(json);
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const getDepartment = await axiosPrivate.get("/api/departments", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getDepartment?.status === 200) {
          const json = await getDepartment.data;
          // console.log(json);
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
        const getSections = await axiosPrivate.get("/api/sections", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getSections?.status === 200) {
          const json = await getSections.data;
          // console.log(json);
          setIsLoading(false);
          secDispatch({ type: "SET_SECS", payload: json });
        }
        const getGrades = await axiosPrivate.get("/api/grades");
        if (getGrades?.status === 200) {
          const json = await getGrades.data;
          console.log("getGrades:", json);
          setIsLoading(false);
          gradeDispatch({ type: "SET_GRADES", payload: json });
        }
        const apiActive = await axiosPrivate.get("/api/enrolled");
        if (apiActive?.status === 200) {
          const json = await apiActive.data;
          // console.log(json);
          setIsLoading(false);
        }
        const apiTasks = await axiosPrivate.get("/api/tasks");
        if (apiTasks?.status === 200) {
          const json = await apiTasks.data;
          setIsLoading(false);
          taskDispatch({ type: "SET_TASKS", payload: json });
        }
        const apiTaskScore = await axiosPrivate.get("/api/taskScore");
        if (apiTaskScore?.status === 200) {
          const json = await apiTaskScore.data;
          setIsLoading(false);
          console.log("GET_TaskScores :", json);
          taskScoreDispatch({ type: "SET_SCORES", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setIsLoading(false);
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          console.log("No server response");
          setErrorDialog({
            isOpen: true,
            title: `No server response`,
          });
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            title: `${error.response.data.message}`,
          });
        } else if (error.response.status === 401) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            title: `${error.response.data.message}`,
          });
        } else if (error.response.status === 403) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            title: `${error.response.data.message}`,
          });
        } else if (error.response.status === 404) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            title: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
          setErrorDialog({
            isOpen: true,
            title: `${error}`,
          });
        }
      }
    };
    getData();
  }, [
    studDispatch,
    gradeDispatch,
    subDispatch,
    levelDispatch,
    depDispatch,
    secDispatch,
    activeDispatch,
    taskDispatch,
  ]);

  // console.log("stud Data:", getStudentData);
  const TableTitles = () => {
    return (
      <StyledTableHeadRow
      // sx={{ backgroundColor: `${colors.primary[100]}` }}
      >
        <TableCell>Date</TableCell>
        <TableCell>Subject</TableCell>
        <TableCell>Title</TableCell>
        <TableCell align="left">Points</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val._id}
        data-rowid={val?.schoolYearID}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* <TableCell align="left">-</TableCell> */}
        <TableCell align="left">
          {format(new Date(val.createdAt), "MMMM dd, yyyy")}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.subjectID}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.taskName}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.taskScore} {"/"} {val?.maxPoints}
        </TableCell>
      </StyledTableRow>
    );
  };
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="contents-container">
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: 2,
          padding: { xs: "10px", sm: "0 10px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { sm: "end" },
              justifyContent: { xs: "center", sm: "start" },
              m: { xs: "20px 0" },
            }}
          >
            <Typography variant="h2" fontWeight="bold">
              DASHBOARD
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "0 0 10px 0",
        }}
      >
        <TableContainer>
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableTitles />
            </TableHead>
            <TableBody>
              {taskScore &&
                taskScore
                  .filter((fill) => {
                    return fill.studID === getStudentData.studID;
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((val) => {
                    return tableDetails(val);
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={
            taskScore &&
            taskScore.filter((fill) => {
              return fill.studID === getStudentData.studID;
            }).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "0 0 10px 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <AppBar
            position="static"
            sx={{ backgroundColor: colors.appBar[100] }}
            enableColorOnDark
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="full width tabs example"
              variant="fullWidth"
            >
              <Tab
                label="Assignments"
                {...a11yProps(0)}
                sx={{ fontWeight: "bold" }}
              />
              <Tab
                label="Activities"
                {...a11yProps(1)}
                sx={{ fontWeight: "bold" }}
              />
              <Tab
                label="Projects"
                {...a11yProps(2)}
                sx={{ fontWeight: "bold" }}
              />
              <Tab
                label="Quizzes"
                {...a11yProps(3)}
                sx={{ fontWeight: "bold" }}
              />

              <Tab
                label="Exams"
                {...a11yProps(4)}
                sx={{ fontWeight: "bold" }}
              />
            </Tabs>
          </AppBar>
        </Box>{" "}
        <TabPanel sx={{ width: "100%" }} value={value} index={0}>
          <Paper elevation={2}>
            <TableContainer>
              <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {taskScore &&
                    taskScore
                      .filter((fill) => {
                        return (
                          fill.taskType === "assignment" &&
                          fill.studID === getStudentData.studID
                        );
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                taskScore &&
                taskScore.filter((fill) => {
                  return (
                    fill.taskType === "assignment" &&
                    fill.studID === getStudentData.studID
                  );
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Paper elevation={2}>
            <TableContainer>
              <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {taskScore &&
                    taskScore
                      .filter((fill) => {
                        return (
                          fill.taskType === "activity" &&
                          fill.studID === getStudentData.studID
                        );
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                taskScore &&
                taskScore.filter((fill) => {
                  return (
                    fill.taskType === "activity" &&
                    fill.studID === getStudentData.studID
                  );
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Paper elevation={2}>
            <TableContainer>
              <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {taskScore &&
                    taskScore
                      .filter((fill) => {
                        return (
                          fill.taskType === "project" &&
                          fill.studID === getStudentData.studID
                        );
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                taskScore &&
                taskScore.filter((fill) => {
                  return (
                    fill.taskType === "project" &&
                    fill.studID === getStudentData.studID
                  );
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Paper elevation={2}>
            <TableContainer>
              <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {taskScore &&
                    taskScore
                      .filter((fill) => {
                        return (
                          fill.taskType === "quiz" &&
                          fill.studID === getStudentData.studID
                        );
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                taskScore &&
                taskScore.filter((fill) => {
                  return (
                    fill.taskType === "quiz" &&
                    fill.studID === getStudentData.studID
                  );
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Paper elevation={2}>
            <TableContainer>
              <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {taskScore &&
                    taskScore
                      .filter((fill) => {
                        return fill.taskType === "exam";
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={
                taskScore &&
                taskScore.filter((fill) => {
                  return (
                    fill.taskType === "exam" &&
                    fill.studID === getStudentData.studID
                  );
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
      </Paper> */}
    </div>
  );
};

export default StudentDashboard;
