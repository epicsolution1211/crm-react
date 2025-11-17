import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { customersApi } from "src/api/customers";
import CustomModal from "src/components/customize/custom-modal";
import * as yup from "yup";

const validationSchema = yup.object({
  comment: yup.string().required("Comment is a required field"),
});

export const CustomerPostEdit = ({ open, onClose, comment, customerId, onGetComments }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (comment) {
      setValue("comment", comment?.comment);
    }
  }, [comment]);

  const onCommentSubmit = async (data) => {
    try {
      const request = {
        client_id: customerId,
        comment: data?.comment,
      };
      await customersApi.updateClientPost(comment?.id, request);
      setTimeout(() => {
        onGetComments();
      }, 1500);
      onClose();
      reset();
      toast.success("Client post successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <CustomModal
      onClose={() => {
        onClose(false);
        reset();
      }}
      open={open}
    >
      <form onSubmit={handleSubmit(onCommentSubmit)}>
        <Stack spacing={2}>
          <Typography
            id="modal-modal-title"
            align="center"
            sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
          >
            Edit Post
          </Typography>
          <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
            <TextField
              fullWidth
              autoFocus
              multiline
              error={!!errors?.comment?.message}
              helperText={errors?.comment?.message}
              label="Comment"
              name="comment"
              type="text"
              {...register("comment")}
            />
          </Stack>
          <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomModal>
  )
}