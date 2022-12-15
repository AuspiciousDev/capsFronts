import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
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
  IconButton,
  InputBase,
  Button,
} from "@mui/material";
import { DownloadForOfflineOutlined, Search, Add } from "@mui/icons-material";
import { useStudentsContext } from "../../../hooks/useStudentsContext";
import { useGradesContext } from "../../../hooks/useGradesContext";
import { useSubjectsContext } from "../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useActiveStudentsContext } from "../../../hooks/useActiveStudentContext";
import { useSchoolYearsContext } from "../../../hooks/useSchoolYearsContext";
import { axiosPrivate } from "../../../api/axios";
import { tokens } from "../../../theme";
import { useTheme, styled } from "@mui/material";
import { format } from "date-fns-tz";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

const StudentRecords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

  const { level, year, id } = useParams();
  const [search, setSearch] = useState("");
  const [getGrades, setGrades] = useState([]);
  const [getSubjects, setSubjects] = useState([]);
  const [isloading, setIsLoading] = useState(false);

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
      setLoadingDialog({ isOpen: true });
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
          setLoadingDialog({ isOpen: false });
        }
        const apiGradesbyLevel = await axiosPrivate.get(
          `/api/grades/search/${id}/${year}`
        );
        if (apiGradesbyLevel.status === 200) {
          const json = await apiGradesbyLevel.data;
          console.log("Grades: ", json);
          setGrades(json);
          setIsLoading(false);
          setLoadingDialog({ isOpen: false });
        }
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
    let grade1, grade2, grade3, grade4;
    return (
      <StyledTableRow key={val._id} data-rowid={val.studID}>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "uppercase" }}
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
        </TableCell>
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
      </StyledTableRow>
    );
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
          padding: { xs: "10px", sm: "10px 10px" },
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
                placeholder="Search Subject"
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
                {search
                  ? search &&
                    getSubjects &&
                    getSubjects
                      .filter((fill) => {
                        return (
                          fill.subjectID.includes(search) ||
                          fill.subjectName.toLowerCase().includes(search)
                        );
                      })
                      .map((val) => {
                        return tableDetails(val);
                      })
                  : getSubjects &&
                    getSubjects.map((val) => {
                      return tableDetails(val);
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          {/* <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={5}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        </Paper>
        <Box display="flex" width="100%" marginTop="20px"></Box>
      </Box>
    </Box>
  );
};

export default StudentRecords;
