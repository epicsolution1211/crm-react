import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import { SelectMenu } from "src/components/customize/select-menu";
import { Iconify } from "src/components/iconify";

const validationSchema = yup.object({
  email: yup.string().required("Email is required field."),
  first_name: yup
    .string()
    .required("First name is required field."),
  last_name: yup.string().required("Last name is required field."),
});

export const FileHeadersStep = ({
  onBack,
  onNext,
  headerList,
  headerValue,
}) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    onNext(data);
  };

  useEffect(() => {
    if (headerValue) {
      reset(headerValue);
    }
  }, [headerList, headerValue]);
  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid xs={4}>
              <SelectMenu
                control={control}
                label="Email *"
                name="email"
                list={headerList}
                clearable
              />
            </Grid>
            <Grid xs={4}>
              <SelectMenu
                control={control}
                label="First Name *"
                name="first_name"
                list={headerList}
                clearable
              />
            </Grid>
            <Grid xs={4}>
              <SelectMenu
                control={control}
                label="Last Name *"
                name="last_name"
                list={headerList}
                clearable
              />
            </Grid>
            <Grid xs={4}>
              <SelectMenu
                control={control}
                label="Password *"
                name="password"
                list={headerList}
                clearable
              />
            </Grid>
          </Grid>
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
          <Button color="inherit" onClick={onBack}>
            Back
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
