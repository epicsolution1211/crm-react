import styled from "@emotion/styled";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { fileToBase64 } from "src/utils/file-to-base64";

import { Iconify } from "src/components/iconify";
import { useState } from "react";
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function UploadLogo() {
    const [logo, setLogo] = useState(null);
    const [favicon, setFavicon] = useState(null);

    const handleLogoChange = async (event) => {
        const file = event.target.files[0];
        setLogo(await fileToBase64(file));
    };
    const handleFaviconChange = async (event) => {
        const file = event.target.files[0];
        setFavicon(await fileToBase64(file));
    };
    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "50% 50%"
        }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                <Box>
                    <Avatar
                        sx={{ width: 100, height: 100, backgroundColor: "#5D5D5D" }}
                        src={logo}>
                        <Iconify icon="simple-icons:feedly" width={60} color="#BDBDBD" />
                    </Avatar>
                </Box>
                <Box display={"grid"} gap={1.5}>
                    <Typography variant="subtitle1">Upload App Logo</Typography>
                    <Typography variant="caption" color={"text.secondary"}>512x512 for mobile devices and apps, PNG or JPEG</Typography>
                    <Box >
                        <Button variant="outlined" color={"inherit"} component="label" >Upload
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleLogoChange}
                                multiple
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                <Box>
                    <Avatar
                        sx={{ width: 100, height: 100, backgroundColor: "#5D5D5D" }}
                        src={favicon}
                    >
                        <Iconify icon="simple-icons:feedly" width={60} color="#BDBDBD" />
                    </Avatar>
                </Box>
                <Box display={"grid"} gap={1.5}>
                    <Typography variant="subtitle1">Favicon</Typography>
                    <Typography variant="caption" color={"text.secondary"}>32x32 for desktop browser tabs</Typography>
                    <Box >
                        <Button variant="outlined" color={"inherit"} component="label">
                            Upload
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFaviconChange}
                                multiple
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}