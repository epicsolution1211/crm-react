import { Box, Button, Divider, Typography } from "@mui/material";
import { HeaderSection } from "../../components/header";
import { ImageDropzone } from "./image-dropzone";


export function LoginSignupImageMain() {
    const handleImageUpload = (file, imageUrl) => {
        console.log("File:", file);
        console.log("Image URL:", imageUrl);
        // TODO: Upload to server or save to state/context
    };

    return (
        <Box width="100%">
            <HeaderSection
                title={"Login / Signup Background Image"}
                subtitle={
                    "Upload a custom background image for your login and signup pages."
                }
            />
            <Box px={3} pt={3}>
                <Typography variant="body1" color="text.Primary" align="start" mb={1} mt={1}>Dark Mode</Typography>
                <ImageDropzone
                />

            </Box>
            <Box px={3} pt={3} mb={2}>
                <Typography variant="body1" color="text.Primary" align="start" mb={1} mt={1}>Light Mode</Typography>
                <ImageDropzone
                />

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
    )
}