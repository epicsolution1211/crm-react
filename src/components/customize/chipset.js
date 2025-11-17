import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

export const ChipSet = ({ chips, handleRemoveChip }) => {
  return (
    <>
      {chips?.map((chip, index) => (
        <Chip
          key={index}
          sx={{
            "&.MuiChip-root": {
              height: chip?.extraInfo ? "48px !important" : "32px",
            },
          }}
          label={
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                "& span": {
                  fontWeight: 600,
                },
              }}
            >
              <Stack justifyContent="center">
                <Stack direction="row" alignItems="center">
                  {chip.label && (
                    <Typography  fontSize={13} fontWeight={500} pr={0.5}>{chip.label}:</Typography> 
                  )}
                  {chip.displayValue || chip.value}
                </Stack>

                {chip?.extraInfo ? <>{chip.extraInfo}</> : null}
              </Stack>
            </Box>
          }
          onDelete={() => handleRemoveChip(chip.value)}
          variant="outlined"
        />
      ))}
    </>
  );
};
