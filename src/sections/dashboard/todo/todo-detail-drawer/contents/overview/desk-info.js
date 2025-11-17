import { useCallback, useState, useMemo } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { Iconify } from "src/components/iconify";
import { todoApi } from "src/api/todo";
import { useAuth } from "src/hooks/use-auth";
import { useGetDesks } from "src/hooks/swr/use-settings";

export const DeskInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});

  const { desks, isLoading: isLoadingDesks } = useGetDesks({});

  const isCreator = useMemo(() => todo?.creator?.id === user.id, [todo.created_by, user.id]);

  const filteredDesks = useMemo(() => {
    return desks?.filter((desk) => {
      const matchesSearch = desk.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && desk.id !== todo?.creator?.id;
    }).map(desk => ({
      ...desk,
      isDesk: todo?.desks?.some(d => d.id === desk.id)
    }));
  }, [desks, searchQuery, todo]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const open = Boolean(anchorEl);

  const handleUpdateDesk = useCallback(async (desk, isDesk) => {
    setLoadingStatus(prev => ({
      ...prev,
      [desk.id]: true,
      loading: true
    }));
    
    try {
      if (isDesk) {
        const updatedTodo = { ...todo, desks: todo?.desks?.filter((d) => d.id !== desk.id) };
        mutate({ todo: updatedTodo }, false);
        onUpdateTodos(todo.id, updatedTodo, false);
        await todoApi.removeDesk(todo.id, { desk_id: desk.id });
      } else {
        const updatedTodo = { ...todo, desks: [...todo?.desks, desk] };
        mutate({ todo: updatedTodo }, false);
        onUpdateTodos(todo.id, updatedTodo, false);
        await todoApi.addDesk(todo.id, { desk_id: desk.id });
      }
    } catch (err) {
      await mutate({ todo: todo }, false);
      onUpdateTodos(todo.id, todo, false);
      console.error(err);
    } finally {
      setLoadingStatus(prev => ({
        ...prev,
        [desk.id]: false,
        loading: false
      }));
    }
  }, [todo, onUpdateTodos, mutate]);

  const handleRemove = async (desk) => {
    const currentTodo = { ...todo };
    try {
      const updatedTodo = { ...todo, desks: todo?.desks?.filter((d) => d.id !== desk.id) };
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos(todo.id, updatedTodo, false);
      await todoApi.removeDesk(todo.id, { desk_id: desk.id });
    } catch (err) {
      await mutate({ todo: currentTodo }, false);
      onUpdateTodos(todo.id, currentTodo, false);
      console.error(err);
    }
  };

  return (
    <>
      <Stack
        onClick={(e) => {
          e.stopPropagation();
          if (isCreator && canManage) {
            handleOpenMenu(e);
          }
        }}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          p: 0.5,
          ml: -0.5,
          my: -0.5,
          borderRadius: 1,
          width: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          cursor: isCreator && canManage ? 'pointer' : 'default',
          '&:hover': { bgcolor: isCreator && canManage ? 'action.hover' : 'transparent' }
        }}
      >
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} minHeight={24}>
          {todo?.desks?.map((desk) => (
            <Chip 
              key={desk.id} 
              label={desk.name} 
              size="small" 
              onDelete={canManage ? () => handleRemove(desk) : undefined}
            />
          ))}
        </Stack>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
        PaperProps={{
          sx: { width: { xs: 240, sm: 320 }, maxHeight: { xs: 280, sm: 320 }, border: '1px dashed', borderColor: 'divider', mt: 0.2 }
        }}
      >
        <Box sx={{ p: 0.5, position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper'}}>
          <Input
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ p: 0.5 }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.primary', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        </Box>
        <List sx={{ p: 0 }}>
          {filteredDesks?.map((desk) => (
            <ListItem
              className='participant-item'
              key={desk.id}
              disabled={loadingStatus[desk.id] || !canManage}
              onClick={() => {
                if (canManage) {
                  handleUpdateDesk(desk, desk.isDesk);
                }
              } }
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                py: 0.3,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify icon="lets-icons:check-fill" width={16} height={16} sx={{ color: desk.isDesk ? 'success.main' : 'action.disabled' }} />
              <Box sx={{ width: 16, height: 16, borderRadius: 50, bgcolor: desk.color ?? 'primary.main' }}>
              </Box>
              <ListItemText
                primary={desk.name}
                primaryTypographyProps={{
                  sx: {
                    fontSize: 14,
                    fontWeight: 500,
                  }
                }} />
              {loadingStatus[desk.id] ? (
                <CircularProgress size={20} sx={{ color: 'text.primary' }} />
              ) : (
                <Iconify
                  icon={true ? "radix-icons:cross-2" : "cuida:plus-outline"}
                  width={16}
                  sx={{
                    color: 'text.primary',
                    opacity: 0,
                    '.participant-item:hover &': {
                      opacity: 1
                    }
                  }} />
              )}
            </ListItem>
          ))}

          {isLoadingDesks ?  (
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
              <Iconify icon="svg-spinners:8-dots-rotate" width={20}/>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : (
            filteredDesks?.length === 0 ? (
              <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
                <Typography color="text.secondary" variant="body2">No desks found</Typography>
              </ListItem>
            ) : null
          )}
        </List>
      </Popover>
    </>
  );
};
