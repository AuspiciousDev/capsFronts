import React from "react";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";

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
} from "@mui/material";
import {
  Search,
  DownloadForOfflineOutlined,
  TopicOutlined,
} from "@mui/icons-material";
import { useTheme, styled } from "@mui/material";
import { tokens } from "../../../../theme";
const GradesCurrent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

  const { level, year, id } = useParams();
  const [search, setSearch] = useState("");
  const [getGrades, setGrades] = useState([]);
  const [getSubjects, setSubjects] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  console.log(level, year, id);
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const apiSubjectByLevel = await axiosPrivate.get(
          `/api/subjects/search/level/${level}`
        );
        if (apiSubjectByLevel?.status === 200) {
          const json = await apiSubjectByLevel.data;
          console.log(json);
          setSubjects(json);
          setIsLoading(false);
        }
        const apiGradesbyLevel = await axiosPrivate.get(
          `/api/grades/search/${id}/${year}`
        );
        if (apiGradesbyLevel?.status === 200) {
          const json = await apiGradesbyLevel.data;
          console.log(json);
          setGrades(json);
          setIsLoading(false);
        } else {
          console.log(apiGradesbyLevel);
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
  }, []);

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
      border: 1,
    },
  }));

  const TableTitles = () => {
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
  const tableDetails = (val) => {
    let grade1 = 0;
    let grade2 = 0;
    let grade3 = 0;
    let grade4 = 0;
    return (
      <StyledTableRow key={val._id} data-rowid={val.studID}>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val.subjectID}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val.subjectName}
        </TableCell>
        <TableCell align="left">
          {/* {getGrades &&
          getGrades
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
            : "0"} */}
          {getGrades &&
          getGrades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 2
            );
          }).length > 0
            ? getGrades &&
              getGrades
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
        </TableCell>{" "}
        <TableCell align="left">
          {getGrades &&
          getGrades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 2
            );
          }).length > 0
            ? getGrades &&
              getGrades
                .filter((fill) => {
                  return (
                    fill.studID === id &&
                    fill.subjectID === val.subjectID &&
                    fill.quarter === 2
                  );
                })
                .map((val) => {
                  return val?.grade, (grade1 = val?.grade);
                })
            : "-"}
        </TableCell>{" "}
        <TableCell align="left">
          {getGrades &&
          getGrades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 3
            );
          }).length > 0
            ? getGrades &&
              getGrades
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
          {getGrades &&
          getGrades.filter((fill) => {
            return (
              fill.studID === id &&
              fill.subjectID === val.subjectID &&
              fill.quarter === 4
            );
          }).length > 0
            ? getGrades &&
              getGrades
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
          {grade1 && grade2 && grade3 && grade4 ? (
            (grade1 + grade2 + grade3 + grade4) / 4 >= 75 ? (
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
            )
          ) : (
            <Typography
              variant="h6"
              color={colors.error[100]}
              fontWeight="bold"
            >
              INC
            </Typography>
          )}
        </TableCell>
      </StyledTableRow>
    );
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
                placeholder="Search Student"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </Paper>
      <Box width="100%">
        <Paper elevation={2} sx={{ mt: 2 }}>
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
                {getSubjects &&
                  getSubjects.map((val) => {
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
        <Box display="flex" width="100%" marginTop="20px"></Box>
      </Box>
    </Box>
  );
};

export default GradesCurrent;
