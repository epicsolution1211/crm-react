import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from 'src/components/iconify';
import { CustomerPostEdit } from "./customer-post-edit";
import { DeleteModal } from "src/components/customize/delete-modal";
import { customersApi } from "src/api/customers";
import { useMounted } from "src/hooks/use-mounted";
import { getAssetPath } from "src/utils/asset-path";

const validationSchema = yup.object({
  comment: yup.string().required("Comment is a required field"),
});

export const CustomerPosts = ({ customerId }) => {
  const isMounted = useMounted();
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);

  const getComments = async () => {
    try {
      const response = await customersApi.getClientPosts({
        client_id: customerId,
      });
      if (isMounted()) {
        setComments(response?.comments);
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onCommentSubmit = async (data) => {
    try {
      const request = {
        client_id: customerId,
        comment: data?.comment,
      };
      await customersApi.createClientPost(request);
      setTimeout(() => {
        getComments();
      }, 1500);
      setModalOpen(false);
      reset();
      toast.success("Client post successfully created!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const deleteComment = async () => {
    try {
      await customersApi.deleteClientPost(commentToDelete);
      toast.success("Post successfully deleted!");
      setCommentToDelete(null);
      setDeleteOpen(false);
      setTimeout(() => {
        getComments();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const steps = useMemo(
    () =>
      comments?.map((comment) => {
        return {
          labelRender: () => {
            return (
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ px: 1 }}>
                  {comment?.account_id ? comment.account_name : "System"}
                </Typography>
                <Typography sx={{ px: 1 }}>
                  {format(new Date(comment?.created_at), "dd MMM yyyy HH:mm")}
                </Typography>
              </Stack>
            );
          },
          contentRender: () => (
            <Stack
              direction={"row"}
              alignItems={"start"}
              spacing={2}
              py={1}
              justifyContent={"space-between"}
              key={comment?.id}
            >
              <Box
                dangerouslySetInnerHTML={{
                  __html: comment?.comment?.replace(/\n/g, "<br>"),
                }}
              />
              <Stack direction="row" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setCommentToEdit(comment);
                    setEditOpen(true);
                  }}
                  sx={{ '&:hover': { color: 'primary.main' }}}
                >
                  <Iconify icon="mage:edit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setCommentToDelete(comment?.id);
                    setDeleteOpen(true);
                  }}
                  sx={{ '&:hover': { color: 'error.main' }}}
                >
                  <Iconify icon="heroicons:trash" />
                </IconButton>
              </Stack>
            </Stack>
          ),
        };
      }),
    [comments]
  );

  useEffect(() => {
    getComments();
  }, [customerId]);

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant={"h6"}>Posts</Typography>
            <Button variant={"contained"} onClick={() => setModalOpen(true)}>
              + Add
            </Button>
          </Stack>
        }
      />
      <CardContent>
        {comments?.length > 0 ? (
          <Stepper orientation="vertical">
            {steps
              ?.filter((s) => s)
              ?.map((step, index) => (
                <Step active key={index}>
                  <StepLabel>{step?.labelRender()}</StepLabel>
                  <StepContent>{step?.contentRender()}</StepContent>
                </Step>
              ))}
          </Stepper>
        ) : (
          <Box
            sx={{
              pb: 5,
              mt: 3,
              maxWidth: 1,
              alignItems: "center",
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={getAssetPath("/assets/errors/error-404.png")}
              sx={{
                height: "auto",
                maxWidth: 120,
              }}
            />
            <Typography
              color="text.secondary"
              sx={{ mt: 2 }}
              variant="subtitle1"
            >
              There are no posts yet
            </Typography>
          </Box>
        )}
      </CardContent>

      <CustomModal
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        open={modalOpen}
      >
        <form onSubmit={handleSubmit(onCommentSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Create Post
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                multiline
                error={!!errors?.comment?.message}
                helperText={errors?.comment?.message}
                label="Post"
                type="text"
                {...register("comment")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button variant="contained" type="submit">
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>

      <DeleteModal
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        onDelete={deleteComment}
        title={"Delete Post"}
        description={"Are you sure you want to delete this post?"}
      />

      <CustomerPostEdit
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onGetComments={getComments}
        customerId={customerId}
        comment={commentToEdit}
      />
    </Card>
  );
};
