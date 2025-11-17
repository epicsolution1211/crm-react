import { useCallback, useState } from 'react';
import { usePopover } from 'src/hooks/use-popover';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { todoApi } from 'src/api/todo';
import { statusOptions } from 'src/sections/dashboard/todo/constants';

export const TaskStatus = ({ onUpdateTodos, mutate, todo, status, canManage = false }) => {
  const popover = usePopover();
  const [loadingStatus, setLoadingStatus] = useState({
    isLoading: false,
    target: null
  });

  const onSelectStatus = useCallback(async (value, target) => {
    if (!canManage) {
      return;
    }

    popover.handleClose();
    if (value === status) {
      return;
    }
    try {
      setLoadingStatus({
        isLoading: true,
        target: target
      });
      const option = statusOptions.find((option) => option.value === value);
      await todoApi.updateToDo(todo.id, { status: option.value });
      await mutate();
      onUpdateTodos(todo.id, { status: option.value });
    } catch (error) {
    } finally {
      setLoadingStatus({
        isLoading: false,
        target: null
      });
    }
  }, [todo, onUpdateTodos, mutate, popover]);

  return (
    <>
      <ButtonGroup
        variant="contained"
        size="small"
        sx={{ width: 'fit-content' }}
      >
        {status !== 'todo' &&
          <Tooltip 
            title={canManage ? `Previous status: ${statusOptions.find((option, index) => index === statusOptions.findIndex((option) => option.value === status) - 1)?.label}` : ''}
          >
            <Button
              size="small"
              onClick={() => onSelectStatus(statusOptions.find((option, index) => index === statusOptions.findIndex((option) => option.value === status) - 1)?.value, 'left')}
              disabled={loadingStatus.isLoading && loadingStatus.target === 'left'}
              color='primary'
              sx={{ px: 0, width: 30, '&.MuiButtonGroup-grouped': { minWidth: 30 }, height: 30, cursor: canManage ? 'pointer' : 'not-allowed' }}
            >
              {loadingStatus.isLoading && loadingStatus.target === 'left' ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="ci:chevron-left" width={20} />}
            </Button>
          </Tooltip>
        }
        <Button
          ref={popover.anchorRef}
          onClick={() => {
            if (canManage) {
              popover.handleToggle();
            }
          }}
          disabled={loadingStatus.isLoading && loadingStatus.target === 'center'}
          startIcon={loadingStatus.isLoading && loadingStatus.target === 'center' ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ px: 1.5, width: 100, height: 30, cursor: canManage ? 'pointer' : 'not-allowed' }}
          size="small"
        >
          {loadingStatus.isLoading && loadingStatus.target === 'center' ? '' : `${statusOptions.find((option) => option.value === status)?.label}`}
        </Button>
        {status !== 'done' &&
          <Tooltip 
            title={canManage ? `Next status: ${statusOptions.find((option, index) => index === statusOptions.findIndex((option) => option.value === status) + 1)?.label}` : ''}
          >
            <Button
              onClick={() => onSelectStatus(statusOptions.find((option, index) => index === statusOptions.findIndex((option) => option.value === status) + 1)?.value, 'right')}
              size="small"
              disabled={loadingStatus.isLoading && loadingStatus.target === 'right'}
              sx={{ px: 0, width: 30, '&.MuiButtonGroup-grouped': { minWidth: 30 }, height: 30, cursor: canManage ? 'pointer' : 'not-allowed' }}
            >
              {loadingStatus.isLoading && loadingStatus.target === 'right' ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="ci:chevron-right" width={20} />}
            </Button>
          </Tooltip>
        }
      </ButtonGroup>
      <Popover
        anchorEl={popover.anchorRef.current}
        disableScrollLock
        onClose={popover.handleClose}
        open={popover.open}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}
        PaperProps={{
          sx: {
            marginTop: 0.2,
            borderColor: 'divider',
            borderWidth: 1,
            borderStyle: 'solid'
          }
        }}
      >
        {statusOptions.map((option) => (
          <Stack
            key={option.value}
            onClick={() => onSelectStatus(option.value, 'center')}
            sx={{ 
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.5,
              cursor: 'pointer', 
              '&:hover': { backgroundColor: 'action.hover' },
              backgroundColor: status === option.value ? 'action.selected' : 'transparent',
              transition: 'background-color 0.1s ease-in-out'
            }}
          >
            <Iconify icon="fa6-regular:circle-dot" sx={{ color: (theme) => theme.palette[option.color].main, width: 16 }}/>
            <Typography sx={{ fontSize: 12 }}>{option.label}</Typography>
          </Stack>
        ))}
      </Popover>
    </>
  );
};
