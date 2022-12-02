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

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";

import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
const StudentTable = () => {
  const STUDID_LIMIT = 10;
  const LRN_LIMIT = 12;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const { students, studDispatch } = useStudentsContext();
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
            <Typography variant="h5">Are you sure to delete record</Typography>
            <Box margin="20px 0">
              <Typography variant="h3" fontWeight="bold">
                {delVal.studID}
              </Typography>
              <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                {delVal.middleName
                  ? delVal.firstName +
                    " " +
                    delVal.middleName +
                    " " +
                    delVal.lastName
                  : delVal.firstName + " " + delVal.lastName}
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

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/api/students", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          setIsLoading(false);
          studDispatch({ type: "SET_STUDENTS", payload: json });
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
          setErrorDialog({
            isOpen: true,
            message: "no server response",
          });
        } else if (error.response.status === 204) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
        setIsLoading(false);
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

  const handleAdd = () => {
    setIsFormOpen(true);
  };
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
  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="center">PROFILE</TableCell>
        <TableCell align="left">STUDENT ID</TableCell>
        <TableCell align="left">NAME</TableCell>
        <TableCell align="left">GENDER</TableCell>
        {/* <TableCell align="left">EMAIL</TableCell> */}
        <TableCell align="left">STATUS</TableCell>
        <TableCell align="left">ACTIONS</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val._id}
        data-rowid={val.studID}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* Profile ID */}
        <TableCell sx={{ p: "0 0" }} align="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt="profile-user"
              sx={{ width: "50px", height: "50px" }}
              src={val?.imgURL}
              style={{
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
          </Box>
        </TableCell>
        {/* Student ID */}
        <TableCell align="left">
          <Box display="flex" gap={2} width="60%">
            <Paper
              sx={{
                padding: "2px 10px",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: colors.whiteOnly[100],

                alignItems: "center",
              }}
            >
              <Link
                to={`/admin/student/${val?.studID}`}
                style={{
                  alignItems: "center",
                  color: colors.black[100],
                  textDecoration: "none",
                }}
              >
                <Box
                  display="flex"
                  sx={{ alignItems: "center", color: colors.blackOnly[100] }}
                >
                  <Typography ml="5px"> {val.studID}</Typography>
                </Box>
              </Link>
            </Paper>
          </Box>
        </TableCell>
        {/* Student Name */}
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val.firstName + " " + val.lastName}
        </TableCell>
        {/* Student Level */}
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val.gender}
        </TableCell>
        {/* <TableCell align="left">{val?.email || "-"}</TableCell> */}
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          <ButtonBase
            onClick={() => {
              setValidateDialog({
                isOpen: true,
                onConfirm: () => {
                  setConfirmDialog({
                    isOpen: true,
                    title: `Are you sure to change status of  ${val.studID.toUpperCase()}`,
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
                    title: `Are you sure to delete Student ${val.studID.toUpperCase()}`,
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
                <Typography variant="h2" fontWeight="bold">
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
          <Box width="100%" sx={{ mt: 2 }}>
            <Paper elevation={2}>
              <TableContainer
                sx={{
                  maxHeight: { xs: "400px", sm: "700px" },
                }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableTitles />
                  </TableHead>
                  <TableBody>
                    {
                      // collection
                      //   .filter((employee) => {
                      //     return employee.firstName === "ing";
                      //   })
                      //   .map((employee) => {
                      //     return tableDetails(employee);
                      //   })
                      search
                        ? students

                            .filter((data) => {
                              return (
                                data.firstName.includes(search) ||
                                data.studID.includes(search)
                              );
                            })
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((data) => {
                              return tableDetails(data);
                            })
                        : students &&
                          students
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((data) => {
                              return tableDetails(data);
                            })

                      // (collection.filter((employee) => {
                      //   return employee.empID === 21923595932985;
                      // }),
                      // (console.log(
                      //   "🚀 ~ file: EmployeeTable.js ~ line 526 ~ EmployeeTable ~ collection",
                      //   collection
                      // ),
                      // collection &&
                      //   collection.slice(0, 8).map((employee) => {
                      //     return tableDetails(employee);
                      //   })))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={students && students.length}
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
              {/* {withData ? (
                <Typography textTransform="capitalize">data</Typography>
              ) : (
                <Typography textTransform="capitalize">no data</Typography>
              )} */}
              {isloading ? <Loading /> : <></>}
              {Object.keys(students || {}).length > 0 ? (
                <></> // <Typography textTransform="uppercase">data</Typography>
              ) : (
                <Typography textTransform="uppercase">no data</Typography>
              )}
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
      )}
    </>
  );
};

export default StudentTable;
