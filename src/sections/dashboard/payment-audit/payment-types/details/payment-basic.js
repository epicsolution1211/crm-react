import * as yup from "yup";
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
import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";

const validationSchema = yup.object({
  name: yup.string().required('Name is required field.'),
});

export const PaymentBasic = ({ paymentType, updatePaymentType }) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    updatePaymentType(paymentType?.id, data);
  }

  useEffect(() => {
    setValue('name', paymentType?.name)
  }, [paymentType])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Box sx={{
          maxWidth: 'md',
          minHeight: 380
        }}>
          <CardHeader title="Payment Types" />
          <Stack
            direction='column'
            height={300}
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
            <CardActions sx={{ display: "flex", justifyContent: "end", px: 3 }}>
              <Button
                variant="outlined"
                type='submit'
                disabled={!user?.acc?.acc_e_audit_payment_type}
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

