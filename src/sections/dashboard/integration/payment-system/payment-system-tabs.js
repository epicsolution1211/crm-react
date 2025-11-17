import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { AvailableOptions } from "./available-options";
import { EnabledConnections } from "./enabled-connections";
import { SubmitRequestDialog } from "./submit-request-dialog";
import { Conversations } from "./conversations";
import { Offers } from "./offers";

const PAYMENT_SYSTEM_TABS = [
  { label: "Payment Providers", value: "available_options" },
  { label: "Integrated Providers", value: "enabled_connections" },
  { label: "Conversations", value: "conversations" },
  { label: "Offers", value: "offers" },
];

export const PaymentSystemTabs = () => {
  const [currentTab, setCurrentTab] = useState("available_options");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const renderTabs = PAYMENT_SYSTEM_TABS.map((tab) => (
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          <Button 
            variant="outlined"
            size="small"
            onClick={handleOpenDialog}
            sx={{ 
              bgcolor: "background.paper",
              color: "text.primary",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "background.paper",
                borderColor: "text.primary"
              }
            }}
          >
            Get an offer
          </Button>
        </Box>
        <Divider />
      </Box>
      <Box>
        {renderTabContent}
      </Box>

      <SubmitRequestDialog 
        open={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};
