import React from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  TableContainer,
  TablePagination,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  ButtonBase,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
  InputAdornment,
} from "@mui/material";
import { format } from "date-fns-tz";
import useAuth from "../../../../hooks/useAuth";
import { AutoStories, DeleteOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useTasksContext } from "../../../../hooks/useTasksContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";

import CancelIcon from "@mui/icons-material/Cancel";
import {
  Delete,
  CheckCircle,
  Cancel,
  DriveFileRenameOutline,
} from "@mui/icons-material";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
const Taskform = () => {
  const CHARACTER_LIMIT = 6;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth, setAuth, persist, setPersist } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { subjects, subDispatch } = useSubjectsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { tasks, taskDispatch } = useTasksContext();
  const [isLoading, setIsLoading] = useState(false);
  var schoolYearID = useRef();
  // const [levelID, setLevelID] = useState("");
  const [levelID, setLevelID] = useState("");
  const [sectionID, setSectionID] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskName, setTaskName] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [maxPoints, setMaxPoints] = useState("");
  const [description, setDescription] = useState("");

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
  const clearInputForms = () => {
    setSubjectID("");
    setTaskType("");
    setLevelID("");
    setSectionID("");
    setMaxPoints("");
    setTaskName("");
    setDescription("");
  };

  console.log(format(new Date(), "hhmm"));
  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    console.log(schoolYearID.current);
    const data = {
      taskID: `${subjectID + "-" + taskName + format(new Date(), "hhmm")}`,
      empID: auth.username,
      subjectID,
      taskName,
      levelID,
      sectionID,
      taskType,
      maxPoints,
      schoolYearID: schoolYearID.current,
      description,
    };
    console.log(data);
    if (subjectID) {
      try {
        const response = await axiosPrivate.post(
          "/api/tasks/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log(json);
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            message: `Task ${json.taskName} added successfully!`,
          });
          clearInputForms();
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 403) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate("/login", { state: { from: location }, replace: true });
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    } else {
      console.log("Error");
    }
  };
  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
    },
    // hide last border
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: colors.tableRow[100],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading({ isOpen: true });
        setIsLoading(true);
        const response = await axiosPrivate.get("/api/subjects", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const getLevels = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getLevels?.status === 200) {
          const json = await getLevels.data;
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const scyear = await axiosPrivate.get("/api/schoolyears/status/active");
        if (scyear.status === 200) {
          const json = await scyear.data;
          console.log(json.schoolYearID);
          setIsLoading(false);
          schoolYearID.current = json.schoolYearID;
        }

        const responseSec = await axiosPrivate.get("/api/sections", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (responseSec.status === 200) {
          const json = await responseSec.data;
          console.log(json);
          setIsLoading(false);
          secDispatch({ type: "SET_SECS", payload: json });
        }
        setIsLoading({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 403) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate("/login", { state: { from: location }, replace: true });
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getData();
  }, [subDispatch, levelDispatch]);

  const handleDelete = async ({ val }) => {
    const response = await axiosPrivate.delete("/api/subjects/delete", {
      headers: { "Content-Type": "application/json" },
      data: val,
      withCredentials: true,
    });
    const json = await response.data;
    if (response.status === 200) {
      console.log(response.data.message);
      subDispatch({ type: "DELETE_SUBJECT", payload: json });
    }
  };
  const toggleStatus = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);
    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/subjects/status",
        JSON.stringify({ subjectID: val.subjectID, status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/tasks");
        if (response2?.status === 200) {
          const json = await response2.data;
          setIsLoading(false);
          taskDispatch({ type: "SET_TASKS", payload: json });
          setSuccessDialog({ isOpen: true });
        }
      }
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `No server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
      } else if (error.response.status === 500) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };
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
              alignItems: { sm: "end" },
              justifyContent: { xs: "center", sm: "start" },
              m: { xs: "20px 0" },
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              ADD TASKS
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ width: "100%", p: 2, mt: 2 }}>
        <Box>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box
              gap={2}
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Level</Typography>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={levelID}
                  // error={}
                  onChange={(e) => {
                    setLevelID(e.target.value);
                  }}
                >
                  <MenuItem aria-label="None" value="" />
                  {levels &&
                    levels
                      .filter((fil) => {
                        return fil.status === true;
                      })
                      .map((val) => {
                        return (
                          <MenuItem value={val.levelID}>
                            {val.levelNum}
                          </MenuItem>
                        );
                      })}
                </Select>
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Section</Typography>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sectionID}
                  // error={}
                  onChange={(e) => {
                    setSectionID(e.target.value);
                  }}
                >
                  {sections &&
                    sections
                      .filter((fill) => {
                        return fill.levelID === levelID;
                      })
                      .map((val) => {
                        return (
                          <MenuItem value={val.sectionID}>
                            {val.sectionName}
                          </MenuItem>
                        );
                      })}
                </Select>
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Subject</Typography>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subjectID}
                  // error={}
                  onChange={(e) => {
                    setSubjectID(e.target.value);
                  }}
                >
                  {subjects &&
                    subjects
                      .filter((fill) => {
                        return fill.levelID === levelID;
                      })
                      .map((val) => {
                        return (
                          <MenuItem value={val.subjectID}>
                            {val.subjectName}
                          </MenuItem>
                        );
                      })}
                </Select>
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Task Type</Typography>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={taskType}
                  // error={}
                  onChange={(e) => {
                    setTaskType(e.target.value);
                  }}
                >
                  <MenuItem value={"assignment"}>Assignment</MenuItem>
                  <MenuItem value={"activity"}>Activity</MenuItem>
                  <MenuItem value={"project"}>Project</MenuItem>
                  <MenuItem value={"quiz"}>Quiz</MenuItem>
                  <MenuItem value={"exam"}>Exam</MenuItem>
                </Select>
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Task Name</Typography>

                <TextField
                  required
                  variant="outlined"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">Points</Typography>

                <TextField
                  required
                  type="number"
                  variant="outlined"
                  value={maxPoints}
                  onChange={(e) => {
                    setMaxPoints(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl required fullWidth>
                <Typography id="demo-simple-select-label">
                  Description
                </Typography>

                <TextField
                  variant="outlined"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <Box
              display="flex"
              sx={{ justifyContent: { xs: "center", sm: "end" }, mt: 2 }}
              height="70px"
              gap={2}
            >
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ width: "250px", height: "50px" }}
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ width: "250px", height: "50px" }}
                onClick={() => {
                  clearInputForms();
                  navigate(-1, { replace: true });
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default Taskform;
