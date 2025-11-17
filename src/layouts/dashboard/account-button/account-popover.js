import { useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { Iconify } from 'src/components/iconify';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, onSettingsOpen, ...other } = props;
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      onClose?.();

      await auth.signOut();
      router.push(paths.auth.jwt.login);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, [auth, router, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}>
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">
          {auth.user?.first_name} {auth.user?.last_name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {auth.user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5
          }}
        >
          <ListItemIcon>
            <Iconify icon="uil:user" width={24} />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Profile
              </Typography>
            )}
          />
        </ListItemButton>
        <ListItemButton
          onClick={onSettingsOpen}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5
          }}
        >
          <ListItemIcon>
            <Iconify icon="carbon:settings-adjust" width={24} />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Settings
              </Typography>
            )}
          />
        </ListItemButton>
      </Box>
      <Divider sx={{ my: '0 !important' }} />
      <Box
        sx={{
          display: 'flex',
          p: 1,
          justifyContent: 'center'
        }}
      >
        <Button
          color="inherit"
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onSettingsOpen: PropTypes.func,
};
