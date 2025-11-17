import { useMemo } from "react";
import { formatDistanceToNowStrict } from "date-fns";

import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { ChatAISummaryDialog } from "./chat-ai-summary-dialog";
import { ChatAddAdmin } from "./chat-settings/chat-add-admin";
import { ChatAdminPermission } from "./chat-settings/chat-admin-permission";
import { ChatAdminsModal } from "./chat-settings/chat-admins-modal";
import { ChatAutoDeleteModal } from "./chat-settings/chat-auto-delete-modal";
import { ChatDefaultAccessDrawer } from "./chat-settings/chat-default-access-drawer";
import { ChatExportHistory } from "./chat-settings/chat-export-history";
import { ChatInviteMembers } from "./chat-invite-members";
import { ChatPhoneNumberSelect } from "./chat-phone-number-select";
import { ChatReminder } from "./chat-reminder";
import { ChatSettings } from "./chat-settings";
import { ConfirmDialog } from 'src/components/confirm-dialog-2';
import { CreateTaskDialog } from "src/sections/dashboard/todo/todo-create-dialog";
import { CustomerAssignDeskDialog } from "../customer/customer-assign-desk-dialog";
import { CustomerAssignTeamDialog } from "../customer/customer-assign-team-dialog";
import { DeleteModal } from "src/components/customize/delete-modal";
import { Iconify } from 'src/components/iconify';
import { chatApi } from "src/api/chat";
import { conversationApi } from "src/api/conversation";
import { customersApi } from "src/api/customers";
import { getAPIUrl } from "src/config";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { useCallProfiles } from 'src/hooks/call-system/useCallProfiles';
import { useCallback, useEffect, useState } from "react";
import { usePopover } from "src/hooks/use-popover";
import { useTwilio } from "src/hooks/use-twilio";

const getRecipients = (participants, userId) => {
  return participants.filter((participant) => participant.id !== userId);
};

const getDisplayName = (recipients) => {
  const accountId = parseInt(localStorage.getItem("account_id"));
  if (recipients?.length > 0) {
    return recipients
      ?.filter((item) => item?.id !== accountId)
      ?.map((participant) => participant?.full_name)
      ?.join(", ");
  } else {
    return "";
  }
};

const getLastActive = (recipients) => {
  const hasLastActive = recipients.length === 1 && recipients[0].lastActivity;

  if (hasLastActive) {
    return formatDistanceToNowStrict(recipients[0].lastActivity, {
      addSuffix: true,
    });
  }

  return null;
};

