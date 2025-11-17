import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { Seo } from "src/components/seo"
import { Leaderboard } from "src/sections/landing/leaderboard";

const Page = () => (
  <>
    <Seo title="Leaderboard" />
    <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 6, flex: "1 1 auto", position: "relative" }}>
      <Container maxWidth="xxl">
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4">Leaderboards</Typography>
          </Stack>
          <Leaderboard />
        </Stack>
      </Container>
    </Box>
  </>
);

export default Page;