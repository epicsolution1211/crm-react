import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Seo } from "src/components/seo";
import { LandingAffiliate } from "src/sections/landing/lead-management/landing-affiliate";
import { Iconify } from "src/components/iconify";

const Page = () => (
  <>
    <Seo title="Lead Management : Affiliate" />
    <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
      <Container maxWidth="xxl">
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Affiliate</Typography>
            <Button
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              variant="contained"
            >
              Add
            </Button>
          </Stack>
        </Stack>
        <LandingAffiliate />
      </Container>
    </Box>
  </>
);

export default Page;
