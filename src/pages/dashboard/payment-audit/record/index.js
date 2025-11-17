import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RecordTable } from 'src/sections/dashboard/payment-audit/alert/record-table';
import { RouterLink } from "src/components/router-link";
import { Seo } from 'src/components/seo';
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { Iconify } from "src/components/iconify";

const Page = () => {
  const { company, user } = useAuth();
  usePageView();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_payment_audit === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Payment Audit Alert`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between">
              <Typography variant="h4" >
                Records
              </Typography>
              <Button
                disabled={company?.list_filtering}
                component={RouterLink}
                href={paths.dashboard.paymentAudit.record.create}
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          </Stack>
          <PayWallLayout>
            <RecordTable />
          </PayWallLayout>
        </Container>
      </Box>
    </>
  );
};

export default Page;
