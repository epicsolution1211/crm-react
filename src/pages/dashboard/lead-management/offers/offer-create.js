import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { OfferCreate } from "src/sections/dashboard/lead-management/offers/offer-create";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_offer === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Dashboard : Create Offer`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.lead.offers.index}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="hover"
              >
                <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Offers</Typography>
              </Link>
            </Stack>
            <Box />
          </Stack>

          <Stack
            alignItems="flex-start"
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack alignItems="center" direction="row" spacing={2}>
              <Stack spacing={1}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography variant="h4">
                    CREATE OFFER
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <OfferCreate />
        </Container>
      </Box>
    </>
  );
};

export default Page;
