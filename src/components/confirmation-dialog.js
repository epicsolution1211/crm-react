import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";

import { Iconify } from 'src/components/iconify';

export const ConfirmationDialog = (props) => {
  const { open, onClose, onConfirm, title, subtitle, confirmTitle } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm">
        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: "flex",
            p: 3,
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "error.lightest",
              color: "error.main",
            }}
          >
            <Iconify icon="material-symbols:info-outline" />
          </Avatar>
          <div>
            <Typography variant="h5">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
              {subtitle}
            </Typography>
          </div>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pb: 3,
            px: 3,
          }}
        >
          <Button color="inherit" sx={{ mr: 2 }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm}>{confirmTitle}</Button>
        </Box>
      </Container>
    </Dialog>
  );
};
