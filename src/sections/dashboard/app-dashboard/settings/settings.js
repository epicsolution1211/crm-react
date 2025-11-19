import { useCallback, useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SettingsSidebar } from "./settings-sidebar";
import { MailContainer } from "../../mail/mail-container";
import { Iconify } from "src/components/iconify";
import { SettingTabs } from "./tabs/tabs";
import { DesignBranding } from "./design-branding/design-branding";

const settingsTabs = [
  "Design & Branding",
  "Game Setup",
  "Player Accounts",
  "Bonusses & Promotions",
  "Localization",
  "Review & Publish",
];
const useSidebar = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
  };
};

const labels = [
  { name: "Brand Name & Identity", id: "BrandName&Identity" },
  { name: "Appearance", id: "Appearance" },
  { name: "Categories", id: "Categories" },
  { name: "Menus", id: "Menus" },
];

export const CasinoAppSettings = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  // const [currentMenu, setCurrentMenu] = useState("");
  const [currentTab, setCurrentTab] = useState(settingsTabs[0]);

  return (
    <Stack p={3}>
      <Typography variant="h4">App Dashboard</Typography>
      <Box mt={2}>
        <IconButton sx={{ mb: 1, ml: 1 }} onClick={sidebar.handleToggle}>
          <Iconify icon="lucide:menu" width={24} height={24} />
        </IconButton>
        <Divider />
      </Box>
      <SettingTabs
        onSelect={(tab) => setCurrentTab(tab)}
        items={settingsTabs}
      />
      {currentTab === "Design & Branding" && (
        <DesignBranding handleClose={sidebar.handleClose} open={sidebar.open} />
      )}
    </Stack>
  );
};
