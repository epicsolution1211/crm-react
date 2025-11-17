import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import { CustomerCommentEdit } from "./customer-comment-edit";
import { DeleteModal } from "src/components/customize/delete-modal";
import { commentsApi } from "src/api/comments";
import { useAuth } from "src/hooks/use-auth";
import { useTimezone } from "src/hooks/use-timezone";

export const CustomerCommentsTab = ({ customerId, setModalOpen, comments, getComments }) => {
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteComment = async () => {
    setIsDeleteLoading(true);
    try {
      await commentsApi.deleteComment(selectedCommentId);
      toast.success("Comment successfully deleted!");
      setSelectedCommentId(null);
      setDeleteOpen(false);
      setTimeout(() => {
        getComments();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
    setIsDeleteLoading(false);
  };

  const handleClickPin = async (comment) => {
    try {
      const request = {
        pinned: comment?.pinned ? false : true,
        client_id: customerId,
        comment: comment?.comment,
      }
      await commentsApi.updateComment(comment?.id, request);
      toast.success(comment?.pinned ? "Comment successfully unpinned!" : "Comment successfully pinned!");
      setTimeout(() => {
        getComments();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  }

  const steps = useMemo(() => {
    const pinnedComments = comments?.filter(item => item?.pinned);
    const unpinnedComments = comments?.filter(item => !item?.pinned);

    return (
      [...pinnedComments, ...unpinnedComments]?.map((comment) => {
        if (!user?.acc?.acc_v_client_comment_s &&
          comment?.account_id === user?.id) {
          return null;
        }
        if (!user?.acc?.acc_v_client_comment_o &&
          comment?.account_id !== user?.id) {
          return null;
        }
        return (
          {
            labelRender: () => {
              return (
                <Stack direction='row' justifyContent='space-between'>
                  <Typography sx={{ px: 1 }}>{comment?.account_id ? comment.account_name : "System"}</Typography>
                  <Typography sx={{ px: 1 }}>{toLocalTime(comment?.created_at, "dd MMM yyyy HH:mm")}</Typography>
                </Stack>);
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
                <Box dangerouslySetInnerHTML={{ __html: comment?.comment?.replace(/\n/g, "<br>") }} />
                <Stack direction='row' gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClickPin(comment);
                    }}>
                    <Iconify icon={comment?.pinned? "clarity:pin-solid" : "clarity:pin-line"} width={28} color={ comment?.pinned? "primary.main" : "text.disabled" }/>
                  </IconButton>
                  {user?.acc?.acc_e_client_comment_s &&
                    comment?.account_id === user?.id ? (
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
                  ) : user?.acc?.acc_e_client_comment_o &&
                    user?.id !== comment?.account_id ? (
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
                  ) : null}
                  {user?.acc?.acc_e_client_comment_s &&
                    comment?.account_id === user?.id ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedCommentId(comment?.id);
                        setDeleteOpen(true);
                      }}
                      sx={{ '&:hover': { color: 'error.main' }}}
                    >
                      <Iconify icon="heroicons:trash" />
                    </IconButton>
                  ) : user?.acc?.acc_e_client_comment_o &&
                    user?.id !== comment?.account_id ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedCommentId(comment?.id);
                        setDeleteOpen(true);
                      }}
                      sx={{ '&:hover': { color: 'error.main' }}}
                    >
                      <Iconify icon="heroicons:trash" />
                    </IconButton>
                  ) : null}
                </Stack>
              </Stack>
            )
          }
        );
      }));
  }, [comments])


  return (
    <Card>
      <CardHeader
        title={
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant={"h6"}>Comments</Typography>
            <Button variant={"contained"} onClick={() => setModalOpen(true)}>
              + Add
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Stepper
          orientation="vertical">
          {steps?.filter(s => s)?.map((step, index) => (
            <Step
              active
              key={index}>
              <StepLabel>
                {step?.labelRender()}
              </StepLabel>
              <StepContent>
                {step?.contentRender()}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </CardContent>

      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        onDelete={deleteComment}
        title={"Delete Comment"}
        description={"Are you sure you want to delete this comment?"}
      />

      <CustomerCommentEdit
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onGetComments={getComments}
        customerId={customerId}
        comment={commentToEdit}
      />
    </Card>
  );
};
