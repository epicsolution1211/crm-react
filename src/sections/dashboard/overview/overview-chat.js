import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { thunks } from 'src/thunks/internal_chat';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { ChatThreadItem } from '../internal-chat/chat-thread-item';
import { Iconify } from 'src/components/iconify';
import { getAssetPath } from 'src/utils/asset-path';

const useInternalChats = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.internal_chat.chats);
  const agentIds = useSelector(state => state.contact_list.ids);
  const isPending = useSelector(state => state.internal_chat.isPending);

  const handleChatsGet = () => dispatch(thunks.getInternalChat({ account_ids: agentIds ?? [], per_page: 5 }));
  useEffect(() => {
    handleChatsGet();
  }, []);

  return {
    chats: chats?.conversations, handleChatsGet, isPending
  };
};

export const OverviewChat = () => {
  const { chats, handleChatsGet, isPending } = useInternalChats();
  const router = useRouter();

  const handleConversationSelect = useCallback(
    (conversationId, token) => {
      router.push(
        paths.dashboard.internalChat +
        `?conversationId=${conversationId}` +
        `&token=${token}`
      );
    },
    [router]
  );

  return (
    <Card>
      <CardHeader
        title="Internal Chat"
        action={(
          <Tooltip title="Reload">
            <IconButton
              onClick={() => handleChatsGet()}
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
        {isPending ?
          [...new Array(5).keys()].map((item) => (
            <ListItem key={item} divider>
              <Stack
                direction='row'
                sx={{ width: 1 }}
                spacing={2}
                alignItems='center'
                justifyContent="center">
                <Skeleton
                  width={45}
                  height={45}
                  sx={{ minWidth: 45 }}
                  variant='circular' />
                <Skeleton
                  sx={{ height: 50, width: 280 }}
                  variant='rounded' />
                <Skeleton
                  sx={{ height: 50, width: "30%" }}
                  variant='rounded' />
              </Stack>
            </ListItem>
          ))
          :
          (chats?.map((chat, index) => (
            <ChatThreadItem
              key={`${chat.id}-chat-${index}`}
              id={`${chat.id}-chat-${index}`}
              thread={chat}
              onSelect={() => {
                handleConversationSelect(
                  chat?.id,
                  chat?.token
                );
              }}
            />
          )))}
      </List>
      {(!isPending && !chats?.length) &&
        <>
          <Divider />
          <Box
            sx={{
              py: 8,
              maxWidth: 1,
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
                maxWidth: 120,
              }}
            />
            <Typography
              color="text.secondary"
              sx={{ mt: 2 }}
              variant="subtitle1"
            >
              No conversation.
            </Typography>
          </Box>
        </>}
      <Divider />
      <CardActions>
        <Button
          onClick={() => router.push(paths.dashboard.internalChat)}
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
