// React imports
import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// MUI imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from "@mui/system/Unstable_Grid/Grid";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';

import { SelectMenu } from "src/components/customize/select-menu";
import { useDebounce } from "src/hooks/use-debounce";
import { useGetCustomers, useGetTransactions } from "src/hooks/swr/use-customers";
import { todoApi } from "src/api/todo";
import { useGetMembers } from "src/hooks/swr/use-settings";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { useAuth } from "src/hooks/use-auth";
import { Iconify } from "src/components/iconify";

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
});

export const CreateTaskDialog = ({
  open,
  onClose,
  onSuccess = () => {},
  customer,
  transaction,
  isTicket = false,
}) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { control, handleSubmit, register, setValue, watch, reset, formState: { errors, isSubmitting }  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'low',
      stale_days: 0,
    },
    resolver: yupResolver(validationSchema),
  });

  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const [transactionSearch, setTransactionSearch] = useState('');
  const transactionId = useDebounce(Number(transactionSearch), 300);

  const { customers, isLoading: isCustomersLoading, mutate: mutateCustomers } = useGetCustomers({ q, per_page: 20 }, { dedupingInterval: 10000 });
  
  const { transactions, isLoading: isTransactionsLoading } = useGetTransactions({ client_id: watch('client_id'), ids: transactionId > 0 ? [transactionId] : null, per_page: 20 }, { dedupingInterval: 10000 });

  const { members, isLoading: isLoadingMembers } = useGetMembers({}, { dedupingInterval: 60000 });

  const memberList = useMemo(() => {
    return members?.filter(member => member?.id !== user?.id)
    ?.map(member => ({ label: member?.first_name + (member?.last_name ? ' ' + member?.last_name : ''), value: member?.id }));
  }, [members, user]);

  const onSubmit = async (data) => {
    try {
      const request = {
        status : 'todo',
        ticket_system: isTicket ? true : false,
        ...data,
      }
      await todoApi.createToDo(request);
      
      toast.success('Task created successfully');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('error: ', error);
    }
  }
  
  const handleClose = () => {
    onClose();
    reset();
  }

  useEffect(() => {
    reset();
  }, [open]);

  useEffect(() => {
    if (customer) {
      if (!customers?.some(customer => customer?.id === customer?.id)) {
        const existingCustomers = Array.isArray(customers) ? customers : [];
        mutateCustomers({ clients: [...existingCustomers, { id: customer?.id, full_name: customer?.full_name, avatar: null }] }, false);
      }
      setValue('client_id', customer?.id);
    }
  }, [customer]);

  useEffect(() => {
    if (transaction) {
      setValue('transaction_id', transaction?.id);
      if (!customers?.some(customer => customer?.id === transaction?.client_id)) {
        const existingCustomers = Array.isArray(customers) ? customers : [];
        mutateCustomers({ clients: [...existingCustomers, { id: transaction.client_id, full_name: transaction?.full_name, avatar: null }] }, false);
      }
      setValue('client_id', transaction?.client_id);
    }
  }, [transaction]);

  const participant_ids = watch('participant_ids');
  const watcher_ids = watch('watcher_ids');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={!mdUp}
    >
      <DialogTitle sx={{ mx: 1, mt: 2 }}>
        <Typography variant="h5" textAlign="center">{isTicket ? 'Add Ticket' : 'Add Task'}</Typography>
      </DialogTitle>
      <DialogContent sx={{ mx: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="column" spacing={1} position='relative'>
          <Typography variant="subtitle2" px={1}>Title</Typography>
          <TextField
            hiddenLabel
            placeholder="Enter title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Stack>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" px={1}>Description</Typography>
          <TextField
            hiddenLabel
            multiline
            minRows={3}
            placeholder="Enter description"
            {...register('description')}
          />
        </Stack>
        <Grid container spacing={2} >
          <Grid xs={12} md={12}>
            <SelectMenu
              list={transactions?.map(transaction => (
                {
                  label: `${transaction?.id} :`,
                  value: transaction?.id,
                  ...transaction,
                }))}
              isTransaction
              control={control}
              name="transaction_id" 
              label="Transaction"
              isApiSearch
              apiSearch={transactionSearch}
              setApiSearch={(e) => {
                e.preventDefault();
                e.stopPropagation();  
                setTransactionSearch(Number(e?.target?.value) || '');
              }}
              onSelect={(e) => {
                const transaction = transactions?.find(transaction => transaction?.id === e);
                const clientExists = customers?.some(customer => customer.id === transaction?.client_id);
                
                if (!clientExists && transaction?.client_id) {
                  const existingCustomers = Array.isArray(customers) ? customers : [];
                  mutateCustomers({ clients: [...existingCustomers, { id: transaction.client_id, full_name: transaction?.full_name, avatar: null }] }, false);
                }

                setValue('client_id', transaction?.client_id);
              }}
              clearable
              isLoading={isTransactionsLoading}
              searchPlaceholder="Type transaction Id"
              emptyMessage={watch('client_id') ? `There is no matched transaction for this client: ${customers?.find(customer => customer?.id === watch('client_id'))?.full_name}.` : "There is no matched transaction."}
              disabled={!!transaction}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <SelectMenu
              list={customers?.map?.(customer => ({ label: customer?.full_name ?? customer?.emails?.[0] ?? customer?.id, value: customer?.id }))}
              control={control}
              name="client_id"
              label="Client"
              isApiSearch
              clearable
              apiSearch={search}
              onSelect={() => {
                setValue('transaction_id', null);
              }}
              setApiSearch={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSearch(e?.target?.value);
              }}
              isLoading={isCustomersLoading}
              searchPlaceholder="Search Client"
              disabled={!!customer || !!transaction}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} >
          <Grid xs={12} md={6}>
            <MultiSelectMenu
              label="Participants"
              control={control}
              name="participant_ids"
              list={memberList}
              isLoading={isLoadingMembers}
              isSearch
            />
            {participant_ids?.length > 0 && (
              <Stack direction="row" gap={1} pt={1.5} flexWrap="wrap">
                {participant_ids?.map(id => (
                  <Chip 
                    key={id}
                    icon={<Iconify icon="iconoir:user" width={16} />}
                    label={memberList?.find(member => member?.value === id)?.label}
                    size="small"
                    variant="outlined"
                    onDelete={() => {
                      const newParticipantIds = participant_ids?.filter(participant_id => participant_id !== id);
                      setValue('participant_ids', newParticipantIds);
                    }}
                    sx={{
                      '& .MuiChip-icon': {
                        fontSize: 16,
                        color: 'text.primary',
                        ml: 0.5
                      },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
          <Grid xs={12} md={6}>
            <MultiSelectMenu
              label="Watchers"
              control={control}
              name="watcher_ids"
              list={memberList}
              isLoading={isLoadingMembers}
              isSearch
            />
            {watcher_ids?.length > 0 && (
              <Stack direction="row" gap={1} pt={1.5} flexWrap="wrap">
                {watcher_ids?.map(id => (
                  <Chip 
                    key={id}
                    icon={<Iconify icon="ion:eye-outline" width={16} />}
                    label={memberList?.find(member => member?.value === id)?.label}
                    size="small"
                    variant="outlined"
                    onDelete={() => {
                      const newWatcherIds = watcher_ids?.filter(watcher_id => watcher_id !== id);
                      setValue('watcher_ids', newWatcherIds);
                    }}
                    sx={{
                      '& .MuiChip-icon': {
                        fontSize: 16,
                        color: 'text.primary',
                        ml: 0.5
                      },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
        <Stack 
          sx={{ 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1,
            rowGap: 2,
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            px: { xs: 0, md: 1 }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2">Priority:</Typography>
            <Chip
              label="Low"
              color={watch('priority') === 'low' ? 'success' : 'default'}
              onClick={() => setValue('priority', 'low')} 
              variant={watch('priority') === 'low' ? 'filled' : 'outlined'}
              sx={{ borderRadius: 1 }}
            />
            <Chip
              label="Medium" 
              color={watch('priority') === 'medium' ? 'warning' : 'default'}
              onClick={() => setValue('priority', 'medium')}
              variant={watch('priority') === 'medium' ? 'filled' : 'outlined'}
              sx={{ borderRadius: 1 }}
            />
            <Chip
              label="High"
              color={watch('priority') === 'high' ? 'error' : 'default'} 
              onClick={() => setValue('priority', 'high')}
              variant={watch('priority') === 'high' ? 'filled' : 'outlined'}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', pr: 1 }}>Stale Days:</Typography>
            <TextField
              hiddenLabel
              type="number"
              size="small"
              sx={{ width: 120 }}
              placeholder="Enter days"
              {...register('stale_days')}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pt: 1, pb: 3 }}>
        <Button 
          variant="outlined" 
          sx={{ width: 100 }} 
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton 
          variant="contained" 
          sx={{ width: 100 }} 
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
