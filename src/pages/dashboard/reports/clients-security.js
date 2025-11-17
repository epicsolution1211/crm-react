import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// MUI imports
import Box from "@mui/material/Box";
import Container from "@mui/material/Container"; 
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Imports
import { Seo } from "src/components/seo";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import ClientsSecurityDashboard from "src/sections/dashboard/reports/clients-security";
import { tokens } from "src/locales/tokens";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  const { t } = useTranslation();
  const [endPoint, setEndPoint] = useState("overview");

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_reports_clients_security === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  return (
    <>
      <Seo title={`Dashboard: System-Wide Clients Security`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 2, flex: "1 1 auto", position: "relative" }}>
        <PayWallLayout>
          <Container maxWidth="xxl">
            <Stack sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 1 }, mb: { xs: 1, md: 0 }, justifyContent: { xs: "flex-start", md: "space-between" } }}>
              <Typography variant="h4">System-Wide {t(tokens.nav.clientsSecurity)}</Typography>
              <RadioGroup
                row
                name="report-type"
                defaultValue="all_clients"
                onChange={(e) => {
                  const type = e.target.value;
                  if(type === "overview") {
                    setEndPoint("overview");
                  } else if(type === "full_intelligence") {
                    setEndPoint("full_intelligence");
                  } else if(type === "threat_intelligence") {
                    setEndPoint("threat_intelligence");
                  }
                }}
              >
                <FormControlLabel 
                  value="overview"
                  control={<Radio checked={endPoint === "overview"} />} 
                  label="Over View"
                />
                <FormControlLabel
                  value="full_intelligence"
                  control={<Radio checked={endPoint === "full_intelligence"} />}
                  label="Full Intelligence" 
                />
                <FormControlLabel
                  value="threat_intelligence"
                  control={<Radio checked={endPoint === "threat_intelligence"} />}
                  label="Threat Intelligence"
                />
              </RadioGroup>
            </Stack>
            <ClientsSecurityDashboard endPoint={endPoint} />
          </Container>
        </PayWallLayout>
      </Box>
    </>
  );
};

export default Page;
