import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/system/colorManipulator';

const SIDE_NAV_WIDTH = 280;

export const LandingFooter = ({ isHorizon = false }) => {
  return (
    <Box
      component="footer"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        position: 'fixed',
        bottom: 0 ,
        left: {
          lg: isHorizon ? 1 : `${SIDE_NAV_WIDTH}px`
        },
        width: {
          lg: isHorizon ? 1 : `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          xs: 1,
        },
        px: { md: 4, xs: 2 },
        zIndex: 1000
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        width={1}
        minHeight={48}
        sx={{ justifyContent: { md: "flex-end", xs: "center" }}}
      >
        <Typography variant='subtitle2' color='text.secondary' sx={{ textAlign: { xs: "center", md: "flex-end" } }}>
          © Loriam Holding LTD - 2023
        </Typography>
      </Stack>
    </Box>
  );
};