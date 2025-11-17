import { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar, { avatarClasses } from "@mui/material/Avatar";
import Badge from '@mui/material/Badge';
import AvatarGroup from "@mui/material/AvatarGroup";
import { format, differenceInDays, differenceInYears, isYesterday, startOfDay } from "date-fns";
import { getAPIUrl } from "src/config";

export const ChatThreadItem = (props) => {
  const { active = false, thread, onSelect, ...other } = props;
  const account_id = parseInt(localStorage.getItem('account_id'));
  const unReadCount = thread?.unread_count ?? 0;

  const avatar = useMemo(() => {
    if (thread?.participant_accounts?.length === 2) {
      const avatar = thread?.participant_accounts?.find((item) => (item?.id !== account_id))?.avatar;
      return avatar;
    } else if (thread?.participant_accounts?.length === 1) {
      return thread?.participant_accounts[0]?.avatar;
    } return thread?.conversation?.avatar;
  }, [thread]);

  const isActive = useMemo(() => {
    if (thread?.participant_accounts?.length === 2) {
      const chatMember = thread?.participant_accounts?.filter((item) => (item?.id !== account_id));
      return chatMember[0]?.on_duty ? 'success' : 'warning';
    } else if (thread?.participant_accounts?.length === 1) {
      return thread?.participant_accounts[0]?.on_duty ? 'success' : 'warning';
    } return 'warning';
  }, [thread, thread?.participant_accounts]);

  const lastActivity = thread?.last_message?.updated_at;

  const isDateYesterday = useMemo(() => (
    lastActivity ? isYesterday(startOfDay(new Date(lastActivity))) : isYesterday(startOfDay(new Date()))
  ), [lastActivity]);

  const timeFormat = useMemo(() => {
    const diffInDays = lastActivity ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(lastActivity))) : 0;
    const diffInYears = lastActivity ? differenceInYears(startOfDay(new Date()), startOfDay(new Date(lastActivity))) : 0;
    if (diffInDays <= 1) {
      return "h:mm a";
    }
    if (diffInDays > 1 && diffInDays <= 7) {
      return "EEE h:mm a"
    }
    if (diffInDays > 7 && diffInYears < 1) {
      return "MMM d h:mm a"
    }
    if (diffInYears >= 1) {
      return "YYY MMM dd"
    }
  }, [lastActivity]);

  return (
    <Stack
      component="li"
      direction="row"
      onClick={onSelect}
      spacing={2}
      sx={{
        borderRadius: 1,
        cursor: "pointer",
        px: 3,
        py: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...(active && {
          backgroundColor: "action.hover",
        }),
      }}
      {...other}
    >
      <Box>
        <AvatarGroup
          max={2}
          sx={{
            [`& .${avatarClasses.root}`]: thread?.participant_accounts?.length > 2
              ? {
                height: 30,
                width: 30,
                "&:nth-of-type(2)": {
                  mt: "10px",
                },
              }
              : {
                height: 40,
                width: 40,
              },
          }}
          color={thread.ticket?.client?.active ? 'success' : 'warning'}
          variant="dot"
        >
          {thread?.participant_accounts?.length <= 2 ?
            <Box sx={{ px: 1 }}>
              <Badge
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom'
                }}
                color={isActive}
                variant="dot"
              >
                <Avatar
                  src={avatar ? avatar?.includes('http') ? avatar : `${getAPIUrl()}/${avatar}` : ""}
                />
              </Badge>
            </Box>
            : thread?.participant_accounts?.length > 2 ?
              thread?.participant_accounts?.filter((item) => (item?.id !== account_id))?.map((recipient, index) => (
                <Badge
                  key={index}
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom'
                  }}
                  color={recipient?.on_duty ? 'success' : 'warning'}
                  variant="dot"
                >
                  <Avatar
                    key={recipient.id}
                    src={recipient.avatar ? recipient.avatar?.includes('http') ? recipient.avatar : `${getAPIUrl()}/${recipient.avatar}` : ""}
                    sx={{ mt: 1 }}
                  />
                </Badge>
              ))
              : null
          }
        </AvatarGroup>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          gap={1}>
          <Typography noWrap
            sx={{ flexGrow: 1, whiteSpace: "nowrap", textOverflow: 'ellipsis', overflow: 'hidden', width: "60%" }}
            variant="subtitle2">
            {thread?.name}
          </Typography>
          <Stack direction="column"
            spacing={1}
            alignItems="flex-end">
            <Typography
              color="text.secondary"
              variant="caption"
            >
              {isDateYesterday ? 'Yesterday' : ''} {lastActivity ? format(new Date(lastActivity), timeFormat) : format(new Date(), timeFormat)}
            </Typography>
          </Stack>
        </Stack>
        <Stack alignItems="center"
          direction="row"
          spacing={1}
          mt={1}
          minHeight={20}
          justifyContent='space-between'>
          <Stack
            direction='row'
            alignItems='center'
            gap={1}
            sx={{ width: unReadCount > 0 ? '85%' : '100%' }}>
            <Typography
              color="text.secondary"
              noWrap
              sx={{ flexGrow: 1, whiteSpace: "nowrap", textOverflow: 'ellipsis', overflow: 'hidden', width: "80%" }}
              variant="subtitle2"
            >
              {thread?.last_message_by_id === account_id && !!thread?.last_message ? 'You:' : null} {thread?.last_message ?? ''}
            </Typography>
          </Stack>
          {unReadCount > 0 && <Chip
            size="small"
            label={unReadCount} />}
        </Stack>
      </Box>
    </Stack>
  );
};

ChatThreadItem.propTypes = {
  active: PropTypes.bool,
  onSelect: PropTypes.func,
  thread: PropTypes.object.isRequired,
};
