import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import PhoneInput from "src/components/customize/phone-input";
import { phoneRegExp } from "src/utils/constant";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  name: yup.string().required("Name is required field."),
  email: yup.string().email("Email must be a valid email."),
  phone_number: yup
    .string()
    .matches(phoneRegExp, "Phone must be a valid phone number."),
});

export const BrandsDetailsStep = (props) => {
  const { onNext, ...other } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <Stack {...other}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            {...register("name")}
            error={!!errors?.name?.message}
            helperText={errors?.name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            {...register("email")}
            error={!!errors?.email?.message}
            helperText={errors?.email?.message}
          />
          <PhoneInput name="phone_number" label="Phone" control={control} />
          <TextField
            fullWidth
            label="Telegram"
            name="telegram"
            {...register("telegram")}
          />
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

BrandsDetailsStep.propTypes = {
  onNext: PropTypes.func,
};
