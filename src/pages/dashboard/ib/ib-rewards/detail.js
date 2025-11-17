import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/paths";
import { Seo } from "src/components/seo";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from "src/components/iconify";
import { usePageView } from "src/hooks/use-page-view";
import { IBRewardsDetail } from "src/sections/dashboard/ib/ib-rewards/detail";
import { useEffect } from "react";

const Page = () => {
  usePageView();
  const { state } = useLocation();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.acc?.acc_v_ib_rewards === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  return (
    <>
      <Seo title={`Dashboard: IB Reward Details`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton  
                  onClick={() => router.back()}
                  color="inherit"
                >
                  <Iconify icon="mingcute:left-fill" width={24}/>
                </IconButton>
                <Typography variant="h4">{state?.name ?? "IB Reward Details"}</Typography>
              </Stack>
            </Stack>
            <IBRewardsDetail brand={state?.brand} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
