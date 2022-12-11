import React, { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import background from "../images/bluevector.jpg";
import "../App.css";

import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "../api/axios";

import ErrorDialogue from "../global/ErrorDialogue";
import SuccessDialogue from "../global/SuccessDialogue";
import LoadingDialogue from "../global/LoadingDialogue";
import backgroundImage from "../images/school1.jpg";
import Topbar from "../global/Home/Topbar";
const LOGIN_URL = "/auth";
const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
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
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  useEffect(() => {
    setErrMsg("");
  }, [email]);
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

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError) {
      try {
        setLoadingDialog({ isOpen: true });

        const forgotPass = await axios.post(
          "auth/forgot-password",
          JSON.stringify({ email }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (forgotPass.status === 200) {
          setLoadingDialog({ isOpen: false });
          const json = await forgotPass.data;
          console.log("response;", json);
          setSuccessDialog({
            isOpen: true,
            message: `${json.message}`,
          });
          setEmailSent(true);
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else if (error.response.status === 401) {
          setFormError(true);
          setEmailError(true);
          setFormErrorMessage(error.response.data.message);
        } else if (error.response.status === 500) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
        }
      }
    } else {
      setErrorDialog({
        isOpen: true,
        message: `Please check your email.`,
      });
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
      {" "}
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
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
                mb: 2,
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              Forgot Password
            </Typography>
            {!emailSent ? (
              <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email"
                    name="password"
                    variant="outlined"
                    className="register-input"
                    autoComplete="off"
                    value={email}
                    error={emailError}
                    onChange={(e) => {
                      setEmailError(false);
                      setFormError(false);
                      setEmail(e.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Typography color="error">
                  {formError && formErrorMessage}
                </Typography>
                <input className="login-btn" type="submit" />
                <div className="container-footer">
                  <Typography variant="h5">Don't have account yet?</Typography>
                  <Link to="/login">
                    <span>Login</span>
                  </Link>
                </div>
              </form>
            ) : (
              <Box>
                <Typography>
                  A mail has been sent to the email that you have provided,
                  Please check your inbox or spam mail to reset your password.
                </Typography>
                <br />
                <Divider />
                <Box className="container-footer" sx={{ mt: 1 }}>
                  <Link to="/">
                    <span>Back to Home page</span>
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
