import { useCallback, useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
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

export const CasinoAppSettings = () => {
  const sidebar = useSidebar();
  const [currentTab, setCurrentTab] = useState(settingsTabs[0]);

  const currentComponent = useMemo(() => {
    if (currentTab === "Design & Branding")
      return (
        <DesignBranding handleClose={sidebar.handleClose} open={sidebar.open} />
      );
  }, [currentTab, sidebar.handleClose, sidebar.open]);

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
      {currentComponent}
    </Stack>
  );
};
