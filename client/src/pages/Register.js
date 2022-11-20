import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import "../App.css";
import background from "../images/bluevector.jpg";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "../api/axios";
import ErrorDialogue from "../global/ErrorDialogue";
import SuccessDialogue from "../global/SuccessDialogue";

const Register = () => {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [error, setError] = useState(false);

  const [usernameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // const handleKeyUp = (e) => {
  //   const value = e.target;
  //   const
  // };
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confPassword) {
      return (
        setError(true),
        setPasswordError(true),
        setConfPasswordError(true),
        setErrorMessage("Password doesn't match!"),
        console.log(errorMessage)
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
        const response = await axios.post("/register", JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          setSuccessDialog({
            isOpen: true,
            message: "Registration Success!",
          });
        }
      } catch (error) {
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          setUserNameError(true);
          setEmailError(true);
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setError(true);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          setUserNameError(true);
          setEmailError(true);
          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <div>
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      {/* <img className="login-background" src={background} alt="" /> */}
      <Container className="container-parent">
        {/* <pre>{JSON.stringify(formValues, undefined, 2)}</pre> */}

        <Box
          className="container-child"
          sx={{ backgroundColor: colors.black[900] }}
        >
          <p>Register Account</p>

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                required
                autoComplete="off"
                label="Username"
                variant="outlined"
                value={username}
                error={usernameError}
                onChange={(e) => {
                  setUserNameError(false);
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
                  setEmailError(false);
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
                  setError(false);
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
                helperText={error ? errorMessage : ""}
                onChange={(e) => {
                  setError(false);
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
      </Container>
    </div>
  );
};

export default Register;
