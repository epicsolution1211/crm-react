import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Iconify } from 'src/components/iconify';
import { getAssetPath } from "src/utils/asset-path";

export const AgentFilter = ({ isDesk, isAffiliate }) => (
  <Stack alignItems="center" sx={{ flexDirection: { md: "row", xs: "column" } }} justifyContent='space-between' px={2} gap={2}>
    <Stack sx={{ flexDirection: { md: 'row', xs: 'column' } }} width={1} alignItems="center" gap={2} justifyContent='flex-start'>
      <Stack direction='row' alignItems='center' sx={{ justifyContent: { xs: 'space-between', md: 'flex-start' } }} gap={2} width={1}>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography sx={{ whiteSpace: 'nowrap', pl: 1 }}>
            {isDesk ? "Desk" : isAffiliate ? "Affiliate" : "Agent"} :
          </Typography>
          <Stack direction='row' alignItems='center' gap={2}>
            <Avatar
              src={isDesk ? "" : getAssetPath("/assets/avatars/avatar-marcus-finn.png")}
              sx={{
                height: 42,
                width: 42,
              }} />
            <Stack direction='column'>
              <Typography sx={{ whiteSpace: 'nowrap' }}>
                {isDesk ? "Desk A" : "Olivia Martin"}
              </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>
                Id: 005
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Reload">
            <IconButton
              sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
            >
              <Iconify icon="ion:reload-sharp" width={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Report">
            <IconButton
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="line-md:downloading-loop" width={24} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
    <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 2, width: 1 }}>
      <DatePicker
        format="dd/MM/yyyy"
        label="Issue Date"
        sx={{ width: { xs: 1, md: 'auto' } }}
        value={new Date()}
        slotProps={{ textField: { size: "small" } }} />
      <DatePicker
        format="dd/MM/yyyy"
        label="Due Date"
        sx={{ width: { xs: 1, md: 'auto' } }}
        value={new Date()}
        slotProps={{ textField: { size: "small" } }} />
    </Stack>
  </Stack>
);
