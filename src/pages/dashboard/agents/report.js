import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { AgentDailyReport } from "src/sections/dashboard/agents/reports";

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title={`Dashboard: Agents Report`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <PayWallLayout>
              <AgentDailyReport />
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
