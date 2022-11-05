import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
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
  Divider,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  Search,
} from "@mui/icons-material";
import { useUsersContext } from "../../hooks/useUserContext";

import UsersDetails from "./components/User/UsersDetails";
import UserForm from "./components/User/UserForm";
import Loading from "../../global/Loading";
import { styled } from "@mui/material/styles";
import UserTable from "./components/User/UserTable";
const Users = () => {
  // const [users, setUsers] = useState([]);
  // const [employees, setEmployees] = useState([]);
  // const [isloading, setIsLoading] = useState(false);

  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   "&:nth-of-type(odd)": {
  //     backgroundColor: theme.palette.action.hover,
  //   },
  //   // hide last border
  //   "&:last-child td, &:last-child th": {
  //     border: 0,
  //   },
  // }));

  // useEffect(() => {
  //   getUsersDetails();
  //   console.log(users);
  //   console.log(employees);
  // }, []);
  // // const { users, dispatch } = useUsersContext();
  // // useEffect(() => {
  // //   const fetchWorkouts = async () => {
  // //     const response = await fetch("/api/users");
  // //     const response1 = await fetch("/api/users");
  // //     const json = await response.json();
  // //     if (response.ok) {
  // //       dispatch({ type: "SET_USERS", payload: json });
  // //     }
  // //   };
  // //   fetchWorkouts();
  // // }, [dispatch]);
  // // console.log(users);
  // function createData(Name, Email, Type) {
  //   return { Name, Email, Type };
  // }

  // const getUsersDetails = async () => {
  //   setIsLoading(true);
  //   const user = await axios("/api/users");
  //   const employee = await axios("/api/employees");
  //   if (user.statusText === "OK" && employee.statusText === "OK") {
  //     setUsers(user.data);
  //     setEmployees(employee.data);
  //     setIsLoading(false);
  //   } else {
  //     return;
  //   }
  // };

  // // const rows = [
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // //   createData("Lorem Ipsum", "emailaddress@gmail.com", "Teacher"),
  // // ];
  return (
    <div className="contents-container">
      <UserTable />
      {/* <Box>
        <Typography variant="h4" fontWeight={600}>
          Users
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={600}></Typography>
      </Box>
      <UserForm /> */}
      {/* <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: " 1fr 1fr",
          margin: "10px 0",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Users
          </Typography>
          <Typography>Showing 5 entries</Typography>
        </Box>
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            width: "65%",
            alignItems: "center",
            justifySelf: "end",
            justifyContent: "center",
            padding: "0 20px",
            marginRight: "10px",
          }}
        >
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search User" />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>
      </Box>

      <Box width="100%">
        <TableContainer>
          <Table sx={{ minWidth: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map((val) => {
                  const results = employees.find(
                    (uuid) => uuid.empID === val.username
                  );
                  return (
                    <StyledTableRow
                      key={users._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <UsersDetails
                        key={val.username}
                        user={val}
                        result={results}
                      />
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          display="flex"
          width="100%"
          sx={{ flexDirection: "column" }}
          justifyContent="center"
          alignItems="center"
        >
          {isloading ? <Loading /> : <></>}
          <Box
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
          </Box>
        </Box>

        <Box display="flex" width="100%" marginTop="20px">
          <Button
            variant="outlined"
            color="primary"
            sx={{ width: "200px", height: "50px" }}
          >
            <Typography fontWeight="500" color="primary" variant="h6">
              IMPORT
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px", height: "50px", marginLeft: "20px" }}
          >
            <Typography color="white" variant="h6" fontWeight="500">
              ADD
            </Typography>
          </Button>
        </Box>
      </Box> */}
    </div>
  );
};

export default Users;
