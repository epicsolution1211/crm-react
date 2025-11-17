import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import { AgentActivity } from "./agent-activity";
import { AgentBrand } from "./agent-brand";
import { AgentClosePositions } from "./agent-close-position";
import { AgentCountry } from "./agent-country";
import { AgentFTD } from "./agent-ftd";
import { AgentFilter } from "./agent-filter";
import { AgentOpenPositions } from "./agent-open-position";
import { AgentOverview } from "./agent-overview";
import { AgentTotal } from "./agent-total";
import { AgentWD } from "./agent-wd";
import { mockedReport } from "src/utils/constant/mock-data";

export const AgentReport = () => (
  <Stack pt={1} pb={3} direction="column" gap={3}>
    <AgentFilter />
    <>
      <AgentOverview report={mockedReport} />
      <Grid container spacing={2}>
        <AgentFTD report={mockedReport} />
        <AgentWD report={mockedReport} />
        <AgentOpenPositions report={mockedReport} />
        <AgentClosePositions report={mockedReport} />
        <AgentBrand report={mockedReport} />
        <AgentTotal report={mockedReport} />
        <AgentCountry report={mockedReport} />
        <AgentActivity report={mockedReport} />
      </Grid>
    </>
  </Stack>
);
