import * as yup from "yup";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from "src/hooks/use-auth";

const validationSchema = yup.object({
  name: yup.string().required('Name is required field.'),
});

export const ValidationBasic = ({ validationTask, updateValidationTask }) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    updateValidationTask(validationTask?.id, data);
  }

  useEffect(() => {
    setValue('name', validationTask?.name)
    setValue('note', validationTask?.note)
  }, [validationTask])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Box sx={{
          maxWidth: 'md',
        }}>
          <CardHeader title="Validation Rules" />
          <Stack
            direction='column'
            spacing={2}
            justifyContent="space-between">
            <Stack sx={{ px: 3 }}>
              <Typography
                variant='subtitle2'
                sx={{ p: 1 }}>Name</Typography>
              <TextField
                hiddenLabel
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                {...register('name')}
              />
            </Stack>
            <CardActions sx={{ display: "flex", justifyContent: "end", p: 3 }}>
              <Button
                variant="outlined"
                type='submit'
                disabled={!user?.acc?.acc_e_audit_tasks}
              >
                Update
              </Button>
            </CardActions>
          </Stack>
        </Box>
      </Card>
    </form>
  );
};

