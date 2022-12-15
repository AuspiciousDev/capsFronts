import React from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

import { Search } from "@mui/icons-material";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  NativeSelect,
  TextField,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AutoStories,
  DeleteOutline,
  CheckCircle,
  Cancel,
  Delete,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";

import Loading from "../../../../global/Loading";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import ErrorDialogue from "../../../../global/Teacher/ErrorDialogue";
import ConfirmDialogue from "../../../../global/Teacher/ConfirmDialogue";
import ValidateDialogue from "../../../../global/Teacher/ValidateDialogue";
import SuccessDialogue from "../../../../global/Teacher/SuccessDialogue";
import LoadingDialogue from "../../../../global/Teacher/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

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

const LevelTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth, persist, setPersist } = useAuth();
  const [userData, setUserData] = useState([]);

  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [levelID, setLevelID] = useState("");
  const [levelNum, setlevelNum] = useState("");
  const [departmentID, setDepartmentID] = useState("");

  const [levelIDError, setLevelIDError] = useState(false);
  const [levelNumError, setLevelNumError] = useState(false);
  const [departmentIDError, setDepartmentIDError] = useState(false);

  const [getLevels, setLevels] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    clearInputForms();
  };
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

  const clearInputForms = () => {
    setLevelID("");
    setlevelNum("");
    setDepartmentID("");
    setError(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const apiTeacher = await axiosPrivate.get(
          `/api/employees/search/${auth.username}`
        );
        if (apiTeacher.status === 200) {
          const json = await apiTeacher.data;
          console.log("Teacher Data:", json);
          setUserData(json);
        }
        const response = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const apiDep = await axiosPrivate.get("/api/departments", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (apiDep?.status === 200) {
          const json = await apiDep.data;
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }

        const apiEmployee = await axiosPrivate.get(
          `/api/employees/search/${auth.username}`
        );
        if (apiEmployee?.status === 200) {
          const json = await apiEmployee.data;
          setIsLoading(false);

          console.log("woy", json.LevelLoads);
          setLevels(json.LevelLoads);
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
    getData();
  }, [levelDispatch, depDispatch]);

  const columns = [
    {
      field: "levelID",
      headerName: "Level ID",
      width: 150,
      valueFormatter: (params) => params?.value.toUpperCase(),
    },

    { field: "levelNum", headerName: "Level", width: 200 },
    { field: "depName", headerName: "Deparment", width: 200 },
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
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
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
                LEVELS
              </Typography>
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
                levels
                  ? userData &&
                    levels &&
                    levels.filter((fill) => {
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
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    email: true,
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
    </>
  );
};

export default LevelTable;
