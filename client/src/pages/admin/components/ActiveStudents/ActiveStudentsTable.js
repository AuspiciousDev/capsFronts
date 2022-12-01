import React from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useParams, Link, useNavigate } from "react-router-dom";

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
import {
  DeleteOutline,
  Search,
  CheckCircle,
  Cancel,
  Delete,
  PersonAddAltOutlined,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";

const ActiveStudentsTable = () => {
  const CHARACTER_LIMIT = 10;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

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
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          console.log(error.response.data.message);
        } else {
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
              // to={`/admin/record/grade/${val?.studID}/${val?.schoolYearID}`}
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
                <Typography fontWeight="bold"> {val?.studID}</Typography>
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
              setConfirmDialog({
                isOpen: true,
                title: `Are you sure to change status of  ${val.studID}`,
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
              setConfirmDialog({
                isOpen: true,
                title: `Are you sure to delete ${val.studID.toUpperCase()}`,
                message: `This action is irreversible!`,
                onConfirm: () => {
                  handleDelete({ val });
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
  const DeleteRecord = ({ delVal }) => (
    <Popup
      trigger={
        <Tooltip title="Delete">
          <IconButton sx={{ cursor: "pointer" }}>
            <DeleteOutline sx={{ color: colors.error[100] }} />
          </IconButton>
        </Tooltip>
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
            <Typography variant="h5">Are you sure to delete record </Typography>
            <Box margin="20px 0">
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{ textTransform: "capitalize" }}
              >
                {delVal.studID}
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                textTransform="capitalize"
              >
                {students &&
                  students
                    .filter((stud) => {
                      return stud.studID === delVal.studID;
                    })
                    .map((stud) => {
                      return stud?.middleName
                        ? stud.firstName +
                            " " +
                            stud.middleName +
                            " " +
                            stud.lastName
                        : stud.firstName + " " + stud.lastName;
                    })}
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
      } catch (error) {
        setIsLoading(false);
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setDepartmentIDError(true);
          setStudentIDError(true);
          setError(true);
          setErrorMessage(error.response.data.message);

          console.log(error.response.data.message);
        } else {
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

      setIsLoading(false);
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
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
      <Box width="100%" sx={{ mt: 2 }}>
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
