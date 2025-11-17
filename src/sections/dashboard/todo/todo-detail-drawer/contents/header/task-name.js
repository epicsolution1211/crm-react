import { useCallback, useEffect, useState } from 'react';

import Input from '@mui/material/Input';

import { todoApi } from 'src/api/todo';

export const TaskName = ({ todo, onUpdateTodos, mutate }) => {
  const [nameCopy, setNameCopy] = useState(todo?.title || '');

  const handleNameReset = useCallback(() => {
    setNameCopy(todo?.title || '');
  }, [todo]);

  useEffect(() => {
    handleNameReset();
  }, [todo]);

  const handleNameUpdate = useCallback(async (title) => {
    const currentTodo = { ...todo };
    try {
      await todoApi.updateToDo(todo.id, { title });
      await mutate({ todo: { ...currentTodo, title } }, false);
      onUpdateTodos?.(todo.id, { ...currentTodo, title });
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos?.(todo.id, currentTodo);
    }
  }, [todo, onUpdateTodos, mutate]);

  const handleNameBlur = useCallback(() => {
    if (!nameCopy) {
      setNameCopy(todo.title);
      return;
    }

    if (nameCopy === todo.title) {
      return;
    }

    handleNameUpdate(nameCopy);
  }, [todo, nameCopy, handleNameUpdate]);

  const handleNameChange = useCallback((event) => {
    setNameCopy(event.target.value);
  }, []);

  const handleNameKeyUp = useCallback((event) => {
    if (event.code === 'Enter') {
      if (nameCopy && nameCopy !== todo.title) {
        handleNameUpdate(nameCopy);
      }
    }
  }, [todo, nameCopy, handleNameUpdate]);

  return (
    <Input
      variant='standard'
      disableUnderline
      fullWidth
      multiline
      onBlur={handleNameBlur}
      onChange={handleNameChange}
      onKeyUp={handleNameKeyUp}
      placeholder="Task name"
      sx={{
        border: 'none',
        '& .MuiInputBase-input': {
          borderRadius: 1,
          overflow: 'hidden',
          px: 0.5,
          py: 0.5,
          mt: 0.5,
          mb: 0,
          mx: 2,
          fontSize: 18,
          textOverflow: 'ellipsis',
          wordWrap: 'break-word',
          '&:hover, &:focus': {
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.100'
          }
        }
      }}
      value={nameCopy}
    />
  );
};
