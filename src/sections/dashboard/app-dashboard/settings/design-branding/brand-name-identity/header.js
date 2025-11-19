import { Avatar, Box, Divider, Typography } from "@mui/material";

export function HeaderBrandNameIdentity (){
    return(
        <Box >
            <Box sx={{display:"flex" , gap:2 , alignItems:"center" , px:3, py:2}}>
                <Avatar />
                <Box>
                    <Typography variant="h6">Brand Name & Identity </Typography>
                    <Typography variant="body2" color={"text.secondary"}>If you’ve just made a payment, it may take a few hours for it to appear in the table below.</Typography>
                </Box>
            </Box>
            <Divider />
        </Box>
    )
}