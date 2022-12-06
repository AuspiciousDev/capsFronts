import React from "react";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {
  Box,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Tabs,
  Tab,
  ButtonBase,
  AppBar,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  CheckCircle,
  Delete,
  Search,
  Add,
  PersonOutline,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useAuth from "../../hooks/useAuth";

import ConfirmDialogue from "../../global/ConfirmDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
import ValidateDialogue from "../../global/ValidateDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";
import { useNavigate, useLocation, Link } from "react-router-dom";

const ChangePassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);

  const changePassword = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (password !== confPassword) {
      return (
        setPasswordError(true),
        setConfPasswordError(true),
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({
          isOpen: true,
          message: `Password doesn't match!`,
        })
      );
    }
    const data = {
      username: auth.username,
      password: oldPassword,
      newPassword: password,
    };
    try {
      if (!oldPasswordError && !passwordError && !confPasswordError) {
        const response = await axiosPrivate.post(
          "/auth/change-password",
          JSON.stringify(data)
        );

        if (response.status === 200) {
          const json = await response.data;
          console.log("response;", json);
          setOldPassword("");
          setPassword("");
          setConfPassword("");
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            // message: `Registration of ${json.userType} - ${json.username} Success!`,
            message: `${json.message}`,
          });
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `No server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setOldPasswordError(true);
        setPasswordError(true);
        setConfPasswordError(true);
        setConfPassword("");
        setPassword("");
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
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
  };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
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
  const [validateDialog, setValidateDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  return (
    <Box className="contents-container">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            padding: { xs: "10px", sm: "0 10px" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: { sm: "end" },
                justifyContent: { xs: "center", sm: "start" },
                m: { xs: "20px 0" },
              }}
            >
              <Typography variant="h2" fontWeight="bold">
                CHANGE PASSWORD
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Box width="100%">
            <form onSubmit={changePassword} style={{ width: "100%" }}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ width: { xs: "100#", sm: "30%" } }}
              >
                <TextField
                  required
                  type={showOldPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="Current Password"
                  value={oldPassword}
                  error={oldPasswordError}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setOldPasswordError(false);
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
                          onClick={handleClickShowOldPassword}
                          onMouseDown={handleMouseDownOldPassword}
                        >
                          {showOldPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={oldPasswordError ? "Invalid password" : ""}
                />
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="New Password"
                  value={password}
                  error={passwordError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
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
                  helperText={passwordError ? "Invalid password" : ""}
                />

                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="Confirm Password"
                  value={confPassword}
                  error={confPasswordError}
                  onChange={(e) => {
                    setConfPassword(e.target.value);
                    setConfPasswordError(false);
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
                  helperText={confPasswordError ? "Invalid password" : ""}
                />

                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  Confirm
                </Button>
                <Button fullWidth variant="contained" onClick={""}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChangePassword;
