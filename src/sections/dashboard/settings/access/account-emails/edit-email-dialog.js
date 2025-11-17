import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Dialog from "@mui/material/Dialog";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Autocomplete from "@mui/material/Autocomplete";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import CustomSwitch from 'src/components/customize/custom-switch';
import { Iconify } from "src/components/iconify";
import { userApi } from "src/api/user";
import { AUTH_TYPE_OPTIONS, EMAIL_PROVIDERS } from "src/utils/constants";

const validationSchema = yup.object({
  email_address: yup.string().email("Must be a valid email").required("Email is required"),
  enabled: yup.boolean().nullable(),
  reply_to: yup.string().email("Must be a valid email").nullable(),
  imap_host: yup.string().when('imap_enabled', {
    is: true,
    then: (schema) => schema.required('IMAP Host is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  imap_port: yup.number().transform((value) => (isNaN(value) ? undefined : value))
    .when('imap_enabled', {
      is: true,
      then: (schema) => schema.required('IMAP Port is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  imap_username: yup.string().when('imap_enabled', {
    is: true,
    then: (schema) => schema.required('IMAP Username is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  imap_password: yup.string().when('imap_enabled', {
    is: true,
    then: (schema) => schema.required('IMAP Password is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  imap_ssl: yup.boolean().nullable(),
  imap_enabled: yup.boolean().nullable(),
  smtp_host: yup.string().when('smtp_enabled', {
    is: true,
    then: (schema) => schema.required('SMTP Host is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  smtp_port: yup.number().transform((value) => (isNaN(value) ? undefined : value))
    .when('smtp_enabled', {
      is: true,
      then: (schema) => schema.required('SMTP Port is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  smtp_username: yup.string().when('smtp_enabled', {
    is: true,
    then: (schema) => schema.required('SMTP Username is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  smtp_password: yup.string().when('smtp_enabled', {
    is: true,
    then: (schema) => schema.required('SMTP Password is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  smtp_ssl: yup.boolean().nullable(),
  smtp_enabled: yup.boolean().nullable(),
});

export const EditEmailDialog = ({ open, onClose, onGetEmails, email }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [emailProvider, setEmailProvider] = useState('custom');
  const [selectedAuthType, setSelectedAuthType] = useState(AUTH_TYPE_OPTIONS[0]);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = useForm({ 
    resolver: yupResolver(validationSchema),
    defaultValues: {
      enabled: false,
      imap_ssl: false,
      imap_enabled: false,
      smtp_ssl: false,
      smtp_enabled: false,
      smtp_authentication: 'plain',
    }
  });

  const handleProviderChange = (event, newProvider) => {
    if (newProvider !== null) {
      setEmailProvider(newProvider);
      const config = EMAIL_PROVIDERS[newProvider];
      setValue('imap_host', config.imap_host);
      setValue('imap_port', config.imap_port);
      setValue('imap_ssl', config.imap_ssl);
      setValue('smtp_host', config.smtp_host);
      setValue('smtp_port', config.smtp_port);
      setValue('smtp_ssl', config.smtp_ssl);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setEmailProvider('custom');
  }

  useEffect(() => {
    if (email) {
      setValue("email_address", email?.email_address);
      setValue("enabled", email?.enabled);
      setValue("imap_host", email?.imap_host);
      setValue("imap_port", email?.imap_port);
      setValue("imap_username", email?.imap_username);
      setValue("imap_password", email?.imap_password);
      setValue("imap_ssl", email?.imap_ssl);
      setValue("imap_enabled", email?.imap_enabled);
      setValue("smtp_host", email?.smtp_host);
      setValue("smtp_port", email?.smtp_port);
      setValue("smtp_username", email?.smtp_username);
      setValue("smtp_password", email?.smtp_password);
      setValue("smtp_ssl", email?.smtp_ssl);
      setValue("smtp_enabled", email?.smtp_enabled);
      setValue("reply_to", email?.reply_to);
      setValue("smtp_authentication", email?.smtp_authentication || 'plain');
      setSelectedAuthType(AUTH_TYPE_OPTIONS.find(option => option.value === (email?.smtp_authentication || 'plain')));

      // Detect provider based on IMAP and SMTP settings
      if (email?.imap_host === EMAIL_PROVIDERS.gmail.imap_host && 
          email?.smtp_host === EMAIL_PROVIDERS.gmail.smtp_host) {
        setEmailProvider('gmail');
      } else if (email?.imap_host === EMAIL_PROVIDERS.outlook.imap_host && 
                email?.smtp_host === EMAIL_PROVIDERS.outlook.smtp_host) {
        setEmailProvider('outlook');
      } else {
        setEmailProvider('custom');
      }
    }
  }, [email, setValue]);

  const onSubmit = async (data) => {
    try {
      const request = {
        ...data,
      };
      await userApi.updateAccountEmail(email?.id, request);
      toast.success("Email successfully updated!");
      setTimeout(() => {
        onGetEmails();
      }, 1500);
      handleClose();
    } catch (error) {
      toast.error("Something went wrong");
      throw new Error(error);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth fullScreen={!mdUp}>
      <IconButton sx={{ position: "absolute", top: 10, right: 10, display: mdUp ? 'none' : 'block' }} onClick={handleClose}>
        <Iconify icon="iconoir:xmark" color="text.primary"/>
      </IconButton>
      <DialogTitle sx={{ py: { xs: 2, md: 3 } }}>
        <Typography fontSize={22} fontWeight={600} sx={{ textAlign: "center" }}>Update Email</Typography>
      </DialogTitle>
      <DialogContent>
          <Stack sx={{ flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
            <Grid container spacing={2} sx={{ width: 1 }}>
              <Grid xs={12} md={12}>
                <TextField
                  label="Email"
                  name="email_address"
                  type="email"
                  {...register("email_address")}
                  error={!!errors?.email_address?.message}
                  helperText={errors?.email_address?.message}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <CustomSwitch 
                        control={control} 
                        name="enabled" 
                        label="Enable" 
                        labelPosition="left"
                      />
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ width: 1 }}>
              <Grid xs={12} md={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Email Provider</Typography>
                <ToggleButtonGroup
                  value={emailProvider}
                  exclusive
                  onChange={handleProviderChange}
                  aria-label="email provider"
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="gmail" aria-label="gmail">
                    <Iconify icon="logos:google-gmail" sx={{ mr: 1 }} width={20}/>
                    Gmail
                  </ToggleButton>
                  <ToggleButton value="outlook" aria-label="outlook">
                    <Iconify icon="vscode-icons:file-type-outlook" sx={{ mr: 1 }} width={20}/>
                    Outlook
                  </ToggleButton>
                  <ToggleButton value="custom" aria-label="custom">
                    <Iconify icon="mdi:cog" sx={{ mr: 1 }} width={20}/>
                    Custom
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ width: 1 }}>
              <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <CustomSwitch control={control} name="imap_enabled" label="Enable IMAP" labelPosition="right" />
              </Grid>
              <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <CustomSwitch control={control} name="imap_ssl" label="Enable IMAP SSL" labelPosition="right" />
              </Grid>
            </Grid>
            <>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <TextField
                    label="IMAP Host"
                    {...register("imap_host")}
                    error={!!errors?.imap_host?.message}
                    helperText={errors?.imap_host?.message}
                    disabled={emailProvider !== 'custom'}
                    InputLabelProps={{ shrink: watch('imap_host') ? true : false }}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="IMAP Port"
                    type="number"
                    {...register("imap_port")}
                    error={!!errors?.imap_port?.message}
                    helperText={errors?.imap_port?.message}
                    disabled={emailProvider !== 'custom'}
                    InputLabelProps={{ shrink: watch('imap_port') ? true : false }}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="IMAP Username"
                    {...register("imap_username")}
                    error={!!errors?.imap_username?.message}
                    helperText={errors?.imap_username?.message}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="IMAP Password"
                    {...register("imap_password")}
                    error={!!errors?.imap_password?.message}
                    helperText={errors?.imap_password?.message}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </>

            <Grid container spacing={2} sx={{ width: 1 }}>
              <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <CustomSwitch control={control} name="smtp_enabled" label="Enable SMTP" labelPosition="right" />
              </Grid>
              <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <CustomSwitch control={control} name="smtp_ssl" label="Enable SMTP SSL" labelPosition="right" />
              </Grid>
            </Grid>
            <>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <TextField
                    label="SMTP Host"
                    {...register("smtp_host")}
                    error={!!errors?.smtp_host?.message}
                    helperText={errors?.smtp_host?.message}
                    disabled={emailProvider !== 'custom'}
                    InputLabelProps={{ shrink: watch('smtp_host') ? true : false }}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="SMTP Port"
                    type="number"
                    {...register("smtp_port")}
                    error={!!errors?.smtp_port?.message}
                    helperText={errors?.smtp_port?.message}
                    disabled={emailProvider !== 'custom'}
                    InputLabelProps={{ shrink: watch('smtp_port') ? true : false }}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="SMTP Username"
                    {...register("smtp_username")}
                    error={!!errors?.smtp_username?.message}
                    helperText={errors?.smtp_username?.message}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="SMTP Password"
                    {...register("smtp_password")}
                    error={!!errors?.smtp_password?.message}
                    helperText={errors?.smtp_password?.message}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Autocomplete
                    options={AUTH_TYPE_OPTIONS}
                    value={selectedAuthType}
                    onChange={(event, newValue) => {
                      setSelectedAuthType(newValue);
                      setValue('smtp_authentication', newValue?.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Authentication Type"
                        error={!!errors?.smtp_authentication?.message}
                        helperText={errors?.smtp_authentication?.message}
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Reply-To"
                    type="email"
                    {...register("reply_to")}
                    error={!!errors?.reply_to?.message}
                    fullWidth
                  />
                </Grid>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', px: 1.5 }}>
                  When clients reply to emails sent from this address, their replies will go to the Reply-To address instead. Leave empty to receive replies at the same address.
                  <br />
                  <b>Important:</b> The Reply-To email address must exist on your mail server and have IMAP configured to receive emails.
                </Typography>
              </Grid>
            </>
      
          </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <LoadingButton 
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          type="submit" 
          variant="contained" 
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
