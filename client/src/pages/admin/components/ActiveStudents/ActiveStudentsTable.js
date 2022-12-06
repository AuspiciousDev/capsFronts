import React from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  ButtonBase,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Divider,
  NativeSelect,
  FormControl,
  TextField,
  InputLabel,
  Tooltip,
  TablePagination,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import AddIcon from "@mui/icons-material/Add";

import { useStudentsContext } from "../../../../hooks/useStudentsContext";

import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";

import { useActiveStudentsContext } from "../../../../hooks/useActiveStudentContext";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";

import {
  DeleteOutline,
  Search,
  CheckCircle,
  Cancel,
  Delete,
  PersonAddAltOutlined,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";

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
const ActiveStudentsTable = () => {
  const CHARACTER_LIMIT = 10;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { students, studDispatch } = useStudentsContext();
  const { actives, activeDispatch } = useActiveStudentsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { years, yearDispatch } = useSchoolYearsContext();

  const [search, setSearch] = useState();

  // const [departmentID, setDepartmentID] = useState("");
  const [depName, setDepName] = useState("");
  const [description, setDescription] = useState("");

  const [departmentIDError, setDepartmentIDError] = useState(false);
  const [depNameError, setDepNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [studID, setStudID] = useState("");
  const [levelID, setLevelID] = useState("");
  const [sectionID, setSectionID] = useState("");
  const [enrollmentID, setEnrollmentID] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [schoolYearID, setSchoolYearID] = useState("");

  const [studentIDError, setStudentIDError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
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
    setStudID("");
    setSchoolYearID("");
    setDepartmentID("");
    setLevelID("");
    setSectionID("");
    setError(false);
    setStudentIDError(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const apiStud = await axiosPrivate.get("/api/students", {});
        if (apiStud?.status === 200) {
          const json = await apiStud.data;
          //   console.log(json);
          setIsLoading(false);
          studDispatch({ type: "SET_STUDENTS", payload: json });
        }
        const response = await axiosPrivate.get("/api/sections", {});
        if (response.status === 200) {
          const json = await response.data;
          //   console.log(json);
          setIsLoading(false);
          secDispatch({ type: "SET_SECS", payload: json });
        }
        const apiLevel = await axiosPrivate.get("/api/levels", {});
        if (apiLevel?.status === 200) {
          const json = await apiLevel.data;
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const apiDep = await axiosPrivate.get("/api/departments", {});
        if (apiDep?.status === 200) {
          const json = await apiDep.data;
          //   console.log(json);
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
        const apiActive = await axiosPrivate.get("/api/enrolled", {});
        if (apiActive?.status === 200) {
          const json = await apiActive.data;
          console.log(json);
          setIsLoading(false);
          activeDispatch({ type: "SET_ACTIVES", payload: json });
        }
        const apiYear = await axiosPrivate.get("/api/schoolyears", {});
        if (apiYear?.status === 200) {
          const json = await apiYear.data;
          //   console.log(json);
          setIsLoading(false);
          yearDispatch({ type: "SET_YEARS", payload: json });
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
    getData();
  }, [
    studDispatch,
    secDispatch,
    levelDispatch,
    depDispatch,
    activeDispatch,
    yearDispatch,
  ]);
  const toggleStatus = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setLoadingDialog({ isOpen: true });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);

    await console.log(newStatus);
    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/enrolled/status",
        JSON.stringify({
          enrolledID: val.enrolledID,
          studID: val.studID,
          schoolYearID: val.schoolYearID,
          status: newStatus,
        })
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/enrolled");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);
          setIsLoading(false);
          activeDispatch({ type: "SET_ACTIVES", payload: json });
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            message: "Enrolled status changed!",
          });
        }
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
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "levelID", headerName: "Level", width: 120 },
    { field: "sectionID", headerName: "Section", width: 120 },
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
            <ButtonBase
              onClick={() => {
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to change status of  ${params?.row?.studID}`,
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
          title: `Are you sure to delete Enrolled Student ${params?.row?.studID}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
    // alert(`Delete : ${params.row.username}`);
    // alert(`Delete : ${params.value}`);
  };

  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell>STUDENT ID</TableCell>
        <TableCell>STUDENT NAME</TableCell>
        <TableCell align="left">LEVEL</TableCell>
        <TableCell align="left">SECTION</TableCell>
        <TableCell align="left">DEPARTMENT</TableCell>
        <TableCell align="left">STATUS</TableCell>
        <TableCell align="left">ACTION</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = ({ val }) => {
    return (
      <StyledTableRow key={val._id} data-rowid={val.departmentID}>
        <TableCell align="left">
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/admin/student/${val?.studID}`}
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
                  {val?.studID}
                </Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>
        <TableCell
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
                  ? stud.firstName +
                      " " +
                      stud.middleName.charAt(0) +
                      ". " +
                      stud.lastName
                  : stud.firstName + " " + stud.lastName;
              })}
        </TableCell>
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
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {departments &&
            departments
              .filter((lev) => {
                return lev.departmentID === val.departmentID.toLowerCase();
              })
              .map((dep) => {
                return dep.depName;
              })}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to change status of  ${val.studID}`,
                    message: `${
                      val.status === true
                        ? "INACTIVE to ACTIVE"
                        : " ACTIVE to INACTIVE"
                    }`,
                    onConfirm: () => {
                      toggleStatus({ val });
                    },
                  });
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
        </TableCell>

        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to delete ${val.studID.toUpperCase()}`,
                    message: `This action is irreversible!`,
                    onConfirm: () => {
                      handleDelete({ val });
                    },
                  });
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
            {/* <IconButton sx={{ cursor: "pointer" }}>
              <Person2OutlinedIcon />
            </IconButton> */}

          {/* <UserEditForm user={user} /> */}
          {/* <DeleteRecord delVal={val} /> */}
          {/* </Box> */}
        </TableCell>
      </StyledTableRow>
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      schoolYearID,
      enrollmentID: schoolYearID + levelID + sectionID + studID,
      studID,
      levelID,
      sectionID,
      departmentID,
    };
    setLoadingDialog({ isOpen: true });
    setIsLoading(true);
    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/enrolled/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          activeDispatch({ type: "CREATE_ACTIVE", payload: json });
          setOpen(false);
          setIsLoading(false);
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
    } else {
      console.log(errorMessage);
    }
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });
      setIsLoading(true);
      const response = await axiosPrivate.delete("/api/enrolled/delete", {
        headers: { "Content-Type": "application/json" },
        data: val,
        withCredentials: true,
      });
      const json = await response.data;
      if (response.status === 201) {
        console.log(json);
        activeDispatch({ type: "DELETE_ACTIVE", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Enrolled Student ${val.studID} has been Deleted!`,
        });
      }
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
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
      />{" "}
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
            <Typography variant="h3">ENROLL A STUDENT</Typography>
          </Box>
          <div className="content">
            <Box
              className="formContainer"
              display="block"
              width="100%"
              flexDirection="column"
              justifyContent="center"
            >
              <Typography
                variant="h2"
                textAlign="center"
                textTransform="uppercase"
              >
                School Year
              </Typography>
              <Typography variant="h2" textAlign="center">
                {years &&
                  years
                    .filter((fill) => {
                      return fill.status === true;
                    })
                    .map((val) => {
                      return val.schoolYear;
                    })}
              </Typography>

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {/* <Typography variant="h5">Registration</Typography> */}

                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  Student Information
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
                      label="Student ID"
                      error={studentIDError}
                      value={studID}
                      onChange={(e) => {
                        setError(false);
                        setStudID(e.target.value);
                        setStudentIDError(false);
                      }}
                      inputProps={{ maxLength: CHARACTER_LIMIT }}
                      helperText={`*Input 10 characters only ${studID.length} / ${CHARACTER_LIMIT}`}
                    />

                    <FormControl variant="standard" required>
                      <InputLabel htmlFor="demo-customized-select-native">
                        School Year
                      </InputLabel>

                      <NativeSelect
                        id="demo-customized-select-native"
                        value={schoolYearID}
                        // error={schoolYearIDError}
                        onChange={(e) => {
                          setSchoolYearID(e.target.value);
                        }}
                      >
                        <option aria-label="None" value="" />
                        {years &&
                          years
                            .filter((fill) => {
                              return fill.status === true;
                            })
                            .map((data) => {
                              return (
                                <option
                                  key={data.schoolYearID}
                                  value={data.schoolYearID}
                                >
                                  {data.schoolYear}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>

                    <Box display="grid" gridTemplateColumns="1fr" gap={2}>
                      <FormControl variant="standard" required>
                        <InputLabel htmlFor="demo-customized-select-native">
                          Department
                        </InputLabel>

                        <NativeSelect
                          id="demo-customized-select-native"
                          value={departmentID}
                          // error={schoolYearIDError}
                          onChange={(e) => {
                            setDepartmentID(e.target.value);
                          }}
                        >
                          <option aria-label="None" value="" />
                          {departments &&
                            departments
                              .filter((filter) => {
                                return filter.status === true;
                              })
                              .map((data) => {
                                return (
                                  <option
                                    key={data.departmentID}
                                    value={data.departmentID}
                                  >
                                    {data.depName}
                                  </option>
                                );
                              })}
                        </NativeSelect>
                      </FormControl>
                      <FormControl variant="standard" required>
                        <InputLabel htmlFor="demo-customized-select-native">
                          Level
                        </InputLabel>

                        <NativeSelect
                          id="demo-customized-select-native"
                          value={levelID}
                          // error={schoolYearIDError}
                          onChange={(e) => {
                            setLevelID(e.target.value);
                          }}
                        >
                          <option aria-label="None" value="" />
                          {levels &&
                            levels
                              .filter((filter) => {
                                return (
                                  filter.departmentID === departmentID &&
                                  filter.status === true
                                );
                              })
                              .map((data) => {
                                return (
                                  <option
                                    key={data.levelID}
                                    value={data.levelID}
                                  >
                                    {data.levelNum}
                                  </option>
                                );
                              })}
                        </NativeSelect>
                      </FormControl>
                      <FormControl variant="standard" required>
                        <InputLabel htmlFor="demo-customized-select-native">
                          Section
                        </InputLabel>

                        <NativeSelect
                          id="demo-customized-select-native"
                          value={sectionID}
                          // error={schoolYearIDError}
                          onChange={(e) => {
                            setSectionID(e.target.value);
                          }}
                        >
                          <option aria-label="None" value="" />
                          {levelID &&
                            sections &&
                            sections
                              .filter((filter) => {
                                return (
                                  filter.levelID === levelID &&
                                  filter.status === true
                                );
                              })
                              .map((data) => {
                                return (
                                  <option
                                    key={data.sectionID}
                                    value={data.sectionID}
                                  >
                                    {data.sectionName}
                                  </option>
                                );
                              })}
                        </NativeSelect>
                      </FormControl>
                    </Box>
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
              STUDENTS OF YEAR{[" "]}
              {years &&
                years
                  .filter((fill) => {
                    return fill.status === true;
                  })
                  .map((val) => {
                    return val.schoolYear;
                  })}
            </Typography>
            {/* <Typography variant="h5" fontWeight="bold">
            Active Students
          </Typography> */}
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
                placeholder="Search Student ID"
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
              type="button"
              startIcon={<PersonAddAltOutlined />}
              onClick={() => setOpen((o) => !o)}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                ENROLL
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
            rows={actives ? actives && actives : 0}
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
      <Box display="none" width="100%" sx={{ mt: 2 }}>
        <Paper elevation={2}>
          <TableContainer
            sx={{
              maxHeight: "700px",
            }}
          >
            <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableTitles />
              </TableHead>
              <TableBody>
                {search
                  ? years &&
                    actives &&
                    actives
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((val) => {
                        const currYear = years
                          .filter((e) => {
                            return e.status === true;
                          })
                          .map((val) => {
                            return val.schoolYearID;
                          });
                        return (
                          val.schoolYearID === currYear[0] &&
                          val.studID.includes(search)
                        );
                      })
                      .map((val) => {
                        return tableDetails({ val });
                      })
                  : years &&
                    actives &&
                    actives
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((val) => {
                        const currYear = years
                          .filter((e) => {
                            return e.status === true;
                          })
                          .map((val) => {
                            return val.schoolYearID;
                          });
                        return val.schoolYearID === currYear[0];
                      })
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
            count={years && years.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Box
          display="flex"
          width="100%"
          sx={{ flexDirection: "column" }}
          justifyContent="center"
          alignItems="center"
          paddingBottom="20px"
        >
          {isloading ? <Loading /> : <></>}
        </Box>
      </Box>
    </>
  );
};

export default ActiveStudentsTable;
