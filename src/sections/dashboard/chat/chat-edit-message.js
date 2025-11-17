import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const ChatEditMessage = ({
  open,
  onClose,
  message,
  onMessageEdit = () => {},
  isLoading = false,
}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (message) {
      setContent(message?.content);
    }
  }, [message]);

  const handleMessageSave = () => onMessageEdit(content);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="md" sx={{ py: 4, px: 5 }}>
        <Stack spacing={5}>
          <Typography variant="h5" textAlign="center">
            Edit message
          </Typography>

          <TextField
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            label="Message"
            placeholder="Type message..."
            multiline
          />

          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={onClose} sx={{ width: 80 }}>
              Cancel
            </Button>
            <LoadingButton variant="contained" sx={{ width: 80 }} onClick={handleMessageSave} disabled={!content} loading={isLoading}>Save</LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
