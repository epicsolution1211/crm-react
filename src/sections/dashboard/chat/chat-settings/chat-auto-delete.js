import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';

export const ChatAutoDelete = ({handleOpenAutoDelete}) => {

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        cursor: "pointer",
      }}
      onClick={handleOpenAutoDelete}
    >
      <Stack direction="row" alignItems="center" spacing={2}> 
        <Iconify icon="material-symbols:auto-delete-outline" />
        <Typography variant="subtitle1">Auto-Delete</Typography>
      </Stack>
    </Stack>
  )
}