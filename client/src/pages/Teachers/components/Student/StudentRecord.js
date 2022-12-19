import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";

import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import { axiosPrivate } from "../../../../api/axios";
import { tokens } from "../../../../theme";
import { useTheme, styled } from "@mui/material";
const StudentRecord = () => {
  const { id, year } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { students, studDispatch } = useStudentsContext();
  const { grades, gradeDispatch } = useGradesContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { years, yearDispatch } = useSchoolYearsContext();

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
      <TableRow sx={{ height: "30px" }}>
        <TableCell align="left">SUBJECT ID</TableCell>
        <TableCell align="left">SUBJECT NAME</TableCell>
        <TableCell align="left">1st </TableCell>
        <TableCell align="left">2nd </TableCell>
        <TableCell align="left">3rd </TableCell>
        <TableCell align="left">4th </TableCell>
        <TableCell align="left">FINAL </TableCell>
        <TableCell align="left">REMARKS</TableCell>
      </TableRow>
    );
  };
  const TableDetails = ({ val }) => {
    let grade1, grade2, grade3, grade4;
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
          grades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 1
            );
          }).length > 0
            ? grades &&
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
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 2
            );
          }).length > 0
            ? grades &&
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
            : "-"}
        </TableCell>
        <TableCell align="left">
          {grades &&
          grades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 3
            );
          }).length > 0
            ? grades &&
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
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
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
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {!grade1 || !grade2 || !grade3 || !grade4 ? (
            "-"
          ) : (grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
            <Typography fontWeight="bold" variant="h6" color="green">
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
      </StyledTableRow1>
    );
  };

  return (
    <Box className="contents-container">
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "20px 0 0 0",
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
        </Box>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "10px 0 5px 0",
          padding: { xs: "10px", sm: "0 10px" },
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
                display: "grid",
                gridTemplateColumns: "1.75fr 1fr 1fr",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "block", textAlign: "end" }}>
                  <Typography variant="h5">Student No :</Typography>
                  <Typography variant="h5">Name :</Typography>
                  <Typography variant="h5">Gender :</Typography>
                </Box>
                <Box
                  sx={{
                    display: "block",
                    textAlign: "start",
                    ml: "5px",
                  }}
                  gap={2}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {id}
                  </Typography>
                  <Typography
                    variant="h5"
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
                    variant="h5"
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
                          return val.departmentID === res[0];
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
                  <Typography sx={{ fontWeight: "bold" }}>{year}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        <TableContainer
          sx={{
            maxHeight: "500px",
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
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentRecord;
