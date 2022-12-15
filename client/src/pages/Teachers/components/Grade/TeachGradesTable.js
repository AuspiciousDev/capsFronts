import React from "react";
import { useState, useEffect, useRef } from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  Paper,
  InputBase,
  Divider,
  Typography,
  IconButton,
  ButtonBase,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TablePagination,
  Avatar,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";

import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import CancelIcon from "@mui/icons-material/Cancel";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import { useTheme, styled } from "@mui/material";
import { tokens } from "../../../../theme";
import GradesForm from "./TeachGradesForm";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import useAuth from "../../../../hooks/useAuth";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar
      // printOptions={{
      //   fields: ["schoolYearID", "fullName", "userType", "createdAt"],
      // }}
      // csvOptions={{ fields: ["username", "firstName"] }}
      />
      {/* <GridToolbarExport */}

      {/* /> */}
    </GridToolbarContainer>
  );
}

const TeachGradesTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const ref = useRef();
  const [getGrades, setGrades] = useState([]);
  const [getData, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState([]);
  const { auth } = useAuth();
  const [getStudLevelID, setStudLevelID] = useState("");
  const [getStudSectionID, setStudSectionID] = useState("");

  const [getStudSubjectID, setStudSubjectID] = useState("");

  const [getID, setID] = useState("");
  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { years, yearDispatch } = useSchoolYearsContext();
  const [currentYear, setCurrentYear] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const closeFilter = () => {
    setIsFilterOpen(false);
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
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        setIsLoading(true);
        const apiTeacher = await axiosPrivate.get(
          `/api/employees/search/${auth.username}`
        );
        if (apiTeacher.status === 200) {
          const json = await apiTeacher.data;
          console.log("Teacher Data:", json);
          setUserData(json);
        }

        const apiGrade = await axiosPrivate.get("/api/grades", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiGrade.status === 200) {
          const json = await apiGrade.data;
          console.log(json);
          setIsLoading(false);
          setGrades(json);
        }

        const apiStud = await axiosPrivate.get("/api/students", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiStud?.status === 200) {
          const json = await apiStud.data;
          //   console.log(json);
          setIsLoading(false);
          studDispatch({ type: "SET_STUDENTS", payload: json });
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
          activeDispatch({ type: "SET_ACTIVES", payload: json });
        }
        const apiYear = await axiosPrivate.get("/api/schoolyears", {});
        if (apiYear?.status === 200) {
          const json = await apiYear.data;
          //   console.log(json);
          setIsLoading(false);
          yearDispatch({ type: "SET_YEARS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
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
        } else if (error.response.status === 409) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
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
  }, [
    studDispatch,
    gradeDispatch,
    subDispatch,
    levelDispatch,
    depDispatch,
    secDispatch,
    activeDispatch,
  ]);
  useEffect(() => {
    setCurrentYear(
      years &&
        years
          .filter((fill) => {
            return fill?.status === true;
          })
          .map((val) => {
            return val?.schoolYearID;
          })
    );
  }, []);
  function createLevel(levelID, levelTitle) {
    return { levelID, levelTitle };
  }

  const [page, setPage] = React.useState(15);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const grades1 = [
    createLevel("GR1", "1"),
    createLevel("GR2", "2"),
    createLevel("GR3", "3"),
    createLevel("GR4", "4"),
    createLevel("GR5", "5"),
    createLevel("GR6", "6"),
  ];

  function createSection(levelID, sectionID, sectionTitle) {
    return { levelID, sectionID, sectionTitle };
  }

  const sections1 = [
    createSection("GR1", "SC1", "Malala"),
    createSection("GR1", "SC2", "ALALAY"),
    createSection("GR2", "SC1", "EWAN"),
    createSection("GR5", "SC1", "IDOWN"),
  ];
  const StyledPaper = styled(Paper)(({ theme }) => ({
    "&#active": {
      // border: `solid 2px ${colors.darkWhiteBlue[100]}`,
    },
  }));

  const [open, setOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    // setSectionName("");
    // setLevelID("");
    // setDepartmentID("");
    // setError(false);
  };

  const columns = [
    {
      field: "imgURL",
      headerName: "Profile",
      width: 130,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Avatar
              alt="profile-user"
              sx={{ width: "40px", height: "40px" }}
              src={params?.value}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "studID",
      headerName: "Student ID",
      width: 150,
      renderCell: (params) => {
        return (
          <ButtonBase
            onClick={() => {
              setOpen((o) => !o);
              setID(params?.value);
            }}
          >
            <Paper
              sx={{
                padding: "2px 20px",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: colors.whiteOnly[100],
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold", color: "black" }}>
                {params?.value}
              </Typography>
            </Paper>
          </ButtonBase>
        );
      },
    },
    {
      field: "fullName",
      headerName: "Name",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 200,

      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.middleName || ""} ${
          params.row.lastName || ""
        }`,
    },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "levelID", headerName: "Level", width: 120 },
    { field: "sectionID", headerName: "Section", width: 120 },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 240,
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      headerName: "Records",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2} width="60%">
            {/* <Box
          sx={{
            display: "flex",
            width: "30%",
            p: "5px",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        > */}
            {/* <ButtonBase
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setIsFormOpen((o) => !o);
            setData(val);
            setID(val.studID);
          }} 
        >*/}
            <Link
              to={`/teacher/grade/record/${params.row.levelID}/${params.row.sectionID}/${params.row.schoolYearID}/${params.row.studID}`}
              style={{ textDecoration: "none" }}
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
                <TopicOutlinedIcon />
                <Typography ml="10px">Grades</Typography>
              </Paper>
              {/* </ButtonBase> */}
              {/* </Box> */}
            </Link>
            <Paper
              sx={{
                padding: "2px 10px",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: colors.whiteOnly[100],

                alignItems: "center",
              }}
            >
              <Link
                to={`/teacher/record/task/${params.row.studID}/${params.row.schoolYearID}`}
                style={{
                  alignItems: "center",
                  color: colors.black[100],
                  textDecoration: "none",
                }}
              >
                <Box
                  display="flex"
                  sx={{ alignItems: "center", color: colors.blackOnly[100] }}
                >
                  <DownloadForOfflineOutlinedIcon />
                  <Typography ml="5px">Tasks</Typography>
                </Box>
              </Link>
            </Paper>
          </Box>
        );
      },
    },
  ];

  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="left">Student ID</TableCell>
        <TableCell align="left">Name</TableCell>
        <TableCell align="left">Sex</TableCell>
        <TableCell align="left">Records</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = ({ val }) => {
    return (
      <StyledTableRow key={val._id} data-rowid={val.studID}>
        {/* Student ID */}
        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setOpen((o) => !o);
              setID(val.studID);
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>{val.studID}</Typography>
          </ButtonBase>
        </TableCell>

        {/* Student Name */}
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {students &&
            students
              .filter((stud) => {
                return stud.studID === val.studID;
              })
              .map((stud) => {
                return stud?.middleName
                  ? stud.firstName + " " + stud.middleName + " " + stud.lastName
                  : stud.firstName + " " + stud.lastName;
              })}
        </TableCell>
        {/* Student Level */}
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {students &&
            students
              .filter((stud) => {
                return stud.studID === val.studID;
              })
              .map((stud) => {
                return stud.gender;
              })}
        </TableCell>
        {/* Student Department */}

        <TableCell align="left">
          <Box display="flex" gap={2} width="60%">
            {/* <Box
              sx={{
                display: "flex",
                width: "30%",
                p: "5px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            > */}
            {/* <ButtonBase
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setIsFormOpen((o) => !o);
                setData(val);
                setID(val.studID);
              }} 
            >*/}
            <Link
              to={`/teacher/grade/${val.levelID}/${val.schoolYearID}/${val.studID}`}
              style={{ textDecoration: "none" }}
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
                <TopicOutlinedIcon />
                <Typography ml="10px">Grades</Typography>
              </Paper>
              {/* </ButtonBase> */}
              {/* </Box> */}
            </Link>
            <Paper
              sx={{
                padding: "2px 10px",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: colors.whiteOnly[100],

                alignItems: "center",
              }}
            >
              <Link
                to={`/teacher/record/task/${val.studID}/${val.schoolYearID}`}
                style={{
                  alignItems: "center",
                  color: colors.black[100],
                  textDecoration: "none",
                }}
              >
                <Box
                  display="flex"
                  sx={{ alignItems: "center", color: colors.blackOnly[100] }}
                >
                  <DownloadForOfflineOutlinedIcon />
                  <Typography ml="5px">Tasks</Typography>
                </Box>
              </Link>
            </Paper>
          </Box>
        </TableCell>
      </StyledTableRow>
    );
  };
  const GradeTableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell
          sx={{
            display: { xs: "flex", sm: "none" },
            textTransform: "uppercase",
          }}
          align="left"
        >
          SUBJECT ID
        </TableCell>
        <TableCell
          sx={{
            display: { xs: "none", sm: "flex" },
            textTransform: "capitalize",
          }}
          align="left"
        >
          SUBJECT NAME
        </TableCell>
        <TableCell align="left">1st </TableCell>
        <TableCell align="left">2nd </TableCell>
        <TableCell align="left">3rd </TableCell>
        <TableCell align="left">4th </TableCell>
        <TableCell align="left">FINAL</TableCell>
        <TableCell align="left">REMARKS</TableCell>
      </StyledTableHeadRow>
    );
  };
  const GradeTableDetails = ({ val }) => {
    // console.log("dadaData:", val);
    // console.log("dadaID:", getID);\
    let grade1, grade2, grade3, grade4;
    return (
      <StyledTableRow
        key={val._id}
        data-rowid={val.studID}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* Student ID */}
        <TableCell
          align="left"
          sx={{
            display: { xs: "flex", sm: "none" },
            textTransform: "uppercase",
          }}
        >
          {val.subjectID}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            display: { xs: "none", sm: "flex" },
            textTransform: "capitalize",
          }}
        >
          {subjects &&
            subjects
              .filter((sub) => {
                // return console.log(sub.subjectID, val.subjectID);
                return (
                  sub.subjectID.toLowerCase() === val.subjectID.toLowerCase()
                );
              })
              .map((sub) => {
                return sub.subjectName;
              })}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === getID &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 1
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === getID &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 1
                  );
                })
                .map((val) => {
                  return val?.grade, (grade1 = val?.grade);
                })
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === getID &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 2
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === getID &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 2
                  );
                })
                .map((val) => {
                  return val?.grade, (grade2 = val?.grade);
                })
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === getID &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 3
            );
          }).length > 0
            ? getGrades &&
              getGrades
                .filter((fill) => {
                  return (
                    fill.studID === getID &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 3
                  );
                })
                .map((val) => {
                  return val?.grade, (grade3 = val?.grade);
                })
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === getID &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 4
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === getID &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 4
                  );
                })
                .map((val) => {
                  return val?.grade, (grade4 = val?.grade);
                })
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grade1 && grade2 && grade3 && grade4 ? (
            (grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
              <Typography variant="h6" fontWeight="bold">
                {(grade1 + grade2 + grade3 + grade4) / 4}
              </Typography>
            ) : (
              <Typography variant="h6" fontWeight="bold" color="red">
                {(grade1 + grade2 + grade3 + grade4) / 4}
              </Typography>
            )
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {!grade1 || !grade2 || !grade3 || !grade4 ? (
            "-"
          ) : (grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
            <Typography fontWeight="bold" variant="h6">
              passed
            </Typography>
          ) : (
            <Typography
              variant="h6"
              fontWeight="bold"
              color={colors.error[100]}
            >
              failed
            </Typography>
          )}
        </TableCell>
        {/* Student Name */}
      </StyledTableRow>
    );
  };

  // const StudGradeTableTitles = () => {
  //   return (
  //     <TableRow>
  //       <TableCell align="left">SUBJECT ID</TableCell>
  //       <TableCell align="left">SUBJECT NAME</TableCell>
  //       <TableCell align="left">1st </TableCell>
  //       <TableCell align="left">2nd </TableCell>
  //       <TableCell align="left">3rd </TableCell>
  //       <TableCell align="left">4th </TableCell>
  //       <TableCell align="left">REMARKS</TableCell>
  //     </TableRow>
  //   );
  // };
  // const StudGradeTableDetails = ({ val }) => {
  //   return (
  //     <StyledTableRow
  //       key={val._id}
  //       data-rowid={val.studID}
  //       sx={
  //         {
  //           // "&:last-child td, &:last-child th": { border: 2 },
  //           // "& td, & th": { border: 2 },
  //         }
  //       }
  //     >
  //       {/* Student ID */}
  //       <TableCell
  //         align="left"
  //         onClick={handleCellClick}
  //         sx={{ textTransform: "uppercase" }}
  //       >
  //         {val.subjectID}
  //       </TableCell>
  //       <TableCell align="left" sx={{ textTransform: "capitalize" }}>
  //         {subjects &&
  //           subjects
  //             .filter((sub) => {
  //               return (
  //                 sub.subjectID.toLowerCase() === val.subjectID.toLowerCase()
  //               );
  //             })
  //             .map((sub) => {
  //               return sub.subjectName;
  //             })}
  //       </TableCell>
  //       <TableCell align="left">
  //         {val.allGrades.map((val) => {
  //           return val.quarter1;
  //         })}
  //       </TableCell>
  //       <TableCell align="left">
  //         {val.allGrades.map((val) => {
  //           return val.quarter2;
  //         })}
  //       </TableCell>
  //       <TableCell align="left">
  //         {val.allGrades.map((val) => {
  //           return val.quarter3;
  //         })}
  //       </TableCell>
  //       <TableCell align="left">
  //         {val.allGrades.map((val) => {
  //           return val.quarter4;
  //         })}
  //       </TableCell>

  //       <TableCell align="left" sx={{ textTransform: "capitalize" }}>
  //         {val?.remark ? "passed" : "failed"}
  //       </TableCell>
  //       {/* Student Name */}
  //     </StyledTableRow>
  //   );
  // };
  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
      textTransform: "capitalize",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const StudentGradeForm = ({ val }) => {};
  const closeForm = () => {};
  return (
    <>
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
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div
          className="modal-small-form"
          style={{
            border: `solid 1px ${colors.black[200]}`,
            backgroundColor: colors.black[900],
          }}
        >
          <IconButton className="close" onClick={closeModal} disableRipple>
            <CancelIcon />
            {/* <Typography variant="h4">&times;</Typography> */}
          </IconButton>
          <Box
            className="header"
            sx={{ borderBottom: `2px solid ${colors.primary[900]}` }}
          >
            <Typography variant="h3">GRADES</Typography>
          </Box>
          <div className="content">
            <Box
              className="formContainer"
              display="block"
              width="100%"
              flexDirection="column"
              justifyContent="center"
              margin="10px 0"
            >
              <Typography>
                Student ID : {[" "]} {getID}
              </Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                Student Name : {[" "]}
                {students &&
                  students
                    .filter((val) => {
                      return val.studID === getID;
                    })
                    .map((stud) => {
                      return stud?.middleName
                        ? stud.firstName +
                            " " +
                            stud.middleName.charAt(0) +
                            ". " +
                            stud.lastName
                        : stud.firstName + " " + stud.lastName;
                    })}
              </Typography>
              {getGrades ? (
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <GradeTableTitles key={"asdas"} />
                    </TableHead>
                    <TableBody>
                      {/* {getGrades &&
                        getGrades
                          .filter((grade) => {
                            return grade.studID === getID;
                          })
                          .slice(0, 3).map((val) => {
                            return GradeTableDetails({ val });
                          })} */}

                      {actives &&
                        subjects &&
                        subjects
                          .filter((fill) => {
                            const act = actives
                              .filter((fill) => {
                                return fill.studID === getID;
                              })
                              .map((val) => {
                                return val.levelID;
                              });
                            return fill.levelID === act[0];
                          })
                          .map((val) => {
                            return GradeTableDetails({ val });
                          })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
            </Box>
          </div>
        </div>
      </Popup>

      {isFormOpen ? (
        <GradesForm val={getData} />
      ) : (
        <>
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
                  GRADES
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              mt: 2,
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                // rows={actives ? actives && actives : 0}
                rows={
                  actives && userData && currentYear
                    ? userData &&
                      currentYear &&
                      actives &&
                      actives.filter((fill) => {
                        return (
                          fill.schoolYearID == currentYear &&
                          userData?.LevelLoads?.some((e) => e === fill?.levelID)
                        );
                      })
                    : 0
                }
                getRowId={(row) => row._id}
                columns={columns}
                pageSize={page}
                onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                rowsPerPageOptions={[15, 50]}
                pagination
                sx={{
                  "& .MuiDataGrid-cell": {
                    textTransform: "capitalize",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      createdAt: false,
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
              />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default TeachGradesTable;
