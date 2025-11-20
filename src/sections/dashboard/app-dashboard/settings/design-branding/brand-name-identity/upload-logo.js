import { Avatar, Box, Button, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";

export function UploadLogo  () {
    return(
        <Box sx={{
            display:"grid",
            gridTemplateColumns:"50% 50%"
        }}>
            <Box sx={{display:"flex" , gap:3 , alignItems:"center"}}>
                <Box>
                    <Avatar sx={{ width: 100, height: 100, backgroundColor:"#5D5D5D" }} >
                        <Iconify icon="simple-icons:feedly" width={60} color="#BDBDBD"/>
                    </Avatar>
                </Box>
                <Box display={"grid"} gap={1.5}>
                    <Typography variant="subtitle1">Upload App Logo</Typography>
                    <Typography variant="caption" color={"text.secondary"}>512x512 for mobile devices and apps, PNG or JPEG</Typography>
                    <Box >
                        <Button variant="outlined" color={"inherit"}>Upload</Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{display:"flex" , gap:3 , alignItems:"center"}}>
                <Box>
                    <Avatar sx={{ width: 100, height: 100, backgroundColor:"#5D5D5D" }} >
                        <Iconify icon="simple-icons:feedly" width={60} color="#BDBDBD"/>
                    </Avatar>
                </Box>
                <Box display={"grid"} gap={1.5}>
                    <Typography variant="subtitle1">Favicon</Typography>
                    <Typography variant="caption" color={"text.secondary"}>32x32 for desktop browser tabs</Typography>
                    <Box >
                        <Button variant="outlined" color={"inherit"}>Upload</Button>
                    </Box>
                </Box>
            </Box>
            
        </Box>
    )
}