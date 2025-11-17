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

export const getHealthColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};