import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { v4 as uuid4 } from "uuid";

import { Iconify } from 'src/components/iconify';
import { countries } from "src/utils/constant";

const TransferItem = ({ customer }) => {
  return (
    <Grid item xs={12} sm={6} md={4} sx={{ height: { xs: "auto", md: "400px" } }}>
      <Card sx={{ height: 1 }}>
        <CardHeader
          title={`Transfer  ${uuid4()?.substring(0, 12)}`}
        />
        <CardContent sx={{ px: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle1">Sent:</Typography>
                <Iconify icon="ic:baseline-check" color="success.main"/>
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Country:
                </Typography>
                <Typography variant="subtitle2">
                  {
                    countries.find(
                      (c) => c.code === customer?.country
                    )?.label
                  }
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Brand:
                </Typography>
                <Typography variant="subtitle2">
                  {customer?.internal_brand_name}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={8}>
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Company:
                </Typography>
                <Typography variant="subtitle2">
                  {customer?.company}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Phone Numbers:
                </Typography>
                <Typography variant="subtitle2" >
                  {customer?.phone_numbers[0]}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email:
                </Typography>
                <Typography variant="subtitle2">
                  {customer?.emails[0]}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export const LandingCustomerTransfer = ({ customer }) => {
  const [brand, setBrand] = useState(1);

  const handleBrandChange = useCallback((e) => {
    setBrand(e?.target?.value);
  }, []);

  const brandMockedList = [
    {
      label: "Eco Solutions",
      value: 1
    },
    {
      label: "Gourmet Delight",
      value: 2
    },
    {
      label: "Velocity Gear",
      value: 3
    },
    {
      label: "Fashion Vista",
      value: 4
    },
    {
      label: "Wellness Harbor",
      value: 5
    }
  ];

  return (
    <Stack>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} sx={{ height: { xs: "auto", md: "400px" } }}>
          <Card sx={{ height: 1 }}>
            <CardHeader title="Create transfer" />
            <CardContent sx={{ py: 8 }}>
              <Typography pb={1}>Select a Brand</Typography>
              <Stack>
                <Select value={brand} onChange={handleBrandChange}>
                  {brandMockedList?.map((brand) => (
                    <MenuItem key={brand.value} value={brand.value}>
                      <Typography>
                        {brand.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <TransferItem customer={customer} />
      </Grid>
    </Stack>
  );
};
