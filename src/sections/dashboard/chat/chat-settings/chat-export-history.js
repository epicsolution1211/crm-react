import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";

import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";

import { chatApi } from "src/api/chat";
import { Iconify } from "src/components/iconify";
import { SeverityPill } from "src/components/severity-pill";
import { exportToExcel } from "src/utils/export-excel";

export const ChatExportHistory = ({ open, onClose, conversationId }) => {
  const [exportLoading, setExportLoading] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    const getMessagesCount = async () => {
      const res = await chatApi.getMessages({ conversation_id: conversationId, per_page: 10000 });
      setMessagesCount(res?.total_count ?? 0);
    }

    getMessagesCount();
  }, [conversationId, open]);

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.MM.yyyy");
    const excelData = await handleMakeExcelData();

    exportToExcel(excelData, `chat-import-${exportDate}`);
    onClose();
  }, [conversationId]);

  const handleMakeExcelData = async () => {
    try {
      setExportLoading(true);
      const data = [];

      const res = await chatApi.getMessages({ conversation_id: conversationId, per_page: 10000 });

      setExportLoading(false);

      data.push(...res?.messages?.map(m => ({
        ["Message Id"]: m?.id,
        ["Message"]: m?.description ?? m?.html_description ?? (m?.system_event == 1 ? `${m?.account?.first_name} ${m?.account?.last_name} has invited ${m?.system_event_account?.first_name} ${m?.system_event_account?.last_name} to the chat.` : m?.system_event == 2 ? `${m?.account?.first_name} ${m?.account?.last_name} has removed ${m?.system_event_account?.first_name} ${m?.system_event_account?.last_name} from the chat.` : m?.system_event == 3 ? `Chat name has changed` : m?.description ?? m?.html_description),
        ["System Message"]: m?.system ? "Yes" : "No",
        ["System Event"]: m?.system_event,
        ["Sender"]: m?.account? `${m?.account?.first_name} ${m?.account?.last_name}` : (m?.client ? `${m?.client?.first_name} ${m?.client?.last_name}` : "System"),
        ["Sender Id"]: m?.account?.id || m?.client?.id,
        ["Company Id"]: m?.company_id,
        ["Conversation Id"]: m?.conversation_id,
        ["Created At"]: m?.created_at ? format(new Date(m?.created_at), "dd.MM.yyyy HH:mm:ss") : "N/A",
        ["Updated At"]: m?.updated_at ? format(new Date(m?.updated_at), "dd.MM.yyyy HH:mm:ss") : "N/A",
      })));

      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setExportLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Container maxWidth="md" sx={{ px: 3, py: 4 }}>
        <Stack spacing={3}>
          {/* Header section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            sx={{ 
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Iconify icon="eva:download-fill" color="primary.main" width={28} />
            <Typography variant="h5">
              Export Chat History
            </Typography>
          </Stack>

          {/* Content section */}
          <Box sx={{ 
            py: 4,
            px: 2, 
            bgcolor: 'background.neutral',
            borderRadius: 1
          }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={2}
              sx={{ 
                p: 2, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Iconify icon="eva:message-circle-fill" color="info.main" width={24} />
              <Typography variant="subtitle1">Total Messages:</Typography>
              <SeverityPill 
                color="info"
                sx={{ 
                  px: 2,
                  py: 1,
                  fontSize: '1rem'
                }}
              >
                {messagesCount}
              </SeverityPill>
            </Stack>
          </Box>

          {/* Actions section */}
          <Stack 
            direction="row" 
            justifyContent="flex-end" 
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              startIcon={<Iconify icon="eva:close-fill" />}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleExport}
              loading={exportLoading}
              disabled={exportLoading}
              startIcon={<Iconify icon="eva:download-fill" />}
              sx={{ px: 3 }}
            >
              Export
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  )
}