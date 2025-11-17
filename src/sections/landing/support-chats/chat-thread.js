import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { Scrollbar } from "src/components/scrollbar";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { ChatMessageAdd } from "../chat/chat-message-add";
import { ChatMessages } from "../chat/chat-messages";
import { ChatThreadToolbar } from "./chat-thread-toolbar";
import { SUPPORTCHATS } from "src/api/mock/_support_chats";
import { getAssetPath } from "src/utils/asset-path";

const supportMessages = [{
  author: {
    avatar: getAssetPath("/assets/avatars/avatar-miron-vitold.png"),
    isUser: false,
  },
  msg: {
    attachments: [],
    authorId: "5e86805e2bafd54f66cc95c3",
    body: "Hey, how is it going for my reported problem?",
    contentType: "text",
    createdAt: 1735758592027,
    id: "5e867f0a5bc0ff2bfa07bfa6"
  }
}, {
  author: {
    avatar: getAssetPath("/assets/avatars/avatar-anika-visser.png"),
    isUser: true,
  },
  msg: {
    attachments: [],
    authorId: "5e86809283e28b96d2d38537",
    body: "Please try again. it will work for you.",
    contentType: "text",
    createdAt: 1735787392027,
    id: "5e867f167d5f78109ae9f2a4"
  }
}];

const useParticipants = (threadKey) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);

  const handleParticipantsGet = useCallback(async () => {
    try {
      setParticipants(SUPPORTCHATS.ACCOUNT);
    } catch (err) {
      console.error(err);
      router.push(paths.dashboard.chat);
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

const useTicket = () => {
  const isMounted = useMounted();
  const [ticket, setTicket] = useState(null);
  const searchParams = useSearchParams();

  const handleTicketGet = useCallback(async () => {
    const ticketId = searchParams.get("ticketId");

    if (ticketId) {
      if (isMounted()) setTicket(SUPPORTCHATS.TICKET?.ticket);
    }
  }, [searchParams, isMounted]);

  useEffect(() => {
    handleTicketGet();
  }, [searchParams, isMounted]);

  return { ticket, handleTicketGet };
};

export const ChatThread = (props) => {
  const { threadKey, tickets, handleTicketsGet = () => { }, ...other } = props;
  const bottomEl = useRef();
  const { user } = useAuth();
  const { ticket, handleTicketGet } = useTicket();
  const { participants, handleParticipantsGet } = useParticipants(threadKey);

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
        participants={participants}
        conversationId={threadKey}
        onParticipantsGet={handleParticipantsGet}
        onTicketsGet={handleTicketsGet}
        ticket={SUPPORTCHATS.TICKET}
        conversation={{ conversation: SUPPORTCHATS.TICKET?.conversation }}
        tickets={tickets}
        onTicketGet={handleTicketGet}
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
          <ChatMessages
            messages={supportMessages || []}
            participants={participants || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd
        onSend={() => {}}
        ticket={ticket}
        conversationId={threadKey}
        sendMessageAccess={true}
        sendMediaAccess={currentMember?.acc_send_media}
        onParticipantsGet={()=> {}}
      />
    </Stack>
  );
};
