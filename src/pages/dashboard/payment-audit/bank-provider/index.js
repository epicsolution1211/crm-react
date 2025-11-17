import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { BankProviderTable } from 'src/sections/dashboard/payment-audit/bank-provider/bankProvider-table';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';

const Page = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_bank === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Payment Audit Bank Provider`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <BankProviderTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
