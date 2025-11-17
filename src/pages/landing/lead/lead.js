import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Seo } from "src/components/seo";
import { LandingLead } from "src/sections/landing/lead-management/leads/landing-lead";
import { Iconify } from "src/components/iconify";

const Page = () => {
  return (
    <>
      <Seo title="Lead Management : Lead" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Leads</Typography>
              <Button
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
            <Box />
          </Stack>
          <LandingLead />
        </Container>
      </Box>
    </>
  );
};

export default Page;
