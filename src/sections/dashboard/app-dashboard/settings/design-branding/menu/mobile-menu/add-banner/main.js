import { Box } from "@mui/material";
import { AddBannerHeader } from "./header";
import { AddBannerForm } from "./form";

export function AddBannerMain() {
    return (
        <Box>
            <AddBannerHeader />
            <Box sx={{ px: 3, py: 3 }}>

            <AddBannerForm />
            </Box>
        </Box>
    );
}