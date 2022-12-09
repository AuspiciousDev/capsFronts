import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import StudentTable from "./StudentTable";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import ValidateDialogue from "../../../../global/ValidateDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
const StudentForm = () => {
  const CHARACTER_LIMIT = 10;
  const STUDID_LIMIT = 10;
  const isLetters = (str) => /^[A-Za-z]*$/.test(str);
  const axiosPrivate = useAxiosPrivate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { subjects, studDispatch } = useStudentsContext();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [studID, setStudID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("12/31/1991");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  const [studIDError, setStudIDError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [formError, setFormError] = useState(false);

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

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const student = {
      studID,
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      gender,
      email,
    };

    console.log(student);
    !studID ? setStudIDError(true) : setStudIDError(false);
    !firstName ? setFirstNameError(true) : setFirstNameError(false);
    !lastName ? setLastNameError(true) : setLastNameError(false);
    !dateOfBirth ? setDateOfBirthError(true) : setDateOfBirthError(false);
    !gender ? setGenderError(true) : setGenderError(false);
    !email ? setEmailError(true) : setEmailError(false);

    if (
      !studIDError &&
      !firstNameError &&
      !lastNameError &&
      !dateOfBirthError &&
      !genderError &&
      !emailError
    ) {
      try {
        const response = await axiosPrivate.post(
          "/api/students/register",
          JSON.stringify(student)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          studDispatch({ type: "CREATE_STUDENT", payload: json });
          setSuccessDialog({
            isOpen: true,
            message: "Student has been added!",
          });
          clearFields();
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(error);
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
        }
      }
    } else {
      console.log("MADAME ERROR");
    }
  };
  const clearFields = () => {
    setStudID("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setSuffix("");
    setDateOfBirth("12/31/1991");
    setGender("");
    setEmail("");
  };
  const clearForm = () => {
    setIsFormOpen(false);
  };
  return (
    <>
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
      {!isFormOpen ? (
        <StudentTable />
      ) : (
        <Box
          className="formContainer"
          display="block"
          width="100%"
          height="800px"
          flexDirection="column"
          justifyContent="center"
        >
          <Box>
            <Typography variant="h2" fontWeight={600}>
              STUDENTS
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {/* <Typography variant="h5">Registration</Typography> */}

            <Box marginBottom="40px">
              <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                Student Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: "1fr 1fr 1fr ",
                  gap: "20px",
                }}
              >
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Student ID"
                  placeholder="10 character Student ID"
                  error={studIDError}
                  value={studID}
                  onChange={(e) => {
                    setStudID(e.target.value);
                    setStudIDError(false);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: colors.black[400] }}
                        >
                          {studID.length}/{STUDID_LIMIT}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: STUDID_LIMIT }}
                  // helperText={`*Input 10 characters only ${studID.length} / ${CHARACTER_LIMIT}`}
                />

                <TextField
                  required
                  type="email"
                  autoComplete="off"
                  variant="outlined"
                  label="Email"
                  value={email}
                  error={emailError}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                  }}
                />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
              Personal Information
            </Typography>
            <Box marginBottom="40px">
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: "1fr 1fr 1fr ",
                  gap: "20px",
                }}
              >
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="First Name"
                  placeholder="Given Name"
                  error={firstNameError}
                  value={firstName}
                  onChange={(e) => {
                    if (isLetters(e.target.value)) {
                      setFirstName(e.target.value);
                    }
                  }}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  label="Middle Name"
                  placeholder="Optional"
                  value={middleName}
                  onChange={(e) => {
                    if (isLetters(e.target.value)) {
                      setMiddleName(e.target.value);
                    }
                  }}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Last Name"
                  placeholder="Last Name"
                  error={lastNameError}
                  value={lastName}
                  onChange={(e) => {
                    if (isLetters(e.target.value)) {
                      setLastName(e.target.value);
                    }
                  }}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  label="Suffix"
                  placeholder="Sr./Jr./III"
                  value={suffix}
                  onChange={(e) => {
                    if (isLetters(e.target.value)) {
                      setSuffix(e.target.value);
                    }
                  }}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
              </Box>

              <Box sx={{ mb: "40px" }}>
                <Box
                  sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: "1fr 1fr 1fr ",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date of Birth"
                      inputFormat="MM/DD/YYYY"
                      error={dateOfBirthError}
                      value={dateOfBirth}
                      onChange={handleDate}
                      renderInput={(params) => (
                        <TextField required disabled {...params} />
                      )}
                    />
                  </LocalizationProvider>

                  <FormControl required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      error={genderError}
                      label="Gender"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box marginTop="20px"></Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="end" height="70px" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ width: "250px", height: "50px", ml: "20px" }}
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ width: "250px", height: "50px" }}
                onClick={() => {
                  clearForm();
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};

export default StudentForm;
