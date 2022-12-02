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
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
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
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          // console.log("Missing Username/Password");
          console.log(error.response.data.message);
          // setErrMsg(error.response.data.message);
        } else {
          console.log(error);
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
  const handleDelete = async ({ user }) => {
    setIsLoading(true);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      const response = await axiosPrivate.delete("/api/users/delete", {
        headers: { "Content-Type": "application/json" },
        data: user,
        withCredentials: true,
      });
      const json = await response.data;
      if (response.ok) {
        console.log(response.data.message);
        userDispatch({ type: "DELETE_USER", payload: json });
      }

      const apiUsers = await axiosPrivate.get("/api/users", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const apiEmp = await axiosPrivate.get("/api/employees", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (apiUsers?.status === 200) {
        const userJSON = await apiUsers.data;
        console.log(userJSON);
        setIsLoading(false);
        userDispatch({ type: "SET_USERS", payload: userJSON });
      }
      if (apiEmp?.status === 200) {
        const userEMP = await apiEmp.data;
        console.log(userEMP);
        setIsLoading(false);
        empDispatch({ type: "SET_EMPLOYEES", payload: userEMP });
      }
      setSuccessDialog({
        isOpen: true,
        message: "User has been deleted!",
      });
      setIsLoading(false);
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
        setIsLoading(false);
      } else if (error.response.status === 204) {
        console.log(error.response.data.message);
        setIsLoading(false);
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setIsLoading(false);
      } else if (error.response.status === 404) {
        console.log(error.response.data.message);
        setIsLoading(false);
      } else {
        console.log(error);
        setIsLoading(false);
      }
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
  const tableDetails = ({ user, result }) => {
    return (
      <StyledTableRow
        key={user._id}
        data-rowid={user.username}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* <TableCell align="left">-</TableCell> */}
        <TableCell key={result?.username} align="left">
          {user?.username || "-"}
        </TableCell>
        <TableCell
          key={result?.firstName}
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {result?.middleName
            ? result?.firstName +
              " " +
              result?.middleName.charAt(0) +
              ". " +
              result?.lastName
            : result?.firstName + " " + result?.lastName}
        </TableCell>
        <TableCell key={result?.username} align="left">
          {result?.email || "-"}
        </TableCell>
        <TableCell
          key={result?.username}
          align="left"
          sx={{ textTransform: "capitalize" }}
        >
          {user.roles.map((item, i) => {
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
                title: `Are you sure to change status of  ${user.sectionID.toUpperCase()}`,
                message: `${
                  user.status === true
                    ? "INACTIVE to ACTIVE"
                    : " ACTIVE to INACTIVE"
                }`,
                onConfirm: () => {
                  // toggleStatus({ val });
                },
              });
            }}
          >
            {user?.status === true ? (
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
                title: `Are you sure to delete year ${user.username}`,
                message: `This action is irreversible!`,
                onConfirm: () => {
                  handleDelete({ user });
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
          {/* <Box
            sx={{
              display: "grid",
              width: "50%",
              gridTemplateColumns: " 1fr 1fr 1fr",
            }}
          >
            <IconButton sx={{ cursor: "pointer" }}>
              <Person2OutlinedIcon />
            </IconButton>
            {/* <UserEditForm user={user} /> */}
          {/* <IconButton
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: `Are you sure to delete year ${user.username}`,
                  message: `This action is irreversible!`,
                  onConfirm: () => {
                    handleDelete({ user });
                  },
                });
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ color: colors.error[100] }} /> */}
          {/* </IconButton> */}
          {/* </Box> */}
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
      <Box width="100%">
        <TableContainer
          sx={{
            height: "700px",
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableTitles />
            </TableHead>
            <TableBody>
              {employees &&
                users &&
                users.map((user) => {
                  const result = employees.find(
                    (uuid) => uuid.empID === user.username
                  );
                  return tableDetails({ user, result });
                })}
            </TableBody>
          </Table>
        </TableContainer>

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
    </>
  );
};

export default UserTable;
