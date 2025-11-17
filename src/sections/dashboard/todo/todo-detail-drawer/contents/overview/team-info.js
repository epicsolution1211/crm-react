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
import { useGetTeams } from "src/hooks/swr/use-settings";

export const TeamInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});

  const { teams, isLoading: isLoadingTeams } = useGetTeams({});

  const isCreator = useMemo(() => todo?.creator?.id === user.id, [todo.created_by, user.id]);

  const filteredTeams = useMemo(() => {
    return teams?.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && team.id !== todo?.creator?.id;
    }).map(team => ({
      ...team,
      isTeam: todo?.teams?.some(t => t.id === team.id)
    }));
  }, [teams, searchQuery, todo]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const open = Boolean(anchorEl);

  const handleUpdateTeam = useCallback(async (team, isTeam) => {
    setLoadingStatus(prev => ({
      ...prev,
      [team.id]: true,
      loading: true
    }));
    
    try {
      if (isTeam) {
        const updatedTodo = { ...todo, teams: todo?.teams?.filter((t) => t.id !== team.id) };
        mutate({ todo: updatedTodo }, false);
        onUpdateTodos(todo.id, updatedTodo, false);
        await todoApi.removeTeam(todo.id, { team_id: team.id });
      } else {
        const updatedTodo = { ...todo, teams: [...todo?.teams, team] };
        mutate({ todo: updatedTodo }, false);
        onUpdateTodos(todo.id, updatedTodo, false);
        await todoApi.addTeam(todo.id, { team_id: team.id });
      }
    } catch (err) {
      await mutate({ todo: todo }, false);
      onUpdateTodos(todo.id, todo, false);
      console.error(err);
    } finally {
      setLoadingStatus(prev => ({
        ...prev,
        [team.id]: false,
        loading: false
      }));
    }
  }, [todo, onUpdateTodos, mutate]);

  
  const handleRemove = async (team) => {
    const currentTodo = { ...todo };
    try {
      const updatedTodo = { ...todo, teams: todo?.teams?.filter((t) => t.id !== team.id) };
      await mutate({ todo: updatedTodo }, false);
      onUpdateTodos(todo.id, updatedTodo, false);
      await todoApi.removeTeam(todo.id, { team_id: team.id });
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
          {todo?.teams?.map((team) => (
            <Chip 
              key={team.id} 
              label={team.name} 
              size="small" 
              onDelete={canManage ? () => handleRemove(team) : undefined}
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
          sx: { width: { xs: 240, sm: 320 }, maxHeight: { xs: 300, sm: 400 }, border: '1px dashed', borderColor: 'divider', mt: 0.2 }
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
          {filteredTeams?.map((team) => {
            return (
              <ListItem
                className='participant-item'
                key={team.id}
                disabled={loadingStatus[team.id] || !canManage}
                onClick={() => {
                  if (canManage) {
                    handleUpdateTeam(team, team.isTeam);
                  }
                }}
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { bgcolor: 'action.hover' }, 
                  py: 0.3,
                  px: 1,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                }}
              >
                <Iconify icon="lets-icons:check-fill" width={16} height={16} sx={{ color: team.isTeam ? 'success.main' : 'action.disabled' }} />
                <ListItemText
                  primary={team.name}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                />
                {loadingStatus[team.id] ? (
                  <CircularProgress size={20} sx={{ color: 'text.primary' }}/>
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
                    }}
                  />
                )}
              </ListItem>
            );
          })}

          {isLoadingTeams ?  (
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
              <Iconify icon="svg-spinners:8-dots-rotate" width={20}/>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : (
            filteredTeams?.length === 0 ? (
              <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
                <Typography color="text.secondary" variant="body2">No teams found</Typography>
              </ListItem>
            ) : null
          )}
        </List>
      </Popover>
    </>
  );
};
