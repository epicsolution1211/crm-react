import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { RouterLink } from "src/components/router-link";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { offersApi } from "../api/lead-management/offers";
import { useSearchParams } from "../hooks/use-search-params";
import { Iconify } from 'src/components/iconify';

const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  usePageView();

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
      <Seo title="Offer" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Link
                color="text.primary"
                component={RouterLink}
                href={`/offers?company=${searchParams.get("company")}`}
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

          <Card sx={{ mt: 5 }}>
            <CardHeader
              title={
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${offer.country.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${offer.country.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    <Typography variant="h6">
                      {offer?.name.toUpperCase()}
                    </Typography>
                  </Stack>

                  {offer?.active ? (
                    <Typography variant="h6" sx={{ color: "green" }}>
                      ACTIVE
                    </Typography>
                  ) : (
                    <Typography variant="h6" sx={{ color: "red" }}>
                      INACTIVE
                    </Typography>
                  )}
                </Stack>
              }
            />

            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={8}>
                <Grid item xs={6}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">Country:</Typography>
                      <Typography variant="h6">
                        {offer?.country?.toUpperCase()}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">CR%:</Typography>
                      <Typography variant="h6">{offer?.cr}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">Average Player Value</Typography>
                      <Typography variant="h6">{offer?.apv}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">CPL:</Typography>
                      <Typography variant="h6">{offer?.cpi}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">CRG%:</Typography>
                      <Typography variant="h6">{offer?.crg}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">Min Order</Typography>
                      <Typography variant="h6">{offer?.min}</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {offer?.note && (
                  <Grid item xs={12}>
                    <Typography variant="h6">Note</Typography>
                    <div dangerouslySetInnerHTML={{ __html: offer?.note }} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Page;
