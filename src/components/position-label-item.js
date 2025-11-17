import { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import MultiSelectMenu from "./customize/multi-select-menu";
import { riskApi } from "src/api/risk";
import { Iconify } from "src/components/iconify";
import { ConfirmDialog } from 'src/components/confirm-dialog-2';

export const PositionLabelItem = (props) => {
  const { label, teams, deleteLabels, updateLabels } = props;

  const { register, control, setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async (isDefault) => {
    const data = watch();
    if (isDefault) {
      delete data?.name;
      delete data?.team_position_label_ids;
    }
    setIsPending(true);
    try {
      const res = await riskApi.updatePositionLabel({ ...data, id: label?.id });
      updateLabels(res?.label);
      toast('Label successfully updated!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
  };

  const deleteLabel = async () => {
    setIsPending(true);
    try {
      await riskApi.deletePositionLabel(label?.id);
      deleteLabels(label?.id);
      toast('Label successfully deleted!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('team_position_label_ids', label?.team_position_label_ids);
    setValue('name', label?.name);
    setValue('color', label?.color);
  }, []);

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
        <TableCell>
          <MultiSelectMenu
            disabled={label?.default}
            isSmall
            control={control}
            name="team_position_label_ids"
            list={teams}
          />
        </TableCell>
        <TableCell>
          <Stack direction='row' gap={1}>
            <Tooltip
              title="Update">
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() =>
                  onSubmit(label?.default)
                }>
                <Iconify icon="ooui:check" width={24} sx={{ color: 'success.main' }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete">
              <IconButton
                size="small"
                disabled={isPending || label?.default}
                onClick={() => setModalOpen(true)}>
                <Iconify icon="heroicons:trash" width={24} sx={{ color: label?.default ? 'action.disabled' : 'error.main' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      {modalOpen && (
        <ConfirmDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)} 
          title="Delete Label"
          description="Are you sure you want to delete this Label?"
          confirmAction={deleteLabel}
          isLoading={isPending}
        />
      )}
    </>
  );
};
