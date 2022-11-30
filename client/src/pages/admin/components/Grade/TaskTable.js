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
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  CheckCircle,
  Delete,
  Search,
  Add,
} from "@mui/icons-material";
import PropTypes from "prop-types";
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

const TaskTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

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
          taskScoreDispatch({ type: "SET_TASKSCORES", payload: json });
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
    taskDispatch,
  ]);

  console.log("stud Data:", getStudentData);
  const TableTitles = () => {
    return (
      <StyledTableHeadRow
      // sx={{ backgroundColor: `${colors.primary[100]}` }}
      >
        <TableCell>Date</TableCell>
        <TableCell>Title</TableCell>
        <TableCell align="left">Points</TableCell>
        <TableCell align="left">Actions</TableCell>
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
        <TableCell align="left">{val?.createdAt}</TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.taskName}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {/* <Button
            type="button"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                title: "are you sure to delete this record",
                subTitle: "You cant undo this operation!",
              })
            }
          >
            asdasd
          </Button> */}
          {val?.status === false ? (
            <ButtonBase disabled>
              <Paper
                sx={{
                  display: "flex",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  alignItems: "center",
                }}
              >
                <Bookmark />
                <Typography ml="5px">ARCHIVED</Typography>
              </Paper>
            </ButtonBase>
          ) : (
            <ButtonBase
              type="button"
              onClick={() =>
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to archived Year ${val.schoolYear}`,
                      message: "You cant undo this operation!",
                      onConfirm: () => {
                        // toggleStatus({ val });
                      },
                    });
                  },
                })
              }
            >
              <Paper
                sx={{
                  display: "flex",
                  padding: "2px 10px",
                  backgroundColor: colors.primary[900],
                  color: colors.whiteOnly[100],
                  borderRadius: "20px",
                  alignItems: "center",
                }}
              >
                <CheckCircle />
                <Typography ml="5px">ACTIVE</Typography>
              </Paper>
            </ButtonBase>
          )}
        </TableCell>
        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to delete year ${val.schoolYearID}`,
                    message: `This action is irreversible!`,
                    onConfirm: () => {
                      // handleDelete({ val });
                    },
                  });
                },
              });
            }}
          >
            <Paper
              sx={{
                padding: "2px 10px",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: colors.whiteOnly[100],
                color: colors.blackOnly[100],
                alignItems: "center",
              }}
            >
              <Delete />
              <Typography ml="5px">Remove</Typography>
            </Paper>
          </ButtonBase>
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
    <Box className="contents-container">
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Link to={`/admin/record/task/add/${id}/${year}`}>
              <Button
                type="button"
                startIcon={<Add />}
                // onClick={setIsFormOpen((e) => !e)}
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  height: "50px",
                  marginLeft: { xs: "0", sm: "20px" },
                  marginTop: { xs: "20px", sm: "0" },
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Add
                </Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
          mt: 2,
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

            <Tab label="Exams" {...a11yProps(4)} sx={{ fontWeight: "bold" }} />
          </Tabs>
        </AppBar>
      </Box>{" "}
      <TabPanel sx={{ width: "100%" }} value={value} index={0}>
        <Paper elevation={2}>
          <TableContainer sx={{ maxHeight: "700px" }}>
            <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableTitles />
              </TableHead>
              <TableBody>
                {taskScore &&
                  taskScore
                    .filter((fill) => {
                      return fill.taskType === "assignment";
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
            count={5}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};

export default TaskTable;
