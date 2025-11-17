import { useState, useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { alpha, useTheme } from "@mui/system";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { useInternalBrands } from "src/hooks/custom/use-brand";
import { PaymentProviderCreateDialog } from "./create-provider-dialog";
import { integrationApi } from "src/api/integration";
import { paths } from "src/paths";
import providersData from "./data.json";

const dummyConversations = [
  {
    id: 1,
    providerId: "instaxchange",
    providerName: "InstaXChange",
    providerLogo: "/assets/providers/instaxchange.jpeg",
    lastMessage: "Thank you for your interest in our payment solutions.",
    lastMessageTime: new Date("2025-09-25T17:25:00"),
    unread: true,
    active: true,
    messages: [
      {
        id: 1,
        senderId: "instaxchange",
        senderName: "InstaXChange",
        senderAvatar: "/assets/providers/instaxchange.jpeg",
        message: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,",
        timestamp: new Date("2025-09-30T18:45:00"),
        isProvider: true
      },
      {
        id: 2,
        senderId: "user_1",
        senderName: "Lucy .R",
        senderAvatar: "/assets/avatars/avatar-anika-visser.png",
        message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        timestamp: new Date("2025-09-30T18:45:00"),
        isProvider: false
      },
      {
        id: 3,
        senderId: "instaxchange",
        senderName: "InstaXChange",
        senderAvatar: "/assets/providers/instaxchange.jpeg",
        message: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,",
        timestamp: new Date("2025-09-30T18:45:00"),
        isProvider: true
      },
      {
        id: 4,
        senderId: "user_1",
        senderName: "Lucy .R",
        senderAvatar: "/assets/avatars/avatar-anika-visser.png",
        message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        timestamp: new Date("2025-09-30T18:45:00"),
        isProvider: false
      }
    ]
  },
  {
    id: 2,
    providerId: "xoala",
    providerName: "XOALA",
    providerLogo: "/assets/providers/xoala.png",
    lastMessage: "We can schedule a call next week.",
    lastMessageTime: new Date("2025-09-25T17:25:00"),
    unread: false,
    active: false,
    messages: []
  }
];

export const Conversations = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState(dummyConversations[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const messagesEndRef = useRef(null);
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();

  useEffect(() => {
    if (!isBrandsLoading && internalBrandsList.length > 0 && !selectedBrandId) {
      setSelectedBrandId(internalBrandsList[0].value);
    }
  }, [isBrandsLoading, internalBrandsList, selectedBrandId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText("");
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleViewProfile = () => {
    if (selectedConversation?.providerId) {
      router.push(`/dashboard/integration/payment-system/${selectedConversation.providerId}`);
    }
  };

  // const handleStartIntegration = useCallback(() => {
  //   if (!selectedBrandId) {
  //     toast.error("Please select an internal brand first");
  //     return;
  //   }
  //   setIsCreateDialogOpen(true);
  // }, [selectedBrandId]);

  const handleCreateProvider = useCallback(async (data) => {
    try {
      await integrationApi.createPaymentProvider(data);
      setIsCreateDialogOpen(false);
      toast.success("Payment provider created successfully");
      router.push(`${paths.dashboard.integration.index}?tab=payment_systems`);
    } catch (error) {
      console.error("Failed to create payment provider:", error);
      toast.error("Failed to create payment provider");
      throw error;
    }
  }, [router]);

  const selectedProvider = providersData.find(
    (p) => p.type === selectedConversation?.providerId
  );

  const filteredConversations = dummyConversations.filter((conv) =>
    conv.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2.5,
        height: "calc(100vh - 280px)",
        px: 1.25,
        py: 0,
      }}
    >
      <Box
        sx={{
          width: 286,
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          p: 1.25,
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.04),
            borderRadius: 1,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              sx: {
                height: 41,
                fontSize: 14,
                color: "text.primary",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& input::placeholder": {
                  color: "text.secondary",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: 30,
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Iconify icon="mdi:filter-outline" width={18} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Iconify icon="mdi:sort" width={18} />
          </IconButton>
        </Box>

        <Stack spacing={1.25}>
          {filteredConversations.map((conversation) => (
            <Box
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.625,
                py: 0.5,
                borderRadius: 1,
                bgcolor:
                  selectedConversation?.id === conversation.id
                    ? "action.selected"
                    : "transparent",
                cursor: "pointer",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                {conversation.unread && selectedConversation?.id === conversation.id && (
                  <Iconify
                    icon="mdi:checkbox-blank-circle"
                    sx={{
                      position: "absolute",
                      left: -8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12.85,
                      height: 12.85,
                      color: "success.main",
                    }}
                  />
                )}
                <Avatar
                  src={conversation.providerLogo}
                  sx={{
                    width: 24.188,
                    height: 24.188,
                  }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color:
                      selectedConversation?.id === conversation.id
                        ? "text.primary"
                        : "text.secondary",
                  }}
                >
                  {conversation.providerName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {format(conversation.lastMessageTime, "MMM dd h:mm a")}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            height: 66,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              src={selectedConversation?.providerLogo}
              sx={{
                width: 24.188,
                height: 24.188,
              }}
            />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              {selectedConversation?.providerName}
            </Typography>
            <Typography
              onClick={handleViewProfile}
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "primary.main",
                textDecoration: "underline",
                ml: 1,
                cursor: "pointer",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
            >
              View Profile
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.625 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="mdi:pin" width={15.874} />}
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#fff" : "#1C252E",
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
                fontSize: 14,
                fontWeight: 500,
                height: 30,
                px: 2,
                textTransform: "none",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.08)",
                "&:hover": {
                  bgcolor: theme.palette.mode === "dark" ? alpha("#fff", 0.9) : "#2D3843",
                },
              }}
            >
              Pin offer
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            px: 2,
            py: 2,
          }}
        >
          {selectedConversation?.messages?.map((message) => (
            <Box key={message.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.625,
                  py: 0.5,
                  justifyContent: message.isProvider ? "flex-start" : "flex-end",
                }}
              >
                {message.isProvider && (
                  <Avatar
                    src={message.senderAvatar}
                    sx={{
                      width: 24.188,
                      height: 24.188,
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.secondary",
                  }}
                >
                  {message.senderName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "text.secondary",
                  }}
                >
                  {format(message.timestamp, "MMM dd h:mm a")}
                </Typography>
                {!message.isProvider && (
                  <Avatar
                    src={message.senderAvatar}
                    sx={{
                      width: 28,
                      height: 27,
                      borderRadius: "100px",
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  pl: 1.875,
                  justifyContent: message.isProvider ? "flex-start" : "flex-end",
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.primary.main, 0.08),
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 0.625,
                    maxWidth: message.isProvider ? 453 : 479,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "text.primary",
                      lineHeight: 1.57,
                    }}
                  >
                    {message.message}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
            borderRadius: 1,
            px: 1.625,
            py: 0.5,
            height: 70,
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Avatar
            src={user?.avatar || "/assets/avatars/avatar-anika-visser.png"}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "100px",
            }}
          />
          <Box
            sx={{
              flex: 1,
              bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.05) : "background.paper",
              borderRadius: 1.25,
              px: 2.5,
              height: 38,
              display: "flex",
              alignItems: "center",
              border: 1,
              borderColor: "divider",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message here . . . "
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              InputProps={{
                sx: {
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& input": {
                    padding: 0,
                  },
                  "& input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.7,
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Iconify icon="mdi:attachment" width={20} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Iconify icon="mdi:emoticon-happy-outline" width={20} />
            </IconButton>
            <IconButton
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              size="small"
              sx={{
                color: messageText.trim() ? "primary.main" : "text.disabled",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Iconify icon="mdi:send" width={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <PaymentProviderCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProvider}
        preselectedProvider={selectedProvider}
        internalBrandId={selectedBrandId}
      />
    </Box>
  );
};

