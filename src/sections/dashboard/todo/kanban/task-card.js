import React from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from "src/components/iconify";
import { getAPIUrl } from "src/config";
import { generateAvatarColors } from 'src/utils/functions';

export const TaskCard = ({ 
  item, 
  provided, 
  snapshot, 
  onClick 
}) => {
  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      elevation={snapshot.isDragging ? 8 : 1}
      onClick={onClick}
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'neutral.800'
          : 'neutral.50',
        ...(snapshot.isDragging && {
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'background.paper'
        }),
        p: 2,
        pb: 2,
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.700'
            : 'neutral.100'
        },
        '&.MuiPaper-elevation1': {
          boxShadow: 1
        },
        position: 'relative',
        border: '1px dotted',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="flex-end"
        gap={0.5}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10
        }}
      >
        {item.starred && (
          <Iconify icon="iconamoon:star-fill" width={18} sx={{ color: 'warning.main', flexShrink: 0 }} />
        )}
        {item.pinned && (
          <Iconify icon="solar:pin-bold" width={21} sx={{ color: 'info.main' }} />
        )}
      </Stack>
      <Stack direction="row" gap={0.5} alignItems="center">
        <Typography 
          variant="subtitle2" 
          fontWeight={600} 
          sx={{ 
            alignItems: 'center', 
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            mr: 4
        }}>
          {item.title}
        </Typography>
      </Stack>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis'
        }}
      >
        {item.description}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ my: 0.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: item.priority === 'high' ? 'error.main' : item.priority === 'medium' ? 'warning.main' : 'success.main',
            gap: 0.2,
            textTransform: 'capitalize'
          }}
        >
          <Iconify icon="typcn:flag" width={24} />
          {item.priority}
        </Typography>
      </Stack>
      {Array.isArray(item.labels) && item.labels.length > 0 && (
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {item.labels.map((label, index) => {
            const labelData = typeof label === 'object' ? label : { name: label, color: '#1976d2' };
            return (
              <Chip
                key={labelData.id || index}
                label={labelData.name}
                size="small"
                sx={{
                  backgroundColor: labelData.color,
                  color: '#fff',
                  '& .MuiChip-label': {
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }
                }} />
            );
          })}
        </Stack>
      )}
      <Stack direction="row" pt={1} gap={0.5} alignItems="center" justifyContent="space-between">
        <Stack direction="row" gap={1} alignItems="center" justifyContent="flex-start">
          <Stack direction="row" gap={0.5} alignItems="center">
            <Iconify icon="iconamoon:comment-dots-light" width={18} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={400}>{item?.comments_count ?? 0}</Typography>
          </Stack>
          {item?.is_overdue && (
            <Stack direction="row" gap={0.5} alignItems="center">
              <Iconify icon="flowbite:bell-ring-outline" width={18} sx={{ color: 'error.main' }} />
              <Typography variant="caption" color='error.main' fontWeight={400}>{item?.overdue_days ?? 0} {item?.overdue_days > 1 ? 'days' : 'day'}</Typography>
            </Stack>
          )}
        </Stack>

        <AvatarGroup max={3} 
          sx={{ 
            '& .MuiAvatar-root': { border: '1px solid', borderColor: 'divider' },
            '& .MuiAvatar-root:hover': {
              opacity: 0.9
            },
            '& .MuiAvatar-circular': {
              width: 24,
              height: 24,
              fontSize: 12,
            }
          }}>
          {item?.participants?.length > 0 ? item?.participants?.map((participant) => {
            const { bgcolor, color } = generateAvatarColors(participant?.name);
            return (
              <Tooltip key={participant.id} title={participant.name}>
                <Avatar
                  src={participant.avatar ? `${getAPIUrl()}/${participant.avatar}` : undefined}
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: 12,
                    cursor: 'pointer',
                    bgcolor: bgcolor,
                    color: color,
                  }}
                >
                  {participant.name?.split(' ').slice(0,2).map(name => name?.charAt(0))?.join('')}
                </Avatar>
              </Tooltip>
            );
          }) : []}
        </AvatarGroup>
      </Stack>
    </Paper>
  );
};

