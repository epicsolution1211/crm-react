import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { LandingRecordTable } from 'src/sections/landing/payment-audit/alert/record-table';
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Payment Audit : Records" />
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
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          </Stack>
          <LandingRecordTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
