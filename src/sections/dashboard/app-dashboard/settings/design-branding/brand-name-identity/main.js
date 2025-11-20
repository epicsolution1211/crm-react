import { Box, Button, Divider } from "@mui/material";
import { HeaderSection } from "../components/header";
import { UploadLogo } from "./upload-logo";
import { AppNameAndLanguage } from "./app-name-and-language";

export function MainBrandNameIdentity() {
  return (
    <Box>
      <HeaderSection
        title={"Brand Name & Identity"}
        subtitle={
          "If you’ve just made a payment, it may take a few hours for it to appear in the table below."
        }
      />
      <Box sx={{ px: 3, py: 3 }}>
        <UploadLogo />
      </Box>
      <Box sx={{ px: 3, py: 3, width: "100%" }}>
        <AppNameAndLanguage />
      </Box>
      <Divider  />
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",   
        gap: 2,
        py:3,
        px:3
      }}>
        <Button variant="text" color={"inherit"}>Cancel</Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
}
