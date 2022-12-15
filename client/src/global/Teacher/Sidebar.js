import React from "react";
import "./Sidebar.css";

import ExitToAppOutlined from "@mui/icons-material/ExitToAppOutlined";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import deped from "../../images/Logo-DepEd-1.png";
import profilePic from "../../images/profile2.png";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Logout } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";

import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { tokens } from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import StairsOutlinedIcon from "@mui/icons-material/StairsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CoPresentIconOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import "react-pro-sidebar/dist/css/styles.css";
import { useEmployeesContext } from "../../hooks/useEmployeesContext";
import { useSchoolYearsContext } from "../../hooks/useSchoolYearsContext";
import useMediaQuery from "@mui/material/useMediaQuery";

import ErrorDialogue from "./ErrorDialogue";
import LoadingDialogue from "./LoadingDialogue";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var subLocation = location.pathname;
  // console.log(to);
  // console.log("Sub1:", window.location.pathname);
  // console.log("Sub2:", window.location.pathname.substring(9));
  // console.log("Sub3:", window.location.pathname.slice(8, 15));
  return (
    // <MenuItem
    // active={selected === title}
    // active={window.location.pathname.includes(to)}
    // active={window.location.pathname === to}
    //   style={{
    //     color: colors.black[100],
    //   }}
    //   onClick={() => setSelected(title)}
    //   icon={icon}
    // >
    //   <Typography>{title}</Typography>
    //   <Link to={to} />
    // </MenuItem>

    <MenuItem
      active={
        subLocation === "/teacher"
          ? subLocation.slice(0, 1) === to
          : subLocation.substring(9) === to
      }
      style={{
        color: colors.black[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const matches = useMediaQuery("(min-width:1200px)");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { employees, empDispatch } = useEmployeesContext();
  const { years, yearDispatch } = useSchoolYearsContext();

  const [userName, setUserName] = useState();
  const [userType, setUserType] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [getPath, setPath] = useState("");
  const toggleMenu = (e) => {
    setIsMenuOpen(!isMenuOpen);
  };

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
  useEffect(() => {
    console.log(auth);
    const getOverviewDetails = async () => {
      try {
        const apiEmp = await axiosPrivate.get("/api/employees");
        if (apiEmp?.status === 200) {
          const json = await apiEmp.data;
          empDispatch({ type: "SET_EMPLOYEES", payload: json });
        }
        const response = await axiosPrivate.get("/api/schoolyears");
        if (response.status === 200) {
          const json = await response.data;
          console.log("School Year GET: ", json);
          yearDispatch({ type: "SET_YEARS", payload: json });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
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
        } else if (error.response.status === 409) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
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
    getOverviewDetails();
  }, [empDispatch, yearDispatch]);
  useEffect(() => {
    setIsCollapsed(!matches);
  }, [matches]);
  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        "& .pro-sidebar-inner": {
          background: `${colors.Sidebar[100]} !important`,
          color: `${colors.black[100]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          // color: `${colors.whiteOnly[100]} !important`,
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          backgroundColor: `${colors.primary[950]} !important`,
          color: `${colors.whiteOnly[100]} !important`,
        },
        "& .pro-menu-item.active": {
          backgroundColor: `${colors.primary[900]}!important`,
          color: `${colors.whiteOnly[100]} !important`,
        },
      }}
    >
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />{" "}
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <SidebarHeader>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                color: colors.primary[900],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon
                      style={{
                        color: colors.primary[900],
                      }}
                    />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {isCollapsed && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                m="10px 0"
              >
                <Avatar
                  alt="profile-user"
                  width="50px"
                  height="50px"
                  src={
                    employees &&
                    employees
                      .filter((data) => {
                        return data.empID === auth.username;
                      })
                      .map((val) => {
                        return val?.imgURL;
                      })
                  }
                  style={{
                    cursor: "pointer",
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            )}
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                padding=" 10px 0 10px 15px"
                // backgroundColor={colors.black[900]}
              >
                <Avatar
                  alt="profile-user"
                  width="50px"
                  height="50px"
                  src={
                    employees &&
                    employees
                      .filter((data) => {
                        return data.empID === auth.username;
                      })
                      .map((val) => {
                        return val?.imgURL;
                      })
                  }
                  style={{
                    cursor: "pointer",
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />

                <Box ml="10px">
                  <Link to={`/teacher/faculty/${auth.username}`}>
                    <Typography
                      variant="h5"
                      width="180px"
                      color={colors.black[50]}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {employees &&
                        employees
                          .filter((data) => {
                            return data.empID === auth.username;
                          })
                          .map((val) => {
                            return val.firstName + " " + val.lastName;
                          })}
                    </Typography>
                  </Link>
                  <Typography color={colors.primary[900]} variant="subtitle2">
                    {auth.roles == 2002 ? "Teacher" : ""}
                    {auth.roles == 2001 ? "Admin" : ""}
                  </Typography>
                </Box>
              </Box>
            )}
          </SidebarHeader>
          <Box mt="10px">
            <Item
              title="Dashboard"
              to="/"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Grades"
              to="grade"
              icon={<GradeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Enrolled Students"
              to="active"
              icon={<CoPresentIconOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {!isCollapsed ? (
              <Typography
                variant="h6"
                color={colors.primary[900]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Master List
              </Typography>
            ) : (
              <SidebarHeader />
            )}
            {/* <Item
              title="Users"
              to="user"
              icon={<Person2OutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Students"
              to="student"
              icon={<SchoolOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Subjects"
              to="subject"
              icon={<AutoStoriesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sections"
              to="section"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Levels"
              to="level"
              icon={<StairsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Box display="flex" justifyContent="center" mt="20px">
              {!isCollapsed ? (
                <Typography variant="h3">
                  {years &&
                    years
                      .filter((fill) => {
                        return fill.status === true;
                      })
                      .map((val) => {
                        return val.status === true
                          ? `S.Y. ` + val.schoolYear
                          : "No Active School Year";
                      })}
                </Typography>
              ) : (
                <SidebarHeader />
              )}
            </Box>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
    // <div className="sidebar-container">
    //   <div className="sidebar-image">
    //     <img src={deped} alt="" />
    //   </div>
    //   <ul className="sidebarList">
    //     {SidebarData.map((val, key) => {
    //       if (val.subData) {
    //         return (
    //           <div key={key}>
    //             <li
    //               className="sidebarRow"
    //               key={key}
    //               onClick={() => {
    //                 toggleMenu();
    //                 console.log(window.location.pathname);
    //                 console.log(val.path);
    //               }}
    //             >
    //               <div id="icon"> {val.icon}</div>
    //               <div id="title"> {val.title}</div>
    //               <div id="arrow">
    //                 <ExpandMore />
    //               </div>
    //             </li>
    //             {isMenuOpen &&
    //               val.subData.map((item, itemkey) => (
    //                 <li
    //                   className="sidebarRow sub"
    //                   id={
    //                     window.location.pathname.includes(val.path)
    //                       ? "active"
    //                       : ""
    //                   }
    //                   key={itemkey}
    //                   onClick={() => {
    //                     window.location.pathname = item.path;
    //                     console.log(window.location.pathname);
    //                     console.log(item.path);
    //                     console.log((window.location.pathname = item.path));
    //                   }}
    //                 >
    //                   <div id="icon"> {item.icon}</div>
    //                   <div id="title"> {item.title}</div>
    //                 </li>
    //               ))}
    //           </div>
    //         );
    //       } else {
    //         return (
    //           <li
    //             className="sidebarRow"
    //             id={window.location.pathname.includes(val.path) ? "active" : ""}
    //             key={key}
    //             onClick={() => {
    // navigate(val.path);
    //               console.log(val.path);
    //             }}
    //           >
    //             <div id="icon"> {val.icon}</div>
    //             <div id="title"> {val.title}</div>
    //             <div id="arrow"> </div>
    //           </li>
    //         );
    //       }
    //     })}
    //   </ul>
    //   <div className="logout-div">
    //     <ul className="sidebarList logout">
    //       <li
    //         className="sidebarRow logout"
    //         onClick={() => {
    //           navigate("/login");
    //         }}
    //       >
    //         <div id="icon">
    //           <Logout />
    //         </div>
    //         <div id="title"> Logout</div>
    //         <div id="arrow"> </div>
    //       </li>
    //     </ul>
    //   </div>
    // </div>
  );
};

export default Sidebar;
