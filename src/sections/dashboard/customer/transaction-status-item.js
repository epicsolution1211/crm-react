import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';

import { DeleteModal } from 'src/components/customize/delete-modal';
import { customersApi } from 'src/api/customers';

export const TransactionStatusItem = (props) => {
  const { status, deleteStatuses, updateStatuses } = props;

  const { register, setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async (isDefault) => {
    const data = watch();

    if (isDefault) {
      delete data?.status;
    }
    setIsPending(true);
    try {
      const res = await customersApi.updateTransactionStatus(status?.id, { ...data });
      updateStatuses(res?.status);
      toast('Transaction status successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
  };

  const deleteStatus = async () => {
    setIsPending(true);
    try {
      await customersApi.deleteTransactionStatus(status?.id);
      deleteStatuses(status?.id);
      toast.success('Transaction status successfully deleted!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('status', status?.status);
  }, []);

  return (
    <>
      <TableRow key={status.id}>
        <TableCell>
          {status?.default ?
            <Badge
              variant="dot"
              color="success">
              <Tooltip
                placement="top"
                title="Default Status">
                <TextField
                  disabled={status?.default}
                  size="small"
                  hiddenLabel
                  {...register('status')}
                  sx={{ width: 120 }}
                />
              </Tooltip>
            </Badge>
            :
            <TextField
              disabled={status?.default}
              size="small"
              hiddenLabel
              {...register('status')}
              sx={{ width: 120 }}
            />
          }
        </TableCell>
        <TableCell>
          <Stack direction='row'>
            <Tooltip
              placement="top"
              title="Update">
              <IconButton
                disabled={isPending || status?.default}
                sx={{ p: 0, pr: 1 }}
                onClick={() =>
                  onSubmit(status?.default)
                }>
                <DoneIcon
                  color="success"
                />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="top"
              title="Delete">
              <IconButton
                disabled={isPending || status?.default}
                onClick={() => setModalOpen(true)}>
                <DeleteOutlineIcon
                  fontSize="medium"
                  color="error"
                  sx={(theme) => ({
                    color: status?.default ? 'gray' : theme.palette.error.main
                  })}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(false)}
        onDelete={() => deleteStatus()}
        title={'Delete Transaction Status'}
        description={'Are you sure you want to delete this Transaction Status?'}
      />
    </>
  );
};
