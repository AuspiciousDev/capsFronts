import React from "react";
import Popup from "reactjs-popup";
import axios from "axios";
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
  ButtonBase,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
  InputAdornment,
} from "@mui/material";
import { AutoStories, DeleteOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import SubjectForm from "./SubjectForm";
import SubjectEditForm from "./SubjectEditForm";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Delete,
  CheckCircle,
  Cancel,
  DriveFileRenameOutline,
} from "@mui/icons-material";

import ErrorDialogue from "../../../../global/Teacher/ErrorDialogue";
import ConfirmDialogue from "../../../../global/Teacher/ConfirmDialogue";
import ValidateDialogue from "../../../../global/Teacher/ValidateDialogue";
import SuccessDialogue from "../../../../global/Teacher/SuccessDialogue";
import LoadingDialogue from "../../../../global/Teacher/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
const SubjectTable = () => {
  const CHARACTER_LIMIT = 6;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const [userData, setUserData] = useState([]);
  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [subjectID, setSubjectID] = useState("");
  const [levelID, setLevelID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");

  const [level, setLevel] = useState("");
  const [departmentID, setDepartmentID] = useState("");

  const [subjectIDError, setSubjectIDError] = useState(false);
  const [levelIDError, setLevelIDError] = useState(false);
  const [departmentIDError, setDepartmentIDError] = useState(false);
  const [subjectNameError, setSubjectNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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
    const getData = async () => {
      try {
        setIsLoading(true);
        const apiTeacher = await axiosPrivate.get(
          `/api/employees/search/${auth.username}`
        );
        if (apiTeacher.status === 200) {
          const json = await apiTeacher.data;
          console.log("Teacher Data:", json);
          setUserData(json);
        }
        const response = await axiosPrivate.get("/api/subjects", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const getLevels = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getLevels?.status === 200) {
          const json = await getLevels.data;
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const getDepartment = await axiosPrivate.get("/api/departments", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getDepartment?.status === 200) {
          const json = await getDepartment.data;
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
      } catch (error) {}
    };
    getData();
  }, [subDispatch, levelDispatch, depDispatch]);

  const columns = [
    {
      field: "subjectID",
      headerName: "Subject ID",
      width: 150,
      valueFormatter: (params) => params?.value.toUpperCase(),
    },
    { field: "subjectName", headerName: "Subject Name", width: 200 },
    { field: "levelNum", headerName: "Subject Level", width: 200 },

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
              SUBJECTS
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
              subjects
                ? userData &&
                  subjects &&
                  subjects.filter((fill) => {
                    return userData?.SubjectLoads?.some(
                      (e) => e === fill?.subjectID
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
  );
};

export default SubjectTable;
