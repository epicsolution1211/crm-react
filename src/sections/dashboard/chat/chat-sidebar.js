import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Skeleton from "@mui/material/Skeleton";

import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { ChatSidebarSearch } from "./chat-sidebar-search";
import { ChatThreadItem } from "./chat-thread-item";
import { useSearchParams } from "src/hooks/use-search-params";
import { customersApi } from "src/api/customers";
import { useTwilio } from "src/hooks/use-twilio";
import { useSettings } from "src/hooks/use-settings";
import { useAuth } from "src/hooks/use-auth";
import { thunks } from "src/thunks/client_chat";
import { Iconify } from "src/components/iconify";

export const ChatSidebar = (props) => {
  const {
    container,
    onClose,
    open,
    customerId,
    chats,
    onOpenCreateDialog,
    clientChat = false,
    ...other
  } = props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const settings = useSettings();
  const conversationId = searchParams.get("conversationId") || "";
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { setConversationId, setTicketId, setChatToken } = useTwilio();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSelectedChat, setHasSelectedChat] = useState(false);

  const handleConversationSelect = useCallback(
    (conversationId, ticketId) => {
      const returnTo = searchParams.get("returnTo") || "";
      setHasSelectedChat(true);
      router.push(
        paths.dashboard.chat +
          `?customer=${customerId}` +
          `&conversationId=${conversationId}` +
          `&ticketId=${ticketId}` +
          `&returnTo=${returnTo}`
      );
    },
    [router, customerId, searchParams]
  );

  useEffect(() => {
    const returnTo = searchParams.get("returnTo");

    if (returnTo === "list" && chats?.length > 0 && !hasSelectedChat) {
      const supportChat = chats.find(chat => 
        chat?.labels?.[0]?.name === "Support"
      );

      if (supportChat) {
        handleConversationSelect(
          supportChat.conversation_id,
          supportChat.id
        );
        setConversationId(supportChat.conversation_id);
        setTicketId(supportChat.id);
        setChatToken(supportChat.conversation.token);
      } else {
        handleConversationSelect(
          chats?.[0]?.conversation_id,
          chats?.[0]?.id
        );
        setConversationId(chats?.[0]?.conversation_id);
        setTicketId(chats?.[0]?.id);
        setChatToken(chats?.[0]?.conversation.token);
      }
    }
    if (!conversationId && !!chats?.length && !hasSelectedChat) {
      handleConversationSelect(
        chats?.[0]?.conversation_id,
        chats?.[0]?.id
      );
      setConversationId(chats?.[0]?.conversation_id);
      setTicketId(chats?.[0]?.id);
      setChatToken(chats?.[0]?.conversation.token);
    }
  }, [conversationId, chats, searchParams, handleConversationSelect, setConversationId, setTicketId, setChatToken, hasSelectedChat]);

  useEffect(() => {
    setHasSelectedChat(false);
  }, [customerId]);

  const handleSearchChange = useCallback(async (event) => {
    const { value } = event.target;

    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const { tickets } = await customersApi.getCustomerPrevTickets({
        q: value?.length > 0 ? value : null,
      });

      setSearchResults(tickets);
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

      router.push(
        paths.dashboard.customers.index +
          `/${customerId}` +
          `?conversationId=${id}`
      );
    },
    [router, customerId]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setIsLoadingMore(true);
  }, [currentPage]);

  useEffect(() => {
    dispatch(thunks.getClientChat({ 
      client_ids: [customerId],
      page: 1,
      per_page: 30
    })).then(response => {
      if (response.payload?.pagination) {
        setTotalPages(response.payload.pagination.total_pages);
      }
    });
}, [dispatch, customerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(thunks.getClientChat({
        client_ids: [customerId],
        per_page: currentPage * 30
      })).then(() => {
        setIsLoadingMore(false);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentPage, dispatch, customerId]);

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
        {user?.acc?.acc_e_chat_create ? (
          <Button
            onClick={onOpenCreateDialog}
            startIcon={<Iconify icon="lucide:plus" width={24} />}
            variant="contained"
          >
            Add
          </Button>
        ) : null}
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
                : "calc(100vh - 230px)",
            px: 2,
          }}
        >
          {!chats?.length ? (
            <Stack>
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
              <Skeleton variant="text" height="70px" />
            </Stack>
          ) : (
            <>
              {chats?.map((chat) => (
                <ChatThreadItem
                  active={
                    conversationId === chat?.conversation_id?.toString()
                  }
                  key={chat?.id}
                  onSelect={() =>
                    handleConversationSelect(
                      chat?.conversation_id,
                      chat?.id
                    )
                  }
                  thread={chat}
                  clientChat={clientChat}
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
          )}
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

ChatSidebar.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  customerId: PropTypes.string,
  chats: PropTypes.array,
  onOpenCreateDialog: PropTypes.func,
};
