import { useMemo } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Iconify } from 'src/components/iconify';

const formatTime = (hours) => {
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  return mins === 0 ? `${wholeHours}h` : `${wholeHours}h ${mins}m`;
};

const STATUS_CONFIG = {
  todo: {
    title: 'Todo',
    color: 'primary.main',
  },
  in_progress: {
    title: 'In Progress',
    color: 'secondary.main',
  },
  done: {
    title: 'Done',
    color: 'success.main',
  },
};

const TimeChip = ({ label, borderColor, showIcon, tooltipTitle }) => (
  <Tooltip title={tooltipTitle || ''}>
    <Chip
      icon={showIcon ? <Iconify icon="line-md:uploading-loop" width={16} sx={{ ml: 1 }} /> : null}
      label={label}
      variant="outlined"
      size="small"
      sx={{
        fontSize: 11,
        borderRadius: 1,
        borderColor,
        '& .MuiChip-icon': { color: borderColor },
        '& .MuiChip-label': {
          px: 0.8
        }
      }}
    />
  </Tooltip>
);

export const TimeTrackingInfo = ({ timeData, totalTimeData, currentStatus }) => {
  const actualTime = useMemo(() => {
    if (!timeData) return formatTime(0);
    return formatTime(
      (timeData.todo || 0) + (timeData.in_progress || 0) + (timeData.done || 0)
    );
  }, [timeData]);

  const totalTime = useMemo(() => {
    if (!totalTimeData) return formatTime(0);
    return formatTime(
      (totalTimeData.todo || 0) + (totalTimeData.in_progress || 0) + (totalTimeData.done || 0)
    );
  }, [totalTimeData]);

  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
      <TimeChip
        label={`Total: ${actualTime}/${totalTime}`}
        borderColor="info.main"
      />
      
      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
        <TimeChip
          key={status}
          label={`${config.title}: ${formatTime(timeData?.[status] || 0)} / ${formatTime(totalTimeData?.[status] || 0)}`}
          borderColor={config.color}
          showIcon={currentStatus === status}
          tooltipTitle={config.title}
        />
      ))}
    </Stack>
  );
};
