import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';

import CustomModal from "src/components/customize/custom-modal";

export const DeleteModal = ({ isOpen, setIsOpen, onDelete = () => { }, title, description, isLoading = false, buttonTitle = "Delete" }) => {
  return (
    <CustomModal
      onClose={() => setIsOpen(false)}
      open={isOpen ?? false}>
      <Stack sx={{ textAlign: "center" }}
        style={{ maxWidth: "450px" }}
        spacing={2}>
        {!!title && <Typography
          id="modal-modal-title"
          sx={{ fontSize: 22, fontWeight: 'bold' }}
        >
          {title}
        </Typography>}
        {!!description && <Typography
          id="modal-modal-title"
          sx={{ fontSize: 18, pb: 2 }}>
          {description}
        </Typography>}
        <Stack
          sx={{ gap: 2 }}
          direction="row"
          justifyContent="center">
          <LoadingButton
            variant="contained"
            color='error'
            loading={isLoading}
            onClick={() =>  onDelete()}
          >
            {buttonTitle??""}
          </LoadingButton>
          <Button
            variant="outlined"
            color='error'
            onClick={() => setIsOpen(false)}>Cancel</Button>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
