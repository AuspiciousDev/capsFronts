import { Box, Button, Input, Typography, Paper, Tooltip } from "@mui/material";
import React from "react";
import {
  FileUploadOutlined,
  CheckCircleOutline,
  AdminPanelSettings,
  Badge,
  UploadFileOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import { margin } from "@mui/system";
import { async } from "@firebase/util";
import useAxiosPrivateFile from "../../../../hooks/useAxiosPrivateFile";
import SuccessDialogue from "../../../../global/SuccessDialogue";
import ErrorDialogue from "../../../../global/ErrorDialogue";
import LoadingDialogue from "../../../../global/LoadingDialogue";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar
      // printOptions={{
      //   fields: ["schoolYearID", "fullName", "userType", "createdAt"],
      // }}
      // csvOptions={{ fields: ["username", "firstName"] }}
      />
      {/* <GridToolbarExport */}

      {/* /> */}
    </GridToolbarContainer>
  );
}

const EmployeeImport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivateFile = useAxiosPrivateFile();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [array, setArray] = useState([]);
  const [disableUpload, setDisableUpload] = useState(false);

  const fileReader = new FileReader();

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

  const handleOnChange = async (e) => {
    try {
      setArray([]);
      if (e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
        fileReader.onload = (event) => {
          const text = event.target.result;
          if (e.target.files[0] && e.target.files[0].type === "text/csv") {
            csvFileToArray(text);
          } else {
            setErrorDialog({
              isOpen: true,
              title: "Invalid File type",
              message: "Import only accepts .CSV File",
            });
          }
        };
        fileReader.readAsText(e.target.files[0]);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: EmployeeImport.js:74 ~ handleOnChange ~ error",
        error
      );
    }
  };
  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    let checker = (arr, target) => target.every((v) => arr.includes(v));

    console.log(csvHeader);
    const headers = [
      "empID",
      "firstName",
      "middleName",
      "lastName",
      "empType",
      "dateOfBirth",
      "gender\r",
    ];
    if (!checker(headers, csvHeader)) {
      return (
        setErrorDialog({
          isOpen: true,
          title: "Invalid CSV Headers",
          message: `Must include
          'empID','empType[2001/2002]', 'firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender\r'
         `,
        }),
        console.log("error"),
        setSelectedFile(null),
        setDisableUpload(true)
      );
    }
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      console.log("🚀 ~ file: EmployeeImport.js:96 ~ array ~ values", values);

      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = async (e) => {
    try {
      if (selectedFile) {
        console.log(selectedFile);
        const formData = new FormData();
        formData.append("csv", selectedFile);

        const response = await axiosPrivateFile.post(
          "/api/employees/import",
          formData
        );
        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            message: `${json.message}`,
            onConfirm: () => {
              setSuccessDialog({ isOpen: false });
            },
          });
          document.getElementById("csvFileInput").value = "";
          setDisableUpload(true);
        }
      } else {
        setErrorDialog({ isOpen: true, message: "No file imported!" });
      }
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        console.log("no server response");

        setErrorDialog({
          isOpen: true,
          message: `${"No server response!"}`,
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 409) {
        console.log(error.response.data.message);
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

  const [page, setPage] = React.useState(15);

  const columns = [
    {
      field: "empID",
      headerName: "Employee ID",
      width: 150,
    },
    {
      field: "empType",
      headerName: "Type",
      width: 130,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    { field: "empGender\r", headerName: "Gender", width: 100 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 100 },
  ];
  return (
    <Box className="contents-container">
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
              EMPLOYEE IMPORT
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          p: "20px",
          mt: "10px",
        }}
      >
        <form style={{ width: "100%" }}>
          <Tooltip title="Import CSV file only" placement="top">
            <Button
              component="label"
              variant="contained"
              color="secondary"
              startIcon={<UploadFileOutlined />}
            >
              Import CSV
              <input
                required
                name="CSV"
                type="file"
                id="csvFileInput"
                accept=".csv"
                onChange={handleOnChange}
                hidden
              />
            </Button>
          </Tooltip>
          <Tooltip title="Upload CSV data to Database" placement="top">
            <Button
              component="label"
              variant="contained"
              onClick={(e) => {
                handleOnSubmit(e);
              }}
              startIcon={<UploadFileOutlined />}
              sx={{ ml: 2 }}
            >
              Upload to Database
            </Button>
          </Tooltip>
        </form>

        <br />

        <DataGrid
          rows={array ? array && array : []}
          getRowId={(row) => row.empID}
          columns={columns}
          pageSize={page}
          onPageSizeChange={(newPageSize) => setPage(newPageSize)}
          rowsPerPageOptions={[15, 50]}
          pagination
          sx={{
            "& .MuiDataGrid-cell": {
              textTransform: "capitalize",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                createdAt: false,
              },
            },
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Paper>
    </Box>
  );
};

export default EmployeeImport;
