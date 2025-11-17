// React imports
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// MUI imports
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Components
import { AgentReport } from "src/sections/dashboard/reports/agent-report";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";

// Hooks
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

// Utils
import { paths } from "src/paths";
import { tokens } from "src/locales/tokens";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { user, company } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (user?.acc?.acc_v_reports_agent_performance === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [selectedAgent, setSelectedAgent]= useState();

  useEffect(() => {
    if (state?.agent) {
      setSelectedAgent(state?.agent);
    }
  }, [state]);

  return (
    <>
      <Seo title={`Dashboard: Agent Performance`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 2, flex: "1 1 auto", position: "relative" }}>
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack sx={{ mb: 3 }}>
              {!company?.list_filtering && (
                <Typography variant="h4">{t(tokens.nav.agentPerformance)}</Typography>
              )}
            </Stack>
            <AgentReport
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
            />
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
