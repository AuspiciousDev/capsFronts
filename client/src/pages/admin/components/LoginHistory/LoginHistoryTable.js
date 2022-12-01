import React from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import Loading from "../../../../global/Loading";
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
  NativeSelect,
  FormControl,
  TextField,
  InputLabel,
  ButtonBase,
  Avatar,
} from "@mui/material";
import { Search, Delete, Cancel, CheckCircle } from "@mui/icons-material";
import { format } from "date-fns-tz";
const LoginHistoryTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState();

  const [getEmpData, setEmpData] = useState([]);
  const [page, setPage] = React.useState(0);
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

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          "/api/loginhistories/employees",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          setIsLoading(false);
          setEmpData(json);
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
  }, []);

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

  const TableTitles = () => {
    return (
      <StyledTableHeadRow
      // sx={{ backgroundColor: `${colors.darkLightBlue[100]}` }}
      >
        <TableCell align="center"></TableCell>
        <TableCell>USERNAME</TableCell>
        <TableCell>NAME</TableCell>
        <TableCell align="left">USER TYPE</TableCell>
        <TableCell>DATE</TableCell>
        {/* <TableCell align="left">ACTION</TableCell> */}
      </StyledTableHeadRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val?._id}
        data-rowid={val?.username}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* <TableCell align="left">-</TableCell> */}
        <TableCell >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt="profile-user"
              src={val?.imgURL}
            />{" "}
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.username}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {" "}
          {val?.middleName
            ? val?.firstName +
              " " +
              val?.middleName.charAt(0) +
              ". " +
              val?.lastName
            : val?.firstName + " " + val?.lastName}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.userType}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {format(
            new Date(val.createdAt),
            "hh:mm a - MMM dd, yyyy"
            // "hh:mm a, EEEE"
          )}
        </TableCell>
        {/* <TableCell align="left">delete?</TableCell> */}
      </StyledTableRow>
    );
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
              sx={{ textTransform: "uppercase" }}
            >
              login history
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
                {search
                  ? search &&
                    getEmpData &&
                    getEmpData

                      .filter((fill) => {
                        return fill.username.includes(search);
                      })
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((val) => {
                        return tableDetails(val);
                      })
                  : getEmpData &&
                    getEmpData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((val) => {
                        return tableDetails(val);
                      })}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={
              search
                ? search &&
                  getEmpData &&
                  getEmpData.filter((fill) => {
                    return fill.username.includes(search);
                  }).length
                : getEmpData && getEmpData.length
            }
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
    </Box>
  );
};

export default LoginHistoryTable;
