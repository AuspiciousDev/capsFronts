import React from "react";
import Popup from "reactjs-popup";
import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";
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
  ButtonBase,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Divider,
  Avatar,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  Search,
} from "@mui/icons-material";
import {
  DriveFileRenameOutline,
  DeleteOutline,
  AccountCircle,
  Person2,
  Delete,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
  Badge,
  School,
} from "@mui/icons-material";

import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";

import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import EmployeeForm from "./EmployeeForm";
import EmployeeEditForm from "./EmployeeEditForm";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
const EmployeeTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const { employees, empDispatch } = useEmployeesContext();
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
    const getUsersDetails = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/employees");
        if (response.status === 200) {
          const json = await response.data;
          console.log("Employees GET : ", json);
          setIsLoading(false);
          empDispatch({ type: "SET_EMPLOYEES", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          console.log(error.response.data.message);
        } else {
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
  }, [empDispatch]);

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

    await console.log(val);
    await console.log(newStatus);
    try {
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        "/api/employees/status",
        JSON.stringify({ empID: val.empID, status: newStatus })
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/employees");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);
          setIsLoading(false);
          empDispatch({ type: "SET_EMPLOYEES", payload: json });
          setSuccessDialog({ isOpen: true });
        }
      }
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
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
  const handleAdd = () => {
    setIsFormOpen(true);
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    try {
      setLoadingDialog({ isOpen: true });
      setIsLoading(true);
      const response = await axiosPrivate.delete("/api/employees/delete", {
        headers: { "Content-Type": "application/json" },
        data: val,
        withCredentials: true,
      });
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        empDispatch({ type: "DELETE_EMPLOYEE", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: "Employee has been deleted!",
          onConfirm: () => {
            setSuccessDialog({ isOpen: false });
          },
        });
        setLoadingDialog({ isOpen: false });
      }
      setIsLoading(false);
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");
        setIsLoading(false);
        setErrorDialog({
          isOpen: true,
          title: "No server response",
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          title: `${error.response.data.message}`,
        });
        setIsLoading(false);
      } else if (error.response.status === 404) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          title: `${error.response.data.message}`,
        });
        setIsLoading(false);
      } else {
        setErrorDialog({
          isOpen: true,
          title: `${error}`,
        });
        console.log(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    }
  };

  const TableTitles = () => {
    return (
      <StyledTableHeadRow>
        <TableCell align="center">PROFILE</TableCell>
        <TableCell align="left">EMPLOYEE ID</TableCell>
        <TableCell align="left">NAME</TableCell>
        <TableCell align="left">GENDER</TableCell>
        {/* <TableCell align="left">EMAIL</TableCell> */}
        <TableCell align="left">TYPE</TableCell>
        <TableCell align="left">STATUS</TableCell>
        <TableCell align="left">ACTIONS</TableCell>
      </StyledTableHeadRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val._id}
        data-rowid={val.empID}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 1 },
            // "& td, & th": { border: 1 },
          }
        }
      >
        <TableCell sx={{ p: "0 10px" }} align="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            {console.log(val?.imgURL)}
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
                to={`/admin/faculty/${val?.empID}`}
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
                  <Typography ml="5px">{val?.empID}</Typography>
                </Box>
              </Link>
            </Paper>
          </Box>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val?.middleName
            ? val?.firstName +
              " " +
              val?.middleName.charAt(0) +
              ". " +
              val?.lastName
            : val?.firstName + " " + val?.lastName}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.gender}
        </TableCell>
        {/* <TableCell align="left">{val?.email || "-"}</TableCell> */}
        <TableCell
          align="left"
          sx={{
            textTransform: "capitalize",
            "& ul > li ": {
              marginTop: 1,
            },
          }}
        >
          {/* {val.empType.map((item, i) => {
            return (
              <ul style={{ padding: "0", listStyle: "none" }}>
                {item === 2001 ? (
                  <li>Administrator</li>
                ) : item === 2002 ? (
                  <li> Teacher</li>
                ) : item === 2003 ? (
                  <li> Student</li>
                ) : (
                  <></>
                )}
              </ul>
            );
          })} */}
          {val.empType.map((item, i) => {
            return (
              <ul
                key={item}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "0",
                  listStyleType: "none",
                }}
              >
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
                      <Typography ml="5px">Admin</Typography>
                    </Paper>
                  </li>
                ) : item === 2002 ? (
                  <li>
                    <Paper
                      sx={{
                        padding: "2px 10px",
                        backgroundColor: colors.primary[900],
                        color: colors.whiteOnly[100],
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Badge />
                      <Typography ml="5px">Teacher</Typography>
                    </Paper>
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            );
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
                    title: `Are you sure to change status of  ${val.empID.toUpperCase()}`,
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
                    title: `Are you sure to Employee ${val.empID.toUpperCase()}`,
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
            elevation={0}
            sx={{
              display: "grid",
              width: "50%",
              gridTemplateColumns: " 1fr 1fr 1fr",
            }}
          >
            {/* <EmployeeEditForm data={val} /> */}
          {/* <IconButton
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: `Are you sure to delete employee ${val.empID.toUpperCase()}`,
                  message: `This action is irreversible!`,
                  onConfirm: () => {
                    handleDelete({ val });
                  },
                });
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ color: colors.error[100] }} />
            </IconButton> */}
          {/* </Box>   */}
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
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />

      {isFormOpen ? (
        <EmployeeForm />
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
                  EMPLOYEES
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
                    placeholder="Search Employee"
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
                  maxHeight: "700px",
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
                      (console.log(search),
                      search
                        ? employees

                            .filter((data) => {
                              return (
                                data.firstName
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) ||
                                data.empID.includes(search) ||
                                data.lastName
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              );
                            })
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((data) => {
                              return tableDetails(data);
                            })
                        : employees &&
                          employees
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((data) => {
                              return tableDetails(data);
                            }))

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
                count={employees && employees.length}
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
              {Object.keys(employees || {}).length > 0 ? (
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

export default EmployeeTable;
