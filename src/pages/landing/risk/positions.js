import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePageView } from "src/hooks/use-page-view";

import { Seo } from "src/components/seo";
import { LandingPositionsTable } from "src/sections/landing/risk-management/positions-table";

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Risk Management : Positions" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Positions</Typography>
              </Stack>
            </Stack>
            <Card>
              <LandingPositionsTable />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
