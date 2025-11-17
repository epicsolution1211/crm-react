import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { Avatar } from '@mui/material';

export const ConfirmDialog = ({
  title,
  titleIcon,
  description,
  open,
  onClose,
  confirmAction,
  confirmLabel = 'Delete',
  confirmColor = 'error',
  cancelLabel = 'Cancel',
  isLoading,
}) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pt: 2.5, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {titleIcon && (
          <Avatar sx={{ backgroundColor: `${confirmColor}.lightest`, color: `${confirmColor}.main`, width: 28, height: 28 }}>
            {titleIcon}
          </Avatar>
        )}
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>

      {description && <DialogContent sx={{ typography: 'body2' }}> {description} </DialogContent>}

      <DialogActions sx={{ px: 2.5, pb: 2 }}>
        <LoadingButton 
          loading={isLoading} 
          disabled={isLoading} 
          variant="contained" 
          color={confirmColor} 
          size='small'
          onClick={confirmAction}
        >
          {confirmLabel}
        </LoadingButton>

        <Button variant="outlined" onClick={onClose} size='small'>
          {cancelLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
