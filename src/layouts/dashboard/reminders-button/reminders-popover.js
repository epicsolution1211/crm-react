import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { Scrollbar } from "src/components/scrollbar";
import { ReminderRenderContent } from "./reminder-render-content";
import { Iconify } from 'src/components/iconify';
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { useAuth } from 'src/hooks/use-auth';

export const RemindersPopover = ({ anchorEl, reminders, onClose, onMarkAllAsRead, onRemoveOne, onEditOne, open = false, onOpenTask }) => {
  const router = useRouter();
  const processedRemindersRef = useRef(new Set());
  const { timezoneOffset: offSet } = useAuth();

  const handleOpenCalendar = () => {
    router.push(paths.dashboard.calendar);
    onClose();
  }

  const isEmpty = reminders?.length === 0;

  const checkDueReminders = () => {
    if (reminders && reminders.length > 0) {
      const now = new Date();
      
      const adjustedNow = offSet ? new Date(now.getTime() + (offSet * 60 * 60 * 1000)) : now;

      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.time);
        const reminderKey = `${reminder?.id}-${reminder?.time}`;
        
        if (reminderTime <= adjustedNow && 
            reminderTime >= new Date(adjustedNow.getTime() - 60000) && 
            !processedRemindersRef.current.has(reminderKey)) {
          
          const clientInfo = reminder?.client?.full_name ? `for ${reminder?.client?.full_name}` : '';
          const message = `Reminder: ${reminder?.description ?? "No description"} ${clientInfo}`;
          
          toast(message, {
            duration: 6000,
            position: 'bottom-right',
            style: {
              color: '#fff',
              padding: '16px',
              borderRadius: '4px',
            },
            icon: '🔔',
          });
          
          processedRemindersRef.current.add(reminderKey);
        }
      });
    }
  };

  useEffect(() => {
    checkDueReminders();
    
    const intervalId = setInterval(checkDueReminders, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [reminders, offSet]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={onClose}
      open={open}
      PaperProps={{ 
        sx: { 
          width: 380,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        } 
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'neutral.800' 
            : 'neutral.50'
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
          sx={{ fontSize: '1rem', fontWeight: 600 }}
        >
          Reminders
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Mark all as read">
            <IconButton
              onClick={() => onMarkAllAsRead("all")}
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'neutral.700' 
                    : 'neutral.100'
                }
              }}
            >
              <Iconify icon="mage:email" width={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open calendar">
            <IconButton
              onClick={handleOpenCalendar}
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'neutral.700' 
                    : 'neutral.100'
                }
              }}
            >
              <Iconify icon="lucide:calendar" width={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {isEmpty ? (
        <Box 
          sx={{ 
            p: 3,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="subtitle2">There are no reminders</Typography>
        </Box>
      ) : (
        <Scrollbar 
          sx={{ 
            maxHeight: 380,
            '& .simplebar-content': {
              p: 0
            }
          }}
        >
          <List disablePadding>
            {reminders?.map((reminder) => (
              <ListItem
                divider
                key={reminder.id}
                sx={{
                  px: 3,
                  py: 2,
                  alignItems: "flex-start",
                  transition: 'background-color 0.2s',
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.50'
                  },
                  "& .MuiListItemSecondaryAction-root": {
                    top: "24%",
                    right: '16px'
                  },
                  opacity: reminder?.closed ? 0.8 : 1 
                }}
                secondaryAction={<Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '.MuiListItem-root:hover &': {
                      opacity: 1
                    }
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      edge="end"
                      onClick={() => onEditOne?.(reminder)}
                      size="small"
                      sx={{
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                          ? 'neutral.700'
                          : 'neutral.100',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '& svg': {
                            transform: 'scale(1.1)',
                          }
                        },
                        '& svg': {
                          transition: 'transform 0.2s'
                        }
                      }}
                    >
                      <Iconify icon="fluent:edit-12-regular" width={24} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveOne?.(reminder?.id)}
                      size="small"
                      sx={{
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                          ? 'neutral.700'
                          : 'neutral.100',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'error.contrastText',
                          '& svg': {
                            transform: 'scale(1.1)',
                          }
                        },
                        '& svg': {
                          transition: 'transform 0.2s'
                        }
                      }}
                    >
                      <Iconify icon="iconamoon:close" width={24} />
                    </IconButton>
                  </Tooltip>
                </Stack>}
              >
                <ReminderRenderContent reminder={reminder} onOpenTask={onOpenTask} />
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      )}
    </Popover>
  );
};
