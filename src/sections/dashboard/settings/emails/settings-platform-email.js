import { useEffect } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CustomSwitch from "src/components/customize/custom-switch";
import { Iconify } from "src/components/iconify";
import { SelectMenu } from "src/components/customize/select-menu";
import { brandsApi } from "src/api/lead-management/brand";
import { AUTH_TYPE_OPTIONS } from "src/utils/constants";

const validationSchema = yup.object({
  smtp_address: yup.string().required("SMTP address is required field"),
  smtp_port: yup.number().required("SMTP port is required field"),
  smtp_user_name: yup.string().required("SMTP user name is required field"),
  smtp_password: yup.string().required("SMTP password is required field"),
  smtp_authentication: yup.string().nullable(),
});

export const SettingsPlatformEmail = ({ brand, onGetBrand }) => {
  const {
    handleSubmit: handleEmailSubmit,
    register: emailRegister,
    setValue: emailSetValue,
    control: emailControl,
    formState: { errors: emailErros, isSubmitting: emailIsSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    emailSetValue("smtp_address", brand?.smtp_address ?? "");
    emailSetValue("smtp_port", brand?.smtp_port ?? "");
    emailSetValue("smtp_user_name", brand?.smtp_user_name ?? "");
    emailSetValue("smtp_password", brand?.smtp_password ?? "");
    emailSetValue("smtp_authentication", brand?.smtp_authentication ?? "plain");
    emailSetValue("email_bonus", brand?.email_bonus ?? false);
    emailSetValue("email_deposit", brand?.email_deposit ?? false);
    emailSetValue("email_withdrawl", brand?.email_withdrawl ?? false);
  }, [brand]);

  const onSubmit = async (data) => {
    try {
      await brandsApi.updateInternalBrand(brand?.id, data);
      await onGetBrand();

      toast.success("Email SMTP settings successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Email SMTP settings successfully updated!");
      console.error(error);
    }
  };

  return (
    <Stack sx={{ p: { xs: 2, md: 5 }, minHeight:"calc(100vh - 360px)"}}>
      <Typography variant="h5">Global SMTP Settings</Typography>
      <Stack sx={{ mt: 3 }}>
        <form onSubmit={handleEmailSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack gap={2} pt={3} pb={2} sx={{ maxWidth: 450 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Address:</Typography>
                  <TextField
                    error={!!emailErros?.smtp_address?.message}
                    helperText={emailErros?.smtp_address?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Address"
                    name="smtp_address"
                    type="text"
                    sx={{ width: 250 }}
                    {...emailRegister("smtp_address")}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Port:</Typography>
                  <TextField
                    error={!!emailErros?.smtp_port?.message}
                    helperText={emailErros?.smtp_port?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Port"
                    name="smtp_port"
                    type="number"
                    sx={{ width: 250 }}

                    {...emailRegister("smtp_port")}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>User Name:</Typography>
                  <TextField
                    error={!!emailErros?.smtp_user_name?.message}
                    helperText={emailErros?.smtp_user_name?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="User Name"
                    name="smtp_user_name"
                    type="text"
                    sx={{ width: 250 }}

                    {...emailRegister("smtp_user_name")}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Password:</Typography>
                  <TextField
                    error={!!emailErros?.smtp_password?.message}
                    helperText={emailErros?.smtp_password?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Password"
                    name="smtp_password"
                    type="password"
                    sx={{ width: 250 }}
                    {...emailRegister("smtp_password")}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Authentication type:</Typography>
                    <SelectMenu
                      name="smtp_authentication"
                      control={emailControl}
                      list={AUTH_TYPE_OPTIONS}
                      sx={{ width: 250 }}
                    />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack gap={2} pt={3} pb={2} sx={{ maxWidth: 250 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Email Bonus:</Typography>
                    <Tooltip title="Email client when bonus is added to their account">
                      <IconButton color="primary">
                        <Iconify icon="material-symbols:info-outline" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <CustomSwitch control={emailControl} name="email_bonus" />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Email Deposit:</Typography>
                    <Tooltip title="Email client when deposit is added to their account">
                      <IconButton color="primary">
                        <Iconify icon="material-symbols:info-outline" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <CustomSwitch control={emailControl} name="email_deposit" />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Email Withdraw:</Typography>
                    <Tooltip title="Email client when withdraw from their account">
                      <IconButton color="primary">
                        <Iconify icon="material-symbols:info-outline" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <CustomSwitch control={emailControl} name="email_withdrawl" />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <LoadingButton loading={emailIsSubmitting} variant="contained" type="submit" sx={{ width: 90 }}>
              Update
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};
