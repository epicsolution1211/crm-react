import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { conversationApi } from "src/api/conversation";
import { customersApi } from "src/api/customers";
import { internalChatApi } from "src/api/internal-chat";
import { paths } from "src/paths";
import { thunks } from "src/thunks/client_chat";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { useDispatch } from "react-redux";
import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { ChatMessageAdd } from "../chat/chat-message-add";
import { ChatMessages } from "../chat/chat-messages";
import { ChatThreadToolbar } from "../chat/chat-thread-toolbar";

const useParticipants = (threadKey) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);

  const handleParticipantsGet = useCallback(async () => {
    try {
      const { accounts } = await conversationApi.getConversationAccounts(
        threadKey
      );
      setParticipants(accounts);
    } catch (err) {
      console.error(err);
      router.push(paths.dashboard.chat);
    }
  }, [router, threadKey]);

  useEffect(() => {
    handleParticipantsGet();
  }, [threadKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleParticipantsGet();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [handleParticipantsGet, threadKey]);

  return {
    participants,
    handleParticipantsGet,
  };
};

const useTicket = () => {
  const isMounted = useMounted();
  const [ticket, setTicket] = useState(null);
  const searchParams = useSearchParams();

  const handleTicketGet = useCallback(async () => {
    const ticketId = searchParams.get("ticketId");

    if (ticketId) {
      const response = await customersApi.getTicket({ id: ticketId });
      if (isMounted()) setTicket(response?.ticket);
    }
  }, [searchParams, isMounted]);

  useEffect(() => {
    handleTicketGet();
  }, [searchParams, isMounted]);

  return { ticket, handleTicketGet };
};

