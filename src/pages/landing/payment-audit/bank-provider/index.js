import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { LandingBankProviderTable } from 'src/sections/landing/payment-audit/bank-provider/bankProvider-table';

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Payment Audit : Bank Provider" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <LandingBankProviderTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
