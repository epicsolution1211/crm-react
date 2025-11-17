import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { LandingOffersTable } from "src/sections/landing/lead-management/offers/offers-table";
import { Iconify } from "src/components/iconify";

const Page = () => {
  usePageView();
  return (
    <>
      <Seo title="Lead Management : Offers" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Offers</Typography>
              <Button
                variant="outlined"
                endIcon={<Iconify icon="mdi:content-copy" width={16} />}
              >
                Copy link
              </Button>
            </Stack>
            <Box />
          </Stack>
          <LandingOffersTable />
        </Container>
      </Box>
    </>
  );
};

export default Page;
