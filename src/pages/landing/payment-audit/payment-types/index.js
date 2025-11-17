import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { LandingPaymentTable } from 'src/sections/landing/payment-audit/payment-types/payment-table';

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Payment Audit : Payment Types" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <LandingPaymentTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
