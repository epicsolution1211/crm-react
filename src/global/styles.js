import { GlobalStyles } from "@mui/material";

export const GlobalStyle = () => (
  <GlobalStyles
    styles={() => {
      return ({
        ".customer_table": {
          ".simplebar-wrapper": {
            "&": {
              height: "calc(100vh - 400px)",
            }
          },
        },
        "@media (max-width: 900px)": {
          // Apply styles for screens smaller than or equal to 960px (assuming 'md' breakpoint)
          ".customer_table": {
            ".simplebar-wrapper": {
              height: "calc(100vh - 320px)",
            },
          },
        },
        ".MuiPickersPopper-root": {
          "& ::-webkit-scrollbar": {
            width: "5px",
          },
          "& ::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& ::-webkit-scrollbar-thumb": {
            background: "#0E1320",
          },
          "& ::-webkit-scrollbar-thumb:hover": {
            background: "#0E1320",
          },
        },
        ".MuiTableHead-root": {
          zIndex: 1000
        },
        ".MuiAutocomplete-popper": {
          "& ::-webkit-scrollbar": {
            width: "7px",
          },
          "& ::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& ::-webkit-scrollbar-thumb": {
            background: "#0E1320",
          },
          "& ::-webkit-scrollbar-thumb:hover": {
            background: "#0E1320",
          },
        },
        ".MuiMenu-root": {
          "& ::-webkit-scrollbar": {
            width: "5px",
          },
          "& ::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& ::-webkit-scrollbar-thumb": {
            background: "#0E1320",
          },
          "& ::-webkit-scrollbar-thumb:hover": {
            background: "#0E1320",
          },
        },
        ".MuiDrawer-root": {
          "& ::-webkit-scrollbar": {
            width: "10px",
          },
          "& ::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& ::-webkit-scrollbar-thumb": {
            background: "#0E1320",
          },
          "& ::-webkit-scrollbar-thumb:hover": {
            background: "#0E1320",
          },
        },
        ".MuiTextField-root input:disabled": {
          WebkitTextFillColor: "#4a4b4f",
        },
        ".tv-embed-widget-wrapper__body": {
          border: "0 ",
        },
        ".css-156q4z5-MuiInputAdornment-root.MuiInputAdornment-positionStart.css-156q4z5-MuiInputAdornment-root:not(.MuiInputAdornment-hiddenLabel)" : {
          marginTop: "0px !important",
        },
        "th": {
          "& .MuiStack-root": {
            "& .MuiIconButton-sizeSmall": {
              marginLeft: "-8px !important",
            }
          },
        }
      });
    }}
  />
);
