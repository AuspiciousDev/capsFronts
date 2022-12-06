import React from "react";
import "./Topbar.css";
import { AccountCircle } from "@mui/icons-material";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";

import {
  Typography,
  Box,
  IconButton,
  useTheme,
  MenuItem,
  Menu,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useContext, useState, useEffect, ref } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  DashboardOutlined,
  GradeOutlined,
  GroupsOutlined,
  BadgeOutlined,
  AutoStoriesOutlined,
  MenuOutlined,
  StairsOutlined,
  SchoolOutlined,
  CorporateFareOutlined,
  CalendarMonthOutlined,
  CoPresentOutlined,
  ManageAccountsOutlined,
  Person,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { useScrollDirection } from "../hooks/useScrollDirection";
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const [dashOpen, setDashOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const StyledBox = styled(Box)(({ theme }) => ({
    "&.MuiBox-root ": { padding: "20px 10px 20px 10px" },
    "&.MuiBox-root > a": {
      color: colors.blackOnly[100],
      textDecoration: "none",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  }));
  const StyledBox2 = styled(Box)(({ theme }) => ({
    "&.MuiBox-root ": {
      width: "100%",
      display: "flex",
      alignItems: "center",
      margin: "2.5px 0 ",
      padding: "10px 10px",
      boxShadow:
        "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    },
  }));

  return (
    <Box>
      <Box
        display={{ xs: "none", sm: "flex" }}
        width="100%"
        backgroundColor={colors.Sidebar[100]}
        p={{ xs: "7.5px 10px", sm: "7.5px 20px" }}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" textTransform="uppercase">
          Student Portal
        </Typography>

        <Box
          justifySelf="flex-end"
          display="grid"
          gridTemplateColumns="1fr"
          gap={2}
        >
          <IconButton onClick={handleClick}>
            <SettingsOutlinedIcon
              sx={{
                color: colors.primary[900],
                fontSize: "20pt",
                transition: "transform 0.15s ease-in-out",
                "&:hover": {
                  transform: "scale3d(1.5, 1.5, 1)",
                  animation: "rotation 1s linear infinite",
                  "@keyframes rotation": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                  color: colors.primary[900],
                },
              }}
            />
            {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
          </IconButton>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={colorMode.toggleColorMode} disableRipple sx={{}}>
              {theme.palette.mode === "dark" ? (
                <>
                  <DarkModeOutlinedIcon
                    sx={{
                      fontSize: "20pt",
                    }}
                  />
                  Dark Mode
                </>
              ) : (
                <>
                  <LightModeOutlinedIcon sx={{ fontSize: "20pt" }} />
                  Light Mode
                </>
              )}
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(`/admin/changePassword`);
              }}
              disableRipple
            >
              <ManageAccountsOutlined />
              Change Password 
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
              }}
              disableRipple
            >
              <LogoutOutlinedIcon />
              Logout
            </MenuItem>
          </StyledMenu>
        </Box>
      </Box>
      <Box
        display={{ xs: "flex", sm: "none" }}
        width="100%"
        backgroundColor={colors.Sidebar[100]}
        p={{ xs: "7.5px 10px", sm: "7.5px 20px" }}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" textTransform="uppercase">
          Student Portal
        </Typography>

        <Box
          justifySelf="flex-end"
          display="grid"
          gridTemplateColumns="1fr "
          gap={2}
        >
          <Box>
            <IconButton onClick={() => setDashOpen((prev) => !prev)}>
              <MenuOutlined
                sx={{ color: colors.primary[900], fontSize: "20pt" }}
              />
              {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
            </IconButton>
            {dashOpen && (
              <IconButton onClick={handleClick}>
                <SettingsOutlinedIcon
                  sx={{
                    color: colors.primary[900],
                    fontSize: "20pt",
                    "&:hover": {
                      transform: "scale3d(1.5, 1.5, 1)",
                      animation: "rotation 1s linear infinite",
                      "@keyframes rotation": {
                        "0%": {
                          transform: "rotate(0deg)",
                        },
                        "100%": {
                          transform: "rotate(360deg)",
                        },
                      },
                    },
                  }}
                />
                {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
              </IconButton>
            )}
          </Box>

          <StyledMenu
            sx={{ display: { xs: "block", sm: "none" } }}
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={colorMode.toggleColorMode} disableRipple>
              {theme.palette.mode === "dark" ? (
                <>
                  <DarkModeOutlinedIcon sx={{ fontSize: "20pt" }} />
                  Dark Mode
                </>
              ) : (
                <>
                  <LightModeOutlinedIcon sx={{ fontSize: "20pt" }} />
                  Light Mode
                </>
              )}
            </MenuItem>
            <MenuItem onClick={() => {}} disableRipple>
              <ManageAccountsOutlined />
              Account
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
              }}
              disableRipple
            >
              <LogoutOutlinedIcon />
              Logout
            </MenuItem>
          </StyledMenu>
        </Box>
      </Box>
      {dashOpen && (
        <Paper>
          <Box
            sx={{
              display: { xs: "grid", sm: "none" },
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <StyledBox
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link to="/">
                <StyledBox2 gap={2}>
                  <DashboardOutlined />
                  <Typography>Dashboard</Typography>
                </StyledBox2>
              </Link>
              <Link to={`grade`}>
                <StyledBox2 gap={2}>
                  <GradeOutlined />
                  <Typography>Grades</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <CoPresentOutlined />
                  <Typography>Enrolled Students</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <SchoolOutlined />
                  <Typography>Students</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <AutoStoriesOutlined />
                  <Typography>Subjects</Typography>
                </StyledBox2>
              </Link>
            </StyledBox>
            <StyledBox
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <BadgeOutlined />
                  <Typography>Faculties</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <GroupsOutlined />
                  <Typography>Sections</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <StairsOutlined />
                  <Typography>Levels</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <CorporateFareOutlined />
                  <Typography>Departments</Typography>
                </StyledBox2>
              </Link>
              <Link

              // to={`/student/record/${val?.studID}/${val?.schoolYearID}`}
              >
                <StyledBox2 gap={2}>
                  <CalendarMonthOutlined />
                  <Typography>School Years</Typography>
                </StyledBox2>
              </Link>
            </StyledBox>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Topbar;
