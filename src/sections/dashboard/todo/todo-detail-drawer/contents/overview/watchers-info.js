import { useCallback, useState, useMemo } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Input from "@mui/material/Input";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { Iconify } from "src/components/iconify";
import { todoApi } from "src/api/todo";
import { getAPIUrl } from "src/config";
import { TodoAvatarGroup } from "../common";
import { useGetMembers } from "src/hooks/swr/use-settings";
import { generateAvatarColors } from "src/utils/functions";

export const WatchersInfo = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});

  const { members, isLoading: isLoadingMembers } = useGetMembers({ active: true });

  const filteredMembers = useMemo(() => {
    return members?.filter((member) => {
      const matchesSearch = member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }).map(member => ({
      ...member,
      isWatcher: todo?.watchers?.some(p => p.id === member.id)
    }));
  }, [members, searchQuery, todo]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const open = Boolean(anchorEl);

  const handleUpdateWatcher = useCallback(async (watcher, isWatcher) => {
    setLoadingStatus(prev => ({
      ...prev,
      [watcher.id]: true,
      loading: true
    }));
    
    try {
      if (isWatcher) {
        await todoApi.removeWatcher(todo.id, { watcher_id: watcher.id });
      } else {
        await todoApi.addWatcher(todo.id, { watcher_id: watcher.id });
      }
      onUpdateTodos(todo.id, { watchers: todo?.watchers?.filter((w) => w.id !== watcher.id) });
      await mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(prev => ({
        ...prev,
        [watcher.id]: false,
        loading: false
      }));
    }
  }, [todo, onUpdateTodos, mutate]);

  return (
    <>
      <Stack 
        onClick={(e) => {
          e.stopPropagation();
          if (canManage) {
            handleOpenMenu(e);
          }
        }}
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
      >
        <TodoAvatarGroup accounts={todo?.watchers} />
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
          {filteredMembers?.map((member) => {
            const { bgcolor, color } = generateAvatarColors(member.first_name + ' ' + member.last_name);
            return (
              <ListItem
                className='watcher-item'
                key={member.id}
                disabled={loadingStatus[member.id]}
                onClick={() => {
                  handleUpdateWatcher(member, member.isWatcher);
                }}
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { bgcolor: 'action.hover' }, 
                  py: 0,
                  px: 1,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                }}
              >
                <Badge 
                  badgeContent={
                    <Iconify icon="lets-icons:check-fill" width={16} height={16} sx={{ color: 'text.primary' }} />
                  }
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  overlap="circular"
                  invisible={!member.isWatcher}
                >
                  <Avatar
                    src={member.avatar ? `${getAPIUrl()}/${member.avatar}` : ""}
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: bgcolor, 
                      color: color
                    }}
                  >
                    {member.first_name ? `${member.first_name?.charAt(0)}${member.last_name ? member.last_name?.charAt(0) : ''}` : member.email?.charAt(0)}
                  </Avatar>
                </Badge>
                <ListItemText
                  primary={member.first_name + ' ' + member.last_name}
                  secondary={member.email}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontSize: 12,
                      fontWeight: 400,
                    }
                  }}
                />
                {loadingStatus[member.id] ? (
                  <CircularProgress size={20} sx={{ color: 'text.primary' }}/>
                ) : (
                  <Iconify
                    icon={member.isWatcher ? "radix-icons:cross-2" : "cuida:plus-outline"}
                    width={16}
                    sx={{
                      color: 'text.primary',
                      opacity: 0,
                      '.watcher-item:hover &': {
                        opacity: 1
                      }
                    }}
                  />
                )}
              </ListItem>
            );
          })}

          {isLoadingMembers ?  (
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
              <Iconify icon="svg-spinners:8-dots-rotate" width={20}/>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : (
            filteredMembers?.length === 0 ? (
              <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
                <Typography color="text.secondary" variant="body2">No members found</Typography>
              </ListItem>
            ) : null
          )}
        </List>
      </Popover>
    </>
  );
};
