import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';

const NoProvider = ({ isPaymentSystem = false, isGameStudio = false }) => {
  const theme = useTheme();

  if (!theme) {
    return null; // Prevent rendering until theme is available
  }

  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        maxWidth: 1,
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: theme.palette.primary.lighter ? alpha(theme.palette.primary.lighter, 0.1) : 'transparent',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            left: -20,
            right: -20,
            bottom: -20,
            background: theme.palette.primary.main ? 
              `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)` : 
              'transparent',
            animation: 'pulse 2s infinite'
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.95)',
              opacity: 0.8
            },
            '50%': {
              transform: 'scale(1)',
              opacity: 0.5
            },
            '100%': {
              transform: 'scale(0.95)',
              opacity: 0.8
            }
          }
        }}
      >
        <Icon
          icon="streamline:add-1-remix"
          style={{
            width: '120px',
            height: '120px',
            color: theme.palette.primary.main,
            opacity: 0.8,
            position: 'relative',
            zIndex: 1,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          background: theme.palette.primary.main && theme.palette.primary.dark ?
            `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` :
            'inherit',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {isPaymentSystem ? "No Payment Provider Yet" : isGameStudio ? "No Game Studio Provider Yet" : "No Call Profile Yet"}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
        variant="body1"
      >
        Get started by create your first {isPaymentSystem ? "payment provider" : "call profile"}.
      </Typography>
    </Box>
  );
};

export default NoProvider;
