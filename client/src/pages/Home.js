import React from "react";
import "./Home.css";
import { Box, colors, Paper, Typography, useTheme } from "@mui/material";
import Topbar from "../global/Home/Topbar";
import deped from "../images/school1.jpg";
import homeCover from "../images/school4.jpg";
import school1 from "../images/school1.jpg";
import school2 from "../images/school2.jpg";
import school3 from "../images/school3.jpg";
import school4 from "../images/school4.jpg";
import { tokens } from "../theme";
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
    <Box
      className="mainpage-container"
      sx={{
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5)),
         url(${deped})`,
        backgroundSize: "cover",
        margin: "auto",
        padding: { xs: 1, sm: 8 },
      }}
    >
      <Paper
        sx={{
          display: "flex" /*added*/,
          flexDirection: "column" /*added*/,
          width: "100%",
          height: "100%",
          borderRadius: "10px 10px ",
          background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5))`,
        }}
      >
        <Topbar />

        <Box
          sx={{
            // backgroundColor: "red",
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "3fr 7fr" },
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: { xs: "center", sm: "left" },
                  color: colors.whiteOnly[100],
                }}
              >
                <Typography
                  sx={{
                    borderLeft: `5px solid ${colors.primary[900]}`,
                    paddingLeft: 2,
                  }}
                  fontWeight="bold"
                  variant="h1"
                >
                  Kings Man Academy
                </Typography>
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
                    marginBottom: { xs: 2, sm: 0 },
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

          <Box
            // // src={deped}
            // src={"https://bulsu.edu.ph/resources/gallery/43/01.jpg"}
            // // src={
            // //   "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2Nob29sfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
            // // }
            // alt=""
            // style={{
            //   width: "100%",
            //   objectPosition: "center",
            //   objectFit: "cover",
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              objectFit: "cover",
              borderRadius: "0 0 10px 0 ",
              backgroundSize: "cover",
              // backgroundImage:
              //   " url('https://images.unsplash.com/photo-1569878698889-7bffa1896872?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60')",
              backgroundImage: `url(${homeCover})`,
              // backgroundImage:
              //   " url('https://bulsu.edu.ph/resources/gallery/43/01.jpg')",
              // // backgroundImage:
              //   " url('https://www.sti.edu/cms/images/events/2019/sanjosedelmonte/front_306x191.jpg')",
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
