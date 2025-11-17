import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";

import { AffiliateBalance } from "./affiliate-balance";
import { AffiliateBrand } from "./affiliate-brand";
import { AffiliateClosePositions } from "./affiliate-close-position";
import { AffiliateCountry } from "./affiliate-country";
import { AffiliateOpenPositions } from "./affiliate-open-position";
import { AffiliateOverview } from "./affiliate-overview";
import { AffiliateTotal } from "./affiliate-total";
import { mockedAffilateReport } from "src/utils/constant/mock-data";
import { AgentFilter } from "../agent-report/agent-filter";

export const AffilateReport = () => {
  return (
    <Stack pt={1} pb={3} direction="column" gap={3}>
      <AgentFilter isAffiliate={true}/>
      <>
        <AffiliateOverview report={mockedAffilateReport} />
        <Grid container spacing={2}>
          <AffiliateTotal report={mockedAffilateReport} />
          <AffiliateCountry report={mockedAffilateReport} />
          <AffiliateOpenPositions report={mockedAffilateReport} />
          <AffiliateClosePositions report={mockedAffilateReport} />
          <AffiliateBrand report={mockedAffilateReport} />
          <AffiliateBalance report={mockedAffilateReport} />
        </Grid>
      </>
    </Stack>
  );
};
