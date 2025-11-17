import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
// import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { getParticipantActivityStatus, getStaleColor } from 'src/utils/stale-detection';
import { generateAvatarColors } from 'src/utils/functions';
import { getAPIUrl } from 'src/config';

export const WatcherItem = ({ 
  watcher, 
  // onRemove, 
  // canRemove, 
  showActivityStatus = false 
}) => {
  const activityStatus = showActivityStatus ? getParticipantActivityStatus(watcher) : null;

  const { bgcolor, color } = generateAvatarColors(watcher?.name);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          borderColor: 'primary.light',
          backgroundColor: 'action.hover'
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={watcher.avatar ? `${getAPIUrl()}/${watcher.avatar}` : ""}
          sx={{
            width: 48,
            height: 48,
            fontSize: 18,
            fontWeight: 500,
            border: '2px solid',
            bgcolor: bgcolor,
            color: color,
            borderColor: showActivityStatus && activityStatus?.isInactive 
              ? `${getStaleColor(activityStatus.severity)}.main` 
              : 'divider',
            opacity: showActivityStatus && activityStatus?.isInactive ? 0.9 : 1
          }}
        >
          {watcher.name?.split(' ').slice(0,2).map(name => name?.charAt(0)).join('')}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {watcher.name}
            </Typography>
            {showActivityStatus && activityStatus?.isInactive && (
              <Chip
                size="small"
                label="Inactive"
                color={getStaleColor(activityStatus.severity)}
                variant="outlined"
                sx={{ fontSize: '0.6rem' }}
              />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Watcher
          </Typography>
          {showActivityStatus && activityStatus && (
            <Typography 
              variant="caption" 
              color={activityStatus.isInactive ? getStaleColor(activityStatus.severity) : 'text.secondary'}
              sx={{ display: 'block', mt: 0.5 }}
            >
              {activityStatus.timeAgo}
            </Typography>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            size="small"
            icon={<Iconify icon="solar:eye-linear" width={14} />}
            label="Watching"
            color="info"
            variant="outlined"
            sx={{
              '& .MuiChip-icon': {
                color: 'info.main',
                ml: 0.5
              },
              '& .MuiChip-label': {
                fontSize: 10
              }
            }}
          />
          
          {/* {canRemove && (
            <Tooltip title="Remove watcher">
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText'
                  }
                }}
              >
                <Iconify icon="solar:trash-bin-trash-linear" width={16} />
              </IconButton>
            </Tooltip>
          )} */}
        </Stack>
      </Stack>
    </Box>
  );
};

WatcherItem.propTypes = {
  watcher: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    last_activity: PropTypes.string
  }).isRequired,
  onRemove: PropTypes.func,
  canRemove: PropTypes.bool,
  showActivityStatus: PropTypes.bool
}; 