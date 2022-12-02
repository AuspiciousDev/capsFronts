import React from "react";
import Popup from "reactjs-popup";
import { useUsersContext } from "../../../../hooks/useUserContext";
import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";

import { useEffect, useState } from "react";
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
  Divider,
  FormControl,
  NativeSelect,
  InputLabel,
  TextField,
  FormLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  ButtonBase,
  AppBar,
  Tabs,
  Tab,
  TablePagination,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  Search,
} from "@mui/icons-material";
import {
  DriveFileRenameOutline,
  DeleteOutline,
  AccountCircle,
  Person2,
  Delete,
  CheckCircle,
  AdminPanelSettings,
  Badge,
  School,
} from "@mui/icons-material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import UserForm from "./UserForm";
import UserEditForm from "./UserEditForm";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

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

const UserTable = () => {
  const CHARACTER_LIMIT = 10;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const { users, userDispatch } = useUsersContext();
  const { employees, empDispatch } = useEmployeesContext();
  const { students, studDispatch } = useStudentsContext();
  //   const [employees, setEmployees] = useState([]);

  const [username, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [cbAdmin, setCbAdmin] = useState(false);
  const [cbTeacher, setCbTeacher] = useState(false);
  const [cbStudent, setCbStudent] = useState(false);

  const [empUser, setEmpUser] = useState([]);
  const [studUser, setStudUser] = useState([]);

  const [isStudent, setIsStudent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [usernameError, setUserNameError] = useState(false);
  const [rolesError, setRolesError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    setUserName("");
    setCbAdmin(false);
    setCbTeacher(false);
    setCbStudent(false);
    setIsStudent(false);
    setIsAdmin(false);
    setIsTeacher(false);
    roles.length = 0;
    setError(false);
    setUserNameError(false);
  };
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: colors.tableRow[100],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const getUsersDetails = async () => {
      setIsLoading(true);
      try {
        setLoadingDialog({ isOpen: true });
        const apiSetEmpLoginHist = await axiosPrivate.get(
          "/api/users/employees"
        );
        if (apiSetEmpLoginHist?.status === 200) {
          const json = await apiSetEmpLoginHist.data;
          setEmpUser(json);
        }
        const apiSetStudUser = await axiosPrivate.get("/api/users/students");
        if (apiSetStudUser?.status === 200) {
          const json = await apiSetStudUser.data;
          console.log("UserStude GET : ", json);
          console.log("UserStude GET : ", json.length);
          setStudUser(json);
        }

        const apiUser = await axiosPrivate.get("/api/users", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiUser?.status === 200) {
          const json = await apiUser.data;
          console.log("Users GET : ", json);
          setIsLoading(false);
          userDispatch({ type: "SET_USERS", payload: json });
        }
        const apiEmp = await axiosPrivate.get("/api/employees", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiEmp?.status === 200) {
          const json = await apiEmp.data;
          setIsLoading(false);
          empDispatch({ type: "SET_EMPLOYEES", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
          console.log("no server response!");
          setIsLoading(false);
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          setIsLoading(false);
        } else if (error.response.status === 401) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
          setIsLoading(false);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
          setIsLoading(false);
        } else {
          setErrorDialog({ isOpen: true, message: `${error}` });
          console.log(error);
          setIsLoading(false);
        }
      }

      // if (response.statusText === "OK") {
      //   await setEmployees(response.data);
      //
      //   if (!response.data || response.data.length === 0) {
      //     setWithData(false);
      //     return;
      //   } else {
      //     setWithData(true);
      //   }
      // } else {
      //   return;
      // }
    };
    getUsersDetails();
  }, [userDispatch, empDispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cbAdmin) {
      roles.push("2001");
    }
    if (cbTeacher) {
      roles.push("2002");
    }
    if (cbStudent) {
      roles.push("2003");
    }
    if (username.length !== 10) {
      return (
        setErrorMessage(`Username must be 10 characters!`),
        setError(true),
        setUserNameError(true)
      );
    }

    const data = {
      username,
      roles,
    };

    if (!error) {
      setIsLoading(true);
      console.log("User Post : ", data);

      try {
        const response = await axiosPrivate.post(
          "/api/users/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          userDispatch({ type: "CREATE_USER", payload: json });
          closeModal();
          setIsLoading(false);
          setSuccessDialog({
            isOpen: true,
            message: "User has been added!",
          });
        }
      } catch (error) {
        roles.length = 0;
        setIsLoading(false);
        if (!error?.response) {
          setIsLoading(false);
          console.log("no server response");
        } else if (error.response.status === 400) {
          setError(true);
          setErrorMessage(error.response.data.message);
          setUserNameError(true);
          setRolesError(true);
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setError(true);
          setErrorMessage(error.response.data.message);
          setUserNameError(true);
          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      console.log(errorMessage);
      setIsLoading(false);
    }
  };

  const TableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>USERNAME</TableCell>
        <TableCell>NAME</TableCell>
        <TableCell align="left">EMAIL</TableCell>
        <TableCell align="left">TYPE</TableCell>
        <TableCell align="left">STATUS</TableCell>
        <TableCell align="left">ACTION</TableCell>
      </TableRow>
    );
  };
  const tableDetails = ({ val }) => {
    return (
      <StyledTableRow
        key={val?._id}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* <TableCell align="left">-</TableCell> */}
        <TableCell align="left">{val?.username || "-"}</TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.middleName
            ? val?.firstName +
              " " +
              val?.middleName.charAt(0) +
              ". " +
              val?.lastName
            : val?.firstName + " " + val?.lastName}
        </TableCell>
        <TableCell align="left">{val?.profile?.email}</TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.roles?.map((item, i) => {
            return (
              <ul style={{ display: "flex", padding: "0", listStyle: "none" }}>
                {item === 2001 ? (
                  <li>
                    <Paper
                      sx={{
                        padding: "2px 10px",
                        backgroundColor: colors.secondary[500],
                        color: colors.blackOnly[100],
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AdminPanelSettings />
                      <Typography ml="5px"> Admin</Typography>
                    </Paper>
                  </li>
                ) : item === 2002 ? (
                  <li>
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
                      <Badge />
                      <Typography ml="5px"> Teacher</Typography>
                    </Paper>
                  </li>
                ) : item === 2003 ? (
                  <li>
                    <Paper
                      sx={{
                        display: "flex",
                        backgroundColor: colors.whiteOnly[100],
                        color: colors.blackOnly[100],
                        padding: "2px 10px",
                        borderRadius: "20px",
                        alignItems: "center",
                      }}
                    >
                      <School />
                      <Typography ml="5px"> Student</Typography>
                    </Paper>
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            );
          })}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          <ButtonBase
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: `Are you sure to change status of  ${val.username}`,
                message: `${
                  val.status === true
                    ? "INACTIVE to ACTIVE"
                    : " ACTIVE to INACTIVE"
                }`,
                onConfirm: () => {
                  // toggleStatus({ val });
                },
              });
            }}
          >
            {val?.status === true ? (
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
            ) : (
              <Paper
                sx={{
                  padding: "2px 10px",
                  borderRadius: "20px",
                }}
              >
                <Delete />
                INACTIVE
              </Paper>
            )}
          </ButtonBase>
        </TableCell>
        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: `Are you sure to delete year ${val.username}`,
                message: `This action is irreversible!`,
                onConfirm: () => {
                  // handleDelete({ val });
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
            <Typography variant="h3">ADD USER</Typography>
          </Box>
          <div className="content">
            <Box
              className="formContainer"
              display="block"
              width="100%"
              flexDirection="column"
              justifyContent="center"
            >
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {/* <Typography variant="h5">Registration</Typography> */}

                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  User Information
                </Typography>
                <Box marginBottom="40px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr",
                      gap: "20px",
                    }}
                  >
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="Username"
                      placeholder="Username"
                      error={usernameError}
                      value={username}
                      onChange={(e) => {
                        setError(false);
                        setUserName(e.target.value);
                        setUserNameError(false);
                      }}
                      inputProps={{ maxLength: CHARACTER_LIMIT }}
                      helperText={`*Input 10 characters only ${username.length} / ${CHARACTER_LIMIT}`}
                    />
                    <FormControl
                      sx={{ display: "none" }}
                      required
                      error={rolesError}
                      onChange={(e) => {
                        setError(false);
                        setUserNameError(false);
                        setRolesError(false);
                      }}
                    >
                      <FormLabel>User Type</FormLabel>
                      <FormGroup
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={"2001"}
                              disabled={isStudent}
                              name="admin"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCbAdmin(e.target.checked);
                                  setIsAdmin(true);
                                } else {
                                  setCbAdmin(e.target.checked);
                                  setIsAdmin(false);
                                }
                              }}
                            />
                          }
                          label="Admin"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={"2002"}
                              disabled={isStudent}
                              name="teacher"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setError(false);
                                  setIsTeacher(true);
                                  setCbTeacher(e.target.checked);
                                } else {
                                  setCbTeacher(e.target.checked);
                                  setIsTeacher(false);
                                }
                              }}
                            />
                          }
                          label="Teacher"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={"2003"}
                              disabled={isAdmin || isTeacher}
                              name="student"
                              onChange={(e) => {
                                setError(false);
                                if (e.target.checked) {
                                  setIsStudent(true);
                                  setCbStudent(e.target.checked);
                                } else {
                                  setCbStudent(e.target.checked);
                                  setIsStudent(false);
                                }
                              }}
                            />
                          }
                          label="Student"
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                  <Box height="10px">
                    <Typography
                      variant="h5"
                      sx={{ mt: "10px" }}
                      color={colors.error[100]}
                    >
                      {error ? errorMessage : ""}
                    </Typography>
                    {isloading ? <Loading /> : <></>}
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="end"
                  height="70px"
                  sx={{ margin: "20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={error}
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography variant="h6">Confirm</Typography>
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                      onClick={closeModal}
                    >
                      <Typography variant="h6">CANCEL</Typography>
                    </Button>
                  </div>
                </Box>
              </form>
            </Box>
          </div>
        </div>
      </Popup>
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
              USERS
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
                placeholder="Search User"
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                }}
                value={search}
              />
              <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <Button
              startIcon={<AddIcon />}
              type="button"
              onClick={() => setOpen((o) => !o)}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Add
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
      <AppBar
        position="static"
        sx={{ backgroundColor: colors.appBar[100], mt: 2 }}
        enableColorOnDark
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
          variant="fullWidth"
        >
          <Tab label="Students" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
          <Tab
            label="Employees"
            {...a11yProps(1)}
            sx={{ fontWeight: "bold" }}
          />
        </Tabs>
      </AppBar>
      <TabPanel sx={{ width: "100%" }} value={value} index={0}>
        <Box width="100%">
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableTitles />
              </TableHead>
              <TableBody>
                {search
                  ? search &&
                    studUser &&
                    studUser
                      .filter((fill) => {
                        return (
                          fill.userType === "student" &&
                          (fill.username.includes(search) ||
                            fill.firstName.includes(search) ||
                            fill.lastName.includes(search))
                        );
                      })
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((val) => {
                        return tableDetails({ val });
                      })
                  : studUser
                      .filter((fill) => {
                        return fill.userType === "student";
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
            count={studUser && studUser.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Box
            display="flex"
            width="100%"
            sx={{ flexDirection: "column" }}
            justifyContent="center"
            alignItems="center"
          >
            {isloading ? <Loading /> : <></>}
          </Box>

          <Box display="flex" width="100%" marginTop="20px"></Box>
        </Box>
      </TabPanel>
      <TabPanel sx={{ width: "100%" }} value={value} index={1}>
        <Box width="100%">
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableTitles />
              </TableHead>
              <TableBody>
                {search
                  ? empUser &&
                    empUser
                      .filter((fill) => {
                        return (
                          fill.userType === "employee" &&
                          (fill.username.includes(search) ||
                            fill.firstName.includes(search) ||
                            fill.lastName.includes(search))
                        );
                      })
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((val) => {
                        return tableDetails({ val });
                      })
                  : empUser &&
                    empUser
                      .filter((fill) => {
                        return fill.userType === "employee";
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
            count={empUser && empUser.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Box
            display="flex"
            width="100%"
            sx={{ flexDirection: "column" }}
            justifyContent="center"
            alignItems="center"
          >
            {isloading ? <Loading /> : <></>}
          </Box>

          <Box display="flex" width="100%" marginTop="20px"></Box>
        </Box>
      </TabPanel>
    </>
  );
};

export default UserTable;
