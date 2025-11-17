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
import { SUPPORTCHATS } from "src/api/mock/_support_chats";
import { ChatThreadToolbar } from "../support-chats/chat-thread-toolbar";
import { getAssetPath } from "src/utils/asset-path";

const emailMessages = [
  {
    author: {
      avatar: getAssetPath("/assets/avatars/avatar-miron-vitold.png"),
      isUser: false,
    },
    msg: {
      attachments: [],
      authorId: "5e86805e2bafd54f66cc95c3",
      body: `<div class="MuiStack-root css-191tt3w-MuiStack-root"><p><strong>Optimizing Your CRM Usage for Better Results</strong></p><p><br></p><p>I hope this email finds you well!</p><p>As part of our commitment to helping you get the most out of your CRM, I wanted to share some tips and insights to optimize your experience:</p><p><strong>1. Maximize Productivity:</strong></p><p>Utilize automation features like task scheduling, follow-up reminders, and email templates to streamline daily operations.</p><p><strong>2. Data Insights:</strong></p><p>Take advantage of the analytics dashboard to track customer interactions and improve decision-making.</p><p>Best regards,</p><p><span>Olivia Martin</span></p></div>`,
      contentType: "email",
      createdAt: 1735758592027,
      id: "5e867f0a5bc0ff2bfa07bfa6"
    }
  }, 
];

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
            messages={emailMessages || []}
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
