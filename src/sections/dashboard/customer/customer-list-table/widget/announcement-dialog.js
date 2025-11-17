import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const AnnouncementDialog = ({ 
  open, 
  onClose, 
  announcements, 
  onAssign 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Assign Announcement</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {announcements.map((announcement) => (
            <Stack 
              key={announcement.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Typography>{announcement.title}</Typography>
              <Button 
                variant="contained"
                onClick={() => onAssign(announcement.id)}
              >
                Assign
              </Button>
            </Stack>
          ))}
          {announcements.length === 0 && (
            <Typography color="text.secondary" align="center">
              No announcements available
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}; 