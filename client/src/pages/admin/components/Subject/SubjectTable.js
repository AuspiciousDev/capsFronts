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

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
const SubjectTable = () => {
  const CHARACTER_LIMIT = 6;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

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
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [validateDialog, setValidateDialog] = useState({
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
    clearInputForms();
    setError(false);
  };
  const clearInputForms = () => {
    setSubjectID("");
    setLevelID("");
    setSubjectName("");
    setDescription("");
  };

  const clearForm = () => {
    setIsFormOpen(false);
  };
  const handleSubmit = async (e) => {
    let noSpaceSubjectID = "";
    e.preventDefault();
    console.log(subjectID, levelID, subjectName);
    noSpaceSubjectID = subjectID.replace(/ /g, "");
    const subject = {
      subjectID: noSpaceSubjectID,
      levelID,
      subjectName,
      description,
    };

    if (subjectID) {
      try {
        const response = await axiosPrivate.post(
          "/api/subjects/register",
          JSON.stringify(subject),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log(json);
          subDispatch({ type: "CREATE_SUBJECT", payload: json });
          setIsFormOpen(false);
          setOpen(false);
          setIsLoading(false);
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setDepartmentIDError(true);
          setOpen(false);
          setIsLoading(false);
          setErrorMessage(error.response.data.message);

          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      console.log("Error");
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

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        setIsLoading(true);
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
        setLoadingDialog({ isOpen: false });
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
  }, [subDispatch, levelDispatch, depDispatch]);
  const handleAdd = () => {
    setIsFormOpen(true);
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      const response = await axiosPrivate.delete("/api/subjects/delete", {
        headers: { "Content-Type": "application/json" },
        data: val,
        withCredentials: true,
      });
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        subDispatch({ type: "DELETE_SUBJECT", payload: json });
      }
    } catch (error) {
      setIsLoading(false);
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
      } else if (error.response.status === 403) {
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
    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/subjects/status",
        JSON.stringify({ subjectID: val.subjectID, status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/subjects");
        if (response2?.status === 200) {
          const json = await response2.data;
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
          setSuccessDialog({ isOpen: true });
        }
      }
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
        setErrorDialog({
          isOpen: true,
          title: `no server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          title: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else {
        console.log(error);
        setErrorDialog({
          isOpen: true,
          title: `${error}`,
        });
      }
    }
  };
  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          Subject ID
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          Subject Name
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          Subject Level
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          STATUS
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          Action
        </TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val._id}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* Subject ID */}
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {val.subjectID}
        </TableCell>
        {/* Subject Name */}
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val.subjectName}
        </TableCell>
        {/* Subject Level */}
        <TableCell align="left">
          {levels &&
            levels
              .filter((dep) => {
                return dep.levelID === val.levelID;
              })
              .map((val) => {
                return val.levelNum;
              })}
        </TableCell>
        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to change status of  ${val.subjectID.toUpperCase()}`,
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
          <Box display="flex" gap={2}>
            {/* <ButtonBase
              onClick={() => {
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    console.log(val.levelID);
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to delete section ${val.sectionID.toUpperCase()}`,
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
                  backgroundColor: colors.secondary[500],
                  color: colors.blackOnly[100],
                  alignItems: "center",
                }}
              >
                <DriveFileRenameOutline />
                <Typography ml="5px">Edit</Typography>
              </Paper>
            </ButtonBase> */}
            <ButtonBase
              onClick={() => {
                console.log(val.levelID);
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to delete subject ${val.subjectID.toUpperCase()}`,
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
                {/* <SubjectEditForm data={val} /> */}
                <Delete />
                <Typography ml="5px">Remove</Typography>
              </Paper>
            </ButtonBase>
          </Box>
        </TableCell>
      </StyledTableRow>
    );
  };
  const DeleteRecord = ({ delVal }) => (
    <Popup
      trigger={
        <IconButton sx={{ cursor: "pointer" }}>
          <DeleteOutline sx={{ color: colors.error[100] }} />
        </IconButton>
      }
      modal
      nested
    >
      {(close) => (
        <div
          className="modal-delete"
          style={{
            backgroundColor: colors.primary[900],
            border: `solid 1px ${colors.black[200]}`,
          }}
        >
          <button className="close" onClick={close}>
            &times;
          </button>
          <div
            className="header"
            style={{ backgroundColor: colors.primary[800] }}
          >
            <Typography variant="h3" fontWeight="bold">
              DELETE RECORD
            </Typography>
          </div>
          <div className="content">
            <Typography variant="h6">Are you sure to delete </Typography>
            <Box margin="20px 0">
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ textTransform: "uppercase" }}
              >
                {delVal.subjectID}
              </Typography>
              <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                {delVal.title}
              </Typography>
            </Box>
          </div>
          <div className="actions">
            <Button
              type="button"
              onClick={() => {
                handleDelete({ delVal });
                close();
              }}
              variant="contained"
              color="secondary"
              sx={{
                width: "150px",
                height: "50px",
                ml: "20px",
                mb: "10px",
              }}
            >
              <Typography variant="h6">Confirm</Typography>
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
              variant="contained"
              sx={{ width: "150px", height: "50px", ml: "20px", mb: "10px" }}
            >
              <Typography variant="h6">CANCEL</Typography>
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );

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
        <Box
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
            <Typography variant="h3">ADD SUBJECT</Typography>
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
                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  Subject Information
                </Typography>
                <Box marginBottom="40px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <FormControl required>
                      <InputLabel required id="demo-simple-select-label">
                        Department
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={departmentIDError}
                        value={departmentID}
                        label="Department"
                        onChange={(e) => {
                          setDepartmentID(e.target.value);
                        }}
                      >
                        <option aria-label="None" value="" />
                        {departments &&
                          departments
                            .filter((val) => {
                              return val.status === true;
                            })
                            .map((val) => {
                              return (
                                <option
                                  key={val.departmentID}
                                  value={val.departmentID}
                                >
                                  {val.depName}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <FormControl required>
                      <InputLabel required id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={levelIDError}
                        value={levelID}
                        label="Levels"
                        onChange={(e) => {
                          setLevelID(e.target.value);
                          levels &&
                            levels
                              .filter((val) => {
                                return val.levelID === e.target.value;
                              })
                              .map((val) => {
                                return setLevel(val.levelNum);
                              });
                        }}
                      >
                        <option aria-label="None" value="" />
                        {levels &&
                          levels
                            .filter((val) => {
                              return (
                                val.status === true &&
                                val.departmentID === departmentID
                              );
                            })
                            .map((val) => {
                              return (
                                <option key={val.levelID} value={val.levelID}>
                                  {val.levelNum}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <TextField
                      required
                      autoComplete="off"
                      variant="standard"
                      label="Subject ID"
                      placeholder="Subject ID"
                      error={subjectIDError}
                      value={subjectID}
                      onChange={(e) => {
                        setSubjectID(e.target.value);
                        setSubjectIDError(false);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="subtitle2"
                              sx={{ color: colors.black[400] }}
                            >
                              {subjectID.length}/{CHARACTER_LIMIT}
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: CHARACTER_LIMIT,
                      }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="standard"
                      label="Subject Name"
                      placeholder="Subject Name"
                      error={subjectNameError}
                      value={subjectName}
                      onChange={(e) => {
                        setSubjectName(e.target.value);
                      }}
                      inputProps={{
                        style: { textTransform: "capitalize" },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr ",
                      gap: "20px",
                      mt: "15px",
                    }}
                  >
                    <TextField
                      autoComplete="off"
                      variant="standard"
                      label="Description"
                      placeholder="Description"
                      error={descriptionError}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
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
                  {isLoading ? <Loading /> : <></>}
                </Box>
                <Box
                  display="flex"
                  justifyContent="end"
                  sx={{ margin: "40px 0 20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
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
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[100] }}
                      >
                        CANCEL
                      </Typography>
                    </Button>
                  </div>
                </Box>
              </form>
            </Box>
          </div>
        </Box>
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
              SUBJECTS
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
                  setSearch(e.target.value.toLowerCase());
                }}
              />
              <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <Button
              type="button"
              startIcon={<AddIcon />}
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
                Add
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box width="100%" sx={{ mt: 2 }}>
        <Paper elevation={2}>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableTitles />
              </TableHead>
              <TableBody>
                {search
                  ? subjects
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((data) => {
                        return (
                          data.subjectID
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          data.subjectName
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        );
                      })
                      .map((data) => {
                        return tableDetails(data);
                      })
                  : subjects &&
                    subjects
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((data) => {
                        return tableDetails(data);
                      })}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={subjects && subjects.length}
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
        >
          {/* <Typography textTransform="uppercase">
                {console.log(Object.keys(subjects || {}).length)}
                {Object.keys(subjects || {}).length}
              </Typography> */}
          {isLoading ? <Loading /> : <></>}
          {Object.keys(subjects || {}).length > 0 ? (
            <></> // <Typography textTransform="uppercase">data</Typography>
          ) : (
            <Typography textTransform="uppercase">no data</Typography>
          )}
          {/* {console.log(Object.keys(subjects).length)} */}
          {/* {Object.keys(prop.subjectID).length > 0
                ? console.log("true")
                : console.log("false")} */}
          {/* {subjects.length < 0 ? console.log("true") : console.log("false")} */}
          {/* {Object.key(subjects).length ? (
                <Typography textTransform="uppercase">data</Typography>
              ) : (
                <Typography textTransform="uppercase">no data</Typography>
              )} */}

          {/* <Box
              display="flex"
              width="100%"
              justifyContent="center"
              marginTop="20px"
              marginBottom="20px"
            >
              <Box
                width="200px"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                justifyItems="center"
              >
                <ArrowBackIosNewOutlined color="gray" />
                <ArrowForwardIosOutlined color="gray" />
              </Box>
            </Box> */}
        </Box>

        <Box display="flex" width="100%" marginTop="20px"></Box>
      </Box>
    </>
  );
};

export default SubjectTable;
