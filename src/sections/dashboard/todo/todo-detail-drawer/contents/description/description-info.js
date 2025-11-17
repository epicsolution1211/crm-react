import { useCallback, useEffect, useState } from 'react';

import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { todoApi } from 'src/api/todo';

export const DescriptionInfo = ({ todo, mutate, onUpdateTodos, canManage = false }) => {
  const [descriptionCopy, setDescriptionCopy] = useState(todo?.description || '');

  const handleDescriptionUpdate = useCallback(async (description) => {
    const currentTodo = { ...todo };
    try {
      await todoApi.updateToDo(todo.id, { description });
      await mutate({ todo: { ...currentTodo, description } }, false);
      onUpdateTodos(todo.id, { ...currentTodo, description });
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos(todo.id, currentTodo);
    }
  }, [todo, mutate, onUpdateTodos]);

  const handleDescriptionChange = useCallback((event) => {
    if (!canManage) {
      return;
    }

    setDescriptionCopy(event.target.value);
  }, [canManage]);

  const handleDescriptionBlur = useCallback(() => {
    if (!canManage) {
      return;
    }

    if (!descriptionCopy) {
      setDescriptionCopy(todo.description || '');
      return;
    }

    if (descriptionCopy === todo.description) {
      return;
    }

    handleDescriptionUpdate(descriptionCopy);
  }, [todo, descriptionCopy, handleDescriptionUpdate, canManage]);


  const handleDescriptionKeyUp = useCallback((event) => {
    if (!canManage) {
      return;
    }

    if (event.code === 'Enter' && !event.shiftKey) {
      if (descriptionCopy && descriptionCopy !== todo.description) {
        handleDescriptionUpdate(descriptionCopy);
      }
    }
  }, [todo, descriptionCopy, handleDescriptionUpdate]);

  const handleDescriptionReset = useCallback(() => {
    if (!canManage) {
      return;
    }

    setDescriptionCopy(todo?.description || '');
  }, [todo, canManage]);

  useEffect(() => {
    handleDescriptionReset();
  }, [todo]);

  return (
    <Stack direction="column" gap={1}>
      <Stack direction="row" alignItems="center" gap={0.8} px={0.5}>
        <Iconify icon="fluent:task-list-24-filled" width={16} sx={{ color: 'text.secondary' }} />
        <Typography
          color="text.secondary"
          variant="caption"
        >
          Description
        </Typography>
      </Stack>
      <Input
        fullWidth
        multiline
        disableUnderline
        value={descriptionCopy}
        onBlur={ handleDescriptionBlur}
        onChange={handleDescriptionChange}
        onKeyUp={handleDescriptionKeyUp}
        placeholder="Leave a message"
        sx={{
          borderColor: 'divider',
          borderRadius: 1,
          borderStyle: 'solid',
          borderWidth: 1,
          minHeight: 140,
          alignItems: 'flex-start',
          p: 1,
          '&:hover, &:focus': {
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.100',
            borderColor: 'primary.main',
          },
        }}
      />
    </Stack>
  );
};
