import * as yup from "yup";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import PhoneInput from "src/components/customize/phone-input";
import { phoneRegExp } from "src/utils/constant";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  full_name: yup.string().required('Name is required field.'),
  email: yup.string().email('Email must be a valid email.'),
  phone_number: yup.string().matches(phoneRegExp, 'Phone must be a valid phone number.')
});

export const AffiliateDetailsStep = (props) => {
  const { onNext, ...other } = props;

  const { register, handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}
        {...other}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            {...register('full_name')}
            error={!!errors?.full_name?.message}
            helperText={errors?.full_name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            {...register('email')}
            error={!!errors?.email?.message}
            helperText={errors?.email?.message}
          />
          <PhoneInput
            name='phone_number'
            label='Phone'
            control={control}
          />
          <TextField
            fullWidth
            label="Telegram"
            {...register('telegram')}
          />
        </Stack>
        <Stack alignItems="center"
          direction="row"
          spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

AffiliateDetailsStep.propTypes = {
  onNext: PropTypes.func,
};
