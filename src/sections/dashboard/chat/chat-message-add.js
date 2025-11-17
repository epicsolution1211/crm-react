import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { Iconify } from 'src/components/iconify';
import { ChatEmailInput } from "./chat-email-input";
import { ChatEmailTemplates } from "./chat-email-templates";
import { ChatWhatsAppTemplates } from "./chat-whatsapp-templates";
import { ChatSmsInput } from "./chat-sms-input";
import { ConfirmationDialog } from "src/components/confirmation-dialog";
import { chatApi } from "src/api/chat";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { useSearchParams } from "src/hooks/use-search-params";
import { useGetCompanyEmails } from "src/hooks/swr/use-company";
import { useGetAccountEmails } from "src/hooks/swr/use-account";

const DEFAULT_QUILL_EMPTY = "<p><br></p>";

const useGetWhatsAppStatus = (id, isWhatsApp) => {
  const [statusData, setStatusData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getWhatsAppStatus = async () => {
    if (!id || !isWhatsApp) return;
    
    setIsLoading(true);
    try {
      const response = await chatApi.getWhatsAppStatus(id);
      setStatusData(response);
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
      setStatusData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWhatsAppStatus();
  }, [id, isWhatsApp]);

  return { statusData, isLoading, refetch: getWhatsAppStatus };
};

const getWhatsAppStatusMessage = (statusData) => {
  if (!statusData?.whatsapp_status) return null;
  
  const status = statusData.whatsapp_status;
  
  switch (status.type) {
    case 'text_allowed':
      return {
        message: 'Client has messaged within 24 hours. You can send text or template messages.',
        severity: 'success',
        color: 'success'
      };
    case 'template_only':
      return {
        message: 'Start the conversation with a template message. Text messages not allowed.',
        severity: 'info',
        color: 'primary'
      };
    case 'window_expired':
      return {
        message: 'Messaging window expired. Use template to re-engage with the client.',
        severity: 'warning',
        color: 'warning'
      };
    default:
      return null;
  }
};

export const ChatMessageAdd = (props) => {
  const {
    disabled = false,
    onSend,
    conversationId,
    ticket = {},
    sendMessageAccess = false,
    sendMediaAccess = false,
    onParticipantsGet = () => { },
    ...other
  } = props;
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer");
  
  // Check if current chat is WhatsApp (similar to Email condition)
  const isWhatsApp = ticket?.labels?.[0]?.name === "WhatsApp";
  const { statusData, refetch: refetchWhatsAppStatus } = useGetWhatsAppStatus(conversationId, isWhatsApp);
  const { user, company } = useAuth();
  const fileInputRef = useRef(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [senderEmail, setSenderEmail] = useState();
  const [senderPhone, setSenderPhone] = useState();
  const [openSmsConfirmation, setOpenSmsConfirmation] = useState(false);
  const [openEmailTemplates, setOpenEmailTemplates] = useState(false);
  const [openWhatsappTemplates, setOpenWhatsappTemplates] = useState(false);
  const [isJoinChatLoading, setIsJoinChatLoading] = useState(false);
  const [isHtml, setIsHtml] = useState(false);
  const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] = useState(null);
  const [whatsappTemplateParams, setWhatsappTemplateParams] = useState([]);
  const { emails } = useGetCompanyEmails({ company_id: company?.id });
  const { emails: accountEmails } = useGetAccountEmails({ account_id: user?.account_id });

  const emailsList = useMemo(() => [
    ...emails?.map(email => ({ ...email, type: 'Company' })),
    ...accountEmails?.map(email => ({ ...email, type: 'Account' }))
  ], [emails, accountEmails]);

  const hasNonSpace = (string) => {
    for (let i = 0; i < string.length; i++) {
      if (string[i] !== " ") {
        return true;
      }
    }
    return false;
  };

  const handleAttachmentUpload = useCallback(
    (event) => {
      const attachmentLimit = 52428800;
      const attachment = event?.target?.files[0];

      if (attachment.size > attachmentLimit) {
        toast("Attachment size limit is 50MB!");
        return;
      }

      const formData = new FormData();
      formData.append("conversation_id", conversationId);
      formData.append("files[]", attachment);
      formData.append("description", "Media");
      onSend?.(formData);
    },
    [onSend, conversationId]
  );

  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);

  const handleSend = useCallback(
    (type) => {
      if (hasNonSpace(body)) {
        const message = {
          conversation_id: conversationId,
          description: body,
        };

        if (subject && type !== "send_email") {
          message["subject"] = subject;
        }

        if (senderEmail) {
          message["sender_email"] = senderEmail;
        }

        if (type) {
          message[type] = true;
        }

        // Add WhatsApp template data if available
        if (type === "send_whatsapp" && selectedWhatsappTemplate) {
          message["whatsapp_template_id"] = selectedWhatsappTemplate.templateId;
          if (whatsappTemplateParams.length > 0) {
            message["whatsapp_template_params"] = whatsappTemplateParams;
          }
        }

        setBody("");
        setSubject("");
        setSenderEmail(null);
        setSelectedWhatsappTemplate(null);
        setWhatsappTemplateParams([]);
        onSend?.(message);
        
        // Refetch WhatsApp status if this was a template message
        if (type === "send_whatsapp" && selectedWhatsappTemplate) {
          setTimeout(() => {
            refetchWhatsAppStatus();
          }, 1000);
        }
      }
    },
    [body, onSend, conversationId, subject, setBody, senderEmail, setSenderEmail, selectedWhatsappTemplate, whatsappTemplateParams, ticket, refetchWhatsAppStatus]
  );


  useEffect(() => {
    if (user?.email && (user?.acc?.acc_v_agent_email === undefined || user?.acc?.acc_v_agent_email === true)) setSenderEmail(user?.email);
  }, [user]);

  const handleOpenSmsConfirmation = useCallback(() => {
    setOpenSmsConfirmation(true);
  }, []);

  const handleCloseSmsConfirmation = useCallback(() => {
    setOpenSmsConfirmation(false);
  }, []);

  const handleSendSms = useCallback(() => {
    if (hasNonSpace(body)) {
      const message = {
        conversation_id: conversationId,
        row_text: body,
        description: body,
        send_sms: true,
      };
      if (senderPhone) message["source_sms_number"] = senderPhone;
      onSend?.(message);
      setBody("");
      handleCloseSmsConfirmation();
      toast.success("SMS successfully sent!");
      setSenderPhone(null);
    }
  }, [onSend, body, conversationId]);

  const handleEnter = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      if (ticket?.subject === 'SMS') {
        handleSendSms();
      } else {
        handleSend();
      }
      e.preventDefault();
      return;
    }
  };

  const handleJoinChat = async () => {
    setIsJoinChatLoading(true);
    try {
      const accountId = localStorage.getItem("account_id");
      await chatApi.inviteMemberToChat({
        account_id: accountId,
        conversation_id: ticket?.conversation?.id,
      });
      setTimeout(() => {
        onParticipantsGet();
      }, 1500);
      toast.success("Successfully joined the chat!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsJoinChatLoading(false);
    }
  }

  // Get WhatsApp status info
  const whatsappStatusInfo = getWhatsAppStatusMessage(statusData);
  const whatsappStatus = statusData?.whatsapp_status;
  
  // Determine if input should be disabled for WhatsApp
  const isInputDisabled = disabled || (isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text);

  const renderWhatsAppStatusIndicator = () => {
    if (!isWhatsApp || !whatsappStatusInfo) return null;

    return (
      <Box sx={{ 
        width: 1, 
        px: { xs: 1, md: 3 },
        mb: 0.5
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            px: 2,
            borderRadius: 1,
            bgcolor: whatsappStatusInfo.severity === 'success' ? 'success.lighter' : 
                    whatsappStatusInfo.severity === 'warning' ? 'warning.lighter' : 'info.lighter',
            border: 1,
            borderColor: whatsappStatusInfo.severity === 'success' ? 'success.light' : 
                       whatsappStatusInfo.severity === 'warning' ? 'warning.light' : 'info.light',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify 
              icon={whatsappStatusInfo.severity === 'success' ? 'mdi:check-circle' : 
                    whatsappStatusInfo.severity === 'warning' ? 'mdi:alert-circle' : 'mdi:information'}
              width={16}
              sx={{ 
                color: whatsappStatusInfo.severity === 'success' ? 'success.main' : 
                       whatsappStatusInfo.severity === 'warning' ? 'warning.main' : 'info.main'
              }}
            />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {whatsappStatusInfo.message}
            </Typography>
          </Stack>
          
          {whatsappStatus && (
            <Stack direction="row" spacing={1} alignItems="center">
              {whatsappStatus.template_limit > 0 && (
                <Chip
                  size="small"
                  label={`${whatsappStatus.templates_remaining}/${whatsappStatus.template_limit}`}
                  color={whatsappStatus.templates_remaining > 0 ? "success" : "error"}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
              {whatsappStatus.messaging_window_expires_at && (
                <Chip
                  size="small"
                  label="24h"
                  color="success"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
          )}
        </Box>
      </Box>
    );
  };

  const renderInput = (
    <>
      {ticket?.labels?.[0]?.name === "Email" ? (
        <Box sx={{ width: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <ChatEmailInput
            disabled={isInputDisabled}
            value={body}
            subject={subject}
            setValue={setBody}
            setSubject={setSubject}
            senderEmails={emailsList}
            senderEmail={senderEmail}
            setSenderEmail={setSenderEmail}
            isHtml={isHtml}
          />
        </Box>
      ) : ticket?.labels?.[0]?.name === "SMS" ? (
        <Box sx={{ width: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <ChatSmsInput
            body={body}
            handleEnter={handleEnter}
            handleChange={handleChange}
            disabled={isInputDisabled}
            senderPhone={senderPhone}
            setSenderPhone={setSenderPhone}
          />
        </Box>
      ) : (
        <Box sx={{ 
          width: 1, 
          bgcolor: isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text ? 'action.hover' : 'background.paper', 
          borderRadius: 1, 
          border: '1px solid', 
          borderColor: isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text ? 'warning.light' : 'divider',
          opacity: isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text ? 0.7 : 1
        }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1.5, py: 0 }}>
            <Iconify 
              icon={isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text ? "mdi:message-off-outline" : "mdi:message-text-outline"}
              width={20} 
              sx={{ color: 'text.secondary' }} 
            />
            <OutlinedInput
              disabled={isInputDisabled}
              fullWidth
              multiline
              onChange={handleChange}
              onKeyDown={handleEnter}
              placeholder={
                isWhatsApp && whatsappStatus && !whatsappStatus.can_send_text 
                  ? "Text messages not allowed. Use template instead." 
                  : "Leave a message"
              }
              size="small"
              value={body}
              sx={{ 
                border: 'none', 
                '& fieldset': { 
                  border: 'none',
                },
                p: 0,
                px: 1,
                '& .MuiOutlinedInput-input': { py: 1 },
                '&.Mui-focused': {
                  '& fieldset': { border: 'none !important' }
                }
              }}
            />
          </Stack>
        </Box>
      )}
    </>
  )

  return (
    <Stack spacing={1} sx={{ width: 1 }}>
      {/* WhatsApp Status Indicator */}
      {renderWhatsAppStatusIndicator()}
      
      {/* Main Input Section */}
      <Stack
        alignItems="center"
        direction="row"
        sx={{
          pl: {
            xs: 1,
            md: 3,
          },
          pr: {
            xs: 3,
            md: 3,
          },
          py: 1,
          gap: {
            xs: 1,
            md: 2,
          },
        }}
        {...other}
      >
      <Avatar
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
        src={user?.avatar ? user?.avatar?.includes('http') ? user?.avatar : `${getAPIUrl()}/${user?.avatar}` : ""}
      />
      {sendMessageAccess ? (
        renderInput
      ) : (
        <Box
          sx={{
            width: 1,
            py: 1.5,
            px: 2,
            borderRadius: 1,
            bgcolor: 'background.neutral',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify 
                icon="mdi:message-off-outline" 
                width={20} 
                sx={{ color: 'text.secondary' }} 
              />
              <Typography variant="body2" color="text.secondary">
                Admin of this chat set limitation to sending messages
              </Typography>
            </Stack>
            {ticket?.conversation?.public && (
              <LoadingButton 
                variant="contained" 
                size="small" 
                onClick={handleJoinChat}
                startIcon={<Iconify icon="mdi:account-plus" />}
                loading={isJoinChatLoading}
              >
                Join Chat
              </LoadingButton>
            )}
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: ticket?.labels?.[0]?.name === "Email" ? "column" : "row",
          gap: {
            xs: 1,
            md: ticket?.labels?.[0]?.name === "Email" ? 5 : 2,
          },
        }}
      >
        {
          sendMessageAccess && (
            ticket?.labels?.[0]?.name === "Internal" ||
            ticket?.labels?.[0]?.name === "Support" ||
            ticket?.labels?.[0]?.name === "Call" ||
            ticket?.labels?.length === 0) ? (
            <IconButton
              color="primary"
              disabled={!body || isInputDisabled}
              sx={{
                color: "text.primary",
                p: 0,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={() => handleSend()}
            >
              <Tooltip title="Send Message">
                <Iconify icon="icon-park-outline:send" width={24}/>
              </Tooltip>
            </IconButton>
          ) : null}

        {sendMessageAccess && ticket?.labels?.[0]?.name === "SMS" ? (
          <Tooltip title="Send SMS">
            <IconButton
              disabled={!body || isInputDisabled}
              sx={{
                color: "text.primary",
                p: 0,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={handleOpenSmsConfirmation}
            >
              <Iconify icon="fa-solid:sms" width={24}/>
            </IconButton>
          </Tooltip>
        ) : null}

        {sendMessageAccess && ticket?.labels?.[0]?.name === "Email" ? (
          <Tooltip title="Send via Email">
            <IconButton
              disabled={!body || isInputDisabled || body === DEFAULT_QUILL_EMPTY}
              onClick={() => handleSend("send_email")}
              sx={{
                p: 0,
                color: "text.primary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <Iconify icon="ic:baseline-forward-to-inbox" width={24}/>
            </IconButton>
          </Tooltip>
        ) : null}

        {sendMessageAccess && ticket?.labels?.[0]?.name === "WhatsApp" ? (
          <Tooltip title={
            whatsappStatus?.can_send_text 
              ? "Send via WhatsApp" 
              : "Text messages not allowed. Use template instead."
          }>
            <IconButton
              disabled={
                !body || 
                disabled || 
                (whatsappStatus && !whatsappStatus.can_send_text && !selectedWhatsappTemplate)
              }
              onClick={() => handleSend("send_whatsapp")}
              sx={{
                p: 0,
                color: whatsappStatus?.can_send_text ? "text.primary" : "text.disabled",
                "&:hover": {
                  color: whatsappStatus?.can_send_text ? "primary.main" : "text.disabled",
                },
              }}
            >
              <Iconify icon="ic:baseline-whatsapp" width={24}/>
            </IconButton>
          </Tooltip>
        ) : null}

        {
          sendMediaAccess && (
            ticket?.labels?.[0]?.name === "Internal" ||
            ticket?.labels?.[0]?.name === "Support" ||
            ticket?.labels?.[0]?.name === "Call" ||
            ticket?.labels?.length === 0) ? (
            <Tooltip title="Attach file">
              <IconButton
                disabled={disabled}
                edge="end"
                sx={{
                  p: 0,
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={handleAttach}
              >
                <Iconify icon="teenyicons:attach-solid" width={22}/>
              </IconButton>
            </Tooltip>
          ) : null}

        {sendMessageAccess && ticket?.labels?.[0]?.name === "Email" ? (
          <Tooltip title="Select from templates">
            <IconButton
              sx={{
                color: "text.primary",
                p: 0,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={() => setOpenEmailTemplates(true)}
            >
              <Iconify icon="fluent:mail-template-24-regular" width={24}/>
            </IconButton>
          </Tooltip>
        ) : null}

        {sendMessageAccess && ticket?.labels?.[0]?.name === "WhatsApp" ? (
          <Tooltip title="Select from templates">
            <IconButton
              sx={{
                color: "text.primary",
                p: 0,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={() => setOpenWhatsappTemplates(true)}
            >
              <Iconify icon="fluent:chat-bubbles-question-24-regular" width={24}/>
            </IconButton>
          </Tooltip>
        ) : null}

        {customerId && sendMessageAccess ? (
          <Stack sx={{ pl: 1 }}>
            <Tooltip title="Send Note">
              <IconButton
                disabled={!body || isInputDisabled || (ticket?.labels?.[0]?.name === "Email" && body === DEFAULT_QUILL_EMPTY)}
                sx={{
                  p: 0,
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={() => handleSend("note")}
              >
                <Iconify icon="f7:doc-text" width={24}/>
              </IconButton>
            </Tooltip>
          </Stack>
        ) : null}
      </Box>

      <input
        hidden
        ref={fileInputRef}
        onChange={handleAttachmentUpload}
        type="file"
      />
      </Stack>
      
      {/* Dialogs */}
      <ConfirmationDialog
        open={openSmsConfirmation}
        onClose={handleCloseSmsConfirmation}
        title="Are you sure you want to send SMS?"
        subtitle=""
        confirmTitle="Send SMS"
        onConfirm={handleSendSms}
      />
      <ChatEmailTemplates
        open={openEmailTemplates}
        onClose={() => setOpenEmailTemplates(false)}
        brandId={other?.brandId}
        onApplyTemplate={(info) => {
          setSubject(info?.subject)
          setBody(info?.description)
          setIsHtml(info?.isHtml)
        }}
      />
      <ChatWhatsAppTemplates
        open={openWhatsappTemplates}
        onClose={() => setOpenWhatsappTemplates(false)}
        brandId={other?.brandId}
        onSendTemplate={(info) => {
          const message = {
            conversation_id: conversationId,
            description: info?.templateName,
            send_whatsapp: true,
            whatsapp_template_id: info?.templateId,
          };

          if (whatsappTemplateParams.length > 0) {
            message["whatsapp_template_params"] = whatsappTemplateParams;
          }

          onSend?.(message);
          
          setSelectedWhatsappTemplate(null);
          setWhatsappTemplateParams([]);
          
          setTimeout(() => {
            refetchWhatsAppStatus();
          }, 1000);
        }}
      />
    </Stack>
  );
};

