import Chip from "@mui/material/Chip";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from 'react'
import { DeleteModal } from "./customize/delete-modal";
import { submittedFormsApi } from "src/api/submitted-forms";
import { Iconify } from "src/components/iconify";

export const SubmittedFormsLabelItem = (props) => {
  const { label, deleteLabels, updateLabels } = props;

  const { setValue, watch } = useForm();

  const [isPending, setIsPending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const deleteLabel = async () => {
    setIsPending(true);
    try {
      await submittedFormsApi.deleteSubmittedFormsLabel(label?.id);
      deleteLabels(label?.id);
      toast('Label successfully deleted!')
    } catch (error) {
      console.error('error: ', error);
      toast.error(error?.response?.data?.message ?? 'Failed to delete label');
    }
    setIsPending(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setValue('name', label?.name);
    setValue('description', label?.description);
    setValue('color', label?.color);
    setValue('active', label?.active);
  }, [label]);

  return (
    <>
      <TableRow key={label.id}>
        <TableCell>
          <Typography>{label?.name}</Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 100, pr: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}>
            <label
              htmlFor={label.id}>
              <Chip
                size="small"
                label={watch('color')}
                color='primary'
                sx={{ backgroundColor: watch('color'), cursor: 'pointer' }} />
            </label>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify 
              icon={watch('active') ? "icon-park-outline:check-one" : ""}
              sx={{
                color: watch('active') ? 'success.main' : 'error.main',
                width: 24,
              }}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction='row' gap={0.5}>
            <Tooltip
              title="Edit">
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() => updateLabels(label)}
              >
                <Iconify icon="mage:edit" sx={{ color: 'primary.main' }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete">
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() => setModalOpen(true)}
              >
                <Iconify icon="heroicons:trash" sx={{ color: 'error.main' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(false)}
        onDelete={() => deleteLabel()}
        title={'Delete Label'}
        description={'Are you sure you want to delete this Label?'}
      />
    </>
  );
};
