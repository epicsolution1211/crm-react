import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Logs } from "src/sections/dashboard/logs/logs";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_logs === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Logs`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Typography variant="h4">Logs</Typography>

            <Card>
              <Logs />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
