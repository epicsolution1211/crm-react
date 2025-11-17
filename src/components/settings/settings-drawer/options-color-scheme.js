import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';

const options = [
  {
    label: 'Light',
    value: 'light',
    icon: (
      <Iconify icon="mynaui:sun" width={20} />
    )
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: (
      <Iconify icon="basil:moon-outline" width={20} />
    )
  }
];

export const OptionsColorScheme = (props) => {
  const { onChange, value } = props;

  return (
    <Stack spacing={1}>
      <Typography
        color="text.secondary"
        variant="overline"
      >
        Color Scheme
      </Typography>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
      >
        {options.map((option) => (
          <Chip
            icon={option.icon}
            key={option.value}
            label={option.label}
            onClick={() => onChange?.(option.value)}
            sx={{
              borderColor: 'transparent',
              borderRadius: 1.5,
              borderStyle: 'solid',
              borderWidth: 2,
              ...(option.value === value && {
                borderColor: 'primary.main'
              })
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

OptionsColorScheme.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['light', 'dark'])
};
