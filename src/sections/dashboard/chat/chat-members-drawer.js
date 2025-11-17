import PropTypes from "prop-types";

import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

export const ChatMembersDrawer = (props) => {
  const { onClose, open, participants = [], ...other } = props;

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{
            px: 3,
            pt: 2,
          }}
        >
          <Typography variant="h5">Conversation members</Typography>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <IconButton color="inherit" onClick={onClose}>
              <Iconify icon="iconamoon:close" width={24} />
            </IconButton>
          </Stack>
        </Stack>

        <Stack spacing={5} sx={{ p: 3, mt: 5 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Members</Typography>
            <Stack>
              {participants?.map((member) => (
                <TableRow hover key={member.id} sx={{ cursor: "pointer" }}>
                  <TableCell sx={{ border: 0 }}>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Avatar
                        src={member?.avatar ? member?.avatar?.includes('http') ? member?.avatar : `${getAPIUrl()}/${member?.avatar}` : ""}
                      />
                      <Typography variant="subtitle2">
                        {member?.first_name} {member?.last_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

ChatMembersDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  conversationId: PropTypes.string,
  participants: PropTypes.array,
  onParticipantsGet: PropTypes.func,
};
