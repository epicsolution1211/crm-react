import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { Leaderboard } from "src/sections/dashboard/leaderboard";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";

const Page = () => {
  return (
  <>
    <Seo title={`Dashboard: Leaderboard`} />
    <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2, flex: "1 1 auto", position: "relative" }}>
      <PayWallLayout>
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Typography variant="h4">Leaderboards</Typography>
            <Leaderboard />
          </Stack>
        </Container>
      </PayWallLayout>
    </Box>
  </>
  )
};

export default Page;