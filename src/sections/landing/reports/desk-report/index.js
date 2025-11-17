import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import { mockedReport } from "src/utils/constant/mock-data";
import { AgentFilter } from "../agent-report/agent-filter";
import { AgentOverview } from "../agent-report/agent-overview";
import { AgentFTD } from "../agent-report/agent-ftd";
import { AgentWD } from "../agent-report/agent-wd";
import { AgentOpenPositions } from "../agent-report/agent-open-position";
import { AgentClosePositions } from "../agent-report/agent-close-position";
import { AgentBrand } from "../agent-report/agent-brand";
import { AgentTotal } from "../agent-report/agent-total";
import { AgentCountry } from "../agent-report/agent-country";
import { AgentActivity } from "../agent-report/agent-activity";
import { DeskReportContent } from "./desk-content";

export const DeskReport = () => (
  <Stack pt={1} pb={3} direction="column" gap={3}>
    <AgentFilter isDesk={true} />
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
        <DeskReportContent />
      </Grid>
    </>
  </Stack>
);
