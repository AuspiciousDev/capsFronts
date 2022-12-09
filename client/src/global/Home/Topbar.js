import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import deped from "../../images/Logo-DepEd-1.png";
import logo from "../../images/LOGO.png";
import { borderColor, color } from "@mui/system";
import { ColorModeContext, tokens } from "../../theme";
import { styled, alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          backgroundColor: colors.Sidebar[100],
          p: { xs: "7.5px 10px", sm: "30px 45px" },
          // boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
          borderRadius: "20px 20px 0 0 ",
          boxShadow: `${colors.primary[500] + 40} 1.95px 1.95px 2.6px;`,
          borderBottom: `solid 1px ${colors.primary[500] + 50}`,
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box gap={3} sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              alignItems: "center",
              color: colors.black[100],
              textDecoration: "none",
            }}
          >
            <img
              alt="web-logo"
              src={logo}
              style={{ width: "60px", objectFit: "contain" }}
            />
          </Link>
          <Typography variant="h2">Student Portal</Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "400px" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            mt: { xs: 2, sm: 0 },
            alignItems: "center",
            textAlign: "center",
            "& a > .MuiPaper-root": {
              p: "10px 45px",
              borderRadius: "20px",
            },
          }}
          gap={3}
        >
          <Link
            to="/register"
            style={{
              alignItems: "center",
              textDecoration: "none",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            <Paper
              sx={{
                border: `1px solid `,
                borderColor: colors.primary[950],
                backgroundColor: colors.Sidebar[100],
                color: colors.PrimaNwhite[100],
              }}
            >
              <Typography variant="h5">Sign up</Typography>
            </Paper>
          </Link>
          <Link
            to="/login"
            style={{
              alignItems: "center",
              textDecoration: "none",

              fontWeight: "bold",
            }}
          >
            <Paper
              sx={{
                backgroundColor: colors.primary[950],
                color: "white",
              }}
            >
              <Typography variant="h5">Login</Typography>
            </Paper>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Topbar;
