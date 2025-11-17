import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from "src/components/iconify";
import { blogApi } from "src/api/blog";
import { ConfirmDialog } from 'src/components/confirm-dialog-2';

export const ArticleLabelItem = ({ label, deleteLabels, updateLabels }) => {
  const { register, setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async () => {
    const data = watch();
    setIsPending(true);
    try {
      const res = await blogApi.updateArticleLabel({ ...data, id: label?.id });
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
      await blogApi.deleteArticleLabel(label?.id);
      deleteLabels(label?.id);
      toast.success('Label successfully deleted!')
    } catch (error) {
      console.error('error: ', error);
    }
    setIsPending(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('name', label?.name);
    setValue('color', label?.color);
  }, []);

  const chipColor = watch('color')
  return (
    <>
      <TableRow key={label.id}>
        <TableCell>
          <TextField
            size="small"
            hiddenLabel
            {...register('name')}
            sx={{ width: 120 }}
          /></TableCell>
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
          <Stack direction='row' gap={0.5}>
            <Tooltip
              title="Update">
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() => onSubmit()}>
                <Iconify icon="ooui:check" width={24} sx={{ color: 'success.main' }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete">
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() => setModalOpen(true)}>
                <Iconify icon="heroicons:trash" width={24} sx={{ color: 'error.main' }} />
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
