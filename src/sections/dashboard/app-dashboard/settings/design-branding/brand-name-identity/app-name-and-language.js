import {
    Box,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Iconify } from "src/components/iconify";

export function AppNameAndLanguage() {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "35px",
          fontWeight: 500,
        }}
      >
        Set App Name & Language
      </Typography>
      <Box display={"flex"}>
        <Box>
          <InputLabel>App Name</InputLabel>
          <TextField size="small" placeholder="Type your app name here" />
        </Box>
        <Box>
          <InputLabel>Default App Language</InputLabel>
          <Select variant="standard" size="small" >
            <MenuItem value="home">
              <Iconify icon="simple-icons:feedly" width={20} color="#BDBDBD" />
              Home
            </MenuItem>

            <MenuItem value="work">
              <Iconify icon="simple-icons:feedly" width={20} color="#BDBDBD" />
              Work
            </MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
