import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";

export function SettingTabs({ items , onSelect}) {
  const theme = useTheme();
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onSelect?.(items?.[parseInt(newValue - 1)])
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px:2}}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            textColor="inherit"
            // indicatorColor={"secondary"}
            variant="scrollable"
            TabIndicatorProps={{
              sx: {
                backgroundColor: theme.palette.primary.contrastText, // your custom color
                // height: "3px", // optional
              },
            }}
          >
            {items?.map((label, index) => (
              <Tab
                label={label}
                value={`${index + 1}`}
                key={label}
                sx={{ fontSize: "14px", fontWeight: 500 }}
              />
            ))}
          </TabList>
        </Box>
      </TabContext>
    </Box>
  );
}
