import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";

import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/components/router-link";
import { generateAvatarColors } from "src/utils/functions";
import { useTimezone } from "src/hooks/use-timezone";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";

export const ReminderRenderContent = ({ reminder, onOpenTask }) => {
  const { toLocalTime } = useTimezone();

  const createdAt = toLocalTime(reminder?.created_at, "MMM dd, h:mm a");
  const time = toLocalTime(reminder?.time, "yyyy-MM-dd, h:mm a");

  const { bgcolor, color } = generateAvatarColors(reminder?.client_name)  ;

  return (
    <>
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Avatar 
          src={reminder?.client_avatar ? getAPIUrl(reminder?.client_avatar) : ""}
          sx={{
            bgcolor: reminder?.todo_id ? (theme) => alpha(theme.palette.primary.main, 0.6) : bgcolor,
            color: color,
          }}
        >
          {reminder?.todo_id ?
            <Iconify 
              icon="material-symbols:add-task" 
              sx={{ 
                width: 24,
                color: 'white',
              }} 
            />
          : reminder?.client_name?.split(' ').slice(0,2).map(name => name?.charAt(0))?.join('')}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: 0,
              }}
            >
              <Link
                color="text.primary"
                component={RouterLink}
                href={`${paths.dashboard.customers.index}/${reminder?.client_id}`}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="hover"
              >
                <Typography sx={{ mr: 0.5 }}
                  variant="subtitle2">
                  {reminder?.client_name}
                </Typography>
              </Link>

              <Typography 
                sx={{ mr: 0.5 }}
                variant="body2"
                color="text.secondary">
                {reminder?.client_name ? 'reminder at' : 'Reminder at'}
              </Typography>
              <Typography
                variant="body2"
                color="primary.main">
                {time}
              </Typography>
            </Box>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: 0,
              }}
            >
              <Typography 
                variant="subtitle2" 
                noWrap 
                sx={{ '&:hover': reminder?.todo_id ? { textDecoration: 'underline', cursor: 'pointer' } : {} }}
                onClick={() => onOpenTask(reminder?.todo_id)}
              >
                {reminder?.description}
              </Typography>
            </Box>
          </>
        }
        secondary={
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
            {reminder?.todo_id && (
              <Tooltip title="Open Task">
                <IconButton 
                  sx={{ 
                    p: 0.4,
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8) 
                    },
                  }}
                  onClick={() => onOpenTask(reminder?.todo_id)}
                >
                  <Iconify icon="fluent:open-16-filled" width={18} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        }
        sx={{ my: 0 }}
      />
    </>
  );
};


