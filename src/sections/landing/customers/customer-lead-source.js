import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { Iconify } from 'src/components/iconify';

import { countries } from "src/utils/constant";

export const LandingCustomerLeadSource = ({ customer }) => (
  <Stack spacing={4}>
    <Typography variant="h5">Lead source</Typography>
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                ID:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.id + 10}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Agent:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.agents[0]?.name}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Brand:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.internal_brand_name}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Campaign:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.campaign}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Country:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">
                  {countries.find((c) => c.code === customer?.country)?.label}
                </Typography>
                <Iconify 
                  icon={`circle-flags:${customer?.country?.toLowerCase()}`}
                  width={25}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Deposit:
              </Typography>
              <Typography variant="subtitle2">{150}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Description:
              </Typography>
              <Typography variant="subtitle2">
                {"Some Description"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Email:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.emails[0]}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                FTD Amount:
              </Typography>
              <Typography variant="subtitle2">
                {120}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                FTD Date:
              </Typography>
              <Typography variant="subtitle2">
                {format(new Date(), "yyyy-MM-dd HH:mm")}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Labels:
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ pt: 2 }}
              >
                <Chip
                  label={customer?.client_labels[0]?.name}
                  size="small"
                  color="primary"
                  sx={{
                    mr: 1,
                  }} />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Note:
              </Typography>
              <Typography variant="subtitle2">{"Some Note"}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Phone Number:
              </Typography>
              <Typography variant="subtitle2">{customer?.phone_numbers[0]}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Registration Date:
              </Typography>
              <Typography variant="subtitle2">
                {format(new Date(), "yyyy-MM-dd HH:mm")}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Source:
              </Typography>
              <Typography variant="subtitle2">{"Lead Source"}</Typography>
            </Grid>


            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Status:
              </Typography>
              <Typography variant="subtitle2">{customer?.status === 1 ? "Active" : "Disabled"}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Team Name:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.client_teams[0]?.name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  </Stack>
);
