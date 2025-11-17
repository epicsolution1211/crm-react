import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

import { countries } from "src/utils/constant";
import { OfferItem } from "./offer-item";
import { offersMockedList } from "src/utils/constant/mock-data";
import { Iconify } from "src/components/iconify";

export const LandingOffersTable = () => {
  const [country, setCountry] = useState(null);

  return (
    <Grid container>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5 }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
              xl: "row",
            }}
            alignItems="center"
            spacing={3}
          >
            <Box sx={{ width: "400px" }}>
              <Autocomplete
                options={countries}
                autoHighlight
                value={countries?.find((item) => item?.code === country)}
                onChange={(event, value) => setCountry(value?.code)}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select country"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </Box>
            <OutlinedInput
              placeholder="Search"
              sx={{ width: 400 }}
            />
          </Stack>
          <Box>
            <Button
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              variant="contained"
            >
              Add
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {offersMockedList?.map((offer) => (
            <OfferItem offer={offer} />
          ))}
        </Grid>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};
