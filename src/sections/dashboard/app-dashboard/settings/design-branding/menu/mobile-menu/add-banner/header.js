import { Box, Typography } from "@mui/material";

export function AddBannerHeader() {
    return (
        <Box sx={{ px: 3, py: 3 , display:"flex" , flexDirection:"column" , gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.5rem', }}>Customize App Left Side Menu Banner </Typography>
            <Typography variant="body2" sx={{ fontWeight: 300, fontSize: '1.1rem', color: 'text.secondary' }}>All the Lorem Ipsum generators on the Internet tend to repeat </Typography>
        </Box>
    );
}