import { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ChatSidebarSearch } from "./chat-sidebar-search";
import { Scrollbar } from "src/components/scrollbar";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";
import { ChatThreadItem } from "./chat-thread-item";
import { Iconify } from "src/components/iconify";

export const ChatSidebar = ({ container, onClose, open, chats, ...other }) => {
  const router = useRouter();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const settings = useSettings();

  useEffect(() => {
    if (chats.length) {
      handleConversationSelect(chats[0]?.conversation?.id, chats[0]?.conversation?.token, chats[0]?.id, chats[0]?.client_id);
    }
  }, [chats]);

  const handleConversationSelect = useCallback(
    () => {
      router.push(
        paths.home.emails +
        `?conversationId=1513` +
        `&ticketId=6525779` +
        `&token=csdfsdfrwrwrdsdfagtre` +
        `&customer=005`
      );
    },
    [router]
  );

  const content = (
    <Stack
      sx={{
        height:
          settings?.layout === "horizontal"
            ? "calc(100vh - 230px)"
            : "calc(100vh - 70px)",
        overflow: "hidden",
      }}
    >
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Tickets
        </Typography>
        {!mdUp && (
          <IconButton onClick={onClose}>
            <Iconify icon="iconamoon:close" width={24} />
          </IconButton>
        )}
      </Stack>
      <ChatSidebarSearch/>
      <Box>
        <Scrollbar
          sx={{
            maxHeight:
              settings?.layout === "horizontal"
                ? "calc(100vh - 310px)"
                : "calc(100vh - 220px)",
            px: 2,
          }}
        >
          {chats?.map((chat, index) => (
            <ChatThreadItem
              key={index + 1}
              active={true}
              thread={chat}
            />
          ))}
        </Scrollbar>
      </Box>
    </Stack>
  );

  if (mdUp) {
    return (
      <Drawer
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            position: "relative",
            width: 380,
            zIndex: 1100
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
        {...other}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
          zIndex: 1100
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 380,
          pointerEvents: "auto",
          position: "absolute",
          zIndex: 10,
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
      {...other}
    >
      {content}
    </Drawer>
  );
};
