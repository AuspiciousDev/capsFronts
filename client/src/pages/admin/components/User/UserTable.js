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
  Avatar,
} from "@mui/material";
import {
  Search,
  Delete,
  CheckCircle,
  AdminPanelSettings,
  Badge,
  School,
  Cancel,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
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

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

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

  const [page, setPage] = React.useState(15);
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
        setIsLoading(false);
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
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
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
    } else {
      console.log(errorMessage);
      setIsLoading(false);
    }
  };
  const toggleStatus = async ({ val }) => {
    console.log("🚀 ~ file: UserTable.js:374 ~ toggleStatus ~ val", val);

    setLoadingDialog({ isOpen: true });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);
    if (val.status === true) newStatus = false;

    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/users/status",
        JSON.stringify({ username: val.username, status: newStatus })
      );
      if (response.status === 200) {
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
        setSuccessDialog({
          isOpen: true,
          message: `User ${val?.username} status has been changed!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
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
  const handleDelete = async ({ val }) => {
    setLoadingDialog({ isOpen: true });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete("/api/users/delete", {
        data: val,
      });
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        userDispatch({ type: "DELETE_USER", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `User ${json.username} has been Deleted!`,
        });
      }
      setIsLoading(false);
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
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
            {console.log("{", params?.row.gender)}
            <Avatar
              alt="profile-user"
              sx={{ width: "40px", height: "40px" }}
              src={params?.row?.profile?.imgURL}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
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

    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography
            sx={{ textTransform: "lowercase", fontSize: "0.8125rem" }}
          >
            {params?.value}
          </Typography>
        );
      },
    },
    {
      field: "roles",
      headerName: "Type",
      width: 150,
      renderCell: (params) => {
        return params?.value?.map((item, i) => {
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
        });
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 240,
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 175,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ButtonBase
              onClick={() => {
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to change status of  ${params?.row?.username}`,
                      message: `${
                        params?.value === true
                          ? "INACTIVE to ACTIVE"
                          : " ACTIVE to INACTIVE"
                      }`,
                      onConfirm: () => {
                        toggleStatus({ val: params?.row });
                      },
                    });
                  },
                });
              }}
            >
              {params?.value === true ? (
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
                  <Typography>ACTIVE</Typography>
                </Paper>
              ) : (
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "2px 10px",
                    borderRadius: "20px",
                  }}
                >
                  <Cancel />
                  <Typography ml="5px">INACTIVE</Typography>
                </Paper>
              )}
            </ButtonBase>
          </>
        );
      },
    },
    {
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      renderCell: (params) => {
        return (
          <ButtonBase
            onClick={(event) => {
              handleCellClick(event, params);
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
          // <Button
          //   fullWidth
          //   variant="contained"
          //   type="button"
          //   onClick={(event) => {
          //     handleCellClick(event, params);
          //   }}
          // >
          //   Delete
          // </Button>
        );
      },
    },
  ];
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete user ${params?.row?.username}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params?.row });
          },
        });
      },
    });
    // alert(`Delete : ${params.row.username}`);
    // alert(`Delete : ${params.value}`);
  };

  const empColumns = [
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
              src={params?.row.profile?.imgURL}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
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
      renderCell: (params) => {
        return (
          <Typography
            sx={{ fontSize: "0.8125rem", textTransform: "capitalize" }}
          >
            {params.value}
          </Typography>
        );
      },
    },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography
            sx={{ textTransform: "lowercase", fontSize: "0.8125rem" }}
          >
            {params?.value}
          </Typography>
        );
      },
    },
    {
      field: "roles",
      headerName: "Type",
      width: 150,
      renderCell: (params) => {
        return params?.value?.map((item, i) => {
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
        });
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 240,
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 175,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ButtonBase
              onClick={() => {
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to change status of  ${params?.row?.username}`,
                      message: `${
                        params?.value === true
                          ? "INACTIVE to ACTIVE"
                          : " ACTIVE to INACTIVE"
                      }`,
                      onConfirm: () => {
                        toggleStatus({ val: params?.row });
                      },
                    });
                  },
                });
              }}
            >
              {params?.value === true ? (
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
                  <Typography>ACTIVE</Typography>
                </Paper>
              ) : (
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "2px 10px",
                    borderRadius: "20px",
                  }}
                >
                  <Cancel />
                  <Typography ml="5px">INACTIVE</Typography>
                </Paper>
              )}
            </ButtonBase>
          </>
        );
      },
    },
    {
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      renderCell: (params) => {
        return (
          <ButtonBase
            onClick={(event) => {
              handleCellClick(event, params);
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
          // <Button
          //   fullWidth
          //   variant="contained"
          //   type="button"
          //   onClick={(event) => {
          //     handleCellClick(event, params);
          //   }}
          // >
          //   Delete
          // </Button>
        );
      },
    },
  ];

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
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              USERS
            </Typography>
          </Box>
          <Box
            sx={{
              display: "none",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                display: "none",
                width: { xs: "100%", sm: "320px" },
                height: "50px",
                minWidth: "250px",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: "0 20px", sm: "0 20px" },
                mr: { xs: "0", sm: "0" },
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
              disabled
              startIcon={<AddIcon />}
              type="button"
              onClick={() => setOpen((o) => !o)}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
                transition: "transform 0.15s ease-in-out",
                "&.MuiButtonBase-root:hover": {
                  "&.MuiButtonBase-root  .MuiButton-startIcon": {
                    animation: "rotation 5s linear infinite",
                    "@keyframes rotation": {
                      "0%": {
                        transform: "rotate(0deg)",
                      },
                      "100%": {
                        transform: "rotate(360deg)",
                      },
                    },
                  },

                  color: colors.primary[900],
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Add User
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <TabPanel
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",

            mt: 2,
            backgroundColor: "green",
          }}
          value={value}
          index={0}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "700px",
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              {studUser && studUser && (
                <DataGrid
                  rows={studUser && studUser}
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
                        email: false,
                        gender: false,
                      },
                    },
                  }}
                  components={{
                    Toolbar: CustomToolbar,
                  }}
                />
              )}
            </Box>
          </Paper>
        </TabPanel>
        <TabPanel sx={{ width: "100%" }} value={value} index={1}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "700px",
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              {empUser && (
                <DataGrid
                  rows={empUser && empUser}
                  getRowId={(row) => row._id}
                  columns={empColumns}
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
                        email: false,
                        gender: false,
                      },
                    },
                  }}
                  components={{
                    Toolbar: CustomToolbar,
                  }}
                />
              )}
            </Box>
          </Paper>
        </TabPanel>
      </Box>
    </>
  );
};

export default UserTable;
