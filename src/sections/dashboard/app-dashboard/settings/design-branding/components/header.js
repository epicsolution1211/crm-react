import { Avatar, Box, Divider, Typography } from "@mui/material";

export function HeaderSection ({title, subtitle}) {
    return(
        <Box >
            <Box sx={{display:"flex" , gap:2 , alignItems:"center" , px:3, py:2}}>
                <Avatar />
                <Box>
                    <Typography variant="h6"> {title}</Typography>
                    <Typography variant="body2" color={"text.secondary"}>{subtitle}</Typography>
                </Box>
            </Box>
            <Divider />
        </Box>
    )
}