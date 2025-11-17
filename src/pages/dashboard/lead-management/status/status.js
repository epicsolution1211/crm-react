import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { StatusTable } from "src/sections/dashboard/lead-management/status-table";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  usePageView();
  const { company, user } = useAuth();
  const isMounted = useMounted();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_leads === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  useEffect(() => {
    if (isMounted()) {
      setIsLoading(false);
    }
  }, [isMounted]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress
          size={70}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        />
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Dashboard : Lead`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Leads</Typography>

              {user?.acc?.acc_e_lm_leads === undefined ||
                user?.acc?.acc_e_lm_leads ? (
                <Button
                  disabled={company?.list_filtering}
                  component={RouterLink}
                  href={paths.dashboard.lead.status.create}
                  startIcon={<Iconify icon="lucide:plus" width={24} />}
                  variant="contained"
                >
                  Add
                </Button>
              ) : null}
            </Stack>
            <Box />
          </Stack>
          <PayWallLayout>
            <StatusTable />
          </PayWallLayout>
        </Container>
      </Box>
    </>
  );
};

export default Page;
