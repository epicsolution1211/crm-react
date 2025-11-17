import { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import toast from "react-hot-toast";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';

import CustomSwitch from "src/components/customize/custom-switch";
import { DeleteModal } from "src/components/customize/delete-modal";
import { currencyApi } from 'src/api/payment_audit/currency';
import { thunks } from 'src/thunks/currency';

export const CurrencyItem = ({ currency }) => {
  const { register, control, setValue, watch } = useForm();
  const dispatch = useDispatch();

  const [isPending, setIsPending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async () => {
    const data = watch();
    setIsPending(true);
    try {
      await currencyApi.updateCurrency(currency?.id, data);
      setTimeout(() => dispatch(thunks.getCurrencies()), 1000);
      toast('Currency successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
  };

  const deleteCurrency = async () => {
    setIsPending(true);
    try {
      await currencyApi.deleteCurrency(currency?.id);
      setTimeout(() => dispatch(thunks.getCurrencies()), 1000);
      toast('Currency successfully deleted!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('name', currency?.name)
    setValue('active', currency?.active)
  }, [currency]);

  return (
    <>
      <TableRow>
        <TableCell sx={{ minWidth: 50, pr: 0 }}>
          {currency?.id}
        </TableCell>
        <TableCell>
          {currency?.default ?
            <Badge
              variant="dot"
              color="success">
              <Tooltip
                placement="top"
                title="Default Label">
                <TextField
                  disabled={currency?.default}
                  size="small"
                  hiddenLabel
                  {...register('name')}
                  sx={{ width: 120 }}
                />
              </Tooltip>
            </Badge>
            :
            <TextField
              disabled={currency?.default}
              size="small"
              hiddenLabel
              {...register('name')}
              sx={{ width: 120 }}
            />
          }
        </TableCell>
        <TableCell>
          <CustomSwitch
            name="active"
            control={control}
          />
        </TableCell>
        <TableCell>
          <Stack direction='row'>
            <Tooltip
              placement="top"
              title="Update">
              <IconButton
                disabled={isPending}
                sx={{ p: 0, pr: 1 }}
                onClick={() =>
                  onSubmit()
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
                disabled={isPending}
                onClick={() => setModalOpen(true)}>
                <DeleteOutlineIcon
                  fontSize="medium"
                  color="error"
                  sx={(theme) => ({
                    color: currency?.default ? 'gray' : theme.palette.error.main
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
        onDelete={() => deleteCurrency()}
        title={'Delete Currency'}
        description={'Are you sure you want to delete this Currency?'}
      />
    </>
  );
};
