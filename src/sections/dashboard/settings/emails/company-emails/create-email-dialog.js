import { useEffect } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import CustomSwitch from 'src/components/customize/custom-switch';
import { Iconify } from "src/components/iconify";
import { companyEmailsApi } from "src/api/company-emails";

const validationSchema = yup.object({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  enabled: yup.boolean().nullable(),
});

export const CreateEmailDialog = ({ open, onClose, onGetEmails, brandId, companyId }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      enabled: true,
      email: '',
    }
  });

  const handleClose = () => {
    reset({
      enabled: true,
      email: '',
    });
    onClose();
  }

  useEffect(() => {
    setValue("email", null);
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const request = {
        ...data,
        internal_brand_id: brandId,
        company_id: companyId,
      };
      await companyEmailsApi.createCompanyEmail(request);
      toast.success("Email successfully created!");
      handleClose();
      setTimeout(() => {
        onGetEmails();
      }, 1500);
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
      <DialogTitle sx={{ py: { xs: 2, md: 3 }, pb: 0 }}>
        <Typography fontSize={22} fontWeight={600} sx={{ textAlign: "center" }}>Create Email</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ width: 1, py: 3 }}>
          <Grid xs={12} md={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              {...register("email")}
              error={!!errors?.email?.message}
              helperText={errors?.email?.message}
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <LoadingButton 
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          type="submit" 
          variant="contained" 
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
