import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';

export const ChatDefaultAccess = ({
  handleOpenDefaultAccess = () => {},
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        cursor: "pointer",
      }}
      onClick={handleOpenDefaultAccess}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Iconify icon="fluent:shield-task-32-regular"/>
        <Typography variant="subtitle1">Default Access</Typography>
      </Stack>
    </Stack>
  );
};
