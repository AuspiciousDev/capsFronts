import React from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import { alpha, styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  gridClasses,
} from "@mui/x-data-grid";

import Loading from "../../../../global/Loading";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  Avatar,
} from "@mui/material";
import { Search, Delete, Cancel, CheckCircle } from "@mui/icons-material";
import { format } from "date-fns-tz";
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar
        printOptions={{
          fields: ["imgURL", "username", "fullName", "userType", "createdAt"],
        }}
        csvOptions={{
          fields: ["username", "fullName", "userType", "createdAt"],
        }}
      />
      {/* <GridToolbarExport */}

      {/* /> */}
    </GridToolbarContainer>
  );
}

const LoginHistoryTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState();

  const [getEmpData, setEmpData] = useState([]);
  const [getStudData, setStudData] = useState([]);
  const [getAllData, setAllData] = useState([]);
  const [page, setPage] = React.useState(15);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  useEffect(() => {
    const getData = async () => {
      let stud, emp;
      try {
        setLoadingDialog({ isOpen: true });
        setIsLoading(true);
        const response = await axiosPrivate.get(
          "/api/loginhistories/employees"
        );
        if (response.status === 200) {
          emp = await response.data;
          console.log(emp);
          setIsLoading(false);
          setEmpData(emp);
          setLoadingDialog({ isOpen: false });
        }
        const response1 = await axiosPrivate.get(
          "/api/loginhistories/students"
        );
        if (response1.status === 200) {
          stud = await response1.data;
          console.log(stud);
          setIsLoading(false);
          setStudData(stud);
          setLoadingDialog({ isOpen: false });
        }
        setAllData([...stud, ...emp]);
        console.log(getAllData);
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            title: `No server response.`,
          });
          console.log("no server response");
        } else if (error.response.status === 403) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate("/", { state: { from: location }, replace: true });
        } else if (error.response.status === 500) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          setErrorDialog({
            isOpen: true,
            title: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getData();
  }, []);

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
      field: "username",
      headerName: "Username",
      width: 130,
    },

    { field: "firstName", headerName: "First name", width: 130 },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 130,
      valueFormatter: (params) => params?.value || "-",
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 130,
      // renderCell: (params) => {
      //   return params && params.value === "tabing" ? (
      //     <p>kwek</p>
      //   ) : (
      //     <p>{params.value}</p>
      //   );
      // },
    },
    {
      field: "fullName",
      headerName: "Full name",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    { field: "userType", headerName: "Type", width: 130 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 240,

      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "_id",
      headerName: "Action",
      width: 150,
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
          title: `Are you sure to delete login history of ${params.row.username}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete(params.value);
          },
        });
      },
    });
    // alert(`Delete : ${params.row.username}`);
    // alert(`Delete : ${params.value}`);
  };

  const handleDelete = async (_id) => {
    let stud, emp;
    setLoadingDialog({ isOpen: true });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      console.log(_id);
      setIsLoading(true);

      const deleteResponse = await axiosPrivate.delete(
        "/api/loginhistories/delete",
        {
          data: { _id: _id },
        }
      );
      console.log("DELETE loginHistory: ", deleteResponse);
      if (deleteResponse.status === 200) {
        const json = await deleteResponse.data;
        setSuccessDialog({
          isOpen: true,
          message: `Login history of ${json.username} has been deleted!`,
        });
        console.log("DELETE loginHistory: ", json);

        const getEmpLogins = await axiosPrivate.get(
          "/api/loginhistories/employees"
        );
        if (getEmpLogins.status === 200) {
          emp = await getEmpLogins.data;
          console.log(emp);
          setIsLoading(false);
          setEmpData(emp);
          setLoadingDialog({ isOpen: false });
        }
        const getStudLogins = await axiosPrivate.get(
          "/api/loginhistories/students"
        );
        if (getStudLogins.status === 200) {
          stud = await getStudLogins.data;
          console.log(stud);
          setIsLoading(false);
          setStudData(stud);
          setLoadingDialog({ isOpen: false });
        }
        setAllData([...stud, ...emp]);
        console.log(getAllData);
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
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
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
          display: "flex",
          width: "100%",
          padding: { xs: 1, sm: "0 20px" },
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
                textTransform: "uppercase",
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              login history
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
                placeholder="Search Username"
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
            rows={getAllData}
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
                  fullName: false,
                  _id: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginHistoryTable;
