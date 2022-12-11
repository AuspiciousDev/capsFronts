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

const ImportDataDialogue = (props) => {
  // const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [file, setFile] = useState();
  const { importDataDialog, setImportDataDialog } = props;
  const handleClose = (event, reason) => {};
  const handleSubmit = async (e) => {};
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={importDataDialog.isOpen}
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
          <Typography variant="h4">{importDataDialog.title}</Typography>
          <Typography variant="h5">{importDataDialog.message}</Typography>
          <form onSubmit={""}>
            <input type="file" accept={".csv"} name="csv" />
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ImportDataDialogue;
