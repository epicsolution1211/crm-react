import { useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AgentReport } from "src/sections/dashboard/reports/agent-report";
import { OverviewChat } from "src/sections/dashboard/overview/overview-chat";
import { OverviewDoneTasks } from "src/sections/dashboard/overview/overview-done-tasks";
import { OverviewOpenTickets } from "src/sections/dashboard/overview/overview-open-tickets";
import { OverviewPendingIssues } from "src/sections/dashboard/overview/overview-pending-issues";
import { OverviewTransactions } from "src/sections/dashboard/overview/overview-transactions";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSettings } from "src/hooks/use-settings";

const getAffiliateRedirect = (user) => {
  if (user?.aff_acc_leads) return paths.dashboard.lead.status.index;
  if (user?.aff_acc_affiliates) return paths.dashboard.lead.affiliate.index;
  if (user?.aff_acc_brands) return paths.dashboard.lead.brands.index;
  if (user?.aff_acc_inject) return paths.dashboard.lead.injection.index;
  if (user?.aff_acc_offers) return paths.dashboard.lead.offers.index;
  return null;
};

const getUserRedirect = (acc) => {
  const redirectMap = {
    acc_v_overview: paths.dashboard.index,
    acc_v_client: paths.dashboard.customers.index,
    acc_v_agents: paths.dashboard.agents,
    acc_v_chat: paths.dashboard.internalChat,
    acc_v_lm_leads: paths.dashboard.lead.status.index,
    acc_v_lm_aff: paths.dashboard.lead.affiliate.index,
    acc_v_lm_brand: paths.dashboard.lead.brands.index,
    acc_v_lm_list: paths.dashboard.lead.injection.index,
    acc_v_lm_offer: paths.dashboard.lead.offers.index,
    acc_v_risk_management: paths.dashboard.risk.positions.index,
    acc_v_logs: paths.dashboard.log,
    acc_v_audit_merchant: paths.dashboard.paymentAudit.merchant.index,
    acc_v_audit_bank: paths.dashboard.paymentAudit.bankProvider.index,
    acc_v_audit_payment_type: paths.dashboard.paymentAudit.paymentType.index,
    acc_v_audit_tasks: paths.dashboard.paymentAudit.validationRules.index,
    acc_v_audit_data: paths.dashboard.paymentAudit.dataEntry.index,
    acc_v_article: paths.dashboard.article.index,
    acc_v_settings: paths.dashboard.settings,
    acc_v_reports: paths.dashboard.reports,
  };

  for (const [key, path] of Object.entries(redirectMap)) {
    if (acc[key] === true || acc[key] === undefined) {
      return path;
    }
  }

  return '#';
};

const Page = () => {
  const settings = useSettings();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const checkoutUser = useCallback(async () => {
    if (!user) return;

    if (user.affiliate) {
      const redirect = getAffiliateRedirect(user);
      if (!redirect) {
        await signOut();
        router.push(paths.auth.jwt.login);
        return;
      }
      router.push(redirect);
      return;
    }

    const redirect = getUserRedirect(user.acc || {});
    router.replace(redirect);
  }, [user, router, signOut]);

  useEffect(() => {
    if (user) checkoutUser();
  }, [user, checkoutUser]);

  usePageView();

  return (
    <>
      <Seo title="Dashboard: Overview" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Stack px={1} gap={{ xs: 3, lg: 4 }}>
            <Stack direction="row" justifyContent="space-between">
              <div>
                <Typography variant="h4">Overview</Typography>
              </div>
            </Stack>
            <PayWallLayout>
              <Stack>
                <Grid
                  container
                  disableEqualOverflow
                  spacing={{ xs: 2, lg: 3 }}
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
                    <OverviewTransactions />
                  </Grid>
                  <Grid xs={12} md={12}>
                    <AgentReport selectedAgent={user} viewOnly />
                  </Grid>
                </Grid>
              </Stack>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
