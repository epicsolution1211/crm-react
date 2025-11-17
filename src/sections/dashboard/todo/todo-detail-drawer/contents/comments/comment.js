import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from 'src/config';
import { generateAvatarColors } from 'src/utils/functions';
import { MentionsRenderer } from './mentions-renderer';

export const TaskComment = (props) => {
  const { comment, onEdit, onDelete, canEdit, canDelete, ...other } = props;
  const avatar = comment.account?.avatar || comment.user?.avatar || undefined;
  const authorName = comment.account?.name || comment.user?.name || 'Unknown User';
  const content = comment.content || comment.message || '';
  const createdAt = comment.created_at || comment.createdAt;
  
  const relativeTime = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';
  const absoluteTime = createdAt ? format(new Date(createdAt), 'MMM dd, yyyy \'at\' hh:mm a') : '';

  const { bgcolor, color } = generateAvatarColors(comment?.account?.name ?? '');

  const handleEdit = () => {
    onEdit?.(comment);
  };

  const handleDelete = () => {
    onDelete?.(comment);
  };

  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      spacing={2}
      {...other}>
      <Avatar 
        src={avatar ? `${getAPIUrl()}/${avatar}` : ""}
        sx={{ width: 32, height: 32, color: color, bgcolor: bgcolor }}
      >
        {authorName?.split(' ').map(name => name?.charAt(0)).join('')}
      </Avatar>
      <Stack
        spacing={1}
        sx={{ flexGrow: 1 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">
              {authorName}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {canEdit && (
              <IconButton 
                size="small" 
                onClick={handleEdit}
                sx={{ 
                  opacity: 0.8,
                  color: 'primary.main',
                  '&:hover': { 
                    opacity: 1,
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                <Iconify icon="solar:pen-linear" width={18} />
              </IconButton>
            )}
            {canDelete && (
              <IconButton 
                size="small" 
                onClick={handleDelete}
                sx={{ 
                  opacity: 0.8,
                  color: 'error.main',
                  '&:hover': { 
                    opacity: 1,
                    backgroundColor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                <Iconify icon="solar:trash-bin-trash-linear" width={18} />
              </IconButton>
            )}
          </Stack>
        </Stack>
        <Paper
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.50',
            p: 1
          }}
          variant="outlined"
        >
          <Typography variant="body2">
            <MentionsRenderer 
              text={content} 
              mentionedAccounts={comment.mentioned_accounts || []}
            />
          </Typography>
        </Paper>
        <Typography
          color="text.secondary"
          component="p"
          variant="caption"
          title={absoluteTime}
        >
          {relativeTime}{comment.created_at !== comment.updated_at ? ' (edited)' : ''}
        </Typography>
      </Stack>
    </Stack>
  );
};

TaskComment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  participants: PropTypes.array
}; 