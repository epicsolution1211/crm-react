import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IcoOfferModal } from "./ico-offer-modal";
import { EditIcoOffer } from "./edit-ico-offer";
import { getAPIUrl } from "src/config";
import Grid from "@mui/material/Unstable_Grid2";
import { useTimezone } from "src/hooks/use-timezone";
import { getAssetPath } from "src/utils/asset-path";

const OfferItem = ({ offer, onOfferOpen, onSetOffer }) => {
  const { toLocalTime } = useTimezone();
  
  return (
    <Grid
      xs={12}
      md={5}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        onSetOffer(offer);
        onOfferOpen();
      }}
    >
      <Card
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 4, background: "#ebebeb" }}
        >
          <Avatar
            src={offer?.file ? offer?.file?.includes('http') ? offer?.file : `${getAPIUrl()}/${offer?.file}` : ""}
            sx={{ width: 100, height: 100 }} />

          <Stack spacing={1} alignItems="flex-end">
            <Typography variant="h4" color="primary">
              {offer?.token_name}
            </Typography>
            <Typography variant="h5" color="primary">
              {offer?.token_symbol}
            </Typography>
          </Stack>
        </Stack>

        <CardContent>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Listing on:</Typography>
              <Typography variant="h7">
                {toLocalTime(offer?.listing_on)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Listing price:</Typography>
              <Typography variant="h7">${offer?.listing_price}</Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Presale price:</Typography>
              <Typography variant="h7">${offer?.presale_price}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const Offers = ({ offers, onGetOffers }) => {
  const [offerOpen, setOfferOpen] = useState(false);
  const [editOfferOpen, setEditOfferOpen] = useState(false);
  const [offerToShow, setOfferToShow] = useState(null);
  const [offerToEdit, setOfferToEdit] = useState(null);

  if (!offers?.length) {
    return (
      <Box
        sx={{
          py: 5,
          maxWidth: 1,
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={getAssetPath("/assets/errors/error-404.png")}
          sx={{
            height: "auto",
            maxWidth: 120,
          }}
        />
        <Typography color="text.secondary" sx={{ mt: 2 }} variant="subtitle1">
          There are no offers yet
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Stack>
        <Grid container gap={4}>
          {offers?.map((offer) => (
            <OfferItem
              offer={offer}
              key={offer?.id}
              onOfferOpen={() => setOfferOpen(true)}
              onSetOffer={setOfferToShow}
            />
          ))}
        </Grid>
      </Stack>

      {offerToShow ? (
        <IcoOfferModal
          open={offerOpen}
          onClose={() => setOfferOpen(false)}
          offer={offerToShow}
          onGetOffers={onGetOffers}
          onOfferEdit={(offer) => {
            setOfferToEdit(offer);
            setEditOfferOpen(true);
          }}
        />
      ) : null}

      {offerToEdit ? (
        <EditIcoOffer
          open={editOfferOpen}
          onClose={() => setEditOfferOpen(false)}
          offer={offerToEdit}
          onGetOffers={onGetOffers}
        />
      ) : null}
    </>
  );
};
