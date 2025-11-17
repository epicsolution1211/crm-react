import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { usePopover } from "src/hooks/use-popover";
import { useTwilio } from "src/hooks/use-twilio";
import { useCallProviders } from "src/hooks/call-system/useCallProviders";

export const ChatThreadToolbar = (props) => {
  const {
    ticket = {},
    internalChat = false,
    isEmailChat = false,
    ...other
  } = props;
  const popover = usePopover();
  const reminderPopover = usePopover();
  const priorityPopover = usePopover();
  const { allowed } = useTwilio();
  const providers = useCallProviders();

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          flexShrink: 0,
          minHeight: 64,
          px: 2,
          py: 1,
        }}
        {...other}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
            <Tooltip title="Ticket solved">
              <IconButton>
                <Iconify icon="line-md:confirm" width={30} color="success.main" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Normal priority">
              <IconButton
                ref={priorityPopover.anchorRef}
              >
                <Iconify icon="solar:tea-cup-bold" color="warning.main" width={30} />
              </IconButton>
            </Tooltip>
          <Menu
            anchorEl={priorityPopover.anchorRef.current}
            keepMounted
            onClose={priorityPopover.handleClose}
            open={priorityPopover.open}
          >
            <MenuItem>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="vaadin:fire" color={ticket?.priority === 3 ? "error.main" : "text.primary"} width={28} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 3 ? "error.main" : "text.primary"}
                >
                  High priority
                </Typography>
              </Stack>
            </MenuItem>

            <MenuItem>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="solar:tea-cup-bold" color={ticket?.priority === 1 ? "warning.main" : "text.primary"} width={30} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 1 ? "warning.main" : "text.primary"}
                >
                  Normal priority
                </Typography>
              </Stack>
            </MenuItem>

            <MenuItem>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton>
                  <Iconify icon="ion:snow" color={ticket?.priority === 2 ? "info.main" : "text.primary"} width={30} />
                </IconButton>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13 }}
                  color={ticket?.priority === 2 ? "info.main" : "text.primary"}
                >
                  Low priority
                </Typography>
              </Stack>
            </MenuItem>
          </Menu>
          {internalChat ? null : (
            <Tooltip title="Reminder">
              <IconButton
                ref={reminderPopover.anchorRef}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="line-md:calendar" width={26} />
              </IconButton>
            </Tooltip>
          )}
          {ticket?.in_call ? (
            <Tooltip title="Join call">
              <IconButton
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <Iconify icon="mage:phone-plus" width={26} />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Phone call">
                <IconButton
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <Iconify icon="line-md:phone-call" width={30} />
                </IconButton>
              </Tooltip>
              {providers?.find((p) => p.name === "Twilio")?.enabled &&
                allowed && !isEmailChat && (
                  <Tooltip title="Browser call">
                    <IconButton
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      <Iconify icon="material-symbols:call-to-action-outline-rounded" width={30} />
                    </IconButton>
                  </Tooltip>
                )}
            </>
          )}

          <Tooltip title="Chat settings">
            <IconButton
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="fluent:settings-chat-24-regular" width={30} />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton
              onClick={popover.handleOpen}
              ref={popover.anchorRef}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="ph:dots-three-bold" width={30} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );
};
