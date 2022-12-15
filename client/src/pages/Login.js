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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [timeOutError, setTimeOutError] = useState(false);
  const [loginCountLeft, setLoginCountLeft] = useState(3);
  const [timeOut, setTimeOut] = useState(0);
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

  React.useEffect(() => {
    let minutes;
    let seconds;
    let sendTTL;
    timeOut > 0 && setTimeout(() => setTimeOut(timeOut - 1), 1000);
    minutes = Math.floor(timeOut / 60);
    seconds = timeOut - minutes * 60;
    sendTTL = minutes
      ? `Login Timeout : ${minutes} minutes ${seconds} seconds`
      : `Login Timeout : ${seconds} seconds`;
    setFormErrorMessage(sendTTL);
    timeOut > 0 ? setTimeOutError(true) : setTimeOutError(false);
    timeOut > 0 ? setFormError(true) : setFormError(false);
  }, [timeOut]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameError && !passwordError) {
      setLoadingDialog({ isOpen: true });
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
        setLoginCountLeft((e) => (e -= 1));
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `You have surpassed 3 login attempts , Please wait for ${error.response.data.message} to login again`,
          });
          setTimeOut(error.response.data.time);
          setFormError(true);
          setTimeOutError(true);
        } else if (error.response.status === 429) {
          setErrorDialog({
            isOpen: true,
            message: `${error?.response?.data?.message || error?.response}`,
          });
          setTimeOut(600);
          setFormError(true);
          setTimeOutError(true);
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
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
        padding: { xs: 1, sm: 8 },
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
              width: { xs: "100vmin", sm: "50vmin" },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 5,
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              Login to your Account
            </Typography>

            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <Box
                display="flex"
                sx={{ width: "100%" }}
                flexDirection="column"
                gap={2}
              >
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="text"
                  label="Username"
                  variant="outlined"
                  autoComplete="off"
                  error={usernameError || timeOutError}
                  disabled={timeOutError}
                  value={username}
                  onChange={(e) => {
                    setUsernameError(false);
                    setPasswordError(false);
                    setFormError(false);
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
                  disabled={timeOutError}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  variant="outlined"
                  error={passwordError || timeOutError}
                  className="register-input"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setUsernameError(false);
                    setPasswordError(false);
                    setPassword(e.target.value);
                    setFormError(false);
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
                <Typography color="error">
                  {formError && formErrorMessage}
                </Typography>
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
              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={
                  usernameError || passwordError || formError || timeOutError
                }
                sx={{ borderRadius: 4, height: 45, m: "5px 0" }}
              >
                <Typography variant="h5">Login</Typography>
              </Button>
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
