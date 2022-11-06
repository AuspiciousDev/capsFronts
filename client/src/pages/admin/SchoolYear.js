import React from "react";
import { Box, Typography } from "@mui/material";
import SchoolYearTable from "./components/SchoolYear/SchoolYearTable";
const SchoolYear = () => {
  return (
    <div className="contents-container">
      {/* <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: " 1fr 1fr",
        margin: "10px 0",
      }}
    >
      <Box>
        <Typography variant="h2" fontWeight={600}>
          School Year
        </Typography>
        <Typography>Showing 5 entries</Typography>
      </Box>
    </Box> */}
      <SchoolYearTable />
    </div>
  );
};

export default SchoolYear;
