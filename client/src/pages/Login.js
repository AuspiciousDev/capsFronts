import React, { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Paper,
  Box,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";
import {
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonOutline,
} from "@mui/icons-material";
import "../App.css";

import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "./../api/axios";
import Topbar from "../global/Home/Topbar";

import ErrorDialogue from "../global/ErrorDialogue";
import LoadingDialogue from "../global/LoadingDialogue";
import deped from "../images/school1.jpg";
const LOGIN_URL = "/auth";
const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { auth, setAuth, persist, setPersist } = useAuth();
  console.log("Login", auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

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
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);
  useEffect(() => {
    const inputs = document.querySelectorAll(".input");
    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((input) => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (!usernameError && !passwordError) {
      try {
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ user: username, pwd: password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const loginHistory = await axios.post(
          "api/loginhistories/register",
          JSON.stringify({ username }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log(loginHistory?.data);
        console.log(JSON.stringify(response.data));
        // console.log(JSON.stringify(response));
        const accessToken = response.data?.accessToken;
        const roles = response.data?.roles;
        // if (roles.includes(2003)) {
        //   return (
        //     setUsernameError(true),
        //     setPasswordError(true),
        //     setLoadingDialog({ isOpen: false }),
        //     setErrorDialog({
        //       isOpen: true,
        //       message: `Unauthorized access!`,
        //     })
        //   );
        // } else {
        setAuth({ username, password, roles, accessToken });
        setUsername("");
        setPassword("");
        console.log(username);
        console.log(response);
        console.log(roles);
        console.log("from:", from);
        setLoadingDialog({ isOpen: false });
        from === "/" && roles.includes(2001)
          ? navigate("/admin", { replace: true })
          : from === "/" && roles.includes(2002)
          ? navigate("/teacher", { replace: true })
          : from === "/" && roles.includes(2003)
          ? navigate("/student", { replace: true })
          : navigate(from, { replace: true });
        // }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
        } else if (error.response.status === 400) {
          setUsernameError(true);
          setPasswordError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.message}`,
          });
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  return (
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
        padding: 5,
      }}
    >
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      <Paper
        sx={{
          // display: "flex",
          // justifyContent:"center",
          // alignItems:'center',
          display: "flex" /*added*/,
          flexDirection: "column" /*added*/,
          width: "100%",
          height: "100%",
          background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5))`,
          borderRadius: 5,
        }}
      >
        <Topbar />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 5,
              backgroundColor: colors.black[900],
              borderRadius: 5,
            }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              Login to your Account
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  required
                  fullWidth
                  type="text"
                  label="Username"
                  variant="outlined"
                  autoComplete="off"
                  error={usernameError}
                  value={username}
                  onChange={(e) => {
                    setUsernameError(false);
                    setPasswordError(false);
                    setUsername(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  variant="outlined"
                  error={passwordError}
                  className="register-input"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setUsernameError(false);
                    setPasswordError(false);
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="persist"
                    onChange={togglePersist}
                    checked={persist}
                  />
                  <label htmlFor="persist">Remember me</label>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </Box>
              <input className="login-btn" type="submit" />
              <div className="container-footer">
                <Typography>Don't have account yet?</Typography>
                <Link to="/register">
                  <span color="primary">Register</span>
                </Link>
              </div>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
