import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { LogsTable } from "src/sections/landing/logs/logs-table";

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Logs" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Typography variant="h4">Logs</Typography>

            <Card>
              <LogsTable />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
