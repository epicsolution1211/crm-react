import { useEffect, useCallback, memo } from "react";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getAPIUrl } from "src/config";
import { Scrollbar } from "src/components/scrollbar";
import { useSettings } from "src/hooks/use-settings";
import { TableNoData } from "src/components/table-empty";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { getAssetPath } from "src/utils/asset-path";

const EventCard = memo(({ event, isFirst, isNewEvent, cssVars, paletteMode }) => (
  <Stack
    sx={{
      ...cssVars,
      backgroundColor: paletteMode === "dark" ? "var(--nav-bg)" : 'background.default',
      borderRadius: 2,
      boxShadow: 2,
      px: 3,
      py: 2,
      border: isFirst ? "2px solid" : "",
      borderColor: isFirst ? "success.main" : "",
      animation: isNewEvent && isFirst ? "flash-border 1s infinite" : "none",
    }}
    direction="row"
    alignItems="center"
    justifyContent="space-between"
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar 
        src={event?.avatar} 
        alt={`${event?.agent_first_name} ${event?.agent_last_name}`}
        sx={{ width: 32, height: 32 }} 
      />
      <Typography fontWeight={600} fontSize={20}>
        {`${event?.agent_first_name || ''} ${event?.agent_last_name || ''}`}
      </Typography>
    </Stack>
    <Typography fontWeight={600} fontSize={20}>
      ${event?.amount}
    </Typography>
  </Stack>
));

export const LeaderboardEvents = ({
  events = [],
  isNewEvent = false,
  setIsNewEvent,
  soundEnabled = false,
  leaderSound = ""
}) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const playEventSound = useCallback(async (event) => {
    if (!event) return null;

    const textToSpeech = `User ${event.agent_first_name} ${event.agent_last_name} deposit ${event.amount} in`;
    const defaultSound = getAssetPath("/assets/sounds/event.wav");
    const soundUrl = leaderSound
      ? leaderSound.includes("http")
        ? leaderSound
        : `${getAPIUrl()}/${leaderSound}`
      : defaultSound;

    let audio;
    let speech;

    try {
      audio = new Audio(soundUrl);
      speech = new SpeechSynthesisUtterance(textToSpeech);

      speech.onend = () => {
        if (!soundEnabled) return;
        audio.play().catch(console.error);
      };

      audio.onended = () => {
        setIsNewEvent(false);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);

      return () => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
        window.speechSynthesis.cancel();
      };
    } catch (error) {
      console.error('Error playing sound:', error);
      // Clean up resources even if there's an error
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      window.speechSynthesis.cancel();
      return null;
    }
  }, [leaderSound, soundEnabled, setIsNewEvent]);

  useEffect(() => {
    let cleanup = null;

    if (isNewEvent && events?.length) {
      // Since playEventSound is async, we need to handle the promise
      playEventSound(events[0])
        .then(cleanupFn => {
          cleanup = cleanupFn;
        })
        .catch(console.error);
    }

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [isNewEvent, events, playEventSound]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, width: 1 }}>
      <Stack alignItems="flex-start" spacing={3} width={1}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Events
        </Typography>

        {!events?.length && (
          <Stack width={1} alignItems="center">
            <TableNoData />
          </Stack>
        )}
        <Scrollbar sx={{ maxHeight: "650px", width: 1 }}>
          <Stack spacing={2} width={1}>
            {events?.map((event, idx) => (
              <EventCard
                key={event?.id}
                event={event}
                isFirst={idx === 0}
                isNewEvent={isNewEvent}
                cssVars={cssVars}
                paletteMode={settings.paletteMode}
              />
            ))}
          </Stack>
        </Scrollbar>
      </Stack>
    </Card>
  );
};
