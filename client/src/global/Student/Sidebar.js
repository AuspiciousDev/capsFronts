import React from "react";

import ExitToAppOutlined from "@mui/icons-material/ExitToAppOutlined";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import deped from "../../images/Logo-DepEd-1.png";
import profilePic from "../../images/profile2.png";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

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
import { useStudentsContext } from "../../hooks/useStudentsContext";

import { useSchoolYearsContext } from "../../hooks/useSchoolYearsContext";
import useMediaQuery from "@mui/material/useMediaQuery";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
        window.location.pathname === "/"
          ? window.location.pathname === to
          : window.location.pathname.substring(1) === to
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

  const { students, studDispatch } = useStudentsContext();
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

  useEffect(() => {
    console.log(auth);
    const getOverviewDetails = async () => {
      try {
        const apiEmp = await axiosPrivate.get("/api/students");
        if (apiEmp?.status === 200) {
          const json = await apiEmp.data;
          console.log(json);
          studDispatch({ type: "SET_STUDENTS", payload: json });
        }
        const response = await axiosPrivate.get("/api/schoolyears");
        if (response.status === 200) {
          const json = await response.data;
          console.log("School Year GET: ", json);
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
    getOverviewDetails();
  }, [studDispatch, yearDispatch]);
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
                  sx={{ width: "50px", height: "50px" }}
                  src={
                    students &&
                    students
                      .filter((data) => {
                        return data.studID === auth.username;
                      })
                      .map((val) => {
                        return val?.imgURL;
                      })
                  }
                  style={{
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
                  sx={{ width: "50px", height: "50px" }}
                  src={
                    students &&
                    students
                      .filter((data) => {
                        return data.studID === auth.username;
                      })
                      .map((val) => {
                        return val?.imgURL;
                      })
                  }
                  style={{
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />

                <Box ml="10px">
                  <Typography
                    variant="h5"
                    width="180px"
                    color={colors.black[50]}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {students &&
                      students
                        .filter((data) => {
                          return data.studID === auth.username;
                        })
                        .map((val) => {
                          return val.firstName + " " + val.lastName;
                        })}
                  </Typography>
                  <Typography color={colors.primary[900]} variant="subtitle2">
                    {auth.roles == 2003 ? "Student" : "User"}
                  </Typography>
                </Box>
              </Box>
            )}
          </SidebarHeader>
          <Box mt="10px">
            <Item
              title="Dashboard"
              to="/student"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="My Grades"
              to="grade"
              icon={<GradeOutlinedIcon />}
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
  );
};

export default Sidebar;
