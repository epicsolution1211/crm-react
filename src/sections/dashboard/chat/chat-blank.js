import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getAssetPath } from 'src/utils/asset-path';

export const ChatBlank = () => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden'
    }}
  >
    <Box
      component="img"
      src={getAssetPath("/assets/errors/error-404.png")}
      sx={{
        height: 'auto',
        maxWidth: 120
      }}
    />
    <Typography
      color="text.secondary"
      sx={{ mt: 2 }}
      variant="subtitle1"
    >
      Select a ticket to start conversation!
    </Typography>
  </Box>
);
