import { useCallback, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { useMockedUser } from 'src/hooks/use-mocked-user';

export const ChatMessageAdd = (props) => {
  const { disabled = false, onSend, ...other } = props;
  const user = useMockedUser();
  const [body, setBody] = useState('');

  const handleChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);

  const handleSend = useCallback(() => {
    if (!body) {
      return;
    }

    onSend?.(body);
    setBody('');
  }, [body, onSend]);

  const handleKeyUp = useCallback((event) => {
    if (event.code === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={2}
      sx={{
        px: 3,
        py: 1
      }}
      {...other}>
      <Avatar
        sx={{
          display: {
            xs: 'none',
            sm: 'inline'
          }
        }}
        src={user.avatar}
      />
      <OutlinedInput
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Leave a message"
        size="small"
        value={body}
      />
      <Stack
        direction="row"
        spacing={1}
      >
        <Tooltip title="Send">
          <IconButton>
            <Iconify icon="lucide:send" width={24} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Attach photo">
          <IconButton>
            <Iconify icon="famicons:camera-outline" width={24} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Attach file">
          <IconButton>
            <Iconify icon="streamline-ultimate:attachment" width={24} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
