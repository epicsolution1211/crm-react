import { useMemo } from 'react';
import Stack from '@mui/material/Stack';

import { AiInsightInfo } from './ai-insight-info';
import { DescriptionInfo } from './description-info';
import { useAuth } from 'src/hooks/use-auth';

export const TaskContentDescription = ({ todo, mutate, onUpdateTodos, isTicket }) => {
  const { user } = useAuth();
  
  const canManage = useMemo(() => {
    return (todo?.creator?.id === user.id || (Array.isArray(todo?.participants) && todo?.participants.some(participant => participant.id === user.id)));
  }, [todo?.creator?.id, todo?.participants, user.id]);

  return (
    <Stack direction="column" gap={1}>
      <DescriptionInfo 
        todo={todo}
        mutate={mutate}
        onUpdateTodos={onUpdateTodos}
        canManage={canManage}
      />
      <AiInsightInfo 
        todo={todo}
        mutate={mutate}
        canManage={canManage}
        isTicket={isTicket}
      />
    </Stack>
  );
};
