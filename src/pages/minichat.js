import { useState, useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

import { MiniChatMessage } from "src/sections/dashboard/mini-chat/mini-chat-message";
import { Scrollbar } from "src/components/scrollbar";
import { miniChatApi } from "src/api/minichat";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from "src/hooks/use-settings";
import { isAudioFile } from "src/utils/is-audio-file";
import { Iconify } from "src/components/iconify";

const MiniChat = () => {
  const bottomEl = useRef();
  const settings = useSettings();
  const [text, setText] = useState("");
  const searchParams = useSearchParams();

  const [isConnectSocket, setIsConnectSocket] = useState(false);

  const token = searchParams.get("token");
  const full_name = searchParams.get("full_name");
  const origin = searchParams.get("origin");
  const paletteMode = searchParams.get("paletteMode");
  const colorPreset = searchParams.get("colorPreset");
  const client_token = searchParams.get("clientToken");
  const conversation = searchParams.get("conversation");
  const lang = searchParams.get("lang");
  const server_url = searchParams.get("serverUrl");

  useEffect(() => {
    if (server_url) {
      localStorage.setItem("mini_chat_server_url", server_url);
    }
  }, [server_url]);

  useEffect(() => {
    settings.handleUpdate({
      paletteMode,
      colorPreset,
    });
  }, [paletteMode, colorPreset]);

  const [isLoading, setIsLoading] = useState(false);
  const [showEllipsis, setShowEllipsis] = useState(false);

  const [miniChatAppearance, setMiniChatAppearance] = useState();

  const [messages, setMessages] = useState([]);
  const [startNotice, setStartNotice] = useState();
  const [firstText, setFirstText] = useState("");
  const firstMessage = {
    client_id: "1",
    description: firstText,
    client: {
      avatar: "https://octolit.com/assets/media/user.png",
      active: true,
    },
  };

  const hasNonSpace = (string) => {
    for (let i = 0; i < string.length; i++) {
      if (string[i] !== " ") {
        return true;
      }
    }
    return false;
  };

  // eslint-disable-next-line no-unused-vars
  const [messageId, setMessageId] = useState();
  const [tempMessages, setTempMessages] = useState([]);

  const [isPending, setIsPending] = useState(false);

  const [isMessage, setIsMessage] = useState(false);

  const [shouldScroll, setShouldScroll] = useState(false);

  const scrollToBottom = () => {
    if (bottomEl.current) {
      const scrollElement = bottomEl.current.getScrollElement();
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 500);
      }
    }
  };

  const handleMessagesGet = async (token, messagesId) => {
    try {
      const res = await miniChatApi.getMessages(token, {
        conversation_id: messagesId,
      });
      setMessages(res?.data?.messages?.reverse());
      setTempMessages(res?.data?.messages);
      setIsMessage(true);
      setIsConnectSocket(true);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAppearance = async () => {
    try {
      const res = await miniChatApi.getMiniAppearance(token);
      setMiniChatAppearance(res?.data);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getStartNotice = async () => {
    try {
      const res = await miniChatApi.getMiniStartNotice(token);
      setStartNotice(res?.data?.starting_notice);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const chatMessage = useMemo(() => {
    setIsLoading(false);
    setIsPending(false);
    if (messageId !== conversation) {
      const list = messages?.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t?.id === item?.id)
      );
      return list;
    } else {
      const list = tempMessages
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id)
        )
        ?.filter((item) => item?.conversation_id === conversation);
      return list;
    }
  }, [messages, tempMessages, conversation]);

  useEffect(() => {
    if (conversation) {
      const conversationId = conversation;
      if (conversationId && client_token) {
        handleMessagesGet(client_token, conversationId);
      }
    }
  }, [isConnectSocket, client_token, conversation]);

  useEffect(() => {
    if (conversation && isMessage) {
      const conversationId = conversation;
      const interval = setInterval(() => {
        handleMessagesGet(client_token, conversationId);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [conversation, isMessage, client_token]);

  // const refreshTickets = async () => {
  //   const ticketInfos = localStorage.getItem("ticket_tokens")
  //     ? JSON.parse(localStorage.getItem("ticket_tokens"))
  //     : [];
  //   const ticketTokens = ticketInfos?.map((ti) => ti.ticketToken);
  //   try {
  //     const data = {
  //       client: true,
  //     };
  //     if (!client_token) {
  //       data["ticket_tokens"] = ticketTokens;
  //     }
  //     const res = await miniChatApi.getTickets(client_token ? client_token : token, data);
  //     setTickets(res?.data?.tickets);
  //     setIsMessage(false);
  //   } catch (error) {
  //     console.error("error: ", error);
  //   }
  // };

  // const getTickets = async (ticket) => {
  //   setIsPending(true);
  //   const ticketInfos = localStorage.getItem("ticket_tokens")
  //     ? JSON.parse(localStorage.getItem("ticket_tokens"))
  //     : [];
  //   const ticketTokens = ticketInfos?.map((ti) => ti.ticketToken);
  //   try {
  //     const data = {
  //       client: true,
  //     };
  //     if (!client_token) {
  //       data["ticket_tokens"] = ticketTokens;
  //     }
  //     const res = await miniChatApi.getTickets(client_token ? client_token : token, data);
  //     setTickets(res?.data?.tickets);
  //     // if (ticket) {
  //     //   setSelectedTicket(ticket);
  //     // } else {
  //     //   setSelectedTicket(res?.data?.tickets[0]);
  //     // }
  //     if (res?.data?.tickets?.length === 0) {
  //       setIsPending(false);
  //     }
  //   } catch (error) {
  //     console.error("error: ", error);
  //   }
  // };

  const handleInitialize = async () => {
    setFirstText(text ?? "");
    setIsLoading(true);
    try {
      const request = {
        first_message: text,
        full_name: full_name ?? "Client",
        origin,
        client_token: client_token,
      };
      const res = await miniChatApi.initializeChat(token, request);
      const ticket_tokens = localStorage.getItem("ticket_tokens");
      if (!ticket_tokens) {
        localStorage.setItem(
          "ticket_tokens",
          JSON.stringify([
            {
              account_id: res?.data?.client?.id,
              chat_account_id: `client${res?.data?.client?.id}`,
              tk: res?.data?.token,
              ticketToken: res?.data?.ticket_token,
            },
          ])
        );
      } else {
        const parsedTicketTokens = JSON.parse(ticket_tokens);
        parsedTicketTokens.push({
          account_id: res?.data?.client?.id,
          chat_account_id: `client${res?.data?.client?.id}`,
          tk: res?.data?.token,
          ticketToken: res?.data?.ticket_token,
        });
        localStorage.setItem(
          "ticket_tokens",
          JSON.stringify(parsedTicketTokens)
        );
      }
      if (startNotice.enabled) {
        setShowEllipsis(true);
      } else {
        setShowEllipsis(false);
      }
      // getTickets({ ticket: res?.data?.ticket });
      setTickets((prev) => prev.concat({ ticket: res?.data?.ticket }));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleSend = () => {
    if (hasNonSpace(text)) {
      if (conversation && isConnectSocket) {
        submitMessage();
      } else {
        handleInitialize();
      }
      setText("");
    }
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      handleSend();
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    getStartNotice();
    getAppearance();
    // getTickets();
  }, [token, client_token, conversation]);

  useEffect(() => {
    if (shouldScroll && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        setShouldScroll(false);
      }, 100);
    }
  }, [messages, shouldScroll]);

  const getAuthor = (message, company = {}) => {
    if (message?.account_id && message?.system) {
      const sender = {
        name: company?.name,
        avatar: company?.avatar ?? "",
        isClient: false,
        active: company?.active ?? true,
      };
      return sender;
    }

    if (message?.client_id) {
      return {
        name:
          message?.client && message?.client?.first_name
            ? message?.client?.first_name + " " + (message?.client?.last_name ?? "")
            : `Client ${message?.client_id}`,
        avatar: message?.client.avatar,
        isClient: true,
        active: message?.client.active,
      };
    }

    if (!message?.account_id) {
      if (message?.system_event === 7) {
        return {
          name: company?.ai_name,
          avatar: company?.ai_avatar,
          isClient: false,
          active: company?.active,
        };
      } else {
        return {
          name: company?.name,
          avatar: company?.avatar,
          isClient: false,
          active: company?.active,
        };
      }
    }
    return {
      avatar: message?.account?.avatar,
      name: `${message?.account.first_name} ${message?.account?.last_name}`,
      isClient: false,
      active: message?.account?.on_duty,
    };
  };

  const threeDotMessage = {
    system_event: 7,
    system: true,
    ellipsis: true,
  };

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

  const submitMessage = async () => {
    try {
      const conversationId = conversation;
      const request = {
        conversation_id: conversationId,
        description: text,
        html_description: text,
      };
      await miniChatApi.sendMessage(client_token, request);

      setTimeout(() => {
        setShouldScroll(true);
        handleMessagesGet(client_token, conversationId);
      }, 1500);
    } catch (error) {
      setIsConnectSocket(false);
      console.error("error: ", error);
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        height: "100vh",
        backgroundColor: paletteMode === "dark" ? "#161C24" : "#FFFFFF",
      }}
      justifyContent="space-between"
    >
      {/* <Stack direction="row">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            if (isMessage) {
              refreshTickets();
            } else {
              setIsMessage(true);
            }
          }}
          color="inherit"
        >
          {isMessage ? "History" : "Conversations"}
        </Button>
      </Stack> */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {isMessage ? (
          <Scrollbar ref={bottomEl} sx={{ maxHeight: "100%" }}>
            <Stack spacing={2} sx={{ p: 3 }}>
              {(conversation
                ? isLoading
                  ? startNotice?.enabled
                    ? [startNotice, firstMessage, threeDotMessage]
                    : [firstMessage]
                  : isPending
                  ? []
                  : showEllipsis
                  ? startNotice?.enabled
                    ? [startNotice, ...chatMessage, threeDotMessage]
                    : [...chatMessage, threeDotMessage]
                  : startNotice?.enabled
                  ? [startNotice, ...chatMessage]
                  : [...chatMessage]
                : isLoading
                ? startNotice?.enabled
                  ? [startNotice, firstMessage, threeDotMessage]
                  : [firstMessage]
                : startNotice?.enabled
                ? [startNotice]
                : []
              )?.filter(message => !message?.deleted)?.map((message, index) => {
                const author = getAuthor(message, miniChatAppearance?.company);
                const contentType = message?.sent_email
                  ? "email"
                  : message.files_urls?.length &&
                    message?.system_event !== 6 &&
                    isAudioFile(message?.files_urls?.[0]?.name)
                  ? "Audio"
                  : message.files_urls?.length &&
                    message?.system_event !== 6 &&
                    !isAudioFile(message?.files_urls?.[0]?.name)
                  ? "textWithAttachment"
                  : message.system
                  ? "system"
                  : "text";
                const systemInfo = {
                  type: message?.system_event,
                  systemEventAccount: message?.system_event_account,
                  account: message?.account ? message?.account : {},
                };
                return (
                  <MiniChatMessage
                    authorAvatar={author?.avatar}
                    authorName={author?.name}
                    active={author?.active}
                    isNote={message?.note}
                    body={message?.description || message?.html_description}
                    attachments={message?.files_urls}
                    contentType={contentType}
                    createdAt={message?.created_at}
                    key={message?.id}
                    index={index}
                    isClient={author?.isClient}
                    systemInfo={systemInfo}
                  />
                );
              })}
            </Stack>
          </Scrollbar>
        ) : (
          <></>
          // <Stack
          //   direction="column"
          //   justifyContent="space-between"
          //   sx={{
          //     flexGrow: 1,
          //     height: 1,
          //   }}
          // >
          //   <Stack
          //     sx={{
          //       flexGrow: 1,
          //       height: 1,
          //       overflow: "hidden",
          //     }}
          //   >
          //     {tickets?.length > 0 ? (
          //       <Scrollbar ref={bottomEl} sx={{ maxHeight: "100%" }}>
          //         <Stack spacing={2} sx={{ px: 3, pt: 2 }}>
          //           {tickets?.map((item, index) => (
          //             <Chip
          //               label={item?.ticket?.conversation?.name}
          //               sx={{ justifyContent: "flex-start" }}
          //               color={
          //                 selectedTicket?.ticket?.id === item?.ticket?.id
          //                   ? "primary"
          //                   : "default"
          //               }
          //               onClick={() => {
          //                 if (selectedTicket?.ticket?.id === item?.ticket?.id) {
          //                   setIsMessage(true);
          //                 } else {
          //                   setSelectedTicket(item);
          //                 }
          //               }}
          //               key={index}
          //             />
          //           ))}
          //         </Stack>
          //       </Scrollbar>
          //     ) : (
          //       <Stack
          //         sx={{ height: "100%", w: 1, px: 6 }}
          //         direction="column"
          //         justifyContent="center"
          //         alignItems="center"
          //       >
          //         <Typography variant="h5" pb={3}>
          //           No conversation yet
          //         </Typography>
          //         <Typography variant="subtitle2" textAlign="center">
          //           Have a question? Open a new ticket to get assist. Your
          //           conversation history will show here.
          //         </Typography>
          //       </Stack>
          //     )}
          //   </Stack>
          //   {/* <Button
          //     sx={{ mb: 1 }}
          //     onClick={() => {
          //       setIsMessage(true);
          //       setMessages([]);
          //       setSelectedTicket("");
          //     }}
          //   >
          //     New Chat
          //   </Button> */}
          // </Stack>
        )}
      </Box>
      {isMessage && (
        <>
          {!isConnectSocket && client_token && (
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
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ px: 2, py: 1 }}
          >
            <OutlinedInput
              multiline
              onChange={(event) => setText(event?.target?.value)}
              onKeyDown={handleEnter}
              value={text}
              fullWidth
              placeholder={
                lang === "de"
                  ? "Hinterlassen Sie eine Nachricht"
                  : "Leave a message"
              }
              size="small"
            />
            <Tooltip
              title={lang === "de" ? "Nachricht senden" : "Send Message"}
            >
              <IconButton
                onClick={() => handleSend()}
                color="primary"
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <Iconify icon="icon-park-outline:send" width={24}/>
              </IconButton>
            </Tooltip>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default MiniChat;
