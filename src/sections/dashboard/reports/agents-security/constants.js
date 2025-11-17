// Color utility functions
export const getSecurityColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'normal': return 'success';
    case 'warning': return 'warning';
    case 'critical': return 'error';
    default: return 'default';
  }
};

export const getActivityColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'very high': return 'error';
    case 'high': return 'warning';
    case 'moderate': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
};

export const getRiskColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'high risk': return 'error';
    case 'medium risk': return 'warning';
    case 'low risk': return 'success';
    default: return 'default';
  }
};

// Tab indices
export const TABS = {
  OVERVIEW: 0,
  AGENTS: 1,
  SECURITY: 2,
  RECOMMENDATIONS: 3
}; 