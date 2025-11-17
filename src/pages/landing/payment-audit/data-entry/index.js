import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { LandingDataEntryTable } from 'src/sections/landing/payment-audit/data-entry/data-entry-table';
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Payment Audit : Data Entry" />
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
                Data Entry
              </Typography>
              <Button
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          </Stack>
          <LandingDataEntryTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
