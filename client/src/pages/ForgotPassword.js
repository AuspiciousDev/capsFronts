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

const LOGIN_URL = "/auth";
const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

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

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          // message: `Registration of ${json.userType} - ${json.username} Success!`,
          message: `${json.message}`,
        });
      }
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        // console.log("Missing Username/Password");
        console.log(error.response.data.message);
        // setErrMsg(error.response.data.message);
      } else if (error.response.status === 401) {
        // console.log("Unauthorized");
        console.log(error.response.data.message);
        // setErrMsg(error.response.data.message);
      } else if (error.response.status === 500) {
        // console.log("Unauthorized");
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else {
        console.log(error);
      }
    }
  };
  return (
    <div className="mainpage-container">
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
      <Container className="container-parent">
        <Box
          className="container-child"
          sx={{ backgroundColor: colors.black[900] }}
        >
          <Typography>Forgot Password</Typography>

          <form onSubmit={handleSubmit}>
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
                onChange={(e) => {
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
            <input className="login-btn" type="submit" />
            <div className="container-footer">
              <Typography>Don't have account yet?</Typography>
              <Link to="/login">
                <span>Login</span>
              </Link>
            </div>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default ForgotPassword;
