import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';

export const ChatAdmins = ({
  count = 0,
  handleOpenAdminsDrawer = () => {},
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        cursor: "pointer",
      }}
      onClick={handleOpenAdminsDrawer}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Iconify icon="mdi:administrator" width={28}/>
        <Typography variant="subtitle1">Administrators</Typography>
      </Stack>

      <Typography variant="subtitle1">{count}</Typography>
    </Stack>
  );
};
