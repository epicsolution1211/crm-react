import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { HeaderSection } from "../../components/header";
import { ColorPicker } from "./color-picker";

export function ColorSchemeMain() {
  return (
    <Box width={"100%"}>
      <HeaderSection
        title={"Color Scheme"}
        subtitle={
          "If you’ve just made a payment, it may take a few hours for it to appear in the table below."
        }
      />
      <Box width={"100%"} px={3}>
        <Box pt={2}>
          <Typography variant="caption">Define Color modes</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                border: "1px solid #6E6E6E",
                borderRadius: "8px",
                px: 2.5,
                py: 1,
              }}
            >
              <Typography variant="body1" opacity={0.75}>
                Dark Mode
              </Typography>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Make as default "
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                border: "1px solid #6E6E6E",
                borderRadius: "8px",
                px: 2.5,
                py: 1,
              }}
            >
              <Typography variant="body1" opacity={0.75}>
                Light Mode
              </Typography>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Make as default "
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                border: "1px solid #6E6E6E",
                borderRadius: "8px",
                px: 2.5,
                py: 1,
              }}
            >
              <Typography variant="body1" opacity={0.75}>
                System Color Mode
              </Typography>
              <FormControlLabel
                control={<Checkbox defaultChecked />} />
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Make as default "
              />
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} mb={2}>
          <Typography sx={{ fontSize: "25px", fontWidth: 500, mb: 1 }}>Dark Mode</Typography>
          <Box display={"flex"} flexWrap={"wrap"} gap={2}>
            <ColorPicker label={"Primary Color"} value={"#882626"} />
            <ColorPicker label={"Secondary Color"} value="##2e8414" />
            <ColorPicker label={"Accent Color"} value={"#882626"} />
            <ColorPicker label={"Background Color"} value={"#882626"} />

          </Box>
        </Box>
        <Box mt={4} mb={2}>
          <Typography sx={{ fontSize: "25px", fontWidth: 500, mb: 1 }}>Light Mode</Typography>
          <Box display={"flex"} flexWrap={"wrap"} gap={2}>
            <ColorPicker label={"Primary Color"} value={"#882626"} />
            <ColorPicker label={"Secondary Color"} value="##07272d" />
            <ColorPicker label={"Accent Color"} value={"#882626"} />
            <ColorPicker label={"Background Color"} value={"##2e8414"} />

          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          py: 3,
          px: 3,
        }}
      >
        <Button variant="text" color={"inherit"}>
          Cancel
        </Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
}
