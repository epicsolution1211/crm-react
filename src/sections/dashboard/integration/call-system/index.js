import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";

import { AvailableOptions } from "./available-options";
import { EnabledConnections } from "./enabled-connections";
import { Conversations } from "./conversations";
import { Offers } from "./offers";

const CALL_SYSTEM_TABS = [
  { label: "Call Providers", value: "available_options" },
  { label: "Integrated Providers", value: "enabled_connections" },
  { label: "Conversations", value: "conversations" },
  { label: "Offers", value: "offers" },
];

export const CallSystem = () => {
  const [currentTab, setCurrentTab] = useState("available_options");

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const renderTabs = CALL_SYSTEM_TABS.map((tab) => (
    <Tab key={tab.value} label={tab.label} value={tab.value} />
  ));

  const renderTabContent = (
    <>
      {currentTab === "available_options" && <AvailableOptions />}
      {currentTab === "enabled_connections" && <EnabledConnections />}
      {currentTab === "conversations" && <Conversations />}
      {currentTab === "offers" && <Offers />}
    </>
  );

  return (
    <Box>
      <Box sx={{ mt: -1 }}>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {renderTabs}
        </Tabs>
        <Divider />
      </Box>
      <Box>
        {renderTabContent}
      </Box>
    </Box>
  );
};
