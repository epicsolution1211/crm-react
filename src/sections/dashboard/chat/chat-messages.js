import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";

import { ChatMessage } from "./chat-message";
import { useAuth } from "src/hooks/use-auth";
import { useState } from "react";
import { DeleteModal } from "src/components/customize/delete-modal";
import { conversationApi } from "src/api/conversation";
import toast from "react-hot-toast";
import { ChatEditMessage } from "./chat-edit-message";
import { isAudioFile } from "../../../utils/is-audio-file";

const getAuthor = (message, user, company = {}) => {
  if (message?.account_id && message?.system) {
    const sender = {
      name: company?.name,
      avatar: company?.avatar,
      isUser: false,
      active: company?.active,
    };
    return sender;
  }

  if (message?.account_id && message?.account_id === user?.id) {
    return {
      name: `${message?.account.first_name} ${message?.account?.last_name}`,
      avatar: user?.avatar,
      isUser: true,
      active: true,
    };
  }

  if (message?.client_id) {
    return {
      name: message?.client?.first_name + " " + (message?.client?.last_name ?? ""),
      avatar: message?.client.avatar,
      isUser: false,
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
    isUser: false,
    active: message?.account?.on_duty,
  };
};

const getAccess = (participants, user) => {
  if (participants?.length > 0 && user) {
    const currentMember =
      participants?.find((p) => p?.account_id === user?.id) ?? {};
    return {
      edit:
        (currentMember?.acc_edit_own_message || currentMember?.owner) ?? false,
      deleteAll:
        (currentMember?.acc_delete_all_message || currentMember?.owner) ??
        false,
      deleteOwn:
        (currentMember?.acc_delete_own_message || currentMember?.owner) ??
        false,
    };
  }

  return {
    edit: false,
    deleteAll: false,
    deleteOwn: false,
  };
};

export const ChatMessages = (props) => {
  const { messages = [], participants = [], onMessagesGet = () => {}, ...other } = props;
  const { company, user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [messageToEdit, setMessageToEdit] = useState(null);

  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleMessageDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await conversationApi.deleteMessage(messageToDelete);
      setModalOpen(false);
      setMessageToDelete(null);
      setTimeout(() => {
        onMessagesGet();
      }, 1000);
      toast.success("Message successfully deleted!");
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleMessageEdit = async (content) => {
    setIsEditLoading(true);
    try {
      await conversationApi.updateMessage(messageToEdit?.id, {
        description: content,
      });
      setEditModalOpen(false);
      setMessageToEdit(null);
      setTimeout(() => {
        onMessagesGet();
      }, 1000);
      toast.success("Message successfully edited!");
    } catch (error) {
      console.error("error:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleMessageDeleteTrigger = (id) => {
    setMessageToDelete(id);
    setModalOpen(true);
  };

  const handleMessageEditTrigger = (id, content) => {
    setMessageToEdit({ id, content });
    setEditModalOpen(true);
  };

  return (
    <Stack spacing={2} sx={{ p: 3 }} {...other}>
      {messages.map((message, index) => {
        const author = getAuthor(message, user, company);
        const access = getAccess(participants, user);
        const contentType = message?.sent_email
          ? "email"
          : message.files_urls?.length && message?.system_event !== 6 && isAudioFile(message?.files_urls?.[0]?.name)
            ? "Audio"
            : message.files_urls?.length && message?.system_event !== 6 && !isAudioFile(message?.files_urls?.[0]?.name) 
              ? "textWithAttachment" 
              : message.system
                ? "system"
                : "text";

        // Check if this message should be grouped (same author as previous message)
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const isGrouped = previousMessage && 
          (previousMessage?.account_id === message?.account_id) && 
          !message.system && 
          !previousMessage.system;

        const systemInfo = {
          type: message.system_event,
          systemEventAccount: message.system_event_account,
          account: message.account ? message.account : {},
        };

        return (
          <ChatMessage
            authorAvatar={author.avatar}
            company={company}
            authorName={author.name}
            active={author.active}
            isNote={message?.note}
            body={message.description || message.html_description}
            message={message}
            attachments={message.files_urls}
            contentType={contentType}
            createdAt={message.created_at}
            key={message.id}
            isUser={author.isUser}
            systemInfo={systemInfo}
            access={access}
            id={message.id}
            deleted={message?.deleted}
            isSystem={message.system}
            isGrouped={isGrouped}
            onDelete={handleMessageDeleteTrigger}
            onEdit={handleMessageEditTrigger}
          />
        );
      })}

      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(false)}
        onDelete={handleMessageDelete}
        title={"Delete Message"}
        description={"Are you sure you want to delete this message?"}
        isLoading={isDeleteLoading}
      />

      <ChatEditMessage
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        message={messageToEdit}
        onMessageEdit={handleMessageEdit}
        isLoading={isEditLoading}
      />
    </Stack>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
  onMessagesGet: PropTypes.func,
};
