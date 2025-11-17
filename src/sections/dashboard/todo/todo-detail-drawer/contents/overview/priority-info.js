import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { todoApi } from 'src/api/todo';
import { priorityOptions } from 'src/sections/dashboard/todo/constants';

export const PriorityInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handlePriorityChange = useCallback(async (priority) => {
    if (!canManage) {
      return;
    }

    setLoadingStatus({
      [priority]: true
    });
    try {
      await todoApi.updateToDo(todo.id, { priority });
      await mutate();
      onUpdateTodos(todo.id, { priority });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus({
        [priority]: false
      });
    }
  }, [todo, onUpdateTodos, mutate]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {priorityOptions.map((option) => (
        <Chip
          key={option.value}
          size="small"
          disabled={loadingStatus[option.value]}
          color={todo?.priority === option.value ? option.color : 'default'}
          label={
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" minWidth={option.minWidth}>
              {loadingStatus[option.value] ? <CircularProgress size={16} sx={{ color: 'white' }} /> : option.label}
            </Stack>
            }
          onClick={() => handlePriorityChange(option.value)}
          sx={{
            cursor: canManage ? 'pointer' : 'not-allowed',
            '&:hover': {
              opacity: 0.8
            },
            borderRadius: 1,
          }}
        />
      ))}
    </Stack>
  );
};
