import { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';

export const ComplianceLabelItem = ({ label, onUpdate, onDelete }) => {
  const { register, setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    setValue('name', label?.name);
    setValue('color', label?.color);
  }, [label]);

  const chipColor = watch('color');

  const handleUpdate = async () => {
    const data = watch();
    setIsPending(true);
    try {
      await onUpdate?.(label?.id, data);
      toast.success('Label successfully updated!');
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await onDelete?.(label?.id);
      toast.success('Label successfully deleted!');
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <TableRow key={label.id}>
      <TableCell>
        {label?.default ? (
          <Badge variant="dot" color="success">
            <Tooltip title="Default Label">
              <TextField disabled size="small" hiddenLabel {...register('name')} sx={{ width: 160 }} />
            </Tooltip>
          </Badge>
        ) : (
          <TextField size="small" hiddenLabel {...register('name')} sx={{ width: 160 }} />
        )}
      </TableCell>
      <TableCell sx={{ minWidth: 120, pr: 0 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <label htmlFor={`label-color-${label.id}`}>
            <Chip label={chipColor ?? 'Default'} color='primary' sx={{ backgroundColor: chipColor ?? "" }} />
          </label>
          <input
            style={{ visibility: 'hidden', width: '0px', height: '0px' }}
            id={`label-color-${label.id}`}
            type="color"
            {...register('color')}
          />
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction='row'>
          <IconButton disabled={isPending} onClick={handleUpdate} sx={{ color: 'success.main' }} aria-label="Update label">
            {isPending ? <CircularProgress size={26} /> : <Iconify icon="ic:baseline-check" />}
          </IconButton>
          <IconButton disabled={isPending || isDeleteLoading || label?.default} onClick={handleDelete} sx={{ color: label?.default ? 'text.disabled' : 'error.main' }} aria-label="Delete label">
            {isDeleteLoading ? <CircularProgress size={26} /> : <Iconify icon="heroicons:trash" />}
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};


