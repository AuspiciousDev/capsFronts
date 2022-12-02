import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import PropTypes from "prop-types";
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
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  CheckCircle,
  Delete,
  Search,
  Add,
  AdminPanelSettings,
  Badge,
} from "@mui/icons-material";

import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useTasksContext } from "../../../../hooks/useTasksContext";
import { useTasksScoresContext } from "../../../../hooks/useTasksScoreContext";
import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";

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

const LoadManage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const [isloading, setIsLoading] = useState(false);

  const [empData, setEmpData] = useState([]);
  const [levelLoad, setLevelLoad] = useState({ types: [] });
  const [sectionLoad, setSectionLoad] = useState({ types: [] });
  const [subjectLoad, setSubjectLoad] = useState({ types: [] });
  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { tasks, taskDispatch } = useTasksContext();
  const { employees, empDispatch } = useEmployeesContext();
  const { taskScore, taskScoreDispatch } = useTasksScoresContext();

  const handleFieldChange = (event) => {
    console.log(event);
    event.preventDefault();
    setLevelLoad((levelLoad) => ({
      ...levelLoad,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };

  const handleSecFieldChange = (event) => {
    console.log(event);
    event.preventDefault();
    setSectionLoad((sectionLoad) => ({
      ...sectionLoad,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };
  const handleSubFieldChange = (event) => {
    console.log(event);
    event.preventDefault();
    setSubjectLoad((subjectLoad) => ({
      ...subjectLoad,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };
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
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        const apiStud = await axiosPrivate.get(`/api/employees/search/${id}`);
        if (apiStud?.status === 200) {
          const json = await apiStud.data;
          console.log("GET_SearchedEmp : ", json);
          setIsLoading(false);
          setEmpData(json);
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
  const LevelTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Level ID</TableCell>
        <TableCell>Level </TableCell>
        <TableCell>Department </TableCell>
      </TableRow>
    );
  };
  const SectionTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Section ID</TableCell>
        <TableCell>Section Name</TableCell>
        <TableCell>Level</TableCell>
      </TableRow>
    );
  };
  const SubjectTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Subject ID</TableCell>
        <TableCell>Subject Name</TableCell>
        <TableCell>Level </TableCell>
      </TableRow>
    );
  };
  return (
    <div className="contents-container">
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
                {empData?.middleName
                  ? empData.firstName +
                    " " +
                    empData.middleName +
                    " " +
                    empData.lastName
                  : empData.firstName + " " + empData.lastName}{" "}
              </Typography>
              <Typography>{empData.empID}</Typography>
              <Typography>
                {empData &&
                  empData?.empType?.map((item, i) => {
                    return (
                      <ul
                        style={{
                          display: "flex",
                          padding: "0",
                          listStyle: "none",
                        }}
                      >
                        {item === 2001 ? (
                          <li>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                              <AdminPanelSettings />
                              <Typography sx={{ ml: "5px" }}>Admin</Typography>
                            </Box>
                          </li>
                        ) : item === 2002 ? (
                          <li>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                              <Badge />
                              <Typography sx={{ ml: "5px" }}>
                                Teacher
                              </Typography>
                            </Box>
                          </li>
                        ) : (
                          <></>
                        )}
                      </ul>
                    );
                  })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{ display: "flex", flexDirection: "column", width: "100%", p: 2 }}
      >
        <form>
          <Typography variant="h3">Select Loads</Typography>
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <TextField
              required
              select
              name="types"
              id="types"
              variant="outlined"
              label="Levels"
              SelectProps={{
                multiple: true,
                value: levelLoad.types,
                onChange: handleFieldChange,
              }}
            >
              {levels &&
                levels
                  .filter((fill) => {
                    return fill.status === true;
                  })
                  .map((val) => {
                    return (
                      <MenuItem value={val.levelID}>
                        [{val.levelID}] Grade - {val.levelNum}
                      </MenuItem>
                    );
                  })}

              {/* <MenuItem value={2002}>Teacher</MenuItem> */}
            </TextField>
          </FormControl>
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <TextField
              required
              select
              name="types"
              id="types"
              variant="outlined"
              label="Sections"
              SelectProps={{
                multiple: true,
                value: sectionLoad.types,
                onChange: handleSecFieldChange,
              }}
            >
              {levelLoad &&
                sections &&
                sections
                  .filter((fill) => {
                    const res = levelLoad.map((val) => {
                      return val.types;
                    });
                    return fill.status === true && fill.levelID.includes(res);
                  })
                  .map((val) => {
                    return (
                      <MenuItem value={val.sectionID}>
                        {val.levelID} - {val.sectionName}
                      </MenuItem>
                    );
                  })}

              {/* <MenuItem value={2002}>Teacher</MenuItem> */}
            </TextField>
          </FormControl>{" "}
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <TextField
              required
              select
              name="types"
              id="types"
              variant="outlined"
              label="Subjects"
              SelectProps={{
                multiple: true,
                value: subjectLoad.types,
                onChange: handleSubFieldChange,
              }}
            >
              {levels &&
                levels
                  .filter((fill) => {
                    return fill.status === true;
                  })
                  .map((val) => {
                    return (
                      <MenuItem value={val.levelID}>
                        Grade - {val.levelNum}
                      </MenuItem>
                    );
                  })}

              {/* <MenuItem value={2002}>Teacher</MenuItem> */}
            </TextField>
          </FormControl>
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
                //   clearInputForms();
                //   navigate(-1, { replace: true });
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
      {/* <AppBar
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
          <Tab label="Levels" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
          <Tab label="Sections" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
          <Tab label="Subjects" {...a11yProps(2)} sx={{ fontWeight: "bold" }} />
        </Tabs>
      </AppBar>
      <TabPanel sx={{ width: "100%" }} value={value} index={0}>
       
      </TabPanel>
      <TabPanel sx={{ width: "100%" }} value={value} index={1}>
        <Box width="100%">
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <SectionTableTitles />
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
          <Divider />

          <Box display="flex" width="100%" marginTop="20px"></Box>
        </Box>
      </TabPanel>
      <TabPanel sx={{ width: "100%" }} value={value} index={2}>
        <Box width="100%">
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <SubjectTableTitles />
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
          <Divider />

          <Box display="flex" width="100%" marginTop="20px"></Box>
        </Box>
      </TabPanel> */}
    </div>
  );
};

export default LoadManage;
