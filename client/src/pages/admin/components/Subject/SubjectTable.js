import React from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
} from "@mui/material";
import { AutoStories, DeleteOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../../../global/Loading";
import SubjectForm from "./SubjectForm";
import SubjectEditForm from "./SubjectEditForm";
import { useSubjectsContext } from "../../../../hooks/useSubjectsContext";
import { useLevelsContext } from "../../../../hooks/useLevelsContext";
import { useDepartmentsContext } from "../../../../hooks/useDepartmentContext";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
const SubjectTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();

  const { subjects, subDispatch } = useSubjectsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();

  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [subjectID, setSubjectID] = useState("");
  const [levelID, setLevelID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");

  const [level, setLevel] = useState("");
  const [departmentID, setDepartmentID] = useState("");

  const [subjectIDError, setSubjectIDError] = useState(false);
  const [levelIDError, setLevelIDError] = useState(false);
  const [departmentIDError, setDepartmentIDError] = useState(false);
  const [subjectNameError, setSubjectNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    clearInputForms();
    setError(false);
  };
  const clearInputForms = () => {
    setSubjectID("");
    setLevelID("");
    setSubjectName("");
    setDescription("");
  };

  const clearForm = () => {
    setIsFormOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(subjectID, levelID, subjectName);

    const subject = {
      subjectID,
      levelID,
      subjectName,
      description,
    };

    if (subjectID) {
      try {
        const response = await axiosPrivate.post(
          "/api/subjects/register",
          JSON.stringify(subject),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response?.status === 201) {
          const json = await response.data;
          console.log(json);
          subDispatch({ type: "CREATE_SUBJECT", payload: json });
          setIsFormOpen(false);
          setOpen(false);
          setIsLoading(false);
        }
      } catch (error) {
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response?.status === 400) {
          console.log(error.response.data.message);
        } else if (error.response?.status === 409) {
          setDepartmentIDError(true);
          setOpen(false);
          setIsLoading(false);
          setErrorMessage(error.response.data.message);

          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      console.log("Error");
    }
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: colors.tableRow[100],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/api/subjects", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response?.status === 200) {
          const json = await response.data;
          console.log(json);
          setIsLoading(false);
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const getLevels = await axiosPrivate.get("/api/levels", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getLevels?.status === 200) {
          const json = await getLevels.data;
          console.log(json);
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const getDepartment = await axiosPrivate.get("/api/departments", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (getDepartment?.status === 200) {
          const json = await getDepartment.data;
          console.log(json);
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
      } catch (error) {}
    };
    getData();
  }, [subDispatch, levelDispatch, depDispatch]);
  const handleAdd = () => {
    setIsFormOpen(true);
  };
  const handleDelete = async ({ delVal }) => {
    const response = await axiosPrivate.delete("/api/subjects/delete", {
      headers: { "Content-Type": "application/json" },
      data: delVal,
      withCredentials: true,
    });
    const json = await response.data;
    if (response.status === 200) {
      console.log(response.data.message);
      subDispatch({ type: "DELETE_SUBJECT", payload: json });
    }
  };
  const TableTitles = () => {
    return (
      <TableRow 
      sx={{ backgroundColor: `${colors.darkLightBlue[100]}` }}>        <TableCell align="left">Subject ID</TableCell>
        <TableCell align="left">Subject Name</TableCell>
        <TableCell align="left">Subject Level</TableCell>
        <TableCell align="left">Action</TableCell>
      </TableRow>
    );
  };
  const tableDetails = (val) => {
    return (
      <StyledTableRow
        key={val._id}
        sx={
          {
            // "&:last-child td, &:last-child th": { border: 2 },
            // "& td, & th": { border: 2 },
          }
        }
      >
        {/* Subject ID */}
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          {val.subjectID}
        </TableCell>
        {/* Subject Name */}
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: "capitalize" }}
        >
          {val.subjectName}
        </TableCell>
        {/* Subject Level */}
        <TableCell align="left">
          {levels &&
            levels
              .filter((dep) => {
                return dep.levelID === val.levelID;
              })
              .map((val) => {
                return val.levelNum;
              })}
        </TableCell>

        <TableCell align="left">
          <Box
            elevation={0}
            sx={{
              display: "grid",
              width: "40%",
              gridTemplateColumns: " 1fr 1fr",
            }}
          >
            <SubjectEditForm data={val} />
            <DeleteRecord delVal={val} />
          </Box>
        </TableCell>
      </StyledTableRow>
    );
  };
  const DeleteRecord = ({ delVal }) => (
    <Popup
      trigger={
        <IconButton sx={{ cursor: "pointer" }}>
          <DeleteOutline sx={{ color: colors.red[500] }} />
        </IconButton>
      }
      modal
      nested
    >
      {(close) => (
        <div
          className="modal-delete"
          style={{
            backgroundColor: colors.primary[900],
            border: `solid 1px ${colors.gray[200]}`,
          }}
        >
          <button className="close" onClick={close}>
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
              DELETE RECORD
            </Typography>
          </div>
          <div className="content">
            <Typography variant="h6">Are you sure to delete </Typography>
            <Box margin="20px 0">
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ textTransform: "uppercase" }}
              >
                {delVal.subjectID}
              </Typography>
              <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                {delVal.title}
              </Typography>
            </Box>
          </div>
          <div className="actions">
            <Button
              type="button"
              onClick={() => {
                handleDelete({ delVal });
                close();
              }}
              variant="contained"
              color="secButton"
              sx={{
                width: "150px",
                height: "50px",
                ml: "20px",
                mb: "10px",
              }}
            >
              <Typography variant="h6" sx={{ color: colors.whiteOnly[100] }}>
                Confirm
              </Typography>
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
              variant="contained"
              sx={{ width: "150px", height: "50px", ml: "20px", mb: "10px" }}
            >
              <Typography variant="h6" sx={{ color: colors.whiteOnly[100] }}>
                CANCEL
              </Typography>
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );

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
          <button
            className="close"
            onClick={closeModal}
            style={{
              background: colors.yellowAccent[500],
            }}
          >
            <Typography variant="h4" sx={{ color: colors.whiteOnly[100] }}>
              &times;
            </Typography>
          </button>
          <div
            className="header"
            style={{ backgroundColor: colors.primary[800] }}
          >
            <Typography variant="h3" sx={{ color: colors.whiteOnly[100] }}>
              ADD SUBJECT
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
                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  Subject Information
                </Typography>
                <Box marginBottom="40px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <FormControl color="primWhite" required>
                      <InputLabel required id="demo-simple-select-label">
                        Department
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={departmentIDError}
                        value={departmentID}
                        label="Department"
                        onChange={(e) => {
                          setDepartmentID(e.target.value);
                        }}
                      >
                        <option aria-label="None" value="" />
                        {departments &&
                          departments
                            .filter((val) => {
                              return val.active === true;
                            })
                            .map((val) => {
                              return (
                                <option
                                  key={val.departmentID}
                                  value={val.departmentID}
                                >
                                  {val.depName}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <FormControl color="primWhite" required>
                      <InputLabel required id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={levelIDError}
                        value={levelID}
                        label="Levels"
                        onChange={(e) => {
                          setLevelID(e.target.value);
                          levels &&
                            levels
                              .filter((val) => {
                                return val.levelID === e.target.value;
                              })
                              .map((val) => {
                                return setLevel(val.levelNum);
                              });
                        }}
                      >
                        <option aria-label="None" value="" />
                        {levels &&
                          levels
                            .filter((val) => {
                              return (
                                val.active === true &&
                                val.departmentID === departmentID
                              );
                            })
                            .map((val) => {
                              return (
                                <option key={val.levelID} value={val.levelID}>
                                  {val.levelNum}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <TextField
                      required
                      color="primWhite"
                      autoComplete="off"
                      variant="standard"
                      label="Subject ID"
                      placeholder="Subject ID"
                      error={subjectIDError}
                      value={subjectID}
                      onChange={(e) => {
                        setSubjectID(e.target.value);
                      }}
                    />
                    <TextField
                      required
                      color="primWhite"
                      autoComplete="off"
                      variant="standard"
                      label="Subject Name"
                      placeholder="Subject Name"
                      error={subjectNameError}
                      value={subjectName}
                      onChange={(e) => {
                        setSubjectName(e.target.value);
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr ",
                      gap: "20px",
                      mt: "15px",
                    }}
                  >
                    <TextField
                      color="primWhite"
                      autoComplete="off"
                      variant="standard"
                      label="Description"
                      placeholder="Description"
                      error={descriptionError}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="end"
                  height="70px"
                  sx={{ margin: "20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="submit"
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
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: " 1fr 1fr",
          margin: "10px 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            SUBJECTS
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              width: "320px",
              height: "50px",
              minWidth: "250px",
              alignItems: "center",
              justifyContent: "center",
              p: "0 20px",
              mr: "10px",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Subject"
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
              }}
            />
            <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <Button
            type="button"
            onClick={() => setOpen((o) => !o)}
            variant="contained"
            sx={{ width: "200px", height: "50px", marginLeft: "20px" }}
          >
            <Typography variant="h6" fontWeight="500">
              Add
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box width="100%">
        <TableContainer
          sx={{
            height: "700px",
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableTitles />
            </TableHead>
            <TableBody>
              {search
                ? subjects
                    .filter((data) => {
                      return (
                        data.subjectID.includes(search) ||
                        data.subjectName.includes(search)
                      );
                    })
                    .map((data) => {
                      return tableDetails(data);
                    })
                : subjects &&
                  subjects.slice(0, 8).map((data) => {
                    return tableDetails(data);
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          width="100%"
          sx={{ flexDirection: "column" }}
          justifyContent="center"
          alignItems="center"
        >
          {/* <Typography textTransform="uppercase">
                {console.log(Object.keys(subjects || {}).length)}
                {Object.keys(subjects || {}).length}
              </Typography> */}
          {isloading ? <Loading /> : <></>}
          {Object.keys(subjects || {}).length > 0 ? (
            <></> // <Typography textTransform="uppercase">data</Typography>
          ) : (
            <Typography textTransform="uppercase">no data</Typography>
          )}
          {/* {console.log(Object.keys(subjects).length)} */}
          {/* {Object.keys(prop.subjectID).length > 0
                ? console.log("true")
                : console.log("false")} */}
          {/* {subjects.length < 0 ? console.log("true") : console.log("false")} */}
          {/* {Object.key(subjects).length ? (
                <Typography textTransform="uppercase">data</Typography>
              ) : (
                <Typography textTransform="uppercase">no data</Typography>
              )} */}

          {/* <Box
              display="flex"
              width="100%"
              justifyContent="center"
              marginTop="20px"
              marginBottom="20px"
            >
              <Box
                width="200px"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                justifyItems="center"
              >
                <ArrowBackIosNewOutlined color="gray" />
                <ArrowForwardIosOutlined color="gray" />
              </Box>
            </Box> */}
        </Box>

        <Box display="flex" width="100%" marginTop="20px"></Box>
      </Box>
    </>
  );
};

export default SubjectTable;
