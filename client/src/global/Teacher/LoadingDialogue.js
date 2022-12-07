import React from "react";
import "./Loading.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
} from "@mui/material";
const LoadingDialogue = (props) => {
  const { loadingDialog, setLoadingDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setLoadingDialog({ ...loadingDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={loadingDialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 5 }}>
        {/* <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}{" "}
        {/* <div class="lds-hourglass"></div> */}
        <span className="loader"></span>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialogue;
