import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { useSettings } from "src/hooks/use-settings";
import { TableNoData } from "src/components/table-empty";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";

const EventCard = ({ event, isFirst, cssVars, paletteMode }) => (
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
);

export const LeaderboardEvents = ({ events = [] }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

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
          <Stack spacing={3} width={1}>
            {events?.map((event, idx) => (
              <EventCard
                key={event?.id}
                event={event}
                isFirst={idx === 0}
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
