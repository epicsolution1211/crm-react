import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const SliderBar = ({ setValue, value, disabled }) => {
  return (
    <Slider
      value={value}
      disabled={disabled}
      onChange={(event) => setValue(event?.target?.value)}
      sx={{ p: 0, pt: '3px' }}
      components={{
        Thumb: (params) => <Box {...params} />,
        Rail: () => {
          return (
            <Box
              sx={{
                backgroundColor: 'action.selected',
                height: "15px",
                marginBottom: "-15px",
                borderRadius: 4,
                width: 1
              }}
            />
          );
        },
        Track: (params) => (
          <Box
            sx={{
              width: params.style.width,
              backgroundColor: value > 70 ? "#39AC76" : value > 30 ? "#1976d2" : "#CE2B2B",
              height: "15px",
              color: "white",
              textAlign: "center",
              fontSize: 12,
              lineHeight: '15px',
              borderRadius: 4,
            }}
          >
            {params.style.width}
          </Box>
        )
      }}
    />
  );
}

export default SliderBar;