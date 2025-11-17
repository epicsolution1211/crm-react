// React imports
import { useEffect, useState } from "react";

// MUI imports
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Components
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { PowerBi } from "src/sections/dashboard/reports/powerbi";
import { Seo } from "src/components/seo";

// Hooks
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

// Utils
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { tokens } from "src/locales/tokens";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { user, company } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.acc?.acc_v_reports_power_bi === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [reports, setReports] = useState(null);


  const getReports = async () => {
    try {
      const reports = await settingsApi.getReports();
      setReports(reports);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Power BI`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2, flex: "1 1 auto", position: "relative" }}>
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack sx={{ mb: 3 }}>
              {!company?.list_filtering && (
                <Typography variant="h4">{t(tokens.nav.powerBi)}</Typography>
              )}
            </Stack>
            <PowerBi reports={reports}/>
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
