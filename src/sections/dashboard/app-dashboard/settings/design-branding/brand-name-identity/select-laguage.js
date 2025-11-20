import {  MenuItem, Select, Typography } from "@mui/material";
import { getAssetPath } from "src/utils/asset-path";

const languageOptions = {
  en: {
    icon: getAssetPath("/assets/flags/flag-uk.png"),
    label: "English",
    code: "UK",
  },
  de: {
    icon: getAssetPath("/assets/flags/flag-de.png"),
    label: "German",
    code: "DE",
  },
  es: {
    icon: getAssetPath("/assets/flags/flag-es.png"),
    label: "Spanish",
    code: "ES",
  },
  it: {
    icon: getAssetPath("/assets/flags/flag-it.png"),
    label: "Italian",
    code: "IT",
  },
  ru: {
    icon: getAssetPath("/assets/flags/flag-ru.png"),
    label: "Russian",
    code: "RU",
  },
  nl: {
    icon: getAssetPath("/assets/flags/flag-nl.png"),
    label: "Dutch",
    code: "NL",
  },
};

export function SelectLanguage() {
  return (
      <Select
        variant="outlined"
        size="small"
        fullWidth
        display={"flex"}
        gap={2}
        alignItems={"center"}
        position={"relative"}
      >
        {Object.keys(languageOptions).map((key) => (
          <MenuItem
            key={languageOptions[key].code}
            value={languageOptions[key].code}
            flexDirection={"row"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            <img
              src={languageOptions[key].icon}
              alt={languageOptions[key].label}
              width={15}
              height={15}
            />
            <Typography component="span" ml={2} variant="body2" >
              {languageOptions[key].label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
  );
}
