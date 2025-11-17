import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { PaymentTable } from 'src/sections/dashboard/payment-audit/payment-types/payment-table';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';

const Page = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_payment_type === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Payment Types`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <PaymentTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
