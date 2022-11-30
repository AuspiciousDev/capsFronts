import React from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import Popup from "reactjs-popup";
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
  TablePagination,
  Divider,
  Select,
  NativeSelect,
  MenuItem,
  FormControl,
  TextField,
  ButtonBase,
  InputLabel,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Avatar,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Search, Delete, CheckCircle, Bookmark } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import { DeleteOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate, useLocation } from "react-router-dom";

const SchoolYearTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const { years, yearDispatch } = useSchoolYearsContext();
  const [isLoading, setIsLoading] = useState(false);

  const [schoolYearID, setSchoolYearID] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState();

  const [schoolYearIDError, setSchoolYearIDError] = useState(false);
  const [schoolYearError, setSchoolYearError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    clearFields();
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

  // const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const [Copen, setCOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  // const handleClickOpen = ({ val }) => {
  //   setCOpen(true);
  // };

  // const handleClose = (value) => {
  //   setCOpen(false);
  //   setSelectedValue(value);
  // };

  // const closeConfirm = () => {
  //   setOpenConfirm(false);
  //   clearFields();
  // };
  const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    " & th": {
      fontWeight: "bold",
    },
    // hide last border
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: colors.primary[100],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/api/schoolyears");
        if (response.status === 200) {
          const json = await response.data;
          console.log("School Year GET: ", json);
          setIsLoading(false);
          yearDispatch({ type: "SET_YEARS", payload: json });
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
          setErrorDialog({
            isOpen: true,
            message: `${"no server response"}`,
          });
        } else if (error.response.status === 204) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.message}`,
          });
          console.log(error.response.data.message);
        } else {
          console.log(error);
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
      }
    };
    getData();
  }, [yearDispatch]);

  function yearData(schoolYearID, schoolYear) {
    return { schoolYearID, schoolYear };
  }

  const rows = [
    yearData("", ""),
    yearData("2022", "2021-2022"),
    yearData("2023", "2022-2023"),
    yearData("2024", "2023-2024"),
    yearData("2025", "2024-2025"),
    yearData("2026", "2025-2026"),
    yearData("2027", "2026-2027"),
    yearData("2028", "2027-2028"),
    yearData("2029", "2028-2029"),
    yearData("2030", "2029-2030"),
  ];
  const clearFields = () => {
    setSchoolYearID("");
    setSchoolYear("");
    setDescription("");
    setSchoolYearIDError(false);
    setSchoolYearError(false);
    setError(false);
  };
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const data = {
      schoolYearID,
      schoolYear,
      description,
    };

    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/schoolyears/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          yearDispatch({ type: "CREATE_YEAR", payload: json });
          setOpen(false);
          setSuccessDialog({
            isOpen: true,
            message: "Department has been added!",
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setSchoolYearIDError(true);
          setSchoolYearError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          // setErrorMessage(error.response.data.message);
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setSchoolYearIDError(true);
          setSchoolYearError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          setErrorMessage(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          console.log(error);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          setErrorMessage(error.response.data.message);
        }
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
        setIsLoading(false);
        setError(true);
      }
    } else {
      setIsLoading(false);
      return;
    }
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete("/api/schoolyears/delete", {
        headers: { "Content-Type": "application/json" },
        data: val,
        withCredentials: true,
      });
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        yearDispatch({ type: "DELETE_YEAR", payload: json });
      }
      const apiSY = await axiosPrivate.get("/api/schoolyears", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (apiSY?.status === 200) {
        const syJSON = await apiSY.data;
        console.log(syJSON);
        setIsLoading(false);
        yearDispatch({ type: "SET_YEARS", payload: syJSON });
        setSuccessDialog({
          isOpen: true,
          message: "School Year has been Deleted!",
        });
      }

      setIsLoading(false);
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
        setIsLoading(false);
      } else if (error.response.status === 400) {
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
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
        setIsLoading(false);
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
        setIsLoading(false);
      }
    }
  };
  const toggleStatus = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newStatus = val.status;
    // val.status === true
    //   ? (newStatus = false)
    //   : val.status === false
    //   ? (newStatus = true)
    //   : (newStatus = false);
    if (val.status === true) newStatus = false;

    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/schoolyears/status",
        JSON.stringify({ schoolYearID: val.schoolYearID, status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/schoolyears");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log("School Year PATCH: ", json);
          setIsLoading(false);
          yearDispatch({ type: "SET_YEARS", payload: json });
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
    }
  };
  const TableTitles = () => {
    return (
      <StyledTableHeadRow
      // sx={{ backgroundColor: `${colors.primary[100]}` }}
      >
        <TableCell>
          <Typography>ID</Typography>
        </TableCell>
        <TableCell>SCHOOL YEAR </TableCell>
        <TableCell align="left">STATUS</TableCell>
        <TableCell align="left">ACTION</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = ({ val }) => {
    return (
      <StyledTableRow
        key={val._id}
        data-rowid={val.schoolYearID}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* <TableCell align="left">-</TableCell> */}
        <TableCell align="left">{val?.schoolYearID}</TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.schoolYear}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {/* <Button
            type="button"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                title: "are you sure to delete this record",
                subTitle: "You cant undo this operation!",
              })
            }
          >
            asdasd
          </Button> */}
          {val?.status === false ? (
            <ButtonBase disabled>
              <Paper
                sx={{
                  display: "flex",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  alignItems: "center",
                }}
              >
                <Bookmark />
                <Typography ml="5px">ARCHIVED</Typography>
              </Paper>
            </ButtonBase>
          ) : (
            <ButtonBase
              type="button"
              onClick={() =>
                setValidateDialog({
                  isOpen: true,
                  onConfirm: () => {
                    setConfirmDialog({
                      isOpen: true,
                      title: `Are you sure to archived Year ${val.schoolYear}`,
                      message: "You cant undo this operation!",
                      onConfirm: () => {
                        toggleStatus({ val });
                      },
                    });
                  },
                })
              }
            >
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
            </ButtonBase>
          )}
        </TableCell>
        <TableCell align="left">
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to delete year ${val.schoolYearID}`,
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
        </TableCell>
      </StyledTableRow>
    );
  };
  const DeleteRecord = ({ delVal }) => (
    <Popup
      trigger={
        <IconButton sx={{ cursor: "pointer" }}>
          <DeleteOutline />
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
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: colors.whiteOnly[100] }}
            >
              DELETE RECORD
            </Typography>
          </div>
          <div className="content">
            <Typography variant="h5">Are you sure to delete record </Typography>
            <Box margin="20px 0">
              <Typography variant="h3" fontWeight="bold">
                {delVal.schoolYearID}
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
              sx={{
                width: "150px",
                height: "50px",
                ml: "20px",
                mb: "10px",
              }}
            >
              <Typography variant="h6" sx={{ color: colors.whiteOnly[100] }}>
                Confirm
              </Typography>
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
              <Typography variant="h6" sx={{ color: colors.whiteOnly[100] }}>
                CANCEL
              </Typography>
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
      {/* <ConfirmDialogue
        selectedValue={selectedValue}
        open={Copen}
        onClose={handleClose}
      /> */}
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
            <Typography variant="h3">ADD SCHOOL YEAR</Typography>
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
                  School Year Information
                </Typography>
                <Box marginBottom="20px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "repeat(2,1fr)",
                      gap: "20px",
                    }}
                  >
                    <FormControl variant="standard" required>
                      <InputLabel htmlFor="demo-customized-select-native">
                        School Year ID
                      </InputLabel>

                      <NativeSelect
                        id="demo-customized-select-native"
                        value={schoolYearID}
                        error={schoolYearIDError}
                        onChange={(e) => {
                          setSchoolYearID(e.target.value);
                          setError(false);
                          setSchoolYearIDError(false);
                          setSchoolYearError(false);
                          rows
                            .filter((val) => {
                              return val.schoolYearID === e.target.value;
                            })
                            .map((data) => {
                              return setSchoolYear(data.schoolYear);
                            });
                        }}
                      >
                        {rows.map((data) => {
                          return (
                            <option
                              key={data.schoolYearID}
                              value={data.schoolYearID}
                            >
                              {data.schoolYearID}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>

                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      disabled
                      label="School Year"
                      value={schoolYear}
                      error={schoolYearError}
                      onChange={(e) => {
                        setSchoolYear(e.target.value);
                      }}
                    />
                    <TextField
                      autoComplete="off"
                      variant="standard"
                      label="Description"
                      value={description}
                      error={descriptionError}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      sx={{
                        gridColumnStart: 1,
                        gridColumnEnd: 3,
                        gridRowStart: 2,
                        gridRowEnd: 2,
                      }}
                    />
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
              <Typography variant="h2" fontWeight="bold">
                SCHOOL YEAR
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "end",
                alignItems: "center",
              }}
              setSearch
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
                  placeholder="Search Year"
                  onChange={(e) => {
                    setSearch(e.target.value.toLowerCase());
                  }}
                  value={search}
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
                onClick={() => setOpen((o) => !o)}
                // onClick={() => {
                //   setSuccessDialog({
                //     isOpen: true,
                //   });
                // }}
                // onClick={() => {
                //   setValidateDialog({
                //     isOpen: true,
                //   });
                // }}
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  height: "50px",
                  marginLeft: { xs: "0", sm: "20px" },
                  marginTop: { xs: "20px", sm: "0" },
                }}
              >
                <Typography color="white" variant="h6" fontWeight="500">
                  Add
                </Typography>
              </Button>
            </Box>
          </Box>
        </Paper>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Paper elevation={2}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableTitles />
                </TableHead>
                <TableBody>
                  {search
                    ? years &&
                      years
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .filter((val) => {
                          return val.schoolYearID.includes(search);
                        })
                        .map((val) => {
                          return tableDetails({ val });
                        })
                    : years &&
                      years
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
            paddingBottom="10px"
          >
            {isLoading ? <Loading /> : <></>}
          </Box>
        </Box>
      </>
    </>
  );
};

export default SchoolYearTable;
