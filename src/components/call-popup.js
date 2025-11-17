/* eslint-disable no-unused-vars */
import Stack from "@mui/material/Stack";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { useCallback, useState } from "react";
import { chatApi } from "src/api/chat";
import { useTwilio } from "src/hooks/use-twilio";
import CountUp from "./count-up";
import { RouterLink } from "./router-link";
import { paths } from "src/paths";
import { getAPIUrl } from "src/config";
import { Iconify } from "src/components/iconify";

export const CallPopup = (props) => {
  const {
    conversationId,
    ticketId,
    customerId,
    chatToken,
    participants = [],
  } = props;
  const [muted, setMuted] = useState(false);
  const [whisper, setWhisper] = useState(false);
  const [paused, setPaused] = useState(false);

  const { muteExternal, muteInternal } = useTwilio();

  const handleCallHangUp = useCallback(async () => {
    await chatApi.callControl({
      end_call: true,
      conversation_id: conversationId,
    });
  }, [conversationId]);

  const handleMuteControl = useCallback(async () => {
    await chatApi.callControl({
      mute: !muted,
      conversation_id: conversationId,
    });

    if (muted) {
      if (!whisper) {
        muteExternal(false);
      }
      muteInternal(false);
    } else {
      muteExternal(true);
      muteInternal(true);
    }

    setMuted(!muted);
  }, [conversationId, muted, muteExternal, muteInternal, whisper]);

  const handleWhisperControl = useCallback(async () => {
    await chatApi.callControl({
      whisper: !whisper,
      conversation_id: conversationId,
    });

    if (!whisper) muteExternal(true);
    setWhisper(!whisper);
  }, [conversationId, muteExternal, whisper]);

  const handleLeaveCall = useCallback(async () => {
    await chatApi.callControl({ leave: true, conversation_id: conversationId });
  }, [conversationId]);

  return (
    <Card
      elevation={16}
      sx={{
        position: "fixed",
        top: 67,
        left: "40%",
        width: 600,
        zIndex: 10000,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="column" spacing={1} alignItems="flex-start">
            {participants.length ? (
              <AvatarGroup>
                {participants.map((participant) => (
                  <Tooltip
                    title={`${participant?.first_name} ${participant?.last_name}`}
                  >
                    <Stack direction="column" alignItems="flex-start">
                      <Avatar
                        src={participant.avatar ? participant.avatar?.includes('http') ? participant.avatar : `${getAPIUrl()}/${participant.avatar}` : ""}
                      />
                      <Stack direction="row" spacing={1}>
                        {participant.mute && (
                          <Iconify icon="mage:microphone-mute" />
                        )}
                        {participant.whisper && (
                          <Iconify icon="heroicons:signal-20-solid" />
                        )}
                      </Stack>
                    </Stack>
                  </Tooltip>
                ))}
              </AvatarGroup>
            ) : null}

            <Typography
              component={RouterLink}
              href={
                paths.dashboard.chat +
                `?customer=${customerId}` +
                `&conversationId=${conversationId}` +
                `&ticketId=${ticketId}` +
                `&returnTo=detail`
              }
            >
              Open conversation
            </Typography>
          </Stack>
          <CountUp />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Pause">
              <IconButton sx={{ color: paused ? "red" : "" }}>
                <Iconify icon="ph:phone-pause" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Whisper">
              <IconButton
                onClick={handleWhisperControl}
                sx={{ color: whisper ? "red" : "" }}
              >
                <Iconify icon="heroicons:signal-20-solid" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Mute">
              <IconButton
                onClick={handleMuteControl}
                sx={{ color: muted ? "red" : "" }}
              >
                <Iconify icon="mage:microphone-mute" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Hang up">
              <IconButton sx={{ color: "red" }} onClick={handleCallHangUp}>
                <Iconify icon="eva:phone-off-outline" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Leave call">
              <IconButton sx={{ color: "red" }} onClick={handleLeaveCall}>
                <Iconify icon="lsicon:user-leave-outline" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
