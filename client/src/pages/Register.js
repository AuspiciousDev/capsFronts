import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Person,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Container,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import "../App.css";
import background from "../images/bluevector.jpg";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "../api/axios";
import ErrorDialogue from "../global/ErrorDialogue";
import SuccessConfirmDialogue from "../global/SuccessConfirmDialogue";
import LoadingDialogue from "../global/LoadingDialogue";

import Topbar from "../global/Home/Topbar";
import backgroundImage from "../images/school1.jpg";
const Register = () => {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [usernameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successConfirmDialog, setSuccessConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (password !== confPassword) {
      return (
        setPasswordError(true),
        setConfPasswordError(true),
        setFormError(true),
        setFormErrorMessage("Password doesn't match!"),
        setLoadingDialog({ isOpen: false })
      );
    }
    if (password.length < 8) {
      return (
        setPasswordError(true),
        setConfPasswordError(true),
        setFormError(true),
        setFormErrorMessage("Password must be at least 8 characters!"),
        setLoadingDialog({ isOpen: false })
      );
    }
    const data = {
      username,
      email,
      password,
    };
    console.log(data);
    if (!usernameError && !emailError && !passwordError && !confPasswordError) {
      try {
        const response = await axios.post(
          "/auth/register",
          JSON.stringify(data)
        );

        if (response.status === 200) {
          const json = await response.data;
          console.log("response;", json);
          setUsername("");
          setEmail("");
          setPassword("");
          setConfPassword("");
          setLoadingDialog({ isOpen: false });
          setSuccessConfirmDialog({
            isOpen: true,
            title: `Registration Success!`,
            message: `${json.message}`,
            onConfirm: () => {
              navigate("/");
            },
          });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setFormError(true);
          setUserNameError(true);
          setEmailError(true);
          setPasswordError(true);
          setConfPasswordError(true);
          setFormErrorMessage(error.response.data.message);
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
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
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5)),
      url(${backgroundImage})`,
        backgroundSize: "cover",
        padding: { xs: 1, sm: 8 },
      }}
    >
      <SuccessConfirmDialogue
        successConfirmDialog={successConfirmDialog}
        setSuccessConfirmDialog={setSuccessConfirmDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      {/* <img className="login-background" src={background} alt="" /> */}

      {/* <pre>{JSON.stringify(formValues, undefined, 2)}</pre> */}

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
                mb: 2,
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              Register Account
            </Typography>

            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  required
                  autoComplete="off"
                  label="Username"
                  variant="outlined"
                  value={username}
                  error={usernameError}
                  onChange={(e) => {
                    setFormError(false);
                    setUserNameError(false);
                    setEmailError(false);
                    setPasswordError(false);
                    setConfPasswordError(false);
                    setUsername(e.target.value);
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  type="email"
                  id="outlined-basic"
                  label=" Email"
                  variant="outlined"
                  value={email}
                  error={emailError}
                  onChange={(e) => {
                    setFormError(false);
                    setUserNameError(false);
                    setEmailError(false);
                    setPasswordError(false);
                    setConfPasswordError(false);
                    setEmail(e.target.value);
                  }}
                />

                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  variant="outlined"
                  autoComplete="off"
                  value={password}
                  error={passwordError}
                  onChange={(e) => {
                    setFormError(false);
                    setPasswordError(false);
                    setConfPasswordError(false);
                    setPassword(e.target.value);
                  }}
                  InputProps={{
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
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="confPassword"
                  label="Confirm Password"
                  variant="outlined"
                  autoComplete="off"
                  value={confPassword}
                  error={confPasswordError}
                  helperText={
                    formError && (
                      <Typography color="error">{formErrorMessage}</Typography>
                    )
                  }
                  onChange={(e) => {
                    setFormError(false);
                    setPasswordError(false);
                    setConfPasswordError(false);
                    setConfPassword(e.target.value);
                  }}
                  InputProps={{
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

                <input
                  disabled={
                    usernameError ||
                    emailError ||
                    passwordError ||
                    confPasswordError
                  }
                  className="login-btn"
                  type="submit"
                />
              </Box>
            </form>
            <div className="container-footer">
              <p>Don't have account yet?</p>
              <Link to="/login">
                <span>Login</span>
              </Link>
              {/* <Link to="/register">Register here</Link> */}
            </div>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
