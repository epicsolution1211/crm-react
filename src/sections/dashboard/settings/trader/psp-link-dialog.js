import { useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { Upload } from 'src/components/upload';
import { Typography } from '@mui/material';

const schema = yup.object({
  name: yup.string().required('Name is required'),
});

export const PspLinkDialog = ({ open, onClose, onSubmitFunc, initialData = null }) => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      link: '',
      description: '',
      file: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        link: initialData.link,
        description: initialData.description,
      });
    } else {
      reset({
        name: '',
        link: '',
        description: '',
        file: null,
      });
    }
  }, [initialData, reset]);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('file', file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmitFunc)}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant='subtitle1'>{initialData ? 'Edit PSP Link' : 'Create PSP Link'}</Typography>
            <Upload onDrop={handleDrop} />
            
            <TextField
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />

            <TextField
              label="URL (optional)"
              fullWidth
              error={!!errors.link}
              helperText={errors.link?.message}
              {...register('link')}
            />

            <TextField
              label="Description (optional)"
              fullWidth
              {...register('description')}
            />
            <Stack direction='row' justifyContent='flex-end' gap={1.5}>
              <Button onClick={onClose}>Cancel</Button>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                {initialData ? 'Update' : 'Create'}
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
}; 