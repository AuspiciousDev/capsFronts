import React, { useEffect } from "react";
import { useState } from "react";
import { FormControl, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "../../api/axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  PrivacyTipOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonOutline,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
const VERIFY_URL = "/auth/verify";

const ValidateDialogue = (props) => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [showUsername, setShowUsername] = useState(false);
  const handleClickShowUsername = () => setShowUsername(!showUsername);
  const handleMouseDownUsername = () => setShowUsername(!showUsername);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const { validateDialog, setValidateDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return (
        setPassword(""),
        setPasswordError(false),
        setValidateDialog({ ...validateDialog, isOpen: false })
      );
  };
  const handleClose2 = (event, reason) => {
    return (
      setPassword(""),
      setPasswordError(false),
      setValidateDialog({ ...validateDialog, isOpen: false })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordError) {
      try {
        const response = await axios.post(
          VERIFY_URL,
          JSON.stringify({ user: auth.username, pwd: password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          console.log(response.data.message);
          validateDialog.onConfirm();
          setValidateDialog({ isOpen: false });
          setPassword("");
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setPasswordError(true);
        } else if (error.response.status === 401) {
          setPasswordError(true);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={validateDialog.isOpen}
      onClose={handleClose}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* <Typography>Confirm Alert</Typography> */}

        <DialogTitle sx={{ margin: "0 30px" }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* <Typography>Confirm Alert</Typography> */}
            <PrivacyTipOutlined
              sx={{ fontSize: "100px", color: colors.secondary[500] }}
            />
            <Typography variant="h3">Confirm Changes!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ margin: "0 20px" }}>
          <Typography variant="h4">{validateDialog.title}</Typography>
          <Typography variant="h5">{validateDialog.message}</Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                disabled
                // type={showUsername ? "text" : "password"}
                value={auth.username}
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
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                variant="outlined"
                placeholder="Password"
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
              <DialogActions
                sx={{
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  Confirm
                </Button>
                <Button fullWidth variant="contained" onClick={handleClose2}>
                  Cancel
                </Button>
              </DialogActions>
            </Box>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ValidateDialogue;
