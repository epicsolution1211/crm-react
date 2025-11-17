import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Seo } from "src/components/seo";

const Page = () => {
  return (
    <>
      <Seo title="Wallets" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Wallet</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
