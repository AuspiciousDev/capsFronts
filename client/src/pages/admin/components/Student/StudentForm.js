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
  Paper,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import StudentTable from "./StudentTable";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import { FileUploadOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import { useNavigate, useLocation } from "react-router-dom";
const StudentForm = () => {
  const CHARACTER_LIMIT = 10;
  const STUDID_LIMIT = 12;
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
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

  const [studIDError, setStudIDError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [formError, setFormError] = useState(false);

  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = {
      studID,
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      gender,
    };

    console.log(student);
    !studID ? setStudIDError(true) : setStudIDError(false);
    !firstName ? setFirstNameError(true) : setFirstNameError(false);
    !lastName ? setLastNameError(true) : setLastNameError(false);
    !dateOfBirth ? setDateOfBirthError(true) : setDateOfBirthError(false);
    !gender ? setGenderError(true) : setGenderError(false);

    if (
      !studIDError &&
      !firstNameError &&
      !lastNameError &&
      !dateOfBirthError &&
      !genderError
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
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.response.status === 403) {
          navigate("/login", { state: { from: location }, replace: true });
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setStudIDError(true);
          console.log(error.response.data.message);
        } else {
          console.log(error);
          console.log(error.response);
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
  };
  const clearForm = () => {
    setIsFormOpen(false);
  };
  return (
    <>
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      {!isFormOpen ? (
        <StudentTable />
      ) : (
        <Box
          width="100%"
          height="750px"
          flexDirection="column"
          justifyContent="center"
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
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{
                    borderLeft: `5px solid ${colors.primary[900]}`,
                    paddingLeft: 2,
                  }}
                >
                  STUDENTS FORM
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <Button
                  type="button"
                  startIcon={<FileUploadOutlined />}
                  onClick={() => {
                    navigate("/admin/student/importMany");
                  }}
                  variant="contained"
                  sx={{
                    width: { xs: "100%", sm: "200px" },
                    height: "50px",
                    marginLeft: { xs: "0", sm: "20px" },
                    marginTop: { xs: "20px", sm: "0" },
                  }}
                >
                  <Typography variant="h6" fontWeight="500">
                    Import
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={2} sx={{ p: "20px", mt: "10px" }}>
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
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                    gap: "20px",
                  }}
                >
                  <TextField
                    required
                    autoComplete="off"
                    variant="outlined"
                    label="Student ID/LRN"
                    placeholder="12 character Student ID/LRN"
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
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
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
                      setMiddleName(e.target.value);
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
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
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

              <Box
                display="flex"
                sx={{ justifyContent: { xs: "center", sm: "end" } }}
                height="70px"
                gap={2}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ width: "250px", height: "50px" }}
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
          </Paper>
          <br />
        </Box>
      )}
    </>
  );
};

export default StudentForm;
