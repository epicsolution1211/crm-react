import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";


import CustomModal from "src/components/customize/custom-modal";

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters"),
});

export const AddMetabaseGroupModal = ({ open, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal
      onClose={handleClose}
      open={open}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3} sx={{ minWidth: 400 }}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Add Report Group
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              InputLabelProps={{ shrink: true }}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Description"
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Stack>

          <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isLoading}
            >
              Create
            </LoadingButton>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  );
};

AddMetabaseGroupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}; 