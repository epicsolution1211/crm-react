import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/system/colorManipulator';

import { LanguageSwitch } from '../language-switch';
import { useRouter } from 'src/hooks/use-router';
import { Iconify } from 'src/components/iconify';

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
  const { onMobileNavOpen, ...other } = props;
  const router = useRouter();
  const mdUP = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        position: 'sticky',
        left: {
          lg: `${SIDE_NAV_WIDTH}px`
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
        },
        px: { md: 4, xs: 2 },
        zIndex: 1100
      }}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          py: 2,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!mdUP && (
            <IconButton onClick={onMobileNavOpen}>
              <Iconify icon="lucide:menu" width={24} height={24} />
            </IconButton>
          )}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <LanguageSwitch />
          <Button
            variant='contained'
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() => router.push('/contact_us')}>Contact Us</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func
};
