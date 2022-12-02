import React from "react";
import { useState, useEffect } from "react";
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
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import { School, AdminPanelSettings, Badge } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LoadingDialogue from "../../../../global/LoadingDialogue";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import Loading from "../../../../global/Loading";

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { format } from "date-fns-tz";
import { MoreVert, ModeEditOutline } from "@mui/icons-material";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import NotFound404 from "../../../NotFound404";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";

const StudentProfile = () => {
  const { id } = useParams();

  const [val, setVal] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loginHistory, setLoginHistory] = useState([]);
  // const [currStud, setCurStud] = useState([]);
  // const [currSection, setCurSection] = useState([]);
  // const [loginHistory, setLoginHistory] = useState([]);
  // const [loginHistory, setLoginHistory] = useState([]);
  const { students, studDispatch } = useStudentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { levels, levelDispatch } = useLevelsContext();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  const tableDetails = ({ val }) => {
    return (
      <StyledTableRow key={val._id} data-rowid={val.departmentID}>
        <TableCell align="left">
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/admin/student/grade/${val?.studID}/${val?.schoolYearID}`}
              style={{
                alignItems: "center",
                color: colors.black[100],
                textDecoration: "none",
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
                <Typography fontWeight="bold"> {val?.schoolYearID}</Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>
        {/* <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {val?.studID}
        </TableCell> */}

        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {format(new Date(val?.createdAt), "MMMM dd, yyyy")}
        </TableCell>

        {/* <TableCell
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
        </TableCell> */}
        <TableCell align="left">
          {levels &&
            levels
              .filter((lev) => {
                return lev.levelID === val.levelID.toLowerCase();
              })
              .map((val) => {
                return val.levelNum;
              })}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {sections &&
            sections
              .filter((lev) => {
                return lev.sectionID === val.sectionID.toLowerCase();
              })
              .map((sec) => {
                return sec.sectionName;
              })}
        </TableCell>
        <TableCell align="left">
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/admin/student/record/tasks/${val?.studID}/${val?.schoolYearID}`}
              style={{
                alignItems: "center",
                color: colors.black[100],
                textDecoration: "none",
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
                <Typography>Tasks</Typography>
              </Paper>
            </Link>
            <Link
              to={`/admin/student/record/grade/${val?.studID}/${val?.schoolYearID}`}
              style={{
                alignItems: "center",
                color: colors.black[100],
                textDecoration: "none",
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
                <Typography> Grades</Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>
      </StyledTableRow>
    );
  };

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/students/search/${id}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log("Student GET : ", json);
          setIsLoading(false);
          setLoadingDialog({ isOpen: false });
          setVal(json);
        }
        const apiLoginHistory = await axiosPrivate.get("/api/loginhistories");
        if (apiLoginHistory?.status === 200) {
          const json = await apiLoginHistory.data;
          setLoginHistory(json);
        }
        const apiActive = await axiosPrivate.get("/api/enrolled");
        if (apiActive.status === 200) {
          const json = await apiActive.data;
          console.log(json);
          activeDispatch({ type: "SET_ACTIVES", payload: json });
        }
      } catch (error) {
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate(-1);
          console.log(error.response.data.message);
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
          setIsLoading(false);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
      }
    };
    getUsersDetails();
  }, []);

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
      {isloading ? (
        <></>
      ) : val.firstName || val.email ? (
        <Box
          className="deleteScroll"
          gap={1.5}
          display="grid"
          sx={{
            height: { xs: "780px", sm: "780px" },
            width: { xs: "100%", sm: "100%" },
            gridTemplateColumns: { xs: "1fr", sm: "1fr 3fr" },
            padding: { xs: "0 20px 20px 20px", sm: "3px 3px" },
          }}
        >
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              padding="20px"
              gap={2}
            >
              <Paper
                sx={{
                  borderRadius: "65px",
                  width: "130px",
                  height: "130px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="profile-user"
                  sx={{ width: "100%", height: "100%" }}
                  src={val?.imgURL}
                  style={{
                    cursor: "pointer",
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />
              </Paper>
              <Typography
                variant="h2"
                fontWeight="bold"
                textTransform="capitalize"
                sx={{ mt: "20px" }}
                textAlign="center"
              >
                {val?.middleName
                  ? val?.firstName +
                    " " +
                    val?.middleName.charAt(0) +
                    ". " +
                    val?.lastName
                  : val?.firstName + " " + val?.lastName}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={1}
              >
                <Typography
                  variant="h4"
                  textTransform="capitalize"
                  fontWeight="bold"
                >
                  {val?.studID}
                </Typography>
                <Typography variant="h4" color="primary">
                  {val?.email}
                </Typography>
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    alignItems: "center",
                  }}
                >
                  <School />
                  <Typography sx={{ ml: "10px" }}>Student</Typography>
                </Paper>
                <Typography sx={{ fontSize: "12px" }}>
                  Date created : {[" "]}
                  {format(new Date(val?.createdAt), "MMMM dd, yyyy")}
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ position: "relative" }} elevation={2}>
            <Box sx={{ position: "absolute", top: 5, right: 5 }}>
              <IconButton onClick={handleClick}>
                <MoreVert sx={{ fontSize: "20pt" }} />
                {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <Link
                    to={`/admin/student/edit/${val?.studID}`}
                    style={{
                      alignItems: "center",
                      color: colors.black[100],
                      textDecoration: "none",
                    }}
                  >
                    Edit Profile
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
            <Box padding="20px" display="grid" gridTemplateRows="1fr">
              <Box
                sx={{ display: "flex", flexDirection: "column" }}
                padding="10px 10px 0 10px"
              >
                <Typography variant="h4">Student Profile</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Gender : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.gender}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Date of Birth : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.dateOfBirth
                        ? format(new Date(val?.dateOfBirth), "MMMM dd, yyyy")
                        : ""}
                    </Typography>
                  </Box>

                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Civil Status : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.civilStatus}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Nationality : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.nationality}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Religion : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.religion}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 0 10px">
                <Typography variant="h4"> Address Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Address : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.address}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>City : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.city}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Province : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.province}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 0 10px">
                <Typography variant="h4">Contact Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Email : </Typography>
                    <Typography ml="10px" fontWeight="bold">
                      {val?.email}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Telephone : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.telephone}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Mobile Number : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.mobile}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 10px 10px">
                <Typography variant="h4">Emergency Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Name : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyName}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Relationship :</Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyRelationship}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Number :</Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyNumber}{" "}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ display: { xs: "none", sm: "block" }, p: 2 }}>
            <Typography variant="h4">Login History</Typography>
            <Grid
              mt="10px"
              container
              gap={2}
              sx={{ width: "350px" }}
              direction="column"
              alignItems="center"
              justify="center"
            >
              {loginHistory &&
                loginHistory
                  .slice(0, 5)
                  .filter((fill) => {
                    return fill.username === id;
                  })
                  .map((val, key) => (
                    <Paper
                      elevation={1}
                      sx={{
                        display: "flex",
                        padding: "10px 15px",
                        borderRadius: "20px",
                        backgroundColor: colors.whiteOnly[100],
                        width: "100%",
                      }}
                    >
                      <Typography textTransform="capitalize">
                        {format(
                          new Date(val.createdAt),
                          // "kk:mm a  MMM dd, yyyy"
                          " hh:mm a.  EE, MM-dd-yyyy"
                        )}
                        {/* {val.createdAt} */}
                      </Typography>
                    </Paper>
                  ))}
            </Grid>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Enrollment History</Typography>
            <TableContainer>
              <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                <TableHead>
                  <StyledTableHeadRow>
                    <TableCell>Year</TableCell>
                    {/* <TableCell>Student ID</TableCell> */}
                    {/* <TableCell align="left">Name</TableCell> */}
                    <TableCell align="left">Date Enrolled</TableCell>
                    <TableCell align="left">Level</TableCell>
                    <TableCell align="left">Section</TableCell>
                    <TableCell align="left">Records</TableCell>
                  </StyledTableHeadRow>
                </TableHead>
                <TableBody>
                  {actives &&
                    actives
                      .filter((fill) => {
                        return fill.studID === id;
                      })
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
          <Paper sx={{ display: { xs: "block", sm: "none" } }}>
            <Box padding="20px">
              <Typography>Login History</Typography>

              <Grid
                mt="10px"
                container
                gap={2}
                sx={{ width: "350px" }}
                direction="column"
                alignItems="center"
                justify="center"
              >
                {loginHistory &&
                  loginHistory
                    .slice(0, 5)
                    .filter((fill) => {
                      return fill.username === id;
                    })
                    .map((val, key) => (
                      <Paper
                        elevation={1}
                        sx={{
                          display: "flex",
                          padding: "10px 15px",
                          borderRadius: "20px",
                          backgroundColor: colors.whiteOnly[100],
                          width: "100%",
                        }}
                      >
                        <Typography textTransform="capitalize">
                          {format(
                            new Date(val.createdAt),
                            // "kk:mm a  MMM dd, yyyy"
                            " hh:mm a.  EE, MM-dd-yyyy"
                          )}
                          {/* {val.createdAt} */}
                        </Typography>
                      </Paper>
                    ))}
              </Grid>
            </Box>
          </Paper>
        </Box>
      ) : (
        <NotFound404 />
      )}
    </Box>
  );
};

export default StudentProfile;
