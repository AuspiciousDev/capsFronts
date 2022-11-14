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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
const ConfirmDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { confirmDialog, setConfirmDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setConfirmDialog({ ...confirmDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={confirmDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "0 30px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: colors.secondary[500] }}
          />
          <Typography variant="h3" >
            Confirm Changes!
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ margin: "0 20px" }}>
        <Typography variant="h4">{confirmDialog.title}</Typography>
        <Typography variant="h5">{confirmDialog.message}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: "10px",
          gap: 2,
          padding: "10px 50px",
        }}
      >
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={confirmDialog.onConfirm}
        >
          Confirm
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialogue;
