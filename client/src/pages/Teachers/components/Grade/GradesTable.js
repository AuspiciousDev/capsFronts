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
  Button,
  Typography,
  IconButton,
  ButtonBase,
  TableContainer,
  Table,
  TableRow,
  FormControl,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  TablePagination,
} from "@mui/material";
import {
  DriveFileRenameOutline,
  AccountCircle,
  DeleteOutline,
  Person2,
  Search,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import { styled } from "@mui/material/styles";

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
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import GradesForm from "./GradesForm";
const GradesTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const ref = useRef();
  const [getLevelID, setLevelID] = useState("");
  const [getSectionID, setSectionID] = useState("");
  const [getLevelTitle, setLevelTitle] = useState("");
  const [getSectionTitle, setSectionTitle] = useState("");
  const [getGrades, setGrades] = useState([]);
  const [getData, setData] = useState([]);
  const [search, setSearch] = useState("");

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

  const [isloading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const closeFilter = () => {
    setIsFilterOpen(false);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

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
      } catch (error) {
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
  function createLevel(levelID, levelTitle) {
    return { levelID, levelTitle };
  }

  const [page, setPage] = React.useState(0);
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

  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="left">Student ID</TableCell>
        <TableCell align="left">Name</TableCell>
        <TableCell align="left">Sex</TableCell>
        <TableCell align="left">Actions</TableCell>
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
            <ButtonBase
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setIsFormOpen((o) => !o);
                setData(val);
                setID(val.studID);
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
                <TopicOutlinedIcon />
                <Typography ml="10px">Grades</Typography>
              </Paper>
            </ButtonBase>
            {/* </Box> */}

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
                to={`/generatepdf/${val.studID}`}
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
                  <Typography ml="5px">Download</Typography>
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
    let grade1 = 0;
    let grade2 = 0;
    let grade3 = 0;
    let grade4 = 0;
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
          onClick={handleCellClick}
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
            ? grade1
            : "0"}
        </TableCell>
        <TableCell align="left">
          {grades &&
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
            ? grade2
            : "0"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades
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
            ? grade3
            : "0"}
        </TableCell>
        <TableCell align="left">
          {grades &&
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
            ? grade4
            : "0"}
        </TableCell>
        <TableCell align="left">
          {(grade1 + grade2 + grade3 + grade4) / 4}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {(grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
            <Typography variant="h6" fontWeight="bold">
              passed
            </Typography>
          ) : (
            <Typography
              variant="h6"
              color={colors.error[100]}
              fontWeight="bold"
            >
              failed
            </Typography>
          )}
        </TableCell>
        {/* Student Name */}
      </StyledTableRow>
    );
  };

  const StudGradeTableTitles = () => {
    return (
      <TableRow>
        <TableCell align="left">SUBJECT ID</TableCell>
        <TableCell align="left">SUBJECT NAME</TableCell>
        <TableCell align="left">1st </TableCell>
        <TableCell align="left">2nd </TableCell>
        <TableCell align="left">3rd </TableCell>
        <TableCell align="left">4th </TableCell>
        <TableCell align="left">REMARKS</TableCell>
      </TableRow>
    );
  };
  const StudGradeTableDetails = ({ val }) => {
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
          onClick={handleCellClick}
          sx={{ textTransform: "uppercase" }}
        >
          {val.subjectID}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {subjects &&
            subjects
              .filter((sub) => {
                return (
                  sub.subjectID.toLowerCase() === val.subjectID.toLowerCase()
                );
              })
              .map((sub) => {
                return sub.subjectName;
              })}
        </TableCell>
        <TableCell align="left">
          {val.allGrades.map((val) => {
            return val.quarter1;
          })}
        </TableCell>
        <TableCell align="left">
          {val.allGrades.map((val) => {
            return val.quarter2;
          })}
        </TableCell>
        <TableCell align="left">
          {val.allGrades.map((val) => {
            return val.quarter3;
          })}
        </TableCell>
        <TableCell align="left">
          {val.allGrades.map((val) => {
            return val.quarter4;
          })}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.remark ? "passed" : "failed"}
        </TableCell>
        {/* Student Name */}
      </StyledTableRow>
    );
  };
  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
      textTransform: "uppercase",
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

  const handleCellClick = (e) => {
    console.log(e.target.textContent);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const StudentGradeForm = ({ val }) => {};
  const closeForm = () => {};
  return (
    <>
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
              margin: "20px 0 5px 0",
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
                  GRADES
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    width: { xs: "100%", sm: "320px" },
                    height: "50px",
                    minWidth: "250px",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: "0 20px", sm: "0 20px" },
                    mr: { xs: "0", sm: " 10px" },
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Employee"
                    onChange={(e) => {
                      setSearch(e.target.value.toLowerCase());
                    }}
                  />
                  <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <Search />
                  </IconButton>
                </Paper>
                <Button
                  type="button"
                  startIcon={<AddIcon />}
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
              </Box>
            </Box>
          </Paper>
          <Box width="100%">
            <Paper elevation={2}>
              <TableContainer
                sx={{
                  maxHeight: "700px",
                }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableTitles key={"asdas"} />
                  </TableHead>
                  <TableBody>
                    {getLevelID && getSectionID
                      ? getLevelID &&
                        getSectionID &&
                        actives &&
                        actives
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .filter((active) => {
                            return (
                              active.levelID.toLowerCase() === getLevelID &&
                              active.sectionID.toLowerCase() === getSectionID
                            );
                          })

                          .map((val) => {
                            return tableDetails({ val });
                          })
                      : actives &&
                        actives
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .filter((active) => {
                            return active.status === true;
                          })

                          .map((val) => {
                            return tableDetails({ val });
                          })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={actives && actives.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <Box display="flex" width="100%" marginTop="20px"></Box>
          </Box>
        </>
      )}
    </>
  );
};

export default GradesTable;
