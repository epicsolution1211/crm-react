import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

import { countries } from "src/utils/constant";
import { OfferItemPublic } from "./offer-item-public";
import { offersApi } from "src/api/lead-management/offers";
import { useSearchParams } from "src/hooks/use-search-params";
import { toast } from "react-hot-toast";
import { authApi } from "src/api/auth";
import { useDebounce } from "src/hooks/use-debounce";

export const OffersTablePublic = () => {
  const searchParams = useSearchParams();
  const [country, setCountry] = useState(null);
  const [search, setSearch] = useState("");
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = useDebounce(search, 300);

  const getOffersList = async () => {
    try {
      setIsLoading(true);
      const companyRes = await authApi.getCompanyId({
        token: searchParams.get("company"),
      });
      const res = await offersApi.getOffers({
        country,
        per_page: country ? 10000 : 4,
        company_id: companyRes?.company_id,
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
    <Grid
      container
      spacing={{
        xs: 3,
        lg: 4,
      }}
    >
      <Grid item xs={12}>
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
              <Typography>Country</Typography>
              <Autocomplete
                sx={{
                  width: {
                    xs: 350,
                    sm: 350,
                    md: 400,
                    lg: 400,
                    xl: 400,
                  },
                  mt: 1,
                }}
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
            <Box sx={{ width: "400px" }}>
              <Typography>Search</Typography>

              <OutlinedInput
                placeholder="Search"
                value={search}
                sx={{
                  width: {
                    xs: 350,
                    sm: 350,
                    md: 400,
                    lg: 400,
                    xl: 400,
                  },
                  mt: 1,
                }}
                onChange={(e) => setSearch(e?.target?.value)}
              />
            </Box>
          </Stack>
        </Stack>

        {isLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {offers?.map((offer) => (
              <OfferItemPublic offer={offer} />
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
