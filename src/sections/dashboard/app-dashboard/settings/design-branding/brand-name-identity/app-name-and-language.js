import {
  Box,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { SelectLanguage } from "./select-laguage";

export function AppNameAndLanguage() {

  return (
    <Box width={"100%"} display={"grid"}>
      <Typography
        sx={{
          fontSize: "35px",
          fontWeight: 500,
        }}
      >
        Set App Name & Language
      </Typography>
      <Grid container spacing={3} gap={2} mt={1}>
        <Grid item xs={5} rowGap={1} >
          <InputLabel py={1}>App Name</InputLabel>
          <TextField
            size="small"
            placeholder="Type your app name here"
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={5}  rowGap={1}>
          <InputLabel py={1} >Default App Language</InputLabel>
          <SelectLanguage />
        </Grid>
      </Grid>

      <Typography sx={{ mt: 3, color: "text.secondary"}}>
        All the Lorem Ipsum generators on the Internet tend to repeat predefined
        chunks as necessary, making this the first true generator on the
        Internet. It uses a dictionary of over 200 Latin words, combined with a
        handful of model sentence structures, to generate Lorem Ipsum which
        looks reasonable.
      </Typography>
    </Box>
  );
}
