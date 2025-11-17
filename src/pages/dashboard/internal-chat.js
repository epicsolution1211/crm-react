import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-hot-toast";

import { ChatBlank } from "src/sections/dashboard/chat/chat-blank";
import { ChatComposer } from "src/sections/dashboard/chat/chat-composer";
import { ChatContainer } from "src/sections/dashboard/chat/chat-container";
import { ChatCreateConversationDialog } from "src/sections/dashboard/internal-chat/chat-create-conversation-dialog";
import { ChatSidebar } from "src/sections/dashboard/internal-chat/chat-sidebar";
import { ChatThread } from "src/sections/dashboard/internal-chat/chat-thread";
import { Seo } from "src/components/seo";
import { internalChatApi } from "src/api/internal-chat";
import { paths } from "src/paths";
import { thunks as agentThunk } from "src/thunks/contact_list";
import { thunks } from "src/thunks/internal_chat";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from 'src/hooks/use-settings';
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

const useInternalChats = () => {
  const dispatch = useDispatch();
  const agentIds = useSelector(state => state.contact_list.ids);
  const chats = useSelector(state => state.internal_chat.chats);

  const handleChatsGet = () => dispatch(thunks.getInternalChat({ account_ids: agentIds ?? [] }));

  // useEffect(() => {
  //   handleChatsGet();
  // }, [agentIds]);

  return {
    chats, handleChatsGet
  };
};

const Page = () => {
  const settings = useSettings();
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("conversationId") || undefined;
  const sidebar = useSidebar();
  const { chats, handleChatsGet } = useInternalChats();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_chat === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  const handleDialogOpen = useCallback(() => setCreateDialogOpen(true), []);

  const handleDialogClose = useCallback(() => setCreateDialogOpen(false), []);

  const handleConversationCreate = useCallback(
    async (data) => {
      const request = {
        ...data,
      };
      const response = await internalChatApi.createConversation(request);
      handleChatsGet();
      toast("Conversation successfully created!");
      return response;
    },
    [searchParams, user]
  );
  useEffect(() => {
    return () => {
      dispatch(agentThunk.resetList());
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(agentThunk.resetList());
    };
  }, []);

  usePageView();

  const view = threadKey ? "conversation" : compose ? "compose" : "blank";

  return (
    <>
      <Seo title={`Chat`} />
      <Divider />
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
          sx={{
            display: "flex",
            flexDirection: "row",
            height: {
              xs: 'calc(100vh - 100px)',
              md: settings?.layout === 'horizontal' ? 'calc(100vh - 140px)' : 'calc(100vh - 80px)'
            }
          }}
        >
          <ChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
            chats={chats?.conversations}
            onOpenCreateDialog={handleDialogOpen}
          />
          <ChatContainer open={sidebar.open}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ p: 2 }}
            >
              <IconButton onClick={sidebar.handleToggle}>
                <Iconify icon="lucide:menu" width={24} height={24} />
              </IconButton>
            </Stack>
            <Divider />
            {view === "conversation" && (
              <ChatThread
                threadKey={threadKey} />
            )}
            {view === "compose" && <ChatComposer />}
            {view === "blank" && <ChatBlank />}
          </ChatContainer>
        </Stack>

        <ChatCreateConversationDialog
          open={createDialogOpen}
          onClose={handleDialogClose}
          onCreateConversation={handleConversationCreate}
          handleChatsGet={handleChatsGet}
        />
      </Box>
    </>
  );
};

export default Page;
