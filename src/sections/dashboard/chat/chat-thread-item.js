import { useMemo } from "react";
import Avatar, { avatarClasses } from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format, differenceInDays, differenceInYears, isYesterday, startOfDay } from "date-fns";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import { SeverityPill } from "src/components/severity-pill";
import { getAPIUrl } from "src/config";

export const ChatThreadItem = (props) => {
  const { active = false, thread, onSelect, clientChat = false, ...other } = props;

  const lastActivity = thread?.last_message_at;

  const isDateYesterday = useMemo(
    () =>
      lastActivity
        ? isYesterday(startOfDay(new Date(lastActivity)))
        : isYesterday(startOfDay(new Date())),
    [lastActivity]
  );

  const timeFormat = useMemo(() => {
    const diffInDays = lastActivity
      ? differenceInDays(
        startOfDay(new Date()),
        startOfDay(new Date(lastActivity))
      )
      : 0;
    const diffInYears = lastActivity
      ? differenceInYears(
        startOfDay(new Date()),
        startOfDay(new Date(lastActivity))
      )
      : 0;
    if (diffInDays <= 1) {
      return "h:mm a";
    }
    if (diffInDays > 1 && diffInDays <= 7) {
      return "EEE h:mm a";
    }
    if (diffInDays > 7 && diffInYears < 1) {
      return "MMM d h:mm a";
    }
    if (diffInYears >= 1) {
      return "YYY MMM dd";
    }
  }, [lastActivity]);

  return (
    <Stack
      component="li"
      direction="row"
      onClick={onSelect}
      spacing={2}
      sx={{
        borderRadius: 2.5,
        cursor: "pointer",
        pr: 2,
        pl: 3,
        py: 2,
        mb: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...(active && {
          backgroundColor: "action.hover",
        }),
      }}
      {...other}
    >
      {!clientChat && (
        <div>
          <AvatarGroup
            max={2}
            sx={{
              [`& .${avatarClasses.root}`]:
                thread?.participant_accounts?.length > 0
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
            color={thread?.client?.active ? "success" : "warning"}
            variant="dot"
          >
            {thread?.client && (
              <Badge
                anchorOrigin={{
                  horizontal: "right",
                  vertical: "bottom",
                }}
                color={thread?.client?.active ? "success" : "warning"}
                variant="dot"
              >
                <Avatar
                  src={thread?.client?.avatar ? thread?.client?.avatar?.includes('http') ? thread?.client?.avatar : `${getAPIUrl()}/${thread?.client?.avatar}` : ""}
                />
              </Badge>
            )}
            {thread?.participant_accounts?.length === 1
              ? thread?.participant_accounts.map((recipient) => (
                <Badge
                  key={recipient}
                  anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                  }}
                  color={recipient?.on_duty ? "success" : "warning"}
                  variant="dot"
                >
                  <Avatar
                    key={recipient.id}
                    src={recipient.avatar ? recipient.avatar?.includes('http') ? recipient.avatar : `${getAPIUrl()}/${recipient.avatar}` : ""}
                  />
                </Badge>
              ))
              : thread?.participant_accounts?.length > 1
                ? thread?.participant_accounts?.map((recipient) => (
                  <Avatar
                    key={recipient.id}
                    src={recipient.avatar ? recipient.avatar?.includes('http') ? recipient.avatar : `${getAPIUrl()}/${recipient.avatar}` : ""}
                  />
                ))
                : null}
          </AvatarGroup>
        </div>
      )}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Typography noWrap variant="subtitle2">
            {thread?.conversation?.name}
          </Typography>
          <Stack direction="row" spacing={.5} alignItems="center" justifyContent="center">
            <Typography noWrap color="text.secondary" variant="caption">
              {isDateYesterday ? "Yesterday" : ""}{" "}
              {lastActivity
                ? format(new Date(lastActivity), timeFormat)
                : format(new Date(), timeFormat)}
            </Typography>
            {!thread?.open && (
              <Iconify icon="material-symbols:check" color="success.main" width={17}/>
            )}
            {thread?.pending && (
              <Iconify icon="hugeicons:pause" width={17} color="success.main" />
            )}
            {thread?.priority === 1 ? (
              <Iconify icon="solar:tea-cup-bold" color="warning.main" width={17} />
            ) : thread?.priority === 2 ? (
              <Iconify icon="ion:snow" color="info.main" width={17} />
            ) : thread?.priority === 3 ? (
              <Iconify icon="vaadin:fire" color="error.main" width={17} />
            ) : null}
            {thread?.conversation?.chat_summary && (
              <Tooltip title={thread?.conversation?.chat_summary}>
                <Iconify icon="healthicons:artificial-intelligence" color="primary.main" width={17} />
              </Tooltip>
            )}
          </Stack>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          mt={1}
          minHeight={20}
          sx={{ width: "100%" }}
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ width: thread?.unread_count > 0 ? "50%" : "65%" }}
          >
            <Typography
              color="text.secondary"
              noWrap
              sx={{
                flexGrow: 1,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "100%",
                maxHeight: "40px",
              }}
              variant="subtitle2"
            >
              <div dangerouslySetInnerHTML={{ __html: thread?.last_message }} />
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            {thread?.labels?.length > 0 ? (
              <>
                {thread?.labels?.map((label) => (
                  <Tooltip title={label?.name} key={label?.id}>
                    <SeverityPill color="info">
                      <Tooltip title={label?.name}>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            lineHeight: 2,
                            letterSpacing: 0.5,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {label?.name}
                        </Typography>
                      </Tooltip>
                    </SeverityPill>
                  </Tooltip>
                ))}
              </>
            ) : null}
            {thread?.unread_count > 0 && (
              <Chip size="small" label={thread?.unread_count} />
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
