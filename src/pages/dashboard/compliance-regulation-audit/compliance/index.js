import { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ComplianceTable } from "src/sections/dashboard/compliance-regulation-audit/compliance";
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
    if (user?.acc?.acc_v_article === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  return (
    <>
      <Seo title="Compliance" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="flex-start" spacing={1}>
              <Stack spacing={1}>
                <Typography variant="h4">Compliance</Typography>
              </Stack>
              <Stack
                direction="row"
                gap={0.5}
                alignItems="center"
                pt={1}
                pl={1}
              >
                {/* <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: "success.main",
                    borderRadius: 50,
                  }}
                ></Box> */}
                {/* <Typography whiteSpace='nowrap'>{`${11} online`}</Typography>
                <Tooltip title="Sort by online">
                  <IconButton>
                    <Iconify icon="line-md:arrows-vertical" width={20} sx={{ color: 'primary.main' }} />
                  </IconButton>
                </Tooltip> */}
              </Stack>
            </Stack>
            <Card>
              <ComplianceTable />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
