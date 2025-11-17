import { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "./customize/multi-select-menu";
import { DeleteModal } from "./customize/delete-modal";
import { customersApi } from "../api/customers";

export const LabelItem = (props) => {
  const { label, teams, mutate, mutateAll, getLabelList = () => {} } = props;

  const { register, control, setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async (isDefault) => {
    const data = watch();
    if (isDefault) {
      delete data?.name;
      delete data?.team_client_label_ids;
    }
    setIsPending(true);
    try {
      await customersApi.updateCustomerLabel({ ...data, id: label?.id });

      setTimeout(async()=> {
        await mutate();
        await mutateAll();
        getLabelList();
      }, 1000);

      toast('Label successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsPending(false);
    }
  };

  const deleteLabel = async () => {
    setIsDeleteLoading(true);
    try {
      await customersApi.deleteCustomerLabel(label?.id);

      setTimeout(async()=> {
        await mutate();
        await mutateAll();
        getLabelList();
      }, 1000);

      toast('Label successfully deleted!');
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsDeleteLoading(false);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    setValue('team_client_label_ids', label?.team_client_label_ids);
    setValue('name', label?.name);
    setValue('color', label?.color);
  }, [label]);

  const chipColor = watch('color')
  return (
    <>
      <TableRow key={label.id}>
        <TableCell>
          {label?.default ?
            <Badge
              variant="dot"
              color="success">
              <Tooltip
                placement="top"
                title="Default Label">
                <TextField
                  disabled={label?.default}
                  size="small"
                  hiddenLabel
                  {...register('name')}
                  sx={{ width: 120 }}
                />
              </Tooltip>
            </Badge>
            :
            <TextField
              disabled={label?.default}
              size="small"
              hiddenLabel
              {...register('name')}
              sx={{ width: 120 }}
            />
          }
        </TableCell>
        <TableCell sx={{ minWidth: 100, pr: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}>
            <label
              htmlFor={label.id}>
              <Chip
                label={chipColor ?? 'Default'}
                color='primary'
                sx={{ backgroundColor: chipColor ?? "" }} />
            </label>
            <input
              style={{ visibility: 'hidden', width: '0px', height: '0px' }}
              id={label.id}
              type="color"
              {...register('color')}
            />
          </Stack>
        </TableCell>
        <TableCell sx={{pr:0}}>
          <MultiSelectMenu
            disabled={label?.default}
            isSmall
            control={control}
            name="team_client_label_ids"
            list={teams}
          />
        </TableCell>
        <TableCell>
          <Stack direction='row'>
            <Tooltip
              placement="top"
              title="Update">
              <Box>
                <IconButton
                  disabled={isPending}
                  onClick={() => onSubmit(label?.default)}
                  sx={{ color: 'success.main'}}
                  >
                  {isPending ?
                  <CircularProgress size={26}/> :
                  <Iconify icon="ic:baseline-check" />
                  }
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip
              placement="top"
              title="Delete">
              <Box>
                <IconButton
                  disabled={isPending || label?.default}
                  onClick={() => setModalOpen(true)}
                  sx={{ color: label?.default ? 'text.disabled' : "error.main" }}
                  >
                  <Iconify icon="heroicons:trash" />
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(false)}
        onDelete={() => deleteLabel()}
        title={'Delete Label'}
        description={'Are you sure you want to delete this Label?'}
      />
    </>
  );
};
