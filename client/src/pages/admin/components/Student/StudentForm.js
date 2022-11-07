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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import StudentTable from "./StudentTable";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

const StudentForm = () => {
  const { subjects, dispatch } = useStudentsContext();

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [studID, setStudID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [telephone, setTelephone] = useState("");
  const [father_firstName, setFather_firstName] = useState("");
  const [father_middleName, setFather_middleName] = useState("");
  const [father_lastName, setFather_lastName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherContactNum, setFatherContactNum] = useState("");
  const [mother_firstName, setMother_firstName] = useState("");
  const [mother_middleName, setMother_middleName] = useState("");
  const [mother_lastName, setMother_lastName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherContactNum, setMotherContactNum] = useState("");
  const [LRN, setLRN] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");

  const [studIDError, setStudIDError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [middleNameError, setMiddleNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [suffixError, setSuffixError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [placeOfBirthError, setPlaceOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [civilStatusError, setCivilStatusError] = useState(false);
  const [nationalityError, setNationalityError] = useState(false);
  const [religionError, setReligionError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [provinceError, setProvinceError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [telephoneError, setTelephoneError] = useState(false);
  const [father_firstNameError, setFather_firstNameError] = useState(false);
  const [father_middleNameError, setFather_middleNameError] = useState(false);
  const [father_lastNameError, setFather_lastNameError] = useState(false);
  const [fatherOccupationError, setFatherOccupationError] = useState(false);
  const [fatherContactNumError, setFatherContactNumError] = useState(false);
  const [mother_firstNameError, setMother_firstNameError] = useState(false);
  const [mother_middleNameError, setMother_middleNameError] = useState(false);
  const [mother_lastNameError, setMother_lastNameError] = useState(false);
  const [motherOccupationError, setMotherOccupationError] = useState(false);
  const [motherContactNumError, setMotherContactNumError] = useState(false);
  const [LRNError, setLRNError] = useState(false);
  const [departmentError, setDepartmentError] = useState(false);
  const [levelError, setLevelError] = useState(false);
  const [emergencyNameError, setEmergencyNameError] = useState(false);
  const [relationshipError, setRelationshipError] = useState(false);
  const [emergencyNumberError, setEmergencyNumberError] = useState(false);
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
      placeOfBirth,
      gender,
      civilStatus,
      nationality,
      religion,
      address,
      city,
      province,
      email,
      mobile,
      telephone,
      father_firstName,
      father_middleName,
      father_lastName,
      fatherOccupation,
      fatherContactNum,
      mother_firstName,
      mother_middleName,
      mother_lastName,
      motherOccupation,
      motherContactNum,
      LRN,
      emergencyName,
      relationship,
      emergencyNumber,
    };

    if (!firstName) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
    if (!lastName) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
    if (!dateOfBirth) {
      setDateOfBirthError(true);
    } else {
      setDateOfBirthError(false);
    }
    if (!placeOfBirth) {
      setPlaceOfBirthError(true);
    } else {
      setPlaceOfBirthError(false);
    }
    if (!gender) {
      setGenderError(true);
    } else {
      setGenderError(false);
    }
    if (!civilStatus) {
      setCivilStatusError(true);
    } else {
      setCivilStatusError(false);
    }
    if (!nationality) {
      setNationalityError(true);
    } else {
      setNationalityError(false);
    }
    if (!address) {
      setAddressError(true);
    } else {
      setAddressError(false);
    }
    if (!city) {
      setCityError(true);
    } else {
      setCityError(false);
    }
    if (!province) {
      setProvinceError(true);
    } else {
      setProvinceError(false);
    }
    if (!email) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (!mobile) {
      setMobileError(true);
    } else {
      setMobileError(false);
    }
    if (!studID) {
      setStudIDError(true);
    } else {
      setStudIDError(false);
    }
    if (!father_firstName) {
      setFather_firstNameError(true);
    } else {
      setFather_firstNameError(false);
    }
    if (!father_middleName) {
      setFather_middleNameError(true);
    } else {
      setFather_middleNameError(false);
    }
    if (!father_lastName) {
      setFather_lastNameError(true);
    } else {
      setFather_lastNameError(false);
    }
    if (!fatherOccupation) {
      setFatherOccupationError(true);
    } else {
      setFatherOccupationError(false);
    }
    if (!fatherContactNum) {
      setFatherContactNumError(true);
    } else {
      setFatherContactNumError(false);
    }
    if (!mother_firstName) {
      setMother_firstNameError(true);
    } else {
      setMother_firstNameError(false);
    }
    if (!mother_middleName) {
      setMother_middleNameError(true);
    } else {
      setMother_middleNameError(false);
    }
    if (!mother_lastName) {
      setMother_lastNameError(true);
    } else {
      setMother_lastNameError(false);
    }
    if (!motherOccupation) {
      setMotherOccupationError(true);
    } else {
      setMotherOccupationError(false);
    }
    if (!motherContactNum) {
      setMotherContactNumError(true);
    } else {
      setMotherContactNumError(false);
    }
    if (!emergencyName) {
      setEmergencyNameError(true);
    } else {
      setEmergencyNameError(false);
    }
    if (!relationship) {
      setRelationshipError(true);
    } else {
      setRelationshipError(false);
    }
    if (!emergencyNumber) {
      setEmergencyNumberError(true);
    } else {
      setEmergencyNumberError(false);
    }

    if (
      !studIDError &&
      !firstNameError &&
      !lastNameError &&
      !dateOfBirthError &&
      !placeOfBirthError &&
      !genderError &&
      !civilStatusError &&
      !nationalityError &&
      !addressError &&
      !cityError &&
      !provinceError &&
      !emailError &&
      !mobileError &&
      !father_firstNameError &&
      !father_middleNameError &&
      !father_lastNameError &&
      !fatherOccupationError &&
      !fatherContactNumError &&
      !mother_firstNameError &&
      !mother_middleNameError &&
      !mother_lastNameError &&
      !motherOccupationError &&
      !motherContactNumError &&
      !LRNError &&
      !emergencyNameError &&
      !relationshipError &&
      !emergencyNumberError
    ) {
      const response = await fetch("/api/students/register", {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch({ type: "CREATE_SUBJECT", payload: null });
      }
      setIsFormOpen(false);
    } else {
      console.log(student);
      console.log("MADAME ERROR");
    }
  };
  const clearForm = () => {
    setIsFormOpen(false);
  };
  return (
    <>
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
            <Typography variant="h3" fontWeight={600}>
              STUDENTS
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {/* <Typography variant="h5">Registration</Typography> */}

            <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
              General Information
            </Typography>
            <Box marginBottom="40px">
              <Typography sx={{ margin: "10px 0" }} fontSize="14pt">
                Name
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr ",
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
                    setFirstName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  label="Middle Name"
                  placeholder="Optional"
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value.toLowerCase());
                  }}
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
                    setLastName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  label="Suffix"
                  placeholder="Sr./Jr./III"
                  value={suffix}
                  onChange={(e) => {
                    setSuffix(e.target.value.toLowerCase());
                  }}
                />
              </Box>

              <Box sx={{ mb: "40px" }}>
                <Box
                  sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr ",
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
                        <TextField required {...params} />
                      )}
                    />
                  </LocalizationProvider>

                  <TextField
                    required
                    autoComplete="off"
                    variant="outlined"
                    label="Place of Birth"
                    placeholder="City"
                    error={placeOfBirthError}
                    value={placeOfBirth}
                    onChange={(e) => {
                      setPlaceOfBirth(e.target.value.toLowerCase());
                    }}
                  />

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
                        setGender(e.target.value.toLowerCase());
                      }}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Civil Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={civilStatus}
                      error={civilStatusError}
                      label="Civil Status"
                      onChange={(e) => {
                        setCivilStatus(e.target.value.toLowerCase());
                      }}
                    >
                      <MenuItem value={"single"}>Single</MenuItem>
                      <MenuItem value={"married"}>Married</MenuItem>
                      <MenuItem value={"divorced"}>Divorced</MenuItem>
                      <MenuItem value={"widowed"}>Widowed</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    autoComplete="off"
                    variant="outlined"
                    label="Nationality"
                    value={nationality}
                    onChange={(e) => {
                      setNationality(e.target.value.toLowerCase());
                    }}
                    error={nationalityError}
                  />
                  <TextField
                    autoComplete="off"
                    variant="outlined"
                    label="Religion"
                    value={religion}
                    onChange={(e) => {
                      setReligion(e.target.value.toLowerCase());
                    }}
                  />
                </Box>

                <Box marginTop="20px">
                  <Typography sx={{ margin: "10px 0" }} fontSize="14pt">
                    Address
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr ",
                      gap: "20px",
                    }}
                  >
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="Address"
                      error={addressError}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value.toLowerCase());
                      }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="Municipality/City"
                      error={cityError}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value.toLowerCase());
                      }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="Province/Region"
                      error={provinceError}
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value.toLowerCase());
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              width="100%"
              flexDirection="column"
              justifyContent="center"
              marginBottom="40px"
            >
              <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
                Contact Information
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
                  label="Email"
                  value={email}
                  error={emailError}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Mobile Number"
                  error={mobileError}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  label="Telephone Number"
                  value={telephone}
                  onChange={(e) => {
                    setTelephone(e.target.value.toLowerCase());
                  }}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              width="100%"
              flexDirection="column"
              justifyContent="center"
              marginBottom="40px"
            >
              <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
                Parent Information
              </Typography>
              <Typography sx={{ margin: "10px 0" }} fontSize="14pt">
                Fathers Name
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
                  label="First Name"
                  placeholder="Given Name"
                  error={father_firstNameError}
                  value={father_firstName}
                  onChange={(e) => {
                    setFather_firstName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Middle Name"
                  placeholder="Optional"
                  value={father_middleName}
                  onChange={(e) => {
                    setFather_middleName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Last Name"
                  placeholder="Last Name"
                  error={father_lastNameError}
                  value={father_lastName}
                  onChange={(e) => {
                    setFather_lastName(e.target.value.toLowerCase());
                  }}
                />

                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Occupation"
                  placeholder="Primary Work"
                  error={fatherOccupationError}
                  value={fatherOccupation}
                  onChange={(e) => {
                    setFatherOccupation(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Contact Number"
                  placeholder="Active contact number"
                  value={fatherContactNum}
                  error={fatherContactNumError}
                  onChange={(e) => {
                    setFatherContactNum(e.target.value.toLowerCase());
                  }}
                />
              </Box>
              <Typography sx={{ margin: "10px 0" }} fontSize="14pt">
                Mothers Name
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
                  label="First Name"
                  placeholder="Given Name"
                  error={mother_firstNameError}
                  value={mother_firstName}
                  onChange={(e) => {
                    setMother_firstName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Middle Name"
                  placeholder="Optional"
                  value={mother_middleName}
                  onChange={(e) => {
                    setMother_middleName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Last Name"
                  placeholder="Last Name"
                  error={mother_lastNameError}
                  value={mother_lastName}
                  onChange={(e) => {
                    setMother_lastName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Occupation"
                  placeholder="Primary Work"
                  error={motherOccupationError}
                  value={motherOccupation}
                  onChange={(e) => {
                    setMotherOccupation(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Contact Number"
                  placeholder="Active contact number"
                  value={motherContactNum}
                  error={motherContactNumError}
                  onChange={(e) => {
                    setMotherContactNum(e.target.value.toLowerCase());
                  }}
                />
              </Box>
            </Box>
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
                  error={studIDError}
                  value={studID}
                  onChange={(e) => {
                    setStudID(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="LRN"
                  value={LRN}
                  onChange={(e) => {
                    setLRN(e.target.value.toLowerCase());
                  }}
                />
              </Box>
            </Box>
            <Box marginBottom="40px">
              <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                Emergency Information
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
                  label="Contact Name"
                  error={emergencyNameError}
                  value={emergencyName}
                  onChange={(e) => {
                    setEmergencyName(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Relationship"
                  error={relationshipError}
                  value={relationship}
                  onChange={(e) => {
                    setRelationship(e.target.value.toLowerCase());
                  }}
                />
                <TextField
                  required
                  autoComplete="off"
                  variant="outlined"
                  label="Contact Number"
                  error={emergencyNumberError}
                  value={emergencyNumber}
                  onChange={(e) => {
                    setEmergencyNumber(e.target.value.toLowerCase());
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" height="70px">
              <Button
                type="button"
                variant="contained"
                sx={{ width: "250px", height: "50px" }}
                onClick={() => {
                  clearForm();
                }}
              >
                <Typography color="white" variant="h6" fontWeight={500}>
                  Cancel
                </Typography>
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "250px", height: "50px", ml: "20px" }}
              >
                <Typography color="white" variant="h6" fontWeight={500}>
                  Submit
                </Typography>
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};

export default StudentForm;
