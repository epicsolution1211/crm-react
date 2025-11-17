import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/system/colorManipulator';
import { Iconify } from 'src/components/iconify';

// Lazy load AISupport
const AISupport = lazy(() => import('../ai-support.js/ai-support').then(module => ({ default: module.AISupport })));

import { AccountButton } from '../account-button';
import { RemindersButton } from '../reminders-button';
import { LanguageSwitch } from '../../main/language-switch';
import { Autodial } from 'src/layouts/main/autodial';
import { NotificationsButton } from '../notifications-button';

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
  const { onMobileNavOpen, ...other } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

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
        zIndex: 1200,
        py: 0.5
      }}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <Iconify icon="lucide:menu" width={24} height={24} />
            </IconButton>
          )}
          {mdUp && (
            <Suspense fallback={null}>
              <AISupport />
            </Suspense>
          )}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Autodial />
          <LanguageSwitch />
          <RemindersButton />
          <NotificationsButton />
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func
};
