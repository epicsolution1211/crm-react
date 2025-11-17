import { useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { BrandsTable } from "src/sections/dashboard/lead-management/brands-table";
import { useAuth } from "src/hooks/use-auth";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from "src/components/iconify";

const Page = () => {
  usePageView();
  const { company, user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_brand === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Lead Management Brands`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Brands</Typography>
              {user?.acc?.acc_e_lm_brand === undefined ||
                user?.acc?.acc_e_lm_brand ? (
                <Button
                  disabled={company?.list_filtering}
                  component={RouterLink}
                  href={paths.dashboard.lead.brands.create}
                  startIcon={<Iconify icon="lucide:plus" width={24} />}
                  variant="contained"
                >
                  Add
                </Button>
              ) : null}
            </Stack>
          </Stack>
          <PayWallLayout>
            <BrandsTable />
          </PayWallLayout>
        </Container>
      </Box>
    </>
  );
};

export default Page;
