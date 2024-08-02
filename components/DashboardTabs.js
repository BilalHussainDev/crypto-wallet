"use client";
import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import ActivityTab from "./ActivityTab";
import AssetsTab from "./AssetsTab";
import NFTsTab from "./NFTsTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ padding: "1rem 0" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DashboardTabs({ address }) {
  const [value, setValue] = useState(2);

  const tabStyles = { width: "33%", textTransform: "none", fontSize: "1rem" };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs"
          centered
          sx={{}}
        >
          <Tab sx={tabStyles} label="Assets" {...a11yProps(0)} />
          <Tab sx={tabStyles} label="Activity" {...a11yProps(1)} />
          <Tab sx={tabStyles} label="NFTs" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <AssetsTab address={address} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <ActivityTab address={address} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <NFTsTab address={address} />
      </CustomTabPanel>
    </Box>
  );
}