export const ChatThread = (props) => {
  const { threadKey, tickets, handleTicketsGet = () => { }, ...other } = props;
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer");
  const dispatch = useDispatch();
  const bottomEl = useRef();
  const { user } = useAuth();
  const { ticket, handleTicketGet } = useTicket();
  const { participants, handleParticipantsGet } = useParticipants(threadKey);
  const [messages, setMessages] = useState([]);
  const [messageId] = useState(threadKey);
  const [tempMessages, setTempMessages] = useState([]);
  const [isConnectSocket, setIsConnectSocket] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [olderMessages, setOlderMessages] = useState([]);

  const chatMessage = useMemo(() => {
    if (messageId === threadKey) {
      const currentMessages = tempMessages
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id)
        )
        ?.filter((item) => item?.conversation_id?.toString() === threadKey);
      
      const allMessages = [...olderMessages, ...currentMessages];
      const uniqueMessages = allMessages.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t?.id === item?.id)
      );
      
      return uniqueMessages.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });
    }
    if (messageId !== threadKey) {
      const list = messages?.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t?.id === item?.id)
      );
      return list.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });
    }
  }, [messages, tempMessages, olderMessages, messageId, threadKey]);

  const scrollToBottom = () => {
    bottomEl.current.getScrollElement().scrollTop =
      bottomEl.current.getContentElement().offsetHeight;
  };

  const handleMessagesGet = async (page = 1, isRefresh = false) => {
    try {
      const response = await chatApi.getMessages({
        conversation_id: threadKey,
        page: page,
      });
      
      const messages = response.messages || [];
      
      const sortedMessages = messages.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });
      
      if (isRefresh) {
        setMessages(sortedMessages);
        setTempMessages(sortedMessages);
        setHasMoreMessages(sortedMessages.length > 0);
      } else {
        if (page === 1) {
          setMessages(sortedMessages);
          setTempMessages(sortedMessages);
          setHasMoreMessages(sortedMessages.length > 0);
        }
      }
      
      setIsConnectSocket(true);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleLoadOlderMessages = async () => {
    if (isLoadingOlder || !hasMoreMessages) return;
    
    setIsLoadingOlder(true);
    const scrollElement = bottomEl.current.getScrollElement();
    const currentScrollHeight = scrollElement.scrollHeight;
    
    try {
      const nextPage = currentPage + 1;
      const response = await chatApi.getMessages({
        conversation_id: threadKey,
        page: nextPage,
      });
      
      const newMessages = response.messages || [];
      
      if (newMessages.length > 0) {
        setOlderMessages(prev => [...newMessages, ...prev]);
        setCurrentPage(nextPage);
        setHasMoreMessages(newMessages.length > 0);
        
        setTimeout(() => {
          const newScrollHeight = scrollElement.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;
          scrollElement.scrollTop = heightDifference;
        }, 100);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("error loading older messages: ", error);
    } finally {
      setIsLoadingOlder(false);
    }
  };

  const handleScroll = useCallback(() => {
    const scrollElement = bottomEl.current.getScrollElement();
    if (!scrollElement) return;
    
    const { scrollTop } = scrollElement;
    
    if (scrollTop < 100 && hasMoreMessages && !isLoadingOlder) {
      handleLoadOlderMessages();
    }
  }, [hasMoreMessages, isLoadingOlder]);

  const handleSend = async (body) => {
    try {
      if (isConnectSocket) {
        await chatApi.sendMessage(body);
      }
    } catch (error) {
      setIsConnectSocket(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRemoveUnReadCount = async () => {
    try {
      const request = {
        conversation_id: threadKey,
        count: 0,
      };
      await internalChatApi.updateUnReadCount(request);
      dispatch(thunks.getClientChat({ client_ids: [customerId] }));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleRemoveUnReadCount();
  }, [chatMessage?.length]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMoreMessages(true);
    setIsLoadingOlder(false);
    setOlderMessages([]);
    setMessages([]);
    setTempMessages([]);
    handleMessagesGet(1, true);
    handleRemoveUnReadCount();
  }, [threadKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleMessagesGet(1, true);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [threadKey]);

  useEffect(() => {
    const scrollElement = bottomEl.current?.getScrollElement();
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    if (chatMessage?.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatMessage?.length]);

  const ThreeDot = styled(Box)(() => ({
    float: "left",
    width: "4px",
    height: "4px",
    margin: "0 4px",
    background: "white",
    borderRadius: "50%",
    opacity: "1",
    animation: "loadingFade 1s infinite",
    "@keyframes loadingFade": {
      "0%": {
        opacity: "0",
      },
      "50%": {
        opacity: "1",
      },
      "100%": {
        opacity: "0",
      },
    },
  }));

  const currentMember = useMemo(() => {
    if (user && participants?.length > 0) {
      return participants?.find((p) => p?.account_id === user?.id);
    }
  }, [participants, user]);

  const customerAccess = useMemo(() => {
    const currentAccountId = user?.id;
    const customerDesk = props?.customer?.client?.desk_id;
    const agentDesks = user?.desk_ids;
    const allClientsAccess =
      user?.acc?.acc_v_client_all === undefined ||
      user?.acc?.acc_v_client_all === true;
    const singleDeskAccess =
      user?.acc?.acc_v_desk_clients === undefined ||
      user?.acc?.acc_v_desk_clients === true;
    const isClientInDesk = agentDesks?.includes(customerDesk);
    const isAssignedToClient = props?.customer?.client_agents?.find(
      (agent) => agent?.id === currentAccountId
    );

    if (
      allClientsAccess ||
      isAssignedToClient ||
      (singleDeskAccess && isClientInDesk)
    ) {
      return true;
    }
    return false;
  }, [props?.customer, ticket, user]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: "hidden",
      }}
      {...other}
    >
      <ChatThreadToolbar
        participants={participants}
        conversationId={threadKey}
        onParticipantsGet={handleParticipantsGet}
        onTicketsGet={handleTicketsGet}
        ticket={ticket}
        conversation={{ conversation: ticket?.conversation }}
        tickets={tickets}
        onTicketGet={handleTicketGet}
        calling={false}
        isClientChat
        isSupportChat
      />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Scrollbar ref={bottomEl} sx={{ maxHeight: "100%" }}>
          {isLoadingOlder && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Loading older messages...
              </Typography>
            </Box>
          )}
          <ChatMessages
            messages={chatMessage || []}
            participants={participants || []}
            onMessagesGet={() => handleMessagesGet(1, true)}
          />
        </Scrollbar>
      </Box>
      {isConnectSocket ? null : (
        <Stack direction="row" alignItems="center">
          <Typography sx={{ pl: 2, pr: 1, py: 1 }}>
            finding connection
          </Typography>
          <ThreeDot
            sx={{
              animationDelay: "0s",
            }}
          ></ThreeDot>
          <ThreeDot
            sx={{
              animationDelay: "0.2s",
            }}
          ></ThreeDot>
          <ThreeDot
            sx={{
              animationDelay: "0.4s",
            }}
          ></ThreeDot>
        </Stack>
      )}
      <Divider />
      <ChatMessageAdd
        onSend={handleSend}
        ticket={ticket}
        conversationId={threadKey}
        sendMessageAccess={customerAccess}
        sendMediaAccess={currentMember?.acc_send_media}
        onParticipantsGet={handleParticipantsGet}
      />
    </Stack>
  );
};

ChatThread.propTypes = {
  threadKey: PropTypes.string.isRequired,
};
