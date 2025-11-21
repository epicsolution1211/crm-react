
import { Box, Popover, TextField } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

export  function ColorPicker({ label, value }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColor, setSelectedColor] = useState(value);

  const openPicker = (e) => {
    setAnchorEl(e.currentTarget);

  };

  const closePicker = () => {
    setAnchorEl(null);
  };
const onChange = (newColor) => {
    setSelectedColor(newColor);
  }
  const open = Boolean(anchorEl);

  return (
    <Box>
      <Box fontSize={14} mb={0.5}>{label}</Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderRadius: "10px",
          border: "1px solid #767070",
          width: "200px",

        }}
      >
        <Box
          onClick={openPicker}
          sx={{
            width: 33,
            height: 30,
            borderRadius: "10px",
            backgroundColor: selectedColor,
            cursor: "pointer",
            ml: 1,
          }}
        />
        <Box sx={{
          px: 2,
          py:0.5,
          bgcolor:"#FFFFFF33",
          borderRadius:"8px",
          display:"flex",
           flex:1
        }}>{selectedColor}</Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={closePicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{ mt: 1 }}
        >
          <Box sx={{ padding: 2, background: "#111", borderRadius: "12px" }}>
            <HexColorPicker color={value} onChange={onChange} />
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
