import React from "react";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
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
  InputLabel,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  CheckCircle,
  Delete,
  Search,
  Add,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import useAuth from "../../../../hooks/useAuth";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import { Bookmark } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useTasksContext } from "../../../../hooks/useTasksContext";
import { useTasksScoresContext } from "../../../../hooks/useTasksScoreContext";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

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

const TaskForms = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, persist, setPersist } = useAuth();

  const { id, year } = useParams();
  const [value, setValue] = React.useState(0);
  const [isloading, setIsLoading] = useState(false);

  const [getStudentData, setStudentData] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [getLevel, setLevel] = useState([]);

  const [getStudSubjectID, setStudSubjectID] = useState("");

  const [taskID, setTaskID] = useState("");
  const [studID, setStudID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [taskPoints, setTaskPoints] = useState("");
  const [empID, setEmpID] = useState("");
  const [description, setDescription] = useState("");

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
    setTaskPoints("");
    setTaskID("");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const apiTasks = await axiosPrivate.get("/api/tasks");

        if (apiTasks?.status === 200) {
          const json = await apiTasks.data;
          setIsLoading(false);
          console.log("GET_TASK :", json);
          taskDispatch({ type: "SET_TASKS", payload: json });
        }
        const apiStud = await axiosPrivate.get(`/api/enrolled/search/${id}`);
        if (apiStud?.status === 200) {
          const json = await apiStud.data;
          console.log(json);
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
      } catch (error) {
        console.log(error);
        if (!error?.response) {
          console.log("No server response!");
        } else if (error.response.status === 204) {
        } else {
          // navigate("/login", { state: { from: location }, replace: true });
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
  ]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });

    const data = {
      taskID,
      studID: getStudentData.studID,
      subjectID,
      taskScore: taskPoints,
      empID,
      description,
    };
    if (!subjectID) {
      return (
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({ isOpen: true, message: "Select a subject!" })
      );
    }
    if (!taskID || !taskPoints) {
      try {
        const response = await axiosPrivate.post(
          "/api/taskScore/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log(json);
          taskScoreDispatch({ type: "CREATE_TASKSCORE", payload: json });
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            message: `TaskScore added successfully!`,
          });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `no server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else if (error.response.status === 409) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
        }
      }
    } else {
      setLoadingDialog({ isOpen: false });
      setErrorDialog({ isOpen: true, message: "Incomplete Fields!" });
    }
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });

    const data = {
      taskID,
      studID: getStudentData.studID,
      subjectID,
      taskScore: taskPoints,
      empID: auth.username,
      description,
    };
    if (!subjectID) {
      return (
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({ isOpen: true, message: "Select a subject!" })
      );
    }
    console.log(taskID, taskPoints);
    console.log(data);
    if (taskID && taskPoints) {
      try {
        const response = await axiosPrivate.post(
          "/api/taskScore/register",
          JSON.stringify(data)
        );
        console.log("Response :", response);
        if (response.status === 201) {
          const json = await response.data;

          taskScoreDispatch({ type: "CREATE_SCORE", payload: json });
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            message: `TaskScore added successfully!`,
          });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `no server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else if (error.response.status === 409) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
        }
      }
    } else {
      setLoadingDialog({ isOpen: false });
      setErrorDialog({ isOpen: true, message: "Incomplete Fields!" });
    }
  };
  // console.log("stud Data:", getStudentData);

  return (
    <Box className="contents-container">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper
        elevation={2}
        sx={{
          width: "100%",
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
              alignItems: "center",
              m: { xs: "20px 0" },
            }}
            gap={2}
          >
            <Link
              to="/admin/grade"
              style={{ textDecoration: "none", color: colors.black[100] }}
            >
              <ArrowBackIosNewOutlined sx={{ fontSize: "40px" }} />
            </Link>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                "&.MuiBox-root > h3": {
                  textTransform: "capitalize",
                },
                "&.MuiBox-root > p": {
                  textTransform: "capitalize",
                },
              }}
            >
              <Typography variant="h3">
                {getStudentData?.middleName
                  ? getStudentData.firstName +
                    " " +
                    getStudentData.middleName +
                    " " +
                    getStudentData.lastName
                  : getStudentData.firstName +
                    " " +
                    getStudentData.lastName}{" "}
              </Typography>
              <Typography>{getStudentData.studID}</Typography>
              <Typography>
                {" "}
                Grade{[" "]}
                {levels &&
                  levels
                    .filter((lvl) => {
                      // return console.log(lvl.levelID, val.levelID);
                      return lvl.levelID === getStudentData.levelID;
                    })
                    .map((stud) => {
                      return stud.levelNum;
                    })}
                {[" - "]}{" "}
                {sections &&
                  sections
                    .filter((sec) => {
                      // return console.log(lvl.levelID, val.levelID);
                      return sec.sectionID === getStudentData.sectionID;
                    })
                    .map((stud) => {
                      return stud.sectionName;
                    })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          mt: 2,
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            justifyContent: { xs: "center", sm: "start" },
            borderBottom:`2px solid ${colors.primary[950]}`
          }}
        >
          <Typography variant="h4">Select a subject</Typography>

          <FormControl required sx={{ width: "50%", mt: 2 }}>
            <InputLabel id="demo-simple-select-label">Subject Name</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subjectID}
              // error={}
              label="Subject Name"
              onChange={(e) => {
                setSubjectID(e.target.value);
              }}
            >
              <MenuItem aria-label="None" value="" />
              {subjects &&
                subjects
                  .filter((subj) => {
                    return subj.levelID === getStudentData.levelID;
                  })
                  .map((val) => {
                    return (
                      <MenuItem
                        value={val.subjectID}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {val.subjectName}
                      </MenuItem>
                    );
                  })}
            </Select>
          </FormControl>
        </Box>
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
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box width="100%">
              <form onSubmit={handleSubmitActivity} style={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                  gap={2}
                >
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h4">Select an assignment</Typography>
                    <FormControl required fullWidth sx={{ mt: 2 }}>
                      {/* <Typography id="demo-simple-select-label">
                        Assignment Title
                      </Typography> */}
                      <InputLabel id="demo-simple-select-label">
                        Assignment Title
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={taskID}
                        // error={}
                        label="Assignment Title"
                        onChange={(e) => {
                          setTaskID(e.target.value);
                        }}
                      >
                        <MenuItem aria-label="none" value=""></MenuItem>
                        {tasks &&
                          tasks
                            .filter((fill) => {
                              return (
                                fill.taskType === "assignment" &&
                                fill.subjectID === subjectID
                              );
                            })
                            .map((val) => {
                              return (
                                <MenuItem value={val.taskID}>
                                  {val.taskName}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </FormControl>
                    <br />
                    <FormControl fullWidth>
                      {/* <Typography>Task Score</Typography> */}
                      <TextField
                        required
                        autoComplete="off"
                        variant="outlined"
                        label="Activity Score"
                        type="number"
                        value={taskPoints}
                        onChange={(e) => {
                          const value = Math.max(
                            0,
                            Math.min(
                              taskID &&
                                tasks &&
                                tasks
                                  .filter((fill) => {
                                    return (
                                      console.log(fill.taskID === taskID),
                                      fill.taskID === taskID
                                    );
                                  })
                                  .map((val) => {
                                    return (
                                      console.log("points:", val.maxPoints),
                                      val.maxPoints
                                    );
                                  }),
                              Number(e.target.value)
                            )
                          );
                          setTaskPoints(value);
                          // setTaskPoints(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                variant="subtitle2"
                                sx={{ color: colors.black[400] }}
                              >
                                {taskPoints}/
                                {taskID &&
                                  tasks &&
                                  tasks
                                    .filter((fill) => {
                                      return (
                                        console.log(fill.taskID === taskID),
                                        fill.taskID === taskID
                                      );
                                    })
                                    .map((val) => {
                                      return (
                                        console.log("points:", val.maxPoints),
                                        val.maxPoints
                                      );
                                    })}
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Box>
                  <br />
                  <Box
                    display="flex"
                    justifyContent="end"
                    height="50px"
                    gap={2}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      <Typography variant="h6" fontWeight="500">
                        Submit
                      </Typography>
                    </Button>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      onClick={() => {}}
                    >
                      <Typography variant="h6" fontWeight="500">
                        CANCEL
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box width="100%">
              <form onSubmit={handleSubmitActivity} style={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                  gap={2}
                >
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h4">Select an activity</Typography>
                    <FormControl required fullWidth sx={{ mt: 2 }}>
                      {/* <Typography id="demo-simple-select-label">
                        Activity Title
                      </Typography> */}
                      <InputLabel id="demo-simple-select-label">
                        Activity Title
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={taskID}
                        // error={}
                        label="Activity Title"
                        onChange={(e) => {
                          setTaskID(e.target.value);
                        }}
                      >
                        <MenuItem aria-label="none" value=""></MenuItem>
                        {tasks &&
                          tasks
                            .filter((fill) => {
                              return (
                                fill.taskType === "activity" &&
                                fill.subjectID === subjectID
                              );
                            })
                            .map((val) => {
                              return (
                                <MenuItem value={val.taskID}>
                                  {val.taskName}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </FormControl>
                    <br />
                    <FormControl fullWidth>
                      {/* <Typography>Task Score</Typography> */}
                      <TextField
                        required
                        autoComplete="off"
                        variant="outlined"
                        label="Activity Score"
                        type="number"
                        value={taskPoints}
                        onChange={(e) => {
                          const value = Math.max(
                            0,
                            Math.min(
                              taskID &&
                                tasks &&
                                tasks
                                  .filter((fill) => {
                                    return (
                                      console.log(fill.taskID === taskID),
                                      fill.taskID === taskID
                                    );
                                  })
                                  .map((val) => {
                                    return (
                                      console.log("points:", val.maxPoints),
                                      val.maxPoints
                                    );
                                  }),
                              Number(e.target.value)
                            )
                          );
                          setTaskPoints(value);
                          // setTaskPoints(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                variant="subtitle2"
                                sx={{ color: colors.black[400] }}
                              >
                                {taskPoints}/
                                {taskID &&
                                  tasks &&
                                  tasks
                                    .filter((fill) => {
                                      return (
                                        console.log(fill.taskID === taskID),
                                        fill.taskID === taskID
                                      );
                                    })
                                    .map((val) => {
                                      return (
                                        console.log("points:", val.maxPoints),
                                        val.maxPoints
                                      );
                                    })}
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Box>
                  <br />
                  <Box
                    display="flex"
                    justifyContent="end"
                    height="50px"
                    gap={2}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      <Typography variant="h6" fontWeight="500">
                        Submit
                      </Typography>
                    </Button>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      onClick={() => {}}
                    >
                      <Typography variant="h6" fontWeight="500">
                        CANCEL
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box width="100%">
              <form style={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                  gap={2}
                >
                  <FormControl required fullWidth>
                    <Typography id="demo-simple-select-label">
                      Project Title
                    </Typography>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={taskName}
                      // error={}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                    >
                      {tasks &&
                        tasks
                          .filter((fill) => {
                            return fill.taskType === "project";
                          })
                          .map((val) => {
                            return (
                              <MenuItem value={val.taskID}>
                                {val.taskName}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <Typography>Task Score</Typography>
                    <TextField variant="outlined" />
                  </FormControl>
                  <br />
                  <Box
                    display="flex"
                    justifyContent="end"
                    height="50px"
                    gap={2}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      <Typography variant="h6" fontWeight="500">
                        Confirm
                      </Typography>
                    </Button>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      onClick={() => {}}
                    >
                      <Typography variant="h6" fontWeight="500">
                        CANCEL
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </TabPanel>{" "}
        <TabPanel value={value} index={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box width="100%">
              <form style={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                  gap={2}
                >
                  <FormControl required fullWidth>
                    <Typography id="demo-simple-select-label">
                      Quiz Title
                    </Typography>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={taskName}
                      // error={}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                    >
                      {tasks &&
                        tasks
                          .filter((fill) => {
                            return fill.taskType === "quiz";
                          })
                          .map((val) => {
                            return (
                              <MenuItem value={val.taskID}>
                                {val.taskName}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <Typography>Task Score</Typography>
                    <TextField variant="outlined" />
                  </FormControl>
                  <br />
                  <Box
                    display="flex"
                    justifyContent="end"
                    height="50px"
                    gap={2}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      <Typography variant="h6" fontWeight="500">
                        Confirm
                      </Typography>
                    </Button>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      onClick={() => {}}
                    >
                      <Typography variant="h6" fontWeight="500">
                        CANCEL
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </TabPanel>{" "}
        <TabPanel value={value} index={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box width="100%">
              <form style={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                  gap={2}
                >
                  <FormControl required fullWidth>
                    <Typography id="demo-simple-select-label">
                      Exam Title
                    </Typography>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={taskName}
                      // error={}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                    >
                      {tasks &&
                        tasks
                          .filter((fill) => {
                            return fill.taskType === "exam";
                          })
                          .map((val) => {
                            return (
                              <MenuItem value={val.taskID}>
                                {val.taskName}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <Typography>Task Score</Typography>
                    <TextField variant="outlined" />
                  </FormControl>
                  <br />
                  <Box
                    display="flex"
                    justifyContent="end"
                    height="50px"
                    gap={2}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      <Typography variant="h6" fontWeight="500">
                        Confirm
                      </Typography>
                    </Button>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      onClick={() => {}}
                    >
                      <Typography variant="h6" fontWeight="500">
                        CANCEL
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </TabPanel>{" "}
      </Paper>
    </Box>
  );
};

export default TaskForms;
