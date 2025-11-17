import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Iconify } from 'src/components/iconify';

export const ChatSidebarSearch = forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      sx={{ p: 2, pt: 1 }}
      {...props}>
      <OutlinedInput
        fullWidth
        placeholder="Search support chats"
        startAdornment={(
          <InputAdornment position="start">
            <Iconify icon="lucide:search" color="text.secondary" width={24} />
          </InputAdornment>
        )}
      />
    </Box>
  );
});
