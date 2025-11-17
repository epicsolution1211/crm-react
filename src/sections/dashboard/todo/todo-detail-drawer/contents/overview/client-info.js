import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from "src/components/iconify";
import { todoApi } from "src/api/todo";
import { customersApi } from "src/api/customers";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { useDebounce } from "src/hooks/use-debounce";
import { useGetCustomers } from "src/hooks/swr/use-customers";
import { generateAvatarColors } from "src/utils/functions";
import { AvatarWithName } from '../common';

export const ClientInfo = ({ todo, mutate, onUpdateTodos, canManage = false }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleNavigate = () => {
    router.push(`${paths.dashboard.customers.index}/${todo?.client?.id}`);
  }

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const { customers, isLoading: isCustomersLoading } = useGetCustomers({ q, per_page: 20 });

  const [isLoadingStatus, setIsLoadingStatus] = useState();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleOpenMenu = () => {
    const wrapper = document.getElementById('client-info-wrapper');
    setAnchorEl(wrapper);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch("");
  };

  const handleUpdateClient = async (client) => {
    if (isLoadingStatus?.status) return;
    try {
      setIsLoadingStatus({ id: client.id, status: true });

      const res = await customersApi.getTransaction({ client_id: client.id, per_page: 20 });
      const transactions = res?.transactions ?? [];

      if (transactions.length > 0) {
        if (transactions.some(transaction => transaction.id === todo?.transaction_id)) {
          await todoApi.updateToDo(todo.id, {
            client_id: client.id
          });
          mutate();
          onUpdateTodos(todo.id, { client_id: client.id });
          handleClose();
        } else {
          if(transactions?.length == 1) {
            await todoApi.updateToDo(todo.id, {
              client_id: client.id,
              transaction_id: transactions[0]?.id
            });
            mutate();
            onUpdateTodos(todo.id, { client_id: client.id, transaction_id: transactions[0]?.id });
            handleClose();
          } else {
            await todoApi.updateToDo(todo.id, {
              client_id: client.id,
              delete_transaction_id: true
            });
            mutate();
            onUpdateTodos(todo.id, { client_id: client.id, delete_transaction_id: true });
            handleClose();
          }
        }
      } else {
        await todoApi.updateToDo(todo.id, {
          client_id: client.id,
          delete_transaction_id: true
        });
        mutate();
        onUpdateTodos(todo.id, { client_id: client.id, delete_transaction_id: true });
        handleClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingStatus({ id: client.id, status: false });
    }
  };

  const handleRemoveClient = async () => {
    if (isDeleteLoading) return;
    try {
      setIsDeleteLoading(true);
      await todoApi.updateToDo(todo.id, {
        delete_client_id: true
      });
      mutate();
      onUpdateTodos();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <>
      <Stack
        id="client-info-wrapper"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.5,
          ml: -0.5,
          my: -0.5,
          borderRadius: 1,
          width: 'fit-content',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          cursor: canManage ? 'pointer' : 'default',
          '&:hover': { bgcolor: canManage ? 'action.hover' : 'transparent' }
        }}
      >
        {todo?.client_id && 
          (<Stack direction="row" spacing={1} alignItems="center" onClick={handleNavigate} sx={{ cursor: 'pointer' }}>
            {todo?.client && <AvatarWithName account={todo?.client} />}
          </Stack>)}
        {!todo?.client_id && 
          (<Typography variant="caption" color="text.secondary">
            No client
          </Typography>)}

          {canManage && (
            <Stack direction="row" gap={0.5}>
              <Tooltip title="Manage">
                <IconButton 
                  size="small"
                  onClick={handleOpenMenu}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { 
                      color: 'text.primary',
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8) 
                    },
                    ...(open && {
                      color: 'text.primary',
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.4)
                    })
                  }}
                >
                  <Iconify icon="lsicon:setting-outline" width={18} />
                </IconButton>
              </Tooltip>
              {todo?.client_id && (
                <Tooltip title="Remove">
                  <IconButton 
                  size="small"
                  onClick={handleRemoveClient}
                  disabled={isDeleteLoading}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { 
                      color: 'text.primary',
                      backgroundColor: (theme) => alpha(theme.palette.error.main, 0.8)
                    },
                  }}
                >
                  {isDeleteLoading ? <CircularProgress size={18} sx={{ color: 'text.primary' }}/> : <Iconify icon="radix-icons:cross-2" width={18} />}
                </IconButton>
              </Tooltip>
              )}
            </Stack>
          )}
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
          sx: { width: 260, maxHeight: 276, border: '1px dashed', borderColor: 'divider', mt: 1 }
        }}
      >
        <Box sx={{ p: 0.5, position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper'}}>
          <Input
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ p: 0.5 }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.primary', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        </Box>
        <List sx={{ p: 0 }}>
          {customers?.map((client) => {
            const { bgcolor, color } = generateAvatarColors(client?.full_name);

            return (
              <ListItem
                onClick={() => handleUpdateClient(client)}
                className='client-item'
                key={client.id}
                disabled={isLoadingStatus?.status}
                sx={{
                  cursor: 'pointer',
                  py: 1,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                  position: 'relative',
                }}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <Avatar src={client.avatar}
                    sx={{ width: 24, height: 24, fontSize: 12, bgcolor: bgcolor, color: color }}
                  >
                    {client?.full_name?.split(' ').slice(0, 2).map(name => name?.charAt(0))?.join('')}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {client?.full_name} : {client?.id}
                  </Typography>
                </Stack>
                <Stack sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                  {isLoadingStatus?.id === client.id && isLoadingStatus?.status && <CircularProgress size={16} sx={{ color: 'text.primary' }} />}
                </Stack>
              </ListItem>
            );
          })}

          {isCustomersLoading ?  (
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
              <Iconify icon="svg-spinners:8-dots-rotate" width={20}/>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : (
            customers?.length === 0 ? (
              <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
                <Typography color="text.secondary" variant="body2">No clients found</Typography>
              </ListItem>
            ) : null
          )}
        </List>
      </Popover>
    </>
  );
};
