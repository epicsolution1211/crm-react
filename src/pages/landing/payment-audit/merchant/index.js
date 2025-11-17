import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { LandingMerchantTable } from 'src/sections/landing/payment-audit/merchant/merchant-table';

const Page = () => {
  return (
    <>
      <Seo title="Payment Audit : Merchant" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <LandingMerchantTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
