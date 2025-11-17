import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { useTimezone } from "src/hooks/use-timezone";

export const DashboardCard = ({ dashboard, onEdit, onDelete, onView }) => {
  const { toLocalTime } = useTimezone();

  const cardCount = dashboard.config?.cards?.length || 0;
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px dashed',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 4,
          borderColor: 'primary.main',
        },
      }}
      onClick={() => onView(dashboard)}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar
            sx={{
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              width: 48,
              height: 48,
            }}
          >
            <Iconify icon="ic:round-dashboard" width={24} />
          </Avatar>
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(dashboard);
                }}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'primary.main',
                  },
                }}
              >
                <Iconify icon="fluent:edit-32-regular" width={22} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dashboard);
                }}
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'error.main',
                  },
                }}
              >
                <Iconify icon="heroicons:trash" width={22} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {dashboard?.title ?? ""}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {dashboard.description}
        </Typography>

        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="lsicon:setting-outline" width={16} />
            <Typography variant="caption" color="text.secondary">
              ID: {dashboard.metabase_dashboard_id}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="ri:eye-line" width={16} />
            <Typography variant="caption" color="text.secondary">
              {cardCount} card{cardCount !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="akar-icons:clock" width={16} />
            <Typography variant="caption" color="text.secondary">
              Updated: {toLocalTime(dashboard.updated_at, "MMM d, yyyy h:mm a")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}; 