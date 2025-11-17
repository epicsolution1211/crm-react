import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";

export const TransferOwnerDialog = ({
  open,
  onClose,
  onConfirm,
  memberName,
  settings,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-owner-dialog-title"
      aria-describedby="transfer-owner-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: settings?.paletteMode === "dark" ? "#1a1a2e" : "#ffffff",
          border: settings?.paletteMode === "dark" 
            ? "1px solid rgba(255, 255, 255, 0.1)" 
            : "1px solid rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        id="transfer-owner-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Iconify
            icon="material-symbols:crown-outline-rounded"
            sx={{
              fontSize: 20,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
          }}
        >
          Transfer Ownership
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="transfer-owner-dialog-description"
          sx={{
            color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to transfer ownership to{" "}
          <strong style={{ color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827" }}>
            {memberName}
          </strong>
        </DialogContentText>
        <Box sx={{ mt: 2, pl: 2 }}>
          <Stack spacing={1}>
            <Typography
              variant="body2"
              sx={{
                color: settings?.paletteMode === "dark" ? "#9CA3AF" : "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Iconify
                icon="heroicons:exclamation-triangle"
                sx={{
                  fontSize: 16,
                  color: "primary",
                }}
              />
              This action cannot be undone
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: settings?.paletteMode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            color: settings?.paletteMode === "dark" ? "#F9FAFB" : "#111827",
            "&:hover": {
              borderColor: settings?.paletteMode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
              background: settings?.paletteMode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: "10px",
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            background: "primary",
            color: "white",
            "&:hover": {
              background: "primary",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px primary",
            },
            transition: "all 0.3s ease-in-out",
          }}
        >
          Transfer Ownership
        </Button>
      </DialogActions>
    </Dialog>
  );
};
