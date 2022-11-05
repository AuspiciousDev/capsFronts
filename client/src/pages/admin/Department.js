import React from "react";
import { Box, Typography } from "@mui/material";
const Department = () => {
  return (
    <div className="contents-container">
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: " 1fr 1fr",
          margin: "10px 0",
        }}
      >
        <Box>
          <Typography variant="h2" fontWeight={600}>
            Department
          </Typography>
          <Typography>Showing 5 entries</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Department;
