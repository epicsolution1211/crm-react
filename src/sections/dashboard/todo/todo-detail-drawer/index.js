import { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetTodo } from 'src/hooks/swr/use-todo';
import { Iconify } from 'src/components/iconify';
import { TaskContentAttachments } from './contents/attachments';
import { TaskContentComments } from './contents/comments';
import { TaskContentDescription } from './contents/description';
import { TaskContentHeader } from './contents/header';
import { TaskContentOverview } from './contents/overview';
import { TaskContentParticipants } from './contents/participants';
import { TaskContentWatchers } from './contents/watchers';
import { TaskTabs, TaskDrawerWrapper } from './contents/common';

export const SimpleTaskDrawer = ({ taskId, onClose, open = false, onUpdateTodos, isTicket = false }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const { todo, isLoading, mutate: mutateTask } = useGetTodo(taskId, { ticket_system: isTicket ? true : false });

  if (isLoading) {
    return (
      <TaskDrawerWrapper
        onClose={onClose}
        open={open}
      >
        <Stack sx={{ p: 3, justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: 'primary.main' }}/>
          <Typography>Loading...</Typography>
        </Stack>
      </TaskDrawerWrapper>
    );
  }

  return (
    <TaskDrawerWrapper
      onClose={onClose}
      open={open}
    >
      <IconButton 
        onClick={onClose} 
        sx={{ 
          display: { xs: 'flex', md: 'flex' },
          position: 'absolute',
          right: { xs: 8, md: 14 },
          top: { xs: 8, md: 14 },
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}>
        <Iconify icon="mingcute:close-line" width={20} height={20} />
      </IconButton>

      <TaskContentHeader todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutateTask} onClose={onClose}/>
      
      <TaskTabs todo={todo} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <Divider />
      
      <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, overflow: 'auto' }}>
        {currentTab === 'description' && (
          <TaskContentDescription todo={todo} mutate={mutateTask} onUpdateTodos={onUpdateTodos} isTicket={isTicket} />
        )}
        {currentTab === 'overview' && (
          <TaskContentOverview todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutateTask} isTicket={isTicket} />
        )}
        {currentTab === 'attachments' && (
          <TaskContentAttachments todo={todo} mutate={mutateTask} />
        )}
        {currentTab === 'participants' && (
          <Stack direction="column" gap={3}>
            <TaskContentParticipants todo={todo} />
            {todo?.watchers?.length > 0 && <TaskContentWatchers todo={todo} />}
          </Stack>
        )}
        {currentTab === 'comments' && (
          <TaskContentComments todo={todo} />
        )}
      </Box>
    </TaskDrawerWrapper>
  );
};
