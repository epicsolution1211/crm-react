import { useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { settingsApi } from "src/api/settings";
import { useForm } from "react-hook-form";
import CustomModal from "src/components/customize/custom-modal";
import toast from "react-hot-toast";
import { defaultTemplate } from "src/components/settings/constants";

export const AddRoleModal = (props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async (data) => {
    try {
      const request = {
        ...data,
        acc: defaultTemplate,
      }
      const { temp_roll } = await settingsApi.createRole(request);
      await settingsApi.updateRole(temp_roll?.id, { acc: defaultTemplate });
      setTimeout(() => {
        props?.onGetRoles();
      }, 1500);
      toast.success("Role template successfully created!");
      props?.onClose();
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <CustomModal onClose={props?.onClose} open={props?.open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Create new role template
          </Typography>
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <TextField
              fullWidth
              autoFocus
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              label="Role template name"
              name="name"
              type="text"
              {...register("name")}
            />
          </Stack>
          <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
            <Button variant="contained" type="submit">
              Create
            </Button>
            <Button variant="outlined" onClick={props?.onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};
