import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import { useSettings } from "src/hooks/use-settings";
import { Logo } from '../../logos/logo';
import { getAPIUrl } from 'src/config';

export const OptionsLayout = (props) => {
  const { onChange, value } = props;
  const settings = useSettings();
  const avatar = useSelector(state => state.companies.avatar);

  const options = [
    {
      label: 'Vertical',
      value: 'vertical',
      icon: (
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto'
          }}
        >
          <Box
            sx={{
              borderRightColor: (theme) => theme.palette.mode === 'dark'
                ? 'neutral.500'
                : 'neutral.300',
              borderRightStyle: 'dashed',
              borderRightWidth: 1,
              px: 1,
              py: 0.5
            }}
          >
            <Stack spacing={1}>
              {avatar ?
                <img
                  src={avatar ? avatar?.includes('http') ? avatar : `${getAPIUrl()}/${avatar}` : ""}
                  alt="Company logo"
                  loading="lazy"
                  style={{ height: 12, width: 12, objectFit: "fill", backgroundColor: "9BA4B5" }}
                />
                :
                <SvgIcon sx={{ height: 12, width: 12 }}>
                  <Logo color={settings?.colorPreset} />
                </SvgIcon>}
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: '2px',
                  height: 4,
                  width: 26
                }}
              />
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.600'
                    : 'neutral.300',
                  borderRadius: '2px',
                  height: 4,
                  width: 26
                }}
              />
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.600'
                    : 'neutral.300',
                  borderRadius: '2px',
                  height: 4,
                  width: 26
                }}
              />
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              p: 1
            }}
          >
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'neutral.800'
                  : 'neutral.50',
                borderColor: (theme) => theme.palette.mode === 'dark'
                  ? 'neutral.500'
                  : 'neutral.300',
                borderRadius: 1,
                borderStyle: 'dashed',
                borderWidth: 1,
                flex: '1 1 auto'
              }}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Horizontal',
      value: 'horizontal',
      icon: (
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              borderBottomColor: (theme) => theme.palette.mode === 'dark'
                ? 'neutral.500'
                : 'neutral.300',
              borderBottomStyle: 'dashed',
              borderBottomWidth: 1,
              px: 1
            }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
            >
              {avatar ?
                <img
                  src={avatar ? avatar?.includes('http') ? avatar : `${getAPIUrl()}/${avatar}` : ""}
                  alt="Company logo"
                  loading="lazy"
                  style={{ height: 12, width: 12, objectFit: "fill", backgroundColor: "9BA4B5" }}
                />
                :
                <SvgIcon sx={{ height: 12, width: 12 }}>
                  <Logo color={settings?.colorPreset} />
                </SvgIcon>}
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: '2px',
                  height: 4,
                  width: 16
                }}
              />
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.600'
                    : 'neutral.300',
                  borderRadius: '2px',
                  height: 4,
                  width: 16
                }}
              />
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.600'
                    : 'neutral.300',
                  borderRadius: '2px',
                  height: 4,
                  width: 16
                }}
              />
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              p: 1
            }}
          >
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'neutral.800'
                  : 'neutral.50',
                borderColor: (theme) => theme.palette.mode === 'dark'
                  ? 'neutral.500'
                  : 'neutral.300',
                borderRadius: 1,
                borderStyle: 'dashed',
                borderWidth: 1,
                flex: '1 1 auto'
              }}
            />
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Stack spacing={1}>
      <Typography
        color="text.secondary"
        variant="overline"
      >
        Layout
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(2, minmax(0, 140px))'
        }}
      >
        {options.map((option) => (
          <Stack
            key={option.value}
            spacing={1}
          >
            <Box
              onClick={() => onChange?.(option.value)}
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'neutral.900'
                  : 'background.paper',
                borderColor: 'divider',
                borderRadius: 1,
                borderStyle: 'solid',
                borderWidth: 2,
                cursor: 'pointer',
                display: 'flex',
                height: 88,
                ...(option.value === value && {
                  borderColor: 'primary.main'
                })
              }}
            >
              {option.icon}
            </Box>
            <Typography
              align="center"
              sx={{ fontWight: 500 }}
              variant="body2"
            >
              {option.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
};

OptionsLayout.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['horizontal', 'vertical'])
};
