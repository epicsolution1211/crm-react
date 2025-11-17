import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { toast } from "react-hot-toast";

import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";
import { offersApi } from "src/api/lead-management/offers";
import { useAuth } from "src/hooks/use-auth";

export const OfferItem = ({ offer }) => {
  const { user } = useAuth();
  const [active, setActive] = useState(offer?.active ?? false);

  const handleOfferStatusChange = async () => {
    try {
      await offersApi.updateOffer(offer?.id, { active: !active });
      setActive(!active);
      toast.success("Offer status successfully changed!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Grid item sm={6}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
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
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.lead.offers.edit.replace(
                      ":offerId",
                      offer?.id
                    )}
                  >
                    <Typography variant="h6">
                      {offer?.name.toUpperCase()}
                    </Typography>
                  </Link>
                </Stack>

                <Switch
                  disabled={!user?.acc?.acc_e_lm_offer}
                  checked={active}
                  onChange={() => handleOfferStatusChange()}
                />
              </Stack>
            </Grid>
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
                  <Typography variant="h6">Avg. Player Value</Typography>
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
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
