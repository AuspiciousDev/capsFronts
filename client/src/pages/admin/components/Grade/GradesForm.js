import React from "react";
import { useState, useEffect } from "react";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
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
  InputAdornment,
} from "@mui/material";
import Grades from "../../Grades";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import { styled } from "@mui/material/styles";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import GradesTable from "./GradesTable";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";
import { useNavigate, useLocation } from "react-router-dom";

const GradesForm = () => {
  const { id, year, level, section } = useParams();
  console.log(id, year, level, section);
  const { auth } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [quarter1Grade, setQuarter1Grade] = useState();
  const [quarter2Grade, setQuarter2Grade] = useState();
  const [quarter3Grade, setQuarter3Grade] = useState();
  const [quarter4Grade, setQuarter4Grade] = useState();
  const [subjectGrade, setSubjectGrade] = useState();
  const [quarter, setQuarter] = useState();
  const [finalGrade, setFinalGrade] = useState(0);
  const [remarks, setRemarks] = useState("failed");
  const [getStudSubjectID, setStudSubjectID] = useState("");
  const [currYear, setCurrYear] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { years, yearDispatch } = useSchoolYearsContext();

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

  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
    },
    // hide last border
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // useEffect(() => {
  //   let finalGrades = 0;

  //   finalGrades =
  //     (Number(quarter1Grade) +
  //       Number(quarter2Grade) +
  //       Number(quarter3Grade) +
  //       Number(quarter4Grade)) /
  //     4;

  //   setFinalGrade(finalGrades);

  //   finalGrades >= 75 ? setRemarks("passed") : setRemarks("failed");
  // }, [quarter1Grade, quarter2Grade, quarter3Grade, quarter4Grade]);

  useEffect(() => {
    years &&
      years
        .filter((fill) => {
          return fill.status === true;
        })
        .map((val) => {
          return setCurrYear(val?.schoolYearID);
        });
  }, []);
  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    console.log(auth.username);
    // let username =
    // let schoolYearID = 2023;

    // const allGrades = [
    //   {
    //     quarter1: quarter1Grade,
    //     quarter2: quarter2Grade,
    //     quarter3: quarter3Grade,
    //     quarter4: quarter4Grade,
    //   },
    // ];
    const data = {
      studID: id,
      subjectID: getStudSubjectID,
      schoolYearID: currYear,
      empID: auth.username,
      grade: subjectGrade,
      quarter,
    };
    console.log(data);
    try {
      const response = await axiosPrivate.post(
        "/api/grades/register",
        JSON.stringify(data)
      );

      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        gradeDispatch({ type: "CREATE_GRADE", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: "Grade added successfully!",
        });
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
  const StudGradeTableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="left">SUBJECT ID</TableCell>
        <TableCell align="left">SUBJECT NAME</TableCell>
        <TableCell align="left">1st </TableCell>
        <TableCell align="left">2nd </TableCell>
        <TableCell align="left">3rd </TableCell>
        <TableCell align="left">4th </TableCell>
        <TableCell align="left">FINAL </TableCell>
        <TableCell align="left">REMARKS</TableCell>
      </StyledTableHeadRow>
    );
  };
  const StudGradeTableDetails = ({ val }) => {
    let grade1, grade2, grade3, grade4;
    return (
      <StyledTableRow
        key={val?._id}
        data-rowid={id}
        sx={{
          display: "table",
          width: "100%",
          tableLayout: "fixed",
          // "&:last-child td, &:last-child th": { border: 2 },
          // "& td, & th": { border: 2 },
        }}
      >
        {/* Student ID */}
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {val?.subjectID}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {subjects &&
            subjects
              .filter((sub) => {
                // return console.log(sub.subjectID, val?.subjectID);
                return (
                  sub.subjectID.toLowerCase() === val?.subjectID.toLowerCase()
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
              fill.studID === id &&
              fill.subjectID === val?.subjectID &&
              fill.quarter === 1
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === id &&
                    fill.subjectID === val?.subjectID &&
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
              fill.studID === id &&
              fill.subjectID === val?.subjectID &&
              fill.quarter === 2
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === id &&
                    fill.subjectID === val?.subjectID &&
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
              fill.studID === id &&
              fill.subjectID === val?.subjectID &&
              fill.quarter === 3
            );
          }).length > 0
            ? grades &&
              grades
                .filter((fill) => {
                  return (
                    fill.studID === id &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 4
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
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 4
            );
          }).length > 0
            ? grades &&
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
            : "-"}
        </TableCell>
        <TableCell align="left">
          {!grade1 || !grade2 || !grade3 || !grade4
            ? "-"
            : (grade1 + grade2 + grade3 + grade4) / 4}
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

  return (
    <Box
      className="contents-container"
      flexDirection="column"
      justifyContent="start"
    >
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                ".MuiBox-root > h3": {
                  textTransform: "capitalize",
                },
                ".MuiBox-root > p": {
                  textTransform: "capitalize",
                },
              }}
              gap={2}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderLeft: `5px solid ${colors.primary[900]}`,
                  paddingLeft: 2,
                }}
              >
                <Typography variant="h3">
                  {students &&
                    students
                      .filter((stud) => {
                        return stud?.studID === id;
                      })
                      .map((stud) => {
                        return stud?.middleName
                          ? stud?.firstName +
                              " " +
                              stud?.middleName +
                              " " +
                              stud?.lastName
                          : stud?.firstName + " " + stud?.lastName;
                      })}
                </Typography>
                <Typography> {id}</Typography>
                <Typography>
                  {" "}
                  Grade{[" "]}
                  {levels &&
                    levels
                      .filter((lvl) => {
                        // return console.log(lvl.levelID, val?.levelID);
                        return lvl?.levelID === level;
                      })
                      .map((stud) => {
                        return stud?.levelNum;
                      })}
                  {[" - "]}
                  {sections &&
                    sections
                      .filter((sec) => {
                        // return console.log(lvl.levelID, val?.levelID);
                        return sec?.sectionID === section;
                      })
                      .map((stud) => {
                        return stud?.sectionName;
                      })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Box sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  borderLeft: `5px solid ${colors.secondary[500]}`,
                  paddingLeft: 2,
                }}
              >
                GRADES
              </Typography>
            </Box>
            <Divider />
            <TableContainer
              aria-label="simple table"
              style={{ tableLayout: "fixed" }}
            >
              <TableHead
                sx={{
                  display: "table",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <StudGradeTableTitles key={"asdas"} />
              </TableHead>
              <TableBody
                sx={{
                  display: "block",
                  height: "200px",
                  overflow: "auto",
                }}
              >
                {/* {grades &&
                      grades
                        .filter((grade) => {
                          return grade.studID === id;
                        })
                        .map((val) => {
                          return StudGradeTableDetails({ val });
                        })} */}
                {actives &&
                  subjects &&
                  subjects
                    .filter((fill) => {
                      const act = actives
                        .filter((fill) => {
                          return fill?.studID === id;
                        })
                        .map((val) => {
                          return val?.levelID;
                        });
                      return fill.levelID === act[0];
                    })
                    .map((val) => {
                      return StudGradeTableDetails({ val });
                    })}
              </TableBody>
            </TableContainer>
          </Paper>
        </Box>
        {/* <Box mt="50px">
          <Typography variant="h3">ADD GRADES</Typography>
        </Box> */}
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ paddingBottom: "20px" }}>
            <Typography
              variant="h3"
              sx={{
                borderLeft: `5px solid ${colors.secondary[500]}`,
                paddingLeft: 2,
              }}
            >
              Add Grades
            </Typography>
          </Box>
          <Divider />
          <form
            style={{
              width: "100%",
              marginTop: "10px",
            }}
            onSubmit={handleSubmit}
          >
            {/* <FormControl>
            <Typography>Subject Code</Typography>
            <TextField variant="outlined" disabled value={"Lorem Ipsum"} />
          </FormControl> */}
            <Box
              sx={{
                // width: { xs: "100%", sm: "80% " },
                width: "100%",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr " },
              }}
              gap={2}
            >
              <FormControl fullWidth>
                <Typography>Subject Code</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={getStudSubjectID}
                  // error={}
                  // label="Subject Code"
                  onChange={(e) => {
                    setStudSubjectID(e.target.value);
                  }}
                >
                  <MenuItem aria-label="None" value="" />
                  {subjects &&
                    subjects
                      .filter((subj) => {
                        return subj.levelID === level;
                        // return console.log(
                        //   subj.levelID,
                        //   val?.levelID.toLowerCase()
                        // );
                      })
                      .map((val) => {
                        return (
                          <MenuItem value={val?.subjectID}>
                            {val?.subjectID}
                          </MenuItem>
                        );
                      })}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Typography>Subject Name</Typography>
                <TextField
                  variant="outlined"
                  disabled
                  value={
                    getStudSubjectID &&
                    subjects &&
                    subjects
                      .filter((subj) => {
                        return (
                          subj.subjectID.toLowerCase() ===
                          getStudSubjectID.toLowerCase()
                        );
                        // return console.log(
                        //   subj.subjectID.toLowerCase() ===
                        //     getStudSubjectID.toLowerCase()
                        // );
                      })
                      .map((val2) => {
                        // return console.log(val?.subjectName);
                        return val2.subjectName;
                      })
                  }
                />
              </FormControl>
              <FormControl fullWidth required>
                <Typography>Quarter</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={quarter}
                  onChange={(e) => {
                    setQuarter(e.target.value);
                  }}
                >
                  <MenuItem aria-label="None" value="" />
                  <MenuItem value={1}>Q1</MenuItem>
                  <MenuItem value={2}>Q2</MenuItem>
                  <MenuItem value={3}>Q3</MenuItem>
                  <MenuItem value={4}>Q4</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Typography>Final Grade</Typography>
                <TextField
                  variant="outlined"
                  value={subjectGrade}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      Math.min(100, Number(e.target.value))
                    );
                    // setTaskPoints(e.target.value);
                    // setSubjectGrade(e.target.value);
                    setSubjectGrade(value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: colors.black[400] }}
                        >
                          {subjectGrade} / 100
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <div></div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", sm: "end" },
                }}
                mt="20px"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    width: { xs: "100%", sm: "200px" },
                    height: "50px",
                  }}
                >
                  <Typography variant="h6">Confirm</Typography>
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    width: { xs: "100%", sm: "200px" },
                    height: "50px",
                    ml: { xs: "0", sm: "20px" },
                    mt: { xs: "20px", sm: "0" },
                  }}
                  onClick={(e) => {
                    navigate(-1);
                  }}
                >
                  <Typography variant="h6">CANCEL</Typography>
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default GradesForm;
