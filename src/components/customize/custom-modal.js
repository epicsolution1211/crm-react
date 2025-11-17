import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const CustomModal = ({ children, onClose, open = false }) => (
  <Modal
    open={open ?? false}
    onClose={() => onClose()}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: "hidden",
      boxShadow: 24,
      minWidth: 400,
      p: 4,
      pt: 5,
    }}>
      {children}
    </Box>
  </Modal>
);

export default CustomModal;
