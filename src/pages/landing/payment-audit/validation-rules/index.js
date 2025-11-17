import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { LandingValidationTable } from 'src/sections/landing/payment-audit/validation-rules/validation-table';

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Payment Audit : Validation Tasks" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <LandingValidationTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
