import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { usePopover } from 'src/hooks/use-popover';

import { AccountPopover } from './account-popover';
import { useAuth } from "src/hooks/use-auth";
import { useSettings } from 'src/hooks/use-settings';
import { getAPIUrl } from 'src/config';
import { Iconify } from 'src/components/iconify';

export const AccountButton = () => {
  const { user } = useAuth();
  const popover = usePopover();
  const settings = useSettings();

  if (!user) return null;

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'divider',
          height: 40,
          width: 40,
          borderRadius: '50%'
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32
          }}
          src={user.avatar ? user.avatar?.includes('http') ? user.avatar : `${getAPIUrl()}/${user.avatar}` : ""}
        >
          <Iconify icon="mingcute:user-1-line" width={24} />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        onSettingsOpen={settings.handleDrawerOpen}
      />
    </>
  );
};
