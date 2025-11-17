import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { metabaseApi } from 'src/api/metabase';
import toast from 'react-hot-toast';

const validationShema = yup.object({
  template_display_name: yup.string().required('Name is required'),
  description: yup.string().optional(),
});

export const CreateTemplateDialog = ({ open, onClose, dashboard }) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationShema),
    defaultValues: {
      visibility: 'public'
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      const request = {
        template_display_name: data.template_display_name,
        template_name: data.template_display_name?.toLowerCase().replace(/ /g, '_'),
        description: data.description,
        visibility: data.visibility,
      };
      if (dashboard?.id) {
        await metabaseApi.createMetabaseTemplateFromDashboard(dashboard.id, request);
      }
      toast.success('Template created successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.response?.data?.errors[0] ?? 'Error creating template');
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Create Template{' '}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Dashboard: <Typography variant="subtitle2" component="span" sx={{ color: 'primary.main' }}>{dashboard.title}</Typography>
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pb: 1, pt: 0 }}>
          <Stack direction="column" gap={2}>
            <TextField
              fullWidth
              label="Name"
              error={!!errors.template_display_name}
              helperText={errors.template_display_name?.message}
              {...register('template_display_name')}
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

            <RadioGroup
              row
              defaultValue="public"
              {...register('visibility')}
              sx={{ px: 1 }}
            >
              <FormControlLabel value="public" control={<Radio />} label="Public" />
              <FormControlLabel value="private" control={<Radio />} label="Private" />
            </RadioGroup>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={isSubmitting}
            color="primary"
          >
            Create
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 