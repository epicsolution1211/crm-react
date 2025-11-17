import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';

import { ChatContainer } from "src/sections/dashboard/chat/chat-container";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { thunks as agentThunk } from "src/thunks/contact_list";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from 'src/hooks/use-settings';
import { ChatSidebar } from "src/sections/landing/emails/chat-sidebar";
import { ChatThread } from "src/sections/landing/emails/chat-thread";
import { Iconify } from "src/components/iconify";
import { SUPPORTCHATS } from "src/api/mock/_support_chats";

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

const Page = () => {
  const settings = useSettings();
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("conversationId") || undefined;
  const sidebar = useSidebar();
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_support_chats === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(agentThunk.resetList());
    }
  }, []);

  usePageView();

  const view = threadKey ? "conversation" : compose ? "compose" : "blank";

  return (
    <>
      <Seo title="Support Chats" />
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
              md: settings?.layout === 'horizontal' ? 'calc(100vh - 188px)' : 'calc(100vh - 128px)'
            }
          }}
        >
          <ChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
            chats={SUPPORTCHATS.CHATS}
          />
          <ChatContainer open={sidebar.open}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 2 }}
            >
              <IconButton onClick={sidebar.handleToggle}>
                <Iconify icon="lucide:menu" width={24} height={24} />
              </IconButton>

              {SUPPORTCHATS.CLIENTS?.client ?
                <Stack direction='row' gap={0.5} alignItems='center'>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    pl={0.5}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Avatar
                      src={SUPPORTCHATS.CLIENTS?.client?.avatar}
                      width={28}
                      height={28}
                    />
                    <Typography>{SUPPORTCHATS.CLIENTS?.client?.full_name}</Typography>
                    <Iconify icon={`circle-flags:${SUPPORTCHATS.CLIENTS?.client?.country?.toLowerCase()}`} width={24} />
                  </Stack>

                  <IconButton
                    sx={{ '&:hover': { color: 'primary.main' }, color: 'text.primary' }}
                  >
                    <Iconify icon="carbon:arrow-right" />
                  </IconButton>
                </Stack>
                :
                null}
              <Stack></Stack>
            </Stack>
            <Divider />
            {view === "conversation" && (
              <ChatThread
                threadKey={threadKey} />
            )}
          </ChatContainer>
        </Stack>
      </Box>
    </>
  );
};

export default Page;
