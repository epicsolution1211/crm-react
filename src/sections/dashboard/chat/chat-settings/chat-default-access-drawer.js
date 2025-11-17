import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import { conversationApi } from "src/api/conversation";
import { useSettings } from "src/hooks/use-settings";

const ADMIN_RIGHTS = [
  {
    param: "acc_send_message",
    label: "Send messages",
  },
  {
    param: "acc_send_media",
    label: "Send media",
  },
  {
    param: "acc_add_member",
    label: "Add members",
  },
  {
    param: "acc_delete_all_message",
    label: "Delete all messages",
  },
  {
    param: "acc_delete_own_message",
    label: "Delete own messages",
  },
  {
    param: "acc_delete_conversation",
    label: "Delete conversation",
  },
  {
    param: "acc_edit_avatar",
    label: "Edit conversation avatar",
  },
  {
    param: "acc_edit_name",
    label: "Edit conversation name",
  },
  {
    param: "acc_edit_delete_duration",
    label: "Edit delete duration",
  },
  {
    param: "acc_edit_own_message",
    label: "Edit own messages"
  },
  {
    param: "acc_edit_public",
    label: "Edit conversation type",
  },
  {
    param: "acc_pin_messages",
    label: "Pin messages",
  },
  {
    param: "acc_remove_member",
    label: "Remove members",
  },
  {
    param: "acc_export_chat_history",
    label: "Export conversation history",
  },
];

export const ChatDefaultAccessDrawer = ({ onClose, open, conversation, isClientChat = false, ticket }) => {
  const theme = useTheme();
  const settings = useSettings();

  const [accessState, setAccessState] = useState({});

  useEffect(() => {
    if (conversation) {
      setAccessState({
        acc_add_member: conversation?.acc_add_member,
        acc_delete_all_message: conversation?.acc_delete_all_message,
        acc_delete_conversation: conversation?.acc_delete_conversation,
        acc_delete_own_message: conversation?.acc_delete_own_message,
        acc_edit_avatar: conversation?.acc_edit_avatar,
        acc_edit_delete_duration: conversation?.acc_edit_delete_duration,
        acc_edit_name: conversation?.acc_edit_name,
        acc_edit_own_message: conversation?.acc_edit_own_message,
        acc_edit_public: conversation?.acc_edit_public,
        acc_export_chat_history: conversation?.acc_export_chat_history,
        acc_pin_messages: conversation?.acc_pin_messages,
        acc_remove_member: conversation?.acc_remove_member,
        acc_send_media: conversation?.acc_send_media,
        acc_send_message: conversation?.acc_send_message,
      })
    }
  }, [conversation]);

  const handleAccessChange = async (e, param) => {
    try {
      await conversationApi.updateConversation(conversation?.id, {
        [param]: e?.target?.checked,
      });

      setAccessState(prev => ({
        ...prev,
        [param]: !e?.target?.checked,
      }));

      toast.success("Permission successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 480,
          background: settings?.paletteMode === "dark" 
            ? "#1a1a2e"
            : "#f8fafc",
          borderLeft: settings?.paletteMode === "dark" 
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Box
          sx={{
            background: settings?.paletteMode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: settings?.paletteMode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={3}
            sx={{
              px: 4,
              py: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${theme.palette.primary.alpha30}`,
                }}
              >
                <Iconify 
                  icon="heroicons:cog-6-tooth" 
                  sx={{ 
                    fontSize: 20,
                    color: "white"
                  }}
                />
              </Box>
              <Stack>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
                  }}
                >
                  Default Access
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                    fontWeight: 500
                  }}
                >
                  Configure default permissions
                </Typography>
              </Stack>
            </Stack>
            <IconButton 
              onClick={onClose}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: settings?.paletteMode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  background: settings?.paletteMode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Iconify icon="iconamoon:close" width={24} />
            </IconButton>
          </Stack>
        </Box>

        <Stack spacing={4} sx={{ py: 4, px: 4 }}>
          <Fade in={true} timeout={800}>
            <Stack spacing={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  px: 1
                }}
              >
                What can users do?
              </Typography>
              
              <Stack spacing={2}>
                {ADMIN_RIGHTS.filter(acc => {
                  if (acc?.param === 'acc_delete_conversation' && ticket?.default) {
                    return false;
                  }
                  if (acc?.param === 'acc_edit_public' && isClientChat) {
                    return false;
                  }
                  return true;
                })
                ?.map(({ param, label }, index) => (
                  <Fade in={true} timeout={800 + (index * 50)} key={param}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "12px",
                        background: settings?.paletteMode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(255, 255, 255, 0.6)",
                        border: settings?.paletteMode === "dark"
                          ? "1px solid rgba(255, 255, 255, 0.05)"
                          : "1px solid rgba(0, 0, 0, 0.03)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          background: settings?.paletteMode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.8)",
                          transform: "translateY(-1px)",
                          boxShadow: settings?.paletteMode === "dark"
                            ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                            : "0 4px 20px rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
                          }}
                        >
                          {label}
                        </Typography>
                        <Switch 
                          checked={accessState[param] ?? false} 
                          onChange={(e) => handleAccessChange(e, param)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: theme.palette.primary.main,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Fade>
                ))}
              </Stack>
            </Stack>
          </Fade>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

ChatDefaultAccessDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  conversationId: PropTypes.string,
};
