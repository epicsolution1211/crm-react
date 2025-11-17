import Stack from '@mui/material/Stack';

import { ChatMessage } from './chat-message';

export const ChatMessages = ({ messages }) => {
  return (
    <Stack
      spacing={2}
      sx={{ p: 3 }}
    >
      {messages.map((message) => (
        <ChatMessage
          authorAvatar={message.author.avatar}
          authorName={message.author.name}
          body={message.msg.body}
          contentType={message.msg.contentType}
          createdAt={message.msg.createdAt}
          key={message.msg.id}
          position={message.author.isUser ? 'right' : 'left'} />
      ))}
    </Stack>
  );
};
