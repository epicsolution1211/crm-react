import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import numeral from 'numeral';
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import MiniChart from "src/components/mini-chart";

export const WalletItem = ({ item }) => {
  return (
    <Card>
      <CardContent
        sx={{ p: 0, "&:last-child": { pb: "15px" }, position: "relative" }}
      >
        <Box
          sx={{
            width: 1,
            height: 1,
            backgroundColor: "grey",
            position: "absolute",
            opacity: "0%",
            cursor: "pointer",
          }}
        ></Box>
        <Box sx={{ maxHeight: 200, overflow: "hidden" }}>
          <Box sx={{ my: "-1px", mx: "-1px" }}>
            <MiniChart height={200} symbol={item?.symbol} chartOnly={false} />
          </Box>
        </Box>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ mt: 2, px: "15px" }}
        >
          <Stack>
            <Typography fontWeight={600} fontSize={17}>
              <span sx={{ opacity: ".6" }}>{item?.label?.toUpperCase()}</span>
            </Typography>
            <Typography fontSize={15}>{numeral(item.tempValue).format('$0,0.00')}</Typography>
          </Stack>
          <IconButton>
            <Iconify icon="iconamoon:star" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};
