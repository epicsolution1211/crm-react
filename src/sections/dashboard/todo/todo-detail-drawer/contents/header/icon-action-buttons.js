import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/hooks/use-auth';
import { todoApi } from 'src/api/todo';

const ACTION_CONFIG = {
  star: {
    property: 'starred',
    color: 'warning',
    icons: {
      active: 'iconamoon:star-fill',
      inactive: 'iconamoon:star-light'
    },
    tooltips: {
      active: 'Unstar',
      inactive: 'Star'
    },
    handler: (todo, value) => todoApi.updateToDo(todo.id, { starred: value })
  },
  pin: {
    property: 'pinned',
    color: 'info',
    icons: {
      active: 'solar:pin-bold',
      inactive: 'solar:pin-linear'
    },
    tooltips: {
      active: 'Unpin',
      inactive: 'Pin'
    },
    handler: (todo, value) => todoApi.updateToDo(todo.id, { pinned: value })
  },
  watch: {
    property: 'watchers',
    color: 'success',
    icons: {
      active: 'solar:eye-linear',
      inactive: 'solar:eye-linear'
    },
    tooltips: {
      active: 'Stop watching',
      inactive: 'Watch this task'
    },
    isActive: (todo, userId) => Array.isArray(todo.watchers) && todo.watchers.some(watcher => watcher.id === userId),
    handler: null 
  },
  archive: {
    property: 'archived',
    color: 'secondary',
    icons: {
      active: 'solar:archive-bold',
      inactive: 'solar:archive-linear'
    },
    tooltips: {
      active: 'Unarchive',
      inactive: 'Archive'
    },
    handler: (todo, value) => todoApi.updateToDo(todo.id, { archived: value })
  }
};

export const IconActionButtons = ({ todo, onUpdateTodos, mutate, canManage = false, onClose = () => {} }) => {
  const { user } = useAuth();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const isCreator = useMemo(() => todo?.creator?.id === user.id, [todo.created_by, user.id]);

  const [isLoadingStatus, setIsLoadingStatus] = useState({
    isLoading: false,
    target: null,
  });

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onUpdateStatus = (target) => {
    setIsLoadingStatus({
      isLoading: !!target,
      target,
    });
  };

  const handleDelete = useCallback(async () => {
    setIsDeleteLoading(true);
    try {
      await todoApi.deleteToDo(todo.id);
      onUpdateTodos(todo.id);
      setTimeout(() => {
        onClose();
        toast.success('Task deleted successfully');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteLoading(false);
    }
  }, [todo, onUpdateTodos, onClose]);

  const handleAction = useCallback(async (actionKey) => {
    const config = ACTION_CONFIG[actionKey];
    if (!config) return;

    onUpdateStatus(actionKey);
    try {
      const isActive = config.isActive ? config.isActive(todo, user.id) : todo[config.property];
      
      if (actionKey === 'watch') {
        if (isActive) {
          await todoApi.removeWatcher(todo.id, { watcher_id: user.id });
        } else {
          await todoApi.addWatcher(todo.id, { watcher_id: user.id });
        }
        mutate();
      } else {
        await config?.handler(todo, !isActive);
        await mutate({ todo: { ...todo, [config.property]: !isActive } }, false);
        onUpdateTodos?.(todo.id, { ...todo, [config.property]: !isActive });
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      onUpdateStatus(null);
    }
  }, [todo, user.id, onUpdateTodos, mutate]);

  const renderActionButton = (actionKey) => {
    const config = ACTION_CONFIG[actionKey];
    const isActive = config.isActive ? config.isActive(todo, user.id) : todo[config.property];
    const isLoading = isLoadingStatus.isLoading && isLoadingStatus.target === actionKey;

    return (
      <Tooltip key={actionKey} title={canManage ? isActive ? config.tooltips.active : config.tooltips.inactive : ''}>
        <IconButton
          onClick={() => {
            if (canManage) {
              handleAction(actionKey);
            }
          }}
          color={isActive ? config.color : 'default'}
          sx={{ 
            p: { xs: 0.5, md: 1 }, 
            minWidth: { xs: 32, md: 42 },
            cursor: canManage ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? (
            <CircularProgress size={mdUp ? 24 : 20} sx={{ color: `${config.color}.main` }}/>
          ) : (
            <Iconify 
              icon={isActive ? config.icons.active : config.icons.inactive} 
              sx={{ width: { xs: 24, md: 26 } }}
            />
          )}
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Stack
      justifyContent="flex-end"
      alignItems="center"
      direction="row"
      sx={{ gap: { xs: 0.5, md: 0.5 } }}
    >
      {Object.keys(ACTION_CONFIG).map(renderActionButton)}
      {isCreator && 
        (<Tooltip title="Delete">
          <IconButton 
            onClick={handleDelete}
            color="error"
            disabled={isDeleteLoading}
            sx={{ 
              p: { xs: 0.5, md: 1 }, 
              minWidth: { xs: 32, md: 42 },
              cursor: 'pointer',
            }}
          >
            {isDeleteLoading ? (
              <CircularProgress size={mdUp ? 24 : 20} sx={{ color: 'error.main' }}/>
            ) : (
              <Iconify 
                icon="fluent:delete-32-regular" 
                sx={{ width: { xs: 24, md: 26 } }}
              />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
