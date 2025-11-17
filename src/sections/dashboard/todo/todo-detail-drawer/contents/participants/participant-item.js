import { useState } from 'react';

import { format } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';

import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from "src/config";
import { generateAvatarColors } from 'src/utils/functions';
import { getParticipantActivityStatus, getStaleColor } from 'src/utils/stale-detection';

const statusColors = {
  todo: 'primary',
  in_progress: 'secondary',
  done: 'success'
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
};

export const ParticipantItem = ({ 
  participant, 
  isCreator, 
  // onRemove, 
  // canRemove, 
  showActivityStatus = false
}) => {
  const [showTimeDetails, setShowTimeDetails] = useState(false);

  const formatTimeInStages = (timeInStages) => {
    if (!timeInStages) return '0h';
    const totalHours = Object.values(timeInStages).reduce((sum, time) => sum + (Number(time) || 0), 0);
    return totalHours > 0 ? `${totalHours.toFixed(1)}h` : '0h';
  };

  const formatStageTime = (hours) => {
    if (!hours || hours === 0) return '0h';
    return `${Number(hours).toFixed(1)}h`;
  };

  const getStatusColor = (status) => {
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    return statusLabels[status] || status;
  };

  const getStageIcon = (stage) => {
    const icons = {
      todo: 'solar:clock-circle-linear',
      in_progress: 'solar:play-circle-linear',
      done: 'solar:check-circle-linear'
    };
    return icons[stage] || 'solar:clock-circle-linear';
  };

  const getStageColor = (stage) => {
    const colors = {
      todo: 'primary',
      in_progress: 'secondary',
      done: 'success'
    };
    return colors[stage] || 'default';
  };

  const activityStatus = showActivityStatus ? getParticipantActivityStatus(participant) : null;

  const { bgcolor, color } = generateAvatarColors(participant?.name);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-0.5px)',
          transition: 'all 0.2s ease-in-out'
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={participant.avatar ? `${getAPIUrl()}/${participant.avatar}` : ""}
          sx={{ 
            width: 48, 
            height: 48,
            fontSize: 18,
            fontWeight: 500,
            border: '2px solid',
            borderColor: showActivityStatus && activityStatus?.isInactive 
              ? `${getStaleColor(activityStatus.severity)}.main` 
              : 'divider',
            opacity: showActivityStatus && activityStatus?.isInactive ? 0.8 : 1,
            bgcolor: bgcolor,
            color: color
          }}
        >
          {participant?.name?.split(' ').slice(0,2).map(name => name?.charAt(0)).join('')}
        </Avatar>
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium" noWrap>
              {participant.name}
            </Typography>
            {isCreator && (
              <Chip
                size="small"
                label="Creator"
                color="info"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            {showActivityStatus && activityStatus?.isInactive && (
              <Chip
                size="small"
                label="Inactive"
                color={getStaleColor(activityStatus.severity)}
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Stack>
          
          <Stack direction="row" columnGap={2} rowGap={0.5} alignItems="center" flexWrap="wrap">
            <Chip
              size="small"
              label={getStatusLabel(participant.status)}
              color={getStatusColor(participant.status)}
              variant="filled"
              sx={{ 
                fontSize: '0.7rem',
                fontWeight: 'medium'
              }}
            />
            
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:clock-circle-linear" width={16} />
              <Typography variant="caption" color="text.secondary" fontWeight="medium" pr={1}>
                {formatTimeInStages(participant.time_in_stages)}
              </Typography>
              {participant.time_in_stages && Object.keys(participant.time_in_stages).length > 0 && (
                <IconButton
                  size="small"
                  onClick={() => setShowTimeDetails(!showTimeDetails)}
                  sx={{ 
                    p: 0.5,
                    color: 'text.primary',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'primary.light',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <Iconify 
                    icon={showTimeDetails ? "meteor-icons:angles-up" : "meteor-icons:angles-down"} 
                    width={14} 
                  />
                </IconButton>
              )}
            </Stack>
            
            {showActivityStatus && activityStatus ? (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:clock-linear" width={16} />
                <Typography 
                  variant="caption" 
                  color={activityStatus.isInactive ? getStaleColor(activityStatus.severity) : 'text.secondary'}
                  fontWeight={activityStatus.isInactive ? 'medium' : 'normal'}
                >
                  {activityStatus.timeAgo}
                </Typography>
              </Stack>
            ) : participant.last_touched_at && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:clock-linear" width={16} />
                <Typography variant="caption" color="text.secondary">
                  Last active: {format(new Date(participant.last_touched_at), 'MMM dd, HH:mm')}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
        
        {/* {canRemove && !isCreator && (
          <Tooltip title="Remove">
            <IconButton
              size="small"
              onClick={() => onRemove(participant.id)}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'error.main',
                }
              }}
            >
              <Iconify icon="solar:close-circle-linear" width={18} />
            </IconButton>
          </Tooltip>
        )} */}
      </Stack>
      
      <Collapse in={showTimeDetails}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ pl: 6 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Time breakdown by Stages
          </Typography>
          <Stack spacing={1}>
            {participant.time_in_stages && Object.entries(participant.time_in_stages).map(([stage, time]) => (
              <Stack
                key={stage}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'action.hover',
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify 
                    icon={getStageIcon(stage)} 
                    width={16} 
                    sx={{ color: `${getStageColor(stage)}.main` }}
                  />
                  <Typography variant="caption" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                    {stage.replace('_', ' ')}
                  </Typography>
                </Stack>
                <Typography variant="caption" fontWeight="medium" color="text.secondary">
                  {formatStageTime(time)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};
