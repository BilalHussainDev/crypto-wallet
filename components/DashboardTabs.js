import PropTypes from "prop-types";
import { useState } from "react";
import ActivityTab from "./ActivityTab";
import {Box, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import AssetsTab from "./AssetsTab";

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
      {value === index && <Box sx={{ padding: '1rem 0' }}>{children}</Box>}
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

export default function DashboardTabs({address}) {
  const [value, setValue] = useState(0);

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
        >
          <Tab sx={{ width: "50%" }} label="Assets" {...a11yProps(0)} />
          <Tab sx={{ width: "50%" }} label="Activity" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <AssetsTab address={address} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <ActivityTab address={address}/>
      </CustomTabPanel>
    </Box>
  );
}
