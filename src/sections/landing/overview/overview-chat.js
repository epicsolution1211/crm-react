import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';

import { ChatThreadItem } from '../internal-chat/chat-thread-item';
import { mockedChatData } from 'src/utils/constant/mock-data';
import { Iconify } from 'src/components/iconify';

export const OverviewChat = () => {
  return (
    <Card>
      <CardHeader
        title="Internal Chat"
        action={(
          <Tooltip title="Reload">
            <IconButton
              color="primary"
            >
              <Iconify 
                icon="solar:refresh-bold-duotone" 
                width={24} 
                sx={{ 
                  '&:hover': { transform: 'rotate(360deg)', transition: 'transform 0.3s' },
                  '&:not(:hover)': { transform: 'rotate(0deg)', transition: 'transform 0.3s' }
                }} 
              />
            </IconButton>
          </Tooltip>
        )}
      />
      <Divider />
      <List disablePadding>
        {mockedChatData.map((chat, index) => (
          <ChatThreadItem
            key={`${chat.id}-chat-${index}`}
            id={`${chat.id}-chat-${index}`}
            thread={chat}
          />
        ))}
      </List>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
          size="small"
        >
          Go to chat
        </Button>
      </CardActions>
    </Card>
  );
};
