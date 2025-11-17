import { useState } from "react";
import { toast } from "react-hot-toast";
import { format } from 'date-fns';

import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { Iconify } from "src/components/iconify";
import { todoApi } from "src/api/todo";

export const DueDateInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectedDate, setSelectedDate] = useState(todo?.due_date ? new Date(todo.due_date) : null);

  const handleSave = async (date) => {
    const currentTodo = { ...todo };
    try {
      const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isOverdue = formattedDate ? new Date(formattedDate) < today : false;
      const updatedTodo = { ...todo, due_date: formattedDate, is_overdue: isOverdue, overdue_days: isOverdue ? Math.ceil((today - new Date(formattedDate)) / (1000 * 60 * 60 * 24)) : 0 };
      
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos?.(todo.id, updatedTodo);
      setSelectedDate(updatedTodo.due_date ? new Date(updatedTodo.due_date) : null);
      await todoApi.updateToDo(todo.id, { due_date: formattedDate });
      toast.success('Due date updated successfully');
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos?.(todo.id, currentTodo);
      setSelectedDate(currentTodo.due_date ? new Date(currentTodo.due_date) : null);
      toast.error(err?.response?.data?.message || 'Failed to update due date');
    }
  };

  const handleRemove = async () => {
    setSelectedDate(null);
    const currentTodo = { ...todo };
    try {
      const updatedTodo = { ...todo, due_date: null, is_overdue: false, overdue_days: 0 };
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos?.(todo.id, updatedTodo);
      
      await todoApi.updateToDo(todo.id, { delete_due_date: true });
      toast.success('Due date removed successfully');
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos?.(todo.id, currentTodo);
      setSelectedDate(currentTodo.due_date ? new Date(currentTodo.due_date) : null);
      toast.error(err?.response?.data?.message || 'Failed to remove due date');
    } 
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedDate(todo?.due_date ? new Date(todo.due_date) : null);
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
            {selectedDate ? (
              <Stack direction="row" alignItems="center" columnGap={2} rowGap={1} flexWrap="wrap">
                <Typography variant="caption" color={todo?.is_overdue ? "error.main" : "text.primary"}>
                  {format(selectedDate, "MMM d, yyyy")}
                </Typography>
                {todo?.overdue_days >= 0 && todo?.is_overdue && 
                  (<Chip 
                    size="small" 
                    variant="outlined" 
                    color="error" 
                    label={`${todo.overdue_days} ${todo.overdue_days > 1 ? 'days' : 'day'} overdue`}
                    icon={
                      <Iconify 
                        icon="flowbite:bell-ring-outline" 
                        sx={{ 
                          width: 16, 
                          height: 16,
                          color: 'error.main',
                          flexShrink: 0
                        }}
                      />} 
                    sx={{
                      '& .MuiChip-label': {
                          fontSize: 12,
                      },
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      },
                      px: 0.5,
                      border: '1px solid',
                      borderColor: 'error.main',
                      borderRadius: 1,
                    }}
                  />)}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No due date set</Typography>
            )}
          </Stack>
          {todo?.due_date && canManage && (
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
        onClose={onClose}
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
        <DateCalendar value={selectedDate} 
          onChange={(newValue) => {
            handleSave(newValue)
          }}
          sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }} 
        />
      </Popover>
    </>
  );
};
