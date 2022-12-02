import React from "react";
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
} from "@mui/material";
import { format } from "date-fns-tz";
import { styled } from "@mui/material/styles";
import deped from "../../../images/Logo-DepEd-1.png";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import { useStudentsContext } from "../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../hooks/useActiveStudentContext";
import { useSchoolYearsContext } from "../../../hooks/useSchoolYearsContext";
import { axiosPrivate } from "../../../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useReactToPrint } from "react-to-print";
const StudentGenerateActiveYearGrades = (props) => {
  const { id, year } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();

  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();

  const [isloading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [getGrades, setGrades] = useState([]);
  const [getData, setData] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `"ReportOfGrade-" ${id}`,
  });
  // useEffect(() => {
  //   console.log(`/something/ : ${id}`);
  // }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        const apiGrade = await axiosPrivate.get("/api/grades", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiGrade?.status === 200) {
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
        if (response?.status === 200) {
          const json = await response.data;
          // console.log(json);
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const getLevels = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getLevels?.status === 200) {
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
        const getGrades = await axiosPrivate.get("/api/grades", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getGrades?.status === 200) {
          const json = await getGrades.data;
          // console.log(json);
          setIsLoading(false);
          gradeDispatch({ type: "SET_GRADES", payload: json });
        }
        const apiActive = await axiosPrivate.get("/api/activestudents", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiActive?.status === 200) {
          const json = await apiActive.data;
          // console.log(json);
          setIsLoading(false);
          activeDispatch({ type: "SET_ACTIVES", payload: json });
        }
      } catch (error) {
        if (!error?.response) {
          console.log("No server response!");
          alert("No server response!");
        } else if (error.response?.status === 204) {
          alert(error.response.data.message);
        } else {
          // alert(error);
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
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#ccd2d8",
    },
    // hide last border
    " & th": {
      border: "1px solid #000",
    },
  }));
  const StyledTableRow1 = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#fff",
    },
    // hide last border
    " & th": {
      border: "1px solid #000",
    },
  }));
  const TableTitles = () => {
    return (
      <StyledTableRow sx={{ height: "30px" }}>
        <TableCell align="left">SUBJECT ID</TableCell>
        <TableCell align="left">SUBJECT NAME</TableCell>
        <TableCell align="left">1st </TableCell>
        <TableCell align="left">2nd </TableCell>
        <TableCell align="left">3rd </TableCell>
        <TableCell align="left">4th </TableCell>
        <TableCell align="left">FINAL </TableCell>
        <TableCell align="left">REMARKS</TableCell>
      </StyledTableRow>
    );
  };
  const TableDetails = ({ val }) => {
    let grade1 = 0;
    let grade2 = 0;
    let grade3 = 0;
    let grade4 = 0;
    return (
      <StyledTableRow1
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
            textTransform: "uppercase",
          }}
        >
          {val.subjectID}
        </TableCell>
        <TableCell
          align="left"
          sx={{
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
                fill.studID === id &&
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
                fill.studID === id &&
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
                fill.studID === id &&
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
                fill.studID === id &&
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
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {(grade1 + grade2 + grade3 + grade4) / 4}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {(grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
            <Typography
              textTransform="uppercase"
              fontWeight="bold"
              variant="h6"
            >
              passed
            </Typography>
          ) : (
            <Typography
              textTransform="uppercase"
              variant="h6"
              fontWeight="bold"
              color={colors.error[100]}
            >
              failed
            </Typography>
          )}
        </TableCell>
      </StyledTableRow1>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        ref={componentRef}
        sx={{
          position: "relative",
          display: "flex",
          width: "816px",
          // width: "793px",
          minWidth: "793px",
          justifyContent: "center",
          padding: "20px",
          border: "dashed  1px black",
        }}
      >
        {/* // Header */}
        <Box
          sx={{
            position: "absolute",
            left: "0",
            top: "0",
            borderRadius: "10px",
            margin: "20px 0 0 20px",
          }}
        >
          <img alt="deped" src={deped} style={{ width: "100px" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography>Republic of the Philippines</Typography>
            <Typography variant="h2" fontWeight="bold">
              Student Portal
            </Typography>
            <Typography>Malolos City, Bulacan, Philippines</Typography>
            <Typography variant="h3" mt="20px">
              REPORT OF GRADES
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              mt: "10px",
              //   border: "1px solid black",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#ccd2d8",
                padding: "5px",
              }}
            >
              <Typography>STUDENT GENERAL INFORMATION</Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.75fr 1fr 1fr",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography>Student No :</Typography>
                  <Typography>Name :</Typography>
                  <Typography>Gender :</Typography>
                </Box>
                <Box
                  sx={{
                    display: "block",

                    textAlign: "start",
                    ml: "5px",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>{id}</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {students &&
                      students
                        .filter((fill) => {
                          return fill.studID === id;
                          //   return console.log(fill.studID);
                        })
                        .map((stud) => {
                          return stud?.middleName
                            ? stud.firstName +
                                " " +
                                stud.middleName +
                                " " +
                                stud.lastName
                            : stud.firstName + " " + stud.lastName;
                        })}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {students &&
                      students
                        .filter((fill) => {
                          return fill.studID === id;
                          //   return console.log(fill.studID);
                        })
                        .map((stud) => {
                          return stud?.gender;
                        })}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography>Department :</Typography>
                  <Typography> Level :</Typography>
                  <Typography>Section :</Typography>
                </Box>
                <Box
                  sx={{
                    display: "block",

                    textAlign: "start",
                    ml: "5px",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    textTransform="capitalize"
                  >
                    {departments &&
                      actives &&
                      departments
                        .filter((val) => {
                          const res = actives
                            .filter((red) => {
                              return red.studID === id;
                            })
                            .map((rel) => {
                              return rel.departmentID;
                            });
                          return (
                            val.departmentID === res[0]

                            //   console.log("actives: ", val.studID),
                            //   console.log("grades: ", res[0])
                          );
                        })
                        .map((val) => {
                          return val.depName;
                        })}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    textTransform="capitalize"
                  >
                    {levels &&
                      actives &&
                      levels
                        .filter((val) => {
                          const res = actives
                            .filter((red) => {
                              return red.studID === id;
                            })
                            .map((rel) => {
                              return rel.levelID;
                            });
                          return (
                            val.levelID === res[0]

                            //   console.log("actives: ", val.studID),
                            //   console.log("grades: ", res[0])
                          );
                        })
                        .map((val) => {
                          return val.levelNum;
                        })}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    textTransform="capitalize"
                  >
                    {sections &&
                      actives &&
                      sections
                        .filter((val) => {
                          const res = actives
                            .filter((red) => {
                              return red.studID === id;
                            })
                            .map((rel) => {
                              return rel.sectionID;
                            });
                          return (
                            val.sectionID === res[0]

                            //   console.log("actives: ", val.studID),
                            //   console.log("grades: ", res[0])
                          );
                        })
                        .map((val) => {
                          return val.sectionName;
                        })}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography>School Year :</Typography>
                </Box>
                <Box
                  sx={{
                    display: "block",

                    textAlign: "start",
                    ml: "5px",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {/* {years &&
                      actives &&
                      years
                        .filter((val) => {
                          const res = actives
                            .filter((red) => {
                              return red.studID === id;
                            })
                            .map((rel) => {
                              return rel.schoolYearID;
                            });
                          return (
                            val.schoolYearID === res[0]

                            //   console.log("actives: ", val.studID),
                            //   console.log("grades: ", res[0])
                          );
                        })
                        .map((val) => {
                          return val.schoolYear;
                        })} */}
                    {year}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box mt="20px">
              <TableContainer
                sx={{
                  height: "400px",
                }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableTitles key={"asdas"} />
                  </TableHead>
                  <TableBody>
                    {actives &&
                      subjects &&
                      subjects
                        .filter((fill) => {
                          const act = actives
                            .filter((fill) => {
                              return fill.studID === id;
                            })
                            .map((val) => {
                              return val.levelID;
                            });
                          return fill.levelID === act[0];
                        })
                        .map((val) => {
                          return TableDetails({ val });
                        })}
                  </TableBody>
                </Table>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: "20px",
                  }}
                >
                  <Typography>--- NOTHING FOLLOWS ----</Typography>
                </Box>
              </TableContainer>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr " }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography fontSize="10px">
                    *This is a generated report, It is unofficial without dry
                    seal.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography fontSize="10px">Date Printed :</Typography>
                </Box>
                <Box
                  sx={{
                    display: "block",

                    textAlign: "start",
                    ml: "5px",
                  }}
                >
                  <Typography fontSize="10px" sx={{ fontWeight: "bold" }}>
                    {format(new Date(), "hh:mm a ")}
                  </Typography>
                  <Typography fontSize="10px" sx={{ fontWeight: "bold" }}>
                    {format(
                      new Date(),
                      "MMMM dd, yyyy"
                      //   "hh:mm a, EEEE"
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Button
          sx={{ width: "200px", mt: "50px" }}
          type="button"
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          sx={{ width: "200px", mt: "50px", ml: "50px" }}
          type="button"
          variant="contained"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default StudentGenerateActiveYearGrades;
