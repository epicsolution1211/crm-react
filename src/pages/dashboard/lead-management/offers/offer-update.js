import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";

import { Seo } from "src/components/seo";
import { OfferEdit } from "src/sections/dashboard/lead-management/offers/offer-edit";
import { OfferManagement } from "src/sections/dashboard/lead-management/offers/offer-management";
import { RouterLink } from "src/components/router-link";
import { offersApi } from "src/api/lead-management/offers";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useParams } from "react-router";
import { useRouter } from "src/hooks/use-router";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  const { user } = useAuth();
  const params = useParams();
  usePageView();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_offer === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getOfferData = async () => {
    try {
      setIsLoading(true);
      const res = await offersApi.getOffer(params?.offerId);
      setOffer(res?.offer);
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getOfferData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress
          size={70}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        />
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Dashboard : Edit Offer`} />
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
                    {offer?.name?.toUpperCase()}
                  </Typography>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="subtitle2">offer_id:</Typography>
                  <Chip label={params?.offerId} size="small" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <OfferEdit offerId={params?.offerId} />
          {user?.acc?.acc_e_lm_offer ? (
            <OfferManagement offerId={params?.offerId} />
          ) : null}
        </Container>
      </Box>
    </>
  );
};

export default Page;
