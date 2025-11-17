import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useCallback, useEffect, useState } from "react";
import { countriesContinents as countries } from "src/utils/constant";
import { Iconify } from "src/components/iconify";

export const AddCountryDialog = (props) => {
  const { open, onClose, timeCapacity, onBrandCountryCreate } = props;

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTimeCap, setSelectedTimeCap] = useState(null);

  useEffect(() => {
    if (timeCapacity) {
      const defaultTimeCap = timeCapacity?.find(timeCap => timeCap?.name === "Default")?.id;

      if (defaultTimeCap) setSelectedTimeCap(defaultTimeCap);
    }
  }, [timeCapacity]);

  const handleCountryRemove = useCallback(
    (code) => {
      setSelectedCountries(
        selectedCountries.filter((country) => country?.code !== code)
      );
    },
    [selectedCountries]
  );

  const getCountryCodes = useCallback(() => {
    const codes = selectedCountries?.map((c) => c?.code);
    const result = [...codes];

    if (codes.find((c) => c === "EU")) {
      result.push(
        "AT",
        "BE",
        "BG",
        "HR",
        "CY",
        "CZ",
        "DK",
        "EE",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IE",
        "IT",
        "LV",
        "LT",
        "LU",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SK",
        "SI",
        "ES",
        "SE"
      );
    }
    if (codes.find((c) => c === "LATIN")) {
      result.push(
        "AR",
        "BO",
        "BR",
        "CL",
        "CO",
        "EC",
        "FK",
        "GF",
        "GY",
        "PY",
        "PE",
        "SR",
        "TT",
        "UY",
        "VE"
      );
    }
    if (codes.find((c) => c === "GCC")) {
      result.push("BH", "KW", "OM", "QA", "SA", "AE");
    }
    if (codes.find((c) => c === "AFRICA")) {
      result.push(
        "DZ",
        "AO",
        "BJ",
        "BW",
        "BF",
        "BI",
        "CM",
        "CV",
        "CF",
        "TD",
        "KM",
        "CG",
        "CD",
        "DJ",
        "EG",
        "GQ",
        "ER",
        "SZ",
        "ET",
        "GA",
        "GM",
        "GH",
        "GN",
        "GW",
        "KE",
        "LS",
        "LR",
        "LY",
        "MG",
        "MW",
        "ML",
        "MR",
        "MU",
        "MA",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RW",
        "ST",
        "SN",
        "SC",
        "SL",
        "SO",
        "ZA",
        "SS",
        "SD",
        "TZ",
        "TG",
        "TN",
        "UG",
        "ZM",
        "ZW"
      );
    }
    if (codes.find((c) => c === "NORDIC")) {
      result.push(
        "DK", // Denmark
        "FI", // Finland
        "IS", // Iceland
        "NO", // Norway
        "SE",
        "GL",
        "FO",
        "AX"
      );
    }
    if (codes.find((c) => c === "ANTARCTICA")) {
      result.push(
        "AR", // Argentina
        "AU", // Australia
        "CL", // Chile
        "FR", // France
        "NZ", // New Zealand
        "NO", // Norway
        "GB" // United Kingdom
      );
    }

    return result?.filter(
      (r) =>
        !["EU", "GCC", "LATIN", "AFRICA", "NORDIC", "ANTARCTICA"].includes(r)
    );
  }, [selectedCountries]);

  const handleBrandCountryCreate = useCallback(() => {
    const countryCodes = getCountryCodes();

    onBrandCountryCreate({
      country_codes: countryCodes,
      time_cap_id: selectedTimeCap,
    });
    handleClose();
  }, [onBrandCountryCreate, selectedCountries, selectedTimeCap]);

  const handleClose = useCallback(() => {
    onClose();
    setSelectedCountries([]);
    setSelectedTimeCap(null);
  }, [onClose]);

  const handleSelectCountryOrContinent = useCallback(
    (value) => {
      if (!value?.code) return;

      setSelectedCountries(selectedCountries.concat(value));
    },
    [selectedCountries]
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Container sx={{ py: 5 }}>
        <Stack sx={{ px: 5 }} spacing={5}>
          <Typography variant="h5">Add country</Typography>

          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Countries</Typography>
              <Autocomplete
                fullWidth
                options={countries}
                autoHighlight
                onChange={(event, value) =>
                  handleSelectCountryOrContinent(value)
                }
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
                      src={option.flag ? option.flag : `$https://flagcdn.com/w20/${option?.code.toLowerCase()}.png`}
                      srcSet={option.flag2x ? option.flag2x : `https://flagcdn.com/w40/${option?.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Countries" />
                )}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Time & Capacity</Typography>
              <Select
                value={selectedTimeCap}
                onChange={(event) => setSelectedTimeCap(event?.target?.value)}
                fullWidth
              >
                {timeCapacity?.map((timeCap) => (
                  <MenuItem key={timeCap?.id} value={timeCap?.id}>
                    {timeCap?.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

          {selectedCountries?.length ? (
            <Stack>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Selected countries
              </Typography>
              {selectedCountries?.map((country) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    "&:hover": {
                      background: "#1B2230",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleCountryRemove(country?.code)}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <img
                      loading="lazy"
                      width="20"
                      src={country.flag ? country.flag : `$https://flagcdn.com/w20/${country?.code.toLowerCase()}.png`}
                      srcSet={country.flag2x ? country.flag2x : `https://flagcdn.com/w40/${country?.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    <Typography variant="subtitle1">
                      {country?.label}
                    </Typography>
                  </Stack>
                  <IconButton sx={{ '&:hover': { color: 'primary.main' }}}>
                    <Iconify icon="gravity-ui:xmark" width={22}/>
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          ) : null}

          <Stack direction="row" spacing={3} alignSelf="flex-end">
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleBrandCountryCreate}
              disabled={!selectedCountries?.length || !selectedTimeCap}
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
