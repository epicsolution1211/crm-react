import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Iconify } from "./iconify";

export const TableNoData = ({ isSmall, label = "No results found", hideBorder = false }) => {
  return (  
    <Box
      sx={{
        py: isSmall ? 5 : 6,
        maxWidth: 1,
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        height: { xs: 250, md: 500 },
        borderBottom: hideBorder ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      <Iconify icon="solar:notebook-broken" sx={{ color: 'text.disabled', width: { xs: 50, md: 70 }, height: { xs: 50, md: 70 } }} />
      <Typography color="text.disabled" sx={{ mt: 1, fontWeight: 500, fontSize: { xs: 14, md: 16 } }} >
        {label}
      </Typography>
    </Box>
  );
};
