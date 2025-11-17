import { useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Iconify } from "src/components/iconify";
import { todoApi } from "src/api/todo";
import { useTimezone } from "src/hooks/use-timezone";

export const ReminderInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const { toUTCTime, toLocalTime, combineDate } = useTimezone();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [date, setDate] = useState(todo?.reminder_time ? new Date(todo.reminder_time) : null);
  const [time, setTime] = useState(todo?.reminder_time ? new Date(todo.reminder_time) : null);
  const [initialDate, setInitialDate] = useState(null);
  const [initialTime, setInitialTime] = useState(null);

  useEffect(() => {
    if (todo?.reminder_time) {
      const localDateTime = toLocalTime(todo?.reminder_time);
      const date = new Date(localDateTime);
      setDate(date);
      setTime(date);
    }
  }, [todo?.reminder_time]);

  const handleSave = async (date) => {
    const currentTodo = { ...todo };
    try {
      const utcDateTime = toUTCTime(date);
      const updatedTodo = { ...todo, reminder_time: utcDateTime };
      
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos?.(todo.id, updatedTodo);
      await todoApi.updateToDo(todo.id, { reminder_time: utcDateTime });
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos?.(todo.id, currentTodo);
      setDate(currentTodo.reminder_time ? new Date(currentTodo.reminder_time) : null);
      console.error(err);
    }
  };

  const handleRemove = async () => {
    setDate(null);
    const currentTodo = { ...todo };
    try {
      const updatedTodo = { ...todo, reminder_time: null };
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos?.(todo.id, updatedTodo);
      
      await todoApi.updateToDo(todo.id, { delete_reminder: true });
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos?.(todo.id, currentTodo);
      setDate(currentTodo.reminder_time ? new Date(currentTodo.reminder_time) : null);
      console.error(err);
    } 
  };

  const onClosePopover = () => {
    const hasDateChanged = date?.getTime() !== initialDate?.getTime();
    const hasTimeChanged = time?.getTime() !== initialTime?.getTime();

    if (hasDateChanged || hasTimeChanged) {
      const newTime = combineDate(date, time);
      handleSave(newTime);
    }
    setAnchorEl(null);
  };

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (todo?.reminder_time) {
      const localDateTime = toLocalTime(todo?.reminder_time);
      const date = new Date(localDateTime);
      setDate(date);
      setTime(date);
      setInitialDate(date);
      setInitialTime(date);
    } else {
      setDate(new Date());
      setTime(new Date());
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 1 }}>
        <Stack 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minHeight: 32,
            p: 0.5,
            ml: -0.5,
            my: -0.5,
            borderRadius: 1,
            width: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            cursor: canManage ? 'pointer' : 'default',
            '&:hover': { bgcolor: canManage ? 'action.hover' : 'transparent' }
          }}
          onClick={(event) => {
            if (canManage) {
              onOpen(event);
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {todo?.reminder_time ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" color="text.primary">
                  {toLocalTime(todo?.reminder_time, 'MMM d, yyyy h:mm a')}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No reminder set</Typography>
            )}
          </Stack>
          {todo?.reminder_time && canManage && (
            <Tooltip title="Remove">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                sx={{ 
                  p: 0.5, 
                  m: 0,
                  '&:hover': { 
                    bgcolor: 'action.hover', 
                    color: 'text.secondary' 
                  } 
                }}
              >
                <Iconify icon="pajamas:close" width={18} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClosePopover}
        onClick={(event) => {
          event.stopPropagation();
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Stack sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <DateCalendar
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
            }}
          />
          <Stack sx={{ width: 1, px: 2.5, pb: 1.5, mt: -1 }}>
            <TimePicker
              slotProps={{
                textField: {
                  sx: { width: 1 },
                  hiddenLabel: true,
                  size: 'small',
                }
              }}
              value={time}
              onChange={(newValue) => {
                setTime(newValue);
              }}
              sx={{ width : 1 }} />
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};
