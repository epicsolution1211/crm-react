import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Iconify } from "src/components/iconify";

export const ServerDialog = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", server_id: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    reset();
    if (onClose) onClose();
  };

  const onFormSubmit = async (data) => {
    try {
      const currenTenants = localStorage.getItem("tenants") ? JSON.parse(localStorage.getItem("tenants")) : [];
      if(currenTenants?.some(tenant => tenant?.server_code === data.server_id)) {
        toast.error("This server already added!");
        return;
      }

      const serverResponse = await axios.post(`https://api.octolit.com/api/company/server_urls`, { server_code: data.server_id });
      const companyResponse = await axios.post(`${serverResponse?.data?.server_url}/user/session`, { email: data.email, password: data.password });
      const companies = companyResponse?.data?.companies ?? [];

      if (companies?.length < 1) {
        toast.error("There is no company for this server!");
        return;
      }

      if (companies?.length > 0) {
        const modifiedCompanies = companies?.map(company => ({
          ...company,
          server_url: serverResponse?.data?.server_url,
          server_code: data.server_id,
        }));

        const updatedTenants = [...currenTenants, ...modifiedCompanies]

        localStorage.setItem("tenants", JSON.stringify(updatedTenants));
      }
      toast.success(`Server added successfully!`);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.data?.message);
      console.error('error: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle sx={{ pt: 3, pb: 1 }}>Add Server</DialogTitle>
        <DialogContent sx={{ '&.MuiDialogContent-root': { px: 2.5, pt: 0, pb: 1 } }}>
          <Stack spacing={2} mt={1}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email or User Name is required" }}
              render={({ field }) => (
                <TextField
                  error={!!errors.email}
                  fullWidth
                  helperText={errors.email?.message}
                  label="Email or User Name"
                  autoFocus
                  type="email"
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  error={!!errors.password}
                  fullWidth
                  helperText={errors.password?.message}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          color="primary"
                        >
                          <Iconify icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="server_id"
              control={control}
              rules={{ required: "Server ID is required" }}
              render={({ field }) => (
                <TextField
                  error={!!errors.server_id}
                  fullWidth
                  helperText={errors.server_id?.message}
                  label="Server ID"
                  type="text"
                  {...field}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" disabled={!isValid || isSubmitting} loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

