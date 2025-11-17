import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { settingsApi } from "src/api/settings";
import { useForm, Controller } from "react-hook-form";
import CustomModal from "src/components/customize/custom-modal";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const AddDeskModal = ({ onGetDesks, onClose, open }) => {
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    reset();
    setValue("is_default", false);
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await settingsApi.createDesk(data);
      setTimeout(() => {
        onGetDesks();
      }, 1500);
      toast.success("Desk successfully created!");
      onClose();
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const chipColor = watch("color");

  return (
    <CustomModal onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Create new Desk
          </Typography>
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <TextField
              fullWidth
              autoFocus
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              label="Desk name"
              name="name"
              type="text"
              {...register("name")}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            justifyContent="space-between"
          >
            <Controller
              name="is_default"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  sx={{ userSelect: "none" }}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(event) => onChange(event?.target?.checked)}
                    />
                  }
                  label="Default desk"
                />
              )}
            />
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="h7" sx={{ fontWeight: 600 }}>
                Color:
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <label htmlFor="color">
                  <Chip
                    label={chipColor ?? "Default"}
                    color="primary"
                    sx={{ backgroundColor: chipColor ?? "" }}
                  />
                </label>
                <input
                  style={{ visibility: "hidden", width: "0px", height: "0px" }}
                  id="color"
                  type="color"
                  {...register("color")}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
            <Button variant="contained" type="submit">
              Create
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};
