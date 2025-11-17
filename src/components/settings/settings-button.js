import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';

export const SettingsButton = (props) => (
  <Tooltip title="Settings">
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '50%',
        bottom: 0,
        boxShadow: 16,
        margin: { md: 4, xs: 2 },
        position: 'fixed',
        right: 0,
        zIndex: (theme) => theme.zIndex.speedDial
      }}
      {...props}>
      <ButtonBase
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          color: 'primary.contrastText',
          p: '10px'
        }}
      >
        <Iconify icon="lucide:settings-2" width={24} />
      </ButtonBase>
    </Box>
  </Tooltip>
);
