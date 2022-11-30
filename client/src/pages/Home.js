import React from "react";
import "./Home.css";
import { Box, colors, Paper, Typography, useTheme } from "@mui/material";
import Topbar from "../global/Home/Topbar";
import deped from "../images/bsu1.jpg";
import { ColorModeContext, tokens } from "../theme";
import { Link } from "react-router-dom";
import { KeyboardArrowRightOutlined } from "@mui/icons-material";
const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const styles = {
    boxContainer: {
      backgroundImage: `url(${deped})`,
    },
  };
  return (
    <div>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5)),
         url(${deped})`,
          backgroundSize: "cover",
          margin: "auto",
          padding: "50px",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <Topbar />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 7fr",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box display="flex" flexDirection="column" gap={3}>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h1" fontWeight="bold">
                    Rutherford Academy
                  </Typography>
                  <Typography variant="h2">Student Portal</Typography>
                </Box>
                <Box display="flex" gap={3}>
                  <Paper
                    sx={{
                      width: "100%",
                      p: "15px 30px",
                      borderRadius: "30px",
                      border: `1px solid `,
                      borderColor: colors.primary[950],
                      backgroundColor: colors.Sidebar[100],
                    }}
                  >
                    <Link
                      to="/login"
                      style={{
                        alignItems: "center",
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: colors.PrimaNwhite[100],
                      }}
                    >
                      <Box display="flex" sx={{ alignItems: "center" }} gap={1}>
                        <Typography variant="h4" fontWeight="bold">
                          See your grades now!
                        </Typography>{" "}
                        <KeyboardArrowRightOutlined />
                      </Box>
                    </Link>
                  </Paper>
                </Box>
              </Box>
            </Box>

            <img
              // src={deped}
              src={"https://bulsu.edu.ph/resources/gallery/43/01.jpg"}
              alt=""
              style={{
                width: "100%",
                height: "685px",
                float: "right",
                objectFit: "cover",
              }}
            />
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Home;
