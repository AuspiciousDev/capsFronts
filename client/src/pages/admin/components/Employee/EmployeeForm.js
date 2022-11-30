import React, { useState, useEffect } from "react";
import axios from "axios";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

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
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import EmployeeTable from "./EmployeeTable";

import { useSectionsContext } from "../../../../hooks/useSectionContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";
import { useEmployeesContext } from "../../../../hooks/useEmployeesContext";

import ConfirmDialogue from "../../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
const EmployeeForm = () => {
  const CHARACTER_LIMIT = 10;
  const isLetters = (str) => /^[A-Za-z]*$/.test(str);
  const isNumber = (str) => /^-?\d+\.?\d*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const { sections, secDispatch } = useSectionsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { employees, empDispatch } = useEmployeesContext();

  const [isFormOpen, setIsFormOpen] = useState(true);

  const [empID, setEmpID] = useState("");
  const [empType, setEmpType] = useState({ types: [] });
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("12/31/1991");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  const [empIDError, setEmpIDError] = useState(false);
  const [empTypeError, setEmpTypeError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [validation, setValidation] = useState(true);
  const [value, setValue] = React.useState("");

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
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleFieldChange = (event) => {
    console.log(event);
    event.preventDefault();
    setEmpType((empType) => ({
      ...empType,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };
  useEffect(() => {
    const getUsersDetails = async () => {
      const apiDep = await axiosPrivate.get("/api/departments", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (apiDep?.status === 200) {
        const json = await apiDep.data;
        console.log(json);
        depDispatch({ type: "SET_DEPS", payload: json });
      }
    };
    getUsersDetails();
  }, [depDispatch]);
  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
  };
  const clearFields = () => {
    setEmpID("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setSuffix("");
    setDateOfBirth("12/31/1991");
    setGender("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });

    const employee = {
      empID,
      empType,
      firstName,
      middleName,
      lastName,
      suffix,
      gender,
      dateOfBirth,
      email,
    };
    console.log(employee);

    try {
      const response = await axiosPrivate.post(
        "/api/employees/register",
        JSON.stringify(employee)
      );
      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        empDispatch({ type: "CREATE_EMPLOYEE", payload: json });
        setLoadingDialog({ isOpen: false });
        setSuccessDialog({
          isOpen: true,
          message: "Employee has been added!",
          onConfirm: () => {
            setSuccessDialog({ isOpen: false });
          },
        });
        clearFields();
      }
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");
        setEmpIDError(true);
        setErrorDialog({
          isOpen: true,
          message: `${"No server response!"}`,
        });
      } else if (error.response.status === 400) {
        setEmpIDError(true);
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 409) {
        console.log(error.response.data.message);
        if (error.response.data.message.includes("Employee")) {
          setEmpIDError(true);
        }
        if (error.response.data.message.includes("Email")) {
          setEmailError(true);
        }
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else {
        console.log(error);
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
      }
    }
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
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      {!isFormOpen ? (
        <EmployeeTable />
      ) : (
        <Box
          className="formContainer"
          display="block"
          width="100%"
          height="840px"
          flexDirection="column"
          justifyContent="center"
        >
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              margin: "20px 0 5px 0",
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
                  EMPLOYEE FORM
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={2} sx={{ p: "20px", mt: "10px" }}>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* <Typography variant="h5">Registration</Typography> */}
              <Box marginBottom="40px">
                <Typography variant="h4" sx={{ margin: "25px 0 10px 0" }}>
                  Employment Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: "20px",
                  }}
                >
                  <TextField
                    required
                    autoComplete="off"
                    variant="outlined"
                    label="Employee ID"
                    error={empIDError}
                    value={empID}
                    onChange={(e) => {
                      setEmpIDError(false);
                      setEmpID(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            variant="subtitle2"
                            sx={{ color: colors.black[400] }}
                          >
                            {empID.length}/{CHARACTER_LIMIT}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    // helperText={`*Input 10 characters only ${empID.length} / ${CHARACTER_LIMIT}`}
                  />

                  {/* <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Employee Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={empType}
                    error={empTypeError}
                    multiple={true}
                    size="2"
                    label="Position"
                    onChange={onRolesChanged}
                  >
                    <MenuItem value={"admin"}>Administrator</MenuItem>
                    <MenuItem value={"teacher"}>Teacher</MenuItem>
                  </Select>
                </FormControl> */}
                  <TextField
                    required
                    select
                    name="types"
                    id="types"
                    variant="outlined"
                    label="Employee Type"
                    SelectProps={{
                      multiple: true,
                      value: empType.types,
                      onChange: handleFieldChange,
                    }}
                  >
                    <MenuItem value={2001}>System Administrator</MenuItem>
                    <MenuItem value={2002}>Teacher</MenuItem>
                  </TextField>
                  <TextField
                    required
                    autoComplete="off"
                    variant="outlined"
                    label="Email"
                    type="email"
                    error={emailError}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ margin: "25px 0 10px 0" }}>
                Personal Information
              </Typography>
              <Box marginBottom="40px">
                <Typography sx={{ margin: "10px 0" }} variant="h5">
                  Name
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: "20px",
                  }}
                >
                  <TextField
                    required
                    type="text"
                    autoComplete="off"
                    variant="outlined"
                    label="First Name"
                    placeholder="Given Name"
                    error={firstNameError}
                    value={firstName}
                    onChange={(e) => {
                      // if (isLetters(e.target.value)) {
                      setFirstNameError(false);
                      setFirstName(e.target.value);
                      // }
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
                        setLastNameError(false);
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
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <LocalizationProvider required dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        required
                        label="Date of Birth"
                        inputFormat="MM/DD/YYYY"
                        error={dateOfBirthError}
                        value={dateOfBirth}
                        onChange={handleDate}
                        renderInput={(params) => (
                          <TextField required autoComplete="off" {...params} />
                        )}
                      />
                    </LocalizationProvider>

                    <FormControl required fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Gender
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        error={genderError}
                        label="Gender"
                        onChange={(e) => {
                          setGenderError(false);
                          setGender(e.target.value);
                        }}
                      >
                        <MenuItem value={"male"}>Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" justifyContent="end" height="70px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{ width: "250px", height: "50px" }}
                >
                  <Typography variant="h6" fontWeight="500">
                    SUBMIT
                  </Typography>
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{ width: "250px", height: "50px", ml: "20px" }}
                  onClick={() => {
                    clearForm();
                  }}
                >
                  <Typography variant="h6" fontWeight="500">
                    CANCEL
                  </Typography>
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default EmployeeForm;
