import { Seo } from 'src/components/seo';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { TransactionDetails } from 'src/sections/dashboard/risk-management/transaction-details';
import { useParams } from 'react-router';

const Page = () => {
  const params = useParams();
  const transactionId = params.transactionId;

  return (
    <>
      <Seo title={`Dashboard: Transaction Details`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <TransactionDetails transactionId={transactionId} />
        </Container>
      </Box>
    </>
  );
}

export default Page;