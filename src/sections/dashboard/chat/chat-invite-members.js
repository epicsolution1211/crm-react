import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";

import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { useMounted } from "src/hooks/use-mounted";
import { settingsApi } from "src/api/settings";
import { toast } from "react-hot-toast";
import { useDebounce } from "src/hooks/use-debounce";
import { getAPIUrl } from "src/config";
import { useSettings } from "src/hooks/use-settings";
import { Iconify } from 'src/components/iconify';

const useMembers = (participants) => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState("*");
  const query = useDebounce(search, 500);

  const handleMembersSearch = useCallback((event) => {
    setSearch(event?.target?.value || "*");
  }, []);

  const handleMembersGet = useCallback(async () => {
    const nonMembersIds = participants.map((p) => p.id);
    const members = await settingsApi.getMembers(nonMembersIds, query, {
      active: true,
    });

    if (isMounted()) {
      setMembers(members?.accounts);
    }
  }, [participants, query]);

  const handleMemberSelect = useCallback(
    (id) => {
      if (selectedMembers?.includes(id)) {
        setSelectedMembers(selectedMembers.filter((m) => m !== id));
      } else {
        setSelectedMembers(selectedMembers.concat(id));
      }
    },
    [selectedMembers]
  );

  useEffect(() => {
    handleMembersGet();
  }, [participants, query]);

  return {
    members,
    selectedMembers,
    handleMemberSelect,
    setSelectedMembers,
    handleMembersSearch,
  };
};

export const ChatInviteMembers = (props) => {
  const {
    onClose,
    open,
    onParticipantsGet,
    conversationId,
    participants = [],
    ...other
  } = props;
  
  const settings = useSettings();
  const {
    members,
    selectedMembers,
    handleMemberSelect,
    setSelectedMembers,
    handleMembersSearch,
  } = useMembers(participants);

  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const handleInviteToChat = useCallback(async () => {
    setIsInviteLoading(true);
    try {
        for (let id of selectedMembers) {
          await chatApi.inviteMemberToChat({
            account_id: id,
            conversation_id: conversationId,
          });
        }
        toast("Members successfully invited to chat!");
        onClose();
        setTimeout(() => {
          onParticipantsGet();
        }, 1500);
        setSelectedMembers([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsInviteLoading(false);
    }
  }, [selectedMembers, conversationId, setSelectedMembers, onParticipantsGet]);

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
      {...other}
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
                  background: settings?.paletteMode === "dark"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Iconify 
                  icon="heroicons:user-plus" 
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
                  Invite Members
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                    fontWeight: 500
                  }}
                >
                  Add new members to the chat
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
                  color: settings?.paletteMode === "dark" ? "#667eea" : "#4f46e5",
                  fontWeight: 700,
                  px: 1
                }}
              >
                Available Members
              </Typography>
              
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: settings?.paletteMode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.8)",
                  border: settings?.paletteMode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.05)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <OutlinedInput
                  defaultValue=""
                  fullWidth
                  placeholder="Search by member name"
                  onChange={handleMembersSearch}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify 
                        icon="heroicons:magnifying-glass" 
                        sx={{ 
                          fontSize: 20,
                          color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280"
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: settings?.paletteMode === "dark" 
                          ? "rgba(255, 255, 255, 0.1)" 
                          : "rgba(0, 0, 0, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: settings?.paletteMode === "dark" 
                          ? "rgba(255, 255, 255, 0.2)" 
                          : "rgba(0, 0, 0, 0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: settings?.paletteMode === "dark" ? "#667eea" : "#4f46e5",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
                      "&::placeholder": {
                        color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Scrollbar
                sx={{
                  maxHeight: 'calc(100vh - 480px)',
                  "& .simplebar-scrollbar:before": {
                    background: "var(--nav-scrollbar-color)",
                  },
                }}
              >
                <Stack spacing={2}>
                  {members?.map((member, index) => (
                    <Fade in={true} timeout={800 + (index * 50)} key={member.id}>
                      <Box
                        onClick={() => handleMemberSelect(member?.id)}
                        sx={{
                          p: 3,
                          borderRadius: "12px",
                          background: selectedMembers?.includes(member?.id)
                            ? (settings?.paletteMode === "dark" 
                                ? "rgba(102, 126, 234, 0.15)" 
                                : "rgba(102, 126, 234, 0.1)")
                            : (settings?.paletteMode === "dark"
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(255, 255, 255, 0.6)"),
                          border: selectedMembers?.includes(member?.id)
                            ? (settings?.paletteMode === "dark"
                                ? "1px solid rgba(102, 126, 234, 0.3)"
                                : "1px solid rgba(102, 126, 234, 0.2)")
                            : (settings?.paletteMode === "dark"
                                ? "1px solid rgba(255, 255, 255, 0.05)"
                                : "1px solid rgba(0, 0, 0, 0.03)"),
                          backdropFilter: "blur(10px)",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            background: selectedMembers?.includes(member?.id)
                              ? (settings?.paletteMode === "dark"
                                  ? "rgba(102, 126, 234, 0.2)"
                                  : "rgba(102, 126, 234, 0.15)")
                              : (settings?.paletteMode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(255, 255, 255, 0.8)"),
                            transform: "translateY(-1px)",
                            boxShadow: settings?.paletteMode === "dark"
                              ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                              : "0 4px 20px rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={3}>
                            <Avatar
                              src={
                                member?.avatar
                                  ? member?.avatar?.includes("http")
                                    ? member?.avatar
                                    : `${getAPIUrl()}/${member?.avatar}`
                                  : ""
                              }
                              sx={{
                                width: 48,
                                height: 48,
                                border: selectedMembers?.includes(member?.id)
                                  ? (settings?.paletteMode === "dark"
                                      ? "2px solid #667eea"
                                      : "2px solid #4f46e5")
                                  : "none",
                                boxShadow: selectedMembers?.includes(member?.id)
                                  ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Stack spacing={0.5}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
                                }}
                              >
                                {member?.first_name} {member?.last_name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                                  fontWeight: 500
                                }}
                              >
                                {member?.email}
                              </Typography>
                            </Stack>
                          </Stack>
                          {selectedMembers?.includes(member?.id) && (
                            <Iconify 
                              icon="heroicons:check-circle" 
                              sx={{ 
                                fontSize: 24,
                                color: settings?.paletteMode === "dark" ? "#667eea" : "#4f46e5"
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              </Scrollbar>
            </Stack>
          </Fade>

          {selectedMembers.length > 0 && (
            <Fade in={true} timeout={1000}>
              <Stack spacing={2}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                    fontWeight: 500,
                    px: 1
                  }}
                >
                  {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                </Typography>
                <LoadingButton
                  onClick={handleInviteToChat}
                  variant="contained"
                  loading={isInviteLoading}
                  disabled={!selectedMembers.length || isInviteLoading}
                  startIcon={<Iconify icon="heroicons:paper-airplane" />}
                  sx={{
                    background: settings?.paletteMode === "dark" ? "#667eea" : "#4f46e5",
                    borderRadius: "12px",
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background: settings?.paletteMode === "dark" ? "#5a67d8" : "#4338ca",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Invite {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''}
                </LoadingButton>
              </Stack>
            </Fade>
          )}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

ChatInviteMembers.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  conversationId: PropTypes.string,
  participants: PropTypes.array,
  onParticipantsGet: PropTypes.func,
};
