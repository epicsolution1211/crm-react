import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { MerchantTable } from 'src/sections/dashboard/payment-audit/merchant/merchant-table';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'src/hooks/use-router';

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_merchant === false) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard: Payment Audit Merchant`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <MerchantTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
