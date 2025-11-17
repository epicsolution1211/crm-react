/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material';

import { ChatMessageAdd } from "../chat/chat-message-add";
import { ChatMessages } from "../chat/chat-messages";
import { ChatThreadToolbar } from "../chat/chat-thread-toolbar";
import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { internalChatApi } from "../../../api/internal-chat";
import { paths } from "src/paths";
import { thunks } from "../../../thunks/internal_chat";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { conversationApi } from "src/api/conversation";
import { getAssetPath } from "src/utils/asset-path";

const messages = [{
  author: {
    avatar: getAssetPath("/assets/avatars/avatar-miron-vitold.png"),
    isUser: false,
    name: "Miron Vitold"
  },
  msg: {
    attachments: [],
    authorId: "5e86805e2bafd54f66cc95c3",
    body: "Hey, nice projects! I really liked the one in react. What's your quote on kinda similar project?",
    contentType: "text",
    createdAt: 1735758592027,
    id: "5e867f0a5bc0ff2bfa07bfa6"
  }
}, {
  author: {
    avatar: getAssetPath("/assets/avatars/avatar-anika-visser.png"),
    isUser: true,
    name: "Me"
  },
  msg: {
    attachments: [],
    authorId: "5e86809283e28b96d2d38537",
    body: "I would need to know more details, but my hourly rate stats at $35/hour. Thanks!",
    contentType: "text",
    createdAt: 1735787392027,
    id: "5e867f167d5f78109ae9f2a4"
  }
}];

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
  const dispatch = useDispatch();
  const agentIds = useSelector(state => state.contact_list.ids);
  const { threadKey, ...other } = props;
  const bottomEl = useRef();
  const { user } = useAuth();
  const [conversation, setConversation] = useState([]);

  const { participants, handleParticipantsGet } = useParticipants(threadKey);
  const [isConnectSocket, setIsConnectSocket] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageId, setMessageId] = useState(threadKey);

  const [tempMessages, setTempMessages] = useState([]);

  const chatMessage = useMemo(() => {
    if (messageId === threadKey) {
      const list = tempMessages?.filter((item, index, self) => (index === self.findIndex((t) => t?.id === item?.id)))
        ?.filter((item) => (item?.conversation_id?.toString() === threadKey));
      return list;
    }
    if (messageId !== threadKey) {
      const list = messages?.filter((item, index, self) => (index === self.findIndex((t) => t?.id === item?.id)));
      return list;
    }
  }, [messages, tempMessages]);

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

  const handleMessagesGet = async () => {
    try {
      const response = await chatApi.getMessages({ conversation_id: threadKey });
      setMessages(response.messages.reverse());
      setTempMessages(response.messages);
      setIsConnectSocket(true);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const handleMessagePush = (message) => {
    setMessageId(message?.conversation_id?.toString());
    setTempMessages((prevState) => prevState.concat(message));
  };

  const handleRemoveUnReadCount = async () => {
    try {
      const request = {
        conversation_id: threadKey,
        count: 0
      };
      await internalChatApi.updateUnReadCount(request);
      dispatch(thunks.getInternalChat({ account_ids: agentIds ?? [] }))
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
    scrollToBottom();
    dispatch(thunks.getInternalChat({ account_ids: agentIds ?? [] }));
    handleRemoveUnReadCount();
  }, [chatMessage?.length]);

  useEffect(() => {
    handleMessagesGet();
    handleRemoveUnReadCount();
  }, [threadKey, isConnectSocket]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleMessagesGet();
    }, 2000);

    return () => {
      clearInterval(interval);
    }
  }, [threadKey]);

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
          <ChatMessages
            messages={messages || []}
            participants={participants || []}
            onMessagesGet={handleMessagesGet}
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
