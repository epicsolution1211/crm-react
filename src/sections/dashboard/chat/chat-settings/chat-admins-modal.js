import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useSettings } from "src/hooks/use-settings";
import { conversationApi } from "src/api/conversation";
import { getAPIUrl } from "src/config";
import { TransferOwnerDialog } from "./transfer-owner-dialog";

export const ChatAdminsModal = (props) => {
  const {
    onClose,
    open,
    participants = [],
    handleOpenAdminAccessDrawer,
    handleOpenAddAdminDrawer,
    onParticipantsGet = () => {},
    isClientChat = false,
    addAdminAccess,
    isDefaultTicket = false,
    updateAdminAccess = false,
    removeAdminAccess = false,
    ...other
  } = props;
  const settings = useSettings();
  const theme = useTheme();

  const [transferOwnerDialog, setTransferOwnerDialog] = useState({
    open: false,
    memberId: null,
    memberName: "",
  });

  const administrators = useMemo(() => {
    if (isDefaultTicket && isClientChat) {
      return participants?.filter((p) => !p.client_id);
    } else if (!isDefaultTicket && isClientChat) {
      return participants?.filter(
        (p) => p?.acc_edit_members_access || p?.owner
      );
    } else {
      return participants?.filter(
        (p) => p?.acc_edit_members_access || p?.owner
      );
    }
  }, [participants, isDefaultTicket, isClientChat]);

  const handleAdminRemove = async (id, e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      await conversationApi.updateConversationAccount(id, {
        acc_edit_members_access: false,
      });
      toast.success("Admin successfully removed!");

      setTimeout(() => {
        onParticipantsGet();
      }, 1500);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleOpenTransferOwnerDialog = (memberId, memberName, e) => {
    e.stopPropagation();
    e.preventDefault();
    setTransferOwnerDialog({
      open: true,
      memberId,
      memberName,
    });
  };

  const handleCloseTransferOwnerDialog = () => {
    setTransferOwnerDialog({
      open: false,
      memberId: null,
      memberName: "",
    });
  };

  const handleConfirmTransferOwner = async () => {
    try {
      await conversationApi.updateConversationAccount(transferOwnerDialog.memberId, { owner: true });
      toast.success("Ownership successfully transferred!");
      handleCloseTransferOwnerDialog();

      setTimeout(() => {
        onParticipantsGet();
      }, 1500);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

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
          background: settings?.paletteMode === "dark" ? "#1a1a2e" : "#f8fafc",
          borderLeft:
            settings?.paletteMode === "dark"
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
            background:
              settings?.paletteMode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom:
              settings?.paletteMode === "dark"
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
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Iconify
                  icon="heroicons:shield-check"
                  sx={{
                    fontSize: 20,
                    color: "white",
                  }}
                />
              </Box>
              <Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color:
                      settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
                  }}
                >
                  Administrators
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  {administrators?.length || 0} member
                  {administrators?.length !== 1 ? "s" : ""}
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              onClick={onClose}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background:
                  settings?.paletteMode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  background:
                    settings?.paletteMode === "dark"
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
              {administrators?.length > 0 ? (
                administrators?.map((member, index) => (
                  <Fade in={true} timeout={800 + index * 100} key={member?.id}>
                    <Box
                      onClick={() =>
                        updateAdminAccess &&
                        handleOpenAdminAccessDrawer(member?.id)
                      }
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        background:
                          settings?.paletteMode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.8)",
                        border:
                          settings?.paletteMode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "1px solid rgba(0, 0, 0, 0.05)",
                        backdropFilter: "blur(10px)",
                        cursor: updateAdminAccess ? "pointer" : "default",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow:
                            settings?.paletteMode === "dark"
                              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                              : "0 8px 32px rgba(0, 0, 0, 0.1)",
                          background:
                            settings?.paletteMode === "dark"
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.95)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Box
                            sx={{
                              position: "relative",
                            }}
                          >
                            <Avatar
                              src={
                                member?.avatar
                                  ? member?.avatar?.includes("http")
                                    ? member?.avatar
                                    : `${getAPIUrl()}/${member?.avatar}`
                                  : ""
                              }
                              sx={{
                                width: 56,
                                height: 56,
                                border:
                                  settings?.paletteMode === "dark"
                                    ? "3px solid rgba(102, 126, 234, 0.3)"
                                    : "3px solid rgba(102, 126, 234, 0.2)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            {member?.owner && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: -2,
                                  right: -2,
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  background: theme.palette.primary,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow:
                                    "0 2px 8px primary.main",
                                }}
                              >
                                <Iconify
                                  icon="material-symbols:crown-outline-rounded"
                                  sx={{
                                    fontSize: 12,
                                    color: "primary.main",
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                          <Stack spacing={1}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color:
                                  settings?.paletteMode === "dark"
                                    ? "#F9FAFB"
                                    : "#111827",
                              }}
                            >
                              {member?.full_name}
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {member?.owner ? (
                                <Chip
                                  label="Owner"
                                  size="small"
                                  sx={{
                                    background: theme.palette.primary.alpha20,
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    height: 24,
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Administrator"
                                  size="small"
                                  sx={{
                                    background: theme.palette.primary.alpha20,
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    height: 24,
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                        {!member?.owner && removeAdminAccess && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <IconButton
                              onClick={(e) => handleAdminRemove(member?.id, e)}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                background:
                                  settings?.paletteMode === "dark"
                                    ? "rgba(239, 68, 68, 0.2)"
                                    : "rgba(239, 68, 68, 0.1)",
                                color: "#ef4444",
                                "&:hover": {
                                  background:
                                    settings?.paletteMode === "dark"
                                      ? "rgba(239, 68, 68, 0.3)"
                                      : "rgba(239, 68, 68, 0.2)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              <Iconify
                                icon="heroicons:trash"
                                sx={{ fontSize: 16 }}
                              />
                            </IconButton>
                            <Tooltip
                              title="Transfer Ownership"
                              arrow
                              placement="top"
                            >
                              <IconButton
                                onClick={(e) =>
                                  handleOpenTransferOwnerDialog(member?.id, member?.full_name, e)
                                }
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "10px",
                                  background:
                                    settings?.paletteMode === "dark"
                                      ? "rgba(102, 126, 234, 0.2)"
                                      : "rgba(102, 126, 234, 0.1)",
                                  color: "#667eea",
                                  "&:hover": {
                                    background:
                                      settings?.paletteMode === "dark"
                                        ? "rgba(102, 126, 234, 0.3)"
                                        : "rgba(102, 126, 234, 0.2)",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <Iconify
                                  icon="material-symbols:crown-outline-rounded"
                                  sx={{ fontSize: 16 }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  </Fade>
                ))
              ) : (
                <Fade in={true} timeout={800}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{
                      py: 8,
                      px: 4,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "24px",
                        background:
                          settings?.paletteMode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(102, 126, 234, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                          settings?.paletteMode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "1px solid rgba(102, 126, 234, 0.2)",
                      }}
                    >
                      <Iconify
                        icon="heroicons:users"
                        sx={{
                          fontSize: 36,
                          color:
                            settings?.paletteMode === "dark"
                              ? "#9CA3AF"
                              : "#667eea",
                        }}
                      />
                    </Box>
                    <Stack spacing={1}>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            settings?.paletteMode === "dark"
                              ? "#F9FAFB"
                              : "#111827",
                          fontWeight: 700,
                        }}
                      >
                        No Administrators
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            settings?.paletteMode === "dark"
                              ? "#9CA3AF"
                              : "#6B7280",
                          maxWidth: 320,
                          lineHeight: 1.6,
                        }}
                      >
                        There are currently no administrators assigned to this
                        chat. Add administrators to manage chat settings and
                        permissions.
                      </Typography>
                    </Stack>
                  </Stack>
                </Fade>
              )}
            </Stack>
          </Fade>

          {addAdminAccess && (
            <Fade in={true} timeout={1200}>
              <Stack
                sx={{
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="heroicons:plus" />}
                  onClick={handleOpenAddAdminDrawer}
                  sx={{
                    background:
                      "primary",
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    boxShadow: "0 4px 12px primary",
                    "&:hover": {
                      background: "primary",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 20px primary",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Add Administrator
                </Button>
              </Stack>
            </Fade>
          )}
        </Stack>
      </Scrollbar>

      <TransferOwnerDialog
        open={transferOwnerDialog.open}
        onClose={handleCloseTransferOwnerDialog}
        onConfirm={handleConfirmTransferOwner}
        memberName={transferOwnerDialog.memberName}
        settings={settings}
      />
    </Drawer>
  );
};
