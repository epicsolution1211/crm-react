/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material';

import { ChatMessageAdd } from "../chat/chat-message-add";
import { ChatMessages } from "../chat/chat-messages";
import { ChatThreadToolbar } from "../chat/chat-thread-toolbar";
import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { internalChatApi } from "../../../api/internal-chat";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { conversationApi } from "src/api/conversation";

const useParticipants = (threadKey) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);

  const handleParticipantsGet = useCallback(async (q = "") => {
    try {
      const { accounts } = await conversationApi.getConversationAccounts(threadKey, { q });
      setParticipants(accounts);
    } catch (err) {
      console.error(err);
      router.push(paths.dashboard.internalChat);
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

const useConversation = (id) => {
  const [conversation, setConversation] = useState({});

  const getConversation = async () => {
    try {
      const { conversation } = await conversationApi.getConversation(id);
      setConversation(conversation);
    } catch (error) {
      console.error("error", error);
    }
  }

  useEffect(() => {
    getConversation();
  }, [id]);

  return conversation;
}

export const ChatThread = (props) => {
  const { threadKey, ...other } = props;
  const bottomEl = useRef();
  const { user } = useAuth();
  const [conversation, setConversation] = useState([]);

  const { participants, handleParticipantsGet } = useParticipants(threadKey);
  const [isConnectSocket, setIsConnectSocket] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageId, setMessageId] = useState(threadKey);
  const [tempMessages, setTempMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [olderMessages, setOlderMessages] = useState([]);

  const chatMessage = useMemo(() => {
    if (messageId === threadKey) {
      const currentMessages = tempMessages?.filter((item, index, self) => (index === self.findIndex((t) => t?.id === item?.id)))
        ?.filter((item) => (item?.conversation_id?.toString() === threadKey));
      
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
      const list = messages?.filter((item, index, self) => (index === self.findIndex((t) => t?.id === item?.id)));
      return list.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });
    }
  }, [messages, tempMessages, olderMessages, messageId, threadKey]);

  const scrollToBottom = () => {
    bottomEl.current.getScrollElement().scrollTop = bottomEl.current.getContentElement().offsetHeight;
  };

  useEffect(() => {
    async function fetchData() {
      await getConversationList();
    }
    fetchData();
  }, [threadKey]);

  const getConversationList = async () => {
    try {
      const { conversation } = await conversationApi.getConversation(threadKey);
      setConversation(conversation);
    } catch (error) {
      console.error("error", error);
    }
  }

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
      console.error('error: ', error);
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

  const handleMessagePush = (message) => {
    setMessageId(message?.conversation_id?.toString());
    setTempMessages((prevState) => {
      const newMessages = prevState.concat(message);
      return newMessages.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });
    });
  };

  const handleRemoveUnReadCount = async () => {
    try {
      const request = {
        conversation_id: threadKey,
        count: 0
      };
      await internalChatApi.updateUnReadCount(request);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const handleSend = async (body) => {
    try {
      if (isConnectSocket) {
        await chatApi.sendMessage(body);
      }
    } catch (error) {
      console.error('error: ', error);
      setIsConnectSocket(false);
    }
  }

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
    }
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
    float: 'left',
    width: '4px',
    height: '4px',
    margin: '0 4px',
    background: 'white',
    borderRadius: '50%',
    opacity: '1',
    animation: 'loadingFade 1s infinite',
    '@keyframes loadingFade': {
      '0%': {
        opacity: '0',
      },
      '50%': {
        opacity: '1',
      },
      '100%': {
        opacity: '0',
      },
    },
  }
  ));

  const currentMember = useMemo(() => {
    if (user && participants?.length > 0) {
      return participants?.find((p) => p?.account_id === user?.id);
    }
  }, [participants, user]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: "hidden",
      }}
      {...other}
    >
      <ChatThreadToolbar
        internalChat
        participants={participants}
        conversationId={threadKey}
        onParticipantsGet={handleParticipantsGet}
        onMessagesGet={handleMessagesGet}
        conversation={conversation}
        getConversationList={getConversationList}
      />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Scrollbar
          ref={bottomEl}
          sx={{ maxHeight: "100%" }}>
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
      {isConnectSocket ? null :
        <Stack
          direction='row'
          alignItems='center'
        >
          <Typography sx={{ pl: 2, pr: 1, py: 1 }}>
            finding connection
          </Typography>
          <ThreeDot sx={{
            animationDelay: '0s',
          }}></ThreeDot>
          <ThreeDot sx={{
            animationDelay: '0.2s',
          }}></ThreeDot>
          <ThreeDot sx={{
            animationDelay: '0.4s',
          }}></ThreeDot>
        </Stack>}
      <Divider />
      <ChatMessageAdd
        onSend={handleSend}
        ticket={conversation}
        conversationId={threadKey}
        sendMessageAccess={(currentMember?.acc_send_message || currentMember?.owner) ?? false}
        sendMediaAccess={(currentMember?.acc_send_media || currentMember?.owner) ?? false}
        onParticipantsGet={handleParticipantsGet}
      />
    </Stack>
  );
};

ChatThread.propTypes = {
  threadKey: PropTypes.string.isRequired,
};
