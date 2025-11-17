import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';

import { Iconify } from "src/components/iconify";

const SummaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.body2.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
}));

export const ChatAISummaryDialog = ({ open, onClose, conversation }) => {
  const [loading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const hasSummary = conversation?.chat_summary && conversation?.chat_summary.trim() !== '';
  const generatedAt = conversation?.chat_summary_generated_at;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 400
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify 
              icon="healthicons:artificial-intelligence" 
              width={28} 
              color="primary.main" 
            />
            <Typography variant="h6">AI Chat Summary</Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {loading && (
            <Stack spacing={2}>
              <Skeleton variant="text" width="100%" height={60} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
            </Stack>
          )}

          {error && (
            <Alert 
              severity="error" 
              action={
                <Tooltip title="Retry">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={handleRefresh}
                  >
                    <Iconify icon="material-symbols:refresh" />
                  </IconButton>
                </Tooltip>
              }
            >
              {error}
            </Alert>
          )}

          {!loading && !error && !hasSummary && (
            <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
              <Iconify 
                icon="healthicons:artificial-intelligence" 
                width={64} 
                color="text.disabled" 
              />
              <Typography variant="h6" color="text.secondary">
                No AI Summary Available
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                This conversation doesn't have an AI-generated summary yet. 
                Click the refresh button to generate one.
              </Typography>
            </Stack>
          )}

          {!loading && !error && hasSummary && (
            <>
              {generatedAt && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="material-symbols:schedule" width={16} color="text.secondary" />
                  <Typography variant="caption" color="text.secondary">
                    Generated on {format(new Date(generatedAt), 'PPP \'at\' p')}
                  </Typography>
                </Stack>
              )}
              
              <Box sx={{ 
                backgroundColor: 'background.neutral', 
                borderRadius: 1, 
                p: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <SummaryText variant="body2">
                  {conversation.chat_summary}
                </SummaryText>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChatAISummaryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  conversation: PropTypes.object
}; 