import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

const TipRoot = styled('div')((({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.neutral[800]
    : theme.palette.neutral[100],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1)
})));

export const Tip = (props) => {
  const { message } = props;

  return (
    <TipRoot>
      <Iconify icon="ri:lightbulb-flash-line" width={20} color="text.secondary" />
      <Typography
        color="text.secondary"
        sx={{
          alignItems: 'center',
          display: 'flex',
          '& span': {
            fontWeight: 700,
            mr: 0.5
          }
        }}
        variant="caption"
      >
        <span>
          Tip.
        </span>
        {' '}
        {message}
      </Typography>
    </TipRoot>
  );
};

Tip.propTypes = {
  message: PropTypes.string.isRequired
};
