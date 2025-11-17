import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const STALE_THRESHOLDS = {
  WARNING: 7, // 7 days
  CRITICAL: 14, // 14 days
  PARTICIPANT_INACTIVE: 3, // 3 days
};

export const getStaleStatus = (lastActivityDate) => {
  if (!lastActivityDate) {
    return { isStale: true, severity: 'critical', daysAgo: null };
  }

  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const daysAgo = differenceInDays(now, lastActivity);

  if (daysAgo >= STALE_THRESHOLDS.CRITICAL) {
    return { isStale: true, severity: 'critical', daysAgo };
  }
  
  if (daysAgo >= STALE_THRESHOLDS.WARNING) {
    return { isStale: true, severity: 'warning', daysAgo };
  }

  return { isStale: false, severity: 'normal', daysAgo };
};

export const getParticipantActivityStatus = (participant) => {
  if (!participant || !participant.last_touched_at) {
    return { isInactive: true, severity: 'critical', timeAgo: null };
  }

  const lastActivity = new Date(participant.last_touched_at);
  const now = new Date();
  const daysAgo = differenceInDays(now, lastActivity);
  const hoursAgo = differenceInHours(now, lastActivity);
  const minutesAgo = differenceInMinutes(now, lastActivity);

  let timeAgo;
  if (daysAgo > 0) {
    timeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo > 0) {
    timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (minutesAgo > 0) {
    timeAgo = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else {
    timeAgo = 'Just now';
  }

  if (daysAgo >= STALE_THRESHOLDS.PARTICIPANT_INACTIVE) {
    return { isInactive: true, severity: 'critical', timeAgo };
  }
  
  if (daysAgo >= 1) {
    return { isInactive: true, severity: 'warning', timeAgo };
  }

  return { isInactive: false, severity: 'normal', timeAgo };
};

export const getLastActivityText = (lastActivityDate) => {
  if (!lastActivityDate) {
    return 'No activity recorded';
  }

  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const daysAgo = differenceInDays(now, lastActivity);
  const hoursAgo = differenceInHours(now, lastActivity);
  const minutesAgo = differenceInMinutes(now, lastActivity);

  if (daysAgo > 0) {
    return `Last activity: ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo > 0) {
    return `Last activity: ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (minutesAgo > 0) {
    return `Last activity: ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else {
    return 'Last activity: Just now';
  }
};

export const getStaleColor = (severity) => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStaleIcon = (severity) => {
  switch (severity) {
    case 'critical':
      return 'solar:bell-bold';
    case 'warning':
      return 'solar:bell-linear';
    default:
      return 'solar:bell-linear';
  }
}; 