import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

const updateValidationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

export const EditDashboardDialog = ({ open, onClose, dashboard, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(updateValidationSchema),
    defaultValues: {
      title: dashboard?.title || '',
      description: dashboard?.description || '',
    },
  });

  useEffect(() => {
    if (open && dashboard) {
      reset({
        title: dashboard.title || '',
        description: dashboard.description || '',
      });
    }
  }, [open, dashboard, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!dashboard) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Edit Dashboard</Typography>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Title"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 