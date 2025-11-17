import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { AffiliateTable } from "src/sections/dashboard/lead-management/affiliate-table";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from "src/components/iconify";

const Page = () => {
  usePageView();
  const { company, user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_aff === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Lead Management Affiliate`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Affiliate</Typography>
              {user?.acc?.acc_e_lm_aff === undefined ||
                user?.acc?.acc_e_lm_aff ? (
                <Button
                  disabled={company?.list_filtering}
                  component={RouterLink}
                  href={paths.dashboard.lead.affiliate.create}
                  startIcon={<Iconify icon="lucide:plus" width={24} />}
                  variant="contained"
                >
                  Add
                </Button>
              ) : null}
            </Stack>
          </Stack>

          <PayWallLayout>
            <AffiliateTable />
          </PayWallLayout>
        </Container>
      </Box>
    </>
  );
};

export default Page;
