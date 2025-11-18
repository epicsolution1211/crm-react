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
  { name: "Clients", id: "Client" },
  { name: "Transactions", id: "TTransaction" },
  { name: "Positions", id: "Position" },
  { name: "Comments", id: "ClientComment" },
  { name: "Agents", id: "Account" },
  { name: "Settings", id: "Setting" },
  { name: "Calls", id: "Calls" },
  { name: "Bets", id: "Bet" },
];

export const CasinoAppSettings = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const [currentMenu, setCurrentMenu] = useState("");

  return (
    <Stack spacing={4}>
      <Box>
        <IconButton sx={{ mb: 1, ml: 1 }} onClick={sidebar.handleToggle}>
          <Iconify icon="lucide:menu" width={24} height={24} />
        </IconButton>
        <Divider />
      </Box>
      <Box
        component="main"
        sx={{
          flex: "1 1 auto",
          position: "relative",
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            minHeight: 600,
            display: "flex",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          }}
        >
          <SettingsSidebar
            container={rootRef.current}
            currentLabelId={"currentLabelId"}
            labels={labels}
            currentMenu={currentMenu}
            setCurrentMenu={(val) => {
              setCurrentMenu(val);
              setAccountId(null);
              setCreatedAtEnd(null);
              setCreatedAtStart(null);
              setClientId(null);
              setId(null);
              setBefore(null);
              setAfter(null);
              setIsShowAll(true);
            }}
            onClose={sidebar.handleClose}
            open={sidebar.open}
          />
          <MailContainer open={sidebar.open}>
            <Stack px={2} pt={4} spacing={3}>
              <Typography variant="h5">
                {labels.find((l) => l?.id === currentMenu)?.name} Logs
              </Typography>
            </Stack>
          </MailContainer>
        </Box>
      </Box>
    </Stack>
  );
};
