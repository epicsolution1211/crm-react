import Chip from '@mui/material/Chip';
import { Iconify } from "src/components/iconify";

export const FilterChip = ({
  icon,
  label,
  isSelected,
  color = 'default',
  onClick,
  iconWidth = 18,
}) => {
  return (
    <Chip
      icon={typeof icon === 'string' ? <Iconify icon={icon} width={iconWidth} /> : icon}
      label={label}
      variant={isSelected ? 'filled' : 'outlined'}
      color={isSelected ? color : 'default'}
      onClick={onClick}
      sx={{
        borderRadius: 1,
        '&:hover': {
          backgroundColor: isSelected ? `${color}.dark` : 'action.hover'
        },
        '& .MuiChip-icon': {
          color: isSelected ? 'text.primary' : `${color}.main`,
        }
      }}
    />
  );
}; 