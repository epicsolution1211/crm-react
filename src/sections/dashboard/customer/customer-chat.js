import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { usePageView } from "src/hooks/use-page-view";
import { ChatSidebar } from "../chat/chat-sidebar";
import { ChatContainer } from "../chat/chat-container";
import { ChatThread } from "../chat/chat-thread";
import { ChatComposer } from "../chat/chat-composer";
import { ChatBlank } from "../chat/chat-blank";
import { useSearchParams } from "src/hooks/use-search-params";
import { customersApi } from "src/api/customers";
import { ChatCreateConversationDialog } from "../chat/chat-create-conversation-dialog";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from 'src/components/iconify';

const useSidebar = () => {
  const searchParams = useSearchParams();
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

  const handeParamsUpdate = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    }
  }, [mdUp]);

  useEffect(() => {
    handeParamsUpdate();
  }, [searchParams]);

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

const usePreviousTickets = (customerId = "") => {
  const [tickets, setTickets] = useState([]);
  
  const handleTicketsGet = async () => {
    const response = await customersApi.getCustomerPrevTickets({ client_ids: [customerId] });
    setTickets(response?.tickets);
  }

  useEffect(() => {
    handleTicketsGet();
  }, []);

  return {
    tickets,
  }
}

export const CustomerChat = () => {
  const rootRef = useRef(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("conversationId") || undefined;
  const sidebar = useSidebar();
  const { tickets } = usePreviousTickets(params?.customerId);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleDialogOpen = useCallback(() => setCreateDialogOpen(true), []);

  const handleDialogClose = useCallback(() => setCreateDialogOpen(false), []);

  const handleConversationCreate = useCallback(async (data) => {
    const request = {
      ...data,
      client_ids: [params?.customerId],
      account_id: user?.id + "",
    };
    toast("Conversation successfully created!");

    return await customersApi.createTicket(request);
  }, [params, user]);

  usePageView();

  const view = threadKey ? "conversation" : compose ? "compose" : "blank";

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "background.paper",
        flex: "1 1 auto",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Stack
        ref={rootRef}
        sx={{ display: "flex", flexDirection: "row", height: "100vh" }}
      >
        <ChatSidebar
          container={rootRef.current}
          onClose={sidebar.handleClose}
          open={sidebar.open}
          customerId={params.customerId || ""}
          chats={tickets}
          onOpenCreateDialog={handleDialogOpen}
        />
        <ChatContainer open={sidebar.open}>
          <Box sx={{ p: 2 }}>
            <IconButton onClick={sidebar.handleToggle}>
              <Iconify icon="lucide:menu" width={24} height={24} />
            </IconButton>
          </Box>
          <Divider />
          {view === "conversation" && <ChatThread threadKey={threadKey} />}
          {view === "compose" && <ChatComposer />}
          {view === "blank" && <ChatBlank />}
        </ChatContainer>
      </Stack>

      <ChatCreateConversationDialog
        open={createDialogOpen}
        onClose={handleDialogClose}
        onCreateConversation={handleConversationCreate}
      />
    </Box>
  );
};
