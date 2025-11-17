import { useCallback, useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { LogsSidebar } from "./logs-sidebar";
import { Scrollbar } from "src/components/scrollbar";
import {
  clientLogsMockedList,
  commentLogsMockedList,
  emailLogsMockedList,
  phoneLogsMockedList,
  positionLogsMockedList,
  transactionLogsMockedList,
} from "src/utils/constant/mock-data";
import { LogsTableList } from "./logs-table-list";
import { MailContainer } from "src/sections/dashboard/mail/mail-container";
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
  { id: "Client", name: "Client" },
  { id: "TTransaction", name: "Transactions" },
  { id: "Position", name: "Positions" },
  { name: "Email", id: "Email" },
  { name: "Phone", id: "PhoneNumber" },
  { name: "Comments", id: "ClientComment" },
];

export const LogsTable = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const [currentMenu, setCurrentMenu] = useState("Client");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogs("Client");
  }, []);

  const getLogs = (menu) => {
    setLogs([]);
    const logsCategory = {
      Client: clientLogsMockedList,
      TTransaction: transactionLogsMockedList,
      Position: positionLogsMockedList,
      ClientComment: commentLogsMockedList,
      PhoneNumber: phoneLogsMockedList,
      Email: emailLogsMockedList,
    };
    setLogs(logsCategory[menu]);
  };

  return (
    <Stack spacing={4}>
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
                position: 'relative',
              }}
            >
              <LogsSidebar
                container={rootRef.current}
                currentLabelId={"currentLabelId"}
                labels={labels}
                currentMenu={currentMenu}
                setCurrentMenu={(val) => {
                  setCurrentMenu(val);
                  getLogs(val);
                }}
                onClose={sidebar.handleClose}
                open={sidebar.open}
              />
              <MailContainer open={sidebar.open}>
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
                  <Stack px={2} pt={4} spacing={5}>
                    <Typography variant="h5">
                      {labels.find((l) => l?.id === currentMenu)?.name} Logs
                    </Typography>

                    <LogsTableList logs={logs} />
                  </Stack>
                </Scrollbar>
              </MailContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};
