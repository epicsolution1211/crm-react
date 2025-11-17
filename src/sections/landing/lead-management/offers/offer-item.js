import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { countries } from "src/utils/constant";

export const OfferItem = ({ offer }) => {
  const [active, setActive] = useState(offer?.active ?? false);

  return (
    <Grid item xs={6}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                style={{ marginRight: "-16px" }}
              >
                <Stack direction="row" alignItems="center" spacing={1} >
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

                <Switch
                  checked={active}
                  onChange={() => setActive(!active)}
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
                    {countries?.find((item) => item.code === offer?.country)?.label}
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