export const ChatThreadToolbar = (props) => {
  const {
    participants = [],
    onParticipantsGet,
    onTicketsGet = () => { },
    onMessagesGet = () => { },
    onTicketGet = () => { },
    ticket = {},
    tickets = [],
    conversationId,
    conversation = {},
    calling,
    internalChat,
    isClientChat = false,
    isEmailChat = false,
    isSupportChat = false,
    getConversationList,
    callConversationId,
    ...other
  } = props;

  const popover = usePopover();
  const reminderPopover = usePopover();
  const priorityPopover = usePopover();
  const {
    makeCall,
    makeInternalCall,
    joinCall,
    allowed,
    handleTwilioExtrasInit,
  } = useTwilio();
  const accountId = parseInt(localStorage.getItem("account_id"));
  const { profiles } = useCallProfiles();
  const { user: account } = useAuth();

  const client = useMemo(() => {
    if (ticket && tickets?.length) {
      const client = tickets?.find(
        (item) => item?.client_id === ticket?.client_id
      );
      return client;
    }
    return undefined;
  }, [ticket, tickets]);

  const [openNumbersDrawer, setOpenNumbersDrawer] = useState(false);
  const [openInviteDrawer, setOpenInviteDrawer] = useState(false);
  const [openAdminsDrawer, setOpenAdminsDrawer] = useState(false);
  const [openTeamDrawer, setOpenTeamDrawer] = useState(false);
  const [openDeskDrawer, setOpenDeskDrawer] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [openAdminAccessDrawer, seOpenAdminAccessDrawer] = useState(false);
  const [openAddAdminDrawer, setOpenAddAdminDrawer] = useState(false);
  const [openAutoDeleteModal, setOpenAutoDeleteModal] = useState(false);
  const [openDefaultAccessDrawer, setOpenDefaultAccessDrawer] = useState(false);
  const [openExportHistory, setOpenExportHistory] = useState(false);
  const [openAISummaryDialog, setOpenAISummaryDialog] = useState(false);
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false);

  // open create task or ticket dialog
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [openCreateTicketDialog, setOpenCreateTicketDialog] = useState(false);

  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketPending, setTicketPending] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [closeTicketLoading, setCloseTicketLoading] = useState(false);

  const [isLeaveChatLoadng, setisLeaveChatLoading] = useState(false);
  const [openOwnerLeaveDialog, setOpenOwnerLeaveDialog] = useState(false);

  useEffect(() => {
    if (ticket && tickets?.length > 0) {
      const currentTicket = tickets?.find(t => t?.id === ticket?.id);
      setTicketOpen(currentTicket?.open);
    }
  }, [tickets, ticket]);

  useEffect(() => {
    if (ticket) {
      setTicketOpen(ticket?.open);
      setTicketPending(ticket?.pending);
      setTicketPriority(ticket?.priority);
    }
  }, [ticket]);

  useEffect(() => {
    setNotificationEnabled(conversation?.conversation?.sent_notification);
  }, [conversation]);

  const recipients = getRecipients(participants, account?.id);
  const displayName = getDisplayName(recipients);
  const lastActive = getLastActive(recipients);

  const handleMakeBrowserCall = useCallback(async () => {
    const accountId = localStorage.getItem("account_id");

    await chatApi.initCall({ conversation_id: conversationId });

    handleTwilioExtrasInit({
      conversation: conversationId,
      token: "",
      ticket: ticket?.id,
      customer: ticket?.client_id,
    });

    makeCall({
      target_id: `conversation_${conversationId}_${accountId}_false`,
    });

    setTimeout(() => {
      makeInternalCall({
        target_id: `conversation_internal_${conversationId}_${accountId}`,
      });
    }, 2000);
  }, [conversationId, makeCall, makeInternalCall, handleTwilioExtrasInit, ticket]);

  const handleJoinCall = useCallback(() => {
    const accountId = localStorage.getItem("accountId");
    const internalTarget = `conversation_internal_${conversationId}_${accountId}`;
    const externalTarget = `conversation_${conversationId}_${accountId}`;
    joinCall({
      internalTarget,
      externalTarget,
    });
  }, []);

  const handleOpenPhoneCallStarter = useCallback(() => {
    setOpenNumbersDrawer(true);
  }, []);

  const handleClosePhoneCallStarter = useCallback(() => {
    setOpenNumbersDrawer(false);
  });

  const handleOpenInviteDrawer = useCallback(() => {
    setOpenInviteDrawer(true);
    popover.handleClose();
  }, []);

  const handleCloseInviteDrawer = useCallback(() => {
    setOpenInviteDrawer(false);
  }, []);

  const handleOpenExportHistory = useCallback(() => {
    setOpenExportHistory(true);
    popover.handleClose();
  }, []);

  const handleCloseExportHistory = useCallback(() => {
    setOpenExportHistory(false);
  }, []);

  const handleCloseSettingsDrawer = useCallback(() => {
    setOpenSettingsDrawer(false);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleOpenEditDrawer = useCallback(() => {
    setOpenEditDrawer(true);
    popover.handleClose();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleCloseEditDrawer = useCallback(() => {
    setOpenEditDrawer(false);
  }, []);

  const handleOpenAdminsDrawer = useCallback(() => {
    setOpenAdminsDrawer(true);
    popover.handleClose();
  }, []);

  const handleCloseAdminsDrawer = useCallback(() => {
    setOpenAdminsDrawer(false);
  }, []);

  const handleOpenAdminAccessDrawer = useCallback((id) => {
    setMemberToEdit(id);
    seOpenAdminAccessDrawer(true);
  }, []);

  const handleCloseAdminAccessDrawer = useCallback(() => {
    setMemberToEdit(null);
    seOpenAdminAccessDrawer(false);
  }, []);

  const handleOpenDefaultAccessDrawer = useCallback(() => {
    setOpenDefaultAccessDrawer(true);
  }, []);

  const handleCloseDefaultAccessDrawer = useCallback(() => {
    setOpenDefaultAccessDrawer(false);
  }, []);

  const handleOpenAddAdminDrawer = useCallback(() => {
    setOpenAddAdminDrawer(true);
  }, []);

  const handleCloseAddAdminDrawer = useCallback(() => {
    setOpenAddAdminDrawer(false);
  }, []);

  const handleOpenTeamDrawer = useCallback(() => {
    setOpenTeamDrawer(true);
    popover.handleClose();
  }, []);

  const handleOpenDeskDrawer = useCallback(() => {
    setOpenDeskDrawer(true);
    popover.handleClose();
  }, []);

  const handleCloseTeamDrawer = useCallback(() => {
    setOpenTeamDrawer(false);
  }, []);

  const handleOpenAutoDeleteModal = useCallback(() => {
    setOpenAutoDeleteModal(true);
  }, []);

  const handleCloseAutoDeleteModal = useCallback(() => {
    setOpenAutoDeleteModal(false);
  }, []);

  const handleOpenAISummaryDialog = useCallback(() => {
    setOpenAISummaryDialog(true);
  }, []);

  const handleCloseAISummaryDialog = useCallback(() => {
    setOpenAISummaryDialog(false);
  }, []);

  const handleCloseDialogOpen = () => setOpenCloseDialog(true);

  const handleCloseDialogClose = () => setOpenCloseDialog(false);

  const handleTicketClose = async () => {
    try {
      setCloseTicketLoading(true);
      const request = {
        id: ticket?.id,
        company_id: ticket?.company_id,
      };
      await customersApi.closeTicket(request);
      setTicketOpen(false);
      setTicketPending(true);
      setOpenCloseDialog(false);
      setTimeout(() => onTicketsGet(), 1500);
      toast("Ticket successfully closed!");
      setCloseTicketLoading(false);
    } catch (error) {
      setCloseTicketLoading(false);
      setOpenCloseDialog(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleTicketPending = async () => {
    try {
      const request = {
        id: ticket?.id,
        pending: !ticketPending,
      };
      await customersApi.updateTicket(request);
      setTicketPending(!ticketPending);
      toast("Ticket pending status successfully changed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handlePriorityChange = async (priority) => {
    try {
      setTicketPriority(priority);
      priorityPopover.handleClose();
      await customersApi.updateTicket({
        id: ticket?.id,
        priority,
      });
      setTimeout(() => {
        onTicketGet();
      }, 1500);
      toast.success("Ticket priority successfully changed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleHistoryClear = async () => {
    try {
      await conversationApi.deleteMessage(0, {
        conversation_id: conversationId,
      });
      toast.success("History of the chat successfully deleted!");
      setClearHistoryOpen(false);
      setTimeout(() => {
        onMessagesGet();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      await conversationApi.updateConversation(conversationId, {
        sent_notification: !notificationEnabled,
      });
      setNotificationEnabled(!notificationEnabled);
      toast.success("Notification status successfully changed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("error: ", error);
    }
  };

  const isMultiple = useMemo(
    () => (client ? recipients.length > 0 : recipients.length > 2),
    [client, recipients]
  );

  const currentMember = useMemo(() => {
    if (account && participants?.length > 0) {
      return participants?.find((p) => p?.account_id === account?.id);
    }
  }, [participants, account]);

  const isCurrentUserOnlyOwner = useMemo(() => {
    if (!currentMember?.owner) return false;
    const owners = participants?.filter((p) => p?.owner);
    return owners?.length === 1;
  }, [participants, currentMember]);

  const handleOpenSettingsDrawer = useCallback(() => {
    setOpenSettingsDrawer(true);
    setOpenOwnerLeaveDialog(false);
  }, []);

  const handleLeaveChat = async () => {
    if (isCurrentUserOnlyOwner) {
      setOpenOwnerLeaveDialog(true);
      setModalOpen(false);
      popover.handleClose();
      return;
    }

    setisLeaveChatLoading(true);
    try {
      const accountId = localStorage.getItem("account_id");
      await chatApi.removeMemberFromChat(accountId, {
        account_id: accountId,
        conversation_id: conversationId,
      });
      setModalOpen(false);
      setTimeout(() => {
        onParticipantsGet();
      }, 1500);
      toast.success("Member successfully removed from the chat!");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Something went wrong!");
    } finally {
      setisLeaveChatLoading(false);
    }
  };

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          flexShrink: 0,
          minHeight: 64,
          px: 2,
          py: 1,
        }}
        {...other}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          <AvatarGroup
            max={2}
            sx={{
              ...(isMultiple && {
                "& .MuiAvatar-root": {
                  height: 30,
                  width: 30,
                  "&:nth-of-type(2)": {
                    mt: "10px",
                  },
                },
              }),
            }}
          >
            {client ? (
              <Avatar
                src={
                  client?.client?.avatar
                    ? client?.client?.avatar?.includes("http")
                      ? client?.client?.avatar
                      : `${getAPIUrl()}/${client?.client?.avatar}`
                    : ""
                }
              />
            ) : null}
            {recipients
              ?.filter((item) => accountId !== item?.id)
              ?.map((recipient) => (
                <Avatar
                  key={recipient.id}
                  src={
                    recipient.avatar
                      ? recipient.avatar?.includes("http")
                        ? recipient.avatar
                        : `${getAPIUrl()}/${recipient.avatar}`
                      : ""
                  }
                />
              ))}
          </AvatarGroup>
          <div>
            <Typography variant="subtitle2">
              {client
                ? displayName
                  ? `${client?.client_name}, ${displayName}`
                  : `${client?.client_name}`
                : displayName}
            </Typography>
            {lastActive && (
              <Typography color="text.secondary" variant="caption">
                Last active {lastActive}
              </Typography>
            )}
          </div>
        </Stack>
        {calling && (
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              background: "rgba(243, 244, 246, 0.04)",
              borderRadius: "10px",
              px: 3,
            }}
          >
            <Typography variant="h6">Incoming call...</Typography>
            <IconButton onClick={handleMakeBrowserCall}>
              <Iconify icon="line-md:phone-call-loop" color="success.main" />
            </IconButton>
          </Stack>
        )}
        <Stack alignItems="center" direction="row" spacing={1}>
          {internalChat ? null : ticketOpen ? (
            <Tooltip title="Close ticket">
              <IconButton
                onClick={handleCloseDialogOpen}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="line-md:confirm" width={30} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Ticket solved">
              <IconButton>
                <Iconify icon="line-md:confirm" width={30} color="success.main" />
              </IconButton>
            </Tooltip>
          )}
          {internalChat ? null : ticketPending ? (
            <Tooltip title="Remove pending ticket">
              <IconButton onClick={handleTicketPending}>
                <Iconify icon="line-md:pause" width={30} color="success.main" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Pending ticket">
              <IconButton
                onClick={handleTicketPending}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="line-md:pause" width={30} />
              </IconButton>
            </Tooltip>
          )}
          {internalChat
            ? null
            : ticketPriority === 2 && (
              <Tooltip title="Low priority">
                <IconButton
                  onClick={priorityPopover.handleOpen}
                  ref={priorityPopover.anchorRef}
                >
                  <Iconify icon="ion:snow" color="info.main" width={30} />
                </IconButton>
              </Tooltip>
            )}
          {internalChat
            ? null
            : ticketPriority === 1 && (
              <Tooltip title="Normal priority">
                <IconButton
                  onClick={priorityPopover.handleOpen}
                  ref={priorityPopover.anchorRef}
                >
                  <Iconify icon="solar:tea-cup-bold" color="warning.main" width={30} />
                </IconButton>
              </Tooltip>
            )}
          {internalChat
            ? null
            : ticketPriority === 3 && (
              <Tooltip title="High priority">
                <IconButton
                  onClick={priorityPopover.handleOpen}
                  ref={priorityPopover.anchorRef}
                >
                  <Iconify icon="vaadin:fire" color="error.main" width={28} />
                </IconButton>
              </Tooltip>
            )}

          <Tooltip title="Add task">
            <IconButton
              onClick={() => { setOpenCreateTaskDialog(true) }}
              sx={{ 
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { 
                  color: 'info.main',
                  backgroundColor: 'action.hover'
                } 
              }}
            >
              <Iconify icon="material-symbols:add-task" width={24}/>
            </IconButton>
            </Tooltip>
            <Tooltip title="Add ticket">
            <IconButton
              onClick={() => { setOpenCreateTicketDialog(true) }}
              sx={{ 
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { 
                  color: 'info.main',
                  backgroundColor: 'action.hover'
                } 
              }}
            >
              <Iconify icon="bx:task" width={24}/>
            </IconButton>
          </Tooltip>

          <Tooltip title={conversation?.conversation?.chat_summary ? conversation?.conversation?.chat_summary : "AI Summary"}>
            <IconButton
              onClick={handleOpenAISummaryDialog}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="healthicons:artificial-intelligence" width={26} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={priorityPopover.anchorRef.current}
            keepMounted
            onClose={priorityPopover.handleClose}
            open={priorityPopover.open}
          >
            <MenuItem onClick={() => handlePriorityChange(3)}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="vaadin:fire" color={ticket?.priority === 3 ? "error.main" : "text.primary"} width={28} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 3 ? "error.main" : "text.primary"}
                >
                  High priority
                </Typography>
              </Stack>
            </MenuItem>

            <MenuItem onClick={() => handlePriorityChange(1)}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="solar:tea-cup-bold" color={ticket?.priority === 1 ? "warning.main" : "text.primary"} width={30} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 1 ? "warning.main" : "text.primary"}
                >
                  Normal priority
                </Typography>
              </Stack>
            </MenuItem>

            <MenuItem onClick={() => handlePriorityChange(2)}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="ion:snow" color={ticket?.priority === 2 ? "info.main" : "text.primary"} width={30} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 2 ? "info.main" : "text.primary"}
                >
                  Low priority
                </Typography>
              </Stack>
            </MenuItem>
          </Menu>
          {internalChat ? null : (
            <Tooltip title="Reminder">
              <IconButton
                ref={reminderPopover.anchorRef}
                onClick={reminderPopover.handleOpen}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="line-md:calendar" width={26} />
              </IconButton>
            </Tooltip>
          )}
          {ticket?.in_call ? (
            <Tooltip title="Join call">
              <IconButton
                onClick={handleJoinCall}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="mage:phone-plus" width={26} />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Phone call">
                <IconButton
                  onClick={handleOpenPhoneCallStarter}
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <Iconify icon="line-md:phone-call" width={30} />
                </IconButton>
              </Tooltip>
              {profiles?.find((p) => p?.provider_type === "twilio")?.enabled &&
                allowed && !isEmailChat && (
                  <Tooltip title="Browser call">
                    <IconButton
                      onClick={handleMakeBrowserCall}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      <Iconify icon="material-symbols:call-to-action-outline-rounded" width={30} />
                    </IconButton>
                  </Tooltip>
                )}
            </>
          )}

          <Tooltip title="Chat settings">
            <IconButton
              onClick={handleOpenSettingsDrawer}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="fluent:settings-chat-24-regular" width={30} />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton
              onClick={popover.handleOpen}
              ref={popover.anchorRef}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="ph:dots-three-bold" width={30} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Menu
        anchorEl={popover.anchorRef.current}
        keepMounted
        onClose={popover.handleClose}
        open={popover.open}
      >
        <MenuItem onClick={handleNotificationUpdate}>
          <ListItemIcon>
            <Iconify icon="fluent:speaker-2-24-regular" />
          </ListItemIcon>
          <ListItemText
            primary={
              notificationEnabled
                ? "Turn off Notifications"
                : "Turn on Notifications"
            }
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setOpenSettingsDrawer(true);
            popover.handleClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="mingcute:settings-6-line" />
          </ListItemIcon>
          <ListItemText primary="Manage Chat" />
        </MenuItem>
        {currentMember?.acc_export_chat_history || currentMember?.owner ? (
          <MenuItem onClick={handleOpenExportHistory}>
            <ListItemIcon>
              <Iconify icon="tabler:database-export" />
            </ListItemIcon>
            <ListItemText primary="Export Chat History" />
          </MenuItem>
        ) : null}

        {currentMember?.acc_delete_all_message || currentMember?.owner ? (
          <MenuItem
            onClick={() => {
              setClearHistoryOpen(true);
              popover.handleClose();
            }}
          >
            <ListItemIcon>
              <Iconify icon="grommet-icons:clear-option" />
            </ListItemIcon>
            <ListItemText primary="Clear history" />
          </MenuItem>
        ) : null}

        {internalChat ? null : (
          <MenuItem onClick={handleOpenTeamDrawer}>
            <ListItemIcon>
              <Iconify icon="fluent:people-team-16-regular" />
            </ListItemIcon>
            <ListItemText primary="Assign Team" />
          </MenuItem>
        )}
        {isSupportChat ? (
          <MenuItem onClick={handleOpenDeskDrawer}>
            <ListItemIcon>
              <Iconify icon="fluent:desk-16-filled" />
            </ListItemIcon>
            <ListItemText primary="Assign Desk" />
          </MenuItem>
        ) : null}
        {!isClientChat ? (
          <MenuItem onClick={() => setModalOpen(true)} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Iconify icon="fluent:arrow-exit-20-filled" color="error.main" />
            </ListItemIcon>
            <ListItemText primary="Leave chat" />
          </MenuItem>
        ) : null}
      </Menu>

      {ticket?.id && (
        <ChatPhoneNumberSelect
          open={openNumbersDrawer}
          onClose={handleClosePhoneCallStarter}
          conversationId={callConversationId}
          ticket={ticket}
          profiles={profiles.filter((p) => p.enabled)}
        />
      )}

      <ChatInviteMembers
        open={openInviteDrawer}
        onClose={handleCloseInviteDrawer}
        conversationId={conversationId}
        participants={participants}
        onParticipantsGet={onParticipantsGet}
      />

      <ChatAddAdmin
        open={openAddAdminDrawer}
        onClose={handleCloseAddAdminDrawer}
        conversationId={conversationId}
        participants={participants}
        onParticipantsGet={onParticipantsGet}
      />

      <ChatAdminsModal
        open={openAdminsDrawer}
        onClose={handleCloseAdminsDrawer}
        participants={participants}
        handleOpenAdminAccessDrawer={handleOpenAdminAccessDrawer}
        handleOpenAddAdminDrawer={handleOpenAddAdminDrawer}
        onParticipantsGet={onParticipantsGet}
        isClientChat={isClientChat}
        isDefaultTicket={ticket?.default}
        addAdminAccess={currentMember?.acc_add_admin || currentMember?.owner}
        updateAdminAccess={currentMember?.owner}
        removeAdminAccess={currentMember?.acc_remove_admin || currentMember?.owner}
      />

      <ChatExportHistory
        open={openExportHistory}
        onClose={handleCloseExportHistory}
        conversationId={conversationId}
      />

      <CustomerAssignTeamDialog
        open={openTeamDrawer}
        onClose={handleCloseTeamDrawer}
        selectAll={false}
        selected={[ticket?.client_id]}
        onTicketsGet={onTicketsGet}
      />

      <CustomerAssignDeskDialog
        open={openDeskDrawer}
        onClose={() => setOpenDeskDrawer(false)}
        selectAll={false}
        selected={[ticket?.client_id]}
        onTicketsGet={onTicketsGet}
      />

      {/* <ChatEditConversation
        open={openEditDrawer}
        onClose={handleCloseEditDrawer}
        conversationId={conversationId}
      /> */}

      <DeleteModal
        isOpen={clearHistoryOpen}
        setIsOpen={() => setClearHistoryOpen(false)}
        onDelete={handleHistoryClear}
        title={"Clear History"}
        description={"Are you sure you want to clear chat history?"}
      />

      <ChatSettings
        open={openSettingsDrawer}
        onClose={handleCloseSettingsDrawer}
        conversationId={conversationId}
        conversation={conversation?.conversation}
        participants={participants}
        handleOpenInviteDrawer={handleOpenInviteDrawer}
        handleOpenAdminsDrawer={handleOpenAdminsDrawer}
        handleOpenAdminAccessDrawer={handleOpenAdminAccessDrawer}
        handleOpenDefaultAccessDrawer={handleOpenDefaultAccessDrawer}
        handleOpenAutoDeleteModal={handleOpenAutoDeleteModal}
        onParticipantsGet={onParticipantsGet}
        isClientChat={isClientChat}
        getConversationList={getConversationList}
        isDefaultTicket={ticket?.default}
      />

      <ChatAdminPermission
        open={openAdminAccessDrawer}
        onClose={handleCloseAdminAccessDrawer}
        participants={participants}
        memberToEdit={memberToEdit}
        isClientChat={isClientChat}
        conversationId={conversationId}
        onParticipantsGet={onParticipantsGet}
        ticket={ticket}
      />

      <ChatDefaultAccessDrawer
        open={openDefaultAccessDrawer}
        onClose={handleCloseDefaultAccessDrawer}
        conversation={conversation?.conversation}
        ticket={ticket}
        isClientChat={isClientChat}
      />

      <ChatAutoDeleteModal
        conversation={conversation}
        open={openAutoDeleteModal}
        onClose={handleCloseAutoDeleteModal}
      />

      {ticket?.id && (
        <ConfirmDialog
          open={openCloseDialog}
          onClose={handleCloseDialogClose} 
          title="Close Ticket"
          titleIcon={<Iconify icon="mingcute:alert-line" width={20} />}
          description="Are you sure you want to close this ticket?"
          confirmAction={handleTicketClose}
          isLoading={closeTicketLoading}
          confirmLabel="Close"
          cancelLabel="Cancel"
        />
      )}

      {ticket?.id && (
        <ChatReminder
          open={reminderPopover.open}
          onClose={reminderPopover.handleClose}
          anchorEl={reminderPopover.anchorRef.current}
          clientId={ticket?.client_id}
          ticketId={ticket?.internal_id}
        />
      )}

      <ChatAISummaryDialog
        open={openAISummaryDialog}
        onClose={handleCloseAISummaryDialog}
        conversation={conversation?.conversation}
      />

      <DeleteModal
        isOpen={openModal}
        setIsOpen={() => {
          setModalOpen(false);
        }}
        isLoading={isLeaveChatLoadng}
        onDelete={handleLeaveChat}
        title={"Leave from this chat"}
        description={"Are you sure you want to leave from this chat?"}
      />
      
      {(openCreateTaskDialog || openCreateTicketDialog) && (
        <CreateTaskDialog
          open={openCreateTaskDialog || openCreateTicketDialog}
          onClose={() => {
            setOpenCreateTaskDialog(false);
            setOpenCreateTicketDialog(false);
          }}
          isTicket={openCreateTicketDialog}
          customer={client}
        />
      )}

      <Dialog
        open={openOwnerLeaveDialog}
        onClose={() => setOpenOwnerLeaveDialog(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            width: '100%',
            maxWidth: 480,
            mx: 'auto'
          }
        }}
      >
        <Stack
          sx={{
            p: 4,
            textAlign: 'center',
            position: 'relative',
            width: '100%'
          }}
          spacing={3}
        >
          <Stack
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'red',
              backdropFilter: 'blur(10px)',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Iconify 
              icon="fluent:shield-lock-24-filled" 
              width={40} 
              color="white"
            />
          </Stack>

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                textAlign: 'center',
                width: '100%'
              }}
            >
              Cannot Leave Chat
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                lineHeight: 1.6,
                textAlign: 'center',
                width: '100%'
              }}
            >
              You cannot leave the chat. Please make sure your chat has at least one owner except you. 
              <strong style={{ color: 'white' }}> In order to make someone owner, the person should be admin first.</strong>
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ pt: 1, width: '100%' }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenOwnerLeaveDialog(false)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              onClick={handleOpenSettingsDrawer}
              startIcon={<Iconify icon="fluent:settings-chat-24-regular" />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              Manage Chat
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};
