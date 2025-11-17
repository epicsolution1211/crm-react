import { useCallback, useEffect, useRef, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { LandingLogsSidebar } from "./customer-logs-sidebar";
import { Scrollbar } from "src/components/scrollbar";
import { LandingLogsTable } from "./customer-logs-table";
import { LogContainer } from "./customer-log-container";
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
  { id: "Email", name: "Email" },
  { id: "PhoneNumber", name: "Phone" },
  { id: "ClientComment", name: "Comments" },
  { id: "TTransaction", name: "Transactions" },
  { id: "Position", name: "Positions" },
];

export const LandingLogs = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const [currentMenu, setCurrentMenu] = useState("");

  useEffect(() => {
    if (currentMenu === "") {
      setCurrentMenu("Email");
    }
  }, [currentMenu]);

  return (
    <Card>
      <CardContent>
        <Box
          component="main"
          sx={{
            backgroundColor: "background.paper",
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
            <LandingLogsSidebar
              container={rootRef.current}
              currentLabelId={"currentLabelId"}
              labels={labels}
              currentMenu={currentMenu}
              setCurrentMenu={(val) => {
                setCurrentMenu(val);
              }}
              onClose={sidebar.handleClose}
              open={sidebar.open}
            />
            <LogContainer open={sidebar.open}>
              <Scrollbar sx={{ height: 1 }}>
                <Box>
                  <IconButton
                    sx={{ mb: 1, ml: 1 }}
                    onClick={sidebar.handleToggle}
                  >
                    <Iconify icon="lucide:menu" width={24} height={24} />
                  </IconButton>
                  <Divider />
                </Box>
                <Stack px={2} pt={4} spacing={2}>
                  <Typography variant="h5" pb={1} pl={1}>
                    {labels.find((l) => l?.id === currentMenu)?.name} Logs
                  </Typography>
                  <LandingLogsTable
                    currentMenu={currentMenu}
                  />
                </Stack>
              </Scrollbar>
            </LogContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
