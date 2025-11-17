import { useMemo } from 'react';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { getStaleStatus, getStaleColor, getStaleIcon, getLastActivityText, getParticipantActivityStatus } from 'src/utils/stale-detection';

// TODO: Need to update according to stale_days and stale_info

export const StalesInfo = ({ todo }) => {
  const staleStatus = useMemo(() => getStaleStatus(todo?.updated_at), [todo?.updated_at]);

  const color = useMemo(() => getStaleColor(staleStatus.severity), [staleStatus.severity]);
  const icon = useMemo(() => getStaleIcon(staleStatus.severity), [staleStatus.severity]); 
  const lastActivityText = useMemo(() => getLastActivityText(todo?.updated_at), [todo?.updated_at]);

  const todoStaleStatus = useMemo(() => getStaleStatus(todo?.updated_at), [todo?.updated_at]);
  
  const participants = useMemo(() => Array.isArray(todo.participants) ? todo.participants : [], [todo.participants]);
  const watchers = useMemo(() => Array.isArray(todo.watchers) ? todo.watchers : [], [todo.watchers]);
  
  const allMembers = useMemo(() => [...participants, ...watchers], [participants, watchers]);
  const inactiveMembers = useMemo(() => allMembers.filter(member => {
    if (!member || !member.id) return false;
    const activityStatus = getParticipantActivityStatus(member);
    return activityStatus.isInactive;
  }), [allMembers]);

  const criticalInactive = useMemo(() => inactiveMembers.filter(member => {
    const activityStatus = getParticipantActivityStatus(member);
    return activityStatus.severity === 'critical';
  }), [inactiveMembers]);

  const warningInactive = useMemo(() => inactiveMembers.filter(member => {
    const activityStatus = getParticipantActivityStatus(member);
    return activityStatus.severity === 'warning';
  }), [inactiveMembers]);

  if (!todoStaleStatus.isStale && inactiveMembers.length === 0) {
    return null;
  }

  return (
    <>
      {staleStatus?.isStale && 
        <Tooltip title={lastActivityText}>
          <Chip
            icon={<Iconify icon={icon} sx={{ width: 16, height: 16 }} />}
            label={`Stale - ${staleStatus.daysAgo} days`}
            color={color}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-icon': {
                color: 'inherit'
              },
              p: 0.5
            }}
          />
        </Tooltip>
      }

      {todoStaleStatus?.isStale && (
        <Tooltip title={`Task has been inactive for ${todoStaleStatus?.daysAgo ?? 0} days`}>
          <Chip
            icon={<Iconify icon={getStaleIcon(todoStaleStatus.severity)} sx={{ width: 16, height: 16 }}/>}
            label={`Task Stale (${todoStaleStatus.daysAgo ?? 0}d)`}
            color={getStaleColor(todoStaleStatus.severity)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-icon': {
                color: 'inherit'
              },
              p: 0.5
            }}
          />
        </Tooltip>
      )}
        
      {criticalInactive?.length > 0  && (
        <Tooltip title={`${criticalInactive?.length ?? 0} member(s) inactive for 3+ days`}>
          <Chip
            icon={<Iconify icon="solar:user-block-linear" sx={{ width: 16, height: 16 }} />}
            label={`${criticalInactive?.length ?? 0} Critical Inactive`}
            color="error"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-icon': {
                color: 'inherit'
              },
              p: 0.5
            }}
          />
        </Tooltip>
      )}
      
      {warningInactive?.length > 0 && (
        <Tooltip title={`${warningInactive?.length ?? 0} member(s) inactive for 1+ days`}>
          <Chip
            icon={<Iconify icon="solar:user-block-linear" sx={{ width: 16, height: 16 }}/>}
            label={`${warningInactive?.length ?? 0} Warning Inactive`}
            color="warning"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-icon': {
                color: 'inherit'
              },
              p: 0.5
            }}
          />
        </Tooltip>
      )}
      
      {inactiveMembers?.length > 0 && (
        <Chip
          label={`${inactiveMembers?.length ?? 0}/${allMembers?.length ?? 0} Inactive`}
          color="default"
          variant="outlined"
          size="small"
        />
      )}
    </>
  );
};
