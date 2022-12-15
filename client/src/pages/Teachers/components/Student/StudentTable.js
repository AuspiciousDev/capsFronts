import React from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  TableContainer,
  TablePagination,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Divider,
  ButtonBase,
  Avatar,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  Search,
} from "@mui/icons-material";
import {
  DriveFileRenameOutline,
  AccountCircle,
  DeleteOutline,
  Person2,
  Delete,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import StudentForm from "./StudentForm";
import StudentEditForm from "./StudentEditForm";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";

import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import useAuth from "../../../../hooks/useAuth";
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
const StudentTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const [userData, setUserData] = useState([]);
  const { students, studDispatch } = useStudentsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();

  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [page, setPage] = React.useState(15);
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

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        setIsLoading(true);
        const apiTeacher = await axiosPrivate.get(
          `/api/employees/search/${auth.username}`
        );
        if (apiTeacher.status === 200) {
          const json = await apiTeacher.data;
          console.log("Teacher Data:", json);
          setUserData(json);
        }
        const apiActive = await axiosPrivate.get("/api/enrolled");

        if (apiActive.status === 200) {
          const json = await apiActive.data;
          console.log(json);
          activeDispatch({ type: "SET_ACTIVES", payload: json });
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
  }, [studDispatch]);

  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete("/api/students/delete", {
        data: val,
      });
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        studDispatch({ type: "DELETE_STUDENT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: "Student has been Deleted!",
        });
      }
      setIsLoading(false);
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
        setErrorDialog({
          isOpen: true,
          message: "no server response",
        });
        setIsLoading(false);
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setIsLoading(false);
      } else if (error.response.status === 404) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setIsLoading(false);
      } else {
        console.log(error);
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
      }
      setIsLoading(false);
    }
  };
  const toggleStatus = async ({ val }) => {
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
        "/api/students/status",
        JSON.stringify({ studID: val.studID, status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/students");
        if (response2?.status === 200) {
          const json = await response2.data;
          setIsLoading(false);
          studDispatch({ type: "SET_STUDENTS", payload: json });
          setSuccessDialog({ isOpen: true });
        }
      }
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          title: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        console.log(error);
      }
      setIsLoading(false);
    }
  };
  const handleAdd = () => {
    setIsFormOpen(true);
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
            <Avatar
              alt="profile-user"
              sx={{ width: "40px", height: "40px" }}
              src={params?.value}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "studID",
      headerName: "Student ID",
      width: 150,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/teacher/student/${params?.value}`}
              style={{
                alignItems: "center",
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
                <Typography
                  fontWeight="bold"
                  sx={{ color: colors.blackOnly[100] }}
                >
                  {" "}
                  {params?.value}
                </Typography>
              </Paper>
            </Link>
          </Box>
        );
      },
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
          </>
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
      {isFormOpen ? (
        <StudentForm />
      ) : (
        <>
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
                  STUDENTS
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
                    display: "none",
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
                  onClick={handleAdd}
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
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              mt: 2,
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={
                  actives
                    ? userData &&
                      actives &&
                      actives.filter((fill) => {
                        return userData?.LevelLoads?.some(
                          (e) => e === fill?.levelID
                        );
                      })
                    : 0
                }
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
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
              />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default StudentTable;
