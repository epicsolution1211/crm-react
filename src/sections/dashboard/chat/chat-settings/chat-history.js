import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";


import { Iconify } from 'src/components/iconify';

export const ChatHistory = () => (
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Stack direction="row" alignItems="center" spacing={2}>
      <Iconify icon="token:chat" />
      <Typography variant="subtitle1">Chat history for new members</Typography>
    </Stack>
    <Switch />
  </Stack>
)