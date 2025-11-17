import { useMemo } from 'react';
import Stack from '@mui/material/Stack';

import { IconActionButtons } from './icon-action-buttons';
import { TaskStatus } from './task-status';
import { TaskName } from './task-name';
import { useAuth } from 'src/hooks/use-auth';

export const TaskContentHeader = ({ todo, onUpdateTodos, mutate, onClose }) => {
  const { user } = useAuth();
  
  const canManage = useMemo(() => {
    return (todo?.creator?.id === user.id || (Array.isArray(todo?.participants) && todo?.participants.some(participant => participant.id === user.id)));
  }, [todo?.creator?.id, todo?.participants, user.id]);

  return (
    <Stack flexDirection='column'>
      <Stack
        alignItems='center'
        direction='row'
        justifyContent={{
          xs: 'start',
          md: 'start'
        }}
        sx={{ pt: { xs: 5, md: 3 }, pb: 0.5, px: 2, gap: { xs: 2, md: 2 } }}
      >
        <TaskStatus
          todo={todo}
          onUpdateTodos={onUpdateTodos}
          mutate={mutate}
          status={todo.status}
          canManage={canManage}
        />
        <IconActionButtons todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} onClose={onClose} />
      </Stack>
      <TaskName todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} />
    </Stack>
  );
};
