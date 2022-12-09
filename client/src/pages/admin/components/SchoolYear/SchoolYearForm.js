import React from "react";
import { useEffect, useState } from "react";
import SchoolYearTable from "./SchoolYearTable";
import Popup from "reactjs-popup";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { useSchoolYearsContext } from "../../../../hooks/useSchoolYearsContext";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
const SchoolYearForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth } = useAuth();

  const { schoolyears, sydispatch } = useSchoolYearsContext();
  const [schoolYearID, setSchoolYearID] = useState("");
  const [title, setTitle] = useState();
  const [description, setDescription] = useState("");

  const [schoolYearIDError, setSchoolYearIDError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);
  function yearData(year, title) {
    return { year, title };
  }

  const rows = [
    yearData("2022", "2021-2022"),
    yearData("2023", "2022-2023"),
    yearData("2024", "2023-2024"),
    yearData("2025", "2024-2025"),
    yearData("2026", "2025-2026"),
    yearData("2027", "2026-2027"),
    yearData("2028", "2027-2028"),
    yearData("2029", "2028-2029"),
    yearData("2030", "2029-2030"),
  ];
  useEffect(() => {
    // setOpen(isFormOpen);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      schoolYearID,
      title,
      description,
      createdBy: auth.username,
    };

    if (!error) {
      try {
        const response = await axios.post("/api/schoolyears/register", {
          headers: { "Content-Type": "application/json" },
          data,
          withCredentials: true,
        });
        const json = await response.data;
        if (response.status === 201) {
          console.log(response.data.message);
          sydispatch({ type: "CREATE_SCHOOLYEAR", payload: json });
          setError(false);
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setSchoolYearIDError(true);
          setError(true);
          setErrorMessage(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      console.log(errorMessage);
    }
  };
  return (
    <>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div
          className="modal-small-form"
          style={{
            backgroundColor: colors.primary[900],
            border: `solid 1px ${colors.gray[200]}`,
          }}
        >
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div
            className="header"
            style={{ backgroundColor: colors.primary[800] }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: colors.whiteOnly[100] }}
            >
              ADD SCHOOL YEAR
            </Typography>
          </div>
          <div className="content">
            <Box
              className="formContainer"
              display="block"
              width="100%"
              flexDirection="column"
              justifyContent="center"
            >
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {/* <Typography variant="h5">Registration</Typography> */}

                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  School Year Information
                </Typography>
                <Box marginBottom="20px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateRows: "1fr ",
                      gap: "20px",
                    }}
                  >
                    <FormControl required fullWidth>
                      <InputLabel required id="demo-simple-select-label">
                        School Year
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={schoolYearID}
                        error={schoolYearIDError}
                        label="Level"
                        onChange={(e) => {
                          setSchoolYearID(e.target.value);
                          setError(false);
                          setSchoolYearIDError(false);
                          rows
                            .filter((val) => {
                              return val.year === e.target.value;
                            })
                            .map((data) => {
                              return setTitle(data.title);
                            });
                        }}
                      >
                        <MenuItem value={"2022"}>2022</MenuItem>
                        <MenuItem value={"2023"}>2023</MenuItem>
                        <MenuItem value={"2024"}>2024</MenuItem>
                        <MenuItem value={"2025"}>2025</MenuItem>
                        <MenuItem value={"2026"}>2026</MenuItem>
                        <MenuItem value={"2027"}>2027</MenuItem>
                        <MenuItem value={"2028"}>2028</MenuItem>
                        <MenuItem value={"2029"}>2029</MenuItem>
                        <MenuItem value={"2030"}>2030</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      autoComplete="off"
                      variant="outlined"
                      label="Description"
                      value={description}
                      error={descriptionError}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </Box>
                  <Box height="10px">
                    <Typography
                      variant="h5"
                      sx={{ mt: "10px" }}
                      color={colors.red[500]}
                    >
                      {error ? errorMessage : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="end" alignItems="end">
                  <div className="actions">
                    <Button
                      type="button"
                      variant="contained"
                      color="secButton"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[100] }}
                      >
                        Confirm
                      </Typography>
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                      onClick={closeModal}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[100] }}
                      >
                        CANCEL
                      </Typography>
                    </Button>
                  </div>
                </Box>
              </form>
            </Box>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default SchoolYearForm;
