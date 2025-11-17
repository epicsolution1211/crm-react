import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentEditDialog } from './comment-edit-dialog';
import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { Iconify } from 'src/components/iconify';
import { TaskComment } from './comment';
import { TaskCommentAdd } from './comment-add';
import { todoApi } from 'src/api/todo';
import { useAuth } from 'src/hooks/use-auth';
import { useGetTodoComments } from 'src/hooks/swr/use-todo';

export const TaskContentComments = ({ todo }) => {
  const { user } = useAuth();

  const [commentEditDialogOpen, setCommentEditDialogOpen] = useState(false);
  const [commentDeleteDialogOpen, setCommentDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const { comments: todoComments, mutate: mutateComments } = useGetTodoComments(
    todo?.id ? { todo_id: todo.id, page: 1, per_page: 50 } : null
  );

  const handleCommentAdd = useCallback(async (content, mentions = []) => {
    try {
      setIsCommentLoading(true);
      await todoApi.createTodoComment({
        todo_id: todo.id,
        content,
        mentions
      });
      await mutateComments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommentLoading(false);
    }
  }, [todo, mutateComments]);

  const handleCommentEdit = useCallback(async (content, mentions = []) => {
    try {
      setIsCommentLoading(true);
      await todoApi.updateTodoComment(selectedComment.id, {
        todo_id: todo.id,
        content,
        mentions
      });
      await mutateComments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommentLoading(false);
    }
  }, [todo, selectedComment, mutateComments]);

  const handleCommentDelete = useCallback(async () => {
    try {
      setIsCommentLoading(true);
      await todoApi.deleteTodoComment(selectedComment.id);
      await mutateComments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommentLoading(false);
      setCommentDeleteDialogOpen(false);
      setSelectedComment(null);
    }
  }, [selectedComment, mutateComments]);

  const handleCommentEditOpen = useCallback((comment) => {
    setSelectedComment(comment);
    setCommentEditDialogOpen(true);
  }, []);

  const handleCommentDeleteOpen = useCallback((comment) => {
    setSelectedComment(comment);
    setCommentDeleteDialogOpen(true);
  }, []);

  return (
    <>
      <Stack spacing={2}>
        {Array.isArray(todoComments) && todoComments.length > 0 ? (
          [...todoComments].reverse().map((comment) => (
            <TaskComment
              key={comment.id}
              comment={comment}
              onEdit={handleCommentEditOpen}
              onDelete={handleCommentDeleteOpen}
              canEdit={comment.account_id === user.id}
              canDelete={comment.account_id === user.id || todo.creator?.id === user.id}
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Iconify icon="solar:chat-round-dots-linear" width={64} sx={{ color: 'text.disabled', mb: 3 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Comments Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to add a comment to this task
            </Typography>
          </Box>
        )}
        <TaskCommentAdd
          user={user}
          onAdd={handleCommentAdd}
          disabled={isCommentLoading}
          participants={todo?.participants || []}
          watchers={todo?.watchers || []}
        />
      </Stack>

      <CommentEditDialog
        open={commentEditDialogOpen}
        onClose={() => setCommentEditDialogOpen(false)}
        comment={selectedComment}
        onSave={handleCommentEdit}
        isLoading={isCommentLoading}
        participants={todo?.participants || []}
        watchers={todo?.watchers || []}
      />
      <ConfirmDialog
        open={commentDeleteDialogOpen}
        onClose={() => {
          setCommentDeleteDialogOpen(false);
          setSelectedComment(null);
        }} 
        title="Delete Comment"
        description="Are you sure want to delete this comment? This action cannot be undone."
        confirmAction={handleCommentDelete}
        isLoading={isCommentLoading}
      />
    </>
  );
};
