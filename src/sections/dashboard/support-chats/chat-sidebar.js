import { useCallback, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";  
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ChatSidebarSearch } from "./chat-sidebar-search";
import { ChatThreadItem } from "./chat-thread-item";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from "src/hooks/use-settings";
import { useTwilio } from "src/hooks/use-twilio";

export const ChatSidebar = ({ container, onClose, open, ...other }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get("conversationId") || "";

  const [chats, setSupportChats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { setConversationId, setChatToken } = useTwilio();
  const settings = useSettings();

  useEffect(() => {
    if (!conversationId && !!chats.length) {
      handleConversationSelect(chats[0]?.conversation?.id, chats[0]?.conversation?.token, chats[0]?.id, chats[0]?.client_id);
      setConversationId(chats[0]?.id);
      setChatToken(chats[0]?.token);
    }
  }, [conversationId, chats]);

  const handleSearchChange = useCallback(async (event) => {
    const { value } = event.target;

    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const { conversations } = await chatApi.getSupportChats({
        q: value?.length > 0 ? value : null,
      });

      setSearchResults(conversations);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSearchClickAway = useCallback(() => {
    if (searchFocused) {
      setSearchFocused(false);
      setSearchQuery("");
    }
  }, [searchFocused]);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchSelect = useCallback(
    (id) => {
      setSearchFocused(false);
      setSearchQuery("");

      router.push(paths.dashboard.supportChats + `?conversationId=${id}`);
    },
    [router]
  );

  const handleConversationSelect = useCallback(
    (conversationId, token, ticketId, customerId) => {
      router.push(
        paths.dashboard.supportChats +
        `?conversationId=${conversationId}` +
        `&ticketId=${ticketId}` +
        `&token=${token}` +
        `&customer=${customerId}`
      );
    },
    [router]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setIsLoadingMore(true);
  }, [currentPage]);

  const handleChatsGetInitial = async () => {
    try {
      const response = await chatApi.getSupportChats({
        page: 1,
        per_page: 30,
      });
      setSupportChats(response?.conversations);
      setTotalPages(response?.total_pages);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  const handleChatsGet = async () => {
    try {
      const response = await chatApi.getSupportChats({
        per_page: currentPage * 30,
      });
      setSupportChats(response?.conversations);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    handleChatsGetInitial();
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleChatsGet();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentPage]);

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
      <ChatSidebarSearch
        isFocused={searchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      />
      <Box sx={{ display: searchFocused ? "none" : "block" }}>
        <Scrollbar
          sx={{
            maxHeight:
              settings?.layout === "horizontal"
                ? "calc(100vh - 310px)"
                : "calc(100vh - 220px)",
            px: 2,
          }}
        >
          <>
            {chats?.map((chat, index) => (
              <ChatThreadItem
                key={`${chat?.conversation?.id}-${index}`}
                active={conversationId === chat?.conversation?.id?.toString()}
                onSelect={() => {
                  handleConversationSelect(chat?.conversation?.id, chat?.conversation?.token, chat?.id, chat?.client_id);
                }}
                thread={chat}
              />
            ))}


            {currentPage < totalPages && (
              <Button
                fullWidth
                onClick={handleLoadMore}
                sx={{ mt: 2 }}
                variant="outlined"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </>
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
