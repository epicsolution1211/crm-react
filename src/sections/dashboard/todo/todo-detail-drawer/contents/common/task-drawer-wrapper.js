import Drawer from '@mui/material/Drawer';

export const TaskDrawerWrapper = ({ children, onClose = () => {}, open = false }) => {
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          sx: {
            zIndex: 1500,
          }
        },
      }}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 500,
          zIndex: 1500,
        }
      }}
    >
      {children}
    </Drawer>
  );
};
