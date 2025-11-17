import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";


import toast from "react-hot-toast";

import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { countries } from "src/utils/constant";
import { OfferItem } from "./offer-item";
import { offersApi } from "src/api/lead-management/offers";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { OfferItemSkeleton } from "./offer-item-skeleton";
import { Iconify } from "src/components/iconify";

export const OffersTable = () => {
  const { company, user } = useAuth();
  const [country, setCountry] = useState(null);
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const query = useDebounce(search, 300);

  const getOffersList = async () => {
    try {
      setIsLoading(true);
      const res = await offersApi.getOffers({
        country,
        per_page: 10000,
        company_id: company?.id,
        q: query?.length > 0 ? query : null,
      });
      setOffers(res?.offers);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getOffersList();
  }, [country, query]);

  return (
    <Grid container>
      <Grid item xs={1}></Grid>

      <Grid item xs={10}>
        <Stack
          direction={{
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
            xl: "row",
          }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5 }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "column",
              xl: "row",
            }}
            alignItems="center"
            spacing={3}
          >
            <Box sx={{ width: {md:400,xs:300} }}>
              <Autocomplete
                options={countries}
                autoHighlight
                value={countries?.find((item) => item?.code === country)}
                onChange={(event, value) => setCountry(value?.code)}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": {  flexShrink: 0 } }}
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
              sx={{ width: { md:400, xs:1 } }}
              value={search}
              onChange={(e) => setSearch(e?.target?.value)}
            />
          </Stack>
          {user?.acc?.acc_e_lm_offer === undefined ||
            user?.acc?.acc_e_lm_offer ? (
            <Stack direction='row' justifyContent="flex-end" width={1} sx={{ pt:{ md:0, xs:3}}}>
              <Button
                component={RouterLink}
                href={paths.dashboard.lead.offers.create}
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          ) : null}
        </Stack>

        <Grid container spacing={4} sx={{ mt: {md:4, xs:1} }}>
          {isLoading ? (
            [... new Array(4).keys()]?.map((item)=> (
              <OfferItemSkeleton key={item}/>
            ))
          ) : (
            <>
              {offers?.map((offer) => (
                <OfferItem offer={offer} />
              ))}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
