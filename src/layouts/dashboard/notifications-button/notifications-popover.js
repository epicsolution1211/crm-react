import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CustomSwitch from 'src/components/customize/custom-switch';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from "src/hooks/use-mounted";
import { userApi } from 'src/api/user';
import { alpha } from '@mui/material';

const NotificationItem = ({ notification, onOpenTask }) => {
  const createdAt = format(new Date(notification?.created_at), 'MMM dd, h:mm a');
  return (
    <ListItemText
      primary={(
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          <Link
            href={`${paths.dashboard.customers.index}/${notification?.client_id}`}
            underline="always"
            variant="body2"
          >
            {notification.client_name}
          </Link>
          <Typography
            sx={{ ml: 2, color: notification?.seen ? "text.disabled" : "text.primary", '&:hover': notification?.todo_id ? { textDecoration: 'underline', cursor: 'pointer' } : {} }}
            variant="body2"
            onClick={() => onOpenTask(notification?.todo_id)}
          >
            {notification?.message ?? ""}
          </Typography>

        </Box>
      )}
      secondary={(
          <Stack 
            direction="row" 
            alignItems="center" 
            gap={1} 
            pt={0.5}
          >
            <Typography
              color="text.secondary"
              variant="caption">
              {createdAt}
            </Typography>
            {notification?.todo_id && (
              <Tooltip title="Open Task">
                <IconButton 
                  sx={{ 
                    p: 0.4,
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8) 
                    },
                  }}
                  onClick={() => onOpenTask(notification?.todo_id)}
                >
                  <Iconify icon="fluent:open-16-filled" width={18} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
      )}
      sx={{ my: 0 }}
    />
  );
};

const settingList = [
  { name: 'client_online', label: 'Client is online'},
  { name: 'client_deposit', label: 'Client added a deposit'},
  { name: 'client_wd', label: 'Client submitted a withdrawal request'},
  { name: 'client_margin_call', label: 'Margin call triggered'},
  { name: 'client_email', label: 'Incoming email'},
  { name: 'client_support', label: 'Support chat notification'},
  { name: 'client_sms', label: 'Incoming SMS'},
  { name: 'client_submit_kyc', label: 'Client submitted a KYC request' },
  { name: 'assigned_leads', label: 'Assigned leads' },
  { name: 'hide_read_notifications', label: 'Hide Read Notifications' },
];

export const NotificationsPopover = ({ anchorEl, notifications, onClose, open = false, unread, setReadNotification, onOpenTask }) => {
  const { control, watch } = useForm();
  const { user } = useAuth();

  const [isShowSetting, setIsShowSetting] = useState(false);
  const isMounted = useMounted();

  const isEmpty = notifications.length === 0;
  
  const displaySwitchList = () => {
    setIsShowSetting(!isShowSetting);
  }

  const updateSettings = async (data) => {
    if (!isMounted()) return;
    
    try {
      await userApi.updateUser(user.id, { notification_sett: JSON.stringify(data) });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  useEffect(() => {
    if (!isMounted()) return;

    if(user?.notification_sett) {
      const settings = typeof user.notification_sett === 'string' 
        ? JSON.parse(user.notification_sett)
        : user.notification_sett;
      control._reset(settings);
    } else {
      control._reset({ 
        client_online: false,
        client_deposit: false,
        client_wd: false,
        client_margin_call: false,
        client_email: false,
        client_support: false,
        client_sms: false,
        client_submit_kyc: false,
      });
    }
  }, [isMounted, user?.notification_sett, control]);

  // Watch for changes in any switch
  useEffect(() => {
    const subscription = watch((value) => {
      if (Object.keys(value).length > 0) {
        updateSettings(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      disableScrollLock
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 380 } }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
        >
          Notifications
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
        >
          <IconButton
            onClick={() => displaySwitchList()}
            size="small"
          >
            <Tooltip title="Setting">
              <Iconify icon="lsicon:setting-search-filled" sx={{width:24, height:24, '&:hover': { color: 'primary.main' }}} />
            </Tooltip>
          </IconButton>
          <IconButton
            disabled={unread<1}
            onClick={() => setReadNotification(notifications?.filter(item => item?.seen == false)?.map((item) => item?.id))}
            size="small"
            color="inherit"
          >
            <Tooltip title="Mark all as read">
              <SvgIcon>
                <ChecklistIcon />
              </SvgIcon>
            </Tooltip>
          </IconButton>
        </Stack>
      </Stack>

      <Stack sx={{px:2, borderTop: 1, borderTopColor: 'divider', borderBottom: 1, borderBottomColor: 'divider'}}>
        {isShowSetting && (
          settingList.map((setting) => (
            <CustomSwitch
              key={setting.name}
              label={setting.label}
              control={control}
              justifyContent='space-between'
              name={setting?.name}
            />
          ))
        )}
      </Stack>

      {isEmpty
        ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              There are no notifications
            </Typography>
          </Box>
        )
        : (
          <Scrollbar sx={{ maxHeight: 400 }}>
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItem
                  divider
                  key={notification.id}
                  sx={{
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    '& .MuiListItemSecondaryAction-root': {
                      top: '24%'
                    }
                  }}
                >
                  <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: 1 }}>
                    <NotificationItem notification={notification} onOpenTask={onOpenTask} />
                    {notification?.seen ? null
                      : (
                        <Tooltip title="Mark as read">
                          <IconButton
                            edge="end"
                            onClick={() => setReadNotification([notification.id])}
                            size="small"
                            color="primary"
                          >
                            <Iconify icon="iconamoon:close" width={24} />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Scrollbar>
        )}
    </Popover>
  );
};
