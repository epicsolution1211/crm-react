import { useCallback, useMemo, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AttachmentItem } from './attachment-item';
import { AttachmentUploadDialog } from './attachment-upload-dialog';
import { Iconify } from 'src/components/iconify';
import { todoApi } from 'src/api/todo';
import { useAuth } from 'src/hooks/use-auth';

export const AttachmentsInfo = ({ todo, mutate }) => {
  const { user } = useAuth();

  const canManage = useMemo(() => {
    return (todo?.creator?.id === user.id || (Array.isArray(todo?.participants) && todo?.participants.some(participant => participant.id === user.id)));
  }, [todo?.creator?.id, todo?.participants, user.id]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isAttachmentLoading, setIsAttachmentLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState({});

  const handleUploadAttachments = useCallback(async (files) => {
    try {
      setIsAttachmentLoading(true);
      await todoApi.updateToDo(todo.id, { attachments: files });
      await mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAttachmentLoading(false);
    }
  }, [todo, mutate]);

  const handleRemoveAttachment = useCallback(async (attachmentId) => {
    try {
      setIsRemoveLoading({ ...isRemoveLoading, [attachmentId]: true });
      await todoApi.updateToDo(todo.id, { attachment_ids_to_remove: [attachmentId] });
      await mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemoveLoading({ ...isRemoveLoading, [attachmentId]: false });
    }
  }, [todo, mutate]);

  return (
    <>
      <Stack direction="column" gap={2}>
        {Array.isArray(todo.attachments) && todo.attachments.length > 0 ? (
          <Stack spacing={1}>
            {todo.attachments.filter(attachment => attachment && attachment.id).map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                onRemove={handleRemoveAttachment}
                canRemove={canManage}
                isRemoveLoading={isRemoveLoading[attachment.id]}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No attachments
          </Typography>
        )}
        {canManage && (
          <Button
            startIcon={<Iconify icon="fluent:add-12-regular" width={20} />}
            onClick={() => setUploadDialogOpen(true)}
            variant="outlined"
            size="small"
            fullWidth
          >
            Add Attachment
          </Button>
        )}
      </Stack>
      <AttachmentUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUploadAttachments}
        isLoading={isAttachmentLoading}
      />
    </>
  );
};
