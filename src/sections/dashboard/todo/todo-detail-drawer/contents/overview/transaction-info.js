import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/paths';
import { todoApi } from 'src/api/todo';
import { useDebounce } from 'src/hooks/use-debounce';
import { useGetTransactions } from 'src/hooks/swr/use-customers';
import { useRouter } from 'src/hooks/use-router';

export const TransactionInfo = ({ todo, mutate, onUpdateTodos, canManage = false }) => {
  const [transactionSearch, setTransactionSearch] = useState('');
  const transactionId = useDebounce(Number(transactionSearch), 300);

  const { transactions, isLoading: isTransactionsLoading } = useGetTransactions({ ids: transactionId > 0 ? [transactionId] : null, per_page: 20, client_id: todo?.client_id });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const router = useRouter();

  const handleNavigate = () => {
    router.push(`${paths.dashboard.risk.transactions}/${todo?.transaction_id}`);
  }

  const handleOpenMenu = () => {
    const wrapper = document.getElementById('transaction-info-wrapper');
    setAnchorEl(wrapper);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTransactionSearch("");
  };

  const [isLoadingStatus, setIsLoadingStatus] = useState();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleUpdateTransaction = async (transaction) => {
    if (isLoadingStatus?.status) return;
    try {
      setIsLoadingStatus({ id: transaction.id, status: true });
      await todoApi.updateToDo(todo.id, {
        transaction_id: transaction.id,
        client_id: transaction.client_id
      });
      mutate();
      onUpdateTodos();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingStatus({ id: transaction.id, status: false });
    }
  };

  const handleRemoveTransaction = async () => {
    if (isDeleteLoading) return;
    try {
      setIsDeleteLoading(true);
      await todoApi.updateToDo(todo.id, {
        delete_transaction_id: true
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
        id="transaction-info-wrapper"
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
        {todo?.transaction_id && 
          (<Stack className="transaction-info" direction="row" gap={1} alignItems="center" minWidth={50}>
            <Iconify 
              icon="uil:link" 
              onClick={handleNavigate} 
              sx={{ 
                width: 18, 
                flexShrink: 0,
                mr: -0.5, 
                color: 'text.secondary', 
                '.transaction-info:hover &': { 
                  borderRadius: 1, 
                  color: 'primary.light',
                  cursor: 'pointer' 
                } 
              }} 
            />
            <Typography 
              onClick={handleNavigate}
              variant="body2" 
              color="text.primary" 
              sx={{ 
                cursor: 'pointer', 
                '.transaction-info:hover &': { 
                  textDecoration: 'underline', 
                  color: 'primary.light' 
                }
              }} 
            >
              {todo?.transaction_id}
            </Typography>
          </Stack>)
        }

        {!todo?.transaction_id && 
          (<Typography variant="caption" color="text.secondary">
            No transaction
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
            {todo?.transaction_id && (
              <Tooltip title="Remove">
                <IconButton 
                size="small"
                onClick={handleRemoveTransaction}
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
            placeholder="Search by transaction id..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            sx={{ p: 0.5 }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.primary', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        </Box>
        <List sx={{ p: 0 }}>
          {transactions?.map((transaction) => {
            return (
              <ListItem
                onClick={() => handleUpdateTransaction(transaction)}
                className='transaction-item'
                key={transaction.id}
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
                <Typography variant="body2" color="text.primary" minWidth={20}>
                  {transaction.id} : 
                </Typography>
                <Stack direction="row" gap={0.5} alignItems="center">
                  <Iconify icon="iconoir:user" width={16} height={16} />
                  <Typography variant="caption" color="text.secondary">
                    {transaction.full_name} 
                  </Typography>
                </Stack>
                <Stack sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                  {isLoadingStatus?.id === transaction.id && isLoadingStatus?.status && <CircularProgress size={16} sx={{ color: 'text.primary' }}/>}
                </Stack>
              </ListItem>
            );
          })}

          {isTransactionsLoading ?  (
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
              <Iconify icon="svg-spinners:8-dots-rotate" width={20}/>
              <Typography>Loading...</Typography>
            </ListItem>
          ) : (
            transactions?.length === 0 ? (
              <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 50 }}>
                <Typography color="text.secondary" variant="body2" textAlign="center">{todo?.client_id ? `No transactions found for this client: ${todo?.client?.name}.  Please remove the client from the task and try again.`  : 'No transactions found'}</Typography>
              </ListItem>
            ) : null
          )}
        </List>
      </Popover>
    </>
  );
};
