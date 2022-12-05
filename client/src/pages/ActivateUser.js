import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import axios from "../api/axios";
import { useState } from "react";
import ConfirmDialogue from "../global/ConfirmDialogue";
import SuccessDialogue from "../global/SuccessDialogue";
import ErrorDialogue from "../global/ErrorDialogue";
import ValidateDialogue from "../global/ValidateDialogue";
import LoadingDialogue from "../global/LoadingDialogue";

const ActivateUser = () => {
  const { activation_token } = useParams();
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [activate, setActivate] = useState(false);
  const navigate = useNavigate();

  const goLogin = async () => {
    navigate("/login");
  };

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

  const activation = async () => {
    try {
      const data = { activation_token };
      setLoadingDialog({ isOpen: true });
      const activateAccount = await axios.post(
        "/auth/activation",
        JSON.stringify(data)
      );
      if (activateAccount.status === 200) {
        setLoadingDialog({ isOpen: false });
        setSuccessDialog({
          isOpen: true,
          message: `User activated successfully!`,
        });
        setActivate(true);
      }
    } catch (error) {
      setActivate(false);
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `no server response`,
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 409) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 500) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `Invalid activation token.`,
        });
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
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
      <Typography variant="h1" fontWeight="bold">
        Account activation
      </Typography>
      <Typography variant="h3" textAlign="center">
        A proposed capstone for intended to be used by Junior Highschool <br />
        students and teachers to have a portal to see their grades online
        <br />
        without physical papers or interaction
      </Typography>
      <br />
      {activate ? (
        <Button type="button" variant="contained" onClick={goLogin}>
          Login
        </Button>
      ) : (
        <Button type="button" variant="contained" onClick={activation}>
          Activate
        </Button>
      )}
    </Box>
  );
};

export default ActivateUser;
