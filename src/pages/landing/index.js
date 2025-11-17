import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { OverviewChat } from "src/sections/landing/overview/overview-chat";
import { OverviewDoneTasks } from "src/sections/landing/overview/overview-done-tasks";
import { OverviewOpenTickets } from "src/sections/landing/overview/overview-open-tickets";
import { OverviewPendingIssues } from "src/sections/landing/overview/overview-pending-issues";
import { OverviewTransactions } from "src/sections/landing/overview/overview-transactions";
import { PayWallLayout } from "src/layouts/main/paywall-layout";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { AgentReport } from "src/sections/landing/reports/agent-report";

const Page = () => {
  const settings = useSettings();
  usePageView();

  return (
    <>
      <Seo title="Overview" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid
            container
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12} sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <div>
                  <Typography variant="h4">Overview</Typography>
                </div>
              </Stack>
            </Grid>
            <PayWallLayout>
              <Container maxWidth={settings.stretch ? false : "xl"}>
                <Grid
                  container
                  disableEqualOverflow
                  spacing={{
                    xs: 3,
                    lg: 4,
                  }}
                >
                  <Grid xs={12} md={4}>
                    <OverviewDoneTasks amount={31} />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <OverviewPendingIssues amount={12} />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <OverviewOpenTickets amount={5} />
                  </Grid>
                  <Grid xs={12} md={5}>
                    <OverviewChat />
                  </Grid>
                  <Grid xs={12} md={7}>
                    <OverviewTransactions/>
                  </Grid>
                  <Grid xs={12} md={12}>
                    <AgentReport viewOnly />
                  </Grid>
                </Grid>
              </Container>
            </PayWallLayout>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
