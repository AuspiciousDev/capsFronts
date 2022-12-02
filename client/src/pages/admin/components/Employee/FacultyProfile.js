import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AppBar,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  School,
  AdminPanelSettings,
  Badge,
  MoreVert,
} from "@mui/icons-material";

import LoadingDialogue from "../../../../global/LoadingDialogue";
import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import Loading from "../../../../global/Loading";

import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { format } from "date-fns-tz";
import { ModeEditOutlineOutlined } from "@mui/icons-material";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import NotFound404 from "../../../NotFound404";
import PropTypes from "prop-types";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FacultyProfile = (props) => {
  const { id } = useParams();
  const [val, setVal] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loginHistory, setLoginHistory] = useState([]);
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

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const LevelTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Level ID</TableCell>
        <TableCell>Level </TableCell>
        <TableCell>Department </TableCell>
      </TableRow>
    );
  };
  const SectionTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Section ID</TableCell>
        <TableCell>Section Name</TableCell>
        <TableCell>Level</TableCell>
      </TableRow>
    );
  };
  const SubjectTableTitles = () => {
    return (
      <TableRow>
        {/* <TableCell align="left"></TableCell> */}
        <TableCell>Subject ID</TableCell>
        <TableCell>Subject Name</TableCell>
        <TableCell>Level </TableCell>
      </TableRow>
    );
  };
  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/employees/search/${id}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log("Employees GET : ", json);
          setIsLoading(false);
          setLoadingDialog({ isOpen: false });
          setVal(json);
        }
        const apiLoginHistory = await axiosPrivate.get("/api/loginhistories");
        if (apiLoginHistory?.status === 200) {
          const json = await apiLoginHistory.data;
          setLoginHistory(json);
        }
      } catch (error) {
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate(-1);
          console.log(error.response.data.message);
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
          setIsLoading(false);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
      }
    };
    getUsersDetails();
  }, []);

  console.log("testalng:", val);
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
      {isloading ? (
        <></>
      ) : val.firstName || val.email ? (
        <Box
          className="deleteScroll"
          gap={1}
          display="grid"
          paddingBottom="20px"
          sx={{
            height: { xs: "750px", sm: "100%" },
            width: { xs: "100%", sm: "100%" },
            gridTemplateColumns: { xs: "1fr", sm: "1fr 3fr" },
            padding: { xs: "0 20px 20px 20px", sm: "3px 3px" },
            overflow: "scroll",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="center"
              padding="20px"
              gap={2}
            >
              <Paper
                sx={{
                  borderRadius: "65px",
                  width: "130px",
                  height: "130px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="profile-user"
                  sx={{ width: "100%", height: "100%" }}
                  src={val?.imgURL}
                  style={{
                    cursor: "pointer",
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />
              </Paper>
              <Typography
                variant="h2"
                fontWeight="bold"
                textTransform="capitalize"
                sx={{ mt: "20px" }}
                textAlign="center"
              >
                {val?.middleName
                  ? val?.firstName +
                    " " +
                    val?.middleName.charAt(0) +
                    ". " +
                    val?.lastName
                  : val?.firstName + " " + val?.lastName}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={1}
              >
                <Typography
                  variant="h4"
                  textTransform="capitalize"
                  fontWeight="bold"
                >
                  {val?.empID}
                </Typography>
                <Typography variant="h4" color="primary">
                  {val?.email}
                </Typography>
                {val.empType.map((item, i) => {
                  return (
                    <ul
                      style={{
                        display: "flex",
                        padding: "0",
                        listStyle: "none",
                      }}
                    >
                      {item === 2001 ? (
                        <li>
                          <Paper
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              borderRadius: "10px",
                              padding: "10px 20px",
                              backgroundColor: colors.secondary[500],
                              color: colors.blackOnly[100],
                              alignItems: "center",
                            }}
                          >
                            <AdminPanelSettings />
                            <Typography sx={{ ml: "10px" }}>Admin</Typography>
                          </Paper>
                        </li>
                      ) : item === 2002 ? (
                        <li>
                          <Paper
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              borderRadius: "10px",
                              padding: "10px 20px",
                              backgroundColor: colors.primary[900],
                              color: colors.whiteOnly[100],
                              alignItems: "center",
                            }}
                          >
                            <Badge />
                            <Typography sx={{ ml: "10px" }}>Teacher</Typography>
                          </Paper>
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  );
                })}
                <Typography sx={{ fontSize: "12px" }}>
                  Date created : {[" "]}
                  {format(new Date(val?.createdAt), "MMMM dd, yyyy")}
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ position: "relative" }} elevation={2}>
            <Box sx={{ position: "absolute", top: 5, right: 5 }}>
              <IconButton onClick={handleClick}>
                <MoreVert sx={{ fontSize: "20pt" }} />
                {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <Link
                    to={`/admin/faculty/edit/${val?.empID}`}
                    style={{
                      alignItems: "center",
                      color: colors.black[100],
                      textDecoration: "none",
                    }}
                  >
                    Edit Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={`/admin/faculty/load/${val?.empID}`}
                    style={{
                      alignItems: "center",
                      color: colors.black[100],
                      textDecoration: "none",
                    }}
                  >
                    Assign Loads
                  </Link>
                </MenuItem>
              </Menu>
              {/* <Link
                to={`/faculty/edit/${val?.empID}`}
                style={{
                  alignItems: "center",
                  color: colors.black[100],
                  textDecoration: "none",
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: "20px",
                    padding: "5px 10px",
                  }}
                >
                  <ModeEditOutlineOutlined />
                </Paper>
              </Link> */}
            </Box>
            <Box padding="20px" display="grid" gridTemplateRows="1fr">
              <Box
                sx={{ display: "flex", flexDirection: "column" }}
                padding="10px 10px 0 10px"
              >
                <Typography variant="h4">Employee Profile</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Gender : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.gender}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Date of Birth : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.dateOfBirth
                        ? format(new Date(val?.dateOfBirth), "MMMM dd, yyyy")
                        : ""}
                    </Typography>
                  </Box>

                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Civil Status : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.civilStatus}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Nationality : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.nationality}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Religion : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.religion}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 0 10px">
                <Typography variant="h4"> Address Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Address : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.address}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>City : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.city}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Province : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.province}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 0 10px">
                <Typography variant="h4">Contact Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Email : </Typography>
                    <Typography ml="10px" fontWeight="bold">
                      {val?.email}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Telephone : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.telephone}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Mobile Number : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.mobile}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "20px" }} />
              </Box>
              <Box padding="20px 10px 10px 10px">
                <Typography variant="h4">Emergency Information</Typography>
                <Box
                  mt="10px"
                  display="grid"
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr 1fr",
                    },
                  }}
                >
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Name : </Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyName}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Relationship :</Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyRelationship}
                    </Typography>
                  </Box>
                  <Box mt="10px" display="flex" flexDirection="row">
                    <Typography>Contact Number :</Typography>
                    <Typography
                      ml="10px"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {val?.emergencyNumber}{" "}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography>Login History</Typography>

            <Grid
              mt="10px"
              container
              gap={2}
              sx={{ width: "350px" }}
              direction="column"
              alignItems="center"
              justify="center"
            >
              {loginHistory &&
                loginHistory
                  .slice(0, 5)
                  .filter((fill) => {
                    return fill.username === id;
                  })
                  .map((val, key) => (
                    <Paper
                      elevation={2}
                      sx={{
                        display: "flex",
                        padding: "10px 15px",
                        borderRadius: "20px",
                        width: "100%",
                      }}
                    >
                      <Typography textTransform="capitalize">
                        {format(
                          new Date(val.createdAt),
                          // "kk:mm a  MMM dd, yyyy"
                          " hh:mm a.  EE, MM-dd-yyyy"
                        )}
                        {/* {val.createdAt} */}
                      </Typography>
                    </Paper>
                  ))}
            </Grid>
          </Paper>
          <Paper>
            <AppBar
              position="static"
              sx={{ backgroundColor: colors.appBar[100] }}
              enableColorOnDark
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="full width tabs example"
                variant="fullWidth"
              >
                <Tab
                  label="Levels"
                  {...a11yProps(0)}
                  sx={{ fontWeight: "bold" }}
                />
                <Tab
                  label="Sections"
                  {...a11yProps(1)}
                  sx={{ fontWeight: "bold" }}
                />
                <Tab
                  label="Subjects"
                  {...a11yProps(2)}
                  sx={{ fontWeight: "bold" }}
                />
              </Tabs>
            </AppBar>
            <TabPanel sx={{ width: "100%" }} value={value} index={0}>
              <Box width="100%">
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <LevelTableTitles />
                    </TableHead>
                    <TableBody></TableBody>
                  </Table>
                </TableContainer>
                <Divider />

                <Box
                  display="flex"
                  width="100%"
                  sx={{ flexDirection: "column" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isloading ? <Loading /> : <></>}
                </Box>
                <Box display="flex" width="100%" marginTop="20px"></Box>
              </Box>
            </TabPanel>
            <TabPanel sx={{ width: "100%" }} value={value} index={1}>
              <Box width="100%">
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <SectionTableTitles />
                    </TableHead>
                    <TableBody></TableBody>
                  </Table>
                </TableContainer>
                <Divider />

                <Box
                  display="flex"
                  width="100%"
                  sx={{ flexDirection: "column" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isloading ? <Loading /> : <></>}
                </Box>
                <Box display="flex" width="100%" marginTop="20px"></Box>
              </Box>
            </TabPanel>
            <TabPanel sx={{ width: "100%" }} value={value} index={2}>
              <Box width="100%">
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <SubjectTableTitles />
                    </TableHead>
                    <TableBody></TableBody>
                  </Table>
                </TableContainer>
                <Divider />

                <Box
                  display="flex"
                  width="100%"
                  sx={{ flexDirection: "column" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isloading ? <Loading /> : <></>}
                </Box>
                <Box display="flex" width="100%" marginTop="20px"></Box>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      ) : (
        <NotFound404 />
      )}
    </Box>
  );
};

export default FacultyProfile;
